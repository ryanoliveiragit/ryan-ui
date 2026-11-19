# Command palette

> Paleta de comandos controlada pelo teclado, com busca, resultados agrupados e atalhos.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/command-palette
- Original description: A complete keyboard driven action surface with search, grouped results, and shortcuts.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/command-palette.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/command-palette.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/command-palette.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/command-palette.json`. Registry path, relative to the site address: `r/command-palette.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/command-palette/command-palette.tsx`
  - `components/ryan-ui/command-palette/command-palette.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/command-palette.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An app's command palette: search and run actions, go to other pages, or change settings without taking your hands off the keyboard.
- Up to a few hundred actions with groups, icons, and visible shortcuts, where search accepts abbreviations (“dup pr” finds “Duplicate project”).
- Quick search embedded in a page or panel, since the component is an ordinary panel, not a modal.

## When not to use

- Use [`combobox`](combobox.md) when the person chooses a value for a form field, not an action.
- Use [`search-field`](search-field.md) or [`expanding-search`](expanding-search.md) to search content with results specific to the page.
- Avoid with thousands of items or server-side search: filtering runs on the client on every keystroke over the whole list and all results are rendered.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Bell, FilePlus, FolderOpen, GitBranch, Moon, Palette, Search, Settings, UserPlus } from "lucide-react";
import { CommandPalette, type CommandItem } from "@/components/ryan-ui/command-palette/command-palette";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 520 };

const items: CommandItem[] = [
  { id: "new-file", label: "New file", description: "Create a file in the current folder", group: "Create", icon: <FilePlus size={16} />, shortcut: "N", keywords: ["add"] },
  { id: "invite", label: "Invite teammate", description: "Send an invitation by email", group: "Create", icon: <UserPlus size={16} />, shortcut: "I", keywords: ["member", "people"] },
  { id: "branch", label: "New branch", description: "Branch from main", group: "Create", icon: <GitBranch size={16} />, keywords: ["git"] },
  { id: "open", label: "Open project", description: "Jump to a recent project", group: "Go to", icon: <FolderOpen size={16} />, shortcut: "O" },
  { id: "search", label: "Search everything", description: "Files, issues and people", group: "Go to", icon: <Search size={16} />, shortcut: "/" },
  { id: "notifications", label: "Notifications", description: "Review unread updates", group: "Go to", icon: <Bell size={16} /> },
  { id: "theme", label: "Switch theme", description: "Toggle light and dark mode", group: "Settings", icon: <Moon size={16} />, shortcut: "T", keywords: ["dark", "light"] },
  { id: "accent", label: "Change accent color", group: "Settings", icon: <Palette size={16} /> },
  { id: "preferences", label: "Preferences", description: "Account and workspace settings", group: "Settings", icon: <Settings size={16} />, shortcut: ",", keywords: ["account"] },
];

export default function CommandPaletteDemo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <Stack width={560} gap={3}>
      <CommandPalette items={items} onSelect={item => setLast(item.label)} />
      <Caption>{last ? `Ran: ${last}` : "Type to filter, use the arrow keys, press Enter to run."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CommandPalette`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `CommandItem[]` | — | — |
| `placeholder` | `string` | `"Search commands"` | — |
| `onSelect` | `(item: CommandItem) => void` | — | — |
| `onClose` | `() => void` | — | — |
| `label` | `string` | `"Command palette"` | — |
| `autoFocus` | `boolean` | `false` | — |

### Exported types

#### `CommandItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `description` | `string` | — |
| `group` | `string` | — |
| `keywords` | `string[]` | — |
| `icon` | `ReactNode` | — |
| `shortcut` | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move the highlight between results, in the order they appear, and stop at the first and last. |
| `Home` or `End` | Move the highlight to the first or last result (in the field, they do not move the text cursor). |
| `Enter` | Runs the highlighted result (after typing, the first one); the search is cleared and focus stays in the field. |
| `Esc` | Clears the search; with the field already empty, calls `onClose`. |
| `Ctrl + K` or `⌘ + K` | Anywhere on the page, move focus to the field while the palette is mounted. |

## Accessibility

- The field is a `combobox` tied to the list (`role="listbox"`) by `aria-controls`, and the active result goes in `aria-activedescendant`: focus never leaves the field.
- Groups are `role="group"` with the group name, each result is an `option` with `aria-selected`, and an `aria-live` region announces the total number of results or “No results”.
- `label` becomes the field's hidden label; the component does not trap focus or cover the page, so to use it as a modal, put it in a `dialog` that returns focus on close.

## Motion

- A single highlight slides on a fast spring to the active result, by pointer or arrow keys, and the results frame follows the list height when filtering.
- When typing, the rows that leave fade out and the remaining ones slide to their new place; if the new order moves any row more than six positions, the list switches all at once.
- With “reduce motion” on, the entrance, highlight, height, and rows change instantly, with no slide or fade.

## Responsive behavior

- The list has a maximum height of 342px and scrolls inside, bringing the active result into view; in windows up to 480px, the shortcut keys and the “⌘ K” hint disappear.

## Performance

- Search scores all items on every keystroke and each result is a button with a layout animation; a `ResizeObserver` measures the list so the frame follows the height.

## Notes for AI

- Although it is among the blocks, it installs at `@/components/ryan-ui/command-palette/command-palette`; pass `items` with `id` and `label` and, optionally, `group`, `keywords`, `description`, `icon`, and `shortcut`.
- It does not open or close by itself: for a modal, mount it in a `dialog` when the shortcut is pressed, with `autoFocus`, and close it in `onClose`, called by Esc with the field empty and by the “Esc” button.
- `shortcut` only draws the keys on the row, without registering a shortcut; the only real shortcut is the global Ctrl+K/⌘+K, which focuses the field and may collide with one of your own.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/command-palette · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
