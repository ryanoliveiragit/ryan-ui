# Money input

> Campo de valor monetário com agrupamento ao vivo, largura estável e dígitos que rolam.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/money-input
- Original description: A currency field with live grouping, stable width, rolling digits, and minor-unit output.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/money-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/money-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/money-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/money-input.json`. Registry path, relative to the site address: `r/money-input.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/money-input/money-input.tsx`
  - `components/ryan-ui/money-input/money-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/money-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Payment, invoice, transfer, or budget values that go to the server as an integer in cents, with no floating-point rounding.
- Forms with more than one currency: the menu switches the currency keeping the typed number, and symbol and decimal places follow; in yen, which has no cents, the fraction drops.
- Top-ups, tips, and donations where round values do the job: the `quickAdd` chips add +10, +50, and +100 and the arrows advance one unit at a time.

## When not to use

- Use [`number-field`](number-field.md) for values that can be negative, like a balance adjustment, with a negative `min` and `prefix`: this field only accepts digits and the decimal separator.
- Use [`range-histogram-slider`](range-histogram-slider.md) to choose a price range in a filter.
- When the value needs more places than the currency, like an exchange rate: decimal places follow the currency (two in the real, none in the yen) and typing beyond them is rejected.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import MoneyInput from "@/components/ryan-ui/money-input/money-input";
import { Caption, Stack } from "./_kit";

export default function MoneyInputDemo() {
  const [cents, setCents] = useState<number | null>(12500);
  return (
    <Stack gap={3} width={380}>
      <MoneyInput label="Invoice amount" description="Use the arrow keys or the quick add chips." value={cents} onValueChange={(v) => setCents(v)} max={100_000_000} />
      <Caption>Stored value: {cents === null ? "empty" : `${cents} minor units`}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MoneyInput`

A currency amount field. Digits group as they are typed without moving the caret, the missing cents wait as faint ghosts so the amount never changes width when it settles, long amounts scale down to fit instead of scrolling, and quick add chips and arrow keys roll the digits. The value comes out in minor units, so $12.50 is 1250.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `hideLabel` | `boolean` | `false` | — |
| `value` | `number \| null` | — | Amount in minor units (cents for USD, yen for JPY). `null` is empty. |
| `defaultValue` | `number \| null` | `null` | — |
| `onValueChange` | `(value: number \| null, details: MoneyInputDetails) => void` | — | — |
| `currency` | `string` | — | ISO 4217 code, such as "USD". |
| `defaultCurrency` | `string` | `"USD"` | — |
| `onCurrencyChange` | `(currency: string) => void` | — | — |
| `currencies` | `string[]` | `["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "C…` | Codes offered by the currency menu. Pass one code to hide the menu. |
| `min` | `number` | — | Lowest amount in minor units. Checked when the field loses focus. |
| `max` | `number` | — | Highest amount in minor units. Typing past it is refused with a nudge. |
| `quickAdd` | `number[]` | `[10, 50, 100]` | Quick add chips in major units. Pass an empty array to hide them. |
| `step` | `number` | — | Arrow keys move by this many minor units. Defaults to one major unit; Shift moves ten times as far. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same digits. |
| `description` | `string` | — | — |
| `error` | `string` | — | Replaces the built-in range message. |
| `disabled` | `boolean` | `false` | — |
| `name` | `string` | — | Adds a hidden input carrying the amount in minor units. |
| `id` | `string` | — | — |
| `className` | `string` | — | — |
| `onBlur` | `(event: ReactFocusEvent<HTMLInputElement>) => void` | — | — |

### Exported types

#### `MoneyInputDetails`

| Field | Type | Description |
| --- | --- | --- |
| `currency` (required) | `string` | — |
| `major` (required) | `number \| null` | The amount in major units, such as 12.5 for $12.50. |
| `formatted` (required) | `string` | The amount as a full currency string, such as "$12.50". |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | In the field, add or subtract `step` (by default, one currency unit); with `Shift`, ten times that. |
| `Page Up` or `Page Down` | Add or subtract ten times the `step`. |
| `Enter` | In the field, fills in the missing decimal places, like `12` becoming `12.00`. |
| `Backspace` or `Delete` | On a thousands separator, erase the neighboring digit instead of stopping at the separator. |
| `↓` or `↑` or `Home` or `End` | On the currency button, `↓` and `↑` open the menu; in it, they move the highlight, stopping at the ends, and letters search by currency code or name. |
| `Enter` or `Space` | In the menu, choose the highlighted currency; `Esc` closes and returns focus to the button, and `Tab` closes and moves on. |

## Accessibility

- The field is a text `<input>` with `role="spinbutton"`, `aria-valuenow` in whole units, and `aria-valuetext` with the formatted value; `label` is required and `hideLabel` leaves it for screen readers only.
- Allowed range, `description`, and error go into `aria-describedby` and the error goes out in a `role="alert"`; a `role="status"` region announces the new value after a chip or an arrow and the limit that refused the change.
- The currency menu is a `role="listbox"` with `aria-activedescendant`; currency names follow `locale`, but `Quick add`, `Add …`, `Currency`, `Maximum is …`, and the range are fixed in English.

## Motion

- Digits roll in the direction of the change when the value comes from a chip, an arrow, or outside; while typing the swap is immediate, so the cursor is not delayed.
- The missing cents stay dimmed in place, so the width does not change when completing the value; a long value shrinks to fit instead of scrolling, and the symbol rolls when the currency changes.
- At the limit, the value gives a sideways jolt and returns with a spring while the range flashes in a warning tone; with “reduce motion” on, there is no jolt or rolling and the digits only fade.

## Responsive behavior

- Takes the container width with a 76 px height (`--money-input-height`); up to 420 px of screen the digits get smaller, and a value that does not fit shrinks instead of scrolling.
- The currency menu opens below the field, right-aligned, with `min(256px, 100vw - 2rem)` and no portal: avoid ancestors with `overflow: hidden`.

## Notes for AI

- The value is an integer in minor units: R$ 12.50 is `1250`, ¥ 1250 is `1250`, and `null` is empty; `min`, `max`, and `step` are also in minor units, but `quickAdd` is in whole units.
- To fix the currency, pass `currency` (or `defaultCurrency`) and `currencies` with only that code; with `currencies={["BRL"]}` alone, the field stays on the `USD` default.
- `max` rejects typing right away, but `min` is only checked when the field loses focus; `error` replaces that message, `locale="pt-BR"` swaps the separators, and `name` sends the minor units.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/money-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
