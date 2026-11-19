# Comparison table

> Tabela comparativa com cabeçalho fixo, seções recolhíveis e filtro para ver só as diferenças.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/comparison-table
- Original description: An us versus them table with a sticky header, a highlighted column, and a stacked phone view.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comparison-table.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comparison-table.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comparison-table.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comparison-table.json`. Registry path, relative to the site address: `r/comparison-table.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/comparison-table/comparison-table.tsx`
  - `components/ryan-ui/blocks/comparison-table/comparison-table-data.ts`
  - `components/ryan-ui/blocks/comparison-table/comparison-table.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/comparison-table.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A pricing or product page that compares your offering with alternatives, feature by feature, with your column highlighted.
- Long tables where the header must stay visible while scrolling and the “Only differences” option streamlines reading.
- Comparisons that must work on mobile: below `stackBelow`, only your column and one competitor, chosen by buttons, remain.

## When not to use

- Use [`plan-comparison`](plan-comparison.md) to compare your own plans and billing periods.
- Use [`sortable-data-table`](sortable-data-table.md) for real tabular data, with sorting and many rows.
- Avoid with many columns: all of them share the width, with no horizontal scroll, until the stacked mode kicks in below `stackBelow`.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import ComparisonTable from "@/components/ryan-ui/blocks/comparison-table/comparison-table";

export default function ComparisonTableDemo() {
  return <ComparisonTable />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ComparisonTable`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"How Relay compares"` | — |
| `description` | `string` | `"Everything a growing team needs, without the…` | — |
| `columns` | `ComparisonColumn[]` | `comparisonColumns` | — |
| `sections` | `ComparisonSection[]` | `comparisonSections` | — |
| `differencesOnly` | `boolean` | — | Hide rows where every visible column has the same value (controlled). |
| `defaultDifferencesOnly` | `boolean` | `false` | — |
| `onDifferencesOnlyChange` | `(value: boolean) => void` | — | — |
| `compareWith` | `string` | — | Competitor shown beside yours in the stacked phone layout (controlled). |
| `onCompareWithChange` | `(id: string) => void` | — | — |
| `cta` | `{ label: string; href?: string; onClick?: () => void; doneLabel?: string }` | — | Call to action in your column. |
| `stickyTop` | `number` | `0` | Offset for the sticky header, such as the height of a fixed site header. Defaults to 0. |
| `maxHeight` | `number \| string` | — | Caps the table height and scrolls it inside the block, with the header sticking to its top. |
| `stackBelow` | `number` | `640` | Width below which the table stacks into a two column comparison. Defaults to 640. |
| `className` | `string` | — | — |

### `ComparisonTableBlock`

Preview: the comparison inside a capped height so the sticky header shows.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `ComparisonValue`: true is included, false is not, "partial" is limited, and a string prints as text (a limit, a price). | `boolean \| "partial" \| string \| { value: boolean \| "partial" \| string; note?: string }` |

#### `ComparisonColumn`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `caption` | `string` | A short line under the name, such as a price. |
| `highlight` | `boolean` | Your product. It gets the tinted band and stays visible on phones. |

#### `ComparisonRow`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `feature` (required) | `string` | — |
| `hint` | `string` | Secondary text under the feature name. |
| `values` (required) | `Record<string, ComparisonValue>` | — |

#### `ComparisonSection`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `rows` (required) | `ComparisonRow[]` | — |

### Other exports

- `comparisonColumns` (value)
- `comparisonSections` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Space` | On the “Only differences” switch, turns the filtering of identical rows on or off. |
| `Enter` or `Space` | On the competitor buttons (stacked mode) and on your column's call-to-action button, trigger the choice. |
| `↑` or `↓` or `Page Up` or `Page Down` | With `maxHeight`, the table area joins the Tab order and scrolls by keyboard, with the header pinned to the top. |

## Accessibility

- The grid is an ARIA table (`role="table"`, `row`, `columnheader`, `rowheader`, `cell`) named by the title, and each mark has hidden text: “Included”, “Partial”, or “Not included”.
- “Only differences” is a native checkbox with `role="switch"` inside the label, and an `aria-live` region says whether all rows are visible or only those that differ.
- With `maxHeight`, the scroll area becomes a focusable `region` with the title as its name; the fixed texts (the switch, the legend, “Compare … with”) are in English.

## Motion

- The included marks are drawn as they enter the screen, in a cascade down your column; when filtering, rows close and open their height with a no-overshoot spring.
- In stacked mode, the highlight slides to the chosen competitor and the values swap with a slight zoom; the call-to-action button changes width on confirmation with `doneLabel`.
- With “reduce motion” on, the marks appear already drawn, rows disappear and return instantly, the button changes width without animating, and swaps become just a fade.

## Responsive behavior

- Below `stackBelow` (640px by default, measured on the block itself), it shows only your column and the chosen competitor; the columns also narrow through a container query at 820px and 640px.
- The header sticks to the top of the page scroll or, with `maxHeight`, to the top of the table itself; `stickyTop` offsets the height of a fixed site header.

## Notes for AI

- Import `ComparisonTable` by name (the default export is the preview with limited height) and mark your column with `highlight: true`; without it, the first one counts.
- Values per column: `true`, `false`, `"partial"`, a text (limit or price), or `{ value, note }`; “Only differences” compares only `value`, so different notes do not count as a difference.
- Without `cta` there is no button: with `href` and no `onClick` it becomes a link, and with `doneLabel` the button confirms in place. In stacked mode, `compareWith` controls the competitor (the default is the first).

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/comparison-table · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
