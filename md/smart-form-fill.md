# Smart form fill

> Formulário que se preenche com IA: você cola uma assinatura de e-mail ou anotações, os campos recebem um valor de cada vez com ponto de confiança, a fonte de cada valor fica destacada no texto colado, apostas baixas pedem revisão e o Undo devolve os valores anteriores.

- Type: component (category Special), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/smart-form-fill
- Original description: A paste-to-fill form card where AI reads an email signature or rough notes and fills the contact field by field with a confidence dot, lights up each value's source in the pasted text, flags low-confidence guesses for review, and Undo restores the old values.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/smart-form-fill.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/smart-form-fill.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/smart-form-fill.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/smart-form-fill.json`. Registry path, relative to the site address: `r/smart-form-fill.json`.

- npm packages: `motion`, `lucide-react`
- Files, once installed:
  - `components/ryan-ui/smart-form-fill/smart-form-fill.tsx`
  - `components/ryan-ui/smart-form-fill/smart-form-fill.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion lucide-react`.
2. Copy the files listed above. The content of each one is in `r/smart-form-fill.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- Criar um registro a partir de texto não estruturado: contato de CRM, perfil de fornecedor ou endereço a partir de uma assinatura colada.
- Fluxos em que a pessoa cola um e-mail encaminhado ou anotações e espera o formulário se preencher sozinho, com revisão antes do save.
- Onboarding onde digitar seis campos à mão é a principal fricção.

## When not to use

- Digitação simples sem fonte não estruturada: use [`input`](input.md) e [`textarea`](textarea.md).
- Aplicações longas multi-página: adicione uma etapa de colar em vez de usar o cartão inteiro.
- Importação em lote de muitos registros: prefira um fluxo de importação de tabela.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { SmartFormFill } from "@/components/ryan-ui/smart-form-fill/smart-form-fill";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 700 };

export default function SmartFormFillDemo() {
  return (
    <Stack gap={3} width={680}>
      <SmartFormFill />
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `SmartFormFill`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` | `SmartFormFillField[]` | `defaultContactFields` | — |
| `defaultValues` | `Record<string, string>` | `{}` | — |
| `onValuesChange` | `(values: Record<string, string>) => void` | — | — |
| `extract` | `(text: string, signal: AbortSignal) => Promise<SmartFormFillResult>` | `simulatedExtract` | — |
| `reviewThreshold` | `number` | `.8` | Campos abaixo disso pedem revisão e seguram o salvar até serem checados ou editados. |
| `samples` | `{ label: string; text: string }[]` | `[{ label: "Signature", text: SIGNATURE_SAMPLE…` | — |
| `autoPlay` | `boolean` | — | — |
| `onFill` | `(result: SmartFormFillResult) => void` | — | — |
| `onUndo` | `(restored: Record<string, string>) => void` | — | — |
| `onSubmit` | `(values: Record<string, string>) => void \| Promise<void>` | — | — |
| `resolveLogo` | `(company: string) => React.ReactNode \| undefined` | — | — |
| `model` | `{ name: string; mark?: React.ReactNode }` | `{ name: "Claude Haiku 5.5", mark: <ClaudeMark…` | — |
| `title` | `string` | `"New contact"` | — |
| `description` | `string` | `"Paste a signature, an email or rough notes. …` | — |
| `submitLabel` | `string` | `"Save contact"` | — |
| `className` | `string` | — | — |

### Exported types

| Type | Definition |
| --- | --- |
| `SmartFormFillResult` | `Record<string, SmartFormFillExtracted>` |

#### `SmartFormFillField`

| Field | Type | Description |
| --- | --- | --- |
| `id` (required) | `string` | — |
| `label` (required) | `string` | — |
| `kind` | `"text" \| "email" \| "tel" \| "phone" \| "url" \| "company"` | "company" ativa o slot de logotipo; o resto vira o tipo nativo do input. |
| `placeholder` | `string` | — |
| `span` | `boolean` | Ocupa a linha inteira na grade de dois campos. |
| `autoComplete` | `string` | — |

#### `SmartFormFillExtracted`

| Field | Type | Description |
| --- | --- | --- |
| `value` (required) | `string` | — |
| `confidence` (required) | `number` | 0 a 1. |
| `source` | `string` | Substringa exata do texto colado que originou o valor (liga causa e efeito). |
| `note` | `string` | Explica uma confiança baixa. |

### Other exports

- `defaultContactFields` (value)

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` | Percorre área de colar, Edit text, cada campo, botões Check, Undo e Save contact. |
| `Esc` | Interrompe uma leitura em andamento sem alterar nada. |
| `Ctrl + Enter` or `Cmd + Enter` | No modo Edit text, lê o texto digitado na área. |

## Accessibility

- Região `aria-live` polida anuncia leitura, quantos campos foram preenchidos, pendências de revisão, checagem, undo e salvamento.
- Cada campo preenchido recebe `aria-description` com a confiança (e a nota, quando baixa); campos pendentes ficam `aria-invalid` até serem checados ou editados.
- Confiança nunca é só cor: ponto mais porcentagem ou palavra (Review, Checked, Edited); o botão Check nomeia o campo no `aria-label`.

## Motion

- Os campos se preenchem em ordem com 140 ms de intervalo: o valor aparece em 200 ms e a moldura respira um tom do accent por 900 ms, sem mudança de tamanho.
- Trechos-fonte têm três tons por confiança: neutro (≥98%), âmbar suave (92–97%) e âmbar forte (<92%); ativo, hover ou foco ficam sempre no tom forte. Selos e rótulos trocam num crossfade (100 ms / 160 ms com 2 px) e o rótulo de leitura usa shimmer.
- Com “reduzir movimento”, todos os campos preenchem de uma vez, sem respiração nem shimmer, e o loop de autoplay desliga; todos os estados finais são mantidos. O autoplay pausa fora da tela e para para sempre no primeiro toque dentro do cartão.

## Responsive behavior

- Container queries: de 720 px para cima o texto colado fica à esquerda e o formulário à direita; abaixo disso o bem de colar empilha acima.
- Abaixo de 440 px cada campo ocupa a linha inteira e o rodapé empilha status sobre as ações.

## Performance

- Só CSS anima respiração, shimmer e spin; motion faz apenas os pequenos crossfades. Sem layout animation, seguro para uma instância por tela.

## Notes for AI

- Ligue `extract` ao seu modelo com saída estruturada `{ value, confidence, source }`, onde `source` é a substring exata do texto colado — ela alimenta o destaque que liga causa e efeito.
- Mantenha `reviewThreshold` perto de 0.8 para apostas (estado inferido, título reformulado, um de vários telefones) ficarem marcadas e bloquearem o Save até serem checados.
- Em produto use `autoPlay={false}`; o loop padrão é para docs e marketing. Colar no modo edição agenda a leitura ~700 ms depois e o botão principal é `Fill`. `resolveLogo` aceita seus logotipos; há marca da Stripe embutida e chip genérico para o resto.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/smart-form-fill · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
