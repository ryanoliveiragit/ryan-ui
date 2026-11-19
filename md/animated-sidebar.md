# Animated sidebar

> Barra lateral com grupos aninhados que abrem com animação de altura, destaque que desliza e modo recolhido com dicas.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/animated-sidebar
- Original description: A sidebar with nested groups that open on a height spring, one highlight that glides under the pointer, and a collapsed icon rail with tooltips.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-sidebar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-sidebar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-sidebar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/animated-sidebar.json`. Registry path, relative to the site address: `r/animated-sidebar.json`.

- npm packages: `motion`, `lucide-react`, `@radix-ui/react-tooltip`
- Uses other ryan-ui items (installed along with it): [Hover highlight](hover-highlight.md)
- Files, once installed:
  - `components/ryan-ui/animated-sidebar/animated-sidebar.tsx`
  - `components/ryan-ui/animated-sidebar/animated-sidebar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react @radix-ui/react-tooltip`.
2. Copy the files listed above. The content of each one is in `r/animated-sidebar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- App navigation with sections and subpages, such as Projects with Assets, Drafts, and Archived, where the group opens in place.
- Admin panels that need to collapse the navigation into a 64 px icon rail, with each icon's name in a tooltip.
- Navigation with counters on rows (`badge`) and destinations that are real links (`href`).

## When not to use

- Use [`bounce-sidebar`](bounce-sidebar.md) when the destinations are a flat list, without nested groups.
- Use [`tree-view`](tree-view.md) or [`file-tree`](file-tree.md) for multi-level content hierarchies; here groups have a single level and children of a child are not drawn.
- Use [`site-header`](site-header.md) for the main navigation of a public site, at the top of the page.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { ChartColumn, CreditCard, FolderKanban, Inbox, LayoutDashboard, Settings, Users } from "lucide-react";
import { AnimatedSidebar } from "@/components/ryan-ui/animated-sidebar/animated-sidebar";
import type { AnimatedSidebarSection } from "@/components/ryan-ui/animated-sidebar/animated-sidebar";
import type { DemoStage } from "./_kit";
import styles from "./animated-sidebar.module.css";

export const stage: DemoStage = { layout: "fill", height: 540 };

const icon = { size: 18, strokeWidth: 1.75 };
const sections: AnimatedSidebarSection[] = [
  { id: "main", items: [
    { id: "overview", label: "Overview", icon: <LayoutDashboard {...icon} /> },
    { id: "inbox", label: "Inbox", icon: <Inbox {...icon} />, badge: 12 },
  ] },
  { id: "workspace", title: "Workspace", items: [
    { id: "projects", label: "Projects", icon: <FolderKanban {...icon} />, children: [
      { id: "projects-active", label: "Active", badge: 8 },
      { id: "projects-drafts", label: "Drafts" },
      { id: "projects-archived", label: "Archived" },
    ] },
    { id: "customers", label: "Customers", icon: <Users {...icon} />, children: [
      { id: "customers-accounts", label: "Accounts" },
      { id: "customers-segments", label: "Segments" },
      { id: "customers-imports", label: "Imports" },
    ] },
    { id: "analytics", label: "Analytics", icon: <ChartColumn {...icon} />, children: [
      { id: "analytics-traffic", label: "Traffic" },
      { id: "analytics-revenue", label: "Revenue" },
      { id: "analytics-retention", label: "Retention" },
    ] },
  ] },
  { id: "account", title: "Account", items: [
    { id: "billing", label: "Billing", icon: <CreditCard {...icon} /> },
    { id: "settings", label: "Settings", icon: <Settings {...icon} />, children: [
      { id: "settings-profile", label: "Profile" },
      { id: "settings-members", label: "Members" },
      { id: "settings-keys", label: "API keys" },
    ] },
  ] },
];

const notes: Record<string, string> = {
  overview: "Revenue is up 8% on last week and two projects ship on Friday.",
  inbox: "Twelve unread conversations, three of them waiting on you.",
  "projects-active": "Eight projects in progress. Mobile checkout is the closest to launch.",
  "projects-drafts": "Drafts stay private until you invite someone.",
  "projects-archived": "Archived projects are read-only and can be restored at any time.",
  "customers-accounts": "214 accounts, sorted by last activity.",
  "customers-segments": "Segments update as customers match or stop matching their rules.",
  "customers-imports": "Bring customers in from a CSV file or a connected CRM.",
  "analytics-traffic": "Visits by source for the last thirty days.",
  "analytics-revenue": "Recurring revenue, expansions and refunds by month.",
  "analytics-retention": "How many customers from each signup month are still active.",
  billing: "Team plan, 16 seats. The next invoice is due on December 1.",
  "settings-profile": "Your name, photo and notification preferences.",
  "settings-members": "Invite people and decide what each role can do.",
  "settings-keys": "Create and revoke keys for the public API.",
};

/** The trail of labels that leads to a leaf row. */
function trail(id: string) {
  for (const section of sections) for (const item of section.items) {
    if (item.id === id) return [item.label];
    const child = item.children?.find(entry => entry.id === id);
    if (child) return [item.label, child.label];
  }
  return [];
}

export default function AnimatedSidebarDemo() {
  const [active, setActive] = useState("projects-active");
  // A phone starts on the rail, so the page keeps most of the width.
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 560);
  const path = trail(active);
  return (
    <div className={styles.frame}>
      <AnimatedSidebar sections={sections} value={active} onValueChange={setActive} collapsed={collapsed} onCollapsedChange={setCollapsed} logo="A" title="Atlas" label="Workspace" />
      <section className={styles.page} aria-live="polite">
        <p className={styles.crumbs}>{path.join(" / ")}</p>
        <h2 className={styles.heading}>{path.at(-1)}</h2>
        <p className={styles.lead}>{notes[active]}</p>
      </section>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AnimatedSidebar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sections` (required) | `AnimatedSidebarSection[]` | — | Sections of rows, top to bottom. |
| `value` | `string` | — | Id of the active leaf row (controlled). |
| `defaultValue` | `string` | — | Active row when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the id of the pressed leaf row. |
| `openIds` | `string[]` | — | Ids of the open groups (controlled). |
| `defaultOpenIds` | `string[]` | — | Open groups when uncontrolled. Defaults to the group that holds the active row. |
| `onOpenIdsChange` | `(openIds: string[]) => void` | — | Called with the next list of open group ids. |
| `collapsed` | `boolean` | — | Whether the sidebar is the icon rail (controlled). |
| `defaultCollapsed` | `boolean` | `false` | Starting state when uncontrolled. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | Called when the collapse button is pressed, or when a group is opened from the rail. |
| `logo` | `ReactNode` | — | Brand mark shown in the header. |
| `title` | `string` | — | Product or workspace name shown beside the brand mark. |
| `width` | `number` | `264` | Panel width in pixels. |
| `collapsedWidth` | `number` | `64` | Rail width in pixels. |
| `label` | `string` | `"Sidebar"` | Accessible name of the navigation landmark. |
| `className` | `string` | — | Extra class for the sidebar. |

### Exported types

#### `AnimatedSidebarItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id across the whole sidebar. Leaf ids are the sidebar's value. |
| `label` (required) | `string` | Row text. In the collapsed rail it moves to a tooltip. |
| `icon` | `ReactNode` | Icon for a top-level row, about 18 px. Nested rows do not show one. |
| `badge` | `string \| number` | A count or short word at the end of the row. |
| `href` | `string` | Renders the row as a link. |
| `disabled` | `boolean` | Keeps the row visible but not pressable. |
| `children` | `AnimatedSidebarItem[]` | Nested rows. A row with children opens and closes its group instead of navigating. |

#### `AnimatedSidebarSection`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id of the section. |
| `title` | `string` | Small heading above the rows. In the rail it becomes a divider. |
| `items` (required) | `AnimatedSidebarItem[]` | The rows of the section. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | Moves focus to the next or previous row, including those of open groups, wrapping to the first after the last. |
| `Home` or `End` | Moves focus to the first or last row. |
| `→` | On a closed group row, opens the group; on the rail, opens the panel and the group together. |
| `←` | On an open group row, closes the group; on a nested row, moves focus to the group row. |
| `Enter` or `Space` | Activates the row or opens and closes the group; rows with `href` are links and respond to `Enter`. |

## Accessibility

- It is a `<nav>` with `aria-label` coming from `label` (default “Sidebar”); each section is a `group` named by its title, and the visual title is hidden from the screen reader.
- Group rows are buttons with `aria-expanded` and `aria-controls`; the active leaf gets `aria-current="page"`, and disabled rows use `disabled` or, on links, `aria-disabled` without `href`.
- On the rail, the label stays in the DOM with zero opacity and a Radix tooltip appears on hover or focus; the button names “Expand sidebar” and “Collapse sidebar” are fixed in English.

## Motion

- The width toggles between `width` and `collapsedWidth` on a no-overshoot spring; the icons stay still in a 40 px cell while the panel narrows around them.
- A group opens with a height spring and its rows arrive one after another, sliding 8 px from the left; a single highlight slides under the cursor or keyboard focus.
- With “reduce motion” on, width, groups, and highlight change instantly and the CSS transitions are turned off.

## Responsive behavior

- The bar takes `height: 100%` and scrolls inside when the rows do not fit; the parent needs a defined height.
- It does not collapse on its own on narrow screens: decide `collapsed` from the window width, as the demo does below 560 px.

## Notes for AI

- It needs the `hover-highlight` item installed; import `AnimatedSidebar` from `@/components/ryan-ui/animated-sidebar/animated-sidebar`.
- The `id`s must be unique across the whole bar and `value` is always the `id` of a leaf: a row with `children` only opens the group, never navigates.
- When controlling `collapsed`, also handle `onCollapsedChange` when a group is opened from the rail: the component asks to expand the panel before showing the children.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/animated-sidebar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
