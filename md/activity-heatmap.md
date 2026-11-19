# Activity heatmap

> Um ano de atividade num relance, com um quadradinho para cada dia.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/activity-heatmap
- Original description: See a year of activity at a glance, one square per day.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/activity-heatmap.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/activity-heatmap.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/activity-heatmap.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/activity-heatmap.json`. Registry path, relative to the site address: `r/activity-heatmap.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/activity-heatmap/activity-heatmap.tsx`
  - `components/ryan-ui/activity-heatmap/activity-heatmap.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/activity-heatmap.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A year of daily activity (commits, visits, workouts) where rhythm, streaks, and idle weeks matter more than the exact number for each day.
- Switch years or ranges without redrawing: with new `days`, the grid recolors in a sweep and the total rolls digit by digit.
- Let the user pick a day to filter what appears below, with `selectedDate` and `onSelectDate`.

## When not to use

- Use [`bar-chart`](bar-chart.md) when exact comparison between days is the goal.
- Use [`returns-calendar`](returns-calendar.md) for daily values that can be negative, such as gains and losses; here, counts below zero become zero.
- Use [`date-picker`](date-picker.md) when the task is to choose a date, not to read activity.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import ActivityHeatmap, { type ActivityDay } from "@/components/ryan-ui/activity-heatmap/activity-heatmap";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function year(y: number, seed: number): ActivityDay[] {
  const rand = seeded(seed);
  const days: ActivityDay[] = [];
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y, 11, 31);
  for (let t = start, i = 0; t <= end; t += 86400000, i++) {
    const d = new Date(t);
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const season = 0.6 + 0.4 * Math.sin((i / 365) * Math.PI * 3);
    const burst = rand() > 0.93 ? 2.2 : 1;
    const base = weekend ? 1.2 : 6;
    const count = rand() < (weekend ? 0.55 : 0.12) ? 0 : Math.round(base * season * burst * (0.3 + rand() * 1.4));
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  return days;
}

export default function ActivityHeatmapDemo() {
  const [period, setPeriod] = useState("2025");
  const [selected, setSelected] = useState<string | null>(null);
  const data = useMemo(() => ({ "2025": year(2025, 7), "2024": year(2024, 21) }), []);
  const days = data[period as "2025" | "2024"];
  const total = days.reduce((n, d) => n + d.count, 0).toLocaleString("en-US");

  return (
    <Stack gap={4} width={820}>
      <Surface>
        <ActivityHeatmap
          days={days}
          label={`Contributions in ${period}`}
          period={period}
          selectedDate={selected}
          onSelectDate={(d) => setSelected((cur) => (cur === d ? null : d))}
          actions={<SegmentedControl label="Year" value={period} onValueChange={setPeriod} options={[{ value: "2025", label: "2025" }, { value: "2024", label: "2024" }]} />}
        />
      </Surface>
      <Caption>{total} contributions in {period}. Hover a square for its day, click one to select it, or switch the year.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ActivityHeatmap`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `days` (required) | `ActivityDay[]` | — | One entry per day, oldest first. Days missing inside the range count as zero. |
| `label` (required) | `string` | — | Accessible name for the grid, such as "Contributions in 2025". |
| `period` (required) | `string` | — | Finishes the summary line: "1,284 contributions in {period}". |
| `unit` | `{ one: string; other: string }` | `CONTRIBUTIONS` | Nouns for the count. |
| `thresholds` | `[number, number, number]` | — | Upper bounds for levels one to three; anything above the last is level four. Defaults to quarters of the busiest day. |
| `weekStartsOn` | `0 \| 1` | `0` | — |
| `selectedDate` | `string \| null` | `null` | — |
| `onSelectDate` | `(date: string) => void` | — | — |
| `actions` | `ReactNode` | — | Controls beside the summary, such as a range switch. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same labels. |
| `className` | `string` | — | — |

### Exported types

#### `ActivityDay`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `string` | Calendar day as YYYY-MM-DD. |
| `count` (required) | `number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Enters the grid at the last day that had focus (or the selected one, or the most recent) and continues to the legend; only one day and one level are in the tab order. |
| `↑` or `↓` | Moves to the previous or next day. |
| `←` or `→` | In the grid, moves back or forward one week; in the legend, moves to the previous or next level. |
| `Home` or `End` | Moves to the first or last day of the range; in the legend, to the first or last level. |
| `Enter` or `Space` | In the grid, selects the focused day and calls `onSelectDate`; in the legend, pins or unpins the level highlight. |
| `Esc` | Closes the tooltip of the focused day; in the legend, cancels the level preview. |

## Accessibility

- The grid has `role="grid"` with its name coming from `label` (required), and each day is a `gridcell` whose `aria-label` carries the count and the full date.
- The total sits in a hidden `role="status"` region; the legend levels are buttons with `aria-pressed`, and an `aria-live` text says how many days are in the highlighted level.
- The fixed texts (“No …”, “in”, “Less”, “More”, “days with”) are in English in the code: `locale` only changes dates and numbers, and `unit` only the nouns of the count.

## Motion

- The first time it enters the screen, the squares appear in a diagonal wave of about 0.4 s; a new range recolors the grid along the same diagonal, forward or backward depending on the date.
- A single tooltip slides with a spring from one day to another, and the selection ring slides to the chosen day.
- With “reduce motion”, the grid appears all at once, the tooltip jumps into place, and swaps become a short fade.

## Responsive behavior

- The square size goes from 9 to 15 px depending on the container width; below about 670 px the grid scrolls sideways, starts at the most recent weeks, and keeps the weekday labels fixed on the left.
- In containers up to 440 px the legend shortens to just the day count; if the background is not `--surface`, set `--heatmap-surface` so the fixed labels cover the scrolling grid.

## Performance

- There are about 370 memoized cells, with events delegated to the grid; pass `days`, `thresholds`, and `onSelectDate` with a stable reference (`useMemo`, `useCallback`) so all of them are not redone on every render.

## Notes for AI

- `days` is a list of `{ date: "YYYY-MM-DD", count }` from the oldest day to the newest, read in UTC; missing days count as zero, and `label` and `period` are required.
- Selection is controlled only: keep `selectedDate` in the parent and update it in `onSelectDate`; without that callback, clicking a day does nothing.
- Put the year selector in `actions` (a `segmented-control`, for example) and change only `days`: changing the component's `key` remounts the grid and loses the recoloring sweep.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/activity-heatmap · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
