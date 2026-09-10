"use client";

import { Fragment, useMemo, useState } from "react";

/* Port of the designer's Framer ScatterTextButton.

   Each character gets a fixed pseudo-random offset and rotation, so hovering
   scatters the word and leaving pulls it back. The offsets come from a seeded
   hash rather than Math.random so a character always drifts the same way — and
   so server and client render identically.

   Framer Motion drove this with a spring; here it is a CSS transition on a
   spring-shaped cubic-bezier, which keeps the component dependency-free and
   lets `prefers-reduced-motion` neutralise it for free. */
const SPRING = "cubic-bezier(0.34, 1.32, 0.64, 1)";

function seededOffset(index: number, axis: "x" | "y" | "r", distance: number) {
  const seed = axis === "x" ? 12.9898 : axis === "y" ? 78.233 : 45.164;
  const n = Math.sin((index + 1) * seed) * 43758.5453;
  const mapped = (n - Math.floor(n)) * 2 - 1;
  return mapped * distance * (axis === "r" ? 0.45 : 0.7);
}

export function ScatterText({
  text,
  className = "",
  scatterDistance = 8,
  idleColor,
  hoverColor = "#6e3cff",
}: {
  text: string;
  className?: string;
  scatterDistance?: number;
  idleColor?: string;
  hoverColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const chars = useMemo(() => Array.from(text), [text]);
  const scatter = useMemo(
    () =>
      chars.map((_, i) => ({
        x: seededOffset(i, "x", scatterDistance),
        y: seededOffset(i, "y", scatterDistance),
        r: seededOffset(i, "r", scatterDistance),
      })),
    [chars, scatterDistance],
  );

  /* Characters are grouped into words, and only the gaps between words are
     breakable. Every character being its own inline-block means the browser
     will otherwise happily break between any two of them — which is how the
     phone headline first came out as "A SMARTER W / AY TO".

     The character index keeps running across the spaces even though they are
     no longer rendered as spans, so each glyph keeps the same seeded offset it
     had when the whole string was one flat list. */
  const words = useMemo(() => {
    const out: { start: number; chars: string[] }[] = [];
    let current: { start: number; chars: string[] } | null = null;
    chars.forEach((ch, i) => {
      if (ch === " ") {
        current = null;
        return;
      }
      if (!current) {
        current = { start: i, chars: [] };
        out.push(current);
      }
      current.chars.push(ch);
    });
    return out;
  }, [chars]);

  return (
    <span
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={className}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {words.map((word, w) => (
        <Fragment key={word.start}>
          {/* Atomic: the word never breaks internally. The space that follows
              sits outside it, so that is the only break opportunity. */}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.chars.map((ch, j) => {
              const i = word.start + j;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    willChange: "transform",
                    color: hovered ? hoverColor : idleColor,
                    transform: hovered
                      ? `translate(${scatter[i].x}px, ${scatter[i].y}px) rotate(${scatter[i].r}deg)`
                      : "none",
                    transition: `transform 0.45s ${SPRING}, color 0.3s ease-out`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
