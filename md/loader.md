# Loader

> Cinco indicadores de carregamento em três tamanhos, com rótulo lido por leitores de tela.

- Type: component (category Feedback), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/loader
- Original description: A family of five loaders (spinner, dots, bars, pulse ring, orbit) in three sizes that share one box, color and accessible label.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loader.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loader.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loader.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/loader.json`. Registry path, relative to the site address: `r/loader.json`.

- npm packages: none besides React
- Files, once installed:
  - `components/ryan-ui/loader/loader.tsx`
  - `components/ryan-ui/loader/loader.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: there are no packages to install.
2. Copy the files listed above. The content of each one is in `r/loader.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A short wait with no known progress, such as opening an invoice, submitting a form, or fetching results.
- Inside a button or a sentence, with `size="sm"` and `tone="current"` to inherit the text color.
- Waits with their own meaning: `dots` for “someone is typing”, `bars` for audio loading, `ring` for waiting on a live signal, and `orbit` for longer tasks.

## When not to use

- Use [`progress`](progress.md) when you know how much remains: a bar with a number says more than an endless spin.
- Use [`skeleton`](skeleton.md) when the wait is for the content of an area whose shape you already know.
- Use [`loading-states`](loading-states.md) or [`text-shimmer`](text-shimmer.md) for the “thinking” state of AI interfaces, with status text.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { Loader } from "@/components/ryan-ui/loader/loader";
import type { LoaderSize, LoaderVariant } from "@/components/ryan-ui/loader/loader";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack } from "./_kit";
import styles from "./loader.module.css";

const family: { variant: LoaderVariant; name: string; label: string }[] = [
  { variant: "spinner", name: "Spinner", label: "Loading invoice" },
  { variant: "dots", name: "Dots", label: "Maya is typing" },
  { variant: "bars", name: "Bars", label: "Buffering audio" },
  { variant: "ring", name: "Pulse ring", label: "Waiting for signal" },
  { variant: "orbit", name: "Orbit", label: "Building preview" },
];

const sizes = [{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }];

export default function LoaderDemo() {
  const [size, setSize] = useState<LoaderSize>("lg");
  const [saving, setSaving] = useState(false);
  const save = () => { setSaving(true); window.setTimeout(() => setSaving(false), 2400); };

  return (
    <Stack gap={6} width={600} align="center">
      <SegmentedControl label="Loader size" options={sizes} value={size} onValueChange={value => setSize(value as LoaderSize)} />
      <ul className={styles.family}>
        {family.map(item => (
          <li key={item.variant} className={styles.tile}>
            <span className={styles.slot}><Loader variant={item.variant} size={size} label={item.label} /></span>
            <span className={styles.name}>{item.name}</span>
          </li>
        ))}
      </ul>
      <Row justify="center" gap={5}>
        <Button onClick={save} aria-busy={saving}>
          {saving ? <Loader size="sm" tone="current" label="Saving changes" /> : null}
          {saving ? "Saving" : "Save changes"}
        </Button>
        <Loader variant="dots" size="sm" showLabel label="Syncing 248 contacts" />
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Loader`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"spinner" \| "dots" \| "bars" \| "ring" \| "orbit"` | `"spinner"` | Which loader to draw. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Box size: 16 px, 24 px or 40 px. |
| `label` | `string` | `"Loading"` | What is loading. Screen readers announce it; it is hidden visually unless `showLabel` is set. |
| `showLabel` | `boolean` | `false` | Shows the label next to the loader. |
| `tone` | `"accent" \| "current"` | `"accent"` | "accent" draws in the accent color; "current" inherits the surrounding text color, for loaders inside buttons. |
| `speed` | `number` | `1` | Speed multiplier: 2 runs twice as fast, 0.5 at half speed. |
| `className` | `string` | — | Extra class for the root element. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | Also accepts the props of this type, except `children`. |

### Exported types

| Type | Definition |
| --- | --- |
| `LoaderVariant` | `"spinner" \| "dots" \| "bars" \| "ring" \| "orbit"` |
| `LoaderSize` | `"sm" \| "md" \| "lg"` |

## Accessibility

- The root is `role="status"` with `aria-live="polite"`, and `label` (default “Loading”) is the text that is read; the drawing is decorative (`aria-hidden`).
- Write in `label` what is loading (“Saving changes”), not just “Loading”; `showLabel` shows the same text next to the drawing.
- Each loader is a live region: avoid several on screen at once and, inside a button, mark the button with `aria-busy`, as in the demo.

## Motion

- Everything is a looping CSS animation: the `spinner` arc stretches and shrinks as it turns, the dots make a wave, the bars pulse like an equalizer, the ring emits two waves, and three satellites orbit together.
- `speed` multiplies the pace of any variant: 2 is double speed and 0.5 is half.
- With “reduce motion”, nothing moves: each variant stops in a readable shape and the whole drawing only pulses its opacity slowly, so it still says “working”.

## Performance

- The animation is CSS only (keyframes), with no timers or React re-renders, so several loaders on the page cost no JavaScript.

## Notes for AI

- Import from `@/components/ryan-ui/loader/loader`. The props that matter are `variant`, `size` (`sm` 16 px, `md` 24 px, `lg` 40 px), and `label`; the square is the same in every variant, so switching does not shift the layout.
- Inside a button, use `size="sm"` and `tone="current"` to inherit the text color; the default `accent` paints with the accent color.
- There is no delay or visibility prop: render the loader only during the wait and remove it when the wait ends.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/loader · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
