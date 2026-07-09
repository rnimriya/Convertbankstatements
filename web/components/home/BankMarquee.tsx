"use client";

import { CheckCircle2 } from"lucide-react";

interface BankMarqueeProps {
  banks: string[];
}

export function BankMarquee({ banks }: BankMarqueeProps) {
  // Split banks into 3 rows for a dense, premium marquee effect
  const row1 = banks.slice(0, Math.ceil(banks.length / 3));
  const row2 = banks.slice(Math.ceil(banks.length / 3), Math.ceil((banks.length * 2) / 3));
  const row3 = banks.slice(Math.ceil((banks.length * 2) / 3));

  // Duplicating the list to create a seamless infinite loop
  const Row = ({ items, reverse = false, speedClass ="animate-marquee" }: { items: string[], reverse?: boolean, speedClass?: string }) => (
    <div className="flex overflow-hidden relative w-full group mask-image-fade">
      <div
        className={`flex whitespace-nowrap min-w-full ${speedClass} ${
          reverse ?"animation-direction-reverse" :""
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDirection: reverse ?"reverse" :"normal" }}
      >
        {[...items, ...items].map((bank, i) => (
          <div
            key={i}
            className="px-5 py-3 mx-2 text-sm font-medium text-brand-text/70 hover:text-brand-text flex items-center gap-2.5 flex-shrink-0 transition-colors"
          >
            <CheckCircle2 size={16} className="text-brand-secondary" />
            {bank}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[100vw] overflow-hidden -mx-6 px-6 relative py-10 flex flex-col gap-4">
      <Row items={row1} speedClass="animate-marquee duration-[120s]" />
      <Row items={row2} reverse speedClass="animate-marquee duration-[100s]" />
      <Row items={row3} speedClass="animate-marquee duration-[140s]" />
    </div>
  );
}
