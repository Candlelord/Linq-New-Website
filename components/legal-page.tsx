import type { ReactNode } from "react";
import Link from "next/link";
import { COMPANY, LAST_UPDATED, LEGAL_LINKS } from "@/lib/legal";

/* The shell for documents people have to be able to read, so unlike the landing
   page nothing here is measured or fixed-width. `.legal` cancels the body's
   --zoom, which leaves these pages sized in real pixels at every viewport. */
export function LegalPage({
  title,
  updated = true,
  children,
}: {
  title: string;
  updated?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="legal flex min-h-screen flex-col bg-white text-[#171717]">
      <header className="mx-auto w-full max-w-[720px] px-5 pt-8">
        <Link href="/" aria-label="Linq home" className="inline-block">
          {/* The wordmark file is white, for the dark sections it was cut for. */}
          <img src="/images/logo.svg" alt="" width={88} height={26} className="invert" />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 pt-12 pb-16">
        <h1 className="m-0 font-display text-[40px] leading-[1.1] font-medium tracking-[-0.02em] mob:text-[32px]">
          {title}
        </h1>
        {updated && (
          <p className="mt-3 text-[15px] text-[#5c5c5c]">
            Last updated {LAST_UPDATED}
          </p>
        )}
        <div className="legal-prose mt-8">{children}</div>
      </main>

      <footer className="bg-black text-white">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-5 py-8">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[15px] underline-offset-4 hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="m-0 text-[14px] font-light">© 2026 {COMPANY}</p>
        </div>
      </footer>
    </div>
  );
}
