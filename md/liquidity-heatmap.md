# Liquidity heatmap

> Mapa de calor da liquidez por preço e horário, com legenda em degraus e leitura da célula sob o cursor.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/liquidity-heatmap
- Original description: A price by time grid tinted by resting size, with columns that sweep in, a traded price line, a crosshair that glides to the cell being read, and a stepped legend.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/liquidity-heatmap.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/liquidity-heatmap.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/liquidity-heatmap.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/liquidity-heatmap.json`. Registry path, relative to the site address: `r/liquidity-heatmap.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/liquidity-heatmap/liquidity-heatmap.tsx`
  - `components/ryan-ui/liquidity-heatmap/liquidity-heatmap.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/liquidity-heatmap.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Trading screens that show how resting liquidity was distributed by price over time.
- Finding order walls and seeing where they sit relative to the traded price, drawn as a line over the grid (`path`).

## When not to use

- Use [`order-book`](order-book.md) to see the current buy and sell offers, with cumulative depth and spread.
- Use [`volume-profile`](volume-profile.md) for volume traded per price level, in a histogram beside the price line.
- Use [`activity-heatmap`](activity-heatmap.md) for per-day activity on a calendar; here the axes are always time and price.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import LiquidityHeatmap from "@/components/ryan-ui/liquidity-heatmap/liquidity-heatmap";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

/** Small seeded generator: the same seed always draws the same book, so the demo never changes between visits. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

const COLS = 48, ROWS = 24;

/** Four hours of resting orders in five-minute buckets: a wandering price, a thin background and a few large walls that vanish once the price trades through them. */
function book(seed: number, mid: number, tick: number, depth: number) {
  const rand = seeded(seed);
  const prices = Array.from({ length: ROWS }, (_, row) => mid + (row - ROWS / 2) * tick);
  const times = Array.from({ length: COLS }, (_, col) => { const minutes = 9 * 60 + col * 5; return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; });
  const rows: number[] = [];
  let level = ROWS / 2 - 3;
  for (let col = 0; col < COLS; col++) {
    const trend = Math.sin(col / 7.5 + seed) * .55 + .12;
    level = Math.min(ROWS - 4, Math.max(3, level + trend + (rand() - .5) * 1.5));
    rows.push(level);
  }
  const walls = Array.from({ length: 7 }, () => ({ row: 1 + Math.floor(rand() * (ROWS - 2)), from: Math.floor(rand() * 26), length: 12 + Math.floor(rand() * 26), size: depth * (.5 + rand() * .5) }));
  const values = Array.from({ length: COLS }, (_, col) => Array.from({ length: ROWS }, (_, row) => {
    const distance = Math.abs(row - rows[col]!);
    if (distance < .8) return 0;
    let size = depth * (.01 + rand() * .15) * Math.min(1, distance / 5);
    for (const wall of walls) {
      if (wall.row !== row || col < wall.from || col >= wall.from + wall.length) continue;
      const traded = rows.slice(wall.from, col + 1).some((at, index, list) => index > 0 && (at - row) * (list[index - 1]! - row) <= 0);
      if (!traded) size += wall.size * Math.min(1, (col - wall.from + 1) / 3) * (.85 + rand() * .15);
    }
    return Math.round(size * 10) / 10;
  }));
  return { times, prices, values, path: rows.map(row => Math.round((mid + (row - ROWS / 2) * tick) * 10) / 10) };
}

const markets = {
  btc: { name: "BTC-USD", unit: "BTC", ...book(11, 64_200, 25, 180) },
  eth: { name: "ETH-USD", unit: "ETH", ...book(29, 3_420, 2, 2400) },
};

export default function LiquidityHeatmapDemo() {
  const [market, setMarket] = useState<keyof typeof markets>("btc");
  const [cell, setCell] = useState<{ time: string; price: number; value: number } | null>(null);
  const data = markets[market];
  const largest = useMemo(() => {
    let best = { value: 0, price: 0, time: "" };
    data.values.forEach((column, col) => column.forEach((value, row) => { if (value > best.value) best = { value, price: data.prices[row]!, time: data.times[col]! }; }));
    return best;
  }, [data]);

  return (
    <Stack gap={4} width={720}>
      <SegmentedControl label="Market" value={market} onValueChange={value => setMarket(value as keyof typeof markets)}
        options={[{ value: "btc", label: "BTC-USD" }, { value: "eth", label: "ETH-USD" }]} />
      <Surface>
        <LiquidityHeatmap label={`${data.name} resting liquidity, 09:00 to 13:00`} times={data.times} prices={data.prices} values={data.values} path={data.path} unit={data.unit} onCellChange={setCell} />
      </Surface>
      <Caption>
        {cell
          ? `${cell.value.toLocaleString("en-US")} ${data.unit} waiting at ${cell.price.toLocaleString("en-US")} at ${cell.time}.`
          : `Largest wall: ${largest.value.toLocaleString("en-US")} ${data.unit} at ${largest.price.toLocaleString("en-US")}, ${largest.time}. Move over the grid or focus it and use the arrow keys.`}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `LiquidityHeatmap`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `times` (required) | `string[]` | — | Label of each time bucket, oldest first. One column per entry. |
| `prices` (required) | `number[]` | — | Price of each level, evenly spaced. Any order: the chart draws the highest price at the top. |
| `values` (required) | `number[][]` | — | Size resting in each cell, as `values[timeIndex][priceIndex]`. Missing cells count as zero. |
| `path` | `number[]` | — | Traded price at each time bucket, drawn as a line over the grid. |
| `label` (required) | `string` | — | Accessible name of the chart, such as "BTC-USD resting liquidity, last four hours". |
| `unit` | `string` | `""` | Unit written after a size, such as "BTC". |
| `formatPrice` | `(price: number) => string` | — | Formats a price for the axis and the readout. |
| `formatValue` | `(value: number) => string` | — | Formats a size for the readout and the legend. |
| `max` | `number` | — | Size at which the color saturates. Defaults to the largest size in the data. |
| `height` | `number` | `268` | Height of the plot in px, time axis included. |
| `onCellChange` | `(cell: { time: string; price: number; value: number } \| null) => void` | — | Called when the cell under the pointer or the keyboard changes; null when the chart goes back to the latest column. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same labels. |
| `className` | `string` | — | Extra class for the root element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move the readout one time column back or forward. |
| `↑` or `↓` | Go up or down one price level. |
| `Page Up` or `Page Down` | Go up or down four price levels. |
| `Home` or `End` | Go to the first and last column, at the same price. |
| `Esc` | Releases the cell and returns to the readout of the most recent column. |

## Accessibility

- The chart is a focusable `role="application"`, described as “heatmap”, with a hidden usage hint; each keyboard movement announces time, price, and size in a `role="status"` region.
- The SVG is `aria-hidden` and there is no alternative table: values are read cell by cell by keyboard, and the summary above the grid shows time, price, and size of the cell being read.
- `label` is required; the interface labels (“Latest”, “Resting size”, “Traded price”) are hardcoded in English, and `locale` only changes the number format.

## Motion

- When 30% of the chart enters the viewport, the columns appear from left to right, rising 8 px, and then the traded price line draws over them.
- With new data, cells change color in the same sweep; the bands and the crosshair ring slide on a spring to the cell being read, and the legend marker follows the color step.
- With “reduced motion”, the grid and the line appear ready and the crosshair jumps from cell to cell.

## Responsive behavior

- The chart measures its own width and draws in real pixels; the height is the `height` prop (268 px, time axis included), and the price strip on the right adjusts to the longest label.
- Axis labels thin out as cells shrink, and in containers up to 400 px the summary and legend become more compact.

## Performance

- Each cell is a `<rect>` in the SVG (columns × levels; the demo uses 48 × 24 = 1,152): the grid is memoized while reading with the cursor, but is rebuilt on every data or width change.

## Notes for AI

- `values` is indexed as `values[tempo][preço]`, aligned with `times` and `prices`; prices can come in any order, but must be evenly spaced.
- Fix `max` when the data updates, otherwise the color scale is recomputed from the largest value of each set; `path` is optional and carries the traded price of each column.
- Pass memoized arrays: the model is recomputed whenever `times`, `prices`, or `values` change identity; `onCellChange` receives the cell being read or `null` when the reading returns to rest.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/liquidity-heatmap · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
