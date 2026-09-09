"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Port of the designer's Framer ScrambleText component.

   Every letter flickers through random characters, then locks into place
   left-to-right until the real word is revealed. Idle, mid-scramble and locked
   characters each get their own colour. Framer's property controls are dropped;
   the tunables become props with the same defaults. */
const DEFAULT_CHARS = "$USE$LINQ$";

type Props = {
  text: string;
  className?: string;
  chars?: string;
  /* ms of flicker before the first character may lock */
  scrambleDuration?: number;
  /* ms between each successive character locking, left to right */
  revealDelay?: number;
  /* ms between random-character frame updates */
  scrambleSpeed?: number;
  idleColor?: string;
  scrambleColor?: string;
  revealColor?: string;
};

export function ScrambleText({
  text,
  className = "",
  chars = DEFAULT_CHARS,
  scrambleDuration = 300,
  revealDelay = 35,
  scrambleSpeed = 30,
  idleColor = "#000000",
  scrambleColor = "#8a4fff",
  revealColor = "#8a4fff",
}: Props) {
  const [status, setStatus] = useState<"idle" | "active" | "done">("idle");
  const [frame, setFrame] = useState(() =>
    text.split("").map((ch) => ({ ch, locked: false })),
  );
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const randomChar = useCallback(
    () => chars[Math.floor(Math.random() * chars.length)] || " ",
    [chars],
  );

  const cancel = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const run = useCallback(() => {
    if (!text) return;
    cancel();
    startRef.current = null;
    setStatus("active");
    let lastUpdate = -Infinity;
    const total = scrambleDuration + (text.length - 1) * revealDelay;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      if (elapsed - lastUpdate >= scrambleSpeed) {
        lastUpdate = elapsed;
        setFrame(
          text.split("").map((char, i) => {
            if (char === " ") return { ch: " ", locked: true };
            const locked = elapsed >= scrambleDuration + i * revealDelay;
            return { ch: locked ? char : randomChar(), locked };
          }),
        );
      }

      if (elapsed < total) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setFrame(text.split("").map((ch) => ({ ch, locked: true })));
        setStatus("done");
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, scrambleDuration, revealDelay, scrambleSpeed, randomChar]);

  const reset = useCallback(() => {
    cancel();
    startRef.current = null;
    setFrame(text.split("").map((ch) => ({ ch, locked: false })));
    setStatus("idle");
  }, [text]);

  useEffect(() => cancel, []);

  const handlers = {
    onMouseEnter: run,
    onFocus: run,
    onMouseLeave: reset,
    onBlur: reset,
  };

  /* Idle and done are a single span — only the active phase needs to colour
     characters individually, so the DOM stays flat the rest of the time. */
  if (status !== "active") {
    return (
      <span
        {...handlers}
        className={className}
        style={{
          color: status === "done" ? revealColor : idleColor,
          transition: "color 150ms ease-out",
          whiteSpace: "pre",
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span {...handlers} className={className} style={{ whiteSpace: "pre" }}>
      {frame.map((c, i) => (
        <span
          key={i}
          style={{
            color: c.locked ? revealColor : scrambleColor,
            transition: "color 80ms ease-out",
          }}
        >
          {c.ch}
        </span>
      ))}
    </span>
  );
}
