# Site footer

> Rodapé de site em três layouts, com colunas de links, redes sociais, newsletter e status.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/site-footer
- Original description: A website footer with link columns and newsletter, a minimal layout, and a large fading ryan-ui mark.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-footer.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-footer.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-footer.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/site-footer.json`. Registry path, relative to the site address: `r/site-footer.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Segmented control](segmented-control.md)
- Files, once installed:
  - `components/ryan-ui/blocks/site-footer/site-footer.tsx`
  - `components/ryan-ui/blocks/site-footer/site-footer.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/site-footer.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Footer for a product or documentation site with link columns, newsletter signup, legal links, social networks, and a system status link.
- Discreet two-line footer (`variant="minimal"`) for pages where columns would be excessive.
- Closing a ryan-ui landing page with the large gradient brand (`variant="logo"`).

## When not to use

- Use [`newsletter-signup`](newsletter-signup.md) when the signup is the section's main call, with the issue stack and the reader count.
- Use [`cta-section`](cta-section.md) to close the page with a call to action instead of navigation.
- The `variant="logo"` variant only works for the ryan-ui brand: the large arc is drawn in the file and `brand.mark` only changes the small icon.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import SiteFooter from "@/components/ryan-ui/blocks/site-footer/site-footer";

export default function SiteFooterDemo() {
  return <SiteFooter />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SiteFooter`

A website footer in three layouts: link columns with a newsletter signup, a single quiet row, and a closing variant where the ryan-ui mark rises in, oversized and cropped by the bottom edge, fading into the page.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"columns" \| "minimal" \| "logo"` | `"columns"` | `columns` pairs a newsletter with link columns, `minimal` is one quiet row, `logo` ends in a large fading ryan-ui mark. |
| `brand` | `{ name: string; href?: string; mark?: ReactNode }` | `{ name: "ryan-ui" }` | — |
| `tagline` | `string` | `"Interface components that move with intent."` | One short line under the brand. |
| `columns` | `SiteFooterColumn[]` | `siteFooterExampleColumns` | — |
| `links` | `SiteFooterLink[]` | — | Links for the minimal variant. Defaults to the first link of each column. |
| `legal` | `SiteFooterLink[]` | `exampleLegal` | Small links beside the copyright, such as Privacy and Terms. |
| `socials` | `SiteFooterLink[]` | `exampleSocials` | — |
| `newsletter` | `SiteFooterNewsletter \| null` | `{ title: "Get the monthly release notes", des…` | Newsletter signup. Pass null to hide it. |
| `status` | `{ label: string; tone?: "success" \| "warning" \| "danger"; href?: string } \| null` | `{ label: "All systems normal", tone: "success" }` | A system status link. Pass null to hide it. |
| `year` | `number` | `new Date().getFullYear()` | Year in the copyright line. |
| `onNavigate` | `(link: SiteFooterLink) => void` | — | Called for every link that is pressed. Links without an href render as buttons and only call this. |
| `className` | `string` | — | — |

### `SiteFooterBlock`

Preview: the footer with a switch between its three layouts and a note of the last link pressed.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `SiteFooterVariant` | `"columns" \| "minimal" \| "logo"` |

#### `SiteFooterLink`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` | `string` | — |
| `external` | `boolean` | Opens in a new tab and shows an outward arrow. |

#### `SiteFooterColumn`

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | — |
| `links` (required) | `SiteFooterLink[]` | — |

#### `SiteFooterNewsletter`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | — |
| `description` | `string` | — |
| `placeholder` | `string` | — |
| `onSubscribe` | `(email: string) => void \| Promise<void>` | Called with a valid address. Throw or reject to show an error; resolve to show the subscribed state. |

### Other exports

- `siteFooterExampleColumns` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the newsletter field, submits the signup; if empty or invalid, the error appears right there. |

## Accessibility

- The columns sit in a `<nav aria-label="Footer">` with each heading in an `<h2>`, the legal and social lists have an `aria-label`, and links without `href` become a `<button>`.
- The newsletter field has a hidden label, `aria-invalid`, and `aria-describedby` for the message line, which is `aria-live="polite"` and becomes `role="alert"` on error.
- `external` links open in a new tab with `rel="noopener noreferrer"`, but the notice is only the `aria-hidden` arrow; if it matters, include “new tab” in the `label`.

## Motion

- In the `logo` variant, the large arc rises 40 px and appears in 0.9 s the first time 30% of it enters the screen, cut off by the bottom edge and fading into the brand gradient.
- The newsletter line swaps in place between hint, error, and confirmation, rising from a slight blur, and the arrow on external links shifts on hover.
- With “reduce motion” on, the arc appears already drawn, messages change instantly, and the link and field transitions are removed.

## Responsive behavior

- The footer's container queries: up to 760 px the brand and newsletter stack above the columns; up to 520 px the columns become two, the newsletter takes the full width, and the bottom line stacks.

## Notes for AI

- Import the named component `SiteFooter`; the default export is `SiteFooterBlock`, the preview with layout switching, and all props have ryan-ui example values for you to replace.
- Pass `columns`, `legal`, and `socials` with `href`, because without it the links become buttons that only call `onNavigate`; `newsletter={null}` and `status={null}` hide those parts.
- `newsletter.onSubscribe(email)` can return a Promise: rejecting shows the error and resolving shows “Subscribed”; without the function, the block waits 0.9 s and pretends success.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/site-footer · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
