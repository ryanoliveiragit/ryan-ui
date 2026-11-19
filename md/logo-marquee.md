# Logo marquee

> Faixa de logos de clientes que desliza sem parar e pausa quando você aponta.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/logo-marquee
- Original description: A quiet, continuously moving row of brand marks with a pause control.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/logo-marquee.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/logo-marquee.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/logo-marquee.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/logo-marquee.json`. Registry path, relative to the site address: `r/logo-marquee.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md)
- Files, once installed:
  - `components/ryan-ui/blocks/logo-marquee/logo-marquee.tsx`
  - `components/ryan-ui/blocks/logo-marquee/logo-marquee.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/logo-marquee.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Social-proof strip on a landing page: customers, integrations, or compatible tools passing in a continuous line.
- When there are enough brands for one copy of the list to be wider than the section and none of them needs emphasis or a link.

## When not to use

- Use [`marquee`](marquee.md) when the scrolling content is not a list of brands or when you need to control speed, direction, or vertical scrolling.
- With few brands, prefer a static grid: if one copy of the list is narrower than the section, the loop does not close and a gap appears at the end.
- If each logo needs to be a link or open a customer case, this block does not fit: items are only a symbol and a name, with no interaction.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import LogoMarquee from "@/components/ryan-ui/blocks/logo-marquee/logo-marquee";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "fill", frame: true, height: 520 };

export default function LogoMarqueeDemo() {
  // The band is a page section: centered in the frame with a page margin around it, not glued to the top edge.
  return (
    <div style={{ display: "grid", minHeight: "100dvh", alignContent: "center", padding: "var(--space-8) var(--space-6)" }}>
      <LogoMarquee />
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `LogoMarquee`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Good work moves between tools"` | — |
| `description` | `string` | `"From the first idea to the final handoff, a …` | — |
| `brands` | `LogoMarqueeBrand[]` | `exampleBrands` | — |
| `tone` | `"color" \| "mono"` | `"color"` | `color` shows each mark in its official colors; `mono` draws every mark in the text color. |

### Exported types

| Type | Definition |
| --- | --- |
| `LogoMarqueeTone` | `"color" \| "mono"` |

#### `LogoMarqueeBrand`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `icon` (required) | `string` | Monochrome SVG, drawn as a mask in the text color. |
| `color` | `string` | Single brand color for the mark in color tone. Leave out for brands whose mark is black or white. |
| `colorIcon` | `string` | Full color SVG for multicolor marks, used in color tone instead of `icon`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the “Pause” or “Play” button, pause or resume the strip's motion. |

## Accessibility

- The strip is a named `role="region"`, the duplicated copy of the list is `aria-hidden`, and the symbols are decorative: each brand's name is real text.
- The pause button has an `aria-label` that switches between pause and resume, and an `aria-live="polite"` region announces “Motion paused”.
- The accessible names of the region and the button are hardcoded in English in the file (“Illustrative tool logos”, “Pause logo motion”); adjust them when you swap the brands.

## Motion

- The strip slides left in a continuous 39 s loop with a linear CSS animation; hovering over it or pressing the button freezes the motion where it is.
- With “reduce motion” on, the animation is removed, the brands become a centered list that wraps onto lines, the duplicated copy disappears, and the pause button is hidden.

## Responsive behavior

- A container query on the section (up to 639 px) stacks the title and description, reduces the type size, and brings the brands closer together.

## Performance

- The motion is a single CSS `transform` animation on the strip, with no per-frame JavaScript; each symbol is painted as a CSS mask from the SVG URL, so use small files.

## Notes for AI

- Pass `brands` with `name` and `icon` (URL of a monochrome SVG, used as a mask); `color` paints the symbol in the `color` tone and `colorIcon` replaces the mask with a color image.
- The default brands are abstract example shapes, not real logos; the loop duration is fixed at 39 s, so longer lists move faster.
- `tone="mono"` draws everything in the text color; there is no `className` prop, and the block depends on `button`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/logo-marquee · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
