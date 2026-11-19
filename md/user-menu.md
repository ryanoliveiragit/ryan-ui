# User menu

> Conta, ajustes, tema e sair atrás do avatar; no celular abre como painel inferior.

- Type: component (category Actions)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/user-menu
- Original description: Your account, settings, theme, and sign out behind the avatar. Opens as a bottom sheet on phones.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/user-menu.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/user-menu.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/user-menu.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/user-menu.json`. Registry path, relative to the site address: `r/user-menu.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/user-menu/user-menu.tsx`
  - `components/ryan-ui/user-menu/user-menu.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/user-menu.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The account menu behind the person's photo in the app's top bar: identity, account shortcuts, theme, and sign out.
- Apps with presence (Available, Busy, Away), where the person changes status without leaving the screen.
- Interfaces that need the same menu on mobile: below 640 px it becomes a bottom sheet with no extra configuration.

## When not to use

- Use [`dropdown-menu`](dropdown-menu.md) for general action menus, without the person's identity or selectors.
- Avoid for long lists of destinations: the code itself recommends three or four items; larger navigation belongs in [`site-header`](site-header.md) or a sidebar like [`animated-sidebar`](animated-sidebar.md).

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CreditCard, Settings, UserRound } from "lucide-react";
import UserMenu from "@/components/ryan-ui/user-menu/user-menu";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Caption, Room, Row, Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

// Below 640px the menu opens as a bottom sheet over the whole page (with the page scroll locked), so the preview only starts
// open on wider screens; on a phone it waits for a tap.
const wide = () => typeof window === "undefined" || !window.matchMedia("(max-width: 639px)").matches;

export default function UserMenuDemo() {
  const [startOpen] = useState(wide);
  const [signedOut, setSignedOut] = useState(false);
  return (
    // On wide screens Emma's menu is already open under her avatar. portal={false} keeps both panels inside the stage instead of the page body.
    <Stack gap={4} align="center">
      <Room below={startOpen ? 252 : 0}>
      <Row justify="center" gap={8}>
        <UserMenu
          user={{ name: "Emma Collins", email: "emma@northwind.io", plan: "Pro", avatarSrc: avatar("emma-collins") }}
          defaultStatus="available"
          showName
          defaultOpen={startOpen}
          portal={false}
          items={[
            { label: "Profile", icon: <UserRound size={15} aria-hidden="true" />, keys: ["⌘", "P"] },
            { label: "Settings", icon: <Settings size={15} aria-hidden="true" />, keys: ["⌘", ","] },
            { label: "Billing", icon: <CreditCard size={15} aria-hidden="true" /> },
          ]}
          onSignOut={() => setSignedOut(true)}
        />
        <UserMenu
          user={{ name: "Marcus Johnson", email: "marcus@northwind.io", avatarSrc: avatar("marcus-johnson") }}
          showTheme={false}
          align="start"
          portal={false}
        />
      </Row>
      </Room>
      <Caption>{signedOut ? "Signed out (demo only). Open the menu again to keep exploring." : "Open the avatar menu: status, theme, account links, sign out."}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PresenceDot`

A presence mark that morphs between statuses: the color crossfades while a hole opens for away and a bar slides in for busy.

No props of its own: accepts those of the element or primitive it wraps.

### `UserMenu`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` (required) | `UserMenuUser` | — | — |
| `status` | `"available" \| "busy" \| "away"` | — | Presence status. Passing `status` or `onStatusChange` shows the presence dot and an inline status switch. |
| `defaultStatus` | `"available" \| "busy" \| "away"` | `"available"` | — |
| `onStatusChange` | `(status: UserStatus) => void` | — | — |
| `theme` | `"light" \| "dark" \| "system"` | — | — |
| `defaultTheme` | `"light" \| "dark" \| "system"` | `"system"` | — |
| `onThemeChange` | `(theme: ThemePreference) => void` | — | Reports the choice. Applying it to the page is up to the app. |
| `showTheme` | `boolean` | `true` | Shows the inline light, dark, and system switch. |
| `items` | `UserMenuItem[]` | `[]` | Account destinations with optional shortcut hints, such as ["⌘", ","]. Keep it to three or four. |
| `onSignOut` | `() => void \| Promise<unknown>` | — | — |
| `signOutKeys` | `string[]` | — | — |
| `align` | `"start" \| "center" \| "end"` | `"end"` | — |
| `showName` | `boolean` | `false` | Shows the name and a chevron beside the avatar from 640px up. |
| `open` | `boolean` | — | — |
| `defaultOpen` | `boolean` | `false` | — |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `portal` | `boolean` | `true` | Renders the desktop panel in a portal on the body. Pass false to keep it inside the trigger's wrapper. |
| `ref` | `Ref<HTMLButtonElement>` | — | The trigger button, for returning focus after the menu is swapped out. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `UserStatus` | `"available" \| "busy" \| "away"` |
| `ThemePreference` | `"light" \| "dark" \| "system"` |

#### `UserMenuUser`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `email` (required) | `string` | — |
| `plan` | `string` | — |
| `avatarSrc` | `string` | — |
| `avatarSrcSet` | `string` | — |

#### `UserMenuItem`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |
| `keys` | `string[]` | — |
| `onSelect` | `() => void` | — |

### Other exports

- `userStatuses` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` or `↓` | On the avatar, open the menu with focus on the first row; `↑` opens with focus on the last. |
| `↓` or `↑` | In the menu, move through rows and selectors and wrap around at the ends; `Home` and `End` go to the ends. |
| `←` or `→` | On a selector (Status or Theme), instantly choose the previous or next option, without closing the menu. |
| `A–Z` | Typing the start of a label moves focus to the matching row. |
| `Enter` or `Space` | Trigger the focused row; items and Sign out close the menu, and status and theme choices keep it open. |
| `Esc` or `Tab` | Close the menu and return focus to the avatar. |

## Accessibility

- The avatar is a button with `aria-haspopup="menu"`, `aria-expanded`, and a name built in English (“Account menu, Emma Collins, Available”); the panel is `role="menu"` labeled by it, and Status and Theme use `menuitemradio`.
- Focus only enters the menu when someone opens it (a menu that starts open does not steal focus) and returns to the avatar on close; on mobile, the sheet has `aria-modal`, a scrim, and locks page scrolling.
- Status combines color and shape (filled circle, bar, or ring), without relying on color alone; the texts for Status, Theme, Sign out, and the options are fixed in English in the code.

## Motion

- On desktop, the panel grows from the center of the avatar on a spring with no overshoot, with rows entering in sequence, and closes with a short fade; a single highlight slides between rows.
- On mobile, the sheet rises from the base and can be dragged down to close (more than 80 px or a quick gesture); changing the status transforms the dot, opening the away hole or the busy bar.
- With “reduce motion”, panel and sheet only fade, the sheet does not drag, color and shape transitions are turned off, and the sign-out indicator spins more slowly.

## Responsive behavior

- Below 640 px of width, the same content opens as a bottom sheet with a scrim, taller rows, and without the shortcut hints; the name next to the avatar (`showName`) also disappears.
- On desktop, the panel is 15.5rem wide, stays 12 px from the edges, opens below the avatar and flips upward when there is not enough room, repositioning on scroll or resize.

## Notes for AI

- Pass `user` (`name`, `email`, and, if you want, `plan` and `avatarSrc`, with initials when the photo is missing); the status only appears with `status` or `onStatusChange`, because `defaultStatus` alone does not show it.
- `onThemeChange` only reports the choice (`light`, `dark`, or `system`); applying the theme to the page is up to the app, and `showTheme={false}` hides the selector.
- `onSignOut` can return a Promise: the item shows progress and the menu closes when it finishes; each item's `keys` (like `["⌘", ","]`) are only a visual hint.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/user-menu · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
