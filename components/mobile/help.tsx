"use client";

import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";

/* Phone version of the support section.

   The desktop original scatters six bubbles across a 1280×677 stage at measured
   coordinates. On a 360px column that composition has nowhere to go, so the
   stage is dropped and the bubbles become what they read as — a short chat
   thread running down the page, alternating sides.

   Three of the six are kept, the three that carry a line of copy. The two
   "lines" bubbles are placeholder message bodies with no text, and the sixth
   (signin) is the tallest at 231px; dropping them keeps the thread from
   crowding out the heading, which is the point of the section.

   Each bubble keeps its authored geometry — the art and its text are positioned
   against each other in measured px — and is scaled as a unit. At 0.6 the 29px
   copy lands at 17.4px.

   Bubble data mirrors components/help.tsx. Keep the two in sync. */
const SCALE = 0.6;

type Bubble = {
  key: string;
  w: number;
  h: number;
  art: string;
  artW: number;
  artH: number;
  artTop?: number;
  text: string;
  textLeft: number;
  textTop: number;
  textW: number;
  dark?: boolean;
  side: "start" | "end";
};

const BUBBLES: Bubble[] = [
  {
    key: "howcanwe",
    w: 357, h: 162,
    art: "/images/help/bubble-howcanwe.svg", artW: 358, artH: 162,
    text: "How can we help you?", textLeft: 40.031, textTop: 39, textW: 276.938,
    side: "start",
  },
  {
    key: "limit",
    w: 357, h: 198,
    art: "/images/help/bubble-limit.svg", artW: 358, artH: 198,
    text: "I want to upgrade my limit.", textLeft: 44.062, textTop: 39, textW: 276,
    dark: true,
    side: "end",
  },
  {
    key: "mom",
    w: 329, h: 204,
    art: "/images/help/bubble-mom.svg", artW: 329, artH: 199, artTop: 2,
    text: "Can i send money to my mom", textLeft: 36, textTop: 40, textW: 257,
    side: "start",
  },
];

function ChatBubble({ bubble }: { bubble: Bubble }) {
  return (
    <div
      className={bubble.side === "end" ? "self-end" : "self-start"}
      style={{ zoom: SCALE }}
    >
      <div
        className="relative overflow-clip"
        style={{ width: bubble.w, height: bubble.h }}
      >
        <img
          src={bubble.art}
          alt=""
          className="absolute max-w-none"
          style={{ left: 0, top: bubble.artTop ?? 0, width: bubble.artW, height: bubble.artH }}
        />
        <p
          className="absolute m-0 text-[29px] leading-[34.8px] font-medium tracking-[-1.74px]"
          style={{
            left: bubble.textLeft,
            top: bubble.textTop,
            width: bubble.textW,
            color: bubble.dark ? "#000000" : "#ffffff",
          }}
        >
          {bubble.text}
        </p>
      </div>
    </div>
  );
}

export function MobileHelp() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section id="m-contact" className="w-full overflow-clip bg-[#e5d5ff] px-[20px] py-[64px]">
      <div className="mx-auto flex max-w-[520px] flex-col gap-[20px]">
        <ChatBubble bubble={BUBBLES[0]} />
        <ChatBubble bubble={BUBBLES[1]} />

        <div className="flex flex-col items-center gap-[20px] py-[16px]">
          <h2 className="m-0 text-center font-display text-[clamp(28px,7.6vw,38px)] leading-[1.12] font-medium tracking-[-0.03em] text-black">
            Need help using Linq?
          </h2>
          {/* 54px tall on desktop; 56 here so it clears the 44px tap minimum
              with room to spare, and full width up to a sensible cap. */}
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="pressable inline-flex h-[56px] w-full max-w-[280px] cursor-pointer items-center justify-center gap-[8px] rounded-[2000px] border border-transparent text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] select-none"
            style={{
              background:
                "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%) padding-box, linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%) border-box",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)",
            }}
          >
            Contact us
          </button>
        </div>

        <ChatBubble bubble={BUBBLES[2]} />
      </div>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
