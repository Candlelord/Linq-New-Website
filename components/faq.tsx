"use client";

import { useState } from "react";

/* Measured off the live site. Five 1280×922 panels stack absolutely at 172px
   intervals inside a 1610px-tall well, so only each heading strip shows; the
   last panel is the only one whose body is visible at rest.

   The phone panel is a uniform 0.2906 of that (372×268, radius 11.62) but the
   step is not: 79.53 rather than the 50 a proportional scale would give,
   because the question type is bumped from a scaled 11.6px up to 16px and needs
   a taller strip to sit in. The reveal shortens to 130px. Those live in
   globals.css as custom properties, since they are carried in inline styles
   that a `mob:` class cannot reach.

   Hovering a panel pushes every panel *below* it down by 202px, which uncovers
   that panel's body (74 + 44 + 48 + 114 = 280px of content needs 374px of room).
   The live site cuts to that position with no transition at all; this eases it
   instead. The offset rides on `transform` rather than `top` so the browser can
   composite it — animating `top` would relayout five 1280px panels per frame.

   There is no hover on a phone, so the live site opens a panel on tap and
   leaves it open; the phone reveal is 130px rather than 202. Reproduced here,
   with the pointer path left exactly as it was. */
const SLIDE = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";

const ITEMS = [
  {
    q: "What is Linq?",
    a: "Linq is a platform that connects your crypto to the real world. It allows you to instantly cash out to any Nigerian bank, fund your wallet directly with Naira, pay everyday bills, and automatically save, all from one secure platform",
    bg: "#e5d5ff",
    fg: "#000000",
  },
  {
    q: "How fast will the money hit my bank account?",
    /* The only question long enough to wrap on a phone, and live gives it its
       own line-height because of it. */
    wraps: true,
    a: "Instantly. Linq completely bypasses the unpredictable wait times of traditional P2P trading. Once you initiate a withdrawal, your fiat is settled in your local bank account in seconds.",
    bg: "#bc97ff",
    fg: "#000000",
  },
  {
    q: "Which blockchains does Linq support?",
    a: "We are fully multi-chain. You can manage assets, pay bills, and withdraw directly from Solana, Sui, Base, Tron, Aptos, BNB Chain and many more",
    bg: "#8a4fff",
    fg: "#ffffff",
  },
  {
    q: "How does the Spend & Save feature work?",
    a: "It’s an automated process. You can set a custom percentage to be saved automatically on every transaction you make. Every time you spend, a fraction goes into your secure savings vault without you having to think about it.",
    bg: "#6a30df",
    fg: "#ffffff",
  },
  {
    q: "What if i have issues with my transactions?",
    a: "If you experience any issues, contact support immediately. Our dedicated 24/7 team is always on standby to investigate and resolve any failed or delayed activity so your money is never stuck in limbo.",
    bg: "#3e0d9f",
    fg: "#ffffff",
  },
];

/* The well keeps its resting height on hover, so the pushed-down panels run off
   the bottom and the section clips them — same as the live site. */

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faqs"
      className="flex w-full flex-col items-center justify-center gap-[64px] overflow-clip bg-white px-[128px] py-[64px] mob:px-0"
    >
      <div className="flex w-[784px] flex-col items-center gap-[4px] mob:w-[372px] mob:gap-[1.55px]">
        <h2 className="m-0 w-full text-center font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-black mob:text-[25px] mob:leading-[28.69px] mob:tracking-[-0.75px]">
          Frequently asked questions
        </h2>
        <p className="m-0 w-full text-center text-[32px] leading-[38.4px] tracking-[-1.92px] text-black mob:text-[12px] mob:leading-[14.4px] mob:tracking-[-0.72px]">
          Everything you need to know about using Linq.
        </p>
      </div>

      <div
        className="relative w-[var(--faq-well-w)]"
        style={{ height: "var(--faq-well-h)" }}
        onMouseLeave={() => setOpen(null)}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.q}
            onMouseEnter={() => setOpen(i)}
            onClick={() => setOpen(i)}
            className="absolute left-0 w-[var(--faq-well-w)]"
            style={{
              top: `calc(var(--faq-step) * ${i})`,
              transform:
                open !== null && i > open
                  ? "translateY(var(--faq-reveal))"
                  : "translateY(0px)",
              transition: SLIDE,
              height: "var(--faq-panel-h)",
              background: item.bg,
              /* Only the last panel rounds its bottom — the others are covered. */
              borderRadius:
                i === ITEMS.length - 1
                  ? "var(--faq-radius)"
                  : "var(--faq-radius) var(--faq-radius) 0px 0px",
            }}
          >
            {/* Centred in the panel rather than pinned to a left inset: the
                live file drifts ±4px per panel around a centred group, which is
                Framer noise rather than a design. */}
            <div
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-start"
              style={{
                top: "var(--faq-body-y)",
                width: "var(--faq-body-w)",
                gap: "var(--faq-body-gap)",
              }}
            >
              <h3
                className="m-0 font-display font-normal"
                style={{
                  color: item.fg,
                  fontSize: "var(--faq-q-fs)",
                  lineHeight: item.wraps
                    ? "var(--faq-q-lh-wrap)"
                    : "var(--faq-q-lh)",
                  letterSpacing: "var(--faq-q-ls)",
                }}
              >
                {item.q}
              </h3>
              <p
                className="m-0 font-light"
                style={{
                  color: item.fg,
                  fontSize: "var(--faq-a-fs)",
                  lineHeight: "var(--faq-a-lh)",
                  letterSpacing: "var(--faq-a-ls)",
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
