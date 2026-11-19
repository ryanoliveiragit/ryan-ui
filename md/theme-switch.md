# Theme switcher

> Quatro transições suaves entre o tema claro e o escuro.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch
- Original description: Four smooth ways to move between light and dark appearance.
- Versions: Padrão (this item), Eclipse ([`theme-switch-eclipse`](theme-switch-eclipse.md)), Split ([`theme-switch-split`](theme-switch-split.md)), Rise ([`theme-switch-rise`](theme-switch-rise.md))

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/theme-switch.json`. Registry path, relative to the site address: `r/theme-switch.json`.

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
2. Copy the files listed above. The content of each one is in `r/theme-switch.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A light/dark toggle button in the app or site bar, with the sun and moon rotating in place.
- When the theme change is going to get a full-page transition: the button hands the variant and the element itself to `onThemeChange`, so the animation starts from it (`reveal`, the default).

## When not to use

- Use the [`user-menu`](user-menu.md) theme selector, or a [`segmented-control`](segmented-control.md), when the person should also be able to choose “System”: here there are only light and dark.
- Use [`switch`](switch.md) when the theme is an option on a settings page, next to other toggles.
- Use [`icon-morph`](icon-morph.md) with `name="theme"` when the button already exists and you only want the transforming sun and moon icon.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ThemeSwitch from "@/components/ryan-ui/theme-switch/theme-switch";
import { useTheme } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import { Caption, Row, Stack } from "./_kit";

export default function ThemeSwitchDemo() {
  const { theme } = useTheme();
  return (
    <Stack gap={8} align="center">
      <Row justify="center" gap={4}>
        <ThemeSwitch theme={theme} label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "reveal")} />
        <ThemeSwitch theme={theme} iconOnly label="Change appearance" onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "reveal")} />
      </Row>
      <Caption>Reveal — a circle grows out of the button and floods the page with the next theme. This is the default variant.</Caption>
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
| `Enter` or `Space` | Trigger the button, which calls `onThemeChange` with the next theme. |

## Accessibility

- It is the library's `button`, with `aria-pressed` true in the dark theme; the icons are `aria-hidden`.
- Without `label`, the name is built in English and changes with the state (“Switch to light mode”), which is confusing next to `aria-pressed`; pass a fixed `label`, like “Dark theme”.
- The visible text “Switch theme” is fixed in English and, with `aria-label`, stops being the button's name; in a Portuguese interface, use `iconOnly` or replace that text in the installed file.

## Motion

- On the swap, the sun and moon rotate in the same direction (clockwise toward dark), with scale on a short spring and a fade with a slight blur; in dark, the `reveal` variant also enlarges the icon to 1.08.
- A saved preference that arrives right after hydration swaps the icon without animating, so a page that opens in dark does not rotate the button.
- With “reduce motion”, the icon only fades, the variant adjustment happens without transition, and the button press does not scale.

## Notes for AI

- The component neither switches the theme nor animates the page: it calls `onThemeChange(next, variant, trigger)`, and the app applies the theme (for example, `data-theme` on `<html>`) and, if you want, the transition.
- The demo's transition comes from the site, not from the installed item: `document.startViewTransition` and an animated `clip-path` on `::view-transition-new(root)`, starting from `trigger`, skipped with “reduce motion”.
- `theme` is controlled and only accepts `light` or `dark` (resolve “system” before passing it); the other variants are `eclipse`, `split`, and `rise`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/theme-switch · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
