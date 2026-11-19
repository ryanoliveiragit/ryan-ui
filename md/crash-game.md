# Crash game

> Jogo de brincadeira em que o multiplicador sobe numa curva até quebrar; saia antes para ficar com a aposta multiplicada.

- Type: component (category Games), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/crash-game
- Original description: A play-money crash game: the multiplier climbs along a live curve until it crashes at a random point, and you cash out first to keep your bet times the multiplier.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/crash-game.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/crash-game.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/crash-game.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/crash-game.json`. Registry path, relative to the site address: `r/crash-game.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/crash-game/crash-game.tsx`
  - `components/ryan-ui/crash-game/crash-game.module.css`
  - `components/ryan-ui/crash-game/play-money.tsx`
  - `components/ryan-ui/crash-game/play-money.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/crash-game.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Demos or game areas with a play-money balance where the fun is cashing out before the curve crashes.
- Show live motion: an exponential curve drawn every frame, the crash history in chips and the balance counting up to the new value.
- Simulations and probability tests, with your own `random` to repeat rounds and `onRoundEnd` to record each result.

## When not to use

- Do not use with real money or prizes: the balance is play money, the draw runs in the browser with `random` and nothing proves the round was fair.
- Use [`slide-game`](slide-game.md) when the result should come out at once, with no decision during the round.
- Use [`mines-game`](mines-game.md) when the person decides step by step, at their own pace, with no clock running.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CrashGame } from "@/components/ryan-ui/crash-game/crash-game";
import type { CrashRound } from "@/components/ryan-ui/crash-game/crash-game";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 700 };

const amount = (value: number) => `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(2)}`;

export default function CrashGameDemo() {
  const [rounds, setRounds] = useState<CrashRound[]>([]);
  const last = rounds[rounds.length - 1];
  const net = rounds.reduce((sum, round) => sum + round.payout - round.bet, 0);
  return (
    <Stack width={544} gap={3}>
      <CrashGame defaultBalance={1000} defaultBet={10} onRoundEnd={round => setRounds(list => [...list, round])} />
      <Caption>
        {last
          ? `Round ${last.id} crashed at ${last.crashPoint.toFixed(2)}×: ${last.cashedOutAt === null ? "the bet was lost" : `you were out at ${last.cashedOutAt.toFixed(2)}×`}. Session: ${amount(net)} over ${rounds.length} ${rounds.length === 1 ? "round" : "rounds"}.`
          : "Bet, watch the multiplier climb and cash out before the curve crashes. The balance is fake and resets from the header."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CrashGame`

A crash game with fake money: the multiplier climbs along a curve until it crashes at a random point; cash out first to keep the bet times the multiplier.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `balance` | `number` | — | Controlled play-money balance. |
| `defaultBalance` | `number` | `1000` | Starting balance when uncontrolled; the reset button returns to it. |
| `onBalanceChange` | `(balance: number) => void` | — | Called with the new balance after a bet, a payout or a reset. |
| `defaultBet` | `number` | `10` | Bet amount shown at first. |
| `minBet` | `number` | `1` | Smallest bet. |
| `maxMultiplier` | `number` | `50` | A round never goes past this multiplier. |
| `margin` | `number` | `0.03` | Part of each bet the game keeps on average, from 0 to 0.5. It makes early crashes a little more likely. |
| `speed` | `number` | `0.26` | Growth of the curve: the multiplier is e^(speed × seconds). |
| `defaultHistory` | `number[]` | `sampleHistory` | Crash points of earlier rounds for the history chips, newest first. |
| `historySize` | `number` | `8` | How many history chips to keep. |
| `onRoundEnd` | `(round: CrashRound) => void` | — | Called when a round crashes, with what the player got out of it. |
| `random` | `() => number` | `Math.random` | Random source returning a number in [0, 1). Called once per round, when the bet is placed. |
| `title` | `string` | `"Crash"` | Name shown in the header. |
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

#### `CrashRound`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `number` | Round number, starting at 1. |
| `crashPoint` (required) | `number` | Multiplier at which the round crashed. |
| `cashedOutAt` (required) | `number \| null` | Multiplier the player cashed out at, or null when the bet was lost. |
| `bet` (required) | `number` | Amount bet. |
| `payout` (required) | `number` | Amount paid back (0 when the bet was lost). |

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
| `Enter` or `Space` | On the main button, bets, cashes out during the round and bets again; it is the same `<button>` for the whole round, so focus does not leave it. |
| `Enter` | In the bet field, confirms the value and clamps it between `minBet` and the balance. |
| `Tab` | Moves through reset balance, bet, ½, 2×, Max, auto cash-out and the main button; the fields are disabled during the round. |

## Accessibility

- The card is a `<section>` named by `title`, and a `role="status"` region announces the start, cash-out and crash of each round (“Round started…”, “Cashed out at…”, “Crashed at…”).
- The chart is `aria-hidden`; the balance has a hidden “Play-money balance” text with the value, and the ½, 2× and Max shortcuts have their own `aria-label`.
- When the action is not available, the main button uses `aria-disabled` instead of `disabled`, to stay focusable; all texts are in English.

## Motion

- The multiplier rises along an exponential curve redrawn every frame, with scales that stretch along with it, like a camera pulling back; the leading dot pulses.
- On a crash, the curve and number switch to the danger color, a ring expands from the dot and the number shakes; a cash-out leaves a mark on the curve and the balance counts up to the new value with a “+” that rises.
- With “reduce motion” on, the round continues, but the curve advances in a few steps per second, with no pulse, ring or shake.

## Responsive behavior

- The card goes up to 34rem and is a container: the chart is 13rem to 16.5rem tall depending on width, and the bet and auto cash-out sit side by side from 26rem.

## Performance

- During the round, a per-frame callback rewrites the SVG paths directly in the DOM, without rendering React; a `ResizeObserver` redraws the chart when it changes size.

## Notes for AI

- The balance is play money and can live in the component (`defaultBalance`) or outside it (`balance` with `onBalanceChange`); `onRoundEnd` reports the bet, crash point, cash-out and payout.
- Pass a seeded `random` for tests or replays: it is called once per round, at bet time; `margin` (0 to 0.5) makes early crashes slightly more likely and `maxMultiplier` (50) caps the crash.
- The folder brings its own copy of `play-money.tsx` (balance, bet field, button and history); `speed` controls the climb, with the multiplier equal to e^(`speed` × seconds).

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/crash-game · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
