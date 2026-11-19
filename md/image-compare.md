# Image compare

> Arraste um divisor sobre duas imagens para ver o antes e o depois, também pelo teclado.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/image-compare
- Original description: Drag a divider across two images to see what changed.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-compare.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-compare.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-compare.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-compare.json`. Registry path, relative to the site address: `r/image-compare.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/image-compare/image-compare.tsx`
  - `components/ryan-ui/image-compare/image-compare.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/image-compare.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Before and after an edit: photo retouching, a screen redesign, the result of a filter or an upscale.
- Two versions of the same scene with the same framing (maps, renders, screenshots), where the difference shows when sliding the divider.

## When not to use

- Avoid it when the images have different proportions or framing: both are cropped to cover the same frame, and the point-by-point comparison is lost.
- Use [`image-viewer`](image-viewer.md) to zoom and browse several images.
- Use [`file-diff`](file-diff.md) to compare versions of text or code.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ImageCompare } from "@/components/ryan-ui/image-compare/image-compare";
import { photo } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 480 };

const cover = { width: "100%", height: "100%", objectFit: "cover", display: "block" } as const;

export default function ImageCompareDemo() {
  const [position, setPosition] = useState(50);
  const before = photo("terracotta-waves");
  const after = photo("sea-at-dusk");
  return (
    <Stack width={560} gap={3}>
      <ImageCompare
        defaultPosition={50}
        onPositionChange={p => setPosition(Math.round(p))}
        labels={["Original", "Retouched"]}
        label="Original and retouched photo"
        aspectRatio="4 / 3"
        before={<img src={before.src} alt={before.alt} style={cover} />}
        after={<img src={after.src} alt={after.alt} style={cover} />}
      />
      <Caption>Drag the divider, or focus it and use the arrow keys. Retouched shows {100 - position}%.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ImageCompare`

Before and after, split by a divider. Drag anywhere to move it: the handle follows 1:1, rubber-bands past the edges, and stays where it is released. A press on the image springs the divider there; on touch the press waits to see a sideways drag so the page still scrolls. Arrow keys step 1% (Shift for 10%), Home and End reveal one side fully, and a double-click on the handle springs it back to the middle.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` (required) | `ReactNode` | — | The original, shown on the left (or top). Pass an image with its own alt text; it is sized to cover the frame. |
| `after` (required) | `ReactNode` | — | The result, shown on the right (or bottom). |
| `position` | `number` | — | Where the divider sits, in percent from the left (or top). |
| `defaultPosition` | `number` | `50` | — |
| `onPositionChange` | `(position: number) => void` | — | — |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Vertical stacks the images top and bottom. Changing it swings the divider a quarter turn instead of swapping layouts. |
| `labels` | `[string, string] \| false` | `["Before", "After"]` | Captions over each side. They fade as the divider reaches them. Pass false to hide them. |
| `label` | `string` | `"Before and after"` | Accessible name of the divider. |
| `aspectRatio` | `string` | `"3 / 2"` | Frame proportions, as a CSS aspect-ratio. |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move the divider 1% left or right; in vertical orientation, use `↑` and `↓`. |
| `Shift + ←` or `Shift + →` | Move the divider in 10% steps. |
| `Page Up` or `Page Down` | Also move 10% at a time. |
| `Home` or `End` | `Home` shows only the before image; `End`, only the after image. |
| `Tab` | Moves focus to the divider handle. |

## Accessibility

- The handle is a `role="slider"` named by `label`, with `aria-orientation` and a value from 0 to 100 that says how much of the after image is visible (the `aria-valuetext` “N% after” is hardcoded in English).
- The captions over the images are `aria-hidden`: pass images with their own `alt` in `before` and `after`.
- Clicking or dragging on the photo moves focus to the handle, so the arrow keys work right afterward.

## Motion

- The handle follows the drag point by point, gives like an elastic past the edges, and stays where it was released; a click on the photo moves the divider there on a spring.
- During the drag the round handle becomes a capsule and its arrows move apart; changing `orientation` rotates the divider a quarter turn instead of switching the layout at once.
- With “reduced motion”, the divider jumps to the position, with no spring or elastic, and the orientation change is immediate.

## Responsive behavior

- The frame takes 100% of the parent's width and the height comes from `aspectRatio` (default `3 / 2`); images, `picture`, and videos passed in are fitted to cover it.
- On touch, a finger on the photo waits for a drag along the divider's axis before taking over the gesture, so the page keeps scrolling; the handle responds immediately and has a touch area larger than the visible circle.

## Performance

- During the drag the position runs on motion values, and `onPositionChange` fires at most once per whole percentage point.

## Notes for AI

- `before` and `after` are nodes: pass `<img>` (or `picture`, video) with the same framing; the component already applies width, height, and `object-fit: cover`.
- `position` is the percentage from the left (or top): control it with `onPositionChange` or leave it uncontrolled with `defaultPosition`; a double click on the handle resets to 50.
- `labels={false}` hides the captions, `labels` with two texts replaces them (the default is “Before” and “After”), and `aspectRatio` accepts any CSS value, such as `"4 / 3"`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/image-compare · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
