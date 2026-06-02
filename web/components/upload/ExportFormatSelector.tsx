"use client";

const FORMATS = [
  { id: "csv", label: "CSV", description: "Universal spreadsheet" },
  { id: "xlsx", label: "Excel", description: "Microsoft Excel" },
  { id: "ofx", label: "OFX", description: "QuickBooks / Xero" },
  { id: "qfx", label: "QFX", description: "Quicken" },
  { id: "sheets", label: "Google Sheets", description: "Export directly" },
] as const;

interface Props {
  selected: string[];
  onChange: (formats: string[]) => void;
}

export function ExportFormatSelector({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return; // always keep at least one
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Export formats
      </p>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map(({ id, label, description }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              title={description}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
