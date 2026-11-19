# Metric card

> Um resumo compacto para um número que precisa de contexto.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/metric-card
- Original description: A compact summary for a number that needs context.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/metric-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/metric-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/metric-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/metric-card.json`. Registry path, relative to the site address: `r/metric-card.json`.

- npm packages: `motion`
- Uses other ryan-ui items (installed along with it): [Animated counter](animated-counter.md)
- Files, once installed:
  - `components/ryan-ui/metric-card/metric-card.tsx`
  - `components/ryan-ui/metric-card/metric-card.module.css`
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/metric-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Summary of indicators at the top of a dashboard: a number with a label, comparison context, and change.
- Numbers that change with a filter or period: the digits roll to the new value and the texts enter from the side the number moved toward.

## When not to use

- Use [`animated-counter`](animated-counter.md) when the animated number alone is enough, with no card, label, or context.
- Use [`stats-band`](stats-band.md) for highlight numbers on a marketing page.
- Use [`gauge`](gauge.md) or [`usage-meter`](usage-meter.md) when the value only makes sense against a range or a limit.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { MetricCard } from "@/components/ryan-ui/metric-card/metric-card";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";

const weeks = [
  { revenue: 48210, orders: 1284, sat: 94, rc: "+12.4%", oc: "+8.1%", cc: "+3 pts" },
  { revenue: 41930, orders: 1176, sat: 91, rc: "-13.0%", oc: "-8.4%", cc: "-3 pts" },
  { revenue: 55780, orders: 1391, sat: 97, rc: "+33.0%", oc: "+18.3%", cc: "+6 pts" },
];

export default function MetricCardDemo() {
  const [i, setI] = useState(0);
  const w = weeks[i] ?? weeks[0]!;
  return (
    <Stack gap={6} align="center" width={820}>
      <Row gap={4} justify="center" align="stretch">
        <div style={{ width: 240 }}><MetricCard label="Revenue (USD)" value={w.revenue} context="vs. previous week" change={w.rc} /></div>
        <div style={{ width: 240 }}><MetricCard label="Orders" value={w.orders} context="vs. previous week" change={w.oc} /></div>
        <div style={{ width: 240 }}><MetricCard label="Satisfaction" value={w.sat} suffix="%" context="vs. previous week" change={w.cc} /></div>
      </Row>
      <Button variant="secondary" onClick={() => setI((i + 1) % weeks.length)}>Show next week</Button>
      <Caption>Numbers roll and the change text slides in the direction the value moved.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MetricCard`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` (required) | `number` | — | — |
| `suffix` | `string` | — | — |
| `context` (required) | `string` | — | — |
| `change` | `string` | — | — |

## Accessibility

- The animated number is `aria-hidden` and the final formatted value goes in a hidden text, so the screen reader reads the correct number in one go.
- The card is an `<article>` with no heading of its own (the label is plain text): give the section that groups the cards a heading if the page needs that structure.
- The change is colored by sign, but the `+` or `-` itself in the text already conveys the direction, without relying on color alone.

## Motion

- The digits roll from zero the first time the number enters the viewport; after that, each column rolls in the direction the value changed.
- When `label`, `context`, or `change` change, the new text enters from below if its number rose or from above if it fell, and the change pill adjusts its width on a spring.
- With “reduced motion”, the digits jump to the value and the texts swap with a quick fade.

## Responsive behavior

- The card takes the parent's width; on screens up to 380 px the inner padding shrinks and the change pill may move to the line below.

## Notes for AI

- `value` is numeric and appears as an integer with a thousands separator in the `en-US` format: the card doesn't forward `decimals`, `prefix`, or `locale` to the counter, so put the currency in `label` and the unit in `suffix`.
- `label`, `value`, and `context` are required; `change` is free text: if it starts with `+` it turns green and with `-` red, with no way to invert for metrics where a drop is good.
- It needs the `animated-counter` item installed (the card imports it from `../animated-counter/animated-counter`); for a row of indicators, put the cards in a grid, since each one fills its own cell.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/metric-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
