import type { ReactNode } from "react";

/* Renders a desktop section at a fraction of its authored size.

   Two sections — the chain ticker and the testimonial rail — are art, not
   layout: fixed-size pills and a card whose punched hole, rail segments and
   rim only line up at their measured sizes. Reflowing them would mean
   re-measuring the whole composition, and the rule in CLAUDE.md is to never
   write a value you did not measure. Scaling keeps every measured value intact.

   That is only acceptable because the factors here are mild. The old global
   ladder failed at 0.25, where 32px copy landed at 8px; at 0.5 and 0.75 the
   same copy lands at 16px and 18px, which is inside the readable range. Any
   section whose text would drop below ~15px gets a real mobile layout instead.

   `zoom` rather than `transform: scale()` on purpose: zoom participates in
   layout, so the wrapper's height collapses to the scaled height. A transform
   is painted after layout, which would leave a tall band of empty space under
   every scaled section.

   Caveat inherited from the playbook (§6.3): viewport units ignore zoom. These
   two sections size everything in px and percentages, so there is nothing here
   for that to bite — do not reach for this helper on a section that uses vw/vh. */
export function Scaled({
  factor,
  children,
}: {
  factor: number;
  children: ReactNode;
}) {
  return <div style={{ zoom: factor }}>{children}</div>;
}
