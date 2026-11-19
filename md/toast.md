# Toast

> Aviso rápido e discreto que aparece, some sozinho e pode ser dispensado com um gesto.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/toast
- Original description: Brief confirmation for a completed background action.
- Versions: Padrão (this item), Pilha ([`toast-stack`](toast-stack.md)), Com ação ([`toast-action`](toast-action.md)), Progresso ([`toast-progress`](toast-progress.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast.json`. Registry path, relative to the site address: `r/toast.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/toast/toast.tsx`
  - `components/ryan-ui/toast/toast.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/toast.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Confirm an action that succeeded and asks nothing more: draft saved, link copied, invitation sent.
- A single notice at a time, in a place you control, with `open` and `onOpenChange` tied to the screen's state.
- Touch screens where swiping the notice sideways is the natural way to dismiss it.

## When not to use

- Use [`toast-action`](toast-action.md) when the notice offers undo or another action; its timer pauses on mouse and focus.
- Use [`toast-stack`](toast-stack.md) for several notices in a row or of different types (error, warning, loading); this one only shows the success checkmark.
- Use [`alert`](alert.md) for errors and warnings that must stay on screen until the user acts.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import Toast from "@/components/ryan-ui/toast/toast";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack } from "./_kit";

export default function ToastDemo() {
  // The preview opens with one toast already on screen (it has no close button, so it still times out, just later: 9 s);
  // each "Save draft" after that shows it for 4 s.
  const [open, setOpen] = useState(true);
  const [timed, setTimed] = useState(false);
  return (
    <Stack gap={5} align="center" width={420} style={{ minHeight: 220 }}>
      <Button onClick={() => { setTimed(true); setOpen(true); }}>Save draft</Button>
      <div style={{ minHeight: 84, width: "100%", display: "grid", justifyItems: "center", alignContent: "start" }}>
        <Toast open={open} onOpenChange={setOpen} title="Draft saved" description="Your changes to “Spring lookbook” are safe." duration={timed ? 4000 : 9000} />
      </div>
      <Caption>It closes by itself, or swipe it sideways.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Toast`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `open` | `boolean` | `true` | — |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `duration` | `number` | `4500` | — |

## Accessibility

- It is `role="status"` with `aria-live="polite"` and `aria-atomic`: the screen reader reads title and description together, without interrupting, and the outgoing copies are hidden.
- The timer does not pause on mouse or focus and there is no shortcut to reach the notice; do not put anything in it that the user needs to read carefully or act on.
- The close button is a `<button>` with `aria-label` “Dismiss notification”, fixed in English in the file.

## Motion

- It enters rising 16 px from a slightly smaller scale, with a no-overshoot spring, while the checkmark draws itself; on closing, it drops a little and fades.
- When dragged sideways, it follows the finger; past 80 px or released quickly, it flies off in the direction of the gesture at the release velocity, otherwise it springs back.
- With “reduce motion”, entrance and exit become a short fade and dragging is turned off.

## Responsive behavior

- The width goes up to 26 rem and fits the parent; the title stays on one line and is truncated with an ellipsis, so put long details in `description`, which wraps.

## Notes for AI

- Import the default: `import Toast from "@/components/ryan-ui/toast/toast"` (there is no named export). It appears where it is rendered; position it yourself, for example in a fixed container in the corner.
- Automatic closing (`duration`, default 4500 ms) only works with `onOpenChange`; pass a stable function, such as the `setOpen` from `useState`, because a new function on every render restarts the countdown.
- To show the notice again, set `open` back to `true`; changing `title` while it is open swaps the text in place, without restarting the timer.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/toast · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
