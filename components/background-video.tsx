"use client";

import { useEffect, useRef } from "react";

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
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;
    const attempt = () => {
      if (!el.paused) return;
      void el.play().catch(() => {});
    };

    attempt();
    el.addEventListener("canplay", attempt);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) attempt();
      },
      { rootMargin: "200px" },
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
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className={className}
    />
  );
}
