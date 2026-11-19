# Shader background

> Fundo animado em canvas: um campo de ruído que flui na cor de destaque e pausa quando sai da tela.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/shader-background
- Original description: An animated WebGL backdrop: a flowing noise field tinted with the accent that pauses off screen, holds still under reduced motion and falls back to a flat surface.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shader-background.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shader-background.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shader-background.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/shader-background.json`. Registry path, relative to the site address: `r/shader-background.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/shader-background/shader-background.tsx`
  - `components/ryan-ui/shader-background/shader-background.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/shader-background.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The background of a highlight section, such as a landing page hero or a login screen, with slow motion in the accent color.
- Backgrounds that should follow light and dark themes and the accent color with no configuration: the colors come from tokens and are reread when the theme changes.

## When not to use

- Behind long text, tables, or forms, a moving background hurts reading; use a smooth surface.
- Use [`hero-section`](hero-section.md) when you need the whole hero ready-made, with title, buttons, and illustrations, and not just the background.
- It does not suit as the background of every card in a list or grid: each instance is its own WebGL canvas.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { ShaderBackground } from "@/components/ryan-ui/shader-background/shader-background";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Button } from "@/components/ryan-ui/button/button";
import type { DemoStage } from "./_kit";
import styles from "./shader-background.module.css";

export const stage: DemoStage = { layout: "fill", height: 480 };

const moods = [{ value: "calm", label: "Calm" }, { value: "flow", label: "Flow" }, { value: "rush", label: "Rush" }];
const speeds: Record<string, number> = { calm: 0.45, flow: 1, rush: 2.6 };

export default function ShaderBackgroundDemo() {
  const [mood, setMood] = useState("flow");
  const [paused, setPaused] = useState(false);

  return (
    <ShaderBackground className={styles.hero} speed={speeds[mood] ?? 1} paused={paused}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Tidewater Cloud</p>
        <h2 className={styles.title}>Deploys that stay out of your way</h2>
        <p className={styles.lead}>Push a branch and get a preview in seconds. The background is a live shader tinted with your accent color.</p>
        <div className={styles.actions}>
          <Button>Start a project<ArrowRight size={16} aria-hidden="true" /></Button>
          <Button variant="secondary" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
        <SegmentedControl label="Flow speed" options={moods} value={mood} onValueChange={setMood} />
      </div>
    </ShaderBackground>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ShaderBackground`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `number` | `1` | Flow speed multiplier. 1 is a calm drift; 0 freezes the field. |
| `scale` | `number` | `1` | Zoom of the noise field. Larger values show finer, busier detail. |
| `intensity` | `number` | `0.7` | How strongly the accent tints the field, from 0 (barely there) to 1. |
| `paused` | `boolean` | `false` | Holds the current frame. The field resumes from the same place. |
| `quality` | `number` | `0.75` | Render resolution as a fraction of the display pixels, from 0.25 to 1. The field is soft, so a lower value costs less and rarely shows. |
| `children` | `ReactNode` | — | Content shown above the field. |
| `className` | `string` | — | Extra class for the root element. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type. |

## Accessibility

- The canvas is `aria-hidden` and receives no pointer; the content comes in `children`, in a layer above, with whatever semantics you give it.
- The field blends the page background with patches in the accent color; check the text contrast on top and reduce `intensity` if needed.

## Motion

- A noise field folded over itself flows slowly, like liquid; `speed` changes the pace (0 freezes), `scale` the detail size, and `intensity` the strength of the highlight.
- The canvas appears with a 0.48 s fade when the first frame is ready; before that, and without WebGL, the smooth `--background` surface remains.
- With “reduce motion”, the field stays still on a fixed frame and the initial fade is turned off; `paused` freezes the current frame and resumes from the same point.

## Responsive behavior

- It takes the size of its own element, with a height of at least 12 rem, and redraws when it is resized.

## Performance

- The `requestAnimationFrame` loop only runs while the background is on screen, the tab is visible, `paused` is off, and `speed` is not 0; when stopped, it draws once and spends nothing more.
- `quality` (default 0.75) reduces the pixels drawn, with density capped at 2×; each instance is its own WebGL context, so use few per page.

## Notes for AI

- Import `ShaderBackground` from `@/components/ryan-ui/shader-background/shader-background` and put the content as the child; set the height with `className` or let the content set it (minimum 12 rem).
- The colors come from `--background`, `--surface-muted`, and `--accent`; for another tone, change those tokens on an ancestor instead of editing the shader.
- Offer a pause button tied to `paused` when the background stays on screen for a long time, as in the demo.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/shader-background · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
