# Code block

> Bloco de código com realce leve, nome do arquivo, botão de copiar e opção de expandir trechos longos.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/code-block
- Original description: Present code with legible hierarchy and copy access.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/code-block.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/code-block.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/code-block.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/code-block.json`. Registry path, relative to the site address: `r/code-block.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Copy button](copy-button.md)
- Files, once installed:
  - `components/ryan-ui/code-block/code-block.tsx`
  - `components/ryan-ui/code-block/code-block.module.css`
  - `components/ryan-ui/copy-button/copy-button.tsx`
  - `components/ryan-ui/copy-button/copy-button.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/code-block.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Show a code snippet in documentation or a tutorial, with file name, language, and a copy button.
- Long sources that should start collapsed: `maxLines` cuts the height and a button opens the rest in place.
- Code that changes in the same block (variations by package manager or framework): the new code enters smoothly and the height follows.

## When not to use

- Use [`file-diff`](file-diff.md) to show what changed between two versions of a file.
- Use [`json-viewer`](json-viewer.md) to explore JSON data with nodes that open and close and with search.
- Use [`copy-button`](copy-button.md) alone to copy a short value, such as a token or a one-line command.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { CodeBlock } from "@/components/ryan-ui/code-block/code-block";
import { Stack } from "./_kit";

const hook = `import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
const query = useDebouncedValue(search, 300);
const results = useSearch(query);
`;

const shell = `npm install ryan-ui motion lucide-react
npx ryan-ui add button dialog`;

export default function CodeBlockDemo() {
  return (
    <Stack width={560} gap={5}>
      <CodeBlock filename="use-debounced-value.ts" language="tsx" code={hook} maxLines={9} />
      <CodeBlock language="bash" code={shell} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CodeBlock`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` (required) | `string` | — | Source shown in the block and copied by the action. |
| `filename` | `string` | — | File name displayed in the header. |
| `language` | `string` | `"tsx"` | Used for the header label and lightweight syntax highlighting. |
| `maxLines` | `number` | — | Collapse longer sources to this many lines, with a toggle that expands the rest in place. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Moves through the copy button, the code block (which is focusable), and, if present, the expand button. |
| `Enter` or `Space` | Trigger the focused button: copy, or show all lines and collapse. |
| `←` or `→` | With focus on the code, scroll long lines sideways; this is the native scrolling of the `pre`, which receives `tabIndex` for that. |

## Accessibility

- The block is a `section` labeled with the file name or the language; the `pre` is focusable for scrolling by keyboard, and the expand button reports `aria-expanded`.
- When collapsed, the code is only clipped in height: the screen reader and the copy button still have the full text.
- Copying is confirmed in a `role="status"` region of the `copy-button`; the labels (“Copy code”, “Show all N lines”) are in English in the code.

## Motion

- Expanding and collapsing animates the height with a no-overshoot spring, rotates the arrow, and swaps the button label.
- A new `code` enters rising 4 px while the height follows the content, and a new `filename` swaps with the width following on a spring.
- With “reduce motion”, height, texts, and arrow change immediately.

## Responsive behavior

- Long lines do not wrap: they scroll sideways inside the block, which takes 100% of the parent's width.
- On screens up to 420 px the font and spacing shrink and the copy button keeps only the icon.

## Performance

- Highlighting runs on every render over the whole code and creates one `span` per token, even when collapsed: for files with thousands of lines, show an excerpt.

## Notes for AI

- `language` (default `tsx`) defines the label and the highlighting heuristics, a simple tokenizer aimed at JS/TS, JSON, HTML, and CSS; in `bash` or `python`, comments with `#` are not recognized.
- Pass `code` without a trailing line break: it counts as one extra line in the “Show all N lines” button.
- It depends on `copy-button`, the export is named (`CodeBlock`), and the expanded state is internal; there is no `className`, line numbers, or line highlighting.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/code-block · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
