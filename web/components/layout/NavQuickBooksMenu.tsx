"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface QuickBooksMenuItem {
  href: string;
  label: string;
}

export interface QuickBooksMenuGroup {
  label: string;
  items: QuickBooksMenuItem[];
}

/* Group dot colours — QuickBooks green family, one per column */
const GROUP_DOTS = ["#2CA01C", "#007A33", "#00573F"];

export function NavQuickBooksMenu({
  menuLabel,
  groups,
  dark = false,
}: {
  menuLabel: string;
  groups: QuickBooksMenuGroup[];
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors duration-150 ${
          open ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        {menuLabel}
        <ChevronDown
          size={13}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 mt-3 w-[min(94vw,480px)] lg:w-[730px] max-h-[75vh] overflow-y-auto rounded-2xl bg-white border border-zinc-200 shadow-[0_24px_60px_rgba(11,31,22,0.14)] z-50 p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {groups.map((group, gi) => (
              <div key={group.label}>
                <p className="px-3 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2.5 rounded-lg px-3 py-2 hover:bg-zinc-100 transition-colors"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: GROUP_DOTS[gi % GROUP_DOTS.length] }}
                    />
                    <span className="text-[13.5px] font-semibold leading-snug text-zinc-800">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
