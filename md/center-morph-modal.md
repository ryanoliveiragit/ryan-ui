# Center morph modal

> Um cartão da grade cresce até virar um modal no centro da tela, e o resumo dá lugar ao conteúdo completo.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/center-morph-modal
- Original description: A grid of cards in which the chosen card morphs into a centered modal: its box, icon and title travel while the summary crossfades to the expanded content.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/center-morph-modal.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/center-morph-modal.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/center-morph-modal.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/center-morph-modal.json`. Registry path, relative to the site address: `r/center-morph-modal.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/center-morph-modal/center-morph-modal.tsx`
  - `components/ryan-ui/center-morph-modal/center-morph-modal.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/center-morph-modal.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Galleries of templates, recipes, or integrations where each card opens its own details without changing pages.
- Catalogs where the card summary (`summary`) is enough to choose and the full content (`content`) only appears in the modal, with actions in the footer.
- Grids where continuity matters: icon and title travel from the card to the modal header.

## When not to use

- Use [`dialog`](dialog.md) for a confirmation or form that does not originate from a card in a grid.
- Use [`expandable-card`](expandable-card.md) when the details fit in the card itself and the page does not need to be blocked.
- Use [`image-viewer`](image-viewer.md) for photo galleries with zoom and navigation between images.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { BellRing, CalendarCheck, MailPlus, ReceiptText } from "lucide-react";
import { CenterMorphModal } from "@/components/ryan-ui/center-morph-modal/center-morph-modal";
import type { CenterMorphItem } from "@/components/ryan-ui/center-morph-modal/center-morph-modal";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./center-morph-modal.module.css";

function Steps({ when, then }: { when: string; then: string[] }) {
  return (
    <>
      <dl className={styles.steps}>
        <div><dt>When</dt><dd>{when}</dd></div>
        {then.map((step, index) => <div key={step}><dt>{index === 0 ? "Then" : "And"}</dt><dd>{step}</dd></div>)}
      </dl>
    </>
  );
}

const recipes: CenterMorphItem[] = [
  {
    id: "digest", title: "Weekly digest", subtitle: "Every Monday at 9:00", meta: "Popular", media: <CalendarCheck size={20} />,
    summary: "Send the team a summary of what shipped last week.",
    content: <><p>Collects everything marked done in the last seven days and posts one tidy summary, grouped by project, to the channel you choose.</p><Steps when="It is Monday, 9:00 in the workspace time zone" then={["Gather tasks completed since last Monday", "Post the summary to #team-updates"]} /></>,
  },
  {
    id: "stale", title: "Stale task nudge", subtitle: "Checks once a day", meta: "2 steps", media: <BellRing size={20} />,
    summary: "Remind the owner when a task has not moved in 5 days.",
    content: <><p>Keeps work from going quiet. The owner gets a direct message with the task and a one-tap way to update its status or hand it over.</p><Steps when="A task in progress has no activity for 5 days" then={["Send the owner a reminder", "Add the label “Needs attention”"]} /></>,
  },
  {
    id: "lead", title: "New lead alert", subtitle: "Runs instantly", meta: "3 steps", media: <MailPlus size={20} />,
    summary: "Create a contact and tell sales when a form comes in.",
    content: <><p>Turns every form submission into a contact, assigns it by region and lets the right person know within seconds.</p><Steps when="Someone submits the contact form" then={["Create the contact with the form answers", "Assign it to the regional owner", "Notify them in #sales"]} /></>,
  },
  {
    id: "invoice", title: "Invoice follow-up", subtitle: "3 days after the due date", meta: "2 steps", media: <ReceiptText size={20} />,
    summary: "Send a polite reminder when an invoice is overdue.",
    content: <><p>Sends a friendly reminder with the payment link, then tells finance if the invoice is still open a week later.</p><Steps when="An invoice is 3 days past its due date" then={["Email the customer a reminder", "Alert finance after 7 more days"]} /></>,
  },
];

export const stage: DemoStage = { height: 560 };

export default function CenterMorphModalDemo() {
  // On the docs page the chosen card grows to the center of the preview, so the modal opens whole and the page keeps scrolling.
  const [container] = useState(demoStage);
  const [open, setOpen] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<string[]>([]);
  return (
    <Stack gap={4} width={560}>
      <CenterMorphModal
        container={container}
        items={recipes.map(recipe => enabled.includes(recipe.id) ? { ...recipe, meta: "On" } : recipe)}
        value={open}
        onValueChange={setOpen}
        renderFooter={(item, close) => {
          const on = enabled.includes(item.id);
          return (
            <>
              <Button variant="ghost" onClick={close}>Not now</Button>
              <Button onClick={() => { setEnabled(current => on ? current.filter(id => id !== item.id) : [...current, item.id]); close(); }}>{on ? "Turn off" : "Use this recipe"}</Button>
            </>
          );
        }}
      />
      <Caption>Pick a recipe: the card itself becomes the dialog. {enabled.length ? `${enabled.length} turned on.` : "None turned on yet."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CenterMorphModal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `CenterMorphItem[]` | — | The cards, in order. |
| `value` | `string \| null` | — | Id of the open card, or null when none is open (controlled). |
| `defaultValue` | `string \| null` | `null` | Id of the card open at first when uncontrolled. |
| `onValueChange` | `(id: string \| null) => void` | — | Called with the id of the card that opened, or null when the modal closes. |
| `renderFooter` | `(item: CenterMorphItem, close: () => void) => ReactNode` | — | Actions shown under the expanded content. Receives the open item and a function that closes the modal. |
| `minColumnWidth` | `number` | `220` | Narrowest a card may get in px before the grid drops a column. |
| `width` | `number` | `480` | Maximum width of the modal in px. |
| `className` | `string` | — | Extra class for the grid. |
| `container` | `HTMLElement \| null` | — | Renders the modal inside this element instead of the page body: the scrim covers only the element and the card grows to its center. The element needs position: relative and overflow: hidden. The page around it stays usable while the modal is open: nothing is scroll-locked or hidden from assistive technology, and Escape, the scrim and the close button still close it. |

### Exported types

#### `CenterMorphItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id; this is what `value` and `onValueChange` carry. |
| `title` (required) | `string` | Title shown on the card and carried into the modal. |
| `subtitle` | `string` | One line under the title, on the card and in the modal. |
| `media` | `ReactNode` | Icon or small image. It travels from the card to the modal header and grows on the way. |
| `summary` | `ReactNode` | Short text shown only on the card. It fades out as the card opens. |
| `meta` | `ReactNode` | Small trailing label on the card, such as a status or a count. |
| `content` (required) | `ReactNode` | The expanded content, shown only in the modal. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the focused card, opens the modal. |
| `Tab` or `Shift + Tab` | Move through the modal controls without leaving it; on open, focus goes to the first control, the close button. |
| `Esc` | Closes the modal; focus returns to the card that opened it. |

## Accessibility

- Each card is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`; the modal is a Radix dialog with the title as its name and the `subtitle` as its description.
- With the modal open, focus is trapped in it and the rest of the page leaves the accessibility tree; on close, focus returns to the originating card.
- The close button is named “Close”, fixed in English in the code; the card media is hidden from the screen reader.

## Motion

- The card's box, media, and title are the same elements as the modal's and travel to the center on a spring with a slight bounce; on close, they return on a spring without bounce.
- The summary disappears while subtitle, body, and footer arrive one after another, rising 12 px out of a slight blur, and all leave at once.
- With “reduce motion” on, there is no shared travel: the modal only fades on enter and exit.

## Responsive behavior

- The grid uses `auto-fill` with columns of at least `minColumnWidth` (default 220 px) and loses columns as the width shrinks.
- The modal takes the screen width minus 2rem up to `width` (default 480 px), with a maximum height of `100dvh` minus 2rem and inner scrolling.

## Notes for AI

- Each item has `id`, `title`, and `content`; `summary` and `meta` only appear on the card, and `subtitle` and `media` appear on both.
- Use `renderFooter(item, close)` for the actions and call `close()` after acting; to control the open card, use `value` (an `id` or `null`) with `onValueChange`.
- Import `CenterMorphModal` from `@/components/ryan-ui/center-morph-modal/center-morph-modal`; it draws the whole grid, so pass all the cards at once.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/center-morph-modal · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
