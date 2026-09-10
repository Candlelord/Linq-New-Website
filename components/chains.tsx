/* Chains ticker — pills 322×93 r30, fill #EDEDED with a 2px #DDDDDD border,
   28px gap, running at 100px/s with no hover slowdown.

   The phone pill is a uniform 0.47 of that — 151×44 r14, 13px gap, 32px icon,
   15/17.875 label — and the ticker still runs at 100px/s, so the loop duration
   has to be derived from the pill width rather than fixed. The sizes come in
   as custom properties (see globals.css) because the track width they feed is
   needed in JS, not just in a class. */
/* Order matches the live ticker; names verified against each downloaded file.
   Stellar is not on the live site — its mark is a vector drawn to match the
   others' flat-on-black treatment, so swap in the designer's render when there
   is one. */
const CHAINS = [
  { name: "Polygon", src: "/images/chains/0.png" },
  { name: "Aptos", src: "/images/chains/1.png" },
  { name: "Solana", src: "/images/chains/2.png" },
  { name: "Bitcoin", src: "/images/chains/3.png" },
  { name: "Sui", src: "/images/chains/4.png" },
  { name: "Stellar", src: "/images/chains/stellar.svg" },
];

const SPEED = 100; // px per second, both breakpoints

/* One track is CHAINS.length × (pill + gap) wide; at a constant 100px/s the
   duration is that width over the speed. Both terms are CSS-var driven, so the
   duration is a calc rather than a number. */
/* One track is CHAINS.length × (pill + gap) wide, and at a constant 100px/s
   the loop takes that width over the speed. calc() cannot turn a length into a
   time, so globals.css carries the seconds one pill-plus-gap takes at each
   breakpoint and the count stays here, where the array is. */
const DURATION = `calc(var(--chain-pill-dur) * ${CHAINS.length})`;

function Track() {
  return (
    <div
      className="flex shrink-0"
      style={{ gap: "var(--chain-gap)", paddingRight: "var(--chain-gap)" }}
    >
      {CHAINS.map((c) => (
        <div
          key={c.name}
          className="flex shrink-0 items-center rounded-[var(--chain-pill-r)] border-2 border-[#dddddd] bg-[#ededed]"
          style={{
            width: "var(--chain-pill-w)",
            height: "var(--chain-pill-h)",
            gap: "var(--chain-inner-gap)",
            padding: "var(--chain-pill-py) var(--chain-pill-px)",
          }}
        >
          <img
            src={c.src}
            alt=""
            width={67}
            height={67}
            className="shrink-0"
            style={{ width: "var(--chain-icon)", height: "var(--chain-icon)" }}
          />
          <span
            className="font-light text-[#595959]"
            style={{
              fontSize: "var(--chain-fs)",
              lineHeight: "var(--chain-lh)",
              letterSpacing: "var(--chain-ls)",
            }}
          >
            {c.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Chains() {
  return (
    <section className="overflow-hidden bg-white py-[32px]">
      <div
        className="flex w-max motion-safe:animate-[marquee_var(--dur)_linear_infinite]"
        style={{ ["--dur" as string]: DURATION }}
      >
        <Track />
        <Track />
      </div>
    </section>
  );
}
