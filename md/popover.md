# Popover

> Pequena superfície ancorada para informações de contexto.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/popover
- Original description: A small anchored surface for contextual information.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/popover.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/popover.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/popover.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/popover.json`. Registry path, relative to the site address: `r/popover.json`.

- npm packages: `@radix-ui/react-popover`
- Files, once installed:
  - `components/ryan-ui/popover/popover.tsx`
  - `components/ryan-ui/popover/popover.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-popover`.
2. Copy the files listed above. The content of each one is in `r/popover.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A small panel next to a button, such as the share link with a copy action.
- Quick settings or filters that people open, change, and close without leaving context.
- Contextual information with one or two controls, which should not block the rest of the page.

## When not to use

- Use [`tooltip`](tooltip.md) for a short, non-interactive text that names a control.
- Use [`dropdown-menu`](dropdown-menu.md) for a list of actions.
- Use [`dialog`](dialog.md) when the decision needs to block the page until it is made.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ryan-ui/popover/popover";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Room, Stack, demoStage, useQuietFirstOpen } from "./_kit";

export default function PopoverDemo() {
  // O preview já abre o painel, preso ao palco: dá para ver o gatilho e o painel juntos, inteiros.
  const quiet = useQuietFirstOpen();
  return (
    <Room below={168}>
      <Popover defaultOpen>
        <PopoverTrigger asChild><Button variant="secondary">Share link</Button></PopoverTrigger>
        <PopoverContent container={demoStage()} align="center" onOpenAutoFocus={quiet}>
          <Stack gap={3} style={{ width: 260 }}>
            <strong style={{ color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>Anyone with the link can view</strong>
            <Caption>atlas.example.com/p/q3-roadmap</Caption>
            <PopoverClose asChild><Button size="sm">Copy link</Button></PopoverClose>
          </Stack>
        </PopoverContent>
      </Popover>
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PopoverTrigger`

The trigger anchors the panel, so it opts out of press-scale: a scaled rect measured on open would shift the panel as the trigger springs back.

No props of its own: accepts those of the element or primitive it wraps.

### `PopoverContent`

No props of its own: accepts those of the element or primitive it wraps.

### Other exports

- `Popover` (value)
- `PopoverClose` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the trigger, open or close the panel; on open, focus goes to the first control inside. |
| `Tab` or `Shift + Tab` | Cycle through the panel controls. |
| `Esc` | Closes the panel and returns focus to the trigger. |

## Accessibility

- It is the non-modal Radix Popover: the trigger gets `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`, and the panel has `role="dialog"`.
- The panel has no accessible name by default; pass `aria-label` or `aria-labelledby` to `PopoverContent`.
- The page behind stays accessible and scrollable; clicking outside or moving focus outside closes the panel.

## Motion

- The panel starts a few pixels toward the trigger, at 97% size, and settles with a CSS spring curve; it leaves faster than it enters.
- These are transitions, not keyframes: closing mid-open, or reopening during the close, reverses from wherever the panel is.
- With “reduce motion” on, the panel only fades.

## Responsive behavior

- The width goes from 12rem to `min(22rem, 100vw - 20px)`, and the panel switches sides when it does not fit, with 10 px of clearance from the edge (`collisionPadding`).

## Notes for AI

- Assemble `Popover`, `PopoverTrigger asChild` around the button, and `PopoverContent`; actions that close go in `PopoverClose asChild`.
- The defaults are `align="start"` and `sideOffset={6}`; `side` and the other Radix props pass straight through to `PopoverContent`.
- Import from `@/components/ryan-ui/popover/popover`; `PopoverContent` already comes in a portal, with 1rem of inner padding, so do not wrap the content in another card.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/popover · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
