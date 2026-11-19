# Card stack

> Pilha de cartões para arrastar e decidir, com botões, desfazer e acessibilidade por teclado.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/card-stack
- Original description: Review a deck one card at a time, with a throw and an undo.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-stack.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-stack.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-stack.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-stack.json`. Registry path, relative to the site address: `r/card-stack.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/card-stack/card-stack.tsx`
  - `components/ryan-ui/card-stack/card-stack.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/card-stack.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Quick triage, one item at a time, where each deserves a moment of attention: selecting destinations, candidates, or design options.
- Two-sided decisions (keep or pass) with undo, by dragging, with the buttons, or with the keyboard arrow keys.
- Long decks: only four cards are mounted at a time.

## When not to use

- Use [`sortable-data-table`](sortable-data-table.md) when people need to compare items side by side.
- Use [`carousel`](carousel.md) to browse a set without deciding anything about each item.
- Use [`swipe-actions`](swipe-actions.md) for swipe actions on the rows of a list; here there are only two outcomes per card.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CardStack, type CardDecision } from "@/components/ryan-ui/card-stack/card-stack";
import { photo } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 480 };

const trips = [
  { id: "lisbon", name: "Lisbon", note: "Tiled streets and trams from €420", img: photo("lisbon-rooftops") },
  { id: "dolomites", name: "Dolomites", note: "Alpine lakes and hut-to-hut hikes from €690", img: photo("alpine-lake") },
  { id: "algarve", name: "Algarve", note: "Quiet coves and sea-view dinners from €380", img: photo("coastline") },
  { id: "tuscany", name: "Tuscany", note: "Slow farm stays from €540", img: photo("terracotta-waves") },
];

export default function CardStackDemo() {
  const [kept, setKept] = useState<string[]>([]);
  const decide = (trip: (typeof trips)[number], d: CardDecision) => setKept(k => (d === "right" ? [...k, trip.name] : k));
  return (
    <Stack gap={4} align="center">
      <CardStack
        label="Trip ideas"
        items={trips}
        getKey={t => t.id}
        getLabel={t => t.name}
        labels={{ left: "Skip", right: "Shortlist" }}
        outcomes={{ left: "skipped", right: "shortlisted" }}
        onDecide={decide}
        onReset={() => setKept([])}
        renderCard={t => (
          <div style={{ position: "relative", height: "100%" }}>
            <img src={t.img.src} alt="" draggable={false} style={{ display: "block", width: "100%", height: "60%", objectFit: "cover" }} />
            <div style={{ padding: "var(--space-4)", display: "grid", gap: "var(--space-1)" }}>
              <strong style={{ fontSize: "var(--text-lg)" }}>{t.name}</strong>
              <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{t.note}</span>
            </div>
          </div>
        )}
      />
      <Caption>Drag a card or use the buttons. Shortlisted: {kept.length ? kept.join(", ") : "none yet"}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CardStack`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `T[]` | — | — |
| `getKey` (required) | `(item: T) => string` | — | — |
| `getLabel` (required) | `(item: T) => string` | — | A short name for the card, used in its accessible label and announcements, such as "Lisbon". |
| `renderCard` (required) | `(item: T) => ReactNode` | — | — |
| `onDecide` | `(item: T, decision: CardDecision) => void` | — | — |
| `onUndo` | `(item: T, decision: CardDecision) => void` | — | — |
| `onReset` | `() => void` | — | — |
| `labels` | `{ left: string; right: string }` | `{ left: "Pass", right: "Keep" }` | Action names for each side, used on the buttons and the stamps that appear while dragging. |
| `outcomes` | `{ left: string; right: string }` | — | Past tense of each action for announcements, such as "skipped" and "shortlisted". |
| `label` | `string` | `"Cards"` | Accessible name for the stack. |
| `renderEmpty` | `(reset: () => void) => ReactNode` | — | Shown once every card has been decided. Receives a function that brings all cards back. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `CardDecision` | `"left" \| "right"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves focus to the stack (the outline appears on the top card) and then to the three buttons. |
| `←` or `→` | With focus on the stack, decide the top card to the left or to the right. |
| `Backspace` or `Ctrl + Z` or `Cmd + Z` | With focus on the stack, undo the last decision and bring the card back. |
| `Enter` or `Space` | Trigger the focused button: reject, undo, or accept. |

## Accessibility

- The stack is a focusable group with `aria-roledescription="card stack"` and a hidden hint with the keys; the top card announces its name and position (via `getLabel`) and the ones behind are `inert`.
- Each decision, undo, and restart is announced in a `role="status"` region; `outcomes` supplies the verb of the sentence, but the rest of it (“3 left.”, “restored”) is fixed English.
- The buttons use `aria-disabled` to keep focus when the stack runs out; the key hint, “Undo”, and the default empty state are also in English (`renderEmpty` replaces the empty state).

## Motion

- The top card follows the finger, rotates with the displacement, and shows the stamp of the chosen side; the ones behind rise gradually as it moves away.
- Released beyond 35% of the width (at most 140 px) or on a fast swipe, it flies off with a spring in the direction of the gesture; before that, it returns to its place with a spring.
- Undo brings the card back from where it left; with “reduce motion”, leaving and returning are just a fade and the ones behind swap places immediately.

## Responsive behavior

- The stack is up to 20rem wide with a fixed height of 19rem (17.5rem on screens up to 26rem); the content of `renderCard` should fill 100% of the height.
- On screens up to 22.5rem the undo button keeps only the icon, retaining its accessible name; the card uses `touch-action: pan-y`, so dragging vertically scrolls the page.

## Performance

- Only the next four cards (and those still flying off) stay in the DOM, so the size of `items` does not weigh on rendering.

## Notes for AI

- `items`, `getKey`, `getLabel`, and `renderCard` are required; position is internal state and the parent receives `onDecide(item, "left" | "right")`, `onUndo`, and `onReset`.
- Keep `items` stable: position is stored by index, so removing the decided item from the list inside `onDecide` makes the next card get skipped.
- Handle `onUndo` and `onReset` along with `onDecide`, otherwise your list of chosen items diverges from the stack; `labels` names the buttons and the stamps.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/card-stack · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
