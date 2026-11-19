# Comment thread

> Comentários em fio, com respostas, reações, menções, edição no local e opção de resolver a conversa.

- Type: component (category Data)
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/comment-thread
- Original description: Threaded comments with replies, reactions, mentions, inline edit, and resolve.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comment-thread.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comment-thread.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comment-thread.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/comment-thread.json`. Registry path, relative to the site address: `r/comment-thread.json`.

- npm packages: `lucide-react`, `motion`
- Files, once installed:
  - `components/ryan-ui/comment-thread/comment-thread.tsx`
  - `components/ryan-ui/comment-thread/comment-thread.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install lucide-react motion`.
2. Copy the files listed above. The content of each one is in `r/comment-thread.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- A discussion tied to specific content (a layout heading, a paragraph, a task), with the subject in `title`.
- When the conversation needs nested replies, reactions, `@` mentions, and editing or deleting your own comments in place.
- Reviews that wrap up: resolving folds the whole conversation into a one-line summary that can be reopened.

## When not to use

- Use [`chat-thread`](chat-thread.md) for real-time conversation, with bubbles, typing indicator, and read receipts.
- Use [`mention-input`](mention-input.md) when you only need the field with mentions, without the surrounding conversation.
- Use [`timeline`](timeline.md) for a read-only history of what happened.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { CommentThread, type CommentAuthor, type ThreadComment } from "@/components/ryan-ui/comment-thread/comment-thread";
import { avatar } from "@/components/ryan-ui/lib/media";
import { Stack } from "./_kit";

const emma: CommentAuthor = { id: "emma", name: "Emma Collins", avatar: avatar("emma-collins") };
const marcus: CommentAuthor = { id: "marcus", name: "Marcus Johnson", avatar: avatar("marcus-johnson") };
const jasmine: CommentAuthor = { id: "jasmine", name: "Jasmine Brooks", avatar: avatar("jasmine-brooks") };
const me: CommentAuthor = { id: "olivia", name: "Olivia Bennett", avatar: avatar("olivia-bennett") };

const comments: ThreadComment[] = [
  {
    id: "c1", author: emma, createdAt: "3h",
    body: "The headline wraps onto three lines at tablet width. Can we shorten it?",
    reactions: [{ emoji: "👀", users: ["marcus", "jasmine"] }],
    replies: [
      { id: "c2", author: marcus, createdAt: "2h", body: "Agreed. What about \"Ship interfaces people remember\"?", reactions: [{ emoji: "👍", users: ["emma", "olivia"] }] },
      { id: "c3", author: jasmine, createdAt: "1h", body: "Works for me. @Emma Collins can you confirm it fits the brand voice?" },
    ],
  },
  { id: "c4", author: marcus, createdAt: "35m", body: "I also bumped the subheading contrast to meet AA." },
];

export default function CommentThreadDemo() {
  return (
    <Stack width={520}>
      <CommentThread defaultComments={comments} currentUser={me} people={[emma, marcus, jasmine, me]} title="Hero headline" />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `CommentThread`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `comments` | `ThreadComment[]` | — | — |
| `defaultComments` | `ThreadComment[]` | `[]` | — |
| `onCommentsChange` | `(comments: ThreadComment[], event: CommentThreadEvent) => void` | — | — |
| `currentUser` (required) | `CommentAuthor` | — | The person writing. Their comments can be edited and deleted. |
| `people` | `CommentAuthor[]` | — | People who can be mentioned. Defaults to everyone in the thread. |
| `resolved` | `boolean` | — | — |
| `defaultResolved` | `boolean` | `false` | — |
| `onResolvedChange` | `(resolved: boolean) => void` | — | — |
| `title` | `ReactNode` | — | What the thread is about, shown in its header, such as "Hero headline". |
| `reactions` | `string[]` | `DEFAULT_REACTIONS` | Emoji offered by the reaction picker. |
| `placeholder` | `string` | `"Reply, or @mention someone"` | — |
| `maxDepth` | `number` | `2` | Replies deeper than this attach to the deepest allowed parent. Defaults to 2. |
| `nowLabel` | `string` | `"Just now"` | Label for comments written now. |
| `labels` | `CommentThreadLabels` | — | Words for localization. Leave out any key to keep its English default. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `CommentThreadEvent`: What changed, for syncing to a server. `comments` on `onCommentsChange` is always the full next tree. | `\| { type: "reply"; comment: ThreadComment; parentId: string \| null } \| { type: "edit"; id: string; body: string } \| { type: "delete"; id: string } \| { type: "react"; id: string; emoji: string; added: boolean }` |

#### `CommentAuthor`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `avatar` | `string` | Square image URL. Initials are shown without one. |

#### `CommentReaction`

| Field | Type | Description |
| --- | --- | --- |
| `emoji` (required) | `string` | — |
| `users` (required) | `string[]` | Ids of the people who reacted. |

#### `ThreadComment`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `author` (required) | `CommentAuthor` | — |
| `body` (required) | `string` | Plain text. "@Full Name" mentions of known people are highlighted. |
| `createdAt` (required) | `string` | Display label such as "2h" or "Sep 18". |
| `edited` | `boolean` | — |
| `deleted` | `boolean` | A deleted comment that still has replies keeps its place as a quiet placeholder. |
| `reactions` | `CommentReaction[]` | — |
| `replies` | `ThreadComment[]` | — |

#### `CommentThreadLabels`

Every word the thread shows or announces. Each one has an English default; words with a count or a name are functions, so an app can apply its own plural rules.

| Field | Type | Description |
| --- | --- | --- |
| `thread` | `string` | Accessible name of the whole thread. |
| `commentCount` | `(count: number) => string` | Header and resolved chip, such as "3 comments". |
| `peopleCount` | `(count: number) => string` | Resolved chip, such as "2 people". |
| `resolve` | `string` | — |
| `resolved` | `string` | Title of the resolved chip. |
| `reopen` | `string` | — |
| `empty` | `string` | Shown when there are no comments. |
| `reply` | `string` | — |
| `edit` | `string` | — |
| `delete` | `string` | — |
| `cancel` | `string` | — |
| `send` | `string` | — |
| `save` | `string` | Saves an edit. |
| `editComment` | `string` | Placeholder and accessible name of the edit field. |
| `edited` | `string` | After the time of an edited comment. |
| `deleteConfirm` | `string` | — |
| `deletedText` | `string` | Placeholder text of a deleted comment that still has replies. |
| `deletedComment` | `string` | Accessible name of that placeholder. |
| `replyingTo` | `(name: string) => string` | Above the composer while replying. The name inside it is highlighted. |
| `cancelReply` | `string` | — |
| `showReplies` | `(count: number) => string` | — |
| `hideReplies` | `string` | — |
| `addReaction` | `string` | — |
| `closeReactions` | `string` | — |
| `reactions` | `string` | Accessible name of the reaction picker. |
| `reactWith` | `(emoji: string) => string` | Accessible name of an emoji in the picker. |
| `reactionCount` | `(emoji: string, count: number, includesYou: boolean) => string` | Accessible name of a reaction under a comment. |
| `mentions` | `string` | Accessible name of the @mention suggestions. |

## Keyboard

| Keys | Action |
| --- | --- |
| `Ctrl + Enter` or `Cmd + Enter` | Submit the comment or save the edit; `Enter` alone inserts a line break. |
| `↑` or `↓` | With the mention suggestions open, move through the list. |
| `Enter` or `Tab` | With the suggestions open, insert the highlighted person as `@Nome Completo`. |
| `Esc` | Closes the suggestions; without them, cancels the reply or edit, and also closes the reaction picker and the delete confirmation. |
| `Tab` | Moves through each comment's buttons; the actions (react, reply, edit, delete) appear when focus enters it. |

## Accessibility

- The root is a named `section` and each comment is an `article` with author and time in the label; the field is a `combobox` linked to the mentions list by `aria-activedescendant`.
- Focus is guided: resolving moves to the reopen button and vice versa, replying moves to the field, and the delete confirmation opens with focus on the delete button.
- All texts have an English default and are replaced through `labels`; there is no live region, so comments arriving from elsewhere are not announced.

## Motion

- Comments and replies enter and leave by opening their own height with a spring; collapsing replies does the same and rotates the arrow.
- Editing swaps the text for the field with a fade while the comment's height follows on a spring; reactions appear with scale and the count rolls.
- Resolving crossfades the conversation with the summary while the box height animates; with “reduce motion”, short fades remain and heights change immediately.

## Responsive behavior

- On screens up to 420 px the field loses the avatar beside it and replies indent 12 px instead of 24; on touch, each comment's actions are always visible.
- The field grows with the text through `field-sizing: content` (up to 160 px); in browsers without that property it stays at one line and scrolls.

## Performance

- The whole tree is rebuilt on every change and each comment keeps a height observer: it serves discussions of dozens of comments, not a long feed.

## Notes for AI

- Controlled or not on both axes: `comments` with `onCommentsChange` and `resolved` with `onResolvedChange`, or `defaultComments` and `defaultResolved`; the callback delivers the whole new tree and the event that caused it, to sync the server.
- `createdAt` is the already formatted text (“2h”, “Sep 18”), not a date; new comments go out with `nowLabel` and a local `id`, which you swap for the server's.
- `currentUser` decides who can edit and delete; `people` feeds the mentions, and replies beyond `maxDepth` (2) attach to the deepest allowed level.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/comment-thread · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
