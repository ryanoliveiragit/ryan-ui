# Brush chart

> Série temporal densa com faixa de visão geral: arraste a janela para dar zoom e leia eventos no próprio gráfico.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/brush-chart
- Original description: A dense time series with an overview strip: drag a window to zoom, resize it by its handles, and read events in place.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/brush-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/brush-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/brush-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/brush-chart.json`. Registry path, relative to the site address: `r/brush-chart.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/brush-chart/brush-chart.tsx`
  - `components/ryan-ui/brush-chart/brush-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/brush-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A long, dense time series where the user needs the whole history and a close look at any stretch.
- Mark events in the series (launches, price changes) with `annotations` and read each one on the chart itself.
- Sync the window with shortcuts or other panels, through `range` and `onRangeChange`.

## When not to use

- Use [`line-chart`](line-chart.md) to compare more than one series: here there is only one.
- Use [`bar-chart`](bar-chart.md) for a few periods compared one by one and against the average.
- Use [`sparkline`](sparkline.md) for a compact trend next to a number.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import BrushChart, { type BrushChartDatum, type BrushChartAnnotation } from "@/components/ryan-ui/brush-chart/brush-chart";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack, Surface } from "./_kit";

const DAY = 86400000;
const START = Date.UTC(2025, 9, 1);

function build(): BrushChartDatum[] {
  let s = 11;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  return Array.from({ length: 400 }, (_, i) => {
    const date = START + i * DAY;
    const dow = new Date(date).getUTCDay();
    const trend = 8200 + i * 18;
    const weekly = dow === 0 || dow === 6 ? -1400 : 600;
    const wave = Math.sin(i / 23) * 700;
    return { date, value: Math.round(trend + weekly + wave + (rand() - 0.5) * 900) };
  });
}

const annotations: BrushChartAnnotation[] = [
  { date: Date.UTC(2025, 11, 2), label: "v2 launch", description: "Redesigned onboarding shipped to everyone." },
  { date: Date.UTC(2026, 2, 10), label: "Pricing change", description: "Free tier limits lowered." },
  { date: Date.UTC(2026, 5, 18), label: "Mobile app", description: "iOS and Android apps released." },
];

export default function BrushChartDemo() {
  const data = useMemo(build, []);
  const [range, setRange] = useState<[number, number] | undefined>(undefined);
  const jump = (from: number, to: number) => setRange([from, to]);
  return (
    <Stack gap={4} width={820}>
      <Row>
        <Button size="sm" variant="secondary" onClick={() => jump(Date.UTC(2026, 2, 1), Date.UTC(2026, 3, 30))}>Spring 2026</Button>
        <Button size="sm" variant="secondary" onClick={() => jump(Date.UTC(2026, 4, 20), Date.UTC(2026, 6, 20))}>Around the app launch</Button>
        <Button size="sm" variant="ghost" onClick={() => jump(Number(data[0]?.date), Number(data[data.length - 1]?.date))}>Show all</Button>
      </Row>
      <Surface>
        <BrushChart
          data={data}
          label="Daily active users"
          unit="users"
          annotations={annotations}
          range={range}
          defaultRange={[Date.UTC(2026, 0, 1), Date.UTC(2026, 3, 15)]}
          onRangeChange={setRange}
        />
      </Surface>
      <Caption>Drag the window in the strip below to pan, pull its handles to zoom, or use the shortcuts to glide it.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BrushChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `BrushChartDatum[]` | — | — |
| `label` (required) | `string` | — | What is measured, such as "Daily active users". Names the chart for assistive technology. |
| `unit` | `string` | `""` | Unit after each value, such as "users". |
| `formatValue` | `(value: number) => string` | `value => grouped.format(value)` | — |
| `formatTick` | `(value: number) => string` | `value => compact.format(value)` | Formats the value axis. Defaults to a compact number, such as 12K. |
| `formatDate` | `(date: Date) => string` | `date => fullDate.format(date)` | Formats a date in the tooltip and announcements. |
| `annotations` | `BrushChartAnnotation[]` | `[]` | Events drawn as markers on both charts. |
| `range` | `[number, number]` | — | Controlled window as [start, end] epoch milliseconds. A new value glides the window there. |
| `defaultRange` | `[number, number]` | — | Initial window when uncontrolled. Defaults to the whole series. |
| `onRangeChange` | `(range: [number, number]) => void` | — | Called while the window is dragged, resized, stepped, or reset. |
| `minSpan` | `number` | `7 * DAY` | Smallest window in milliseconds. Defaults to seven days. |
| `height` | `number` | `240` | Main plot height in pixels. |
| `overviewHeight` | `number` | `52` | Overview strip height in pixels. |
| `emptyLabel` | `string` | `"No data yet"` | — |
| `ref` | `Ref<HTMLElement>` | — | — |
| `className` | `string` | — | — |

### Exported types

#### `BrushChartDatum`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `Date \| number` | A point in time, as a Date or epoch milliseconds. Points must be in ascending order. |
| `value` (required) | `number` | — |

#### `BrushChartAnnotation`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `Date \| number` | — |
| `label` (required) | `string` | Short label printed beside the marker, such as "v2 launch". |
| `description` | `string` | Longer note for the tooltip and screen readers. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Goes through four stops: the chart, the overview strip window, the start handle, and the end handle. |
| `←` or `→` or `Home` or `End` | On the chart, move the reading to the previous point, the next, the first, and the last visible point. |
| `←` or `→` or `↑` or `↓` | On the window, shift the range by 10% of its width; on a handle, move that edge one point; with `Shift`, the step becomes 50% or ten points. |
| `Page Up` or `Page Down` | On the chart, jump about one eighth of the visible points; on the window and handles, take the large step. |
| `+` or `-` | With focus on the window, zoom in (half the range) or out (double). |
| `Esc` or `0` | On the window or handles, return to the whole series; on the chart, `Esc` clears the reading. |

## Accessibility

- The chart is a focusable group that announces the date and value of the point being read in an `aria-live` region; a hidden table carries the points and events of the current window.
- The window and the two handles are `role="slider"` with `aria-valuetext` in dates, and each one is a `Tab` stop.
- `label` is required; the group instruction, the handle names, and the axis dates are in English in the code (`formatDate` only changes the tooltip and announcements).

## Motion

- The line draws from left to right the first time it appears; on zoom in, the value axis adjusts with a spring to the highest point in the window.
- The window follows the finger with no delay while dragging and slides with a spring when `range` changes externally or when it returns to the whole series; the tooltip follows the crosshair with a spring.
- With “reduce motion”, the line already appears whole, the window and axis jump to the destination, and the tooltip follows without a spring.

## Responsive behavior

- It measures its own width: date labels move from days to weeks, months, quarters, and years depending on space, and event labels that would collide are hidden.
- Chart and strip use `touch-action: pan-y`, so dragging vertically keeps scrolling the page; heights come from `height` (240) and `overviewHeight` (52), in pixels.

## Performance

- Above two points per pixel the line keeps only the minimum and maximum of each column; the hidden table, however, has one row per point in the window, so aggregate very long series before passing them.
- Keep `data` and `annotations` with a stable reference (`useMemo`): smoothing and the overview strip are recalculated whenever they change.

## Notes for AI

- `data` is `{ date, value }` with `date` as a `Date` or milliseconds, in ascending order; with fewer than two points `emptyLabel` appears, and the value axis always starts at zero.
- `range` is a target, not a lock: the window moves on its own while dragging and only slides when `range` changes, so keep what comes from `onRangeChange` in state; without `range`, use `defaultRange`.
- The component assumes one point per day: when zoomed out the line becomes a seven-point average with a band, and the tooltip compares with seven points earlier, calling it “a week earlier”.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/brush-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
