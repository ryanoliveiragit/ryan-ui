# Sparkline

> Uma tendência compacta ao lado de um valor, com leitura ponto a ponto.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/sparkline
- Original description: Show a compact trend beside a value.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sparkline.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sparkline.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sparkline.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/sparkline.json`. Registry path, relative to the site address: `r/sparkline.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/sparkline/sparkline.tsx`
  - `components/ryan-ui/sparkline/sparkline.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/sparkline.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A compact trend with label, current value, and change in a single block, in dashboards with several indicators side by side.
- When the series' shape is enough, but the user may still want to read a point: the pointer or arrow keys show that point's value and label.
- Indicators that update: new data makes the line transform from the current drawing, even with a different number of points.

## When not to use

- Use [`line-chart`](line-chart.md) when the reader needs axes, several series, or a legend.
- Use [`metric-card`](metric-card.md) when the number, a line of context, and the change are enough, without the series.
- Inside a table cell or in the middle of text it doesn't work: the `label` always appears above the line and there is no prop to hide it.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Sparkline } from "@/components/ryan-ui/sparkline/sparkline";
import { Caption, Row, Stack, Surface } from "./_kit";

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 8 + i));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
});

const rows = [
  { label: "Revenue", data: [18, 21, 19, 24, 27, 26, 31, 29, 34, 38, 36, 41, 44, 47], value: "$47.2K", change: "+18.6%", tone: "success" as const, fmt: (v: number) => `$${v}.0K` },
  { label: "Churn", data: [2.1, 2.3, 2.2, 2.6, 2.5, 2.9, 3.1, 3.0, 3.4, 3.3, 3.6, 3.9, 3.8, 4.1], value: "4.1%", change: "+2.0 pts", tone: "danger" as const, fmt: (v: number) => `${v}%` },
  { label: "Latency p95", data: [310, 305, 320, 298, 290, 301, 288, 292, 280, 276, 284, 270, 266, 262], value: "262 ms", change: "-15.5%", tone: "accent" as const, fmt: (v: number) => `${v} ms` },
  { label: "Open tickets", data: [42, 40, 45, 51, 49, 55, 58, 54, 60, 57, 52, 49, 53, 56], value: "56", change: "+33%", tone: "warning" as const, fmt: (v: number) => `${v}` },
];

export default function SparklineDemo() {
  return (
    <Stack gap={4} align="center">
      <Surface width={520}>
        <Row gap={8} justify="center" align="start" style={{ rowGap: "var(--space-8)" }}>
          {rows.map((r) => (
            <Sparkline key={r.label} data={r.data} label={r.label} value={r.value} change={r.change} tone={r.tone} labels={days} formatValue={(v) => r.fmt(v)} width={212} height={60} />
          ))}
        </Row>
      </Surface>
      <Caption>Move the pointer or use the arrow keys along a line to scrub its points.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Sparkline`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `number[]` | — | — |
| `label` (required) | `string` | — | — |
| `value` | `string` | — | — |
| `change` | `string` | — | — |
| `tone` | `"accent" \| "success" \| "warning" \| "danger"` | `"accent"` | — |
| `width` | `number` | `160` | Preferred width of the chart in px; it shrinks to fit a narrower container. Default 160. |
| `height` | `number` | `52` | Height in px at the preferred width; the chart keeps this aspect ratio when it shrinks. Default 52. |
| `labels` | `string[]` | — | One label per point, such as a date. It replaces the change while that point is scrubbed. |
| `formatValue` | `(value: number, index: number) => string` | — | Formats a scrubbed point for the headline. Defaults to a grouped number. |
| `area` | `boolean` | `true` | A quiet neutral fill under the line. |
| `interactive` | `boolean` | `true` | Pointer and keyboard scrubbing through the points. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `↓` | With focus on the chart, go to the previous point and show its value in the header. |
| `→` or `↑` | Go to the next point. |
| `Page Up` or `Page Down` | Move forward or back about a sixth of the series. |
| `Home` or `End` | Go to the first or last point. |
| `Esc` | Ends the reading and returns to the most recent value. |

## Accessibility

- The `<figure>` has an `aria-label` built from `label`, `value`, and `change`, and the SVG is decorative.
- With `interactive` (default), the chart area is a focusable `role="slider"` whose `aria-valuetext` reads the point's label and formatted value; with `interactive={false}` there is no `Tab` stop.
- `tone` only changes the color: write sign and unit in `change` and pass `labels`, so each point is read with its date, not as `Point 3 of 14`.

## Motion

- When half of the component enters the viewport, the line draws from left to right, the fill follows the tip, and the end dot lands on the last value.
- While reading, the cursor springs to the point and runs along the line, the stretch after it fades, and the header texts roll digit by digit.
- With “reduced motion” on, the line appears ready, the data swap and the cursor jump, and the texts merely alternate.

## Responsive behavior

- `width` and `height` define only the aspect ratio and the first drawing: the chart takes the container's width, and in a flex row with no defined width it ends up at 300 px, the browser default for an SVG with no size.
- On touch, dragging horizontally scans the points and releasing ends the reading; the vertical gesture keeps scrolling the page.

## Performance

- Each instance creates up to three `ResizeObserver`s (the chart and the two rolling texts) and rewrites the SVG attributes on every frame while it draws, transforms, or follows the cursor.

## Notes for AI

- Pass `data` (numbers) and `label`; `value` and `change` are texts you already supply formatted, and `formatValue` formats the point shown during reading.
- Set the width via the parent (a grid column or a wrapper with a width): the `width` prop doesn't fix the on-screen size, only the aspect ratio together with `height`.
- When the chart is purely illustrative, `interactive={false}` removes the `Tab` stop and pointer reading, and `area={false}` removes the fill under the line.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/sparkline · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
