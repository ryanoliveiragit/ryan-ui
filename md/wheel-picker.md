# Wheel picker

> Seletor de roda como o de hora do celular: arraste, solte com impulso e ele encaixa na opção; aceita várias colunas e teclado.

- Type: component (category Inputs), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/wheel-picker
- Original description: A vertical wheel picker with snap and drag momentum, like a phone time picker, with several columns, disabled options and full keyboard support.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wheel-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wheel-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wheel-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/wheel-picker.json`. Registry path, relative to the site address: `r/wheel-picker.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/wheel-picker/wheel-picker.tsx`
  - `components/ryan-ui/wheel-picker/wheel-picker.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/wheel-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing a time, duration, or date on touch screens, with the wheel gesture people know from their phones.
- Multi-column combinations, such as hour, minute, and AM/PM, or day and shift.
- Short lists with unavailable options that need to stay visible, such as fully booked days.

## When not to use

- Use [`time-picker`](time-picker.md) in desktop forms, where a field with a list takes less space.
- Use [`select`](select.md) or [`combobox`](combobox.md) for long text lists, where reading or typing is faster than spinning.
- Use [`date-picker`](date-picker.md) to choose dates on a calendar.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { WheelPicker } from "@/components/ryan-ui/wheel-picker/wheel-picker";
import type { WheelColumn, WheelValue } from "@/components/ryan-ui/wheel-picker/wheel-picker";
import { Caption, Row, Stack } from "./_kit";

const two = (value: number) => String(value).padStart(2, "0");

const time: WheelColumn[] = [
  { id: "hour", label: "Hour", options: Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1) })), suffix: ":", align: "end" },
  { id: "minute", label: "Minute", options: Array.from({ length: 12 }, (_, index) => ({ value: two(index * 5) })) },
  { id: "period", label: "AM or PM", options: [{ value: "AM" }, { value: "PM" }] },
];

const delivery: WheelColumn[] = [
  {
    id: "day",
    label: "Delivery day",
    options: [
      { value: "mon", label: "Mon, Nov 16" },
      { value: "tue", label: "Tue, Nov 17", disabled: true },
      { value: "wed", label: "Wed, Nov 18" },
      { value: "thu", label: "Thu, Nov 19" },
      { value: "fri", label: "Fri, Nov 20", disabled: true },
      { value: "sat", label: "Sat, Nov 21" },
      { value: "mon2", label: "Mon, Nov 23" },
    ],
  },
];

export default function WheelPickerDemo() {
  const [at, setAt] = useState<WheelValue>({ hour: "7", minute: "30", period: "AM" });
  const [slot, setSlot] = useState<WheelValue>({ day: "wed" });
  const day = delivery[0]!.options.find(option => option.value === slot.day)?.label;

  return (
    <Row gap={8} justify="center" align="flex-start">
      <Stack gap={3} align="center">
        <WheelPicker label="Alarm time" columns={time} value={at} onValueChange={setAt} />
        <Caption>Alarm set for {at.hour}:{at.minute} {at.period}</Caption>
      </Stack>
      <Stack gap={3} align="center">
        <WheelPicker label="Delivery" columns={delivery} value={slot} onValueChange={setSlot} visibleCount={5} />
        <Caption>Arrives {day}. Struck days are fully booked.</Caption>
      </Stack>
    </Row>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `WheelPicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` (required) | `WheelColumn[]` | — | One wheel per entry, left to right. |
| `value` | `Record<string, string>` | — | Chosen values by column id (controlled). |
| `defaultValue` | `Record<string, string>` | — | Values chosen at first (uncontrolled). A column without one starts on its first enabled option. |
| `onValueChange` | `(value: WheelValue, columnId: string) => void` | — | Runs with every column's value when one settles on a new option; `columnId` says which one moved. |
| `label` | `string` | — | Accessible name of the whole picker, for example "Reminder time". |
| `itemHeight` | `number` | `38` | Height of one row in px. |
| `visibleCount` | `number` | `5` | How many rows show at once. Use an odd number so one row sits in the middle. |
| `disabled` | `boolean` | `false` | Turns the control off: it is dimmed and ignores pointer and keyboard input. |
| `className` | `string` | — | Extra class names for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `WheelValue`: One chosen value per column, keyed by column id. | `Record<string, string>` |

#### `WheelOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | The value reported when this option is chosen. |
| `label` | `string` | What the wheel shows. Falls back to the value. |
| `disabled` | `boolean` | Shown dimmed; the wheel never comes to rest on it. |

#### `WheelColumn`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Key of this column in the picker's value object, for example "hour". |
| `label` (required) | `string` | Accessible name of the column, for example "Hour". |
| `options` (required) | `WheelOption[]` | The options from top to bottom. |
| `suffix` | `ReactNode` | Fixed text shown beside the selection band after this column, such as ":" or "min". It does not scroll. |
| `width` | `number \| string` | Column width in px or any CSS length. By default it fits its widest option. |
| `align` | `"start" \| "center" \| "end"` | How labels line up inside the column. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | Spin the focused column by one option, skipping disabled ones. |
| `Page Down` or `Page Up` | Spin one screen of options (`visibleCount` minus one). |
| `Home` or `End` | Go to the first or last enabled option. |
| `←` or `→` | Move focus to the previous or next column. |
| `A–Z` or `0–9` | Typing the start of a label jumps to it, as in a native list. |

## Accessibility

- Each column is a focusable vertical `listbox`, with the column `label` and `aria-activedescendant` pointing to the chosen option; disabled options have `aria-disabled`.
- The whole is a `role="group"`: pass `label` on `WheelPicker`, such as “Alarm time”, and a clear `label` on each column, such as “Hour” and “Minute”.
- The `suffix` (such as “:” or “min”) is `aria-hidden`; if the unit matters for understanding the column, put it in the column `label`.

## Motion

- Dragging spins the column with the finger; released with momentum, it keeps going with inertia and stops on the nearest enabled option, with a small elastic give at the ends.
- The rows tilt, shrink, and fade as they move away from the center band, as on a drum, and keys and the mouse wheel spin it with a short spring.
- With “reduce motion” on, there is no inertia or tilt: the column stops where it was released and the keys jump straight.

## Responsive behavior

- On touch, the column blocks page scrolling (`touch-action: none`) so the drag spins the wheel; with a mouse, the wheel spins one row per step and, at the ends, lets the page scroll.

## Performance

- Each option recalculates tilt and opacity on every frame of the spin, so columns with hundreds of options, such as a list of years, are heavier than hour and minute ones.

## Notes for AI

- Describe the columns in `columns` (`id`, `label`, `options`, `suffix`); the value is an object per column, such as `{ hour: "7", minute: "30", period: "AM" }`, and `onValueChange` brings the `columnId` that changed.
- Every column always has a value: without a valid value, it takes the first enabled option, and `disabled` options appear struck through and are never where the wheel stops.
- `itemHeight` (38px) and `visibleCount` (5, always odd) define the height; each column fits the widest option, or use `width`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/wheel-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
