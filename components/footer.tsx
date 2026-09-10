import { links } from "@/lib/links";

/* Measured off the live site. An 800px black panel that does not scroll with
   the page: it is `sticky; bottom: 0` at z-1, pinned to the bottom of the
   viewport for the whole scroll and hidden behind the opaque page content
   above it (z-3). The content's bottom edge lifting off is what reveals it.

   Children are absolutely placed, matching the live layout, and the paint order
   is the live DOM order — bottom bar, header block, then USELINQ on top.

   ── The phone layout here is NOT measured. ──
   As with the CTA, the designer shipped no phone variant: below 1440 the live
   footer keeps its desktop 1006px column on a 390 viewport and clips the
   heading to "…ommunities to…". The 800px panel height *is* measured (live
   keeps it on the phone); everything inside it is an extrapolation using the
   ratios the designer did use elsewhere — heading 64 → 25, subtitle 32 → 12,
   logo 175×50 → 99×28 (the hero wordmark), copy column → 340.

   The USELINQ wordmark is scaled to span the viewport with the same slight
   bleed it has on desktop (1486 across 1440).

   The panel itself drops to 320 on a phone. Keeping the measured 800 left two
   problems: the phone content is a third the size, so ~400px of the middle was
   dead black; and 800 is taller than a lot of phone viewports, which puts the
   panel top off-screen and pushes the heading up under the fixed burger. At 320
   the whole footer fits on screen, and the internal anchors are re-derived so
   the proportions read like the desktop composition — heading block in the top
   eighth, then a gap of about a quarter of the panel, then the logo row sitting
   *over* the wordmark, which still bleeds 29% of its line box off the bottom
   exactly as the desktop one does. */
const LINKS = [
  { label: "Twitter", href: links.x, icon: "/images/footer/twitter.svg", w: 18, h: 18, pad: true },
  { label: "Telegram", href: links.telegram, icon: "/images/footer/telegram.svg", w: 22, h: 20, pad: false },
];

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-[1] h-[800px] w-full overflow-clip bg-black mob:h-[320px]">
      {/* Logo + copyright, pinned to the 1280 content column. */}
      <div className="absolute top-[524px] left-1/2 flex h-[50px] w-[1280px] -translate-x-1/2 items-center justify-between mob:top-[245px] mob:h-[28px] mob:w-[340px]">
        <img
          src="/images/footer/logo.svg"
          alt="Linq"
          width={175}
          height={50}
          className="mob:h-[28px] mob:w-[99px]"
        />
        <p className="m-0 text-center text-[16px] leading-[19.2px] font-light tracking-[-0.96px] text-white mob:text-[11px] mob:leading-[13.2px] mob:tracking-[-0.66px]">
          © 2026 copyright all rights reserved.
        </p>
      </div>

      <div className="absolute top-[124px] left-1/2 flex w-[1006.73px] -translate-x-1/2 flex-col items-center gap-[32px] mob:top-[40px] mob:w-[340px] mob:gap-[20px]">
        <div className="flex flex-col items-center">
          <h2 className="m-0 text-center font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-white mob:text-[25px] mob:leading-[28.69px] mob:tracking-[-0.75px]">
            Join our communities to stay ahead
          </h2>
          <p className="m-0 w-[685px] text-center text-[32px] leading-[38.4px] tracking-[-1.92px] text-white mob:w-[300px] mob:text-[12px] mob:leading-[14.4px] mob:tracking-[-0.72px]">
            Get instant support, request new features, and catch exclusive
            community updates.
          </p>
        </div>

        <div className="flex items-center gap-[35px] mob:gap-[20px]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`flex h-[24px] items-center gap-[8px] transition duration-300 ease-out hover:-translate-y-[2px] hover:opacity-80 active:translate-y-0 active:duration-75 mob:h-[19px] mob:gap-[6px] ${l.pad ? "px-[2px]" : ""}`}
            >
              <img
                src={l.icon}
                alt=""
                width={l.w}
                height={l.h}
                className="shrink-0 mob:h-auto mob:w-[calc(var(--social-w)*0.78)]"
                style={{ ["--social-w" as string]: `${l.w}px` }}
              />
              <span className="text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] mob:text-[14px] mob:leading-[18.7px] mob:tracking-[-0.84px]">
                {l.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Gradient-filled wordmark, bleeding off the bottom of the panel. The
          fill is a background clipped to the glyphs, not a text colour. */}
      <p
        /* Tracking is a class, not an inline style, so the phone override can
           actually win against it. */
        className="absolute top-[476px] left-[52%] m-0 w-[1486px] -translate-x-1/2 font-display text-[380px] leading-[456px] font-bold tracking-[-26.6px] whitespace-nowrap mob:top-[232px] mob:w-[402px] mob:text-[103px] mob:leading-[123.4px] mob:tracking-[-7.2px]"
        style={{
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
