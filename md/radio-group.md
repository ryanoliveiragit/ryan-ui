# Radio group

> Escolha uma opção entre várias visíveis, com um destaque que desliza até a linha escolhida.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/radio-group
- Original description: Choose one option from a visible set.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-group.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-group.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-group.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/radio-group.json`. Registry path, relative to the site address: `r/radio-group.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/radio-group/radio-group.tsx`
  - `components/ryan-ui/radio-group/radio-group.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/radio-group.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Single choice among a few options that should all be visible, such as billing plan or delivery frequency.
- Forms where each option has an explanation line below its name.
- When you want native radio behavior (arrows, Tab, and form submission) with an animated highlight.

## When not to use

- Use [`radio-cards`](radio-cards.md) when each option needs a price, icon, or card appearance.
- Use [`select`](select.md) when the list is long or space is tight.
- Use [`segmented-control`](segmented-control.md) to switch between views of the same screen.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { RadioGroup } from "@/components/ryan-ui/radio-group/radio-group";
import { Caption, Stack } from "./_kit";

export default function RadioGroupDemo() {
  const [plan, setPlan] = useState("pro");
  return (
    <Stack width={380} gap={4}>
      <RadioGroup
        label="Billing plan"
        value={plan}
        onValueChange={setPlan}
        options={[
          { value: "starter", label: "Starter", description: "For side projects, up to 3 members" },
          { value: "pro", label: "Pro", description: "Unlimited projects and priority support" },
          { value: "enterprise", label: "Enterprise", description: "SSO, audit logs and a dedicated manager" },
        ]}
      />
      <Caption>Current plan: {plan}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RadioGroup`

One highlight travels to the chosen row while the new dot springs in and the old one shrinks away, so a change reads as a single physical move. Arrow keys take the same path. Rows and text never resize.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `options` (required) | `{ value: string; label: string; description?: string }[]` | — | — |
| `value` (required) | `string` | — | — |
| `onValueChange` (required) | `(value: string) => void` | — | — |
| `name` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `→` | Select the next option, as in any native radio, and the highlight slides along. |
| `↑` or `←` | Select the previous option. |
| `Space` | Checks the focused option when none is checked. |
| `Tab` | Enters the group at the checked option and leaves in a single keystroke. |

## Accessibility

- It is a `fieldset` with `legend` and native radios sharing the same `name`, so role, group name, and navigation come from the browser.
- The name and description of each option live inside the `<label>`, and both become part of the radio's accessible name.

## Motion

- A single highlight travels to the chosen row on a no-overshoot spring, while the new dot grows and the old one shrinks; rows and texts never change size.
- On press, the mark sinks quickly and shows a faint preview dot, and the real dot grows on release.
- With “reduce motion” on, highlight and dot change instantly and the color and press transitions are turned off.

## Notes for AI

- It is always controlled: `value` and `onValueChange` are required and there is no `defaultValue`, so keep the choice in a `useState`.
- Named import, `import { RadioGroup } from "@/components/ryan-ui/radio-group/radio-group"`; `label` becomes the `legend` and each option is `{ value, label, description? }`, text only.
- Pass `name` inside a native form; without it, the radios use a generated name.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/radio-group · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
