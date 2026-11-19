# Multi-select

> Selecione vários valores mantendo o campo legível.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/multi-select
- Original description: Select several values while keeping the field readable.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/multi-select.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/multi-select.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/multi-select.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/multi-select.json`. Registry path, relative to the site address: `r/multi-select.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/multi-select/multi-select.tsx`
  - `components/ryan-ui/multi-select/multi-select.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/multi-select.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing several values from a short list inside a form, like teams, categories, or permissions.
- When the field needs to stay short: only the first `maxVisible` chosen appear as chips and the rest becomes a `+N` counter.
- When clearing everything at once is common: the clear button appears as soon as something is chosen.

## When not to use

- Use [`chip-group`](chip-group.md) when there are few options and all should stay in view, without opening a menu.
- Use [`tag-input`](tag-input.md) when the values are typed by the person, not chosen from a list.
- For long lists: the menu shows all the options at once, with no search and no scrolling of its own.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { MultiSelect } from "@/components/ryan-ui/multi-select/multi-select";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

const options = ["Design", "Engineering", "Marketing", "Sales", "Support", "Finance", "Legal", "People"].map((l) => ({ value: l.toLowerCase(), label: l }));

export default function MultiSelectDemo() {
  // The preview opens the menu on load (focus stays on the page); the space below the field is reserved for it.
  const [value, setValue] = useState<string[]>(["design", "engineering", "support"]);
  return (
    <Stack gap={3} width={360}>
      <div style={{ paddingBottom: 324 }}>
        <MultiSelect label="Teams" options={options} value={value} onValueChange={setValue} placeholder="Select teams" defaultOpen />
      </div>
      <Caption>{value.length} of {options.length} teams can see this report. Arrow keys move, Enter or Space toggles.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MultiSelect`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `options` (required) | `MultiSelectOption[]` | — | — |
| `value` | `string[]` | — | — |
| `defaultValue` | `string[]` | `[]` | — |
| `onValueChange` | `(value: string[]) => void` | — | — |
| `placeholder` | `string` | `"Select options"` | — |
| `description` | `string` | — | — |
| `maxVisible` | `number` | `2` | — |
| `disabled` | `boolean` | `false` | — |
| `defaultOpen` | `boolean` | `false` | Start with the menu open, without moving focus (for previews and onboarding). |
| `className` | `string` | — | — |

### Exported types

#### `MultiSelectOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `disabled` | `boolean` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | On the trigger, open the list and move the highlight through the enabled options, wrapping around at the ends. |
| `Enter` | With an option highlighted, checks or unchecks it without closing the list; with no highlight, opens or closes the list. |
| `Space` | On the trigger, opens or closes the list. |
| `Esc` | With focus on the trigger, closes the list. |
| `Tab` | Moves through the clear button and each option, which `Enter` or `Space` check; leaving with `Tab` does not close the list. |

## Accessibility

- The trigger is a `<button>` with `aria-haspopup="listbox"` and `aria-expanded`, named by the visible `label` and by the list of what was chosen, written out in full only for the screen reader.
- The list is a `role="listbox"` with `aria-multiselectable` and options with `aria-selected`, but the highlight moved by the arrows is not announced, because the trigger does not use `aria-activedescendant`.
- `description` appears under the field with no `aria-describedby` link, and the clear button has a fixed English name (`Clear selections`).

## Motion

- Each chosen chip opens its own space with a spring and grows from a slight blur, carrying its neighbors along; on exit, the space closes.
- The `+N` counter rolls up when it increases and down when it decreases, and each option's checkmark draws itself on check and retracts on uncheck.
- With “reduce motion” on, chips, counter, checkmarks, and menu only fade.

## Responsive behavior

- Takes the container width; each chip is cut at 9rem with an ellipsis, and the menu opens below with the field's width, with no portal and no maximum height.

## Notes for AI

- Controlled with `value` + `onValueChange` or uncontrolled with `defaultValue`; the array keeps the order in which the options were checked, and the chips follow that order.
- Choosing does not close the menu, which is made for checking several options in a row: it closes with a click outside or on the trigger, with `Space` or `Esc` on the trigger, or on clearing everything.
- There is no `name` prop: in a native form, generate the `<input type="hidden">` from `value`; `maxVisible` (default 2) defines how many chips appear before the `+N`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/multi-select · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
