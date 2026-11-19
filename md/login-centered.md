# Centered login

> Cartão de login centralizado, com passkey em primeiro lugar, que muda de e-mail para código sem trocar de tela.

- Type: block
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/b/login-centered
- Original description: A passkey-first login card on a quiet ring backdrop that morphs through email and code.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/login-centered.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/login-centered.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/login-centered.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/login-centered.json`. Registry path, relative to the site address: `r/login-centered.json`.

- npm packages: `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Input](input.md), [OTP input](otp-input.md)
- Files, once installed:
  - `components/ryan-ui/blocks/login-centered/login-centered.tsx`
  - `components/ryan-ui/blocks/login-centered/login-centered.module.css`
  - `components/ryan-ui/otp-input/otp-input.tsx`
  - `components/ryan-ui/otp-input/otp-input.module.css`
  - `components/ryan-ui/input/input.tsx`
  - `components/ryan-ui/input/input.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/login-centered.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Full-page login screen that offers passkey first, with email plus a 6-digit code and three single sign-on providers as alternatives.
- Prototypes and demos that need a navigable sign-in flow without a backend: every step is simulated with timers.
- Products where signing in and creating an account share the same card: the button at the top switches between “Sign in” and “Sign up” modes.

## When not to use

- Use [`sign-in`](sign-in.md) when a standalone email-and-code card is enough, without the ring background, header, and page footer.
- Use [`signup-form`](signup-form.md) when account creation asks for name, password, and a strength meter.
- Use [`otp-input`](otp-input.md) when you already have the flow and only need the code field.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import LoginCentered from "@/components/ryan-ui/blocks/login-centered/login-centered";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { layout: "center", height: 720 };

export default function LoginCenteredDemo() {
  return <LoginCentered />;
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `LoginCentered`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `demoCode` | `string` | `"482913"` | The code the simulated email contains. |
| `fullScreen` | `boolean` | `false` | Fill the viewport (100dvh, no frame) when the block is the whole page. |
| `demoEmail` | `string` | `"maya@northwind.studio"` | The account a simulated passkey or single sign-on resolves to. |
| `termsHref` | `string` | `"#terms"` | — |
| `privacyHref` | `string` | `"#privacy"` | — |
| `onSignIn` | `(email: string, method: LoginMethod, mode: Mode) => void` | — | Called once the simulated sign in or sign up succeeds. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `LoginMethod` | `"Passkey" \| "Email code" \| Provider` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` | In the email field or any code cell, submits the form for the current step. |
| `←` or `→` | On the code step, move focus between the cells (`otp-input` behavior). |
| `Backspace` | In an empty code cell, clears the previous cell and moves focus back to it. |
| `Tab` | Moves through the controls of the step; blocked buttons use `aria-disabled` and stay focusable. |

## Accessibility

- Each step change is announced by a visually hidden `role="status"` region with `aria-live="polite"`; the visible status line in the footer is `aria-hidden`.
- Focus follows the flow: it goes to the passkey button, to the email field, to the first code cell, and, on completion, to the welcome heading.
- The provider group is a named `role="group"`, each button has its own `aria-label`, and the resend button reports in its `aria-label` how many seconds remain.

## Motion

- Steps rise into place from a slight blur and, when going back, drop in from above; the card height follows the new content with a spring that does not overshoot, only during the switch.
- The background rings drift slightly with the mouse, the outer ones more than the inner ones; on passkey two rings pulse out from the fingerprint, the resend countdown rolls digit by digit, and success draws a circle and a checkmark.
- With “reduce motion” on, steps only fade, the height changes instantly, the rings stay still, and the passkey pulse is not rendered.

## Responsive behavior

- Uses the block's own container queries: below 520 px and 400 px of width, the spacing, the title, and the provider buttons shrink.
- Fills the container width with a minimum height of 640 px; `fullScreen` switches to `min-height: 100dvh` and removes the border and radius.

## Performance

- A `ResizeObserver` measures the card to animate its height, and the resend countdown uses a 1 s timer only on the code step; all timers are cleared on unmount.

## Notes for AI

- Nothing is actually authenticated: `startPasskey`, `submitEmail`, `verify`, and `signInWith` use `setTimeout`, and `onSignIn(email, method, mode)` only signals that the simulation finished; replace these functions with the real calls.
- Props: `fullScreen` to fill the page, `demoCode` (the accepted code, default `482913`), `demoEmail` (the account returned by passkey and providers), `termsHref`, and `privacyHref`.
- Depends on `button`, `input`, and `otp-input`; the “ryan-ui” brand and all texts are hardcoded in English in the file, with no props to translate them.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/b/login-centered · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
