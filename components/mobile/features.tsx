import type { CSSProperties } from "react";

/* Phone version of the feature stack.

   The desktop section is a 1280×534 stage with three 413×501 cards placed
   absolutely across it. That composition cannot reflow: every coin, the receipt
   panel and each label is positioned in the card's own 413×501 space, and those
   are measured values. So the cards keep their authored geometry verbatim and
   the stage is what changes — the three cards stack down the page, each one
   scaled as a unit by `zoom`.

   At 0.7 the card is 289px wide and its smallest type, the ₦685 chip at 23.3px,
   lands at 16px. Nothing on the card drops below that.

   The hover lift is gone: it fires on mouseenter, which a touch screen never
   sends. The wobble stays — it is the only thing keeping the cards from reading
   as flat rectangles — but at a shallower angle, because a 501px card rotated
   6° sweeps a bounding box wider than a 360px screen once scaled.

   Card data mirrors components/features.tsx. Keep the two in sync. */
const EASE = "cubic-bezier(0.44,0,0.56,1)";
const SCALE = 0.7;
const CARD_W = 413;
const CARD_H = 501;

type Coin = {
  left: number;
  top: number;
  from: string;
  to: string;
  disc: string;
  icon: string;
  alt: string;
  ix: number;
  iy: number;
  iw: number;
  ih: number;
  rot?: number;
  iconRot?: number;
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

const CARD2_COINS: Coin[] = [
  {
    left: 31, top: 60,
    from: "rgb(252,213,83)", to: "rgb(212,162,0)", disc: "rgb(240,185,11)",
    icon: "/images/features/bnb.svg", alt: "BNB",
    ix: 21, iy: 17, iw: 59, ih: 66, iconRot: -4, fx: 4, fy: 7,
  },
  {
    left: 260, top: 34,
    from: "rgb(255,89,92)", to: "rgb(168,0,3)", disc: "rgb(255,6,10)",
    icon: "/images/features/tron.svg", alt: "Tron",
    ix: 22, iy: 15, iw: 52, ih: 67, fx: -4, fy: -7,
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

function CoinBadge({ coin }: { coin: Coin }) {
  const rot = coin.rot ?? 0;
  const style: CSSProperties & Record<string, string | number> = {
    left: coin.left,
    top: coin.top,
    backgroundImage: `linear-gradient(${coin.from} 35%, ${coin.to} 100%)`,
    transform: `translate(0px, 0px) rotate(${rot}deg)`,
    "--coin-rot": `${rot}deg`,
    "--fx-from": "0px",
    "--fy-from": "0px",
    "--fx-to": `${coin.fx ?? 0}px`,
    "--fy-to": `${coin.fy ?? 0}px`,
    animation: `coin-float 1.9s ${EASE} infinite alternate`,
  };

  return (
    <div className="absolute h-[107px] w-[107px] rounded-full" style={style}>
      <div className="absolute inset-[4px] rounded-full" style={{ background: coin.disc }}>
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

const LABEL =
  "absolute top-[408px] h-[44.2px] text-center text-[36px] leading-[43.2px] font-medium tracking-[-2.16px]";

/* The card is laid out at its authored size and the wrapper shrinks it, so
   nothing inside has to be re-measured. */
function Card({
  tilt,
  background,
  children,
}: {
  tilt: [number, number];
  background: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ zoom: SCALE }}>
      <div
        className="relative rounded-[22px]"
        style={{
          width: CARD_W,
          height: CARD_H,
          background,
          ["--wob-from" as string]: `${tilt[0]}deg`,
          ["--wob-to" as string]: `${tilt[1]}deg`,
          transform: `rotate(${tilt[0]}deg)`,
          animation: `card-wobble 2.1s ${EASE} infinite alternate`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function MobileFeatures() {
  return (
    <section id="m-features" className="bg-white px-[20px] py-[64px]">
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-[40px]">
        <div className="flex flex-col items-center gap-[6px] text-center">
          <h2 className="m-0 font-display text-[clamp(28px,7.6vw,38px)] leading-[1.12] font-medium tracking-[-0.03em] text-black">
            Total control in your hands
          </h2>
          <p className="m-0 text-[clamp(15px,4.2vw,19px)] leading-[1.2] tracking-[-0.03em] text-black">
            No limits. No delays. Just utility
          </p>
        </div>

        <div className="flex flex-col items-center gap-[28px]">
          <Card tilt={[-2, -3.5]} background="rgb(236,226,255)">
            {CARD1_COINS.map((c) => (
              <CoinBadge key={c.alt} coin={c} />
            ))}

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

            <p className={`${LABEL} m-0 text-[#5f33b5]`} style={{ left: 35.477, width: 342.047 }}>
              Cashout as low as $0.1
            </p>
          </Card>

          <Card tilt={[2, 3.5]} background="rgb(199,222,255)">
            {CARD2_COINS.map((c) => (
              <CoinBadge key={c.alt} coin={c} />
            ))}
            <p className={`${LABEL} m-0 text-[#0a4cb8]`} style={{ left: 31, width: 347.953 }}>
              Multiple chain support
            </p>
          </Card>

          <Card tilt={[-2, -3.5]} background="rgb(236,226,255)">
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
            <p className={`${LABEL} m-0 text-[#5f33b5]`} style={{ left: 64.945, width: 283.109 }}>
              Instant settlement
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
