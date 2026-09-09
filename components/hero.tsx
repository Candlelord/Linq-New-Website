import { PillButton } from "@/components/pill-button";
import { MouseTrail } from "@/components/mouse-trail";
import { BackgroundVideo } from "@/components/background-video";
import { links } from "@/lib/links";

/* Hero is 100vh with a white base behind a cover video. Content sits in a
   screen-blended group: logo pinned 64px from the top, headline + subtitle
   centred, buttons pinned 134px from the bottom. */
export function Hero() {
  return (
    <section
      id="home"
      className="relative h-[var(--screen-h)] w-full overflow-hidden bg-white"
    >
      <BackgroundVideo
        src="/video/clouds.mp4"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <MouseTrail />

      <div className="pointer-events-none absolute inset-0 z-10">
        <a
          href="#home"
          aria-label="Linq home"
          className="pointer-events-auto absolute top-[64px] left-1/2 -translate-x-1/2"
        >
          <img src="/images/logo.svg" alt="Linq" width={175} height={50} />
        </a>

        {/* Screen blend belongs to the type only — it washes out the dark buttons. */}
        <div className="absolute top-1/2 left-1/2 w-[1123px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen">
          <h1 className="m-0 text-center font-display text-[164px] leading-[136px] font-bold tracking-[-0.04em] text-white uppercase">
            Spend crypto like cash
          </h1>
          <p className="mx-auto mt-[16px] w-[644px] text-center text-[32px] leading-[38px] font-light tracking-[-0.06em] text-white">
            Cash out your crypto directly to your bank account, save and pay bills
            instantly
          </p>
        </div>

      </div>

      {/* Buttons ride above the trail on their own layer: the coins should pass
          over the headline but slide *under* the CTAs, never across them. */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="pointer-events-auto absolute bottom-[134px] left-1/2 flex -translate-x-1/2 items-center gap-[32px]">
          <PillButton href={links.telegramBot} variant="dark">
            <svg viewBox="0 0 20 19" className="h-[19px] w-[20px]" fill="currentColor" aria-hidden>
              <path d="M19.9 1.3 17 15.6c-.2 1-.8 1.2-1.6.8l-4.4-3.3-2.1 2c-.2.3-.5.5-1 .5l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L5.7 9.9 1.4 8.6c-.9-.3-1-.9.2-1.4L18.6 0c.8-.3 1.5.2 1.3 1.3Z" />
            </svg>
            Use TG bot
          </PillButton>
          <PillButton href={links.app}>Get the app</PillButton>
        </div>
      </div>
    </section>
  );
}
