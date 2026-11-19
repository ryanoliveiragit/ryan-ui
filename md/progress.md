# Progress

> Barra que mostra quanto de uma tarefa conhecida já foi concluído.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/progress
- Original description: Show how much of a known task is complete.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/progress.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/progress.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/progress.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/progress.json`. Registry path, relative to the site address: `r/progress.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/progress/progress.tsx`
  - `components/ryan-ui/progress/progress.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/progress.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A task with a known end, such as a file upload, an import, or multi-stage processing, with the number alongside (`showValue`).
- Fill measures that are not time, such as a profile 72% complete or 18 of 50 GB used (`value` and `max`).
- When the end deserves a signal: at 100% the bar takes on the success color and a checkmark appears next to the number.

## When not to use

- Use [`loader`](loader.md) when there is no way to know how much remains; this bar has no indeterminate mode.
- Use [`usage-meter`](usage-meter.md) for a quota split by category, with a limit and a nearly-full warning.
- Use [`toast-progress`](toast-progress.md) to track a background task without taking up space on the page.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useState } from "react";
import { Progress } from "@/components/ryan-ui/progress/progress";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack } from "./_kit";

export default function ProgressDemo() {
  const [value, setValue] = useState(8);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setValue(v => (v >= 100 ? (setRunning(false), 100) : Math.min(100, v + 7))), 700);
    return () => window.clearInterval(timer);
  }, [running]);
  return (
    <Stack gap={6} width={420}>
      <Progress label="Uploading Q3-report.pdf" value={value} showValue />
      <Row>
        <Button size="sm" variant="secondary" onClick={() => { setValue(0); setRunning(true); }}>Restart upload</Button>
        <Button size="sm" variant="ghost" onClick={() => setRunning(r => !r)}>{running ? "Pause" : "Resume"}</Button>
      </Row>
      <Progress label="Profile completeness" value={72} showValue />
      <Progress label="Storage used" value={18} max={50} showValue />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Progress`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | — |
| `max` | `number` | `100` | — |
| `label` | `string` | — | — |
| `showValue` | `boolean` | `false` | — |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type, except `children`. |

## Accessibility

- It is `role="progressbar"` with `aria-valuenow`, `aria-valuemax`, and `aria-valuetext` as a percentage; the name comes from `label` and, without it, is the generic “Progress”.
- Always pass `label` saying what is advancing (“Uploading report.pdf”): it is the accessible name and also the visible text above the bar.

## Motion

- A single no-overshoot spring moves the fill and counts the number, so the two always match; the fill slides in from the left instead of stretching, and the rounded tip keeps its shape.
- On reaching 100%, the checkmark enters with a small delay next to the number and the color changes to the success one; changing `label` makes the new text rise with a slight blur.
- With “reduce motion”, the bar jumps to the value, the label only fades, and the color changes without transition.

## Notes for AI

- Import from `@/components/ryan-ui/progress/progress`. `value` goes from 0 to `max` (default 100) and is clamped to that range; there is no indeterminate mode.
- It fills the parent's full width, so give the container a width. Update `value` freely: each change only redirects the spring.
- With `max`, the displayed number remains a percentage (18 of 50 becomes 36%); if you want “18 of 50 GB”, write that in `label`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/progress · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
