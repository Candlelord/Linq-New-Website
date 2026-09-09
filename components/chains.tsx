/* Chains ticker — pills 322×93 r30, fill #EDEDED with a 2px #DDDDDD border,
   28px gap, running at 100px/s with no hover slowdown. */
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

const PILL = 322;
const GAP = 28;
const SPEED = 100; // px per second
const DURATION = (CHAINS.length * (PILL + GAP)) / SPEED;

function Track() {
  return (
    <div className="flex shrink-0" style={{ gap: GAP, paddingRight: GAP }}>
      {CHAINS.map((c) => (
        <div
          key={c.name}
          className="flex shrink-0 items-center rounded-[30px] border-2 border-[#dddddd] bg-[#ededed]"
          style={{ width: PILL, height: 93, gap: 15, padding: "12.6px 20px" }}
        >
          <img
            src={c.src}
            alt=""
            width={67}
            height={67}
            className="shrink-0"
            style={{ width: 67.43, height: 67.43 }}
          />
          <span className="text-[32px] leading-[38px] font-light tracking-[-0.06em] text-[#595959]">
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
        style={{ ["--dur" as string]: `${DURATION}s` }}
      >
        <Track />
        <Track />
      </div>
    </section>
  );
}
