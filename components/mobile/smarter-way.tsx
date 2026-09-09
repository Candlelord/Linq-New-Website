"use client";

import { useEffect, useRef, useState } from "react";
import { ScatterText } from "@/components/scatter-text";

/* Phone version of the sticky word cycle. Same mechanism as the desktop
   component — a panel that sticks while scroll targets pass beneath it, with
   each action word fading in at its already-reserved position so the block
   never shifts — at a size that fits a handset.

   The SemiCondensed width axis is kept: it is what holds "A SMARTER WAY TO" on
   one line, and that matters more at 360px than it does at 1440.

   The sticky panel clears the fixed burger (top 16, 48 tall) rather than
   sitting under it. */
const WORDS = ["Send", "Pay bills", "Save", "Buy crypto"];
const TARGETS = 5;
const SPRING = "cubic-bezier(0.34, 1.32, 0.64, 1)";
const LINE =
  "font-display text-[clamp(30px,8.8vw,44px)] leading-[1.04] font-bold tracking-[-0.03em] [font-stretch:87.5%] uppercase m-0";

export function MobileSmarterWay() {
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
    <section className="relative bg-white pt-[64px]">
      <div className="sticky top-[72px] flex h-[calc(var(--screen-h)*0.72)] flex-col items-center justify-center px-[20px]">
        <div className="w-full text-center">
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

      {/* Shorter than the desktop targets: five full screens of scroll to reveal
          four words is a long way to drag a thumb. */}
      {Array.from({ length: TARGETS }, (_, i) => (
        <div
          key={i}
          data-i={i}
          ref={(el) => {
            targets.current[i] = el;
          }}
          className={
            i === TARGETS - 1
              ? "h-[calc(var(--screen-h)*0.6)]"
              : "h-[calc(var(--screen-h)*0.7)]"
          }
        />
      ))}
    </section>
  );
}
