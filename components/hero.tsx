import { PillButton } from "@/components/pill-button";
import { MouseTrail } from "@/components/mouse-trail";
import { BackgroundVideo } from "@/components/background-video";
import { links } from "@/lib/links";

/* Hero is 100vh with a white base behind a cover video. Content sits in a
   screen-blended group: logo pinned 64px from the top, headline + subtitle
   centred, buttons pinned 134px from the bottom.

   Phone (measured at 390×844): the logo drops to 99×28 at top 50, the headline
   to 50/41.18 and the subtitle to 16/22.48, and the two CTAs stack 16px apart
   instead of sitting side by side. The button block keeps the same 134px
   bottom offset as desktop.

   The type group is not centred on the phone — sampling the live hero at 700,
   844 and 932 viewport heights puts its centre at a constant 47.93% of the
   hero, about 2% above true centre, and that fit reproduces all three within
   1px. Everything else here holds its distance from the top or bottom edge.

   ── Why the phone hero has a floor ──
   The three groups are absolute layers, so they cannot push one another apart:
   the type group is centred, the buttons are pinned to the bottom edge. Once
   the hero is short enough that those two bands meet, the buttons simply print
   on top of the headline. The threshold falls straight out of the measured
   values above:

     type group bottom = 0.4793·H + g/2
     buttons top       = H − 134 − 100       (two 42px pills, 16px apart)
     they clear only while  0.4793·H + g/2 ≤ H − 234

   where g is the type group's height, and g is not a constant — it depends on
   how many lines the headline takes. Measured: 144px at 390 wide (two lines),
   186px at 360 and below (three), and it grows again in a 220dp window. That
   puts the threshold at 588px for the two-line case but 628px for three, which
   is why the floor is 700 and not the 600 the first calculation suggested.

   None of this is exotic. An Android freeform window bottoms out at 220dp —
   the CDD forbids offering freeform at all below 440dp, making 220 the floor —
   split screen lands near 400, and nearly every phone in landscape is 360-430
   tall. Below the floor the hero now outgrows the viewport and the page
   scrolls, which is the one arrangement absolute layers cannot break. At any
   viewport already taller than 700 nothing here changes at all.

   The type group's width gets the same treatment: its measured 340px is wider
   than a 220dp window, so it is capped to the viewport, which leaves the
   measured value untouched at any width the design was drawn for. */
export function Hero() {
  return (
    <section
      id="home"
      className="relative h-[var(--screen-h)] w-full overflow-hidden bg-white mob:min-h-[700px]"
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
          className="pointer-events-auto absolute top-[64px] left-1/2 -translate-x-1/2 mob:top-[50px]"
        >
          <img
            src="/images/logo.svg"
            alt="Linq"
            width={175}
            height={50}
            className="mob:h-[28px] mob:w-[99px]"
          />
        </a>

        {/* Screen blend belongs to the type only — it washes out the dark buttons. */}
        <div className="absolute top-1/2 left-1/2 w-[1123px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen mob:top-[47.93%] mob:w-[min(340px,calc(100vw-24px))]">
          <h1 className="m-0 text-center font-display text-[164px] leading-[136px] font-bold tracking-[-0.04em] text-white uppercase mob:text-[50px] mob:leading-[41.18px]">
            Spend crypto like cash
          </h1>
          <p className="mx-auto mt-[16px] w-[644px] text-center text-[32px] leading-[38px] font-light tracking-[-0.06em] text-white mob:mt-[17px] mob:w-[296px] mob:text-[16px] mob:leading-[22.48px]">
            Cash out your crypto directly to your bank account, save and pay bills
            instantly
          </p>
        </div>

      </div>

      {/* Buttons ride above the trail on their own layer: the coins should pass
          over the headline but slide *under* the CTAs, never across them. */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="pointer-events-auto absolute bottom-[134px] left-1/2 flex -translate-x-1/2 items-center gap-[32px] mob:flex-col mob:gap-[16px]">
          <PillButton href={links.telegramBot} variant="dark">
            <svg viewBox="0 0 20 19" className="h-[19px] w-[20px] mob:h-[16px] mob:w-[17px]" fill="currentColor" aria-hidden>
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
