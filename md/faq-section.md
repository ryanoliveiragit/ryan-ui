# FAQ section

> Perguntas frequentes em acordeão, por categoria ou com busca, com um caminho para falar com alguém.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/faq-section
- Original description: FAQs as an accordion, a topic rail, or a searchable list that highlights matches.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/faq-section.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/faq-section.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/faq-section.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/faq-section.json`. Registry path, relative to the site address: `r/faq-section.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Search field](search-field.md), [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/faq-section/faq-section.tsx`
  - `components/ryan-ui/blocks/faq-section/faq-section.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/search-field/search-field.tsx`
  - `components/ryan-ui/search-field/search-field.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/faq-section.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A frequently-asked-questions section on a product or pricing page, with answers that open in place, in the `accordion` variant.
- Many questions grouped by topic, in the `columns` variant, with a category rail that stays fixed beside them while scrolling.
- Help centers where the person searches by word: the `search` variant filters questions and answers, ignores accents, and highlights the match.

## When not to use

- Use [`accordion`](accordion.md) to reveal sections of any content, not just questions with text answers.
- Avoid when answers need links, lists, or formatting: `answer` is plain text, because it is also what the search compares and highlights.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import FaqSection from "@/components/ryan-ui/blocks/faq-section/faq-section";

export default function FaqSectionDemo() {
  return <FaqSection />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `FaqSection`

A frequently asked questions section in three layouts: one centered accordion, a category rail beside its questions, and a searchable list that filters and highlights as you type. Answers open on a height spring with the icon turning to a close mark; arrow keys move between questions.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"accordion" \| "columns" \| "search"` | `"accordion"` | `accordion` is one centered list, `columns` groups questions beside a category rail, `search` filters as you type. |
| `title` | `string` | `"Frequently asked questions"` | — |
| `description` | `string` | `"Everything you need to know before you insta…` | — |
| `items` | `FaqItem[]` | `faqExampleItems` | — |
| `multiple` | `boolean` | `false` | Allow several answers open at once. Defaults to false. |
| `value` | `string[]` | — | Open item ids (controlled). |
| `defaultValue` | `string[]` | — | Initially open item ids when uncontrolled. |
| `onValueChange` | `(value: string[]) => void` | — | — |
| `category` | `string` | — | Active category in the columns variant (controlled). |
| `onCategoryChange` | `(category: string) => void` | — | — |
| `query` | `string` | — | Search text in the search variant (controlled). |
| `onQueryChange` | `(query: string) => void` | — | — |
| `contact` | `{ label: string; description?: string; href?: string; onClick?: () => void } \| null` | `{ label: "Still have a question?", descriptio…` | A way to reach a person when the answer isn't here. Pass null to hide it. |
| `className` | `string` | — | — |

### `FaqSectionBlock`

Preview: the FAQ with a switch between its three layouts.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `FaqSectionVariant` | `"accordion" \| "columns" \| "search"` |

#### `FaqItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable id used for open state. Defaults to the question. |
| `question` (required) | `string` | — |
| `answer` (required) | `string` | Plain text answer; it is also what search matches. |
| `category` | `string` | Groups questions in the columns variant. |

### Other exports

- `faqExampleItems` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move focus to the previous or next question in the same list, wrapping around. |
| `Home` or `End` | Focus the first or last question in the list. |
| `Enter` or `Space` | Open or close the answer of the focused question; on the `columns` categories, switch the topic. |

## Accessibility

- Each question is a button inside an `h3`, with `aria-expanded` and `aria-controls`, and the answer is a `region` named by the question itself.
- In search, the count of answers found is announced in an `aria-live` region; on the categories, the active topic uses `aria-pressed`.
- `title` becomes the `h2` that names the section; the contact card at the end is a link when it receives `href` and a button otherwise.

## Motion

- The answer opens with the height on a no-overshoot spring and the text descends from a slight blur, while the plus sign rotates 45° and becomes an x.
- In search, questions that stop matching close their height and the remaining ones slide; in `columns`, the new topic's list enters in the direction of the switch and the highlight slides to it.
- With “reduce motion” on, answers, filters, and topics swap instantly and the icon does not animate.

## Responsive behavior

- Container query: below 760px the `columns` rail stops being fixed and the categories become a horizontally scrolling row above the questions.

## Notes for AI

- Import `FaqSection` by name (the default export is the preview with a selector) and choose `variant`: `accordion`, `columns`, or `search`; `search-field` and `segmented-control` come along.
- By default the first question opens and only one stays open at a time: use `multiple` for several and `defaultValue={[]}` to start closed; each item's id is `id` or, without it, the question.
- In `columns`, give each item a `category` (without it, it becomes “General”); `contact={null}` removes the “Still have a question?” card, which does nothing without `href` or `onClick`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/faq-section · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
