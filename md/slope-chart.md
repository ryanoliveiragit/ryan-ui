# Slope chart

> Antes e depois em dois eixos, com variação de posição ao lado de cada valor.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/slope-chart
- Original description: Before and after on two axes: lines draw in, rank moves sit beside each value, and switching datasets slides every line to its new slope.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slope-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slope-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slope-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slope-chart.json`. Registry path, relative to the site address: `r/slope-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/slope-chart/slope-chart.tsx`
  - `components/ryan-ui/slope-chart/slope-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/slope-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing how several items changed between exactly two moments: before and after, one quarter and the next.
- When the change in rank counts as much as the value: the arrow beside each final value says how many positions the item rose or fell.
- Telling the story of one item among the others: `highlightKey` paints one line in the accent color and leaves the rest neutral.

## When not to use

- Use [`bump-chart`](bump-chart.md) when the ranking changes over three or more periods.
- Use [`line-chart`](line-chart.md) when there are intermediate values and the path between the extremes matters.
- Use [`bar-chart`](bar-chart.md) to compare the items at a single moment, with no before and after.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import SlopeChart, { type SlopeItem } from "@/components/ryan-ui/slope-chart/slope-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const channels = {
  h1: { start: "Q1", end: "Q2", data: [
    { key: "email", label: "Email", start: 4.8, end: 5.6 },
    { key: "search", label: "Organic search", start: 3.9, end: 4.2 },
    { key: "referral", label: "Referral", start: 3.1, end: 3.9 },
    { key: "social", label: "Social", start: 2.2, end: 1.8 },
    { key: "paid", label: "Paid ads", start: 2.6, end: 2.1 },
    { key: "direct", label: "Direct", start: 3.5, end: 3.4 },
  ] as SlopeItem[] },
  h2: { start: "Q3", end: "Q4", data: [
    { key: "email", label: "Email", start: 5.8, end: 6.4 },
    { key: "search", label: "Organic search", start: 4.3, end: 4.0 },
    { key: "referral", label: "Referral", start: 4.0, end: 4.9 },
    { key: "social", label: "Social", start: 1.9, end: 2.7 },
    { key: "paid", label: "Paid ads", start: 2.0, end: 3.2 },
    { key: "direct", label: "Direct", start: 3.3, end: 3.1 },
  ] as SlopeItem[] },
};

export default function SlopeChartDemo() {
  const [half, setHalf] = useState<"h1" | "h2">("h1");
  const c = channels[half];
  return (
    <Stack gap={4} width={560}>
      <SegmentedControl label="Period" value={half} onValueChange={(v) => setHalf(v as "h1" | "h2")} options={[{ value: "h1", label: "Q1 to Q2" }, { value: "h2", label: "Q3 to Q4" }]} />
      <Surface>
        <SlopeChart data={c.data} label="Conversion rate by channel" startLabel={c.start} endLabel={c.end} highlightKey="email" formatValue={(v) => `${v.toFixed(1)}%`} />
      </Surface>
      <Caption>Email is highlighted. Hover a line to focus it, or switch quarters to slide every line to its new slope.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SlopeChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `SlopeItem[]` | — | — |
| `label` (required) | `string` | — | What is measured, such as "Conversion rate by channel". Names the chart for assistive technology. |
| `startLabel` (required) | `string` | — | Heading of the first column, such as "Q1". |
| `endLabel` (required) | `string` | — | Heading of the second column, such as "Q2". |
| `formatValue` | `(value: number) => string` | — | — |
| `formatChange` | `(change: number, item: SlopeItem) => string` | — | Formats the change in the tooltip. Defaults to the difference in formatValue's terms. |
| `height` | `number` | — | Plot height in pixels. Defaults to 44 pixels per item. |
| `highlightKey` | `string \| null` | `null` | The item drawn in the accent, such as the one the story is about. |
| `activeKey` | `string \| null` | — | Controlled item in focus. The others fade while one is in focus. |
| `onActiveChange` | `(key: string \| null) => void` | — | — |
| `ranks` | `boolean` | `true` | Rank movement beside each end value. |
| `emptyLabel` | `string` | `"No data"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `SlopeItem`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity. An item keeps its line across datasets, so switching morphs it. |
| `label` (required) | `string` | Name beside the start value, in the tooltip, and in the table. |
| `start` (required) | `number` | Value in the first period. |
| `end` (required) | `number` | Value in the second period. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `→` | With focus on the chart, highlight the next item, in final-value order. |
| `↑` or `←` | Highlight the previous item. |
| `Home` or `End` | Go to the first or last item in that order. |
| `Esc` | Clears the highlight and hides the tooltip. |

## Accessibility

- The chart area is a focusable group with `aria-roledescription="slope chart"`; on receiving focus by keyboard, it highlights the first item in final-value order.
- An `aria-live="polite"` region reads the highlighted item (name, both values, change, and rank change), and a hidden summary and table carry all items.
- The rank phrases, such as `up 2 to rank 1`, are hardcoded in English and also appear in the visible tooltip.

## Motion

- On entering the viewport, the starting points appear in sequence, each line draws from left to right, and only then do the final point and label appear.
- When swapping `data` while keeping the same `key`s, lines, points, and labels glide on a spring to the new slope, and the rank-change number rolls to the new value.
- With “reduced motion” on, the chart appears ready and data and highlight changes are immediate.

## Responsive behavior

- The width follows the container; below 440 px the label columns shrink and the text switches to `--text-xs`, with ellipses on long names.
- The default height is 44 px per item, with a minimum of 200 px (`height` sets another value); labels that would overlap are pushed apart and tied to the point by a stroke.

## Notes for AI

- Pass `data` as `{ key, label, start, end }` and the column titles in `startLabel` and `endLabel`; both sides use the same value axis.
- Keep `key` stable between datasets so lines transform instead of vanishing and reappearing; `formatValue` and `formatChange` handle unit and sign.
- `activeKey` exists only in the controlled form, with `onActiveChange`; without it the highlight is internal and disappears when leaving the chart, and `ranks={false}` hides the rank arrows.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/slope-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
