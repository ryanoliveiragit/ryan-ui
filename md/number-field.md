# Number field

> Informe um número limitado com controles de incremento claros e dígitos em odômetro.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/number-field
- Original description: Enter a bounded number with clear increment controls.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/number-field.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/number-field.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/number-field.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/number-field.json`. Registry path, relative to the site address: `r/number-field.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/number-field/number-field.tsx`
  - `components/ryan-ui/number-field/number-field.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/number-field.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Bounded numbers the person can both type and adjust step by step: seats, quantity, price per unit.
- Values with a unit that follows the number, like “1 seat” and “2 seats”: `prefix` and `suffix` accept text or a function of the value.
- Property panels where dragging is faster than clicking: with `scrub`, dragging the label sideways changes one step every 6 px.

## When not to use

- Use [`adaptive-stepper`](adaptive-stepper.md) for small counters that need no typing and should keep a fixed width.
- Use [`money-input`](money-input.md) for money, with currency, cents, and output in minor units.
- Use [`scrub-input`](scrub-input.md) in compact editors that need units, math in the field itself, and fine steps with `Alt`.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { NumberField } from "@/components/ryan-ui/number-field/number-field";
import { Caption, Row, Stack } from "./_kit";

export default function NumberFieldDemo() {
  const [seats, setSeats] = useState(5);
  const [price, setPrice] = useState(19.5);
  return (
    <Stack gap={6} width={420} align="center" style={{ textAlign: "center" }}>
      <NumberField label="Team seats" description="Hold a button to speed up, or drag the label." value={seats} onValueChange={setSeats} min={1} max={50} scrub suffix={(v) => (v === 1 ? " seat" : " seats")} />
      <Row justify="center">
        <NumberField label="Price" value={price} onValueChange={setPrice} min={0} max={999} step={0.5} prefix="$" size="sm" />
      </Row>
      <Caption>Total: ${(seats * price).toFixed(2)} per month.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `NumberField`

A bounded number with odometer digits. Buttons and arrow keys repeat and speed up while held, PageUp and PageDown take large steps, Home and End jump to the limits, and `scrub` lets the label be dragged. Typing edits a plain draft that applies live while valid; the rolling digits return once it commits on Enter, blur, or the next step.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `number` | — | — |
| `defaultValue` | `number` | `0` | — |
| `onValueChange` | `(value: number) => void` | — | — |
| `min` | `number` | `0` | — |
| `max` | `number` | `Number.MAX_SAFE_INTEGER` | — |
| `step` | `number` | `1` | — |
| `largeStep` | `number` | — | PageUp, PageDown, and Shift with an arrow move this far. Defaults to ten steps. |
| `description` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `id` | `string` | — | — |
| `prefix` | `string \| ((value: number) => string)` | — | Text before the number, such as "$". |
| `suffix` | `string \| ((value: number) => string)` | — | Text after the number, such as " seats". |
| `scrub` | `boolean` | `false` | Drag the label sideways to scrub the value, one step every few pixels. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same digits. |
| `formatOptions` | `{ minimumFractionDigits?: number; maximumFractionDigits?: number; useGrouping?: boolean }` | — | Fraction digits and grouping. Fraction digits follow the precision of `step` by default. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height, type size, and default width. |
| `limitHint` | `boolean \| ((edge: "min" \| "max", limit: number) => string)` | `true` | A short note beside the label when a press meets a limit or a typed value passes one. `false` hides it; a function writes the copy. |

### Exported types

| Type | Definition |
| --- | --- |
| `NumberFieldAffix`: Text shown beside the number. A function receives the value, so a unit can follow it: `n => n === 1 ? " seat" : " seats"`. | `string \| ((value: number) => string)` |
| `NumberFieldSize` | `"sm" \| "md" \| "lg"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Add or subtract `step`; holding repeats and accelerates, and with `Shift` the step becomes `largeStep`. |
| `Page Up` or `Page Down` | Add or subtract `largeStep` (by default, ten steps). |
| `Home` or `End` | Go to `min` or to `max` (`End` only when `max` was defined); while typing, they move the cursor. |
| `Enter` | Applies the typed value, adjusted to the step and limits; with no typing, selects the number. |
| `Esc` | While typing, discards the text and returns to the value from before the edit. |
| `Tab` | Moves through the minus button, the number, and the plus button; on the buttons, `Enter` and `Space` take one step. |

## Accessibility

- The number is an `<input>` with `role="spinbutton"` tied to the visible `label`, with `aria-valuenow`, `aria-valuetext` already including `prefix` and `suffix`, and the limits when defined.
- The buttons stay in the tab order and, at the limit, get `aria-disabled` without losing focus; their names are `Decrease …` and `Increase …`, in English.
- An `aria-live` region announces the value after a click on the buttons or a drag of the label, and the limit reached; the visible `Max …`/`Min …` note changes with `limitHint` or disappears with `false`.

## Motion

- Each digit turns like an odometer in the direction of the change, wrapping from 9 to 0, and the columns open or close the width when the number gains or loses a digit.
- At the limit, the value pushes toward it and returns with a spring, a little more with each consecutive attempt; the refused button's icon shakes and a note with the limit appears next to the label.
- With “reduce motion” on, nothing moves: digits only fade and pushing against a limit only tints the number for a moment.

## Responsive behavior

- The width comes from `--number-field-width` (196 px; 164 in `sm` and 228 in `lg`), capped at 100% of the container, and the height follows `size`: 36, 44, or 50 px.

## Performance

- Each digit mounts a wheel with the ten numerals, each with its own animated styles: in a table with dozens of fields, prefer a simple field like `input`.

## Notes for AI

- Controlled with `value` + `onValueChange` or uncontrolled with `defaultValue` (default `0`); since `min` is also `0` by default, pass a negative `min` to accept values below zero.
- A value typed within the limits and the step already calls `onValueChange` while typing; the rest is adjusted on confirming or leaving the field, and decimal places follow those of `step`.
- Pass `locale="pt-BR"` for decimal comma and thousands period and `formatOptions` for places or grouping; there is no `name` prop, so send the value from your state.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/number-field · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
