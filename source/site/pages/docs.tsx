import { useCallback, useEffect, useId, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUp, ChevronRight } from "lucide-react";
import ThemeSwitch from "@/registry/components/theme-switch/theme-switch";
import { CodeCard, type CodeLanguage } from "@/site/components/item-code-card";
import { href } from "@/site/lib/router";
import { setAccent, useTheme, accents, type Accent } from "@/site/lib/theme";
import { switchTheme } from "@/site/lib/theme-transition";
import { registryUrl, site } from "@/site/lib/site-config";
import styles from "./docs.module.css";

export type DocsPageId = "installation" | "theming" | "license";

const accentNames: Record<Accent, string> = { lime: "Lime", neutral: "Neutral", violet: "Violet", blue: "Blue", green: "Green", amber: "Amber", orange: "Orange", coral: "Coral", rose: "Rose" };
const accentSwatch: Record<Accent, string> = { lime: "#ddfc74", neutral: "var(--neutral-9)", violet: "#7747ff", blue: "#0562ef", green: "#0db879", amber: "#f3ad20", orange: "#f48120", coral: "#f15f55", rose: "#ed4e9d" };

/** Playground ao vivo: o mesmo <html data-theme data-accent> que o site inteiro usa. */
function ThemePlayground() {
  const { theme, accent } = useTheme();
  return (
    <div className={styles.playground}>
      <div className={styles.playgroundRow}>
        <span className={styles.playgroundLabel}>Theme</span>
        <ThemeSwitch theme={theme} iconOnly label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onThemeChange={(next, _variant, trigger) => switchTheme(next, trigger, "reveal")} />
      </div>
      <div className={styles.playgroundRow}>
        <span className={styles.playgroundLabel}>Accent color</span>
        <div className={styles.swatches} role="radiogroup" aria-label="Accent color">
          {accents.map(name => (
            <button key={name} type="button" role="radio" aria-checked={accent === name} aria-label={accentNames[name]} title={accentNames[name]} className={styles.swatch} style={{ background: accentSwatch[name] }} onClick={() => setAccent(name)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Um comando de terminal e um trecho de código, no mesmo cartão de código da página de item. */
function Command({ code, label }: { code: string; label: string }) {
  return <CodeCard label={label} code={code} language="bash" filename="Terminal" gutter="prompt" />;
}
function Snippet({ code, filename, language }: { code: string; filename: string; language: CodeLanguage }) {
  return <CodeCard label={`Code of ${filename}`} code={code} language={language} filename={filename} gutter={code.includes("\n") ? "lines" : "none"} />;
}

const designTokens: [string, string][] = [
  ["--background, --surface, --surface-raised, --surface-muted", "Page and panel backgrounds, in four elevation levels without shadows."],
  ["--foreground, --text-secondary, --text-muted", "Primary, secondary and muted text."],
  ["--border, --border-subtle, --border-strong", "Three border strengths, from divider to focus."],
  ["--accent, --accent-strong, --accent-subtle, --accent-foreground", "The accent color: text on top of it never loses contrast in either theme."],
  ["--success, --warning, --danger, --info", "Status colors, always above 4.5:1 on the surface."],
  ["--radius-control, --radius-panel, --radius-surface, --radius-pill", "Corner radii for buttons, cards, pages and pills."],
  ["--shadow-resting, --shadow-raised, --shadow-floating", "Shadows for resting, hover and overlays."],
  ["--space-1 … --space-24", "Spacing scale in rem; it spaces every layout."],
  ["--text-xs … --text-5xl", "Type scale, with --tracking-display and --leading-* for each context."],
  ["--duration-*, --ease-*", "Durations and curves; --ease-spring is a critically damped spring, with no overshoot."],
];

interface DocSection { id: string; title: string; body: ReactNode }
interface DocPage { title: string; documentTitle: string; lead: ReactNode; intro?: ReactNode; sections: DocSection[] }

const pages: Record<DocsPageId, () => DocPage> = {
  installation: () => ({
    title: "Installation",
    documentTitle: "Installation",
    lead: <>ryan-ui is not a package you import: it is a code registry. Each item copies its files into your project — after that they are yours, with no version to keep up with.</>,
    sections: [
      { id: "pre-requisitos", title: "Prerequisites", body: (
        <ul className={styles.list}>
          <li><code>React 19</code> with TypeScript.</li>
          <li>A bundler with the <code>@/</code> alias pointing to the project root (Vite and Next.js: default).</li>
          <li>Node 20.19 or newer for the CLI.</li>
        </ul>
      ) },
      { id: "tokens", title: "1 · The tokens, once", body: <>
        <p>The design and motion tokens come first. The command installs <code>foundation.css</code> and <code>motion-tokens.ts</code> together.</p>
        <Command label="Command that installs the tokens" code={`npx shadcn@latest add ${registryUrl("ryan-foundation")}`} />
        <p>Then import the CSS once, at the root of the app:</p>
        <Snippet code={`import "@/components/ryan-ui/foundation.css";`} filename="main.tsx" language="tsx" />
        <p className={styles.note}>Without this import, components render without color, radius or spacing. It is the only global step — no item asks for anything else.</p>
      </> },
      { id: "itens", title: "2 · Add items", body: <>
        <p>Each page on the site has its own install command in the <strong>Installation</strong> section. For example, for the button:</p>
        <Command label="Command that installs the button" code={`npx shadcn@latest add ${registryUrl("button")}`} />
        <p>Then import it where you use it:</p>
        <Snippet code={`import { Button } from "@/components/ryan-ui/button/button";`} filename="App.tsx" language="tsx" />
        <p className={styles.note}>Items that use other items bring those files along — you do not need to install internal dependencies one by one.</p>
      </> },
      { id: "manual", title: "Manual", body: (
        <ol className={styles.steps}>
          <li><p>Install the npm packages the item lists in its Installation section.</p></li>
          <li><p>Copy the files from the <strong>Code</strong> tab to the paths shown there.</p></li>
          <li><p>Make sure <code>foundation.css</code> and <code>motion-tokens.ts</code> are already in your project (step 1).</p></li>
        </ol>
      ) },
      { id: "midia", title: "Demo media", body: <>
        <p>Avatars and photos in the examples live in <code>public/media/</code>, all script-generated SVGs with no third-party assets. If your site lives in a subfolder, set this before the components load:</p>
        <Snippet code={`window.__RYAN_UI_MEDIA__ = "./media";`} filename="index.html" language="ts" />
      </> },
    ],
  }),
  theming: () => ({
    title: "Theming and tokens",
    documentTitle: "Theming and tokens",
    lead: <>Two themes and nine accent colors, switched by two attributes on <code>&lt;html&gt;</code>. No per-screen classes: every value comes from tokens.</>,
    intro: <ThemePlayground />,
    sections: [
      { id: "tema", title: "Light and dark theme", body: <>
        <p>The theme is the <code>data-theme</code> attribute on the document root. To avoid a flash on first paint, apply it before the CSS loads — this is the script the site uses, adapted to your app:</p>
        <Snippet code={`<script>
  (function () {
    var theme = localStorage.getItem("theme") || "system";
    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
  })();
</script>`} filename="index.html" language="tsx" />
        <p className={styles.note}>It also works per part: any element accepts <code>data-theme="dark"</code> and inherits the dark values inside it.</p>
      </> },
      { id: "cor", title: "Accent color", body: <>
        <p>The <code>data-accent</code> attribute picks one of nine palettes tuned for both themes. The default is lime (<code>#DDFC74</code>), always used as a solid fill with dark text; neutral follows the page gray:</p>
        <p>{accents.map((name, index) => <span key={name}><code>{name}</code>{index < accents.length - 1 ? " · " : ""}</span>)}</p>
        <p className={styles.note}>Try it above: the change covers the whole site, including the demos. Components only read <code>--accent</code> and what derives from it — never a fixed color.</p>
      </> },
      { id: "tokens", title: "Design tokens", body: <>
        <div className={styles.tableWrap} role="group" aria-label="Design tokens" tabIndex={0}>
          <table className={styles.table}>
            <thead><tr><th scope="col">Token</th><th scope="col">Purpose</th></tr></thead>
            <tbody>
              {designTokens.map(([token, use]) => <tr key={token}><th scope="row"><span className={styles.tokens}>{token.split(", ").map(name => <code key={name}>{name}</code>)}</span></th><td>{use}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>Motion has its own home: <code>motion-tokens.ts</code> exports named durations, curves and springs that every component uses. And everything respects <code>prefers-reduced-motion</code>: with the preference on, motion becomes a direct swap.</p>
      </> },
    ],
  }),
  license: () => ({
    title: "License and credits",
    documentTitle: "License and credits",
    lead: <>The free items of ryan-ui are distributed under the MIT license: use, modify and distribute them, including commercially, as long as you keep this notice. The terms for Pro items will be published before Pro goes on sale.</>,
    sections: [
      { id: "licenca", title: "MIT license", body: (
        <div className={styles.licenseBox}>
          <p><strong>MIT License</strong></p>
          <p>Copyright (c) 2026 Elia Kuratli</p>
          <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
          <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p className={styles.noWrap}>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        </div>
      ) },
      { id: "creditos", title: "Credits", body: (
        <ul className={styles.list}>
          <li>The free items — components, blocks, tokens and motion — come from the open source core of <a href={site.upstream.repository} target="_blank" rel="noreferrer">Arc</a>, by Elia Kuratli, released under MIT. The original copyright notice is kept here as the license requires.</li>
          <li>The demo media (avatars and photos) is generated by script from fixed seeds: there are no photographs or third-party images.</li>
          <li>Typography: Geist and Inter, from Google Fonts, via <code>@fontsource-variable</code> (OFL/Apache).</li>
        </ul>
      ) },
    ],
  }),
};

/** Distância do topo da janela em que uma seção passa a contar como "a atual": onde ela para ao ser escolhida no índice, mais uma folga. */
const spyOffset = (section: HTMLElement) => (parseFloat(getComputedStyle(section).scrollMarginTop) || 0) + 72;

/** O índice "Nesta página": um link por seção, com a seção à vista marcada. */
function Rail({ page, sections }: { page: DocsPageId; sections: DocSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const titleId = useId();
  /*
   * Depois de um clique no índice, a seção escolhida fica marcada enquanto a página rola até ela, mesmo que a página acabe
   * antes de o título chegar ao topo (as últimas seções). A marca volta a seguir a rolagem quando ela para, ou quando a pessoa
   * mexe (roda, toque, tecla, clique).
   */
  const locked = useRef(false);
  const lockTimer = useRef(0);
  const settle = useCallback(() => { window.clearTimeout(lockTimer.current); lockTimer.current = window.setTimeout(() => { locked.current = false; }, 160); }, []);

  useEffect(() => {
    let frame = 0;
    const unlock = () => { locked.current = false; window.clearTimeout(lockTimer.current); };
    const sync = () => {
      let current = sections[0]?.id ?? "";
      for (const section of sections) { const node = document.getElementById(section.id); if (node && node.getBoundingClientRect().top <= spyOffset(node)) current = section.id; }
      // No fim da página a última seção pode não alcançar o topo: ela vale mesmo assim.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 && window.scrollY > 0) current = sections[sections.length - 1]?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (locked.current) { settle(); return; }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const intents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    intents.forEach(type => window.addEventListener(type, unlock, { passive: true, capture: true }));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(lockTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      intents.forEach(type => window.removeEventListener(type, unlock, { capture: true }));
    };
  }, [sections, settle]);

  // O link aponta para a própria página (as rotas usam o hash); o clique rola até a seção.
  const jump = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const node = document.getElementById(id);
    if (!node) return;
    // O clique e a tecla que acionaram o link já passaram pelos ouvintes acima; a trava vale a partir daqui.
    locked.current = true;
    settle();
    node.scrollIntoView({ block: "start" });
    node.focus({ preventScroll: true });
    setActive(id);
  };

  return (
    <aside className={styles.rail}>
      <nav aria-labelledby={titleId}>
        <p id={titleId} className={styles.railTitle}>On this page</p>
        <ul className={styles.railList}>
          {sections.map(section => <li key={section.id}><a href={href(page === "installation" ? "/docs" : `/docs/${page}`)} aria-current={active === section.id ? "location" : undefined} onClick={jump(section.id)}>{section.title}</a></li>)}
        </ul>
      </nav>
      <div className={styles.railExtra}>
        <button type="button" className={styles.railTop} onClick={() => window.scrollTo({ top: 0 })}><span>Back to top</span><ArrowUp size={13} strokeWidth={1.75} aria-hidden="true" /></button>
      </div>
    </aside>
  );
}

export function DocsPage({ page }: { page: DocsPageId }) {
  const { title, documentTitle, lead, intro, sections } = useMemo(() => pages[page](), [page]);
  useEffect(() => { document.title = `${documentTitle} · ${site.name}`; }, [documentTitle]);

  return (
    <div className={styles.page}>
      <article className={styles.content}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <ol>
            <li><a href={href("/docs")}>Docs</a></li>
            <li aria-hidden="true"><ChevronRight size={14} strokeWidth={1.75} /></li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
        <header className={styles.header}>
          <h1>{title}</h1>
          <p className={styles.lead}>{lead}</p>
        </header>
        {intro}
        {sections.map(section => (
          <section key={section.id} id={section.id} className={styles.section} tabIndex={-1} aria-labelledby={`${section.id}-titulo`}>
            <h2 id={`${section.id}-titulo`}>{section.title}</h2>
            {section.body}
          </section>
        ))}
      </article>
      <Rail key={page} page={page} sections={sections} />
    </div>
  );
}
