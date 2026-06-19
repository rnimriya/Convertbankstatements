"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map(({ q, a }, i) => (
        <div
          key={i}
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            open === i
              ? "border-navy/20 bg-navy/[0.02] shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left gap-4"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className={`text-sm font-semibold leading-snug ${open === i ? "text-navy" : "text-slate-800"}`}>
              {q}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-slate-400 transition-transform duration-300 ${open === i ? "rotate-180 text-navy" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
              {a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
