# Drawer

> Painel lateral temporário para tarefas focadas.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/drawer
- Original description: A temporary side surface for focused work.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/drawer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/drawer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/drawer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/drawer.json`. Registry path, relative to the site address: `r/drawer.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/drawer/drawer.tsx`
  - `components/ryan-ui/drawer/drawer.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/drawer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Editing a record or profile without losing the list view, with the form in a side panel.
- List filters opened from the left (`side="left"`) and applied on close.
- Details of a selected row that stay on screen while the panel leaves, with `useDrawerItem`.

## When not to use

- Use [`dialog`](dialog.md) for a short decision that needs full attention.
- Use [`bottom-sheet`](bottom-sheet.md) on mobile when the panel should rest at different heights and follow the finger.
- Use [`resizable-panels`](resizable-panels.md) when the side panel is a permanent part of the layout.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import Drawer, { DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ryan-ui/drawer/drawer";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Field, Row, Stack, demoStage, useQuietFirstOpen } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const input: React.CSSProperties = { height: 36, padding: "0 var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-control)", background: "var(--surface)", color: "var(--text-primary)", font: "inherit", width: "100%" };

export default function DrawerDemo() {
  // On the docs page both drawers slide inside the preview, and the profile one is already open: the page keeps scrolling.
  const [container] = useState(demoStage);
  const quiet = useQuietFirstOpen();
  return (
    <Stack align="center" gap={4}>
      <Row justify="center">
        <Drawer defaultOpen={container !== null} modal={!container}>
          <DrawerTrigger asChild><Button variant="secondary">Edit profile</Button></DrawerTrigger>
          <DrawerContent container={container} onOpenAutoFocus={quiet} title="Edit profile" description="Update how you appear to your team.">
            <Stack gap={4}>
              <Field label="Display name"><input style={input} defaultValue="Emma Collins" /></Field>
              <Field label="Role"><input style={input} defaultValue="Product designer" /></Field>
              <Row justify="flex-end"><DrawerClose asChild><Button variant="ghost">Cancel</Button></DrawerClose><DrawerClose asChild><Button>Save</Button></DrawerClose></Row>
            </Stack>
          </DrawerContent>
        </Drawer>
        <Drawer modal={!container}>
          <DrawerTrigger asChild><Button variant="ghost">Filters (left)</Button></DrawerTrigger>
          <DrawerContent container={container} side="left" title="Filters" description="Narrow the list of invoices.">
            <Stack gap={3}><Caption>Status: Paid, Pending, Overdue</Caption><DrawerClose asChild><Button>Apply filters</Button></DrawerClose></Stack>
          </DrawerContent>
        </Drawer>
      </Row>
      <Caption>Opens as a side surface; Escape, the scrim or the close button dismisses it.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Drawer`

No props of its own: accepts those of the element or primitive it wraps.

### `DrawerContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `children` (required) | `ReactNode` | — | — |
| `side` | `"left" \| "right" \| "top" \| "bottom"` | `"right"` | — |
| `container` | `HTMLElement \| null` | — | Renders the drawer inside this element instead of the page body, anchored to its edges. The element needs position: relative and overflow: hidden. Pair it with `modal={false}` on Drawer, so the page around the element keeps scrolling and stays usable while the drawer is open (Escape, the close button and a press on the scrim still close it). |
| `...props` | `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>` | — | Also accepts the props of this type. |

### Other exports

- `useDrawerItem` (hook)
- `DrawerTrigger` (value)
- `DrawerClose` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` or `Shift + Tab` | Move through the panel controls without leaving it; on open, focus goes to the first control, the close button. |
| `Esc` | Closes the panel and returns focus to the `DrawerTrigger`. |

## Accessibility

- It is a Radix modal dialog: `title` gives the name, `description` the description, focus is trapped in the panel, and the rest of the page leaves the accessibility tree.
- The close button is named “Close drawer”, fixed in English in the code.

## Motion

- The panel enters from the `side` edge on a no-overshoot spring and leaves faster, fading only in the last stretch so the shadow does not vanish abruptly.
- The header is the handle: dragging toward the edge moves the panel, the other side resists like elastic, and passing a third of the panel or making a fast gesture closes it keeping the velocity.
- With “reduce motion” on, there is no drag and the panel only fades on enter and exit.

## Responsive behavior

- On the sides the panel is up to 30rem and, below 40rem, takes almost the full width, with smaller corners and spacing; at the top or bottom it takes the full width, up to 32rem tall.
- With `container`, the panel opens inside an element, anchored to its edges; that element needs `position: relative` and `overflow: hidden`.

## Notes for AI

- Assemble `Drawer`, `DrawerTrigger asChild`, and `DrawerContent` with `title` and `side`; actions that close go in `DrawerClose asChild`. Import from `@/components/ryan-ui/drawer/drawer`.
- When opening from a selected row, pass the item through `useDrawerItem(item)` and render the result, so the content does not vanish while the panel leaves.
- Drag-to-close only exists with this file's `Drawer` root; under a plain Radix `Root`, the panel animates with CSS keyframes and does not drag.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/drawer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
