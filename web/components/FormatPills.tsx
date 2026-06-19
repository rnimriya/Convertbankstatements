"use client";

import { useState } from "react";

const FORMATS = [
  { label: "Excel",              ext: ".xlsx" },
  { label: "CSV",                ext: ".csv"  },
  { label: "OFX for Tally",     ext: ".ofx"  },
  { label: "QFX for QuickBooks", ext: ".qfx"  },
  { label: "Google Sheets",      ext: ".csv"  },
];

export default function FormatPills() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-wrap gap-2">
      {FORMATS.map((f, i) => (
        <button
          key={f.label}
          onClick={() => setActive(i)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
            i === active
              ? "bg-zinc-900 dark:bg-zinc-950 text-white border-navy"
              : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-navy hover:text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
