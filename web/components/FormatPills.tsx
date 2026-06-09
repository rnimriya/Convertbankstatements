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
              ? "bg-navy text-white border-navy"
              : "bg-white text-slate-600 border-slate-200 hover:border-navy hover:text-navy"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
