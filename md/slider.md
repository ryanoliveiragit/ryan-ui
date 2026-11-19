# Slider

> Escolha um valor ou um intervalo numa trilha que acompanha o dedo, com balão de dígitos rolantes.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/slider
- Original description: Pick a value or a range on a track that follows your finger.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slider.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slider.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slider.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slider.json`. Registry path, relative to the site address: `r/slider.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/slider/slider.tsx`
  - `components/ryan-ui/slider/slider.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/slider.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Continuous adjustments where relative position matters: volume, brightness, zoom, opacity.
- Filter ranges with two limits, such as budget or price, with a minimum distance between the thumbs.
- Scales with a few named points, such as Draft, Good, and Great, using `marks` with a label and `step`.

## When not to use

- Use [`number-field`](number-field.md) when the exact value matters and people prefer to type.
- Use [`range-histogram-slider`](range-histogram-slider.md) when seeing the data distribution helps choose the range.
- Use [`ruler-slider`](ruler-slider.md) for precise measurements with a unit, such as height or weight, on touch screens.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Volume1, Volume2 } from "lucide-react";
import Slider from "@/components/ryan-ui/slider/slider";
import { Stack } from "./_kit";

export default function SliderDemo() {
  const [volume, setVolume] = useState(60);
  return (
    <Stack width={420} gap={8}>
      <Slider label="Volume" value={volume} onValueChange={setVolume} start={<Volume1 size={16} aria-hidden="true" />} end={<Volume2 size={16} aria-hidden="true" />} format={(v) => `${Math.round(v)}%`} />
      <Slider label="Budget" defaultValue={[800, 2400]} min={0} max={5000} step={50} minStepsBetweenThumbs={2} format={(v) => `$${v.toLocaleString("en-US")}`} thumbLabels={["Minimum budget", "Maximum budget"]} />
      <Slider label="Quality" defaultValue={50} step={25} marks={[{ value: 0, label: "Draft" }, { value: 25 }, { value: 50, label: "Good" }, { value: 75 }, { value: 100, label: "Best" }]} showValue={false} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Slider`

A value or a range on a track. The thumb follows the pointer 1:1, rubber-bands past its limits, and settles on the step grid with the velocity of the release; pressing the track springs the nearest thumb there. A bubble with rolling digits rides the thumb while it is dragged or keyboard focused. Arrows, Shift+arrows, PageUp, PageDown, Home, and End work as in a native range input.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Visible label. Range thumbs are named from it unless `thumbLabels` says otherwise. |
| `value` | `T` | — | A number for one thumb, a pair for a range. |
| `defaultValue` | `T` | — | — |
| `onValueChange` | `(value: T) => void` | — | — |
| `onValueCommit` | `(value: T) => void` | — | Runs once a drag is released or a key changes the value, for work too heavy for every step. |
| `min` | `number` | `0` | — |
| `max` | `number` | `100` | — |
| `step` | `number` | `1` | — |
| `largeStep` | `number` | — | PageUp, PageDown, and Shift with an arrow move this far. Defaults to a tenth of the range. |
| `marks` | `(number \| SliderMark)[]` | — | Ticks on the track. A number draws a tick; a mark with a label also prints it under the track, and clicking it moves there. |
| `minStepsBetweenThumbs` | `number` | `0` | The closest two range thumbs may sit, in steps. |
| `format` | `(value: number) => string` | — | Formats the readout, the bubble, and the spoken value. |
| `showValue` | `boolean` | `true` | Show the value beside the label. The bubble over the thumb still appears while dragging or focused. |
| `thumbLabels` | `[string, string]` | — | Accessible names for the two range thumbs. |
| `start` | `ReactNode` | — | Content beside the track, such as an icon or a mute button. |
| `end` | `ReactNode` | — | — |
| `name` | `string` | — | Submits the value with a form, one hidden input per thumb. |
| `disabled` | `boolean` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `SliderValue` | `number \| [number, number]` |

#### `SliderMark`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `number` | — |
| `label` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↑` | Increase by one `step`. |
| `←` or `↓` | Decrease by one `step`; at a limit, the thumb strains against the edge and springs back. |
| `Page Up` or `Page Down` or `Shift + →` or `Shift + ←` | Move by `largeStep`, by default one tenth of the range. |
| `Home` or `End` | Go to the thumb's limit: the end of the range or, in an interval, the other thumb. |
| `Tab` | In an interval, moves from one thumb to the other. |

## Accessibility

- Each thumb is a `role="slider"` with `aria-valuetext` coming from `format`; a single value is named by the label, and in an interval each thumb gets its own name (`thumbLabels` or “…, minimum” and “…, maximum”).
- The number beside the label and the bubble are `aria-hidden`, because the slider already speaks the value; icons in `start` and `end` should be `aria-hidden` or named buttons.

## Motion

- The thumb follows the pointer 1:1, stretches like elastic past the limits, and settles on the `step` grid carrying the gesture's velocity; tapping the track takes the nearest thumb there on a spring.
- A bubble with odometer digits follows the thumb while dragging and on keyboard focus, but not on pointer-originated focus, and new digit columns open the width on a spring.
- With “reduce motion” on, the thumb goes straight to the value, with no elastic or bump, and the digits change without rolling.

## Responsive behavior

- On touch screens the bubble sits higher, so the finger does not cover it, and never goes past the component edges; dragging vertically still scrolls the page.

## Notes for AI

- The value type defines the mode: `defaultValue={60}` gives one thumb, `defaultValue={[800, 2400]}` gives an interval, and `onValueChange` returns the same format.
- `onValueChange` fires on every drag step; heavy work, such as filtering or saving, goes in `onValueCommit`, which arrives on release or on each key.
- `marks` accepts numbers (tick only) or `{ value, label }` (clickable label), and `start` and `end` take icons, such as low and high volume.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/slider · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
