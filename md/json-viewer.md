# JSON viewer

> Árvore de JSON recolhível, com busca, paginação de listas longas e cópia de valor ou caminho.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/json-viewer
- Original description: A collapsible JSON tree with search, paging for long arrays, and copy value or path.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/json-viewer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/json-viewer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/json-viewer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/json-viewer.json`. Registry path, relative to the site address: `r/json-viewer.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/json-viewer/json-viewer.tsx`
  - `components/ryan-ui/json-viewer/json-viewer.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/json-viewer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Inspecting API responses, webhook events, or log records in internal tools and debugging panels.
- When the user needs to find a key or value in a large object: search highlights the matches and opens the branches that contain them.
- When a field's path matters: the current row shows its own (`order.items[0].sku`) and offers actions to copy the value or the path.

## When not to use

- Use [`code-block`](code-block.md) to show a short JSON snippet as static code.
- Use [`tree-view`](tree-view.md) to navigate a hierarchy of items with their own labels; here each row is always a key and a value.
- Use [`sortable-data-table`](sortable-data-table.md) when the JSON is a list of records with the same fields, which compare better in columns.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { JsonViewer } from "@/components/ryan-ui/json-viewer/json-viewer";
import { Stack } from "./_kit";

const order = {
  id: "ord_8f3k2m",
  status: "paid",
  createdAt: "2026-11-04T14:22:09Z",
  total: { amount: 12480, currency: "USD" },
  customer: { id: "cus_91ab", name: "Hannah Walsh", email: "hannah.walsh@example.com", vip: true },
  items: [
    { sku: "CH-204", name: "Lounge chair", quantity: 2, price: 4200 },
    { sku: "LP-118", name: "Table lamp", quantity: 1, price: 1890 },
    { sku: "LT-032", name: "Linen throw", quantity: 3, price: 730 },
  ],
  shipping: { method: "express", address: { city: "Lisbon", country: "PT", postalCode: "1200-195" }, tracking: null },
  tags: ["gift", "priority"],
};

export default function JsonViewerDemo() {
  return (
    <Stack width={560}>
      <JsonViewer data={order} rootName="order" defaultExpandDepth={2} maxHeight={360} label="Order payload" />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `JsonViewer`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `unknown` | — | — |
| `rootName` | `string` | `"root"` | Name of the root in paths, as in `root.users[0].name`. Defaults to "root". |
| `defaultExpandDepth` | `number` | `1` | Levels open on first render when `defaultExpanded` is not set. Defaults to 1, which opens the root. |
| `expanded` | `string[]` | — | Paths of open branches. |
| `defaultExpanded` | `string[]` | — | — |
| `onExpandedChange` | `(paths: string[]) => void` | — | — |
| `searchable` | `boolean` | `true` | Show the search field. Defaults to true. |
| `query` | `string` | — | — |
| `defaultQuery` | `string` | `""` | — |
| `onQueryChange` | `(query: string) => void` | — | — |
| `pageSize` | `number` | `50` | Children shown per page in a long array or object. Defaults to 50. |
| `copyable` | `boolean` | `true` | Show copy value and copy path actions. Defaults to true. |
| `onCopy` | `(detail: JsonViewerCopyDetail) => void` | — | — |
| `onSelect` | `(detail: { path: string; value: unknown; type: JsonValueType }) => void` | — | Called when a row becomes the current one. |
| `showPath` | `boolean` | `true` | Show the path of the current row under the tree. Defaults to true. |
| `maxHeight` | `number \| string` | `420` | Height of the scrolling tree area. Defaults to 420px. |
| `label` | `string` | `"JSON"` | Accessible name of the tree. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `JsonValueType` | `"object" \| "array" \| "string" \| "number" \| "boolean" \| "null" \| "other"` |

#### `JsonViewerCopyDetail`

| Field | Type | Description |
| --- | --- | --- |
| `kind` (required) | `"value" \| "path"` | — |
| `path` (required) | `string` | — |
| `text` (required) | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move the current row; `Home` and `End` go to the first and last. |
| `→` or `←` | `→` opens the branch or, if already open, goes to the first child; `←` closes the branch or goes back to the parent. |
| `Enter` or `Space` | Open or close the branch; on the “Show N more” row, load the next page. |
| `/` | Moves focus to the search field. |
| `Enter` or `Shift + Enter` | In the search field, go to the next and previous match; `Esc` clears the search and `↓` returns to the tree. |
| `Ctrl + C` or `Cmd + C` | Trigger copying the focused row's value; with `Shift`, its path. |

## Accessibility

- Follows the WAI-ARIA tree pattern: `role="tree"` named by `label` and `treeitem` rows with level, position, `aria-expanded`, and an `aria-label` that summarizes key, type, and value; only the current row is in the `Tab` order.
- The search match count is `aria-live`, and the result of each copy (success or failure) is announced in a `role="status"` region.
- The row copy buttons are outside the `Tab` order (by keyboard, use the shortcut) and the one on the path bar is focusable; the interface texts are hardcoded in English.

## Motion

- When opening or closing a branch, loading a page, or expanding everything, each row unfolds its own height on a spring with no overshoot, with a fade.
- The current row's highlight slides from one row to another, and the scrolling that keeps that row in view (or centers a search match) uses the same spring.
- With “reduced motion”, rows, highlight, and scrolling change instantly; above 400 visible rows, row animation is turned off for everyone.

## Responsive behavior

- The tree scrolls internally, limited by `maxHeight` (420 px by default); rows don't wrap, long values are truncated with an ellipsis, and strings over 40 characters show the full text in the `title`.
- On screens up to 420 px the per-level indent drops from 16 px to 12 px, keys take at most 40% of the row, and the type disappears from the path bar.

## Performance

- Long arrays and objects enter in pages of `pageSize` (50 by default) with a “Show N more” row; there is no virtualization, so each visible row is an element.
- Search scans the entire JSON on every keystroke and stops at 2,000 matches; with very large payloads, typing can lag.

## Notes for AI

- Pass the already-parsed value (object or array) in `data`, not the JSON text: a string would appear as a single value.
- Paths start from `rootName` (default `root`), like `root.users[0].name`: this is the format that `expanded`, `defaultExpanded`, `onSelect`, and `onCopy` use, and `defaultExpandDepth` opens the first levels.
- It already comes with its own border, background, and scrolling (`maxHeight`), so it doesn't need another card around it; `searchable`, `copyable`, and `showPath` turn off search, copy, and the path bar.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/json-viewer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
