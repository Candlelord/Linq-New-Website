"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { links } from "@/lib/links";

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/* "Contact us" opens this rather than navigating straight out, so the choice to
   leave the site for Telegram is the visitor's. Portals to <body> for the same
   reason the menu does: any ancestor with a z-index would otherwise trap it. */
export function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] grid place-items-center"
      style={{ animation: `fade-in 0.25s ${EASE} both` }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/50 p-0"
      />

      {/* The dialog is shared by both trees, so its fixed 560px had to give on a
          phone. Every size below is a min()/clamp() whose upper bound is the
          original value, and the two line-heights are the same ratios written
          unitless (46/40 = 1.15, 28/20 = 1.4). Viewport units ignore the body
          `zoom` (playbook §6.3), so at any desktop width 100vw is the full
          viewport and each one resolves to exactly what it was — 560, 48, 40,
          20. Only a narrow viewport moves them. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        tabIndex={-1}
        className="relative w-[min(560px,calc(100vw-40px))] rounded-[32px] bg-white p-[clamp(24px,6vw,48px)] outline-none"
        style={{ boxShadow: "0 24px 80px rgba(23,11,46,0.28)" }}
      >
        <h2
          id="contact-title"
          className="m-0 font-display text-[clamp(28px,7vw,40px)] leading-[1.15] font-medium tracking-[-1.2px] text-black"
        >
          Talk to us
        </h2>
        <p className="mt-[12px] mb-[32px] text-[clamp(16px,4.4vw,20px)] leading-[1.4] tracking-[-0.6px] text-black/70">
          Our team is on Telegram and answers there fastest. Send us a message
          and we&apos;ll pick it up.
        </p>

        <div className="flex flex-col gap-[12px]">
          <a
            href={links.support}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="pressable flex h-[60px] cursor-pointer items-center justify-center gap-[10px] rounded-[2000px] border border-transparent text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] select-none"
            style={{
              background:
                "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%) padding-box, linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%) border-box",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)",
            }}
          >
            <img
              src="/images/footer/telegram.svg"
              alt=""
              width={22}
              height={20}
              className="shrink-0"
            />
            Message us on Telegram
          </a>

          <button
            type="button"
            onClick={onClose}
            className="h-[52px] cursor-pointer rounded-[2000px] text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-black/60 transition-colors hover:text-black"
          >
            Not now
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
