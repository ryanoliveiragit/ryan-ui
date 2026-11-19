# Plinko game

> Tabuleiro de plinko de mentirinha: a bolinha quica nos pinos, para a esquerda ou a direita, e acende a casa do multiplicador.

- Type: component (category Games), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/plinko-game
- Original description: A play-money plinko board: each ball bounces left or right off every row of pegs and lights up the multiplier slot it lands in.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plinko-game.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plinko-game.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plinko-game.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/plinko-game.json`. Registry path, relative to the site address: `r/plinko-game.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/plinko-game/plinko-game.tsx`
  - `components/ryan-ui/plinko-game/plinko-game.module.css`
  - `components/ryan-ui/plinko-game/play-money.tsx`
  - `components/ryan-ui/plinko-game/play-money.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/plinko-game.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Demos or game areas with a play-money balance where several balls fall at the same time, each with its own bet.
- Show a binomial distribution in action: the middle slots come up more often and pay less, the end ones are rare and pay more.
- When the person chooses the risk (`low`, `medium`, `high`) and sees the multiplier table change instantly.

## When not to use

- Do not use with real money or prizes: the balance is play money and each ball's path is drawn in the browser with `random`.
- Use [`crash-game`](crash-game.md) or [`mines-game`](mines-game.md) when the person should decide during the round, cashing out before losing.
- Use [`slide-game`](slide-game.md) for one result per bet with the odds of each multiplier on display.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { PlinkoGame } from "@/components/ryan-ui/plinko-game/plinko-game";
import type { PlinkoDrop, PlinkoRisk } from "@/components/ryan-ui/plinko-game/plinko-game";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 620 };

const amount = (value: number) => `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}`;

export default function PlinkoGameDemo() {
  const [risk, setRisk] = useState<PlinkoRisk>("medium");
  const [drops, setDrops] = useState<PlinkoDrop[]>([]);
  const best = drops.reduce((top, drop) => Math.max(top, drop.multiplier), 0);
  const net = drops.reduce((sum, drop) => sum + drop.payout - drop.bet, 0);
  return (
    <Stack width={672} gap={3}>
      <PlinkoGame rows={8} risk={risk} onRiskChange={setRisk} defaultBet={10} onDrop={drop => setDrops(list => [...list, drop])} />
      <Caption>
        {drops.length
          ? `${drops.length} ${drops.length === 1 ? "ball" : "balls"} at ${risk} risk: best slot ${best}×, session ${amount(net)}.`
          : "Drop a ball and it bounces left or right off each of the 8 rows. Press the button several times to send a few balls at once."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PlinkoGame`

A plinko board with fake money: each ball bounces left or right off every row of pegs and lights up the multiplier slot it lands in.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `balance` | `number` | — | Controlled play-money balance. |
| `defaultBalance` | `number` | `1000` | Starting balance when uncontrolled; the reset button returns to it. |
| `onBalanceChange` | `(balance: number) => void` | — | Called with the new balance after a bet, a payout or a reset. |
| `defaultBet` | `number` | `10` | Bet amount shown at first. |
| `minBet` | `number` | `1` | Smallest bet. |
| `rows` | `number` | `8` | Rows of pegs, from 6 to 12. The board ends in rows + 1 slots. |
| `risk` | `"low" \| "medium" \| "high"` | — | Controlled risk. Higher risk pays more at the edges and less in the middle. |
| `defaultRisk` | `"low" \| "medium" \| "high"` | `"medium"` | Risk at first when uncontrolled. |
| `onRiskChange` | `(risk: PlinkoRisk) => void` | — | Called when the player picks another risk. |
| `multipliers` | `number[]` | — | Your own multipliers, one per slot from left to right (rows + 1 values). Replaces the table computed from `risk`. |
| `margin` | `number` | `0.03` | Part of each bet the computed table keeps on average, from 0 to 0.5. |
| `maxBalls` | `number` | `8` | How many balls may fall at the same time. |
| `onDrop` | `(drop: PlinkoDrop) => void` | — | Called when a ball lands in a slot. |
| `random` | `() => number` | `Math.random` | Random source returning a number in [0, 1). Called only while a ball is dropped, to choose its path. |
| `title` | `string` | `"Plinko"` | Name shown in the header. |
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

| Type | Definition |
| --- | --- |
| `PlinkoRisk` | `"low" \| "medium" \| "high"` |

#### `PlinkoDrop`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number` | Ball number, starting at 1. |
| `slot` (required) | `number` | Slot the ball landed in, counted from the left starting at 0. |
| `multiplier` (required) | `number` | Multiplier of that slot. |
| `bet` (required) | `number` | Amount bet on the ball. |
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
| `Enter` or `Space` | On the “Drop a ball” button, drops a ball; repeating drops more, up to `maxBalls` falling together. |
| `↑` or `↓` or `←` or `→` | In the risk group, switches between “Low”, “Medium” and “High” (native radios); locked while balls are falling. |
| `Enter` | In the bet field, confirms the value and clamps it between `minBet` and the balance. |
| `Tab` | Moves through reset balance, bet, ½, 2×, Max, the selected risk and the drop button. |

## Accessibility

- The board is `aria-hidden`; the screen reader finds the list of slot multipliers, from left to right, and hears each landing (“Ball N landed on…”) in a `role="status"` region.
- The risk is a group of native radios labeled “Risk”, each inside a `<label>`; the keyboard focus outline appears on the segment.
- With several balls, each landing produces a new announcement; texts and announcements are fixed in English.

## Motion

- Each ball falls and, at each row, bounces left or right with a small upward impulse before gravity; the peg it touches lights up and grows.
- The slot where the ball lands sinks and lights up, keeps a ring until the next drop, and the values swap with a slight slide when the risk changes.
- With “reduce motion” on, no ball is drawn: the result comes out after a short pause and the slot only lights up, without sinking.

## Responsive behavior

- The card goes up to 42rem and is a container: the board sits above the controls and moves to the side from 36rem, at most 27rem wide.
- The board is an SVG that scales as a whole, and the slots follow its width; below 22rem the “×” disappears from the labels.

## Performance

- A per-frame callback moves all the balls directly in the DOM, without rendering React on each step; `maxBalls` (8) limits how many fall together and `rows` ranges from 6 to 12.

## Notes for AI

- `risk` recomputes the table from each slot's binomial probability; for your own table, pass `multipliers` with exactly `rows + 1` values, otherwise it is ignored.
- The bet leaves the balance when the ball is dropped and the payout comes in at landing, when `onDrop` arrives with slot, multiplier, bet and payout.
- The bet field stays editable with balls falling and each ball keeps the bet from the moment it was dropped; it is play money, with its own copy of `play-money.tsx`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/plinko-game · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
