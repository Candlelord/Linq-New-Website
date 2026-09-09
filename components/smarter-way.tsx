"use client";

import { useEffect, useRef, useState } from "react";
import { ScatterText } from "@/components/scatter-text";

/* An 80vh panel sticks 100px from the top while five scroll targets pass beneath.
   All five lines hold their place from the start — the action words simply fade
   in at their stacked positions, so the block never shifts. */
const WORDS = ["Send", "Pay bills", "Save", "Buy crypto"];
const TARGETS = 5;
const SPRING = "cubic-bezier(0.34, 1.32, 0.64, 1)";
const LINE = "font-display text-[128px] leading-[132.81px] font-bold tracking-[-0.03em] [font-stretch:87.5%] uppercase m-0";

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
    <section className="relative bg-white pt-[100px]">
      <div className="sticky top-[100px] flex h-[calc(var(--screen-h)*0.8)] flex-col items-center justify-center">
        <div className="w-[961px] text-center">
          <p className={LINE}>
            <ScatterText text="A smarter way to" idleColor="#000000" />
          </p>

          {WORDS.map((word, i) => (
            <p
              key={word}
              className={LINE}
              style={{
                opacity: i <= active ? 1 : 0,
                transform: `translateY(${i <= active ? 0 : 10}px)`,
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
          className={
            i === TARGETS - 1
              ? "h-[calc(var(--screen-h)*0.9)]"
              : "h-[var(--screen-h)]"
          }
        />
      ))}
    </section>
  );
}
