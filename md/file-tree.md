# File tree

> Árvore de arquivos com pastas que abrem suavemente, ícones por tipo, seleção e navegação completa pelo teclado.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/file-tree
- Original description: A file explorer tree whose folders open on a height spring, with file-type icons, selection, change markers and full keyboard navigation with type-ahead.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-tree.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-tree.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-tree.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/file-tree.json`. Registry path, relative to the site address: `r/file-tree.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/file-tree/file-tree.tsx`
  - `components/ryan-ui/file-tree/file-tree.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/file-tree.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- File explorer for a project in an editor, code reviewer, or repository panel.
- List of changed files, with each one's version-control mark (`status`: M, A, D, U) and the dot that flags folders with changes inside.
- Trees the user navigates by keyboard only, jumping to a file by typing the start of its name.

## When not to use

- Use [`tree-view`](tree-view.md) for hierarchies that aren't files (categories, sections), with no per-extension icon or change marks.
- Use [`tree-table`](tree-table.md) when each row has columns, checkbox selection, or children loaded on demand.
- Use [`animated-sidebar`](animated-sidebar.md) for app navigation with nested groups; this tree selects files, it doesn't switch pages.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { FileTree } from "@/components/ryan-ui/file-tree/file-tree";
import type { FileTreeNode } from "@/components/ryan-ui/file-tree/file-tree";
import { Caption, Stack, Surface } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

const project: FileTreeNode[] = [
  { name: "src", children: [
    { name: "components", children: [
      { name: "checkout", children: [
        { name: "checkout-form.tsx", status: "modified" },
        { name: "checkout-form.module.css" },
        { name: "order-summary.tsx", status: "added" },
      ] },
      { name: "header", children: [
        { name: "header.tsx" },
        { name: "header.module.css" },
        { name: "logo.svg" },
      ] },
    ] },
    { name: "hooks", children: [
      { name: "use-cart.ts", status: "modified" },
      { name: "use-media-query.ts" },
    ] },
    { name: "app.tsx" },
    { name: "main.tsx" },
  ] },
  { name: "public", children: [
    { name: "favicon.svg" },
    { name: "og-image.png" },
  ] },
  { name: "scripts", children: [] },
  { name: ".env.local" },
  { name: "package.json", status: "modified" },
  { name: "README.md" },
  { name: "tsconfig.json" },
  { name: "vite.config.ts" },
];

export default function FileTreeDemo() {
  const [selected, setSelected] = useState<string | null>("src/components/checkout/checkout-form.tsx");
  const [opened, setOpened] = useState<string | null>(null);
  return (
    <Stack width={340} gap={3}>
      <Surface padding={2}>
        <FileTree nodes={project} value={selected} onValueChange={id => { setSelected(id); setOpened(null); }} onOpen={id => setOpened(id)} defaultExpandedIds={["src", "src/components", "src/components/checkout"]} label="Storefront project files" />
      </Surface>
      <Caption>{opened ? `Opened ${opened}.` : selected ? `Selected ${selected}.` : "Nothing selected."} Enter opens a file, arrows move, typing a name jumps to it.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FileTree`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` (required) | `FileTreeNode[]` | — | The root level of files and folders. |
| `value` | `string \| null` | — | Id of the selected file (controlled). Pass null for none. |
| `defaultValue` | `string \| null` | `null` | Selected file when uncontrolled. |
| `onValueChange` | `(id: string, node: FileTreeNode) => void` | — | Called when a row is selected. |
| `expandedIds` | `string[]` | — | Ids of the open folders (controlled). |
| `defaultExpandedIds` | `string[]` | `[]` | Open folders when uncontrolled. |
| `onExpandedChange` | `(expandedIds: string[]) => void` | — | Called with the next list of open folder ids. |
| `onOpen` | `(id: string, node: FileTreeNode) => void` | — | Called when a file is opened with Enter or a double click. |
| `selectFolders` | `boolean` | `false` | Lets folders be selected as well as opened. |
| `label` | `string` | `"Files"` | Accessible name of the tree. |
| `className` | `string` | — | Extra class for the tree. |

### Exported types

| Type | Definition |
| --- | --- |
| `FileTreeStatus` | `"modified" \| "added" \| "deleted" \| "untracked"` |

#### `FileTreeNode`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | File or folder name, with its extension. The extension picks the icon. |
| `id` | `string` | Unique id. Defaults to the path from the root, such as `src/app/page.tsx`. |
| `children` | `FileTreeNode[]` | Present on folders (use an empty array for an empty folder); absent on files. |
| `status` | `"modified" \| "added" \| "deleted" \| "untracked"` | Version control state, shown as a letter at the end of the row. A folder shows a dot when anything inside it changed. |
| `disabled` | `boolean` | Keeps the row visible but skips it for selection and keyboard focus. |
| `icon` | `ReactNode` | Replaces the icon picked from the extension. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move focus to the previous or next visible row, skipping disabled ones. |
| `→` or `←` | `→` opens the folder or, if already open, goes to its first item; `←` closes the folder or, on a file, goes back to the parent folder. |
| `Home` or `End` | Go to the first and last visible rows. |
| `Enter` or `Space` | Select the file or open and close the folder; `Enter` on a file also calls `onOpen`. |
| `*` | Opens all sibling folders of the focused row. |
| `A–Z` | Typing the start of a name (letters, numbers, or a dot) moves focus to the matching row; repeating the same key cycles through the ones that start with it. |

## Accessibility

- Follows the tree pattern: `role="tree"` named by `label`, `treeitem` rows with `aria-level`, `aria-setsize`, and `aria-posinset`, `aria-expanded` on folders, and `aria-selected` on files.
- Only one row is in the `Tab` order (the focused one, otherwise the selected one, otherwise the first); nodes with `disabled` remain visible, but the keyboard skips them and they can't be selected.
- The status letter carries its full name for screen readers and a folder with changes says “contains changes”; these texts and “Empty folder” are hardcoded in English.

## Motion

- Opening a folder animates the group's height on a spring with no overshoot, and rows enter in sequence, sliding 8 px from the left, with the total delay capped at 0.2 s.
- The arrow rotates 90°, the icon shrinks slightly when pressed, and the selected row gets a highlight bar that grows from the middle.
- With “reduced motion”, folders open and close instantly and the arrow, icon, and bar transitions are turned off.

## Responsive behavior

- Long names are truncated with an ellipsis; each level indents 1rem (`--tree-indent`) and each row is 1.875rem tall (`--tree-row`).
- The tree doesn't scroll on its own: put it in a container with a height and scrolling (for example `scroll-area`) when there are many files.

## Performance

- Closed folders don't render their children, but there is no virtualization: each visible row is an element; keep `nodes` referentially stable, since the visible list is recomputed when it changes.

## Notes for AI

- A folder is any node with `children` (use `[]` for an empty folder); the default `id` is the path from the root, like `src/app/page.tsx`, and that is what goes in `value` and `expandedIds`.
- Selection (`value`, `onValueChange`) and open folders (`expandedIds`, `onExpandedChange`) support controlled or uncontrolled use; `onOpen` is separate and fires on `Enter` or double click on a file.
- By default folders only open and close: pass `selectFolders` to make them selectable too; the icon comes from the name's extension or from `icon` on the node.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/file-tree · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
