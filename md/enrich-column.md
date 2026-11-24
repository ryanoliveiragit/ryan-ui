# Enrich column

> Coluna de enriquecimento com IA para tabela: um prompt desce todas as linhas, cada célula shimmeriza enquanto trabalha e assenta num valor com fonte ou numa falha com retry, e o rodapé conta o que ficou pronto.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/enrich-column
- Original description: An AI enrichment column for a data table where one prompt runs down every row, each cell shimmers while it works, then settles into a value with its source or a failure you can retry, with a footer tallying what's done.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/enrich-column.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/enrich-column.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/enrich-column.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/enrich-column.json`. Registry path, relative to the site address: `r/enrich-column.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/enrich-column/enrich-column.tsx`
  - `components/ryan-ui/enrich-column/enrich-column.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/enrich-column.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Aumentar linhas de uma tabela com um campo gerado por IA (headcount, estágio de funding, classificação) mantendo a execução cancelável e auditável.
- Mostrar progresso real por linha — fila, executando, concluído, falhou — dentro de uma coluna, sem trocar de tela.
- Editar o nome do campo e o prompt direto no cabeçalho e reexecutar as linhas com o novo prompt.

## When not to use

- Pergunta livre sobre os dados com gráfico e insight como resposta: esse é o território do ask-your-data.
- Fluxos multi-etapa que navegam pelo documento ou chamam ferramentas em sequência: aí entre em cena o agent-cursor.
- Tabelas longas sem paginação: dezenas de rastros animados por célula cansam mais do que um spinner único na coluna.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { EnrichColumn } from "@/components/ryan-ui/enrich-column/enrich-column";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 560 };

export default function EnrichColumnDemo() {
  return (
    <Stack gap={3} width={720}>
      <EnrichColumn />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `EnrichColumn`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Target accounts"` | — |
| `rows` | `EnrichColumnRow[]` | `SAMPLE_ROWS` | — |
| `defaultColumn` | `EnrichColumnDefinition` | `DEFAULT_COLUMN` | — |
| `onColumnChange` | `(column: EnrichColumnDefinition) => void` | — | — |
| `enrich` | `( row: EnrichColumnRow, context: EnrichContext, ) => Promise<{ value: string; source?: EnrichColumnSource }>` | `simulatedEnrich` | — |
| `initialCells` | `Record<string, EnrichColumnCell>` | — | — |
| `concurrency` | `number` | `2` | — |
| `autoRun` | `boolean` | — | — |
| `model` | `{ name: string; detail?: string; mark?: React.ReactNode } \| null` | `{ name: "Claude Haiku 5.5", detail: "Web sear…` | — |
| `editable` | `boolean` | `true` | — |
| `note` | `string` | — | — |
| `onCellChange` | `(row: EnrichColumnRow, cell: EnrichColumnCell) => void` | — | — |
| `onRunComplete` | `(cells: Record<string, EnrichColumnCell>) => void` | — | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `EnrichColumnCellStatus` | `"idle" \| "queued" \| "running" \| "done" \| "failed"` |
| `EnrichColumnEnrich` | `( row: EnrichColumnRow, context: EnrichContext, ) => Promise<{ value: string; source?: EnrichColumnSource }>` |

#### `EnrichColumnRow`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `name` (required) | `string` | — |
| `domain` | `string` | — |
| `logo` | `React.ReactNode` | Rendered at 16px next to the name. |

#### `EnrichColumnSource`

| Field | Type | Description |
| --- | --- | --- |
| `label` (required) | `string` | — |
| `href` (required) | `string` | — |

#### `EnrichColumnDefinition`

| Field | Type | Description |
| --- | --- | --- |
| `name` (required) | `string` | — |
| `prompt` (required) | `string` | — |

#### `EnrichColumnCell`

| Field | Type | Description |
| --- | --- | --- |
| `status` (required) | `"idle" \| "queued" \| "running" \| "done" \| "failed"` | — |
| `value` | `string` | — |
| `source` | `EnrichColumnSource` | — |
| `error` | `string` | — |
| `activity` | `string` | Texto vivo do shimmer enquanto a célula trabalha. |
| `attempts` (required) | `number` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Atinge o lápis do cabeçalho e os controles das linhas; o Retry da linha falha está sempre visível. |
| `Enter` or `Space` | No lápis, abre o editor com o nome do campo já em foco. |
| `Cmd + Enter` or `Ctrl + Enter` | No editor aberto, salva, aplica a mudança e reexecuta a coluna inteira. |
| `Esc` | Fecha o editor e devolve o foco ao botão lápis, sem alterar o prompt salvo. |

## Accessibility

- Cada linha usa th com scope="row" e o cabeçalho da coluna usa th com scope="col": o leitor de tela identifica a célula pelo par linha e coluna.
- Um region aria-live anuncia o início e o fim de cada execução, com contagem de falhas quando houver.
- Falha não é só cor: o motivo aparece como texto visível na célula e o Retry permanece acessível sem depender de hover.
- Com reduzir movimento ativo, as trocas de estado viram opacidade simples, sem deslize vertical nem desenho do check.

## Motion

- O estado da célula troca num crossfade curto sobre uma camada posicionada de altura fixa, para a linha não dançar.
- O check verde é um path SVG desenhado em ~240 ms depois que o valor assenta.
- O editor da coluna abre com mola criticamente amortecida na altura, sem overshoot.
- No modo demo o loop segura ~4,2 s entre rodadas, pausa fora da viewport e para para sempre no primeiro toque ou tecla dentro do cartão.

## Responsive behavior

- Container queries: até 560 px saem do cabeçalho o rótulo do domínio-fonte e o detalhe do modelo; até 440 px o gutter cai para 16 px, o valor vira clamp de duas linhas em linha de 60 px e o motivo de falha some.
- Em hover:none (touch) os controles de execução da linha ficam sempre visíveis.

## Performance

- A execução roda duas linhas em paralelo com defasagem de 140 ms e um AbortController compartilhado para o cancelamento.
- IntersectionObserver pausa a demo quando o cartão sai da viewport; depois de qualquer interação ela não reinicia sozinha.
- Cada célula animada reutiliza uma única camada posicionada dentro do td de altura fixa, sem criar nós por estado.

## Notes for AI

- O modo `enrich` simulado é ilustrativo e monta já no fim; em produção ligue a função real que retorna valor, fonte e confiança por linha.
- Falha é dado, não exceção: a linha guarda o motivo (como "sem fonte com data") e oferece retry isolado.
- Cancelar uma execução em andamento restaura os valores concluídos antes do abort e devolve o resto ao estado inicial.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/enrich-column · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
