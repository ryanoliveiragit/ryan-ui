# Sankey chart

> Diagrama de fluxo em colunas: as faixas têm a espessura do valor e, ao passar o mouse, só o caminho escolhido fica aceso.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/sankey-chart
- Original description: Flow diagram with nodes in columns joined by curved ribbons sized by value: ribbons draw in column by column, and hovering a node or ribbon dims everything else.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sankey-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sankey-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sankey-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sankey-chart.json`. Registry path, relative to the site address: `r/sankey-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/sankey-chart/sankey-chart.tsx`
  - `components/ryan-ui/sankey-chart/sankey-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/sankey-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing how a total splits and recombines across two or more stages: traffic source, landing page, and outcome.
- When the reader needs to follow a path: pointing at a node lights up its ribbons and the nodes at their ends; pointing at a ribbon lights up the two nodes it connects.
- Comparing two periods with the same nodes: when `links` changes, bars and ribbons glide to the new sizes.

## When not to use

- Use [`funnel-chart`](funnel-chart.md) when the flow is a single sequence of stages and what matters is the loss between one and the next.
- Use [`composition-chart`](composition-chart.md) or [`donut-chart`](donut-chart.md) when the total splits only once, with no following stages.
- Flows that return to an earlier stage don't fit: the layout puts each node in a column, left to right, by the longest path from the source.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import SankeyChart, { type SankeyLink, type SankeyNode } from "@/components/ryan-ui/sankey-chart/sankey-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface, type DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const nodes: SankeyNode[] = [
  { id: "search", label: "Organic search" },
  { id: "ads", label: "Paid ads" },
  { id: "social", label: "Social" },
  { id: "email", label: "Email" },
  { id: "home", label: "Home" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
  { id: "signup", label: "Signed up" },
  { id: "browse", label: "Browsed" },
  { id: "bounce", label: "Bounced" },
];

const flow = (source: string, target: string, value: number): SankeyLink => ({ source, target, value });
const weeks: Record<string, SankeyLink[]> = {
  current: [
    flow("search", "home", 2100), flow("search", "pricing", 800), flow("search", "blog", 2300),
    flow("ads", "home", 1200), flow("ads", "pricing", 1900),
    flow("social", "home", 900), flow("social", "blog", 1500),
    flow("email", "pricing", 1100), flow("email", "blog", 600),
    flow("home", "signup", 900), flow("home", "browse", 1800), flow("home", "bounce", 1500),
    flow("pricing", "signup", 1700), flow("pricing", "browse", 1300), flow("pricing", "bounce", 800),
    flow("blog", "signup", 500), flow("blog", "browse", 1600), flow("blog", "bounce", 2300),
  ],
  previous: [
    flow("search", "home", 1800), flow("search", "pricing", 700), flow("search", "blog", 2900),
    flow("ads", "home", 800), flow("ads", "pricing", 1400),
    flow("social", "home", 1300), flow("social", "blog", 2200),
    flow("email", "pricing", 900), flow("email", "blog", 400),
    flow("home", "signup", 700), flow("home", "browse", 1700), flow("home", "bounce", 1500),
    flow("pricing", "signup", 1300), flow("pricing", "browse", 1100), flow("pricing", "bounce", 600),
    flow("blog", "signup", 600), flow("blog", "browse", 2100), flow("blog", "bounce", 2800),
  ],
};

export default function SankeyChartDemo() {
  const [week, setWeek] = useState("current");
  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Week" value={week} onValueChange={setWeek} options={[{ value: "current", label: "This week" }, { value: "previous", label: "Last week" }]} />
      <Surface>
        <SankeyChart nodes={nodes} links={weeks[week] ?? []} label="Visits by source, landing page and outcome" columns={["Source", "Landing page", "Outcome"]} unit="visits" />
      </Surface>
      <Caption>Hover a node or a ribbon to trace its flows. Focus the chart and use the arrow keys to walk the nodes.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SankeyChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` (required) | `SankeyNode[]` | — | Every node, in the order they should stack inside the first column. |
| `links` (required) | `SankeyLink[]` | — | Flows between nodes. One link per source and target pair. |
| `label` (required) | `string` | — | What flows, such as "Visits by source and outcome". Names the chart for assistive technology. |
| `columns` | `string[]` | — | Optional heading above each column, such as ["Source", "Landing page", "Outcome"]. |
| `height` | `number` | `300` | Plot height in pixels. |
| `nodeWidth` | `number` | `10` | Width of each node bar in pixels. |
| `nodeGap` | `number` | `16` | Vertical space between nodes of one column in pixels. |
| `unit` | `string` | `""` | Unit after each value, such as "visits". |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | Formats values in labels, the tooltip and the table. |
| `activeId` | `string \| null` | — | Controlled item in focus: a node id, or a link id written as "source>target". The rest dims while one is in focus. |
| `defaultActiveId` | `string \| null` | `null` | Item in focus on first render when uncontrolled. |
| `onActiveChange` | `(id: string \| null) => void` | — | Called when hover, touch or the keyboard moves the focus to another node or ribbon, or clears it. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `SankeyNode`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable identity, used by links. A node that survives a data change keeps its place and morphs. |
| `label` (required) | `string` | Name beside the node, in the tooltip and in the table. |
| `color` | `string` | Any CSS color. First-column nodes default to the shared --series-* palette; later nodes default to a neutral ink. |

#### `SankeyLink`

| Field | Type | Description |
| --- | --- | --- |
| `source` (required) | `string` | Id of the node the flow leaves. |
| `target` (required) | `string` | Id of the node the flow enters. |
| `value` (required) | `number` | Size of the flow. The ribbon is as thick as this value on the shared scale. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on the chart, move to the previous or next node, column by column. |
| `←` or `→` | Jump to the vertically nearest node in the previous or next column. |
| `Home` or `End` | Go to the first or last node. |
| `Esc` | Removes the highlight. |

## Accessibility

- The chart is a focusable vertical `role="slider"`: on receiving focus by keyboard, it highlights the first node, and `aria-valuetext` reads the current node's name, value, and column.
- The keyboard moves through nodes only; ribbons respond to the pointer or to `activeId`, and all flows are in a hidden table for screen readers.
- The `label` becomes the `<figure>`'s hidden caption; the tooltip texts (`Total`, `To`, `From`, `Flow`) and the slider's name are hardcoded in English.

## Motion

- The first time on screen, the node bars grow from the center and the ribbons draw out from the source, one column after another.
- After that, data changes don't repeat the entrance: nodes, ribbons, and labels that still exist glide on a spring to the new position and thickness.
- With “reduced motion” on, everything is drawn directly in the final state and the highlight changes without a transition.

## Responsive behavior

- The width follows the container and the height is the `height` prop (300 px); columns split the width equally, so many stages in little space squeeze the labels.
- When the space between columns tightens, labels switch to `--text-xs` and are truncated with an ellipsis; the value beside the name only appears with 100 px free.

## Performance

- The layout is recomputed when `nodes`, `links`, or the width change; keep both arrays stable (a constant or `useMemo`) so it isn't rebuilt on every render.

## Notes for AI

- Pass `nodes` (`{ id, label, color? }`) and `links` (`{ source, target, value }`), with a single link per source and target pair: the link's id is `source>target`.
- The order of `nodes` sets the stacking of the first column and `columns` provides the titles; nodes with no flow and links with zero or negative value are ignored.
- Only the first four nodes in the first column get a series color (`--series-1` through `--series-4`); the rest stay in a neutral tone unless you pass `color`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/sankey-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
