# Breadcrumb

> Mostra onde a página está dentro da hierarquia do produto.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/breadcrumb
- Original description: Show where a page sits in a hierarchy.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/breadcrumb.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/breadcrumb.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/breadcrumb.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/breadcrumb.json`. Registry path, relative to the site address: `r/breadcrumb.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/breadcrumb/breadcrumb.tsx`
  - `components/ryan-ui/breadcrumb/breadcrumb.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/breadcrumb.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Deep pages in a hierarchy, such as Workspace › Projects › Mobile app › Releases, so people can go back to any level.
- Folder or category browsers where the path lives in local state: items with `onClick` and no `href` become buttons.
- Paths that grow as the person descends the tree: new levels slide in at the end.

## When not to use

- Use [`stepper`](stepper.md) to show the progress of a multi-step flow; the trail shows location, not progress.
- Use [`tabs`](tabs.md) to switch between sibling views at the same level.
- Use [`pagination`](pagination.md) to move through the pages of a collection.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Breadcrumb } from "@/components/ryan-ui/breadcrumb/breadcrumb";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack } from "./_kit";

const tree = ["Workspace", "Projects", "Mobile app", "Releases", "v2.4.0"];

export default function BreadcrumbDemo() {
  const [depth, setDepth] = useState(3);
  const items = tree.slice(0, depth).map((label, i) => ({ label, onClick: () => setDepth(i + 1) }));
  return (
    <Stack gap={5} align="center">
      <Breadcrumb items={items} />
      <Button variant="secondary" size="sm" disabled={depth >= tree.length} onClick={() => setDepth(d => d + 1)}>Go deeper</Button>
      <Caption>New crumbs slide in; choose an earlier crumb to go back up.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Breadcrumb`

Crumbs present on first render stay still; crumbs added later slide in from the path before them.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `BreadcrumbItem[]` | — | — |
| `ariaLabel` | `string` | `"Breadcrumb"` | — |

### Exported types

#### `BreadcrumbItem`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `onClick` | `(event: MouseEvent<HTMLElement>) => void` | Runs when the crumb is chosen. Without an href the crumb renders as a button, for paths that live in local state. |

## Accessibility

- Renders a `<nav>` with `aria-label` (default “Breadcrumb”, in English) and an ordered list; the arrows between levels are hidden from the screen reader.
- The last item is always the current page: it becomes text with `aria-current="page"`, even if it has `href`.

## Motion

- Items from the first render stay still; levels added later slide in 8 px from the left, out of a slight blur, and removed ones disappear in a short fade.
- The items that remain reposition on a no-overshoot spring, and each reserves the label width at medium weight, so becoming the current page does not shift the path.
- With “reduce motion” on, entries, exits, and repositioning happen instantly.

## Responsive behavior

- The list wraps onto several lines when it does not fit (`flex-wrap`), but each label stays on a single line; there is no ellipsis or collapsing of the middle levels.

## Notes for AI

- Pass the whole path in `items`, with the current page last; use `href` for real routes and `onClick` without `href` for paths in local state.
- Links go through `RyanProvider`: with it, `next/link` or your router's Link is used in place of the `<a>`.
- Change `ariaLabel` to Portuguese, for example “Trilha de navegação”, since the default is “Breadcrumb”. Import from `@/components/ryan-ui/breadcrumb/breadcrumb`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/breadcrumb · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
