# AI command

> Paleta de comando estilo Cmd+K com modo de IA: digita para buscar páginas e ações ou aperta Tab para perguntar ao workspace — a resposta chega em streaming num painel de altura fixa, com fontes numeradas que acendem os chips e próximos passos executáveis na hora (issue no Linear, doc no Notion). Destaque que desliza, semântica de combobox, live region polida e walkthrough auto-executado que para na primeira interação.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-command
- Original description: A Cmd+K command palette with an AI mode: type to search pages and actions, or press Tab to ask your workspace — the answer streams into the fixed-height panel with numbered citations that highlight their source chips, and suggests next steps you can run right there (create a Linear issue, open a Notion doc) with running, done and retry states. Gliding highlight, combobox/listbox semantics, polite live region, reduced-motion fallbacks and a self-playing walkthrough that stops at first real interaction.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-command.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-command.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-command.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ai-command.json`. Registry path, relative to the site address: `r/ai-command.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/ai-command/ai-command.tsx`
  - `components/ryan-ui/ai-command/ai-command.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/ai-command.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Atalho global (Cmd+K) de um app com muitas páginas e ações: busca por nome ou palavra-chave e salta com Enter.
- Produtos em que o usuário pergunta sobre os próprios dados (suporte, billing, ops) sem sair do teclado: o Tab troca da busca pela pergunta.
- Comandos com passos seguintes de IA: depois da resposta, executa na hora o que foi sugerido (criar issue, abrir doc).

## When not to use

- Conversa de chat completa com histórico de várias turnos: use um componente de chat; aqui cada pergunta é isolada e substituível.
- Busca simples de navegação sem IA: um combobox normal basta.
- Formulários longos ou assistentes multi-etapa: paleta é para ação pontual, não para fluxo.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { AiCommand } from "@/components/ryan-ui/ai-command/ai-command";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 540 };

export default function AiCommandDemo() {
  return (
    <Stack gap={3} width={680}>
      <AiCommand />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SparkMark`

Spark da casa — desenha com currentColor (a cor vem do wrapper).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `LinearMark`

Linear — quadrado azul-violeta com a diagonal branca.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `NotionMark`

Notion — cartela clara com o N.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `SlackMark`

Slack — hash em quatro cores, traço arredondado.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `FigmaMark`

Figma — cinco peças em quatro cores.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `size` | `number` | `16` | — |

### `AiCommand`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AiCommandItem[]` | — | — |
| `onSelect` | `(item: AiCommandItem) => void` | — | — |
| `onAsk` | `(question: string, ctx: AiCommandAnswerContext) => Promise<AiCommandAnswer \| void>` | — | — |
| `onAction` | `(action: AiCommandAction, result: string) => void` | — | — |
| `onSourceSelect` | `(source: AiCommandSource) => void` | — | — |
| `suggestedQuestions` | `string[]` | `SAMPLE_QUESTIONS` | — |
| `model` | `{ name: string; mark?: ReactNode }` | — | O modelo que responde; aparece no rodapé, na busca e ao lado de cada resposta. |
| `defaultMode` | `"search" \| "ask"` | `"search"` | — |
| `defaultQuery` | `string` | `""` | — |
| `onModeChange` | `(mode: "search" \| "ask") => void` | — | — |
| `onClose` | `() => void` | — | Escape com a busca vazia — use para fechar o diálogo ao redor. |
| `placeholder` | `{ search?: string; ask?: string }` | — | — |
| `thinkingLabel` | `string` | `"Searching your workspace"` | — |
| `autoPlay` | `boolean` | — | Roda o walkthrough; por padrão true sem items e sem onAsk. |
| `hotkey` | `boolean` | `false` | Escuta Cmd/Ctrl+K na página e foca a busca. |
| `height` | `number` | `392` | Altura da área de resultados em px (o painel mantém esse tamanho sempre). |
| `elevated` | `boolean` | `false` | Sombra flutuante, para uso dentro de diálogo ou popover. |
| `className` | `string` | — | — |
| `style` | `CSSProperties` | — | — |
| `aria-label` | `string` | — | — |

### Exported types

#### `AiCommandItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `group` | `string` | — |
| `icon` | `ReactNode` | — |
| `meta` | `string` | — |
| `shortcut` | `string` | — |
| `keywords` | `string \| string[]` | — |
| `suggested` | `boolean` | Linhas marcadas como suggested aparecem com a consulta vazia. |
| `onSelect` | `() => void` | — |

#### `AiCommandSource`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `mark` | `ReactNode` | Mark de marca ou ícone de 14px. |
| `href` | `string` | Com href, a fonte abre em nova aba em vez de disparar onSourceSelect. |

#### `AiCommandAction`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `meta` | `string` | — |
| `mark` | `ReactNode` | Mark de marca ou ícone de 16px. |
| `run` | `(signal: AbortSignal) => Promise<string \| void>` | Faz o trabalho; resolve com um rótulo de conclusão ("Created ENG-2481") ou nada. |
| `runningLabel` | `string` | — |
| `doneLabel` | `string` | — |
| `errorLabel` | `string` | — |
| `doneMeta` | `string` | Onde a ação simulada diz que nada foi enviado de fato. |

#### `AiCommandAnswer`

| Field | Type | Description |
| --- | --- | --- |
| `text` | `string` | — |
| `sources` | `AiCommandSource[]` | — |
| `actions` | `AiCommandAction[]` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `↑` or `↓` | Move o destaque entre resultados, perguntas sugeridas e próximos passos. |
| `Enter` | Ativa a linha destacada: abre página/ação, faz a pergunta ou roda o passo sugerido. |
| `Tab` | Na busca com texto, troca para o modo ask e pergunta a consulta atual; no modo ask sem resposta, volta à busca. |
| `Esc` | No modo ask, cancela a resposta em andamento e volta à busca; na busca vazia, chama onClose. |
| `Cmd/Ctrl + K` | Com hotkey ativado, foca a paleta a partir de qualquer ponto da página. |

## Accessibility

- O input tem semântica de combobox e a lista de listbox, com aria-activedescendant seguindo o destaque; o toggle de modo usa botões com aria-pressed.
- As citações numeradas são botões reais nomeados com título e descrição da fonte; abrem em nova aba (href) ou disparam onSourceSelect.
- Uma live region polida anuncia perguntas, respostas prontas, erros e resultados dos passos ("Created ENG-2481", "Simulated, no requests were sent").
- Nenhum estado depende só de cor: cada status tem ícone e rótulo, e o check desenhado uma única vez sinaliza conclusão de passo.

## Motion

- O destaque desliza entre linhas em 130 ms com o ease standard e salta instantaneamente quando a lista muda de forma ou quando o movimento reduzido está ativo.
- As visões de busca e de pergunta fazem crossfade no lugar (saída em 100 ms, entrada em 160 ms com subida de 2 px) dentro da área de altura fixa, então nada reflowa enquanto se digita.
- A resposta chega em blocos de 3 a 7 palavras (~34 ms cada) com fade de 140 ms por bloco e autoscroll que solta quando o usuário sobe; o check de conclusão desenha o caminho uma vez em 300 ms.
- Com reduzir movimento os blocos chegam sem fade (blocos maiores), o crossfade de visão vira instantâneo e spinner/caret/pontos param de animar.

## Responsive behavior

- A paleta é limitada a 680 px e preenche o espaço dado; rótulos e meta das linhas truncam com elipse.
- Os chips de fonte quebram de linha em vez de comprimir, mantendo a resposta legível em popovers estreitos.
- Segura em 360 px: entrada, toggle e rodapé empilham sem scroll horizontal.

## Performance

- A busca filtra em memória a cada tecla, sem debounce; resultados e linhas são estado derivado com useMemo.
- O stream adiciona blocos a um array pequeno em vez de reparsing o texto inteiro; citações só renderizam quando chegam.
- O walkthrough pausa com IntersectionObserver fora da tela e em abas ocultas, e qualquer pointerdown/keydown cancela ele e aborta as ações pendentes.

## Notes for AI

- Use como camada global de comandos: monte uma vez com hotkey, passe onClose para fechar o diálogo ao redor e ligue onAsk ao seu motor real (o protocolo ctx.append/setSources funciona com SSE).
- Passe marks reais de fontes e ações a 14–16 px; marcas mono devem usar currentColor para seguirem o tema, enquanto as coloridas (Linear, Notion, Slack, Figma) mantêm os fills.
- Ações resolvem um rótulo de conclusão ("Created ENG-2481"); defina doneMeta para deixar claro que a simulação não enviou nada. O AbortSignal cobre navegação e cancelamento no meio do voo.
- Items e perguntas de exemplo são para demo — forneça seus próprios items e suggestedQuestions em produção.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/ai-command · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
