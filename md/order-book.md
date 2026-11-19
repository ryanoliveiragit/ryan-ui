# Order book

> Livro de ofertas com compras e vendas lado a lado, barras de profundidade, spread e linhas que piscam a cada mudança.

- Type: component (category Data), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/order-book
- Original description: Bids and asks side by side with cumulative depth bars, a spread row, rows that flash when their size changes and slide when the price moves, plus a seeded feed hook.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/order-book.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/order-book.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/order-book.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/order-book.json`. Registry path, relative to the site address: `r/order-book.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/order-book/order-book.tsx`
  - `components/ryan-ui/order-book/order-book.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/order-book.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Trading screen that shows the current buy and sell offers, with cumulative depth, spread, and the mid price between the best offers.
- Letting the user pick a limit order's price by clicking a level (`onSelectLevel`).
- Demos and sample screens for trading products, with the simulated feed `useOrderBookFeed`.

## When not to use

- Use [`liquidity-heatmap`](liquidity-heatmap.md) to see how liquidity evolved over time, not just the current snapshot.
- Use [`candlestick-chart`](candlestick-chart.md) for price history in candles.
- Use [`sortable-data-table`](sortable-data-table.md) for generic record tables with sorting; the book has fixed columns and order.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import OrderBook, { useOrderBookFeed, type OrderLevel, type OrderSide } from "@/components/ryan-ui/order-book/order-book";
import { Button } from "@/components/ryan-ui/button/button";
import { Caption, Row, Stack, Surface } from "./_kit";

const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function OrderBookDemo() {
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState<(OrderLevel & { side: OrderSide }) | null>(null);
  const feed = useOrderBookFeed({ mid: 64_210, tick: 0.5, levels: 9, size: 0.42, seed: 23, paused });

  return (
    <Stack gap={4} width={560}>
      <Row justify="space-between">
        <Caption>BTC-USD, simulated ticks. {feed.running ? "Rows flash as sizes change." : "The feed is paused."}</Caption>
        <Button variant="secondary" size="sm" onClick={() => setPaused(value => !value)}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? "Resume feed" : "Pause feed"}
        </Button>
      </Row>
      <Surface padding={4}>
        <OrderBook label="BTC-USD order book" bids={feed.bids} asks={feed.asks} depth={9} baseSymbol="BTC" quoteSymbol="USD"
          selectedPrice={level?.price ?? null} onSelectLevel={setLevel} />
      </Surface>
      <Caption>
        {level
          ? `Limit price set to ${price.format(level.price)} USD, taken from the ${level.side} side. Click the row again to clear it.`
          : "Hover a row to see the cost of trading through to it, or click one to use its price. Arrow keys move between rows and sides."}
      </Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `OrderBook`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `bids` (required) | `OrderLevel[]` | — | Buy orders. Any order: the highest price is drawn first. |
| `asks` (required) | `OrderLevel[]` | — | Sell orders. Any order: the lowest price is drawn first. |
| `label` (required) | `string` | — | Accessible name of the book, such as "BTC-USD order book". |
| `depth` | `number` | `10` | Rows shown per side. |
| `baseSymbol` | `string` | `""` | Code of the asset sizes are counted in, such as "BTC". |
| `quoteSymbol` | `string` | `""` | Code of the asset prices are quoted in, such as "USD". |
| `pricePrecision` | `number` | `2` | Decimal places of a price. |
| `sizePrecision` | `number` | `3` | Decimal places of a size. |
| `selectedPrice` | `number \| null` | — | Selected price, or null for none. Leave undefined to let the book keep its own selection. |
| `defaultSelectedPrice` | `number \| null` | `null` | Price selected at first when the book keeps its own selection. |
| `onSelectLevel` | `(level: (OrderLevel & { side: OrderSide }) \| null) => void` | — | Called with the level that was clicked, or with null when the selected level is clicked again. |
| `locale` | `string` | `"en-US"` | Formatting locale. Fixed by default so server and client render the same numbers. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `OrderSide` | `"bid" \| "ask"` |

#### `OrderLevel`

| Field | Type | Description |
| --- | --- | --- |
| `price` (required) | `number` | Price of the level. |
| `size` (required) | `number` | Size resting at that price, in the base asset. |

#### `OrderBookFeedOptions`

| Field | Type | Description |
| --- | --- | --- |
| `mid` (required) | `number` | Price the book starts around. |
| `tick` (required) | `number` | Price step between two levels. |
| `levels` | `number` | Levels kept on each side. |
| `size` | `number` | Typical size of a level near the best price. |
| `interval` | `number` | Milliseconds between two ticks. |
| `seed` | `number` | Seed of the generator. The same seed always replays the same session. |
| `paused` | `boolean` | Stops the ticks while true. |

#### `OrderBookFeed`

| Field | Type | Description |
| --- | --- | --- |
| `bids` (required) | `OrderLevel[]` | Buy levels, best first. |
| `asks` (required) | `OrderLevel[]` | Sell levels, best first. |
| `running` (required) | `boolean` | False while paused, while the tab is hidden, or when the person asked for reduced motion. |

### Other exports

- `useOrderBookFeed` (hook)

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move focus to the level above or below, on the same side. |
| `←` or `→` | Switch to the buy side or the sell side, on the same row. |
| `Home` or `End` | Go to the best price and to the last level of the current side. |
| `Enter` or `Space` | Select the row's price; on the already selected row, clear the selection. |
| `Tab` | The whole book is a single `Tab` stop; the arrow keys do the rest. |

## Accessibility

- The root is a `role="group"` named by `label`, with two labeled lists (buys and sells, best price first); each row is a button with `aria-pressed` and an `aria-label` with side, price, size, and total.
- Focus on a row does the same as the cursor: it highlights the levels up to it and shows in the footer how much it costs to trade up to there; feed changes are not announced, since there is no live region.
- `label` is required; headers and phrases (“Bid”, “Ask”, “Spread”, “at an average of”) are hardcoded in English, and `locale` only changes the number format.

## Motion

- When a level's size changes, the row flashes for 0.6 s: in the side's color if it grew, in a neutral tone if it shrank.
- When the price moves, rows slide to their new position on a spring, new ones enter fading in, and the depth bars stretch from the middle of the book.
- With “reduced motion”, there is no flash or slide, and `useOrderBookFeed` stops emitting updates.

## Responsive behavior

- The root is a container: at 520 px or more each side gets the cumulative total column; at up to 360 px the row padding shrinks and, at up to 300 px, so does the font.
- The two sides always stay side by side; below 520 px the price column uses its own text width, so the size column is the one that shrinks.

## Performance

- Rows are memoized and only `depth` levels per side are rendered; the simulated feed uses an interval (850 ms by default) that stops when the tab is hidden.
- In a real high-frequency feed, batch the updates before swapping `bids` and `asks`: each swap recomputes the totals and triggers flashes and slides.

## Notes for AI

- Pass `bids` and `asks` as `{ price, size }` in any order: the component sorts, drops zero sizes, cuts at `depth`, and computes totals, spread, and the mid price.
- `selectedPrice` controls the selection (`null` for none; `undefined` lets the book manage it), and `onSelectLevel` receives `{ side, price, size }` or `null` when the row is clicked again.
- `useOrderBookFeed` is a seeded simulation for demos, not a market connection: with real data, pass your own arrays and keep prices rounded consistently, since they are each row's key.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/order-book · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
