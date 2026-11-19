# Returns calendar

> Calendário de retornos diários, mês a mês, com cada dia colorido pela força do ganho ou da perda e o total do mês.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/returns-calendar
- Original description: Small month calendars of daily returns tinted by gain or loss, with month totals, months and cells that wave in, and a tooltip that glides between days.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/returns-calendar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/returns-calendar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/returns-calendar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/returns-calendar.json`. Registry path, relative to the site address: `r/returns-calendar.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/returns-calendar/returns-calendar.tsx`
  - `components/ryan-ui/returns-calendar/returns-calendar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/returns-calendar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing the daily return of a portfolio, fund, or strategy over several months, with each month's total next to its name.
- When the pattern matters more than the curve: streaks of good or bad days, the best and worst day, how many days closed up.
- As a trading-day picker to drill down elsewhere on the screen, with `onSelectDate`.

## When not to use

- Use [`activity-heatmap`](activity-heatmap.md) for unsigned daily counts, such as contributions or visits over a year.
- Use [`calendar`](calendar.md) or [`date-picker`](date-picker.md) when the user needs to pick any date; here only days with data are clickable.
- Use [`line-chart`](line-chart.md) when what matters is the cumulative evolution, not each day in isolation.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import ReturnsCalendar, { type DailyReturn } from "@/components/ryan-ui/returns-calendar/returns-calendar";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

/** Small seeded generator: the same seed always draws the same year, so the demo never changes between visits. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

const HOLIDAYS = new Set(["2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", "2026-05-25", "2026-06-19", "2026-07-03", "2026-09-07"]);
/** Average daily drift of each month in percent: a soft spring, a rally into summer, a wobble in autumn. */
const DRIFT = [0.09, 0.02, -0.16, 0.06, 0.2, 0.08, 0.12, -0.05, -0.12, 0.14, 0.05];

/** Trading days from January 2 to November 10, 2026, weekends and market holidays left out. */
function year(): DailyReturn[] {
  const rand = seeded(41);
  const days: DailyReturn[] = [];
  for (let time = Date.UTC(2026, 0, 1); time <= Date.UTC(2026, 10, 10); time += 86_400_000) {
    const date = new Date(time);
    const iso = date.toISOString().slice(0, 10);
    if (date.getUTCDay() === 0 || date.getUTCDay() === 6 || HOLIDAYS.has(iso)) continue;
    const noise = (rand() + rand() + rand() - 1.5) * 1.5;
    const shock = rand() > 0.95 ? (rand() - 0.45) * 4 : 0;
    days.push({ date: iso, value: Math.round((DRIFT[date.getUTCMonth()]! + noise + shock) * 100) / 100 });
  }
  return days;
}

const percent = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" });
const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

export default function ReturnsCalendarDemo() {
  const [half, setHalf] = useState("h1");
  const [selected, setSelected] = useState<string | null>(null);
  const all = useMemo(year, []);
  const returns = useMemo(() => all.filter(day => (day.date < "2026-07-01") === (half === "h1")), [all, half]);
  const picked = returns.find(day => day.date === selected);

  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Period" value={half} onValueChange={value => { setHalf(value); setSelected(null); }}
        options={[{ value: "h1", label: "First half" }, { value: "h2", label: "Second half to date" }]} />
      <Surface>
        <ReturnsCalendar label={`Daily returns of the Core Growth portfolio, ${half === "h1" ? "January to June" : "July to November"} 2026`} returns={returns} selectedDate={selected} onSelectDate={setSelected} />
      </Surface>
      <Caption>
        {picked
          ? `${dayLabel.format(new Date(`${picked.date}T00:00:00Z`))}: the portfolio closed ${percent.format(picked.value)}%.`
          : "Core Growth portfolio, daily close to close. Hover a day, walk the calendar with the arrow keys, or click a day to pin it."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ReturnsCalendar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `returns` (required) | `DailyReturn[]` | — | One entry per trading day, in any order. Days without an entry are drawn as closed. |
| `label` (required) | `string` | — | Accessible name of the calendar, such as "Daily returns, first half of 2026". |
| `period` | `string` | — | Text beside the overall total. Defaults to the range of months the data covers. |
| `weekends` | `boolean` | `false` | Shows Saturday and Sunday columns. Off by default, for markets that close on weekends. |
| `scale` | `number` | — | Return in percent at which the color saturates. Defaults to a high percentile of the data. |
| `compound` | `boolean` | `true` | Compounds daily returns into the totals. Set false to add them up instead. |
| `selectedDate` | `string \| null` | — | Selected day as YYYY-MM-DD, or null for none. Leave undefined to let the calendar keep its own selection. |
| `defaultSelectedDate` | `string \| null` | `null` | Day selected at first when the calendar keeps its own selection. |
| `onSelectDate` | `(date: string \| null) => void` | — | Called with the day that was clicked, or null when the selected day is clicked again. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same labels. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

#### `DailyReturn`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `string` | Trading day as YYYY-MM-DD. |
| `value` (required) | `number` | Return of the day in percent: 1.2 means the day closed 1.2% up. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move focus to the previous or next day with data, crossing months, and show that day's tooltip. |
| `↑` or `↓` | Step back or forward five days with data (seven with `weekends`), which equals one week when there are no holidays in the way. |
| `Home` or `End` | Go to the first or last day of the period. |
| `Enter` or `Space` | Select the focused day; press again to clear the selection. |
| `Esc` | Closes the tooltip. |
| `Tab` | Enters the calendar on a single day (the last focused or the most recent) and leaves it. |

## Accessibility

- The whole is a `role="group"` named by `label`; each month is a `<section>` with month and total in its name, and each day with data is a `<button>` with `aria-pressed`.
- Focus uses a roving tabindex: only one day is in the `Tab` order and the arrow keys lead to the others; days without data are decorative and outside navigation.
- Each day's name carries the full date and the return (`up`, `down`, or `flat` plus the percentage); these terms and the visible labels, such as `Best day` and `Closed`, are hardcoded in English.

## Motion

- On entering the viewport, the months rise one after another and each month's cells appear in a diagonal wave, growing from half size; the grand total counts up from zero to the value.
- The tooltip is a single one: it appears already in place and then glides on a spring from one day to the next; with a mouse, the day under the cursor grows slightly.
- With “reduced motion” on, months and cells only fade, the total appears directly, and the tooltip doesn't glide.

## Responsive behavior

- Months are distributed into columns of at least 128 px according to the container's width; below 420 px they always sit in two columns.
- On touch, the tooltip stays visible for about two seconds after the finger leaves, to give time to read.

## Performance

- Each day with data is a `<button>` (a year of trading days gives about 250), and the wave entrance uses only CSS transitions with delay, with no JavaScript per cell.

## Notes for AI

- Pass `returns` as `{ date: "YYYY-MM-DD", value }`, with `value` in percentage points (`1.2` = +1.2%); days without an entry appear as closed and months without an entry aren't drawn.
- Totals are compounded by default: `compound={false}` sums the returns, `weekends` shows Saturday and Sunday, and `scale` fixes the percentage at which the color saturates.
- Controlled selection with `selectedDate` and `onSelectDate` (`null` = none) or internal with `defaultSelectedDate`; keep `returns` in `useMemo`, since the whole calendar is recomputed when the array changes.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/returns-calendar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
