"use client";

import { Check } from"lucide-react";

function IconCSV() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <rect width="24" height="24" rx="6" fill="#E8F5E9"/>
      <rect x="5" y="7" width="14" height="2" rx="1" fill="#43A047"/>
      <rect x="5" y="11" width="14" height="2" rx="1" fill="#43A047"/>
      <rect x="5" y="15" width="9" height="2" rx="1" fill="#43A047"/>
    </svg>
  );
}

function IconExcel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <rect width="24" height="24" rx="6" fill="#1D6F42"/>
      <path d="M6.5 8L9.5 12L6.5 16H9L11 13L13 16H15.5L12.5 12L15.5 8H13L11 11L9 8H6.5Z" fill="white"/>
    </svg>
  );
}

function IconOFX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <rect width="24" height="24" rx="6" fill="#E3F2FD"/>
      <path d="M12 4.5L19.5 8.5H4.5L12 4.5Z" fill="#1565C0"/>
      <rect x="6"   y="10" width="2.5" height="7" rx="0.8" fill="#1976D2"/>
      <rect x="10.8" y="10" width="2.5" height="7" rx="0.8" fill="#1976D2"/>
      <rect x="15.5" y="10" width="2.5" height="7" rx="0.8" fill="#1976D2"/>
      <rect x="4" y="17.5" width="16" height="2" rx="0.8" fill="#1565C0"/>
    </svg>
  );
}

function IconQFX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <rect width="24" height="24" rx="6" fill="#FFF3E0"/>
      <circle cx="10.5" cy="10.5" r="5" stroke="#E65100" strokeWidth="2" fill="none"/>
      <line x1="14.5" y1="14.5" x2="18.5" y2="18.5" stroke="#E65100" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 10.5h3M10.5 9v3" stroke="#E65100" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function IconSheets() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <rect width="24" height="24" rx="6" fill="#34A853"/>
      <rect x="5"  y="9"  width="14" height="1.2" fill="white" fillOpacity="0.7"/>
      <rect x="5"  y="13.8" width="14" height="1.2" fill="white" fillOpacity="0.7"/>
      <rect x="9.4" y="5" width="1.2" height="14" fill="white" fillOpacity="0.7"/>
      <rect x="13.4" y="5" width="1.2" height="14" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

const FORMATS = [
  { id:"csv",    label:"CSV",           sub:"Universal",   Icon: IconCSV    },
  { id:"xlsx",   label:"Excel",         sub:".xlsx",       Icon: IconExcel  },
  { id:"ofx",    label:"OFX",           sub:"Tally / Xero",Icon: IconOFX    },
  { id:"qfx",    label:"QFX",           sub:"Quicken",     Icon: IconQFX    },
  { id:"sheets", label:"Google Sheets", sub:"Direct sync", Icon: IconSheets },
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {FORMATS.map(({ id, label, sub, Icon }) => {
        const active = selected.includes(id);
        return (
          <button
            key={id}
            onClick={() => toggle(id)}
            className="relative flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 text-center transition-all duration-150 group"
            style={
              active
                ? {
                    background:"linear-gradient(135deg,#1A47C8,#3b6ef5)",
                    borderColor:"#1A47C8",
                    boxShadow:"0 6px 20px rgba(26,71,200,0.28)",
                  }
                : {
                    background:"#ffffff",
                    borderColor:"#e2e8f0",
                  }
            }
          >
            {/* Active check badge */}
            {active && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white dark:bg-zinc-950/20 flex items-center justify-center">
                <Check size={10} className="text-white text-emerald-500 dark:text-emerald-400" />
              </div>
            )}

            <Icon />

            <div>
              <p className={`text-sm font-bold leading-tight ${active ?"text-white" :"text-zinc-800 dark:text-zinc-200"}`}>
                {label}
              </p>
              <p className={`text-[10px] mt-0.5 leading-tight ${active ?"text-white/65" :"text-zinc-400 dark:text-zinc-500"}`}>
                {sub}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
