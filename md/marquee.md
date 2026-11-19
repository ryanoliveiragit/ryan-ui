# Marquee

> Faixa que rola sem fim na horizontal ou na vertical, com bordas esmaecidas, e desacelera até parar quando o cursor passa.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/marquee
- Original description: An infinite horizontal or vertical scroller with speed and direction control, faded edges, and a pause on hover that eases to a stop.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/marquee.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/marquee.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/marquee.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/marquee.json`. Registry path, relative to the site address: `r/marquee.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/marquee/marquee.tsx`
  - `components/ryan-ui/marquee/marquee.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/marquee.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Row of customer logos, short testimonials, or a news ticker that serves as ambiance, not essential content.
- Vertical activity feed that scrolls slowly in a fixed-height space (`direction="up"`).

## When not to use

- Use [`logo-marquee`](logo-marquee.md) when you want the ready-made row of brands, already with a pause control.
- Use [`carousel`](carousel.md) when the user needs to stop on each item and control the progression.
- Use [`announcement-bar`](announcement-bar.md) for important notices at the top of the page; essential information must not depend on moving text.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { Anchor, Aperture, Box, Feather, Hexagon, Leaf, Mountain, Pause, Play, Sun, Waves } from "lucide-react";
import { Marquee } from "@/components/ryan-ui/marquee/marquee";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack } from "./_kit";
import styles from "./marquee.module.css";

const customers = [
  { name: "Northwind", icon: Mountain },
  { name: "Harbor & Co", icon: Anchor },
  { name: "Lumen", icon: Sun },
  { name: "Tidewater", icon: Waves },
  { name: "Quill", icon: Feather },
  { name: "Hexa Labs", icon: Hexagon },
  { name: "Fernway", icon: Leaf },
  { name: "Parcel", icon: Box },
  { name: "Iris Optics", icon: Aperture },
];

const quotes = [
  { text: "Cut our release notes from a day to an hour.", by: "Emma, Northwind" },
  { text: "The first tool the whole team opened without being asked.", by: "Marcus, Lumen" },
  { text: "Setup took one coffee.", by: "Sofia, Parcel" },
  { text: "We retired three dashboards the week we switched.", by: "Daniel, Quill" },
  { text: "Support answers in minutes, not tickets.", by: "Ava, Fernway" },
];

const activity = [
  "Jasmine merged “Checkout redesign”",
  "Nathan deployed api v4.18",
  "Chloe shared the Q3 retention report",
  "Mateo fixed the Android login crash",
  "Hannah closed 12 support threads",
  "Tyler added 3 seats to the Sales team",
];

export default function MarqueeDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <Stack width={680} gap={5}>
      <Marquee label="Customers" speed={56} gap={40} paused={paused}>
        {customers.map(({ name, icon: Icon }) => (
          <span key={name} className={styles.logo}><Icon size={20} aria-hidden="true" />{name}</span>
        ))}
      </Marquee>

      <Marquee label="What customers say" direction="right" speed={32} gap={12} paused={paused}>
        {quotes.map(quote => (
          <figure key={quote.by} className={styles.quote}>
            <blockquote>{quote.text}</blockquote>
            <figcaption>{quote.by}</figcaption>
          </figure>
        ))}
      </Marquee>

      <Row gap={6} align="center">
        <div className={styles.feed}>
          <Marquee label="Team activity" direction="up" speed={22} gap={10} fade="28%" paused={paused}>
            {activity.map(line => <span key={line} className={styles.line}><i aria-hidden="true" />{line}</span>)}
          </Marquee>
        </div>
        <Stack gap={2} align="flex-start">
          <Button variant="secondary" size="sm" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? "Play" : "Pause"}
          </Button>
          <Caption>Hover a row and it eases to a stop.</Caption>
        </Stack>
      </Row>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Marquee`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | The items to scroll. They are laid out in a row, or in a column for the vertical directions. |
| `direction` | `"left" \| "right" \| "up" \| "down"` | `"left"` | Where the content travels. `left` and `right` scroll a row; `up` and `down` scroll a column and need a height on the marquee. |
| `speed` | `number` | `48` | Travel speed in px per second. |
| `gap` | `number \| string` | `24` | Space between items, and between one repetition and the next, in px or any CSS length. |
| `pauseOnHover` | `boolean` | `true` | Slows to a stop while the pointer is over the marquee or focus is inside it. |
| `paused` | `boolean` | `false` | Stops the motion, for a pause button. People must be able to stop content that moves for more than a few seconds. |
| `fade` | `boolean \| string` | `true` | Fades the two edges the content enters and leaves through. Pass a CSS length to set how wide the fade is. |
| `label` | `string` | — | Accessible name for the group, for example "Customers". |
| `className` | `string` | — | Extra class names for the root element. |
| `style` | `CSSProperties` | — | Inline styles for the root element, for sizes and CSS variables. |

## Accessibility

- The repetitions carry `aria-hidden` and `inert`, so each item is read and receives focus only once; with `label`, the root becomes a named `role="group"`.
- With `pauseOnHover` (default), the cursor over the strip or focus inside it makes it slow down until it stops; for motion that lasts more than a few seconds, also provide a pause button tied to `paused`.

## Motion

- The content runs at `speed` px per second in an animation-frame loop and repeats as many times as needed (up to 24 copies) to join seamlessly.
- Pausing and resuming go through a spring that takes the pace from 1 to 0 and back, so the strip brakes and accelerates instead of freezing; offscreen, it rests.
- With “reduced motion”, nothing moves on its own: the copies aren't rendered and the strip becomes a regular scroll area, keyboard-focusable.

## Responsive behavior

- The strip takes the parent's width and recalculates the number of copies when it or the content changes size.
- In the `up` and `down` directions the root uses `height: 100%`: the parent must have a defined height.

## Performance

- Each instance runs a frame loop (`useAnimationFrame`) that only moves a `transform`; the children are rendered in every copy, so avoid heavy items or ones with their own state and effects.

## Notes for AI

- Pass the items as direct children: the marquee lays them out in a row (or column) and applies `gap` between them and between repetitions.
- `speed` is in px per second (48 by default), `direction` accepts `left`, `right`, `up`, and `down`, and `fade` controls the edge mask (`true`, a CSS length like `"28%"`, or `false`).
- To pause with a button, keep a state and pass it to `paused`: the component doesn't include that button.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/marquee · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
