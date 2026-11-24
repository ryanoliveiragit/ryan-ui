# Starter prompts

> Saudação, abas de categoria e uma grade 2×2 de cartões de prompt de partida para o estado vazio de um app de IA: o shuffle troca a página de sugestões com crossfade escalonado (160 ms por carta, 35 ms de atraso entre elas), escolher um cartão preenche o composer abaixo (Enter envia, Shift+Enter quebra linha, Escape aborta o envio em curso), cartões com app conectado mostram o mark do app (Gmail, GitHub, Notion, Linear, Google Calendar), há esqueleto de carregamento com o mesmo tamanho e ritmo dos cartões, as setas navegam entre as abas com roving tabindex, categorias sem starter somem da lista e todas as mudanças são anunciadas por live region.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/starter-prompts
- Original description: An empty-state panel for AI apps: a greeting, category tabs (All plus yours), and a 2x2 grid of starter prompt cards. Shuffle deals a fresh page of suggestions with a staggered crossfade; picking a card fills the composer below it, Enter sends (Escape aborts in flight), and app-connected cards carry their app mark (Gmail, GitHub, Notion, Linear, Google Calendar). Ships with 24 sample starters, a loading skeleton in the cards' own rhythm, roving-tabindex tab navigation and a polite live region announcing picks, shuffles, sends, aborts and errors.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/starter-prompts.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/starter-prompts.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/starter-prompts.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/starter-prompts.json`. Registry path, relative to the site address: `r/starter-prompts.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/starter-prompts/starter-prompts.tsx`
  - `components/ryan-ui/starter-prompts/starter-prompts.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/starter-prompts.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Estado vazio de um chat ou agente de IA: o usuário ainda não escreveu nada e precisa de um empurrão inicial concreto.
- Painel de boas-vindas de um produto com ferramentas conectadas (Gmail, GitHub, Notion, Linear, Google Calendar), onde os starters trabalham com os dados do app.
- Apps em que o bom prompt depende da categoria da tarefa (escrever, código, análise, planejar) e filtrar por aba ajuda mais do que uma lista única.
- Qualquer composer de IA que quer pré-preencher o campo com sugestões reais em vez de um placeholder genérico.

## When not to use

- Conversas em andamento com histórico: o espaço vazio já foi ocupado e os starters viram ruído acima das mensagens.
- Sugestões que dependem de contexto fino do documento (cursor, seleção, arquivo aberto): prefira um componente inline de sugestões no próprio texto.
- Bibliotecas grandes de templates pesquisáveis: use busca ou um diálogo de modelos, não uma grade fixa de quatro.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { StarterPrompts } from "@/components/ryan-ui/starter-prompts/starter-prompts";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

export default function StarterPromptsDemo() {
  return (
    <Stack gap={3} width={668}>
      <StarterPrompts />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `StarterPrompts`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `greeting` | `ReactNode` | `"What are we working on, Maya?"` | — |
| `description` | `ReactNode` | `"Pick a starter or write your own. Cards with…` | Linha quieta abaixo do título; null esconde. |
| `prompts` | `StarterPrompt[]` | `STARTER_PROMPT_SAMPLES` | — |
| `categories` | `StarterPromptCategory[]` | `DEFAULT_CATEGORIES` | — |
| `defaultCategory` | `string` | `"all"` | — |
| `count` | `number` | `4` | Quantos cartões ficam na tela; a grade reserva esses slots para nada saltar. |
| `loading` | `boolean` | `false` | Cartões placeholder com o mesmo tamanho e ritmo enquanto os starters carregam. |
| `value` | `string` | — | — |
| `defaultValue` | `string` | `""` | — |
| `onValueChange` | `(value: string) => void` | — | — |
| `onSelect` | `(prompt: StarterPrompt) => void` | — | — |
| `onSubmit` | `(message: string, context: { prompt: StarterPrompt \| null; signal: AbortSignal }) => Promise<void> \| void` | — | — |
| `model` | `{ name: string; mark?: ReactNode }` | — | — |
| `placeholder` | `string` | `"Ask anything, or pick a starter above"` | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `StarterPromptApp` | `"gmail" \| "github" \| "notion" \| "linear" \| "calendar"` |

#### `StarterPrompt`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `category` (required) | `string` | — |
| `title` (required) | `string` | — |
| `description` | `string` | — |
| `prompt` (required) | `string` | Texto completo que vai para o composer (o cartão mostra title/description). |
| `app` | `"gmail" \| "github" \| "notion" \| "linear" \| "calendar"` | — |

#### `StarterPromptCategory`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `icon` | `ReactNode` | — |

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Navega na ordem visual: só a aba ativa fica no percurso (roving tabindex), depois Shuffle, os cartões e o composer. |
| `←` or `→` | Na aba focada, move foco e seleção para a aba anterior/próxima com wrap nas pontas; Home e End vão para a primeira e a última. |
| `Enter` | Num cartão, escolhe o starter e preenche o composer com foco; no composer, envia a mensagem. |
| `Shift+Enter` | No composer, insere quebra de linha sem enviar. |
| `Esc` | Durante o envio, aborta a chamada; o anúncio diz "Stopped" e o estado volta ao de pronto. |

## Accessibility

- A raiz é um <section> rotulado; o tablist usa role=tablist com aria-selected e roving tabindex — só a aba ativa entra no percurso de foco.
- Uma live region polida (role=status) anuncia a escolha do cartão ("Picked <título>. The composer is filled."), o shuffle, o envio, a conclusão ("Sent", com "simulated" quando onSubmit não existe), o aborto e o erro.
- Nenhum estado depende só de cor: o envio mostra o texto "Sending…", o sucesso soma Check + "Sent", o erro soma TriangleAlert + a mensagem + botão Retry, e o botão enviar troca de forma (seta vira quadrado) além de cor.
- Cada cartão tem nome acessível composto: título, o app usado quando há (", uses Gmail") e a categoria.
- Todos os ícones são aria-hidden; o composer tem aria-label="Message" e o shuffle tem rótulo próprio.

## Motion

- O shuffle troca a página por célula com AnimatePresence mode="wait": cada célula sai (160 ms, 100 ms quando fica vazia) e entra em 160 ms com subida de 2 px, com stagger de 35 ms por cartão.
- Escolher um cartão re-dispara um fade de 160 ms sobre o texto recém-preenchido no composer, ligando visualmente o cartão ao campo.
- O esqueleto de carregamento respira numa animação CSS pura de 1,6 s (opacidade 0,55 a 1), sem JavaScript por frame.
- Com movimento reduzido: entradas e saídas viram opacidade de duração zero, o stagger some e o fade do texto e a respiração do esqueleto desligam.

## Responsive behavior

- Container queries na própria raiz: abaixo de 560 px a grade vira uma coluna e o tablist ganha fades nas bordas para anunciar o rolamento; abaixo de 440 px o rótulo do Shuffle vira só o ícone.
- O composer cresce até 132 px de altura e rola internamente; nada do painel ultrapassa a largura do container.
- Os slots da grade ficam reservados mesmo quando a categoria tem poucos starters, então trocar de aba nunca desloca o composer.

## Performance

- A tela mostra sempre `count` cartas (default 4) independentemente do tamanho da pool: o filtro roda num useMemo e o DOM permanece constante.
- O shuffle apenas muda um offset num estado local; nenhum prompt é recriado nem reordenado fisicamente.
- Toda animação é transform/opacity (motion + CSS); o auto-resize do textarea mede scrollHeight uma vez por mudança de texto.

## Notes for AI

- Passe prompts próprios com id, category, title, uma description curta (uma linha) e o prompt completo — o cartão mostra title/description e o composer recebe o prompt inteiro.
- Declare as categorias que existem: abas sem um único starter somem sozinhas da lista, e "All" está sempre presente.
- Sem onSubmit o envio é simulado (1,4 s) e anunciado como simulado — ideal para demos; em produção ligue seu onSubmit e respeite o AbortSignal recebido para o Esc funcionar.
- model aceita { name, mark } para a tag do rodapé; o default é a spark da casa com "Claude Sonnet 5.5".
- count controla a grade (2×2 com 4); loading mostra o esqueleto com o mesmo tamanho e ritmo antes dos dados chegarem.
- Para pré-preenchimento programático use value/onValueChange ou defaultValue; escolher um cartão chama onSelect com o StarterPrompt completo.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/starter-prompts · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
