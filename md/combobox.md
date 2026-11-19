# Combobox

> Pesquise e escolha em uma lista sem sair do campo.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/combobox
- Original description: Search and select from a list without leaving the field.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/combobox.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/combobox.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/combobox.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/combobox.json`. Registry path, relative to the site address: `r/combobox.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/combobox/combobox.tsx`
  - `components/ryan-ui/combobox/combobox.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/combobox.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing a value from a list too long to scan without search: country, time zone, owner.
- When people search for terms that are not in the label: each option's `keywords` go into the filter.
- Form fields that need a visible label and help text: `label` and `description` already come tied to the field.

## When not to use

- Use [`select`](select.md) for short lists, where typing does not help.
- Use [`multi-select`](multi-select.md) when the person can choose several values.
- Use [`command-palette`](command-palette.md) when the results are actions or destinations, not a field's value.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Combobox } from "@/components/ryan-ui/combobox/combobox";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

const countries = ["Argentina", "Australia", "Brazil", "Canada", "Chile", "Côte d’Ivoire", "Denmark", "France", "Germany", "India", "Ireland", "Japan", "México", "Netherlands", "Portugal", "Spain", "Sweden", "United Kingdom", "United States"].map((c) => ({ value: c, label: c }));

export default function ComboboxDemo() {
  // The preview opens the list on load, with the space below the field reserved for it. Typing ignores accents
  // ("mexico" finds México), and values with spaces are fine.
  const [value, setValue] = useState("");
  return (
    <Stack gap={3} width={360}>
      <div style={{ paddingBottom: 316 }}>
        <Combobox label="Country" options={countries} value={value} onValueChange={setValue} placeholder="Search countries…" defaultOpen />
      </div>
      <Caption>{value ? `Shipping to ${value}.` : "Type to filter (accents optional), then pick with the keyboard or mouse."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Combobox`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `options` (required) | `ComboboxOption[]` | — | — |
| `value` | `string` | — | — |
| `defaultValue` | `string` | `""` | — |
| `onValueChange` | `(value: string) => void` | — | — |
| `description` | `string` | — | — |
| `placeholder` | `string` | `"Search or select…"` | — |
| `emptyMessage` | `string` | `"No matches found"` | — |
| `defaultOpen` | `boolean` | `false` | Start with the list open, without focusing the field (for previews and onboarding). |
| `className` | `string` | — | — |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type, except `value`, `defaultValue`, `onChange` and `placeholder`. |

### Exported types

#### `ComboboxOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `disabled` | `boolean` | — |
| `keywords` | `string[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | Open the list if it is closed; when open, move the highlight through the enabled options, wrapping around at the ends. |
| `Enter` | Chooses the highlighted option, closes the list, and keeps focus in the field. |
| `Esc` | Closes the list and discards the typed text, keeping the previous selection. |

## Accessibility

- The field is a `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, and `aria-activedescendant`; focus stays in the field while the arrows move through the options.
- `label` is required and becomes a visible `<label>`, `description` goes in via `aria-describedby`, and the empty-list message is a `role="status"`; the clear button has a fixed English name (`Clear selection`).
- The list opens as soon as the field gets focus and does not close when leaving with `Tab`: only with `Esc`, a choice, or a click outside.

## Motion

- The list enters with a fade and a slight growth from the top, and its height follows the filter with a spring with no overshoot.
- The chosen label settles into the field rising from a slight blur, the clear button grows as it appears, and the arrow rotates 180° with the list open.
- With “reduce motion” on, only short fades remain and the height changes instantly.

## Responsive behavior

- The list has the width of the field, always opens downward, and scrolls inside above `min(300px, 40vh)`; long labels are cut with an ellipsis.
- It is positioned inside the component itself, with no portal: an ancestor with `overflow: hidden` clips it.

## Performance

- All options that pass the filter are rendered, with no virtualization, and the list height is measured by a `ResizeObserver` on every filter change.

## Notes for AI

- Controlled with `value` + `onValueChange` or uncontrolled with `defaultValue`; clearing the selection calls `onValueChange("")`.
- The filter is local, by substring of `label` and `keywords`; it ignores case but not accents (`sao` does not find “São Paulo”) and the typed text is not exposed, so it does not work for server-side search.
- Give each option a `value` with no spaces, because it goes into the `id` used by `aria-activedescendant`; the other props and the `ref` go to the `<input>`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/combobox · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
