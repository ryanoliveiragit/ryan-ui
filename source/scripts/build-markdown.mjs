/**
 * Gera a versão em Markdown de cada item, para assistentes de código ("Copiar página" e "Ver em Markdown" na página de item),
 * e o índice da biblioteca para assistentes:
 *
 *   public/md/<nome>.md   título, descrição, instalação (comando e caminho do registro), dependências, arquivos, código de uso,
 *                         tabelas de props e, quando o item tem guia, as seções do guia
 *   public/llms.txt       uma linha por item: título, tipo, descrição de uma linha e o link do .md
 *
 *   node scripts/build-markdown.mjs [--base https://endereco.do/site/]
 *
 * O endereço do site entra no comando de instalação e nos links. Ordem: --base, a variável SITE_URL, `homepage` do
 * registry.json (se for um endereço de verdade) e, por último, o GitHub Pages do repositório de site/lib/site-config.ts
 * (https://<dono>.github.io/<repo>/), que é onde o site está publicado hoje. O script diz qual usou.
 *
 * Lê: site/generated/catalog.json, site/generated/api.json, registry.json, site/content/docs/*.json,
 * site/content/versions.json e site/demos/<nome>.tsx. Rode depois de build-catalog e build-api.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const readJson = file => JSON.parse(read(file));
const args = process.argv.slice(2);
const option = name => { const index = args.indexOf(`--${name}`); return index > -1 ? args[index + 1] : undefined; };

const catalog = readJson("site/generated/catalog.json");
const api = readJson("site/generated/api.json");
const registry = readJson("registry.json");
const registryByName = new Map(registry.items.map(item => [item.name, item]));
const items = catalog.items;
const byName = new Map(items.map(item => [item.name, item]));

/* ---------- Endereço do site ---------- */

function siteBase() {
  const candidates = [
    ["--base", option("base")],
    ["SITE_URL", process.env.SITE_URL],
    ["registry.json homepage", registry.homepage],
  ];
  for (const [source, value] of candidates) if (value && /^https?:\/\//.test(value)) return { base: value.replace(/\/?$/, "/"), source };
  const repository = /repository:\s*"https:\/\/github\.com\/([^/"]+)\/([^/"]+?)(?:\.git)?"/.exec(read("site/lib/site-config.ts"));
  if (repository) return { base: `https://${repository[1].toLowerCase()}.github.io/${repository[2]}/`, source: "GitHub Pages do repositório (site/lib/site-config.ts)" };
  return { base: "", source: "nenhum: links relativos" };
}
const { base, source: baseSource } = siteBase();
const at = relative => (base ? `${base}${relative}` : relative);

/* ---------- Dados do site ---------- */

const categories = [["actions", "Actions"], ["inputs", "Inputs"], ["disclosure", "Disclosure"], ["feedback", "Feedback"], ["data", "Data"], ["text", "Text"], ["ai", "AI agents"], ["games", "Games"], ["special", "Special"], ["blocks", "Blocks"]];
const categoryLabel = id => categories.find(([key]) => key === id)?.[1] ?? id;
const describe = item => (item.descricao ?? item.description).replace(/\s+/g, " ").trim();
const kindLabel = item => (item.kind === "block" ? "block" : "component");
const pagePath = item => `#/${item.kind === "block" ? "b" : "c"}/${item.name}`;
const installedPath = target => target.replace("@components/", "components/");

const guides = {};
const guideDir = path.join(root, "site", "content", "docs");
if (fs.existsSync(guideDir)) for (const file of fs.readdirSync(guideDir).filter(name => name.endsWith(".json")).sort()) {
  try { Object.assign(guides, JSON.parse(fs.readFileSync(path.join(guideDir, file), "utf8"))); }
  catch (error) { console.warn(`aviso: ${file} não é JSON válido (${error.message}); ficou de fora`); }
}

/** Versões por item (site/content/versions.json): o grupo inteiro, na ordem do arquivo. */
const versionsOf = new Map();
const versionsFile = path.join(root, "site", "content", "versions.json");
if (fs.existsSync(versionsFile)) for (const group of Object.values(JSON.parse(fs.readFileSync(versionsFile, "utf8")))) {
  const present = group.filter(entry => byName.has(entry.name));
  if (present.length > 1) for (const entry of present) versionsOf.set(entry.name, present);
}

/* ---------- Markdown ---------- */

/** Cerca de código mais longa que qualquer sequência de crases dentro do código. */
function fence(code, language) {
  const longest = Math.max(2, ...[...code.matchAll(/`+/g)].map(match => match[0].length));
  const marks = "`".repeat(longest + 1);
  return `${marks}${language}\n${code.replace(/\s+$/, "")}\n${marks}`;
}
/** Código em linha, com crases suficientes se o texto tiver crase. */
const code = text => { const value = String(text); const ticks = value.includes("`") ? "``" : "`"; return ticks === "``" ? `\`\` ${value} \`\`` : `\`${value}\``; };
/** Célula de tabela: sem quebra de linha e com a barra vertical escapada. */
const cell = text => String(text).replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|");
const row = cells => `| ${cells.map(cell).join(" | ")} |`;
const table = (head, rows) => [row(head), `| ${head.map(() => "---").join(" | ")} |`, ...rows.map(row)].join("\n");
/** "a, b e c". */
const sentence = parts => (parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`);
/** Nome de item entre crases vira link para o .md dele (mesma pasta). */
const linkItems = (text, current) => text.replace(/`([a-z0-9]+(?:-[a-z0-9]+)*)`/g, (match, name) => (name !== current && byName.has(name) ? `[\`${name}\`](${name}.md)` : match));

/* ---------- API (mesma leitura da página de item) ---------- */

function splitTop(text) {
  const parts = [];
  let depth = 0, start = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if ("<({[".includes(char)) depth++;
    else if (">)}]".includes(char) && text[index - 1] !== "=") depth--;
    else if (char === "," && depth === 0) { parts.push(text.slice(start, index).trim()); start = index + 1; }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}
/** `Omit<X, "a" | "b">` → { base: X, omitted: [a, b] }. */
function readInherited(entry) {
  const match = /^Omit<([\s\S]+)>$/.exec(entry.trim());
  const parts = match ? splitTop(match[1]) : [];
  if (parts.length !== 2) return { base: entry, omitted: [] };
  return { base: parts[0], omitted: [...parts[1].matchAll(/"([^"]+)"|'([^']+)'/g)].map(found => found[1] ?? found[2]) };
}

function propsTable(type, defaults, aliases) {
  const rows = (type.members ?? []).map(member => [
    `${code(member.name)}${member.optional ? "" : " (required)"}`,
    code(aliases.get(member.type) ?? member.type),
    ...(defaults ? [defaults[member.name] ? code(defaults[member.name]) : "—"] : []),
    member.doc || "—",
  ]);
  const inherited = (type.extends ?? []).map(readInherited);
  if (inherited.length) {
    const omitted = inherited.flatMap(entry => entry.omitted);
    rows.push([code("...props"), inherited.map(entry => code(entry.base)).join(", "), ...(defaults ? ["—"] : []), `Also accepts the props of ${inherited.length === 1 ? "this type" : "these types"}${omitted.length ? `, except ${sentence(omitted.map(code))}` : ""}.`]);
  }
  return table([defaults ? "Prop" : "Field", "Type", ...(defaults ? ["Default"] : []), "Description"], rows);
}

function apiSection(data) {
  if (!data) return [];
  const { components = [], types = [], exports = [] } = data;
  const typeByName = new Map(types.map(type => [type.name, type]));
  const aliases = new Map(types.filter(type => type.kind === "type" && !type.members?.length && type.text && type.text.length <= 120).map(type => [type.name, type.text]));
  const usedAsProps = new Set(components.map(component => component.props));
  const otherTypes = types.filter(type => type.exported && !usedAsProps.has(type.name));
  const definitions = otherTypes.filter(type => !type.members?.length && type.text);
  const shapes = otherTypes.filter(type => type.members?.length);
  const others = exports.filter(entry => entry.kind !== "component");
  if (!components.length && !otherTypes.length && !others.length) return [];
  const out = ["## API reference", "", "Extracted from the source code. Prop descriptions come from code comments."];
  for (const component of components) {
    const type = typeByName.get(component.props);
    out.push("", `### ${code(component.name)}`);
    if (component.doc) out.push("", component.doc);
    if (type && (type.members?.length || type.extends?.length)) out.push("", propsTable(type, component.defaults ?? {}, aliases));
    else if (type?.text) out.push("", `Props: ${code(type.text)}`);
    else out.push("", "No props of its own: accepts those of the element or primitive it wraps.");
  }
  if (definitions.length || shapes.length) {
    out.push("", "### Exported types");
    if (definitions.length) out.push("", table(["Type", "Definition"], definitions.map(type => [`${code(type.name)}${type.doc ? `: ${type.doc}` : ""}`, code(type.text)])));
    for (const type of shapes) {
      out.push("", `#### ${code(type.name)}`);
      if (type.doc) out.push("", type.doc);
      out.push("", propsTable(type, null, aliases));
    }
  }
  if (others.length) out.push("", "### Other exports", "", ...others.map(entry => `- ${code(entry.name)} (${{ hook: "hook", function: "function", const: "value" }[entry.kind] ?? entry.kind})`));
  return out;
}

/* ---------- Uma página por item ---------- */

/** O código do demo com os imports como ficam num projeto que instalou o item pela CLI (igual à seção "Uso" do site). */
function usage(item) {
  const file = path.join(root, "site", "demos", `${item.name}.tsx`);
  if (!fs.existsSync(file)) return [];
  const source = fs.readFileSync(file, "utf8")
    .replace(/from "@\/registry\/(?:components|blocks)\//g, match => (match.includes("/blocks/") ? 'from "@/components/ryan-ui/blocks/' : 'from "@/components/ryan-ui/'))
    .replace(/from "@\/lib\//g, 'from "@/components/ryan-ui/lib/');
  const notes = ["The demo from the item page, with imports as they look after installing through the CLI."];
  if (/from "\.\/_kit"/.test(source)) notes.push("`Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.");
  if (/from "\.\/[\w-]+\.module\.css"/.test(source)) notes.push("The `.module.css` file imported by the demo belongs to the example only.");
  return ["## Usage", "", notes.join(" "), "", fence(source, "tsx")];
}

/** As seções do guia, na ordem da página: "Quando usar" e "Quando não usar" antes da instalação, o resto depois da API. */
function guideSections(item) {
  const guide = guides[item.name];
  const before = [], after = [];
  if (!guide) return { before, after };
  const list = (target, title, entries, link = false) => { if (entries?.length) target.push(`## ${title}`, "", ...entries.map(text => `- ${link ? linkItems(text, item.name) : text}`), ""); };
  list(before, "When to use", guide.quandoUsar);
  list(before, "When not to use", guide.quandoEvitar, true);
  if (guide.teclado?.length) after.push("## Keyboard", "", table(["Keys", "Action"], guide.teclado.map(entry => [entry.teclas.map(code).join(" or "), entry.acao])), "");
  list(after, "Accessibility", guide.acessibilidade);
  list(after, "Motion", guide.movimento);
  list(after, "Responsive behavior", guide.responsivo);
  list(after, "Performance", guide.desempenho);
  list(after, "Notes for AI", guide.notasIA);
  return { before, after };
}

function itemMarkdown(item) {
  const entry = registryByName.get(item.name);
  const files = (entry?.files ?? []).map(file => installedPath(file.target));
  const requires = item.requires.map(name => byName.get(name)).filter(Boolean);
  const registryPath = `r/${item.name}.json`;
  const command = `npx shadcn@latest add ${at(registryPath)}`;
  const versions = versionsOf.get(item.name);
  const guide = guideSections(item);

  const out = [`# ${item.title}`, "", `> ${describe(item)}`, ""];
  out.push(`- Type: ${kindLabel(item)}${item.kind === "component" ? ` (category ${categoryLabel(item.category)})` : ""}${item.isNew ? ", new in ryan-ui" : ""}`);
  out.push(`- Page: ${at(pagePath(item))}`);
  if (item.descricao && item.description) out.push(`- Original description: ${item.description.replace(/\s+/g, " ").trim()}`);
  if (versions) out.push(`- Versions: ${versions.map(version => `${version.label} (${version.variant ? `${code(version.name)} with ${code(`variant="${version.variant}"`)}` : version.name === item.name ? "this item" : `[${code(version.name)}](${version.name}.md)`})`).join(", ")}`);
  out.push("");

  out.push("## Installation", "", "With the shadcn CLI (one command copies the code and installs the dependencies):", "", fence(command, "bash"), "");
  out.push(`With another package manager: ${code(`pnpm dlx shadcn@latest add ${at(registryPath)}`)}, ${code(`yarn dlx shadcn@latest add ${at(registryPath)}`)} or ${code(`bunx --bun shadcn@latest add ${at(registryPath)}`)}. Registry path, relative to the site address: ${code(registryPath)}.`, "");
  out.push(`- npm packages: ${item.dependencies.length ? item.dependencies.map(code).join(", ") : "none besides React"}`);
  if (requires.length) out.push(`- Uses other ryan-ui items (installed along with it): ${requires.map(other => `[${other.title}](${other.name}.md)`).join(", ")}`);
  if (files.length) out.push("- Files, once installed:", ...files.map(file => `  - ${code(file)}`));
  out.push("", `First time in the project: install the foundation once (${code(`npx shadcn@latest add ${at("r/ryan-foundation.json")}`)}) and import ${code("@/components/ryan-ui/foundation.css")} at the root of the app. Requires React 19 and the ${code("@/")} alias.`, "");
  out.push("### Manual", "", `1. Install the packages: ${item.dependencies.length ? code(`npm install ${item.dependencies.join(" ")}`) : "there are no packages to install"}.`, `2. Copy the files listed above. The content of each one is in ${code(registryPath)} (field ${code("files[].content")}).`, `3. Make sure ${code("foundation.css")} (the tokens) and ${code("motion-tokens.ts")} are already in your project.`, "");

  out.push(...guide.before);
  const usageLines = usage(item);
  if (usageLines.length) out.push(...usageLines, "");
  const apiLines = apiSection(api[item.name]);
  if (apiLines.length) out.push(...apiLines, "");
  out.push(...guide.after);
  out.push("---", "", `ryan-ui · ${at(pagePath(item))} · index for assistants: ${at("llms.txt")}`, "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/* ---------- Gravação ---------- */

const outDir = path.join(root, "public", "md");
// A pasta é inteira gerada: limpa para nenhum arquivo de item removido sobreviver.
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
let withGuide = 0;
for (const item of items) {
  fs.writeFileSync(path.join(outDir, `${item.name}.md`), itemMarkdown(item));
  if (guides[item.name]) withGuide += 1;
}

const components = items.filter(item => item.kind === "component").length;
const blocks = items.length - components;
const index = [
  "# ryan-ui",
  "",
  `> React components and blocks with motion, built with CSS modules and design tokens, installed with the shadcn CLI: ${components} components and ${blocks} blocks.`,
  "",
  "Each item below has a Markdown file with the install command, the files, the usage code, the API (props) and, when available, the guide (when to use, keyboard, accessibility, motion).",
  "",
  `Before the first item, install the foundation once: ${code(`npx shadcn@latest add ${at("r/ryan-foundation.json")}`)}, and import ${code("@/components/ryan-ui/foundation.css")} at the root of the app. Step by step: ${at("#/docs")}.`,
  "",
];
for (const [id, label] of categories) {
  const group = items.filter(item => item.category === id);
  if (!group.length) continue;
  index.push(`## ${id === "blocks" ? "Blocks" : `Components · ${label}`}`, "");
  for (const item of group) index.push(`- [${item.title}](${at(`md/${item.name}.md`)}): ${kindLabel(item)}. ${describe(item)}`);
  index.push("");
}
fs.writeFileSync(path.join(root, "public", "llms.txt"), index.join("\n"));

console.log(`markdown: ${items.length} itens em public/md/ (${withGuide} com guia) + public/llms.txt; endereço do site: ${base || "(relativo)"} — origem: ${baseSource}`);
