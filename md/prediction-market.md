# Prediction market

> Cartão de mercado de previsões com preços de sim e não, linha de probabilidade, valor e estimativa de retorno (dados fictícios).

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/prediction-market
- Original description: A market card with yes and no prices, a probability line that flips to the picked outcome, an amount field and a payout estimate that counts to each new value (play money).

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prediction-market.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prediction-market.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prediction-market.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/prediction-market.json`. Registry path, relative to the site address: `r/prediction-market.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/prediction-market/prediction-market.tsx`
  - `components/ryan-ui/blocks/prediction-market/prediction-market.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/prediction-market.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Yes-or-no market with play money, in demos, educational content, or games: price of each outcome, probability history, and a ticket with an estimated return.
- When the person needs to read the history point by point, with a pointer or keyboard, and see the return update while typing the amount.

## When not to use

- Use [`line-chart`](line-chart.md) when you only need to show the historical series, or several series, without the purchase ticket.
- Use [`token-swap`](token-swap.md) to exchange one asset for another with rate and fee.
- For real money the block is not enough: balance and position live only in local state and a rejected order returns to the start with no error message.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import PredictionMarketPreview from "@/components/ryan-ui/blocks/prediction-market/prediction-market";
import type { DemoStage } from "./_kit";

// The card is taller than the default block stage.
export const stage: DemoStage = { height: 840 };

export default function PredictionMarketDemo() {
  return <PredictionMarketPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PredictionMarket`

A market card for a yes or no question: the price of each outcome, the probability over time, and an order ticket with a live payout estimate. Picking the other outcome flips the line to that outcome's history, numbers count to their new values, and the confirm button walks through sending and done. All amounts are play money.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `question` (required) | `string` | — | The question the market settles. |
| `category` | `string` | — | Small label above the question. |
| `ranges` (required) | `PredictionRange[]` | — | History of the "yes" probability, one entry per time range. The last point of the active range is the current price. |
| `defaultRange` | `string` | — | Range shown first. Defaults to the first one. |
| `volume` | `string` | — | Traded volume, already formatted. |
| `closes` | `string` | — | When the market closes, already formatted. |
| `side` | `"yes" \| "no"` | — | Selected outcome (controlled). |
| `defaultSide` | `"yes" \| "no"` | `"yes"` | Selected outcome on first render (uncontrolled). |
| `onSideChange` | `(side: PredictionSide) => void` | — | Called when the outcome changes. |
| `defaultAmount` | `number` | `25` | Amount in the field on first render. |
| `balance` | `number` | `250` | Play balance available to spend. It goes down as orders are placed. |
| `onPlaceOrder` | `(order: PredictionOrder) => void \| Promise<void>` | — | Called when an order is confirmed. Return a promise to keep the button in its sending state until it settles. |
| `className` | `string` | — | Extra class for the card. |

### `PredictionMarketPreview`

Ready preview with fixed sample data.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `PredictionSide` | `"yes" \| "no"` |

#### `PredictionRange`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key of the range, such as "1w". |
| `label` (required) | `string` | Short label on the range switch. |
| `points` (required) | `number[]` | Probability of "yes" over time, each from 0 to 1. Every range must have the same number of points so the line can morph. |
| `labels` (required) | `string[]` | One label per point for the readout, such as "Oct 12" or "14:00". |

#### `PredictionOrder`

| Field | Type | Description |
| --- | --- | --- |
| `side` (required) | `"yes" \| "no"` | The outcome that was bought. |
| `amount` (required) | `number` | Amount spent, in the market's currency. |
| `price` (required) | `number` | Price per share, from 0 to 1. |
| `shares` (required) | `number` | Shares bought: amount divided by price. Each share pays 1 if the outcome happens. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | On the focused chart, read the previous or next point of the series; the value read is announced. |
| `Home` or `End` | On the chart, jump to the first or last point of the period. |
| `←` or `→` or `↑` or `↓` | In the period and outcome selectors (Yes and No), choose the neighboring option, move focus along, and wrap around at the ends. |
| `Tab` | Each selector is a single stop, on the chosen option, and the chart is another stop. |

## Accessibility

- The chart is a focusable `role="group"` whose `aria-label` gives the current probability and explains the arrow keys; the point read is announced by an `aria-live="polite"` region and the SVG is `aria-hidden`.
- Period and outcome are `role="radiogroup"` with `role="radio"` buttons, `aria-checked`, and roving tabindex.
- The amount field has a label, `aria-invalid` above the balance, and `aria-describedby` for the estimate; the buy button receives `aria-busy` while submitting and the position line is `aria-live="polite"`.

## Motion

- The line draws itself in 1.1 s the first time; switching period or outcome transforms the path on a spring that does not overshoot and the end marker slides to the new point, pulsing at rest.
- Probability, prices, shares, return, and balance count up to each new value in 0.48 s, the selection pills slide, and the button label goes through “Placing order” and “Order placed”.
- With “reduce motion” on, the numbers change instantly, the line appears without drawing or transformation, pills and marker jump, and the pulse and the submit indicator stop.

## Responsive behavior

- The card goes up to 27rem; the chart has a fixed height of 136 px and a width measured by a `ResizeObserver`, and up to 26rem of viewport the inner padding shrinks.

## Notes for AI

- Import the named component `PredictionMarket` (the default export is the preview with example data) and control the outcome with `side` and `onSideChange` or use `defaultSide`.
- In `ranges`, every period needs the same number of `points` (probability of “Yes”, from 0 to 1) and one `labels` item per point; the last point of the active period is the current price.
- `onPlaceOrder(order)` receives `side`, `amount`, `price`, and `shares`: return a Promise to hold “Placing order” and show your own error if it rejects; `balance` is only the starting balance.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/prediction-market · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
