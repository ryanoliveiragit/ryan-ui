# Eclipse

> O novo tema atravessa a página como um eclipse.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-eclipse
- Original description: The next appearance crosses the page like an eclipse.
- Versions: Padrão ([`theme-switch`](theme-switch.md)), Eclipse (this item), Split ([`theme-switch-split`](theme-switch-split.md)), Rise ([`theme-switch-rise`](theme-switch-rise.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-eclipse.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-eclipse.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-eclipse.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-eclipse.json`. Registry path, relative to the site address: `r/theme-switch-eclipse.json`.

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
2. Copy the files listed above. The content of each one is in `r/theme-switch-eclipse.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A theme button in an app bar, as in the demo, when the swap should cross the screen like a disc entering from the side.
- When the theme rarely changes and a longer transition fits: in the demo, the eclipse takes 720 ms, versus 520 to 560 ms for the other variants.

## When not to use

- Use [`theme-switch`](theme-switch.md) (`reveal` variant) when the transition should start from the button itself, where the person clicked.
- Use [`theme-switch-rise`](theme-switch-rise.md) or [`theme-switch-split`](theme-switch-split.md) for a shorter swap.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import type { CSSProperties } from "react";
import ThemeSwitch from "@/components/ryan-ui/theme-switch/theme-switch";
import { useTheme } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import { Caption, Stack } from "./_kit";

/** Fake app chrome so the switch sits where it really lives: a product header. */
const bar: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", background: "var(--surface)", padding: "var(--space-3) var(--space-3) var(--space-3) var(--space-4)" };
const brand: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 600 };

export default function ThemeSwitchEclipseDemo() {
  const { theme } = useTheme();
  return (
    <Stack gap={5} width={440}>
      <div style={bar}>
        <span style={brand}>
          <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 6, background: "var(--accent)" }} aria-hidden="true" />
          Ledger
        </span>
        <ThemeSwitch theme={theme} variant="eclipse" iconOnly label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "eclipse")} />
      </div>
      <Caption>Eclipse — the new appearance crosses the page like a disc entering from the edge and covering the screen.</Caption>
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
| `Enter` or `Space` | Trigger the button, which calls `onThemeChange` with the next theme and `"eclipse"`. |

## Accessibility

- It is the library's `button`, with `aria-pressed` true in the dark theme and `aria-hidden` icons; icon-only (`iconOnly`, as in the demo), `label` is the only name, so pass fixed text, like “Change appearance”.
- Without `label`, the default name is built in English and changes with the state (“Switch to light mode”); outside `iconOnly`, the visible text is the fixed “Switch theme”.

## Motion

- With `variant="eclipse"`, the icon shifts 2 px to the left in the dark theme, on a spring curve, and returns when going back to light; the sun and moon swap by rotating.
- The page crossing does not come with the component: in the demo, a circle the size of the screen diagonal starts from outside, on the left, until it covers the screen, via View Transitions.
- With “reduce motion”, the icon only fades and the shift happens without transition; the demo's utility also swaps the theme without animating the page.

## Notes for AI

- It is the same `ThemeSwitch` with `variant="eclipse"`: import from `@/components/ryan-ui/theme-switch/theme-switch`; `onThemeChange` receives `"eclipse"` as the second argument.
- Implement the crossing in the app: inside `document.startViewTransition`, apply the theme and animate the `clip-path` of `::view-transition-new(root)` from `circle(D at -D 50%)` to `circle(D at 50% 50%)`, with D the screen diagonal.
- `theme` is controlled and only accepts `light` or `dark`; skip the animation when `prefers-reduced-motion` is on, as the demo does.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-eclipse · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
