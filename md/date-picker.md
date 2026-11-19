# Date picker

> Escolha uma data sem perder o contexto da página.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/date-picker
- Original description: Choose a date without losing context.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-picker.json`. Registry path, relative to the site address: `r/date-picker.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Calendar](calendar.md)
- Files, once installed:
  - `components/ryan-ui/date-picker/date-picker.tsx`
  - `components/ryan-ui/date-picker/date-picker.module.css`
  - `components/ryan-ui/calendar/calendar.tsx`
  - `components/ryan-ui/lib/use-today.ts`
  - `components/ryan-ui/calendar/calendar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/date-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A single date inside a form, with a label, help text, and the calendar opening under the field.
- Dates with restrictions: `minDate`, `maxDate`, and `disabledDates` block days, like weekends on a delivery.
- When the date can be left empty: the calendar footer has a clear button, which calls `onChange(undefined)`.

## When not to use

- Use [`date-range-picker`](date-range-picker.md) to choose the start and end of a period.
- Use [`calendar`](calendar.md) when the month should always be visible on the page, with no field or popover.
- For distant dates the person knows by heart, like a birth date: there is no typing, and the year only changes by keyboard or month by month.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { DatePicker } from "@/components/ryan-ui/date-picker/date-picker";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 600 };

export default function DatePickerDemo() {
  // The preview opens the calendar on load (focus stays on the page). The space below the field is reserved for it,
  // so the open calendar never covers the caption nor touches the stage edge.
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Stack gap={3} width={320}>
      <div style={{ paddingBottom: 412 }}>
        <DatePicker label="Delivery date" value={date} onChange={setDate} showToday defaultOpen minDate={new Date()} disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6} />
      </div>
      <Caption>{date ? `Arriving ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.` : "Weekends are unavailable. Pick a weekday."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `DatePicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `Date` | — | — |
| `onChange` | `(date: Date \| undefined) => void` | — | — |
| `description` | `string` | — | — |
| `placeholder` | `string` | `"Select a date"` | — |
| `minDate` | `Date` | — | — |
| `maxDate` | `Date` | — | — |
| `disabledDates` | `CalendarDateMatcher` | — | — |
| `locale` | `string` | `"en-US"` | — |
| `format` | `Intl.DateTimeFormatOptions` | `{ month: "short", day: "numeric", year: "nume…` | — |
| `showToday` | `boolean` | — | Adds a Today button to the calendar header. |
| `defaultOpen` | `boolean` | `false` | Start with the calendar open, without moving focus into it (for previews and onboarding). Later opens move focus as usual. |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `value` and `onChange`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` or `↓` | On the field, open the calendar and move focus to the selected day, to today, or to the first available day of the month. |
| `←` or `→` or `↑` or `↓` | In the calendar, move focus one day or one week, skipping blocked days. |
| `Home` or `End` | Go to the Sunday or Saturday of the focused week. |
| `Page Up` or `Page Down` | Change month; with `Shift`, year. |
| `Enter` or `Space` | On a day, choose the date and close the calendar. |
| `Esc` | Closes the calendar without changing the date and returns focus to the field. |

## Accessibility

- The field is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`, tied to the visible `label` and to `description`; the formatted value also goes in a screen-reader-only text.
- On open, focus goes to a day in the calendar; on choosing a day or closing with `Esc`, it returns to the field, and leaving with `Tab` closes the popover.
- The popover is a `role="dialog"` with no focus trap, and its texts (`Clear`, `Choose a day`, `Selected …`) are fixed in English, even with `locale`.

## Motion

- The calendar grows from the field's icon with a short spring and only closes 300 ms after the choice, so the highlight reaches the day.
- In the field, only the parts of the date that changed roll: a later date rises from below, an earlier one drops from above.
- With “reduce motion” on, everything becomes a fade and the calendar closes immediately after the choice.

## Responsive behavior

- The popover is `min(320px, 100vw - 32px)`, always opens below the field, left-aligned, and on screens up to 360 px it takes the field's width.
- There is no portal or flip upward: leave free space below the field and avoid ancestors with `overflow: hidden`.

## Notes for AI

- It is always controlled: keep `Date | undefined` in state and pass `value` and `onChange`; there is no `defaultValue`.
- Pass `locale="pt-BR"` (the default is `en-US`) and, for another format in the field, `format` with `Intl.DateTimeFormat` options.
- Depends on `calendar`; extra props and `disabled` go to the field's button, and `showToday` adds the today button to the header.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/date-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
