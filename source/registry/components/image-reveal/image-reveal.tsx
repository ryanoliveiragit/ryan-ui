"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw, TriangleAlert } from "lucide-react";
import styles from "./image-reveal.module.css";

export type ImageRevealStatus = "queued" | "generating" | "decoding" | "done" | "error";
export type ImageRevealSize = "sm" | "md" | "lg";

export interface ImageRevealProps {
  /** Final image URL. Cross-origin images work (pixels are never read back). Omit to cycle through sample photos. */
  src?: string;
  /** Alt text for the final image, used as the canvas label once done. Default: "Generated image". */
  alt?: string;
  /** Controlled state. Omit for auto mode, which runs queued, sampling over `duration`, decoding over `decodeDuration`, then done. Going straight from generating to done still plays the decode. Every change transitions smoothly. */
  status?: ImageRevealStatus;
  /** Controlled progress from 0 to 1 while generating, usually step / total. The canvas moves one denoising step at a time, like the real sampler. Omit to step at a constant rate over `duration`. */
  progress?: number;
  /** Milliseconds the sampling steps take when `progress` is not controlled. Default: 4600. */
  duration?: number;
  /** Milliseconds the tiled decode takes after the last step. Default: 560. */
  decodeDuration?: number;
  /** Sampling steps. Each is one visible denoising step, and the pill shows it as 18 / 30. Default: 30. */
  steps?: number;
  /** Width over height, as a number (1.5) or a CSS ratio ("4 / 5"). The image is cover-cropped to it. Default: 1. */
  aspectRatio?: number | string;
  /** Overlay scale and corner radius. "sm" (grids, thumbnails) shows only the ring and 18 / 30; "md" and "lg" add the Denoising label. Default: "md". */
  size?: ImageRevealSize;
  /** Any CSS color for the progress ring. Defaults to the accent. */
  color?: string;
  /** Shows the translucent progress pill. It fades out shortly after the image resolves. Default: true. */
  showProgress?: boolean;
  /** Plays one soft light sheen across the image when it resolves. Skipped with reduced motion. Default: true. */
  sheen?: boolean;
  /** Chip label while queued, such as "Queued, 2 ahead". Default: "Queued". */
  queueLabel?: string;
  /** Message in the error state. Default: "Generation failed". */
  errorMessage?: string;
  /** Shows a Retry button in the error state. */
  onRetry?: () => void;
  /** Called when the displayed status changes, including auto mode transitions. */
  onStatusChange?: (status: ImageRevealStatus) => void;
  /** Called once per run when the final image is fully resolved and crisp. */
  onComplete?: () => void;
  /** Auto mode only: starts generating on mount. Default: true. */
  autoPlay?: boolean;
  /** Auto mode only: after `holdDuration` the image blurs back out and generates again. Default: true. */
  loop?: boolean;
  /** Auto mode only: extra queue time in milliseconds before a run, for staggered grids. Default: 0. */
  startDelay?: number;
  /** Auto mode only: milliseconds in the queue before each run. Default: 900. */
  queueDuration?: number;
  /** Auto mode only: milliseconds the finished image holds before a loop restarts. Default: 2600. */
  holdDuration?: number;
  /** Auto mode only: change it to blur back out and run again (a Generate again button). */
  runKey?: string | number;
  /** Seeds the latent noise, so tiles in a batch differ and a replay of the same seed shows the same noise. Default: 1. */
  seed?: number;
  className?: string;
  style?: CSSProperties;
}

const TAU = Math.PI * 2;
const WIPE_MS = 220;
const NOISE_BLEND_MS = 35;

/** Sample photos for no-`src` auto mode (same-origin so the preview works offline). */
const SAMPLES: Array<{ src: string; alt: string }> = [
  { src: "/media/specials/cover-flow-yosemite.jpg", alt: "A granite dome over a still lake at golden hour" },
  { src: "/media/specials/cover-flow-lake-louise.jpg", alt: "A calm alpine lake ringed by pines" },
  { src: "/media/specials/cover-flow-seceda.jpg", alt: "Ridged hills under a warm evening sky" },
  { src: "/media/specials/cover-flow-iceland-canyon.jpg", alt: "A carved canyon in low light" },
];

/** Prediction chain widths in px: the model's guess sharpens along this ladder, blobs to shapes. */
const LINKS = [6, 9, 13, 19, 28, 42, 63, 96];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: number, salt: number) {
  let h = (seed >>> 0) ^ 0x9e3779b9;
  h = Math.imul(h ^ salt, 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0);
}

function gauss(rng: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (k: number) => k * k * (3 - 2 * k);

interface Cover {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

interface Engine {
  /** Internal phase; in controlled mode this mirrors the prop with the decode played in between. */
  phase: "wiping" | "queued" | "generating" | "decoding" | "done";
  phaseStart: number;
  t: number;
  lastStep: number;
  noise: HTMLCanvasElement | null;
  prevNoise: HTMLCanvasElement | null;
  noiseSwitchAt: number;
  chain: HTMLCanvasElement[];
  palette: Uint8ClampedArray | null;
  paletteW: number;
  paletteH: number;
  cover: Cover;
  imgReady: boolean;
  imgNaturalW: number;
  imgNaturalH: number;
  wipeFrom: HTMLCanvasElement | null;
  decodeBase: HTMLCanvasElement | null;
  sheenStart: number;
  sheenDone: boolean;
  completed: boolean;
  sampleIdx: number;
  runStartWall: number;
}

function makeEngine(sampleIdx: number): Engine {
  return {
    phase: "wiping",
    phaseStart: 0,
    t: 0,
    lastStep: -1,
    noise: null,
    prevNoise: null,
    noiseSwitchAt: 0,
    chain: [],
    palette: null,
    paletteW: 0,
    paletteH: 0,
    cover: { sx: 0, sy: 0, sw: 1, sh: 1 },
    imgReady: false,
    imgNaturalW: 0,
    imgNaturalH: 0,
    wipeFrom: null,
    decodeBase: null,
    sheenStart: -1,
    sheenDone: true,
    completed: false,
    sampleIdx,
    runStartWall: 0,
  };
}

function coverRect(naturalW: number, naturalH: number, targetAr: number): Cover {
  const srcAr = naturalW / naturalH;
  if (srcAr > targetAr) {
    const sw = naturalH * targetAr;
    return { sx: (naturalW - sw) / 2, sy: 0, sw, sh: naturalH };
  }
  const sh = naturalW / targetAr;
  return { sx: 0, sy: (naturalH - sh) / 2, sw: naturalW, sh };
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/** One latent noise frame for a sampling step: seeded per-cell color built on the image's own palette. */
function paintNoise(target: HTMLCanvasElement, cellsW: number, cellsH: number, palette: Uint8ClampedArray, palW: number, palH: number, rng: () => number) {
  const ctx = target.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(cellsW, cellsH);
  const d = img.data;
  for (let y = 0; y < cellsH; y++) {
    const py = Math.min(palH - 1, Math.floor((y / cellsH) * palH));
    for (let x = 0; x < cellsW; x++) {
      const px = Math.min(palW - 1, Math.floor((x / cellsW) * palW));
      const pi = (py * palW + px) * 4;
      const baseR = palette[pi] ?? 128;
      const baseG = palette[pi + 1] ?? 128;
      const baseB = palette[pi + 2] ?? 128;
      const g = gauss(rng);
      const v = clamp01(0.5 + g * 0.23) * 1.55;
      const o = (y * cellsW + x) * 4;
      d[o] = baseR * v;
      d[o + 1] = baseG * v;
      d[o + 2] = baseB * v;
      d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Static 1px film grain, tiled cheaply over every state. */
function makeGrain(): HTMLCanvasElement {
  const c = makeCanvas(160, 160);
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const img = ctx.createImageData(160, 160);
  const rng = mulberry32(1234);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 90 + rng() * 76;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 26;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

type Ui = { status: ImageRevealStatus; step: number; doneMs: number | null };

export function ImageReveal({
  src,
  alt = "Generated image",
  status,
  progress,
  duration = 4600,
  decodeDuration = 560,
  steps = 30,
  aspectRatio = 1,
  size = "md",
  color,
  showProgress = true,
  sheen = true,
  queueLabel = "Queued",
  errorMessage = "Generation failed",
  onRetry,
  onStatusChange,
  onComplete,
  autoPlay = true,
  loop = true,
  startDelay = 0,
  queueDuration = 900,
  holdDuration = 2600,
  runKey,
  seed = 1,
  className,
  style,
}: ImageRevealProps) {
  const reduced = useReducedMotion() ?? false;
  const auto = status === undefined;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const initialSampleRef = useRef((((seed - 1) % SAMPLES.length) + SAMPLES.length) % SAMPLES.length);
  const engRef = useRef<Engine>(makeEngine(initialSampleRef.current));
  const rafRef = useRef(0);
  const rafOnRef = useRef(false);
  const lastWallRef = useRef(0);
  const visibleRef = useRef(true);
  const cssRef = useRef({ w: 0, h: 0 });
  const surfaceRef = useRef("#1c1c1c");
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const lastUiRef = useRef<Ui | null>(null);
  const lastAnnouncedRef = useRef<ImageRevealStatus | null>(null);
  const lastCtrlStatusRef = useRef<ImageRevealStatus | null>(null);
  const loadUrlRef = useRef<(url: string, alt: string) => void>(() => {});
  const [ui, setUi] = useState<Ui>({ status: "queued", step: 0, doneMs: null });
  const [announce, setAnnounce] = useState("");
  const [pillHidden, setPillHidden] = useState(false);
  const cbRef = useRef({ onStatusChange, onComplete, onRetry });
  cbRef.current = { onStatusChange, onComplete, onRetry };
  const propsRef = useRef({ auto, status, progress, duration, decodeDuration, steps, startDelay, queueDuration, holdDuration, loop, autoPlay, seed, src, alt, sheen, reduced, queueLabel, errorMessage });
  propsRef.current = { auto, status, progress, duration, decodeDuration, steps, startDelay, queueDuration, holdDuration, loop, autoPlay, seed, src, alt, sheen, reduced, queueLabel, errorMessage };

  const aspectValue = (() => {
    if (typeof aspectRatio === "number") return aspectRatio || 1;
    const parts = aspectRatio.split("/").map((x) => Number.parseFloat(x));
    const a = parts[0] ?? NaN;
    const b = parts[1] ?? 1;
    return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : 1;
  })();

  const displayedStatus = useCallback((): ImageRevealStatus => {
    const eng = engRef.current;
    const p = propsRef.current;
    if (p.auto) {
      switch (eng.phase) {
        case "wiping":
          return "queued";
        case "queued":
          return "queued";
        case "generating":
          return "generating";
        case "decoding":
          return "decoding";
        case "done":
          return "done";
      }
    }
    if (p.status === "done" && eng.phase === "decoding") return "decoding";
    return p.status ?? "queued";
  }, []);

  const progressOf = useCallback((s: ImageRevealStatus): number => {
    const eng = engRef.current;
    const p = propsRef.current;
    if (s !== "generating") return s === "done" || s === "decoding" ? 1 : 0;
    if (!p.auto && typeof p.progress === "number") return clamp01(p.progress);
    const e = eng.t - eng.phaseStart;
    return p.duration > 0 ? clamp01(e / p.duration) : 1;
  }, []);

  const announceFor = useCallback((s: ImageRevealStatus) => {
    if (lastAnnouncedRef.current === s) return;
    lastAnnouncedRef.current = s;
    const p = propsRef.current;
    if (s === "queued") setAnnounce(p.queueLabel);
    else if (s === "generating") setAnnounce(p.auto ? "Generating image, simulated" : "Generating image");
    else if (s === "done") setAnnounce("Image ready");
    else if (s === "error") setAnnounce(p.errorMessage);
  }, []);

  const pushUi = useCallback((next: Ui) => {
    const last = lastUiRef.current;
    if (last && last.status === next.status && last.step === next.step && last.doneMs === next.doneMs) return;
    lastUiRef.current = next;
    setUi(next);
  }, []);

  /** Build the prediction chain + palette from a freshly decoded image. */
  const buildFromImage = useCallback((img: HTMLImageElement) => {
    const eng = engRef.current;
    eng.imgNaturalW = img.naturalWidth;
    eng.imgNaturalH = img.naturalHeight;
    eng.cover = coverRect(img.naturalWidth, img.naturalHeight, aspectValue);

    const palW = 48;
    const palH = 48;
    const pal = makeCanvas(palW, palH);
    const pctx = pal.getContext("2d");
    if (pctx) {
      const c = coverRect(img.naturalWidth, img.naturalHeight, palW / palH);
      pctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, palW, palH);
      eng.palette = pctx.getImageData(0, 0, palW, palH).data;
      eng.paletteW = palW;
      eng.paletteH = palH;
    }

    const chain: HTMLCanvasElement[] = [];
    for (const w of LINKS) {
      const h = Math.max(2, Math.round(w / aspectValue));
      const c = makeCanvas(w, h);
      const ctx = c.getContext("2d");
      if (ctx) {
        const cr = coverRect(img.naturalWidth, img.naturalHeight, w / h);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, cr.sx, cr.sy, cr.sw, cr.sh, 0, 0, w, h);
      }
      chain.push(c);
    }
    eng.chain = chain;
    eng.imgReady = true;
  }, [aspectValue]);

  const resetRun = useCallback((fromSnapshot: boolean) => {
    const eng = engRef.current;
    const canvas = canvasRef.current;
    if (fromSnapshot && canvas && canvas.width > 0) {
      const snap = makeCanvas(canvas.width, canvas.height);
      snap.getContext("2d")?.drawImage(canvas, 0, 0);
      eng.wipeFrom = snap;
    } else {
      eng.wipeFrom = null;
    }
    eng.phase = "wiping";
    eng.phaseStart = eng.t;
    eng.lastStep = -1;
    eng.noise = null;
    eng.prevNoise = null;
    eng.sheenStart = -1;
    eng.sheenDone = !propsRef.current.sheen || propsRef.current.reduced;
    eng.decodeBase = null;
    eng.completed = false;
    setPillHidden(false);
    wakeRef.current();
  }, []);

  const wakeRef = useRef<() => void>(() => {});

  /** Freeze the current canvas frame as the underlayer, then enter the tiled decode. */
  const startDecode = useCallback((eng: Engine) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.width > 0) {
      const snap = makeCanvas(canvas.width, canvas.height);
      snap.getContext("2d")?.drawImage(canvas, 0, 0);
      eng.decodeBase = snap;
    }
    eng.phase = "decoding";
    eng.phaseStart = eng.t;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const eng = engRef.current;
    const p = propsRef.current;
    const { w, h } = cssRef.current;
    if (w < 4 || h < 4) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = surfaceRef.current;
    ctx.fillRect(0, 0, w, h);

    const grain = grainRef.current;
    const drawGrain = (alpha: number) => {
      if (!grain) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const pat = ctx.createPattern(grain, "repeat");
      if (pat) {
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    };

    const s = displayedStatus();

    if (s === "error") {
      // Keep whatever last rendered underneath the calm dim overlay.
      drawImageLayer(eng, ctx, w, h, 1, 1);
      return;
    }

    if (eng.phase === "wiping" && eng.wipeFrom) {
      ctx.drawImage(eng.wipeFrom, 0, 0, w, h);
      const k = smooth(clamp01((eng.t - eng.phaseStart) / WIPE_MS));
      ctx.globalAlpha = k;
      ctx.fillStyle = surfaceRef.current;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      drawGrain(0.5 * (1 - k));
      return;
    }

    if (s === "queued" || !eng.imgReady) {
      drawGrain(0.5);
      return;
    }

    if (s === "generating") {
      const u = progressOf(s);
      drawImageLayer(eng, ctx, w, h, u, 1);
      drawNoiseLayer(eng, ctx, w, h, u, p.steps, p.reduced);
      drawGrain(0.35);
      return;
    }

    if (s === "decoding") {
      const e = eng.t - eng.phaseStart;
      if (p.reduced) {
        // Single crossfade from the frozen last frame instead of tiles.
        if (eng.decodeBase) {
          ctx.drawImage(eng.decodeBase, 0, 0, w, h);
        } else {
          drawImageLayer(eng, ctx, w, h, 1, 0);
        }
        const k = smooth(clamp01(e / 240));
        ctx.globalAlpha = k;
        ctx.drawImage(imgRef.current as HTMLImageElement, eng.cover.sx, eng.cover.sy, eng.cover.sw, eng.cover.sh, 0, 0, w, h);
        ctx.globalAlpha = 1;
      } else {
        // The last generating frame stays underneath while the tiles resolve.
        if (eng.decodeBase) {
          ctx.drawImage(eng.decodeBase, 0, 0, w, h);
        } else {
          drawImageLayer(eng, ctx, w, h, 1, 1);
        }
        const cols = Math.max(2, Math.min(10, Math.round(w / 64)));
        const rows = Math.max(2, Math.min(10, Math.round(h / 64)));
        const n = cols * rows;
        const cw = w / cols;
        const ch = h / rows;
        const c = eng.cover;
        for (let i = 0; i < n; i++) {
          const r = Math.floor(i / cols);
          const q = i % cols;
          const win = 0.75 + (i / n) * 0.25;
          const a = smooth(clamp01((e - win * p.decodeDuration * 0.62) / (p.decodeDuration * 0.38)));
          if (a <= 0) continue;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.rect(q * cw, r * ch, cw + 1, ch + 1);
          ctx.clip();
          const sx = c.sx + (q / cols) * c.sw;
          const sy = c.sy + (r / rows) * c.sh;
          ctx.drawImage(imgRef.current as HTMLImageElement, sx, sy, c.sw / cols, c.sh / rows, q * cw, r * ch, cw + 1, ch + 1);
          ctx.restore();
        }
      }
      drawGrain(0.12);
      return;
    }

    // done
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, eng.cover.sx, eng.cover.sy, eng.cover.sw, eng.cover.sh, 0, 0, w, h);
    }
    if (p.sheen && !p.reduced && !eng.sheenDone && eng.sheenStart >= 0) {
      const st = (eng.t - eng.sheenStart) / 1100;
      if (st >= 0 && st <= 1) {
        const bx = (-0.35 + st * 1.7) * w;
        const bw = w * 0.45;
        const grad = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, h * 0.35);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        ctx.globalCompositeOperation = "soft-light";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      } else {
        eng.sheenDone = true;
      }
    }
    drawGrain(0.06);
  }, [displayedStatus, progressOf]);

  // The prediction chain: crossfade adjacent links as u walks the ladder, blurred while low-res.
  const drawImageLayer = (eng: Engine, ctx: CanvasRenderingContext2D, w: number, h: number, u: number, extraBlur: number) => {
    const chain = eng.chain;
    if (chain.length === 0 || !imgRef.current) return;
    // Reduced motion parks the prediction at the softest link: one static frame, no travel, no blur drift.
    const still = propsRef.current.reduced;
    const pos = clamp01(still ? 0 : u) * (chain.length - 1);
    const k = Math.min(chain.length - 1, Math.floor(pos));
    const f = pos - k;
    const linkA = chain[k];
    const linkB = chain[k + 1];
    if (!linkA) return;
    const blurPx = still ? 0 : ((1 - clamp01(u)) * 9 + extraBlur) * (u < 0.98 ? 1 : 0);
    if (blurPx > 0.4) ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    ctx.drawImage(linkA, 0, 0, w, h);
    if (linkB && f > 0.001) {
      ctx.globalAlpha = f;
      ctx.drawImage(linkB, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    ctx.filter = "none";
  };

  const drawNoiseLayer = (eng: Engine, ctx: CanvasRenderingContext2D, w: number, h: number, u: number, totalSteps: number, reducedMotion: boolean) => {
    const step = Math.min(totalSteps - 1, Math.floor(clamp01(u) * totalSteps));
    // Reduced motion keeps the very first noise frame for the whole run; only its fade-out moves.
    if (reducedMotion ? eng.noise === null : eng.lastStep !== step) {
      const cellsW = Math.max(8, Math.floor(w / 6));
      const cellsH = Math.max(8, Math.floor(h / 6));
      const fresh = makeCanvas(cellsW, cellsH);
      if (eng.palette) {
        paintNoise(fresh, cellsW, cellsH, eng.palette, eng.paletteW, eng.paletteH, mulberry32(hashSeed(propsRef.current.seed, step + 1)));
      }
      if (!reducedMotion && eng.noise) {
        eng.prevNoise = eng.noise;
        eng.noiseSwitchAt = eng.t;
      } else {
        eng.prevNoise = null;
      }
      eng.noise = fresh;
      eng.lastStep = step;
    }
    const noise = eng.noise;
    if (!noise) return;
    const alpha = Math.pow(1 - clamp01(u), 1.6) * 0.92 + 0.04;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = alpha;
    if (eng.prevNoise && !reducedMotion) {
      const k = clamp01((eng.t - eng.noiseSwitchAt) / NOISE_BLEND_MS);
      if (k < 1) ctx.drawImage(eng.prevNoise, 0, 0, w, h);
      ctx.globalAlpha = alpha * k;
    }
    ctx.drawImage(noise, 0, 0, w, h);
    ctx.restore();
  };

  const needsFrames = useCallback((): boolean => {
    const eng = engRef.current;
    const p = propsRef.current;
    if (!eng.imgReady) return false;
    const s = displayedStatus();
    if (s === "error") return false;
    if (s === "queued") return !!(p.auto && p.autoPlay);
    if (eng.phase === "wiping") return (eng.t - eng.phaseStart) < WIPE_MS;
    if (s === "generating") return true;
    if (s === "decoding") return (eng.t - eng.phaseStart) < Math.max(p.decodeDuration, 260);
    if (s === "done") {
      if (p.sheen && !p.reduced && !eng.sheenDone) return true;
      if (p.auto && p.loop) return (eng.t - eng.phaseStart) < p.holdDuration;
      return false;
    }
    return false;
  }, [displayedStatus]);

  const tick = useCallback((wall: number) => {
    const eng = engRef.current;
    const p = propsRef.current;
    const dt = Math.min(100, wall - lastWallRef.current || 16);
    lastWallRef.current = wall;
    eng.t += dt;

    const p2 = p;
    if (p2.auto && p2.autoPlay && eng.imgReady) {
      const e = eng.t - eng.phaseStart;
      if (eng.phase === "wiping" && e >= WIPE_MS) {
        eng.phase = "queued";
        eng.phaseStart = eng.t;
        if (!p2.src) {
          eng.sampleIdx = (eng.sampleIdx + 1) % SAMPLES.length;
          const next = SAMPLES[eng.sampleIdx];
          if (next) loadUrlRef.current(next.src, next.alt);
        }
      }
      if (eng.phase === "queued" && e >= p2.startDelay + p2.queueDuration) {
        eng.phase = "generating";
        eng.phaseStart = eng.t;
        eng.lastStep = -1;
        eng.runStartWall = wall;
      } else if (eng.phase === "generating" && e >= p2.duration) {
        startDecode(eng);
      } else if (eng.phase === "decoding" && e >= p2.decodeDuration) {
        eng.phase = "done";
        eng.phaseStart = eng.t;
        eng.sheenStart = eng.t;
        if (!eng.completed) {
          eng.completed = true;
          cbRef.current.onComplete?.();
        }
      } else if (eng.phase === "done" && p2.loop && e >= p2.holdDuration) {
        resetRunRef.current(true);
        return;
      }
    }

    // Controlled: react to status transitions, then settle timed phases.
    if (!p2.auto) {
      const e = eng.t - eng.phaseStart;
      const prev = lastCtrlStatusRef.current;
      if (prev !== p2.status) {
        lastCtrlStatusRef.current = p2.status ?? "queued";
        if (p2.status === "generating") {
          eng.phase = "generating";
          eng.phaseStart = eng.t;
          eng.lastStep = -1;
          eng.runStartWall = wall;
          eng.completed = false;
        } else if ((p2.status === "done" || p2.status === "decoding") && (eng.phase === "generating" || eng.phase === "queued" || eng.phase === "wiping")) {
          startDecode(eng);
        } else if (p2.status === "queued" && (eng.phase === "done" || eng.phase === "decoding" || eng.phase === "generating")) {
          const canvas = canvasRef.current;
          if (canvas && canvas.width > 0) {
            const snap = makeCanvas(canvas.width, canvas.height);
            snap.getContext("2d")?.drawImage(canvas, 0, 0);
            eng.wipeFrom = snap;
          }
          eng.phase = "wiping";
          eng.phaseStart = eng.t;
        }
      }
      if (p2.status === "done" && eng.phase === "decoding" && e >= p2.decodeDuration) {
        eng.phase = "done";
        eng.phaseStart = eng.t;
        eng.sheenStart = eng.t;
        if (!eng.completed) {
          eng.completed = true;
          cbRef.current.onComplete?.();
        }
      }
      if (p2.status === "queued" && eng.phase === "wiping" && e >= WIPE_MS) {
        eng.phase = "queued";
        eng.phaseStart = eng.t;
      }
    }

    const s = displayedStatus();
    announceFor(s);
    const doneMs = s === "done" ? Math.max(0, Math.round((wall - eng.runStartWall))) : null;
    pushUi({ status: s, step: s === "generating" ? Math.max(1, Math.min(p2.steps, Math.floor(progressOf(s) * p2.steps))) : 0, doneMs });
    onStatusRef.current(s);

    draw();
    if (visibleRef.current && needsFrames()) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafOnRef.current = false;
    }
  }, [announceFor, displayedStatus, draw, needsFrames, progressOf, pushUi]);

  const onStatusRef = useRef<(s: ImageRevealStatus) => void>(() => {});
  onStatusRef.current = (s: ImageRevealStatus) => {
    if (lastStatusEmitRef.current !== s) {
      lastStatusEmitRef.current = s;
      cbRef.current.onStatusChange?.(s);
    }
  };
  const lastStatusEmitRef = useRef<ImageRevealStatus | null>(null);
  const resetRunRef = useRef(resetRun);
  resetRunRef.current = resetRun;

  const wake = useCallback(() => {
    if (rafOnRef.current) return;
    if (!visibleRef.current) return;
    rafOnRef.current = true;
    lastWallRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  wakeRef.current = wake;

  // First run.
  useEffect(() => {
    grainRef.current = makeGrain();
    const eng = engRef.current;
    eng.phase = "queued";
    eng.phaseStart = 0;
    wake();
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafOnRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Surface color from the resolved theme.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const read = () => {
      const cs = getComputedStyle(root);
      surfaceRef.current = cs.backgroundColor || surfaceRef.current;
    };
    read();
    wake();
  }, [wake]);

  // Resize: keep the canvas at device pixel ratio.
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const fit = () => {
      const r = root.getBoundingClientRect();
      cssRef.current = { w: r.width, h: r.height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      engRef.current.lastStep = -1;
      wake();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => ro.disconnect();
  }, [wake]);

  // Load the image off the main thread before use; falls through samples when one 404s.
  useEffect(() => {
    const eng = engRef.current;
    let alive = true;
    const doLoad = (url: string, altText: string) => {
      eng.imgReady = false;
      eng.chain = [];
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.alt = altText;
      im.onload = () => {
        if (!alive) return;
        void im.decode().catch(() => {}).then(() => {
          if (!alive) return;
          imgRef.current = im;
          buildFromImage(im);
          wake();
        });
      };
      im.onerror = () => {
        if (!alive) return;
        if (!src) {
          const next = SAMPLES[(eng.sampleIdx + 1) % SAMPLES.length];
          if (next && next.src !== url) {
            eng.sampleIdx = (eng.sampleIdx + 1) % SAMPLES.length;
            doLoad(next.src, next.alt);
          }
        }
      };
      im.src = url;
    };
    const sample = SAMPLES[eng.sampleIdx];
    const url = src ?? sample?.src ?? "";
    doLoad(url, src ?? sample?.alt ?? "Generated image");
    loadUrlRef.current = (u, a) => {
      if (alive) doLoad(u, a);
    };
    return () => {
      alive = false;
    };
  }, [src, buildFromImage, wake]);

  // Photo swap or Generate again: blur back out, then run again.
  const firstKeyRef = useRef(true);
  useEffect(() => {
    if (firstKeyRef.current) {
      firstKeyRef.current = false;
      return;
    }
    const eng = engRef.current;
    if (eng.phase !== "queued" && eng.imgReady) resetRun(true);
    else wake();
  }, [runKey, resetRun, wake]);

  // A controlled prop change can arrive while the raf loop is parked.
  useEffect(() => {
    if (!auto) wake();
  }, [auto, status, progress, wake]);

  // Visibility + off-screen pause.
  useEffect(() => {
    const root = rootRef.current;
    const settle = () => {
      cancelAnimationFrame(rafRef.current);
      rafOnRef.current = false;
    };
    const setPaused = (paused: boolean) => {
      root?.setAttribute("data-paused", paused ? "true" : "false");
    };
    const onVis = () => {
      visibleRef.current = !document.hidden;
      setPaused(!visibleRef.current);
      if (visibleRef.current) wake();
      else settle();
    };
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | null = null;
    if (root) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          visibleRef.current = entry.isIntersecting;
          setPaused(!visibleRef.current);
          if (visibleRef.current) wake();
          else settle();
        },
        { threshold: 0 },
      );
      io.observe(root);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
      root?.removeAttribute("data-paused");
    };
  }, [wake]);

  // Fade the pill shortly after the image resolves.
  useEffect(() => {
    if (ui.status === "done") {
      const id = window.setTimeout(() => setPillHidden(true), 1400);
      return () => window.clearTimeout(id);
    }
    setPillHidden(false);
  }, [ui.status]);

  const s = ui.status;
  const ringColor = color;
  const label =
    s === "done" ? alt : s === "queued" ? queueLabel : s === "error" ? errorMessage : s === "decoding" ? "Decoding image" : "Generating image";

  const ringIcon = (
    <span className={styles.ringWrap} style={ringColor ? { color: ringColor } : undefined} aria-hidden>
      <svg className={styles.spin} width="11" height="11" viewBox="0 0 11 11" focusable="false">
        <circle cx="5.5" cy="5.5" r="4.4" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
        <path d="M5.5 1.1a4.4 4.4 0 0 1 4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );

  // Icon + label crossfade together when the status flips; the counter sits outside so it ticks in place.
  const pillIcon = s === "done" ? <Check size={11} strokeWidth={2.4} aria-hidden /> : s === "generating" || s === "decoding" ? ringIcon : null;
  const pillText = s === "queued" ? queueLabel : s === "generating" && size !== "sm" ? "Denoising" : s === "decoding" ? "Decoding" : null;
  const pillNum = s === "generating" ? `${ui.step} / ${steps}` : s === "done" && ui.doneMs !== null ? `${(ui.doneMs / 1000).toFixed(1)}s` : null;
  const pillVisible = s === "queued" || s === "generating" || s === "decoding" || (s === "done" && ui.doneMs !== null);

  return (
    <div
      ref={rootRef}
      role={s === "error" ? undefined : "img"}
      aria-label={label}
      aria-busy={s === "generating" || s === "decoding"}
      data-component="image-reveal"
      data-size={size}
      data-status={s}
      data-reduced={reduced || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ aspectRatio: typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio, ...style }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {s === "queued" && <div className={styles.shimmer} aria-hidden />}
      {showProgress && s !== "error" && (
        <div className={styles.pillWrap} role={s === "generating" || s === "decoding" ? "progressbar" : undefined} aria-valuemin={s === "generating" ? 0 : undefined} aria-valuemax={s === "generating" ? steps : undefined} aria-valuenow={s === "generating" ? ui.step : undefined} aria-valuetext={s === "generating" ? `Step ${ui.step} of ${steps}` : undefined}>
          <AnimatePresence initial={false}>
            {!pillHidden && pillVisible && (
              <motion.div
                className={styles.pill}
                initial={{ opacity: 0, y: 3, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -3, scale: 0.98, transition: { duration: 0.1 } }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={s === "generating" ? "generating" : s}
                    className={styles.pillRow}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: reduced ? 0 : 0.16, delay: 0.06 }}
                  >
                    {pillIcon}
                    {pillText && <span>{pillText}</span>}
                  </motion.span>
                </AnimatePresence>
                {pillNum && <span className={s === "generating" ? styles.numStep : styles.num}>{pillNum}</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {s === "error" && (
          <motion.div
            key="err"
            className={styles.err}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <span className={styles.errMsg}>
              <TriangleAlert size={14} aria-hidden />
              {errorMessage}
            </span>
            {onRetry && (
              <button type="button" className={styles.retry} onClick={onRetry}>
                <RotateCcw size={12} aria-hidden />
                Retry
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.srOnly} role="status" aria-live="polite">
        {announce}
      </div>
    </div>
  );
}
