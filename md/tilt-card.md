# Tilt card

> Cartão que se inclina em 3D na direção do cursor, com um brilho que acompanha o movimento, e volta ao lugar com mola.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tilt-card
- Original description: A card that tilts in 3D toward the cursor with a glare highlight and springs back flat on leave; it stays still on touch and with reduced motion.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tilt-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tilt-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tilt-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tilt-card.json`. Registry path, relative to the site address: `r/tilt-card.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/tilt-card/tilt-card.tsx`
  - `components/ryan-ui/tilt-card/tilt-card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/tilt-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Highlight cards in a showcase or product page, such as a travel destination or a boarding pass, where depth draws attention to a few items.
- When parts of the content should float above the face: each `TiltCardLayer` rises `depth` px during hover and shifts against the background as the card tilts.

## When not to use

- Use [`card`](card.md) for ordinary cards in lists and panels, where the motion would only distract.
- Use [`wallet-card`](wallet-card.md) for a payment card that also flips to show the back.
- In interfaces used mostly by touch the effect is lost: the card only tilts with a mouse.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { Plane, Star } from "lucide-react";
import { TiltCard, TiltCardLayer } from "@/components/ryan-ui/tilt-card/tilt-card";
import { photo } from "@/components/ryan-ui/lib/media";
import { Caption, Row, Stack } from "./_kit";
import styles from "./tilt-card.module.css";

export default function TiltCardDemo() {
  const cover = photo("alpine-lake");
  return (
    <Stack gap={5} align="center" width={620}>
      <Row gap={6} justify="center" align="stretch">
        <TiltCard className={styles.trip} maxTilt={12}>
          <img className={styles.cover} src={cover.src} alt={cover.alt} draggable={false} />
          <TiltCardLayer depth={36} className={styles.tripBody}>
            <span className={styles.tag}><Star size={12} aria-hidden="true" />Editor's pick</span>
            <div>
              <h3 className={styles.title}>Lake Bled, Slovenia</h3>
              <p className={styles.meta}>4 nights · from $640 per person</p>
            </div>
          </TiltCardLayer>
        </TiltCard>

        <TiltCard className={styles.pass} maxTilt={8}>
          <div className={styles.passBody}>
            <TiltCardLayer depth={18} className={styles.passHead}>
              <span className={styles.airline}><Plane size={16} aria-hidden="true" />Northwind Air</span>
              <span className={styles.gate}>Gate B14</span>
            </TiltCardLayer>
            <TiltCardLayer depth={40} className={styles.route}>
              <span><strong>LIS</strong>Lisbon</span>
              <span className={styles.line} aria-hidden="true" />
              <span><strong>LJU</strong>Ljubljana</span>
            </TiltCardLayer>
            <TiltCardLayer depth={18} className={styles.passFoot}>
              <span><small>Boarding</small>07:45</span>
              <span><small>Seat</small>14A</span>
              <span><small>Group</small>2</span>
            </TiltCardLayer>
          </div>
        </TiltCard>
      </Row>
      <Caption>Move the cursor across a card. It stays flat on touch screens and with reduced motion.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `TiltCard`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | Card content. Wrap parts in `TiltCardLayer` to float them above the card face. |
| `maxTilt` | `number` | `10` | Largest lean in degrees, reached at the card's edges. |
| `hoverScale` | `number` | `1.02` | How much the card grows while hovered. `1` keeps its size. |
| `perspective` | `number` | `900` | Viewing distance in px. Smaller values exaggerate the depth. |
| `glare` | `boolean` | `true` | Shows the highlight that follows the cursor. |
| `glareOpacity` | `number` | `0.18` | Strongest opacity of the glare, from 0 to 1. |
| `disabled` | `boolean` | `false` | Keeps the card flat and ignores the cursor. |
| `onTiltChange` | `(tilt: { x: number; y: number }) => void` | — | Reports the lean as the cursor moves: x and y from -1 to 1, both 0 when the card rests. |
| `className` | `string` | — | Extra class names for the root element. |
| `style` | `CSSProperties` | — | Inline styles for the root element, for sizes and CSS variables. |

### `TiltCardLayer`

A part of the card that floats above its face, so it shifts against the background as the card leans.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | Content that floats above the card face. |
| `depth` | `number` | `24` | Distance above the card face in px. Higher layers shift more as the card leans. |
| `className` | `string` | — | Extra class names for the root element. |

## Accessibility

- It is a visual container, with no role or focus of its own: if the whole card leads somewhere, put a link or button with the action text inside it.
- The tilt only responds to the mouse; keyboard, touch, pen, and screen readers don't perceive it, so no information should depend on it.
- The glare is `aria-hidden` and has `pointer-events: none`, so links and buttons beneath it stay clickable.

## Motion

- The card rotates up to `maxTilt` degrees (10 by default) at the edges, following the cursor with a firm spring and no bounce, scales up to `hoverScale`, and shows a glare at the cursor position.
- On leaving, it returns to flat on a spring; the `TiltCardLayer` layers rise with the hover and return to the face at rest, where the text is sharp.
- With “reduced motion” on, as with `disabled`, the card stays flat: no rotation, no scale, no glare, and no raised layers.

## Performance

- The card keeps `will-change: transform` all the time (except with “reduced motion”), which reserves a compositing layer per instance; in a grid with dozens of them, use the effect only on highlights.

## Notes for AI

- Import `TiltCard` (and `TiltCardLayer`, if you want layers) from `@/components/ryan-ui/tilt-card/tilt-card`; set width and height via `className` or `style`, because the inner card fills the container's height.
- Every element between the card and the layers needs `transform-style: preserve-3d`, like the boarding pass body in the demo; without it the layers flatten onto the face.
- The card doesn't clip its content: for a cover image, use `position: absolute`, `inset: 0`, and `border-radius: inherit`; `onTiltChange` fires on every mouse movement, so avoid heavy state there.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tilt-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
