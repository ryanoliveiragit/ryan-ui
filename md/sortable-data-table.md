# Sortable data table

> Tabela de registros com colunas ordenáveis, seleção de linhas e contagem de itens.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/sortable-data-table
- Original description: Compare structured records with sortable columns.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sortable-data-table.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sortable-data-table.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sortable-data-table.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sortable-data-table.json`. Registry path, relative to the site address: `r/sortable-data-table.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/sortable-data-table/sortable-data-table.tsx`
  - `components/ryan-ui/sortable-data-table/sortable-data-table.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/sortable-data-table.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Comparing structured records in columns, letting the user sort by any of them: projects, invoices, team members.
- Selecting several rows for a bulk action: `selectable` adds the checkbox column, selection by clicking the row, range selection with `Shift`, and the count in the footer.
- Tables that fit entirely on the page, where sorting can happen in the browser.

## When not to use

- Use [`tree-table`](tree-table.md) when rows have children and sorting must respect the hierarchy.
- Use [`comparison-table`](comparison-table.md) to compare plans or products feature by feature, with one highlighted column.
- Large collections or ones sorted on the server call for another solution: sorting is local, all rows go into the DOM, and there is no prop to control the order from outside.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { SortableDataTable, type DataColumn } from "@/components/ryan-ui/sortable-data-table/sortable-data-table";
import { Stack } from "./_kit";

type Project = { id: string; name: string; owner: string; status: string; budget: number; progress: number };

const rows: Project[] = [
  { id: "p1", name: "Checkout redesign", owner: "Emma Collins", status: "In progress", budget: 48000, progress: 64 },
  { id: "p2", name: "Mobile onboarding", owner: "Mateo Alvarez", status: "In review", budget: 32500, progress: 90 },
  { id: "p3", name: "Billing migration", owner: "Olivia Bennett", status: "At risk", budget: 76000, progress: 38 },
  { id: "p4", name: "Help center refresh", owner: "Hannah Walsh", status: "Planned", budget: 15800, progress: 0 },
  { id: "p5", name: "Analytics dashboard", owner: "Chloe Nguyen", status: "In progress", budget: 54200, progress: 52 },
  { id: "p6", name: "Partner API v2", owner: "Daniel Kim", status: "Shipped", budget: 61000, progress: 100 },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const columns: DataColumn<Project>[] = [
  { key: "name", label: "Project", sortable: true },
  { key: "owner", label: "Owner", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "budget", label: "Budget", sortable: true, numeric: true, render: v => money.format(v as number) },
  { key: "progress", label: "Progress", sortable: true, numeric: true, render: v => `${v}%` },
];

export default function SortableDataTableDemo() {
  return (
    <Stack width={760}>
      <SortableDataTable rows={rows} columns={columns} rowKey="id" caption="Active projects" defaultSort={{ key: "budget", direction: "desc" }} selectable itemName={{ one: "project", other: "projects" }} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SortableDataTable`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` (required) | `T[]` | — | — |
| `columns` (required) | `DataColumn<T>[]` | — | — |
| `rowKey` (required) | `keyof T \| ((row: T) => string)` | — | — |
| `caption` | `string` | `"Data table"` | — |
| `emptyMessage` | `string` | `"No rows to show"` | — |
| `defaultSort` | `SortState` | — | Sort applied on the first render. |
| `onSortChange` | `(sort: SortState) => void` | — | — |
| `selectable` | `boolean` | `false` | Adds a checkbox column, row click selection, and a count line with a clear action. |
| `selectedKeys` | `string[]` | — | — |
| `defaultSelectedKeys` | `string[]` | — | — |
| `onSelectionChange` | `(keys: string[]) => void` | — | — |
| `itemName` | `{ one: string; other: string }` | `{ one: "row", other: "rows" }` | Noun for the count line, as in "6 projects". |

### Exported types

| Type | Definition |
| --- | --- |
| `SortDirection` | `"asc" \| "desc"` |

#### `SortState`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | — |
| `direction` (required) | `"asc" \| "desc"` | — |

#### `DataColumn`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | — |
| `label` (required) | `string` | — |
| `sortable` | `boolean` | — |
| `render` | `(value: unknown, row: T) => ReactNode` | — |
| `numeric` | `boolean` | Right-aligns the column with tabular numerals. Detected when every value is a number. |
| `width` | `number \| string` | Fixed width such as 120 or "20%". Other columns are measured once and held, so sorting never reflows them. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On a header, sort by the column; again, toggle between ascending and descending. |
| `Space` | On a checkbox, check or uncheck the row; on the header checkbox, all rows. |
| `←` or `→` | In the header, move focus between the select-all checkbox and the sort buttons. |
| `↑` or `↓` | Move focus between the row checkboxes; from the first row, `↑` goes up to the select-all checkbox, and from it `↓` goes back down. |
| `Home` or `End` | Go to the first or last header control, or to the first or last row checkbox. |
| `Esc` | Clears the selection when rows are checked. |

## Accessibility

- It is a native `<table>` with a hidden `caption` and explicit ARIA roles, which keep the semantics when CSS redraws it on narrow screens; sortable headers carry `aria-sort`.
- A `role="status"` region announces the column and direction of the sort and how many rows are selected; the header checkbox uses the indeterminate state.
- Each row's checkbox is named by the value of the first column; the fixed texts (`Sort by`, `Select all rows`, `Clear selection`) are in English.

## Motion

- When sorting, rows glide on a spring to the new position over a fixed band that tints the sorted column; the arrow appears on the column and rotates when the direction flips.
- The checkbox mark draws itself and, in the header, morphs between check and dash; the footer count swaps text rising or descending, with the width following.
- With “reduced motion” on, rows swap places instantly and texts merely alternate, with no displacement or blur.

## Responsive behavior

- In windows up to 620 px the header becomes a scrollable strip of sort buttons and each row folds into two: first column and first number on top, the rest below.
- The rule is a window media query, not a container query: in a narrow panel on a wide screen the table keeps a 560 px minimum width and scrolls horizontally.

## Performance

- There is no pagination or virtualization, and each row is a `motion.tr` with a layout animation: for long collections, slice `rows` and combine with `pagination`.
- Column widths are measured once and locked with `table-layout: fixed`, so sorting doesn't cause reflow; the measurement only repeats if the columns change.

## Notes for AI

- Pass `rows`, `columns` (`{ key, label, render?, numeric?, width? }`), and `rowKey`; every column is sortable unless it has `sortable: false`.
- Sorting uses the raw value of `row[key]`, not what `render` returns: keep numbers and `Date` in the data and format only in `render`; empty values always go last.
- Sorting is internal only (`defaultSort` and `onSortChange`); selection can be controlled with `selectedKeys` and `onSelectionChange`, and the first column should identify the row.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/sortable-data-table · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
