# Price target fan

> Histórico de preço que se abre em leque até os alvos alto, mediano e baixo, cada um com rótulo e variação.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/price-target-fan
- Original description: A price history line that draws to the last close and fans out into dashed high, median and low target lines with labeled end points you can bring forward.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/price-target-fan.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/price-target-fan.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/price-target-fan.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/price-target-fan.json`. Registry path, relative to the site address: `r/price-target-fan.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/price-target-fan/price-target-fan.tsx`
  - `components/ryan-ui/price-target-fan/price-target-fan.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/price-target-fan.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An asset page that shows, on the same chart, the closing-price history and analyst targets (high, median, and low) for a future date.
- When the reader compares scenarios: hovering or focusing a label brings that target to the front, and a click keeps it highlighted.
- When the distance from the last close matters: each label shows the target price and the percentage change relative to it.

## When not to use

- Use [`line-chart`](line-chart.md) when there is only history, with no targets, or several series to compare.
- Use [`candlestick-chart`](candlestick-chart.md) when the reader needs the open, high, low, and close of each period.
- Projections with more or fewer than three scenarios don't fit: the component takes exactly `high`, `median`, and `low`.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useMemo, useState } from "react";
import PriceTargetFan, { type PricePoint, type PriceTargetKey, type PriceTargets } from "@/components/ryan-ui/price-target-fan/price-target-fan";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface } from "./_kit";

/** Small seeded generator: the same seed always draws the same history, so the demo never changes between visits. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

/** Eighteen months of weekly closes ending November 10, 2026, walking from `from` to `to` with some weather on the way. */
function closes(seed: number, from: number, to: number, swing: number): PricePoint[] {
  const rand = seeded(seed);
  const weeks = 78;
  const last = Date.UTC(2026, 10, 10);
  let drift = 0;
  return Array.from({ length: weeks }, (_, index) => {
    const progress = index / (weeks - 1);
    drift = (drift + (rand() - 0.5) * swing) * 0.9;
    const wave = Math.sin(progress * Math.PI * 3 + seed) * swing * 0.9 * Math.sin(progress * Math.PI);
    const value = from + (to - from) * progress + (drift + wave) * (1 - progress ** 6);
    return { date: new Date(last - (weeks - 1 - index) * 7 * 86_400_000).toISOString().slice(0, 10), value: Math.round(value * 100) / 100 };
  });
}

const companies: Record<string, { name: string; analysts: number; history: PricePoint[]; targets: PriceTargets }> = {
  nwd: { name: "Northwind Robotics", analysts: 34, history: closes(5, 118, 197.2, 16), targets: { high: 262, median: 228, low: 168 } },
  hlx: { name: "Helix Biologics", analysts: 19, history: closes(17, 92, 64.4, 9), targets: { high: 96, median: 71, low: 48 } },
};

const notes: Record<PriceTargetKey, string> = {
  high: "The most optimistic desk assumes the new product line ships on time and margins keep widening.",
  median: "Half of the covering analysts sit above this price and half below.",
  low: "The most cautious desk expects slower demand and a lower multiple.",
};

export default function PriceTargetFanDemo() {
  const [ticker, setTicker] = useState("nwd");
  const [target, setTarget] = useState<PriceTargetKey | null>(null);
  const company = companies[ticker]!;
  const label = useMemo(() => `${company.name} weekly closes and 12-month analyst targets`, [company]);

  return (
    <Stack gap={4} width={680}>
      <SegmentedControl label="Company" value={ticker} onValueChange={setTicker} options={[{ value: "nwd", label: "Northwind" }, { value: "hlx", label: "Helix" }]} />
      <Surface>
        <PriceTargetFan label={label} history={company.history} targets={company.targets} targetDate="2027-11-10" activeTarget={target} onActiveTargetChange={setTarget} />
      </Surface>
      <Caption>
        {target ? notes[target] : `${company.name}, weekly closes with targets from ${company.analysts} analysts. Hover a target to bring it forward, click to keep it, or scrub the history.`}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PriceTargetFan`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `history` (required) | `PricePoint[]` | — | Price history, one point per close. Any order: the chart sorts by date. |
| `targets` (required) | `PriceTargets` | — | The three targets at the end of the horizon. |
| `label` (required) | `string` | — | Accessible name of the chart, such as "Northwind price and 12-month analyst targets". |
| `targetDate` | `string` | — | Day the targets refer to, as YYYY-MM-DD. Defaults to one year after the last close. |
| `currency` | `string` | `"USD"` | Currency code used by the default price format. |
| `formatValue` | `(value: number) => string` | — | Formats a price. Defaults to the currency format of the locale. |
| `height` | `number` | `300` | Height of the chart in px, time axis included. |
| `activeTarget` | `PriceTargetKey \| null` | — | Scenario brought forward, or null for none. Leave undefined to let the chart keep its own. |
| `defaultActiveTarget` | `PriceTargetKey \| null` | `null` | Scenario brought forward at first when the chart keeps its own. |
| `onActiveTargetChange` | `(target: PriceTargetKey \| null) => void` | — | Called when a target label is clicked: with its key, or null when the active one is clicked again. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same labels. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `PriceTargetKey` | `"high" \| "median" \| "low"` |

#### `PricePoint`

| Field | Type | Description |
| --- | --- | --- |
| `date` (required) | `string` | Day of the close as YYYY-MM-DD. |
| `value` (required) | `number` | Closing price. |

#### `PriceTargets`

| Field | Type | Description |
| --- | --- | --- |
| `high` (required) | `number` | Most optimistic target. |
| `median` (required) | `number` | Median of the targets. |
| `low` (required) | `number` | Most cautious target. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `↓` | With focus on the history, steps back one close and shows the date and price in the tooltip. |
| `→` or `↑` | Steps forward one close. |
| `Page Up` or `Page Down` | Move forward or back ten closes. |
| `Home` or `End` | Go to the first or last close. |
| `Enter` or `Space` | On a target label, pin that scenario as highlighted; press again to release. |
| `Esc` | Closes the history tooltip. |

## Accessibility

- The SVG has `role="img"` with the `label` and a hidden summary (last close and the three targets); the history is a `role="slider"` whose `aria-valuetext` reads the date and price.
- Each target is a `<button>` with `aria-pressed`, named with price and change; the highlighted target in the header sits in an `aria-live="polite"` region.
- The fixed texts (`Last close`, `Today`, `High`, `Median`, `Low`) and the screen-reader names are in English, with no translation prop; `locale` only changes numbers and dates.

## Motion

- On entering the viewport, the history line draws up to the last close; then the cone and the three dashed lines spring open from it and the labels appear in sequence.
- A ring pulses continuously on the last close; the crosshair and tooltip glide on a spring between closes, and new `targets` make the fan glide to the new values.
- With “reduced motion” on, everything appears in its final state, the pulse is turned off, and the crosshair jumps from one point to the next.

## Responsive behavior

- The width follows the container and the height is fixed by `height` (300 px by default); the label column on the right reserves at least 72 px.
- On touch, dragging horizontally scans the history and the vertical gesture keeps scrolling the page; below 400 px of container width the header numbers shrink.

## Notes for AI

- Pass `history` (`{ date: "YYYY-MM-DD", value }`), `targets` (`{ high, median, low }`), and `label`; without `targetDate`, the horizon is one year after the last close.
- Keep `history` referentially stable (a constant or `useMemo`): a new array on every render makes the line redraw each time.
- `activeTarget` with `onActiveTargetChange` controls the pinned scenario (`null` = none); for values in reais, pass `currency="BRL"` and `locale="pt-BR"`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/price-target-fan · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
