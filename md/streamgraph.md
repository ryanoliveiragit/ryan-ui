# Streamgraph

> Camadas fluidas que se transformam entre períodos, com uma camada para isolar e ler semana a semana.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/streamgraph
- Original description: Layered streams on a wiggle baseline that morph between ranges, with a layer you can isolate and read week by week.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streamgraph.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streamgraph.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streamgraph.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/streamgraph.json`. Registry path, relative to the site address: `r/streamgraph.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/streamgraph/streamgraph.tsx`
  - `components/ryan-ui/streamgraph/streamgraph.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/streamgraph.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing how the mix of several parts changes over time, when the overall shape matters more than exact values: tickets by topic, traffic by channel.
- When the reader wants to isolate one part: pointing at a layer or its legend entry fades the others, and the tooltip reads values point by point.
- Switching between periods of different lengths: layers are resampled onto a common grid and transform from one dataset to the other.

## When not to use

- Use [`line-chart`](line-chart.md) when the reader needs to compare exact values across series: here only the layer's thickness is readable, and the baseline undulates.
- Use [`bump-chart`](bump-chart.md) when what matters is each series' ranking position in each period.
- Use [`composition-chart`](composition-chart.md) or [`donut-chart`](donut-chart.md) for the split of a total at a single moment.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import Streamgraph, { type StreamgraphDatum, type StreamgraphSeries } from "@/components/ryan-ui/streamgraph/streamgraph";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const series: StreamgraphSeries[] = [
  { key: "billing", label: "Billing" },
  { key: "login", label: "Login" },
  { key: "bugs", label: "Bugs" },
  { key: "howto", label: "How-to" },
  { key: "api", label: "API" },
];
const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function build(weeks: number, startMs: number, seed: number): StreamgraphDatum[] {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const bases = [60, 38, 52, 44, 26];
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(startMs + i * 7 * 86400000);
    const values: Record<string, number> = {};
    series.forEach((sr, k) => {
      values[sr.key] = Math.round((bases[k] ?? 40) * (1 + 0.45 * Math.sin(i / 2.5 + k * 1.3)) + rand() * 10);
    });
    return { key: d.toISOString().slice(0, 10), label: `Week of ${fmt.format(d)}`, axisLabel: i % 3 === 0 ? fmt.format(d) : undefined, values };
  });
}

export default function StreamgraphDemo() {
  const sets = useMemo(() => ({ q3: build(13, Date.UTC(2026, 6, 6), 4), q4: build(13, Date.UTC(2026, 9, 5), 12) }), []);
  const [q, setQ] = useState<"q3" | "q4">("q3");
  return (
    <Stack gap={4} width={760}>
      <SegmentedControl label="Quarter" value={q} onValueChange={(v) => setQ(v as "q3" | "q4")} options={[{ value: "q3", label: "Q3 2026" }, { value: "q4", label: "Q4 2026" }]} />
      <Surface>
        <Streamgraph data={sets[q]} series={series} label="Support tickets by topic" unit="tickets" />
      </Surface>
      <Caption>Hover a layer to isolate it and read it week by week; toggle topics in the legend; switch quarters to morph.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Streamgraph`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `StreamgraphDatum[]` | — | — |
| `series` (required) | `StreamgraphSeries[]` | — | Layers from the centre out: the first runs through the middle of the stream, the rest alternate above and below it. |
| `label` (required) | `string` | — | What is measured, such as "Support tickets by topic". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after each value, such as "tickets". |
| `height` | `number` | `260` | Plot height in pixels. The width follows the container. |
| `offset` | `"wiggle" \| "silhouette" \| "zero"` | `"wiggle"` | "wiggle" minimises layer slopes for a flowing stream, "silhouette" centres the stack, "zero" stacks from a flat baseline. |
| `formatValue` | `(value: number, series: StreamgraphSeries) => string` | — | — |
| `hiddenSeries` | `string[]` | — | Controlled hidden layer keys. A hidden layer thins to nothing and the rest reflow. |
| `defaultHiddenSeries` | `string[]` | — | — |
| `onHiddenSeriesChange` | `(hidden: string[]) => void` | — | — |
| `onActiveChange` | `(index: number \| null, seriesKey: string \| null) => void` | — | Called as the reading moves, and with nulls when it leaves. |
| `legend` | `boolean` | `true` | Layer toggles above the plot. |
| `directLabels` | `boolean` | `true` | Names each layer inside its widest stretch when it is thick enough to hold the text. |
| `categoryLabel` | `string` | `"Date"` | Header of the first column in the screen reader table. |
| `emptyLabel` | `string` | `"No data for this range"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `StreamgraphSeries`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A layer keeps its place and color across data changes, so switching datasets morphs it. |
| `label` (required) | `string` | Name in the legend, the direct label, the tooltip, and the data table. |
| `color` | `string` | Any CSS color. Defaults to the chart series for the first four layers (the first in the accent), then neutral steps. |

#### `StreamgraphDatum`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity, such as an ISO week. |
| `label` (required) | `string` | Full label for the tooltip and screen readers, such as "Week of Sep 14". |
| `axisLabel` | `string` | Short label on the time axis. Leave it out to keep the axis quiet at that point. |
| `values` (required) | `Record<string, number \| undefined>` | One value per series key. Missing values count as zero; negatives are treated as zero. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | With focus on the chart, step back or forward one point in time. |
| `↑` or `↓` | Switch the highlighted layer, following the order of `series`. |
| `Page Up` or `Page Down` | Move forward or back about a sixth of the period. |
| `Home` or `End` | Go to the first or last point. |
| `Enter` or `Space` | In the legend, hide or show the focused button's layer. |
| `Esc` | Ends the reading and hides the tooltip. |

## Accessibility

- The chart area is a focusable group with `aria-roledescription="stream graph"`; on receiving focus by keyboard, reading starts at the most recent point.
- An `aria-live="polite"` region reads the current point, the highlighted layer with its value, and the total; a hidden summary and table carry all the data.
- The legend is a group of buttons with `aria-pressed` (pressed = layer visible); the table's first column header comes from `categoryLabel`, which defaults to `Date`.

## Motion

- The first time on screen, the flow opens from a thread along the center; new data makes each layer transform on a spring from its current shape.
- Hiding a layer through the legend thins it until it vanishes while the others close the gap; the crosshair glides between points and the tooltip follows on its own spring.
- With “reduced motion” on, layers go straight to the final state and the crosshair and tooltip jump.

## Responsive behavior

- The width follows the container and the height is the `height` prop (260 px); the axis shows at most one `axisLabel` every 72 px, counting from the most recent.
- The name inside a layer only appears where it is at least 19 px thick and the text fits; on thin layers, identification is left to the legend and tooltip.

## Performance

- Drawing is imperative: on every animation frame all layers have their path rebuilt with 161 samples and the baseline recomputed, so the cost grows with the number of layers.

## Notes for AI

- Pass `series` (`{ key, label, color? }`) and `data` with a `values` object per point, indexed by the series `key`; missing or negative values count as zero.
- The order of `series` runs from the center outward: the first runs through the middle and the rest alternate above and below; only the first four get a series color, and the rest stay neutral without `color`.
- `offset="zero"` stacks from a straight base and `offset="silhouette"` centers the stack; `hiddenSeries` with `onHiddenSeriesChange` controls the hidden layers.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/streamgraph · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
