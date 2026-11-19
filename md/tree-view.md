# Tree view

> Árvore de navegação para pastas e conteúdo aninhado, com suporte completo ao teclado.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tree-view
- Original description: Navigate nested folders and structured content.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-view.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-view.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-view.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tree-view.json`. Registry path, relative to the site address: `r/tree-view.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/tree-view/tree-view.tsx`
  - `components/ryan-ui/tree-view/tree-view.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tree-view.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Navigating folders and nested content in a side panel: a project's files, sections of documentation, categories of a catalog.
- When each node needs only a name and an icon, and the user opens and closes branches to reach an item.
- When the tree-pattern keyboard is expected: arrow keys to move, open, and close, and Enter to choose.

## When not to use

- Use [`tree-table`](tree-table.md) when each node has data columns, multiple selection, or children loaded on demand.
- Use [`file-tree`](file-tree.md) for a file explorer with change markers and type-ahead search.
- Use [`animated-sidebar`](animated-sidebar.md) for an application's navigation menu, with groups that open and a collapsed icon rail.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { TreeView, type TreeNode } from "@/components/ryan-ui/tree-view/tree-view";
import { Caption, Stack } from "./_kit";

const nodes: TreeNode[] = [
  { id: "src", label: "src", children: [
    { id: "components", label: "components", children: [
      { id: "button", label: "button.tsx" },
      { id: "dialog", label: "dialog.tsx" },
      { id: "tabs", label: "tabs.tsx" },
    ] },
    { id: "hooks", label: "hooks", children: [{ id: "debounce", label: "use-debounced-value.ts" }, { id: "media", label: "use-media-query.ts" }] },
    { id: "app", label: "App.tsx" },
    { id: "main", label: "main.tsx" },
  ] },
  { id: "public", label: "public", children: [{ id: "favicon", label: "favicon.svg" }, { id: "robots", label: "robots.txt" }] },
  { id: "pkg", label: "package.json" },
  { id: "readme", label: "README.md" },
];

export default function TreeViewDemo() {
  const [selected, setSelected] = useState("button.tsx");
  return (
    <Stack width={320} gap={3}>
      <TreeView nodes={nodes} defaultExpandedIds={["src", "components"]} onSelect={n => setSelected(n.label)} aria-label="Project files" />
      <Caption>Selected: {selected}. Arrow keys move, Right and Left open and close.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TreeView`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` (required) | `TreeNode[]` | — | — |
| `defaultExpandedIds` | `string[]` | `[]` | — |
| `expandedIds` | `string[]` | — | — |
| `onExpandedChange` | `(expandedIds: string[]) => void` | — | — |
| `onSelect` | `(node: TreeNode) => void` | — | — |
| `aria-label` | `string` | — | — |

### Exported types

#### `TreeNode`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `children` | `TreeNode[]` | — |
| `icon` | `ReactNode` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move focus to the previous or next visible item. |
| `Home` or `End` | Go to the first or last visible item. |
| `→` | Opens the closed folder; on an open folder, moves focus to the first child. |
| `←` | Closes the open folder; on a file or a closed folder, moves focus to the parent folder. |
| `Enter` or `Space` | Select the item and call `onSelect`; on a folder, also open or close it. |
| `Tab` | Enters the tree on the last focused item and leaves it; the other items are outside the `Tab` order. |

## Accessibility

- It is a single-selection `role="tree"` in which each row is a `<button>` with `role="treeitem"`, `aria-level`, `aria-posinset`, `aria-setsize`, `aria-selected`, and, on folders, `aria-expanded`.
- Focus is roving: only one item is in the `Tab` order, and if it disappears because the folder closed, the stop moves to the first visible item.
- The default name is `File tree`, in English: pass an `aria-label` describing the content; icons are decorative (`aria-hidden`).

## Motion

- When a folder opens, the space opens on a single spring and the new children enter in sequence, sliding from the left; on close, they collapse in height and fade quickly.
- The selection background glides from one item to another, the arrow rotates 90°, the icon switches between closed and open folder, and the indent guide grows from top to bottom.
- With “reduced motion” on, items appear and disappear with no height or displacement, the selection jumps, and icons swap instantly.

## Responsive behavior

- Each level indents 18 px and the name is truncated with an ellipsis, so deep trees in a narrow panel leave little room for the text.

## Performance

- All items of open folders stay in the DOM, each with entrance, exit, and position animation; folders with hundreds of items should start closed.

## Notes for AI

- Pass `nodes` (`{ id, label, children?, icon? }`) and `aria-label`; a node with non-empty `children` becomes a folder, and file icons get a color by extension (`.ts`, `.tsx`, `.css`, `.md`, `.json`).
- Expansion can be controlled (`expandedIds` with `onExpandedChange`) or not (`defaultExpandedIds`); selection is always internal, starts empty, and can't be set by a prop.
- Clicking a folder also selects it and calls `onSelect`: if only files should open content, check `node.children` in the handler.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tree-view · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
