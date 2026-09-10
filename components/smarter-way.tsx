"use client";

import { useEffect, useRef, useState } from "react";
import { ScatterText } from "@/components/scatter-text";

/* An 80vh panel sticks 100px from the top while five scroll targets pass beneath.
   All five lines hold their place from the start — the action words simply fade
   in at their stacked positions, so the block never shifts.

   The phone variant drops the mechanism entirely: the designer ships a plain
   283px block with all four action words already visible in purple, no sticky
   panel and no scroll targets. So on mobile the panel unsticks, the targets are
   removed from the flow, and the per-word opacity — which rides on a custom
   property so a media query can reach past the inline style — is forced to 1. */
const WORDS = ["Send", "Pay bills", "Save", "Buy crypto"];
const TARGETS = 5;
const SPRING = "cubic-bezier(0.34, 1.32, 0.64, 1)";
/* The phone headline is *expanded*, not condensed, despite Framer naming the
   face "Mozilla Headline SemiCondensed": measured against the live word widths
   at 45px, 112.5% on the width axis puts "BUY CRYPTO" at 279.2 against a live
   278.2. That is what makes "A SMARTER WAY TO" overrun the 341px column and
   wrap after "SMARTER", exactly as live does. Desktop keeps its 87.5%. */
const LINE =
  "font-display text-[128px] leading-[132.81px] font-bold tracking-[-0.03em] [font-stretch:87.5%] uppercase m-0 mob:text-[45px] mob:leading-[47.13px] mob:[font-stretch:112.5%]";

export function SmarterWay() {
  const [active, setActive] = useState(-1);
  const targets = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.i);
          setActive(Math.min(i, WORDS.length - 1));
        }
      },
      // A thin band across the middle, so a target "arrives" as it crosses centre.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    for (const el of targets.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-white pt-[100px] mob:pt-0">
      <div className="sticky top-[100px] flex h-[calc(var(--screen-h)*0.8)] flex-col items-center justify-center mob:static mob:h-auto">
        <div className="w-[961px] text-center mob:w-[341px]">
          <p className={LINE}>
            <ScatterText text="A smarter way to" idleColor="#000000" />
          </p>

          {WORDS.map((word, i) => (
            <p
              key={word}
              className={`${LINE} translate-y-[var(--word-y)] opacity-[var(--word-op)] mob:translate-y-0 mob:opacity-100`}
              style={{
                /* Both rest states go through custom properties so the phone
                   media query can override them — a plain `mob:` class cannot
                   win against an inline style. */
                ["--word-op" as string]: i <= active ? 1 : 0,
                ["--word-y" as string]: i <= active ? "0px" : "10px",
                transition: `opacity 0.4s ${SPRING}, transform 0.4s ${SPRING}`,
                /* Hidden lines still occupy space, so keep them unhoverable. */
                pointerEvents: i <= active ? "auto" : "none",
              }}
            >
              <ScatterText text={word} idleColor="#8a4fff" />
            </p>
          ))}
        </div>
      </div>

      {Array.from({ length: TARGETS }, (_, i) => (
        <div
          key={i}
          data-i={i}
          ref={(el) => {
            targets.current[i] = el;
          }}
          className={`mob:hidden ${
            i === TARGETS - 1
              ? "h-[calc(var(--screen-h)*0.9)]"
              : "h-[var(--screen-h)]"
          }`}
        />
      ))}
    </section>
  );
}
