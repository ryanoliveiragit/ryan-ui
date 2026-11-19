# Select

> Campo de escolha compacto com um menu que funciona bem pelo teclado.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/select
- Original description: A compact choice field with a keyboard friendly menu.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/select.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/select.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/select.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/select.json`. Registry path, relative to the site address: `r/select.json`.

- npm packages: `@radix-ui/react-select`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/select/select.tsx`
  - `components/ryan-ui/select/select.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-select lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/select.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Choosing a value from a medium-sized list in a form, such as time zone, country, or category.
- When space is tight and the options do not need to stay visible all the time.
- Forms that need full keyboard support and native submission, with Radix `name` and `required`.

## When not to use

- Use [`radio-group`](radio-group.md) or [`segmented-control`](segmented-control.md) when there are few options and showing all of them is worthwhile.
- Use [`combobox`](combobox.md) when the list is long and people prefer to type to filter.
- Use [`multi-select`](multi-select.md) when more than one value can be chosen.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Select } from "@/components/ryan-ui/select/select";
import { Caption, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";

// Room for the open list below the trigger, so it never has to squeeze against the stage edge.
export const stage: DemoStage = { height: 540 };

export default function SelectDemo() {
  const [zone, setZone] = useState("");
  return (
    <Stack width={320} gap={4}>
      <Select
        label="Time zone"
        description="Used for scheduling and reminders."
        placeholder="Choose a time zone"
        value={zone}
        onValueChange={setZone}
        container={demoStage()}
        options={[
          { value: "pst", label: "Pacific Time (UTC-8)" },
          { value: "mst", label: "Mountain Time (UTC-7)" },
          { value: "est", label: "Eastern Time (UTC-5)" },
          { value: "gmt", label: "London (UTC+0)" },
          { value: "cet", label: "Central Europe (UTC+1)" },
          { value: "jst", label: "Tokyo (UTC+9)", disabled: true },
        ]}
      />
      <Caption>{zone ? `Selected: ${zone.toUpperCase()}` : "Open the menu and use the arrow keys."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Select`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `placeholder` | `string` | `"Select an option"` | — |
| `id` | `string` | — | — |
| `className` | `string` | — | — |
| `options` (required) | `{ value: string; label: string; disabled?: boolean }[]` | — | — |
| `container` | `HTMLElement \| null` | — | Render the list inside this element and limit collisions to it (used by the demo stages). |
| `...props` | `ComponentPropsWithoutRef<typeof SelectPrimitive.Root>` | — | Also accepts the props of this type, except `children`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` or `↓` or `↑` | On the button, open the menu with focus on the selected option. |
| `↓` or `↑` | In the menu, move between options, skipping disabled ones. |
| `Home` or `End` | Go to the first or last option. |
| `Enter` or `Space` | Choose the focused option, close the menu, and return focus to the button. |
| `Esc` | Closes the menu without changing the value. |
| `A–Z` | Typing the start of a label jumps to that option; with the menu closed, it changes the value right away. |

## Accessibility

- The button is the Radix `combobox`, tied to the visible `<label>` and to the `description` by `aria-describedby`; the real value sits in hidden text for screen readers while the visible copy animates.
- With the menu open, focus is trapped in the options and the rest of the page is hidden from assistive technology, and on close focus returns to the button.

## Motion

- The menu grows from the button edge with a slight offset and scale, and the arrow rotates; the button never scales, so the menu measures the right position.
- The displayed value rolls in the direction of the list, with an option further down entering from below and one further up from above, and the checkmark of the selected option appears with a slight blur.
- With “reduce motion” on, menu and value only fade and the checkmark appears without animation.

## Responsive behavior

- The menu follows the button width and has a maximum height of 320px or the space left on screen, with scroll arrows at the ends, and Radix repositions it so it does not leave the screen.

## Notes for AI

- Named import `Select`; pass `options` as `{ value, label, disabled? }` and use `value` with `onValueChange` or `defaultValue`.
- Do not use `value=""` on an option: the empty value is the state that shows the `placeholder`.
- For search inside the list prefer `combobox`, and for multiple choices, `multi-select`; `className` goes to the button, not to the whole field.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/select · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
