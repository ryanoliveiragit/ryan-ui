# Inline edit

> Renomeie no próprio lugar: o texto vira campo sem mudar de posição.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/inline-edit
- Original description: Rename in place: the text becomes a field without moving.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/inline-edit.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/inline-edit.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/inline-edit.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/inline-edit.json`. Registry path, relative to the site address: `r/inline-edit.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/inline-edit/inline-edit.tsx`
  - `components/ryan-ui/inline-edit/inline-edit.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/inline-edit.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Names and short texts that are read far more than edited: project title, file name, description.
- Editing that saves field by field, with no form: `onSave` can return a promise, and the new text appears right away while it runs.
- Headings that need to stay headings: `as` keeps the text in an `h1`, `h2`, `h3`, `p`, or `span`.

## When not to use

- Use [`input`](input.md) or [`textarea`](textarea.md) in a form when several fields need to be saved together.
- Use [`rich-text-editor`](rich-text-editor.md) when the text needs formatting.
- When leaving the field must not save: here losing focus saves, as in a rename, and only `Esc` discards.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import InlineEdit from "@/components/ryan-ui/inline-edit/inline-edit";
import { Caption, Stack, Surface } from "./_kit";

export default function InlineEditDemo() {
  const [name, setName] = useState("Q4 launch plan");
  const [desc, setDesc] = useState("Everything we need to ship the new pricing page before the holidays.");
  return (
    <Surface width={440} padding={6}>
      <Stack gap={3}>
        <InlineEdit as="h2" label="Project name" value={name} onSave={(v) => new Promise((r) => setTimeout(() => { setName(v); r(null); }, 700))} validate={(v) => (v.trim() ? null : "A project needs a name.")} />
        <InlineEdit as="p" variant="body" multiline label="Description" value={desc} onSave={setDesc} placeholder="Add a description" />
        <Caption>Click either text to edit. Enter saves, Escape cancels.</Caption>
      </Stack>
    </Surface>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `InlineEdit`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` | — | The saved value. A new value from outside replaces the text while it is not being edited. |
| `onSave` (required) | `(next: string) => void \| Promise<unknown>` | — | Persists the new value. Return a promise to show the saving state, and reject it to roll back. |
| `label` (required) | `string` | — | Accessible name, for example “Project name”. |
| `validate` | `(next: string) => string \| null \| undefined` | — | Returns a message when the draft cannot be saved. |
| `placeholder` | `string` | `""` | Shown when the value is empty. |
| `multiline` | `boolean` | `false` | Wraps onto several lines and grows in height. Enter still saves; Shift+Enter adds a line break. |
| `variant` | `"title" \| "body"` | `"title"` | `title` for names and headings, `body` for descriptions. |
| `as` | `"span" \| "p" \| "h1" \| "h2" \| "h3"` | `"span"` | The element that holds the text, so a title can stay a heading. |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the text, enter edit mode with all the content selected. |
| `Enter` | In the field, saves; does not fire during an IME composition. |
| `Shift + Enter` | With `multiline`, inserts a line break. |
| `Esc` | Cancels the edit, restores the text, and returns focus to it. |
| `Tab` | Moves through the save and cancel buttons; when focus leaves the component, the text is saved. |

## Accessibility

- At rest the text is a `<button>` with an `aria-label` in the format “label: value” and the hint `Activate to edit.`; while editing it becomes an `<input>` or `<textarea>` with the same `label`.
- The `validate` error is tied to the field by `aria-invalid` and `aria-describedby`, and the saving and saved notices go out in a `role="status"` region.
- The hints, the announcements, and the failure message (with the `Try again` button) are fixed in English; only `label`, `placeholder`, and the `validate` text come from you.

## Motion

- The text becomes a field in the same place and with the same metrics; the frame follows the width of what is typed with a fast spring and, with `multiline`, the height.
- On save, the new text stays dimmed next to a spinning indicator until the promise resolves, and then a checkmark draws itself; on failure, the saved text comes back and the frame flashes in an error tone.
- With “reduce motion” on, sizes change instantly, texts only fade, and the saving indicator does not spin.

## Responsive behavior

- The row reserves 66 px on the right for the buttons (38 px with `multiline`), so the text does not change wrapping on entering edit mode; on a single line, the excess is cut with an ellipsis.

## Notes for AI

- `value` is the saved value and `onSave(next)` must store it: return a promise and reject it for the component to restore the last saved value and offer a retry.
- `validate(next)` returns the error message or nothing; before that the text is trimmed and, on a single line, repeated spaces become one, and `onSave` is not called if nothing changed.
- `label` is required (it is the accessible name and does not show on screen), `variant` is `title` or `body`, and `as` chooses the tag, for example `as="h2"`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/inline-edit · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
