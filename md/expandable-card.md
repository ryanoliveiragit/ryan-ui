# Expandable card

> Dá mais espaço a um cartão denso quando a pessoa pede.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-card
- Original description: Give a dense card more room when requested.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-card.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-card.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-card.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/expandable-card.json`. Registry path, relative to the site address: `r/expandable-card.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/expandable-card/expandable-card.tsx`
  - `components/ryan-ui/expandable-card/expandable-card.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/expandable-card.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Event or meeting cards that show a title and time and reveal agenda and attendees on request.
- Dense summaries in a dashboard that can also grow sideways when opened, with `width` and `expandedWidth`.
- Cards whose supporting line changes over time: only the new words of `description` animate.

## When not to use

- Use [`collapsible`](collapsible.md) when the open state needs to be controlled from outside; this card only accepts `defaultExpanded`.
- Use [`center-morph-modal`](center-morph-modal.md) when the details are long and deserve a focused window.
- Use [`accordion`](accordion.md) for a list of sections where only one is open at a time.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ExpandableCard from "@/components/ryan-ui/expandable-card/expandable-card";
import { Caption, Stack } from "./_kit";

export default function ExpandableCardDemo() {
  return (
    <Stack gap={4} width={460} align="center">
      <ExpandableCard title="Q3 roadmap review" description="Thursday, 2:00 PM, Room 4B" width={360} expandedWidth={460}>
        <Stack gap={3}>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}>We will walk through shipped work, the revised launch date for the mobile app, and staffing for the payments migration.</p>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}>Attendees: Emma Collins, Marcus Johnson, Jasmine Brooks, Olivia Bennett.</p>
        </Stack>
      </ExpandableCard>
      <Caption>Open the card to see it grow in height and width.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ExpandableCard`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `children` (required) | `ReactNode` | — | — |
| `defaultExpanded` | `boolean` | `false` | — |
| `width` | `number` | — | Collapsed width cap in px. The card is centered and never wider than its container. Fills the container when omitted. |
| `expandedWidth` | `number` | — | Expanded width cap in px, so the card can grow sideways into more room. Defaults to `width`. |
| `...props` | `ComponentPropsWithoutRef<"article">` | — | Also accepts the props of this type, except `title`, `children`, `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`, `onDrag`, `onDragStart`, `onDragEnd`, `onDragOver`, `onDragLeave`, `onDragEnter`, `onDragExit` and `onDrop`. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | On the header, opens or closes the card. |
| `Esc` | With the card open and focus inside it, closes it and returns focus to the header. |

## Accessibility

- The header is a `<button>` with `aria-expanded` and `aria-controls`; when closed, the panel is `inert`, out of focus and out of the screen reader.
- The animated `description` has a hidden copy for the screen reader, which reads the whole sentence instead of loose words.

## Motion

- Width and height grow on the same no-overshoot spring, with real size instead of scale, so text, border, and corners do not stretch.
- On close, the details fade first and the box shrinks 60 ms later; on open, they appear once the box has made room, and the arrow rotates 180°.
- With “reduce motion” on, the card opens and closes instantly.

## Responsive behavior

- An observer measures the available width: the card stays centered, never exceeds the container, and `width` and `expandedWidth` work only as limits.

## Notes for AI

- There is no `expanded` or `onExpandedChange`: the state is internal and starts from `defaultExpanded`.
- Without `width`, the card fills the container; for it to grow sideways on open, pass both limits, such as `width={360}` and `expandedWidth={460}`.
- `title` and `description` are text; the details go in `children`. Import from `@/components/ryan-ui/expandable-card/expandable-card`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/expandable-card · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
