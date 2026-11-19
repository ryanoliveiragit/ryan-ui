# Card dealer

> Um baralho que distribui cartas pelas posições da mesa em arco, virando cada uma; dá para embaralhar e recomeçar.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/card-dealer
- Original description: A deck that deals playing cards to table positions along an arc while they lift and flip face up, with a riffle shuffle, a reset and a named poker hand.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-dealer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-dealer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-dealer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-dealer.json`. Registry path, relative to the site address: `r/card-dealer.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/card-dealer/card-dealer.tsx`
  - `components/ryan-ui/blocks/card-dealer/card-dealer.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/card-dealer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Card game demos and prototypes: deals one to seven cards from the deck to the table and, with five positions, names the poker hand.
- Playful sections of a page, such as a draw or a “hand of the day”, where the dealing animation is the content itself.
- Reference example of sequential motion: arc trajectory, 3D flip, and shuffling.

## When not to use

- Use [`card-stack`](card-stack.md) to go through content cards one by one, with throw and undo.
- Avoid in games involving money or an auditable outcome: shuffling uses `Math.random` in the browser and the deck lives in the component state.
- Avoid when the cards need their own content: the faces only draw value and suit.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import CardDealerPreview from "@/components/ryan-ui/blocks/card-dealer/card-dealer";

export default function CardDealerDemo() {
  return <CardDealerPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CardDealer`

A deck and a table. Dealing sends each card from the deck to its position along an arc, lifting and turning face up on the way, one after another. Shuffle riffles the deck into a new random order and Reset restores the factory order. With five positions the finished hand is named like a poker hand.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `positions` | `number` | `5` | How many positions the table has, from 1 to 7. Five makes a poker hand, and the hand gets named. |
| `onDeal` | `(hand: PlayingCard[]) => void` | — | Called after every deal with the cards now on the table, in position order. |
| `label` | `string` | `"Card table"` | Accessible name of the table. |
| `dealOnMount` | `boolean` | `false` | Deal a full hand once the table has been measured, so a preview opens with cards on the table. |
| `className` | `string` | — | Extra class for the root. |

### `CardDealerPreview`

Ready preview: a five card table.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `CardSuit` | `"spades" \| "hearts" \| "diamonds" \| "clubs"` |

#### `PlayingCard`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique key, such as "K-spades". |
| `rank` (required) | `string` | Printed rank: "2" to "10", "J", "Q", "K" or "A". |
| `suit` (required) | `"spades" \| "hearts" \| "diamonds" \| "clubs"` | The suit. |
| `value` (required) | `number` | Rank order from 0 (two) to 12 (ace). |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the deck, deal a card to the next free position; on the buttons, deal the hand (“Deal hand”), shuffle (“Shuffle”), or start over (“Reset”). |

## Accessibility

- The table is a `role="group"` named by `label`, and the deck is a button whose name says how many cards remain.
- The drawn cards are `aria-hidden`; what is on the table is announced by a hidden paragraph with `aria-live="polite"`, which lists the cards and the name of the hand, in English.

## Motion

- Each card leaves the deck for its position on the arc (it moves sideways first and then down), lifts slightly and flips face up on the way, with 0.13 s between one card and the next.
- “Shuffle” gathers the table and makes the top cards fan out to the sides twice; with a full table, the cards return to the deck before the next hand.
- With “reduce motion” on, the cards change place instantly, with no trajectory, flip, or wait between steps.

## Responsive behavior

- The card width is computed in container units to fit the row (up to 5.25rem), and positions are measured by `ResizeObserver`, so the table shrinks without breaking the row.

## Performance

- Only the top five cards of the deck are drawn, plus those on the table (at most twelve animated elements); the rest of the deck is just a number.

## Notes for AI

- Import `CardDealer` by name; the default export is the preview with five positions.
- The deck and the table are internal state, with no props to control the cards: the only output is `onDeal(hand)`, called on click (before the animation ends) with the table's cards in position order.
- `positions` accepts 1 to 7; the hand is named only with a full table and at least two positions, and straights and flushes require exactly five cards.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/card-dealer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
