# Input

> Campo de uma linha com rótulos claros e estados úteis.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/input
- Original description: A single line field with clear labels and useful states.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/input.json`. Registry path, relative to the site address: `r/input.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/input/input.tsx`
  - `components/ryan-ui/input/input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Single-line text in a form: name, email, URL, code.
- Fields that need visible help and validation: `description` and `error` open their own line under the field without jolting the layout.
- Messages with a count that changes while typing, like “12 characters left”: only the changed digits roll.

## When not to use

- Use [`textarea`](textarea.md) for multi-line text.
- Use [`password-field`](password-field.md) for passwords and [`search-field`](search-field.md) for search: they already bring the reveal and clear buttons.
- Use [`number-field`](number-field.md) or [`money-input`](money-input.md) for numbers and money values, which need limits, steps, and formatting.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Input } from "@/components/ryan-ui/input/input";
import { Stack } from "./_kit";

export default function InputDemo() {
  const [email, setEmail] = useState("ryan@");
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <Stack gap={5} width={360}>
      <Input label="Work email" type="email" description="We will send your receipts here." value={email} onChange={(e) => setEmail(e.target.value)} error={invalid ? "Enter a complete email address." : undefined} placeholder="you@company.com" />
      <Input label="Company" placeholder="Acme Inc." />
      <Input label="Workspace URL" value="acme-inc" readOnly disabled description="Contact support to change this." />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Input`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `error` | `string` | — | — |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type. |

## Accessibility

- It is a native `<input>` with a `<label>` tied by `htmlFor`; `label` is required.
- `error` marks the field with `aria-invalid` and the message goes out in a `role="alert"`; `description` and `error` go into `aria-describedby`, added to whatever you pass in that prop.
- Focus is indicated only by the border darkening, with no ring; the animated words of the messages are hidden, and the screen reader reads a plain-text copy.

## Motion

- The help and error lines open their own height with a spring, and the words rise from a slight blur.
- When the message changes, only the different words move, and numbers roll up if they grew and down if they shrank.
- With “reduce motion” on, the lines appear already at final size and the words only fade.

## Responsive behavior

- Takes 100% of the container width, with a minimum height of 44 px (`--control-height-md`); the parent defines the width.

## Notes for AI

- Accepts all `<input>` props (`type`, `value`, `onChange`, `placeholder`, `disabled`…) and the `ref` points to the native element.
- `error` is a string, not a boolean: pass the text when there is an error and `undefined` when there is none; the `description` stays visible along with the error.
- There are no size variations or room for an icon or button inside the field: for that there are `password-field`, `search-field`, and `money-input`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
