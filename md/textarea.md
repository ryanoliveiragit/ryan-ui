# Textarea

> Campo de várias linhas para notas, descrições e textos mais longos.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/textarea
- Original description: A multiline field for notes, descriptions, and longer text.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/textarea.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/textarea.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/textarea.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/textarea.json`. Registry path, relative to the site address: `r/textarea.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/textarea/textarea.tsx`
  - `components/ryan-ui/textarea/textarea.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/textarea.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Comments, descriptions, order notes, and other multi-line texts without formatting.
- Feedback or support fields with an animated help line and validation error.

## When not to use

- Use [`input`](input.md) for single-line answers, such as a name or subject.
- Use [`rich-text-editor`](rich-text-editor.md) when the text needs headings, lists, or links.
- Use [`prompt-input`](prompt-input.md) for chat or AI message boxes that grow and send with Enter.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Textarea } from "@/components/ryan-ui/textarea/textarea";
import { Caption, Stack } from "./_kit";

export default function TextareaDemo() {
  const [text, setText] = useState("");
  const max = 280;
  const over = text.length > max;
  return (
    <Stack width={420} gap={3}>
      <Textarea label="Feedback" description="Tell us what we could do better." placeholder="The export button was hard to find because…" rows={4} value={text} onChange={(e) => setText(e.target.value)} error={over ? `${text.length - max} characters over the limit.` : undefined} />
      <Caption>{text.length} / {max}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Textarea`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `error` | `string` | — | — |
| `...props` | `TextareaHTMLAttributes<HTMLTextAreaElement>` | — | Also accepts the props of this type. |

## Accessibility

- The `label` is a `<label>` tied to the field, and `description` and `error` go into `aria-describedby` together with any `aria-describedby` you pass.
- With `error`, the field gets `aria-invalid` and the message has `role="alert"`, so it is read as soon as it appears.

## Motion

- The help and error messages open their height on a spring and the words rise with a blur; only the words that changed move.
- Numbers inside the message, as in “12 characters over the limit”, roll only the digits that changed.
- With “reduce motion” on, the messages already appear at their final height and only fade.

## Notes for AI

- It accepts the `<textarea>` props (`rows`, `maxLength`, `value`, `onChange`) plus `label`, `description`, and `error`; there is no built-in counter.
- The minimum height is 110px, resizable only vertically and not growing with the text; use `rows` for the initial height.
- Because it sits in a `role="alert"`, `error` is re-read on every change; avoid an error that changes on every keystroke and show counters outside it.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/textarea · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
