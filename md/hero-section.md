# Hero section

> Hero em três versões sem gradientes: janela de produto viva, fluxo de automação com pulso e tipografia editorial com marquee.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/hero-section
- Original description: A landing page hero in three versions on a solid page with a faint dot grid: a live product window with counting figures, a self-drawing chart and floating cards; an automation graph with a pulse travelling along its lines; and editorial type over a marquee of words.
- Versions: Produto (`hero-section` with `variant="product"`), Fluxo (`hero-section` with `variant="workflow"`), Editorial (`hero-section` with `variant="editorial"`)

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hero-section.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hero-section.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hero-section.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hero-section.json`. Registry path, relative to the site address: `r/hero-section.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Animated counter](animated-counter.md), [Avatar](avatar.md), [Badge](badge.md), [Button](button.md), [Copy button](copy-button.md), [Marquee](marquee.md), [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/hero-section/hero-section.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-section.module.css`
  - `components/ryan-ui/blocks/hero-section/hero-parts.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-content.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-content.module.css`
  - `components/ryan-ui/blocks/hero-section/hero-motion.ts`
  - `components/ryan-ui/blocks/hero-section/hero-lumen.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-lumen.module.css`
  - `components/ryan-ui/blocks/hero-section/hero-lumen-data.ts`
  - `components/ryan-ui/blocks/hero-section/hero-relay.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-relay.module.css`
  - `components/ryan-ui/blocks/hero-section/hero-cadence.tsx`
  - `components/ryan-ui/blocks/hero-section/hero-cadence.module.css`
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`
  - `components/ryan-ui/badge/badge.tsx`
  - `components/ryan-ui/badge/badge.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`
  - `components/ryan-ui/copy-button/copy-button.tsx`
  - `components/ryan-ui/copy-button/copy-button.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`
  - `components/ryan-ui/marquee/marquee.tsx`
  - `components/ryan-ui/marquee/marquee.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/hero-section.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The opening of a product landing page: a live product window (`product`), an automation flow running (`workflow`), or large typography over a word strip (`editorial`).
- A hero with your own content (title, description, actions, install command, and a visual beside it), passing `title`, without building the layout from scratch.

## When not to use

- Use [`cta-section`](cta-section.md) for a call to action in the middle or end of the page.
- Use [`site-header`](site-header.md) for site navigation: the bar in the built-in versions scrolls along with the hero and loses its links on narrow screens.
- Avoid using the built-in versions with your brand without editing the code: texts, numbers, and names (Lumen, Relay, Cadence) are examples, and only the actions come through props.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import HeroSectionBlock, { HeroSection, heroSectionVariants } from "@/components/ryan-ui/blocks/hero-section/hero-section";
import type { DemoStage } from "./_kit";

/** Tall enough for the product window to show under the copy; the frame lets the hero follow its own width. */
export const stage: DemoStage = { layout: "fill", frame: true, height: 920 };

/** With `variant` ("product", "workflow" or "editorial") the demo shows exactly that version; without it, the block's own switcher. */
export default function HeroSectionDemo({ variant }: { variant?: string }) {
  const chosen = heroSectionVariants.find(option => option.value === variant);
  return chosen ? <HeroSection key={chosen.value} variant={chosen.value} /> : <HeroSectionBlock />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `HeroSection`

A landing page hero in three designs on a solid page with a faint dot grid: a live product window with floating cards, an automation graph that routes sample events, and editorial type over a strip of scrolling words. No gradients.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `HeroSectionVariant \| HeroSectionLegacyVariant` | `"product"` | `product` is centered copy over a live product window with floating cards, `workflow` sets the copy beside an automation graph that runs sample events with a pulse along each line, and `editorial` is very large type over a scrolling strip of words. The earlier names `centered`, `split` and `minimal` map to them in that order. |
| `animateIn` | `boolean` | `true` | Plays the entrance once on mount. Defaults to true. |
| `primaryAction` | `HeroAction \| null` | — | The main call to action. With `doneLabel` and no `href`, the button confirms in place. |
| `secondaryAction` | `HeroAction \| null` | — | The second call to action. |
| `title` | `string` | — | Your own headline. When set, the hero renders your content in the chosen layout (see `HeroContent`) instead of the designed sample, together with the props below. |
| `description` | `string` | — | One or two sentences under your own headline. |
| `announcement` | `HeroAction \| null` | — | A small pill above your own headline. |
| `install` | `HeroInstallCommand[] \| null` | — | Install commands for your own content; the first one is shown with a copy button. |
| `media` | `ReactNode` | — | A visual beside your own content in the workflow layout. |
| `meta` | `string[]` | — | Small facts under your own content, such as the version and license. |
| `highlight` | `string` | — | Kept for compatibility; highlighted phrases render as plain text. |
| `className` | `string` | — | — |

### `HeroSectionBlock`

Preview: a slim bar to choose the version, and the chosen hero filling the rest of the screen. Switching replays the entrance.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"product" \| "workflow" \| "editorial"` | `"product"` | The version shown first. Defaults to `product`. |

### `HeroNav`

The bar across the top of a hero: brand, section links, and the way in.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `brand` (required) | `string` | — | Product name beside the mark. |
| `mark` | `ReactNode` | — | A small glyph drawn on the accent tile, in the accent's text color. |
| `brandHref` | `string` | — | Where the brand links to. Without it the brand is plain text. |
| `links` | `HeroNavLink[]` | `[]` | Section links. They hide on narrow screens. |
| `signIn` | `HeroNavLink \| null` | `{ label: "Sign in" }` | The quiet entry on the right, such as "Sign in". Hides on narrow screens. |
| `action` | `HeroNavLink \| null` | `{ label: "Get started" }` | The button on the right. |
| `animateIn` | `boolean` | `true` | Fades the bar in on mount. Defaults to true. |

### `HeroBackdrop`

The faint grid of solid dots behind a hero. Set `--dots-fade` on it (a mask image) to choose where the grid fades out.

No props of its own: accepts those of the element or primitive it wraps.

### `HeroMark`

One phrase of a headline under a solid accent marker that draws in from left to right.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `string` | — | The phrase to mark. Keep it short: it never breaks across lines. |
| `animateIn` | `boolean` | `true` | Draws the marker in from the left on mount. Defaults to true; reduced motion shows it drawn. |

### `ActionLink`

A link or button that looks like a ryan-ui button. Links keep native navigation; a button with `doneLabel` confirms in place.

No props of its own: accepts those of the element or primitive it wraps.

### `HeroContent`

The hero with your own content: announcement, headline, description, actions, an optional install line, and an optional visual beside the copy, on a solid page. Use it when none of the three designed variants fits the product.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` (required) | `"centered" \| "split" \| "minimal"` | — | `centered` stacks the copy in the middle, `split` puts `media` beside it, `minimal` aligns large copy to the left. |
| `announcement` | `HeroAction \| null` | — | A small pill above the headline, such as a release note. |
| `title` (required) | `string` | — | The headline. |
| `description` | `string` | — | One or two sentences under the headline. |
| `primaryAction` | `HeroAction \| null` | — | The main call to action, filled with the accent. |
| `secondaryAction` | `HeroAction \| null` | — | The second call to action, outlined. |
| `install` | `HeroInstallCommand[] \| null` | — | Install commands; the first one is shown with a copy button. |
| `media` | `ReactNode` | — | A visual beside the copy in the split layout. |
| `meta` | `string[]` | — | Small facts under the copy, such as the version and license. |
| `animateIn` | `boolean` | `true` | Plays the entrance once on mount. Defaults to true. |
| `className` | `string` | — | — |

### `HeroLumen`

Product hero: a navigation bar, a headline with one phrase under a solid accent marker, two actions, social proof, and a live product window on a solid page with a faint dot grid. In the window the figures roll up, the chart draws itself and its range control changes every number; two small cards float over its edges. Everything enters in a stagger, and nothing moves under reduced motion.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `primaryAction` | `HeroAction` | `{ label: "Start free trial", doneLabel: "Tria…` | The main call to action. With `doneLabel` and no `href`, the button confirms in place. |
| `secondaryAction` | `HeroAction` | `{ label: "Book a demo", doneLabel: "Demo requ…` | The second call to action. |
| `animateIn` | `boolean` | `true` | Plays the entrance once on mount. Defaults to true. |
| `className` | `string` | — | — |

### `HeroRelay`

Workflow hero, one full screen: the copy beside a live automation graph on a dotted canvas. Sample events arrive on their own and run the workflow node by node: a pulse in the accent travels along each line as the data moves, the branch decides which actions run, and every step reports its time. "Send test event" runs the next sample at once. The run pauses off screen, and under reduced motion each event shows its finished run without playing.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `primaryAction` | `HeroAction` | `{ label: "Start building", doneLabel: "Worksp…` | The main call to action. With `doneLabel` and no `href`, the button confirms in place. |
| `secondaryAction` | `HeroAction` | `{ label: "Read the docs", doneLabel: "Opening…` | The second call to action. |
| `animateIn` | `boolean` | `true` | Plays the entrance once on mount. Defaults to true. |
| `className` | `string` | — | — |

### `HeroCadence`

Editorial hero, one full screen: very large type with one phrase under a solid accent marker, a short paragraph beside the actions, and a strip of words that scrolls along the bottom edge. No product window and no imagery: type does the work.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `primaryAction` | `HeroAction` | `{ label: "Download for Mac", doneLabel: "Down…` | The main call to action. With `doneLabel` and no `href`, the button confirms in place. |
| `secondaryAction` | `HeroAction` | `{ label: "Try it on the web", doneLabel: "Ope…` | The second call to action. |
| `animateIn` | `boolean` | `true` | Plays the entrance once on mount. Defaults to true. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `HeroSectionVariant` | `"product" \| "workflow" \| "editorial"` |
| `HeroSectionLegacyVariant`: Names the versions had before; they still work. | `"centered" \| "split" \| "minimal"` |
| `Bezier` | `[number, number, number, number]` |
| `LumenRange`: Sample data for Lumen, an invented revenue analytics product. Replace it with your own product's numbers. | `"7d" \| "30d" \| "90d"` |

#### `HeroNavLink`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Text of the link. |
| `href` | `string` | Where it goes. Without it the entry is a button that only calls `onClick`. |
| `onClick` | `() => void` | Called on press. |

#### `HeroAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Text of the button or link. |
| `href` | `string` | Makes it a link. Without it the action is a button. |
| `onClick` | `() => void` | Called on press. |
| `external` | `boolean` | Opens in a new tab and shows an outward arrow. |
| `doneLabel` | `string` | Shown in place of the label for a moment after a press, such as "Trial started". Buttons only. |

#### `HeroInstallCommand`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | Short label, such as npm or pnpm. The first command is shown. |
| `command` (required) | `string` | — |

#### `LumenKpi`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `"revenue" \| "conversion" \| "sessions"` | — |
| `label` (required) | `string` | — |
| `value` (required) | `number` | — |
| `prefix` | `string` | — |
| `suffix` | `string` | — |
| `decimals` | `number` | — |
| `change` (required) | `string` | Change against the period before, as shown in the badge. |
| `up` (required) | `boolean` | Whether the change is good news. |

#### `LumenPeriod`

| Field | Type | Description |
| --- | --- | --- |
| `against` (required) | `string` | What the change is compared with. |
| `caption` (required) | `string` | Line under the chart title. |
| `kpis` (required) | `LumenKpi[]` | — |
| `line` (required) | `number[]` | Revenue through the period, as a share of the top grid line (0 to 100). Every period has the same number of points, so the line morphs between them. |
| `previous` (required) | `number[]` | The period before, on the same scale. |
| `yTicks` (required) | `string[]` | Value axis labels from the top grid line down. |
| `xTicks` (required) | `string[]` | Date axis labels, spread evenly from the first point to the last. |

#### `LumenTransaction`

| Field | Type | Description |
| --- | --- | --- |
| `customer` (required) | `string` | — |
| `plan` (required) | `string` | — |
| `amount` (required) | `string` | — |
| `status` (required) | `"Paid" \| "Pending" \| "Refunded"` | — |
| `tone` (required) | `string` | Token behind the customer's initial, such as `--tone-teal`. |

### Other exports

- `heroSectionVariants` (value)
- `ease` (value)
- `heroGroup` (value)
- `heroRise` (value)
- `heroFade` (value)
- `instant` (value)
- `useHeroReducedMotion` (hook)
- `useOnScreen` (hook)
- `useAfter` (hook)
- `lumenRanges` (value)
- `lumenPeriods` (value)
- `lumenTransactions` (value)
- `lumenPayments` (value)
- `lumenGoal` (value)
- `lumenFaces` (value)
- `lumenCustomers` (value)

## Accessibility

- Each version has a single `h1`; the floating cards are `aria-hidden`, and the product window and the graph are groups with a summary name, such as “Lumen revenue dashboard, sample data”.
- In the graph, each step has a named state (“Running”, “Done”, “Skipped”, “Waiting”), and the phrase under the highlighter is drawn twice, with the copy in `aria-hidden`, so it is read only once.

## Motion

- On mount, the parts rise in reading order coming out of a slight blur, and a highlighter in the accent color sweeps left to right over a phrase of the title.
- In `product`, the numbers scroll, the chart is drawn, and the cards float; in `workflow`, a pulse travels along the lines on each event; in `editorial`, the words run along a strip.
- With “reduce motion” on, nothing moves (it only fades), the chart already appears ready, the flow shows each event as completed, the strip becomes an ordinary scroll area, and the highlighter comes already painted.

## Responsive behavior

- The built-in versions take at least the screen height (`100svh`) and adjust through a container query; below 760px the bar links and “Sign in” disappear, with no menu in their place.
- In `workflow`, the graph is drawn at a fixed size and scaled down to fit the column, with a narrow arrangement below 520px.

## Performance

- The event and notice loops stop when the hero leaves the screen or the tab is hidden (`IntersectionObserver` and `visibilitychange`); even so, use one version per page.

## Notes for AI

- Import `HeroSection` by name (the default export is the preview with a version selector) and choose `variant`: `product`, `workflow`, or `editorial`; `centered`, `split`, and `minimal` also work.
- With `title`, the block replaces the showcase with your content (`description`, `announcement`, `install`, `meta` and, in `workflow`, `media`), with natural height; without `title`, only the two actions are yours.
- Depends on `animated-counter`, `avatar`, `badge`, `button`, `copy-button`, `marquee`, and `segmented-control`; `HeroNav`, `HeroBackdrop`, and `HeroMark` are also exported so you can build your own version.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/hero-section · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
