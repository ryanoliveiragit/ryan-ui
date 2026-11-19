# Dock

> Dock de aplicativos: os ícones crescem perto do cursor, mostram o nome, pulam ao clicar e o ativo ganha um ponto.

- Type: component (category Actions), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/dock
- Original description: An app dock whose tiles magnify around the cursor, show a tooltip, bounce when pressed and mark the active one with a dot.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dock.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dock.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dock.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/dock.json`. Registry path, relative to the site address: `r/dock.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/dock/dock.tsx`
  - `components/ryan-ui/dock/dock.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/dock.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- An app or area launcher at the bottom of a screen, with few icons and one active item.
- Demo or creative interfaces where magnification under the cursor is part of the identity.

## When not to use

- Use [`floating-button-group`](floating-button-group.md) for work toolbars, with labels and shortcuts, where tiles that grow and bounce would get in the way.
- Use [`bounce-sidebar`](bounce-sidebar.md) or [`animated-sidebar`](animated-sidebar.md) for the main navigation of an app with many sections and always-visible names.
- Avoid as the only navigation on narrow screens: on touch there is no magnification or name bubble, and the row does not adapt to the width.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Calendar, Mail, Music, NotebookPen, Settings, Terminal } from "lucide-react";
import { Dock } from "@/components/ryan-ui/dock/dock";
import type { DockItem } from "@/components/ryan-ui/dock/dock";
import { Caption, Stack } from "./_kit";

const icon = { size: 20, strokeWidth: 1.75 };
const apps: DockItem[] = [
  { id: "mail", label: "Mail", icon: <Mail {...icon} />, open: true },
  { id: "calendar", label: "Calendar", icon: <Calendar {...icon} /> },
  { id: "notes", label: "Notes", icon: <NotebookPen {...icon} />, open: true },
  { id: "music", label: "Music", icon: <Music {...icon} /> },
  { id: "terminal", label: "Terminal", icon: <Terminal {...icon} />, open: true },
  { id: "settings", label: "Settings", icon: <Settings {...icon} />, separatorBefore: true },
];

export default function DockDemo() {
  const [active, setActive] = useState<string | null>("notes");
  const name = apps.find(app => app.id === active)?.label;
  return (
    <Stack gap={5} align="center" style={{ paddingTop: "var(--space-12)" }}>
      <Dock items={apps} size={40} value={active} onValueChange={setActive} label="Applications" />
      <Caption>{name ? `${name} is in front.` : "Nothing is open."} Hover the dock or use the arrow keys.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Dock`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `DockItem[]` | — | The tiles, left to right. |
| `value` | `string \| null` | — | Id of the active item (controlled). Pass null for none. |
| `defaultValue` | `string \| null` | `null` | Active item when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the id of the pressed item. |
| `size` | `number` | `48` | Tile size at rest, in pixels. |
| `magnification` | `number` | `1.6` | How much the tile under the cursor grows: 1.6 means 60% larger. |
| `range` | `number` | `140` | Distance in pixels over which the magnification falls off to nothing. |
| `label` | `string` | `"Dock"` | Accessible name of the toolbar. |
| `className` | `string` | — | Extra class for the dock bar. |

### Exported types

#### `DockItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, reported by `onValueChange` when the item is pressed. |
| `label` (required) | `string` | Name shown in the tooltip and announced to screen readers. |
| `icon` (required) | `ReactNode` | The icon, usually an SVG sized around 45% of the tile. |
| `open` | `boolean` | Draws a quiet dot under the icon, for something that is running in the background. |
| `separatorBefore` | `boolean` | Draws a thin divider before this item, to split the dock into groups. |
| `disabled` | `boolean` | Keeps the item visible but not pressable. |
| `onSelect` | `() => void` | Runs when the item is pressed, after the bounce starts. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `←` | Move focus between enabled tiles and wrap around at the ends; the focused tile is magnified as if the cursor were over it. |
| `Home` or `End` | Go to the first and last enabled tile. |
| `Enter` or `Space` | Trigger the tile: it bounces, becomes the active one, and calls `onValueChange` and `onSelect`. |

## Accessibility

- The container is `role="toolbar"` with `aria-label` (default in English, “Dock”); each tile is a `<button>` with an `aria-label` equal to `label` and `aria-pressed` marking the active one.
- The name bubble is visual only (`aria-hidden`) and appears with the pointer or keyboard focus; the `open` dot is also decorative and is not announced.
- All tiles are `Tab` stops, in addition to the arrows; `separatorBefore` inserts a vertical `role="separator"`.

## Motion

- With mouse or pen, each tile grows with the cursor's proximity, on a curve that fades out at `range` px (140), smoothed by a spring; the tile under the cursor reaches `magnification` times its size (1.6).
- On press, the tile makes two hops, one high and one low (0.62 s); the dot under the active one stretches into a short bar, and the name bubble rises and fades above the tile.
- On touch there is no magnification or bubble; with “reduce motion”, there is also no magnification or hops, and the bubble only fades.

## Responsive behavior

- The dock does not scroll or wrap: tiles have a fixed width (`size`), and in a container narrower than the row they overflow; size `size` and the number of items for the smallest screen.
- Tiles grow upward from the bar's base, which keeps its height; leave free space above the dock for the magnified tiles and the bubble.

## Performance

- On every pointer move over the dock, each tile measures its own position and animates its size on a spring; think a dozen tiles, not dozens.

## Notes for AI

- Each item needs `id`, `label`, and `icon` (an SVG of about 45% of `size`); control the active one with `value` and `onValueChange`, or leave it internal with `defaultValue`.
- `open` draws the “running” dot, `separatorBefore` a divider before the item, and `disabled` leaves it visible but inert; `size`, `magnification`, and `range` tune the magnification.
- Give the parent space above the dock (the demo uses `padding-top` of `--space-12`) and width for the whole row.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/dock · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
