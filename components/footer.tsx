import { links } from "@/lib/links";

/* Measured off the live site. An 800px black panel that does not scroll with
   the page: it is `sticky; bottom: 0` at z-1, pinned to the bottom of the
   viewport for the whole scroll and hidden behind the opaque page content
   above it (z-3). The content's bottom edge lifting off is what reveals it.

   Children are absolutely placed, matching the live layout, and the paint order
   is the live DOM order — bottom bar, header block, then USELINQ on top. */
const LINKS = [
  { label: "Twitter", href: links.x, icon: "/images/footer/twitter.svg", w: 18, h: 18, pad: true },
  { label: "Telegram", href: links.telegram, icon: "/images/footer/telegram.svg", w: 22, h: 20, pad: false },
];

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-[1] h-[800px] w-full overflow-clip bg-black">
      {/* Logo + copyright, pinned to the 1280 content column. */}
      <div className="absolute top-[524px] left-1/2 flex h-[50px] w-[1280px] -translate-x-1/2 items-center justify-between">
        <img src="/images/footer/logo.svg" alt="Linq" width={175} height={50} />
        <p className="m-0 text-center text-[16px] leading-[19.2px] font-light tracking-[-0.96px] text-white">
          © 2026 copyright all rights reserved.
        </p>
      </div>

      <div className="absolute top-[124px] left-1/2 flex w-[1006.73px] -translate-x-1/2 flex-col items-center gap-[32px]">
        <div className="flex flex-col items-center">
          <h2 className="m-0 text-center font-display text-[64px] leading-[74px] font-medium tracking-[-1.92px] text-white">
            Join our communities to stay ahead
          </h2>
          <p className="m-0 w-[685px] text-center text-[32px] leading-[38.4px] tracking-[-1.92px] text-white">
            Get instant support, request new features, and catch exclusive
            community updates.
          </p>
        </div>

        <div className="flex items-center gap-[35px]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={`flex h-[24px] items-center gap-[8px] transition duration-300 ease-out hover:-translate-y-[2px] hover:opacity-80 active:translate-y-0 active:duration-75 ${l.pad ? "px-[2px]" : ""}`}
            >
              <img src={l.icon} alt="" width={l.w} height={l.h} className="shrink-0" />
              <span className="text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb]">
                {l.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Gradient-filled wordmark, bleeding off the bottom of the panel. The
          fill is a background clipped to the glyphs, not a text colour. */}
      <p
        className="absolute top-[476px] left-[52%] m-0 w-[1486px] -translate-x-1/2 font-display text-[380px] leading-[456px] font-bold whitespace-nowrap"
        style={{
          letterSpacing: "-26.6px",
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
