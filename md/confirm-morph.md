# Confirm morph

> Botão destrutivo que vira confirmação no próprio lugar, depois carregamento e resultado com desfazer.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/confirm-morph
- Original description: A destructive button that morphs into an inline confirmation, a spinner, and a result with undo.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/confirm-morph.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/confirm-morph.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/confirm-morph.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/confirm-morph.json`. Registry path, relative to the site address: `r/confirm-morph.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/confirm-morph/confirm-morph.tsx`
  - `components/ryan-ui/confirm-morph/confirm-morph.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/confirm-morph.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Destructive actions where a modal dialog would be heavy: delete a project, revoke access, discard a draft.
- When the question, the progress, and the result with Undo should happen in place of the button itself.
- Actions that need an extra barrier: `confirmMode="hold"` requires holding down and `countdown` gives a few seconds to cancel.

## When not to use

- Use [`dialog`](dialog.md) when the person needs to read consequences or fill something in before confirming: here the question is a short line.
- Use [`hold-to-confirm`](hold-to-confirm.md) when holding the button is enough, with no question or Cancel.
- Use [`toast-action`](toast-action.md) when the action can run right away and Undo comes afterward, in a notice.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmMorph from "@/components/ryan-ui/confirm-morph/confirm-morph";
import { Caption, Field, Stack } from "./_kit";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

export default function ConfirmMorphDemo() {
  const [deleted, setDeleted] = useState(0);
  return (
    <Stack gap={6} align="center">
      <Field label="Press to confirm, with undo">
        <ConfirmMorph
          label="Delete project"
          icon={<Trash2 size={15} aria-hidden="true" />}
          prompt="Delete Northwind redesign?"
          onConfirm={async () => { await wait(1100); setDeleted(count => count + 1); }}
          onUndo={async () => { await wait(800); setDeleted(count => Math.max(0, count - 1)); }}
        />
      </Field>
      <Field label="Countdown you can still stop">
        <ConfirmMorph
          label="Remove 3 files"
          prompt="Remove 3 files?"
          confirmMode="countdown"
          countdown={3}
          countdownLabel="Removing in"
          confirmLabel="Remove"
          pendingLabel="Removing"
          doneLabel="Removed"
          onConfirm={() => wait(900)}
        />
      </Field>
      <Caption>Projects deleted this session: {deleted}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ConfirmMorph`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` | — | The resting label, such as "Delete project". |
| `icon` | `ReactNode` | — | A plain icon before the resting label. |
| `prompt` | `ReactNode` | — | The question shown while confirming, such as "Delete 3 files?". Defaults to the label with a question mark. |
| `confirmLabel` | `string` | `"Delete"` | — |
| `cancelLabel` | `string` | `"Cancel"` | — |
| `pendingLabel` | `string` | `"Deleting"` | Shown beside the spinner while `onConfirm` resolves. |
| `doneLabel` | `string` | `"Deleted"` | — |
| `errorLabel` | `string` | `"Couldn’t finish"` | — |
| `retryLabel` | `string` | `"Retry"` | — |
| `undoLabel` | `string` | `"Undo"` | — |
| `undoingLabel` | `string` | `"Restoring"` | Shown beside the spinner while `onUndo` resolves. |
| `tone` | `"danger" \| "neutral"` | `"danger"` | `danger` (default) gives the confirm button the danger colour, for actions that destroy something. `neutral` gives it the accent, for important actions that can be reversed. The resting button is neutral either way. |
| `confirmMode` | `"press" \| "hold" \| "countdown"` | `"press"` | `press` confirms on a press. `hold` asks for a press held for `holdDuration`. `countdown` confirms, then counts down `countdown` seconds that Cancel or Escape can still stop. |
| `holdDuration` | `number` | `1000` | Milliseconds the confirm button must be held in `hold` mode. |
| `countdown` | `number` | `3` | Seconds counted down before the action runs in `countdown` mode. |
| `countdownLabel` | `string` | — | Text before the seconds in `countdown` mode, such as "Deleting in". Defaults to the pending label followed by "in". |
| `onConfirm` | `() => void \| Promise<unknown>` | — | Runs on confirm. Return a promise to show the pending face; a rejection shows the error face with Retry. |
| `onUndo` | `() => void \| Promise<unknown>` | — | Offering it adds Undo to the result. Return a promise to show a pending face while it runs. |
| `onCancel` | `() => void` | — | — |
| `state` | `"idle" \| "confirming" \| "pending" \| "done" \| "error"` | — | Controlled state. Pair it with `onStateChange`. |
| `defaultState` | `"idle" \| "confirming" \| "pending" \| "done" \| "error"` | `"idle"` | Starting state when uncontrolled. |
| `onStateChange` | `(state: ConfirmMorphState) => void` | — | — |
| `confirmTimeout` | `number` | `6000` | Milliseconds before an unanswered question returns to rest. Resting the pointer on the control pauses it. 0 turns it off. |
| `resultTimeout` | `number` | `5000` | Milliseconds a result stays before returning to rest. Resting the pointer on the control pauses it. 0 turns it off. |
| `cancelOnOutsidePress` | `boolean` | `true` | A press outside the control cancels an open question. Defaults to true. |
| `disabled` | `boolean` | `false` | — |
| `className` | `string` | — | — |
| `ref` | `Ref<HTMLDivElement>` | — | Receives the root element, which also takes focus while the action is pending. |

### Exported types

| Type | Definition |
| --- | --- |
| `ConfirmMorphState`: Where the control is in its life: resting, asking, working, finished, or failed. | `"idle" \| "confirming" \| "pending" \| "done" \| "error"` |
| `ConfirmMorphMode`: How the question is answered: a press, a press held until the fill completes, or a press followed by a short countdown. | `"press" \| "hold" \| "countdown"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the resting button, open the question and move focus to the confirm button, where the same keys confirm (in `countdown` mode, they start the countdown). |
| `Tab` or `Shift + Tab` | Toggle between Cancel and Confirm. |
| `Esc` | Cancels the question or the countdown; on a result or error, returns to rest. |
| `Enter` | During the countdown, with focus on the control, runs the action without waiting for the end. |
| `Space` or `Enter` | In `hold` mode, must stay pressed on the confirm button until the fill completes; releasing early undoes it. |

## Accessibility

- Focus follows the faces if it was already on the control: it goes to Confirm on the question, to the root during the countdown and the wait, to Undo or Try again on the result, and back to the button at rest.
- The question is a `role="group"` labeled by the `prompt`, the root gets `aria-busy` while waiting, and a `role="status"` announces progress, result, and error, and also the question when `prompt` is text.
- The timeout only pauses with the pointer over the control or with the tab hidden, not with keyboard focus; increase or zero out `confirmTimeout` and `resultTimeout` for keyboard or screen reader users.

## Motion

- A single pill changes width with a spring with no overshoot on each face; faces swap by fading, at natural width, and the parts of the new one enter in sequence from a slight blur.
- In `hold` mode the confirm button fills from the left while pressed and empties on a spring if released early; in `countdown` a ring runs out and the seconds swap in place; success draws a checkmark.
- With “reduce motion”, the width jumps, the faces only fade, the checkmark appears already drawn, and the wait indicator spins more slowly (1.6 s per turn).

## Responsive behavior

- Nothing wraps: the question takes up to `16rem` (the excess becomes an ellipsis) and is followed by Cancel and Confirm, in a single row.
- The pill does not exceed 100% of the container and clips what is left over; since Confirm comes last, in a narrow space it ends up outside the visible area: reserve width or shorten `prompt`.

## Notes for AI

- `onConfirm` can return a Promise: while it runs the wait face appears, a rejection shows the error with Try again, and passing `onUndo` adds Undo to the result.
- Labels default to English and to deletion (`confirmLabel` “Delete”, `pendingLabel` “Deleting”, `doneLabel` “Deleted”): pass `prompt` and all the labels; announcements like “Cancelled” and “Undone” are fixed in the code.
- It works with no external control; use `state` with `onStateChange` only if the parent needs to drive the faces, and `tone="neutral"` for important but reversible actions.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/confirm-morph · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
