# Adaptive stepper

> Contador que não muda de tamanho: os dígitos rolam até o novo valor e o botão de menos ou de mais se recolhe no limite.

- Type: component (category Inputs), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/adaptive-stepper
- Original description: A numeric stepper with a fixed footprint: digits roll between values, and the minus or plus button folds away at the minimum or maximum.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/adaptive-stepper.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/adaptive-stepper.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/adaptive-stepper.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/adaptive-stepper.json`. Registry path, relative to the site address: `r/adaptive-stepper.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/adaptive-stepper/adaptive-stepper.tsx`
  - `components/ryan-ui/adaptive-stepper/adaptive-stepper.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/adaptive-stepper.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Small quantities with known limits, adjusted one step at a time: guests, nights, cart items.
- Form or list rows where the control cannot change width: the space for the two buttons and the largest value stays reserved even when a button disappears.
- When the limit needs to be obvious: at `min` or `max` the matching button disappears, instead of just being dimmed.

## When not to use

- Use [`number-field`](number-field.md) when the person needs to type the value: here the number is not editable, only the buttons and arrows change it.
- Use [`slider`](slider.md) for wide or continuous ranges, where reaching the value step by step would take too many taps.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { AdaptiveStepper } from "@/components/ryan-ui/adaptive-stepper/adaptive-stepper";
import { Caption, Stack, Surface } from "./_kit";
import styles from "./adaptive-stepper.module.css";

const NIGHTLY = 184;

export default function AdaptiveStepperDemo() {
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [pets, setPets] = useState(0);

  return (
    <Surface width={380} padding={6}>
      <Stack gap={4}>
        <div className={styles.row}>
          <div><p className={styles.name}>Guests</p><p className={styles.hint}>Sleeps up to 6</p></div>
          <AdaptiveStepper label="Guests" value={guests} onValueChange={setGuests} min={1} max={6} formatValueText={value => `${value} guests`} />
        </div>
        <div className={styles.row}>
          <div><p className={styles.name}>Nights</p><p className={styles.hint}>Hold a button to run</p></div>
          <AdaptiveStepper label="Nights" value={nights} onValueChange={setNights} min={1} max={28} formatValueText={value => `${value} nights`} />
        </div>
        <div className={styles.row}>
          <div><p className={styles.name}>Pets</p><p className={styles.hint}>Two at most</p></div>
          <AdaptiveStepper label="Pets" value={pets} onValueChange={setPets} min={0} max={2} size="sm" />
        </div>
        <div className={styles.total}>
          <span>Total for {nights} {nights === 1 ? "night" : "nights"}</span>
          <strong>${(NIGHTLY * nights + pets * 25).toLocaleString("en-US")}</strong>
        </div>
        <Caption>At a limit the button folds away and the number slides over. The control keeps its size.</Caption>
      </Stack>
    </Surface>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AdaptiveStepper`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | The current value (controlled). |
| `defaultValue` | `number` | — | The starting value (uncontrolled). Defaults to `min`. |
| `onValueChange` | `(value: number) => void` | — | Runs with the new value after every step. |
| `min` | `number` | `0` | Lowest value. The minus button folds away here. |
| `max` | `number` | `10` | Highest value. The plus button folds away here. |
| `step` | `number` | `1` | Amount added or removed per press. |
| `largeStep` | `number` | — | Amount for Page Up and Page Down. Defaults to five steps. |
| `label` (required) | `string` | — | Accessible name, for example "Quantity". |
| `formatValueText` | `(value: number) => string` | — | Spoken form of the value, for example `value => value + " guests"`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Control height: 36, 44 or 50 px. |
| `name` | `string` | — | Field name: adds a hidden input so the value submits with a form. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `→` | Adds one `step`. |
| `↓` or `←` | Subtracts one `step`. |
| `Page Up` or `Page Down` | Adds or subtracts `largeStep` (by default, five steps). |
| `Home` or `End` | Goes to `min` or to `max`. |
| `Tab` | Moves focus to the number; the minus and plus buttons are outside the tab order. |

## Accessibility

- The number is a `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`; `label` is required and becomes the accessible name.
- Pass `formatValueText` so the screen reader announces the value with a unit (“3 nights”) instead of the bare number.
- Pressing a button moves focus to the number, so focus is not lost when the button disappears at the limit; the buttons have an English `aria-label` (`Increase …`, `Decrease …`), built from `label`.

## Motion

- Each digit rolls up when the value goes up and down when it goes down, with a spring with no overshoot and a slight blur.
- At `min` or `max` the matching button folds against the edge and disappears, and the number slides half a button toward the side that became empty.
- With “reduce motion” on, digits and buttons only fade and the number changes place instantly.

## Responsive behavior

- The width is fixed (two buttons plus the digits of the larger of `min` and `max`) and the height follows `size`: 36, 44, or 50 px.

## Notes for AI

- Works controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`, which falls back to `min`); the defaults are `min={0}`, `max={10}`, and `step={1}`.
- `label` is required and does not show on screen: put the visible text alongside, and pass `name` if the value should go along on form submission (it becomes a hidden field).
- Holding a button already repeats the step (waits 380 ms, then one every 75 ms) and the decimal places follow those of `step` and `min`: do not reimplement this externally.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/adaptive-stepper · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
