"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion-tokens";
import styles from "./ai-spark.module.css";

export type AiSparkStatus = "idle" | "thinking" | "generating" | "done" | "error";
export type AiSparkTone = "accent" | "foreground" | "muted" | "inherit";

export interface AiSparkProps {
  /** What the AI is doing. Leave unset and the spark self-plays idle → thinking → generating → done (demos only). */
  status?: AiSparkStatus;
  /** Size in px, or any CSS length such as "1em" to match surrounding text. Defaults: 24 (32 for the avatar tile, 16 for the mark inside the pill). */
  size?: number | string;
  tone?: AiSparkTone;
  /** Any CSS color, overriding tone. */
  color?: string;
  variant?: "mark" | "pill" | "avatar";
  /** Pill text, overriding the built-in label for the current status, e.g. "Reading 12 files". */
  label?: string;
  /** Multiplies every loop and spin speed. */
  speed?: number;
  /** A slow breathing twinkle while idle. Off = a fully still idle mark. */
  twinkle?: boolean;
  /** Freezes the animation in place; resuming continues from the same phase. */
  paused?: boolean;
  /** Announce status changes through a polite live region. Off for decorative copies so only one spark speaks (role="img" instead). */
  announce?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

const RAYS = 8;
const TAU = Math.PI * 2;
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Smooth periodic bell: peaks at integer x, width w. */
const crest = (x: number, w: number) => {
  const u = mod(x + 0.5, 1) - 0.5;
  return Math.exp(-(u * u) / (2 * w * w));
};

/** Lub-dub heartbeat, period 1 in x. */
const heartbeat = (x: number) => Math.min(1, crest(x, 0.075) + 0.55 * crest(x - 0.22, 0.075));

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

/** Per-status blend durations, inside the documented 420–560ms window. */
const BLEND_MS: Record<AiSparkStatus, number> = { idle: 420, thinking: 480, generating: 480, done: 560, error: 420 };
const REDUCED_BLEND_MS = 200;

const BUILTIN_LABEL: Record<AiSparkStatus, string> = {
  idle: "Ready",
  thinking: "Thinking",
  generating: "Writing",
  done: "Done",
  error: "Couldn't finish",
};

const PHRASE: Record<AiSparkStatus, string> = {
  idle: "AI is ready",
  thinking: "AI is thinking",
  generating: "AI is writing",
  done: "Done",
  error: "Couldn't finish",
};

const SELF_PLAY: Array<[AiSparkStatus, number]> = [
  ["idle", 1800],
  ["thinking", 2600],
  ["generating", 3200],
  ["done", 2200],
];

/** Resting extension per ray index (even = primary axis). */
const restExt = (i: number) => (i % 2 === 0 ? 0.95 : 0.88);

interface Pose {
  ext: Float64Array; // per-ray extension scale
  core: number; // core radius factor
}

/**
 * The pose for a status at virtual time t. Pure function of time and position around the
 * ring, so idle/thinking/generating loop with no seam. td is time since the status was
 * entered (drives the one-shot gather); staticPose freezes the pattern for reduced motion.
 */
function poseFor(status: AiSparkStatus, t: number, td: number, twinkle: boolean, staticPose: boolean): Pose {
  const ext = new Float64Array(RAYS);
  let core = 1;

  if (status === "idle") {
    const breath = staticPose || !twinkle ? 1 : 1 + 0.03 * Math.sin((TAU * t) / 6.4);
    for (let i = 0; i < RAYS; i++) {
      if (i % 2 === 0) ext[i] = 0.95 * breath;
      else ext[i] = staticPose ? 0.88 : 0.9 + 0.07 * crest(t / 6.4 - ((i - 1) / 2) * 0.25, 0.09);
    }
  } else if (status === "thinking") {
    let peak = 0;
    for (let i = 0; i < RAYS; i++) {
      const c = staticPose ? Math.exp(-((i - 3) ** 2) / 2.4) : crest(t / 1.9 - i / RAYS, 0.13);
      ext[i] = 0.86 + 0.16 * c;
      peak = Math.max(peak, c);
    }
    core = 1 + 0.1 * peak;
  } else if (status === "generating") {
    const p = t / 1.04;
    for (let i = 0; i < RAYS; i++) {
      ext[i] = i % 2 === 0 ? 0.84 + 0.22 * heartbeat(p - (i / 2) * 0.25) : 0.84 + 0.13 * heartbeat(p - ((i - 1) / 2) * 0.25 - 0.125);
    }
    core = 1 + 0.08 * heartbeat(p);
    if (staticPose) {
      for (let i = 0; i < RAYS; i++) ext[i] = 0.99;
      core = 1.04;
    }
  } else if (status === "done") {
    // Gather toward the center in 170ms, ease back over 510ms with no overshoot.
    for (let i = 0; i < RAYS; i++) {
      let f = 1;
      if (!staticPose && td < 0.75) f = td < 0.17 ? 1 - 0.26 * easeOut(td / 0.17) : 0.74 + 0.26 * easeInOut(Math.min(1, (td - 0.17) / 0.51));
      ext[i] = restExt(i) * f;
    }
    if (!staticPose && td <= 0.75) core = 1 - 0.2 * Math.sin(Math.min(1, td / 0.75) * Math.PI);
  } else {
    for (let i = 0; i < RAYS; i++) ext[i] = i % 2 === 0 ? 0.7 : 0.56;
    core = 0.8;
  }

  return { ext, core };
}

/** Tapered ray pointing up, centred on the origin. Rounded tip, soft base arc. */
const rayPath = (len: number, base: number, half: number) =>
  `M 0 ${-len} Q ${(half * 0.55).toFixed(2)} ${(-len + 5.6).toFixed(2)} ${half.toFixed(2)} ${-base} Q 0 ${(-base + 4.8).toFixed(2)} ${(-half).toFixed(2)} ${-base} Q ${(-half * 0.55).toFixed(2)} ${(-len + 5.6).toFixed(2)} 0 ${-len} Z`;

export function AiSpark({
  status,
  size,
  tone = "accent",
  color,
  variant = "mark",
  label,
  speed = 1,
  twinkle = true,
  paused = false,
  announce = true,
  "aria-label": ariaLabel,
  className,
  style,
}: AiSparkProps) {
  const reduced = useReducedMotion() ?? false;
  const [selfIdx, setSelfIdx] = useState(0);
  const active: AiSparkStatus = status ?? SELF_PLAY[selfIdx]?.[0] ?? "idle";

  const isMark = variant === "mark";
  const defaultSize = variant === "avatar" ? 32 : variant === "pill" ? 16 : 24;
  const boxSize = size ?? defaultSize;

  const rootRef = useRef<HTMLSpanElement>(null);
  const markBoxRef = useRef<HTMLSpanElement>(null);
  const [markPx, setMarkPx] = useState(() => (typeof boxSize === "number" && variant !== "avatar" ? boxSize : 0));

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const coreRef = useRef<SVGCircleElement | null>(null);
  const ringRef = useRef<SVGGElement | null>(null);
  const shakeRef = useRef<SVGGElement | null>(null);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Continuous animation state — React never re-renders per frame.
  const curRef = useRef<Float64Array | null>(null); // last rendered [8 extensions, core factor]
  const fromRef = useRef<Float64Array | null>(null); // blend origin snapshot
  const blendStartRef = useRef(0);
  const blendDurRef = useRef(BLEND_MS[active]);
  const tRef = useRef(0); // virtual clock, stops while paused
  const enteredAtRef = useRef(0);
  const angleRef = useRef(0);
  const doneStartRef = useRef(0);
  const doneHomeRef = useRef(0);
  const speedRef = useRef(speed);
  const statusRef = useRef(active);
  const twinkleRef = useRef(twinkle);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);

  speedRef.current = speed;
  twinkleRef.current = twinkle;

  const dots = markPx > 0 && markPx < 18;
  const heavy = markPx > 0 && markPx < 24;
  const showParticles = !reduced && markPx >= 40;

  const geo = useMemo(() => {
    const bw = heavy ? 7.2 : 5.6;
    return { primary: rayPath(48, 16, bw), diag: rayPath(32, 16, bw * 0.8), coreBase: heavy ? 4.6 : 4, dotR: 4.4 };
  }, [heavy]);

  const angles = useMemo(() => Array.from({ length: RAYS }, (_, i) => i * 45 - 90), []);

  // Measure the rendered mark box so hinting applies to CSS lengths too (e.g. "1em").
  useEffect(() => {
    const el = markBoxRef.current;
    if (!el) return;
    const measure = () =>
      setMarkPx((prev) => {
        const next = el.offsetWidth || prev;
        return Math.abs(next - prev) < 0.5 ? prev : next;
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [variant]);

  // Self-play: only while status is left unset.
  useEffect(() => {
    if (status !== undefined || paused) return;
    const id = window.setTimeout(() => setSelfIdx((i) => (i + 1) % SELF_PLAY.length), SELF_PLAY[selfIdx]?.[1] ?? 2000);
    return () => window.clearTimeout(id);
  }, [status, selfIdx, paused]);

  // Status entry: snapshot the rendered pose as the blend origin, set the done glide target.
  useEffect(() => {
    statusRef.current = active;
    enteredAtRef.current = tRef.current;
    if (curRef.current) fromRef.current = curRef.current.slice();
    blendStartRef.current = performance.now();
    blendDurRef.current = reduced ? REDUCED_BLEND_MS : BLEND_MS[active];
    if (active === "done") {
      doneStartRef.current = angleRef.current;
      doneHomeRef.current = Math.round(angleRef.current / 90) * 90;
    }
  }, [active, reduced]);

  const writeFrame = (pose: Pose, now: number) => {
    const cur = (curRef.current ??= new Float64Array(RAYS + 1));
    const from = fromRef.current;

    // Blend over 420–560ms from wherever the mark already is.
    let e = 1;
    if (from) {
      const k = Math.min(1, (now - blendStartRef.current) / blendDurRef.current);
      if (k >= 1) fromRef.current = null;
      e = easeInOut(k);
    }
    for (let i = 0; i <= RAYS; i++) {
      const tv = (i < RAYS ? pose.ext[i] : pose.core) ?? 1;
      const fv = from ? from[i] : undefined;
      const v = fv === undefined ? tv : fv + (tv - fv) * e;
      cur[i] = v;
      if (i < RAYS) pathRefs.current[i]?.setAttribute("transform", `scale(${v.toFixed(4)})`);
      else coreRef.current?.setAttribute("r", (geo.coreBase * v).toFixed(3));
    }

    ringRef.current?.setAttribute("transform", `rotate(${angleRef.current.toFixed(3)} 50 50)`);

    // Error: one small decaying shake; always finishes smoothly.
    const sd = tRef.current - enteredAtRef.current;
    if (statusRef.current === "error") {
      const env = sd > 0.46 ? 0 : Math.exp(-sd / 0.09);
      const dx = 2.6 * env * Math.sin(TAU * 8 * sd);
      const dy = 1.2 * env * Math.sin(TAU * 7.1 * sd + 1.3);
      const dr = 1.8 * env * Math.sin(TAU * 6.3 * sd);
      shakeRef.current?.setAttribute("transform", env ? `translate(${dx.toFixed(3)} ${dy.toFixed(3)}) rotate(${dr.toFixed(3)} 50 50)` : "");
    } else {
      shakeRef.current?.setAttribute("transform", "");
    }

    // Two particles orbit just outside the rays, generating only and 40px+.
    for (let p = 0; p < 2; p++) {
      const el = particleRefs.current[p];
      if (!el) continue;
      if (statusRef.current === "generating" && showParticles && !reduced) {
        const a = (angleRef.current * Math.PI) / 180 * 1.4 + p * Math.PI * 0.9;
        el.setAttribute("cx", (50 + 51 * Math.cos(a)).toFixed(2));
        el.setAttribute("cy", (50 + 51 * Math.sin(a)).toFixed(2));
        el.setAttribute("opacity", (0.2 + 0.5 * heartbeat(tRef.current / 1.04)).toFixed(3));
      } else {
        el.setAttribute("opacity", "0");
      }
    }
  };

  const needsLoop = (now: number) => {
    if (paused || !visibleRef.current || document.hidden) return false;
    const st = statusRef.current;
    const td = tRef.current - enteredAtRef.current;
    const blendActive = now - blendStartRef.current < blendDurRef.current + 80;
    if (reduced) return blendActive;
    if (blendActive) return true;
    if (st === "idle") return twinkleRef.current;
    if (st === "thinking" || st === "generating") return true;
    if (st === "done") return td < 0.75;
    if (st === "error") return td < 0.5;
    return false;
  };

  // One rAF loop per spark. Pauses off screen and hidden tabs; stops once a resting state settles.
  useEffect(() => {
    let last: number | null = null;
    const tick = (now: number) => {
      rafRef.current = 0;
      const dt = last === null ? 0 : Math.min(64, now - last) / 1000;
      last = now;
      if (!needsLoop(now)) {
        // Resting frame, then stop ticking entirely.
        const st = statusRef.current;
        const settled = reduced || (st === "idle" && !twinkleRef.current);
        if (st === "done" && !reduced) angleRef.current = doneHomeRef.current;
        const pose = poseFor(st, tRef.current, tRef.current - enteredAtRef.current, twinkleRef.current, settled);
        writeFrame(pose, now);
        return;
      }
      tRef.current += dt * speedRef.current;
      const st = statusRef.current;
      const td = tRef.current - enteredAtRef.current;
      const pose = poseFor(st, tRef.current, td, twinkleRef.current, reduced);
      if (!reduced) {
        if (st === "thinking") angleRef.current += 26 * dt * speedRef.current;
        else if (st === "generating") angleRef.current += 46 * dt * speedRef.current;
        else if (st === "done") {
          // Ease-out glide into the home angle; speed only falls.
          angleRef.current = doneHomeRef.current + (doneStartRef.current - doneHomeRef.current) * Math.exp(-td / 0.18);
        }
      }
      writeFrame(pose, now);
      rafRef.current = requestAnimationFrame(tick);
    };
    const ensure = () => {
      if (!rafRef.current && needsLoop(performance.now())) {
        last = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver((entries) => {
      visibleRef.current = entries.some((en) => en.isIntersecting);
      ensure();
    });
    if (rootRef.current) io.observe(rootRef.current);
    const onVis = () => ensure();
    document.addEventListener("visibilitychange", onVis);
    ensure();
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // Structural changes restart the loop cleanly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, twinkle, reduced, speed, showParticles, markPx]);

  // First paint without a flash: settle onto the current pose.
  useEffect(() => {
    if (!curRef.current) writeFrame(poseFor(statusRef.current, 0, 0, false, reduced), performance.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shownLabel = variant === "pill" ? (label ?? BUILTIN_LABEL[active]) : "";
  const name = ariaLabel ?? (variant === "pill" ? shownLabel : PHRASE[active]);
  const busy = active === "thinking" || active === "generating";

  const rootStyle: CSSProperties = { ...style };
  if (color) (rootStyle as Record<string, string>)["--spark-custom"] = color;
  if (variant === "pill" && typeof boxSize === "number") (rootStyle as Record<string, string>)["--spark-mark"] = `${boxSize}px`;
  if (isMark) {
    if (typeof boxSize === "number") rootStyle.width = rootStyle.height = boxSize;
    else rootStyle.width = rootStyle.height = boxSize;
  } else if (variant === "avatar") {
    rootStyle.width = rootStyle.height = boxSize;
  }

  const rootCls = [styles.root, className].filter(Boolean).join(" ");
  const rootData: Record<string, string> = {
    "data-tone": color ? "custom" : tone,
    ...(active === "error" ? { "data-error": "true" } : {}),
    ...(announce ? { role: "status", "aria-live": "polite" } : { role: "img", "aria-label": name }),
    ...(busy ? { "aria-busy": "true" } : {}),
  };

  const markSvg = (
    <svg viewBox="0 0 100 100" width={markPx || undefined} height={markPx || undefined} aria-hidden="true" focusable="false" className={styles.svg} style={{ display: "block", overflow: "visible", width: markPx ? undefined : "100%", height: markPx ? undefined : "100%" }}>
      <g ref={shakeRef}>
        <g ref={ringRef}>
          <g transform="translate(50 50)">
            {angles.map((a, i) => (
              <g key={a} transform={`rotate(${a})`}>
                {!dots || i % 2 === 0 ? (
                  <path
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    d={i % 2 === 0 ? geo.primary : geo.diag}
                    fill="currentColor"
                    className={i % 2 === 0 ? undefined : styles.diag}
                    transform="scale(0.9)"
                  />
                ) : (
                  <circle cx="0" cy="-24" r={geo.dotR} fill="currentColor" className={styles.diag} />
                )}
              </g>
            ))}
            <circle ref={coreRef} r={geo.coreBase} fill="currentColor" />
          </g>
        </g>
        <circle ref={(el) => { particleRefs.current[0] = el; }} r="2.4" fill="currentColor" opacity="0" />
        <circle ref={(el) => { particleRefs.current[1] = el; }} r="2.4" fill="currentColor" opacity="0" />
      </g>
    </svg>
  );

  const markSpan = (
    <span ref={markBoxRef} className={styles.mark}>
      {markSvg}
    </span>
  );

  if (variant === "pill") {
    return (
      <span {...rootData} ref={rootRef} className={`${rootCls} ${styles.pill}`} data-active={busy ? "true" : undefined} data-paused={paused ? "true" : undefined} style={rootStyle}>
        {markSpan}
        <motion.span className={styles.pillLabelWrap} layout transition={{ layout: motionTokens.spring.morph }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shownLabel}
              className={styles.pillLabel}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.enter }}
            >
              {shownLabel}
            </motion.span>
          </AnimatePresence>
        </motion.span>
        {announce ? <span className={styles.srOnly}>{name}</span> : null}
      </span>
    );
  }

  if (variant === "avatar") {
    return (
      <span {...rootData} ref={rootRef} className={`${rootCls} ${styles.avatar}`} style={rootStyle}>
        <span className={styles.avatarInner}>{markSpan}</span>
        {announce ? <span className={styles.srOnly}>{name}</span> : null}
      </span>
    );
  }

  return (
    <span {...rootData} ref={rootRef} className={rootCls} style={rootStyle}>
      {markSpan}
      {announce ? <span className={styles.srOnly}>{name}</span> : null}
    </span>
  );
}
