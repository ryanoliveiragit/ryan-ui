# Ruler slider

> Uma fita de marcas que desliza sob uma agulha fixa, com inércia, encaixe e valor rolante.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ruler-slider
- Original description: A tape of ticks that slides under a fixed needle, with momentum, snapping, and a rolling readout.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ruler-slider.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ruler-slider.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ruler-slider.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ruler-slider.json`. Registry path, relative to the site address: `r/ruler-slider.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/ruler-slider/ruler-slider.tsx`
  - `components/ryan-ui/ruler-slider/ruler-slider.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/ruler-slider.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Measurements such as height, weight, or temperature, where the tape-measure metaphor helps and the exact value matters.
- Touch screens, where dragging and flinging a tape is more comfortable than hitting a small thumb.
- Onboarding with one measurement per screen, with the large number and the unit highlighted.

## When not to use

- Use [`slider`](slider.md) when the range is short or when seeing the position on the track matters more than the exact number.
- Use [`number-field`](number-field.md) when people already know the number and prefer to type it.
- Use [`range-histogram-slider`](range-histogram-slider.md) or a [`slider`](slider.md) with two values to choose a range.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import RulerSlider from "@/components/ryan-ui/ruler-slider/ruler-slider";
import { Caption, Stack } from "./_kit";

export default function RulerSliderDemo() {
  const [height, setHeight] = useState(172);
  return (
    <Stack width={420} gap={5}>
      <RulerSlider label="Height" unit="cm" min={120} max={220} step={1} majorEvery={10} value={height} onValueChange={setHeight} />
      <Caption>Drag, flick or tap the tape. Arrow keys step one tick. {height} cm is about {(height / 30.48).toFixed(1)} ft.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RulerSlider`

A precise value input shaped like a tape measure. A ruler of ticks slides under a fixed needle: drag it 1:1, flick it and it coasts with momentum onto a tick, pull it past either end and it rubber-bands back, or tap a spot to glide it there. The readout rolls each digit as the tape passes. Arrows step one tick, Shift+arrows and PageUp or PageDown move one labelled tick, Home and End go to the ends, and horizontal trackpad scrolling moves the tape.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Visible label; it also names the control. |
| `value` | `number` | — | — |
| `defaultValue` | `number` | — | — |
| `onValueChange` | `(value: number) => void` | — | — |
| `onValueCommit` | `(value: number) => void` | — | Runs once the tape comes to rest after a drag, a flick, a tap, or a key. |
| `min` | `number` | `0` | — |
| `max` | `number` | `100` | — |
| `step` | `number` | `1` | The value of one small tick. The tape always rests on a tick. |
| `largeStep` | `number` | — | PageUp, PageDown, and Shift with an arrow move this far. Defaults to one labelled tick. |
| `majorEvery` | `number` | `10` | Small ticks between labelled ticks. |
| `spacing` | `number` | `10` | Pixels between small ticks. Wider spacing gives finer control. |
| `format` | `(value: number) => string` | — | Formats the readout, the tick labels, and the spoken value. |
| `unit` | `string` | — | Unit shown after the readout and spoken with the value, such as "cm". |
| `name` | `string` | — | Submits the value with a form. |
| `disabled` | `boolean` | — | — |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↑` | Advance one small mark (`step`), and the tape slides to it on a spring. |
| `←` or `↓` | Go back one small mark. |
| `Page Up` or `Page Down` or `Shift + →` or `Shift + ←` | Move one labeled mark (`largeStep`, by default `step` times `majorEvery`). |
| `Home` or `End` | Go to the minimum or the maximum. |

## Accessibility

- The whole tape is a single focusable `role="slider"`, named by the label, with `aria-valuetext` joining the formatted value and the `unit` (“172 cm”).
- The large number and the marks are `aria-hidden`, and the screen reader hears only the slider value, so put the text that should be spoken in `format` and `unit`.

## Motion

- The tape follows the finger 1:1, keeps sliding with inertia after a fling, and always stops on a mark; pulled past the ends, it stretches like elastic and snaps back.
- A tap brings the tapped mark to the needle on a spring, and the digits of the number each roll in their own column while the tape passes.
- With “reduce motion” on, the tape goes straight to the value, with no inertia or elastic, and the digits change without rolling.

## Responsive behavior

- It fills the container width with the tape ends faded; on touch, dragging vertically scrolls the page, and on a trackpad horizontal scrolling moves the tape.

## Performance

- The small marks are a CSS background, but each labeled mark is an element and the tape spans the whole range width; for huge ranges with a small `step`, increase `majorEvery` or split the range.

## Notes for AI

- Built for physical values with `unit` (cm, kg, °C): `min`, `max`, and `step` define the tape, and `spacing` (px per mark) controls drag precision.
- `onValueChange` fires on every mark that passes the needle, including during inertia; save or fetch in `onValueCommit`, which arrives when the tape stops.
- The height comes from `--ruler-height` and the width is 100%, so limit the width on the parent element.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ruler-slider · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
