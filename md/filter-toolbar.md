# Filter toolbar

> Barra de filtros ativos que se removem com um toque, com um botão que vira menu para escolher campo e valor.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/filter-toolbar
- Original description: Keep collection filters close and easy to reset.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/filter-toolbar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/filter-toolbar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/filter-toolbar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/filter-toolbar.json`. Registry path, relative to the site address: `r/filter-toolbar.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/filter-toolbar/filter-toolbar.tsx`
  - `components/ryan-ui/filter-toolbar/filter-toolbar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/filter-toolbar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Above a table or list, to show active filters as removable chips and clear them all at once.
- When the user adds filters by choosing the field first and then the value, without leaving the bar (`addFilter`).
- Collections with a few filter fields and one value per field: the added chip uses the field's `id`, so a new choice replaces the previous one.

## When not to use

- Use [`chip-group`](chip-group.md) when the options are few and can stay always visible as toggle chips.
- Use [`multi-select`](multi-select.md) when a single field needs several values; here each field holds only one.
- Use [`search-field`](search-field.md) for free-text search; the menu here only offers predefined values.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { FilterToolbar, type FilterChip, type FilterField } from "@/components/ryan-ui/filter-toolbar/filter-toolbar";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 460 };

const fields: FilterField[] = [
  { id: "status", label: "Status", options: ["Open", "In review", "Merged", "Closed"] },
  { id: "assignee", label: "Assignee", options: ["Emma Collins", "Marcus Johnson", "Jasmine Brooks", "Olivia Bennett"] },
  { id: "label", label: "Label", options: [{ value: "bug", label: "Bug", hint: 12 }, { value: "feature", label: "Feature", hint: 8 }, { value: "docs", label: "Docs", hint: 3 }] },
  { id: "priority", label: "Priority", options: ["Urgent", "High", "Medium", "Low"] },
];

export default function FilterToolbarDemo() {
  const [filters, setFilters] = useState<FilterChip[]>([
    { id: "status", label: "Status", value: "Open" },
    { id: "assignee", label: "Assignee", value: "Marcus Johnson" },
  ]);
  const add = (chip: FilterChip) => setFilters(current => [...current.filter(f => f.id !== chip.id), chip]);

  return (
    <Stack width={640} gap={4}>
      <FilterToolbar
        filters={filters}
        onRemove={id => setFilters(current => current.filter(f => f.id !== id))}
        onClearAll={() => setFilters([])}
        addFilter={{ fields, onAdd: add, align: "start" }}
      />
      <Caption>{filters.length ? `${filters.length} active filter${filters.length === 1 ? "" : "s"}` : "No filters applied"}. Use Add filter to pick a field, then a value.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FilterMenu`

An Add filter button that grows into its own menu: pick a field, then a value. The shape springs between the button and the panel, and the panel renders in place, so keep its ancestors free of overflow clipping.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` (required) | `FilterField[]` | — | — |
| `onSelect` (required) | `(filter: FilterChip, field: FilterField) => void` | — | Receives a chip whose id is the field id, so a second pick for a field replaces the first. |
| `active` | `FilterChip[]` | `[]` | Applied filters. Each field shows its current value and the value step marks it. |
| `label` | `string` | `"Add filter"` | — |
| `align` | `"start" \| "end"` | `"end"` | The trigger edge the panel lines up with. It flips or shifts when the viewport, or a clipping ancestor, has no room. |

### `FilterToolbar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `filters` (required) | `FilterChip[]` | — | — |
| `onRemove` (required) | `(id: string) => void` | — | — |
| `onClearAll` | `() => void` | — | — |
| `children` | `ReactNode` | — | — |
| `label` | `string` | `"Active filters"` | — |
| `addFilter` | `{ fields: FilterField[]; onAdd: (filter: FilterChip, field: FilterField) => void; label?: string; align?: "start" \| "end" }` | — | Adds an Add filter trigger that morphs into a two step field and value menu. |

### Exported types

#### `FilterChip`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `value` | `string` | — |

#### `FilterOption`

One value a field can take. `hint` sits at the end of the row, for example a count.

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` | `string` | — |
| `hint` | `string \| number` | — |
| `icon` | `ReactNode` | — |

#### `FilterField`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |
| `options` (required) | `(string \| FilterOption)[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Open the “Add filter” menu with focus on the first field and, inside it, choose the focused item. |
| `↓` or `↑` | On the button, open the menu on the first or last item; inside the menu, move focus, wrapping at the ends. |
| `Home` or `End` | Go to the first and last menu items; typing letters jumps to the item that starts with them. |
| `→` or `←` | `→` enters the values of the focused field; `←` goes back to the field list. |
| `Esc` | Closes the menu and returns focus to the button that opened it. |
| `Tab` | Moves through each chip's remove button and the bar's actions; leaving the open menu with `Tab` closes it. |

## Accessibility

- The bar is a `role="group"` named by `label`; each remove button has an `aria-label` with field and value, and a `role="status"` region announces filters added, changed, and removed.
- When removing a chip by keyboard, focus moves to the neighboring chip or, if the list empties, to the “Add filter” button; when the menu closes, focus returns to that button.
- The menu is a `role="dialog"` with `role="menu"` lists (`menuitemradio` on values) and a single `Tab` stop per list; the fixed texts (“Clear all”, “No filters applied”, “Remove…”) are in English.

## Motion

- Each chip opens and closes its own width space on a spring, so neighbors and actions slide along; a chip that moves to another line slides there, and the bar's height follows.
- The “Add filter” button grows into the menu panel (width, height, and position on the same spring) and returns faster on close; the field and value steps slide in following the direction of navigation.
- With “reduced motion”, chips, panel, and steps swap instantly or with a short fade.

## Responsive behavior

- On screens up to 520 px the bar becomes a column, with chips on top and actions below, right-aligned; chips always wrap and long labels are truncated.
- The menu panel opens upward when there's no room below, shifts to fit the window or the ancestor that clips content, and scrolls internally above `min(20rem, 55vh)`.

## Performance

- Line wraps are animated by size observers on each chip and a `MutationObserver` on the list, and only in the 0.9 s following a filter change; resizing the window animates nothing.

## Notes for AI

- It is fully controlled: keep `filters` in state and update it in `onRemove`, `onClearAll`, and `addFilter.onAdd`; in `onAdd`, replace the chip with the same `id`, which is the field's `id`.
- The chip received in `onAdd` carries in `value` the option's displayed text (its `label`), not its `value`; always pass `onClearAll`, because the “Clear all” button appears even without it.
- The panel doesn't use a portal: avoid `overflow: hidden` on ancestors; `children` goes between the add button and “Clear all”, and `FilterMenu` is also exported for standalone use.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/filter-toolbar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
