"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./ai-mascot.module.css";

export type MascotStatus = "idle" | "listening" | "thinking" | "writing" | "done" | "error";
export type MascotTone = "accent" | "ink" | "soft";

export interface AiMascotProps {
  /** What the assistant is doing. Leave unset to play through every state on a loop (the docs demo). */
  status?: MascotStatus;
  /** Width and height in px, 24 (inline) to 160 (empty state). Below 56 a compact drawing takes over. Default: 96. */
  size?: number;
  /** Body color from the theme: accent with accent-foreground eyes, foreground ink with background eyes, or a muted surface with a 1px border and foreground eyes. */
  tone?: MascotTone;
  /** Any CSS color for the body. Overrides tone; the eyes become a dark mix of it unless eyeColor is set. */
  color?: string;
  /** Any CSS color for the eyes and brows. */
  eyeColor?: string;
  /** Eyes follow the pointer while it is over the mascot (true), anywhere on the page ("page", good for empty states) or never (false). Touch is ignored. */
  followPointer?: boolean | "page";
  /** Show the companion dot that floats, pulses, orbits, writes and becomes the done sparkle. Default: true. */
  companion?: boolean;
  /** The soft contact shadow and the writing line under the mascot. Drawn only at 56px and up. Default: true. */
  ground?: boolean;
  /** Freeze on the current frame. The mascot also pauses by itself off screen and in background tabs, and resumes without a jump. */
  paused?: boolean;
  /** Used in the accessible label, for example "Atlas, thinking". Default: "Assistant". */
  name?: string;
  /** Overrides the whole accessible label. */
  label?: string;
  /** Announce status changes in a polite live region. Turn it on for the one mascot that carries status, not for decorative copies. */
  announce?: boolean;
  /** Called when the self-playing loop (status unset) moves to the next state. */
  onStatusChange?: (status: MascotStatus) => void;
  /** Set --mascot-body, --mascot-eye, --mascot-dot, --mascot-shade or --mascot-ground here to restyle. */
  className?: string;
  style?: CSSProperties;
}

const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mod = (x: number, m: number) => ((x % m) + m) % m;
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

/** Every status change blends the old pose into the new one over 420ms, never a hard cut. */
const BLEND_MS = 420;

const SELF_PLAY: Array<[MascotStatus, number]> = [
  ["idle", 2800],
  ["listening", 2800],
  ["thinking", 3400],
  ["writing", 5200],
  ["done", 2600],
  ["error", 2600],
];

const STATUS_WORD: Record<MascotStatus, string> = {
  idle: "idle",
  listening: "listening",
  thinking: "thinking",
  writing: "writing",
  done: "done",
  error: "error",
};

const PHRASE: Record<MascotStatus, string> = {
  idle: "is ready",
  listening: "is listening",
  thinking: "is thinking",
  writing: "is writing",
  done: "is done",
  error: "hit an error",
};

/** States whose eyes keep their own gaze; pointer following yields to them (and is off under reduced motion). */
const OWN_GAZE: Record<MascotStatus, boolean> = { idle: false, listening: false, thinking: true, writing: true, done: true, error: true };
/** Critically damped eye spring time constant, in seconds: quick saccades idle, soft follow thinking, tight tracking writing. */
const GAZE_TAU: Record<MascotStatus, number> = { idle: 0.06, listening: 0.12, thinking: 0.18, writing: 0.09, done: 0.14, error: 0.1 };
const CAN_BLINK: Record<MascotStatus, boolean> = { idle: true, listening: true, thinking: true, writing: true, done: false, error: false };

interface Geo {
  bodyCx: number; bodyCy: number; bodyRx: number; bodyRy: number;
  shadeCy: number; shadeRx: number; shadeRy: number;
  eyeLX: number; eyeRX: number; eyeY: number; eyeW: number; eyeH: number; eyeRad: number;
  browD: string; browWidth: number;
  restX: number; restY: number; dotR: number;
  orbCx: number; orbCy: number; orbR: number;
  lineX0: number; lineX1: number; lineY: number; lineLen: number; lineWidth: number;
  groundY: number; groundRx: number; groundRy: number;
  sparkleR: number;
}

/** Below 56px the compact drawing frames the body tighter and enlarges eyes and dot so they stay legible at 24px. */
function geoFor(px: number): Geo {
  return px < 56
    ? {
        bodyCx: 60, bodyCy: 58, bodyRx: 40, bodyRy: 37,
        shadeCy: 70, shadeRx: 32, shadeRy: 19,
        eyeLX: 45.5, eyeRX: 74.5, eyeY: 54, eyeW: 11, eyeH: 19, eyeRad: 5.5,
        browD: "M 34 41 L 45.5 35.5 M 74.5 35.5 L 86 41", browWidth: 3.6,
        restX: 94, restY: 24, dotR: 6.4,
        orbCx: 60, orbCy: 56, orbR: 46,
        lineX0: 26, lineX1: 94, lineY: 101, lineLen: 68, lineWidth: 2.8,
        groundY: 102, groundRx: 30, groundRy: 5,
        sparkleR: 14,
      }
    : {
        bodyCx: 60, bodyCy: 61, bodyRx: 35, bodyRy: 31,
        shadeCy: 72, shadeRx: 27, shadeRy: 15,
        eyeLX: 47.5, eyeRX: 72.5, eyeY: 57, eyeW: 9, eyeH: 16, eyeRad: 4.5,
        browD: "M 37 47 L 47.5 42.5 M 72.5 42.5 L 83 47", browWidth: 3,
        restX: 89, restY: 29, dotR: 4.6,
        orbCx: 60, orbCy: 58, orbR: 41,
        lineX0: 30, lineX1: 90, lineY: 97, lineLen: 60, lineWidth: 2.4,
        groundY: 103, groundRx: 25, groundRy: 4.5,
        sparkleR: 11,
      };
}

/** Four-point star at unit scale (radius 10), drawn once and scaled per frame. */
const SPARK = "M 0 -10 L 2.4 -2.4 L 10 0 L 2.4 2.4 L 0 10 L -2.4 2.4 L -10 0 L -2.4 -2.4 Z";

interface Pose {
  floatY: number; leanX: number; breathY: number; tilt: number;
  eyeX: number; eyeY: number; eyeW: number; eyeH: number; browO: number;
  dotX: number; dotY: number; dotR: number; dotO: number; front: number; tint: number;
  shakeX: number; shakeY: number; shakeR: number;
  lineP: number; lineO: number; sparkleS: number; sparkleRot: number;
}

const POSE_KEYS: Array<keyof Pose> = [
  "floatY", "leanX", "breathY", "tilt",
  "eyeX", "eyeY", "eyeW", "eyeH", "browO",
  "dotX", "dotY", "dotR", "dotO", "front", "tint",
  "shakeX", "shakeY", "shakeR",
  "lineP", "lineO", "sparkleS", "sparkleRot",
];

const blendPose = (a: Pose, b: Pose, e: number): Pose => {
  const out = {} as Pose;
  for (const key of POSE_KEYS) out[key] = a[key] + (b[key] - a[key]) * e;
  return out;
};

/**
 * The pose for a status at virtual time t. Every channel is a continuous function of time (sums of slow sines,
 * an orbit angle, a writing cycle whose start and end meet at zero length), so loops never restart and have no
 * seam. td drives the one-shot done/error gestures; still freezes each state into its representative pose
 * (used for reduced motion, paused freezes and the first paint, which the loop eases out of over the blend).
 */
function poseFor(status: MascotStatus, t: number, td: number, g: Geo, still: boolean): Pose {
  if (still) td = Math.max(td, 1.2); // one-shots are complete in the still pose
  const run = still ? 0 : 1;
  const p: Pose = {
    floatY: 0, leanX: 0, breathY: 1, tilt: 0,
    eyeX: 0, eyeY: 0, eyeW: 1, eyeH: 1, browO: 0,
    dotX: g.restX, dotY: g.restY, dotR: g.dotR, dotO: 1, front: 1, tint: 0,
    shakeX: 0, shakeY: 0, shakeR: 0,
    lineP: 0, lineO: 0, sparkleS: 0, sparkleRot: 0,
  };

  if (status === "idle") {
    // Breathes, floats and glances around; the companion bobs on its own clock.
    p.floatY = -1.9 * run * Math.sin((TAU * t) / 5.6);
    p.breathY = 1 + 0.013 * run * Math.sin((TAU * t) / 4.1 + 0.8);
    p.eyeX = (2.5 * Math.sin((TAU * t) / 9.3) + 1.1 * Math.sin((TAU * t) / 3.7 + 1.4)) * run;
    p.eyeY = (0.9 * Math.sin((TAU * t) / 7.1 + 2.2) - 0.2) * run;
    p.dotX = g.restX + 1.8 * run * Math.sin((TAU * t) / 4.7 + 1);
    p.dotY = g.restY + 3 * run * Math.sin((TAU * t) / 3.2);
  } else if (status === "listening") {
    // Leans in with wider eyes; the dot pulses like a voice level.
    p.floatY = -2 - run * Math.sin((TAU * t) / 5.6);
    p.breathY = 1.02 + run * 0.012 * Math.sin((TAU * t) / 3.4);
    p.eyeW = 1.12; p.eyeH = 1.28; p.eyeY = 0.4;
    const lvl = still
      ? 0.55
      : clamp(
          0.55 * Math.abs(Math.sin(TAU * 1.25 * t)) * (0.7 + 0.3 * Math.sin(TAU * 0.43 * t + 1)) +
            0.3 * Math.abs(Math.sin(TAU * 2.7 * t + 0.6)),
          0, 1,
        );
    p.dotY = g.restY + run * 1.5 * Math.sin((TAU * t) / 2.1);
    p.dotR = g.dotR * (0.74 + 0.55 * lvl);
  } else if (status === "thinking") {
    // Tilts the head and looks up while the dot orbits it, passing behind and in front.
    p.floatY = -1.2 * run * Math.sin((TAU * t) / 5.6);
    p.breathY = 1 + run * 0.01 * Math.sin((TAU * t) / 4.4 + 2);
    p.tilt = still ? 7 : 5.5 + 2.5 * Math.sin((TAU * t) / 6.8 + 0.4);
    p.eyeX = 1.6; p.eyeY = -3.2; p.eyeW = 0.96; p.eyeH = 1.08;
    const th = still ? 0 : 1.9 * td;
    const c = Math.cos(th);
    p.dotX = g.orbCx + g.orbR * Math.sin(th);
    p.dotY = g.orbCy - g.orbR * c;
    // front = the top arc of the orbit; the layer switch happens at its ends, where the dot is clear of the body.
    p.front = c > 0 ? 1 : 0;
    // Crossing the crown in front, fade toward the eye color so it stays visible on the body.
    p.tint = c > 0 ? c * c : 0;
  } else if (status === "writing") {
    // Looks down and reads along the line the dot writes, then the pen lifts and returns. Cycle:
    // rest -> down to the line -> draw -> hold -> lift back to rest, so start and end meet.
    p.floatY = -0.9 * run * Math.sin((TAU * t) / 5.6);
    p.breathY = 1 + run * 0.008 * Math.sin((TAU * t) / 1.7);
    const wp = still ? 0.37 : mod(t / 4.2, 1);
    let penX: number; let penY: number; let lp: number; let lo: number;
    if (wp < 0.12) {
      const e = easeInOut(wp / 0.12);
      penX = lerp(g.restX, g.lineX0, e); penY = lerp(g.restY, g.lineY, e); lp = 0; lo = 0;
    } else if (wp < 0.62) {
      const e = easeInOut((wp - 0.12) / 0.5);
      penX = lerp(g.lineX0, g.lineX1, e); penY = g.lineY; lp = e; lo = 1;
    } else if (wp < 0.78) {
      penX = g.lineX1; penY = g.lineY; lp = 1; lo = 1;
    } else {
      const q = (wp - 0.78) / 0.22;
      const e = easeInOut(q);
      penX = lerp(g.lineX1, g.restX, e); penY = lerp(g.lineY, g.restY, e); lp = 1; lo = 1 - clamp(q / 0.7, 0, 1);
    }
    p.lineP = lp; p.lineO = lo;
    p.dotX = penX; p.dotY = penY; p.dotR = g.dotR * 0.94;
    p.eyeX = 3.4 * clamp((penX - g.bodyCx) / (g.lineLen / 2), -1, 1);
    p.eyeY = lerp(0.5, 3.4, (penY - g.restY) / (g.lineY - g.restY));
    p.eyeH = 0.9;
  } else if (status === "done") {
    // Squints happily as the dot shrinks and the sparkle grows in its place.
    p.floatY = -1.1 * run * Math.sin((TAU * t) / 5.6);
    const k1 = easeInOut(clamp(td / 0.16, 0, 1));
    const k2 = easeInOut(clamp((td - 0.22) / 0.3, 0, 1));
    p.eyeH = lerp(lerp(1, 0.05, k1), 0.34, k2); // through a closed line into the squint
    p.eyeW = lerp(1, 1.3, k2);
    p.eyeY = 1.2 * k2;
    p.dotR = g.dotR * (1 - easeOut(clamp(td / 0.4, 0, 1)));
    p.sparkleS = easeOut(clamp((td - 0.14) / 0.36, 0, 1));
    p.sparkleRot = 18 * p.sparkleS;
  } else {
    // Error shakes once, decaying to rest in about .7s, with worried brows.
    p.floatY = -0.6 * run * Math.sin((TAU * t) / 5.6);
    const env = td < 0.7 ? Math.exp(-td / 0.13) : 0;
    p.shakeX = 3.4 * env * Math.sin(TAU * 7.3 * td);
    p.shakeY = 1.3 * env * Math.sin(TAU * 5.9 * td + 0.9);
    p.shakeR = 2.2 * env * Math.sin(TAU * 4.7 * td + 0.4);
    p.browO = clamp(td / 0.14, 0, 1);
    p.eyeW = 0.92; p.eyeH = 1.18; p.eyeY = 0.4;
    p.dotO = 0.45;
  }

  return p;
}

export function AiMascot({
  status,
  size = 96,
  tone = "accent",
  color,
  eyeColor,
  followPointer = true,
  companion = true,
  ground = true,
  paused = false,
  name = "Assistant",
  label,
  announce = false,
  onStatusChange,
  className,
  style,
}: AiMascotProps) {
  const reduced = useReducedMotion() ?? false;
  const [selfIdx, setSelfIdx] = useState(0);
  const active: MascotStatus = status ?? SELF_PLAY[selfIdx]?.[0] ?? "idle";

  const g = useMemo(() => geoFor(size), [size]);
  const showGround = ground && size >= 56;

  const rootRef = useRef<HTMLSpanElement>(null);
  const shakeRef = useRef<SVGGElement | null>(null);
  const floatRef = useRef<SVGGElement | null>(null);
  const tiltRef = useRef<SVGGElement | null>(null);
  const bodyGRef = useRef<SVGGElement | null>(null);
  const groundRef = useRef<SVGEllipseElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const browRef = useRef<SVGPathElement | null>(null);
  const eyeLRef = useRef<SVGRectElement | null>(null);
  const eyeRRef = useRef<SVGRectElement | null>(null);
  const dotBackRef = useRef<SVGCircleElement | null>(null);
  const dotFrontRef = useRef<SVGCircleElement | null>(null);
  const dotTintRef = useRef<SVGCircleElement | null>(null);
  const sparkleRef = useRef<SVGGElement | null>(null);

  // Continuous animation state — React never re-renders per frame.
  const curRef = useRef<Pose | null>(null); // last displayed pose (blend origin for the next change)
  const fromRef = useRef<Pose | null>(null);
  const blendStartRef = useRef(0);
  const blendDurRef = useRef(BLEND_MS);
  const tRef = useRef(0); // virtual clock, stops while paused
  const enteredAtRef = useRef(0);
  const statusRef = useRef(active);
  const eyeCurRef = useRef({ x: 0, y: 0 }); // where the eyes are looking right now (spring state)
  const ptrRef = useRef({ x: 0, y: 0, on: false });
  const blinkRef = useRef({ first: -10, second: -10, next: 2.4 });
  const visibleRef = useRef(true);
  const rafRef = useRef(0);
  const onChangeRef = useRef(onStatusChange);
  onChangeRef.current = onStatusChange;
  const followRef = useRef(false);
  followRef.current = followPointer !== false && !reduced;

  // Self-play: only while status is left unset.
  useEffect(() => {
    if (status !== undefined || paused) return;
    const id = window.setTimeout(() => {
      const next = SELF_PLAY[(selfIdx + 1) % SELF_PLAY.length]?.[0] ?? "idle";
      onChangeRef.current?.(next);
      setSelfIdx((selfIdx + 1) % SELF_PLAY.length);
    }, SELF_PLAY[selfIdx]?.[1] ?? 2600);
    return () => window.clearTimeout(id);
  }, [status, selfIdx, paused]);

  // Pointer following: hover (true) or anywhere on the page ("page"). Touch is ignored.
  useEffect(() => {
    if (!followPointer || reduced) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        ptrRef.current.on = false;
        return;
      }
      ptrRef.current = { x: e.clientX, y: e.clientY, on: true };
    };
    const leave = () => {
      ptrRef.current.on = false;
    };
    const opts: AddEventListenerOptions = { passive: true };
    if (followPointer === "page") {
      document.addEventListener("pointermove", move, opts);
      document.addEventListener("pointerdown", move, opts);
      return () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerdown", move);
      };
    }
    const el = rootRef.current;
    if (!el) return;
    el.addEventListener("pointermove", move, opts);
    el.addEventListener("pointerdown", move, opts);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [followPointer, reduced]);

  const applyPose = (d: Pose, dt: number, blink: number) => {
    const st = statusRef.current;

    // Eyes ride a critically damped spring: quick saccades idle, soft follow thinking, tight tracking writing.
    let tx = d.eyeX;
    let ty = d.eyeY;
    if (followRef.current && !OWN_GAZE[st] && ptrRef.current.on) {
      const rect = rootRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const dx = ptrRef.current.x - (rect.left + rect.width / 2);
        const dy = ptrRef.current.y - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const f = (Math.min(dist / 110, 1) * 3.2) / dist;
        tx += dx * f;
        ty += dy * f;
      }
    }
    const ek = dt > 0 ? 1 - Math.exp(-dt / GAZE_TAU[st]) : 1;
    const ec = eyeCurRef.current;
    ec.x += (tx - ec.x) * ek;
    ec.y += (ty - ec.y) * ek;

    const f3 = (v: number) => v.toFixed(3);
    const sh = shakeRef.current;
    if (sh) {
      const mag = Math.abs(d.shakeX) + Math.abs(d.shakeY) + Math.abs(d.shakeR);
      sh.setAttribute("transform", mag > 0.001 ? `translate(${f3(d.shakeX)} ${f3(d.shakeY)}) rotate(${f3(d.shakeR)} 60 84)` : "");
    }
    floatRef.current?.setAttribute("transform", `translate(${f3(d.leanX)} ${f3(d.floatY)})`);
    tiltRef.current?.setAttribute("transform", d.tilt ? `rotate(${f3(d.tilt)} 60 80)` : "");
    bodyGRef.current?.setAttribute("transform", d.breathY !== 1
      ? `translate(${g.bodyCx} ${g.bodyCy}) scale(1 ${f3(d.breathY)}) translate(${-g.bodyCx} ${-g.bodyCy})`
      : "");

    if (groundRef.current) {
      // The contact shadow breathes opposite to the float: higher, smaller.
      const s = 1 + 0.05 * d.floatY;
      groundRef.current.setAttribute("transform", `translate(60 ${g.groundY}) scale(${f3(s)} 1) translate(-60 ${-g.groundY})`);
    }
    if (lineRef.current) {
      lineRef.current.setAttribute("stroke-dashoffset", (g.lineLen * (1 - d.lineP)).toFixed(2));
      lineRef.current.setAttribute("opacity", f3(d.lineO));
    }

    const eyeT = (anchor: number) =>
      `translate(${(anchor + ec.x).toFixed(2)} ${(g.eyeY + ec.y).toFixed(2)}) scale(${f3(d.eyeW)} ${f3(d.eyeH * blink)})`;
    eyeLRef.current?.setAttribute("transform", eyeT(g.eyeLX));
    eyeRRef.current?.setAttribute("transform", eyeT(g.eyeRX));
    browRef.current?.setAttribute("opacity", f3(d.browO));

    const setDot = (el: SVGCircleElement | null, o: number) => {
      if (!el) return;
      el.setAttribute("cx", d.dotX.toFixed(2));
      el.setAttribute("cy", d.dotY.toFixed(2));
      el.setAttribute("r", Math.max(0, d.dotR).toFixed(2));
      el.setAttribute("opacity", f3(o));
    };
    // The dot is drawn twice, behind and in front; during blends the two copies crossfade through front.
    setDot(dotBackRef.current, (1 - d.front) * d.dotO);
    setDot(dotFrontRef.current, d.front * d.dotO);
    setDot(dotTintRef.current, d.tint * d.front * d.dotO);

    const sp = sparkleRef.current;
    if (sp) {
      sp.setAttribute("transform", `translate(${g.restX} ${g.restY}) rotate(${f3(d.sparkleRot)}) scale(${((d.sparkleS * g.sparkleR) / 10).toFixed(4)})`);
      sp.setAttribute("opacity", d.sparkleS > 0.01 ? "1" : "0");
    }
  };

  // Blinks come every 2.4 to 5.2s, sometimes twice, and take 160ms. Scheduled on the virtual clock so a
  // pause freezes the schedule exactly where it was.
  const stepBlink = (): number => {
    if (!CAN_BLINK[statusRef.current]) return 1;
    const b = blinkRef.current;
    const t = tRef.current;
    if (t >= b.next) {
      b.first = t;
      b.second = Math.random() < 0.3 ? t + 0.28 : -10;
      b.next = t + 2.4 + Math.random() * 2.8;
    }
    let f = 0;
    if (t >= b.first && t < b.first + 0.16) f = Math.max(f, Math.sin(Math.PI * ((t - b.first) / 0.16)));
    if (t >= b.second && t < b.second + 0.16) f = Math.max(f, Math.sin(Math.PI * ((t - b.second) / 0.16)));
    return 1 - 0.96 * f;
  };

  /** Paint one frame with no animation state left on screen: eyes open, glance settled, springs at rest. */
  const paintStill = (pose: Pose) => {
    fromRef.current = null;
    curRef.current = pose;
    blinkRef.current.first = -10;
    blinkRef.current.second = -10;
    applyPose(pose, 0, 1);
  };

  // Status entry: snapshot what is on screen as the blend origin, then blend into the new pose over 420ms.
  // Under reduced motion or while paused there is no loop, so paint the still representative pose in place.
  useEffect(() => {
    statusRef.current = active;
    enteredAtRef.current = tRef.current;
    if (curRef.current) fromRef.current = { ...curRef.current };
    else {
      const still = poseFor(active, 0, 0, g, true);
      fromRef.current = still;
      curRef.current = still;
    }
    blendStartRef.current = performance.now();
    blendDurRef.current = BLEND_MS;
    if (reduced || paused) paintStill(poseFor(active, tRef.current, 0, g, true));
    else applyPose(curRef.current, 0, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced, paused]);

  const needsLoop = (now: number) => {
    if (paused || reduced || !visibleRef.current || document.hidden) return false;
    if (now - blendStartRef.current < blendDurRef.current + 80) return true;
    const td = tRef.current - enteredAtRef.current;
    const st = statusRef.current;
    if (st === "done") return td < 1.6;
    if (st === "error") return td < 0.8;
    return true;
  };

  // One rAF loop per mascot. Pauses off screen and in hidden tabs; the clock only runs while ticking, so a
  // resume lands on the same frame instead of jumping. Stops once a one-shot state has settled.
  useEffect(() => {
    let last: number | null = null;
    const tick = (now: number) => {
      rafRef.current = 0;
      const dt = last === null ? 0 : Math.min(64, now - last) / 1000;
      last = now;
      if (!needsLoop(now)) {
        const st = statusRef.current;
        paintStill(poseFor(st, tRef.current, tRef.current - enteredAtRef.current, g, st === "done" || st === "error"));
        return;
      }
      tRef.current += dt;
      const st = statusRef.current;
      const target = poseFor(st, tRef.current, tRef.current - enteredAtRef.current, g, false);
      let disp = target;
      if (fromRef.current) {
        const k = clamp((now - blendStartRef.current) / blendDurRef.current, 0, 1);
        if (k >= 1) fromRef.current = null;
        else disp = blendPose(fromRef.current, target, easeInOut(k));
      }
      curRef.current = disp;
      applyPose(disp, dt, stepBlink());
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
  }, [active, paused, reduced, g, followPointer, companion]);

  // A custom body color also recolors the eyes (a dark mix of it) and the companion, so a one-color mascot
  // stays monochrome; an explicit style={{"--mascot-*"}} always wins because it spreads last.
  const eyeComputed = eyeColor ?? (color ? `color-mix(in oklab, ${color} 35%, black)` : undefined);
  const rootStyle = {
    ...(color && eyeComputed ? { "--mascot-body": color, "--mascot-eye": eyeComputed, "--mascot-dot": eyeComputed } : null),
    width: size,
    height: size,
    ...style,
  } as CSSProperties & Record<`--${string}`, string | undefined>;

  const busy = active === "listening" || active === "thinking" || active === "writing";
  const rootData: Record<string, string> = {
    role: "img",
    "aria-label": label ?? `${name}, ${STATUS_WORD[active]}`,
    ...(busy ? { "aria-busy": "true" } : {}),
  };

  return (
    <span
      {...rootData}
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-tone={color ? "custom" : tone}
      data-paused={paused ? "true" : undefined}
      style={rootStyle}
    >
      <svg viewBox="0 0 120 120" className={styles.svg} aria-hidden="true" focusable="false">
        {showGround && <ellipse ref={groundRef} className={styles.ground} cx="60" cy={g.groundY} rx={g.groundRx} ry={g.groundRy} />}
        {showGround && companion && (
          <path ref={lineRef} className={styles.line} d={`M ${g.lineX0} ${g.lineY} H ${g.lineX1}`} strokeDasharray={g.lineLen} strokeDashoffset={g.lineLen} strokeWidth={g.lineWidth} opacity="0" />
        )}
        <g ref={shakeRef}>
          <g ref={floatRef}>
            <g ref={tiltRef}>
              {companion && <circle ref={dotBackRef} className={styles.dot} cx={g.restX} cy={g.restY} r={g.dotR} opacity="0" />}
              <g ref={bodyGRef}>
                <ellipse className={styles.body} cx={g.bodyCx} cy={g.bodyCy} rx={g.bodyRx} ry={g.bodyRy} />
                <ellipse className={styles.shade} cx={g.bodyCx} cy={g.shadeCy} rx={g.shadeRx} ry={g.shadeRy} />
                {companion && <circle ref={dotFrontRef} className={styles.dot} cx={g.restX} cy={g.restY} r={g.dotR} />}
                {companion && <circle ref={dotTintRef} className={styles.dotTint} cx={g.restX} cy={g.restY} r={g.dotR} opacity="0" />}
                <path ref={browRef} className={styles.brow} d={g.browD} strokeWidth={g.browWidth} opacity="0" />
                <rect ref={eyeLRef} className={styles.eye} x={-g.eyeW / 2} y={-g.eyeH / 2} width={g.eyeW} height={g.eyeH} rx={g.eyeRad} transform={`translate(${g.eyeLX} ${g.eyeY})`} />
                <rect ref={eyeRRef} className={styles.eye} x={-g.eyeW / 2} y={-g.eyeH / 2} width={g.eyeW} height={g.eyeH} rx={g.eyeRad} transform={`translate(${g.eyeRX} ${g.eyeY})`} />
              </g>
              {companion && (
                <g ref={sparkleRef} opacity="0">
                  <path className={styles.sparkle} d={SPARK} />
                </g>
              )}
            </g>
          </g>
        </g>
      </svg>
      {announce ? <span className={styles.srOnly}>{name} {PHRASE[active]}</span> : null}
    </span>
  );
}
