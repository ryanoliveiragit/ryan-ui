# Range histogram slider

> Faixa de preço sobre um histograma dos dados, acendendo as barras dentro do intervalo escolhido.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/range-histogram-slider
- Original description: A price range over a live histogram of the data, lighting the bars inside the range and settling on bar edges.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/range-histogram-slider.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/range-histogram-slider.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/range-histogram-slider.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/range-histogram-slider.json`. Registry path, relative to the site address: `r/range-histogram-slider.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/range-histogram-slider/range-histogram-slider.tsx`
  - `components/ryan-ui/range-histogram-slider/range-histogram-slider.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/range-histogram-slider.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Filtering a price range or another measure where seeing the distribution helps people choose, such as nightly rates, salaries, or sizes.
- Searches with live filtering, where the lit bars show how much of the set falls inside the range.

## When not to use

- Use [`slider`](slider.md) when there is no data to show the distribution or when a single value is enough.
- Use [`number-field`](number-field.md) when people already know the exact limits and prefer to type them.
- Use [`chip-group`](chip-group.md) to filter by categories instead of numbers.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import RangeHistogramSlider from "@/components/ryan-ui/range-histogram-slider/range-histogram-slider";
import { Caption, Stack } from "./_kit";

function prices() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const out: number[] = [];
  for (let i = 0; i < 260; i++) {
    const n = (rnd() + rnd() + rnd()) / 3;
    out.push(Math.round(40 + n * n * 560));
  }
  return out;
}

export default function RangeHistogramSliderDemo() {
  const data = useMemo(prices, []);
  const [range, setRange] = useState<[number, number]>([120, 320]);
  const count = data.filter((p) => p >= range[0] && p <= range[1]).length;
  return (
    <Stack width={460} gap={4}>
      <RangeHistogramSlider label="Nightly price" data={data} value={range} onValueChange={setRange} min={40} max={600} format={(v) => `$${Math.round(v)}`} />
      <Caption>{count} of {data.length} stays between ${Math.round(range[0])} and ${Math.round(range[1])}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RangeHistogramSlider`

A two thumb range over a histogram of the data it filters. Bars inside the range light up, cut exactly at each thumb on the frame it moves; the thumbs follow the pointer 1:1, never cross, rubber-band at the ends, and settle on bar edges with the release velocity. A press anywhere on the histogram or track springs the nearest thumb there. Arrows step, Shift+arrows and PageUp or PageDown move one bar, and Home or End go to a thumb's limit.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Visible label. The thumbs are named from it unless `thumbLabels` says otherwise. |
| `data` (required) | `number[]` | — | The raw values the histogram counts, such as every listing's price. |
| `value` | `[number, number]` | — | — |
| `defaultValue` | `[number, number]` | — | — |
| `onValueChange` | `(value: [number, number]) => void` | — | — |
| `onValueCommit` | `(value: [number, number]) => void` | — | Runs once a drag is released or a key changes the value. |
| `min` | `number` | — | Defaults to the smallest and largest data values. |
| `max` | `number` | — | — |
| `step` | `number` | `1` | — |
| `bins` | `number` | `32` | How many bars the histogram draws. |
| `snapToBins` | `boolean` | `true` | A released thumb that lands near the edge of a bar settles on that edge, so a range never cuts a bar in half. |
| `minStepsBetweenThumbs` | `number` | `1` | The closest the two thumbs may sit, in steps. |
| `format` | `(value: number) => string` | — | Formats the readout and the spoken values. |
| `thumbLabels` | `[string, string]` | — | — |
| `name` | `string` | — | Submits the range with a form, one hidden input per thumb. |
| `disabled` | `boolean` | — | — |
| `className` | `string` | — | — |

### Other exports

- `histogram` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↑` | Increase the focused thumb by one `step`. |
| `←` or `↓` | Decrease the focused thumb; at a limit, it strains against the edge and springs back. |
| `Shift + →` or `Shift + ←` or `Page Up` or `Page Down` | Move the thumb to the next bar edge in that direction, walking the histogram bar by bar. |
| `Home` or `End` | Move the thumb to its limit: the end of the scale or the other thumb, respecting the minimum distance. |
| `Tab` | Moves from the minimum thumb to the maximum one. |

## Accessibility

- Each thumb is its own `role="slider"`, named “{label}, minimum” and “{label}, maximum” (change with `thumbLabels`), with `aria-valuetext` coming from `format`.
- The `aria-valuemin` and `aria-valuemax` of each thumb follow the other one, so the screen reader hears only the stretch that is still free.
- The histogram and the range text are `aria-hidden`; if the number of items in the range matters, show it as text outside the component, as the demo does.

## Motion

- The thumbs follow the pointer 1:1, never cross, stretch like elastic past the ends, and on release settle on a nearby bar edge carrying the gesture's velocity.
- The bars inside the range light up through a clip that cuts exactly at the thumb, in the same frame, and tapping the chart or track takes the nearest thumb there on a spring.
- With “reduce motion” on, the thumbs go straight to the value, with no elastic or bump at the limits.

## Responsive behavior

- It fills the container width, and on touch, dragging vertically still scrolls the page (`touch-action: pan-y`).

## Performance

- The bars are recounted when the identity of `data`, `min`, `max`, or `bins` changes; memoize the array with `useMemo` to avoid recounting on every render.
- Without `min` and `max`, the limits come from `Math.min(...data)` and `Math.max(...data)` on every render; with many values, pass both.

## Notes for AI

- `data` holds the raw values (the price of each listing), not the counts; the component distributes the values into `bins` bars, 32 by default.
- Pass explicit `min` and `max`, as the demo does: the default minimum includes zero, so prices from 40 to 600 would open the scale at 0.
- Use `onValueChange` for the live text and `onValueCommit` to filter or search, because it fires on release or on every key; `snapToBins={false}` turns off snapping to the edges.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/range-histogram-slider · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
