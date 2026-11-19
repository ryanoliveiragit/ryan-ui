# Scroll reveal

> Revela o conteúdo conforme ele entra na tela, em sequência, e acompanha a leitura com uma barra de progresso.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/scroll-reveal
- Original description: A wrapper that reveals its children as they enter the viewport (fade, slide, scale or blur) with stagger and once or repeat modes, plus a scroll progress bar.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-reveal.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-reveal.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-reveal.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-reveal.json`. Registry path, relative to the site address: `r/scroll-reveal.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/scroll-reveal/scroll-reveal.tsx`
  - `components/ryan-ui/scroll-reveal/scroll-reveal.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/scroll-reveal.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Landing page or release notes sections where cards, numbers, and lists arrive one after another on scroll.
- Grids and rows of cards: each direct child becomes a step in the sequence, and `className` on the wrapper builds the grid.
- Long reading in a panel with its own scrolling, with `root` pointing to the container and `ScrollProgress` at the top showing how much has been read.

## When not to use

- Use [`in-view-title`](in-view-title.md) to animate only a section's title, word by word.
- Use [`infinite-masonry`](infinite-masonry.md) for a feed that loads more items on reaching the end.
- On work screens, such as tables, forms, and dashboards, revealing on scroll only delays reading; show the content directly.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useRef, useState } from "react";
import { CalendarClock, FileSpreadsheet, Gauge, KeyRound, Sparkles, Workflow } from "lucide-react";
import { ScrollProgress, ScrollReveal } from "@/components/ryan-ui/scroll-reveal/scroll-reveal";
import Switch from "@/components/ryan-ui/switch/switch";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";
import styles from "./scroll-reveal.module.css";

export const stage: DemoStage = { height: 600 };

const numbers = [
  { value: "2.4×", label: "faster first load" },
  { value: "38%", label: "smaller exports" },
  { value: "112", label: "fixes shipped" },
];

const features = [
  { icon: Workflow, title: "Automations", text: "Chain triggers and actions without leaving the board." },
  { icon: CalendarClock, title: "Scheduled reports", text: "Send a digest to any channel, on your calendar." },
  { icon: FileSpreadsheet, title: "Spreadsheet import", text: "Map columns once and reuse the mapping next time." },
  { icon: KeyRound, title: "Scoped API keys", text: "Limit a key to one workspace and one permission set." },
];

const fixes = ["Comments keep their place after a reload", "Filters survive switching between views", "Avatars no longer flicker in long lists", "Keyboard focus returns to the row you edited", "CSV exports respect the visible columns", "Mentions work in private projects"];

export default function ScrollRevealDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(false);

  return (
    <Stack gap={4} width={540}>
      <div ref={scroller} className={styles.scroller} tabIndex={0} role="region" aria-label="Atlas 3.0 release notes">
        <ScrollProgress container={scroller} label="Reading progress" />
        {/* The key remounts the page when the mode changes, so every section starts hidden again. */}
        <article key={repeat ? "repeat" : "once"} className={styles.page}>
          <ScrollReveal root={scroller} effect="blur" once={!repeat} amount={0.4}>
            <p className={styles.kicker}><Sparkles size={14} aria-hidden="true" />Release notes</p>
            <h3 className={styles.title}>Atlas 3.0 is here</h3>
            <p className={styles.lead}>A faster workspace, automations for the repetitive parts, and a long list of fixes you asked for. Scroll to see what changed.</p>
          </ScrollReveal>

          <ScrollReveal root={scroller} effect="scale" once={!repeat} stagger={0.1} className={styles.numbers}>
            {numbers.map(item => <div key={item.label} className={styles.number}><strong>{item.value}</strong><span>{item.label}</span></div>)}
          </ScrollReveal>

          <ScrollReveal root={scroller} effect="slide" from="bottom" once={!repeat} className={styles.features}>
            {features.map(item => (
              <div key={item.title} className={styles.feature}>
                <span className={styles.featureIcon}><item.icon size={17} aria-hidden="true" /></span>
                <div><strong>{item.title}</strong><p>{item.text}</p></div>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal root={scroller} effect="slide" from="left" once={!repeat} amount={0.5}>
            <figure className={styles.quote}>
              <Gauge size={18} aria-hidden="true" />
              <blockquote>“Our monthly close went from two days of exports to one scheduled report.”</blockquote>
              <figcaption>Sofia Ramirez, operations lead</figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal root={scroller} effect="fade" once={!repeat} stagger={0.05}>
            <h4 className={styles.subtitle}>Fixes</h4>
            <ul className={styles.fixes}>{fixes.map(fix => <li key={fix}>{fix}</li>)}</ul>
            <p className={styles.end}>That is everything in 3.0. Thanks for the reports.</p>
          </ScrollReveal>
        </article>
      </div>
      <Switch label="Replay on re-entry" checked={repeat} onCheckedChange={setRepeat} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ScrollReveal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactNode` | — | Each direct child is revealed as one step. |
| `effect` | `"fade" \| "slide" \| "scale" \| "blur"` | `"slide"` | How the children arrive: a plain fade, a slide from one side, a scale up, or a blur that comes into focus. |
| `from` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | The side the "slide" effect comes from. |
| `distance` | `number` | `28` | Distance in px that the "slide" effect travels. |
| `stagger` | `number` | `motionTokens.stagger.line` | Seconds between one child and the next. Use 0 to reveal them together. |
| `delay` | `number` | `0` | Seconds to wait before the first child starts. |
| `once` | `boolean` | `true` | True reveals once and keeps the result; false hides the children again when they leave and replays on every entry. |
| `amount` | `number` | `0.2` | How much of the wrapper must be visible before it starts, from 0 to 1. |
| `root` | `RefObject<Element \| null>` | — | The scrolling element to watch. Leave it out when the page itself scrolls. |
| `className` | `string` | — | Extra class for the wrapper, for example a grid or a flex row. |
| `itemClassName` | `string` | — | Extra class for the element wrapped around each child. |
| `style` | `CSSProperties` | — | Inline style for the wrapper. |

### `ScrollProgress`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `RefObject<HTMLElement \| null>` | — | The scrolling element to measure. Leave it out to follow the page. |
| `label` | `string` | `"Scroll progress"` | Accessible name of the progress bar. |
| `position` | `"sticky" \| "fixed" \| "static"` | `"sticky"` | "sticky" stays at the top of its scroll container, "fixed" pins to the top of the window, "static" stays where it is rendered. |
| `thickness` | `number` | `3` | Bar thickness in px. |
| `className` | `string` | — | Extra class for the track. |

### Exported types

| Type | Definition |
| --- | --- |
| `ScrollRevealEffect` | `"fade" \| "slide" \| "scale" \| "blur"` |

## Accessibility

- The children stay in the DOM the whole time, only invisible before entering the screen, so the screen reader reads them normally; the animation changes neither the order nor the focus.
- `ScrollProgress` is `role="progressbar"` with `aria-valuenow` from 0 to 100 updated on scroll; pass `label` in your language (default “Scroll progress”).

## Motion

- Each child enters with the chosen effect: `fade` fades, `slide` comes from one side (`from`, `distance`), `scale` grows from 90%, and `blur` rises 6 px coming out of a blur, with a no-overshoot spring.
- Children enter in sequence every `stagger` (default 0.08 s) after `delay`; with `once={false}`, they quickly disappear on leaving the screen and enter again on return.
- With “reduce motion”, everything becomes a short fade, with no displacement, scale, blur, or sequence, and the progress bar follows the scroll without smoothing.

## Performance

- Each `ScrollReveal` uses an intersection observer and `will-change` only applies during the animation; `blur` animates a filter, which costs more than moving or fading, so in long lists prefer `fade` or `slide`.

## Notes for AI

- Import `ScrollReveal` and `ScrollProgress` from `@/components/ryan-ui/scroll-reveal/scroll-reveal`. Each direct child is wrapped in a `div`: apply grid or flex with `className` on the `ScrollReveal` itself.
- When the scroller is a container, not the page, pass the same `ref` in `root` (on `ScrollReveal`) and in `container` (on `ScrollProgress`).
- Children start invisible until 20% of the wrapper appears (`amount`); do not wrap content that must be visible right on load.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/scroll-reveal · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
