"use client";

import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";

/* Measured off the live site: a 1440×900 #E5D5FF panel with six chat bubbles
   scattered around a centred heading and CTA. The bubbles are static — nothing
   in this section animates.

   Every position below is relative to the 1280×677 stage inset at (80, 112).
   Where the live markup centres a child with left:50% + translateX(-50%), the
   resolved left is baked in instead, since these are fixed-size boxes. */
const STAGE_W = 1280;
const STAGE_H = 677;

type Bubble = {
  key: string;
  left: number;
  top: number;
  w: number;
  h: number;
  /* The bubble shape, drawn at its own size and offset inside the clip box. */
  art: string;
  artW: number;
  artH: number;
  artLeft?: number;
  artTop?: number;
  /* Either a line of copy, or a second SVG standing in for a message body. */
  text?: string;
  textLeft?: number;
  textTop?: number;
  textW?: number;
  dark?: boolean;
  inner?: string;
  innerW?: number;
  innerH?: number;
  innerLeft?: number;
  innerTop?: number;
};

const BUBBLES: Bubble[] = [
  {
    key: "howcanwe",
    left: 250, top: 34, w: 357, h: 162,
    art: "/images/help/bubble-howcanwe.svg", artW: 358, artH: 162,
    text: "How can we help you?", textLeft: 40.031, textTop: 39, textW: 276.938,
  },
  {
    key: "limit",
    left: 730, top: 0, w: 357, h: 198,
    art: "/images/help/bubble-limit.svg", artW: 358, artH: 198,
    text: "I want to upgrade my limit.", textLeft: 44.062, textTop: 39, textW: 276,
    dark: true,
  },
  {
    key: "lines-white",
    left: 0, top: 179, w: 324, h: 233,
    art: "/images/help/bubble-lines-white.svg", artW: 319, artH: 233,
    inner: "/images/help/lines-grey.svg", innerW: 263, innerH: 97,
    innerLeft: 22.047, innerTop: 45,
  },
  {
    key: "mom",
    left: 951, top: 265, w: 329, h: 204,
    art: "/images/help/bubble-mom.svg", artW: 329, artH: 199, artTop: 2,
    text: "Can i send money to my mom", textLeft: 36, textTop: 40, textW: 257,
  },
  {
    key: "signin",
    left: 81, top: 427, w: 382, h: 231,
    art: "/images/help/bubble-signin.svg", artW: 382, artH: 231,
    text: "I need help signin into my account right now",
    textLeft: 52, textTop: 55, textW: 278,
  },
  {
    key: "lines-purple",
    left: 640, top: 451, w: 374, h: 226,
    art: "/images/help/bubble-lines-purple.svg", artW: 374, artH: 226,
    inner: "/images/help/lines-white.svg", innerW: 292, innerH: 106,
    innerLeft: 40.297, innerTop: 37,
  },
];

export function Help() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section id="contact" className="relative h-[900px] w-full overflow-clip bg-[#e5d5ff]">
      {/* The stage keeps its authored 1280×677 size and centres in the viewport.
          Pinning it to left:80 only matches at exactly 1440px wide — anywhere
          wider it drifts left of centre. */}
      <div
        className="absolute top-[112px] left-1/2 -translate-x-1/2"
        style={{ width: STAGE_W, height: STAGE_H }}
      >
        {BUBBLES.map((b) => (
          <div
            key={b.key}
            className="absolute overflow-clip"
            style={{ left: b.left, top: b.top, width: b.w, height: b.h }}
          >
            <img
              src={b.art}
              alt=""
              className="absolute max-w-none"
              style={{
                left: b.artLeft ?? 0,
                top: b.artTop ?? 0,
                width: b.artW,
                height: b.artH,
              }}
            />
            {b.inner && (
              <img
                src={b.inner}
                alt=""
                className="absolute max-w-none"
                style={{
                  left: b.innerLeft,
                  top: b.innerTop,
                  width: b.innerW,
                  height: b.innerH,
                }}
              />
            )}
            {b.text && (
              <p
                className="absolute m-0 text-[29px] leading-[34.8px] font-medium tracking-[-1.74px]"
                style={{
                  left: b.textLeft,
                  top: b.textTop,
                  width: b.textW,
                  color: b.dark ? "#000000" : "#ffffff",
                }}
              >
                {b.text}
              </p>
            )}
          </div>
        ))}

        {/* Heading + CTA, centred on the stage. The 46px line-height is the
            live value — tighter than the font size, which is what pulls the
            button up close under the heading. */}
        <div className="absolute top-[252.188px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[32px]">
          <h2 className="m-0 font-display text-[64px] leading-[46px] font-medium tracking-[-3.84px] whitespace-nowrap text-black">
            Need help using Linq?
          </h2>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="pressable inline-flex h-[54px] w-[220px] cursor-pointer items-center justify-center gap-[8px] rounded-[2000px] border border-transparent text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] select-none"
            style={{
              background:
                "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%) padding-box, linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%) border-box",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)",
            }}
          >
            Contact us
          </button>
        </div>
      </div>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}
