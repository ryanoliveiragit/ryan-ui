# Candlestick chart

> Velas de abertura, máxima, mínima e fechamento, com mira que acompanha o cursor e mostra os valores de cada período.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/candlestick-chart
- Original description: OHLC candles with wicks in the status colors that grow in from left to right, with a crosshair that snaps to each candle and a tooltip of its open, high, low and close.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/candlestick-chart.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/candlestick-chart.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/candlestick-chart.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/candlestick-chart.json`. Registry path, relative to the site address: `r/candlestick-chart.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/candlestick-chart/candlestick-chart.tsx`
  - `components/ryan-ui/candlestick-chart/candlestick-chart.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/candlestick-chart.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Open, high, low, and close prices over a sequence of trading sessions or periods.
- Exact reading of a period: the crosshair snaps to each candle and the tooltip shows the four prices, the change, and the volume.
- Switch ranges (1 month, 3 months): candles with the same `key` slide to the new place.

## When not to use

- Use [`line-chart`](line-chart.md) when the close is enough or assets need to be compared.
- Use [`brush-chart`](brush-chart.md) for long histories that need zoom: here all the candles in `data` stay on screen.
- Use [`sparkline`](sparkline.md) for a compact trend next to a price.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import CandlestickChart, { type Candle } from "@/components/ryan-ui/candlestick-chart/candlestick-chart";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface, type DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

const long = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** A small seeded generator, so the sample prices are the same on every load. */
function seeded(seed: number) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
}

/** Sixty-six trading sessions ending Tue, Nov 10, 2026, walked from a fixed seed. */
function sessions(total: number): Candle[] {
  const next = seeded(2026), days: Date[] = [];
  for (let date = new Date(Date.UTC(2026, 10, 10)); days.length < total; date = new Date(date.getTime() - 86400000)) {
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) days.unshift(date);
  }
  let price = 162.4;
  return days.map((date, at) => {
    const open = price + (next() - .5) * 1.2;
    const drift = Math.sin(at / 9) * .9 + .18;
    const close = open + drift + (next() - .5) * 5.4;
    const high = Math.max(open, close) + next() * 2.2 + .15;
    const low = Math.min(open, close) - next() * 2.2 - .15;
    price = close;
    const round = (value: number) => Math.round(value * 100) / 100;
    return { key: date.toISOString().slice(0, 10), label: long.format(date), axisLabel: date.getUTCDay() === 1 ? short.format(date) : undefined, open: round(open), high: round(high), low: round(low), close: round(close), volume: Math.round((1.8 + next() * 2.6 + Math.abs(close - open) * .35) * 1e6) };
  });
}

const quarter = sessions(66);
const month = quarter.slice(-22);

export default function CandlestickChartDemo() {
  const [range, setRange] = useState("1m");
  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: "1m", label: "1 month" }, { value: "3m", label: "3 months" }]} />
      <Surface>
        <CandlestickChart data={range === "1m" ? month : quarter} label="Northwind Corp. (NWC)" period={range === "1m" ? "past month" : "past 3 months"} formatValue={(value) => `$${value.toFixed(2)}`} />
      </Surface>
      <Caption>Move across the plot for the crosshair and each session's open, high, low and close. The arrow keys step one candle at a time.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CandlestickChart`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `Candle[]` | — | Candles in time order, oldest first. |
| `label` (required) | `string` | — | What is priced, such as "Northwind Corp." Names the chart for assistive technology and heads the readout. |
| `period` | `string` | — | The range on show, such as "Last 30 sessions". It rests beside the change. |
| `height` | `number` | `240` | Plot height in pixels. |
| `formatValue` | `(value: number) => string` | `value => money.format(value)` | Formats prices on the axis, in the header and in the tooltip. |
| `formatVolume` | `(value: number) => string` | `value => compact.format(value)` | Formats the optional volume in the tooltip. |
| `hideHeader` | `boolean` | `false` | Hides the headline with the last price and the change over the range. |
| `activeIndex` | `number \| null` | — | Controlled index of the candle under the crosshair, or null for none. |
| `defaultActiveIndex` | `number \| null` | `null` | Candle under the crosshair on first render when uncontrolled. |
| `onActiveChange` | `(index: number \| null) => void` | — | Called when the crosshair moves to another candle or leaves the plot. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `Candle`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity, such as an ISO date. A candle whose key survives a data change slides to its new place instead of redrawing. |
| `label` (required) | `string` | Full label for the tooltip and screen readers, such as "Tue, Nov 10". |
| `axisLabel` | `string` | Short label under the candle, such as "Nov 10". Leave it out on most candles to keep the axis quiet. |
| `open` (required) | `number` | Price at the start of the period. |
| `high` (required) | `number` | Highest price of the period. |
| `low` (required) | `number` | Lowest price of the period. |
| `close` (required) | `number` | Price at the end of the period. |
| `volume` | `number` | Optional traded volume, shown in the tooltip. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves focus to the chart area and activates the most recent candle. |
| `←` or `↓` | Moves to the previous candle. |
| `→` or `↑` | Moves to the next candle. |
| `Page Up` or `Page Down` | Moves forward or back five candles. |
| `Home` or `End` | Moves to the first or last candle. |
| `Esc` | Removes the crosshair and closes the tooltip. |

## Accessibility

- The reading area is a `role="slider"` whose `aria-valuetext` carries the period label and the four prices; a hidden table lists all the candles.
- Up and down are distinguished by color only (`--success` and `--danger`); the sign of the change appears in the tooltip, not in the drawing.
- `label` is required; “Open”, “High”, “Low”, “Close”, and “Volume” are in English in the code.

## Motion

- On first appearance the candles grow from a line at body height, left to right; the last close line appears next.
- The vertical crosshair snaps to the candle and slides with a spring between them, with the tooltip alongside; the horizontal line follows the pointer or, by keyboard, rests on the close.
- With “reduce motion”, candles, grid, and crosshair appear and change without transition.

## Responsive behavior

- The width is the container's: each candle's body takes 62% of its slice, between 1.5 and 14 px, and the axis labels keep at least 58 px between them.
- The tooltip moves to the left of the candle when it does not fit on the right, and the reading layer uses `touch-action: pan-y` so the page keeps scrolling vertically.

## Performance

- Each candle is an animated `path` and the body never goes below 1.5 px: with more candles than the width can hold they overlap, so aggregate into larger periods.

## Notes for AI

- Each candle is `{ key, label, axisLabel?, open, high, low, close, volume? }`, from oldest to newest; set `axisLabel` on only some (every Monday, for example).
- The crosshair can be controlled with `activeIndex` and `onActiveChange`, useful for syncing with another chart; otherwise, use `defaultActiveIndex` or leave it free.
- `formatValue` formats the axis, title, and tooltip (the default has two decimal places and no currency symbol); the title's change is the last close minus the first open in `data`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/candlestick-chart · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
