var e=`import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AiMascot, type MascotStatus } from "@/registry/components/ai-mascot/ai-mascot";
import { motionTokens } from "@/lib/motion-tokens";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./ai-mascot.module.css";

export const stage: DemoStage = { height: 480 };

const OPTIONS: Array<{ value: MascotStatus; label: string }> = [
  { value: "idle", label: "Idle" },
  { value: "listening", label: "Listening" },
  { value: "thinking", label: "Thinking" },
  { value: "writing", label: "Writing" },
  { value: "done", label: "Done" },
  { value: "error", label: "Error" },
];

/* Friendly captions under the mascot, crossfading between states. Only the idle line was legible in the
   reference shots; the rest follow the same voice. */
const PHRASES: Record<MascotStatus, string> = {
  idle: "I'm ready when you are",
  listening: "Listening to you",
  thinking: "Thinking things through",
  writing: "Writing as I go",
  done: "All wrapped up",
  error: "Something went wrong",
};

function StatusSelector({ value, onChange }: { value: MascotStatus; onChange: (next: MascotStatus) => void }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const idx = OPTIONS.findIndex((option) => option.value === value);
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (idx + 1) % OPTIONS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (idx - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = OPTIONS.length - 1;
    if (next < 0) return;
    const option = OPTIONS[next];
    if (!option) return;
    event.preventDefault();
    onChange(option.value);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label="Mascot status" className={styles.segmented} onKeyDown={onKeyDown}>
      {OPTIONS.map((option, i) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          ref={(el) => { refs.current[i] = el; }}
          tabIndex={value === option.value ? 0 : -1}
          onClick={() => onChange(option.value)}
          className={value === option.value ? \`\${styles.seg} \${styles.segActive}\` : styles.seg}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="1.5" width="3.2" height="11" rx="1.1" fill="currentColor" />
      <rect x="8.3" y="1.5" width="3.2" height="11" rx="1.1" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M4.2 2.4a1 1 0 0 1 1.5-.86l7.2 4.6a1 1 0 0 1 0 1.72l-7.2 4.6a1 1 0 0 1-1.5-.86V2.4Z" fill="currentColor" />
    </svg>
  );
}

export default function AiMascotDemo() {
  const [status, setStatus] = useState<MascotStatus>("listening");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion() ?? false;

  return (
    <Stack width={520} gap={1}>
      <div className={styles.card}>
        <div className={styles.zone}>
          <AiMascot status={status} size={140} tone="ink" name="Atlas" paused={paused} announce />
        </div>
        <div className={styles.captionRow}>
          <AiMascot status={status} size={20} color="var(--neutral-9)" eyeColor="var(--neutral-1)" followPointer={false} paused={paused} />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status}
              className={styles.captionWord}
              initial={{ opacity: 0, y: 5, color: "var(--foreground)" }}
              animate={{ opacity: 1, y: 0, color: "var(--text-secondary)" }}
              exit={{ opacity: 0, y: -5, color: "var(--text-muted)" }}
              transition={{ duration: reduced ? 0 : motionTokens.duration.fast, ease: motionTokens.ease.enter }}
            >
              {PHRASES[status]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className={styles.bar}>
          <StatusSelector value={status} onChange={setStatus} />
          <button type="button" className={styles.pauseButton} aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
            {paused ? <PlayIcon /> : <PauseIcon />}
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </Stack>
  );
}
`;export{e as default};