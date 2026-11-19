# Bar chart

> Compare uma medida ao longo dos dias e passe o dedo por qualquer barra para ver o valor.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/bar-chart
- Original description: Compare one measure across days and scrub any bar for its value.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bar-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bar-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bar-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bar-chart.json`. Registry path, relative to the site address: `r/bar-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/bar-chart/bar-chart.tsx`
  - `components/ryan-ui/bar-chart/bar-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/bar-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A measure over days, weeks, or months, when the user compares each period with the others and with the average.
- Switch ranges (week, 30 days) without redrawing: bars with the same `key` stay in place and the axis zooms in or out around the most recent one.
- Touch reading: dragging a finger over the bars shows each one's value in the title.

## When not to use

- Use [`line-chart`](line-chart.md) for more than one series or when the shape of the trend matters more than each value.
- Use [`sparkline`](sparkline.md) for a compact trend next to a number, without axes.
- Use [`composition-chart`](composition-chart.md) for the parts of a whole; this chart shows a single measure and does not draw negative values.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import BarChart, { type BarChartDatum } from "@/components/ryan-ui/bar-chart/bar-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
const long = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function range(startIso: string, values: number[], weekly: boolean): BarChartDatum[] {
  return values.map((value, i) => {
    const d = new Date(day(startIso).getTime() + i * 86400000);
    return {
      key: d.toISOString().slice(0, 10),
      label: long.format(d),
      axisLabel: weekly ? "SMTWTFS"[d.getUTCDay()] : i % 5 === 0 ? short.format(d) : undefined,
      value,
    };
  });
}

const week = range("2026-09-15", [42, 67, 55, 81, 38, 24, 59], true);
const month = range("2026-08-23", [30, 44, 52, 61, 48, 22, 18, 39, 57, 63, 70, 51, 27, 20, 46, 58, 66, 49, 72, 33, 25, 41, 62, 68, 74, 55, 29, 21, 47, 64], false);

export default function BarChartDemo() {
  const [mode, setMode] = useState("week");
  return (
    <Stack gap={4} width={560}>
      <SegmentedControl label="Range" value={mode} onValueChange={setMode} options={[{ value: "week", label: "Week" }, { value: "month", label: "30 days" }]} />
      <Surface>
        <BarChart
          data={mode === "week" ? week : month}
          label="Active minutes"
          period={mode === "week" ? "Sep 15–21, 2026" : "Aug 23 – Sep 21, 2026"}
          unit="min"
        />
      </Surface>
      <Caption>Drag across the bars to scrub values. Switching the range morphs the bars and the average line.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BarChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `BarChartDatum[]` | — | — |
| `label` (required) | `string` | — | What is measured, such as "Active minutes". Names the chart for assistive technology. |
| `period` (required) | `string` | — | The range on show, such as "Sep 15–21, 2026". It rests under the headline. |
| `unit` | `string` | `""` | Unit after each value, such as "min". |
| `averageLabel` | `string` | `"Daily average"` | Headline label at rest, above the average. |
| `valueLabel` | `string` | `"Total"` | Headline label while a bar is scrubbed. |
| `categoryLabel` | `string` | `"Day"` | Header of the first column in the data table read by screen readers. |
| `showAverage` | `boolean` | `true` | Draws the average as a reference line that springs to each new range. |
| `height` | `number` | `176` | Plot height in pixels. |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | — |

### Exported types

#### `BarChartDatum`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity, such as an ISO date. A bar whose key survives a data change keeps its place, so switching ranges morphs instead of redrawing. |
| `label` (required) | `string` | Full label for the headline and screen readers, such as "Tue, Sep 15". |
| `axisLabel` | `string` | Short label under the bar, such as "T" or "Sep 14". Leave it out to keep the axis quiet. |
| `value` (required) | `number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves focus to the chart area, which behaves as a `slider`, and activates the most recent bar. |
| `←` or `↓` | Moves to the previous bar. |
| `→` or `↑` | Moves to the next bar. |
| `Page Up` or `Page Down` | Moves forward or back seven bars. |
| `Home` or `End` | Moves to the first or last bar. |
| `Esc` | Leaves reading mode: the title shows the average again. |

## Accessibility

- The reading area is a focusable `role="slider"` whose `aria-valuetext` states the label and value of the active bar; the SVG is an `img` with a summary of the average, highest, and lowest value.
- A hidden table lists every point for the screen reader, and an `aria-live` region announces the period and average when the data changes.
- `label` and `period` are required and name the chart; “Avg”, “Highest”, and “Lowest” are in English in the code, but `averageLabel`, `valueLabel`, and `categoryLabel` are yours.

## Motion

- The bars grow from the base, left to right, when the chart enters the screen, and the average line rises with them.
- On a new range, the time axis zooms in or out with a spring around the most recent bar: the bars that stay change height in place, those that leave sink to the base, and the average slides.
- With “reduce motion”, heights, scale, and cursor jump to the final value and the title texts only fade.

## Responsive behavior

- The chart measures its own width, and the axis labels thin out (every other one, and so on, counting from the most recent bar) so they do not touch.
- The reading layer uses `touch-action: pan-y`: dragging horizontally reads the bars and vertically keeps scrolling the page; the height is fixed at `height` (176 px by default).

## Performance

- Each bar is a `path` recalculated on every frame during transitions and takes 58% of its slice (at most 28 px): the component serves dozens of bars, not hundreds.

## Notes for AI

- Each point is `{ key, label, axisLabel?, value }`, from oldest to newest; the `key` must be stable (an ISO date) so the range swap transforms the bars instead of redrawing.
- The active bar is internal state: there is no prop or callback to read or control which one is being read.
- The title average is rounded to an integer before `formatValue`, and the default format has no decimal places: for fractional measures, pass the values in a smaller unit.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/bar-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
