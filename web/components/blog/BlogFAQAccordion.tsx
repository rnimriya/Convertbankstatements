"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  // Answer HTML — already sanitized server-side by the blog page, same as
  // the article body. Blog FAQ answers can contain links, so unlike the
  // homepage accordion this renders HTML instead of plain text.
  a: string;
}

// Design C v3 (owner-approved 2026-10-27): large cards, violet border when
// open, circular chevron button. First item open by default, single-open.
export function BlogFAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3.5">
      {items.map(({ q, a }, i) => (
        <div
          key={i}
          className={`rounded-[18px] border-[1.5px] transition-all duration-200 overflow-hidden ${
            open === i
              ? "border-emerald-700"
              : "border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <button
            className="flex w-full items-center justify-between px-[22px] py-[19px] text-left gap-4"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="text-base font-bold leading-snug text-zinc-900">
              {q}
            </span>
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-zinc-100">
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
              />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className="px-[22px] pb-[19px] text-[15.5px] text-zinc-600 leading-[1.75] [&_a]:text-emerald-600 [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: a }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
