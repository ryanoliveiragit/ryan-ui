# Morph select

> Um select cujo gatilho cresce até virar a lista, com destaque deslizante e busca por digitação.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/morph-select
- Original description: A select whose trigger grows into the list, with a gliding highlight and type-ahead.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morph-select.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morph-select.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morph-select.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morph-select.json`. Registry path, relative to the site address: `r/morph-select.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/morph-select/morph-select.tsx`
  - `components/ryan-ui/morph-select/morph-select.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/morph-select.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Compact property selectors in bars and panels, like owner, status, or priority, where the trigger takes only the width of the chosen label.
- Options that need an icon or avatar and a detail on the right (`icon`, `meta`), split into groups with a heading.
- Lists of up to a few hundred options: above eight, a search field takes the trigger's place on open (`searchable="auto"`), and on smaller ones there is search by letter.

## When not to use

- Use [`select`](select.md) in forms with aligned fields: here the trigger changes width with the chosen label, and there is no `description` or error state.
- Use [`multi-select`](multi-select.md) when the person can choose several values.
- Use [`combobox`](combobox.md) when typing is the main path and the field should look like a text field from the start.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import MorphSelect from "@/components/ryan-ui/morph-select/morph-select";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const img = (id: Parameters<typeof avatar>[0]) => <img src={avatar(id)} alt="" width={20} height={20} style={{ borderRadius: "50%" }} />;

const items = [
  { label: "Design", options: [
    { value: "emma", label: "Emma Collins", meta: "Designer", icon: img("emma-collins") },
    { value: "jasmine", label: "Jasmine Brooks", meta: "Lead", icon: img("jasmine-brooks") },
  ] },
  { label: "Engineering", options: [
    { value: "marcus", label: "Marcus Johnson", meta: "Frontend", icon: img("marcus-johnson") },
    { value: "olivia", label: "Olivia Bennett", meta: "Platform", icon: img("olivia-bennett") },
    { value: "daniel", label: "Daniel Kim", meta: "Backend", icon: img("daniel-kim") },
  ] },
];

/** Width of the open list: the trigger sits at the left of a box this wide, so the list it grows into is centered. */
const PANEL = 272;

export default function MorphSelectDemo() {
  // The preview opens the list on load (focus stays on the page); the space it grows into is reserved below.
  const [value, setValue] = useState<string | null>("marcus");
  return (
    <div style={{ display: "flex", width: `min(${PANEL}px, 100%)`, flexDirection: "column", alignItems: "flex-start", gap: "var(--space-3)" }}>
      <div style={{ paddingBottom: 268 }}>
        <MorphSelect label="Assignee" items={items} value={value} onValueChange={(v) => setValue(v)} placeholder="Choose a teammate" defaultOpen />
      </div>
      <Caption>Glide with the arrows, or type a name to jump.</Caption>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MorphSelect`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Visible label, also the accessible name of the trigger and the list. |
| `hideLabel` | `boolean` | `false` | Keeps the label for assistive technology only. |
| `items` (required) | `MorphSelectItem[]` | — | — |
| `value` | `string \| null` | — | — |
| `defaultValue` | `string \| null` | `null` | — |
| `onValueChange` | `(value: string, option: MorphSelectOption) => void` | — | — |
| `placeholder` | `string` | `"Select"` | — |
| `searchable` | `boolean \| "auto"` | `"auto"` | Shows a search field in place of the trigger when open. "auto" turns it on above eight options. |
| `searchPlaceholder` | `string` | — | — |
| `panelWidth` | `number` | `272` | Width of the open surface in px. It never gets narrower than the trigger. Defaults to 272. |
| `maxListHeight` | `number` | `296` | Tallest the option list gets before it scrolls, in px. Defaults to 296. |
| `align` | `"start" \| "end"` | `"start"` | Which edge of the trigger stays put while the surface grows. |
| `name` | `string` | — | Adds a hidden input for native form submission. |
| `disabled` | `boolean` | `false` | — |
| `defaultOpen` | `boolean` | `false` | Start with the list open, without moving focus (for previews and onboarding). Later opens move focus as usual. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `MorphSelectItem` | `MorphSelectOption \| MorphSelectGroup` |

#### `MorphSelectOption`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | A 20px mark shown before the label, in the list and in the trigger. An avatar or a plain icon. |
| `meta` | `string` | Short trailing detail such as an offset or a count. Rendered with tabular numerals. |
| `keywords` | `string` | Extra words that match this option when searching. |
| `disabled` | `boolean` | — |

#### `MorphSelectGroup`

A labelled run of options.

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `options` (required) | `MorphSelectOption[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` or `↓` or `↑` | With the list closed, open it with the highlight on the chosen option, or on the first; a letter also opens it, already filtering the search by it or, without search, landing on the option that starts with it. |
| `↓` or `↑` | With the list open, move the highlight one option, stopping at the ends; without a search field, letters go to the next option with that initial. |
| `Page Down` or `Page Up` | Move the highlight eight options. |
| `Home` or `End` | Take the highlight to the first or last enabled option, opening the list if needed; in the search field with text, they move the cursor. |
| `Enter` or `Space` | With the list open, choose the highlighted option and return focus to the trigger; in the search field only `Enter` chooses, and `Alt + ↑` also works. |
| `Esc` | Closes without changing the choice and returns focus to the trigger; `Tab` also closes and moves on to the next control. |

## Accessibility

- The trigger is a `<button role="combobox">` tied to the visible `label`, with `aria-expanded`, `aria-controls`, and `aria-activedescendant`: without search, focus stays on it while the highlight moves through the list.
- With search, focus goes to the field, which takes on the `combobox` role, and a `role="status"` region announces how many options match; groups are `role="group"` and options have `aria-selected` and `aria-disabled`.
- `placeholder` and `searchPlaceholder` change the empty texts, but the search name (`Search …`), the close button name (`Close …`), the count, and the no-results notice are fixed in English.

## Motion

- The trigger itself grows into the list: width, height, and corners follow a spring, and the options appear just behind the edge; on close, the surface shrinks back.
- A highlight slides between options and, on choosing, the label leaves the list and flies to the trigger, which fits its width to the new text with a spring.
- With “reduce motion” on, sizes and highlight change instantly and the value only fades, without the label's flight.

## Responsive behavior

- Closed, the trigger has the width of the chosen label, up to `min(20rem, 100vw - 2rem)`; open, the surface uses `panelWidth` (default 272 px), never less than the trigger nor more than `100vw - 2rem`.
- The list scrolls above `maxListHeight` (default 296 px) and the surface grows over the page from the `align` edge, with no portal: an ancestor with `overflow: hidden` clips it.

## Performance

- All options stay mounted even with the list closed (hidden and `inert`) and there is no virtualization: the component itself is meant for up to a few hundred options.

## Notes for AI

- `items` mixes options `{ value, label, icon?, meta?, keywords?, disabled? }` and groups `{ label, options }`; use `value` + `onValueChange(value, option)` or `defaultValue`, with `null` for nothing chosen.
- `searchable` defaults to `"auto"` and turns on search above eight options; pass `true` or `false` to fix it. The search looks at `label`, `meta`, and `keywords`.
- `icon` accepts a 20 px node, like an `<img>` avatar or an icon, and also appears on the trigger; `hideLabel` hides the visible label and `name` sends the value in a hidden field.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/morph-select · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
