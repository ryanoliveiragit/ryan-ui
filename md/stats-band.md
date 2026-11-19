# Stats band

> Faixa de números que contam até o valor final, em layout simples ou em cartões.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/stats-band
- Original description: Headline numbers that count up in view, each with a tiny visual that proves it and a context line on hover, plain or in a hairline grid.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stats-band.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stats-band.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stats-band.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/stats-band.json`. Registry path, relative to the site address: `r/stats-band.json`.

- npm packages: `motion`
- Uses other ryan-ui items (installed along with it): [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/stats-band/stats-band.tsx`
  - `components/ryan-ui/blocks/stats-band/stats-band-data.ts`
  - `components/ryan-ui/blocks/stats-band/stats-band.module.css`
  - `components/ryan-ui/blocks/stats-band/stats-band-world.ts`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/stats-band.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Strip of three or four highlight numbers on a landing or corporate page, each with a minimal chart that backs it up: trend, availability, distribution, or map.
- When each number has a context line worth showing on demand, on hover or focus.

## When not to use

- Use [`metric-card`](metric-card.md) for a number with context in a dashboard; this strip is a page section and counts only once, when it enters the screen.
- Use [`animated-counter`](animated-counter.md) when you only need a number that animates between values.
- Use [`bar-chart`](bar-chart.md) or [`line-chart`](line-chart.md) when the chart is the main content and the person needs to read values from it.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import StatsBand from "@/components/ryan-ui/blocks/stats-band/stats-band";

export default function StatsBandDemo() {
  return <StatsBand />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `StatsBand`

A band of three or four headline numbers, each with an optional tiny visual that proves it: a trend, an uptime strip, a latency histogram, or a dotted world. The numbers count up in a staggered sequence the first time the band is in view, then the visuals draw in. Hovering or focusing a stat swaps its detail line for one line of context and gives its visual the accent. Numbers use tabular figures and reserve their final width; screen readers get final values.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stats` | `Stat[]` | `exampleStats` | Three or four stats read best. |
| `layout` | `"plain" \| "divided"` | `"plain"` | `plain` lets the stats float on whitespace; `divided` sets them in a hairline grid ruled above and below. |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `duration` | `number` | `1.6` | Seconds each number takes to count up. Defaults to 1.6. |
| `locale` | `string` | `"en-US"` | Number formatting locale. Fixed by default so server and client agree. |
| `className` | `string` | — | — |

### `StatsBandBlock`

Preview: the band in either layout. Switching layouts plays the sequence again.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `StatsBandLayout` | `"plain" \| "divided"` |
| `StatVisual`: A small visual that proves the number beside it. Every kind is optional; a stat without one is just the number. - `trend`: a sparkline of a series, oldest first, such as twelve monthly totals. - `uptime`: one bar per day as a percentage. Full days are full height; a day with downtime is visibly shorter. - `distribution`: a histogram of equal width bins across `0..max`, with the bars below `marker` (the median) inked. - `map`: a dotted world with a dot lit for each [longitude, latitude] point. | `\| { kind: "trend"; values: number[] } \| { kind: "uptime"; days: number[] } \| { kind: "distribution"; bins: number[]; max: number; marker: number } \| { kind: "map"; points: [number, number][] }` |

#### `Stat`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `number` | The final number. The band counts up to it. |
| `prefix` | `string` | Text before the number, such as "$". |
| `suffix` | `string` | Text after the number, such as "%", "ms", or "+". |
| `decimals` | `number` | Digits after the decimal point. Defaults to 0. |
| `notation` | `"standard" \| "compact"` | `compact` shortens large numbers to 2.3M or 12K. The unit renders like a suffix. Defaults to `standard`. |
| `label` (required) | `string` | — |
| `detail` | `string` | One short supporting line under the number. |
| `context` | `string` | One line of context that replaces the detail while the stat is hovered or focused, such as "Up from 41% last year". |
| `visual` | `StatVisual` | A tiny chart that draws in after the number lands. |

### Other exports

- `stats` (value)
- `WORLD` (value)
- `worldLand` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Reaches each number that has `context`; with focus, the detail line gives way to the context line and the visual takes the accent color. |

## Accessibility

- Screen readers receive only the final value of each number, in hidden text; the animated count and the visuals are `aria-hidden`, so put in `detail` or `context` what the chart shows.
- The strip is a `<section>` named by `title` (or “Key numbers”) and the numbers form a `<dl>`; `detail` and `context` both stay in the DOM, so both are read.
- A number with `context` receives `tabIndex=0`, but the focus outline is removed: focus shows only through the line swap and the visual's color.

## Motion

- The first time 40% of the list enters the screen, the numbers rise in sequence (90 ms apart) and count from zero to the value in 1.6 s (`duration`); compact numbers count already in the final unit, from 0.0M to 2.3M.
- When each number is almost at its value, the visual draws itself: line and map reveal from left to right, the bars grow in a wave and, in `divided`, the thin lines run across the strip and between the numbers.
- With “reduce motion” on (read after hydration, with CSS covering the first paint), the numbers already appear at their final value and visuals and lines are ready, with no transition.

## Responsive behavior

- The strip's container queries: up to 800 px the numbers go two by two and a strip of three stacks into one column; up to 520 px it goes one per row, with the visual beside the number.
- The final width of each number is reserved from the start, so the count never pushes the layout.

## Performance

- The count writes directly to the number's `textContent` on every frame, without re-rendering React, and `useInView` with `once` fires only once.
- The `map` visual draws about 760 SVG circles, one per land point of the 80 × 30 grid, and is the heaviest of the four.

## Notes for AI

- Import the named component `StatsBand`; the default export is `StatsBandBlock`, the preview with layout switching, and `stats` uses the example data from `stats-band-data.ts`.
- Each `Stat` takes `value`, `label` and, if you want, `prefix`, `suffix`, `decimals`, `notation: "compact"`, `detail`, `context`, and `visual` (`trend`, `uptime`, `distribution`, or `map`); the grid goes up to 4 columns.
- `locale` is `en-US` by default so server and client format the same; use `pt-BR` for a decimal comma, and change the `key` to play the count again.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/stats-band · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
