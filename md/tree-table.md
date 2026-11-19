# Tree table

> Tabela com linhas aninhadas, seleção em três estados, ordenação que preserva a hierarquia e carga sob demanda.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tree-table
- Original description: A table with nested rows, tri-state selection, hierarchy-preserving sort, and lazy-loaded children.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-table.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-table.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-table.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-table.json`. Registry path, relative to the site address: `r/tree-table.json`.

- npm packages: `@radix-ui/react-checkbox`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Checkbox](checkbox.md)
- Files, once installed:
  - `components/ryan-ui/tree-table/tree-table.tsx`
  - `components/ryan-ui/tree-table/tree-table.module.css`
  - `components/ryan-ui/checkbox/checkbox.tsx`
  - `components/ryan-ui/checkbox/checkbox.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-checkbox lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tree-table.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Hierarchical data with columns to compare: folders and files with owner and size, budget by area and sub-area, teams and people.
- Bulk selection in a hierarchy: checking a parent checks everything below it, and the parent shows a mixed state when only some children are checked.
- Large trees whose children come from the server on open, with `loadChildren`, a loading row, and a retry button when the load fails.

## When not to use

- Use [`tree-view`](tree-view.md) to navigate a hierarchy by names only, with no data columns.
- Use [`sortable-data-table`](sortable-data-table.md) when records have no children.
- Thousands of rows open at once call for virtualization, which this component doesn't have.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Folder, FileText } from "lucide-react";
import { TreeTable, type TreeTableColumn, type TreeTableRow } from "@/components/ryan-ui/tree-table/tree-table";
import { Stack } from "./_kit";

type Item = { name: string; owner: string; size: number; kind: "folder" | "file" };

const file = (id: string, name: string, owner: string, size: number): TreeTableRow<Item> => ({ id, data: { name, owner, size, kind: "file" } });
const folder = (id: string, name: string, owner: string, children?: TreeTableRow<Item>[]): TreeTableRow<Item> => ({ id, data: { name, owner, size: 0, kind: "folder" }, children, hasChildren: !children });

const rows: TreeTableRow<Item>[] = [
  folder("design", "Design", "Emma Collins", [
    file("brand", "Brand guidelines.pdf", "Emma Collins", 4200),
    folder("icons", "Icons", "Jasmine Brooks", [file("i1", "Outline set.fig", "Jasmine Brooks", 1800), file("i2", "Filled set.fig", "Jasmine Brooks", 2100)]),
  ]),
  folder("eng", "Engineering", "Nathan Cole", [
    file("arch", "Architecture.md", "Olivia Bennett", 48),
    file("api", "API reference.md", "Daniel Kim", 126),
  ]),
  folder("finance", "Finance", "Andre Williams"),
];

const fmt = (kb: number) => (kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${kb} KB`);

const columns: TreeTableColumn<Item>[] = [
  { id: "name", header: "Name", width: "minmax(0, 2fr)", sortValue: d => d.name, cell: d => <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }}>{d.kind === "folder" ? <Folder size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}<span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span></span> },
  { id: "owner", header: "Owner", width: "minmax(0, 1fr)", hideBelow: 480, sortValue: d => d.owner, cell: d => d.owner },
  { id: "size", header: "Size", width: "90px", align: "end", sortValue: d => d.size, cell: d => d.kind === "file" ? fmt(d.size) : "" },
];

const loadChildren = (row: TreeTableRow<Item>) => new Promise<TreeTableRow<Item>[]>(resolve => window.setTimeout(() => resolve([
  file(`${row.id}-1`, "Q3 budget.xlsx", "Andre Williams", 320),
  file(`${row.id}-2`, "Invoices 2026.zip", "Andre Williams", 8400),
]), 900));

export default function TreeTableDemo() {
  return (
    <Stack width={680}>
      <TreeTable rows={rows} columns={columns} label="Team files" selectable defaultExpanded={["design"]} defaultSort={null} loadChildren={loadChildren} rowLabel={d => d.name} maxHeight={380} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TreeTable`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` (required) | `TreeTableRow<T>[]` | — | — |
| `columns` (required) | `TreeTableColumn<T>[]` | — | — |
| `label` (required) | `string` | — | Accessible name of the table. |
| `expanded` | `string[]` | — | — |
| `defaultExpanded` | `string[]` | `[]` | — |
| `onExpandedChange` | `(ids: string[]) => void` | — | — |
| `selectable` | `boolean` | `false` | Adds a checkbox column. Checking a parent checks everything under it. |
| `selected` | `string[]` | — | — |
| `defaultSelected` | `string[]` | `[]` | — |
| `onSelectedChange` | `(ids: string[]) => void` | — | — |
| `sort` | `TreeTableSort \| null` | — | — |
| `defaultSort` | `TreeTableSort \| null` | `null` | — |
| `onSortChange` | `(sort: TreeTableSort \| null) => void` | — | — |
| `loadChildren` | `(row: TreeTableRow<T>) => Promise<TreeTableRow<T>[]>` | — | Loads the children of a row with hasChildren the first time it expands. A rejected promise shows a retry row. |
| `rowLabel` | `(data: T) => string` | — | Names a row for its checkbox, such as the file or team name. |
| `onRowActivate` | `(row: TreeTableRow<T>) => void` | — | Called when a row without children is clicked or gets Enter. Parent rows toggle instead. |
| `maxHeight` | `number \| string` | — | Caps the height; the header stays pinned while the body scrolls. |
| `emptyState` | `ReactNode` | — | — |
| `className` | `string` | — | — |
| `ref` | `Ref<HTMLDivElement>` | — | — |

### Exported types

#### `TreeTableRow`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `data` (required) | `T` | — |
| `children` | `TreeTableRow<T>[]` | Nested rows. Leave undefined and set hasChildren to load them on first expand with loadChildren. |
| `hasChildren` | `boolean` | Marks a row whose children are not loaded yet. |

#### `TreeTableCellContext`

| Field | Type | Description |
| --- | --- | --- |
| `row` (required) | `TreeTableRow<T>` | — |
| `depth` (required) | `number` | One for top level rows. |
| `expanded` (required) | `boolean` | — |

#### `TreeTableColumn`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `header` (required) | `string` | — |
| `cell` (required) | `(data: T, context: TreeTableCellContext<T>) => ReactNode` | — |
| `sortValue` | `(data: T) => string \| number` | Makes the column sortable. Siblings are sorted within their parent, so the hierarchy never breaks. |
| `width` | `string` | A grid track, such as "120px" or "minmax(0, 2fr)". Defaults to "minmax(0, 1fr)". |
| `align` | `"start" \| "end"` | — |
| `hideBelow` | `number` | Hides the column while the table is narrower than this many px. |

#### `TreeTableSort`

| Field | Type | Description |
| --- | --- | --- |
| `columnId` (required) | `string` | — |
| `direction` (required) | `"ascending" \| "descending"` | — |

### Other exports

- `collectExpandableIds` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `Page Up` or `Page Down` | Move focus one row up or down; Page Up and Page Down jump ten rows. |
| `Home` or `End` | Go to the first or last visible row. |
| `→` or `←` | → opens the row or, if it is already open, moves down to the first child; ← closes the row or, if it is already closed, moves up to the parent. |
| `Enter` | Opens or closes a row with children, calls `onRowActivate` on a leaf, and, after a load failure, retries. |
| `Space` or `Ctrl + A` | With `selectable`, Space checks or unchecks the row and its descendants; Ctrl + A (⌘ + A on Mac) checks everything or clears the selection. |
| `*` | Opens all sibling rows of the focused row, loading any missing children. |

## Accessibility

- Follows the `treegrid` pattern: rows have `aria-level`, `aria-posinset`, `aria-setsize`, and `aria-expanded`, and focus is roving, with a single row in the `Tab` order.
- With `selectable`, the grid is `aria-multiselectable` and checked rows have `aria-selected`; the checkboxes are outside `Tab` (checking is done with Space) and get their name from `rowLabel`.
- An `aria-live` region announces sorting, expanding or collapsing all, and the result of loads; if the focused row disappears when a branch closes, focus moves up to the nearest visible ancestor.

## Motion

- Opening a row makes the children grow in height on a spring and appear in a slight sequence; closing collapses on the same spring, and the arrow rotates 90°.
- When sorting, rows glide to the new position within their level; when children arrive from `loadChildren`, the first takes the loading row's place, with no jolt.
- With “reduced motion” on, rows appear and disappear with a short fade, without growing in height; the loading skeleton stops pulsing and the indicator spins more slowly.

## Responsive behavior

- `hideBelow` hides a column while the table is narrower than that value in px; the measure is of the table itself, so it also applies to narrow panels on wide screens.
- With `maxHeight`, the body scrolls internally and the header stays fixed; the row that receives focus by keyboard is scrolled into view without being hidden under the header.

## Performance

- Only the rows of open branches go into the DOM, but without virtualization: opening everything in a tree of thousands of nodes renders them all, each with height and position animation.

## Notes for AI

- Each row is `{ id, data, children? }`; for on-demand loading, leave `children` undefined, set `hasChildren: true`, and pass `loadChildren`, which returns a `Promise` with the children.
- The first column carries the tree; `sortValue` makes the column sortable (ascending, descending, unsorted), `width` accepts a grid track (`"90px"`, `"minmax(0, 2fr)"`), and `align: "end"` aligns numbers.
- It depends on the `checkbox` item, installed along with it; `Loading`, `Couldn't load`, and `Retry` are hardcoded in English, and to open everything from outside use `collectExpandableIds(rows)` with `expanded` and `onExpandedChange`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tree-table · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
