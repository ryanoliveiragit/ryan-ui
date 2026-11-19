# Split button

> Ação principal com um menu de alternativas ao lado.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/split-button
- Original description: A primary action with a menu of nearby alternatives.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/split-button.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/split-button.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/split-button.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/split-button.json`. Registry path, relative to the site address: `r/split-button.json`.

- npm packages: `@radix-ui/react-dropdown-menu`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/split-button/split-button.tsx`
  - `components/ryan-ui/split-button/split-button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dropdown-menu lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/split-button.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A main action with a few close alternatives in the menu, like Send, with Schedule and Save draft alongside.
- When the last chosen alternative should become the main action: change `label` and `icon` in `onSelect` and the button transforms in place.
- Exports with a default format and others in the menu, in the `secondary` variant.

## When not to use

- Use [`dropdown-menu`](dropdown-menu.md) when there is no clearly main action.
- Use [`button-group`](button-group.md) when the actions are independent and all deserve to stay in view.
- Use [`action-swap`](action-swap.md) when the action changes state on its own with each click, without the person choosing from a menu.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Calendar, Clock, Save, Send, Trash2 } from "lucide-react";
import SplitButton from "@/components/ryan-ui/split-button/split-button";
import { Caption, Room, Row, Stack, demoStage, useQuietFirstOpen } from "./_kit";

export default function SplitButtonDemo() {
  const [mode, setMode] = useState<"Send" | "Schedule" | "Save draft">("Send");
  const [last, setLast] = useState("Nothing yet");
  // The main button's menu is already open, inside the stage (non-modal, so the page keeps scrolling).
  const stage = demoStage();
  const quiet = useQuietFirstOpen();
  const icons = { Send: <Send size={15} aria-hidden="true" />, Schedule: <Calendar size={15} aria-hidden="true" />, "Save draft": <Save size={15} aria-hidden="true" /> };
  return (
    <Stack gap={4} align="center">
      <Room below={172}>
      <Row justify="center">
        <SplitButton
          label={mode}
          defaultOpen
          modal={false}
          onOpenAutoFocus={quiet}
          container={stage}
          icon={icons[mode]}
          onClick={() => setLast(`${mode} pressed`)}
          actions={[
            { label: "Send now", icon: <Send size={15} aria-hidden="true" />, onSelect: () => setMode("Send") },
            { label: "Schedule for later", icon: <Clock size={15} aria-hidden="true" />, onSelect: () => setMode("Schedule") },
            { label: "Save as draft", icon: <Save size={15} aria-hidden="true" />, onSelect: () => setMode("Save draft") },
            { label: "Discard", icon: <Trash2 size={15} aria-hidden="true" />, destructive: true, onSelect: () => setLast("Discarded") },
          ]}
        />
        <SplitButton
          variant="secondary"
          container={stage}
          label="Export"
          onClick={() => setLast("Exported as CSV")}
          actions={[
            { label: "Export as PDF", onSelect: () => setLast("Exported as PDF") },
            { label: "Export as JSON", onSelect: () => setLast("Exported as JSON") },
          ]}
        />
      </Row>
      </Room>
      <Caption>Pick an alternative from the menu and the main action morphs. Last: {last}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SplitButton`

The main action morphs its icon and label in place while its width follows on a spring; the menu half never scales, so the menu opens from a still anchor.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `actions` (required) | `SplitButtonAction[]` | — | — |
| `onClick` | `() => void` | — | — |
| `disabled` | `boolean` | — | — |
| `icon` | `ReactNode` | — | — |
| `variant` | `"primary" \| "secondary"` | `"primary"` | — |
| `defaultOpen` | `boolean` | — | — |
| `container` | `HTMLElement \| null` | — | — |
| `modal` | `boolean` | `true` | — |
| `onOpenAutoFocus` | `(event: Event) => void` | — | — |

### Exported types

#### `SplitButtonAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `onSelect` | `() => void` | — |
| `disabled` | `boolean` | — |
| `destructive` | `boolean` | — |
| `icon` | `ReactNode` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the main button, run `onClick`; on the arrow, open the menu with focus on the first alternative (`↓` also opens). |
| `↓` or `↑` | In the menu, move through the enabled alternatives and wrap around at the ends. |
| `Home` or `End` | In the menu, go to the first and last alternative. |
| `A–Z` | In the menu, typing the start of a label moves focus to that alternative. |
| `Esc` | Closes the menu and returns focus to the arrow; choosing an alternative with `Enter` or `Space` also closes it. |

## Accessibility

- There are two buttons: the main one, whose name is `label` (the animated text is `aria-hidden` and a hidden copy in `aria-live="polite"` announces the swap), and the arrow, with an `aria-label` built in English (“Send more actions”).
- The menu is Radix's `DropdownMenu` in modal mode: while open, focus is trapped in it and the page does not scroll; on close, focus returns to the arrow.
- `disabled` turns off both halves together; `disabled` alternatives are dimmed and skipped by the arrows.

## Motion

- When `label` changes, the shared letters stay still and only the new ones rise from a slight blur, in sequence; the icon swaps with scale, and the width follows on a spring with no overshoot.
- Pressing the main action shrinks the whole pill to 0.97; the arrow responds only with color, so Radix measures the anchor without scale, and rotates 180° with the menu open.
- The menu grows from the arrow, with the alternatives in sequence; with “reduce motion”, letters and width swap instantly, the pill does not shrink, and the menu only fades.

## Notes for AI

- `label` and `onClick` are the main action; `actions` lists the alternatives (`label`, `onSelect`, `icon`, `disabled`, `destructive`), and each one's `label` is the React key, so do not repeat labels.
- The component does not swap the main action on its own: to remember the last choice, keep it in the parent's state and pass the new `label` and `icon`, as the demo does.
- The arrow's `aria-label` is built in English (“… more actions”): in a Portuguese interface, adjust that string in the installed file; `variant="secondary"` is the lighter, smaller version.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/split-button · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
