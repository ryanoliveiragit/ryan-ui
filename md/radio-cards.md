# Radio cards

> Cartões selecionáveis com anel deslizante, preço e descrição, com o teclado de um grupo de rádio.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/radio-cards
- Original description: Selectable option cards with a sliding selection ring, price and description slots, and radio keyboard behavior.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-cards.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-cards.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-cards.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-cards.json`. Registry path, relative to the site address: `r/radio-cards.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/radio-cards/radio-cards.tsx`
  - `components/ryan-ui/radio-cards/radio-cards.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/radio-cards.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing a plan, shipping option, or region where each option needs a visible description and price.
- Single selection among a few options that deserve visual weight, such as in a checkout or an onboarding.
- When an unavailable option should stay visible with the reason, via `disabledReason`.

## When not to use

- Use [`radio-group`](radio-group.md) when each option fits a short label and one supporting line.
- Use [`select`](select.md) when there are many options or little screen space.
- Use [`chip-group`](chip-group.md) when people can check more than one option.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Package, Truck, Zap } from "lucide-react";
import RadioCards from "@/components/ryan-ui/radio-cards/radio-cards";
import { Caption, Stack } from "./_kit";

const options = [
  { value: "standard", label: "Standard", description: "Arrives in 5 to 7 business days", meta: "Free", icon: <Package size={16} aria-hidden="true" /> },
  { value: "express", label: "Express", description: "Arrives in 2 business days", meta: "$9.00", icon: <Truck size={16} aria-hidden="true" /> },
  { value: "overnight", label: "Overnight", description: "Order by 2 pm, delivered tomorrow", meta: "$24.00", icon: <Zap size={16} aria-hidden="true" /> },
  { value: "pickup", label: "Store pickup", description: "Not available for this address", icon: <Package size={16} aria-hidden="true" />, disabled: true, disabledReason: "Unavailable for this address" },
];

export default function RadioCardsDemo() {
  const [value, setValue] = useState<string | null>("express");
  return (
    <Stack width={560} gap={4}>
      <RadioCards aria-label="Delivery method" options={options} value={value} onValueChange={setValue} minColumnWidth={200} />
      <Caption>Selected: {value}. Use the arrow keys to move the ring.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RadioCards`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `RadioCardOption[]` | — | — |
| `value` | `string \| null` | — | — |
| `defaultValue` | `string \| null` | `null` | — |
| `onValueChange` | `(value: string) => void` | — | — |
| `layout` | `"grid" \| "list"` | `"grid"` | "grid" places cards in responsive columns; "list" stacks full width rows. |
| `minColumnWidth` | `number` | `180` | Narrowest a grid column may get before the grid drops a column, in px. |
| `name` | `string` | — | Form field name. Renders a hidden input with the selected value. |
| `required` | `boolean` | — | — |
| `disabled` | `boolean` | `false` | — |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type, except `onChange` and `defaultValue`. |

### Exported types

#### `RadioCardOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `ReactNode` | — |
| `description` | `ReactNode` | One or two short lines under the label. |
| `meta` | `ReactNode` | A price, estimate, or other value. Sits at the end of a list row, or under the text in a grid card. |
| `icon` | `ReactNode` | Plain decorative icon beside the label. |
| `disabled` | `boolean` | — |
| `disabledReason` | `ReactNode` | Short reason shown in place of the description when the option is disabled. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Move focus to the next card and select it right away, skipping disabled ones and wrapping to the first after the last. |
| `←` or `↑` | Do the same for the previous card; in right-to-left layouts, ← and → are swapped. |
| `Home` or `End` | Select the first or last available card. |
| `Space` or `Enter` | Select the focused card. |
| `Tab` | Enters the group at the selected card, or the first available one, and leaves it in a single keystroke. |

## Accessibility

- The group has `role="radiogroup"` and each card `role="radio"` with `aria-checked`, named by the label and described by the description.
- There is no label prop: pass `aria-label` or `aria-labelledby` to `RadioCards`, otherwise the group has no name for screen readers.
- Disabled options get `aria-disabled` and show `disabledReason` in place of the description, so the reason is also read aloud.

## Motion

- A single ring slides from card to card on a no-overshoot spring and the indicator dot grows on the new card; the card itself never changes size.
- When the group changes size, the ring follows the new layout instantly, without repeating the slide.
- With “reduce motion” on, ring and dot change place instantly and the color transitions are turned off.

## Responsive behavior

- In `layout="grid"` the columns adjust to the width and drop one by one when they would become narrower than `minColumnWidth` (180px by default); in `list` each option takes the full row.
- The label does not wrap and is truncated with an ellipsis; put long text in `description`, which wraps normally.

## Notes for AI

- Each option accepts `label`, `description`, `meta` (price or lead time), and `icon`; `meta` sits at the end of the row in `list` and below the text in `grid`.
- Controlled with `value` and `onValueChange`, or uncontrolled with `defaultValue`; with `name`, a hidden field carries the value in the form.
- Do not forget the `aria-label` on the group; for text-only options, `radio-group` is simpler and uses native radios.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/radio-cards · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
