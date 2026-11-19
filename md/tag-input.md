# Tag input

> Transforma textos curtos em etiquetas removíveis, com animação suave ao adicionar e remover.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tag-input
- Original description: Turn short text values into removable tags.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tag-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tag-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tag-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tag-input.json`. Registry path, relative to the site address: `r/tag-input.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/tag-input/tag-input.tsx`
  - `components/ryan-ui/tag-input/tag-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tag-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Keywords, topics, or free-form labels typed by the person, such as a post's tags.
- Short lists of typed values, such as domains or emails in a filter or invitation.

## When not to use

- Use [`multi-select`](multi-select.md) when the options come from a known list.
- Use [`chip-group`](chip-group.md) for filters with fixed facets that people turn on and off.
- Use [`mention-input`](mention-input.md) when the items are mentions of people or channels inside a text.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { TagInput } from "@/components/ryan-ui/tag-input/tag-input";
import { Caption, Stack } from "./_kit";

export default function TagInputDemo() {
  const [tags, setTags] = useState(["design systems", "react", "accessibility"]);
  return (
    <Stack width={420} gap={3}>
      <TagInput label="Topics" description="Press Enter or comma to add. Backspace selects, then removes." placeholder="Add a topic" value={tags} onValueChange={setTags} />
      <Caption>{tags.length} topic{tags.length === 1 ? "" : "s"}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TagInput`

Tags keep the field still: a new tag blurs in where its text was typed while the caret glides aside, a removed tag leaves its slot and the rest glide in, and the shell follows wrapped rows on a spring. Backspace or the arrow keys pick a tag first, a ring glides to it, and the next Backspace removes it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` | `string[]` | — | — |
| `defaultValue` | `string[]` | `[]` | — |
| `onValueChange` | `(value: string[]) => void` | — | — |
| `placeholder` | `string` | `"Add a tag"` | — |
| `description` | `string` | — | — |
| `id` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `,` | Turn the typed text into a tag; leaving the field also adds it, and a duplicate only pulses the one that already exists. |
| `Backspace` | With the cursor at the start of the field, selects the last tag; with one selected, removes it, like Delete. |
| `←` or `→` | Move the selection between tags (← from the start of the field); past the last one, return to the text. |
| `Esc` | Clears the tag selection without removing it. |

## Accessibility

- Each tag has a “Remove {tag}” button in the tab order, and removing returns focus to the field.
- An `aria-live` region announces add, remove, select, and duplicates (“react is already added”); the texts are in English and fixed in the code.
- The visible `label` names the field and the `description` is included through `aria-describedby`.

## Motion

- A new tag appears with a blur where the text was typed while the cursor slides sideways, and on removal the others slide to fill the gap.
- The box follows the wrapping rows on a spring, a ring slides between the tags selected by keyboard, and a duplicate pulses.
- With “reduce motion” on, the tags only fade, nothing slides, and the box changes height instantly.

## Responsive behavior

- The tags wrap onto several lines and the box grows with them, with no height limit or inner scrolling.

## Notes for AI

- The value is `string[]`, with `value` and `onValueChange` or `defaultValue`; there is no limit on count, no suggestions, and no validation, so filter in `onValueChange` if you need to.
- Duplicates are ignored regardless of case, and the comma always separates, so a tag cannot contain a comma.
- Named import, `import { TagInput } from "@/components/ryan-ui/tag-input/tag-input"`; the `placeholder` disappears after the first tag.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tag-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
