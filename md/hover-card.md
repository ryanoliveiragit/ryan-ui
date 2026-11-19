# Hover card

> Pré-visualiza uma pessoa ou link ao passar o mouse ou focar, sem sair da página.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/hover-card
- Original description: Preview a person or link on hover or focus without leaving the page.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/hover-card.json`. Registry path, relative to the site address: `r/hover-card.json`.

- npm packages: `@radix-ui/react-popover`, `motion`
- Files, once installed:
  - `components/ryan-ui/hover-card/hover-card.tsx`
  - `components/ryan-ui/hover-card/hover-card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-popover motion`.
2. Copy the files listed above. The content of each one is in `r/hover-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mentions of people in a text, such as authors and reviewers, with `HoverCardProfile` showing photo, role, bio, and numbers.
- Avatars or names in a list where the click should stay free to open the profile.
- Previews of links or references that help decide before leaving the page.

## When not to use

- Use [`tooltip`](tooltip.md) for a short text that names or explains a control.
- Use [`popover`](popover.md) when the content has buttons, links, or fields: the card does not receive focus, so nothing inside it is reachable by keyboard.
- Use [`citations`](citations.md) for numbered sources inside an AI response.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import HoverCard, { HoverCardProfile } from "@/components/ryan-ui/hover-card/hover-card";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Room, demoStage } from "./_kit";

const link: React.CSSProperties = { font: "inherit", color: "var(--text-primary)", fontWeight: 600, background: "none", border: 0, padding: 0, cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3 };

export default function HoverCardDemo() {
  // Emma's card is already open, inside the stage, so the preview shows what hovering a name does.
  const stage = demoStage();
  return (
    <Room below={150} width={460}>
      <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        The new onboarding flow was designed by{" "}
        <HoverCard defaultOpen container={stage} content={<HoverCardProfile name="Emma Collins" role="Product designer, Growth" avatar={avatar("emma-collins")} bio="Designs onboarding and activation. Previously at a fintech start-up." stats={[{ label: "Projects", value: 24 }, { label: "Reviews", value: 138 }]} meta="Lisbon, 4:12 PM" />}>
          <button type="button" style={link}>Emma Collins</button>
        </HoverCard>{" "}
        and built with{" "}
        <HoverCard container={stage} content={<HoverCardProfile name="Marcus Johnson" role="Frontend engineer, Platform" avatar={avatar("marcus-johnson")} bio="Maintains the component library and the build pipeline." stats={[{ label: "Commits", value: "1.2k" }, { label: "Reviews", value: 412 }]} meta="Austin, 10:12 AM" />}>
          <button type="button" style={link}>Marcus Johnson</button>
        </HoverCard>
        . Hover or focus a name to preview the profile.
      </p>
    </Room>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `HoverCard`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` (required) | `ReactElement` | — | The trigger, such as a mention button or a link. It must accept a ref and be focusable. |
| `content` (required) | `ReactNode` | — | The preview. `HoverCardProfile` covers people; any read only content works. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | — |
| `openDelay` | `number` | `OPEN_DELAY` | Milliseconds of hover before the first card opens. |
| `closeDelay` | `number` | `CLOSE_DELAY` | Milliseconds of grace after the pointer leaves, so it can travel into the card. |
| `container` | `HTMLElement \| null` | — | Render the card inside this element and limit collisions to it (used by the demo stages). |
| `defaultOpen` | `boolean` | `false` | Starts with the card open, for previews. It then behaves as usual: leaving the trigger and card, Escape, or a press elsewhere closes it. |
| `className` | `string` | — | — |

### `HoverCardProfile`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` | — | — |
| `role` | `string` | — | Role and team, such as "Product designer, Payments". |
| `avatar` | `string \| ReactNode` | — | A portrait URL, or your own image element such as next/image. Initials show when it is missing. |
| `bio` | `string` | — | — |
| `stats` | `HoverCardStat[]` | `[]` | — |
| `meta` | `ReactNode` | — | A footer line, such as a location and local time. |

### Exported types

#### `HoverCardStat`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `value` (required) | `string \| number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | When the trigger is focused by keyboard, the card opens right away; when leaving the trigger, it closes. |
| `Esc` | Closes the card; it only reopens after focus or the pointer leaves the trigger and comes back. |

## Accessibility

- The card has `role="tooltip"` and, when open, the trigger gets `aria-describedby` pointing to it: the screen reader reads the content as the trigger's description.
- Focus never enters the card; keep the content read-only and leave any action on the trigger itself.
- On touch, a tap on the trigger opens and closes the card; the profile photo has an empty `alt`, because the name is already in the text.

## Motion

- The first card waits `openDelay` (500 ms); with another one open recently, the next opens in 80 ms and only fades.
- The card grows from the trigger edge: it starts at 96% and 4 px toward the trigger on a no-overshoot spring, and returns from wherever it is if the pointer comes back during the exit.
- With “reduce motion” on, the card only fades, the profile rows do not enter in sequence, and the photo does not come out of a blur.

## Responsive behavior

- The width is 18.5rem, shrinking to the available width, and the card switches sides when it does not fit, with 12 px of clearance from the edge.

## Notes for AI

- The child is the trigger and must accept `ref` and receive focus, like a `<button>` or a link; the preview goes in `content`.
- Only one card is open at a time across the whole page; there is no need to coordinate the instances.
- `HoverCardProfile` accepts `avatar` as a URL or as an element (for example `next/image`) and shows initials without a photo. Import from `@/components/ryan-ui/hover-card/hover-card`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/hover-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
