# Citations

> Números de citação no meio do texto que abrem um cartão com a fonte, mais a lista de fontes com destaque compartilhado.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/citations
- Original description: Numbered citation chips inside text that open a card with the source title, site and snippet, plus a sources list; chips and rows share one gliding highlight.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/citations.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/citations.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/citations.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/citations.json`. Registry path, relative to the site address: `r/citations.json`.

- npm packages: `motion`, `lucide-react`, `@radix-ui/react-popover`
- Files, once installed:
  - `components/ryan-ui/citations/citations.tsx`
  - `components/ryan-ui/citations/citations.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react @radix-ui/react-popover`.
2. Copy the files listed above. The content of each one is in `r/citations.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- AI answers or research texts where each claim points to a numbered source.
- When the reader should check the source's title, site and excerpt without leaving the paragraph, and open the original only if they want to.
- When there is a list of sources at the end and it should highlight the source of the chip pointed at in the text, and the chip when a row is pointed at.

## When not to use

- Use [`hover-card`](hover-card.md) for a preview of a person or a standalone link, with no numbering or source list.
- Use [`tooltip`](tooltip.md) when the note is just short text, with no link or interactive content.
- Sources without an address do not fit here: the address is required, and both the card title and the list row are links to it.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Citation, Citations, CitationSources } from "@/components/ryan-ui/citations/citations";
import type { CitationSource } from "@/components/ryan-ui/citations/citations";
import { Caption, Stack, Surface, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

const sources: CitationSource[] = [
  {
    id: "mdn",
    title: "prefers-reduced-motion",
    site: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion",
    snippet: "A media feature that tells a page whether the person has asked their system to keep non-essential motion to a minimum.",
  },
  {
    id: "wcag",
    title: "Understanding SC 2.3.3: Animation from Interactions",
    site: "W3C WAI",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html",
    snippet: "Motion that an interaction triggers should be possible to turn off, unless the animation is essential to the function or to the information.",
  },
  {
    id: "webdev",
    title: "prefers-reduced-motion: Sometimes less movement is more",
    site: "web.dev",
    url: "https://web.dev/articles/prefers-reduced-motion",
    snippet: "Not everyone enjoys decorative animation, and for some people it causes real discomfort. The article shows how to adapt a page to the preference.",
  },
  {
    id: "webkit",
    title: "Responsive Design for Motion",
    site: "WebKit Blog",
    date: "2017",
    url: "https://webkit.org/blog/7551/responsive-design-for-motion/",
    snippet: "Introduces the media query and walks through the kinds of movement that tend to trigger vestibular symptoms, with ways to tone each one down.",
  },
];

export default function CitationsDemo() {
  return (
    <Stack width={560} gap={3}>
      <Surface padding={6}>
        <Citations sources={sources} container={demoStage()}>
          <p>
            Operating systems let people ask for less motion, and browsers pass that choice to your CSS through a media feature
            <Citation source="mdn" />. The accessibility guidelines treat it as more than taste: movement that an interaction starts should be
            possible to switch off unless it is essential
            <Citation source="wcag" defaultOpen />. In practice you rarely remove animation altogether. Swapping a long slide for a short fade keeps the
            feedback without the travel
            <Citation source="webdev" />
            <Citation source="webkit" />.
          </p>
          <CitationSources />
        </Citations>
      </Surface>
      <Caption>Hover a number to preview its source, or click to pin the card. Chips and list rows share one highlight.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Citations`

Groups an answer with its sources. Inside it, `<Citation>` is a numbered chip that opens a card with the source, and `<CitationSources>` lists them all. The parts share one highlight: pointing at a chip marks its row in the list, and pointing at a row lights up its chips.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sources` (required) | `CitationSource[]` | — | Every source that can be cited, in the order they are numbered. |
| `children` (required) | `ReactNode` | — | The text with `<Citation>` chips inside it, and usually a `<CitationSources>` list after it. |
| `activeId` | `string \| null` | — | Id of the highlighted source (controlled). |
| `onActiveIdChange` | `(id: string \| null) => void` | — | Called when hover, focus or an open card changes the highlighted source. |
| `container` | `HTMLElement \| null` | `null` | Render the source cards inside this element and limit collisions to it (used by the demo stages). |
| `className` | `string` | — | Class name added to the root element. |

### `Citation`

A numbered chip for the middle of a sentence. Hover, focus plus Enter, or a tap opens a card with the source; a click pins it open.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `source` (required) | `string` | — | Id of the source this chip cites. |
| `defaultOpen` | `boolean` | `false` | Starts with this chip's card pinned open, for previews. Focus stays where it is until a person uses the card. |
| `className` | `string` | — | Class name added to the chip. |

### `CitationSources`

The numbered list of every source. One highlight glides to the row under the pointer or keyboard focus, or to the source whose chip is active.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Sources"` | Heading above the list. |
| `className` | `string` | — | Class name added to the list wrapper. |

### Exported types

#### `CitationSource`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable id that `<Citation source>` refers to. |
| `title` (required) | `string` | Title of the page or document. |
| `url` (required) | `string` | Address the source opens. |
| `site` | `string` | Name of the site. Defaults to the host of `url`. |
| `snippet` | `string` | Short passage or summary that supports the claim. |
| `date` | `string` | Publication date or year, as it should be shown. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through the chips in the text and the list rows; focus on a row lights up the chips of the same source. |
| `Enter` or `Space` | On a chip, opens the source card and moves focus to it. |
| `Enter` | On the card title or a list row, opens the source in a new tab. |
| `Esc` | Closes the card and returns focus to the chip. |

## Accessibility

- Each chip is a `<button>` with `aria-label` “Source N: title”; the card is a Radix popover (`role="dialog"`) that only receives focus when opened by click or keyboard, never by hover.
- The list is a `<section>` labeled by its own title, with an `<ol>` of links that open in a new tab with `rel="noreferrer noopener"`.
- The “Source N” labels are fixed in English; the list title comes from the `title` prop of `CitationSources` (default “Sources”).

## Motion

- The card grows from the chip, with scale and fade, and its rows enter in sequence; the active chip grows slightly.
- A single highlight slides between the list rows with a spring, following the pointer, focus or active chip; rows enter staggered on mount.
- With “reduce motion” on, the card and rows appear without animation and the highlight switches rows instantly.

## Responsive behavior

- The card is at most 20rem wide and shrinks with the window; it opens above the chip and Radix repositions it to fit, with 12 px of clearance.
- The chip never separates from the preceding word at a line break; in the list, the title truncates at two lines, and in the card the excerpt truncates at four.

## Notes for AI

- There are three parts in the same file: `Citations` receives `sources` and wraps the text, `Citation source="id"` goes inside the sentence and `CitationSources` lists everything; the last two throw an error outside `Citations`.
- The number comes from the position in `sources` (index + 1), not from the order in which the chip appears in the text; a `source` that does not exist in `sources` renders nothing.
- Put `<Citation>` right after the word and before the punctuation; `site` is optional and, without it, the host of `url` is shown.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/citations · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
