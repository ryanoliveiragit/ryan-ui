# Pagination

> Navegação entre páginas de uma coleção longa, com limites claros e reticências quando necessário.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/pagination
- Original description: Move through a long collection with clear bounds.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pagination.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pagination.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pagination.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/pagination.json`. Registry path, relative to the site address: `r/pagination.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/pagination/pagination.tsx`
  - `components/ryan-ui/pagination/pagination.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/pagination.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Tables and lists with a known number of pages, such as orders or search results.
- When the user moves page by page or jumps between nearby pages: the window shows five numbers around the current one.

## When not to use

- Use [`infinite-masonry`](infinite-masonry.md) for feeds that load more items as scrolling reaches the end.
- Use [`stepper`](stepper.md) for the steps of a flow; pagination is for pages of a single collection.
- Avoid it when the total number of pages is unknown (cursor-based APIs): the component requires `pageCount` and has no previous-and-next-only mode.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Pagination } from "@/components/ryan-ui/pagination/pagination";
import { Caption, Stack, Surface } from "./_kit";

const orders = Array.from({ length: 240 }, (_, i) => i + 1);
const perPage = 10;

export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [short, setShort] = useState(2);
  const count = orders.length / perPage;
  const first = (page - 1) * perPage + 1;
  return (
    <Stack width={560} gap={6} align="center">
      <Stack gap={3} align="center">
        <Pagination page={page} pageCount={count} onPageChange={setPage} />
        <Caption>Showing orders {first} to {first + perPage - 1} of {orders.length}</Caption>
      </Stack>
      <Surface padding={3}>
        <Pagination page={short} pageCount={5} onPageChange={setShort} label="Search results pages" />
      </Surface>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Pagination`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` (required) | `number` | — | — |
| `pageCount` (required) | `number` | — | — |
| `onPageChange` (required) | `(page: number) => void` | — | — |
| `label` | `string` | `"Pagination"` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` or `Shift + Tab` | Move through the previous button, the page numbers, and the next button. |
| `Enter` or `Space` | Activate the focused button and call `onPageChange`. |

## Accessibility

- It is a `<nav>` named by `label` (default “Pagination”): give each pagination a different name when there is more than one on the page.
- The current page gets `aria-current="page"`, each number has an `aria-label` “Page N”, and the arrows are `disabled` on the first and last page; these labels are hardcoded in English.
- The items are buttons, not links: changing the URL or data is up to your `onPageChange`.

## Motion

- A single marker slides on a spring to the current page number.
- When the five-number window shifts, the numbers move together like a conveyor belt, each by the same number of places, while the ones entering and leaving fade.
- With “reduced motion”, the marker jumps and the numbers swap without sliding.

## Responsive behavior

- There are at most seven 2.25rem buttons (two arrows and five numbers), about 276 px in total; if width runs short, the navigation wraps.

## Notes for AI

- It is controlled: keep `page` (starts at 1) in state and update it in `onPageChange`; there is no uncontrolled mode or `className`.
- Compute `pageCount` with `Math.ceil(total / porPagina)`: the component rounds fractions down, and the last partial page would be unreachable.
- Import with braces, from `@/components/ryan-ui/pagination/pagination` (there is no default export); there are no ellipses or shortcut to the first and last page, so show the total nearby.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/pagination · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
