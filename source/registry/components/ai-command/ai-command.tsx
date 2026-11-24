import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LoaderCircle, Search, TriangleAlert, X } from "lucide-react";
import styles from "./ai-command.module.css";

/**
 * AI command — command palette estilo Cmd+K com modo de IA. Busca páginas e ações,
 * ou aperta Tab para perguntar: a resposta chega em streaming dentro do próprio
 * painel, com fontes numeradas ([1], [2]) e passos seguintes executáveis na hora
 * (issue no Linear, doc no Notion…). Sem props toca um walkthrough de exemplo
 * até alguém interagir. O resultado tem altura fixa: nada muda de tamanho enquanto
 * se digita, troca de modo ou recebe o stream.
 */

/* ---------- tipos públicos ---------- */

export interface AiCommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  meta?: string;
  shortcut?: string;
  keywords?: string | string[];
  /** Linhas marcadas como suggested aparecem com a consulta vazia. */
  suggested?: boolean;
  onSelect?: () => void;
}

export interface AiCommandSource {
  id: string;
  title: string;
  description?: string;
  /** Mark de marca ou ícone de 14px. */
  mark?: ReactNode;
  /** Com href, a fonte abre em nova aba em vez de disparar onSourceSelect. */
  href?: string;
}

export interface AiCommandAction {
  id: string;
  label: string;
  meta?: string;
  /** Mark de marca ou ícone de 16px. */
  mark?: ReactNode;
  /** Faz o trabalho; resolve com um rótulo de conclusão ("Created ENG-2481") ou nada. */
  run?: (signal: AbortSignal) => Promise<string | void>;
  runningLabel?: string;
  doneLabel?: string;
  errorLabel?: string;
  /** Onde a ação simulada diz que nada foi enviado de fato. */
  doneMeta?: string;
}

export interface AiCommandAnswer {
  text?: string;
  sources?: AiCommandSource[];
  actions?: AiCommandAction[];
}

interface AiCommandAnswerContext {
  signal: AbortSignal;
  append: (chunk: string) => void;
  setSources: (sources: AiCommandSource[]) => void;
}

export interface AiCommandProps {
  items?: AiCommandItem[];
  onSelect?: (item: AiCommandItem) => void;
  onAsk?: (question: string, ctx: AiCommandAnswerContext) => Promise<AiCommandAnswer | void>;
  onAction?: (action: AiCommandAction, result: string) => void;
  onSourceSelect?: (source: AiCommandSource) => void;
  suggestedQuestions?: string[];
  /** O modelo que responde; aparece no rodapé, na busca e ao lado de cada resposta. */
  model?: { name: string; mark?: ReactNode };
  defaultMode?: "search" | "ask";
  defaultQuery?: string;
  onModeChange?: (mode: "search" | "ask") => void;
  /** Escape com a busca vazia — use para fechar o diálogo ao redor. */
  onClose?: () => void;
  placeholder?: { search?: string; ask?: string };
  thinkingLabel?: string;
  /** Roda o walkthrough; por padrão true sem items e sem onAsk. */
  autoPlay?: boolean;
  /** Escuta Cmd/Ctrl+K na página e foca a busca. */
  hotkey?: boolean;
  /** Altura da área de resultados em px (o painel mantém esse tamanho sempre). */
  height?: number;
  /** Sombra flutuante, para uso dentro de diálogo ou popover. */
  elevated?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

type Mode = "search" | "ask";
type ActionStatus = "idle" | "running" | "done" | "error";

interface ActionState {
  def: AiCommandAction;
  status: ActionStatus;
  result: string;
}

interface AnswerState {
  question: string;
  status: "thinking" | "streaming" | "done" | "error";
  chunks: string[];
  sources: AiCommandSource[];
  actions: ActionState[];
  message: string;
}

type Row =
  | { kind: "header"; id: string; label: string }
  | { kind: "item"; id: string; item: AiCommandItem }
  | { kind: "ask"; id: string; question: string; hintTab: boolean }
  | { kind: "action"; id: string; index: number }
  | { kind: "retry"; id: string; target: "answer" | number };

/* ---------- marcas de exemplo (terceiras partes, traço simplificado) ---------- */

interface MarkProps {
  title?: string;
  size?: number;
}

const markProps = ({ title, size }: MarkProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  role: title ? ("img" as const) : undefined,
  "aria-label": title,
  "aria-hidden": title ? undefined : true,
});

/** Spark da casa — desenha com currentColor (a cor vem do wrapper). */
export function SparkMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <path
        d="M12 3.2c.48 3.86 1.47 6.53 2.85 7.91 1.38 1.38 4.05 2.37 7.91 2.85-3.86.48-6.53 1.47-7.91 2.85-1.38 1.38-2.37 4.05-2.85 7.91-.48-3.86-1.47-6.53-2.85-7.91C7.77 16.43 5.1 15.44 1.24 15 5.1 14.52 7.77 13.53 9.15 12.15 10.53 10.77 11.52 8.1 12 3.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Linear — quadrado azul-violeta com a diagonal branca. */
export function LinearMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#5e6ad2" />
      <path d="M6.8 17.2v-7.1l7.1 7.1h-3.9z" fill="#fff" />
      <path d="M6.8 6.9l10.3 10.3" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

/** Notion — cartela clara com o N. */
export function NotionMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#fdfdfd" stroke="rgba(0,0,0,.25)" strokeWidth=".8" />
      <path d="M8 16.4V7.6h1.8l4.6 5.9V7.6h1.7v8.8h-1.8l-4.6-5.9v5.9H8Z" fill="#111" />
    </svg>
  );
}

/** Slack — hash em quatro cores, traço arredondado. */
export function SlackMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <path d="M9.6 6.4v5.2" stroke="#ecb22e" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M14.4 12.4v4.2" stroke="#36c5f0" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M14.4 6.4v2.6" stroke="#36c5f0" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M6.4 14.4h5.2" stroke="#2eb67d" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M12.6 14.4h5" stroke="#e01e5a" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** Figma — cinco peças em quatro cores. */
export function FigmaMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <path d="M5.8 4.6h2.3a2.3 2.3 0 0 1 0 4.6H5.8z" fill="#f24e1e" />
      <circle cx="8.1" cy="11.9" r="2.3" fill="#a259ff" />
      <path d="M5.8 14.2h4.6v2.3a2.3 2.3 0 0 1-2.3 2.3H5.8z" fill="#1abcfe" />
      <path d="M11.7 4.6h2.3a2.3 2.3 0 0 1 0 4.6h-2.3z" fill="#ff7262" />
      <circle cx="14" cy="11.9" r="2.3" fill="#0acf83" />
    </svg>
  );
}

function UserGlyph({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <circle cx="9.4" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.2 19.2c.6-3 2.7-4.7 5.2-4.7s4.6 1.7 5.2 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.8 5.4a3 3 0 0 1 0 5.2M17.9 14.6c1.4.9 2.3 2.4 2.6 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function InvoiceGlyph({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14.5 3.5V7H18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- dados de exemplo ---------- */

const SAMPLE_ITEMS: AiCommandItem[] = [
  { id: "invoices", label: "Invoices", group: "Pages", meta: "Billing · 412 open", icon: <InvoiceGlyph />, shortcut: "G I", suggested: true, keywords: ["billing", "payments"] },
  { id: "issues", label: "Issues", group: "Pages", meta: "Linear · ENG board", icon: <LinearMark />, shortcut: "G A", suggested: true, keywords: ["linear"] },
  { id: "q4-review", label: "Q4 billing review", group: "Pages", meta: "Notion · workspace", icon: <NotionMark /> },
  { id: "design-system", label: "Design system", group: "Pages", meta: "Figma file", icon: <FigmaMark /> },
  { id: "new-issue", label: "New issue", group: "Actions", meta: "Linear · ENG", icon: <LinearMark />, shortcut: "N", suggested: true, keywords: ["create ticket"] },
  { id: "new-draft", label: "New draft", group: "Actions", meta: "Notion", icon: <NotionMark /> },
  { id: "invite", label: "Invite teammate", group: "Actions", meta: "Members", icon: <UserGlyph /> },
];

const SAMPLE_QUESTIONS = [
  "Why did EU invoices fail",
  "What is blocking the checkout rollout",
  "Summarize this week's oncall incidents",
];

const SAMPLE_ANSWER_TEXT =
  "EU invoice exports failed on Tuesday at 14:02 CET after the VAT validation endpoint started rejecting DE invoices that miss the new EU OSS field [1]. Retries piled up until 19:00, when the on-call rollback restored the previous validator [2]. Nothing was lost: 412 invoices are queued for re-export.";

const SAMPLE_SOURCES: AiCommandSource[] = [
  { id: "linear-billing-1893", title: "billing-api #1893", description: "Linear issue — VAT endpoint rejects DE invoices missing the EU OSS field", mark: <LinearMark size={14} />, href: "#" },
  { id: "oncall-notes-tue", title: "On-call notes · Tue", description: "Rollback restored the previous validator at 19:00 CET", mark: <SlackMark size={14} /> },
];

const SAMPLE_ACTIONS: AiCommandAction[] = [
  {
    id: "create-issue",
    label: "Create issue in Linear",
    meta: "ENG · Billing",
    mark: <LinearMark />,
    runningLabel: "Creating issue…",
    doneMeta: "Simulated, nothing was sent",
    run: async signal => {
      await sleep(1200, signal);
      return "Created ENG-2481";
    },
  },
  {
    id: "open-notion",
    label: "Open Notion doc",
    meta: "EU billing runbook",
    mark: <NotionMark />,
    run: async signal => {
      await sleep(900, signal);
    },
  },
];

/* ---------- utilidades ---------- */

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>(resolve => {
    if (signal?.aborted) return resolve();
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); resolve(); }, { once: true });
  });
}

/** Corta o texto em blocos de 3 a 7 palavras (padrão fixo, previsível para o walkthrough). */
function wordChunks(text: string, sizes: number[]): string[] {
  const words = text.split(" ");
  const out: string[] = [];
  let i = 0;
  let s = 0;
  while (i < words.length) {
    const n = sizes[s % sizes.length] ?? 4;
    out.push(words.slice(i, i + n).join(" ") + " ");
    i += n;
    s += 1;
  }
  return out;
}

const isAbort = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

/* ---------- componente ---------- */

export function AiCommand({
  items,
  onSelect,
  onAsk,
  onAction,
  onSourceSelect,
  suggestedQuestions = SAMPLE_QUESTIONS,
  model,
  defaultMode = "search",
  defaultQuery = "",
  onModeChange,
  onClose,
  placeholder,
  thinkingLabel = "Searching your workspace",
  autoPlay,
  hotkey = false,
  height = 392,
  elevated = false,
  className,
  style,
  "aria-label": ariaLabel = "Command palette",
}: AiCommandProps) {
  const reduced = useReducedMotion() ?? false;
  const itemsProp = items ?? SAMPLE_ITEMS;
  const modelProp = model ?? { name: "Claude Sonnet 5.5", mark: <SparkMark size={14} /> };
  const playsWalkthrough = (autoPlay ?? (!items && !onAsk)) && !reduced;

  const [mode, setModeState] = useState<Mode>(defaultMode);
  const [query, setQuery] = useState(defaultQuery);
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hotSource, setHotSource] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const askCtrlRef = useRef<AbortController | null>(null);
  const actionCtrlsRef = useRef<Map<number, AbortController>>(new Map());
  const stickRef = useRef(true);
  const walkStoppedRef = useRef(false);
  const finePointerRef = useRef(false);
  const prevSigRef = useRef("");

  const listId = useId();

  const setMode = useCallback((m: Mode) => {
    setModeState(prev => {
      if (prev !== m) onModeChange?.(m);
      return m;
    });
  }, [onModeChange]);

  useEffect(() => {
    finePointerRef.current = typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
  }, []);

  /* ---------- busca ---------- */

  const matches = useCallback((item: AiCommandItem, q: string) => {
    const hay = `${item.label} ${item.meta ?? ""} ${item.group ?? ""} ${Array.isArray(item.keywords) ? item.keywords.join(" ") : (item.keywords ?? "")}`.toLowerCase();
    const tokens = q.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (!tokens.length) return false;
    return tokens.every(t => hay.includes(t));
  }, []);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    if (mode === "search") {
      const q = query.trim();
      const visible = !q ? itemsProp.filter(i => i.suggested) : itemsProp.filter(i => matches(i, q));
      let lastGroup: string | undefined;
      for (const item of visible) {
        if (item.group && item.group !== lastGroup) {
          out.push({ kind: "header", id: `gh-${item.group}`, label: item.group });
          lastGroup = item.group;
        }
        out.push({ kind: "item", id: item.id, item });
      }
      if (!q && !visible.length) out.push({ kind: "header", id: "empty", label: "No suggested pages yet" });
      if (q) {
        out.push({ kind: "header", id: "ask-gh", label: "Ask AI" });
        out.push({ kind: "ask", id: "ask-row", question: q, hintTab: true });
      }
    } else if (!answer) {
      const q = query.trim();
      if (!q) {
        suggestedQuestions.forEach((question, i) => out.push({ kind: "ask", id: `sq-${i}`, question, hintTab: false }));
      } else {
        out.push({ kind: "ask", id: "ask-row", question: q, hintTab: false });
      }
    } else if (answer.status === "error") {
      out.push({ kind: "retry", id: "retry-answer", target: "answer" });
    } else {
      answer.actions.forEach((a, i) => {
        if (a.status === "idle" || a.status === "error") out.push({ kind: "action", id: `act-${a.def.id}`, index: i });
        if (a.status === "error") out.push({ kind: "retry", id: `retry-${a.def.id}`, target: i });
      });
    }
    return out;
  }, [mode, query, answer, itemsProp, matches, suggestedQuestions]);

  const focusable = useMemo(() => rows.filter((r): r is Exclude<Row, { kind: "header" }> => r.kind !== "header"), [rows]);
  const rowSig = useMemo(() => focusable.map(r => r.id).join("|"), [focusable]);

  const safeActive = focusable.length ? Math.min(activeIdx, focusable.length - 1) : 0;

  /* ---------- destaque que desliza (130ms) ou salta quando a lista muda ---------- */

  useEffect(() => {
    const content = contentRef.current;
    const hl = highlightRef.current;
    const scroller = scrollRef.current;
    if (!content || !hl || !scroller || !focusable.length) {
      hl?.style.setProperty("visibility", "hidden");
      return;
    }
    hl.style.visibility = "visible";
    const el = content.querySelector<HTMLElement>(`[data-ac-row="${safeActive}"]`);
    if (!el) return;
    const top = el.offsetTop;
    const jumped = prevSigRef.current !== rowSig || reduced;
    prevSigRef.current = rowSig;
    if (jumped) {
      hl.style.transition = "none";
      hl.style.top = `${top}px`;
      void hl.offsetHeight; // força o reflow para o "none" pegar
      hl.style.transition = "";
    } else {
      hl.style.top = `${top}px`;
    }
  }, [safeActive, rowSig, focusable.length, reduced]);

  /* ---------- pergunta / resposta ---------- */

  const simulatedAsk = useCallback(async (question: string, ctx: AiCommandAnswerContext): Promise<AiCommandAnswer> => {
    const { signal, append, setSources } = ctx;
    await sleep(560, signal);
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    setSources(SAMPLE_SOURCES);
    await sleep(240, signal);
    const sizes = reduced ? [16, 16, 16] : [4, 6, 3, 5, 4, 7, 3, 5];
    const gap = reduced ? 110 : 34;
    for (const chunk of wordChunks(SAMPLE_ANSWER_TEXT, sizes)) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      append(chunk);
      await sleep(gap, signal);
    }
    return { actions: SAMPLE_ACTIONS };
  }, [reduced]);

  const ask = useCallback((question: string) => {
    const clean = question.trim();
    if (!clean) return;
    askCtrlRef.current?.abort();
    const ctrl = new AbortController();
    askCtrlRef.current = ctrl;
    setModeState("ask");
    onModeChange?.("ask");
    setQuery(clean);
    stickRef.current = true;
    setActiveIdx(0);
    setAnswer({ question: clean, status: "thinking", chunks: [], sources: [], actions: [], message: "" });
    setAnnounce(`Asking: ${clean}`);
    const engine = onAsk ?? simulatedAsk;
    engine(clean, {
      signal: ctrl.signal,
      append: chunk => setAnswer(a => (a ? { ...a, status: "streaming", chunks: [...a.chunks, chunk] } : a)),
      setSources: sources => setAnswer(a => (a ? { ...a, sources } : a)),
    })
      .then(res => {
        if (ctrl.signal.aborted) return;
        setAnswer(a => {
          if (!a) return a;
          const chunks = res?.text != null && !a.chunks.length ? [res.text] : a.chunks;
          return {
            ...a,
            status: "done",
            chunks,
            sources: res?.sources ?? a.sources,
            actions: (res?.actions ?? []).map(def => ({ def, status: "idle" as const, result: "" })),
          };
        });
        setAnnounce("Answer ready");
      })
      .catch(e => {
        if (ctrl.signal.aborted || isAbort(e)) return;
        setAnswer(a => (a ? { ...a, status: "error", message: e instanceof Error ? e.message : "Something went wrong" } : a));
        setAnnounce("The answer failed");
      });
  }, [onAsk, onModeChange, simulatedAsk]);

  const cancelAsk = useCallback(() => {
    askCtrlRef.current?.abort();
    askCtrlRef.current = null;
    actionCtrlsRef.current.forEach(c => c.abort());
    actionCtrlsRef.current.clear();
    setAnswer(null);
    setHotSource(null);
  }, []);

  const runAction = useCallback((index: number) => {
    const act = answer?.actions[index];
    if (!act || act.status === "running") return;
    actionCtrlsRef.current.get(index)?.abort();
    const ctrl = new AbortController();
    actionCtrlsRef.current.set(index, ctrl);
    const { def } = act;
    setAnswer(a => a ? { ...a, actions: a.actions.map((x, i) => (i === index ? { ...x, status: "running" as const, result: "" } : x)) } : a);
    setAnnounce(def.runningLabel ?? `${def.label}…`);
    void (async () => {
      try {
        const res = def.run ? await def.run(ctrl.signal) : await sleep(1000, ctrl.signal);
        if (ctrl.signal.aborted) return;
        const done = def.doneLabel ?? (typeof res === "string" && res ? res : def.label);
        setAnswer(a => a ? { ...a, actions: a.actions.map((x, i) => (i === index ? { ...x, status: "done" as const, result: done } : x)) } : a);
        onAction?.(def, done);
        setAnnounce(def.doneMeta ? `${done}. ${def.doneMeta}` : done);
      } catch (e) {
        if (ctrl.signal.aborted || isAbort(e)) return;
        setAnswer(a => a ? { ...a, actions: a.actions.map((x, i) => (i === index ? { ...x, status: "error" as const, result: "" } : x)) } : a);
        setAnnounce(def.errorLabel ?? "Action failed");
      }
    })();
  }, [answer, onAction]);

  /* ---------- teclado ---------- */

  const moveActive = useCallback((delta: number) => {
    if (!focusable.length) return;
    setActiveIdx(prev => {
      const n = focusable.length;
      return ((prev + delta) % n + n) % n;
    });
  }, [focusable.length]);

  const activateRow = useCallback((row: Exclude<Row, { kind: "header" }> | undefined) => {
    if (!row) return;
    if (row.kind === "item") {
      row.item.onSelect?.();
      onSelect?.(row.item);
    } else if (row.kind === "ask") {
      ask(row.question);
    } else if (row.kind === "action") {
      runAction(row.index);
    } else if (row.kind === "retry") {
      if (row.target === "answer") {
        if (answer) ask(answer.question);
      } else runAction(row.target);
    }
  }, [onSelect, ask, runAction, answer]);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activateRow(focusable[safeActive]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (mode === "search") {
        const q = query.trim();
        setMode("ask");
        if (q) ask(q); // Tab pergunta sobre a consulta atual
      } else if (!answer && !query.trim()) {
        setMode("search"); // com perguntas sugeridas abertas, Tab volta à busca
      } else {
        cancelAsk();
        setMode("search");
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (mode === "ask") {
        cancelAsk(); // volta à busca e cancela o stream
        setMode("search");
      } else if (query) {
        setQuery("");
      } else {
        onClose?.();
      }
    }
  };

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  /* ---------- fontes ---------- */

  const openSource = useCallback((source: AiCommandSource | undefined) => {
    if (!source) return;
    if (source.href) window.open(source.href, "_blank", "noopener,noreferrer");
    else onSourceSelect?.(source);
  }, [onSourceSelect]);

  /* ---------- rolagem segue o texto (a não ser que subam) ---------- */

  useEffect(() => {
    const el = scrollRef.current;
    if (el && answer?.status === "streaming" && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [answer?.chunks.length, answer?.status, answer?.sources.length]);

  /* ---------- unmount: aborta tudo ---------- */

  useEffect(() => () => {
    askCtrlRef.current?.abort();
    actionCtrlsRef.current.forEach(c => c.abort());
  }, []);

  // O loop do walkthrough vive num efeito com deps estáveis e chama os handlers
  // atuais por ref: o estado (answer/query) muda a cada passo sem reiniciar o loop.
  const askRef = useRef(ask);
  askRef.current = ask;
  const runRef = useRef(runAction);
  runRef.current = runAction;
  const cancelRef = useRef(cancelAsk);
  cancelRef.current = cancelAsk;

  /* ---------- walkthrough (só sem items/onAsk, com a tela visível) ---------- */

  useEffect(() => {
    if (!playsWalkthrough) return;
    if (defaultQuery || defaultMode !== "search") return; // chegou no meio de uma conversa
    const q0 = SAMPLE_QUESTIONS[0];
    if (!q0) return;
    walkStoppedRef.current = false;
    const root = rootRef.current;
    if (!root) return;
    const ctrl = new AbortController();
    let visible = true;
    const io = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.15 });
    io.observe(root);
    const stop = () => { walkStoppedRef.current = true; ctrl.abort(); };
    root.addEventListener("pointerdown", stop, { capture: true });
    root.addEventListener("keydown", stop, { capture: true });

    const waitVisible = async () => {
      while (!ctrl.signal.aborted && !visible) await sleep(160, ctrl.signal);
    };

    void (async () => {
      while (!ctrl.signal.aborted && !walkStoppedRef.current) {
        await waitVisible();
        if (ctrl.signal.aborted) return;
        // estado limpo a cada volta
        cancelRef.current();
        setModeState("search");
        setQuery("");
        setActiveIdx(0);
        await sleep(600, ctrl.signal);
        // digita a pergunta (~920 ms no total)
        for (let i = 1; i <= q0.length; i++) {
          if (ctrl.signal.aborted) return;
          setQuery(q0.slice(0, i));
          await sleep(40, ctrl.signal);
        }
        if (ctrl.signal.aborted) return;
        // segura a consulta completa antes de perguntar (o frame de captura cai aqui)
        await sleep(1300, ctrl.signal);
        askRef.current(q0);
        // espera o stream terminar (o simulado leva ~1,4s)
        await sleep(2000, ctrl.signal);
        if (ctrl.signal.aborted) return;
        // roda a primeira ação sugerida
        setActiveIdx(0);
        runRef.current(0);
        await sleep(1500, ctrl.signal);
        if (ctrl.signal.aborted) return;
        await sleep(1600, ctrl.signal);
      }
    })();

    return () => {
      ctrl.abort();
      io.disconnect();
      root.removeEventListener("pointerdown", stop, { capture: true });
      root.removeEventListener("keydown", stop, { capture: true });
    };
  }, [playsWalkthrough, defaultMode, defaultQuery]);

  /* ---------- render ---------- */

  const withCitations = useCallback((text: string, keyPrefix: string): ReactNode => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const m = part.match(/^\[(\d+)\]$/);
      if (!m) return <span key={`${keyPrefix}-${i}`}>{part}</span>;
      const n = Number(m[1]);
      const src = answer?.sources[n - 1];
      return (
        <button
          key={`${keyPrefix}-${i}`}
          type="button"
          className={cx(styles.citation, hotSource === n && styles.citationHot)}
          aria-label={src ? `[${n}] ${src.title}${src.description ? `: ${src.description}` : ""}` : `[${n}]`}
          onClick={() => openSource(src)}
          onMouseEnter={() => setHotSource(n)}
          onMouseLeave={() => setHotSource(null)}
          onFocus={() => setHotSource(n)}
          onBlur={() => setHotSource(null)}
        >
          [{n}]
        </button>
      );
    });
  }, [answer, hotSource, openSource]);

  const renderSearchBody = () => {
    const q = query.trim();
    return (
      <>
        {rows.filter(r => r.kind === "header" || r.kind === "item").map(row =>
          row.kind === "header" ? (
            <div key={row.id} className={styles.sectionHead}>{row.label}</div>
          ) : (
            <RowShell
              key={row.id}
              row={row}
              index={focusable.indexOf(row)}
              active={safeActive}
              finePointer={finePointerRef.current}
              onHover={() => safeActive !== focusable.indexOf(row) && setActiveIdx(focusable.indexOf(row))}
              onActivate={() => activateRow(row)}
            >
              {row.item.icon && <span className={styles.rowIcon}>{row.item.icon}</span>}
              <span className={styles.rowLabel}>{row.item.label}</span>
              {row.item.meta && <span className={styles.rowMeta}>{row.item.meta}</span>}
              {row.item.shortcut && <span className={styles.kbd}>{row.item.shortcut}</span>}
            </RowShell>
          ),
        )}
        {rows.filter(r => r.kind === "ask").map(row => {
          if (row.kind !== "ask") return null;
          return (
            <RowShell
              key={row.id}
              row={row}
              index={focusable.indexOf(row)}
              active={safeActive}
              finePointer={finePointerRef.current}
              onHover={() => setActiveIdx(focusable.indexOf(row))}
              onActivate={() => activateRow(row)}
            >
              <span className={styles.sparkIcon}><SparkMark size={15} /></span>
              <span className={styles.rowLabel}>Ask &ldquo;{q || row.question}&rdquo;</span>
              {row.hintTab && <span className={styles.kbd}>Tab</span>}
            </RowShell>
          );
        })}
      </>
    );
  };

  const renderAskBody = () => {
    if (!answer) {
      return rows.filter(r => r.kind === "ask").map(row => {
        if (row.kind !== "ask") return null;
        return (
          <RowShell
            key={row.id}
            row={row}
            index={focusable.indexOf(row)}
            active={safeActive}
            finePointer={finePointerRef.current}
            onHover={() => setActiveIdx(focusable.indexOf(row))}
            onActivate={() => activateRow(row)}
          >
            <span className={styles.sparkIcon}><SparkMark size={15} /></span>
            <span className={styles.rowLabel}>&ldquo;{row.question}&rdquo;</span>
            <span className={styles.kbd}>↵</span>
          </RowShell>
        );
      });
    }
    const actionRows = rows.filter(r => r.kind === "action" || r.kind === "retry");
    return (
      <>
        <div className={styles.answerBlock}>
          <div className={styles.answerHead}>
            <span className={styles.sparkIcon}><SparkMark size={13} /></span>
            <span className={styles.answerModel}>{modelProp.name}</span>
            {answer.status === "thinking" && (
              <span className={styles.thinking}>{thinkingLabel}<span className={styles.dots} aria-hidden /></span>
            )}
          </div>
          {answer.status === "error" ? (
            <div className={styles.answerError}>
              <TriangleAlert size={14} aria-hidden />
              <span className={styles.answerErrorText}>{answer.message || "Something went wrong"}</span>
              <button type="button" className={styles.retryInline} onClick={() => ask(answer.question)}>Retry</button>
            </div>
          ) : (
            <>
              <div className={styles.answerText}>
                {answer.chunks.map((chunk, i) => (
                  <motion.span
                    key={i}
                    className={styles.answerChunk}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.14 }}
                  >
                    {withCitations(chunk, `c${i}`)}
                  </motion.span>
                ))}
                {answer.status === "streaming" && <span className={styles.caret} aria-hidden />}
              </div>
              {answer.sources.length > 0 && (
                <div className={styles.sources} aria-label="Sources">
                  {answer.sources.map((src, i) => (
                    <button
                      key={src.id}
                      type="button"
                      className={cx(styles.sourceChip, hotSource === i + 1 && styles.sourceChipHot)}
                      aria-label={`${src.title}${src.description ? `: ${src.description}` : ""}`}
                      onClick={() => openSource(src)}
                      onMouseEnter={() => setHotSource(i + 1)}
                      onMouseLeave={() => setHotSource(null)}
                      onFocus={() => setHotSource(i + 1)}
                      onBlur={() => setHotSource(null)}
                    >
                      {src.mark && <span className={styles.sourceMark}>{src.mark}</span>}
                      <span className={styles.sourceTitle}>{src.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {answer.status === "done" && actionRows.length > 0 && (
          <>
            <div className={styles.sectionHead}>Next steps</div>
            {actionRows.map(row => {
              if (row.kind === "retry") {
                return (
                  <RowShell
                    key={row.id}
                    row={row}
                    index={focusable.indexOf(row)}
                    active={safeActive}
                    finePointer={finePointerRef.current}
                    onHover={() => setActiveIdx(focusable.indexOf(row))}
                    onActivate={() => activateRow(row)}
                  >
                    <span className={cx(styles.rowIcon, styles.rowIconDanger)}><TriangleAlert size={15} /></span>
                    <span className={styles.rowLabel}>Retry failed step</span>
                    <span className={styles.kbd}>↵</span>
                  </RowShell>
                );
              }
              if (row.kind !== "action") return null;
              const act = answer.actions[row.index];
              if (!act) return null;
              const label = act.status === "running"
                ? (act.def.runningLabel ?? `${act.def.label}…`)
                : act.status === "done"
                  ? act.result
                  : act.def.errorLabel ?? act.def.label;
              return (
                <RowShell
                  key={row.id}
                  row={row}
                  index={focusable.indexOf(row)}
                  active={safeActive}
                  finePointer={finePointerRef.current}
                  onHover={() => setActiveIdx(focusable.indexOf(row))}
                  onActivate={() => activateRow(row)}
                >
                  <span className={styles.actionIcon}>
                    {act.status === "running" ? (
                      <LoaderCircle size={15} className={styles.spin} aria-hidden />
                    ) : act.status === "done" ? (
                      <motion.svg width={15} height={15} viewBox="0 0 24 24" fill="none" aria-hidden className={styles.doneCheck}>
                        <motion.path
                          d="M4.5 12.5l5 5 10-11"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={reduced ? false : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.svg>
                    ) : (
                      act.def.mark ?? <SparkMark size={15} />
                    )}
                  </span>
                  <span className={cx(styles.rowLabel, act.status === "done" && styles.rowLabelDone)}>{label}</span>
                  {act.status === "done" && act.def.doneMeta ? (
                    <span className={styles.rowMeta}>{act.def.doneMeta}</span>
                  ) : (
                    act.def.meta && act.status === "idle" && <span className={styles.rowMeta}>{act.def.meta}</span>
                  )}
                  {act.status === "idle" && <span className={styles.kbd}>↵</span>}
                </RowShell>
              );
            })}
          </>
        )}
      </>
    );
  };

  const viewKey = mode;

  return (
    <div
      ref={rootRef}
      className={cx(styles.palette, elevated && styles.elevated, className)}
      style={style}
      aria-label={ariaLabel}
    >
      <div className={styles.inputRow}>
        <Search size={17} className={styles.searchIcon} aria-hidden />
        <input
          ref={inputRef}
          className={styles.input}
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-activedescendant={focusable[safeActive] ? `ac-opt-${focusable[safeActive].id}` : undefined}
          aria-label={ariaLabel}
          type="text"
          value={query}
          placeholder={mode === "search" ? (placeholder?.search ?? "Search pages and actions") : (placeholder?.ask ?? "Ask your workspace")}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={e => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={onInputKeyDown}
          onFocus={() => { stickRef.current = true; }}
        />
        {query && (
          <button
            type="button"
            className={styles.clearBtn}
            aria-label="Clear"
            onClick={() => {
              setQuery("");
              setActiveIdx(0);
            }}
          >
            <X size={14} aria-hidden />
          </button>
        )}
        <div className={styles.toggle} role="group" aria-label="Palette mode">
          <button type="button" className={cx(styles.toggleBtn, mode === "search" && styles.toggleBtnOn)} aria-pressed={mode === "search"} onClick={() => setMode("search")}>Search</button>
          <button type="button" className={cx(styles.toggleBtn, mode === "ask" && styles.toggleBtnOn)} aria-pressed={mode === "ask"} onClick={() => setMode("ask")}>Ask AI</button>
        </div>
      </div>
      <div className={styles.results} style={{ height }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewKey}
            className={styles.view}
            variants={reduced
              ? { hidden: { opacity: 0 }, enter: { opacity: 1, transition: { duration: 0 } }, exit: { opacity: 0, transition: { duration: 0 } } }
              : { hidden: { opacity: 0, y: 2 }, enter: { opacity: 1, y: 0, transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] } }, exit: { opacity: 0, y: -2, transition: { duration: 0.1, ease: [0.7, 0, 0.84, 0] } } }}
            initial="hidden"
            animate="enter"
            exit="exit"
          >
            <div
              id={listId}
              role="listbox"
              aria-label={mode === "search" ? "Results" : "Ask AI"}
              className={styles.scroll}
              ref={scrollRef}
              onScroll={e => {
                const el = e.currentTarget;
                stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 28;
              }}
            >
              <div className={styles.content} ref={contentRef}>
                <div ref={highlightRef} className={styles.highlight} aria-hidden style={{ visibility: "hidden" }} />
                {mode === "search" ? renderSearchBody() : renderAskBody()}
                <div className={styles.endPad} aria-hidden />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={styles.footer}>
        <span className={styles.footerModel}>
          <span className={styles.sparkIcon}>{modelProp.mark ?? <SparkMark size={12} />}</span>
          {modelProp.name}
        </span>
        <span className={styles.hints}>
          <span className={styles.hintNav}><span className={styles.kbd}>↑</span><span className={styles.kbd}>↓</span> Navigate</span>
          <span className={styles.hint}><span className={styles.kbd}>↵</span> Select</span>
          <span className={styles.hint}>
            <span className={styles.kbd}>{mode === "search" ? "Tab" : "Esc"}</span>
            {mode === "search" ? "Ask AI" : "Back"}
          </span>
          <span className={styles.hint}><span className={styles.kbd}>Esc</span> Close</span>
        </span>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite">{announce}</p>
    </div>
  );
}

/* ---------- linha do listbox ---------- */

function RowShell({
  row,
  index,
  active,
  finePointer,
  onHover,
  onActivate,
  children,
}: {
  row: Exclude<Row, { kind: "header" }>;
  index: number;
  active: number;
  finePointer: boolean;
  onHover: () => void;
  onActivate: () => void;
  children: ReactNode;
}) {
  const id = `ac-opt-${row.id}`;
  return (
    <div
      role="option"
      id={id}
      aria-selected={index === active}
      data-ac-row={index}
      className={styles.row}
      onMouseEnter={finePointer ? onHover : undefined}
      onClick={onActivate}
    >
      {children}
    </div>
  );
}
