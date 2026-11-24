import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ImageReveal } from "@/registry/components/image-reveal/image-reveal";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./image-reveal.module.css";

export const stage: DemoStage = { height: 720 };

const TILES = [0, 1, 2, 3];

export default function ImageRevealDemo() {
  const [runKey, setRunKey] = useState(1);

  return (
    <Stack gap={3} width={564}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <h3 className={styles.title}>Quiet landscapes at golden hour</h3>
            <p className={styles.sub}>Seed 48213, 30 steps, batch of 4. Simulated.</p>
          </div>
          <button type="button" className={styles.again} onClick={() => setRunKey((k) => k + 1)}>
            <RotateCcw size={13} aria-hidden />
            Generate again
          </button>
        </div>
        <div className={styles.grid}>
          {TILES.map((i) => (
            <ImageReveal
              key={i}
              seed={48213 + i}
              steps={30}
              aspectRatio="9 / 10"
              size="sm"
              runKey={runKey}
              loop={false}
              startDelay={i * 350}
              queueDuration={900}
              duration={4200}
              style={{ maxInlineSize: "none" }}
              alt={`Golden-hour landscape, variation ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Stack>
  );
}
