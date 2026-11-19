# Rise

> O novo tema sobe até ocupar a página.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-rise
- Original description: The next appearance rises into place.
- Versions: Padrão ([`theme-switch`](theme-switch.md)), Eclipse ([`theme-switch-eclipse`](theme-switch-eclipse.md)), Split ([`theme-switch-split`](theme-switch-split.md)), Rise (this item)

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-rise.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-rise.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-rise.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-rise.json`. Registry path, relative to the site address: `r/theme-switch-rise.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md)
- Files, once installed:
  - `components/ryan-ui/theme-switch/theme-switch.tsx`
  - `components/ryan-ui/theme-switch/theme-switch.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/theme-switch-rise.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A theme button near the bottom of the screen or in a lower corner, as in the demo, when the new theme should rise from the bottom edge.
- When the transition should be a straight, simple movement that does not depend on where the button is.

## When not to use

- Use [`theme-switch`](theme-switch.md) (`reveal` variant) when the transition should start at the click point.
- Use [`theme-switch-split`](theme-switch-split.md) when the button sits at the center of a bar and a symmetric opening fits better.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import type { CSSProperties } from "react";
import ThemeSwitch from "@/components/ryan-ui/theme-switch/theme-switch";
import { useTheme } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import { Caption, Stack } from "./_kit";

/** A real content card (not placeholder bars) with the switch floating where a reading view keeps it. */
const frame: CSSProperties = { position: "relative", border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", background: "var(--surface)", padding: "var(--space-5) 4rem var(--space-6) var(--space-5)" }; // right padding keeps the text clear of the switch at narrow widths

export default function ThemeSwitchRiseDemo() {
  const { theme } = useTheme();
  return (
    <Stack gap={5} width={440}>
      <article style={frame}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>Weekly report · Nov 9</p>
        <h3 style={{ margin: "var(--space-2) 0 0", color: "var(--foreground)", fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", fontWeight: 500, letterSpacing: "var(--tracking-body)" }}>Signups are up 18% this week</h3>
        <p style={{ margin: "var(--space-2) 0 0", maxWidth: "32ch", color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}>Most came from the new pricing page, and retention held steady across every plan.</p>
        <span style={{ position: "absolute", right: "var(--space-4)", bottom: "var(--space-4)" }}>
          <ThemeSwitch theme={theme} variant="rise" iconOnly label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "rise")} />
        </span>
      </article>
      <Caption>Rise — the new theme sweeps up from the bottom edge of the screen.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ThemeSwitch`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` (required) | `"light" \| "dark"` | — | — |
| `variant` | `"reveal" \| "eclipse" \| "split" \| "rise"` | `"reveal"` | — |
| `onThemeChange` (required) | `(next: Theme, variant: ThemeSwitchVariant, trigger: HTMLElement) => void` | — | — |
| `label` | `string` | — | — |
| `iconOnly` | `boolean` | `false` | — |

### Exported types

| Type | Definition |
| --- | --- |
| `ThemeSwitchVariant` | `"reveal" \| "eclipse" \| "split" \| "rise"` |
| `Theme` | `"light" \| "dark"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | Trigger the button, which calls `onThemeChange` with the next theme and `"rise"`. |

## Accessibility

- It is the library's `button`, with `aria-pressed` true in the dark theme and `aria-hidden` icons; icon-only (`iconOnly`, as in the demo), `label` is the only name, so pass fixed text, like “Change appearance”.
- Without `label`, the default name is built in English and changes with the state (“Switch to light mode”); outside `iconOnly`, the visible text is the fixed “Switch theme”.

## Motion

- With `variant="rise"`, the icon rises 2 px in the dark theme, on a spring curve, and drops when going back to light, while the sun and moon swap by rotating.
- The page rise does not come with the component: in the demo, the new theme is revealed from bottom to top in 520 ms, clipping `::view-transition-new(root)` from `inset(100% 0 0 0)` to `inset(0 0 0 0)`.
- With “reduce motion”, the icon only fades and the shift happens without transition; the demo's utility also swaps the theme without animating the page.

## Notes for AI

- It is the same `ThemeSwitch` with `variant="rise"`: import from `@/components/ryan-ui/theme-switch/theme-switch`; `onThemeChange` receives `"rise"` as the second argument.
- Implement the rise in the app: inside `document.startViewTransition`, apply the theme and animate the `clip-path` of `::view-transition-new(root)`; since it does not start from the button, `trigger` can be ignored.
- In the demo, the button floats in the bottom right corner of a frame (`position: absolute` on the parent); the component does not position itself.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-rise · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
