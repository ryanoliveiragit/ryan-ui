import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { LiveDemo } from "@/site/components/live-demo";
import { SiteButton } from "@/site/components/site-button";
import { items, itemsByCategory } from "@/site/lib/catalog";
import { accents } from "@/site/lib/theme";
import { freeItems, PRICE, proItems } from "@/site/lib/plans";
import { href } from "@/site/lib/router";
import { site } from "@/site/lib/site-config";
import styles from "./home.module.css";

const blocks = items.filter(item => item.kind === "block").length;
const components = items.length - blocks;
const stories = [
  { eyebrow: "AI agents", title: "The hard parts of AI interfaces, already built.", text: "Voice, streaming responses, tool approvals, citations and agent activity, with every state designed.", link: href("/components", { cat: "ai" }), cta: `See ${itemsByCategory("ai").length} AI components`, demo: "approval-card" },
  { eyebrow: "Data & charts", title: "Numbers that stay clear while they move.", text: "Funnels, candlesticks, sankey flows, heatmaps and order books for serious dashboards.", link: href("/components", { cat: "data" }), cta: `See ${itemsByCategory("data").length} data components`, demo: "funnel-chart" },
  { eyebrow: "Blocks", title: "Whole sections, ready to make yours.", text: "Start from a finished block, then edit the source code until it fits your product.", link: href("/blocks"), cta: `See ${blocks} blocks`, demo: "token-swap" },
];

/** O início é só a apresentação do produto: o catálogo fica nas abas Components e Blocks. */
export function HomePage() {
  useEffect(() => { document.title = `${site.name} · React components and blocks with motion`; }, []);
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>React components that feel finished.</h1>
        <p>{items.length} components and blocks with motion, states and source code included. Start free. Unlock {proItems.length} more with Pro.</p>
        <div className={styles.row}>
          <SiteButton to="/components" size="lg" arrow>Browse components</SiteButton>
          <SiteButton to="/pricing" variant="line" size="lg">Get Pro for {PRICE}</SiteButton>
        </div>
      </section>

      <section className={styles.stage} aria-label="Live components">
        <div className={styles.shot}><LiveDemo name="voice-orb" /></div>
        <div className={styles.shot}><LiveDemo name="wallet-card" /></div>
        <div className={styles.shot}><LiveDemo name="dock" /></div>
      </section>

      <ul className={styles.stats} aria-label="The library in numbers">
        <li><b>{components}</b>components</li>
        <li><b>{blocks}</b>blocks</li>
        <li><b>{itemsByCategory("ai").length}</b>AI agent components</li>
        <li><b>{accents.length}</b>accent colors</li>
      </ul>

      {stories.map((story, index) => (
        <section className={styles.story} data-flip={index % 2 === 1 || undefined} key={story.eyebrow}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{story.eyebrow}</p>
            <h2>{story.title}</h2>
            <p>{story.text}</p>
            <a className={styles.more} href={story.link}>{story.cta}<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className={styles.shot}><LiveDemo name={story.demo} /></div>
        </section>
      ))}

      <section className={styles.band}>
        <div>
          <h2>Everything, for one payment.</h2>
          <p>Pro adds {proItems.length} components and blocks to the {freeItems.length} free items. Pay {PRICE} once, with no subscription.</p>
        </div>
        <a className={styles.bandLink} href={href("/pricing")}>See what's in Pro<ArrowRight size={16} aria-hidden="true" /></a>
      </section>
    </div>
  );
}
