# Blog grid

> Índice de blog com post em destaque, filtro por categoria, cartões, paginação e leitor no próprio lugar.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/blog-grid
- Original description: A blog index with a featured post, category filter, post cards, pagination and an in-place reader.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/blog-grid.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/blog-grid.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/blog-grid.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/blog-grid.json`. Registry path, relative to the site address: `r/blog-grid.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/blog-grid/blog-grid.tsx`
  - `components/ryan-ui/blocks/blog-grid/blog-grid-data.ts`
  - `components/ryan-ui/blocks/blog-grid/blog-grid.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/blog-grid.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A blog or news index for a site, with a featured post, category filter, and pagination, all from an in-memory list of posts.
- Prototypes and static sites without a router: without `getHref`, clicking opens the post in an in-place reader and “All posts” returns to the index.
- Editorial lists with a cover image, summary, author, and reading time on each card.

## When not to use

- Use [`changelog-feed`](changelog-feed.md) for release notes, with change type, version number, and month navigation.
- Use [`infinite-masonry`](infinite-masonry.md) when the content is an image feed of varying heights that loads on scroll.
- Avoid when posts arrive paginated from the server: the block sorts, filters, and paginates the whole list passed in `posts` on the client.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import BlogGrid from "@/components/ryan-ui/blocks/blog-grid/blog-grid";

export default function BlogGridDemo() {
  return <BlogGrid />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BlogGrid`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Journal"` | — |
| `description` | `string` | `"Product news, design notes and engineering d…` | — |
| `posts` | `BlogPost[]` | `blogPosts` | — |
| `categories` | `string[]` | `blogCategories` | Category filter labels, in order. "All" is added in front. |
| `category` | `string` | — | Active category, or "All" (controlled). |
| `defaultCategory` | `string` | `"All"` | — |
| `onCategoryChange` | `(category: string) => void` | — | — |
| `page` | `number` | — | One based page (controlled). |
| `defaultPage` | `number` | `1` | — |
| `onPageChange` | `(page: number) => void` | — | — |
| `pageSize` | `number` | `6` | Cards per page below the featured post. Defaults to 6. |
| `showFeatured` | `boolean` | `true` | Shows the newest post of the current filter as a large card on page one. Defaults to true. |
| `getHref` | `(post: BlogPost) => string` | — | Link for each post. When set, cards render as links and the in-place reader is off. |
| `onPostOpen` | `(post: BlogPost) => void` | — | Called when a post opens, from a link or the in-place reader. |
| `className` | `string` | — | — |

### `BlogGridBlock`

Preview: the blog index with the in-place reader.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `BlogAuthor`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `avatar` | `string` | — |
| `role` | `string` | — |

#### `BlogPost`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `excerpt` (required) | `string` | — |
| `category` (required) | `string` | — |
| `date` (required) | `string` | ISO date, used for sorting and the visible date. |
| `readTime` (required) | `number` | Minutes to read. |
| `author` (required) | `BlogAuthor` | — |
| `image` | `{ src: string; alt: string }` | — |
| `body` | `string[]` | Paragraphs for the in-place reader. Leave out when every post links out through getHref. |
| `featured` | `boolean` | — |

### Other exports

- `blogCategories` (value)
- `blogPosts` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | On a card, opens the post in the reader and moves focus to the “All posts” button; with `getHref`, follows the link. |
| `Enter` or `Space` | Activate the category filters, the page numbers, and the “Previous”, “Next”, and “All posts” buttons. |

## Accessibility

- The cards are links (`<a>`), the filters are buttons with `aria-pressed`, and pagination is a `<nav>` with `aria-current="page"` on the current page.
- When the reader opens, focus goes to “All posts”; when it closes, focus returns to the originating card, which is scrolled into view; there is no Esc key to close.
- Fill in `image.alt` for each post: it is the cover's alternative text on the card and in the reader; the author avatar is decorative (`alt=""`).

## Motion

- The card cover travels and grows into the reader image (shared element, no-overshoot spring) and makes the trip back on close, while the rest of the index fades out and gradually reappears.
- Changing page slides the content in the direction of navigation, the filter and page highlights slide to the new item, and the height follows with a spring, with no pagination jump.
- With “reduce motion” on, the cover does not travel, transitions become a fade, the highlights and height change instantly, and scrolling to the top is no longer smooth.

## Responsive behavior

- Container query on the block itself: three columns, two below 900px, and one below 540px; below 680px the featured post stacks the image above the text.
- The filter strip scrolls horizontally without a scrollbar, and below 540px “Previous” and “Next” show only the icon.

## Performance

- Covers use a plain `<img>` with `loading="lazy"` (the featured one loads immediately), so serve files that are already resized; a `ResizeObserver` measures the page to animate the height.

## Notes for AI

- Import `BlogGrid` by name to pass props (the default export, `BlogGridBlock`, is only the preview); `category` and `page` support controlled use with `onCategoryChange` and `onPageChange`.
- With `getHref` the cards become real links and the reader is turned off; without it, fill in `body` for each post (paragraphs as plain text), otherwise the reader shows only the summary.
- Pass `categories` with the same categories used in `posts` (the default is the example list; “All” is added by the block) and ISO dates in `date` (`2026-09-18`), which sort the posts and generate the displayed date.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/blog-grid · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
