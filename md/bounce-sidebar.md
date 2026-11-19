# Bounce sidebar

> Barra lateral que alterna entre trilho de ícones e painel completo com uma mola elástica; o marcador ativo desliza.

- Type: component (category Disclosure), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/bounce-sidebar
- Original description: An app sidebar that switches between an icon rail and a full panel on a slightly bouncy width spring, with staggered labels and a gliding active marker.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bounce-sidebar.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bounce-sidebar.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bounce-sidebar.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/bounce-sidebar.json`. Registry path, relative to the site address: `r/bounce-sidebar.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/bounce-sidebar/bounce-sidebar.tsx`
  - `components/ryan-ui/bounce-sidebar/bounce-sidebar.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/bounce-sidebar.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The main navigation of an app with four to eight flat destinations, where an icon rail frees up width for the content.
- Dashboard shells with fixed destinations at the foot of the bar, such as Settings and Help, passed in `secondaryItems`.
- Counters that need to stay visible on the rail: the `badge` becomes a dot over the icon.

## When not to use

- Use [`animated-sidebar`](animated-sidebar.md) when there are nested groups, destinations with `href`, or a need for a tooltip with each icon's name on the rail.
- Avoid it with many destinations or little height: the bar does not scroll, and the last rows and the collapse button get cut off.
- Use [`site-header`](site-header.md) for the navigation of a public site.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout. The `.module.css` file imported by the demo belongs to the example only.

```tsx
import { useState } from "react";
import { ChartColumn, FolderKanban, Inbox, LayoutDashboard, LifeBuoy, Settings, Users } from "lucide-react";
import { BounceSidebar } from "@/components/ryan-ui/bounce-sidebar/bounce-sidebar";
import type { BounceSidebarItem } from "@/components/ryan-ui/bounce-sidebar/bounce-sidebar";
import type { DemoStage } from "./_kit";
import styles from "./bounce-sidebar.module.css";

export const stage: DemoStage = { layout: "fill", height: 480 };

const icon = { size: 18, strokeWidth: 1.75 };
const main: BounceSidebarItem[] = [
  { id: "home", label: "Home", icon: <LayoutDashboard {...icon} /> },
  { id: "inbox", label: "Inbox", icon: <Inbox {...icon} />, badge: 4 },
  { id: "projects", label: "Projects", icon: <FolderKanban {...icon} /> },
  { id: "reports", label: "Reports", icon: <ChartColumn {...icon} /> },
  { id: "team", label: "Team", icon: <Users {...icon} /> },
];
const secondary: BounceSidebarItem[] = [
  { id: "settings", label: "Settings", icon: <Settings {...icon} /> },
  { id: "help", label: "Help center", icon: <LifeBuoy {...icon} /> },
];
const pages: Record<string, { lead: string; rows: [string, string][] }> = {
  home: { lead: "Three things need you today, and the Q3 report is ready for review.", rows: [["Approve the Lisbon launch budget", "Due today"], ["Review Q3 revenue report", "Ready"], ["Reply to Hannah about onboarding", "2 days ago"]] },
  inbox: { lead: "Four unread conversations, newest first.", rows: [["Marcus: staging is green again", "9:42"], ["Sofia: vendor contract attached", "9:10"], ["Chloe: dashboard numbers look off", "Yesterday"]] },
  projects: { lead: "Active projects across the workspace.", rows: [["Mobile checkout redesign", "68%"], ["Billing migration", "41%"], ["Partner portal", "12%"]] },
  reports: { lead: "Saved reports refresh every morning at six.", rows: [["Weekly revenue", "Updated 6:00"], ["Churn by plan", "Updated 6:00"], ["Support response time", "Updated 6:01"]] },
  team: { lead: "Sixteen people in four time zones.", rows: [["Emma Collins", "Product designer"], ["Daniel Kim", "Backend engineer"], ["Jasmine Brooks", "Design lead"]] },
  settings: { lead: "Workspace preferences apply to every member.", rows: [["Workspace name", "Northwind"], ["Default time zone", "Lisbon"], ["Two-step sign-in", "Required"]] },
  help: { lead: "Guides and a direct line to support.", rows: [["Getting started in ten minutes", "Guide"], ["Importing from a spreadsheet", "Guide"], ["Talk to a person", "Chat"]] },
};

export default function BounceSidebarDemo() {
  const [active, setActive] = useState("inbox");
  // A phone starts on the rail, so the page keeps most of the width.
  const [expanded, setExpanded] = useState(() => typeof window === "undefined" || window.innerWidth >= 560);
  const all = [...main, ...secondary];
  const page = pages[active];
  return (
    <div className={styles.frame}>
      <BounceSidebar items={main} secondaryItems={secondary} value={active} onValueChange={setActive} expanded={expanded} onExpandedChange={setExpanded} logo="N" title="Northwind" label="Workspace" />
      <section className={styles.page} aria-live="polite">
        <h2 className={styles.heading}>{all.find(item => item.id === active)?.label}</h2>
        <p className={styles.lead}>{page?.lead}</p>
        <ul className={styles.rows}>
          {page?.rows.map(([name, detail]) => <li key={name} className={styles.row}><span>{name}</span><span>{detail}</span></li>)}
        </ul>
      </section>
    </div>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `BounceSidebar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `BounceSidebarItem[]` | — | Main destinations, top to bottom. |
| `secondaryItems` | `BounceSidebarItem[]` | `[]` | Destinations pinned to the bottom, such as settings and help. |
| `value` | `string` | — | Id of the active row (controlled). |
| `defaultValue` | `string` | — | Active row when uncontrolled. Defaults to the first item. |
| `onValueChange` | `(value: string) => void` | — | Called with the id of the pressed row. |
| `expanded` | `boolean` | — | Whether the full panel shows (controlled). False is the icon rail. |
| `defaultExpanded` | `boolean` | `true` | Starting state when uncontrolled. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called when the toggle is pressed. |
| `logo` | `ReactNode` | — | Brand mark for the header tile: a glyph or a letter. |
| `title` | `string` | — | Product or workspace name beside the brand mark. |
| `railWidth` | `number` | `64` | Width of the icon rail in pixels. |
| `panelWidth` | `number` | `232` | Width of the full panel in pixels. |
| `label` | `string` | `"Main"` | Accessible name of the navigation landmark. |
| `className` | `string` | — | Extra class for the sidebar. |

### Exported types

#### `BounceSidebarItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | Unique id, used as the sidebar's value. |
| `label` (required) | `string` | Text next to the icon. It stays in the accessibility tree while the sidebar is a rail. |
| `icon` (required) | `ReactNode` | Icon, about 18 px. |
| `badge` | `string \| number` | A count or short word at the end of the row; the rail shows it as a dot on the icon. |
| `disabled` | `boolean` | Keeps the row visible but not pressable. |

## Keyboard

| Keys | Action |
| --- | --- |
| `↓` or `↑` | Moves focus between the rows and the collapse button, wrapping to the start after the last. |
| `Home` or `End` | Moves focus to the first row or to the collapse button, which is the last. |
| `Enter` or `Space` | Selects the focused row or toggles between rail and panel. |

## Accessibility

- It is a `<nav>` with `aria-label` coming from `label` (default “Main”); the active row gets `aria-current="page"`.
- On the rail, labels and counters stay in the DOM with zero opacity, so the screen reader keeps reading each destination; there is no visual tooltip with the icon's name.
- The collapse button has `aria-expanded`, `aria-controls` pointing to the bar, and a hidden name “Collapse sidebar” or “Expand sidebar”, fixed in English in the code.

## Motion

- The width switches between `railWidth` and `panelWidth` on a spring with a small bounce; the active item marker takes the full width and stretches along.
- On open, the labels arrive one after another sliding 6 px; on close, they leave together in a 120 ms fade. The marker slides to the active row with a slight bounce.
- With “reduce motion” on, width, labels, and marker change instantly, and the icon shrink on press is turned off.

## Responsive behavior

- The bar has `height: 100%` and does not scroll inside; with little height, the last rows and the collapse button get cut off, so the parent needs enough height.
- It does not collapse on its own on narrow screens; the demo starts on the rail below 560 px by passing a controlled `expanded`.

## Notes for AI

- The rows are `<button>` without `href`: do the navigation in `onValueChange`, for example by calling the router.
- Every item needs a unique `id` and `icon` (about 18 px); `defaultValue` falls back to the first item and `defaultExpanded` starts as `true`.
- Import `BounceSidebar` from `@/components/ryan-ui/bounce-sidebar/bounce-sidebar` and put it in a flex row beside the page, with a defined height.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/bounce-sidebar · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
