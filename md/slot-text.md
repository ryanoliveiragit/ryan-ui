# Slot text

> Textos e números que giram até o novo valor, como rolos de caça-níqueis.

- Type: component (category Special)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/slot-text
- Original description: Text and numbers that spin into their new value on staggered slot machine reels.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slot-text.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slot-text.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slot-text.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slot-text.json`. Registry path, relative to the site address: `r/slot-text.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/slot-text/slot-text.tsx`
  - `components/ryan-ui/slot-text/slot-text.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/slot-text.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Numbers that deserve a moment when they change: a new price, total visits, a score, the reveal of a number at a launch.
- Short words that swap as on an airport board, such as a city name in capitals, with the letters scrambling before stopping.

## When not to use

- Use [`animated-counter`](animated-counter.md) for dashboard totals that change often, with digits that roll like an odometer.
- Use [`text-morph`](text-morph.md) for state labels, such as “Follow” and “Following”, where shared letters should stay still.
- Use [`countdown`](countdown.md) for a countdown to a time: it handles the clock, the time zone, and the end.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import SlotText from "@/components/ryan-ui/slot-text/slot-text";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack } from "./_kit";

export default function SlotTextDemo() {
  const [visits, setVisits] = useState(12480);
  const [city, setCity] = useState(0);
  const cities = ["LISBON", "TOKYO", "AUSTIN", "BERLIN"];
  return (
    <Stack align="center" gap={6}>
      <div style={{ fontSize: "var(--text-4xl, 48px)", fontWeight: 600, color: "var(--text-primary)" }}><SlotText value={visits} /></div>
      <Row justify="center">
        <Button variant="secondary" onClick={() => setVisits(Math.floor(Math.random() * 90000) + 1000)}>Randomize visits</Button>
        <Button variant="ghost" onClick={() => setVisits(v => v + 999)}>Add 999</Button>
      </Row>
      <div style={{ fontSize: "var(--text-xl)", letterSpacing: "0.1em", color: "var(--text-secondary)" }}><SlotText value={cities[city]!} /></div>
      <Button size="sm" variant="secondary" onClick={() => setCity((city + 1) % cities.length)}>Next city</Button>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SlotText`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string \| number` | — | The value to show. Numbers pass through format; strings render as they are. |
| `format` | `(value: number) => string` | — | Formats a number value. Defaults to en-US grouping, so 12480 reads 12,480. |
| `duration` | `number` | `.9` | Seconds the first reel spins. Later reels add stagger. |
| `stagger` | `number` | `.07` | Seconds between reels stopping, left to right. |
| `spins` | `number` | `1` | Extra full turns a digit makes before it lands. 0 rolls straight to the new digit. |
| `align` | `"start" \| "end"` | — | Which end reels are matched from when the length changes. Numbers default to end, so 999 to 1,000 grows on the left. |
| `announce` | `boolean` | `false` | Announce new values politely to screen readers. |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

## Accessibility

- The wheels are `aria-hidden` and the final text sits in a hidden `span`, so the screen reader reads the correct value, never the spinning characters.
- With `announce`, each new value is announced with `aria-live="polite"`; without it, the change is silent.

## Motion

- Each character is a wheel: digits count in the direction the number changed, letters pass through random letters, and the wheels stop one after another, left to right, without overshooting the target.
- The faster the wheel spins, the more it blurs; each character's width follows with a spring, and new characters grow from zero.
- With “reduce motion”, the new value appears immediately, without spinning.

## Performance

- Each character builds a strip with all the spin stages (up to 20 cells per digit with `spins={1}`); use it on short values, not long texts.

## Notes for AI

- Import `SlotText` from `@/components/ryan-ui/slot-text/slot-text`. For numbers, pass a numeric `value` and a `format`, such as `v => v.toLocaleString("pt-BR")`; the default groups in en-US style (12,480).
- Keep currency symbols that start with a letter, such as “R$”, outside the component: with the letter at the start, when the number gains a digit the prefix changes wheel and spins.
- The size comes from the parent's font; for frequent changes, `spins={0}` and a smaller `duration` keep the spin short.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/slot-text · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
