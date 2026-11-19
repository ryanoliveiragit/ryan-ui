# Expandable tabs

> Abas de ícones em que só a aba ativa mostra o rótulo, que se abre com uma mola enquanto as outras se recolhem.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/expandable-tabs
- Original description: Icon tabs in which only the active tab shows its label, unfolding on a spring while the others fold back to icons.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-tabs.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-tabs.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-tabs.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-tabs.json`. Registry path, relative to the site address: `r/expandable-tabs.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/expandable-tabs/expandable-tabs.tsx`
  - `components/ryan-ui/blocks/expandable-tabs/expandable-tabs.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/expandable-tabs.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An app bottom bar or compact switcher with four or five destinations, where only the active one needs to show its name.
- Navigation through familiar icons (home, search, inbox, profile), with an unread counter on the icon (`badge: 3`).

## When not to use

- Use [`tabs`](tabs.md) or [`segmented-control`](segmented-control.md) when all labels must stay visible at all times.
- Use [`morphing-tabs`](morphing-tabs.md) when the tabs have labels and the highlight should travel between them.
- Avoid with ambiguous icons or many destinations: the names are hidden and the list neither scrolls nor wraps.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import ExpandableTabsPreview from "@/components/ryan-ui/blocks/expandable-tabs/expandable-tabs";

export default function ExpandableTabsDemo() {
  return <ExpandableTabsPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandableTabs`

Icon tabs that spend their width on the active tab only: its label unfolds on a spring while the others fold back to icons, so five destinations fit where two labeled tabs would. Arrow keys, Home and End move between tabs.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` (required) | `ExpandableTab[]` | — | The tabs, in order. |
| `value` | `string` | — | Active tab id (controlled). |
| `defaultValue` | `string` | — | Active tab id on first render (uncontrolled). Defaults to the first tab. |
| `onValueChange` | `(value: string) => void` | — | Called with the id of the tab that was picked. |
| `label` | `string` | `"Sections"` | Accessible name of the tab list. |
| `className` | `string` | — | Extra class for the root. |

### `ExpandableTabsPreview`

Ready preview: a compact app screen with five destinations in its bottom bar.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `ExpandableTab`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable value of the tab. |
| `label` (required) | `string` | Text shown only while the tab is active; always the tab's accessible name. |
| `icon` (required) | `ReactNode` | Icon, always visible. |
| `badge` | `number` | Small count on the icon, for unread items and the like. |
| `content` | `ReactNode` | Panel shown while the tab is active. Leave it out to use the tabs as a plain switcher. |
| `disabled` | `boolean` | A disabled tab cannot be picked and is skipped by the arrow keys. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Select the previous or next tab, skipping disabled ones and wrapping around, and move focus along with it. |
| `Home` or `End` | Select the first or last enabled tab. |

## Accessibility

- Follows the tabs pattern with roving focus: a `tablist` named by `label`, `aria-selected` on each tab and, when there is `content`, a `tabpanel` tied to the active tab.
- Each tab's name is always the `label` (with “, 3 new” when there is a `badge`), even with the text hidden; the visible label is `aria-hidden` so it is not read twice.

## Motion

- The active tab's label opens on a no-overshoot spring while the previous one's closes, the highlight background grows from the tab itself, and the icon pulses once.
- When there is `content`, the panel swaps rising from a slight blur.
- With “reduce motion” on, labels and panels swap instantly, with no pulse or blur, and the background's CSS transitions are turned off.

## Responsive behavior

- The list centers itself and grows with the active label, with no scrolling or line wrapping: check that the icons plus the longest label fit on the narrowest screen.

## Notes for AI

- Import `ExpandableTabs` by name (the default export is an app preview); each tab needs `id`, `label`, and `icon`, and counts above 9 in `tab.badge` appear as “9+”.
- Without `content` on any tab, it becomes a simple switcher, with no `tabpanel`: use `value` and `onValueChange` to switch the screen externally, as in a bottom bar.
- With `content`, the panel appears above the list; to pin the bar to the bottom of the screen, position the component from the parent.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/expandable-tabs · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
