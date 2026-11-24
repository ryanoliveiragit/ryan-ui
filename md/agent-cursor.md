# Agent cursor

> Documento ao vivo em que o Claude edita como colaborador: o cursor com nome sai do avatar dele, seleciona um parágrafo e digita a reescrita palavra por palavra, adiciona um heading e corrige um typo sublinhado de ziguezague, enquanto a cursor da colega lê junto; as mudanças ficam tingidas até alguém aceitar ou desfazer na barra de revisão flutuante.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/agent-cursor
- Original description: A live document where Claude edits like a collaborator: its labeled cursor comes out of its avatar, selects a paragraph and streams in a rewrite, adds a heading and fixes a typo, while a teammate's cursor reads along. Changes stay tinted until someone accepts or undoes them from a floating review bar.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-cursor.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-cursor.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-cursor.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/agent-cursor.json`. Registry path, relative to the site address: `r/agent-cursor.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/agent-cursor/agent-cursor.tsx`
  - `components/ryan-ui/agent-cursor/agent-cursor.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/agent-cursor.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Mostrar um assistente de escrita de IA editando um documento junto com pessoas, com passo de revisão (aceitar/desfazer) antes de aplicar.
- Seções de landing ou onboarding que demonstram um editor colaborativo com IA em movimento.
- Superfícies de produto em que um agente devolve edits estruturados (reescrita, inserção de bloco, correção) e um humano precisa aprovar cada lote.

## When not to use

- Conversa ou Q&A livre: use um componente de transcript de chat; aqui o valor é a edição in place com cursor e revisão.
- Um editor rich text de verdade: ligue os cursores de colaboração do próprio editor; este cartão renderiza blocos somente leitura.
- Documentos longos com muitas seções: o cartão foi feito para um excerto curto, uns cinco a dez blocos.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { AgentCursor } from "@/components/ryan-ui/agent-cursor/agent-cursor";
import { person } from "@/components/ryan-ui/lib/media";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 640 };

export default function AgentCursorDemo() {
  return (
    <Stack gap={3} width={720}>
      <AgentCursor collaborator={{ name: "Emma Collins", avatar: person("emma-collins").src }} />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `AgentCursor`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `blocks` | `DocBlock[]` | `SAMPLE_BLOCKS` | O documento como blocos de título, heading e parágrafo com ids estáveis. |
| `meta` | `string` | — | Linha discreta sob o título, como dono e data-alvo. |
| `edits` | `AgentEdit[]` | — | Edits para reproduzir em ordem. Ignorado quando há run. |
| `run` | `(signal: AbortSignal) => Promise<AgentEdit[]>` | — | Busca edits no seu agente; o signal aborta no Stop. Rejeição vira erro com Retry. |
| `agent` | `{ name?: string; mark?: React.ReactNode; color?: string }` | — | — |
| `collaborator` | `{ name: string; avatar?: string; color?: string } \| null` | `{ name: "Emma Collins" }` | Humano dentro do doc, desenhado como segundo cursor. Null oculta. |
| `autoPlay` | `boolean` | `true` | — |
| `loop` | `boolean` | — | Rejoga o run: aceita depois de uma pausa (nunca com hover/focus no card) e reinicia. Padrão true no exemplo. |
| `speed` | `number` | `1` | — |
| `onAccept` | `(blocks: DocBlock[]) => void` | — | — |
| `onUndo` | `(blocks: DocBlock[]) => void` | — | — |
| `onPhaseChange` | `(phase: AgentCursorPhase) => void` | — | — |
| `simulated` | `boolean` | — | Acrescenta "Simulated, nothing was saved" ao status de leitor de tela. Padrão true no exemplo. |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `AgentCursorPhase` | `"idle" \| "thinking" \| "editing" \| "review" \| "accepted" \| "reverted" \| "stopped" \| "empty" \| "error"` |
| `AgentEdit` | `\| { type: "rewrite"; blockId: string; text: string; label?: string } \| { type: "insert"; afterId: string; block: DocBlock; label?: string } \| { type: "fix"; blockId: string; from: string; to: string; label?: string }` |

#### `DocBlock`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `kind` (required) | `"title" \| "h" \| "p"` | — |
| `text` (required) | `string` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Move o foco entre o botão do cabeçalho (Stop durante o run, Run again depois) e, na barra de revisão, entre Undo e Accept changes. |
| `Enter` or `Space` | Ativa o botão com foco (para o run, rejoga, desfaz ou aceita as mudanças). |

## Accessibility

- Uma live region polida narra cada etapa (pensando, a edição em curso, edits prontos, aceito, desfeito, erro) e acrescenta “Simulated, nothing was saved” nos runs simulados.
- Cursores, seleção e a linha de status são decorativos e ficam fora da árvore; o documento mantém headings e parágrafos reais, marcados com aria-busy enquanto o agente edita.
- O status nunca é só cor: todo estado terminal combina ícone com rótulo, e as mudanças pendentes ficam tingidas e contadas na barra de revisão.
- Hover ou focus dentro do cartão segura o loop em review, para ninguém perder a barra de ação no meio do alcance.

## Motion

- Os cursores deslizam num arco suave ease-in-out, 280 a 600 ms conforme a distância, dirigidos por motion values — nada re-renderiza por frame.
- A seleção preenche linha por linha em passo com o arraste; a reescrita faz fade do texto antigo em 110 ms e streama 4 palavras a cada 34 ms sobre um ghost invisível que reserva a altura exata, cada chunk esmaecendo em 140 ms sem blur nem slide.
- Blocos inseridos crescem do zero com mola sem bounce (motionTokens.spring.smooth); o rótulo de status faz crossfade (100 ms de saída, 160 ms de entrada) e a barra de revisão sobe 8 px e aparece em 200 ms.
- Com reduzir movimento ativo os cursores pulam direto para o alvo, o texto chega inteiro, o drift de repouso e o stagger param, e todos os estados finais permanecem visíveis.

## Responsive behavior

- O cartão é fluido dentro do container, limitado a 720 px e centralizado; abaixo de 480 px o padding do documento aperta e a barra de revisão dispensa o “by Claude” para caber em uma linha.
- As tags dos cursores viram para a esquerda perto da borda direita, e o cursor de repouso da colaboradora se reancora quando o cartão redimensiona (ResizeObserver).
- Alvos de seleção e de cursor vêm de Range.getClientRects nas caixas de linha vivas, então texto embrulhado continua mirado em qualquer largura, inclusive 360 px sem scroll horizontal.

## Performance

- Posições dos cursores são motion values, então o trajeto nunca re-renderiza React; o streaming re-renderiza um bloco por tick.
- Geometria de seleção e de alvo sai de getClientRects sob demanda, não a cada frame.
- Timer pausável por um IntersectionObserver (limiar 0,2): loops, drift e esperas param com o cartão fora da tela, e o AbortController cancela o run no Stop, no re-jogo e no unmount.

## Notes for AI

- Sem run o componente roda o modo amostra: um launch brief de exemplo com três edits (reescrita, heading e typo) em loop — autoPlay, loop e simulated são true por padrão nesse modo, e o primeiro hover/toque segura o ciclo.
- Ligue ao seu agente com run(signal): promessa async abortável; uma rejeição vira estado de erro com Retry no cabeçalho e na barra. Edits apontam blocos pelo id, e fix precisa da palavra exata como ela está no texto.
- Persista o resultado: salve o que onAccept devolve e repasse em blocks. agent aceita outro provedor com name/mark/color — cursor, seleção e tint seguem agent.color; collaborator null esconde o segundo cursor; autoPlay false troca o cabeçalho para Ask.
- Tudo dentro do cartão é medido em pixels vivos (getBoundingClientRect/getClientRects relativo ao card), então funciona embutido em qualquer layout, desde que o container não use transform enquanto roda.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/agent-cursor · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
