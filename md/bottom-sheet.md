# Bottom sheet

> Painel inferior que repousa em alturas definidas e acompanha o dedo ao arrastar.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/bottom-sheet
- Original description: A sheet that rests at a peek or full height and follows your finger.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bottom-sheet.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bottom-sheet.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bottom-sheet.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bottom-sheet.json`. Registry path, relative to the site address: `r/bottom-sheet.json`.

- npm packages: `@radix-ui/react-dialog`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/bottom-sheet/bottom-sheet.tsx`
  - `components/ryan-ui/bottom-sheet/bottom-sheet.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-dialog lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/bottom-sheet.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Secondary tasks on mobile where a preview helps before the full view: order summary, sharing options, filters, trip details.
- Content that people drag between half height and almost full screen, with rest heights such as `detents={[0.4, 0.85]}`.
- Flows that need to know where the sheet stopped, through the index that `onDetentChange` reports.

## When not to use

- Use [`dialog`](dialog.md) when the decision needs to interrupt the person in the center of the screen.
- Use [`drawer`](drawer.md) for side panels on wide screens; this sheet is at most 36rem wide and is centered on the bottom edge.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import BottomSheet, { BottomSheetClose } from "@/components/ryan-ui/bottom-sheet/bottom-sheet";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Stack, demoStage, useQuietFirstOpen } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

const lines = [
  ["Subtotal", "$128.00"], ["Shipping", "$6.50"], ["Tax", "$10.24"], ["Total", "$144.74"],
];

export default function BottomSheetDemo() {
  // On the docs page the sheet rises inside the preview, already at its peek height; its detents are fractions of the preview.
  const [container] = useState(demoStage);
  const quiet = useQuietFirstOpen();
  const [detent, setDetent] = useState(0);
  return (
    <Stack align="center" gap={4} style={{ alignSelf: "flex-start", marginTop: container ? "var(--space-10)" : undefined }}>
      <BottomSheet
        trigger={<Button variant="secondary">Review order</Button>}
        title="Order summary"
        description="Two items, shipping to Portland, OR."
        detents={container ? [0.6, 0.92] : [0.4, 0.85]}
        onDetentChange={setDetent}
        defaultOpen={container !== null}
        container={container}
        onOpenAutoFocus={quiet}
      >
        <Stack gap={3}>
          {lines.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", color: k === "Total" ? "var(--foreground)" : "var(--text-secondary)", fontWeight: k === "Total" ? 500 : undefined, fontSize: "var(--text-sm)" }}><span>{k}</span><span>{v}</span></div>
          ))}
          <Caption>Drag the sheet up for the full list, or down to dismiss.</Caption>
          <BottomSheetClose asChild><Button>Place order</Button></BottomSheetClose>
        </Stack>
      </BottomSheet>
      <Caption>Last resting height: {detent === 0 ? "peek" : "full"}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BottomSheet`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | The control that opens the sheet, usually a button. Focus returns to it when the sheet closes. |
| `open` | `boolean` | — | — |
| `defaultOpen` | `boolean` | `false` | — |
| `onOpenChange` | `(open: boolean) => void` | — | — |
| `title` (required) | `string` | — | — |
| `description` | `string` | — | — |
| `detents` | `number[]` | — | Resting heights as fractions of the viewport height. The sheet opens at `initialDetent` and never grows past the largest. |
| `initialDetent` | `number` | — | Index into the sorted detents the sheet opens at. Defaults to the smallest. |
| `onDetentChange` | `(index: number) => void` | — | — |
| `closeLabel` | `string` | — | — |
| `className` | `string` | — | — |
| `children` (required) | `ReactNode` | — | — |
| `container` | `HTMLElement \| null` | — | Renders the sheet inside this element instead of the page body: it rises from the element's bottom edge, the detents become fractions of the element's height and the dim covers only the element. The element needs position: relative and overflow: hidden. The page around it stays usable while the sheet is open: nothing is scroll-locked or hidden from assistive technology. |
| `onOpenAutoFocus` | `(event: Event) => void` | — | Runs when the sheet opens, before it moves focus to itself. Call `event.preventDefault()` to leave focus where it is. |

### Other exports

- `BottomSheetClose` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `Page Down` or `Space` | With focus on the sheet, open to the greatest height; when already open, scroll the content. |
| `↑` or `Page Up` or `Shift + Space` | With focus on the sheet, scroll the content up. |
| `↑` or `↓` | On the handle, go up or down one rest height; going down it stops at the smallest, without closing. |
| `Home` or `End` | On the handle, go to the greatest or smallest height. |
| `Enter` or `Space` | On the handle, toggle between the smallest and greatest height. |
| `Esc` | Closes the sheet and returns focus to the `trigger`; while it is open, focus stays trapped in it. |

## Accessibility

- It is a Radix modal dialog: `title` becomes the accessible name, `description` the description, and the rest of the page leaves the accessibility tree while the sheet is open.
- On open, focus goes to the sheet itself; the handle is a button with `aria-expanded` and the label “Expand sheet” or “Collapse sheet”.
- Each height change is announced in a polite `aria-live` region (“Sheet expanded”, “Sheet collapsed”); these texts are fixed in English, and only the close button accepts its own label (`closeLabel`).

## Motion

- The sheet follows the finger 1:1 downward and resists like elastic above the greatest height; on release, velocity projects the destination and a fast gesture always advances at least one height.
- A fast downward gesture from the smallest height closes the sheet keeping its velocity; the backdrop darkening follows the position instead of a fixed time.
- With “reduce motion” on, the sheet goes straight to each height and only fades on enter and exit; content scrolling is no longer smooth.

## Responsive behavior

- The width is `min(100%, 36rem)` and the heights are fractions of `100dvh`; the bottom spacing respects the device safe area (`safe-area-inset-bottom`).
- The content only scrolls at the greatest height; below it, dragging, spinning the wheel, or tabbing to an off-screen field opens the sheet first, and an observer repositions it when the window height changes.

## Notes for AI

- `title` is required and `detents` are fractions of the window height (default `[0.45, 0.92]`), sorted by the component; `initialDetent` is the index in that sorted list.
- Pass the button in `trigger` so focus returns to it on close; to close from inside, wrap the action in `BottomSheetClose asChild`.
- On touch, dragging vertically over the content moves the sheet until it is fully open; only then does the content scroll. Import from `@/components/ryan-ui/bottom-sheet/bottom-sheet`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/bottom-sheet · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
