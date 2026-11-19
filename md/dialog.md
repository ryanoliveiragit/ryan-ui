# Dialog

> Uma janela focada para decisões que pedem atenção.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/dialog
- Original description: A focused surface for decisions that need attention.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dialog.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dialog.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dialog.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dialog.json`. Registry path, relative to the site address: `r/dialog.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/dialog/dialog.tsx`
  - `components/ryan-ui/dialog/dialog.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/dialog.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Confirming a destructive action, such as deleting a project, explaining the consequences in `description`.
- A short form that must be completed or canceled before returning to the page.
- Decisions that cannot go unnoticed: the backdrop darkens with a blur and the page behind becomes inaccessible until the dialog closes.

## When not to use

- Use [`drawer`](drawer.md) for longer tasks where people still want to see the page beside it.
- Use [`popover`](popover.md) for contextual information that does not need to block the page.
- Use [`confirm-morph`](confirm-morph.md) or [`hold-to-confirm`](hold-to-confirm.md) to confirm a destructive action on the button itself, without opening a window.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ryan-ui/dialog/dialog";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack, demoStage, useQuietFirstOpen } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 440 };

export default function DialogDemo() {
  // On the docs page the dialog opens already, inside the preview: its scrim covers only the preview and the page keeps scrolling.
  const [container] = useState(demoStage);
  const quiet = useQuietFirstOpen();
  const [status, setStatus] = useState("Project “Atlas” is active.");
  const [open, setOpen] = useState(container !== null);
  return (
    <Stack align="center" gap={4}>
      <Dialog open={open} onOpenChange={setOpen} modal={!container}>
        <DialogTrigger asChild><Button variant="danger">Delete project</Button></DialogTrigger>
        <DialogContent container={container} onOpenAutoFocus={quiet} title="Delete Atlas?" description="This removes 42 files and 3 members' access. It cannot be undone.">
          <Row justify="flex-end">
            <DialogClose asChild><Button variant="ghost">Keep project</Button></DialogClose>
            <Button variant="danger" onClick={() => { setStatus("Project “Atlas” was deleted."); setOpen(false); }}>Delete</Button>
          </Row>
        </DialogContent>
      </Dialog>
      <Caption>{status}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Dialog`

No props of its own: accepts those of the element or primitive it wraps.

### `DialogContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `children` (required) | `ReactNode` | — | — |
| `container` | `HTMLElement \| null` | — | Renders the dialog inside this element instead of the page body: the scrim covers only the element and the dialog centers in it. The element needs position: relative and overflow: hidden. Pair it with `modal={false}` on Dialog, so the page around the element keeps scrolling and stays usable while the dialog is open (Escape, the close button and a press on the scrim still close it). |
| `...props` | `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>` | — | Also accepts the props of this type. |

### Other exports

- `DialogTrigger` (value)
- `DialogClose` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` or `Shift + Tab` | Move through the dialog controls without leaving it; on open, focus goes to the first control, the close button. |
| `Esc` | Closes the dialog and returns focus to the `DialogTrigger`. |

## Accessibility

- Radix modal dialog: `role="dialog"` with `title` as its name (an `<h2>`) and `description` as its description; the rest of the page leaves the accessibility tree and scrolling is locked.
- Focus is trapped in the dialog and returns to the trigger on close; the close button is named “Close dialog”, fixed in English in the code.
- To send initial focus to another control, use `onOpenAutoFocus` on `DialogContent`, which forwards the Radix props.

## Motion

- The backdrop fades in with a 7 px blur while the panel rises 8 px and grows from 96% on a no-overshoot spring; closing is shorter and starts from wherever the entrance is.
- If `title` or `description` change while the dialog is open, the new text rises and the old one exits upward.
- With “reduce motion” on, backdrop and panel only fade, in 120 ms.

## Responsive behavior

- The panel is up to 440 px wide (the screen minus 2rem on phones) with a maximum height of `100dvh` minus 2rem, scrolling inside when the content exceeds that.

## Notes for AI

- Assemble `Dialog`, `DialogTrigger asChild` around the button, and `DialogContent` with `title`; buttons that close go in `DialogClose asChild`. Import from `@/components/ryan-ui/dialog/dialog`.
- To close after an async action, control it with `open` and `onOpenChange` and pass `false` when it finishes, as the demo does.
- Use this file's `Dialog` as the root: under a plain Radix `Root`, `DialogContent` animates with CSS keyframes, without the Motion spring.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/dialog · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
