"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuCoins } from "@/components/menu-coins";

/* Burger is fixed at 102×102, top 38 / right 80. Hover shrinks it to 96.9px and
   tap crosses the bars, both over 1s on cubic-bezier(0.44,0,0.56,1).

   The phone burger is exactly half of that, measured off the live site: 51×51
   at top 38 / right 25, bars 26.5×3, and a 1px inset highlight rather than 2px.
   The sizes ride on custom properties because they are set inline and a `mob:`
   class cannot outrank an inline style. */
type Item = {
  label: string;
  /* An in-page anchor, or null when there is nothing to go to yet. */
  target: string | null;
  badge?: string;
};

const ITEMS: Item[] = [
  { label: "Home", target: "#home" },
  { label: "Features", target: "#features" },
  { label: "FAQs", target: "#faqs" },
  /* No terms page exists yet, so this stays inert rather than pointing at a
     section it does not belong to. */
  { label: "Terms of Use", target: null },
  { label: "Linq Business", target: null, badge: "Coming soon" },
  { label: "Contact Us", target: "#contact" },
];

const EASE = "cubic-bezier(0.44,0,0.56,1)";
const BAR =
  "absolute left-0 h-[6px] w-[53px] rounded-full bg-white mob:h-[3px] mob:w-[26.5px]";

/* Measured off the live site: 102×102 at top 38 / right 80, a 1px rim over a
   100×100 radial fill with an inset white highlight; icon 53×32 at (24.5, 35). */
function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const size = hover ? "var(--burger-size-hover)" : "var(--burger-size)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="fixed top-[38px] right-[80px] z-[60] grid place-items-center rounded-full border border-transparent mob:right-[25px]"
      style={{
        width: size,
        height: size,
        transition: `width 1s ${EASE}, height 1s ${EASE}`,
        background:
          "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%) padding-box, linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%) border-box",
        boxShadow:
          "inset 0 var(--burger-inset) 4px rgba(255,255,255,0.58)",
      }}
    >
      <span className="relative block h-[32px] w-[53px] mob:h-[16px] mob:w-[26.5px]">
        <span
          className={BAR}
          style={{
            top: open ? "var(--burger-bar-mid)" : 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: `all 1s ${EASE}`,
          }}
        />
        <span
          className={BAR}
          style={{
            top: "var(--burger-bar-mid)",
            opacity: open ? 0 : 1,
            transition: `opacity 1s ${EASE}`,
          }}
        />
        <span
          className={BAR}
          style={{
            top: open ? "var(--burger-bar-mid)" : "var(--burger-bar-bot)",
            transform: open ? "rotate(-45deg)" : "none",
            transition: `all 1s ${EASE}`,
          }}
        />
      </span>
    </button>
  );
}

/* Sampled off the live overlay: it fades out over ~450ms and unmounts, which is
   the same curve and duration as the way in. */
const OPEN_MS = 440;
const CLOSE_MS = 450;

/* Measured off the live menu: each row is 106px tall with the label resting at
   x=90. Hovering slides the label 30px right — overshooting to ~124 before it
   settles, hence the spring curve — and reveals a purple arrow to its right.

   Live sets that gap at 34px, which reads cramped against an 88px cap-height
   label; widened here on request. The arrow's resting offset is derived from
   the gap so it stays tucked behind the label's tail whatever the gap is. */
const ROW_H = "var(--menu-row-h)";
const INDENT = "var(--menu-indent)";
const ARROW_GAP = "var(--menu-arrow-gap)";
const ARROW_TUCK = "var(--menu-arrow-tuck)";
const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

function MenuRow({ item, onSelect }: { item: Item; onSelect: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-disabled={item.target ? undefined : true}
      className={`flex w-full items-center text-left ${
        item.target ? "cursor-pointer" : "cursor-default"
      }`}
      style={{ height: ROW_H }}
    >
      <span
        /* Never wrap: the row is a fixed height, and the hover arrow sits
           inside this span (36px gap + 28px of arrow on a phone), which is
           enough to push a long label onto a second line and overlap the row
           below it. The arrow is transparent and tucked left at rest, so
           letting it overhang the viewport costs nothing. */
        className="flex items-center font-display text-[88px] leading-[1.2em] font-semibold tracking-[-0.03em] whitespace-nowrap uppercase mob:text-[40px]"
        style={{
          transform: hover ? `translateX(${INDENT})` : "translateX(0px)",
          transition: `transform 0.4s ${SPRING}`,
        }}
      >
        {item.label}

        {item.badge && (
          <span className="ml-[20px] rounded-full bg-[#8a4fff] px-[16px] py-[6px] font-body text-[16px] leading-[20px] font-medium tracking-[-0.48px] whitespace-nowrap text-white normal-case mob:ml-[10px] mob:px-[8px] mob:py-[3px] mob:text-[8px] mob:leading-[10px] mob:tracking-[-0.24px]">
            {item.badge}
          </span>
        )}

        {/* Tucked under the label at rest and slid clear of it on hover, which
            is how the live one reads even though Framer does it with layout. */}
        <img
          src="/images/menu/arrow.svg"
          alt=""
          width={56}
          height={49}
          aria-hidden
          className="max-w-none shrink-0 mob:h-[24.5px] mob:w-[28px]"
          style={{
            marginLeft: ARROW_GAP,
            opacity: hover ? 1 : 0,
            transform: hover
              ? "translateX(0px)"
              : `translateX(calc(${ARROW_TUCK} * -1))`,
            transition: `opacity 0.3s ease-out, transform 0.4s ${SPRING}`,
          }}
        />
      </span>
    </button>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  /* Kept mounted through the close so the overlay can animate out. Unmounting
     on the same tick as `open` flipping is why closing used to just vanish. */
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setClosing(false), CLOSE_MS);
    return () => clearTimeout(t);
  }, [closing]);

  const close = () => {
    setOpen(false);
    setClosing(true);
  };

  /* Plain overflow lock — no scroll restore. Pinning the body and restoring on
     cleanup fought the nav clicks, which scroll deliberately as the menu closes.
     The scrollbar is already hidden globally, so nothing shifts. */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (target: string | null) => {
    if (!target) return;
    close();
    if (target === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    /* The overlay is still fading out, and the body lock only lifts once `open`
       flips — so defer a frame or the scroll is swallowed. */
    requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const overlay = (
    <div
      aria-hidden={open ? undefined : true}
      className={`fixed inset-0 z-50 bg-white ${open ? "" : "pointer-events-none"}`}
      style={{
        /* Two distinct keyframe names, not one played in reverse — see the note
           on @keyframes menu-out in globals.css. */
        animation: open
          ? `menu-in ${OPEN_MS}ms ${EASE} both`
          : `menu-out ${CLOSE_MS}ms ${EASE} both`,
      }}
    >
      <MenuCoins />

      {/* No phone variant exists for this menu — the live site keeps the
          desktop rows here and clips them. These are laid out at the same 0.5
          the burger uses, which is an extrapolation, not a measurement. */}
      <nav className="absolute top-[38px] left-[80px] z-[1] flex flex-col items-start mob:left-[25px]">
        {ITEMS.map((item) => (
          <MenuRow
            key={item.label}
            item={item}
            onSelect={() => go(item.target)}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <Burger open={open} onClick={() => (open ? close() : setOpen(true))} />
      {(open || closing) && mounted && createPortal(overlay, document.body)}
    </>
  );
}
