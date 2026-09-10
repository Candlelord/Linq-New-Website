/* The two coins that drift in the menu's empty right half. Measured off the
   live overlay: same construction as the feature-card coins — a 214px gradient
   ring with a solid disc inset 8px and the glyph on top — but at roughly double
   the size, and each drifting 230px vertically rather than the cards' 7px.

   The live transform bakes a large negative translateY into the resting pose;
   that midpoint is folded into `top` here so the animation is a clean ±115px. */
const FLOAT = 115;
const PERIOD = "3.78s";
const EASE = "cubic-bezier(0.44,0,0.56,1)";

type Coin = {
  key: string;
  left: number;
  top: number;
  rotate: number;
  from: string;
  to: string;
  disc: string;
  icon: string;
  /* Glyph box inside the 198px disc. */
  ix: number;
  iy: number;
  iw: number;
  ih: number;
  iconRotate?: number;
  delay?: string;
};

const COINS: Coin[] = [
  {
    key: "usdt",
    left: 899,
    top: 460.5,
    rotate: -18,
    from: "rgb(133,255,222)",
    to: "rgb(6,117,88)",
    disc: "rgb(80,175,149)",
    icon: "/images/menu/usdt.svg",
    ix: 38,
    iy: 29,
    iw: 116,
    ih: 125,
    iconRotate: 39,
  },
  {
    key: "usdc",
    left: 1146,
    top: 386,
    rotate: 24,
    from: "rgb(99,175,255)",
    to: "rgb(0,62,128)",
    disc: "rgb(39,117,202)",
    icon: "/images/menu/usdc.svg",
    ix: 35,
    iy: 39,
    iw: 128,
    ih: 122,
    /* The two are visibly out of step on the live site. */
    delay: "-0.9s",
  },
];

export function MenuCoins() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Positions are authored against the 1440×900 frame, so they hang off a
          stage of exactly that size centred in the overlay. Placing them
          directly on a full-viewport parent drifts them badly once the
          viewport is not 1440 wide. */}
      {/* Halved on the phone, matching the menu rows, so the whole coin
          composition still lands on a 390 viewport rather than being clipped. */}
      <div className="absolute top-1/2 left-1/2 h-[900px] w-[1440px] -translate-x-1/2 -translate-y-1/2 mob:scale-50">
        {COINS.map((c) => (
          <div
            key={c.key}
            className="absolute h-[214px] w-[214px] rounded-full"
            style={{
              left: c.left,
              top: c.top,
              backgroundImage: `linear-gradient(${c.from} 35%, ${c.to} 100%)`,
              ["--coin-rot" as string]: `${c.rotate}deg`,
              ["--fx-from" as string]: "0px",
              ["--fx-to" as string]: "0px",
              ["--fy-from" as string]: `${-FLOAT}px`,
              ["--fy-to" as string]: `${FLOAT}px`,
              transform: `translate(0px, ${-FLOAT}px) rotate(${c.rotate}deg)`,
              animation: `coin-float ${PERIOD} ${EASE} infinite alternate`,
              animationDelay: c.delay,
            }}
          >
            <div
              className="absolute inset-[8px] rounded-full"
              style={{ background: c.disc }}
            >
              <img
                src={c.icon}
                alt=""
                className="absolute max-w-none"
                style={{
                  left: c.ix,
                  top: c.iy,
                  width: c.iw,
                  height: c.ih,
                  transform: c.iconRotate
                    ? `rotate(${c.iconRotate}deg)`
                    : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
