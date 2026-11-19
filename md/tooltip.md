# Tooltip

> Texto curto de apoio para controles pouco familiares.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tooltip
- Original description: Short supporting text for unfamiliar controls.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tooltip.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tooltip.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tooltip.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tooltip.json`. Registry path, relative to the site address: `r/tooltip.json`.

- npm packages: `@radix-ui/react-tooltip`, `motion`
- Files, once installed:
  - `components/ryan-ui/tooltip/tooltip.tsx`
  - `components/ryan-ui/tooltip/tooltip.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-tooltip motion`.
2. Copy the files listed above. The content of each one is in `r/tooltip.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Naming icon-only buttons in a toolbar, such as Bold, Italic, and Link.
- Showing a control's keyboard shortcut, such as “Bold (Ctrl+B)”.
- A short explanation for an unfamiliar control; if the text changes while the bubble is open, such as “Copy” to “Copied”, the swap is animated.

## When not to use

- Use [`hover-card`](hover-card.md) for rich previews of a person or a link.
- Use [`popover`](popover.md) when the content has buttons, links, or fields.
- Avoid it for essential information: on touch the tooltip does not open, so it should be visible on screen.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Bold, Italic, Link2, Share2 } from "lucide-react";
import Tooltip from "@/components/ryan-ui/tooltip/tooltip";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack, demoStage } from "./_kit";

export default function TooltipDemo() {
  // The first tip is already showing, inside the stage; hovering any other control hands over to it.
  const stage = demoStage();
  return (
    <Stack align="center" gap={5}>
      <Row justify="center">
        <Tooltip content="Bold (Ctrl+B)" defaultOpen container={stage}><Button variant="secondary" aria-label="Bold"><Bold size={16} aria-hidden="true" /></Button></Tooltip>
        <Tooltip content="Italic (Ctrl+I)" container={stage}><Button variant="secondary" aria-label="Italic"><Italic size={16} aria-hidden="true" /></Button></Tooltip>
        <Tooltip content="Insert link" side="bottom" container={stage}><Button variant="secondary" aria-label="Insert link"><Link2 size={16} aria-hidden="true" /></Button></Tooltip>
        <Tooltip content="Share with your team" side="right" container={stage}><Button variant="secondary" aria-label="Share"><Share2 size={16} aria-hidden="true" /></Button></Tooltip>
      </Row>
      <Caption>Hover or focus a control; moving between them is instant.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Tooltip`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` (required) | `ReactNode` | — | — |
| `children` (required) | `ReactElement` | — | — |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | — |
| `container` | `HTMLElement \| null` | — | Render the tooltip inside this element and limit collisions to it (used by the demo stages). |
| `defaultOpen` | `boolean` | `false` | Starts open, for previews and first-run hints. It stays until the person interacts (hover or focus on its trigger, Escape, a press elsewhere) or another tooltip opens; scrolling does not dismiss it. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | When the trigger is focused by keyboard, the tooltip appears; when leaving, it disappears. |
| `Esc` | Closes the tooltip without taking focus off the trigger. |

## Accessibility

- The bubble has `role="tooltip"` and, when open, the trigger gets `aria-describedby` pointing to it: the text is a description, not the control's name.
- On an icon-only button, pass `aria-label` on the button itself; the tooltip complements it, as in the demo.
- Radix ignores touch pointers and does not open the tooltip on focus caused by touch or click, so it does not appear on phones.

## Motion

- The first tooltip waits 250 ms and slides 3 px from the trigger, growing from 97%; while any is open, and for up to 300 ms after, the next opens instantly and only fades.
- When a text `content` changes with the bubble open, the new one rises, the old one exits upward, and the bubble adjusts its size on a spring.
- With “reduce motion” on, the bubble only fades and the text swap happens without displacement.

## Responsive behavior

- The bubble is up to 15rem wide and wraps the text into lines; it switches sides when it does not fit, with 12 px of clearance from the edge.

## Notes for AI

- The child must be a single element that accepts `ref` and receives focus, such as a `<button>`; the text goes in `content`.
- There is only `content`, `children`, and `side` (default `top`); the delay and the quick-switch window are fixed in the code.
- Each `Tooltip` brings its own Radix provider, so there is no need to wrap the app in a `TooltipProvider`. Import from `@/components/ryan-ui/tooltip/tooltip`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tooltip · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
