# Bump chart

> Ranking ao longo do tempo: as linhas trocam de posição a cada período e a série escolhida vem para a frente.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/bump-chart
- Original description: Ranking over time: lines swap positions between periods, draw in from the first period, and hovering a series brings it forward with its rank at every period.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bump-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bump-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bump-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bump-chart.json`. Registry path, relative to the site address: `r/bump-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/bump-chart/bump-chart.tsx`
  - `components/ryan-ui/bump-chart/bump-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/bump-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- When order matters more than values: who led, who overtook whom, and in which period.
- Rankings by period with few items, such as regions by month or teams by round, with each series' name at the end of its line.
- Switch the ranking measure while keeping the items: series with the same `key` slide to the new positions.

## When not to use

- Use [`line-chart`](line-chart.md) when the distance between values matters: here only the position appears in the drawing.
- Use [`slope-chart`](slope-chart.md) to compare exactly two moments.
- Use [`sortable-data-table`](sortable-data-table.md) for the ranking of a single period with several columns.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import BumpChart, { type BumpSeries } from "@/components/ryan-ui/bump-chart/bump-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const region = (key: string, label: string, values: number[]): BumpSeries => ({ key, label, values });
const metrics: Record<string, { label: string; format: (value: number) => string; series: BumpSeries[] }> = {
  revenue: {
    label: "Sales regions ranked by monthly revenue",
    format: (value) => `$${value}k`,
    series: [
      region("online", "Online", [240, 286, 338, 381, 426, 472]),
      region("west", "West", [430, 419, 436, 450, 438, 447]),
      region("northeast", "Northeast", [412, 428, 405, 398, 441, 456]),
      region("southeast", "Southeast", [388, 395, 418, 432, 420, 415]),
      region("midwest", "Midwest", [301, 322, 340, 365, 402, 430]),
      region("southwest", "Southwest", [355, 340, 332, 318, 305, 298]),
    ],
  },
  customers: {
    label: "Sales regions ranked by new customers",
    format: (value) => `${value} new`,
    series: [
      region("online", "Online", [58, 79, 100, 112, 121, 138]),
      region("west", "West", [110, 104, 98, 95, 102, 94]),
      region("northeast", "Northeast", [96, 88, 91, 84, 80, 86]),
      region("southeast", "Southeast", [72, 85, 93, 101, 97, 92]),
      region("midwest", "Midwest", [64, 70, 66, 78, 88, 99]),
      region("southwest", "Southwest", [81, 76, 70, 73, 69, 62]),
    ],
  },
};

export default function BumpChartDemo() {
  const [metric, setMetric] = useState("revenue");
  const current = metrics[metric] ?? metrics.revenue;
  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Rank by" value={metric} onValueChange={setMetric} options={[{ value: "revenue", label: "Revenue" }, { value: "customers", label: "New customers" }]} />
      <Surface>
        {current && <BumpChart series={current.series} periods={months} label={current.label} formatValue={current.format} />}
      </Surface>
      <Caption>Hover a line to bring that region forward with its rank in every month. Switching the measure slides each line to its new places.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BumpChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `series` (required) | `BumpSeries[]` | — | The items being ranked. |
| `periods` (required) | `string[]` | — | Label of each period on the axis, such as ["Jun", "Jul", "Aug"]. |
| `label` (required) | `string` | — | What is ranked, such as "Regions ranked by monthly revenue". Names the chart for assistive technology. |
| `order` | `"desc" \| "asc"` | `"desc"` | "desc" ranks the highest value first; "asc" ranks the lowest first, for times or costs. |
| `rowHeight` | `number` | `40` | Vertical distance between two ranks in pixels. |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | Formats the value behind a rank in the tooltip and the table. |
| `activeKey` | `string \| null` | — | Controlled key of the series brought forward, or null for none. The others fade while one is forward. |
| `defaultActiveKey` | `string \| null` | `null` | Series brought forward on first render when uncontrolled. |
| `onActiveChange` | `(key: string \| null) => void` | — | Called when hover, touch or the keyboard brings another series forward, or lets go. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `BumpSeries`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A series that survives a data change keeps its line and slides to its new ranks. |
| `label` (required) | `string` | Name at the end of the line, in the tooltip and in the table. |
| `values` (required) | `number[]` | One value per period, in the order of `periods`. Ranks are worked out from these. |
| `color` | `string` | Any CSS color. Series default to the shared --series-* palette in data order, then neutral steps. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves focus to the chart area and brings forward the series that is first in the last period. |
| `↑` or `↓` | Moves to the series one position above or below in the current period. |
| `←` or `→` | Moves to the previous or next period, keeping the series. |
| `Home` or `End` | Moves to the first or last period. |
| `Esc` | Releases the series: all return to the same weight. |

## Accessibility

- The reading area is a vertical `role="slider"` whose `aria-valuetext` states the series, period, position, value, and the change since the previous period.
- A hidden table carries the position and value of each series in each period; `label` is required and names the figure.
- Ordinals and tooltip phrases (“1st of 6”, “Up 2 from Oct”) are generated in English in the code and have no translation prop.

## Motion

- On first appearance each line draws from the first to the last period, one series after another, and the points appear following the stroke.
- When the data changes, lines, points, and names slide with a no-overshoot spring to the new positions; the focused series gets a thicker stroke and a ring with the position in each period, and the others fade.
- With “reduce motion”, everything appears and swaps immediately, and the tooltip jumps instead of sliding.

## Responsive behavior

- The height is `rowHeight` (40 px) times the number of series and the width is the container's; the names column takes up to 36% and truncates with an ellipsis.
- Period labels do not thin out when space runs short: with many periods on a narrow screen they overlap, so use short labels.

## Notes for AI

- Each series is `{ key, label, values, color? }`, with one value per item in `periods` in the same order; positions are computed from the values, and `order="asc"` puts the smallest first (times, costs).
- Focused series: controlled with `activeKey` and `onActiveChange` (`null` for none), or uncontrolled with `defaultActiveKey`.
- The first four series use `--series-1` to `--series-4` and the following ones, three neutral tones that repeat from the eighth: pass `color` if there are more.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/bump-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
