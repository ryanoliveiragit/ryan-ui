# Rich text editor

> Editor leve com atalhos de markdown, barra flutuante, menu de barra e saída em HTML ou markdown.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/rich-text-editor
- Original description: A lightweight editor with markdown shortcuts, a floating toolbar, a slash menu, and HTML and markdown output.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rich-text-editor.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rich-text-editor.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rich-text-editor.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/rich-text-editor.json`. Registry path, relative to the site address: `r/rich-text-editor.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/rich-text-editor/rich-text-editor.tsx`
  - `components/ryan-ui/rich-text-editor/rich-text-editor.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/rich-text-editor.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Notes, long comments, product descriptions, or release notes that need headings, lists, and links.
- Writers already know Markdown: shortcuts like `## `, `- `, `1. ` and `> ` become formatting as they type.
- When you need to store the text as Markdown or clean HTML without bringing in an editor library.

## When not to use

- Use [`textarea`](textarea.md) for plain text, without formatting.
- Use [`mention-input`](mention-input.md) when what matters is mentions of people and channels, not formatting.
- Long documents, tables, images, or collaborative editing call for a full editor; this one covers headings, lists, quotes, code, and links.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import RichTextEditor, { type RichTextValue } from "@/components/ryan-ui/rich-text-editor/rich-text-editor";
import { Caption, Stack, Surface } from "./_kit";

const intro = `# Release notes

Version 2.4 makes **search** noticeably faster and adds *saved filters*.

- Faster indexing for large workspaces
- Saved filters on every list
- Fewer layout jumps while loading

Select text for the toolbar, or type / on an empty line for blocks.`;

export default function RichTextEditorDemo() {
  const [words, setWords] = useState(0);
  const onChange = (v: RichTextValue) => setWords(v.text.trim() ? v.text.trim().split(/\s+/).length : 0);
  return (
    <Stack width={560} gap={3}>
      <Surface padding={4}>
        <RichTextEditor defaultMarkdown={intro} onChange={onChange} aria-label="Release notes" />
      </Surface>
      <Caption>Markdown shortcuts work as you type (## , - , 1. , &gt; ). {words > 0 ? `${words} words.` : ""}</Caption>
    </Stack>
  );
}
export const stage = { height: 520 };
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RichTextEditor`

A light rich text editor on contentEditable. Markdown shortcuts as you type, a floating selection toolbar that morphs into a link field, a slash menu for blocks, its own undo history, and HTML plus Markdown output. No dependencies beyond Motion and icons.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled HTML. The editor only rewrites its content when this differs from what it last emitted. |
| `defaultValue` | `string` | — | — |
| `defaultMarkdown` | `string` | — | Initial content as Markdown, used when no HTML value is given. |
| `onChange` | `(value: RichTextValue) => void` | — | — |
| `onHistoryChange` | `(state: { canUndo: boolean; canRedo: boolean }) => void` | — | Reports whether undo and redo are available, for your own toolbar. |
| `placeholder` | `string` | `"Start writing"` | — |
| `blockHint` | `string` | `"Type / for blocks"` | The hint on an empty line while typing. |
| `readOnly` | `boolean` | `false` | — |
| `autoFocus` | `boolean` | `false` | — |
| `aria-label` | `string` | — | — |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `BlockType` | `"p" \| "h1" \| "h2" \| "h3" \| "ul" \| "ol" \| "blockquote" \| "pre" \| "hr"` |

#### `RichTextValue`

| Field | Type | Description |
| --- | --- | --- |
| `html` (required) | `string` | — |
| `markdown` (required) | `string` | — |
| `text` (required) | `string` | — |
| `empty` (required) | `boolean` | — |

#### `RichTextEditorHandle`

| Field | Type | Description |
| --- | --- | --- |
| `focus` (required) | `() => void` | — |
| `getHTML` (required) | `() => string` | — |
| `getMarkdown` (required) | `() => string` | — |
| `getText` (required) | `() => string` | — |
| `setHTML` (required) | `(html: string) => void` | — |
| `setMarkdown` (required) | `(markdown: string) => void` | — |
| `clear` (required) | `() => void` | — |
| `undo` (required) | `() => void` | — |
| `redo` (required) | `() => void` | — |
| `element` (required) | `HTMLDivElement \| null` | — |

### Other exports

- `normalizeUrl` (function)
- `markdownToHtml` (function)
- `htmlToMarkdown` (function)
- `sanitizeHtml` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Ctrl + Z` | Undoes using the editor's own history; Ctrl + Shift + Z or Ctrl + Y redo (⌘ on Mac). |
| `Ctrl + B` | Bold; Ctrl + I makes italic, Ctrl + Shift + X strikethrough, and Ctrl + E inline code. |
| `Ctrl + K` | Opens the link field in the floating toolbar, where Enter applies and Esc returns to formatting. |
| `/` | At the start of a line or after a space, opens the block menu: ↑ and ↓ choose, Enter or Tab insert, and Esc closes. |
| `Tab` or `Shift + Tab` | In a list, increase or decrease the item's indent; in a code block, Tab inserts two spaces, and outside them focus leaves the editor. |
| `Alt + F10` | With the floating toolbar open, moves focus to it; ← and → move between the buttons and Esc returns to the text. |

## Accessibility

- The writing area is `role="textbox"` with `aria-multiline`; pass `aria-label` with the field name, because the default is “Editor”.
- The toolbar is a `role="toolbar"` with named buttons and `aria-pressed`, and the block menu is a `listbox` tied to the text by `aria-activedescendant`, so focus does not leave the text when choosing.
- An `aria-live` region announces undo, redo, applied Markdown shortcuts, inserted blocks, and links; the interface texts are in English and fixed in the code.

## Motion

- The floating toolbar appears with a short spring next to the selection, slides when the selection changes, and resizes on a spring when it becomes the link field, with the faces sliding sideways.
- In the block menu, a highlight slides between options and the panel follows the height of the filtered results.
- With “reduce motion” on, toolbar and menu only fade and change size and position instantly.

## Responsive behavior

- With the editor under 330px wide (container query), the toolbar hides the block buttons and keeps only the text marks; blocks remain in the slash menu.
- Toolbar and menu open upward or downward depending on the visible space in the scrolling or clipping ancestor, so they do not end up hidden.

## Performance

- On every change the editor generates HTML, Markdown, and text for the whole document, and undo keeps up to 300 copies of the HTML; it was built for notes and descriptions, not long documents.

## Notes for AI

- Start with `defaultMarkdown` or `defaultValue` (HTML) and read `onChange`, which delivers `{ html, markdown, text, empty }`; the controlled `value` only rewrites the content when it differs from the last emitted HTML.
- There is no `name` or form field: keep `html` or `markdown` in state; through the `ref` there are `getHTML`, `getMarkdown`, `setMarkdown`, `clear`, `undo`, and `redo`.
- Treat `html` as user input and sanitize it on the server before showing it to other people, because the built-in cleanup only covers what is pasted; there is no underline or images.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/rich-text-editor · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
