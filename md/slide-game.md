# Slide game

> Uma faixa de multiplicadores dispara, desacelera e para sob o marcador central: o valor sorteado multiplica a aposta de mentirinha.

- Type: component (category Games), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/slide-game
- Original description: A play-money slide game: a strip of multiplier tiles shoots past a center marker, decelerates and stops on the multiplier that pays the bet.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slide-game.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slide-game.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slide-game.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/slide-game.json`. Registry path, relative to the site address: `r/slide-game.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/slide-game/slide-game.tsx`
  - `components/ryan-ui/slide-game/slide-game.module.css`
  - `components/ryan-ui/slide-game/play-money.tsx`
  - `components/ryan-ui/slide-game/play-money.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/slide-game.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Demos or game areas with a play-money balance where a bet makes a strip of multipliers run and stop on its own.
- When the odds should be on display: the list below the strip gives the percentage of each multiplier, computed from the weights.
- Configurable draws: `tiles` defines the multipliers and the weight of each.

## When not to use

- Do not use with real money or prizes: the balance is play money and the result is drawn in the browser with `random`.
- Use [`crash-game`](crash-game.md) or [`mines-game`](mines-game.md) when the person should decide during the round.
- Use [`plinko-game`](plinko-game.md) when several bets should run at the same time, with a risk the person chooses.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { SlideGame } from "@/components/ryan-ui/slide-game/slide-game";
import type { SlideRound } from "@/components/ryan-ui/slide-game/slide-game";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

const amount = (value: number) => `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}`;

export default function SlideGameDemo() {
  const [rounds, setRounds] = useState<SlideRound[]>([]);
  const best = rounds.reduce((top, round) => Math.max(top, round.multiplier), 0);
  const net = rounds.reduce((sum, round) => sum + round.payout - round.bet, 0);
  return (
    <Stack width={576} gap={3}>
      <SlideGame defaultBet={10} onRoundEnd={round => setRounds(list => [...list, round])} />
      <Caption>
        {rounds.length
          ? `${rounds.length} ${rounds.length === 1 ? "round" : "rounds"} played: best stop ${best}×, session ${amount(net)}.`
          : "Bet and the strip shoots past the marker, slows down and stops on the multiplier that pays your bet."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SlideGame`

A slide game with fake money: a strip of multiplier tiles shoots past a center marker, slows down and stops on the multiplier that pays the bet.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `balance` | `number` | — | Controlled play-money balance. |
| `defaultBalance` | `number` | `1000` | Starting balance when uncontrolled; the reset button returns to it. |
| `onBalanceChange` | `(balance: number) => void` | — | Called with the new balance after a bet, a payout or a reset. |
| `defaultBet` | `number` | `10` | Bet amount shown at first. |
| `minBet` | `number` | `1` | Smallest bet. |
| `tiles` | `SlideTile[]` | `defaultTiles` | The kinds of tile on the strip and how often each comes up. |
| `duration` | `number` | `3.8` | Seconds the strip takes to slide and slow down to its result. |
| `onRoundEnd` | `(round: SlideRound) => void` | — | Called when the strip has stopped, with the result. |
| `random` | `() => number` | `Math.random` | Random source returning a number in [0, 1). Called only after a bet, to pick the result and fill the strip. |
| `title` | `string` | `"Slide"` | Name shown in the header. |
| `className` | `string` | — | Extra class for the card. |

### `GameFrame`

The card around a game: title, a "Play money" tag, the balance and its reset.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | Name of the game, shown in the header and used as the region label. |
| `money` (required) | `PlayMoney` | — | The balance from `usePlayMoney`. |
| `busy` | `boolean` | `false` | True while a round is running: the reset button waits for it to end. |
| `announcement` | `string` | `""` | Result text for screen readers, announced politely. |
| `className` | `string` | — | Extra class for the card. |
| `children` (required) | `ReactNode` | — | The stage and controls of the game. |

### `BetField`

Bet amount with half, double and max shortcuts. Typing is free; the amount is clamped when the field loses focus.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number` | — | Bet amount. |
| `onValueChange` (required) | `(value: number) => void` | — | Called with the new amount, already clamped between `min` and `max`. |
| `min` | `number` | `1` | Smallest bet. |
| `max` (required) | `number` | — | Largest bet, usually the balance. |
| `disabled` | `boolean` | `false` | Locks the field, for example while a round runs. |
| `label` | `string` | `"Bet"` | Field label. |

### `AmountField`

A small optional number, such as a target multiplier.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Field label. |
| `value` (required) | `string` | — | Text in the field (digits and one dot). Empty means "not set". |
| `onValueChange` (required) | `(value: string) => void` | — | Called with the cleaned text on every edit. |
| `placeholder` | `string` | — | Shown while the field is empty. |
| `suffix` | `string` | — | Short unit after the number, for example "×". |
| `disabled` | `boolean` | `false` | Locks the field. |

### `FieldGroup`

A labelled slot for a custom control, aligned with the bet field.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Label above the control. |
| `children` (required) | `ReactNode` | — | The control: a stepper, a segmented choice… |

### `PlayButton`

The main action of a game. One button keeps focus while its label changes (Bet, Cash out, …).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `labelKey` (required) | `string` | — | Identifies the label: when it changes, the old label slides out and the new one slides in. |
| `tone` | `"accent" \| "neutral"` | `"accent"` | "accent" for the main action, "neutral" for a waiting state. |
| `disabled` | `boolean` | `false` | Turns the action off. The button stays focusable (aria-disabled), so keyboard focus is never lost while a round runs. |
| `onClick` (required) | `() => void` | — | Runs the action. |
| `children` (required) | `ReactNode` | — | Label content. |

### `HistoryChips`

A row of past results. A new chip springs in at the start and pushes the others along.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` (required) | `HistoryEntry[]` | — | Past results, newest first. |
| `label` (required) | `string` | — | Label of the list for screen readers. |

### Exported types

#### `SlideTile`

| Field | Type | Description |
| --- | --- | --- |
| `multiplier` (required) | `number` | Multiplier paid when the strip stops on this tile. |
| `weight` (required) | `number` | Relative chance of this tile: a weight of 2 comes up twice as often as a weight of 1. |

#### `SlideRound`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number` | Round number, starting at 1. |
| `multiplier` (required) | `number` | Multiplier the strip stopped on. |
| `bet` (required) | `number` | Amount bet. |
| `payout` (required) | `number` | Amount paid back. |

#### `PlayMoneyOptions`

| Field | Type | Description |
| --- | --- | --- |
| `balance` | `number` | Controlled balance. |
| `defaultBalance` (required) | `number` | Starting balance when uncontrolled; a reset returns to it. |
| `onBalanceChange` | `(balance: number) => void` | Called with the new balance after a bet, a payout or a reset. |

#### `PlayMoneyGain`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number` | Changes on every payout, so the same amount twice still animates. |
| `amount` (required) | `number` | Amount paid. |

#### `PlayMoney`

| Field | Type | Description |
| --- | --- | --- |
| `balance` (required) | `number` | Current fake balance. |
| `gain` (required) | `PlayMoneyGain \| null` | The latest payout, for the "+12.40" flyer next to the balance. |
| `spend` (required) | `(amount: number) => boolean` | Takes a bet out of the balance. Returns false (and takes nothing) when the balance is too low. |
| `pay` (required) | `(amount: number) => void` | Adds a payout to the balance. |
| `reset` (required) | `() => void` | Returns the balance to its starting amount. |

#### `HistoryEntry`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number \| string` | Stable key of the round. |
| `label` (required) | `string` | Text of the chip, for example "2.31×". |
| `tone` (required) | `"low" \| "mid" \| "high"` | "low" is muted, "mid" is tinted, "high" takes the accent fill. |

### Other exports

- `formatAmount` (function)
- `formatMultiplier` (function)
- `roundAmount` (function)
- `usePlayMoney` (hook)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the main button, bets and releases the strip; during the slide it is `aria-disabled`, but keeps focus. |
| `Enter` | In the bet field, confirms the value and clamps it between `minBet` and the balance. |

## Accessibility

- The strip is `aria-hidden`; the result reaches the screen reader through the card's `role="status"` region (“Sliding with a bet of…”, “Landed on…”), and the odds sit in a labeled list.
- Balance with hidden text, bet shortcuts with `aria-label` and main button with `aria-disabled` follow the pattern of the other games; all texts are in English.

## Motion

- The strip launches, spends most of the run slowing down and stops slightly off-center, settling on the tile with a spring; the marker's pointer ticks as tiles pass it.
- On stopping, the winning tile grows with a shadow, the others fade and the marker grows along with it; on mount, the tiles enter from the center outward.
- With “reduce motion” on, the strip does not run: it reappears at the final position with a short fade, with no pointer tick, no growth and no staggered entrance.

## Responsive behavior

- The card goes up to 36rem and is a container: bet and button sit side by side from 28rem; the strip takes the full width and fades at the edges, with fixed 76 px tiles.

## Notes for AI

- `tiles` takes `multiplier` and `weight` (weight 2 comes up twice as often as weight 1); entries with zero weight or a negative multiplier are discarded, and with none valid the default table is restored.
- `duration` (3.8 s) is the time of the run until it stops; `onRoundEnd` arrives when the strip stops, and `random` is only called at bet time, to draw the result and fill the strip.
- The default table has weights that add up to 100 and pays 0.97 of the bet on average; it is play money, with its own copy of `play-money.tsx`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/slide-game · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
