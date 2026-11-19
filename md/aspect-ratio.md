# Aspect ratio

> Caixa que mantém a proporção e desliza suavemente para outra (16:9, 4:3, 1:1, 9:16) sem deixar a mídia descoberta.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/aspect-ratio
- Original description: A box that holds a width to height ratio and springs to a new one when it changes, keeping the media inside covered.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/aspect-ratio.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/aspect-ratio.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/aspect-ratio.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/aspect-ratio.json`. Registry path, relative to the site address: `r/aspect-ratio.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/aspect-ratio/aspect-ratio.tsx`
  - `components/ryan-ui/aspect-ratio/aspect-ratio.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/aspect-ratio.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A preview that switches between landscape, square, and portrait (a crop format selector, for example) without layout shift.
- Reserve the space of an image, video, or `iframe` before loading, with the media cropped from the center.
- Vertical formats that should not push the page: with `maxHeight` the box narrows instead of growing.

## When not to use

- When the ratio never changes and there is no cropping, the CSS `aspect-ratio` property does the job without a client component.
- Use [`image-compare`](image-compare.md) to compare two images with a divider.
- Use [`image-viewer`](image-viewer.md) when photos need to open enlarged, with zoom and navigation.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { AspectRatio } from "@/components/ryan-ui/aspect-ratio/aspect-ratio";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { photo } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import styles from "./aspect-ratio.module.css";

const formats = [
  { value: "16/9", label: "16:9", use: "Widescreen video and hero banners" },
  { value: "4/3", label: "4:3", use: "Product shots and presentation slides" },
  { value: "1/1", label: "1:1", use: "Feed posts and catalog thumbnails" },
  { value: "9/16", label: "9:16", use: "Stories and vertical video" },
];

export default function AspectRatioDemo() {
  const [ratio, setRatio] = useState("16/9");
  const picture = photo("mountain-ridges");
  const format = formats.find(entry => entry.value === ratio) ?? formats[0]!;

  return (
    <Stack width={480} gap={4} align="center">
      <div className={styles.frame}>
        <AspectRatio ratio={ratio} maxHeight={264}>
          <img src={picture.src} alt={picture.alt} draggable={false} />
          <span className={styles.badge}>{format.label}</span>
        </AspectRatio>
      </div>
      <SegmentedControl label="Crop format" options={formats.map(({ value, label }) => ({ value, label }))} value={ratio} onValueChange={setRatio} />
      <Caption>{format.use}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AspectRatio`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number \| string` | — | Width divided by height. A number (`16 / 9`) or a string such as `"16/9"`, `"16:9"` or `"1.85"`. |
| `maxHeight` | `number \| string` | — | Tallest the box may get, in px or any CSS length. Past it the box narrows instead of growing, so a portrait ratio never pushes the page down. |
| `fit` | `"cover" \| "contain"` | `"cover"` | How direct media children (img, video, canvas, iframe) fill the box. |
| `radius` | `"panel" \| "control" \| "none"` | `"panel"` | Corner style: `panel` uses the panel radius, `none` leaves the corners square. |
| `animated` | `boolean` | `true` | Set to false to switch ratios instantly. Reduced motion always switches instantly. |
| `onRatioSettled` | `(ratio: number) => void` | — | Runs when the box has settled on a new ratio. |
| `children` | `ReactNode` | — | Media or any content. Direct media children are stretched over the box; other children are laid out by you. |
| `className` | `string` | — | Extra class names for the root element. |
| `style` | `CSSProperties` | — | Inline styles for the root element, for sizes and CSS variables. |

### Other exports

- `parseRatio` (function)

## Accessibility

- It is a `div` with no role or label: the description comes from the media you place inside, so provide `alt` on the image or `title` on the `iframe`.

## Motion

- When `ratio` changes, the ratio itself animates with a no-overshoot spring and the browser recalculates width and height on every frame, so the media never stretches as it would with a `scale`.
- The first render does not animate; `animated={false}` swaps immediately, and with “reduce motion” the swap is always instant.

## Responsive behavior

- The box takes 100% of the parent's width; with `maxHeight` the width becomes the smaller of 100% and `maxHeight` times the ratio, and the box is centered in the row.

## Performance

- The animation touches layout, not `transform`: each frame recalculates the box and what comes after it, which is light for a preview and heavy for a whole grid changing ratio at the same time.

## Notes for AI

- `ratio` accepts a number (`16 / 9`) or text (`"16/9"`, `"16:9"`, `"1.85"`); an unreadable value falls back to 16:9 without a warning.
- Direct children `img`, `video`, `canvas`, `iframe`, and `picture` are stretched over the box and cropped (`fit="contain"` shows the whole media); other children you position yourself, since the box is `position: relative`.
- `onRatioSettled` fires when the box settles on a new ratio (it does not fire on mount); the parent must define the width.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/aspect-ratio · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
