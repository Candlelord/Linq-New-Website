"use client";

import { useState } from "react";

/* Phone version of the FAQ.

   The desktop section is five 1280×922 panels stacked absolutely at 172px
   intervals, where hovering a panel pushes the ones below it down to uncover
   its body. Both halves of that mechanism are unavailable here: 1280px panels
   do not fit, and there is no hover on a touch screen — a tap that only reveals
   on hover leaves the answer permanently hidden.

   So it becomes what it always was underneath: an accordion. Same five items,
   same palette, same order, opened by tap.

   The body animates on `grid-template-rows` between 0fr and 1fr rather than
   max-height. A max-height transition has to guess a height large enough for
   the longest answer, which makes every shorter one snap open early and close
   with a lag; 0fr→1fr resolves to the content's real height.

   Mirrors the ITEMS list in components/faq.tsx — keep the two in sync. */
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

const EASE = "cubic-bezier(0.22,1,0.36,1)";

export function MobileFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="m-faqs" className="w-full bg-white px-[20px] py-[64px]">
      <div className="mx-auto flex max-w-[520px] flex-col gap-[32px]">
        <div className="flex flex-col items-center gap-[6px] text-center">
          <h2 className="m-0 font-display text-[clamp(28px,7.6vw,38px)] leading-[1.12] font-medium tracking-[-0.03em] text-black">
            Frequently asked questions
          </h2>
          <p className="m-0 text-[clamp(15px,4.2vw,19px)] leading-[1.2] tracking-[-0.03em] text-black">
            Everything you need to know about using Linq.
          </p>
        </div>

        <div className="flex flex-col gap-[12px]">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-[24px]"
                style={{ background: item.bg }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-[16px] px-[20px] py-[18px] text-left"
                  style={{ color: item.fg }}
                >
                  <h3 className="m-0 font-display text-[clamp(17px,4.6vw,21px)] leading-[1.2] font-normal tracking-[-0.02em]">
                    {item.q}
                  </h3>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="h-[20px] w-[20px] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: `transform 0.4s ${EASE}`,
                    }}
                  >
                    <path d="M5 9l7 7 7-7" />
                  </svg>
                </button>

                <div
                  className="grid"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: `grid-template-rows 0.45s ${EASE}`,
                  }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="m-0 px-[20px] pb-[20px] text-[clamp(14px,3.9vw,16px)] leading-[1.42] font-light tracking-[-0.01em]"
                      style={{ color: item.fg }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
