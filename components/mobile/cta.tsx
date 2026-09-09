import { BackgroundVideo } from "@/components/background-video";
import { links, APP_DOMAIN } from "@/lib/links";

/* Phone version of the closing call to action. Like the desktop one it now runs
   full-bleed — no inset card, no radius, video edge to edge — following the
   Framer change. On a phone that also buys back the 40px the side margins were
   costing the copy.

   The store buttons keep their measured 220×60 — that is already a comfortable
   tap target and it fits across a phone — but they stack, because two 220px
   buttons plus a 32px gap need 472px of width.

   Store button variants mirror components/cta.tsx. Keep the two in sync. */
const VARIANTS = {
  dark: {
    fill: "radial-gradient(64% 75%, rgb(19,8,38) 0%, rgb(48,30,84) 100%)",
    rim: "linear-gradient(175deg, rgb(66,41,117) 43%, rgb(13,6,28) 112%)",
  },
  purple: {
    fill: "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%)",
    rim: "linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%)",
  },
};

/* Neither store listing exists yet, so these are presented as unavailable —
   dimmed, not focusable, and rendered as a span so there is nothing to click. */
function StoreButton({
  icon,
  iconW,
  iconH,
  label,
  variant,
}: {
  icon: string;
  iconW: number;
  iconH: number;
  label: string;
  variant: keyof typeof VARIANTS;
}) {
  const v = VARIANTS[variant];
  return (
    <span
      aria-disabled="true"
      className="flex h-[60px] w-[220px] cursor-not-allowed items-center justify-center rounded-[2000px] border border-transparent opacity-45"
      style={{
        background: `${v.fill} padding-box, ${v.rim} border-box`,
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)",
      }}
    >
      {/* Baseline-aligned: the icon's bottom lines up with the label's. */}
      <span className="flex items-end gap-[8px]">
        <img src={icon} alt="" width={iconW} height={iconH} className="shrink-0" />
        <span className="flex flex-col items-start">
          {/* Desktop authors this at 8px, which the 0.67 zoom paints at ~5.4px
              — legible only because nobody needs to read it. At zoom 1 that 8px
              is the real rendered size, so it goes up to 11 to stay above the
              point where it turns into a grey smudge. The button is 60px tall
              and the two lines total 32, so there is room. */}
          <span className="text-[11px] leading-[13px] font-light tracking-[-0.02em] text-white">
            Coming soon on
          </span>
          <span className="text-[18px] leading-[20px] font-medium tracking-[-1.08px] text-[#fbfbfb]">
            {label}
          </span>
        </span>
      </span>
    </span>
  );
}

export function MobileCta() {
  return (
    <section className="relative w-full overflow-clip bg-[#8a4fff] px-[20px] py-[72px]">
      {/* Same clip as the hero's — one file, fetched once. */}
      <BackgroundVideo
        src="/video/clouds.mp4"
        eager={false}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-[1] mx-auto flex max-w-[520px] flex-col items-center gap-[36px]">
        <div className="flex w-full flex-col items-center gap-[36px]">
          <div className="flex flex-col items-center gap-[8px]">
            <h2 className="m-0 text-center font-display text-[clamp(28px,7.6vw,38px)] leading-[1.12] font-medium tracking-[-0.03em] text-white">
              Ready to Move Your Money?
            </h2>
            <p className="m-0 max-w-[32ch] text-center text-[clamp(15px,4.2vw,19px)] leading-[1.2] tracking-[-0.03em] text-white">
              Get the Linq app to cash out, pay bills, and auto-save on the go.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[16px]">
            {/* Both read "Play store" on the live site, including the one
                carrying the Apple mark. Left as-is — the designer's call. */}
            <StoreButton
              icon="/images/cta/apple.svg"
              iconW={20}
              iconH={26}
              label="Play store"
              variant="dark"
            />
            <StoreButton
              icon="/images/cta/playstore.svg"
              iconW={20}
              iconH={20}
              label="Play store"
              variant="purple"
            />

            {/* The working route while the stores are pending. */}
            <a
              href={links.app}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] items-center text-[17px] leading-[26px] font-medium tracking-[-0.6px] text-white underline decoration-white/50 underline-offset-[6px]"
            >
              {APP_DOMAIN}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
