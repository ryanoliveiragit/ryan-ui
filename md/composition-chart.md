# Composition chart

> Barra empilhada de 100% com legenda: mostra as partes de um todo e desliza os segmentos quando os dados mudam.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/composition-chart
- Original description: 100% stacked bar of the parts of a whole with a legend: segments slide to their new shares when the data changes, and legend rows switch parts off and on.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/composition-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/composition-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/composition-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/composition-chart.json`. Registry path, relative to the site address: `r/composition-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/composition-chart/composition-chart.tsx`
  - `components/ryan-ui/composition-chart/composition-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/composition-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The parts of a single whole when each one's share matters more than the history: spend by service, revenue by plan.
- Let the user take a part out of the calculation: each legend row turns the part off or on and the others redistribute in the bar.
- Compare the same parts across periods: with the same `key`s, the segments slide to the new shares.

## When not to use

- Use [`usage-meter`](usage-meter.md) when the parts fill a fixed limit, such as a plan's storage.
- Use [`treemap`](treemap.md) for parts within parts, with navigation by levels.
- Use [`streamgraph`](streamgraph.md) when how the mix changes over time is what matters.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import CompositionChart, { type CompositionPart } from "@/components/ryan-ui/composition-chart/composition-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const services = (values: number[]): CompositionPart[] => [
  { key: "compute", label: "Compute", value: values[0] ?? 0 },
  { key: "database", label: "Databases", value: values[1] ?? 0 },
  { key: "storage", label: "Storage", value: values[2] ?? 0 },
  { key: "network", label: "Networking", value: values[3] ?? 0 },
  { key: "other", label: "Everything else", value: values[4] ?? 0 },
];

const months: Record<string, { name: string; parts: CompositionPart[] }> = {
  sep: { name: "September", parts: services([18400, 7600, 9200, 4100, 2300]) },
  oct: { name: "October", parts: services([21300, 8900, 9800, 3600, 2900]) },
  nov: { name: "November", parts: services([19800, 12400, 11200, 3900, 2600]) },
};

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CompositionChartDemo() {
  const [month, setMonth] = useState("nov");
  const current = months[month] ?? months.nov;
  return (
    <Stack gap={4} width={560}>
      <SegmentedControl label="Month" value={month} onValueChange={setMonth} options={[{ value: "sep", label: "Sep" }, { value: "oct", label: "Oct" }, { value: "nov", label: "Nov" }]} />
      <Surface>
        {current && <CompositionChart data={current.parts} label="Cloud spend by service" totalLabel={`total in ${current.name}`} formatValue={(value) => dollars.format(value)} />}
      </Surface>
      <Caption>Switch the month and the segments slide to their new shares. Select a legend row to leave that service out of the whole.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CompositionChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `CompositionPart[]` | — | The parts, in the order they should sit in the bar and the legend. |
| `label` (required) | `string` | — | What the whole is, such as "Cloud spend by service". Names the chart for assistive technology and heads the readout. |
| `totalLabel` | `string` | `"total"` | Short text beside the total, such as "total in November". |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | Formats the total and each part's value. |
| `barHeight` | `number` | `28` | Height of the bar in pixels. |
| `hideHeader` | `boolean` | `false` | Hides the headline with the total. |
| `hiddenKeys` | `string[]` | — | Controlled keys of the parts switched off in the legend. The rest are rescaled to fill the bar. |
| `defaultHiddenKeys` | `string[]` | — | Parts switched off on first render when uncontrolled. |
| `onHiddenChange` | `(keys: string[]) => void` | — | Called when a legend item switches a part on or off. The last part on show cannot be switched off. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `CompositionPart`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A part that survives a data change keeps its segment and slides to its new share. |
| `label` (required) | `string` | Name in the legend and the tooltip. |
| `value` (required) | `number` | Size of the part. Shares are worked out against the sum of the parts on show. |
| `color` | `string` | Any CSS color. Parts default to the shared --series-* palette in data order, then neutral steps. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through the legend rows; the focused part stands out in the bar and shows the tooltip. |
| `Enter` or `Space` | Turn the focused part off or on; the last visible part cannot be turned off. |

## Accessibility

- The bar is `aria-hidden`: the data comes from the legend, where each row is a button with `aria-pressed`, name, value, and share.
- The title total is also `aria-hidden`: if it is essential, repeat it in `label`, which is required and names the figure.
- “Value”, “Share”, “Hidden”, and the legend instruction are in English in the code; only `label`, `totalLabel`, and the part names are yours.

## Motion

- On first appearance the segments grow from the left edge, one after another, and the total and percentages count up from zero.
- With new data or a part turned off, the segments slide with a no-overshoot spring to the new widths; the one turned off folds away until it disappears where it was.
- The focused segment grows 3 px up and down and the tooltip slides to it; with “reduce motion”, widths and numbers change immediately.

## Responsive behavior

- The bar measures the container's width, and the legend is a grid with columns of at least 232 px, which becomes a single column when space runs short.

## Notes for AI

- Each part is `{ key, label, value, color? }` in the order it should appear; parts with a zero value stay out of the bar and appear in the legend as “Hidden”, so filter beforehand.
- Total and percentages are computed over the visible parts: turning one off decreases the title total; control with `hiddenKeys` and `onHiddenChange`, or use `defaultHiddenKeys`.
- The first four parts use `--series-1` to `--series-4` and the following ones, three neutral tones that repeat from the eighth: group the rest into “Other” or pass `color`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/composition-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
