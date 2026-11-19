# Billing toggle

> Alternância entre cobrança mensal e anual, com selo de economia e preços que rolam até o novo valor.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/billing-toggle
- Original description: A monthly and yearly switch with a savings badge and prices that roll to the new amount.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/billing-toggle.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/billing-toggle.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/billing-toggle.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/billing-toggle.json`. Registry path, relative to the site address: `r/billing-toggle.json`.

- npm packages: `motion`
- Uses other ryan-ui items (installed along with it): [Animated counter](animated-counter.md)
- Files, once installed:
  - `components/ryan-ui/billing-toggle/billing-toggle.tsx`
  - `components/ryan-ui/billing-toggle/billing-toggle.module.css`
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/billing-toggle.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Pricing page where the billing period (monthly or yearly) changes the values shown on the plans.
- When the cheaper option carries a savings badge whose text changes when it is chosen (`badge` → `activeBadge`).
- Prices that should roll to the new value without pushing what is next to them: use `BillingPrice`, exported by the same file.

## When not to use

- Use [`segmented-control`](segmented-control.md) to toggle views or filters that are not a billing period and carry no badge.
- Use [`switch`](switch.md) for an on or off setting with immediate effect.
- Use [`plan-comparison`](plan-comparison.md) when you need the full plan comparison, not just the period selector.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { BillingPrice, BillingToggle } from "@/components/ryan-ui/billing-toggle/billing-toggle";
import { Caption, Stack, Surface } from "./_kit";

const options = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "Save 20%", activeBadge: "You save $48" },
];

export default function BillingToggleDemo() {
  const [period, setPeriod] = useState("monthly");
  const yearly = period === "yearly";
  return (
    <Stack gap={5} align="center">
      <BillingToggle value={period} onValueChange={setPeriod} options={options} label="Billing period" />
      <Surface width={320} padding={6}>
        <Stack gap={2}>
          <Caption>Team plan</Caption>
          <div style={{ fontSize: "var(--text-3xl, 2rem)", fontWeight: 600 }}>
            <BillingPrice amount={yearly ? 19 : 24} was={yearly ? 24 : undefined} period={yearly ? "per month, billed yearly" : "per month"} />
          </div>
        </Stack>
      </Surface>
      <Caption>Switch the period and watch the price roll.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BillingToggle`

A billing period switch. One thumb glides between the options on a critically damped spring, and the savings note on the cheaper period tints and rewrites itself in place once it is chosen.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` | — | — |
| `onValueChange` (required) | `(value: string) => void` | — | — |
| `options` | `BillingToggleOption[]` | `DEFAULT_OPTIONS` | — |
| `label` | `string` | `"Billing period"` | Accessible name of the group. |
| `size` | `"md" \| "lg"` | `"md"` | — |
| `className` | `string` | — | — |

### `BillingPrice`

A price that rolls to its new amount. The old price and the period ease their width, so nothing beside them jumps.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `amount` (required) | `number` | — | — |
| `currency` | `string` | `"$"` | — |
| `period` | `string` | — | Period after the price, e.g. "per month". Swaps in place when it changes. |
| `was` | `number` | — | Previous price, shown struck through when it is higher than `amount`. |
| `decimals` | `number` | `0` | — |
| `className` | `string` | — | — |

### Exported types

#### `BillingToggleOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `badge` | `string` | Short savings note, e.g. "Save 20%". |
| `activeBadge` | `string` | Badge text once this option is selected, e.g. "You save $48". Defaults to `badge`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Selects the next option and moves focus to it; from the last it wraps to the first. |
| `←` or `↑` | Selects the previous option; from the first it goes to the last. |
| `Home` or `End` | Selects the first or last option. |
| `Tab` | Enters the group at the selected option and leaves it; the other options are outside the tab order. |

## Accessibility

- The group is a `role="radiogroup"` and each option a `<button role="radio">` with `aria-checked` and a roving tabindex.
- `label` names the group and defaults to English (`Billing period`): pass the text in the page language.
- The badge is part of the option name, so the screen reader announces label and badge together; in `BillingPrice` the old price comes out in a `<del>` and the current value has a text copy for screen readers.

## Motion

- A single thumb slides between options with a spring with no overshoot, taking the position and width of the chosen option.
- The badge swaps text in place, in a box that already has the width of the longest text; in `BillingPrice` the digits roll to the new value and the old price (`was`) opens in width.
- With “reduce motion” on, the thumb and digits jump into place and texts only fade.

## Responsive behavior

- Labels and badges do not wrap (`white-space: nowrap`): on narrow screens, keep the texts short.
- `BillingPrice` pushes the period to the line below when width runs short (`flex-wrap`).

## Notes for AI

- It is always controlled: `value` and `onValueChange` are required; without `options` it shows `Monthly` and `Yearly` with the `Save 20%` badge, in English.
- The file also exports `BillingPrice` (`amount`, `currency`, `period`, `was`, `decimals`); `was` only shows struck through when it is greater than `amount`.
- Depends on `animated-counter`; the active badge color comes from `--billing-accent` (default `--success`), which can be defined on any ancestor.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/billing-toggle · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
