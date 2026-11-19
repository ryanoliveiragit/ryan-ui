# Animated counter

> Totais que mudam com movimento claro, dígito por dígito.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/animated-counter
- Original description: Give changing totals a clear sense of movement.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-counter.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-counter.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-counter.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-counter.json`. Registry path, relative to the site address: `r/animated-counter.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/animated-counter.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Dashboard totals that change with the period or filter: each digit spins like an odometer in the direction the number moved.
- Highlight numbers that count up from zero when they enter the screen, with `animateOnView`.
- Values with currency, percentage, or decimal places, via `prefix`, `suffix`, and `decimals`.

## When not to use

- Use [`metric-card`](metric-card.md) when the number needs a label, context, and change in a ready-made card.
- Use [`slot-text`](slot-text.md) when the value mixes letters and numbers or the swap should look like a slot machine.
- Use [`countdown`](countdown.md) for a countdown to a date.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { AnimatedCounter } from "@/components/ryan-ui/animated-counter/animated-counter";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";

const steps = [
  { users: 12480, revenue: 48210.5, uptime: 99.94 },
  { users: 13912, revenue: 52874.25, uptime: 99.98 },
  { users: 9275, revenue: 39130.75, uptime: 99.71 },
  { users: 18340, revenue: 71906.0, uptime: 100 },
];

const big = { fontSize: "var(--text-2xl, 2rem)", fontWeight: 600 } as const;

export default function AnimatedCounterDemo() {
  const [i, setI] = useState(0);
  const s = steps[i] ?? steps[0]!;
  return (
    <Stack gap={8} align="center">
      <Row gap={10} justify="center" align="start">
        <div style={big}><AnimatedCounter label="Active users" value={s.users} /></div>
        <div style={big}><AnimatedCounter label="Monthly revenue" value={s.revenue} prefix="$" decimals={2} /></div>
        <div style={big}><AnimatedCounter label="Uptime" value={s.uptime} suffix="%" decimals={2} /></div>
      </Row>
      <Button variant="secondary" onClick={() => setI((i + 1) % steps.length)}>Load next period</Button>
      <Caption>Each digit rolls to its new place. Period {i + 1} of {steps.length}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AnimatedCounter`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number` | — | — |
| `label` | `string` | — | — |
| `prefix` | `string` | `""` | — |
| `suffix` | `string` | `""` | — |
| `decimals` | `number` | `0` | — |
| `animateOnView` | `boolean` | `false` | Roll every digit up from zero the first time the counter scrolls into view. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same digits. |

## Accessibility

- The animated digits are `aria-hidden`; the screen reader receives a hidden text with the already formatted number, including `prefix` and `suffix`.
- There is no live region: if the value change needs to be announced, wrap the counter in an element with `aria-live`.
- The visible digits have `user-select: none`, so the number cannot be selected for copying.

## Motion

- Each digit is a 0 to 9 wheel that spins with a no-overshoot spring in the direction of the change (upward when the value grows), going from 9 to 0 like an odometer.
- When the number gains or loses places, the columns open or close in width; with `animateOnView`, the digits rise from zero in a cascade when 60% of the counter is visible.
- With “reduce motion”, the digits change immediately and the label only fades.

## Performance

- Each digit mounts ten animated glyphs (a seven-digit number is 70 elements), so use it on a few highlights per screen, not on every row of a table.

## Notes for AI

- `value` must be a `number`; formatting uses `locale` (default `en-US`, fixed so server and client render the same), so pass `locale="pt-BR"` for a dot thousands separator and a decimal comma.
- It accepts neither `className` nor `style`, and the size comes from `--text-3xl` on the component itself: a `font-size` on the parent element changes nothing; redefine that variable on a surrounding element.
- Just change `value` to animate; do not change the component's `key`, otherwise it remounts already at the new value, without spinning.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/animated-counter · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
