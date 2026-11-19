# Elastic slider

> Controle deslizante que estica como borracha nos limites, com etiqueta que balança e marcas magnéticas.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/elastic-slider
- Original description: A slider that stretches like rubber past its ends, with a swaying value tag and detents the thumb clicks into.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/elastic-slider.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/elastic-slider.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/elastic-slider.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/elastic-slider.json`. Registry path, relative to the site address: `r/elastic-slider.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/elastic-slider/elastic-slider.tsx`
  - `components/ryan-ui/elastic-slider/elastic-slider.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/elastic-slider.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Continuous adjustments where the feel of the control matters, like volume, brightness, or intensity.
- Values with reference points: `marks` creates stops where the thumb snaps when passing within 7 px of them, with clickable labels under the track.
- When heavy work should only run at the end of the gesture: `onValueChange` follows the drag and `onValueCommit` fires on release or on each key.

## When not to use

- Use [`slider`](slider.md) for a range with two thumbs; this one has just one.
- Use [`number-field`](number-field.md) when the exact value matters and needs to be typed.
- Use [`ruler-slider`](ruler-slider.md) to choose precisely on a long scale, with a ruler and inertia.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Volume1, Volume2 } from "lucide-react";
import ElasticSlider from "@/components/ryan-ui/elastic-slider/elastic-slider";
import { Caption, Stack } from "./_kit";

export default function ElasticSliderDemo() {
  const [volume, setVolume] = useState(40);
  const [budget, setBudget] = useState(2500);
  return (
    <Stack gap={8} width={400}>
      <Stack gap={2}>
        <ElasticSlider label="Volume" value={volume} onValueChange={setVolume} startIcon={<Volume1 size={18} aria-hidden="true" />} endIcon={<Volume2 size={18} aria-hidden="true" />} />
        <Caption>Drag past either end: the track stretches and springs back.</Caption>
      </Stack>
      <ElasticSlider
        label="Monthly budget"
        value={budget}
        onValueChange={setBudget}
        min={0}
        max={5000}
        step={50}
        marks={[{ value: 0, label: "$0" }, { value: 1000, label: "$1k" }, { value: 2500, label: "$2.5k" }, { value: 5000, label: "$5k" }]}
        format={(v) => `$${v.toLocaleString("en-US")}`}
      />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ElasticSlider`

A single value slider made of something that gives. The thumb swells under the finger, the track stretches like rubber past either end and springs back with the release velocity, a value tag hangs off the thumb and sways with its speed, and marks act as detents the thumb clicks into. Arrows, Shift+arrows, PageUp, PageDown, Home, and End work as in a native range input.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Visible label; it also names the thumb. |
| `value` | `number` | — | — |
| `defaultValue` | `number` | — | — |
| `onValueChange` | `(value: number) => void` | — | — |
| `onValueCommit` | `(value: number) => void` | — | Runs once a drag is released or a key changes the value. |
| `min` | `number` | `0` | — |
| `max` | `number` | `100` | — |
| `step` | `number` | `1` | — |
| `largeStep` | `number` | — | PageUp, PageDown, and Shift with an arrow move this far. Defaults to a tenth of the range. |
| `marks` | `(number \| ElasticSliderMark)[]` | — | Detents. A dragged thumb clicks into each one and holds for a few pixels before letting go. Labels print under the track. |
| `format` | `(value: number) => string` | — | Formats the readout, the bubble, and the spoken value. |
| `showValue` | `boolean` | `true` | Show the value beside the label. The bubble over the thumb still appears while dragging or using keys. |
| `startIcon` | `ReactNode` | — | Icons at either end. The one on the side being pulled past its limit is pushed outward with the track. |
| `endIcon` | `ReactNode` | — | — |
| `name` | `string` | — | Submits the value with a form. |
| `disabled` | `boolean` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `ElasticSliderMark`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `number` | — |
| `label` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↑` | Adds one `step`. |
| `←` or `↓` | Subtracts one `step`. |
| `Page Up` or `Page Down` | Adds or subtracts `largeStep` (by default, a tenth of the range). |
| `Shift + →` or `Shift + ↑` or `Shift + ←` or `Shift + ↓` | Move `largeStep` instead of `step`. |
| `Home` or `End` | Goes to `min` or to `max`. |

## Accessibility

- The thumb is a focusable `role="slider"`, named by the visible `label`, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and an `aria-valuetext` that comes from `format`.
- The value next to the label and the tag over the thumb are decorative (`aria-hidden`): what the screen reader announces is the `aria-valuetext`.
- Clicking or tapping anywhere on the track moves focus to the thumb, and its touch area extends 12 px beyond the circle.

## Motion

- Past the ends the track stretches like a rubber band (up to 26 px), thins, and on release returns with a spring that overshoots and settles; on the keyboard, pushing against a limit gives the same jolt.
- The value tag follows the thumb with a slight delay and sways with the velocity; on snapping to a mark, its dot pulses and, on touch, the device vibrates where supported.
- With “reduce motion” on, there is no stretching or sway: the thumb jumps to the value and the tag only fades.

## Responsive behavior

- Takes 100% of the container width and only exists horizontally; `--elastic-thumb` and `--elastic-track` adjust the sizes (default 24 px and 8 px).
- On touch, dragging vertically still scrolls the page (`touch-action: pan-y`) and, on coarse pointers, the tag rises higher so it does not sit under the finger.

## Notes for AI

- `label` is required and visible; use `value` + `onValueChange` or `defaultValue` (which falls back to `min`), with defaults `min={0}`, `max={100}`, and `step={1}`.
- The default number format is `en-US`: pass `format` for currency, unit, or Portuguese separators; it applies to the text next to the label, the tag, and the screen reader.
- `marks` accepts numbers or `{ value, label }`, `startIcon` and `endIcon` put icons at the ends, and `name` sends the value in a hidden field.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/elastic-slider · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
