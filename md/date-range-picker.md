# Date range picker

> Seletor de período que cresce a partir do gatilho, com dois meses, atalhos e destaque elástico.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/date-range-picker
- Original description: A range picker that grows from its trigger into two months with presets and a stretching range highlight.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-range-picker.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-range-picker.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-range-picker.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/date-range-picker.json`. Registry path, relative to the site address: `r/date-range-picker.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/date-range-picker/date-range-picker.tsx`
  - `components/ryan-ui/lib/use-today.ts`
  - `components/ryan-ui/date-range-picker/date-range-picker.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/date-range-picker.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A report period or dashboard filter, where shortcuts like “Last 7 days” solve most cases.
- Bookings and searches where start and end are chosen together and only count after confirming with `Apply`.
- Toolbars: closed, it takes only the width of its own text, and the panel grows over the page without pushing the content.

## When not to use

- Use [`date-picker`](date-picker.md) when one date is enough.
- Use [`calendar`](calendar.md) when the month needs to stay open on the page.
- When you need to block individual days, like holidays or weekends: there are only `minDate` and `maxDate`, with no function to disable dates.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useMemo, useState } from "react";
import DateRangePicker, { type DateRange } from "@/components/ryan-ui/date-range-picker/date-range-picker";
import { Caption, demoStage } from "./_kit";
import styles from "./date-range-picker.module.css";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const day = (t: Date, offset = 0) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset);

export default function DateRangePickerDemo() {
  // The preview opens on load with the last 7 days selected, so the stretching range highlight is visible at once.
  // The panel is bound to the stage, not the window: at any stage width it opens whole, beside its trigger.
  const preset = useMemo(() => {
    const today = new Date();
    return { start: day(today, -6), end: day(today) };
  }, []);
  const [range, setRange] = useState<DateRange | null>(preset);
  const days = range ? Math.round((day(range.end).getTime() - day(range.start).getTime()) / 86400000) + 1 : 0;
  return (
    <div className={styles.box}>
      <div className={styles.room}>
        <DateRangePicker label="Reporting period" value={range} onChange={setRange} placeholder="Select dates" defaultOpen boundary={demoStage}
          presets={[
            { label: "Last 7 days", range: t => ({ start: day(t, -6), end: day(t) }) },
            { label: "Last 30 days", range: t => ({ start: day(t, -29), end: day(t) }) },
            { label: "This month", range: t => ({ start: new Date(t.getFullYear(), t.getMonth(), 1), end: day(t) }) },
            { label: "Last month", range: t => ({ start: new Date(t.getFullYear(), t.getMonth() - 1, 1), end: new Date(t.getFullYear(), t.getMonth(), 0) }) },
            { label: "This quarter", range: t => ({ start: new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1), end: day(t) }) },
            { label: "Year to date", range: t => ({ start: new Date(t.getFullYear(), 0, 1), end: day(t) }) },
          ]} />
      </div>
      <Caption>{days ? `${days} days selected. Pick a preset or two days, then Apply.` : "No dates selected."}</Caption>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `DateRangePicker`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `DateRange \| null` | — | Controlled value. Pass `null` for no selection. |
| `defaultValue` | `DateRange \| null` | `null` | Uncontrolled starting value. |
| `onChange` | `(range: DateRange) => void` | — | Called with the applied range. |
| `label` | `string` | `"Date range"` | Accessible name of the trigger and the dialog. Defaults to "Date range". |
| `placeholder` | `string` | `"Select dates"` | — |
| `presets` | `DateRangePreset[]` | `defaultDateRangePresets` | — |
| `minDate` | `Date` | — | — |
| `maxDate` | `Date` | — | — |
| `weekStartsOn` | `0 \| 1` | `0` | 0 is Sunday, 1 is Monday. Defaults to 0. |
| `locale` | `string` | `"en-US"` | — |
| `months` | `"auto" \| 1 \| 2` | `"auto"` | Force one or two months. `auto` picks two when the boundary is wide enough. |
| `boundary` | `() => HTMLElement \| null` | — | The element the panel should stay inside. Defaults to the viewport. |
| `defaultOpen` | `boolean` | `false` | Start with the panel open, without moving focus into it or scrolling the page (for previews and onboarding). Later opens behave as usual. |
| `className` | `string` | — | — |

### Exported types

#### `DateRange`

An inclusive range of whole days.

| Field | Type | Description |
| --- | --- | --- |
| `start` (required) | `Date` | — |
| `end` (required) | `Date` | — |

#### `DateRangePreset`

A shortcut in the preset rail. `range` receives the viewer's local today.

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `range` (required) | `(today: Date) => DateRange` | — |

### Other exports

- `defaultDateRangePresets` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the trigger, open the panel; on a day, mark the start and, the second time, the end of the period. |
| `←` or `→` or `↑` or `↓` | On days, move focus one day or one week; after the start is marked, the period stretches to the focused day. |
| `Home` or `End` | Go to the first or last day of the week, according to `weekStartsOn`. |
| `Page Up` or `Page Down` | Change one month; with `Shift`, one year. |
| `↑` or `↓` or `←` or `→` | In the shortcut list, move from one shortcut to another: `↑` and `↓` in the wide panel, `←` and `→` in the compact one. |
| `Esc` | Closes without applying and returns focus to the trigger. |

## Accessibility

- The trigger has an `aria-label` with `label` and the current period; the panel is a `role="dialog"`, each month a `role="grid"`, and days inside the period get `aria-selected`.
- An `aria-live` region announces the marked start and then the period with the day count; on open, focus goes to the period start or to today, and `Esc`, `Cancel`, and `Apply` return it to the trigger.
- `label` does not show on screen, and `Cancel`, `Apply`, `Presets`, and the announcements are fixed in English; only the shortcut labels change, via the `presets` prop.

## Motion

- The trigger surface grows with a spring to the size of the panel and shrinks back; on apply, the period text flies from the footer to the trigger.
- The highlight stretches week by week as the cursor or focus moves, the ends slide from one day to another, and the months enter from the navigation side.
- With “reduce motion” on, sizes and positions jump to the end and the content only fades.

## Responsive behavior

- With less than 712 px free in the boundary (the window or the `boundary` element), it shows a single month and shortcuts become a row with horizontal scrolling; `months` forces 1 or 2.
- The panel shifts horizontally to fit the boundary with an 8 px margin and, on short screens, scrolls the page until the `Apply` button appears.

## Performance

- The panel is only mounted while it is open; during that time there is a `ResizeObserver` on it and a `resize` listener on the window, in addition to the trigger's permanent observer.

## Notes for AI

- `onChange` only fires on `Apply`, never on each click; use `value` (with `null` for empty) or `defaultValue`, and remember the period includes both end days.
- Pass `boundary={() => elemento}` when the picker lives in a panel or column: the panel stays inside it and the choice between one and two months uses that width.
- Replace `presets` with Portuguese labels (`{ label, range: hoje => ({ start, end }) }`) and pass `locale="pt-BR"` and, if the week starts on Monday, `weekStartsOn={1}`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/date-range-picker · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
