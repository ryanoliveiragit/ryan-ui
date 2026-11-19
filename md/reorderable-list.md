# Reorderable list

> Lista que se reorganiza arrastando, com alternativa pelo teclado para mover cada item.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/reorderable-list
- Original description: Organize items with direct drag and drop.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reorderable-list.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reorderable-list.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reorderable-list.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/reorderable-list.json`. Registry path, relative to the site address: `r/reorderable-list.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/reorderable-list/reorderable-list.tsx`
  - `components/ryan-ui/reorderable-list/reorderable-list.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/reorderable-list.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A short list where the order is the data itself: the day's priorities, steps in a flow, fields in a form.
- When the user should reorder by dragging the handle, with mouse or finger, and also by keyboard with the arrow keys.

## When not to use

- Use [`sortable-data-table`](sortable-data-table.md) when the order comes from a column's value, not from a manual choice.
- Rows with their own content (controls, images, several columns) don't fit: each item shows only `title` and `detail`.
- Moving items between lists or columns, as in a kanban board, is out of scope: there is a single vertical list here.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ReorderableList, type ReorderableItem } from "@/components/ryan-ui/reorderable-list/reorderable-list";
import { Caption, Stack } from "./_kit";

const initial: ReorderableItem[] = [
  { id: "design", title: "Finish checkout redesign", detail: "Due Monday" },
  { id: "review", title: "Review pull request #482", detail: "Marcus is waiting" },
  { id: "research", title: "Summarize interview notes", detail: "8 interviews" },
  { id: "release", title: "Publish release notes", detail: "Version 2.4" },
  { id: "backlog", title: "Groom the backlog", detail: "Friday" },
];

export default function ReorderableListDemo() {
  const [items, setItems] = useState(initial);
  return (
    <Stack width={420} gap={3}>
      <ReorderableList items={items} onReorder={setItems} label="Today's priorities" />
      <Caption>Drag by the handle, or focus it and use the arrow keys. Top priority: {items[0]?.title}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ReorderableList`

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `ReorderableItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `detail` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | With focus on the handle, move the item one position up or down; focus stays on the same handle. |
| `Tab` or `Shift + Tab` | Move from one handle to the next. |

## Accessibility

- The list is a `<ul>` with an `aria-label` coming from `label`; each handle is a `<button>` whose name carries the title, the current position, and the instruction to use the arrow keys.
- After a keyboard move, focus is returned to the moved item's handle, because reordering swaps the nodes' places in the DOM.
- The handle's name is hardcoded in English (“Reorder [title]. Position 2 of 5. Use arrow keys.”) and there is no `aria-live` region announcing the new position; since the code lives in your project, translate it there.

## Motion

- When the handle is pressed, the row lifts: it scales to 1.02 and gains a shadow that enters by opacity; on release, it settles into place with a short spring.
- The other rows slide to make room, and the position number rolls in the direction the row moved.
- With “reduced motion” on, the row still follows the pointer but drops straight into place, with no scale, and the number changes without rolling.

## Responsive behavior

- The list takes the full width of the parent; title and detail are truncated with an ellipsis instead of wrapping.
- The handle is 40 px on a side and has `touch-action: none`: dragging by it on a phone doesn't scroll the page, and the rest of the row keeps scrolling normally.

## Performance

- All rows stay in the DOM, each with a layout animation, and there is no virtualization; keep the list short.

## Notes for AI

- It is controlled and has only a named export: `import { ReorderableList } from "@/components/ryan-ui/reorderable-list/reorderable-list"`, with `items` in the parent's state and `onReorder={setItems}`.
- Each item needs a unique, stable `id` and a `title`; `detail` is optional, and `label` gives the list its name for screen readers.
- `onReorder` receives the array already in the new order on every position change, including mid-drag, not just on release: keep it in state and defer saving to the server.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/reorderable-list · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
