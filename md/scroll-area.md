# Scroll area

> Área de rolagem nativa com barras finas e esmaecimento só quando há overflow.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/scroll-area
- Original description: A native scroll container with thin overlay scrollbars and edge fades that appear only when content overflows.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-area.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-area.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-area.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/scroll-area.json`. Registry path, relative to the site address: `r/scroll-area.json`.

- npm packages: none besides React
- Files, once installed:
  - `components/ryan-ui/scroll-area/scroll-area.tsx`
  - `components/ryan-ui/scroll-area/scroll-area.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: there are no packages to install.
2. Copy the files listed above. The content of each one is in `r/scroll-area.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Height-limited lists inside cards, menus, or panels, with `maxHeight`, where thick native bars would be heavy.
- Horizontal strips of chips or filters (`orientation="horizontal"`), where the vertical mouse wheel scrolls sideways while there is room.
- Strips with native snapping via `snap`, without replacing system scrolling with a simulated one.

## When not to use

- Use [`message-scroller`](message-scroller.md) for conversations that need to follow new messages.
- Use [`carousel`](carousel.md) when the strip needs arrows, indicators, and an active slide.
- For scrolling the whole page, let the browser scroll; the area is meant for inner regions.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import ScrollArea from "@/components/ryan-ui/scroll-area/scroll-area";
import { Caption, Stack } from "./_kit";

const changes = ["Added dark mode to the settings page", "Fixed a crash when exporting empty reports", "Faster search across large workspaces", "New keyboard shortcuts for navigation", "Improved accessibility of dialogs", "Billing page now shows annual savings", "Reduced bundle size by 18 percent", "Support for CSV import with custom headers", "Notifications can be snoozed for a day", "Updated onboarding checklist"];
const tags = ["Design", "Engineering", "Marketing", "Sales", "Support", "Finance", "Operations", "Research", "Legal", "People"];

export default function ScrollAreaDemo() {
  return (
    <Stack gap={5} width={440}>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-panel)", background: "var(--surface)" }}>
        <ScrollArea label="Release notes" maxHeight={200}>
          <ul style={{ margin: 0, padding: "var(--space-3) var(--space-4)", listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            {changes.map(c => <li key={c}>{c}</li>)}
          </ul>
        </ScrollArea>
      </div>
      <ScrollArea orientation="horizontal" label="Teams">
        <div style={{ display: "flex", gap: "var(--space-2)", padding: "var(--space-2)" }}>
          {tags.map(t => <span key={t} style={{ flex: "none", padding: "var(--space-1) var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>{t}</span>)}
        </div>
      </ScrollArea>
      <Caption>Fades and thin scrollbars appear only where content overflows.</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `ScrollArea`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | — |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Axes that scroll. Defaults to vertical. |
| `fade` | `number` | `28` | Length of the edge fade in px. 0 turns the fades off. |
| `scrollbars` | `"auto" \| "always"` | `"auto"` | "auto" shows scrollbars while scrolling or hovering; "always" keeps them visible when content overflows. |
| `hideDelay` | `number` | `900` | How long scrollbars linger after scrolling stops, in ms. |
| `maxHeight` | `CSSProperties["maxHeight"]` | — | Maximum height of the viewport, for vertical areas that should grow with their content. |
| `snap` | `CSSProperties["scrollSnapType"]` | — | Passed to the viewport's `scroll-snap-type`, for example "x mandatory". Children set their own `scroll-snap-align`. |
| `label` | `string` | — | Accessible name. The viewport becomes a labelled, focusable region that arrow and page keys scroll. |
| `wheelToHorizontal` | `boolean` | `true` | Turns vertical wheel movement into horizontal scrolling for horizontal areas. Defaults to true. |
| `viewportClassName` | `string` | — | — |
| `viewportStyle` | `CSSProperties` | — | — |
| `viewportRef` | `Ref<HTMLDivElement>` | — | — |
| `onScroll` | `(event: UIEvent<HTMLDivElement>) => void` | — | — |
| `onEdgeChange` | `(edges: ScrollAreaEdges) => void` | — | Called when content starts or stops extending past an edge. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Also accepts the props of this type, except `onScroll`. |

### Exported types

#### `ScrollAreaEdges`

Which edges still have content beyond them.

| Field | Type | Description |
| --- | --- | --- |
| `top` (required) | `boolean` | — |
| `bottom` (required) | `boolean` | — |
| `left` (required) | `boolean` | — |
| `right` (required) | `boolean` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` or `←` or `→` | Scroll the content on the axes that scroll, when the area is focused; the scrolling is the browser's native one. |
| `Page Up` or `Page Down` | Scroll one page at a time. |

## Accessibility

- The scroll viewport always enters the Tab order; with `label`, it becomes a named `region`, so always pass a `label` so it is not an unnamed focus stop.
- The drawn bars are hidden from the screen reader; scrolling stays native, so keyboard, touch, and assistive technologies work as on the platform.

## Motion

- The bars appear on scroll or pointer hover and fade out after `hideDelay` (900 ms); the thumb thickens under the cursor.
- Each edge fades only when there is content beyond it, growing over the first pixels of scroll up to `fade` px (default 28; 0 turns it off).
- Clicking the track scrolls 90% of the visible area with a smooth animation, which becomes a jump with “reduce motion” on; the bar transitions are also turned off.

## Responsive behavior

- On touch screens, without a hovering pointer, the bars only appear during scrolling; `scrollbars="always"` keeps them visible when there is overflow.
- The area only scrolls with a limited height: pass `maxHeight` or give the parent a height.

## Performance

- Scrolling does not re-render React: bars and fades are written straight to the DOM, and a `ResizeObserver` together with a `MutationObserver` tracks changes in the content.

## Notes for AI

- Import `ScrollArea` from `@/components/ryan-ui/scroll-area/scroll-area`; `orientation` accepts `vertical` (default), `horizontal`, and `both`.
- Use `onEdgeChange` to know when the end has been reached, for example to load more, and `viewportRef` to scroll from code.
- With `snap`, set `scroll-snap-align` on the children; the component only forwards the value to the viewport's `scroll-snap-type`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/scroll-area · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
