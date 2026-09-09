import { PillButton } from "@/components/pill-button";
import { BackgroundVideo } from "@/components/background-video";
import { links } from "@/lib/links";

/* Phone hero. Same ingredients as the desktop one — white base, cover video,
   screen-blended type, the two pills — reflowed into a column that fits a
   handset instead of a 1123px block centred in a 1440 stage.

   Height is `--screen-h`, which resolves to 100svh below the md breakpoint
   (see globals.css). `svh` is deliberate: `vh` on a phone measures the viewport
   with the address bar retracted, so a 100vh hero puts its bottom row of
   buttons underneath the bar until the user scrolls.

   No MouseTrail here. It is a 275px box that spring-follows a pointer, so on a
   touch screen it is dead weight that never renders and still runs a rAF loop.

   The screen blend stays on the type only, exactly as on desktop — it washes
   out the dark buttons if it wraps them. */
export function MobileHero() {
  return (
    <section
      id="m-home"
      className="relative flex h-[var(--screen-h)] w-full flex-col overflow-hidden bg-white"
    >
      <BackgroundVideo
        src="/video/clouds.mp4"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Matches the burger's optical centre in the fixed bar (top 16, 48 tall). */}
      <div className="relative z-10 flex shrink-0 justify-center pt-[23px]">
        <img src="/images/logo.svg" alt="Linq" width={124} height={36} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[20px]">
        <div className="mix-blend-screen">
          <h1 className="m-0 text-center font-display text-[clamp(38px,11.5vw,54px)] leading-[0.83] font-bold tracking-[-0.04em] text-white uppercase">
            Spend crypto like cash
          </h1>
          {/* Desktop tracks this at -0.06em, which at 32px is fine and at 16px
              closes the letters up — eased off so the line stays readable. */}
          <p className="mx-auto mt-[16px] max-w-[34ch] text-center text-[clamp(15px,4.2vw,19px)] leading-[1.2] font-light tracking-[-0.02em] text-white">
            Cash out your crypto directly to your bank account, save and pay
            bills instantly
          </p>
        </div>
      </div>

      {/* Stacked rather than side by side: two 220px pills do not fit across a
          360px screen with any margin worth having. */}
      <div className="relative z-30 flex shrink-0 flex-col items-center gap-[14px] px-[20px] pb-[calc(40px+env(safe-area-inset-bottom))]">
        <PillButton href={links.telegramBot} variant="dark">
          <svg viewBox="0 0 20 19" className="h-[19px] w-[20px]" fill="currentColor" aria-hidden>
            <path d="M19.9 1.3 17 15.6c-.2 1-.8 1.2-1.6.8l-4.4-3.3-2.1 2c-.2.3-.5.5-1 .5l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L5.7 9.9 1.4 8.6c-.9-.3-1-.9.2-1.4L18.6 0c.8-.3 1.5.2 1.3 1.3Z" />
          </svg>
          Use TG bot
        </PillButton>
        <PillButton href={links.app}>Get the app</PillButton>
      </div>
    </section>
  );
}
