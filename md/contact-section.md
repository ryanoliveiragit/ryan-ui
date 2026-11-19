# Contact section

> Seção de contato com formulário, canais e escritórios, em três layouts à escolha.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/contact-section
- Original description: A validated contact form that morphs into a confirmation, support channels, and office cards with local times.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/contact-section.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/contact-section.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/contact-section.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/contact-section.json`. Registry path, relative to the site address: `r/contact-section.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Avatar](avatar.md), [Button](button.md), [Copy button](copy-button.md), [Input](input.md), [Segmented control](segmented-control.md), [Textarea](textarea.md)
- Files, once installed:
  - `components/ryan-ui/blocks/contact-section/contact-section.tsx`
  - `components/ryan-ui/blocks/contact-section/contact-section.module.css`
  - `components/ryan-ui/lib/media.ts`
  - `components/ryan-ui/textarea/textarea.tsx`
  - `components/ryan-ui/textarea/textarea.module.css`
  - `components/ryan-ui/segmented-control/segmented-control.tsx`
  - `components/ryan-ui/segmented-control/segmented-control.module.css`
  - `components/ryan-ui/input/input.tsx`
  - `components/ryan-ui/input/input.module.css`
  - `components/ryan-ui/copy-button/copy-button.tsx`
  - `components/ryan-ui/copy-button/copy-button.module.css`
  - `components/ryan-ui/lib/use-copy-feedback.ts`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`
  - `components/ryan-ui/avatar/avatar.tsx`
  - `components/ryan-ui/avatar/avatar.module.css`
  - `components/ryan-ui/lib/ryan-provider.tsx`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/contact-section.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A contact page or section with a validated form (name, email, subject, and message) that turns into a confirmation in the same card, in the `form` variant.
- A support center with several channels (chat, email, sales, community), each with its own detail panel, in the `channels` variant.
- Companies with offices in different time zones: the `offices` variant shows each one's local time and whether it is open now.

## When not to use

- Use [`feedback-widget`](feedback-widget.md) to collect a quick opinion without the person leaving the page.
- Use [`signup-form`](signup-form.md) to create an account, with its own password strength and completion state.
- Avoid when the form needs other fields: name, email, subject, and message are hardcoded, and only the list of subjects comes through a prop.

## Usage

The demo from the item page, with imports as they look after installing through the CLI.

```tsx
import ContactSection from "@/components/ryan-ui/blocks/contact-section/contact-section";

export default function ContactSectionDemo() {
  return <ContactSection />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ContactSection`

A contact section in three layouts: a validated form whose card springs into a confirmation, a list of support channels whose detail panel morphs to each channel, and office cards with live local times and open status.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"form" \| "channels" \| "offices"` | `"form"` | `form` validates and morphs into a confirmation, `channels` lists ways to reach you, `offices` shows live local times. |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `topics` | `string[]` | `["Sales", "Support", "Partnerships", "Press"]` | Topics offered in the form. |
| `onSubmit` | `(message: ContactMessage) => void \| Promise<void>` | — | Called with a valid message. Reject to keep the form and show an error; resolve to show the confirmation. |
| `channels` | `ContactChannel[]` | `contactExampleChannels` | — |
| `channel` | `string` | — | Selected channel (controlled). |
| `defaultChannel` | `string` | — | — |
| `onChannelChange` | `(value: string) => void` | — | — |
| `offices` | `ContactOffice[]` | `contactExampleOffices` | — |
| `className` | `string` | — | — |

### `ContactSectionBlock`

Preview: the contact section with a switch between its three layouts. Messages are simulated and never sent.

No props of its own: accepts those of the element or primitive it wraps.

### Exported types

| Type | Definition |
| --- | --- |
| `ContactSectionVariant` | `"form" \| "channels" \| "offices"` |

#### `ContactMessage`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `email` (required) | `string` | — |
| `topic` (required) | `string` | — |
| `message` (required) | `string` | — |

#### `ContactChannel`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `label` (required) | `string` | — |
| `meta` (required) | `string` | One line under the label in the list, such as a response time. |
| `icon` | `ReactNode` | — |
| `detail` (required) | `ReactNode` | The detail shown when the channel is selected. |

#### `ContactOffice`

| Field | Type | Description |
| --- | --- | --- |
| `city` (required) | `string` | — |
| `timeZone` (required) | `string` | IANA time zone, used for the live local time and open status. |
| `address` (required) | `string[]` | — |
| `email` | `string` | — |
| `hours` | `[number, number]` | Opening hours in local 24 hour time. Defaults to 9 to 18. |

### Other exports

- `contactExampleChannels` (value)
- `contactExampleOffices` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `←` or `→` | In the subject group, select the previous or next subject, wrapping at the ends. |
| `↑` or `↓` or `←` or `→` | In the channel list (`channels` variant), select the previous or next channel and switch the panel, wrapping around. |
| `Home` or `End` | In the channel list, select the first or last channel. |
| `Enter` | In a single-line field, submits the form; on error, focus goes to the first invalid field. |

## Accessibility

- The fields come from `input` and `textarea`, with a visible label, `aria-invalid`, and an error tied to the field in `role="alert"`; a submit failure also appears in `role="alert"`.
- The subjects are a `radiogroup` with roving focus and the channels a vertical `tablist` tied to the `tabpanel`; during the swap, the outgoing face is `inert`.
- On confirmation, focus goes to the “Thanks, …” heading, and “Send another message” clears the form and returns focus to the Name field; the fixed texts are in English.

## Motion

- The card changes height on a spring when it turns into the confirmation, while the faces swap by sliding slightly and coming out of a slight blur; the confirmation checkmark is drawn.
- On subjects and channels, a highlight slides to the chosen option, and the channel panel adjusts its height while the new content enters in the navigation direction.
- With “reduce motion” on, the faces only fade, the height changes instantly, the highlights do not slide, and the checkmark appears already drawn.

## Responsive behavior

- Container query: below 820px the form drops below the text and the channels become a horizontally scrolling row, without the detail row; below 520px the fields stack.
- The office cards arrange themselves in automatic columns of at least 240px (`auto-fit`).

## Performance

- The `offices` variant updates the local time every 15 seconds; before mounting in the browser it shows “--:--”, so the first render matches the server's.

## Notes for AI

- Import `ContactSection` by name (the default export is the preview with a variant selector); `avatar`, `button`, `copy-button`, `input`, `segmented-control`, and `textarea` are installed along with it.
- `onSubmit` receives `{ name, email, topic, message }`: return a promise and reject it to keep the form with the failure message; without it, the submit is only simulated (1.1 s) and nothing leaves the page.
- The email “hello@example.com” and the reply times of the `form` variant are written in the code; example channels and offices are swapped through `channels` and `offices`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/contact-section · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
