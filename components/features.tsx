"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/* Every number here was measured off the live site rather than eyeballed from
   the SVG export. The stage is 1280×534; each card is an identical 413×501
   frame at radius 22, placed absolutely and rotated about its own centre.
   Card 3's authored left is 851 with a constant translateX(24) on top — since
   the rotation is about the centre, that translate is just a horizontal shift,
   so it is folded into `left` here and the transform stays a pure rotation.
   That matters: the wobble animates `transform`, and mixing the offset in
   would make every keyframe carry it too.

   The phone variant is the same three cards at a uniform 0.6 scale (413×501 →
   247.6×301, radius 22 → 13, label 36 → 21.6), stacked in a column 2px apart
   instead of laid out across a stage, and each keeps the first of its two tilt
   angles as its resting pose. The scale rides on an inner wrapper rather than
   the card itself, so the wobble keyframes stay a pure rotation and the card
   box keeps a real layout size for the column to space. */
const EASE = "cubic-bezier(0.44,0,0.56,1)";
const CARD =
  "absolute h-[501px] w-[413px] rounded-[22px] mob:static mob:h-[301px] mob:w-[247.6px] mob:shrink-0 mob:rounded-[13px]";

/* Coins are a 107px gradient ring with a 99px solid disc inset 4px inside it. */
type Coin = {
  left: number;
  top: number;
  from?: string;
  to?: string;
  disc?: string;
  icon?: string;
  alt: string;
  /* Icon box inside the 99px disc. Omitted when `art` supplies the whole coin. */
  ix?: number;
  iy?: number;
  iw?: number;
  ih?: number;
  /* A coin supplied as one finished piece of art — disc, rim and glyph already
     composed — rather than assembled from `from`/`to`/`disc` plus a glyph. */
  art?: string;
  /* Static pose of the whole coin, and of the glyph within it. */
  rot?: number;
  iconRot?: number;
  /* Float target — the mirrored leg of the 1.9s drift. */
  fx?: number;
  fy?: number;
};

const CARD1_COINS: Coin[] = [
  {
    left: 288, top: 33, rot: 24,
    from: "rgb(99,175,255)", to: "rgb(0,62,128)", disc: "rgb(39,117,202)",
    icon: "/images/features/usdc.svg", alt: "USDC",
    ix: 18, iy: 19, iw: 64, ih: 61, fy: 7,
  },
  {
    left: 21, top: 42, rot: -18,
    from: "rgb(133,255,222)", to: "rgb(6,117,88)", disc: "rgb(80,175,149)",
    icon: "/images/features/usdt.svg", alt: "USDT",
    ix: 19, iy: 11, iw: 58, ih: 63, iconRot: 39, fy: 7,
  },
];

/* Bitcoin and Tron resolved to byte-identical glyphs on the live site — the red
   coin carried the ₿ mark. That coin is now the designer's Stellar render, which
   arrives as one finished piece of art rather than a colour triple plus a glyph,
   so it goes in through `art`. Its position and drift are unchanged. */
const CARD2_COINS: Coin[] = [
  {
    left: 31, top: 60,
    from: "rgb(252,213,83)", to: "rgb(212,162,0)", disc: "rgb(240,185,11)",
    icon: "/images/features/bnb.svg", alt: "BNB",
    ix: 21, iy: 17, iw: 59, ih: 66, iconRot: -4, fx: 4, fy: 7,
  },
  {
    left: 260, top: 34,
    art: "/images/features/stellar.svg", alt: "Stellar",
    fx: -4, fy: -7,
  },
  {
    left: 161.25, top: 148,
    from: "rgb(133,192,255)", to: "rgb(10,99,194)", disc: "rgb(77,162,255)",
    icon: "/images/features/sui.svg", alt: "Sui",
    ix: 20, iy: 12, iw: 56, ih: 69, fy: -7,
  },
  {
    left: 48, top: 245,
    from: "rgb(235,120,255)", to: "rgb(134,0,158)", disc: "rgb(220,31,255)",
    icon: "/images/features/solana.svg", alt: "Solana",
    ix: 17, iy: 24, iw: 64, ih: 50, fx: -4, fy: -7,
  },
  {
    left: 272, top: 245,
    from: "rgb(255,175,77)", to: "rgb(209,115,0)", disc: "rgb(247,147,26)",
    icon: "/images/features/bitcoin.svg", alt: "Bitcoin",
    ix: 22, iy: 15, iw: 52, ih: 67, fx: -4, fy: 7,
  },
];

/* The supplied Stellar art is a 120-box whose coin measures 109.513 across —
   2 × (r 52.4265 + half the 4.66013 rim stroke). Drawing it at 107 like every
   other coin therefore means a 117.246 box pulled back 5.123 on each axis, so
   the painted edge lands on 107 rather than the file's bounding box doing. */
const ART_BOX = 117.246;
const ART_INSET = -5.123;

function CoinBadge({ coin }: { coin: Coin }) {
  const rot = coin.rot ?? 0;
  const style: CSSProperties & Record<string, string | number> = {
    left: coin.left,
    top: coin.top,
    ...(coin.art
      ? {}
      : {
          backgroundImage: `linear-gradient(${coin.from} 35%, ${coin.to} 100%)`,
        }),
    transform: `translate(0px, 0px) rotate(${rot}deg)`,
    "--coin-rot": `${rot}deg`,
    "--fx-from": "0px",
    "--fy-from": "0px",
    "--fx-to": `${coin.fx ?? 0}px`,
    "--fy-to": `${coin.fy ?? 0}px`,
    animation: `coin-float 1.9s ${EASE} infinite alternate`,
  };

  if (coin.art) {
    return (
      <div className="absolute h-[107px] w-[107px]" style={style}>
        <img
          src={coin.art}
          alt={coin.alt}
          className="absolute max-w-none"
          style={{
            left: ART_INSET,
            top: ART_INSET,
            width: ART_BOX,
            height: ART_BOX,
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute h-[107px] w-[107px] rounded-full" style={style}>
      <div
        className="absolute inset-[4px] rounded-full"
        style={{ background: coin.disc }}
      >
        <img
          src={coin.icon}
          alt={coin.alt}
          className="absolute max-w-none"
          style={{
            left: coin.ix,
            top: coin.iy,
            width: coin.iw,
            height: coin.ih,
            transform: coin.iconRot ? `rotate(${coin.iconRot}deg)` : undefined,
          }}
        />
      </div>
    </div>
  );
}

/* Base tilt and the 2° it swings to, per card, on a 2.1s mirrored tween. */
function wobble(from: number, to: number): CSSProperties & Record<string, string> {
  return {
    "--wob-from": `${from}deg`,
    "--wob-to": `${to}deg`,
    transform: `rotate(${from}deg)`,
    animation: `card-wobble 2.1s ${EASE} infinite alternate`,
  };
}

/* On hover a card lifts out of the stack: the wobble is paused so the pose
   stops fighting the lift, it rises and grows slightly, and it comes to the
   front so the neighbours it overlaps sit behind it. */
function FeatureCard({
  tilt,
  style,
  children,
}: {
  tilt: [number, number];
  style: CSSProperties;
  children: ReactNode;
}) {
  const [lift, setLift] = useState(false);

  return (
    <div
      onMouseEnter={() => setLift(true)}
      onMouseLeave={() => setLift(false)}
      className={CARD}
      style={{
        ...wobble(tilt[0], tilt[1]),
        ...style,
        animationPlayState: lift ? "paused" : "running",
        translate: lift ? "0 -18px" : "0 0",
        scale: lift ? "1.03" : "1",
        zIndex: lift ? 2 : 1,
        transition:
          "translate 0.45s cubic-bezier(0.22,1,0.36,1), scale 0.45s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Desktop scale is 1, so this wrapper is a no-op there beyond being the
          containing block the children were already measured against. */}
      <div
        className="relative h-[501px] w-[413px] origin-top-left"
        style={{ transform: "scale(var(--feat-scale))" }}
      >
        {children}
      </div>
    </div>
  );
}

const LABEL =
  "absolute top-[408px] h-[44.2px] text-center text-[36px] leading-[43.2px] font-medium tracking-[-2.16px]";

export function Features() {
  return (
    <section id="features" className="bg-white py-[92.8px] mob:py-[64px]">
      <div className="mx-auto flex w-[1280px] flex-col items-center gap-[64px] mob:w-full mob:gap-[32px]">
        <div className="flex w-[783px] flex-col items-center gap-[4px] text-center mob:w-[274px] mob:gap-[1.4px]">
          <h2 className="m-0 font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-black mob:text-[22px] mob:leading-[25.9px] mob:tracking-[-0.66px]">
            Total control in your hands
          </h2>
          <p className="m-0 text-[32px] leading-[38.4px] tracking-[-1.92px] text-black mob:text-[11px] mob:leading-[13.2px] mob:tracking-[-0.66px]">
            No limits. No delays. Just utility
          </p>
        </div>

        {/* Card 3 deliberately overhangs the stage on the right, so no clipping. */}
        {/* The column is 930 tall against 907 of cards — the live stage carries
            that slack at the bottom, and the 11.3px lead-in at the top is what
            puts the first card where it sits. */}
        <div className="relative h-[534px] w-[1280px] mob:flex mob:h-[930px] mob:w-[248px] mob:flex-col mob:items-center mob:gap-[2px] mob:pt-[11.3px]">
          <FeatureCard
            tilt={[-3, -5]}
            style={{ left: 12, top: 10, background: "rgb(236,226,255)" }}
          >
            {CARD1_COINS.map((c) => (
              <CoinBadge key={c.alt} coin={c} />
            ))}

            {/* Receipt panel. Sizes are the live values verbatim — the design is
                scaled ~0.932 from its authoring size, hence the odd decimals. */}
            <div
              className="absolute flex flex-col items-center rounded-[23px] bg-white"
              style={{
                left: 71.766,
                top: 100,
                width: 269.469,
                height: 289.312,
                gap: 37.281,
                padding: "23.3006px 46.6013px",
              }}
            >
              <p className="m-0 text-center text-[33.71px] leading-[40.452px] font-light tracking-[-3.371px] text-[#959595]">
                Bank transfer
              </p>
              <div className="flex flex-col items-center" style={{ gap: 23.3006 }}>
                <p className="m-0 text-center text-[74.56px] leading-[89.472px] font-bold tracking-[-4.4736px] text-black">
                  $0.5
                </p>
                <div
                  className="flex items-center justify-center rounded-[1165px] bg-[#ededed]"
                  style={{ padding: "11.6503px 34.951px" }}
                >
                  <p className="m-0 text-center text-[23.3px] leading-[27.96px] tracking-[-0.932px] text-black">
                    ₦685
                  </p>
                </div>
              </div>
            </div>

            <p
              className={`${LABEL} m-0 text-[#5f33b5]`}
              style={{ left: 35.477, width: 342.047 }}
            >
              Cashout as low as $0.1
            </p>
          </FeatureCard>

          <FeatureCard
            tilt={[4, 6]}
            style={{ left: 432.5, top: 14, background: "rgb(199,222,255)" }}
          >
            {CARD2_COINS.map((c) => (
              <CoinBadge key={c.alt} coin={c} />
            ))}
            <p
              className={`${LABEL} m-0 text-[#0a4cb8]`}
              style={{ left: 31, width: 347.953 }}
            >
              Multiple chain support
            </p>
          </FeatureCard>

          <FeatureCard
            tilt={[-4, -6]}
            style={{ left: 875, top: 20, background: "rgb(236,226,255)" }}
          >
            <img
              src="/images/features/hourglass.svg"
              alt=""
              className="absolute max-w-none"
              style={{ left: 109, top: 67, width: 193, height: 287, transform: "rotate(9.67deg)" }}
            />
            <img
              src="/images/features/check.svg"
              alt=""
              className="absolute max-w-none"
              style={{ left: 52, top: 128, width: 80, height: 101 }}
            />
            <img
              src="/images/features/badge-6s.svg"
              alt="6 seconds"
              className="absolute max-w-none"
              style={{ left: 277, top: 202, width: 113, height: 106, transform: "rotate(4deg)" }}
            />
            <p
              className={`${LABEL} m-0 text-[#5f33b5]`}
              style={{ left: 64.945, width: 283.109 }}
            >
              Instant settlement
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
