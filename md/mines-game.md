# Mines game

> Campo 5×5 de mentirinha: vire as peças para achar gemas e aumentar o multiplicador, mas uma mina encerra a rodada.

- Type: component (category Games), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/mines-game
- Original description: A play-money mines game on a 5×5 grid: tiles flip to reveal gems that raise the multiplier, and a mine ends the round unless you cash out first.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mines-game.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mines-game.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mines-game.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mines-game.json`. Registry path, relative to the site address: `r/mines-game.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/mines-game/mines-game.tsx`
  - `components/ryan-ui/mines-game/mines-game.module.css`
  - `components/ryan-ui/mines-game/play-money.tsx`
  - `components/ryan-ui/mines-game/play-money.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/mines-game.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Demos or game areas with a play-money balance where each gem found raises the multiplier and the person decides when to stop.
- Games playable by keyboard: the 5 × 5 board has roving focus and arrow keys to move between tiles.
- Explain risk and reward: more mines give bigger jumps in the multiplier, which is the fair payout minus `margin`.

## When not to use

- Do not use with real money or prizes: the balance is play money and the mines are drawn in the browser with `random`.
- Use [`crash-game`](crash-game.md) when the tension should come from time, cashing out before a live curve crashes.
- Use [`plinko-game`](plinko-game.md) or [`slide-game`](slide-game.md) when the result should come out on its own, with no decisions during the round.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { MinesGame } from "@/components/ryan-ui/mines-game/mines-game";
import type { MinesRound } from "@/components/ryan-ui/mines-game/mines-game";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 620 };

const amount = (value: number) => `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}`;

export default function MinesGameDemo() {
  const [mines, setMines] = useState(3);
  const [rounds, setRounds] = useState<MinesRound[]>([]);
  const last = rounds[rounds.length - 1];
  const net = rounds.reduce((sum, round) => sum + round.payout - round.bet, 0);
  return (
    <Stack width={640} gap={3}>
      <MinesGame mines={mines} onMinesChange={setMines} defaultBet={10} onRoundEnd={round => setRounds(list => [...list, round])} />
      <Caption>
        {last
          ? `Round ${last.id}: ${last.gems} ${last.gems === 1 ? "gem" : "gems"} with ${last.mines} ${last.mines === 1 ? "mine" : "mines"}, ${last.outcome === "mine" ? "ended by a mine" : `cashed out at ${last.multiplier.toFixed(2)}×`}. Session: ${amount(net)} over ${rounds.length} ${rounds.length === 1 ? "round" : "rounds"}.`
          : `${mines} of the 25 tiles hide a mine. Bet, flip tiles to collect gems and cash out whenever you like. Arrow keys move across the board.`}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MinesGame`

A mines game with fake money: every gem uncovered in the 5×5 grid raises the multiplier, a mine ends the round, and tiles flip to show what they hid.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `balance` | `number` | — | Controlled play-money balance. |
| `defaultBalance` | `number` | `1000` | Starting balance when uncontrolled; the reset button returns to it. |
| `onBalanceChange` | `(balance: number) => void` | — | Called with the new balance after a bet, a payout or a reset. |
| `defaultBet` | `number` | `10` | Bet amount shown at first. |
| `minBet` | `number` | `1` | Smallest bet. |
| `mines` | `number` | — | Controlled number of mines hidden in the 25 tiles, from 1 to 24. |
| `defaultMines` | `number` | `3` | Number of mines at first when uncontrolled. |
| `onMinesChange` | `(mines: number) => void` | — | Called when the player changes the number of mines. |
| `margin` | `number` | `0.03` | Part of each payout the game keeps, from 0 to 0.5. |
| `onRoundEnd` | `(round: MinesRound) => void` | — | Called when a round ends, by a cash out or by a mine. |
| `random` | `() => number` | `Math.random` | Random source returning a number in [0, 1). Called only when a bet is placed, to hide the mines. |
| `title` | `string` | `"Mines"` | Name shown in the header. |
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

#### `MinesRound`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number` | Round number, starting at 1. |
| `mines` (required) | `number` | Mines hidden in the grid this round. |
| `gems` (required) | `number` | Gems the player uncovered. |
| `multiplier` (required) | `number` | Multiplier reached with those gems. |
| `outcome` (required) | `"cashed-out" \| "mine"` | "cashed-out" when the player left with the payout, "mine" when a mine ended the round. |
| `bet` (required) | `number` | Amount bet. |
| `payout` (required) | `number` | Amount paid back (0 after a mine). |

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
| `↑` or `↓` or `←` or `→` | On the board, move focus between tiles and stop at the edge, without wrapping. |
| `Home` or `End` | Move focus to the first or last tile of the current row. |
| `Enter` or `Space` | On a closed tile during the round, flips the tile. |
| `Tab` | Enters the board at the last focused tile, the only one in the focus order, and then moves on to the bet and mine controls. |
| `Enter` or `Space` | On the main button, bets, cashes out after the first gem and bets again; it is the same `<button>` the whole time. |
| `Enter` | In the bet field, confirms the value and clamps it between `minBet` and the balance. |

## Accessibility

- The board is a `role="group"` with roving focus (only one tile has `tabIndex={0}`), and each tile states row, column and state (“hidden”, “gem” or “mine”) in its `aria-label`.
- Tiles already flipped or outside a round use `aria-disabled` and stay in the navigation; each move is announced in a `role="status"` region, and the mine count in another live region.
- Balance, bet shortcuts and main button follow the pattern of the other games, with `aria-disabled` to keep focus; all texts are in English.

## Motion

- Tiles flip in 3D with a spring with a slight bounce; at the end of the round, the remaining ones flip in a wave starting from the focused tile, and a mine makes the board shake.
- The multiplier makes a small hop on each gem, the mine count rolls in the direction of the adjustment and, on a new bet, the open tiles close in a diagonal sweep.
- With “reduce motion” on, tiles flip instantly, with no wave, shake, staggered entrance or hover lift.

## Responsive behavior

- The card goes up to 40rem and is a container: when narrow, the board sits above the controls; from 34rem they sit side by side, with the panel at 15rem and the board up to 24rem.

## Notes for AI

- `mines` (1 to 24) can be controlled with `onMinesChange`; at the end of each round, `onRoundEnd` brings gems, multiplier, outcome (`cashed-out` or `mine`), bet and payout.
- `random` is only called at bet time, to hide the mines, so a seeded generator makes the board repeatable; finding all the gems ends the round with an automatic cash-out.
- Like the other games, it is play money with its own copy of `play-money.tsx`; the balance can be controlled with `balance` and `onBalanceChange`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/mines-game · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
