# Ridgeline

> Distribuições sobrepostas, uma crista por grupo: passe o mouse para destacar e ver os quartis.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ridgeline
- Original description: Overlapping distributions, one ridge per group: hover to lift a ridge and read its quartiles, switch datasets and every curve morphs.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ridgeline.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ridgeline.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ridgeline.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ridgeline.json`. Registry path, relative to the site address: `r/ridgeline.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/ridgeline/ridgeline.tsx`
  - `components/ryan-ui/ridgeline/ridgeline.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/ridgeline.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Comparing the shape of several distributions at once: daily temperatures by month, response times by region.
- When the question is about shift and spread: where each group's median is and how wide the middle half is.
- Showing how distributions change between two datasets: with the same `id`s, each curve transforms into the new one.

## When not to use

- Use [`bar-chart`](bar-chart.md) when each group has a single value, not a collection of observations.
- Use [`line-chart`](line-chart.md) or [`streamgraph`](streamgraph.md) when the horizontal axis is time and you want to see evolution, not distribution.
- With few observations per group, the smoothed curve suggests a shape the data doesn't support; prefer showing the values.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import Ridgeline, { type RidgelineSeries } from "@/components/ryan-ui/ridgeline/ridgeline";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// mean high in Zurich per month, and a shift for a warmer scenario
const base = [3, 5, 10, 14, 19, 23, 25, 24, 20, 14, 7, 4];

function make(shift: number): RidgelineSeries[] {
  let s = 17;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
  return months.map((m, i) => ({
    id: m,
    label: m,
    values: Array.from({ length: 31 }, () => Math.round(((base[i] ?? 0) + shift + gauss() * (2.6 + (i % 3 === 0 ? 0.8 : 0))) * 10) / 10),
  }));
}

export default function RidgelineDemo() {
  const sets = useMemo(() => ({ y1995: make(0), y2025: make(1.8) }), []);
  const [key, setKey] = useState<"y1995" | "y2025">("y1995");
  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Decade" value={key} onValueChange={(v) => setKey(v as "y1995" | "y2025")} options={[{ value: "y1995", label: "1990s" }, { value: "y2025", label: "2020s" }]} />
      <Surface>
        <Ridgeline series={sets[key]} label="Daily highs in Zurich" unit="°C" domain={[-6, 36]} rowHeight={26} />
      </Surface>
      <Caption>Hover a ridge to lift it and read its quartiles. Switch decades and every curve morphs.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Ridgeline`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `series` (required) | `RidgelineSeries[]` | — | One ridge per series, drawn top to bottom. |
| `label` (required) | `string` | — | What is measured, such as "Daily highs in Zurich". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after each value, such as "°C". |
| `formatValue` | `(value: number) => string` | — | — |
| `domain` | `[number, number]` | — | Value range of the axis. Defaults to the data with a little room on each side. |
| `overlap` | `number` | `2.4` | How far a ridge may rise into the rows above, in row heights. |
| `rowHeight` | `number` | `30` | Height of one row in pixels. |
| `bandwidth` | `number` | — | Smoothing in value units. Defaults to Silverman's rule per series. |
| `tint` | `boolean` | `true` | Shades each ridge by its median, from a light tint to the full first series color, and shows the scale under the axis. |
| `active` | `string \| null` | — | Controlled id of the lifted ridge. |
| `defaultActive` | `string \| null` | `null` | — |
| `onActiveChange` | `(id: string \| null) => void` | — | — |
| `emptyLabel` | `string` | `"No data yet"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `RidgelineSeries`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable identity. A ridge that survives a data change morphs into its new shape. |
| `label` (required) | `string` | — |
| `values` (required) | `number[]` | Raw observations. The ridge is a smoothed density of these values. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on the chart, pick the previous or next ridge and raise it. |
| `←` or `→` | Move the reading cursor along the values, one axis step at a time. |
| `Home` or `End` | Go to the first or last ridge. |
| `Esc` | Releases the raised ridge and hides the tooltip. |

## Accessibility

- The `<figure>` carries the `label`; the chart area is a focusable group with `aria-roledescription="ridgeline chart"` and the keyboard instructions in its name, in English.
- An `aria-live="polite"` region reads the active series (median, middle half, range, and count) and, with the cursor, the fraction of values up to that point.
- A hidden table lists the median, quartiles, minimum, maximum, and count of each series, so screen readers don't depend on the drawing.

## Motion

- On entering the viewport, the ridges grow from the baseline in a wave, from top to bottom; when the data changes, each curve and the axis transform on a spring to the new shape.
- The ridge under the pointer rises 6 px on a copy drawn on top, with the band between the quartiles highlighted, while the others fade; the tooltip follows the pointer on a spring.
- With “reduced motion” on, shapes are painted directly in the final state and the tooltip follows the pointer without a spring.

## Responsive behavior

- The width follows the container and the height comes from the content: `rowHeight` per series plus the overlap and axis space; there is no total height prop.
- Below 420 px of width the name column shrinks from 52 to 36 px, with ellipses, and the axis shows fewer ticks (about one every 72 px).

## Performance

- Density is computed in the browser (96 samples per series, each against all observations) and `series` is serialized on every render, including when moving the pointer; with many thousands of values, downsample first.

## Notes for AI

- Pass raw observations in `values`, not ready-made densities: the component estimates the curve with Silverman's rule per series, or with `bandwidth` in value units.
- Use a stable `id` per series so the curves transform when the data is swapped, and fix `domain` when two datasets need the same axis.
- `active` with `onActiveChange` controls the raised ridge; `tint` (on by default) colors each ridge by its median and shows the scale below the chart.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ridgeline · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
