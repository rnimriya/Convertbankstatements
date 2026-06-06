"use client";

import { Check } from "lucide-react";

// ── Flat icons ─────────────────────────────────────────────────────────────

function IconCSV() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6 shrink-0">
      <rect width="32" height="32" rx="6" fill="#E8F5E9"/>
      <rect x="7" y="9" width="18" height="2.5" rx="1.25" fill="#43A047"/>
      <rect x="7" y="14" width="18" height="2.5" rx="1.25" fill="#43A047"/>
      <rect x="7" y="19" width="12" height="2.5" rx="1.25" fill="#43A047"/>
      <rect x="11" y="9" width="1.5" height="12.5" rx="0.75" fill="#81C784"/>
      <rect x="19" y="9" width="1.5" height="7.5" rx="0.75" fill="#81C784"/>
    </svg>
  );
}

function IconExcel() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6 shrink-0">
      <rect width="32" height="32" rx="6" fill="#1D6F42"/>
      <rect x="6" y="8" width="20" height="16" rx="2" fill="#fff" fillOpacity="0.15"/>
      <path d="M10 11.5L13.5 16L10 20.5H12.5L14.75 17.25L17 20.5H19.5L16 16L19.5 11.5H17L14.75 14.75L12.5 11.5H10Z" fill="white"/>
    </svg>
  );
}

function IconOFX() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6 shrink-0">
      <rect width="32" height="32" rx="6" fill="#E3F2FD"/>
      <path d="M16 7L26 12H6L16 7Z" fill="#1565C0"/>
      <rect x="8"  y="13" width="3" height="9" rx="1" fill="#1976D2"/>
      <rect x="14" y="13" width="3" height="9" rx="1" fill="#1976D2"/>
      <rect x="20" y="13" width="3" height="9" rx="1" fill="#1976D2"/>
      <rect x="6"  y="22" width="20" height="2.5" rx="1" fill="#1565C0"/>
    </svg>
  );
}

function IconQFX() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6 shrink-0">
      <rect width="32" height="32" rx="6" fill="#FFF3E0"/>
      <circle cx="14.5" cy="14.5" r="6.5" stroke="#E65100" strokeWidth="2.5" fill="none"/>
      <line x1="19.5" y1="19.5" x2="25" y2="25" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 14.5h5M14.5 12v5" stroke="#E65100" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconSheets() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6 shrink-0">
      <rect width="32" height="32" rx="6" fill="#E8F5E9"/>
      <rect x="6"  y="6"  width="20" height="20" rx="2.5" fill="#34A853"/>
      <rect x="6"  y="12" width="20" height="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="6"  y="18" width="20" height="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="12" y="6"  width="1.5" height="20" fill="white" fillOpacity="0.6"/>
      <rect x="18" y="6"  width="1.5" height="20" fill="white" fillOpacity="0.6"/>
      <rect x="8"  y="8"  width="3"   height="3"  rx="0.5" fill="white" fillOpacity="0.9"/>
    </svg>
  );
}

const FORMATS = [
  { id: "csv",    label: "CSV",          description: "Universal spreadsheet",     Icon: IconCSV    },
  { id: "xlsx",   label: "Excel",        description: "Microsoft Excel (.xlsx)",   Icon: IconExcel  },
  { id: "ofx",    label: "OFX",          description: "QuickBooks / Tally / Xero", Icon: IconOFX    },
  { id: "qfx",    label: "QFX",          description: "Quicken",                   Icon: IconQFX    },
  { id: "sheets", label: "Google Sheets",description: "Opens directly in Sheets",  Icon: IconSheets },
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
        <span className="ml-2 normal-case font-normal">(select all you need)</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FORMATS.map(({ id, label, description, Icon }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              title={description}
              className={`relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all duration-150 ${
                active
                  ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 shadow-sm ring-1 ring-brand-300 dark:ring-brand-700"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-slate-600 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-600 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-100"
              }`}
            >
              <Icon />
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
