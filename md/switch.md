# Switch

> Um interruptor tátil para ajustes que passam a valer na hora.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/switch
- Original description: A tactile toggle for settings that take effect immediately.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/switch.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/switch.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/switch.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/switch.json`. Registry path, relative to the site address: `r/switch.json`.

- npm packages: `@radix-ui/react-switch`, `motion`
- Files, once installed:
  - `components/ryan-ui/switch/switch.tsx`
  - `components/ryan-ui/switch/switch.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-switch motion`.
2. Copy the files listed above. The content of each one is in `r/switch.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Preferences that take effect immediately, such as notifications, sync, or features in testing.
- Lists of on and off settings, one per row, with the label beside it.

## When not to use

- Use [`checkbox`](checkbox.md) when the choice only counts after submitting a form or is part of a list of options.
- Use [`segmented-control`](segmented-control.md) when the two states have names of their own, such as Monthly and Yearly.
- Use [`theme-switch`](theme-switch.md) to switch between light and dark themes with a page transition.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import Switch from "@/components/ryan-ui/switch/switch";
import { Caption, Stack } from "./_kit";

export default function SwitchDemo() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  return (
    <Stack width={320} gap={4}>
      <Switch label="Push notifications" checked={push} onCheckedChange={setPush} />
      <Switch label="Weekly email digest" checked={email} onCheckedChange={setEmail} />
      <Switch label="Beta features (managed by admin)" defaultChecked disabled />
      <Caption>Push {push ? "on" : "off"}, digest {email ? "on" : "off"}. Changes apply immediately.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Switch`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | — |
| `...props` | `ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>` | — | Also accepts the props of this type. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Space` or `Enter` | Turn on or off; holding Space, the thumb widens as under a finger and travels on release. |

## Accessibility

- It is the Radix `Switch`: a `<button role="switch">` with `aria-checked`, and inside a `<form>` a hidden field submits `name` and `value`.
- The `label` sits inside the button, so clicking the text also toggles, and it becomes the accessible name; without `label`, pass `aria-label` or `aria-labelledby`.

## Motion

- The thumb travels on a no-overshoot spring and stops exactly in the state it announces; on press, it widens toward the other side, as under a finger.
- Changes without a press, such as via Enter or coming from state, get a short stretch midway, and the track switches to the on color.
- With “reduce motion” on, the thumb changes side instantly and the color transitions are turned off.

## Notes for AI

- Use it for settings that take effect immediately, without a save button: `checked` with `onCheckedChange` for controlled, or `defaultChecked`.
- For text on the left and the switch on the right in a settings row, leave `label` out, write your own text, and link the two with `aria-labelledby`.
- It accepts the Radix props (`disabled`, `required`, `name`, `value`); in a form, the value submitted when on is `on`, unless you pass `value`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/switch · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
