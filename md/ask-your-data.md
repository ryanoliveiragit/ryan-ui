# Ask your data

> Pergunta livre sobre os dados em linguagem natural: o SQL é escrito palavra a palavra num painel recolhível com syntax highlighting, a consulta roda com contagem de linhas e responde em barras empilhadas, linhas ou tabela, com um insight em streaming logo abaixo.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ask-your-data
- Original description: A natural language to chart card: you ask a question, PostgreSQL streams into a collapsible, syntax highlighted panel, the query runs with a rolling row count, and the answer builds as stacked bars, lines or a table, with a one line insight streamed in underneath.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ask-your-data.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ask-your-data.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ask-your-data.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ask-your-data.json`. Registry path, relative to the site address: `r/ask-your-data.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/ask-your-data/ask-your-data.tsx`
  - `components/ryan-ui/ask-your-data/ask-your-data.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/ask-your-data.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Responder perguntas de negócio sobre uma base de dados em linguagem natural: “signups por plano desde agosto” vira SQL, gráfico e leitura em segundos.
- Widget analítico ao vivo em dashboards ou copilotos de dados, com o SQL gerado visível para auditoria.
- Demo de produto de IA + dados em que a resposta precisa parecer consultável: linhas escaneadas em tempo real, rows devolvidas e tempo de execução.

## When not to use

- Gráficos estáticos de relatório: use um componente de chart direto; aqui o valor é a sequência pergunta → SQL → execução → resposta.
- Editor de SQL completo com autocomplete e histórico de consultas: prefira um editor code embutido.
- Conversa longa e iterativa com o modelo: use um layout de thread; aqui a resposta é um único resultado tabular com insight.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { AskYourData } from "@/components/ryan-ui/ask-your-data/ask-your-data";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

export default function AskYourDataDemo() {
  return (
    <Stack gap={3} width={680}>
      <AskYourData />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AskYourData`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `question` | `string` | — | — |
| `defaultQuestion` | `string` | `"Weekly signups by plan since August"` | — |
| `onQuestionChange` | `(question: string) => void` | — | — |
| `placeholder` | `string` | `"Ask a question about your data"` | — |
| `source` | `{ name: string; dialect?: string; mark?: React.ReactNode }` | `{ name: "analytics", dialect: "PostgreSQL" }` | — |
| `suggestions` | `string[]` | `DEFAULT_SUGGESTIONS` | — |
| `generateSql` | `(question: string, details: { signal: AbortSignal; source: { name: string; dialect?: string } }) => Promise<string \| AsyncIterable<string>> \| string \| AsyncIterable<string>` | — | — |
| `runQuery` | `(sql: string, details: { signal: AbortSignal; onProgress: (rowsScanned: number, totalRows?: number) => void; question: string }) => Promise<AskYourDataResult>` | — | — |
| `onResult` | `(result: AskYourDataResult, details: { question: string; sql: string }) => void` | — | — |
| `onError` | `(error: unknown, details: { question: string; stage: "sql" \| "query" }) => void` | — | — |
| `chart` | `"bar" \| "line" \| "table"` | — | — |
| `defaultChart` | `"bar" \| "line" \| "table"` | `"bar"` | — |
| `onChartChange` | `(chart: AskYourDataView) => void` | — | — |
| `autoRun` | `boolean` | — | — |
| `keepSqlOpen` | `boolean` | `false` | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `AskYourDataView` | `"bar" \| "line" \| "table"` |

#### `AskYourDataSeries`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `values` (required) | `number[]` | Um valor por categoria. |
| `color` | `string` | Padrão: --series-1 a --series-4 na ordem da série. |

#### `AskYourDataResult`

| Field | Type | Description |
| --- | --- | --- |
| `title` (required) | `string` | — |
| `subtitle` | `string` | — |
| `categories` (required) | `string[]` | — |
| `series` (required) | `AskYourDataSeries[]` | — |
| `stacked` | `boolean` | Padrão true: as séries somam (barras empilhadas, totais no legenda/tooltip). |
| `legendValue` | `"sum" \| "last" \| "none"` | — |
| `chart` | `"bar" \| "line" \| "table"` | Visão aberta para este resultado. |
| `categoryLabel` | `string` | — |
| `formatValue` | `(value: number) => string` | — |
| `insight` | `string` | Uma ou duas frases lendo o gráfico; entra em stream sob ele. |
| `rowCount` | `number` | Linhas que a consulta devolveu ("48 rows"). |
| `durationMs` | `number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Move o foco entre o campo da pergunta, o toggle do SQL gerado, o botão de copiar e o grupo do gráfico; na visão Table a navegação de tabela é a nativa. |
| `Enter` | No campo da pergunta, envia a consulta; se ela está rodando, para. |
| `Esc` | No campo, para a consulta em andamento; no gráfico, limpa a leitura ativa. |
| `←` or `→` or `Home` or `End` | Sobre o gráfico focável, move a leitura entre categorias (ou vai à primeira/última); cada posição é anunciada. |
| `Enter` or `Space` | No botão de copiar, copia o SQL gerado. |

## Accessibility

- O cartão é uma região nomeada com duas live regions polidas: uma narra a sequência writing → running → título/linhas (e que a amostra é simulada, nada foi consultado); outra anuncia cada leitura do gráfico no formato “Aug 10: Free 61, Pro 24, …, total 97”.
- A linha do SQL é um botão real com aria-expanded/aria-controls cujo nome inclui o metadado (dialecto, linhas, rows, ms); o status nunca é só cor — spinner, alerta e check vêm acompanhados do texto de estado.
- O gráfico é um grupo focável (role=group) com instruções de setas no aria-label; a leitura visível é redundante na live region.
- A tabela mantém th scope=col e th scope=row por linha; contadores e totais usam tabular-nums para não tremer.
- O campo de pergunta ganha border + ring de accent em focus-within; painel do SQL, botões e chips têm :focus-visible próprio.

## Motion

- O SQL sai 4 palavras por tick, 34 ms, pintando sobre um ghost invisível que já reserva a altura final; o painel abre e fecha em mola suave (~300 ms, sem bounce) via grid-template-rows 0fr→1fr.
- Barras sobem em 320 ms com stagger total ≤ 180 ms; linhas desenham pathLength em 460 ms; a troca Bar/Line é crossfade (~120 ms de saída, ~160 ms de entrada) sobre a mesma área fixa.
- O insight streama 4 palavras por tick, 70 ms, com a altura final exata reservada pelo texto completo invisível.
- Com reduzir movimento ativo, tudo chega inteiro de uma vez — SQL revelado, gráficos e insight finais — sem spinner, caret, respiração do skeleton ou desenho. Fora da tela os timers pausam (IntersectionObserver) e a reprise só agenda com o cartão visível.

## Responsive behavior

- Container queries sobre o cartão: abaixo de 520 px a fonte fica só com o ícone e o seletor Bar/Line/Table vai para largura cheia, acima da legenda.
- Os rótulos do eixo X afinam para manter ≥ 46 px entre vizinhos; linhas largas de SQL e a tabela rolam dentro do próprio poço.
- A leitura (tooltip) fica presa dentro do plot: perto das bordas ela desliza para o lado com espaço em vez de cortar.

## Performance

- Gráficos em SVG puro medidos por um único ResizeObserver, sem lib de gráfico; texto e hairlines desenhados em pixels do dispositivo, nítidos em qualquer largura.
- O tokenizer de SQL é uma única passada de regex, memoizada por consulta; o painel e cada visão montam só enquanto exibidas.
- As linhas escaneadas chegam por onProgress — em consultas muito rápidas, lote-as para algumas por segundo.

## Notes for AI

- Sem generateSql/runQuery roda no modo amostra: monta já no resultado pronto (analytics · PostgreSQL · 1,284 signups) e reprisa a cada 4,2 s até o primeiro toque. Passe suas funções para ligar ao modelo; rejeite a promessa para ver Failed com Try again.
- generateSql pode devolver string ou AsyncIterable de chunks; runQuery recebe onProgress(rowsScanned, total?) e devolve AskYourDataResult. O AbortSignal cancela tudo no Stop, no novo run e no unmount.
- stacked=true soma as séries (barras empilhadas, total na legenda e na leitura); legendValue escolhe sum/last/none; keepSqlOpen segura o painel aberto durante a execução; result.chart/defaultChart escolhem a visão inicial.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ask-your-data · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
