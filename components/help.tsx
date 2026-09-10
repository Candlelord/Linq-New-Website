"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";

/* Measured off the live site: a 1440×900 #E5D5FF panel with six chat bubbles
   scattered around a centred heading and CTA. The bubbles are static — nothing
   in this section animates.

   The phone variant (390×573) is a genuine re-layout, not a scale: the stage
   shrinks to 373×504 and every bubble is repositioned by hand, so the two sets
   of coordinates share no single ratio. The bubble *art* is close to a uniform
   0.42 of its desktop size (0.46 for "How can we help you?"), so the same SVGs
   are reused at the measured phone sizes rather than redrawn.

   Both coordinate sets ship as custom properties and globals.css picks which
   one applies. They cannot be written straight into `left`/`top` here: an
   inline style would outrank the media query that has to override it.

   Desktop positions are relative to the 1280×677 stage inset at (80, 112);
   phone positions to the 373×504 stage inset at (9, 35). Where the live markup
   centres a child with left:50% + translateX(-50%), the resolved left is baked
   in instead, since these are fixed-size boxes. */
type Box = { left: number; top: number; w: number; h?: number };

type Variant = {
  box: Box;
  art: Box;
  inner?: Box;
  /* Text is positioned and width-constrained; its height is content-driven. */
  text?: Box;
};

type Bubble = {
  key: string;
  art: string;
  inner?: string;
  text?: string;
  dark?: boolean;
  d: Variant;
  m: Variant;
};

const BUBBLES: Bubble[] = [
  {
    key: "howcanwe",
    art: "/images/help/bubble-howcanwe.svg",
    text: "How can we help you?",
    d: {
      box: { left: 250, top: 34, w: 357, h: 162 },
      art: { left: 0, top: 0, w: 358, h: 162 },
      text: { left: 40.031, top: 39, w: 276.938 },
    },
    m: {
      box: { left: 66, top: 89, w: 165, h: 80 },
      art: { left: 0, top: 1, w: 165, h: 75 },
      text: { left: 25, top: 18, w: 115 },
    },
  },
  {
    key: "limit",
    art: "/images/help/bubble-limit.svg",
    text: "I want to upgrade my limit.",
    dark: true,
    d: {
      box: { left: 730, top: 0, w: 357, h: 198 },
      art: { left: 0, top: 0, w: 358, h: 198 },
      text: { left: 44.062, top: 39, w: 276 },
    },
    m: {
      box: { left: 218, top: 17, w: 154, h: 86 },
      art: { left: 2, top: 4, w: 150, h: 83 },
      text: { left: 19, top: 20, w: 116 },
    },
  },
  {
    key: "lines-white",
    art: "/images/help/bubble-lines-white.svg",
    inner: "/images/help/lines-grey.svg",
    d: {
      box: { left: 0, top: 179, w: 324, h: 233 },
      art: { left: 0, top: 0, w: 319, h: 233 },
      inner: { left: 22.047, top: 45, w: 263, h: 97 },
    },
    m: {
      box: { left: 3, top: 0, w: 136, h: 98 },
      art: { left: 0, top: 0, w: 134, h: 95 },
      inner: { left: 8, top: 16, w: 110, h: 41 },
    },
  },
  {
    key: "mom",
    art: "/images/help/bubble-mom.svg",
    text: "Can i send money to my mom",
    d: {
      box: { left: 951, top: 265, w: 329, h: 204 },
      art: { left: 0, top: 2, w: 329, h: 199 },
      text: { left: 36, top: 40, w: 257 },
    },
    m: {
      box: { left: 180, top: 423, w: 135, h: 82 },
      art: { left: 1, top: 1, w: 131, h: 80 },
      text: { left: 16, top: 16, w: 102 },
    },
  },
  {
    key: "signin",
    art: "/images/help/bubble-signin.svg",
    text: "I need help signin into my account right now",
    d: {
      box: { left: 81, top: 427, w: 382, h: 231 },
      art: { left: 0, top: 0, w: 382, h: 231 },
      text: { left: 52, top: 55, w: 278 },
    },
    m: {
      box: { left: 0, top: 341, w: 163, h: 100 },
      art: { left: 1, top: 2, w: 160, h: 97 },
      text: { left: 23, top: 23, w: 117 },
    },
  },
  {
    key: "lines-purple",
    art: "/images/help/bubble-lines-purple.svg",
    inner: "/images/help/lines-white.svg",
    d: {
      box: { left: 640, top: 451, w: 374, h: 226 },
      art: { left: 0, top: 0, w: 374, h: 226 },
      inner: { left: 40.297, top: 37, w: 292, h: 106 },
    },
    m: {
      box: { left: 216, top: 335, w: 157, h: 95 },
      art: { left: 0, top: 0, w: 157, h: 95 },
      inner: { left: 16, top: 15, w: 122, h: 45 },
    },
  },
];

/* One prefixed set of custom properties per element, so the stylesheet can pick
   between them. `h` is optional because text boxes are content-height. */
function vars(p: string, d: Box, m: Box): CSSProperties {
  return {
    [`--d-${p}x`]: `${d.left}px`,
    [`--d-${p}y`]: `${d.top}px`,
    [`--d-${p}w`]: `${d.w}px`,
    [`--m-${p}x`]: `${m.left}px`,
    [`--m-${p}y`]: `${m.top}px`,
    [`--m-${p}w`]: `${m.w}px`,
    ...(d.h !== undefined && m.h !== undefined
      ? { [`--d-${p}h`]: `${d.h}px`, [`--m-${p}h`]: `${m.h}px` }
      : {}),
  } as CSSProperties;
}

export function Help() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section
      id="contact"
      className="relative h-[900px] w-full overflow-clip bg-[#e5d5ff] mob:h-[573px]"
    >
      {/* The stage keeps its authored size and centres in the viewport. Pinning
          it to left:80 only matches at exactly 1440px wide — anywhere wider it
          drifts left of centre. */}
      <div className="help-stage absolute left-1/2 -translate-x-1/2">
        {BUBBLES.map((b) => (
          <div
            key={b.key}
            className="help-bubble absolute overflow-clip"
            style={vars("b", b.d.box, b.m.box)}
          >
            <img
              src={b.art}
              alt=""
              className="help-art absolute max-w-none"
              style={vars("a", b.d.art, b.m.art)}
            />
            {b.inner && b.d.inner && b.m.inner && (
              <img
                src={b.inner}
                alt=""
                className="help-inner absolute max-w-none"
                style={vars("i", b.d.inner, b.m.inner)}
              />
            )}
            {b.text && b.d.text && b.m.text && (
              <p
                className="help-text absolute m-0 font-medium"
                style={{
                  ...vars("t", b.d.text, b.m.text),
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
        <div className="help-cta absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-[32px] mob:gap-[16px]">
          <h2 className="m-0 font-display text-[64px] leading-[46px] font-medium tracking-[-3.84px] whitespace-nowrap text-black mob:text-[18px] mob:leading-[13.4px] mob:tracking-[-1.08px]">
            Need help using Linq?
          </h2>
          {/* Live reads "Get the app" here at both breakpoints; this rebuild
              already routes it to the contact dialog instead. Left as-is. */}
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="pressable inline-flex h-[54px] w-[220px] cursor-pointer items-center justify-center gap-[8px] rounded-[2000px] border border-transparent text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] select-none mob:h-[42px] mob:w-[172px] mob:text-[14px] mob:leading-[18.72px] mob:tracking-[-0.84px]"
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
