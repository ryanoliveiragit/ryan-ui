# Token swap

> Cartão de troca de tokens com dois campos que trocam de lugar ao inverter, taxa e custos ao vivo e confirmação animada (dados fictícios).

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/token-swap
- Original description: Play-money swap card: two amount fields with token pickers that trade places when flipped, live rate and fee rows, and a pending then confirmed state.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/token-swap.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/token-swap.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/token-swap.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/token-swap.json`. Registry path, relative to the site address: `r/token-swap.json`.

- npm packages: `motion`, `lucide-react`, `@radix-ui/react-dropdown-menu`
- Files, once installed:
  - `components/ryan-ui/blocks/token-swap/token-swap.tsx`
  - `components/ryan-ui/blocks/token-swap/token-swap.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react @radix-ui/react-dropdown-menu`.
2. Copy the files listed above. The content of each one is in `r/token-swap.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Token swap with play money in demos, tutorials, or games: two fields with a token selector, a flip button, rate, and fees.
- Standalone conversion card where the received amount is calculated instantly from the dollar prices you provide.

## When not to use

- Use [`money-input`](money-input.md) for an amount field in one currency inside a regular form.
- Use [`prediction-market`](prediction-market.md) to buy yes-or-no outcomes.
- For real assets it does not work as is: there is no wallet or quote, network fee and slippage are constants, and a rejected swap returns to the start with no message.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import TokenSwapPreview from "@/components/ryan-ui/blocks/token-swap/token-swap";
import { demoStage } from "./_kit";

export default function TokenSwapDemo() {
  // The token menus open inside the preview stage, so a menu near the edge is never cut.
  return <TokenSwapPreview container={demoStage()} />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TokenSwap`

Swap card with play money: two amount fields with token pickers, a flip button that makes the two fields trade places, live rate and fee rows, and a pending then confirmed state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tokens` | `SwapToken[]` | `sampleTokens` | Tokens offered in both pickers. Defaults to five made-up tokens. |
| `defaultPay` | `string` | — | Symbol of the token paid at the start. |
| `defaultReceive` | `string` | — | Symbol of the token received at the start. |
| `amount` | `string` | — | Amount to pay, as typed. Pass it with `onAmountChange` to control the field. |
| `defaultAmount` | `string` | `"1.5"` | Starting amount when uncontrolled. |
| `onAmountChange` | `(amount: string) => void` | — | Called with the cleaned text of the pay field whenever it changes. |
| `feeRate` | `number` | `0.003` | Share of the paid amount kept as a fee. Defaults to 0.3%. |
| `onSwap` | `(quote: SwapQuote) => void \| Promise<void>` | — | Runs when the person confirms. The card shows its pending state until the returned promise settles; without it, a short delay stands in. |
| `className` | `string` | — | Extra class for the card. |
| `container` | `HTMLElement \| null` | — | Render the token menus inside this element and keep them within it (used by the demo stage). |

### `TokenSwapPreview`

Ready preview: the swap card centered on a quiet stage.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `SwapToken`

| Field | Type | Description |
| --- | --- | --- |
| `symbol` (required) | `string` | Ticker, such as "ORB". Also the token's id. |
| `name` (required) | `string` | Full name, shown in the token menu. |
| `price` (required) | `number` | Price in US dollars. Rates between tokens derive from it. |
| `balance` (required) | `number` | Balance of the pretend wallet. |
| `tone` | `"teal" \| "sky" \| "orchid" \| "violet" \| "rose" \| "amber" \| "green"` | Categorical tone of the token mark. |

#### `SwapQuote`

| Field | Type | Description |
| --- | --- | --- |
| `pay` (required) | `string` | Symbol of the token paid. |
| `receive` (required) | `string` | Symbol of the token received. |
| `amount` (required) | `number` | Amount paid, in the pay token. |
| `received` (required) | `number` | Amount received after the fee, in the receive token. |

### Other exports

- `sampleTokens` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the amount field, confirms the swap when the amount is greater than zero and fits the balance. |
| `Enter` or `Space` or `↓` | On the token selector, open the token menu (Radix). |
| `↑` or `↓` | In the menu, move between tokens; `Enter` or `Space` chooses, and choosing the token on the other side flips the pair. |
| `Esc` | Closes the menu and returns focus to the selector. |

## Accessibility

- Each field has a visible label and `aria-describedby` for the dollar value line, which turns into the insufficient-balance warning together with `aria-invalid`; the receive field is read-only and leaves the Tab order.
- The selectors are Radix menus with radio items, each trigger states the side and the token in its `aria-label`, and the flip button states in its `aria-label` how the pair will end up.
- On confirm, the form becomes `inert` and the receipt is `role="status"`, but focus is not moved to the receipt or restored to “New swap”; move it yourself if you need to.

## Motion

- On flip, the two fields swap places on a slightly bouncy spring, the one that goes up grows a little while the other sinks, and the arrow rotates 180°.
- The rate line and the button label swap by sliding vertically; on confirm, the receipt covers the form on a spring, the circle appears, and the checkmark draws itself.
- With “reduce motion” on, the fields swap instantly, the arrow does not rotate, labels only fade, the menu opens without animation, and the waiting indicator spins more slowly.

## Notes for AI

- Import the named component `TokenSwap`; the default export is the preview, and `sampleTokens` are invented tokens and prices, unrelated to real assets.
- `onSwap(quote)` receives `pay`, `receive`, `amount`, and `received`: return a Promise to hold the pending state; balances only change in local state after success and each token's `balance` is only the initial one.
- The rate comes from the dollar `price` values (the payer's price divided by the receiver's) and the fee from `feeRate` (default 0.3%); control the amount with `amount` and `onAmountChange` or use `defaultAmount`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/token-swap · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
