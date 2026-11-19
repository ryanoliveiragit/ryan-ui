# Donut chart

> Gráfico de rosca cujos arcos se transformam entre conjuntos de dados, com o valor ativo rolando no centro.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/donut-chart
- Original description: A donut whose arcs morph between datasets, with the active value rolling into the center.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/donut-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/donut-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/donut-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/donut-chart.json`. Registry path, relative to the site address: `r/donut-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/donut-chart/donut-chart.tsx`
  - `components/ryan-ui/donut-chart/donut-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/donut-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A few parts of a whole (up to about six), when each slice's share matters more than the exact comparison between values.
- Switching between datasets with the same keys (month by month, plan by plan): the arcs transform instead of redrawing.
- When the user needs to hide categories in the legend to see how the rest of the ring redistributes.

## When not to use

- Use [`composition-chart`](composition-chart.md) when the space is a horizontal strip: the same parts fit in a stacked bar with a legend.
- Use [`treemap`](treemap.md) when there are many parts or hierarchy levels; here, whatever falls below `groupBelow` or beyond `maxSegments` is grouped into “Other”.
- Use [`gauge`](gauge.md) for a single value against a known range; the donut splits a total into parts.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import DonutChart, { type DonutChartDatum } from "@/components/ryan-ui/donut-chart/donut-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const datasets: Record<string, DonutChartDatum[]> = {
  august: [
    { key: "search", label: "Organic search", value: 48200 },
    { key: "direct", label: "Direct", value: 31400 },
    { key: "social", label: "Social", value: 14800 },
    { key: "email", label: "Email", value: 11900 },
    { key: "referral", label: "Referral", value: 8300 },
    { key: "ads", label: "Paid ads", value: 2100 },
  ],
  september: [
    { key: "search", label: "Organic search", value: 52600 },
    { key: "direct", label: "Direct", value: 29800 },
    { key: "social", label: "Social", value: 21700 },
    { key: "email", label: "Email", value: 9400 },
    { key: "referral", label: "Referral", value: 10200 },
    { key: "ads", label: "Paid ads", value: 6500 },
  ],
};

export default function DonutChartDemo() {
  const [month, setMonth] = useState("august");
  return (
    <Stack gap={4} width={520}>
      <SegmentedControl label="Month" value={month} onValueChange={setMonth} options={[{ value: "august", label: "August" }, { value: "september", label: "September" }]} />
      <Surface>
        <DonutChart data={datasets[month] ?? []} label="Visits by source" unit="visits" totalLabel="Total visits" />
      </Surface>
      <Caption>Hover a segment or legend row to read it in the center; click a legend row to hide it.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `DonutChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `DonutChartDatum[]` | — | — |
| `label` (required) | `string` | — | What the whole is, such as "Visits by source". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after values, such as "visits". |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | — |
| `totalLabel` | `string` | `"Total"` | Center label at rest, above the total. |
| `size` | `number` | `208` | Diameter in pixels. The chart scales down to fit narrower containers. |
| `thickness` | `number` | `24` | Ring thickness in pixels. |
| `groupBelow` | `number` | `.04` | Segments below this share of the total join "Other". |
| `maxSegments` | `number` | `6` | The most segments drawn, counting "Other". The smallest parts beyond it are grouped. |
| `otherLabel` | `string` | `"Other"` | — |
| `activeKey` | `string \| null` | — | Controlled selected segment key. Hover and focus preview other segments without changing it. |
| `defaultActiveKey` | `string \| null` | `null` | — |
| `onActiveChange` | `(key: string \| null) => void` | — | — |
| `hiddenKeys` | `string[]` | — | Controlled hidden segment keys. A hidden segment closes and the rest of the ring redistributes. |
| `defaultHiddenKeys` | `string[]` | — | — |
| `onHiddenKeysChange` | `(keys: string[]) => void` | — | — |
| `legendAction` | `"toggle" \| "select"` | `"toggle"` | What clicking a legend row does: show or hide its segment, or pin it as the selected segment. |
| `legend` | `boolean` | `true` | The synced legend beside or below the ring. |
| `emptyLabel` | `string` | `"No data yet"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `DonutChartDatum`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. A segment whose key survives a data change keeps its place and color, so switching datasets morphs the arcs. |
| `label` (required) | `string` | — |
| `value` (required) | `number` | — |
| `color` | `string` | Any CSS color. Segments default to the shared --series-* palette in data order, then neutral steps. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `←` or `→` | Move focus between the legend rows, wrapping at the ends; the focused row highlights the arc and appears in the center. |
| `Home` or `End` | Go to the first and last legend rows. |
| `Enter` or `Space` | In the legend, hide or show the segment (`legendAction="toggle"`) or pin it as selected (`legendAction="select"`). |
| `Esc` | Clears the pinned selection. |

## Accessibility

- The SVG is decorative (`aria-hidden`): the screen reader gets a summary with the total and slices, a hidden table with segment, value, and share, and `aria-live` announcements when a segment is shown or hidden.
- Each legend row is a button with `aria-pressed` and an `aria-label` with name, value, and percentage; with `legend={false}`, the ring becomes a focusable group where the arrow keys read each segment and `Enter` or `Space` pins it.
- `label` is required and names the figure; the texts generated for screen readers (“hidden”, “Segment”, “Includes…”) are hardcoded in English.

## Motion

- The first time 35% of the chart enters the viewport, the arcs open from the top in a single sweep, with each arc's trailing edge a moment behind the previous one.
- When `data` changes or a segment is hidden, each arc moves from where it is to the new angle on a spring with no overshoot; equal keys keep position and color, and the segment that leaves closes until it disappears.
- The active segment slides outward and thickens while the others fade, and the center changes its readout by rolling like a drum; with “reduced motion”, all of this changes instantly.

## Responsive behavior

- The figure is a container (`container-type: inline-size`): at 460 px or more the legend sits beside the ring; below that, it goes underneath.
- The ring is `size` px in diameter (208 by default) and shrinks to fit narrower containers; long labels in the center are truncated with an ellipsis.

## Performance

- During animations, shapes are written straight to the DOM, one paint per frame, and numbers straight to the text: no frame re-renders React.

## Notes for AI

- `label` is required, and each item in `data` needs a stable `key`, `label`, and `value`; zero or negative values are discarded.
- Selection (`activeKey`, `onActiveChange`) and hidden segments (`hiddenKeys`, `onHiddenKeysChange`) can be controlled or uncontrolled; the cursor only previews, clicking an arc pins or releases the selection, and the last visible segment is never hidden.
- Colors follow `--series-1` through `--series-4` and then neutral tones (pass `color` on the item to go beyond); a parent with a width is enough, since the height comes from the content.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/donut-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
