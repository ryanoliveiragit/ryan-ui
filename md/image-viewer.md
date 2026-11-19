# Image viewer

> Galeria de miniaturas que se ampliam num visualizador com setas, gesto de deslizar, zoom e arraste; Esc devolve a imagem ao lugar.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/image-viewer
- Original description: A thumbnail gallery whose pictures grow into a lightbox with a shared-element zoom, with arrows, swipe, zoom and pan, a focus trap, and Escape closing back into the thumbnail.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-viewer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-viewer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-viewer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/image-viewer.json`. Registry path, relative to the site address: `r/image-viewer.json`.

- npm packages: `motion`, `lucide-react`, `@radix-ui/react-dialog`
- Files, once installed:
  - `components/ryan-ui/image-viewer/image-viewer.tsx`
  - `components/ryan-ui/image-viewer/image-viewer.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react @radix-ui/react-dialog`.
2. Copy the files listed above. The content of each one is in `r/image-viewer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Photo gallery (product, travel, portfolio, attachments) where the user opens an image, zooms in, and moves to the neighboring ones.
- When opening the image should preserve the sense of place: the thumbnail grows into the image and returns to the same spot on close.
- Images with a short caption that call for zoom by mouse wheel, pinch, double click, or keyboard.

## When not to use

- Use [`carousel`](carousel.md) to move through slides within the page itself, without opening a full-screen layer.
- Use [`image-compare`](image-compare.md) to compare two versions of the same image.
- Use [`infinite-masonry`](infinite-masonry.md) for a long feed of varying heights that loads more on scroll; here the grid has fixed columns and mounts all thumbnails.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { ImageViewer } from "@/components/ryan-ui/image-viewer/image-viewer";
import type { ImageViewerItem } from "@/components/ryan-ui/image-viewer/image-viewer";
import { photo } from "@/components/ryan-ui/lib/media";
import type { PhotoId } from "@/components/ryan-ui/lib/media";
import { Caption, Stack, demoStage } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const shots: [PhotoId, string, string][] = [
  ["lisbon-tram", "Tram 28 climbing toward Graça", "Tram 28 climbing toward Graça, a little after seven."],
  ["mountain-ridges", "Mountain ridges fading into the dusk", "Ridges fading into the dusk on the walk back down."],
  ["alpine-lake", "A still alpine lake", "The lake before the wind picked up."],
  ["pool-house", "The pool house arches", "The pool house, empty until noon."],
  ["lisbon-rooftops", "Terracotta rooftops in Lisbon", "Rooftops from the Senhora do Monte lookout."],
  ["sunroom", "Arched windows of a sunroom", "Breakfast in the sunroom."],
];
const images: ImageViewerItem[] = shots.map(([id, alt, caption]) => { const { src, width, height } = photo(id); return { src, alt, caption, width, height }; });

export default function ImageViewerDemo() {
  // On the docs page the lightbox opens inside the preview: the photo grows out of its thumbnail and fits the preview, and the page keeps scrolling.
  const [container] = useState(demoStage);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Stack width={460} gap={3}>
      <ImageViewer images={images} value={open} onValueChange={setOpen} label="Trip photos" container={container} />
      <Caption>{open === null ? "Open a photo. Inside: arrows or swipe to move, wheel, pinch or double-click to zoom, drag to pan, Escape to close." : `Viewing photo ${open + 1} of ${images.length}.`}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ImageViewer`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` (required) | `ImageViewerItem[]` | — | The images, in order. |
| `value` | `number \| null` | — | Index of the open image, or null when the lightbox is closed (controlled). |
| `defaultValue` | `number \| null` | `null` | Open image when uncontrolled. Defaults to closed. |
| `onValueChange` | `(index: number \| null) => void` | — | Called when an image opens, when the open image changes, and with null on close. |
| `columns` | `number` | `3` | Number of columns in the thumbnail grid. |
| `thumbnailRatio` | `number` | `1` | Width divided by height of each thumbnail: 1 is a square, 4 / 3 a landscape tile. |
| `loop` | `boolean` | `true` | Moving past the last image returns to the first, and back. |
| `maxZoom` | `number` | `4` | Largest zoom factor. |
| `label` | `string` | `"Image gallery"` | Accessible name of the gallery and of the lightbox. |
| `className` | `string` | — | Extra class for the thumbnail grid. |
| `container` | `HTMLElement \| null` | — | Opens the lightbox inside this element instead of over the whole page: the backdrop covers only the element and the image fits in it. The element needs position: relative and overflow: hidden. The page around it stays usable while the lightbox is open: nothing is scroll-locked or hidden from assistive technology, and Escape, the close button and a tap beside the image still close it. |

### Exported types

#### `ImageViewerItem`

| Field | Type | Description |
| --- | --- | --- |
| `src` (required) | `string` | URL of the full image shown in the lightbox. |
| `alt` (required) | `string` | Alternative text. It also names the thumbnail button. |
| `thumbnail` | `string` | Smaller image for the grid. Defaults to `src`. |
| `width` | `number` | Intrinsic width in pixels. With `height`, it lets the lightbox know the shape before the image loads. |
| `height` | `number` | Intrinsic height in pixels. |
| `caption` | `string` | Line of text shown under the open image. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On a thumbnail, open the viewer on that image. |
| `←` or `→` | Go to the previous or next image; with `loop`, wrap at the ends. |
| `Home` or `End` | Go to the first and last image. |
| `+` or `-` | Zoom in and out in 1.6× steps, up to `maxZoom`; `=` also zooms in and `0` returns to the fitted size. |
| `Esc` | Closes the viewer: the image returns to the thumbnail and so does focus. |
| `Tab` or `Shift + Tab` | Cycle through the viewer's controls (zoom, close, arrows, thumbnail strip) without leaving it. |

## Accessibility

- The viewer is a Radix dialog: it traps focus, closes with `Esc`, and on close returns focus to the thumbnail of the last image viewed.
- Each thumbnail is a button with `aria-label` “Open image N of M: alt”, and the `aria-live` counter announces the current image on each change.
- Provide `alt` on all images (it names the buttons and is read in the counter) and `label` for the gallery; the control labels are hardcoded in English.

## Motion

- The pressed thumbnail grows on a spring to the size fitted to the screen and returns faster on close; if it is offscreen, the image only fades.
- Between images, the new one enters from the side of the movement; the drag follows the finger, resists when there is nowhere to go, and switches images past the threshold or on a fling.
- With “reduced motion”, opening, closing, and switching become a fade, and zoom by button or key jumps straight to the level.

## Responsive behavior

- The grid always keeps `columns` columns (3 by default), with no breakpoints: adjust the prop according to the available width.
- Below 640 px the side arrows disappear and navigation is by swipe and the thumbnail strip, which scrolls horizontally; the image's side margins drop from 84 px to 12 px.

## Performance

- Grid thumbnails use `loading="lazy"`; pass `thumbnail` with a smaller file, which also serves as a preview while the full image loads.
- Provide `width` and `height` so the viewer knows the aspect before loading; the thumbnail strip mounts all images at once, so very large galleries are heavy.

## Notes for AI

- The component renders the grid and the viewer: pass `images` with `src` and `alt`, and preferably `thumbnail`, `width`, `height`, and `caption`.
- `value` is the index of the open image or `null` (closed): control it with `onValueChange`, which receives the index on open or switch and `null` on close, or use `defaultValue`.
- The viewer opens in a full-screen portal (`position: fixed`, `z-index` 80 and 81); `className` applies only to the thumbnail grid.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/image-viewer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
