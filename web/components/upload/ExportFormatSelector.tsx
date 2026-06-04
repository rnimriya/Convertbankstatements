"use client";

import { Check } from "lucide-react";

const FORMATS = [
  {
    id: "csv",
    label: "CSV",
    description: "Universal spreadsheet",
    icon: "📄",
  },
  {
    id: "xlsx",
    label: "Excel",
    description: "Microsoft Excel (.xlsx)",
    icon: "📊",
  },
  {
    id: "ofx",
    label: "OFX",
    description: "QuickBooks / Tally / Xero",
    icon: "🏦",
  },
  {
    id: "qfx",
    label: "QFX",
    description: "Quicken",
    icon: "💼",
  },
  {
    id: "sheets",
    label: "Google Sheets",
    description: "Opens directly in Sheets",
    icon: "🟢",
  },
] as const;

interface Props {
  selected: string[];
  onChange: (formats: string[]) => void;
}

export function ExportFormatSelector({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        Export formats
        <span className="ml-2 normal-case font-normal text-slate-400 dark:text-gray-500">(select all you need)</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FORMATS.map(({ id, label, description, icon }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              title={description}
              className={`relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-150 ${
                active
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 shadow-sm ring-1 ring-brand-300 dark:ring-brand-700"
                  : "border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-600 hover:text-slate-800 dark:hover:text-gray-100"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{label}</p>
                <p className={`text-[10px] leading-tight truncate mt-0.5 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-gray-500"}`}>
                  {description}
                </p>
              </div>
              {active && (
                <Check className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
