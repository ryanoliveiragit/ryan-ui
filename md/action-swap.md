# Action swap

> Troca o rótulo de uma ação sem ela sair do lugar nem mudar de intenção.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/action-swap
- Original description: Swap an action label while preserving its place and intent.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-swap.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-swap.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-swap.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-swap.json`. Registry path, relative to the site address: `r/action-swap.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/action-swap/action-swap.tsx`
  - `components/ryan-ui/action-swap/action-swap.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/action-swap.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An action that cycles through a few related states in the same place, like Follow, Following, and Unfollow.
- Short submissions with a transient confirmation: “Send invoice” becomes “Sending”, then “Sent”, and returns to the start on its own with `holdFor`.
- When each state needs its own icon and tone (`neutral`, `accent`, `success`, `warning`, or `quiet`).

## When not to use

- Use [`action-button`](action-button.md) when there is a single action with pending and done states and you do not want to describe states.
- Use [`split-button`](split-button.md) when the person chooses among alternatives: here each click only advances to the next state in the list.
- Use [`switch`](switch.md) when the control represents an on or off setting, not an action.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Check, Mail, Send, Star, StarOff } from "lucide-react";
import ActionSwap from "@/components/ryan-ui/action-swap/action-swap";
import type { ActionSwapState } from "@/components/ryan-ui/action-swap/action-swap";
import { Caption, Row, Stack } from "./_kit";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

const sendStates: ActionSwapState[] = [
  { id: "idle", label: "Send invoice", icon: <Send size={15} aria-hidden="true" />, tone: "accent", pendingLabel: "Sending" },
  { id: "sent", label: "Sent", icon: <Check size={15} aria-hidden="true" />, tone: "success", holdFor: 2000 },
];
const followStates: ActionSwapState[] = [
  { id: "follow", label: "Follow", icon: <Star size={15} aria-hidden="true" />, tone: "neutral" },
  { id: "following", label: "Following", icon: <Star size={15} fill="currentColor" aria-hidden="true" />, tone: "quiet" },
  { id: "unfollow", label: "Unfollow", icon: <StarOff size={15} aria-hidden="true" />, tone: "warning" },
];

export default function ActionSwapDemo() {
  const [attempt, setAttempt] = useState(0);
  const [log, setLog] = useState("Nothing sent yet.");
  return (
    <Stack gap={6} align="center">
      <Row justify="center">
        <ActionSwap
          size="lg"
          states={sendStates}
          onAction={async () => { await wait(1300); setLog("Invoice #2041 sent to Acme Corp."); }}
        />
        <ActionSwap
          states={[
            { id: "idle", label: "Email report", icon: <Mail size={15} aria-hidden="true" />, pendingLabel: "Emailing" },
            { id: "sent", label: "Emailed", icon: <Check size={15} aria-hidden="true" />, tone: "success", holdFor: 1800 },
          ]}
          failureLabel="Try again"
          onAction={async () => { await wait(900); const next = attempt + 1; setAttempt(next); if (next % 2 === 1) throw new Error("fail"); }}
        />
      </Row>
      <Row justify="center">
        <ActionSwap size="sm" states={followStates} />
      </Row>
      <Caption>{log} The second button fails on its first try, then succeeds.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ActionSwap`

A compact action that morphs through a small set of related states: idle, working, done, and back. Width, padding, tone, icon, and letters move together on one spring, and every change can be interrupted mid-flight.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `states` (required) | `ActionSwapState[]` | — | — |
| `value` | `string` | — | — |
| `defaultValue` | `string` | — | — |
| `onValueChange` | `(value: string, state: ActionSwapState) => void` | — | — |
| `onAction` | `(next: ActionSwapState, current: ActionSwapState) => void \| PromiseLike<unknown>` | — | Runs on press before the control moves on. Return a promise to show the working phase; a rejection shows `failureLabel`, then returns to the current state. |
| `failureLabel` | `string` | `"Try again"` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `children`, `onChange`, `onClick`, `value`, `onDrag`, `onDragEnd`, `onDragStart` and `onAnimationStart`. |

### Exported types

| Type | Definition |
| --- | --- |
| `ActionSwapTone` | `"neutral" \| "accent" \| "success" \| "warning" \| "quiet"` |

#### `ActionSwapState`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "quiet"` | — |
| `pendingLabel` | `string` | Shown while `onAction` runs on the way into this state, such as "Sending" before "Sent". Without it the pill folds into a round spinner. |
| `holdFor` | `number` | Milliseconds to hold this state before moving on by itself, for brief confirmations such as "Sent". |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Advance to the next state in `states` (after the last, back to the first), calling `onAction` first. |

## Accessibility

- It is a `<button>` whose `aria-label` follows the visible label; while `onAction` runs, it gets `aria-busy` and `aria-disabled` and stays focusable.
- Each change is announced by a `role="status"` next to the button: the new `label`, the `pendingLabel`, or the `failureLabel`.
- Without a `pendingLabel` on the target state, the wait announcement is the fixed text “Working”; set `pendingLabel` and `failureLabel` (default “Try again”) in the interface language.

## Motion

- Letters shared at the start and end of the label stay still and the new ones rise from a slight blur, in sequence, while the width follows a spring with no overshoot.
- Without `pendingLabel`, the pill folds into a circle with a spinner while the Promise runs (at least 450 ms); a failure shows `failureLabel` for 1.8 s and returns to the current state.
- With “reduce motion”, letters and icons swap with a 0.12 s fade, the width jumps, and the spinner does not spin.

## Responsive behavior

- Labels do not wrap and the pill changes width with each state; keep each `label` short.

## Performance

- Each letter of the label is an animated element and there is one `ResizeObserver` per button: it suits short labels, not sentences.

## Notes for AI

- Describe the states in `states` (`id`, `label`, `icon`, `tone`) in cycle order; with fewer than two states the button is disabled.
- `onAction(next, current)` runs before the swap: return a Promise to show the wait phase and reject it to display `failureLabel`.
- Control the state with `value` and `onValueChange` or leave it internal with `defaultValue`; `holdFor` on a state makes the button advance on its own after that time.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/action-swap · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
