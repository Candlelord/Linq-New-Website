import { BackgroundVideo } from "@/components/background-video";
import { links, APP_DOMAIN } from "@/lib/links";

/* A full-bleed 1440×900 purple band with a looping video filling it behind the
   copy, and 64px between the copy block and the store buttons.

   This used to be a 1280×650 card at radius 40, inset in a white band with 128
   padding. The design was changed in Framer to run edge to edge, so the card's
   four values — width, height, radius, padding — are gone and the video now
   fills the whole 900px band. Everything else is unchanged.

   The store buttons are 220×60 — taller than the 54px PillButton and with a
   two-line stacked label beside an icon — so they are their own component
   rather than a PillButton variant. */
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
          <span className="text-[8px] leading-[6.4px] font-light tracking-[-0.48px] text-white">
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

export function Cta() {
  return (
    <section className="relative flex h-[900px] w-full items-center justify-center overflow-clip bg-[#8a4fff]">
      {/* Artwork is a muted looping video, not a still. It is the same clip as
          the hero's — the two source files the designer supplied were
          byte-identical — so pointing both at one URL means the browser fetches
          it once. Give this its own file if the CTA ever gets a different clip. */}
      <BackgroundVideo
        src="/video/clouds.mp4"
        eager={false}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-[1] flex w-[1024px] flex-col items-center gap-[64px]">
        {/* 156px is the live group height — 5.2px taller than the two lines
            measure, and that slack is what sets the whole block's centring. */}
        <div className="flex h-[156px] flex-col items-center">
          <h2 className="m-0 text-center font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-white">
            Ready to Move Your Money?
          </h2>
          <p className="m-0 w-[588px] text-center text-[32px] leading-[38.4px] tracking-[-1.92px] text-white">
            Get the Linq app to cash out, pay bills, and auto-save on the go.
          </p>
        </div>

        {/* Both buttons read "Play store" on the live site, including the one
            carrying the Apple mark. Left as-is — the designer's call. */}
        <div className="flex flex-col items-center gap-[20px]">
          <div className="flex items-center gap-[32px]">
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
          </div>

          {/* The working route while the stores are pending. Not in the Framer
              design — kept because it is the only route that currently works. */}
          <a
            href={links.app}
            target="_blank"
            rel="noreferrer"
            className="text-[20px] leading-[26px] font-medium tracking-[-0.6px] text-white underline decoration-white/50 underline-offset-[6px] transition-colors hover:decoration-white"
          >
            {APP_DOMAIN}
          </a>
        </div>
      </div>
    </section>
  );
}
