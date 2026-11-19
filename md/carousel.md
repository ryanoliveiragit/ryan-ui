# Carousel

> Carrossel arrastável que centraliza o slide ativo, com indicadores, setas e rotação opcional.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/carousel
- Original description: Browse a row of slides by dragging, flicking, or arrowing through them.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/carousel.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/carousel.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/carousel.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/carousel.json`. Registry path, relative to the site address: `r/carousel.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/carousel/carousel.tsx`
  - `components/ryan-ui/carousel/carousel.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/carousel.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A short, ordered set of items of the same kind, such as products or case studies, where the neighbors in view signal that there is more.
- Touch navigation (drag, quick swipe, horizontal trackpad gesture) with equivalent arrows, indicators, and keyboard.
- Optional automatic rotation with a visible pause button, via `interval`.

## When not to use

- Use [`marquee`](marquee.md) for a strip that scrolls on its own without stopping at each item, such as a row of logos.
- Use [`image-viewer`](image-viewer.md) for photos that need to open enlarged, with zoom.
- Use [`card-stack`](card-stack.md) when the user decides on each item instead of just browsing.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Carousel } from "@/components/ryan-ui/carousel/carousel";
import { photo } from "@/components/ryan-ui/lib/media";
import { Stack } from "./_kit";

const suites = [
  { id: "sunroom", name: "Garden suite", price: "$240 a night", img: photo("sunroom") },
  { id: "reading-chair", name: "Library suite", price: "$285 a night", img: photo("reading-chair") },
  { id: "pool-house", name: "Pool house", price: "$360 a night", img: photo("pool-house") },
  { id: "bedroom", name: "Loft suite", price: "$310 a night", img: photo("home-office") },
  { id: "curved-facade", name: "Courtyard room", price: "$195 a night", img: photo("curved-facade") },
];

export default function CarouselDemo() {
  return (
    <Stack width={720}>
      <Carousel label="Harbour suites" interval={4500}>
        {suites.map(s => (
          <figure key={s.id} style={{ margin: 0, overflow: "hidden", border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", background: "var(--surface)" }}>
            <img src={s.img.src} alt={s.img.alt} draggable={false} style={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
            <figcaption style={{ padding: "var(--space-3) var(--space-4)", display: "grid" }}>
              <strong>{s.name}</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{s.price}</span>
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Carousel`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | Names the carousel for assistive technology, for example "From the Harbour suites". |
| `children` (required) | `ReactNode` | — | One child per slide. |
| `index` | `number` | — | Controlled active slide. Pair with `onIndexChange`. |
| `defaultIndex` | `number` | `0` | — |
| `onIndexChange` | `(index: number) => void` | — | — |
| `slideSize` | `string` | `"min(80cqw, 340px)"` | Width of one slide as a CSS length. Use `cqw` for a share of the carousel width. |
| `slideLabel` | `(index: number, count: number) => string` | `defaultSlideLabel` | Names each slide and its indicator. Defaults to "2 of 5". |
| `interval` | `number` | — | Milliseconds per slide. Adds a play control that rotates through the slides; rotation pauses on hover, keyboard focus, and drag, and is unavailable with reduced motion. |
| `autoplay` | `boolean` | `false` | Starts rotating on mount. Off by default, so motion begins with the viewer. |
| `className` | `string` | — | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Go to the previous or next slide, with focus anywhere in the carousel outside text fields. |
| `Home` or `End` | Go to the first or last slide. |
| `Tab` | Moves through the slides area, the active slide's content, the rotation button, the selected indicator, and the two arrows. |
| `Enter` or `Space` | Trigger the focused button: pause or start rotation, choose a slide, previous or next. |

## Accessibility

- The `section` has `aria-roledescription="carousel"` and the name from `label`; each slide is a `tabpanel` labeled by `slideLabel`, and the indicators form a `tablist` in which only the selected one is in the tab order.
- Slides away from the center are `inert`: links and buttons inside them only work on the active slide, and a manual change is announced in an `aria-live` region.
- Rotation pauses on mouse hover, on keyboard focus, while dragging, off screen, and with the tab hidden; the control labels (“Next slide”, “Pause slide rotation”) are in English in the code.

## Motion

- The track goes to the slide with a no-overshoot spring, carrying the gesture's velocity; at the ends it resists like an elastic band.
- Slides shrink to 90% and fade to 50% as they move away from the center, and the indicator stretches into a pill that travels along with it, frame by frame; during rotation, the pill empties until the swap.
- With “reduce motion”, the track jumps to the slide and automatic rotation is unavailable (the button does not even appear).

## Responsive behavior

- The root is a size container and needs a defined width; `slideSize` (default `min(80cqw, 340px)`) accepts any CSS length, and `cqw` is the fraction of the carousel's width.
- With a container up to 340 px the controls row tightens; the slides area uses `touch-action: pan-y`, so the vertical gesture scrolls the page.

## Performance

- All slides stay mounted and read the track position on every frame for scale and opacity: keep the set short.
- With `interval`, an `IntersectionObserver` and the page visibility event pause rotation when no one is looking.

## Notes for AI

- Each child is a slide (give it a stable `key`) and `label` is required; index controlled with `index` and `onIndexChange`, or uncontrolled with `defaultIndex`.
- `interval` (ms per slide) only adds the rotation button; it starts stopped, unless you pass `autoplay`.
- There is no loop: the arrows stop at the first and last slide, and only automatic rotation returns to the start.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/carousel · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
