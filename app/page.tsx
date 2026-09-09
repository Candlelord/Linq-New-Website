import { Hero } from "@/components/hero";
import { Chains } from "@/components/chains";
import { SmarterWay } from "@/components/smarter-way";
import { Features } from "@/components/features";
import { Faq } from "@/components/faq";
import { Testimonials } from "@/components/testimonials";
import { Help } from "@/components/help";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/reveal";

import { MobileNav } from "@/components/mobile/nav";
import { MobileHero } from "@/components/mobile/hero";
import { MobileSmarterWay } from "@/components/mobile/smarter-way";
import { MobileFeatures } from "@/components/mobile/features";
import { MobileFaq } from "@/components/mobile/faq";
import { MobileHelp } from "@/components/mobile/help";
import { MobileCta } from "@/components/mobile/cta";
import { MobileFooter } from "@/components/mobile/footer";
import { Scaled } from "@/components/mobile/scaled";

/* The footer is revealed from behind rather than scrolled to: it is sticky at
   the bottom of this column, and everything above it rides over it on a higher
   layer with an opaque background. That wrapper is what makes the reveal work —
   without it the footer would simply show through.

   SiteNav sits outside that wrapper on purpose. The wrapper's z-index makes it
   a stacking context, so a burger nested inside it can never rise above the
   menu overlay — which portals to <body> — no matter how high its own z-index.

   Below 768px the desktop tree is switched off and a mobile tree renders in its
   place; above it, nothing here changes. `.desktop-only` / `.mobile-only` are
   `display: contents` when shown (see globals.css), so neither wrapper adds a
   box — the sections below stay direct children of the same parents they had
   before, which is what keeps the sticky footer and sticky word-cycle working.

   Two sections cross over rather than being rebuilt. The chain ticker and the
   testimonial rail are fixed-size art whose parts only line up at their
   measured sizes, so they render the desktop component scaled down — mildly
   enough that their copy lands at 16px and 18px. See components/mobile/scaled. */
export default function Page() {
  return (
    <main className="flex flex-col">
      <div className="desktop-only">
        <SiteNav />
      </div>
      <div className="mobile-only">
        <MobileNav />
      </div>

      <div className="relative z-[3] bg-white">
        <div className="desktop-only">
          {/* Hero, SmarterWay and the footer are deliberately not wrapped in
              Reveal. The hero is the LCP element and the live site gives it no
              entrance at all; the other two contain `position: sticky`
              children, which a transformed ancestor would break. */}
          <Hero />
          <Reveal>
            <Chains />
          </Reveal>
          <SmarterWay />
          <Reveal>
            <Features />
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
          <Reveal>
            <Testimonials />
          </Reveal>
          <Reveal>
            <Help />
          </Reveal>
          <Reveal>
            <Cta />
          </Reveal>
        </div>

        <div className="mobile-only">
          {/* Same exclusions as above, for the same reasons. */}
          <MobileHero />
          <Reveal>
            <Scaled factor={0.5}>
              <Chains />
            </Scaled>
          </Reveal>
          <MobileSmarterWay />
          <Reveal>
            <MobileFeatures />
          </Reveal>
          <Reveal>
            <MobileFaq />
          </Reveal>
          <Reveal>
            <Scaled factor={0.75}>
              <Testimonials />
            </Scaled>
          </Reveal>
          <Reveal>
            <MobileHelp />
          </Reveal>
          <Reveal>
            <MobileCta />
          </Reveal>
        </div>
      </div>

      <div className="desktop-only">
        <Footer />
      </div>
      <div className="mobile-only">
        <MobileFooter />
      </div>
    </main>
  );
}
