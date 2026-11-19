# Preview rail

> Trilho de cartões em que o cartão sob o cursor ou em foco se alarga para mostrar a prévia enquanto os outros encolhem.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/preview-rail
- Original description: A rail of image cards in which the hovered or focused one widens to reveal its preview while the others shrink to a slice.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/preview-rail.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/preview-rail.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/preview-rail.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/preview-rail.json`. Registry path, relative to the site address: `r/preview-rail.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/preview-rail/preview-rail.tsx`
  - `components/ryan-ui/preview-rail/preview-rail.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/preview-rail.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showcase of a few image highlights (destinations, guides, projects, categories) where hovering shows the preview and pressing the open card leads to the detail.
- Page sections where one item is always in the spotlight and the others appear as slices with the title.

## When not to use

- Use [`carousel`](carousel.md) when there are many items or all need the same prominence; here, each additional card narrows the closed slices.
- Use [`image-viewer`](image-viewer.md) to open and zoom photos.
- Use [`tabs`](tabs.md) when each option reveals its own content (text, forms) instead of a short preview over an image.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { PreviewRail } from "@/components/ryan-ui/preview-rail/preview-rail";
import type { PreviewRailItem } from "@/components/ryan-ui/preview-rail/preview-rail";
import { photo } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 460 };

const guides: PreviewRailItem[] = [
  { id: "tram", eyebrow: "Lisbon", title: "Route 28 by tram", description: "From Graça down to Estrela, with the four stops worth getting off for.", meta: "Half a day · 9 km", image: photo("lisbon-tram").src },
  { id: "ridge", eyebrow: "Dolomites", title: "The ridge walk at dusk", description: "A gentle loop that keeps the valley on your left and the light in front of you.", meta: "3 h 20 min · moderate", image: photo("mountain-ridges").src },
  { id: "pool", eyebrow: "Alentejo", title: "A weekend at the pool house", description: "Whitewashed arches, a cold plunge and nothing on the schedule until dinner.", meta: "2 nights · sleeps four", image: photo("pool-house").src },
  { id: "hall", eyebrow: "Porto", title: "Tuesday at the concert hall", description: "Rush seats open at six. Arrive early and take the back stairs to the upper tier.", meta: "Evening · from 12 €", image: photo("concert-hall").src },
  { id: "sunroom", eyebrow: "Sintra", title: "Breakfast in the sunroom", description: "A glasshouse café behind the old nursery, best before the tour buses arrive.", meta: "Opens 8:00 · walk-in", image: photo("sunroom").src },
];

export default function PreviewRailDemo() {
  const [open, setOpen] = useState("ridge");
  const [saved, setSaved] = useState<string | null>(null);
  const current = guides.find(guide => guide.id === open);
  return (
    <Stack width={760} gap={4}>
      <PreviewRail items={guides} value={open} onValueChange={setOpen} onSelect={guide => setSaved(guide.title)} label="Weekend guides" />
      <Caption>{saved ? `Opened “${saved}”.` : `Previewing “${current?.title}”. Hover, tap or use the arrow keys; press the open card to pick it.`}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PreviewRail`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `PreviewRailItem[]` | — | The cards, in order. |
| `value` | `string` | — | Id of the open card (controlled). |
| `defaultValue` | `string` | — | Open card when uncontrolled. Defaults to the first one. |
| `onValueChange` | `(value: string) => void` | — | Called when another card opens. |
| `onSelect` | `(item: PreviewRailItem) => void` | — | Called when the open card is pressed (click, tap, Enter or Space). |
| `trigger` | `"hover" \| "press"` | `"hover"` | What opens a card with a mouse: hovering it, or only pressing it. Keyboard focus and taps always open. |
| `ratio` | `number` | `4` | How many times wider the open card is than a closed one. |
| `height` | `number` | `320` | Rail height in pixels. |
| `label` | `string` | `"Previews"` | Accessible name of the group. |
| `className` | `string` | — | Extra class for the outer element. |

### Exported types

#### `PreviewRailItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, used as the rail's value. |
| `title` (required) | `string` | Card title, shown on the closed card's label and in the open preview. |
| `eyebrow` | `string` | Short line above the title: a category, a place, a date. |
| `description` | `string` | One or two sentences shown only while the card is open. |
| `meta` | `string` | Detail shown at the bottom of the preview, such as a duration or a count. |
| `image` (required) | `string` | Image URL for the card background. |
| `alt` | `string` | Alternative text for the image. Leave empty when the title already says it. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move focus to the previous or next card, which opens on receiving focus; `↑` and `↓` do the same. |
| `Home` or `End` | Go to the first and last card. |
| `Enter` or `Space` | On the open card, call `onSelect`. |
| `Tab` | Each card is a `Tab` stop, and focus opens the card. |

## Accessibility

- The rail is a `role="group"` named by `label`; each card is a `<button>` with `aria-expanded` and the title in hidden text, and the preview texts enter the button's name when it opens.
- Focus opens the card, so keyboard users see the same preview as the cursor; on touch, the first tap on a closed card only opens it, and the second selects it.
- The image's `alt` is empty by default: fill in `alt` on the item only when the image says something the title doesn't.

## Motion

- Only `flex-grow` animates, on a spring with no overshoot: the open card grows to `ratio` times the width of a closed one, and the rest become slices.
- The open card's image brightens, the vertical label disappears, and the preview lines rise 10 px in sequence.
- With “reduced motion”, the width swaps instantly and the preview only fades.

## Responsive behavior

- The root is a container: at up to 520 px the rail becomes a column, 1.5 times taller than `height`, and the open card grows vertically, with the closed cards' labels horizontal.
- A closed card's width is the rail's width, minus the gaps, divided by `ratio` + number of items − 1; with many items, the slices become too narrow for the label.

## Performance

- Animating `flex-grow` redoes the row's layout on every frame, so the image and preview are born at the open size and the card only reveals them; all images load immediately, without `loading="lazy"`.

## Notes for AI

- Each item needs `id`, `title`, and `image`; `eyebrow`, `description` (clamped to two lines), and `meta` are optional.
- There is always one open card (the first, by default): `value` with `onValueChange` controls which, and `onSelect` fires when pressing the already open card; do the navigation in it, since the card is a button, not a link.
- `trigger="press"` makes the mouse open cards only on click, not on hover (focus and touch still open them); `height` is in px, and the width comes from the parent.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/preview-rail · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
