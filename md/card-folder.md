# Card folder

> Fichário de cartões com abas: ao escolher uma aba, o cartão sobe, vem para a frente e os outros se acomodam atrás.

- Type: block, new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/card-folder
- Original description: A tabbed pile of index cards: picking a tab pulls that card up, drops it in front with a small bounce, and lets the others settle behind it.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-folder.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-folder.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-folder.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/card-folder.json`. Registry path, relative to the site address: `r/card-folder.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/blocks/card-folder/card-folder.tsx`
  - `components/ryan-ui/blocks/card-folder/card-folder.module.css`
  - `components/ryan-ui/lib/media.ts`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/card-folder.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Three to five short views of the same subject, such as a project's summary, tasks, files, and team, where the stacked-index-card metaphor helps.
- Presentation sections where switching tabs should be a visible gesture: the chosen card rises, drops to the front, and the others settle behind.

## When not to use

- Use [`tabs`](tabs.md) for ordinary application tabs, with variable-height content or many sections.
- Use [`card-stack`](card-stack.md) when the person goes through the cards one by one and dismisses them, instead of choosing by tab.
- Avoid with long content: all cards have the same height (`height`) and the body clips whatever exceeds it, with no scrolling.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import CardFolderPreview from "@/components/ryan-ui/blocks/card-folder/card-folder";

export default function CardFolderDemo() {
  return <CardFolderPreview />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CardFolder`

A folder of index cards: picking a tab pulls that card up out of the pile and drops it in front, while the others settle behind it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cards` | `FolderCard[]` | `sampleCards` | The cards, in tab order. Defaults to a sample project folder. |
| `value` | `string` | — | Id of the card in front. Pass it with `onValueChange` to control it. |
| `defaultValue` | `string` | — | Id of the card that starts in front when uncontrolled. Defaults to the first card. |
| `onValueChange` | `(id: string) => void` | — | Called with the id of the card whose tab was picked. |
| `height` | `number` | `296` | Height of a card body in px. Every card shares it, so the folder never changes size. |
| `label` | `string` | `"Project folder"` | Accessible name of the tab list. |
| `className` | `string` | — | Extra class for the folder. |

### `CardFolderPreview`

Ready preview: the sample project folder on a quiet stage.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

#### `FolderCard`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, used as the value. |
| `label` (required) | `string` | Text on the card's tab. |
| `icon` | `ReactNode` | Small icon before the label. |
| `content` (required) | `ReactNode` | What the card shows when it is in front. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Select the previous or next tab and move focus along with it, wrapping at the ends. |
| `Home` or `End` | Select the first or last tab. |
| `Tab` | Enters the selected tab (the only one in the Tab order) and then moves on to the controls of the front card, if any; those on the back cards are out of reach. |

## Accessibility

- Follows the tabs pattern: a `tablist` named by `label` (tied to the tabs by `aria-owns`), each tab with `aria-selected` and `aria-controls`, and one `tabpanel` per card.
- The back cards get `inert` and `aria-hidden`, so neither focus nor the screen reader enters the covered content.

## Motion

- When a tab is chosen, the card is pulled 58px upward in a short movement and then drops to the front with a slightly bouncy spring, while those that were in front of it step back one level, smaller and dimmer.
- The content of the card leaving the front stays visible until the new one lands, and a highlight marker grows at the top of the active tab.
- With “reduce motion” on, the stack order changes instantly, with no rise, bounce, or transitions.

## Responsive behavior

- The folder takes `min(30rem, 100%)` and the tabs share the width equally, truncating long labels with ellipses; below 26rem (container query) the tab icons disappear and the text shrinks.

## Performance

- All cards stay mounted at all times (the back ones only hidden), so each one's content is rendered even when it is not in front.

## Notes for AI

- Import `CardFolder` by name (the default export is the preview) and pass `cards` with `id`, `label`, optional `icon`, and `content`: without `cards`, an example project folder appears.
- Control the front card with `value` and `onValueChange`, or set only the initial one with `defaultValue`.
- `height` (296 by default) is the height in px of the body of all cards; size it by the tallest content, because the excess is clipped.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/card-folder · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
