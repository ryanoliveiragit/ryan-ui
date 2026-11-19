# Action button

> Botão compacto para as ações mais usadas de uma barra de ferramentas.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/action-button
- Original description: A compact button for frequent toolbar actions.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-button.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-button.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-button.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/action-button.json`. Registry path, relative to the site address: `r/action-button.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/action-button/action-button.tsx`
  - `components/ryan-ui/action-button/action-button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/action-button.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Async actions that should show progress and confirmation on the button itself: save draft, publish, sync.
- When you want the pending and done states managed by the component from a single `onAction` function.

## When not to use

- Use [`button`](button.md) when you need variants, sizes, or your own icon: here the look is fixed, filled, with an arrow on the right.
- Use [`action-swap`](action-swap.md) when the button toggles between states that persist, like Follow and Following, or needs a tone and icon per state.
- Use [`confirm-morph`](confirm-morph.md) or [`hold-to-confirm`](hold-to-confirm.md) when the action is destructive and needs confirmation before it runs.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import ActionButton from "@/components/ryan-ui/action-button/action-button";
import { Caption, Row, Stack } from "./_kit";

const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

export default function ActionButtonDemo() {
  const [saves, setSaves] = useState(0);
  const [failures, setFailures] = useState(0);
  return (
    <Stack gap={6} align="center">
      <Row justify="center">
        <ActionButton label="Save draft" onAction={async () => { await wait(1200); setSaves(count => count + 1); }} />
        <ActionButton label="Publish" pendingLabel="Publishing" successLabel="Published" onAction={() => wait(1800)} />
      </Row>
      <Row justify="center">
        <ActionButton
          label="Sync calendar"
          pendingLabel="Syncing"
          successLabel="Synced"
          onAction={async () => { await wait(900); throw new Error("offline"); }}
          onActionError={() => setFailures(count => count + 1)}
        />
      </Row>
      <Caption>{saves} drafts saved · {failures} sync failures. Each button shows pending, then confirms in place.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ActionButton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `successLabel` | `string` | `"Saved"` | — |
| `pendingLabel` | `string` | `"Saving"` | — |
| `onAction` (required) | `() => void \| Promise<void>` | — | — |
| `resetAfterMs` | `number` | `2400` | — |
| `onActionError` | `(error: unknown) => void` | — | — |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `onClick`, `onDrag`, `onDragEnd`, `onDragStart` and `onAnimationStart`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Trigger `onAction`; while the action is pending, further activations are ignored. |

## Accessibility

- It is a native `<button>` with `type="button"` by default; while pending, it gets `aria-busy` and `aria-disabled` instead of `disabled`, so focus is not lost mid-action.
- The animated text and the icons are `aria-hidden`: the screen reader gets the fixed `label` and a `role="status"` that announces `pendingLabel` and then `successLabel`.
- `pendingLabel` and `successLabel` default to English (“Saving” and “Saved”); pass both in the interface language.

## Motion

- The label swaps with a short fade (the new one rises 2 px) and the button width follows the text with a spring with no overshoot.
- The arrow exits to the right when the action starts, gives way to a spinner and then to a checkmark that draws itself; on return to rest, the arrow enters from the left.
- With “reduce motion”, the label swaps instantly, the icons only fade, the width jumps, the checkmark appears already drawn, and the spinner does not spin.

## Responsive behavior

- The label does not wrap and the width changes with each state; in tight rows, use text of similar length in `label`, `pendingLabel`, and `successLabel` so neighbors do not shift.

## Performance

- Each button keeps a `ResizeObserver` to measure the label and a timer to return to rest; avoid hundreds of them in a long list.

## Notes for AI

- The action goes in `onAction` (there is no `onClick`): return a Promise so the pending state lasts while it runs, and reject it to signal failure.
- On failure the button returns to rest with no message and calls `onActionError`; show the error yourself, for example with `toast`.
- `resetAfterMs` (default 2400) sets how long the done state stays visible; with `0` it stays until the next click.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/action-button · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
