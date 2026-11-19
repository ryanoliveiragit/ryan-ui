# Password field

> Capture texto sensível com um botão para revelar o que foi digitado.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/password-field
- Original description: Capture sensitive text with a visible reveal control.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-field.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-field.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-field.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/password-field.json`. Registry path, relative to the site address: `r/password-field.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/password-field/password-field.tsx`
  - `components/ryan-ui/password-field/password-field.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/password-field.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A password at login or password change, when the person wants to check what they typed before sending.
- Other typed secrets, like an API key, by replacing the button names with `messages`.

## When not to use

- Use [`password-strength`](password-strength.md) when the person is creating a password and needs to see the requirements and strength while typing.
- Use [`otp-input`](otp-input.md) for six-digit verification codes.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { PasswordField } from "@/components/ryan-ui/password-field/password-field";
import { Caption, Stack } from "./_kit";

export default function PasswordFieldDemo() {
  const [pw, setPw] = useState("correct-horse-battery");
  return (
    <Stack gap={3} width={360}>
      <PasswordField label="Password" description="Use the eye to check what you typed." value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
      <Caption>{pw.length} characters.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PasswordField`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `messages` | `Partial<PasswordFieldMessages>` | — | Translated or reworded toggle names. |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type, except `type`. |

### Exported types

#### `PasswordFieldMessages`

The toggle's names. Both have English defaults; pass the ones you translate.

| Field | Type | Description |
| --- | --- | --- |
| `showPassword` (required) | `string` | — |
| `hidePassword` (required) | `string` | — |

### Other exports

- `defaultPasswordFieldMessages` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves focus from the field to the eye button. |
| `Enter` or `Space` | On the eye button, show or hide the password. |

## Accessibility

- `label` becomes a `<label>` tied to the field, and `description` goes into `aria-describedby` along with whatever you pass in that prop.
- The eye button has `aria-pressed` and a name that toggles between `Show password` and `Hide password`; translate with `messages={{ showPassword, hidePassword }}`.
- There is no error prop: pass `aria-invalid` for the border to turn red and tie your message via `aria-describedby`.

## Motion

- When showing the password, a stroke draws over the eye, cutting the outline from below, and retracts on hiding, instead of swapping one icon for the other.
- The swap between dots and letters appears with a brief fade and blur from the first click, and the help line opens its own height with a spring.
- With “reduce motion” on, the stroke swaps instantly, the text does not fade, and the button does not shrink when pressed.

## Notes for AI

- Accepts `<input>` props except `type` (`value`, `onChange`, `name`, `autoComplete`…) and the `ref` points to the field; use `autoComplete="current-password"` at login and `"new-password"` at signup.
- Showing or hiding is internal state: there is no prop to control it or to know whether the password is visible.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/password-field · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
