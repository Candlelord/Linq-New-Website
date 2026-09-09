"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Mobile nav. The desktop SiteNav's burger is 102×102 pinned at top 38 / right
   80 in the 1440 space — under the old zoom ladder that landed as a 25px tap
   target on a phone, well under the 44px minimum. This is the phone equivalent:
   a real bar carrying the wordmark and a 48px burger, with the menu as a full
   sheet whose rows are tall enough to hit.

   The palette, the gradient rim and the inset highlight are lifted verbatim
   from site-nav.tsx so the two read as the same control at different sizes.

   Mirrors the ITEMS list in components/site-nav.tsx — keep the two in sync.

   The targets carry an `m-` prefix because BOTH trees are in the DOM at all
   times: `hidden md:block` is display:none, which hides the desktop sections
   without removing them. Pointing at `#features` would resolve to the desktop
   copy, and scrollIntoView on a display:none element silently does nothing. */
type Item = {
  label: string;
  target: string | null;
  badge?: string;
};

const ITEMS: Item[] = [
  { label: "Home", target: "#m-home" },
  { label: "Features", target: "#m-features" },
  { label: "FAQs", target: "#m-faqs" },
  { label: "Terms of Use", target: null },
  { label: "Linq Business", target: null, badge: "Coming soon" },
  { label: "Contact Us", target: "#m-contact" },
];

const EASE = "cubic-bezier(0.44,0,0.56,1)";
const OPEN_MS = 440;
const CLOSE_MS = 450;

const BURGER_FILL =
  "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%) padding-box, linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%) border-box";

/* 48px outer keeps the whole control above the 44px minimum on its own, so the
   bars can stay visually small without shrinking what you actually press. */
const BAR = "absolute left-0 h-[2.5px] w-[22px] rounded-full bg-white";

function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-full border border-transparent"
      style={{ background: BURGER_FILL, boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)" }}
    >
      <span className="relative block h-[14px] w-[22px]">
        <span
          className={BAR}
          style={{
            top: open ? "5.75px" : 0,
            transform: open ? "rotate(45deg)" : "none",
            transition: `all 0.45s ${EASE}`,
          }}
        />
        <span
          className={BAR}
          style={{ top: "5.75px", opacity: open ? 0 : 1, transition: `opacity 0.45s ${EASE}` }}
        />
        <span
          className={BAR}
          style={{
            top: open ? "5.75px" : "11.5px",
            transform: open ? "rotate(-45deg)" : "none",
            transition: `all 0.45s ${EASE}`,
          }}
        />
      </span>
    </button>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  /* Kept mounted through the close so the sheet can animate out — same reason
     as the desktop overlay, see the note on @keyframes menu-out in globals.css. */
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

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (target: string | null) => {
    if (!target) return;
    close();
    if (target === "#m-home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    /* The sheet is still fading and the body lock only lifts once `open` flips,
       so defer a frame or the scroll is swallowed. */
    requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const sheet = (
    <div
      aria-hidden={open ? undefined : true}
      className={`fixed inset-0 z-[70] flex flex-col bg-white ${open ? "" : "pointer-events-none"}`}
      style={{
        animation: open
          ? `menu-in ${OPEN_MS}ms ${EASE} both`
          : `menu-out ${CLOSE_MS}ms ${EASE} both`,
      }}
    >
      {/* The close control lands exactly where the open control was, so nothing
          shifts under the thumb. No wordmark here: both logo assets are solid
          white and this sheet is white — which is why the desktop overlay
          carries no logo either. */}
      <div className="flex h-[72px] shrink-0 items-center justify-end px-[20px]">
        <Burger open onClick={close} />
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-[4px] px-[20px] pb-[72px]">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => go(item.target)}
            aria-disabled={item.target ? undefined : true}
            className={`flex min-h-[56px] w-full items-center gap-[12px] text-left ${
              item.target ? "cursor-pointer" : "cursor-default opacity-45"
            }`}
          >
            <span className="font-display text-[clamp(28px,8vw,38px)] leading-[1.15] font-semibold tracking-[-0.03em] uppercase">
              {item.label}
            </span>
            {item.badge && (
              <span className="rounded-full bg-[#8a4fff] px-[10px] py-[4px] font-body text-[11px] leading-[14px] font-medium whitespace-nowrap text-white normal-case">
                {item.badge}
              </span>
            )}
            {item.target && (
              <img
                src="/images/menu/arrow.svg"
                alt=""
                width={24}
                height={21}
                aria-hidden
                className="ml-auto shrink-0"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Burger only, fixed — the same arrangement as desktop, where the
          wordmark belongs to the hero and only the burger tracks the scroll. */}
      <div className="fixed top-[16px] right-[20px] z-[60]">
        <Burger open={false} onClick={() => setOpen(true)} />
      </div>

      {(open || closing) && mounted && createPortal(sheet, document.body)}
    </>
  );
}
