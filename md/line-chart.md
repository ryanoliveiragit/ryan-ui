# Line chart

> Gráfico de várias linhas com mira deslizante, legenda interativa e curvas que se transformam entre períodos.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/line-chart
- Original description: A multi-series line chart with a gliding crosshair, legend toggles, and paths that morph between ranges.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/line-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/line-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/line-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/line-chart.json`. Registry path, relative to the site address: `r/line-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/line-chart/line-chart.tsx`
  - `components/ryan-ui/line-chart/line-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/line-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- One or more measures over time, when the shape of the trend matters more than an isolated value.
- Comparing the current period with the previous one or with a target, using a dashed series (`dashed`).
- Dashboards with a range switch (7, 14, 30 days): with the same `key`s, the lines transform instead of redrawing.

## When not to use

- Use [`sparkline`](sparkline.md) for a compact trend next to a number, with no axes or legend.
- Use [`bar-chart`](bar-chart.md) to compare a measure period by period, reading each bar against the average.
- Use [`brush-chart`](brush-chart.md) for dense series where the user needs to zoom into a time window.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import LineChart, { type LineChartDatum, type LineChartSeries } from "@/components/ryan-ui/line-chart/line-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fmtLong = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

function build(days: number, seed: number): LineChartDatum[] {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const start = Date.UTC(2026, 8, 21) - (days - 1) * 86400000;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start + i * 86400000);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const trend = 1 + (i / days) * 0.5;
    const signups = Math.round((weekend ? 70 : 120) * trend + Math.sin(i / 3) * 12 + rand() * 18);
    const trials = Math.round(signups * 0.62 + rand() * 10);
    const previous = Math.round((weekend ? 60 : 100) + Math.sin(i / 4) * 10 + rand() * 14);
    return {
      key: d.toISOString().slice(0, 10),
      label: fmtLong.format(d),
      axisLabel: i % (days > 10 ? 7 : 2) === 0 ? fmt.format(d) : undefined,
      values: { signups, trials, previous },
    };
  });
}

const sets = { "7": build(7, 3), "14": build(14, 5), "30": build(30, 9) };
const series: LineChartSeries[] = [
  { key: "signups", label: "Signups" },
  { key: "trials", label: "Trials started", color: "var(--series-2)", area: false },
  { key: "previous", label: "Previous period", dashed: true, area: false },
];

export default function LineChartDemo() {
  const [range, setRange] = useState<keyof typeof sets>("14");
  return (
    <Stack gap={4} width={680}>
      <SegmentedControl label="Range" value={range} onValueChange={(v) => setRange(v as keyof typeof sets)} options={[{ value: "7", label: "7 days" }, { value: "14", label: "14 days" }, { value: "30", label: "30 days" }]} />
      <Surface>
        <LineChart data={sets[range]} series={series} label="Signups" unit="" />
      </Surface>
      <Caption>Move across the plot for the crosshair, click a legend entry to hide a line, or change the range to morph the paths.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `LineChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `LineChartDatum[]` | — | — |
| `series` (required) | `LineChartSeries[]` | — | — |
| `label` (required) | `string` | — | What is measured, such as "Signups". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after each value in the tooltip, such as "ms". |
| `height` | `number` | `220` | Plot height in pixels. The width follows the container. |
| `formatValue` | `(value: number, series: LineChartSeries) => string` | — | Formats values in the tooltip and data table. |
| `formatTick` | `(value: number) => string` | `value => compact.format(value)` | Formats the value axis. Defaults to a compact number, such as 1.2K. |
| `hiddenSeries` | `string[]` | — | Controlled hidden series keys. |
| `defaultHiddenSeries` | `string[]` | — | — |
| `onHiddenSeriesChange` | `(hidden: string[]) => void` | — | — |
| `onActiveChange` | `(index: number \| null, datum: LineChartDatum \| null) => void` | — | Called as the crosshair moves, and with null when it leaves. Use it to drive a headline readout. |
| `loading` | `boolean` | `false` | Keeps the current lines on screen, dimmed, while the next range loads. |
| `emptyLabel` | `string` | `"No data for this range"` | Shown when there are no points. |
| `legend` | `boolean` | — | Series toggles above the plot. Shown by default when there is more than one series. |
| `categoryLabel` | `string` | `"Date"` | Header of the first column in the data table read by screen readers. |
| `curve` | `"smooth" \| "linear"` | `"smooth"` | Smooth monotone curves that never swing past the data, or straight segments. |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `LineChartSeries`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A series keeps its line across data changes, so switching ranges morphs the path instead of redrawing it. |
| `label` (required) | `string` | Name in the legend, the tooltip, and the data table. |
| `color` | `string` | Any CSS color. Defaults to the accent for the first series, then quieter neutral steps. |
| `dashed` | `boolean` | Draws a dashed stroke, useful for a previous period or a target. |
| `area` | `boolean` | Fills the area under the line with a faint tint of its color. Defaults to true for the first series. |

#### `LineChartDatum`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity, such as an ISO date. |
| `label` (required) | `string` | Full label for the tooltip and screen readers, such as "Tue, Sep 15". |
| `axisLabel` | `string` | Short label on the x axis, such as "Sep 15". Leave it out to keep the axis quiet at that point. |
| `values` (required) | `Record<string, number \| undefined>` | One value per series key. A missing value counts as zero. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | With focus on the chart, move the crosshair to the previous or next point; `↓` and `↑` do the same. |
| `Page Up` or `Page Down` | `Page Up` moves forward and `Page Down` moves back about a sixth of the points. |
| `Home` or `End` | Go to the first and last point. |
| `Esc` | Releases the crosshair and hides the tooltip. |
| `Enter` or `Space` | On the legend buttons, hide or show the series. |
| `Tab` | Moves through the legend buttons and the chart; on receiving focus by keyboard, the crosshair starts at the most recent point. |

## Accessibility

- The chart area is a `role="slider"` whose `aria-valuetext` reads the current point with the value of each visible series; SVG, axes, and tooltip are `aria-hidden`.
- There is a hidden summary with the range and the last value of each series, and a hidden table with all points, whose first column uses `categoryLabel`.
- The legend buttons use `aria-pressed`, and a hidden series gets a struck-through name, not just a missing color; `label` is required, and `loading` marks the figure with `aria-busy`.

## Motion

- The first time it enters the viewport with data, the lines draw from left to right in about 0.8 s.
- Swapping `data` transforms each line from its current shape, even with a different number of points, while the scale and gridlines readjust; hiding a series flattens it to the baseline.
- The crosshair slides between points and the tooltip follows it on its own spring, switching sides before leaving the chart; with “reduced motion”, all of this is immediate.

## Responsive behavior

- The width follows the container and the height is fixed by the `height` prop (220 px by default); the value axis takes 48 px on the right.
- The date axis shows at most one label every 76 px, counting from the most recent; on touch, pressing and dragging horizontally moves the crosshair.

## Performance

- A single painter writes the paths straight to the SVG on each frame, without re-rendering React; the hidden screen-reader table has one row per point, which is heavy with thousands of points.

## Notes for AI

- `label`, `data`, and `series` are required; each point carries `values` indexed by the series `key`, and a missing value counts as zero, not as a gap.
- Only points with `axisLabel` get an axis label; the first series uses the accent color with a filled area, and the rest stay in neutral tones until they receive `color`.
- Use `onActiveChange` to feed a highlight number outside the chart and `loading` to keep the current lines faded while the next range loads.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/line-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
