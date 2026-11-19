# Checkbox

> Uma escolha binária com estado preciso e fácil de ler.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/checkbox
- Original description: A binary choice with a precise, legible state.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/checkbox.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/checkbox.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/checkbox.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/checkbox.json`. Registry path, relative to the site address: `r/checkbox.json`.

- npm packages: `@radix-ui/react-checkbox`, `motion`
- Files, once installed:
  - `components/ryan-ui/checkbox/checkbox.tsx`
  - `components/ryan-ui/checkbox/checkbox.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-checkbox motion`.
2. Copy the files listed above. The content of each one is in `r/checkbox.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Independent options that can be checked in any combination, like notification preferences.
- Explicit acceptance in a form (terms, consent), which only counts on submit.
- A “select all” box that summarizes a group: `checked="indeterminate"` shows the dash when only some of the items are checked.

## When not to use

- Use [`switch`](switch.md) when the change takes effect immediately, with no save button.
- Use [`radio-group`](radio-group.md) when only one option can be checked.
- Use [`chip-group`](chip-group.md) for filters people turn on and off often above a list.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Checkbox } from "@/components/ryan-ui/checkbox/checkbox";
import { Caption, Stack } from "./_kit";

export default function CheckboxDemo() {
  const [items, setItems] = useState({ updates: true, digest: false, security: true });
  const all = Object.values(items).every(Boolean);
  const some = Object.values(items).some(Boolean);
  const set = (k: keyof typeof items) => (c: boolean | "indeterminate") => setItems((s) => ({ ...s, [k]: c === true }));
  return (
    <Stack gap={4} width={380}>
      <Checkbox
        label="All notifications"
        checked={all ? true : some ? "indeterminate" : false}
        onCheckedChange={(c) => setItems({ updates: c === true, digest: c === true, security: c === true })}
      />
      <Stack gap={3} style={{ paddingLeft: "var(--space-6)" }}>
        <Checkbox label="Product updates" description="New features and improvements." checked={items.updates} onCheckedChange={set("updates")} />
        <Checkbox label="Weekly digest" description="A Monday summary of your workspace." checked={items.digest} onCheckedChange={set("digest")} />
        <Checkbox label="Security alerts" description="Sign-ins from new devices." checked={items.security} onCheckedChange={set("security")} />
        <Checkbox label="Billing emails" description="Managed by your admin." checked disabled />
      </Stack>
      <Caption>The top box turns indeterminate when only some are on.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Checkbox`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | — |
| `description` | `string` | — | — |
| `...props` | `ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>` | — | Also accepts the props of this type. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Space` | Checks or unchecks the focused box; `Enter` does not toggle. |

## Accessibility

- Uses Radix's `Checkbox`: a button with `role="checkbox"` and `aria-checked`, which is `mixed` in the indeterminate state.
- `label` generates a `<label>` tied to the control and `description` goes in via `aria-describedby`; without `label`, pass `aria-label`, otherwise the accessible name becomes the generic `Checkbox`.
- The click area is 44 px on a side, although the drawn square is 18 px, and clicking the label also toggles.

## Motion

- The fill grows on a short spring while the checkmark stroke draws itself; on uncheck, the stroke retracts.
- The checkmark and the indeterminate dash have the same three points, so one transforms into the other instead of swapping.
- With “reduce motion” on, the state change is instant and the square does not shrink when pressed.

## Notes for AI

- Controlled with `checked` + `onCheckedChange` or uncontrolled with `defaultChecked`; the value can be `true`, `false`, or `"indeterminate"`.
- In `onCheckedChange`, compare with `=== true` before storing a boolean, because the received value can be `"indeterminate"`.
- The other props go to Radix's `Checkbox.Root` (`disabled`, `required`, `name`, `value`) and the `ref` points to the button.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/checkbox · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
