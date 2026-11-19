# Bouncy accordion

> Acordeão em que o item aberto se solta dos vizinhos: o espaço cresce e os cantos arredondam com um leve quique.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/bouncy-accordion
- Original description: An accordion whose open item detaches from its neighbors: the gaps widen and the facing corners round off with a small bounce.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bouncy-accordion.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bouncy-accordion.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bouncy-accordion.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bouncy-accordion.json`. Registry path, relative to the site address: `r/bouncy-accordion.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/bouncy-accordion/bouncy-accordion.tsx`
  - `components/ryan-ui/bouncy-accordion/bouncy-accordion.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/bouncy-accordion.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Frequently asked questions on a landing page where the open item should stand out from the block, with an icon before each question.
- Lists where several answers can stay open at the same time, with `multiple`.
- Accordions whose state comes from outside, such as the URL or a form, with `value` and `onValueChange`.

## When not to use

- Use [`accordion`](accordion.md) on dense pages or documentation, where thin dividers and less motion fit better.
- Use [`collapsible`](collapsible.md) for a single region that opens and closes.
- Use [`faq-section`](faq-section.md) when you need the whole question section, with topics or search.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CreditCard, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import { BouncyAccordion } from "@/components/ryan-ui/bouncy-accordion/bouncy-accordion";
import type { BouncyAccordionItem } from "@/components/ryan-ui/bouncy-accordion/bouncy-accordion";
import Switch from "@/components/ryan-ui/switch/switch";
import { Stack } from "./_kit";

const questions: BouncyAccordionItem[] = [
  { value: "seats", icon: <Users size={17} />, title: "Can I change the number of seats later?", content: "Yes. Add or remove seats at any time from Billing. New seats are charged for the days left in the cycle, and removed seats turn into credit on your next invoice." },
  { value: "billing", icon: <CreditCard size={17} />, title: "Which payment methods do you accept?", content: "All major credit and debit cards. Annual plans above 20 seats can also pay by bank transfer with a 30 day invoice." },
  { value: "refunds", icon: <RefreshCcw size={17} />, title: "What is your refund policy?", content: "Monthly plans can be cancelled whenever you like and stay active until the end of the period. Annual plans are refunded in full during the first 30 days." },
  { value: "security", icon: <ShieldCheck size={17} />, title: "Where is my data stored?", content: "In the region you choose when you create the workspace: Frankfurt, Virginia or São Paulo. Backups are encrypted and stay in the same region." },
];

export default function BouncyAccordionDemo() {
  const [open, setOpen] = useState<string[]>(["billing"]);
  const [multiple, setMultiple] = useState(false);
  return (
    <Stack gap={5} width={480}>
      <BouncyAccordion items={questions} value={open} onValueChange={setOpen} multiple={multiple} />
      <Switch label="Keep several answers open" checked={multiple} onCheckedChange={next => { setMultiple(next); if (!next) setOpen(current => current.slice(-1)); }} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BouncyAccordion`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `BouncyAccordionItem[]` | — | The sections, in order. |
| `value` | `string[]` | — | Values of the open items (controlled). |
| `defaultValue` | `string[]` | — | Values of the items open at first when uncontrolled. |
| `onValueChange` | `(value: string[]) => void` | — | Called with the values of the open items after each change. |
| `multiple` | `boolean` | `false` | Lets several items stay open. By default opening one closes the others. |
| `gap` | `number` | `12` | Gap in px around an open item. Closed neighbors sit 3 px apart. |
| `radius` | `number` | `22` | Corner radius in px of the block's outer corners and of every corner that faces an open gap. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level that wraps each trigger, to fit the page outline. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

#### `BouncyAccordionItem`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | Unique id of the item; this is what `value` and `onValueChange` carry. |
| `title` (required) | `ReactNode` | The question or section name shown on the trigger. |
| `content` (required) | `ReactNode` | The content revealed when the item opens. |
| `icon` | `ReactNode` | Optional leading icon. |
| `disabled` | `boolean` | Keeps the item closed and skips it during keyboard navigation. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Opens or closes the focused item; without `multiple`, opening one closes the others. |
| `↓` or `↑` | Moves focus to the next or previous title, skipping disabled ones and wrapping to the first after the last. |
| `Home` or `End` | Moves focus to the first or last enabled title. |

## Accessibility

- Each title is a `<button>` inside a heading of level `headingLevel` (default 3), with `aria-expanded` and `aria-controls`; the panel is a `region` tied to the title.
- When it finishes closing, the panel gets `visibility: hidden` and leaves the Tab order and the accessibility tree; the icon and plus sign are hidden from the screen reader.
- Items with `disabled` use the button's native `disabled` and are skipped by the arrows.

## Motion

- The open item breaks away from its neighbors: the margins grow from 3 px up to `gap` and the corners facing the space round up to `radius`, on a spring with a small bounce.
- The height opens with the same bounce and closes on a no-overshoot spring; the content moves down 10 px as it appears and the plus sign rotates 135° until it becomes an x.
- With “reduce motion” on, margins, corners, height, and icon change instantly, and the button's grow on hover is turned off.

## Notes for AI

- `value` is always a list of strings, even without `multiple`, and `onValueChange` receives the whole list; all start closed (`defaultValue` is `[]`).
- When turning off `multiple` with controlled state, trim the list yourself, as the demo does with `current.slice(-1)`; the component does not do this.
- Each item needs a unique `value`; `title` accepts any React node and `icon` is optional. Import from `@/components/ryan-ui/bouncy-accordion/bouncy-accordion`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/bouncy-accordion · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
