import { useEffect, useState, type ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { SiteButton } from "@/site/components/site-button";
import { items } from "@/site/lib/catalog";
import { freeItems, PRICE, proItems } from "@/site/lib/plans";
import { site } from "@/site/lib/site-config";
import type { CatalogItem } from "@/site/lib/catalog";
import styles from "./pricing.module.css";

const ofKind = (list: CatalogItem[], kind: CatalogItem["kind"]) => list.filter(item => item.kind === kind).length;
const inCategory = (list: CatalogItem[], id: string) => list.filter(item => item.category === id).length;

const rows: [string, number | boolean, number | boolean][] = [
  ["Components", ofKind(freeItems, "component"), ofKind(items, "component")],
  ["Blocks", ofKind(freeItems, "block"), ofKind(items, "block")],
  ["AI agent components", inCategory(freeItems, "ai") || false, inCategory(items, "ai")],
  ["Data and chart components", inCategory(freeItems, "data"), inCategory(items, "data")],
  ["Mini games", inCategory(freeItems, "games") || false, inCategory(items, "games")],
  ["Full source code", true, true],
  ["Light and dark themes", true, true],
  ["Reduced motion support", true, true],
];
const questions: [string, string][] = [
  ["Is this a subscription?", `No. You pay ${PRICE} once.`],
  ["What is the difference between Free and Pro?", `Free has ${freeItems.length} items. Pro has all ${items.length}, including every AI agent component and game.`],
  ["What do I get?", "The source code of each item, in your own project, so you can change anything."],
  ["What does it use?", "React 19, TypeScript, CSS modules, design tokens, Motion and lucide-react."],
  ["Can I try it before buying?", "Yes. Every item has a live demo on its page."],
];
const cell = (value: number | boolean): ReactNode => value === true ? <Check size={17} aria-label="Included" /> : value === false ? <Minus size={17} aria-label="Not included" /> : value;

/** Os planos. O botão de compra ainda não abre o pagamento: o Stripe não foi configurado. */
export function PricingPage() {
  const [notice, setNotice] = useState(false);
  useEffect(() => { document.title = `Pricing · ${site.name}`; }, []);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Start free. Unlock everything once.</h1>
        <p>No subscription and no monthly fee.</p>
      </header>

      <div className={styles.plans}>
        <article className={styles.plan}>
          <h2>Free</h2>
          <p className={styles.amount}><b>$0</b></p>
          <ul>
            <li><Check size={16} aria-hidden="true" />{freeItems.length} components and blocks</li>
            <li><Check size={16} aria-hidden="true" />Full source code</li>
            <li><Check size={16} aria-hidden="true" />Light and dark themes</li>
          </ul>
          <SiteButton to="/components" query={{ plan: "free" }} variant="line" size="lg">Browse free items</SiteButton>
        </article>
        <article className={styles.plan} data-pro="">
          <h2>Pro</h2>
          <p className={styles.amount}><b>{PRICE}</b><span>one-time payment</span></p>
          <ul>
            <li><Check size={16} aria-hidden="true" />All {items.length} components and blocks</li>
            <li><Check size={16} aria-hidden="true" />{proItems.length} items only in Pro</li>
            <li><Check size={16} aria-hidden="true" />AI agent, chart and game components</li>
          </ul>
          <button type="button" className={styles.buy} onClick={() => setNotice(true)}>Get Pro for {PRICE}</button>
          <small role="status">{notice ? "Checkout isn't available yet." : "Secure checkout with Stripe"}</small>
        </article>
      </div>

      <section className={styles.section} aria-labelledby="compare">
        <h2 id="compare">Compare plans</h2>
        <div className={styles.table} role="table" aria-label="Free and Pro compared">
          <div className={styles.row} data-head="" role="row"><span role="columnheader">Included</span><span role="columnheader">Free</span><span role="columnheader">Pro</span></div>
          {rows.map(([label, free, pro]) => <div className={styles.row} role="row" key={label}><span role="cell">{label}</span><span role="cell">{cell(free)}</span><span role="cell" className={styles.highlight}>{cell(pro)}</span></div>)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="questions">
        <h2 id="questions">Questions</h2>
        <div>{questions.map(([question, answer], index) => <details key={question} className={styles.question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
    </div>
  );
}
