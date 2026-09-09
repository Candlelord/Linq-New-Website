import type { ReactNode } from "react";

/* Measured off the live site: 220×54 outer with a 1px gradient rim, 218×52 fill.
   Fill is a radial at 64% 75%; the rim is a 175° linear. */
const variants = {
  dark: {
    fill: "radial-gradient(64% 75%, rgb(19,8,38) 0%, rgb(48,30,84) 100%)",
    rim: "linear-gradient(175deg, rgb(66,41,117) 43%, rgb(13,6,28) 112%)",
  },
  purple: {
    fill: "radial-gradient(64% 75%, rgb(23,11,46) 0%, rgb(138,79,255) 100%)",
    rim: "linear-gradient(175deg, rgb(204,179,255) 43%, rgb(96,48,191) 112%)",
  },
};

export function PillButton({
  href,
  children,
  variant = "purple",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <a
      href={href}
      className={`pressable inline-flex h-[54px] w-[220px] cursor-pointer items-center justify-center gap-[8px] rounded-[2000px] border border-transparent text-[18px] leading-[24px] font-medium tracking-[-1.08px] text-[#fbfbfb] select-none ${className}`}
      style={{
        background: `${v.fill} padding-box, ${v.rim} border-box`,
        /* Live draws this highlight on the inner fill layer; with the
           padding-box/border-box pair the padding box is that same layer. */
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.58)",
      }}
    >
      {children}
    </a>
  );
}
