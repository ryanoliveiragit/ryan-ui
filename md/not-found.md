# Not found

> Página 404 com uma ilustração animada feita de formas, um campo de busca e atalhos para voltar ao site.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/not-found
- Original description: A 404 page with an illustration built from shapes (a zero with eyes that follow the pointer between two fours), a search field that filters the suggested pages, and links back.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/not-found.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/not-found.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/not-found.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/not-found.json`. Registry path, relative to the site address: `r/not-found.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/not-found/not-found.tsx`
  - `components/ryan-ui/blocks/not-found/not-found.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/not-found.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- 404 page of a site or app that has a few known destinations to suggest and, preferably, a search to send the query to.
- Products where an error page can have a light tone: the illustration has a zero with a face that follows the mouse and jumps when clicked.

## When not to use

- Use [`empty-state`](empty-state.md) when the page exists but a list or search has nothing to show.
- Use [`alert`](alert.md) for a recoverable error inside a screen that is still useful.
- For a 500 error or maintenance the art does not fit: the two fours and the zero are drawn in the file's SVG.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import NotFoundPreview from "@/components/ryan-ui/blocks/not-found/not-found";
import type { DemoStage } from "./_kit";

// The whole page (picture, copy, search and links) is taller than the default block stage.
export const stage: DemoStage = { height: 820 };

export default function NotFoundDemo() {
  return <NotFoundPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `NotFound`

A 404 page that is pleasant to land on. The picture is built from plain shapes: two fours and a round zero with eyes that follow the pointer, blink, and hop when poked, while small shapes drift around with depth. Below it, a search field filters the suggested pages as you type.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | `"Error 404"` | Small label above the title. |
| `title` | `string` | `"This page wandered off"` | Main heading. |
| `description` | `string` | `"The link may be old, or the page may have mo…` | Text under the heading. |
| `links` | `NotFoundLink[]` | `defaultLinks` | Pages offered as a way back. The search field filters them as you type. |
| `homeHref` | `string` | `"/"` | Target of the main button. |
| `homeLabel` | `string` | `"Back to home"` | Text of the main button. |
| `searchPlaceholder` | `string` | `"Search pages"` | Placeholder of the search field. |
| `onSearch` | `(query: string) => void` | — | Called with the trimmed query when the search form is submitted. |
| `onNavigate` | `(link: NotFoundLink, event: MouseEvent<HTMLAnchorElement>) => void` | — | Called when a link or the main button is used. Call `event.preventDefault()` to route on the client. |
| `className` | `string` | — | Extra class for the section. |

### `NotFoundPreview`

Ready preview. Links stay on the page and report what they would open.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `NotFoundLink`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Link text. |
| `href` (required) | `string` | Where the link goes. |
| `description` | `string` | One short line under the label. |
| `icon` | `ReactNode` | Icon in the link's tile. |
| `keywords` | `string` | Extra words the search should match, separated by spaces. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the search field, submits the form and calls `onSearch` with the text trimmed at both ends. |

## Accessibility

- The section is named by the title's `<h1>`, and the illustration is a `role="img"` with an English `aria-label`, hardcoded in the file.
- The search is a `role="search"` form whose field uses `searchPlaceholder` as its `aria-label`; the “N of M pages match” line is `aria-live="polite"` and announces the filter result.
- The zero's jump on click has no keyboard equivalent or button role: it is decoration and carries no information.

## Motion

- The pieces land one after another with a slightly bouncy spring: the fours and the zero fall from above and the smaller shapes appear growing.
- At rest, CSS animations make the zero float and blink, the second four sway, and the shapes drift and rotate; with a mouse, the eyes follow the pointer and the layers shift at different depths.
- With “reduce motion” on, the illustration appears still, with no loops, no pointer following, and no jump, and the filtered links change instantly.

## Responsive behavior

- The block is a centered column up to 36rem; below 30rem of viewport the link grid goes from two columns to one and the spacing shrinks.

## Notes for AI

- Import the named component `NotFound`; the default export is `NotFoundPreview`, which blocks link navigation for the demo.
- Pass your site's `links` (each `href` is used as a key and must be unique) and `onSearch` to carry the query to your search; without `onSearch`, submitting the form does nothing.
- For client-side routing, use `onNavigate(link, event)` and call `event.preventDefault()`; the block renders an `<h1>`, so it should be the page's main content.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/not-found · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
