var e=`import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AiSpark } from "@/registry/components/ai-spark/ai-spark";
import type { AiSparkStatus } from "@/registry/components/ai-spark/ai-spark";
import { Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./ai-spark.module.css";

export const stage: DemoStage = { height: 540 };

const OPTIONS: Array<{ value: AiSparkStatus; label: string }> = [
  { value: "idle", label: "Idle" },
  { value: "thinking", label: "Thinking" },
  { value: "generating", label: "Writing" },
  { value: "done", label: "Done" },
  { value: "error", label: "Error" },
];

const SIZES = [12, 16, 20, 24, 32, 48];

function StatusSelector({ value, onChange }: { value: AiSparkStatus; onChange: (next: AiSparkStatus) => void }) {
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
    <div role="radiogroup" aria-label="Estado da IA" className={styles.segmented} onKeyDown={onKeyDown}>
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

export default function AiSparkDemo() {
  const [status, setStatus] = useState<AiSparkStatus>("thinking");
  const [paused, setPaused] = useState(false);

  return (
    <Stack width={560} gap={1}>
      <div className={styles.card}>
        <div className={styles.panel}>
          <div className={styles.hero}>
            <AiSpark status={status} size={64} tone="inherit" paused={paused} />
          </div>
          <div className={styles.controls}>
            <StatusSelector value={status} onChange={setStatus} />
            <button type="button" className={styles.textButton} aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
        <div className={styles.divider} role="separator" />
        <Row gap={2} wrap={false} className={styles.pillRow}>
          <AiSpark variant="avatar" size={28} status={status} tone="inherit" paused={paused} announce={false} />
          <AiSpark variant="pill" status={status} tone="inherit" paused={paused} announce={false} />
          <span className={styles.pushRight}>
            <AiSpark variant="pill" status={status} tone="inherit" paused={paused} announce={false} />
          </span>
        </Row>
        <div className={styles.divider} role="separator" />
        <div className={styles.ladder}>
          {SIZES.map((px) => (
            <div key={px} className={styles.rung}>
              <span className={styles.rungMark}>
                <AiSpark size={px} status="idle" twinkle={false} tone="inherit" announce={false} />
              </span>
              <span className={styles.sizeLabel}>{px}</span>
            </div>
          ))}
        </div>
      </div>
    </Stack>
  );
}
`;export{e as default};