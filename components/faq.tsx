"use client";

import { useState } from "react";

/* Measured off the live site. Five 1280×922 panels stack absolutely at 172px
   intervals inside a 1610px-tall well, so only each heading strip shows; the
   last panel is the only one whose body is visible at rest.

   Hovering a panel pushes every panel *below* it down by 202px, which uncovers
   that panel's body (74 + 44 + 48 + 114 = 280px of content needs 374px of room).
   The live site cuts to that position with no transition at all; this eases it
   instead. The offset rides on `transform` rather than `top` so the browser can
   composite it — animating `top` would relayout five 1280px panels per frame. */
const STEP = 172;
const REVEAL = 202;
const PANEL_H = 922;
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
const WELL_H = (ITEMS.length - 1) * STEP + PANEL_H;

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faqs"
      className="flex w-full flex-col items-center justify-center gap-[64px] overflow-clip bg-white px-[128px] py-[64px]"
    >
      <div className="flex w-[784px] flex-col items-center gap-[4px]">
        <h2 className="m-0 w-full text-center font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-black">
          Frequently asked questions
        </h2>
        <p className="m-0 w-full text-center text-[32px] leading-[38.4px] tracking-[-1.92px] text-black">
          Everything you need to know about using Linq.
        </p>
      </div>

      <div
        className="relative w-[1280px]"
        style={{ height: WELL_H }}
        onMouseLeave={() => setOpen(null)}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.q}
            onMouseEnter={() => setOpen(i)}
            className="absolute left-0 w-[1280px]"
            style={{
              top: i * STEP,
              transform: `translateY(${open !== null && i > open ? REVEAL : 0}px)`,
              transition: SLIDE,
              height: PANEL_H,
              background: item.bg,
              /* Only the last panel rounds its bottom — the others are covered. */
              borderRadius:
                i === ITEMS.length - 1 ? "40px" : "40px 40px 0px 0px",
            }}
          >
            <div className="absolute top-[74px] left-[94px] flex w-[1092px] flex-col items-start gap-[48px]">
              <h3
                className="m-0 font-display text-[40px] leading-[44px] font-normal tracking-[-1.6px]"
                style={{ color: item.fg }}
              >
                {item.q}
              </h3>
              <p
                className="m-0 text-[32px] leading-[38px] font-light tracking-[-1.92px]"
                style={{ color: item.fg }}
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
