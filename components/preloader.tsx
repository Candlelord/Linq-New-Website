"use client";

import { useEffect, useRef, useState } from "react";

/* The curtain that holds the page back until it is actually ready to be seen.

   Everything below the fold on this site is absolutely positioned artwork, so a
   half-loaded page does not look like a page still loading — it looks broken.
   Rather than gate on `window.load` (which would wait on the full video files),
   this waits on the things that would be *visibly* missing: web fonts, every
   `<img>` in the document, and enough of the hero video to show a frame. */

/* Deliberately not randomised. A random starting line would have to be picked
   after mount to keep the server and client markup identical, which means the
   first line visibly swaps itself a frame later. */
const MESSAGES = [
  "Converting crypto to pay the Vercel bill",
  "Negotiating with the P2P guy",
  "Waking up the backend engineer",
  "Asking the blockchain to hurry up",
  "Politely declining a Ponzi partnership",
  "Checking if NEPA took light",
  "Counting your naira twice, for safety",
  "Refreshing the exchange rate. Again.",
  "Explaining stablecoins to your uncle",
  "Rounding up the last kobo",
];

/* Both are measured from navigation start, not from when this effect runs.
   `performance.now()` is already navigation-relative, which matters because the
   effect does not run until hydration — on a slow connection that can be a
   second in itself, and the visitor has been staring at the curtain for all of
   it. Timing from the effect would charge them for that wait twice.

   MIN_MS is a floor, not a duration: the bar may not fill before it, so the copy
   always gets read, but slow assets still push past it. Two lines' worth. */
const MIN_MS = 1200;
/* And a ceiling, so a stalled asset can never trap anyone behind the curtain. */
const MAX_MS = 5000;
const MSG_MS = 600;
const FADE_MS = 450;

type Phase = "loading" | "leaving" | "gone";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [msg, setMsg] = useState(0);

  const barRef = useRef<HTMLDivElement>(null);
  const settled = useRef(0);
  const total = useRef(0);
  /* The drawn value, eased toward the real one. A burst of images finishing at
     once should glide the bar, not teleport it. */
  const shown = useRef(0);

  useEffect(() => {
    let raf = 0;
    let forced = false;

    const track = (p: Promise<unknown>) => {
      total.current += 1;
      void p.then(() => {
        settled.current += 1;
      });
    };

    const once = (el: EventTarget, ...events: string[]) =>
      new Promise<void>((resolve) => {
        for (const e of events)
          el.addEventListener(e, () => resolve(), { once: true });
      });

    /* Fonts first: the hero headline is the largest thing on the page, so a
       font swap after the curtain lifts would be impossible to miss. */
    track(document.fonts ? document.fonts.ready : Promise.resolve());

    for (const img of Array.from(document.images)) {
      if (img.complete) continue;
      /* `error` resolves too — a missing asset should not hold the page. */
      track(once(img, "load", "error"));
    }

    /* Only the hero video, and only `canplay` — enough buffered to paint a
       frame, not the whole file. The CTA video is far below the fold and loads
       on its own time. */
    const hero = document.querySelector<HTMLVideoElement>("#home video");
    if (hero && hero.readyState < 3) track(once(hero, "canplay", "error"));

    const leave = () => {
      setPhase("leaving");
      window.setTimeout(() => setPhase("gone"), FADE_MS);
    };

    const tick = () => {
      const elapsed = performance.now();
      if (elapsed >= MAX_MS) forced = true;

      const real = total.current ? settled.current / total.current : 1;
      const timed = elapsed / MIN_MS;
      /* The bar tracks whichever is further behind, so it reaches full exactly
         when both the assets and the floor are satisfied. */
      const target = forced ? 1 : Math.min(real, timed, 1);

      shown.current += (target - shown.current) * 0.14;
      /* Easing alone approaches 1 without arriving; close the last sliver. */
      if (target >= 1 && target - shown.current < 0.02) shown.current = 1;

      if (barRef.current)
        barRef.current.style.transform = `scaleX(${shown.current})`;

      if (shown.current >= 1) {
        leave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const rotate = window.setInterval(
      () => setMsg((m) => (m + 1) % MESSAGES.length),
      MSG_MS,
    );

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(rotate);
    };
  }, []);

  /* The page underneath is fully laid out — it has to be, or its images would
     never start loading — so it must not be scrollable behind the curtain. */
  useEffect(() => {
    if (phase === "gone") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "gone") return null;

  const leaving = phase === "leaving";

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[36px] ${
        leaving ? "pointer-events-none" : ""
      }`}
      style={{
        /* Matches the body background, so there is no flash before React
           paints and none as it lifts. */
        background: "radial-gradient(80% 60% at 50% 45%, #170b2e 0%, #000000 100%)",
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.44,0,0.56,1)`,
      }}
    >
      {/* Without JS the curtain would never lift, so it removes itself. */}
      <noscript>
        <style>{`[role="status"][aria-label="Loading"]{display:none!important}`}</style>
      </noscript>

      {/* Sized in the same 1440 space as the rest of the site, so the body zoom
          renders this at roughly 200px wide on a desktop screen. */}
      <img
        src="/images/footer/logo.svg"
        alt=""
        width={300}
        height={86}
        aria-hidden
      />

      <div className="flex flex-col items-center gap-[24px]">
        <div className="h-[4px] w-[440px] overflow-hidden rounded-full bg-white/12">
          <div
            ref={barRef}
            data-bar
            className="h-full w-full origin-left rounded-full"
            style={{
              transform: "scaleX(0)",
              backgroundImage:
                "linear-gradient(90deg, rgb(106,48,223) 0%, rgb(188,151,255) 100%)",
            }}
          />
        </div>

        {/* Keyed so each line re-runs the fade rather than swapping in place. */}
        <p
          key={msg}
          aria-hidden
          className="m-0 h-[30px] text-[24px] leading-[30px] font-light tracking-[-0.72px] text-white/55"
          style={{ animation: "fade-in 0.35s ease-out both" }}
        >
          {MESSAGES[msg]}
        </p>
      </div>
    </div>
  );
}
