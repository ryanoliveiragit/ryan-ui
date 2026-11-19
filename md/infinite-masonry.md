# Infinite masonry

> Mural em colunas com cartões de alturas diferentes que carrega mais conforme você rola, com os novos subindo em sequência.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/infinite-masonry
- Original description: Masonry feed of cards with different heights that loads the next page as the end scrolls into view, with new cards rising in on a stagger.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/infinite-masonry.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/infinite-masonry.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/infinite-masonry.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/infinite-masonry.json`. Registry path, relative to the site address: `r/infinite-masonry.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/infinite-masonry/infinite-masonry.tsx`
  - `components/ryan-ui/blocks/infinite-masonry/infinite-masonry.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/infinite-masonry.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Image galleries and feeds with varying aspect ratios (portfolios, inspiration, product photos) that load the next page when nearing the end.
- Content coming from a paginated API: `loadPage(page)` receives the page number and returns the cards, and an empty list ends the feed.

## When not to use

- Use [`blog-grid`](blog-grid.md) when the items are posts with text, category, and numbered pagination.
- Use [`pagination`](pagination.md) with an ordinary grid when the person needs to return to an exact position or reach the page footer.
- Avoid for thousands of items: there is no virtualization, and all loaded cards stay in the DOM.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import InfiniteMasonry from "@/components/ryan-ui/blocks/infinite-masonry/infinite-masonry";

export default function InfiniteMasonryDemo() {
  return <InfiniteMasonry />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `InfiniteMasonry`

Masonry feed: cards of different heights fill the shortest column, and the next page loads when the end scrolls into view.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialItems` | `MasonryItem[]` | — | Cards shown before any loading. Defaults to the first sample page. |
| `loadPage` | `(page: number) => Promise<MasonryItem[]>` | `simulatedLoad` | Loads the next page. Receives the page number (1 for the first load after the initial cards). Resolve with an empty list to end the feed. Defaults to a simulated loader. |
| `minColumnWidth` | `number` | `160` | Narrowest a column may get, in px. The grid fits as many columns as its width allows. |
| `maxColumns` | `number` | `4` | Most columns the grid uses, however wide it gets. |
| `title` | `string` | `"Fresh from the studio"` | Heading above the grid. |
| `onLikeChange` | `(id: string, liked: boolean) => void` | — | Called when a card's like button is toggled. |
| `className` | `string` | — | Extra class for the section. |

### Exported types

#### `MasonryItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id. Cards with an id already in the feed are skipped. |
| `title` (required) | `string` | Name of the shot, shown under the image. |
| `author` (required) | `string` | Who made it, shown under the title. |
| `avatar` (required) | `string` | Avatar image of the author. |
| `image` (required) | `string` | Image address. |
| `alt` (required) | `string` | Text alternative of the image. |
| `ratio` (required) | `number` | Image height divided by its width. The grid reserves this space before the image loads. |
| `likes` (required) | `number` | Like count before the visitor's own like. |

### Other exports

- `sampleMasonryPage` (function)

## Accessibility

- The container uses `role="feed"` with `aria-busy` while loading, and each card is an `article` with `aria-posinset`, `aria-setsize` (−1 until the end of the feed), and the name “title by author”.
- The like button exposes `aria-pressed` and a name with the total likes, and the `role="status"` footer announces loading and the end of the feed.
- Fill in `alt` for each item: it is the image's alternative text; the author avatar is decorative.

## Motion

- New cards rise and grow slightly on a soft spring, in a cascade within the page that arrived; those that already appeared do not repeat the entrance when changing column.
- While loading, each column gets a placeholder block with a shimmer passing over it and three dots bounce in the footer; liking makes the heart jump.
- With “reduce motion” on, the cards only fade, the heart does not jump, the shimmer and dots stop, and the image does not zoom on hover.

## Responsive behavior

- The number of columns comes from the block's own width (`minColumnWidth`, up to `maxColumns`), measured by `ResizeObserver`; columns under 200px hide the avatar.
- Each image reserves its height through `ratio` before loading, so the grid does not jump when the photos arrive.

## Performance

- An `IntersectionObserver` triggers `loadPage` 320px before the end and keeps requesting pages while the end is in view; images use `loading="lazy"`.

## Notes for AI

- Pass `loadPage` (without it, the block simulates four example pages) and return `[]` to end; an error also ends the feed, with no retry.
- Each item needs `ratio` (image height divided by width): the block uses it to reserve space and balance the columns; repeated ids are discarded.
- Likes are internal state and start empty: `onLikeChange(id, liked)` reports the change, but there is no prop to load what the person already liked.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/infinite-masonry · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
