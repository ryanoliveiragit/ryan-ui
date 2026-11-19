# Wallet card

> Cartão de pagamento que inclina em 3D e vira para mostrar o verso, com saldo que pode ser ocultado e últimas transações.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/wallet-card
- Original description: A payment card that leans toward the pointer in 3D and flips on a spring to show its back, with a balance that masks digit by digit and a short transaction list.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wallet-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wallet-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wallet-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wallet-card.json`. Registry path, relative to the site address: `r/wallet-card.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/wallet-card/wallet-card.tsx`
  - `components/ryan-ui/blocks/wallet-card/wallet-card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/wallet-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Dashboard or financial product landing page that shows the card with balance and the latest transactions, with a button to hide the amounts.
- When the back of the card (signature and security code) is part of the story and should open with a flip.

## When not to use

- Use [`tilt-card`](tilt-card.md) when you only want the 3D tilt for other content, without a back, mask, or transactions.
- Use [`metric-card`](metric-card.md) to show a balance with context in a dashboard, without the card drawing.
- Use [`sortable-data-table`](sortable-data-table.md) for long histories: the list here is short, with no pagination, filter, or sorting.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import WalletCardPreview from "@/components/ryan-ui/blocks/wallet-card/wallet-card";
import type { DemoStage } from "./_kit";

// Card, actions and four transactions are taller than the default block stage.
export const stage: DemoStage = { height: 760 };

export default function WalletCardDemo() {
  return <WalletCardPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `WalletCard`

A payment card with its account around it. The card leans toward the pointer in 3D under a moving glare and flips on a spring to show its back; the balance, the security code and the transaction amounts mask digit by digit. Touch and reduced motion get a still card that still flips and masks.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `holder` | `string` | `"Maya Okafor"` | Name printed on the card. |
| `issuer` | `string` | `"Northwind"` | Bank or product name printed on the card. |
| `last4` | `string` | `"4821"` | Last four digits of the card number. |
| `expiry` | `string` | `"08/29"` | Expiry date as printed, such as "08/29". |
| `cvv` | `string` | `"317"` | Security code on the back. It follows the balance mask. |
| `balance` | `number` | `12480.55` | Available balance. |
| `currency` | `string` | `"USD"` | ISO 4217 currency code used to format amounts. |
| `transactions` | `WalletTransaction[]` | `defaultTransactions` | Recent transactions, newest first. Pass an empty list to hide the section. |
| `masked` | `boolean` | — | Whether amounts are hidden (controlled). |
| `defaultMasked` | `boolean` | `false` | Whether amounts start hidden (uncontrolled). |
| `onMaskedChange` | `(masked: boolean) => void` | — | Called when the mask is toggled. |
| `flipped` | `boolean` | — | Whether the back of the card is showing (controlled). |
| `defaultFlipped` | `boolean` | `false` | Whether the card starts on its back (uncontrolled). |
| `onFlippedChange` | `(flipped: boolean) => void` | — | Called when the card is flipped. |
| `className` | `string` | — | Extra class for the root. |

### `WalletCardPreview`

Ready preview with sample account data.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `WalletTransaction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable key. |
| `merchant` (required) | `string` | Who was paid, or who paid. |
| `detail` (required) | `string` | Second line: category, date or both. |
| `amount` (required) | `number` | Signed amount: negative for money out, positive for money in. |
| `icon` | `ReactNode` | Icon in the row's badge. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the “Show back” and “Hide amounts” buttons, flip the card or mask the amounts; the card itself does not receive focus. |

## Accessibility

- The face that is not showing is `aria-hidden` and `inert`; the number is read as “Card ending in” plus the four digits, and masked values as “Balance hidden”, in hidden text.
- The two controls are buttons with `aria-pressed`; clicking the card is only a pointer shortcut on a `div` with no role, so the buttons are the accessible path.
- Labels and hidden texts are hardcoded in English (“Show amounts”, “Recent activity”, “Card ending in”).

## Motion

- With a mouse, the card tilts up to 11° toward the pointer in 3D on a spring, under a glow that follows the pointer, and returns flat on leave.
- The 180° flip uses a slightly bouncy spring; when masking, each digit turns into a dot one after another (16 ms apart) and the transactions rise in sequence on mount.
- Touch does not tilt the card; with “reduce motion” on there is also no tilt, the flip is immediate, the digits swap without sliding, and the transactions appear all at once.

## Responsive behavior

- The root is a container up to 23rem; the card keeps the payment-card proportion (1.586) and the balance scales with the width, from 1.5rem to 2rem (`8.6cqi`).

## Notes for AI

- Import the named component `WalletCard`; the default export is the preview with example data (holder, balance, and four transactions).
- Control `masked` with `onMaskedChange` and `flipped` with `onFlippedChange` to store the choice; `transactions={[]}` hides the list and each `amount` is a signed number, negative for outflows.
- Values are always formatted in `en-US` with the `currency` currency; the card only uses `last4`, and the `cvv` is printed on the back, protected only by the balance mask, so avoid passing the real code.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/wallet-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
