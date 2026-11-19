# Calendar

> Navegue pelas datas em uma visão mensal clara e compacta.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/calendar
- Original description: Browse dates in a clear, compact month view.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/calendar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/calendar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/calendar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/calendar.json`. Registry path, relative to the site address: `r/calendar.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/calendar/calendar.tsx`
  - `components/ryan-ui/lib/use-today.ts`
  - `components/ryan-ui/calendar/calendar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/calendar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing a single day with the month always visible on the page: scheduling, delivery, an agenda side panel.
- When some days cannot be chosen: `minDate`, `maxDate`, and the `disabledDates` function block days, and the keyboard skips over them.
- As a piece of your own picker: `month` and `onMonthChange` control the visible month, as `date-picker` does.

## When not to use

- Use [`date-picker`](date-picker.md) when the calendar should open from a form field and close after the choice.
- Use [`date-range-picker`](date-range-picker.md) to choose a start and end: this calendar holds a single day.
- Use [`activity-heatmap`](activity-heatmap.md) to display values per day across the year; this calendar is for choosing a date, not for visualizing data.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Calendar, addDays, startOfDay } from "@/components/ryan-ui/calendar/calendar";
import { Caption, Stack } from "./_kit";

export default function CalendarDemo() {
  const today = startOfDay(new Date());
  const [value, setValue] = useState<Date>(addDays(today, 3));
  return (
    <Stack gap={4} align="center">
      <Calendar
        value={value}
        onChange={setValue}
        showToday
        disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
      <Caption>Selected: {value.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}. Weekends are unavailable.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Calendar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Date` | — | — |
| `onChange` | `(date: Date) => void` | — | — |
| `month` | `Date` | — | — |
| `onMonthChange` | `(month: Date) => void` | — | — |
| `minDate` | `Date` | — | — |
| `maxDate` | `Date` | — | — |
| `disabledDates` | `(date: Date) => boolean` | — | — |
| `locale` | `string` | `"en-US"` | — |
| `className` | `string` | — | — |
| `showToday` | `boolean` | `false` | Adds a Today button that slides back to the current month and selects today when it is available. |

### Exported types

| Type | Definition |
| --- | --- |
| `CalendarDateMatcher` | `(date: Date) => boolean` |

### Other exports

- `startOfDay` (function)
- `sameDay` (function)
- `addDays` (function)
- `addMonths` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Moves focus one day back or forward, skipping blocked days. |
| `↑` or `↓` | Moves focus one week back or forward. |
| `Home` or `End` | Goes to the Sunday or Saturday of the focused week. |
| `Page Up` or `Page Down` | Goes to the same day of the previous or next month, and the visible month follows. |
| `Shift + Page Up` or `Shift + Page Down` | Goes back or forward one year. |
| `Enter` or `Space` | Selects the focused day. |

## Accessibility

- Each month is a `role="grid"` and each day a button with the full-text date in `aria-label`, `aria-selected`, and, on today, `aria-current="date"`.
- Only one day is in the tab order (the last focused, the selected, today, or the first available), and the month change is announced by an `aria-live` region.
- `locale` translates the month, the weekdays, and the date read out on each day, but `Today`, `Previous month`, and `Next month` are fixed English texts.

## Motion

- Months sit side by side in a strip that slides with a spring with no overshoot; quick clicks redirect the same spring instead of queuing animations.
- The selection disc slides in a straight line from one day to another, and each number changes color the moment the disc passes over it.
- With “reduce motion” on, month, title, and disc swap in place, with no displacement.

## Responsive behavior

- Takes `min(100%, 328px)` and every grid has six weeks, so the height does not change from one month to another.
- The header is its own container: below 260 px of width the title takes a full line and the controls drop to the next line.

## Performance

- Only the destination month and those still passing through the strip stay mounted, with 42 buttons each; the month leaving becomes `inert`.

## Notes for AI

- Selection is always controlled: keep the date in state and pass `value` and `onChange`, otherwise no day is marked; the visible month can be left to the component or come from `month`.
- The week always starts on Sunday and `locale` defaults to `en-US`: pass `locale="pt-BR"` to get the names in Portuguese.
- Without `value` or `month`, the grid is only filled after hydration, because “today” comes from the visitor's clock (`useToday`).

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/calendar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
