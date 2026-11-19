# Toast stack

> Pilha de notificações que se empilha, se abre ao passar o mouse e transforma um aviso em seu resultado.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-stack
- Original description: Stack short results at the edge until you reach for them.
- Versions: Padrão ([`toast`](toast.md)), Pilha (this item), Com ação ([`toast-action`](toast-action.md)), Progresso ([`toast-progress`](toast-progress.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-stack.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-stack.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-stack.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toast-stack.json`. Registry path, relative to the site address: `r/toast-stack.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/toast-stack/toast-stack.tsx`
  - `components/ryan-ui/toast-stack/toast-stack.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/toast-stack.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Short results of several actions in sequence, such as save, delete, and sync, stacked in a corner without covering the screen.
- Notices that change in place: a `loading` that becomes `success` with `update(id, …)`, or an “Undo” that becomes “Restored”.
- Notices of different types in the same place (`success`, `info`, `warning`, `error`, `loading`), with a longer duration for warnings and errors.

## When not to use

- Use [`toast`](toast.md) or [`toast-action`](toast-action.md) when only one notice appears at a time and you want to control `open` directly on the component.
- Use [`notification-center`](notification-center.md) for a history the user consults later, with read and unread.
- Use [`alert`](alert.md) for errors that must stay visible until they are resolved.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useRef } from "react";
import ToastStack, { ToastStackProvider, useToastStack } from "@/components/ryan-ui/toast-stack/toast-stack";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "fill", height: 440 };

function Controls() {
  const { toast, update, dismiss } = useToastStack();
  const upload = () => {
    const id = toast({ type: "loading", title: "Uploading brand-kit.zip", description: "42 MB, almost there" });
    window.setTimeout(() => update(id, { type: "success", title: "Upload complete", description: "brand-kit.zip is ready to share." }), 2000);
  };
  const remove = (duration?: number) => {
    toast({ type: "info", title: "Invoice deleted", description: "INV-2041 was moved to the trash.", duration, action: { label: "Undo", onClick: id => update(id, { type: "success", title: "Invoice restored", description: "INV-2041 is back.", action: undefined }) } });
  };
  // On the docs page the preview starts with a short stack, so the toasts are visible before anything is pressed.
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !demoStage()) return;
    started.current = true;
    toast({ type: "success", title: "Upload complete", description: "brand-kit.zip is ready to share.", duration: 12000 });
    remove(12000);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, on the first mount in the preview
  }, []);
  return (
    <Stack gap={4} align="center" style={{ padding: "var(--space-6)" }}>
      <Row justify="center">
        <Button onClick={upload}>Upload file</Button>
        <Button variant="secondary" onClick={() => remove()}>Delete invoice</Button>
        <Button variant="secondary" onClick={() => toast({ type: "error", title: "Sync failed", description: "We lost the connection to the server." })}>Trigger error</Button>
        <Button variant="ghost" onClick={() => dismiss()}>Clear all</Button>
      </Row>
      <Caption>Fire several to see them stack; hover the stack to fan it out.</Caption>
    </Stack>
  );
}

export default function ToastStackDemo() {
  return (
    <ToastStackProvider>
      {/* The stage stretches this area, so the stack pins to the preview's bottom edge. */}
      <div style={{ position: "relative", flex: 1, minHeight: 440, overflow: "hidden" }}>
        <Controls />
        <ToastStack contained />
      </div>
    </ToastStackProvider>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToastStackProvider`

Scopes a toast queue to its subtree, so two stacks on one page never share toasts.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | — |
| `duration` | `number` | `5000` | Base lifetime in milliseconds. Warnings and errors stay 1.6 times longer. |
| `limit` | `number` | `12` | Oldest toasts beyond this count are dropped from the queue. |

### `ToastStack`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Notifications"` | Accessible name of the notification region. |
| `position` | `"bottom-right" \| "bottom-center" \| "bottom-left"` | `"bottom-right"` | — |
| `contained` | `boolean` | `false` | Pins the stack inside the nearest positioned ancestor instead of the window, for panels and previews. |
| `visibleToasts` | `number` | `3` | How many toasts show at once. Older ones wait behind and return as the front ones close. |
| `hotkey` | `boolean` | `true` | Alt+T moves focus into the stack. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ToastType` | `"success" \| "info" \| "warning" \| "error" \| "loading"` |

#### `ToastAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `onClick` (required) | `(id: string) => void` | Runs the action. The toast closes afterwards unless the handler updates it, so an Undo can morph the toast into its result. |

#### `ToastOptions`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Reuse an id to update a toast in place instead of stacking a new one. |
| `type` | `"success" \| "info" \| "warning" \| "error" \| "loading"` | — |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `action` | `ToastAction` | — |
| `duration` | `number` | Milliseconds before the toast closes itself. Defaults by type; loading toasts wait for an update. Pass Infinity to keep it until closed. |

#### `ToastStackApi`

| Field | Type | Description |
| --- | --- | --- |
| `toast` (required) | `(options: ToastOptions) => string` | Shows a toast and returns its id. |
| `update` (required) | `(id: string, patch: Partial<Omit<ToastOptions, "id">>) => void` | Morphs a toast in place: icon, copy, and height animate to the new content and its timer restarts. Pass `action: undefined` to remove the action. |
| `dismiss` (required) | `(id?: string) => void` | Dismisses one toast, or every toast when called without an id. |

### Other exports

- `useToastStack` (hook)

## Keyboard

| Keys | Action |
| --- | --- |
| `Alt + T` | Moves focus to the first button of the front notice and opens the stack as a list; turn off with `hotkey={false}`. |
| `Tab` or `Shift + Tab` | Moves through actions and close buttons; with keyboard focus inside, the stack stays open and the timers pause. |
| `Esc` | Closes the focused notice; focus moves to the next notice or returns to where it was before. |
| `Enter` or `Space` | On the action, runs `onClick`; the notice closes, unless the handler updates it. |

## Accessibility

- The stack is a `<section>` with `aria-live="polite"` that announces new notices and text changes; each notice starts with its type in hidden text (“Success:”, “Error:”), in English.
- The region's name includes the shortcut (“Notifications (Alt+T)”), and notices beyond `visibleToasts` stay `inert` until they reach the front.
- When an action updates the notice and it goes away, keyboard focus moves to the close button; on closing, it moves on to the next notice or returns to where it was.

## Motion

- New notices rise from the edge and earlier ones stay behind, 14 px higher and slightly smaller; hovering or focusing opens the stack into a list, with a no-overshoot spring.
- Dragged to the right, the notice follows the finger and flies off when it passes 40% of the width, counting momentum; to the left, it resists as at the end of a scroll.
- `update` swaps icon, text, and height in place and restarts the timer. With “reduce motion”, positions and sizes change immediately and only opacity animates.

## Responsive behavior

- The stack is up to 22.5 rem wide and fixed in the chosen corner; on screens below 30 rem it centers at the bottom. On touch, which has no hover, tapping a notice opens or closes the stack.
- In a notice narrower than 21 rem, the action drops below the text.

## Performance

- The stack's geometry lives in motion values, so following the finger, the mouse, or a timer does not re-render React on every frame; the queue holds at most `limit` notices (default 12).

## Notes for AI

- Import `ToastStackProvider`, `useToastStack`, and the default `ToastStack` from `@/components/ryan-ui/toast-stack/toast-stack`; wrap the app in the provider, render `<ToastStack />` once, and call `toast()` below it.
- `toast()` returns the id: keep it for `update(id, { type: "success", … })` or `dismiss(id)`. Repeating an `id` in `toast()` updates instead of stacking.
- `loading` notices do not close on their own, so always update or dismiss them later. In a preview, use `contained` inside a parent with `position: relative`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/toast-stack · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
