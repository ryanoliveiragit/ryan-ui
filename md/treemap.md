# Treemap

> Mapa de árvore em blocos: clique para detalhar e os blocos crescem até preencher a vista.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/treemap
- Original description: A squarified treemap: click to drill and the tiles grow to fill the view, with a breadcrumb back and metrics that morph every tile.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/treemap.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/treemap.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/treemap.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/treemap.json`. Registry path, relative to the site address: `r/treemap.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/treemap/treemap.tsx`
  - `components/ryan-ui/treemap/treemap.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/treemap.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing a hierarchy of parts of a whole, such as revenue by business line and product, when relative size matters more than exact comparisons.
- Exploring by levels: clicking a block zooms that branch to fill the view, and the breadcrumb at the top goes back to any level above.
- Showing a second measure, such as growth, in color intensity, with `colorLabel` and a stepped scale below the chart.

## When not to use

- Use [`bar-chart`](bar-chart.md) when the reader needs to compare values precisely: areas are hard to compare by eye.
- Use [`composition-chart`](composition-chart.md) or [`donut-chart`](donut-chart.md) for a few parts at a single level.
- Use [`tree-table`](tree-table.md) when each node of the hierarchy needs exact numbers in columns.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import Treemap, { type TreemapNode } from "@/components/ryan-ui/treemap/treemap";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

type Leaf = [string, string, number, number, number, number]; // id, label, value 2025, value 2026, growth 2025, growth 2026
const groups: { id: string; label: string; items: Leaf[] }[] = [
  { id: "software", label: "Software", items: [
    ["saas", "Subscriptions", 420, 510, 0.18, 0.21],
    ["licenses", "Licenses", 180, 150, -0.06, -0.17],
    ["marketplace", "Marketplace", 90, 130, 0.32, 0.44],
  ] },
  { id: "services", label: "Services", items: [
    ["consulting", "Consulting", 210, 225, 0.05, 0.07],
    ["training", "Training", 70, 95, 0.12, 0.36],
    ["support", "Premium support", 140, 160, 0.09, 0.14],
  ] },
  { id: "hardware", label: "Hardware", items: [
    ["devices", "Devices", 230, 190, -0.08, -0.17],
    ["accessories", "Accessories", 85, 80, 0.02, -0.06],
  ] },
  { id: "partners", label: "Partners", items: [
    ["resellers", "Resellers", 160, 185, 0.1, 0.16],
    ["affiliates", "Affiliates", 55, 75, 0.2, 0.36],
  ] },
];

function tree(year: 0 | 1): TreemapNode {
  return {
    id: "root",
    label: "Revenue",
    children: groups.map((g) => ({
      id: g.id,
      label: g.label,
      children: g.items.map((i) => ({ id: i[0], label: i[1], value: year ? i[3] : i[2], color: year ? i[5] : i[4] })),
    })),
  };
}

export default function TreemapDemo() {
  const [year, setYear] = useState<"2025" | "2026">("2025");
  const data = useMemo(() => tree(year === "2025" ? 0 : 1), [year]);
  return (
    <Stack gap={4} width={760}>
      <SegmentedControl label="Year" value={year} onValueChange={(v) => setYear(v as "2025" | "2026")} options={[{ value: "2025", label: "2025" }, { value: "2026", label: "2026" }]} />
      <Surface>
        <Treemap
          data={data}
          label="Revenue by line of business"
          formatValue={(v) => `$${v}K`}
          colorLabel="Growth"
          formatColor={(v) => `${v > 0 ? "+" : ""}${Math.round(v * 100)}%`}
          height={340}
        />
      </Surface>
      <Caption>Click a block to drill in and use the breadcrumb to climb back. Shading shows growth; switch years to morph the tiles.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Treemap`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `TreemapNode` | — | The root. Its label names the whole in the first breadcrumb. |
| `label` (required) | `string` | — | What the whole is, such as "Revenue". Names the chart for assistive technology. |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | — |
| `colorLabel` | `string` | — | Names the shading measure in the tooltip and scale, such as "Growth". Tiles take the hue of their top level branch and grow deeper with the measure. Leave it out to draw every tile at one depth. |
| `formatColor` | `(value: number) => string` | `value => grouped.format(value)` | — |
| `colorDomain` | `[number, number]` | — | Range of the color measure. Defaults to the range of the leaves. |
| `focus` | `string` | — | Controlled id of the node that fills the view. |
| `defaultFocus` | `string` | — | — |
| `onFocusChange` | `(id: string) => void` | — | — |
| `height` | `number` | `420` | Height of the tiles in pixels. |
| `emptyLabel` | `string` | `"No data yet"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `TreemapNode`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable identity, unique in the tree. A tile that survives a data change morphs to its new size. |
| `label` (required) | `string` | — |
| `value` | `number` | Leaf size. A branch's size is the sum of its children. |
| `color` | `number` | Optional second measure for shading, such as growth. A branch uses the size weighted mean of its children. |
| `children` | `TreemapNode[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` or `↑` or `↓` | With focus on the chart, jump to the nearest first-level block in that direction. |
| `Home` or `End` | Go to the first or last first-level block, in the order of `data`. |
| `Enter` or `Space` | Zoom into the focused block, when it has children, and move the highlight to the first child. |
| `Esc` or `Backspace` | Go up one level and highlight the block it came from; at the root, remove the highlight. |

## Accessibility

- The block area is a focusable group with `aria-roledescription="treemap"` and the instructions in its name, in English; the keyboard moves through the first-level blocks of the view only.
- An `aria-live="polite"` region reads the active block (path, value, share of its parent, and the color measure), and a hidden table lists all nodes with path and values.
- The breadcrumb is a `<nav>` with an ordered list and `aria-current="location"` on the current level; the tooltip is decorative (`aria-hidden`).

## Motion

- The first time on screen, blocks grow from their own center, in a quick wave that starts with the largest.
- When zooming in, the chosen block grows to fill the view and the children appear; when going back, the view shrinks to it; with new data, each block resizes in place.
- With “reduced motion” on, each change goes straight to the final layout, the tooltip doesn't glide, and the breadcrumb swaps without displacement.

## Responsive behavior

- The width follows the container and the height is fixed by `height` (420 px); name and value only appear on blocks with room (over 64 × 38 px), and small ones depend on the tooltip.
- On touch there is no hover tooltip: tapping a block zooms into its branch, and tapping a first-level leaf shows its numbers.

## Performance

- Every node in the tree has a DOM element, even out of view, `data` is serialized on every render, and the animation repositions blocks in JavaScript on every frame; with thousands of leaves, aggregate first.

## Notes for AI

- Pass a root in `data` (`{ id, label, children }`) with `value` only on leaves: a branch's value is the sum of its children, and the root's `label` starts the breadcrumb.
- To color by the second measure, give `color` to the leaves and pass `colorLabel` (and `formatColor`); the first four branches get a series hue and the rest stay neutral.
- `focus` with `onFocusChange` controls the zoomed branch (a leaf id shows the root); keep the `id`s stable between datasets so blocks transform instead of reappearing.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/treemap · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
