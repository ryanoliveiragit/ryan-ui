# Site header

> Cabeçalho de site com menu mega, que ganha fundo ao rolar a página, em três layouts.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/site-header
- Original description: A sticky website header that turns solid on scroll, with a gliding active link, mega menu panels, and a mobile sheet.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-header.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-header.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-header.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-header.json`. Registry path, relative to the site address: `r/site-header.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/site-header/site-header.tsx`
  - `components/ryan-ui/blocks/site-header/site-header.module.css`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/site-header.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Top navigation for a product or documentation site: brand, a few sections, “Sign in,” and a primary action, fixed at the top and opaque on scroll.
- Sections with many destinations that call for mega menu panels with a description per link and a featured card (`variant="mega"`).
- Sites that need to work on mobile: below 760 px of header width, the links fold into a menu sheet.

## When not to use

- Use [`page-header`](page-header.md) for the header of a page inside the app, with project title, tabs, and actions.
- Use [`animated-sidebar`](animated-sidebar.md) when the app's navigation is a side menu with groups and many sections.
- Use [`drawer`](drawer.md) when the mobile menu needs to be a modal dialog: the sheet here does not trap focus.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import SiteHeader from "@/components/ryan-ui/blocks/site-header/site-header";

export default function SiteHeaderDemo() {
  return <SiteHeader />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `RyanMark`

No props of its own: accepts those of the element or primitive it wraps.

### `SiteHeader`

A website header in three layouts. It sticks to the top and turns solid once the page scrolls, marks the current section with an indicator that glides between links, opens springy mega menu panels whose content slides in from the side you moved toward, and folds into a menu sheet on narrow containers.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"simple" \| "centered" \| "mega"` | `"mega"` | `simple` puts links beside the brand, `centered` centers them in a quiet capsule, `mega` opens panels for items with links. |
| `brand` | `{ name: string; href?: string; mark?: ReactNode }` | `{ name: "ryan-ui" }` | — |
| `items` | `SiteHeaderItem[]` | `siteHeaderExampleItems` | — |
| `current` | `string` | — | Value of the item that holds the current page (controlled). |
| `defaultCurrent` | `string` | — | Initial current item when uncontrolled. |
| `onCurrentChange` | `(value: string) => void` | — | Called when a destination inside an item is chosen, with that item's value. |
| `onNavigate` | `(destination: SiteHeaderDestination) => void` | — | Called for every destination: items, panel links, the brand, and actions with an href. |
| `secondaryAction` | `SiteHeaderAction \| null` | `{ label: "Sign in" }` | A quiet action before the primary one, such as Sign in. Pass null to hide it. |
| `primaryAction` | `SiteHeaderAction \| null` | `{ label: "Get ryan-ui" }` | The one primary action at the end of the bar. Pass null to hide it. |
| `sticky` | `boolean` | `true` | Sticks to the top of its scroll container. Defaults to true. |
| `scrollContainer` | `RefObject<HTMLElement \| null>` | — | The element that scrolls, when it is not the window. The header turns solid once it scrolls. |
| `scrollThreshold` | `number` | `8` | Pixels of scroll before the background turns solid. Defaults to 8. |
| `label` | `string` | `"Main"` | Accessible name of the navigation landmark. |
| `defaultOpenItem` | `string` | — | Mega variant: the item whose panel starts open, as a preview would show it. It closes like any panel (outside press, Escape) and never moves focus on its own. |
| `className` | `string` | — | — |

### `SiteHeaderBlock`

Preview: the header inside a small scrolling page, with a switch between its three layouts.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `SiteHeaderVariant` | `"simple" \| "centered" \| "mega"` |

#### `SiteHeaderLink`

One destination inside a mega menu panel.

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `description` | `string` | One short line under the label. |
| `icon` | `ReactNode` | A plain decorative icon beside the label. |
| `href` | `string` | — |

#### `SiteHeaderFeature`

A card beside the links in a mega menu panel.

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `href` | `string` | — |
| `image` | `{ src: string; alt: string }` | — |

#### `SiteHeaderItem`

A top level destination. With `links` and the mega variant it opens a panel; otherwise it is a plain link.

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | Stable value, also used for `current`. |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `links` | `SiteHeaderLink[]` | — |
| `feature` | `SiteHeaderFeature` | — |

#### `SiteHeaderAction`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `onClick` | `() => void` | — |

#### `SiteHeaderDestination`

What `onNavigate` receives.

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `section` | `string` | The top level item the destination belongs to. |

### Other exports

- `siteHeaderExampleItems` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `←` or `→` | Move focus between the top-level items, wrapping around; with a panel open, the panel follows the item. |
| `↓` | On an item with a panel, opens the panel and moves focus to the first link. |
| `↑` or `↓` | Inside the panel, move between links; `↑` on the first link closes the panel and returns focus to the item. |
| `Home` or `End` | Inside the panel, go to the first or last link. |
| `Esc` | Closes the panel and returns focus to the item; with the mobile sheet open, closes the sheet and returns focus to the menu button. |
| `Enter` or `Space` | On an item with a panel, open or close the panel; on the menu button, open or close the sheet. |

## Accessibility

- The top-level links sit in a `<nav>` named by `label` (“Main”); simple items receive `aria-current="page"`, but on an item with a panel the current state is only visual.
- Panel triggers have `aria-expanded` and `aria-controls`, the panel is a `role="region"` with the item's name, and the outgoing face is `inert` during the switch.
- The menu button has `aria-expanded`, `aria-controls`, and a label that toggles; the sheet neither moves nor traps focus on open, and `Esc` closes it, returning focus to the button.

## Motion

- Past `scrollThreshold` (8 px), the background becomes opaque with a border and shadow and only lightens again near the top; the hover highlight (outside `centered`) and the current-section indicator slide between links.
- The panel opens after 70 ms of mouse intent, the height follows the content on a spring that does not overshoot and, when moving to another item, the content enters from the side you moved toward.
- The mobile sheet drops from the bar opening its height on a spring, with rows in sequence; with “reduce motion” on, panel and sheet only fade and the menu icon does not rotate.

## Responsive behavior

- The header is its own container: below 760 px the links, the secondary action, and the panel disappear, the menu button appears, and widening again closes the sheet.
- The sheet scrolls inside up to `--site-header-sheet-max` (default `100dvh - 65px`); set that variable when the header lives in a fixed-height container.

## Performance

- Listens to `scroll` passively on the window or on `scrollContainer` and uses a `ResizeObserver` on the header; hover intent timers are cleared on unmount.

## Notes for AI

- Import the named component `SiteHeader`; the default export is `SiteHeaderBlock`, the preview with layout switching inside a scrolling page.
- If the page scrolls inside an element, pass it as `scrollContainer`: it decides when the background becomes opaque and receives `overflow: hidden` while the mobile sheet is open.
- Items with `links` only become a panel in `mega`; since the click event does not reach `onNavigate`, for client-side routing leave the destinations without `href` (they become buttons) and navigate in the callback.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/site-header · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
