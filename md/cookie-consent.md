# Cookie consent

> Barra de consentimento que vira painel de preferências e se recolhe em um botão para reabrir.

- Type: component (category Feedback)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/cookie-consent
- Original description: A consent bar that morphs into preferences and folds into a reopen button.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cookie-consent.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cookie-consent.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cookie-consent.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/cookie-consent.json`. Registry path, relative to the site address: `r/cookie-consent.json`.

- npm packages: `@radix-ui/react-switch`, `lucide-react`, `motion`
- Uses other ryan-ui items (installed along with it): [Button](button.md), [Switch](switch.md)
- Files, once installed:
  - `components/ryan-ui/cookie-consent/cookie-consent.tsx`
  - `components/ryan-ui/cookie-consent/cookie-consent.module.css`
  - `components/ryan-ui/switch/switch.tsx`
  - `components/ryan-ui/switch/switch.module.css`
  - `components/ryan-ui/button/button.tsx`
  - `components/ryan-ui/button/button.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-switch lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/cookie-consent.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Ask for consent to optional cookies on the first visit, with accept, reject, and customize side by side, and declining as easy as accepting.
- Let the user change their mind later: the choice becomes a round button in the corner that reopens the preferences, and `openPreferences()` through the `ref` serves a “Cookies” link in the footer.
- Ask again when the policy changes: increase `version` and the choice saved under `storageKey` stops being valid.

## When not to use

- Use [`announcement-bar`](announcement-bar.md) for a top message that asks for no choice.
- Use [`dialog`](dialog.md) when the flow requires blocking the page until a decision is made; this layer is not modal and the site remains usable behind it.
- Use [`switch`](switch.md) directly on a settings page when the privacy preferences are part of a larger form.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { CookieConsent, type CookieConsentValue } from "@/components/ryan-ui/cookie-consent/cookie-consent";
import { Caption, Stack } from "./_kit";

export default function CookieConsentDemo() {
  const [choice, setChoice] = useState<CookieConsentValue | null>(null);
  return (
    <Stack gap={3} width={640}>
      <div style={{ position: "relative", height: 340, overflow: "hidden", border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", background: "var(--surface)" }}>
        <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-3)" }}>
          <strong style={{ fontSize: "var(--text-lg)" }}>Harbour & Co. Journal</strong>
          <span style={{ color: "var(--text-muted)" }}>Notes on slow travel, small kitchens and well-made things.</span>
        </div>
        <CookieConsent
          strategy="absolute"
          position="bottom"
          policy={{ label: "Cookie policy", href: "#policy" }}
          onChange={value => setChoice(value)}
        />
      </div>
      <Caption>
        {choice ? `Saved: ${Object.entries(choice).filter(([, on]) => on).map(([id]) => id).join(", ") || "nothing"}. Use the small button to change it.` : "Choose “Customize” to open the preferences panel."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CookieConsent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `categories` | `CookieCategory[]` | `defaultCookieCategories` | — |
| `value` | `CookieConsentValue \| null` | — | The saved choice. `null` means the visitor has not decided yet. Leave it out to let the component manage it. |
| `defaultValue` | `CookieConsentValue \| null` | `null` | — |
| `onChange` | `(value: CookieConsentValue \| null, detail: { action: CookieConsentAction; updatedAt: Date }) => void` | — | — |
| `storageKey` | `string` | — | Remembers the choice in `localStorage` under this key. Read it elsewhere with `readCookieConsent`. |
| `version` | `string` | `"1"` | Bump when your categories or policy change to ask again. |
| `preferencesOpen` | `boolean` | — | Whether the preferences panel is open. |
| `defaultPreferencesOpen` | `boolean` | `false` | — |
| `onPreferencesOpenChange` | `(open: boolean) => void` | — | — |
| `policy` | `{ label: string; href?: string; onClick?: () => void }` | — | Link to the full policy, shown in the bar and panel. |
| `position` | `"bottom" \| "bottom-left" \| "bottom-right"` | `"bottom"` | — |
| `strategy` | `"fixed" \| "absolute"` | `"fixed"` | `fixed` pins to the viewport; `absolute` fills the nearest positioned ancestor, useful for previews. |
| `showReopenButton` | `boolean` | `true` | Keep a small button after a choice so visitors can change their mind. Defaults to true. |
| `reopenSide` | `"left" \| "right"` | — | Corner for the reopen button. Defaults to the bar's side, or left when the bar is centered. |
| `labels` | `Partial<CookieConsentLabels>` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `CookieConsentValue`: Category id to allowed. | `Record<string, boolean>` |
| `CookieConsentAction` | `"accept-all" \| "reject-all" \| "save" \| "reset"` |

#### `CookieCategory`

One group of cookies a visitor can allow or refuse.

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `description` | `string` | — |
| `required` | `boolean` | Needed for the site to work. Always on and cannot be switched off. |
| `defaultEnabled` | `boolean` | Starting position of the switch before a choice is saved. Non-essential categories default to off. |

#### `StoredCookieConsent`

What is written to storage under `storageKey`.

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `Record<string, boolean>` | — |
| `version` (required) | `string` | — |
| `updatedAt` (required) | `string` | — |

#### `CookieConsentHandle`

| Field | Type | Description |
| --- | --- | --- |
| `openPreferences` (required) | `() => void` | Opens the preferences panel, for example from a "Cookie settings" footer link. |
| `closePreferences` (required) | `() => void` | Closes the preferences panel without saving. |
| `reset` (required) | `() => void` | Forgets the saved choice and asks again. |

#### `CookieConsentLabels`

| Field | Type | Description |
| --- | --- | --- |
| `message` (required) | `ReactNode` | — |
| `customize` (required) | `string` | — |
| `acceptAll` (required) | `string` | — |
| `rejectAll` (required) | `string` | — |
| `save` (required) | `string` | — |
| `preferencesTitle` (required) | `string` | — |
| `preferencesDescription` (required) | `ReactNode` | — |
| `reopen` (required) | `string` | — |
| `alwaysOn` (required) | `string` | — |
| `close` (required) | `string` | — |

### Other exports

- `defaultCookieCategories` (value)
- `readCookieConsent` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `Esc` | With focus in the preferences panel, closes without saving and returns focus to the bar's “Customize” button or to the reopen button. |
| `Space` or `Enter` | On a category's switch, toggles it in the draft; nothing is saved until “Save choices”, “Accept all”, or “Reject all”. |
| `Tab` or `Shift + Tab` | Moves through buttons and switches; there is no focus trap, because the layer is not modal. |

## Accessibility

- Bar and panel are `role="dialog"` with `aria-modal="false"`, with no focus trap; opening the panel moves focus to the title, and saving or closing returns focus to the bar or to the reopen button.
- Each switch has a `<label>` and `aria-describedby` with the category description, and “Save choices” reports in hidden text how many optional categories are allowed.
- The default texts are in English; pass `labels` (message, buttons, title, `reopen`, `alwaysOn`, `close`) to translate them, including the accessible names of the reopen and close buttons.

## Motion

- A single surface changes position, width, height, and radius with a no-overshoot spring between bar, panel, and round button; growing is slightly slower than shrinking.
- The content of each shape swaps with a short fade, rising a few pixels from a slight blur, and the surface enters from below at nearly full scale.
- With “reduce motion”, the shape changes immediately and only the content fades.

## Responsive behavior

- The bar goes up to 660 px and the panel up to 420 px; below 560 px the bar stacks text and buttons, and in a very narrow bar (around 340 px) “Customize” drops to its own line.
- The category list scrolls internally above `min(46vh, 300px)`; change the limit with the `--cookie-consent-list-max` variable.

## Notes for AI

- Import from `@/components/ryan-ui/cookie-consent/cookie-consent` (it uses `button` and `switch`). It only records the choice: load analytics or marketing scripts yourself, from `onChange` or `readCookieConsent(storageKey, version)`.
- Mount it once in the layout with `storageKey`; nothing appears on the server or before storage is read. In a preview inside a card, use `strategy="absolute"` with a positioned parent.
- For a “Cookies” link in the footer, keep a `ref` and call `openPreferences()`; `reset()` erases the choice and shows the bar again.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/cookie-consent · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
