# Tabs

> Alterna entre conteúdos relacionados no mesmo contexto.

- Type: component (category Disclosure)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/tabs
- Original description: Switch between related content in the same context.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tabs.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tabs.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tabs.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/tabs.json`. Registry path, relative to the site address: `r/tabs.json`.

- npm packages: `@radix-ui/react-tabs`, `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/tabs/tabs.tsx`
  - `components/ryan-ui/tabs/tabs.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install @radix-ui/react-tabs lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/tabs.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Related views of the same object, such as Overview, Activity, Members, and Billing of a project.
- Settings sections where people look at one at a time and the rest of the page stays the same.
- Many tabs in a narrow space: the list scrolls sideways, with fading at the edges and scroll buttons.

## When not to use

- Use [`segmented-control`](segmented-control.md) when the switch is a mode or filter without its own content panel.
- Use [`accordion`](accordion.md) when people need to read several sections in sequence, as on a long page on a phone.
- Use [`stepper`](stepper.md) for steps in order that people go through once.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ryan-ui/tabs/tabs";
import { Stack } from "./_kit";

const p: React.CSSProperties = { margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" };

export default function TabsDemo() {
  return (
    <Stack width={480}>
      <Tabs defaultValue="overview">
        <TabsList aria-label="Project sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><p style={{ ...p, paddingTop: "var(--space-4)" }}>Atlas is on track for its March release. 38 of 46 tasks are complete and no blockers are open.</p></TabsContent>
        <TabsContent value="activity"><p style={{ ...p, paddingTop: "var(--space-4)" }}>Marcus merged “Offline sync” an hour ago. Jasmine commented on the checkout designs yesterday.</p><p style={{ ...p, paddingTop: "var(--space-3)" }}>Olivia closed 6 issues this week.</p></TabsContent>
        <TabsContent value="members"><p style={{ ...p, paddingTop: "var(--space-4)" }}>Eight people have access: 5 editors, 2 reviewers and 1 admin.</p></TabsContent>
        <TabsContent value="billing"><p style={{ ...p, paddingTop: "var(--space-4)" }}>Team plan, billed annually. Next invoice of $1,440 on March 3.</p></TabsContent>
      </Tabs>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `Tabs`

Props: `ComponentPropsWithoutRef<typeof TabsPrimitive.Root>`

### `TabsList`

No props of its own: accepts those of the element or primitive it wraps.

### `TabsTrigger`

No props of its own: accepts those of the element or primitive it wraps.

### `TabsContent`

No props of its own: accepts those of the element or primitive it wraps.

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Enters the list at the active tab and, from there, goes to the panel. |
| `←` or `→` | Move focus to the previous or next tab and activate it right away, wrapping to the first after the last. |
| `Home` or `End` | Go to the first or last tab. |
| `Enter` or `Space` | Activate the focused tab. |

## Accessibility

- Built on the Radix Tabs: `tablist`, tabs with `aria-selected` and `aria-controls`, `tabpanel` panels that are focusable and tied to the tab, and a roving `tabindex` for focus.
- Pass `aria-label` to `TabsList` to name the set; the scroll buttons are named “Scroll tabs left” and “Scroll tabs right”, fixed in English in the code.
- The panel that leaves is `inert` while it fades, receiving neither clicks nor focus.

## Motion

- The active tab's highlight slides to the new tab on a no-overshoot spring, always within the same `Tabs`.
- The new panel enters 8 px from the side of the chosen tab, the old one leaves quickly toward the other side, and the height goes from the previous to the new on a no-overshoot spring.
- With “reduce motion” on, the highlight jumps, the panels only fade in place, the height does not animate, and the list scrolling is instant.

## Responsive behavior

- When the tabs do not fit, the list scrolls sideways with fading at the edges and arrow buttons, and the active or focused tab is brought into view.

## Notes for AI

- Pass `defaultValue`, or `value` with `onValueChange`; without them no tab starts selected and no panel appears.
- Inactive panels are unmounted and lose their internal state; with `forceMount` they stay mounted, but also visible, so hide the inactive one through `data-state="inactive"`.
- Assemble `Tabs`, `TabsList` with one `TabsTrigger` per tab, and a `TabsContent` with the same `value` as each tab. Import from `@/components/ryan-ui/tabs/tabs`.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/tabs · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
