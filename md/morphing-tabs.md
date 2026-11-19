# Morphing tabs

> Abas com uma pílula ativa que estica e muda de forma ao viajar, enquanto o painel troca na mesma direção.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/morphing-tabs
- Original description: Tabs whose active pill stretches, thins and squares off as it travels to the next tab, while the panel crossfades in the direction of travel.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-tabs.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-tabs.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-tabs.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/morphing-tabs.json`. Registry path, relative to the site address: `r/morphing-tabs.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/blocks/morphing-tabs/morphing-tabs.tsx`
  - `components/ryan-ui/blocks/morphing-tabs/morphing-tabs.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/morphing-tabs.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Section switching inside a card or page where the switch itself deserves attention: the active pill travels, stretching toward the new tab.
- A few tabs with short labels whose panels have different heights: the content area animates the height from one panel to the other.

## When not to use

- Use [`tabs`](tabs.md) when you need to compose triggers and panels freely or keep panels mounted; here only the active panel exists in the DOM.
- Use [`segmented-control`](segmented-control.md) when the choice only changes a mode or filter and there is no associated panel.
- Use [`expandable-tabs`](expandable-tabs.md) when the tabs are icons and the space only fits the label of the active tab.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import MorphingTabsPreview from "@/components/ryan-ui/blocks/morphing-tabs/morphing-tabs";

export default function MorphingTabsDemo() {
  return <MorphingTabsPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MorphingTabs`

Tabs with a liquid active pill. The pill is a clipped copy of the tab row in the accent color, so the label under it inverts exactly at its edge. When the selection moves, the leading edge springs ahead and the trailing edge follows: the pill stretches, thins and squares off on the way, then settles back into a pill at the new width. The panel leaves and enters along the same direction.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` (required) | `MorphingTab[]` | — | The tabs, in order. |
| `value` | `string` | — | Active tab id (controlled). |
| `defaultValue` | `string` | — | Active tab id on first render (uncontrolled). Defaults to the first tab. |
| `onValueChange` | `(value: string) => void` | — | Called with the id of the tab that was picked. |
| `label` | `string` | `"Sections"` | Accessible name of the tab list. |
| `className` | `string` | — | Extra class for the root. |

### `MorphingTabsPreview`

Ready preview: a workspace card with four sections of different heights.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `MorphingTab`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Stable value of the tab. |
| `label` (required) | `string` | Tab text. |
| `icon` | `ReactNode` | Optional icon before the label. |
| `content` (required) | `ReactNode` | Panel shown while the tab is active. |
| `disabled` | `boolean` | A disabled tab cannot be picked and is skipped by the arrow keys. |

## Keyboard

| Keys | Action |
| --- | --- |
| `→` or `←` | Select the next or previous tab, wrapping around at the ends and skipping disabled ones; selection follows focus. |
| `Home` or `End` | Select the first or last enabled tab. |
| `Tab` | Enters the list at the active tab and then moves to the panel, which is focusable. |

## Accessibility

- Follows the tabs pattern: `role="tablist"` with `aria-label` coming from `label`, tabs with `aria-selected` and `aria-controls`, and a `role="tabpanel"` panel linked by `aria-labelledby`.
- Uses roving tabindex (only the active tab is in the Tab order), and the colored copy of the row that forms the pill is `aria-hidden`.
- The default `label` is “Sections”, in English; pass the real name of the tab set.

## Motion

- The pill is a clip (`clip-path`) of a copy of the row in the highlight color: the leading edge arrives first with a fast spring and the trailing edge follows with a slower one, which stretches the pill.
- While stretched it thins (up to 5 px less at top and bottom) and gets squarer corners, and returns to the pill shape on arrival; the panel exits and enters sliding 36 px in the direction of travel, with the height on a spring.
- With “reduce motion” on, the pill jumps to the new tab and the panel and height change instantly.

## Responsive behavior

- If the row of tabs is wider than the available space, it scrolls horizontally with the scrollbar hidden; below 26rem of viewport the tabs' side padding shrinks.

## Performance

- The pill animates only `clip-path` from two motion values, with no per-frame layout; labels and icons are rendered twice because of the colored copy.

## Notes for AI

- Import the named component `MorphingTabs`; the file's default export is the preview with an example card.
- The API is an array: `tabs` with `id`, `label`, `icon`, `content`, and `disabled`; control it with `value` and `onValueChange` or use `defaultValue`.
- Because only the active panel stays mounted, local state inside `content` is lost when switching tabs; and the list's 4 px inset in the CSS must match the component's `INSET` constant.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/morphing-tabs · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
