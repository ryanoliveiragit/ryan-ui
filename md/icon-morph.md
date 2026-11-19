# Icon morph

> Ícones que se transformam entre estados: menu em fechar, play em pausa, copiar em confirmado e outros.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/icon-morph
- Original description: Icons that morph between states: menu to close, play to pause, copy to check, and more.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/icon-morph.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/icon-morph.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/icon-morph.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/icon-morph.json`. Registry path, relative to the site address: `r/icon-morph.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/icon-morph/icon-morph.tsx`
  - `components/ryan-ui/icon-morph/icon-morph.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/icon-morph.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Toggle buttons whose icon represents the state: open and close the menu, play and pause, enable and mute notifications, like.
- Small confirmations inside your own button, like copy becoming a checkmark or add becoming a checkmark (`copy` and `plus`).

## When not to use

- Use [`copy-button`](copy-button.md) when you need to copy a value with the confirmation ready-made.
- Use [`theme-switch`](theme-switch.md) to toggle between light and dark: it is already a complete button, with the animated icon and the accessible name.
- For an icon that does not change state, use the regular icon from the Lucide library; here there are only eight fixed pairs of drawings.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import IconMorph, { type IconMorphName } from "@/components/ryan-ui/icon-morph/icon-morph";
import { Caption, Row, Stack } from "./_kit";

const icons: { name: IconMorphName; label: string; on: string; off: string }[] = [
  { name: "menu", label: "Menu", off: "Open menu", on: "Close menu" },
  { name: "play", label: "Play", off: "Play", on: "Pause" },
  { name: "plus", label: "Plus", off: "Add to list", on: "Added" },
  { name: "copy", label: "Copy", off: "Copy", on: "Copied" },
  { name: "theme", label: "Theme", off: "Light", on: "Dark" },
  { name: "chevron", label: "Chevron", off: "Expand", on: "Collapse" },
  { name: "bell", label: "Bell", off: "Muted", on: "Notifications on" },
  { name: "heart", label: "Heart", off: "Like", on: "Liked" },
];

export default function IconMorphDemo() {
  const [state, setState] = useState<Record<string, boolean>>({});
  return (
    <Stack gap={5} align="center" width={560}>
      <Row justify="center" gap={4}>
        {icons.map(icon => {
          const active = !!state[icon.name];
          return (
            <button
              key={icon.name}
              type="button"
              aria-pressed={active}
              aria-label={`${icon.label}: ${active ? icon.on : icon.off}`}
              onClick={() => setState(current => ({ ...current, [icon.name]: !current[icon.name] }))}
              style={{ display: "grid", justifyItems: "center", gap: "var(--space-2)", width: 112, padding: "var(--space-4) var(--space-2)", color: "var(--foreground)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", font: "inherit", cursor: "pointer" }}
            >
              <IconMorph name={icon.name} state={active} size={28} />
              <span style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>{active ? icon.on : icon.off}</span>
            </button>
          );
        })}
      </Row>
      <Caption>Tap any tile to morph its icon to the second state and back.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `MenuIcon`

Menu to close: the outer lines slide to the middle as they rotate into an X, and the middle line folds away.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `PlayPauseIcon`

Play to pause: the triangle splits into two halves that straighten into bars.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `PlusCheckIcon`

Plus to check: each bar swings its ends to become one leg of the check.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `CopyCheckIcon`

Copy to check: the back sheet tucks under the front one, the front one settles away, and the check draws in.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `SunMoonIcon`

Sun to moon: the disc grows while a shadow slides across it from the corner, carving the crescent, and the rays turn and fold in. The crescent is drawn as an outline: the disc's edge outside the shadow, and the shadow's edge inside the disc.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `ChevronIcon`

A chevron that turns on a spring, for disclosure and sort controls.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `turn` | `number` | `180` | Degrees the chevron turns when `state` is true. 180 flips down to up; 90 turns right to down. |
| `pointing` | `"down" \| "right"` | `"down"` | Where the chevron points at rest. |
| `...props` | `IconMorphIconProps` | — | Also accepts the props of this type. |

### `BellIcon`

Notifications on and off: turning on rings the bell from its top, with the clapper lagging behind; turning off strikes it through.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `HeartIcon`

Like: the heart fills with a pop, and a ring and a few sparks burst out once. Unliking simply empties it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `boolean` | `false` | The second state of the icon. menu: close, play: pause, plus: check, copy: check, theme: moon, chevron: turned, bell: notifications on, heart: liked. |
| `size` | `number` | — | Rendered size in px. Defaults to 24. |
| `strokeWidth` | `number` | — | Stroke width in the 24 unit grid. Defaults to 1.75. |
| `...props` | `SVGProps<SVGSVGElement>` | — | Also accepts the props of this type, except `ref` and `children`. |

### `IconMorph`

One entry point for every morphing icon: pick it by `name` and drive it with `state`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `"menu" \| "play" \| "plus" \| "copy" \| "theme" \| "chevron" \| "bell" \| "heart"` | — | — |
| `...props` | `IconMorphIconProps` | — | Also accepts the props of this type. |

### Exported types

| Type | Definition |
| --- | --- |
| `IconMorphName` | `"menu" \| "play" \| "plus" \| "copy" \| "theme" \| "chevron" \| "bell" \| "heart"` |

## Accessibility

- Every icon is an SVG with `aria-hidden="true"` and `focusable="false"`: put it in a `<button>` that has the accessible name and `aria-pressed` reflecting `state`.
- Since the drawing changes with the state (the menu becomes an X, play becomes pause), update the button name along with it, for example from “Open menu” to “Close menu”.

## Motion

- The icon transforms instead of swapping: the menu lines rotate into an X, play splits into two bars, the sun grows while a shadow carves out the moon, all on springs that can be interrupted midway.
- Turning the bell on makes it swing (0.9 s), with the clapper delayed, and liking the heart fires a ring and sparks once; turning it off strikes the bell through, and unliking only empties the heart.
- With “reduce motion”, the icon changes state instantly, without the bell swing or the heart burst.

## Notes for AI

- Use `<IconMorph name="menu" state={aberto} />` or the specific component: `MenuIcon`, `PlayPauseIcon`, `PlusCheckIcon`, `CopyCheckIcon`, `SunMoonIcon`, `ChevronIcon`, `BellIcon`, or `HeartIcon`.
- The parent controls `state`, since the icon has no click or state of its own; `size` (24) and `strokeWidth` (1.75) tune the drawing, and `ChevronIcon` accepts `turn` (degrees) and `pointing`.
- It inherits the text color (`currentColor`); the liked heart uses `--icon-morph-like`, which by default is the danger color.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/icon-morph · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
