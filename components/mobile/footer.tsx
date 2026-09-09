import { links } from "@/lib/links";

/* Phone version of the footer.

   The reveal mechanism is unchanged and deliberately so: `sticky; bottom: 0` at
   z-1, pinned to the bottom of the viewport for the whole scroll while the
   opaque page content above it (z-3) slides off to uncover it. That behaviour
   lives in app/page.tsx's wrapper, not here, and works at any width.

   What does change is the height. Desktop fixes it at 800px, which under the
   0.67 zoom paints as ~536px inside a ~900px window — comfortably shorter than
   the viewport, which is what lets the whole panel come into view. Left at 800
   on a phone it would be taller than the screen and the bottom half could never
   be revealed. So the height here is content-driven.

   The wordmark keeps its gradient-clipped fill and still bleeds off the bottom
   edge; only its size is fluid, sized so the seven letters span the screen the
   way 380px spans 1440. */
const LINKS = [
  { label: "Twitter", href: links.x, icon: "/images/footer/twitter.svg", w: 18, h: 18 },
  { label: "Telegram", href: links.telegram, icon: "/images/footer/telegram.svg", w: 22, h: 20 },
];

export function MobileFooter() {
  return (
    <footer className="sticky bottom-0 z-[1] w-full overflow-clip bg-black">
      <div className="flex flex-col items-center gap-[28px] px-[20px] pt-[56px]">
        <div className="flex flex-col items-center gap-[10px]">
          <h2 className="m-0 text-center font-display text-[clamp(28px,7.6vw,38px)] leading-[1.12] font-medium tracking-[-0.03em] text-white">
            Join our communities to stay ahead
          </h2>
          <p className="m-0 max-w-[34ch] text-center text-[clamp(15px,4.2vw,19px)] leading-[1.2] tracking-[-0.03em] text-white">
            Get instant support, request new features, and catch exclusive
            community updates.
          </p>
        </div>

        <div className="flex items-center gap-[28px]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[44px] items-center gap-[8px] px-[4px] transition duration-300 ease-out active:opacity-70"
            >
              <img src={l.icon} alt="" width={l.w} height={l.h} className="shrink-0" />
              <span className="text-[17px] leading-[24px] font-medium tracking-[-0.04em] text-[#fbfbfb]">
                {l.label}
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-[10px]">
          <img src="/images/footer/logo.svg" alt="Linq" width={124} height={36} />
          <p className="m-0 text-center text-[14px] leading-[19.2px] font-light tracking-[-0.04em] text-white">
            © 2026 copyright all rights reserved.
          </p>
        </div>
      </div>

      {/* Bleeds off the bottom, same as desktop. The fill is a background
          clipped to the glyphs, not a text colour. */}
      <p
        className="m-0 -mb-[0.2em] text-center font-display text-[clamp(64px,25vw,150px)] leading-[0.86] font-bold whitespace-nowrap"
        style={{
          letterSpacing: "-0.07em",
          backgroundImage:
            "linear-gradient(0deg, rgb(138,79,255) -34%, rgba(138,79,255,0) 83%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        aria-hidden="true"
      >
        USELINQ
      </p>
    </footer>
  );
}
