# Volume profile

> Histograma horizontal do volume em cada faixa de preço, ao lado da linha de preço, com o ponto de controle em destaque.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/volume-profile
- Original description: Horizontal histogram of volume by price level beside a price line: bars grow outward from the point of control, which is highlighted along with the value area.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/volume-profile.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/volume-profile.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/volume-profile.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/volume-profile.json`. Registry path, relative to the site address: `r/volume-profile.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/volume-profile/volume-profile.tsx`
  - `components/ryan-ui/volume-profile/volume-profile.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/volume-profile.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showing at which prices trading concentrated in a session or a few sessions, alongside how the price moved over time.
- Highlighting the point of control, the level with the most volume, and the value area, which by default gathers 70% of the volume around it.
- Reading each price band with its volume, share of the total, and position relative to the value area, by pointer or arrow keys.

## When not to use

- Use [`candlestick-chart`](candlestick-chart.md) when the focus is the open, high, low, and close of each period.
- Use [`order-book`](order-book.md) for the depth of open buy and sell orders, not for what has already traded.
- Use [`bar-chart`](bar-chart.md) for volume per period, such as per day or per hour; here volume is grouped by price.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import VolumeProfile, { type VolumePoint } from "@/components/ryan-ui/volume-profile/volume-profile";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack, Surface, type DemoStage } from "./_kit";

export const stage: DemoStage = { height: 580 };

const stamp = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" });
const clock = new Intl.DateTimeFormat("en-US", { hour: "numeric", timeZone: "UTC" });
const dayName = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/** A small seeded generator, so the sample trades are the same on every load. */
function seeded(seed: number) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; };
}

/** One session from 9:30 in equal steps. The price is pulled back toward an anchor, and volume is heavier at the open and the close. */
function session(next: () => number, day: number, start: number, anchor: number, points: number, minutes: number, swing: number, hourMarks: boolean): VolumePoint[] {
  let price = start;
  return Array.from({ length: points }, (_, at) => {
    const time = new Date(Date.UTC(2026, 10, day, 9, 30 + at * minutes));
    price += (anchor - price) * .09 + (next() - .5) * swing;
    const edge = Math.abs(at / (points - 1) - .5) * 2;
    const firstOfDay = at === 0;
    return {
      key: time.toISOString(),
      label: stamp.format(time),
      axisLabel: hourMarks ? (time.getUTCMinutes() === 0 && time.getUTCHours() % 2 === 0 ? clock.format(time) : undefined) : firstOfDay ? dayName.format(time) : undefined,
      price: Math.round(price * 100) / 100,
      volume: Math.round((38000 + edge * edge * 64000) * (.6 + next() * .8) * (minutes / 5)),
    };
  });
}

const todayRandom = seeded(77);
const today = session(todayRandom, 10, 196.9, 198.7, 78, 5, 1.1, true);
const daysRandom = seeded(41);
const threeDays = [
  ...session(daysRandom, 6, 191.6, 193.4, 26, 15, 1.7, false),
  ...session(daysRandom, 9, 194.2, 196.3, 26, 15, 1.7, false),
  ...session(daysRandom, 10, 196.9, 198.7, 26, 15, 1.7, false),
];

export default function VolumeProfileDemo() {
  const [range, setRange] = useState("today");
  return (
    <Stack gap={4} width={600}>
      <SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: "today", label: "Today" }, { value: "days", label: "3 sessions" }]} />
      <Surface>
        <VolumeProfile data={range === "today" ? today : threeDays} label="Northwind Corp. (NWC)" formatPrice={(value) => `$${value.toFixed(2)}`} />
      </Surface>
      <Caption>Each bar is the volume traded at that price. The brightest bar is the point of control; hover a level or use the arrow keys to read it.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `VolumeProfile`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `VolumePoint[]` | — | Trades or intervals in time order, oldest first. |
| `label` (required) | `string` | — | What is traded, such as "Northwind Corp." Names the chart for assistive technology and heads the readout. |
| `levels` | `number` | `16` | Number of price levels the range is split into. |
| `valueArea` | `number` | `.7` | Share of the total volume that defines the value area around the point of control, from 0 to 1. |
| `height` | `number` | `260` | Plot height in pixels. |
| `formatPrice` | `(value: number) => string` | `value => money.format(value)` | Formats prices on the axis, in the header and in the tooltip. |
| `formatVolume` | `(value: number) => string` | `value => compact.format(value)` | Formats volumes in the header and in the tooltip. |
| `hideHeader` | `boolean` | `false` | Hides the headline with the point of control and the value area. |
| `activeLevel` | `number \| null` | — | Controlled index of the price level in focus, counted from the lowest price, or null for none. |
| `defaultActiveLevel` | `number \| null` | `null` | Price level in focus on first render when uncontrolled. |
| `onActiveChange` | `(level: number \| null) => void` | — | Called when hover, touch or the keyboard moves to another price level, or leaves the plot. |
| `className` | `string` | — | Extra class on the root figure. |

### Exported types

#### `VolumePoint`

| Field | Type | Description |
| --- | --- | --- |
| `key` (required) | `string` | Stable identity, such as an ISO timestamp. |
| `label` (required) | `string` | Full label for screen readers, such as "Nov 10, 10:35". |
| `axisLabel` | `string` | Short label under the price line, such as "10:00". Leave it out on most points to keep the axis quiet. |
| `price` (required) | `number` | Price traded in this interval. |
| `volume` (required) | `number` | Volume traded in this interval. It is added to the price level the price falls in. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `→` | With focus on the chart, move up to the next price band. |
| `↓` or `←` | Move down to the previous band. |
| `Page Up` or `Page Down` | Move up or down four bands. |
| `Home` or `End` | Go to the lowest or highest price band. |
| `Esc` | Ends the reading and hides the tooltip. |

## Accessibility

- The chart is a vertical `role="slider"`: on receiving focus by keyboard it starts at the point of control, and `aria-valuetext` reads the band, the volume, the share of the total, and whether it is in the value area.
- The `<figure>` has a hidden caption and a hidden table with all bands, from highest to lowest, with volume and share; the SVG, header, and tooltip are hidden from screen readers.
- The read-out phrases and the header (`point of control`, `Inside the value area`, `Value area`) are hardcoded in English; `formatPrice` and `formatVolume` change only the numbers.

## Motion

- On entering the viewport, the bars grow from the axis, starting at the point of control and spreading to the farthest levels, while the price line draws from left to right.
- After that, new data doesn't repeat the entrance: bars, line, and the point-of-control mark glide on a spring, and a series with a different number of points redraws the line from the start.
- With “reduced motion” on, everything appears in its final state, and the highlighted band and the tooltip jump from one level to the next.

## Responsive behavior

- The width follows the container: the histogram takes 32% of it (between 64 and 190 px), the price line takes the rest, and a fixed 62 px column on the right holds the prices; the height is `height` (260 px).
- On touch, tapping at a height reads that band; dragging vertically scrolls the page and ends the reading.

## Performance

- The price line is rebuilt on every render, including when the pointer changes band; with thousands of trades, aggregate into intervals first, as the demo does with 5 and 15 minutes.

## Notes for AI

- Pass `data` in time order with `{ key, label, price, volume }` and `axisLabel` on only some points; each point adds its volume to the band the price falls in, and `levels` (16) sets how many bands there are.
- `valueArea` (0.7) is the fraction of volume that forms the value area; `formatPrice` and `formatVolume` format the axis, header, and tooltip, and `hideHeader` hides the title with the point of control.
- `activeLevel` with `onActiveChange` controls the band being read, counted from the lowest price (0), or `null` for none; without control, `defaultActiveLevel` sets the initial one.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/volume-profile · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
