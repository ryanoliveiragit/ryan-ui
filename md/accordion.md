# Accordion

> Revela informações de apoio no próprio lugar, uma seção por vez.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/accordion
- Original description: Progressively reveal supporting information in place.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/accordion.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/accordion.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/accordion.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/accordion.json`. Registry path, relative to the site address: `r/accordion.json`.

- npm packages: `@radix-ui/react-accordion`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/accordion/accordion.tsx`
  - `components/ryan-ui/accordion/accordion.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-accordion lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/accordion.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Frequently asked questions on a pricing or help page, with `size="lg"` for questions in large text and answers in reading-size body text.
- Supporting information that only some people need, such as billing or privacy details, without taking anyone off the page.
- Lists where only one answer needs to stay open: opening an item closes the previous one, and clicking the open item closes it.

## When not to use

- Use [`bouncy-accordion`](bouncy-accordion.md) when you need several items open at the same time or controlled state; this accordion only has `defaultOpen`.
- Use [`collapsible`](collapsible.md) for a single region that opens and closes next to its own title.
- Use [`faq-section`](faq-section.md) when the page needs a whole section of questions, with topics or search.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import Accordion from "@/components/ryan-ui/accordion/accordion";
import { Stack } from "./_kit";

const faqs = [
  { title: "Can I change my plan later?", content: "Yes. Upgrade or downgrade at any time from Billing. Changes apply immediately and we prorate the difference on your next invoice." },
  { title: "How does the free trial work?", content: "You get 14 days of every feature with no card required. If you do not subscribe, your workspace becomes read-only until you do." },
  { title: "Who can see my data?", content: "Only the members you invite. Data is encrypted at rest and in transit, and our staff access it only with your written permission." },
  { title: "Do you offer refunds?", content: "Annual plans are refundable within 30 days of purchase. Monthly plans can be cancelled at any time without a further charge." },
];

export default function AccordionDemo() {
  return <Stack width={520}><Accordion items={faqs} defaultOpen={0} /></Stack>;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Accordion`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `AccordionItem[]` | — | — |
| `defaultOpen` | `number` | `0` | — |
| `size` | `"md" \| "lg"` | `"md"` | "lg" suits page-level FAQs: questions at the large text size, answers at body size. |

### Exported types

#### `AccordionItem`

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | — |
| `content` (required) | `ReactNode` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Opens the focused item and closes the one that was open; on an item that is already open, closes it. |
| `↓` or `↑` | Moves focus to the next or previous title, wrapping to the first after the last. |
| `Home` or `End` | Moves focus to the first or last title. |

## Accessibility

- Built on the Radix Accordion: each title is a `<button>` inside an `<h3>`, with `aria-expanded` and `aria-controls`, and each panel is a `region` tied to its title.
- When it finishes collapsing, the panel gets `visibility: hidden` and leaves the Tab order and the accessibility tree; the screen reader only finds the open answer.
- The heading level is fixed at `<h3>`; if the page hierarchy calls for another level, use `bouncy-accordion`, which accepts `headingLevel`.

## Motion

- The panel height follows the content on a no-overshoot spring, and the answer moves down 6 px out of a slight blur as it appears.
- The arrow rotates 180° on a short spring; switching items mid-animation redirects the height instead of restarting.
- With “reduce motion” on, panels and arrow go straight to the final state, without animation.

## Responsive behavior

- At size `lg`, below 520 px the minimum title height drops from 76 to 68 px and the fonts go down one step.

## Notes for AI

- The first item starts open (`defaultOpen` is 0); pass `defaultOpen={-1}` to start with everything closed.
- Items are `{ title, content }`: `title` is plain text and `content` accepts any React node; there is no `value` or `onValueChange`.
- Import from `@/components/ryan-ui/accordion/accordion`; it takes 100% of the width, so limit the width on the parent (the demo uses 520 px).

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/accordion · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
