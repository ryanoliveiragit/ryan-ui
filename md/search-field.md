# Search field

> Campo de busca reconhecível, com ícone, botão de limpar e foco bem marcado.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/search-field
- Original description: A recognizable search entry point with clear affordances.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/search-field.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/search-field.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/search-field.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/search-field.json`. Registry path, relative to the site address: `r/search-field.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/search-field/search-field.tsx`
  - `components/ryan-ui/search-field/search-field.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/search-field.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Filtering a list or table that is already on screen, such as destinations, people, or files.
- A search field fixed at the top of a page or sidebar, with a visible label.

## When not to use

- Use [`combobox`](combobox.md) when the search ends in choosing an item from the list.
- Use [`expanding-search`](expanding-search.md) or [`morphing-search`](morphing-search.md) when space is tight and the search starts as an icon.
- Use [`command-palette`](command-palette.md) to search actions and navigate the whole application by keyboard.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { SearchField } from "@/components/ryan-ui/search-field/search-field";
import { Caption, Stack } from "./_kit";

const cities = ["Lisbon", "Porto", "Barcelona", "Berlin", "Amsterdam", "Copenhagen", "Vienna", "Prague", "Kyoto", "Osaka"];

export default function SearchFieldDemo() {
  const [q, setQ] = useState("");
  const hits = cities.filter((c) => c.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Stack width={360} gap={4}>
      <SearchField label="Search destinations" placeholder="Search destinations" value={q} onValueChange={setQ} />
      <Caption>{hits.length ? hits.join(", ") : "No destinations match."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SearchField`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `value` (required) | `string` | — | — |
| `onValueChange` (required) | `(value: string) => void` | — | — |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | — | Also accepts the props of this type, except `type`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the clear button, which enters the tab order after the field when there is text, clear the search and return focus to the field. |

## Accessibility

- The label is a visible `<label>` tied to the `type="search"` field, and the magnifier is `aria-hidden`.
- The clear button has `aria-label="Clear search"`, fixed in English, and returns focus to the field because it disappears from under the pointer.
- The component does not announce results: if the list filters live, report the count in your own `aria-live` region.

## Motion

- The clear button enters with a short spring and a slight blur and leaves quickly; it has a reserved space, so the field never changes width.
- The magnifier goes from muted to the text color when the field receives focus or has text.
- With “reduce motion” on, the button only fades and the color transitions are turned off.

## Notes for AI

- It is always controlled: `value` and `onValueChange(texto)` are required; filter in the parent and, if you call the network, use your own debounce.
- Named import, `import { SearchField } from "@/components/ryan-ui/search-field/search-field"`; `label` is required, and the other `<input>` props, such as `placeholder`, pass straight through.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/search-field · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
