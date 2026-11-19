# Mention input

> Caixa de texto com menções a @pessoas e #canais que funcionam como um único bloco.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/mention-input
- Original description: A textarea with @people and #channel mentions that act as single tokens, with suggestions at the caret.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mention-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mention-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mention-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/mention-input.json`. Registry path, relative to the site address: `r/mention-input.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/mention-input/mention-input.tsx`
  - `components/ryan-ui/mention-input/mention-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/mention-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Comments, messages, and notes where people are cited with `@` or channels with `#` and you need to know who was mentioned.
- When the text will be stored or generate notifications: the value carries the plain text and `mentions` with `id` and positions, and `serializeMentions` converts it to `<@id>` and `<#id>`.
- Quick-send boxes: with `submitOnEnter`, `Enter` calls `onSubmit` and `Shift + Enter` breaks the line.

## When not to use

- Use [`textarea`](textarea.md) when the text has no mentions.
- Use [`rich-text-editor`](rich-text-editor.md) when you need formatting, like bold, lists, and headings.
- Use [`prompt-input`](prompt-input.md) for an assistant's message box, with attachments and a send button.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import MentionInput, { type MentionValue } from "@/components/ryan-ui/mention-input/mention-input";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 480 };

const people = [
  { id: "emma-collins", name: "Emma Collins", role: "Product designer", avatar: avatar("emma-collins") },
  { id: "marcus-johnson", name: "Marcus Johnson", role: "Frontend engineer", avatar: avatar("marcus-johnson") },
  { id: "jasmine-brooks", name: "Jasmine Brooks", role: "Design lead", avatar: avatar("jasmine-brooks") },
  { id: "olivia-bennett", name: "Olivia Bennett", role: "Platform engineer", avatar: avatar("olivia-bennett") },
];
const channels = [
  { id: "design", name: "design", description: "Design critique and reviews", members: 24 },
  { id: "launch", name: "launch", description: "Q4 launch coordination", members: 18 },
  { id: "frontend", name: "frontend", description: "Web engineering", members: 31 },
];

// The comment already holds a #channel mention and is mid-way through typing "@", so the preview shows a mention token
// and the open suggestions together. The space below the field is reserved for the list.
const start = "Moving the review to #design. Looping in @";
const initial: MentionValue = { text: start, mentions: [{ kind: "channel", id: "design", label: "design", start: 21, end: 28 }] };

export default function MentionInputDemo() {
  const [value, setValue] = useState<MentionValue>(initial);
  return (
    <Stack gap={3} width={440}>
      <div style={{ paddingBottom: 176 }}>
        <MentionInput aria-label="Comment" value={value} onChange={setValue} people={people} channels={channels} placeholder="Write a comment. Type @ for people or # for channels." minRows={3} placement="bottom" defaultOpen />
      </div>
      <Caption>{value.mentions.length ? `${value.mentions.length} mention${value.mentions.length > 1 ? "s" : ""}: ${value.mentions.map((m) => (m.kind === "channel" ? "#" : "@") + m.label).join(", ")}. Type @ or # to add more.` : "Type @ for people or # for channels."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MentionInput`

A textarea with `@` people and `#` channel mentions. Mentions are atomic: the caret steps over them and one Backspace removes the whole token. The value carries plain text plus a structured `mentions` array with offsets, ready to store or notify.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `MentionValue` | — | — |
| `defaultValue` | `MentionValue` | — | — |
| `onChange` | `(value: MentionValue) => void` | — | — |
| `people` | `MentionPerson[]` | — | People offered after `@`. Leave it out to turn person mentions off. |
| `channels` | `MentionChannel[]` | — | Channels offered after `#`. Leave it out to turn channel mentions off. |
| `onMentionAdd` | `(mention: Mention) => void` | — | Called when a suggestion becomes a mention. |
| `onSubmit` | `(value: MentionValue) => void` | — | With `submitOnEnter`, Enter submits and Shift+Enter adds a line. |
| `submitOnEnter` | `boolean` | `false` | — |
| `placeholder` | `string` | — | — |
| `minRows` | `number` | `1` | — |
| `maxRows` | `number` | `8` | The field grows to this many rows, then scrolls. |
| `placement` | `"auto" \| "top" \| "bottom"` | `"auto"` | Where suggestions open. `auto` flips above when there is no room below. |
| `defaultOpen` | `boolean` | `false` | Show the suggestions for the text before the end of the value on first render, without focusing the field (for previews and onboarding). They close on a click outside; once the field is focused it behaves as usual. |
| `maxSuggestions` | `number` | `6` | — |
| `disabled` | `boolean` | — | — |
| `name` | `string` | — | — |
| `id` | `string` | — | — |
| `aria-label` | `string` | — | — |
| `aria-describedby` | `string` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `MentionKind` | `"person" \| "channel"` |

#### `MentionPerson`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `role` | `string` | One short line under the name, such as a job title. |
| `avatar` | `string` | Portrait URL. Initials show when it is missing. |

#### `MentionChannel`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `description` | `string` | — |
| `members` | `number` | — |

#### `Mention`

A mention inside `text`. `start` and `end` are character offsets; the text between them is `@label` or `#label`.

| Field | Type | Description |
| --- | --- | --- |
| `kind` (required) | `"person" \| "channel"` | — |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `start` (required) | `number` | — |
| `end` (required) | `number` | — |

#### `MentionValue`

| Field | Type | Description |
| --- | --- | --- |
| `text` (required) | `string` | — |
| `mentions` (required) | `Mention[]` | — |

#### `MentionInputHandle`

| Field | Type | Description |
| --- | --- | --- |
| `focus` (required) | `() => void` | — |
| `insert` (required) | `(text: string) => void` | Inserts text at the caret, as if typed. |
| `openSuggestions` (required) | `(kind: MentionKind) => void` | Types a trigger at the caret so the suggestions open, adding a space first when needed. |
| `clear` (required) | `() => void` | — |
| `textarea` (required) | `HTMLTextAreaElement \| null` | — |

### Other exports

- `mentionText` (function)
- `serializeMentions` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | With suggestions open, move the highlight, wrapping around at the ends. |
| `Enter` or `Tab` | With suggestions open, insert the highlighted one as a mention. |
| `Esc` | Closes the suggestions without erasing what was typed. |
| `Backspace` or `Delete` | Next to a mention, erase the whole token at once. |
| `←` or `→` | Jump over a mention: the cursor never stops inside it. |
| `Shift + Enter` | With `submitOnEnter`, breaks the line, while `Enter` alone sends. |

## Accessibility

- The box is a `<textarea>` with `role="combobox"`, `aria-expanded`, and `aria-activedescendant`; the suggestions are a `role="listbox"`, and focus never leaves the text.
- There is no built-in visible label: pass `aria-label`, or an `id` with your own `<label>` pointing to it.
- An `aria-live` region announces how many people or channels match, but in fixed English (`3 people`, `No matches`), as are the list names.

## Motion

- The box height follows the text with a spring, between `minRows` and `maxRows`; beyond that the content scrolls.
- Suggestions appear next to the `@` or `#` character, the highlight slides between rows, and the panel height follows the number of results.
- With “reduce motion” on, heights and highlight change instantly and the panel only fades.

## Responsive behavior

- Takes 100% of the width; the suggestions panel is 272 px, stays clamped within the box width and, with `placement="auto"`, opens upward when there are less than 300 px free below.

## Performance

- The text is drawn by a mirror layer redone on every key, and the search scans all of `people` or `channels` to show at most `maxSuggestions` (default 6); avatars use `loading="lazy"`.

## Notes for AI

- The value is `{ text, mentions }`, not a string: use `value` + `onChange` or `defaultValue`, and read `mentions` (`kind`, `id`, `label`, `start`, `end`) when saving.
- Pass `people` to enable `@` and `channels` to enable `#`; without the list, the matching trigger is turned off.
- The `ref` exposes `focus()`, `insert(texto)`, `openSuggestions(kind)`, and `clear()`: useful for an “@” button in the toolbar and for clearing the box after sending.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/mention-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
