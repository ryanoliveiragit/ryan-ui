# Expanding search

> Um ícone que se transforma em campo de busca, com resultados logo abaixo.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/expanding-search
- Original description: An icon that morphs into a search field with results beneath it.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-search.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-search.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-search.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expanding-search.json`. Registry path, relative to the site address: `r/expanding-search.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/expanding-search/expanding-search.tsx`
  - `components/ryan-ui/expanding-search/expanding-search.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/expanding-search.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Headers and toolbars where an always-open search field would crowd the layout.
- Searching a set that is already on the client (projects, documents, people), with results grouped by `group` right below the field.
- When it is worth suggesting something before typing: `suggestions` appears as soon as the field opens, under the `suggestionsLabel` heading.

## When not to use

- Use [`search-field`](search-field.md) when search is the screen's main action and should always be visible as a field.
- Use [`command-palette`](command-palette.md) when the results are commands with shortcuts, not items to open.
- Use [`morphing-search`](morphing-search.md) when you need to control the text and the opening from outside or open the search with a keyboard shortcut: here the query and state are internal.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { FileText, Folder, Users } from "lucide-react";
import ExpandingSearch, { type ExpandingSearchItem } from "@/components/ryan-ui/expanding-search/expanding-search";
import { Caption, Room, Surface } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 460 };

const icon = (n: typeof Folder) => { const I = n; return <I size={16} aria-hidden="true" />; };
const items: ExpandingSearchItem[] = [
  { id: "p1", title: "Q4 launch plan", meta: "Project, edited 2 hours ago", group: "Projects", icon: icon(Folder) },
  { id: "p2", title: "Website redesign", meta: "Project, edited yesterday", group: "Projects", icon: icon(Folder) },
  { id: "p3", title: "Mobile onboarding", meta: "Project, edited Monday", group: "Projects", icon: icon(Folder) },
  { id: "d1", title: "Brand guidelines", meta: "Document, Emma Collins", group: "Docs", icon: icon(FileText), keywords: ["logo", "colors"] },
  { id: "d2", title: "API reference", meta: "Document, Daniel Kim", group: "Docs", icon: icon(FileText) },
  { id: "d3", title: "Pricing FAQ", meta: "Document, Hannah Walsh", group: "Docs", icon: icon(FileText) },
  { id: "t1", title: "Design team", meta: "Team, 12 members", group: "Teams", icon: icon(Users) },
  { id: "t2", title: "Platform engineering", meta: "Team, 8 members", group: "Teams", icon: icon(Users) },
];

export default function ExpandingSearchDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  // Where it lives in a product: the end of a toolbar. The icon sits on the right and the field grows left over the
  // free space; the room below the toolbar is for the results panel.
  return (
    <Room below={232} width={520} align="stretch">
      <Surface padding={3} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", paddingLeft: "var(--space-5)" }}>
        <strong style={{ flex: "none", color: "var(--foreground)", fontSize: "var(--text-sm)", fontWeight: 500 }}>Atlas workspace</strong>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExpandingSearch label="Search projects and docs" items={items} suggestions={items.slice(0, 3)} placeholder="Search projects, docs, teams…" onSelect={(i) => setPicked(i.title)} anchor="end" />
        </div>
      </Surface>
      <div style={{ marginTop: "var(--space-3)", textAlign: "center" }}>
        <Caption>{picked ? `Opened “${picked}”.` : "Click the search icon, then type “brand” or “team”."}</Caption>
      </div>
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandingSearch`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Names the button, the field, and the results, such as "Search projects and docs". |
| `items` (required) | `ExpandingSearchItem[]` | — | — |
| `suggestions` | `ExpandingSearchItem[]` | `[]` | Shown before anything is typed, such as recent searches. |
| `suggestionsLabel` | `string` | `"Recent"` | — |
| `placeholder` | `string` | — | — |
| `onSelect` | `(item: ExpandingSearchItem) => void` | — | — |
| `onExpandedChange` | `(expanded: boolean) => void` | — | — |
| `expandedWidth` | `number` | `360` | The widest the field grows. It never grows past its container. |
| `maxResults` | `number` | `6` | — |
| `anchor` | `"start" \| "end"` | `"end"` | The edge the button sits on; the field grows away from it. |
| `emptyHint` | `string` | `"Try a shorter word or check the spelling."` | A short tip under the empty state. |
| `className` | `string` | — | — |

### Exported types

#### `ExpandingSearchItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `meta` | `string` | One short line under the title, such as the type, owner, or last edit. |
| `group` | `string` | Results gather under this heading, in the order groups first appear in `items`. |
| `icon` | `ReactNode` | — |
| `keywords` | `string[]` | Extra words that should also find this item. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the magnifier button, open the field and move focus to it. |
| `↓` or `↑` | Move the highlight through the results or suggestions, wrapping around at the ends. |
| `Enter` | In the field, chooses the highlighted item, calls `onSelect`, and collapses the search. |
| `Esc` | Collapses the field back to the icon, clears the text, and returns focus to the button. |

## Accessibility

- Collapsed, it is a `<button>` named by `label`; open, the field is a `role="combobox"` with `aria-activedescendant`, and the results form a `role="listbox"` with labeled groups.
- A `role="status"` region announces the number of results or the lack of them in fixed English (`3 results`, `No results for …`); `emptyHint` and `suggestionsLabel` are translatable via props.
- When typing, the first result is already highlighted, so `Enter` chooses it; leaving the empty field collapses it, and the clear button stays outside the tab order.

## Motion

- The round button stretches into the field with a spring, and the corner radius follows the width, from circle to control radius.
- The panel unfolds from the field and then only the height follows the content; rows slide to the new position when the list changes and the highlight travels from one row to another.
- With “reduce motion” on, the width changes instantly and panel and results only fade.

## Responsive behavior

- Takes 100% of the container width as a strip that does not intercept clicks; the field grows up to `expandedWidth` (default 360 px) or the width of that strip, whichever is smaller.
- The results panel scrolls inside above `min(22rem, 60vh)`, and long titles are cut with an ellipsis.

## Performance

- The search scans all of `items` on every key, but only `maxResults` rows (default 6) are rendered; two `ResizeObserver`s track the strip and the panel.

## Notes for AI

- Put it in a container with the width the field may take and choose `anchor` (`start` or `end`, default `end`) to say which edge the button sits on.
- `label` is required; each item is `{ id, title, meta?, group?, icon?, keywords? }`, and the order of the groups follows the first appearance of each one in `items`.
- The text and the open state are internal: react to `onSelect(item)` and `onExpandedChange`; the search is local, looks at `title`, `meta`, and `keywords`, and is case-insensitive.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/expanding-search · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
