# Morphing search

> Ícone de busca que se estica em campo e depois abre um painel de resultados; Esc desfaz o caminho passo a passo.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/morphing-search
- Original description: A search icon that stretches into a field and then grows a results panel with a gliding highlight; Escape walks the same steps back.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-search.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-search.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-search.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-search.json`. Registry path, relative to the site address: `r/morphing-search.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/morphing-search/morphing-search.tsx`
  - `components/ryan-ui/blocks/morphing-search/morphing-search.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/morphing-search.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Search in an app's top bar where space is tight: at rest it is just a 44 px icon and opens on click or with the `/` key.
- Quick navigation through a local list of pages, people, and actions, grouped by type and limited to a few results (`limit`, default 6).

## When not to use

- Use [`command-palette`](command-palette.md) when search is the main command surface, with per-item shortcuts, and not a field inside the bar.
- Use [`expanding-search`](expanding-search.md) when you need recent suggestions before typing or a custom accessible name for the field; here the labels are hardcoded in English.
- Use [`search-field`](search-field.md) when the field is always visible and the results appear elsewhere on the screen.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import MorphingSearchPreview from "@/components/ryan-ui/blocks/morphing-search/morphing-search";
import type { DemoStage } from "./_kit";

// The toolbar app fills the frame; opened, the search panel covers the page inside it.
export const stage: DemoStage = { height: 600 };

export default function MorphingSearchDemo() {
  return <MorphingSearchPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MorphingSearch`

A search icon that stretches into a field and then lets a results panel grow out of it; Escape walks the same steps back.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `SearchItem[]` | `sampleSearchItems` | Everything that can be found. Defaults to sample pages, people and actions. |
| `open` | `boolean` | — | Whether the icon has grown into the field. Pass it with `onOpenChange` to control it. |
| `defaultOpen` | `boolean` | `false` | Whether the search starts open when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the search opens or closes. |
| `query` | `string` | — | Text in the field. Pass it with `onQueryChange` to control it. |
| `defaultQuery` | `string` | `""` | Starting text when uncontrolled. |
| `onQueryChange` | `(query: string) => void` | — | Called with the text of the field whenever it changes. |
| `onSelect` | `(item: SearchItem) => void` | — | Called with the chosen result. The search closes afterwards. |
| `placeholder` | `string` | `"Search pages, people, actions"` | Hint shown in the empty field. |
| `width` | `number` | `440` | Width of the open field in px. It never grows past the space the component is given. |
| `align` | `"start" \| "end"` | `"end"` | Edge the field grows from: `end` keeps the icon's right edge in place, `start` its left edge. |
| `shortcut` | `string` | `"/"` | Key that opens the search from anywhere on the page. Pass an empty string to turn it off. |
| `limit` | `number` | `6` | Most results listed at once. |
| `className` | `string` | — | Extra class for the anchor box. |

### `MorphingSearchPreview`

Ready preview: the search living at the end of an app toolbar, above a page it can cover.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `SearchItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id. |
| `title` (required) | `string` | Main line. This is what the query is matched against. |
| `subtitle` | `string` | Second line: where the item lives or what it does. |
| `group` (required) | `string` | Heading the item is listed under. |
| `icon` | `ReactNode` | Icon shown before the title. Defaults to one that fits the sample groups. |
| `keywords` | `string` | Extra words that should match the item. Only the title and these words are searched. |

### Other exports

- `sampleSearchItems` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `/` | Opens the search from anywhere on the page, as long as focus is not in a text field; the key comes from `shortcut`. |
| `↓` or `↑` | Move the highlight through the results list, wrapping around at the ends. |
| `Enter` | Selects the highlighted result, calls `onSelect`, closes the search, and returns focus to the icon. |
| `Esc` | First clears the text; with an empty field, closes the search and returns focus to the icon. |
| `Tab` | Closes the search and clears the text, without preventing focus from moving on. |

## Accessibility

- The field is a `role="combobox"` with `aria-expanded`, `aria-controls`, and `aria-activedescendant`; results are `role="option"` inside a `listbox`, in groups named by their headings.
- Focus stays on the field while the highlight moves through the options; when closed, the search sets the field to `disabled` and the panel to `inert`, and the no-results state uses `role="status"`.
- The accessible names (“Search”, “Results”, “Clear search”) and the “Suggested …” headings are hardcoded in English in the file.

## Motion

- The icon stretches into the field with a spring that does not overshoot, and only then does the results panel grow downward; on close, the panel folds first and the field shrinks afterward.
- A single highlight slides between rows following the arrows or the pointer, and results enter rising 8 px and reposition when the list filters.
- With “reduce motion” on, width, height, highlight, and rows change instantly.

## Responsive behavior

- The open width is the smaller of `width` (default 440 px) and the measured space of the anchor, so the field never exceeds the container.
- Below 36rem of viewport, the keyboard hints line in the panel footer is hidden.

## Performance

- Filtering is local and synchronous over `items` on every keystroke, with no loading state: it suits in-memory lists, not remote search.
- Uses two `ResizeObserver`s (anchor and panel) and `document` listeners only while needed: `keydown` for the shortcut when closed and `pointerdown` when open.

## Notes for AI

- Import the named component `MorphingSearch`; the file's default export is `MorphingSearchPreview`, the demo with a fictional app around it.
- The anchor takes 100% of the parent's width and reserves only 44 px of height: the field grows up to `width` from the `align` edge and floats over the content, so the parent must provide that space and must not clip with `overflow: hidden`.
- Only `title` and `keywords` are searched (`subtitle` is not); control it with `open` and `onOpenChange`, `query` and `onQueryChange`, and pass `shortcut=""` to turn off the global key.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/morphing-search · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
