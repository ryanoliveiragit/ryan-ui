# Time picker

> Escolha um horário com um comportamento de teclado sensato, em formato 12h ou 24h.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/time-picker
- Original description: Choose a time with sensible keyboard behavior.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/time-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/time-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/time-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/time-picker.json`. Registry path, relative to the site address: `r/time-picker.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/time-picker/time-picker.tsx`
  - `components/ryan-ui/time-picker/time-picker.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/time-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Scheduling a meeting, reminder, or delivery with times in fixed steps of 5, 15, or 30 minutes.
- Compact forms where a field with a list is faster than typing hours and minutes.

## When not to use

- Use [`wheel-picker`](wheel-picker.md) on touch screens, where the wheel gesture is expected, or when some times are unavailable.
- Use [`date-picker`](date-picker.md) when the main choice is the day; for day and time, combine the two.
- Use [`select`](select.md) when the possible times are few and fixed, such as shifts.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { TimePicker } from "@/components/ryan-ui/time-picker/time-picker";
import { Caption, Room, Row, Stack } from "./_kit";

export default function TimePickerDemo() {
  const [time, setTime] = useState("14:30");
  // The first picker opens with the list centered on its time, so the preview shows the list, not just two buttons.
  // The caption sits under the second picker, clear of the open list.
  return (
    <Room below={200}>
      <Row gap={4} align="start" justify="center">
        <TimePicker label="Meeting starts" value={time} onChange={setTime} defaultOpen />
        <Stack gap={3}>
          <TimePicker label="Reminder (24h)" format="24h" minuteStep={5} defaultValue="08:45" />
          <Caption>Stored value: {time}</Caption>
        </Stack>
      </Row>
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TimePicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `string` | — | — |
| `defaultValue` | `string` | `"09:00"` | — |
| `onChange` | `(value: string) => void` | — | — |
| `description` | `string` | — | — |
| `placeholder` | `string` | `"Select a time"` | — |
| `minuteStep` | `1 \| 5 \| 10 \| 15 \| 30` | `15` | — |
| `format` | `"12h" \| "24h"` | `"12h"` | — |
| `disabled` | `boolean` | `false` | — |
| `defaultOpen` | `boolean` | `false` | Start with the list open, centered on the selected time (used by previews). Focus stays where it is. |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the button, open the list centered on the current time; with the list open, choose the highlighted time. |
| `↓` or `↑` | Open the list; when open, move the highlight, wrapping to the start after the end. |
| `Esc` | Closes the list without changing the time. |

## Accessibility

- The button has `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`, and its name joins the label to the chosen time (“Meeting starts 2:30 PM”).
- Focus stays on the button while the arrows move the highlight, without `aria-activedescendant`, so the screen reader only hears the new time after the choice.
- The list is a `listbox` named “{label} options”, and the chosen option has `aria-selected`.

## Motion

- The displayed time rolls like a clock: a later time rises from below and an earlier one drops from above.
- The list appears with a short spring, a slight offset and scale, already centered on the chosen time, and the arrow rotates.
- With “reduce motion” on, the list and the time only fade.

## Responsive behavior

- The list is as wide as the field and at most 250px tall, scrolling inside without dragging the page.

## Performance

- The list renders every time of the day as buttons: 96 with a `minuteStep` of 15, but 1,440 with 1, so prefer steps of 5 or more.

## Notes for AI

- The value is always `"HH:MM"` in 24 hours, even with `format="12h"`, which only changes the display to AM and PM.
- Use `value` with `onChange` or `defaultValue` (default `"09:00"`); a time outside the `minuteStep` grid is displayed, but does not appear selected in the list.
- There is no `name`, minimum time, or blocked times; to block times, use `wheel-picker` with disabled options or validate in the parent.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/time-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
