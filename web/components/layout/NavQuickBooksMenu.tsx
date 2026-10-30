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
        className={dark ? "flex items-center gap-1 text-[13.5px] font-medium text-zinc-300 hover:text-white transition-colors duration-150" : "flex items-center gap-1 text-[13.5px] font-medium text-brand-muted hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"}
      >
        {menuLabel}
        <ChevronDown
          size={13}
          className={`dark:transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 md:left-0 md:right-auto mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-[75vh] overflow-y-auto rounded-[20px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50">
          <div className="py-1.5">
            {groups.map((group, gi) => (
              <div key={group.label} className={gi > 0 ? "mt-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-1.5" : ""}>
                <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-[13.5px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
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
