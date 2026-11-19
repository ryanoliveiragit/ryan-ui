# Chip group

> Filtre por poucas facetas com chips que se transformam ao serem escolhidos.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/chip-group
- Original description: Filter by a few facets with chips that morph as you pick them.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chip-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chip-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chip-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/chip-group.json`. Registry path, relative to the site address: `r/chip-group.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/chip-group/chip-group.tsx`
  - `components/ryan-ui/chip-group/chip-group.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/chip-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Filtering a list by a few facets people turn on and off often: topics, status, tags.
- Longer sets where only the first ones need to appear: `maxVisible` collapses the rest behind a “+N more” chip and keeps the selected ones in view.
- Single choice that can be empty: with `multiple={false}`, clicking the checked chip clears the selection.

## When not to use

- Use [`segmented-control`](segmented-control.md) when exactly one option must always be selected.
- Use [`multi-select`](multi-select.md) when the options should stay collapsed inside a form field, with label and description.
- Use [`tag-input`](tag-input.md) when the values are typed by the person, not chosen from a fixed set.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import ChipGroup from "@/components/ryan-ui/chip-group/chip-group";
import { Caption, Stack } from "./_kit";

const topics = ["Design systems", "Accessibility", "Motion", "Typography", "Performance", "Testing", "Tooling", "Research"].map((label) => ({ value: label.toLowerCase().replace(/ /g, "-"), label }));
const sizes = [{ value: "s", label: "Small" }, { value: "m", label: "Medium" }, { value: "l", label: "Large" }];

export default function ChipGroupDemo() {
  const [value, setValue] = useState<string[]>(["motion"]);
  const [size, setSize] = useState<string[]>(["m"]);
  return (
    <Stack gap={6} width={420}>
      <Stack gap={2}>
        <ChipGroup label="Topics" options={topics} value={value} onValueChange={setValue} maxVisible={5} />
        <Caption>{value.length ? `${value.length} selected` : "Nothing selected"}. Extra chips fold behind “more”.</Caption>
      </Stack>
      <Stack gap={2}>
        <Caption>Single choice</Caption>
        <ChipGroup label="Size" options={sizes} value={size} onValueChange={setSize} multiple={false} />
      </Stack>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ChipGroup`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` (required) | `ChipOption[]` | — | — |
| `value` (required) | `string[]` | — | — |
| `onValueChange` (required) | `(value: string[]) => void` | — | — |
| `label` (required) | `string` | — | Accessible name of the group, such as “Topics”. |
| `multiple` | `boolean` | `true` | Allow several chips at once. In single mode the selected chip can still be cleared. |
| `maxVisible` | `number` | `Infinity` | Chips shown before the rest fold behind a “+N more” chip. Chips selected when it folds stay in view. |
| `className` | `string` | — | — |

### Exported types

#### `ChipOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `↓` | Moves focus to the next chip; from the last it wraps to the first. |
| `←` or `↑` | Moves focus to the previous chip; from the first it goes to the last. |
| `Home` or `End` | Moves focus to the first or last chip. |
| `Enter` or `Space` | Checks or unchecks the focused chip; on the overflow chip, shows or collapses the rest. |
| `Tab` | Enters and leaves the group through a single chip: the last focused, the first selected, or the first in the list. |

## Accessibility

- The group is a `role="group"` named by `label` (required) and each chip is a `<button>` with `aria-pressed`; the arrows only move focus, they do not change the selection.
- The overflow chip exposes `aria-expanded`, but its `+N more` and `Show less` texts are fixed in English.
- The checked state does not depend on color alone: besides the tone, a checkmark sign enters before the label.

## Motion

- On check, the checkmark grows and draws itself in the space the label opens by sliding, and the chip border follows with a spring.
- Neighboring chips slide to the new place, even when changing lines, and the group height follows with a spring when the number of lines changes.
- With “reduce motion” on, widths and positions swap instantly and revealed chips only fade.

## Responsive behavior

- Chips wrap (`flex-wrap`) and a label wider than the container is cut with an ellipsis.

## Performance

- Each chip keeps a `ResizeObserver` and a layout animation, and the group another observer for the height: it suits a few facets, and `maxVisible` avoids mounting dozens of chips at once.

## Notes for AI

- It is always controlled and `value` is always an array, even with `multiple={false}` (one item or empty); `label` is required.
- `options` is `{ value, label }[]` with a unique `value`; in multiple mode the returned array follows the order of `options`, not the order of clicks.
- With `maxVisible`, selected chips stay in view on collapse, so the “+N” counts only those that were hidden.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/chip-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
