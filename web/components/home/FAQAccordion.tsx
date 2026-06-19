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
              ? "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left gap-4"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className={`text-sm font-semibold leading-snug ${open === i ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-800 dark:text-zinc-300"}`}>
              {q}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${open === i ? "rotate-180 text-zinc-900 dark:text-zinc-100" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
              {a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
