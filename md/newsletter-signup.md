# Newsletter signup

> Cadastro de newsletter em dois layouts, com confirmação e tratamento de erro.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/newsletter-signup
- Original description: An email signup framed by a stack of past issues; subscribing drops the next issue, addressed to you, onto the front.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/newsletter-signup.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/newsletter-signup.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/newsletter-signup.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/newsletter-signup.json`. Registry path, relative to the site address: `r/newsletter-signup.json`.

- npm packages: `@radix-ui/react-switch`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Animated counter](animated-counter.md), [Segmented control](segmented-control.md), [Switch](switch.md)
- Files, once installed:
  - `components/ryan-ui/blocks/newsletter-signup/newsletter-signup.tsx`
  - `components/ryan-ui/blocks/newsletter-signup/newsletter-signup-data.ts`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/blocks/newsletter-signup/newsletter-signup.module.css`
  - `components/ryan-ui/switch/switch.tsx`
  - `components/ryan-ui/switch/switch.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/animated-counter/animated-counter.tsx`
  - `components/ryan-ui/animated-counter/animated-counter.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-switch lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/newsletter-signup.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Newsletter signup section on a landing page or blog where showing past issues helps people decide.
- Standalone signup card (`variant="card"`), for example at the end of an article.
- Email-only form with validation and submit states, without the stack: pass `publication={null}` and `readers={null}`.

## When not to use

- Use [`site-footer`](site-footer.md) when the signup is just a field inside the footer; its columns variant already includes a newsletter form.
- Use [`contact-section`](contact-section.md) when the person needs to write a message, and [`signup-form`](signup-form.md) when the goal is to create an account with a password.
- Without real issues to show, the stack becomes decoration with example data; in that case hide it instead of inventing content.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import NewsletterSignup from "@/components/ryan-ui/blocks/newsletter-signup/newsletter-signup";

export default function NewsletterSignupDemo() {
  return <NewsletterSignup />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `NewsletterSignup`

A newsletter signup framed by the newsletter itself: a stack of recent issues. Subscribing drops the next issue, addressed to the new reader, onto the front of the stack and ticks the reader count up by one. Comes as an inline page section or a self-contained card.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"inline" \| "card"` | `"inline"` | `inline` puts the copy and form beside the issue stack; `card` is a self-contained card with the stack in a tray on top. |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `placeholder` | `string` | `"you@company.com"` | — |
| `buttonLabel` | `string` | `"Subscribe"` | — |
| `privacyNote` | `ReactNode` | `newsletterCopy.privacy` | Short line under the form about frequency and privacy. |
| `privacyLink` | `{ label: string; href: string } \| null` | `newsletterCopy.privacyLink` | Link after the privacy note. Pass null to hide it. |
| `readers` | `{ count: number; faces: string[] } \| null` | `newsletterReaders` | Reader count and up to three faces. The count ticks up by one when someone subscribes. Pass null to hide it. |
| `publication` | `NewsletterPublication \| null` | `newsletterPublication` | The issue stack. On success the upcoming issue, addressed to the new reader, lands on top. Pass null for a form without the stack. |
| `onSubscribe` | `(email: string) => void \| Promise<void>` | — | Called with a valid, trimmed email. Reject to show an error and keep the email; resolve to show the success state. |
| `className` | `string` | — | — |

### `NewsletterSignupBlock`

Preview: both layouts. Subscribing is simulated and nothing is sent; the switch makes the next send fail.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `NewsletterVariant` | `"inline" \| "card"` |

#### `NewsletterStory`

One story teased in an issue. `image` is a small square-cropped thumbnail.

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | — |
| `image` (required) | `string` | — |
| `minutes` (required) | `number` | — |

#### `NewsletterIssue`

One issue of the newsletter, as it appears on the stack.

| Field | Type | Description |
| --- | --- | --- |
| `number` (required) | `number` | — |
| `date` (required) | `string` | Send date as it should read, such as "Friday, September 25". |
| `subject` (required) | `string` | — |
| `stories` (required) | `NewsletterStory[]` | Up to three stories. |

#### `NewsletterPublication`

The publication shown beside the form: the next issue lands on the stack of recent ones when someone subscribes.

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `upcoming` (required) | `NewsletterIssue` | The next issue. It is addressed to the new reader and joins the front of the stack on success. |
| `recent` (required) | `NewsletterIssue[]` | Recent issues, newest first. The first three make the stack. |

### Other exports

- `newsletterCopy` (value)
- `newsletterPublication` (value)
- `newsletterReaders` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the email field, submits the form; with an invalid address, focus returns to the field. |

## Accessibility

- The field has a visually hidden `<label>` (“Email address”), `aria-invalid` when the address is invalid, and `aria-describedby` pointing to the message line.
- The message line sits in an `aria-live="polite"` region and becomes `role="alert"` on error; on completion, focus goes to “Use a different email” and, on reset, returns to the field.
- Only the front issue of the stack is exposed to the screen reader, with an `aria-label`; the ones behind are `aria-hidden` and the reader photos have empty `alt`.

## Motion

- On subscribe, the next issue rises from below, addressed to the typed email, and lands at the front of the stack; the previous ones step back one level on a spring that does not overshoot and the oldest leaves.
- The button label swaps in place between submit, submitting, and subscribed (with a drawn checkmark), the reader count goes up by one, and an error shakes the field sideways once.
- With “reduce motion” on, issues take their place instantly and only fade, there is no shake or checkmark drawing, and the submit indicator spins more slowly.

## Responsive behavior

- The block's container queries: up to 860 px the `inline` variant stacks the text and the stack; up to 520 px and 400 px the spacing shrinks and the reading minutes disappear.
- The form has its own container: up to 300 px, the field and button separate and stack at full width; the message line reserves the height of the longest sentence, so nothing below moves.

## Performance

- Thumbnails and faces go through `RyanImage`, which loads on demand by default; an invisible copy of the next issue stays in the DOM only to reserve the stack's height.

## Notes for AI

- Import the named component `NewsletterSignup`; the default export is `NewsletterSignupBlock`, the preview with layout switching and a switch that simulates failure.
- Pass `onSubscribe(email)` returning a Promise: rejecting shows the error and keeps the email, resolving shows success; without this prop the block just waits 1.1 s and pretends it worked.
- `publication` (name, `upcoming`, and `recent`) and `readers` come with example data from `newsletter-signup-data.ts`; replace them with your own or pass `null`, and note that the validation messages are hardcoded in English.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/newsletter-signup · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
