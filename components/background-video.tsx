"use client";

import { useEffect, useRef, useState } from "react";

/* A cover video that actually starts.

   Plain `autoPlay muted loop` is not enough on its own. Chrome defers autoplay
   for elements that are off-screen at load, so a video far down the page can sit
   at frame 0 indefinitely if the deferral never fires; and any browser will
   reject autoplay outright unless it is certain the element is muted. So this
   sets `muted` as a property (not just an attribute) before asking to play, then
   retries whenever the element scrolls into view. play() rejections are expected
   and ignored — the next intersection will try again. */
export function BackgroundVideo({
  src,
  className = "",
  eager = true,
}: {
  src: string;
  className?: string;
  /* Pass false below the fold. `preload="none"` is not enough on its own: it is
     a hint, and a browser that ignores it pulls the whole file while the hero is
     still loading. Withholding `src` until the element is near the viewport is
     the only way to actually guarantee those bytes are not spent up front. */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(eager);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;
    const attempt = () => {
      if (!el.src || !el.paused) return;
      void el.play().catch(() => {});
    };

    attempt();
    el.addEventListener("canplay", attempt);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          /* Scrolling this far takes far longer than buffering, so attaching
             here is still comfortably ahead of the visitor. */
          setLive(true);
          attempt();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);

    return () => {
      el.removeEventListener("canplay", attempt);
      io.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={live ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
      aria-hidden="true"
      className={className}
    />
  );
}
