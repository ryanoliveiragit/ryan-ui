# Changelog feed

> Linha do tempo de novidades por mês, com versões, tipos de mudança e navegação lateral.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/changelog-feed
- Original description: Release notes you can filter, open in place, and scroll through month by month.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/changelog-feed.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/changelog-feed.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/changelog-feed.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/changelog-feed.json`. Registry path, relative to the site address: `r/changelog-feed.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Copy button](copy-button.md)
- Files, once installed:
  - `components/ryan-ui/blocks/changelog-feed/changelog-feed.tsx`
  - `components/ryan-ui/blocks/changelog-feed/changelog-feed.module.css`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/copy-button/copy-button.tsx`
  - `components/ryan-ui/copy-button/copy-button.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/changelog-feed.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A product's what's-new or release notes page, with each entry tagged New, Improved, or Fixed and details that open in place.
- Long histories grouped by month, where the month bar shows which month the scroll is in and jumps to another.
- Notes that call for an image with a caption or a code snippet with a copy button, without leaving the list.

## When not to use

- Use [`timeline`](timeline.md) for a sequence of events grouped by day, with no type filters or versions.
- Use [`blog-grid`](blog-grid.md) when the updates are articles with a cover, author, and full reading view.
- Avoid when the change types are different: New, Improved, and Fixed are hardcoded, as are the interface texts, in English.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import ChangelogFeed from "@/components/ryan-ui/blocks/changelog-feed/changelog-feed";

export default function ChangelogFeedDemo() {
  return <ChangelogFeed />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ChangelogFeed`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `ChangelogEntry[]` | `exampleEntries` | Release notes, newest first. Each entry belongs to one of `months` by key. |
| `months` | `ChangelogMonth[]` | `exampleMonths` | Months shown in the month bar, newest first. |
| `title` | `string` | `"Changelog"` | — |
| `subtitle` | `string` | `"Halden 4.12 shipped on September 18, 2026"` | One line under the title, such as the latest release. |
| `endNote` | `string` | `"That is everything since Halden 4.5 in June."` | Closing line at the end of the list. |
| `defaultOpen` | `string[]` | — | Entry ids open on first render. Defaults to the newest entry. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ChangelogKind` | `"new" \| "improved" \| "fixed"` |
| `ChangelogMedia` | `\| { type: "photo"; src: string; alt: string; caption: string; /** Pixel size of the image, so the frame keeps its ratio before it loads. */ width?: number; height?: number } \| { type: "code"; file: string; code: string }` |

#### `ChangelogEntry`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `month` (required) | `string` | — |
| `date` (required) | `string` | — |
| `iso` (required) | `string` | — |
| `version` (required) | `string` | — |
| `kind` (required) | `Kind` | — |
| `title` (required) | `string` | — |
| `summary` (required) | `string` | — |
| `details` (required) | `string[]` | — |
| `media` | `Media` | — |

#### `ChangelogMonth`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | — |
| `label` (required) | `string` | — |
| `short` (required) | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On a note, open or close the details; on the filters, turn the type on or off; on a month in the bar, scroll the list to it. |
| `↑` or `↓` or `Page Up` or `Page Down` | With the notes area focused (it joins the Tab order), scroll the list like any scroll area. |
| `Enter` | In the “Subscribe” email field, submits; an invalid address makes the field shake, shows the error, and keeps focus on it. |
| `Esc` | In the email field, goes back to the “Subscribe” button and returns focus to it. |

## Accessibility

- Each note is a button with `aria-expanded` and `aria-controls`, the filters use `aria-pressed`, and a hidden `role="status"` region announces how many notes remain visible after filtering.
- The email has a hidden label, `aria-invalid` on error, and a message in a `role="status"`; on confirmation, focus goes to “Undo”, whose name includes the subscribed address.
- The current month and the animated counts are `aria-hidden`; for the screen reader, each month is a `section` with its own heading and the month bar is a `nav` with “Jump to …” buttons.

## Motion

- The details open with the height on a spring and the content rises from a slight blur; when filtering, the remaining notes slide to their new place while those leaving fade out.
- The numbers scroll up when they grow and down when they shrink, the month name enters in the scroll direction, and the month bar's pill slides to the current month.
- With “reduce motion” on, CSS transitions go to zero, springs and the error shake are turned off, changes become a cut or short fade, and the jump to a month is no longer smooth.

## Responsive behavior

- The list scrolls inside a fixed height of 560px (520px on screens up to 640px); below 640px the header stacks and the date and version move above each note's title.
- Uses window media queries, not container ones: below 480px the year, the month count, and the total of visible notes disappear.

## Performance

- Scroll is read at most once per frame (`requestAnimationFrame`) and a `ResizeObserver` redoes the calculation when the list changes height; photos and code enter the DOM only when the note opens.
- All notes stay in the DOM, each with a layout animation; for hundreds of versions, trim or paginate the list before passing `entries`.

## Notes for AI

- Each entry needs a `month` equal to a `key` from `months` (both from newest to oldest): entries without a matching month do not appear.
- “Subscribe” only validates the email and shows the confirmation, with no submit prop; to really subscribe, edit `SubscribeControl` in the installed file.
- Depends on `copy-button` (installed along with it) to copy the code snippets; `defaultOpen` takes ids and, without it, the first entry starts open.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/changelog-feed · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
