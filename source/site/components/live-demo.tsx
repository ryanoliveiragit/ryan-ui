import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/registry/components/skeleton/skeleton";
import { DemoMount } from "@/site/components/demo-mount";
import styles from "./live-demo.module.css";

/** Um demo real dentro de um quadro: monta perto da tela e diminui até caber, sem nunca voltar a crescer enquanto anima. */
export function LiveDemo({ name }: { name: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setNear(true); observer.disconnect(); } }, { rootMargin: "400px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let scale = 1;
    const fit = () => {
      const node = box.current;
      const inner = node?.firstElementChild as HTMLElement | null;
      if (!node || !inner) return;
      const style = getComputedStyle(node);
      const roomHeight = node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const roomWidth = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      inner.style.zoom = "1";
      scale = Math.max(.5, Math.min(scale, roomHeight / inner.scrollHeight, roomWidth / inner.scrollWidth));
      inner.style.zoom = String(scale);
    };
    const timer = window.setInterval(fit, 250);
    const stop = window.setTimeout(() => window.clearInterval(timer), 6000);
    return () => { window.clearInterval(timer); window.clearTimeout(stop); };
  }, [near, name]);

  return (
    <div className={styles.live} ref={box} data-demo-stage>
      {near ? (
        <DemoMount
          name={name}
          fallback={<div className={styles.wait}><Skeleton label="Loading demo" lines={3} /></div>}
          renderError={(_, retry) => <div className={styles.error} role="alert"><p>This demo didn't load.</p><button type="button" onClick={retry}>Try again</button></div>}
        />
      ) : null}
    </div>
  );
}
