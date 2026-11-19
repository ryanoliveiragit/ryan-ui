# Split

> O novo tema se abre a partir de uma fenda fina no centro.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-split
- Original description: The next appearance opens from a slim center seam.
- Versions: Padrão ([`theme-switch`](theme-switch.md)), Eclipse ([`theme-switch-eclipse`](theme-switch-eclipse.md)), Split (this item), Rise ([`theme-switch-rise`](theme-switch-rise.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-split.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-split.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-split.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch-split.json`. Registry path, relative to the site address: `r/theme-switch-split.json`.

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
2. Copy the files listed above. The content of each one is in `r/theme-switch-split.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A centered theme button or one in a symmetric bar, when the new theme should open from a vertical slit in the middle of the screen.
- When you want a short, symmetric swap (520 ms in the demo) that does not depend on where the button is.

## When not to use

- Use [`theme-switch`](theme-switch.md) (`reveal` variant) when the transition should start from the button itself.
- Use [`theme-switch-rise`](theme-switch-rise.md) when the button is near the bottom of the screen and a rise fits better.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ThemeSwitch from "@/components/ryan-ui/theme-switch/theme-switch";
import { useTheme } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import { Caption, Row, Stack } from "./_kit";

export default function ThemeSwitchSplitDemo() {
  const { theme } = useTheme();
  return (
    <Stack gap={8} align="center">
      <Row justify="center" gap={4}>
        <ThemeSwitch theme={theme} variant="split" label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "split")} />
        <ThemeSwitch theme={theme} variant="split" iconOnly label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "split")} />
      </Row>
      <Caption>Split — two halves open from the center line of the page until the new theme is fully visible.</Caption>
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
| `Enter` or `Space` | Trigger the button, which calls `onThemeChange` with the next theme and `"split"`. |

## Accessibility

- It is the library's `button`, with `aria-pressed` true in the dark theme and `aria-hidden` icons; the demo shows the version with text and the icon-only one, both with the fixed `label` “Change appearance”.
- In the version with text, the visible label is the fixed “Switch theme”, in English, and is not the button's name when there is a `label`; in a Portuguese interface, use `iconOnly` or replace that text in the installed file.

## Motion

- With `variant="split"`, the icon shifts 1 px to the right in the dark theme, on a spring curve, and returns when going back to light, while the sun and moon swap by rotating.
- The page opening does not come with the component: in the demo, the new theme appears from a slit in the center that opens to the sides, clipping `::view-transition-new(root)` from `inset(0 50% 0 50%)` to `inset(0 0 0 0)`.
- With “reduce motion”, the icon only fades and the shift happens without transition; the demo's utility also swaps the theme without animating the page.

## Notes for AI

- It is the same `ThemeSwitch` with `variant="split"`: import from `@/components/ryan-ui/theme-switch/theme-switch`; `onThemeChange` receives `"split"` as the second argument.
- Implement the opening in the app: inside `document.startViewTransition`, apply the theme and animate the `clip-path` of `::view-transition-new(root)`; `trigger` is not needed for this variant.
- `theme` is controlled and only accepts `light` or `dark`; skip the animation when `prefers-reduced-motion` is on, as the demo does.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch-split · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
