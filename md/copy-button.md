# Copy button

> Copia um valor e confirma na hora.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/copy-button
- Original description: Copy a value with immediate confirmation.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/copy-button.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/copy-button.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/copy-button.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/copy-button.json`. Registry path, relative to the site address: `r/copy-button.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/copy-button/copy-button.tsx`
  - `components/ryan-ui/copy-button/copy-button.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/copy-button.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Next to a value the person will paste elsewhere: an install command, an API key, an invite link.
- In tables, cards, and read-only fields, icon-only (`iconOnly`) or borderless (`variant="plain"`) to take little space.

## When not to use

- Use [`code-block`](code-block.md) to display code snippets: it already includes this button.
- When copying is a menu item or part of another control, use the `useCopyFeedback` hook (installed alongside, in `lib/use-copy-feedback.ts`) instead of nesting this button.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CopyButton } from "@/components/ryan-ui/copy-button/copy-button";
import { Caption, Row, Stack, Surface } from "./_kit";

export default function CopyButtonDemo() {
  const [copies, setCopies] = useState(0);
  return (
    <Stack gap={6} align="center" width={440}>
      <Surface padding={4} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <code style={{ fontSize: "var(--text-sm)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>npm install ryan-ui</code>
        <CopyButton value="npm install ryan-ui" onCopied={() => setCopies(count => count + 1)} />
      </Surface>
      <Row justify="center" gap={5}>
        <CopyButton value="sk_live_51Nq8x2Kd" label="Copy key" variant="plain" onCopied={() => setCopies(count => count + 1)} />
        <CopyButton value="https://ryan-ui.dev/docs" iconOnly label="Copy link" onCopied={() => setCopies(count => count + 1)} />
        <CopyButton value="unavailable" disabled label="Copy" />
      </Row>
      <Caption>Copied {copies} time{copies === 1 ? "" : "s"}. Press a button: the icon swaps and the label confirms.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CopyButton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` | — | — |
| `label` | `string` | `"Copy"` | — |
| `className` | `string` | — | — |
| `iconOnly` | `boolean` | `false` | — |
| `variant` | `"outline" \| "plain"` | `"outline"` | — |
| `disabled` | `boolean` | — | — |
| `onCopied` | `() => void` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Copy `value` and show the confirmation on the button itself. |

## Accessibility

- It is a `<button type="button">` whose accessible name is always `label`; the visible word and the icons are `aria-hidden`.
- The result is announced in an `aria-live="polite"` region as “`label`: Copied” or “`label`: Could not copy”; the button name does not change.
- In the `iconOnly` version, `label` is the button's only name: pass text that says what is copied, like “Copy link”.

## Motion

- On copy, the icon swaps for a checkmark that draws itself (or for an alert, on failure) and the word swaps with a short fade; the width follows the new word on a spring with no overshoot.
- The press reduces the scale to 0.97 (0.96 for icon-only) and releases on a spring curve; after 1.9 s the button returns to the original label.
- With “reduce motion”, swaps are instant, the checkmark appears already drawn, the width jumps, and the press does not change the scale.

## Notes for AI

- Pass the exact text in `value` and a short `label`; `onCopied` only runs when the copy succeeds, and failure shows on the button itself for 1.9 s.
- “Copied”, “Failed”, and the announcements are fixed in English; in a Portuguese interface, replace those strings in the installed file.
- Copying uses the Clipboard API and, if it is missing or refused (iframes, insecure context), falls back to a hidden `<textarea>` with `execCommand("copy")`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/copy-button · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
