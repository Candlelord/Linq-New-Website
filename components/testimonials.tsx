"use client";

import { useRef } from "react";

/* Measured off the live site. Cards hang from a horizontal rail and rock 1°
   on a 833ms mirrored tween; the whole row tickers left at 100px/s and eases
   down to 30px/s while the pointer is over it.

   The rail is not one continuous bar. Each slot carries two 298px segments:
   one *behind* the card starting at x=231, and one *in front* starting at x=0
   that runs across the card's left half and stops with a rounded cap just past
   the ring. A third 59px link sits inside the card behind the art, filling the
   gap between the front segment's cap and the ring's inner edge — so the rail
   reads as passing through the hole. Drawing a single bar in front (or a single
   bar behind) both get this visibly wrong. */
const SLOT = 493;
const CARD_W = 401;
const CARD_H = 532;
const RAIL_Y = 47;
const SPEED = 100; // px per second
const HOVER_RATE = 0.3; // 30px/s while hovered
const SWING = "card-swing 0.4165s cubic-bezier(0.44,0,0.56,1) infinite alternate";

const REVIEWS = [
  {
    name: "Ada",
    handle: "@adalinqs",
    quote:
      "The auto-save feature is clean. Every spend now quietly builds a savings stack without me thinking about it. That convenience is what kept me using the app.",
  },
  {
    name: "00Finito/acc",
    handle: "@00finito2",
    quote:
      "@Uselinq V2 recent ba.. As Bybit dey jump.. Where I take fear my head no be as e fine sef. That one bam too. Oga the speed ehn, burst head 6 seconds something.. Opay cryV2 no be upgrade ooo.. Better Boss move.Try go look am your mind go dey.",
  },
  {
    name: "Lola Moves",
    handle: "@lolamoves",
    quote:
      "Used Linq to cash out to my bank in minutes. No P2P wahala, no endless waiting, just smooth transfer from wallet to naira. The speed and flow feel properly built.",
  },
  {
    name: "Big T",
    handle: "@teeonchain",
    quote:
      "Bills, crypto and savings in one flow is the part that sold me. The product feels made for how people actually move money here, not like a stitched-together crypto app.",
  },
];

/* One track has to be at least as wide as the viewport or the loop shows a gap
   at the seam. Four reviews only span 1972px, so they repeat to cover wide
   displays — the marquee then translates by exactly one track's width. */
const REPEATS = 3;
const SLOTS = REVIEWS.length * REPEATS;
const DURATION = (SLOTS * SLOT) / SPEED;

function RailSegment({ left }: { left: number }) {
  return (
    <img
      src="/images/testimonials/rail.svg"
      alt=""
      width={298}
      height={10}
      className="absolute max-w-none"
      style={{ left, top: RAIL_Y }}
    />
  );
}

type Review = (typeof REVIEWS)[number];

function Card({ review }: { review: Review }) {
  return (
    <div className="relative shrink-0" style={{ width: SLOT, height: CARD_H }}>
      {/* Behind the card: carries the rail on into the next slot. */}
      <RailSegment left={231} />

      <div
        className="absolute top-0 overflow-hidden rounded-[31px]"
        style={{
          left: SLOT - CARD_W, // 92px lead-in, so the gap sits before each card
          width: CARD_W,
          height: CARD_H,
          animation: SWING,
        }}
      >
        {/* Behind the art, so it shows only through the punched hole. */}
        <img
          src="/images/testimonials/rail-link.svg"
          alt=""
          width={59}
          height={10}
          className="absolute max-w-none"
          style={{ left: 190, top: RAIL_Y }}
        />

        {/* Art carries the punched hole the rail shows through, plus the ring. */}
        <div className="absolute top-[7px] left-[6px] h-[518px] w-[390px] overflow-hidden">
          <img
            src="/images/testimonials/card.svg"
            alt=""
            width={390}
            height={518}
            className="absolute inset-0 max-w-none"
          />
          <p className="absolute top-[89px] left-[26px] m-0 w-[338px] text-[24px] leading-[28px] tracking-[-1.44px] text-black">
            {review.quote}
          </p>
          <div className="absolute top-[422px] left-[26px] flex h-[69px] items-center gap-[12px]">
            {/* No portraits supplied, so the initial stands in — a shared stock
                photo across four different people would read as fake. */}
            <span
              className="grid h-[69px] w-[69px] shrink-0 place-items-center rounded-full text-[26px] leading-none font-medium text-white"
              style={{ background: "linear-gradient(rgb(133,101,214), rgb(74,44,143))" }}
              aria-hidden
            >
              {review.name.charAt(0).toUpperCase()}
            </span>
            <span className="flex flex-col">
              <span className="text-[22px] leading-[26px] font-medium tracking-[-1.1px] text-white">
                {review.name}
              </span>
              <span className="text-[19px] leading-[23px] tracking-[-0.9px] text-[#e8ddff]/75">
                {review.handle}
              </span>
            </span>
          </div>
        </div>

        {/* Framer paints the card's rim on a ::after overlay, so it sits on top
            of the art and does not shift it — and the ring's punched hole stays
            transparent. Reproduced as an overlay for the same reason. */}
        <div className="pointer-events-none absolute inset-0 rounded-[31px] border-[8px] border-[#e8ddff]" />
      </div>

      {/* In front of the card: runs across its left half and caps just past the
          ring. Last in the slot so it paints over the card and its rim. */}
      <RailSegment left={0} />
    </div>
  );
}

function Track() {
  return (
    <div className="flex shrink-0">
      {Array.from({ length: SLOTS }, (_, i) => (
        <Card key={i} review={REVIEWS[i % REVIEWS.length]} />
      ))}
    </div>
  );
}

export function Testimonials() {
  const rowRef = useRef<HTMLDivElement>(null);

  /* Retiming via playbackRate rather than swapping animation-duration: changing
     the duration re-derives progress from the same currentTime and visibly
     jumps the row, whereas the playback rate glides. */
  const setRate = (rate: number) => {
    for (const a of rowRef.current?.getAnimations() ?? []) a.updatePlaybackRate(rate);
  };

  return (
    <section className="flex w-full flex-col items-center justify-center gap-[64px] overflow-clip bg-white py-[84px]">
      <h2 className="m-0 font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-black">
        Word from our users
      </h2>

      <div
        className="relative w-full"
        style={{ height: CARD_H }}
        onMouseEnter={() => setRate(HOVER_RATE)}
        onMouseLeave={() => setRate(1)}
      >
        <div
          ref={rowRef}
          className="flex w-max motion-safe:animate-[marquee_var(--dur)_linear_infinite]"
          style={{ ["--dur" as string]: `${DURATION}s` }}
        >
          <Track />
          <Track />
        </div>
      </div>
    </section>
  );
}
