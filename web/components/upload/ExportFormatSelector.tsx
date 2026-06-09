"use client";

import { Check } from "lucide-react";

function IconCSV() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <rect width="20" height="20" rx="4" fill="#E8F5E9"/>
      <rect x="4" y="5.5" width="12" height="1.8" rx="0.9" fill="#43A047"/>
      <rect x="4" y="9.1" width="12" height="1.8" rx="0.9" fill="#43A047"/>
      <rect x="4" y="12.7" width="8" height="1.8" rx="0.9" fill="#43A047"/>
    </svg>
  );
}

function IconExcel() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <rect width="20" height="20" rx="4" fill="#1D6F42"/>
      <path d="M5.5 6.5L8 10L5.5 13.5H7.5L9.25 11L11 13.5H13L10.5 10L13 6.5H11L9.25 9L7.5 6.5H5.5Z" fill="white"/>
    </svg>
  );
}

function IconOFX() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <rect width="20" height="20" rx="4" fill="#E3F2FD"/>
      <path d="M10 3.5L17 7H3L10 3.5Z" fill="#1565C0"/>
      <rect x="4.5" y="8" width="2" height="6" rx="0.7" fill="#1976D2"/>
      <rect x="9"   y="8" width="2" height="6" rx="0.7" fill="#1976D2"/>
      <rect x="13.5" y="8" width="2" height="6" rx="0.7" fill="#1976D2"/>
      <rect x="3"  y="14.5" width="14" height="1.8" rx="0.7" fill="#1565C0"/>
    </svg>
  );
}

function IconQFX() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <rect width="20" height="20" rx="4" fill="#FFF3E0"/>
      <circle cx="9" cy="9" r="4.5" stroke="#E65100" strokeWidth="1.8" fill="none"/>
      <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#E65100" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7.5 9h3M9 7.5v3" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconSheets() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
      <rect width="20" height="20" rx="4" fill="#34A853"/>
      <rect x="4"  y="7.5" width="12" height="1" fill="white" fillOpacity="0.6"/>
      <rect x="4"  y="11.5" width="12" height="1" fill="white" fillOpacity="0.6"/>
      <rect x="8"  y="4" width="1"   height="12" fill="white" fillOpacity="0.6"/>
      <rect x="12" y="4" width="1"   height="12" fill="white" fillOpacity="0.6"/>
    </svg>
  );
}

const FORMATS = [
  { id: "csv",    label: "CSV",          sub: "Universal",  Icon: IconCSV    },
  { id: "xlsx",   label: "Excel",        sub: ".xlsx",      Icon: IconExcel  },
  { id: "ofx",    label: "OFX",          sub: "Tally/Xero", Icon: IconOFX    },
  { id: "qfx",    label: "QFX",          sub: "Quicken",    Icon: IconQFX    },
  { id: "sheets", label: "Google Sheets",sub: "Direct sync",Icon: IconSheets },
] as const;

interface Props {
  selected: string[];
  onChange: (formats: string[]) => void;
}

export function ExportFormatSelector({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter(f => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        Output format
        <span className="ml-2 normal-case font-normal text-slate-400 dark:text-gray-500">(select all you need)</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map(({ id, label, sub, Icon }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              title={sub}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-navy text-white border-navy shadow-md shadow-navy/20"
                  : "bg-white dark:bg-surface text-slate-600 dark:text-gray-300 border-slate-200 dark:border-white/10 hover:border-navy/40 dark:hover:border-brand-400/40 hover:text-navy dark:hover:text-brand-400"
              }`}
            >
              <Icon />
              <span>{label}</span>
              {active && <Check size={12} className="shrink-0 opacity-80" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
