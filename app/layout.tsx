import type { Metadata } from "next";
import { Mozilla_Headline, Space_Grotesk } from "next/font/google";
import "./globals.css";

/* Loaded as a variable font with the width axis, because the word-cycler uses
   the SemiCondensed width to keep "A SMARTER WAY TO" on one line at 128px. */
const display = Mozilla_Headline({
  subsets: ["latin"],
  variable: "--font-display-face",
  axes: ["wdth"],
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body-face",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Linq — Spend crypto like cash",
  description:
    "Cash out your crypto directly to your bank account, save and pay bills instantly.",
  /* The wordmark is illegible at favicon size, so the icon is the mark alone,
     white on the black circle. */
  icons: { icon: "/images/logo-mark.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
