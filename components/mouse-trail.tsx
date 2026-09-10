"use client";

import { useEffect, useRef, useState } from "react";

/* A single 275px box spring-following the cursor, swapping image by horizontal
   zone. All three images stay mounted so switching never refetches or flashes —
   the reveal is a clip-path transition rather than a remount.

   Desktop only. `pointermove` fires for touch as well as a mouse, and
   `pointerleave` does not fire on a phone — so a single scroll-drag switched
   the trail on and left a 275px coin parked over the hero for good. Live has
   the same element on mobile but never activates it (it sits at rest: 41×41,
   which is this 275 at the 0.15 idle scale), so removing it here matches what
   the live site actually shows.

   Gating on a media query rather than a touch test, because the breakpoint is
   what decides whether this is a pointer layout at all — and it re-evaluates on
   rotation, which a one-shot capability check would not. */
const IMAGES = ["/images/usdc.png", "/images/naira.png", "/images/usdt.png"];
const SIZE = 275;
const PHONE = "(max-width: 810px)";

export function MouseTrail() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [zone, setZone] = useState(0);
  const [active, setActive] = useState(false);
  /* Starts false so the first client render matches the server's. On a phone
     the effect then unmounts it — invisible either way, since it rests at
     opacity 0. */
  const [phone, setPhone] = useState(false);

  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Listen on the parent section so this layer can sit above the headline
     without swallowing clicks on the buttons beneath it. */
  useEffect(() => {
    if (phone) return;
    const host = boxRef.current?.parentElement;
    if (!host) return;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      /* Pointer coords and getBoundingClientRect are in screen pixels, but the
         transform below is applied in this element's own coordinate space. The
         page is under a CSS `zoom`, so divide the difference back out — the
         ratio of measured to laid-out width gives it without hard-coding. */
      const scale = host.offsetWidth ? r.width / host.offsetWidth : 1;
      const x = (e.clientX - r.left) / scale;
      const y = (e.clientY - r.top) / scale;
      target.current = { x, y };
      setActive((was) => {
        if (!was) pos.current = { x, y };
        return true;
      });
      setZone(
        Math.min(
          IMAGES.length - 1,
          Math.floor((x / host.offsetWidth) * IMAGES.length),
        ),
      );
    };
    const onLeave = () => setActive(false);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [phone]);

  useEffect(() => {
    if (phone) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't destabilise the integrator.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (const axis of ["x", "y"] as const) {
        const a = 100 * (target.current[axis] - pos.current[axis]) - 19 * vel.current[axis];
        vel.current[axis] += a * dt;
        pos.current[axis] += vel.current[axis] * dt;
      }
      if (boxRef.current) {
        boxRef.current.style.transform = `translate3d(${pos.current.x - SIZE / 2}px, ${pos.current.y - SIZE / 2}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phone]);

  /* After every hook, so the hook order never changes between renders. */
  if (phone) return null;

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-20 overflow-hidden rounded-[80px]"
      style={{
        width: SIZE,
        height: SIZE,
        opacity: active ? 0.8 : 0,
        scale: active ? "1" : "0.15",
        transition:
          "opacity 0.3s cubic-bezier(0.16,1,0.3,1), scale 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: i === zone ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "clip-path 1.15s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ))}
    </div>
  );
}
