# Cylinder carousel

> Cartões dispostos em volta de um cilindro 3D que gira com arraste, setas ou teclado e para sempre em um cartão.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/cylinder-carousel
- Original description: Cards placed around a 3D cylinder that turns by drag, arrows and keys, snaps to the nearest card and dims the cards that turn away.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cylinder-carousel.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cylinder-carousel.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cylinder-carousel.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cylinder-carousel.json`. Registry path, relative to the site address: `r/cylinder-carousel.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/cylinder-carousel/cylinder-carousel.tsx`
  - `components/ryan-ui/cylinder-carousel/cylinder-carousel.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/cylinder-carousel.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Showcase for a small set of visual cards (rooms, products, plans) where one faces forward at a time and its neighbors appear in perspective.
- Picking one item from a few, when the rest of the screen reacts to the front card: `onValueChange` reports which card the cylinder stops on.

## When not to use

- Use [`carousel`](carousel.md) for a regular row of slides, with a page indicator and optional autoplay.
- Use [`card-stack`](card-stack.md) when the user decides card by card, discarding or choosing, with an undo option.
- Avoid it with dozens of cards: the cylinder radius grows with the count and all cards stay mounted; a grid or list works better.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { MapPin, Users } from "lucide-react";
import { CylinderCarousel } from "@/components/ryan-ui/cylinder-carousel/cylinder-carousel";
import { photo } from "@/components/ryan-ui/lib/media";
import type { PhotoId } from "@/components/ryan-ui/lib/media";
import { Caption, Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./cylinder-carousel.module.css";

export const stage: DemoStage = { height: 520 };

const rooms: { id: PhotoId; name: string; place: string; seats: number; price: string; open: boolean }[] = [
  { id: "sunroom", name: "The Sunroom", place: "Floor 4, east wing", seats: 8, price: "$42 / hour", open: true },
  { id: "home-office", name: "Quiet Corner", place: "Floor 2, library side", seats: 2, price: "$18 / hour", open: true },
  { id: "living-room", name: "The Lounge", place: "Ground floor", seats: 12, price: "$55 / hour", open: false },
  { id: "concert-hall", name: "Town Hall", place: "Floor 1, atrium", seats: 60, price: "$180 / hour", open: true },
  { id: "reading-chair", name: "Reading Nook", place: "Floor 3, north wing", seats: 1, price: "$9 / hour", open: true },
  { id: "wine-bar", name: "The Cellar", place: "Basement", seats: 16, price: "$70 / hour", open: false },
  { id: "pool-house", name: "Pool House", place: "Garden level", seats: 10, price: "$64 / hour", open: true },
  { id: "curved-facade", name: "Skyline Deck", place: "Roof terrace", seats: 24, price: "$95 / hour", open: true },
];

export default function CylinderCarouselDemo() {
  const [front, setFront] = useState(0);
  const room = rooms[front] ?? rooms[0]!;
  return (
    <Stack gap={3} width={640} align="center">
      <CylinderCarousel label="Rooms to book" value={front} onValueChange={setFront}>
        {rooms.map(item => (
          <article key={item.id} className={styles.room}>
            <img className={styles.photo} src={photo(item.id).src} alt="" draggable={false} />
            <div className={styles.info}>
              <span className={styles.status} data-open={item.open}>{item.open ? "Free now" : "Booked until 3:00"}</span>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.place}><MapPin size={13} aria-hidden="true" />{item.place}</p>
              <p className={styles.meta}><span><Users size={13} aria-hidden="true" />{item.seats}</span><strong>{item.price}</strong></p>
            </div>
          </article>
        ))}
      </CylinderCarousel>
      <Caption>Drag the cylinder, click a side card, or focus it and press the arrow keys. Facing you: {room.name}.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CylinderCarousel`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | One card per child. Three or more make a proper cylinder. |
| `value` | `number` | — | Index of the card facing the viewer (controlled). |
| `defaultValue` | `number` | `0` | Index of the card facing the viewer at first when uncontrolled. |
| `onValueChange` | `(index: number) => void` | — | Called with the index of the card that the cylinder settles on. |
| `cardWidth` | `number` | `220` | Card width in px. It shrinks to fit narrow containers. |
| `cardHeight` | `number` | `290` | Card height in px at full width; it scales with the card's width. |
| `gap` | `number` | `18` | Space in px between neighboring cards, measured along the cylinder. |
| `perspective` | `number` | `1100` | Viewing distance in px. Smaller values exaggerate the depth. |
| `controls` | `boolean` | `true` | Shows the previous and next buttons and the position counter. |
| `label` | `string` | `"Carousel"` | Accessible name of the carousel. |
| `className` | `string` | — | Extra class for the root element. |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | With focus on the stage, rotate to the previous or next card; quick presses accumulate. |
| `Home` or `End` | Rotate to the first or last card by the shortest path. |
| `Tab` | Moves through the stage, the front card's controls, and the previous and next buttons; the other cards are outside the focus order. |
| `Enter` or `Space` | On the previous and next buttons, rotate one card. |

## Accessibility

- The root is a group with `aria-roledescription="carousel"` named by `label`; each card is a `slide` group labeled “N of M”, and only the front one is exposed: the others get `aria-hidden` and `inert`.
- An `aria-live="polite"` region announces “Card N of M” on each change, and the previous and next buttons have their own `aria-label`.
- Pass `label` with the name of the set; the other read-out texts (“Previous card”, “Card 2 of 8”) are hardcoded in English in the code.

## Motion

- The front card follows the drag point by point; on release, a fling carries the rotation slightly further and a spring with a slight overshoot settles it on the nearest card.
- Cards darken as they move away from the front and the ones behind fade out; on entrance, the cylinder arrives spinning a little more than one card and stops on the initial one.
- With “reduced motion”, the rotation jumps straight to the target card, with no spring or entrance, and the counter changes with only a fade.

## Responsive behavior

- A `ResizeObserver` measures the stage: the card uses `cardWidth` or 58% of the available width, whichever is smaller, and the height shrinks in the same proportion.
- The stage uses `touch-action: pan-y`: on touch, dragging horizontally rotates the cylinder and vertical page scrolling stays free.

## Performance

- All cards stay mounted (the back ones are only hidden by `backface-visibility`) and each one follows the rotation to compute its own opacity; prefer few cards and light images.

## Notes for AI

- Each child becomes a card: pass three or more (with two, they become front and back; with no children, nothing is rendered).
- Control it with `value` and `onValueChange` (index of the front card) or leave it uncontrolled with `defaultValue`; `onValueChange` fires when the target is decided, before the spring finishes.
- Give the parent a width (the root takes 100%) and leave the height to `cardHeight` plus 96 px; inside the card, mark with `data-no-drag` the areas that must not start the drag.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/cylinder-carousel · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
