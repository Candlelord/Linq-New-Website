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

/* The footer is revealed from behind rather than scrolled to: it is sticky at
   the bottom of this column, and everything above it rides over it on a higher
   layer with an opaque background. That wrapper is what makes the reveal work —
   without it the footer would simply show through.

   SiteNav sits outside that wrapper on purpose. The wrapper's z-index makes it
   a stacking context, so a burger nested inside it can never rise above the
   menu overlay — which portals to <body> — no matter how high its own z-index. */
export default function Page() {
  return (
    <main className="flex flex-col">
      <SiteNav />

      {/* Hero, SmarterWay and the footer are deliberately not wrapped in Reveal.
          The hero is the LCP element and the live site gives it no entrance at
          all; the other two contain `position: sticky` children, which a
          transformed ancestor would break. */}
      <div className="relative z-[3] bg-white">
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
      <Footer />
    </main>
  );
}
