# Hold to confirm

> Confirma uma ação destrutiva ao segurar o botão, não com um toque.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/hold-to-confirm
- Original description: Confirm a destructive action by holding, not tapping.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hold-to-confirm.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hold-to-confirm.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hold-to-confirm.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hold-to-confirm.json`. Registry path, relative to the site address: `r/hold-to-confirm.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/hold-to-confirm/hold-to-confirm.tsx`
  - `components/ryan-ui/hold-to-confirm/hold-to-confirm.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/hold-to-confirm.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Destructive or hard-to-undo actions whose consequences are already visible on screen, like deleting the project that is open.
- Actions where an accidental tap must not count and a dialog would be heavy: publish, archive, release a shipment.

## When not to use

- Use [`dialog`](dialog.md) when the person needs to read the consequences before confirming.
- Use [`confirm-morph`](confirm-morph.md) when the confirmation should offer Cancel, show progress, and allow Undo in place.
- Use [`toast-action`](toast-action.md) with Undo for frequent, reversible actions: holding on every use slows the flow.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import HoldToConfirm from "@/components/ryan-ui/hold-to-confirm/hold-to-confirm";
import { Caption, Row, Stack } from "./_kit";

export default function HoldToConfirmDemo() {
  const [holding, setHolding] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  return (
    <Stack gap={6} align="center">
      <HoldToConfirm
        key={resetKey}
        label="Hold to delete project"
        confirmedLabel="Project deleted"
        tone="danger"
        onHoldChange={setHolding}
        onConfirm={() => setDeleted(true)}
      />
      <Row justify="center">
        <HoldToConfirm label="Hold to publish" confirmedLabel="Published" duration={800} onConfirm={() => {}} />
        <HoldToConfirm label="Hold to archive" confirmedLabel="Archived" tone="neutral" onConfirm={() => {}} />
      </Row>
      <Caption>
        {deleted ? (
          <>Deleted. <button type="button" onClick={() => { setDeleted(false); setResetKey(key => key + 1); }} style={{ all: "unset", cursor: "pointer", textDecoration: "underline" }}>Reset the demo</button></>
        ) : holding ? "Keep holding…" : "Press and hold; releasing early cancels."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `HoldToConfirm`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | The instruction and the action, for example “Hold to delete project”. |
| `confirmedLabel` | `string` | `"Done"` | Shown once the hold completes, for example “Deleted”. |
| `onConfirm` (required) | `() => void` | — | Called once when the hold completes. |
| `duration` | `number` | `1200` | Hold length in milliseconds. |
| `icon` | `ReactNode` | `<Trash2 strokeWidth={1.75} />` | — |
| `tone` | `"accent" \| "danger" \| "neutral"` | `"accent"` | `accent` (default) fills with the selected accent; `danger` is for an irreversible action; `neutral` fills with the foreground. |
| `confirmed` | `boolean` | — | Controls the done state. Set it back to false to reset the button; leave it undefined to let the button keep its own state. |
| `onHoldChange` | `(holding: boolean) => void` | — | Reports when a hold starts and ends, for surrounding hints such as “Keep holding”. |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `children`, `onClick`, `onDrag`, `onDragEnd`, `onDragStart`, `onAnimationStart` and `onAnimationEnd`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Space` or `Enter` | Held down on the button, they advance the fill; releasing before the end undoes it, and completing calls `onConfirm`. |

## Accessibility

- It is a `<button>` with `aria-describedby` pointing to a hidden instruction (“Press and hold for 1.2 seconds to confirm…”, fixed in English); on completion, it gets `aria-disabled` and a `role="status"` announces `confirmedLabel`.
- The `aria-label` follows the visible text (`label`, then `confirmedLabel`); a quick click or tap does not confirm, so say in the `label` that holding is required, like “Hold to delete project”.
- Dragging the pointer more than 24 px outside the button, or taking focus away from it, cancels the press.

## Motion

- The fill advances at a linear pace for `duration` ms, like an inverted copy of the button revealed from the left (the text changes color at the edge); releasing early rewinds it on a spring, and pressing again continues from where it stopped.
- On press, the button shrinks slightly (0.97); on completion, the icon becomes a checkmark that draws itself and the width follows the new label on a spring with no overshoot.
- With “reduce motion”, the fill still advances while held (it is the timer), but returns at once on release; there is no scale, and label and icon only fade.

## Notes for AI

- `onConfirm` runs once, on completion; afterward the button stays done until it remounts (the demo changes the `key`) or, in controlled mode, until `confirmed` goes back to `false`.
- `tone="danger"` is for irreversible actions (the default `accent` uses the accent color); `duration` sets the time (1200 ms) and `icon` replaces the default trash can.
- Use `onHoldChange` for a hint around it, like “Keep holding…”; `confirmedLabel` defaults to English (“Done”), and the hidden instruction only changes in the installed file.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/hold-to-confirm · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
