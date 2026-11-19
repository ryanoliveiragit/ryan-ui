# Phone input

> Campo de telefone com seletor de país, formatação enquanto você digita e saída no padrão E.164.

- Type: component (category Inputs)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/phone-input
- Original description: A phone field with a country picker, formatting as you type, and E.164 output.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/phone-input.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/phone-input.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/phone-input.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/phone-input.json`. Registry path, relative to the site address: `r/phone-input.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/phone-input/phone-input.tsx`
  - `components/ryan-ui/phone-input/phone-input.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/phone-input.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Sign-up, checkout, or SMS verification that needs the phone number in E.164 (`+5511961234567`).
- Multi-country audiences: people pick the country from the list or paste a number with `+` and the country adjusts on its own.
- Forms where formatting while typing prevents errors, with the country mask and a ghost of the missing format.

## When not to use

- Use [`input`](input.md) with `type="tel"` when the audience is from a single country and E.164 does not matter.
- For countries outside the built-in table (49) or to check whether the number exists, use a telephony library, because only the digit count is checked here.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import PhoneInput from "@/components/ryan-ui/phone-input/phone-input";
import { Caption, Stack } from "./_kit";

export default function PhoneInputDemo() {
  const [value, setValue] = useState("");
  return (
    <Stack width={360} gap={3}>
      <PhoneInput label="Mobile number" description="We only text delivery updates." value={value} onValueChange={setValue} defaultCountry="US" />
      <Caption>E.164 value: {value || "empty"}. Try pasting +44 7911 123456 or typing “+” to search calling codes.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `PhoneInput`

A phone number field with a country picker. The country button grows into a searchable list, the number formats as it is typed with a faint guide showing the rest of the expected shape, pasted or autofilled international numbers pick their own country, and the value comes out in E.164. Typing "+" in the number jumps into the picker with a calling code search.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` | — | — |
| `hideLabel` | `boolean` | `false` | — |
| `value` | `string` | — | The number in E.164, such as "+14155550132". An empty string clears the field. |
| `defaultValue` | `string` | — | — |
| `onValueChange` | `(value: string, details: PhoneInputDetails) => void` | — | Fires on every edit with the E.164 number (empty when there are no digits) and its parsed details. |
| `country` | `string` | — | ISO code of the selected country. |
| `defaultCountry` | `string` | `"US"` | ISO code used until someone picks a country or enters an international number. |
| `onCountryChange` | `(iso: string) => void` | — | — |
| `countries` | `string[]` | — | Limit the picker to these ISO codes. |
| `preferredCountries` | `string[]` | `["US", "CA", "GB"]` | Pinned at the top of the picker under "Suggested". |
| `description` | `string` | — | — |
| `error` | `string` | — | Replaces the built-in validation message. |
| `validate` | `boolean` | `true` | Show a message after blur when the number is incomplete. On by default. |
| `disabled` | `boolean` | `false` | — |
| `required` | `boolean` | — | — |
| `name` | `string` | — | Adds a hidden input carrying the E.164 value for native form submission. |
| `id` | `string` | — | — |
| `className` | `string` | — | — |
| `onBlur` | `(event: ReactFocusEvent<HTMLInputElement>) => void` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `PhoneStatus` | `"empty" \| "incomplete" \| "valid" \| "too-long"` |

#### `PhoneCountry`

| Field | Type | Description |
| --- | --- | --- |
| `iso` (required) | `string` | ISO 3166-1 alpha-2 code, such as "US". |
| `name` (required) | `string` | — |
| `dial` (required) | `string` | Country calling code without the plus, such as "44". |
| `patterns` (required) | `string[]` | National formats from shortest to longest. `#` is a digit, anything else is a separator. |
| `trunk` (required) | `string` | A national number people may type before the number itself, such as "0" in "07911 123456". |
| `example` (required) | `string` | A realistic national number, used for the placeholder and the typing guide. |
| `areaCodes` | `string[]` | Area codes that pick this country when several share a calling code, such as Canada inside +1. |

#### `PhoneInputDetails`

| Field | Type | Description |
| --- | --- | --- |
| `country` (required) | `PhoneCountry` | — |
| `formatted` (required) | `string` | The number as shown in the field, without the calling code. |
| `status` (required) | `"empty" \| "incomplete" \| "valid" \| "too-long"` | — |
| `valid` (required) | `boolean` | — |

### Other exports

- `PHONE_COUNTRIES` (value)
- `flagOf` (function)
- `formatNational` (function)
- `parsePhoneNumber` (function)
- `formatPhoneNumber` (function)

## Keyboard

| Keys | Action |
| --- | --- |
| `+` | In the number field, opens the country list already searching by dialing code. |
| `↓` or `↑` | On the country button, open the list; inside it, move the highlight while focus stays on the search. |
| `Page Up` or `Page Down` | Jump eight countries at a time in the list. |
| `Home` or `End` | Go to the first or last country, when the search is empty. |
| `Enter` | Selects the highlighted country and returns focus to the number, with the cursor at the end. |
| `Esc` | Closes the list without changing the country and returns focus to the country button. |

## Accessibility

- The country button announces country and code (“Country, Brazil +55”), and the search is a `combobox` with `aria-activedescendant`, so focus stays on the search field while the highlight moves through the list.
- A `role="status"` region announces the country change on paste, the number of search results, and “Valid … number” when the number is complete, and the error message has `role="alert"`.
- With `hideLabel`, the label disappears from the screen but remains the field name for screen readers.

## Motion

- The country button and the list are a single surface: width, height, and corners grow on a no-overshoot spring on open and shrink on close.
- When the country changes, flag and code roll in the direction of the list (a country further down enters from below), and the highlight slides between rows on its own spring.
- With “reduce motion” on, the surface resizes instantly and flag, messages, and the valid indicator only fade.

## Responsive behavior

- The list opens at the field width, up to 340px, and scrolls inside with a maximum height of 280px, without dragging the page.
- The number uses `type="tel"`, `inputMode="tel"`, and `autoComplete="tel"`, so phones show the phone keyboard and autofill works.

## Performance

- The country table ships inside the component, without downloading metadata or depending on a library, and each field keeps a `ResizeObserver` to measure the surface.

## Notes for AI

- The value goes in and out as E.164; `onValueChange(valor, details)` also brings country, formatted text, `status`, and `valid`, and with `name` a hidden field submits the E.164 in the form.
- The default country is `US`: in Brazil pass `defaultCountry="BR"`; `countries` limits the list and `preferredCountries` pins countries at the top, under “Suggested”.
- Country names, search, and messages are in English and there is no translation prop; `error` replaces the validation message, which appears after leaving the field.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/phone-input · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
