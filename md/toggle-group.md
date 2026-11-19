# Toggle group

> Uma fileira de botões de alternância, única ou múltipla, como numa barra de formatação.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/toggle-group
- Original description: A row of icon or text toggles, single or multiple: one pressed fill glides between options, or each fades in on its own and neighbours join, as in a formatting toolbar.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toggle-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toggle-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toggle-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/toggle-group.json`. Registry path, relative to the site address: `r/toggle-group.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/toggle-group/toggle-group.tsx`
  - `components/ryan-ui/toggle-group/toggle-group.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/toggle-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Formatting bars where bold, italic, and underline are on at the same time (`type="multiple"`).
- Alignment, active tool, or display mode, where only one applies at a time (`single` mode, the default).
- Compact icon groups inside editors and panels, with `size="sm"`.

## When not to use

- Use [`segmented-control`](segmented-control.md) to switch between views of a screen, with text labels and a stronger highlight.
- Use [`button-group`](button-group.md) when the buttons trigger actions instead of holding an on or off state.
- Use [`chip-group`](chip-group.md) for list filters, with many items that wrap.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import ToggleGroup, { ToggleGroupItem } from "@/components/ryan-ui/toggle-group/toggle-group";
import { Caption, Row, Stack } from "./_kit";

export default function ToggleGroupDemo() {
  const [style, setStyle] = useState<string[]>(["bold"]);
  const [align, setAlign] = useState("left");
  return (
    <Stack gap={5} align="center">
      <Row justify="center">
        <ToggleGroup type="multiple" label="Text style" value={style} onValueChange={setStyle}>
          <ToggleGroupItem value="bold" label="Bold"><Bold size={16} aria-hidden="true" /></ToggleGroupItem>
          <ToggleGroupItem value="italic" label="Italic"><Italic size={16} aria-hidden="true" /></ToggleGroupItem>
          <ToggleGroupItem value="underline" label="Underline"><Underline size={16} aria-hidden="true" /></ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup label="Alignment" value={align} onValueChange={setAlign}>
          <ToggleGroupItem value="left" label="Align left"><AlignLeft size={16} aria-hidden="true" /></ToggleGroupItem>
          <ToggleGroupItem value="center" label="Align center"><AlignCenter size={16} aria-hidden="true" /></ToggleGroupItem>
          <ToggleGroupItem value="right" label="Align right"><AlignRight size={16} aria-hidden="true" /></ToggleGroupItem>
        </ToggleGroup>
      </Row>
      <Caption>Style: {style.join(", ") || "none"}. Alignment: {align}. Adjacent pressed items join.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ToggleGroup`

A row of toggle buttons. In single mode one pressed fill glides from option to option; in multiple mode each fill fades in on its own and neighbours that are both on join into one shape. Arrow keys move focus, Space and Enter toggle.

Props: `ToggleGroupSingleProps | ToggleGroupMultipleProps`

### `ToggleGroupItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` | — | — |
| `label` | `string` | — | Accessible name, required when the item shows only an icon. Also used as the tooltip title unless title is set. |
| `children` (required) | `ReactNode` | — | — |
| `...props` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | Also accepts the props of this type, except `value` and `type`. |

### Exported types

| Type | Definition |
| --- | --- |
| `ToggleGroupSize` | `"sm" \| "md"` |

#### `ToggleGroupSingleProps`

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"single"` | One option at most is pressed. Choosing another moves the pressed state across; the pressed option stays pressed. |
| `value` | `string \| null` | — |
| `defaultValue` | `string \| null` | — |
| `onValueChange` | `(value: string) => void` | — |
| `...props` | `ToggleGroupBase` | Also accepts the props of this type. |

#### `ToggleGroupMultipleProps`

| Field | Type | Description |
| --- | --- | --- |
| `type` (required) | `"multiple"` | Each option toggles on its own. |
| `value` | `readonly string[]` | — |
| `defaultValue` | `readonly string[]` | — |
| `onValueChange` | `(value: string[]) => void` | — |
| `...props` | `ToggleGroupBase` | Also accepts the props of this type. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Move focus to the next item, wrapping around, without changing what is pressed. |
| `←` or `↑` | Move focus to the previous item. |
| `Home` or `End` | Go to the first or last enabled item. |
| `Space` or `Enter` | Press the focused item: in `multiple` they toggle, and in `single` they choose, without deselecting what is already chosen. |
| `Tab` | Enters the group at the last focused item, or the pressed one, and leaves in a single keystroke. |

## Accessibility

- In `single` mode the group is a `radiogroup` with `role="radio"` items and `aria-checked`; in `multiple`, it is a `group` of buttons with `aria-pressed`.
- The group `label` is required and becomes `aria-label`; for icon-only items, pass `label` on the item, which also becomes the tooltip (`title`).

## Motion

- In `single`, one fill slides to the chosen option on a no-overshoot spring.
- In `multiple`, each fill appears in place and adjacent on items merge into one shape over the gap between them; the icon sinks slightly on press.
- With “reduce motion” on, the fill changes place instantly and only color and opacity change, with no scale.

## Notes for AI

- Import `ToggleGroup` (default export) and `ToggleGroupItem` from `@/components/ryan-ui/toggle-group/toggle-group`; `type="multiple"` changes the value to `string[]`, and without `type` it is a `string`.
- In `single` you cannot deselect by clicking again; if “none” is a valid option, use `multiple` or a dedicated item for it.
- The arrows only move focus, even in `single`, unlike a native radio; the choice happens with Space, Enter, or click.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/toggle-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
