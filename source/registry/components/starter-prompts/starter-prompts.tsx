import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, BarChart3, Check, Code, ListTodo, PenLine, Shuffle, Square, TriangleAlert } from "lucide-react";
import styles from "./starter-prompts.module.css";

/**
 * Starter prompts — saudação e grade de cartões de partida para o estado vazio de um app de IA.
 * Os cartões vêm agrupados em abas (Write, Code, Analyze, Plan), um shuffle troca o conjunto
 * com um crossfade escalonado curto, e escolher um cartão preenche o composer. Cartões que usam
 * um app conectado mostram o mark do app (Gmail, GitHub, Notion, Linear, Google Calendar).
 * Sem props mostra 24 starters de exemplo e simula o envio.
 */

/* ---------- tipos públicos ---------- */

export type StarterPromptApp = "gmail" | "github" | "notion" | "linear" | "calendar";

export interface StarterPrompt {
  id: string;
  category: string;
  title: string;
  description?: string;
  /** Texto completo que vai para o composer (o cartão mostra title/description). */
  prompt: string;
  app?: StarterPromptApp;
}

export interface StarterPromptCategory {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface StarterPromptsProps {
  greeting?: ReactNode;
  /** Linha quieta abaixo do título; null esconde. */
  description?: ReactNode;
  prompts?: StarterPrompt[];
  categories?: StarterPromptCategory[];
  defaultCategory?: string;
  /** Quantos cartões ficam na tela; a grade reserva esses slots para nada saltar. */
  count?: number;
  /** Cartões placeholder com o mesmo tamanho e ritmo enquanto os starters carregam. */
  loading?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (prompt: StarterPrompt) => void;
  onSubmit?: (message: string, context: { prompt: StarterPrompt | null; signal: AbortSignal }) => Promise<void> | void;
  model?: { name: string; mark?: ReactNode };
  placeholder?: string;
  className?: string;
}

/* ---------- categorias padrão ---------- */

const DEFAULT_CATEGORIES: StarterPromptCategory[] = [
  { id: "write", label: "Write", icon: <PenLine size={13} strokeWidth={2.2} aria-hidden /> },
  { id: "code", label: "Code", icon: <Code size={13} strokeWidth={2.2} aria-hidden /> },
  { id: "analyze", label: "Analyze", icon: <BarChart3 size={13} strokeWidth={2.2} aria-hidden /> },
  { id: "plan", label: "Plan", icon: <ListTodo size={13} strokeWidth={2.2} aria-hidden /> },
];

/* ---------- marks de apps e do modelo ---------- */

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

function GmailMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="1.5" y="3.5" width="21" height="17" rx="3.5" fill="#fff" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
      <g fill="none" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.6 16.4v-6.8" stroke="#ea4335" />
        <path d="M5.6 9.6l6.4 4.2 6.4-4.2" stroke="#4285f4" />
        <path d="M18.4 9.6v6.8" stroke="#34a853" />
      </g>
    </svg>
  );
}

function GitHubMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })} viewBox="0 0 16 16">
      <path
        fill="currentColor"
        d="M8 .2a7.8 7.8 0 0 0-2.47 15.2c.39.07.54-.17.54-.38v-1.32c-2.2.77-2.67-.86-2.67-.86-.36-.74-.88-.94-.88-.94-.72-.4.05-.39.05-.39.8.05 1.22.83 1.22.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.94 0-.87.31-1.58.82-2.13-.08-.2-.36-1 .08-2.1 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.9.08 2.1.51.55.82 1.26.82 2.13 0 3.06-1.88 3.73-3.65 3.93.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A7.8 7.8 0 0 0 8 .2Z"
      />
    </svg>
  );
}

function NotionMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#fdfdfd" stroke="rgba(0,0,0,.25)" strokeWidth=".8" />
      <path d="M8 16.4V7.6h1.8l4.6 5.9V7.6h1.7v8.8h-1.8l-4.6-5.9v5.9H8Z" fill="#111" />
    </svg>
  );
}

function LinearMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#5e6ad2" />
      <path d="M6.8 17.2v-7.1l7.1 7.1h-3.9z" fill="#fff" />
      <path d="M6.8 6.9l10.3 10.3" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

function CalendarMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#fff" stroke="rgba(0,0,0,.2)" strokeWidth=".8" />
      <path d="M2.9 7.6a4.6 4.6 0 0 1 4.6-4.6h9a4.6 4.6 0 0 1 4.6 4.6v1.2H2.9z" fill="#ea4335" />
      <rect x="6.2" y="11.4" width="4.4" height="4.4" rx="1.2" fill="#1a73e8" />
    </svg>
  );
}

/** Spark da casa como marca do modelo (a cor vem do wrapper). */
function ClaudeMark({ title, size = 16 }: MarkProps) {
  return (
    <svg {...markProps({ title, size })}>
      <path
        d="M12 3.2c.48 3.86 1.47 6.53 2.85 7.91 1.38 1.38 4.05 2.37 7.91 2.85-3.86.48-6.53 1.47-7.91 2.85-1.38 1.38-2.37 4.05-2.85 7.91-.48-3.86-1.47-6.53-2.85-7.91C7.77 16.43 5.1 15.44 1.24 15 5.1 14.52 7.77 13.53 9.15 12.15 10.53 10.77 11.52 8.1 12 3.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const APPS: Record<StarterPromptApp, { name: string; Mark: (p: MarkProps) => ReactNode }> = {
  gmail: { name: "Gmail", Mark: GmailMark },
  github: { name: "GitHub", Mark: GitHubMark },
  notion: { name: "Notion", Mark: NotionMark },
  linear: { name: "Linear", Mark: LinearMark },
  calendar: { name: "Google Calendar", Mark: CalendarMark },
};

/* ---------- starters de exemplo ---------- */

const STARTER_PROMPT_SAMPLES: StarterPrompt[] = [
  {
    id: "reply-priya-launch",
    category: "write",
    app: "gmail",
    title: "Reply to Priya about the launch",
    description: "Confirm the new date from her Gmail thread",
    prompt:
      "Reply to Priya about the launch thread in Gmail. Confirm the new date she proposed, thank her for moving it, and suggest two backup slots later this week.",
  },
  {
    id: "review-pr-482",
    category: "code",
    app: "github",
    title: "Review PR #482 in acme/web",
    description: "Flag bugs, risky changes and missing tests",
    prompt:
      "Review PR #482 in acme/web: flag bugs, risky changes and missing tests. Lead with anything that can corrupt user data, then list nits separately.",
  },
  {
    id: "interview-themes",
    category: "analyze",
    app: "notion",
    title: "Find themes in user interviews",
    description: "Summarize the 14 notes in the Research doc by theme",
    prompt:
      "Summarize the 14 interview notes in the Research doc by theme. For each theme: how many users hit it, the sharpest quote, and whether it blocks activation.",
  },
  {
    id: "sprint-next",
    category: "plan",
    app: "linear",
    title: "Plan the next sprint",
    description: "Fit the backlog into 34 points of capacity",
    prompt:
      "Plan the next sprint in Linear: fit the top-priority backlog into 34 points of capacity, protect one day of slack, and tell me exactly what slips.",
  },
  {
    id: "changelog-notes",
    category: "write",
    title: "Draft release notes for v2.14",
    description: "Turn the 23 merged PRs into plain-language notes",
    prompt:
      "Draft release notes for v2.14 from the 23 merged PRs. Group them by feature, fix and cleanup, drop the jargon, and keep each line under 14 words.",
  },
  {
    id: "flaky-checkout-test",
    category: "code",
    app: "github",
    title: "Hunt the flaky checkout test",
    description: "It fails about 1 in 6 runs on CI",
    prompt:
      "The checkout.spec.ts suite fails about 1 in 6 runs on CI. Find the race condition, explain it in two sentences, and propose a deterministic fix that does not sleep.",
  },
  {
    id: "churn-calls",
    category: "analyze",
    app: "gmail",
    title: "Why did the 9 churners leave",
    description: "Pricing, migration, or something else",
    prompt:
      "Nine customers churned last month. Read their cancellation emails and support threads in Gmail, group the real reasons, and name the top three with evidence.",
  },
  {
    id: "launch-checklist",
    category: "plan",
    app: "linear",
    title: "Build the launch checklist",
    description: "Every owner, every date, no gaps",
    prompt:
      "Build the launch checklist for the metering feature in Linear: every task, an owner, a date, and the dependency that would delay it. Flag the two tasks with no owner.",
  },
  {
    id: "cold-email-warmer",
    category: "write",
    title: "Rewrite the cold email warmer",
    description: "Keep the offer, lose the sales tone",
    prompt:
      "Rewrite my cold email to Nova Labs warmer: keep the offer and the one proof point, cut the adjectives, and end with an easy yes-or-no question.",
  },
  {
    id: "simplify-auth",
    category: "code",
    title: "Simplify the auth middleware",
    description: "Four guards into one, no behavior change",
    prompt:
      "Simplify the four auth guards in middleware/ into one composable guard. No behavior change: show the call-site diff for the six routes that use them.",
  },
  {
    id: "pricing-copy-test",
    category: "analyze",
    title: "Test the pricing page copy",
    description: "Where do readers stall or drop",
    prompt:
      "Review the pricing page copy against the three plans readers actually compare. Mark where a skeptic stalls, and rewrite the two weakest lines.",
  },
  {
    id: "roadmap-trim",
    category: "plan",
    title: "Trim the 9-month roadmap",
    description: "What to cut without breaking promises",
    prompt:
      "Our 9-month roadmap is 41% over capacity. Cut what you would cut first and second, keep every customer promise, and show the delta by quarter.",
  },
  {
    id: "meeting-brief-investor",
    category: "write",
    app: "notion",
    title: "Brief me on the investor call",
    description: "Three bullets before the meeting starts",
    prompt:
      "Read the investor call prep doc in Notion and brief me in three bullets: what they will ask, what we committed last quarter, and the number that matters.",
  },
  {
    id: "incident-n-plus-one",
    category: "code",
    app: "github",
    title: "Explain the N+1 in order sync",
    description: "2.1M queries a day, where and how",
    prompt:
      "Orders sync issues about 2.1M queries a day. Find the N+1 in sync/orders.ts, estimate the savings of a batched load, and sketch the query that replaces it.",
  },
  {
    id: "support-volume-q3",
    category: "analyze",
    title: "Summarize Q3 support volume",
    description: "By category, week over week",
    prompt:
      "From the support table: volume by category for Q3, week over week deltas, and the single category that grew fastest. Keep the whole answer to five lines.",
  },
  {
    id: "okrs-draft",
    category: "plan",
    app: "notion",
    title: "Draft the Q1 OKRs",
    description: "Three objectives from the strategy notes",
    prompt:
      "Draft three Q1 OKRs from the strategy notes in Notion: measurable key results only, one initiative each key result depends on, and flag the softest metric.",
  },
  {
    id: "tweet-three-hooks",
    category: "write",
    title: "Write three tweet variants",
    description: "Same news, three different hooks",
    prompt:
      "Write three tweet variants announcing the public beta. Same news, three different hooks: curiosity, social proof and a direct question. Max 240 characters each.",
  },
  {
    id: "upgrade-node-22",
    category: "code",
    app: "github",
    title: "Plan the Node 22 upgrade",
    description: "Breaking changes across our 14 packages",
    prompt:
      "We run Node 20 across 14 packages. List every breaking change Node 22 makes for our stack, dependencies included, rank them by risk, and give an upgrade order.",
  },
  {
    id: "review-mines-rank",
    category: "analyze",
    title: "Find the risky reviews first",
    description: "Sort 300 reviews by complaint strength",
    prompt:
      "Rank the 300 recent reviews by complaint intensity, surface the ten that sound most likely to go public next, and draft triage notes for each one.",
  },
  {
    id: "on-call-rotation",
    category: "plan",
    app: "calendar",
    title: "Redesign the on-call rotation",
    description: "Night coverage without the burnout",
    prompt:
      "Redesign the on-call rotation using the team calendar: cover every night, max two weekends in a row per person, and show the new schedule plus swap pairs.",
  },
  {
    id: "contractor-thanks",
    category: "write",
    title: "Draft the contractor thank-you",
    description: "Personal note for eight finishers",
    prompt:
      "Draft a personal thank-you for each of the eight contractors who finished the pilot. One specific line per person, drawn from their PR summaries.",
  },
  {
    id: "api-docs-drift",
    category: "code",
    app: "github",
    title: "Fix the drifted API docs",
    description: "Endpoints that changed but docs did not",
    prompt:
      "Compare the OpenAPI file against the routes in src/api and list every drift: removed params, changed defaults, new endpoints without docs. Then draft the corrected pages.",
  },
  {
    id: "hiring-pipeline-read",
    category: "analyze",
    title: "Read the hiring pipeline",
    description: "Where do candidates really stall",
    prompt:
      "Analyze the last 120 candidates: where the funnel actually stalls, which interview round loses the most people, and two changes worth trying next.",
  },
  {
    id: "postmortem-outline",
    category: "plan",
    app: "linear",
    title: "Outline the incident postmortem",
    description: "Blameless sections, owners, dates",
    prompt:
      "Outline the blameless postmortem for the Oct 22 outage: timeline, impact, what went wrong and well, action items with owners — and the Linear ticket for each action.",
  },
];

/* ---------- cor do ícone por categoria padrão (o rótulo segue quieta) ---------- */

const CAT_TONES: Record<string, string | undefined> = {
  write: styles.catBlue,
  code: styles.catViolet,
  analyze: styles.catAmber,
  plan: styles.catGreen,
};

/* ---------- componente ---------- */

export function StarterPrompts({
  greeting = "What are we working on, Maya?",
  description = "Pick a starter or write your own. Cards with an app mark use your connected tools.",
  prompts = STARTER_PROMPT_SAMPLES,
  categories = DEFAULT_CATEGORIES,
  defaultCategory = "all",
  count = 4,
  loading = false,
  value,
  defaultValue = "",
  onValueChange,
  onSelect,
  onSubmit,
  model,
  placeholder = "Ask anything, or pick a starter above",
  className,
}: StarterPromptsProps) {
  const reduced = useReducedMotion() ?? false;

  const [tab, setTab] = useState(defaultCategory);
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [text, setText] = useState(value ?? defaultValue);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [fadeKey, setFadeKey] = useState(0);

  const sendingRef = useRef(false);
  const pickedRef = useRef<StarterPrompt | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setTextAll = useCallback(
    (next: string) => {
      if (value === undefined) setText(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  // Abas: "All" na frente; categorias sem starter some da lista.
  const tabs = useMemo(() => {
    const cats = categories.filter((c) => prompts.some((p) => p.category === c.id));
    return [{ id: "all", label: "All", icon: undefined as ReactNode }, ...cats];
  }, [categories, prompts]);
  const activeTabId = tabs.some((t) => t.id === tab) ? tab : "all";

  const poolFor = useCallback(
    (id: string) => (id === "all" ? prompts : prompts.filter((p) => p.category === id)),
    [prompts],
  );

  // Os `count` cartões em cena, a partir do offset atual da aba (o shuffle muda o offset).
  const cells = useMemo(() => {
    const list = poolFor(activeTabId);
    if (!list.length) return [] as StarterPrompt[];
    const n = Math.min(count, list.length);
    const off = offsets[activeTabId] ?? 0;
    const out: StarterPrompt[] = [];
    for (let i = 0; i < n; i++) {
      const p = list[(off + i) % list.length];
      if (p) out.push(p);
    }
    return out;
  }, [poolFor, activeTabId, count, offsets]);

  // Composer: auto-resize e fade do texto recém-preenchido.
  const resizeArea = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, []);

  useEffect(() => {
    resizeArea();
  }, [text, resizeArea]);

  useEffect(() => {
    if (fadeKey === 0 || reduced) return;
    const el = areaRef.current;
    const cls = styles.fadeIn;
    if (!el || !cls) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }, [fadeKey, reduced]);

  // Stop pendente ao desmontar.
  useEffect(() => () => abortRef.current?.abort(), []);

  const pick = useCallback(
    (p: StarterPrompt) => {
      pickedRef.current = p;
      setTextAll(p.prompt);
      onSelect?.(p);
      setFadeKey((k) => k + 1);
      setError(null);
      setAnnouncement(`Picked ${p.title}. The composer is filled.`);
      requestAnimationFrame(() => {
        areaRef.current?.focus();
        resizeArea();
      });
    },
    [onSelect, resizeArea, setTextAll],
  );

  const shuffle = useCallback(() => {
    const list = poolFor(activeTabId);
    if (list.length <= count) {
      setAnnouncement("Nothing to shuffle here");
      return;
    }
    setOffsets((o) => {
      const cur = o[activeTabId] ?? 0;
      let next = cur;
      for (let tries = 0; tries < 8 && next === cur; tries++) {
        next = Math.floor(Math.random() * list.length);
      }
      return { ...o, [activeTabId]: next };
    });
    setAnnouncement("Shuffled the starter cards");
  }, [activeTabId, count, poolFor]);

  const send = useCallback(async () => {
    const message = text.trim();
    if (!message || sendingRef.current) return;
    setError(null);
    setSent(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    sendingRef.current = true;
    setSending(true);
    setAnnouncement(onSubmit ? "Sending" : "Sending (simulated)");
    try {
      if (onSubmit) {
        await onSubmit(message, { prompt: pickedRef.current, signal: ctrl.signal });
      } else {
        await new Promise<void>((resolve, reject) => {
          const t = window.setTimeout(resolve, 1400);
          ctrl.signal.addEventListener("abort", () => {
            window.clearTimeout(t);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      }
      setSent(true);
      setAnnouncement(onSubmit ? "Sent" : "Sent — simulated, no onSubmit wired");
      pickedRef.current = null;
      setTextAll("");
      window.setTimeout(() => setSent(false), 1800);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setAnnouncement("Stopped");
      } else {
        setError(e instanceof Error ? e.message : "Couldn't send. Try again.");
        setAnnouncement("Couldn't send");
      }
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [onSubmit, text, setTextAll]);

  const onAreaKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void send();
      } else if (e.key === "Escape" && sending) {
        abortRef.current?.abort();
      }
    },
    [sending, send],
  );

  const onTabsKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, idx: number) => {
      const last = tabs.length - 1;
      let next: number | null = null;
      if (e.key === "ArrowRight") next = idx >= last ? 0 : idx + 1;
      else if (e.key === "ArrowLeft") next = idx <= 0 ? last : idx - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next !== null) {
        e.preventDefault();
        tabRefs.current[next]?.focus();
        const target = tabs[next];
        if (target) setTab(target.id);
      }
    },
    [tabs],
  );

  const canSend = text.trim().length > 0 && !sending;
  const modelMark = model?.mark ?? <ClaudeMark size={13} />;
  const modelName = model?.name ?? "Claude Sonnet 5.5";

  return (
    <section className={[styles.root, className].filter(Boolean).join(" ")} aria-label="Starter prompts">
      <h2 className={styles.greeting}>{greeting}</h2>
      {description != null && <p className={styles.description}>{description}</p>}

      <div className={styles.controls}>
        <div role="tablist" aria-label="Starter categories" className={styles.tablist}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTabId === t.id}
              tabIndex={activeTabId === t.id ? 0 : -1}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={activeTabId === t.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabsKeyDown(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" className={styles.shuffle} onClick={shuffle} aria-label="Shuffle the starter cards">
          <Shuffle size={15} strokeWidth={2.2} aria-hidden />
          <span className={styles.shuffleLabel}>Shuffle</span>
        </button>
      </div>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: count }).map((_, i) => (
              <div key={`sk-${i}`} className={styles.cell} aria-hidden>
                <div className={styles.skeleton}>
                  <span className={`${styles.skBar} ${styles.skTop}`} />
                  <span className={`${styles.skBar} ${styles.skTitle}`} />
                  <span className={`${styles.skBar} ${styles.skDesc}`} />
                </div>
              </div>
            ))
          : Array.from({ length: count }).map((_, i) => {
              const p = cells[i];
              const cat = p ? (categories.find((c) => c.id === p.category) ?? null) : null;
              const catTone = CAT_TONES[cat?.id ?? ""] ?? "";
              return (
                <div key={`cell-${i}`} className={styles.cell}>
                  <AnimatePresence mode="wait" initial={false}>
                    {p ? (
                      <motion.div
                        key={p.id}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.16, delay: i * 0.035, ease: "easeOut" }}
                        className={styles.cardMotion}
                      >
                        <CardButton
                          prompt={p}
                          catLabel={cat?.label ?? p.category}
                          catIcon={cat?.icon}
                          catTone={catTone}
                          onPick={pick}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`empty-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.1 }}
                        className={styles.cardEmpty}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
      </div>

      <div className={styles.composer}>
        <textarea
          ref={areaRef}
          className={styles.area}
          rows={1}
          value={text}
          placeholder={placeholder}
          aria-label="Message"
          onChange={(e) => {
            pickedRef.current = null;
            setTextAll(e.target.value);
          }}
          onKeyDown={onAreaKeyDown}
        />
        <div className={styles.composerFooter}>
          <span className={styles.modelTag}>
            {modelMark}
            <span>{modelName}</span>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            {error ? (
              <motion.span
                key="status-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className={styles.statusError}
              >
                <TriangleAlert size={13} strokeWidth={2.2} aria-hidden />
                <span className={styles.statusText}>{error}</span>
                <button type="button" className={styles.retryBtn} onClick={() => void send()}>
                  Retry
                </button>
              </motion.span>
            ) : sending ? (
              <motion.span
                key="status-sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className={styles.status}
              >
                Sending…
              </motion.span>
            ) : sent ? (
              <motion.span
                key="status-done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className={styles.statusDone}
              >
                <Check size={13} strokeWidth={2.4} aria-hidden />
                Sent
              </motion.span>
            ) : null}
          </AnimatePresence>
          <button
            type="button"
            className={styles.sendBtn}
            disabled={!sending && !canSend}
            aria-label={sending ? "Stop sending" : "Send message"}
            onClick={() => (sending ? abortRef.current?.abort() : void send())}
          >
            {sending ? (
              <Square size={11} fill="currentColor" strokeWidth={0} aria-hidden />
            ) : (
              <ArrowUp size={15} strokeWidth={2.2} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <span className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </section>
  );
}

/* ---------- cartão ---------- */

interface CardButtonProps {
  prompt: StarterPrompt;
  catLabel: string;
  catIcon?: ReactNode;
  catTone: string;
  onPick: (p: StarterPrompt) => void;
}

function CardButton({ prompt, catLabel, catIcon, catTone, onPick }: CardButtonProps) {
  const app = prompt.app ? APPS[prompt.app] : null;
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onPick(prompt)}
      aria-label={`${prompt.title}${app ? `, uses ${app.name}` : ""}, ${catLabel} starter`}
    >
      <span className={styles.cardHead}>
        <span className={`${styles.catTag} ${catTone}`.trim()}>
          {catIcon}
          <span>{catLabel}</span>
        </span>
        {app && (
          <span className={styles.appTag}>
            <app.Mark size={16} />
            <span>{app.name}</span>
          </span>
        )}
      </span>
      <span className={styles.cardTitle}>{prompt.title}</span>
      {prompt.description ? <span className={styles.cardDesc}>{prompt.description}</span> : null}
    </button>
  );
}
