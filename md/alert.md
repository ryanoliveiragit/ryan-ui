# Alert

> Uma mensagem persistente que ajuda a pessoa a se recuperar de um problema ou seguir em frente.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/alert
- Original description: A persistent message that helps people recover or continue.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/alert.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/alert.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/alert.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/alert.json`. Registry path, relative to the site address: `r/alert.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/alert/alert.tsx`
  - `components/ryan-ui/alert/alert.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/alert.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A problem the user must resolve to continue, such as a declined payment or nearly full storage, shown where it happens.
- A message that changes state in place, such as a check that goes from `info` to `success`: the icon morphs and the height follows the new text with a spring.
- Notices the user can dismiss (`onDismiss`): when it goes away, the alert collapses its height and the content below moves up without jumping.

## When not to use

- Use [`toast`](toast.md) to confirm an action completed in the background that asks nothing of the user.
- Use [`announcement-bar`](announcement-bar.md) for a site-wide message at the top of the page, such as a promotion or a launch.
- Use [`dialog`](dialog.md) when the user must decide something before continuing.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Alert } from "@/components/ryan-ui/alert/alert";
import { Button } from "@/components/ryan-ui/button/button";
import { Row, Stack } from "./_kit";

export default function AlertDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Stack gap={4} width={480}>
      <Alert tone="danger" title="Payment failed" open={open} onDismiss={() => setOpen(false)}>
        Your card ending in 4242 was declined. Update your billing details to keep your Pro plan active.
      </Alert>
      {!open && <Row><Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show the alert again</Button></Row>}
      <Alert tone="warning" title="Storage almost full">You have used 92% of your 50 GB. Archive old projects or upgrade.</Alert>
      <Alert tone="success" title="Domain verified">acme-studio.com now points to your workspace.</Alert>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Alert`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | — | — |
| `title` (required) | `string` | — | — |
| `children` | `ReactNode` | — | — |
| `open` | `boolean` | — | Controls presence. Hiding the alert collapses its height and fades it out. |
| `onDismiss` | `() => void` | — | Shows a dismiss button. An uncontrolled alert collapses first, then calls this. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type. |

### Exported types

| Type | Definition |
| --- | --- |
| `AlertTone` | `"info" \| "success" \| "warning" \| "danger"` |

## Accessibility

- The `danger` tone uses `role="alert"`, which interrupts the screen reader; the other tones use `role="status"`, which is read without interrupting. Reserve `danger` for what is urgent.
- The icon is decorative (`aria-hidden`), so the title must say what happened; when the title or text changes, the outgoing copy is hidden and only the current text is read.
- The close button is a native `<button>` with a fixed English `aria-label` (`Dismiss: <título>`); on a non-English site, adjust that text in the copied file.

## Motion

- Changing `tone` morphs the icon in place (the old one shrinks with a slight blur and the new one grows), and a new title or text rises while the previous one exits upward.
- The text column animates its height with a no-overshoot spring right after a content change; passive changes, such as resizing the window, follow immediately.
- With `open` or `onDismiss`, appearing and disappearing collapse the height along with the fade; with “reduce motion”, the text only fades, and height, entrance, and exit change without animation.

## Notes for AI

- Import from `@/components/ryan-ui/alert/alert`; `title` is required and the children become the description. Without `open` and without `onDismiss`, the alert appears without an entrance animation (tone and text changes still animate).
- Controlled: pass `open` and, in `onDismiss`, set `open` to `false`. Without `open`, the alert collapses itself on close and only then calls `onDismiss`.
- Choose `tone` by its effect: `danger` only for a blocking error, because it is announced immediately; `warning` for imminent risk; `success` and `info` for the rest.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/alert · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
