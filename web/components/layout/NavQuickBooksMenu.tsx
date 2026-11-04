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

export interface QuickBooksFeatured {
  kicker: string;
  title: string;
  description: string;
  links: QuickBooksMenuItem[];
  ctaLabel: string;
  ctaHref: string;
}

/* Group dot colours — QuickBooks green family, one per column */
const GROUP_DOTS = ["#2CA01C", "#007A33", "#5BA829", "#00573F"];

export function NavQuickBooksMenu({
  menuLabel,
  groups,
  featured,
  dark = false,
}: {
  menuLabel: string;
  groups: QuickBooksMenuGroup[];
  featured: QuickBooksFeatured;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Hover intent: cancel any pending close as soon as the pointer is back
     over the button or the panel; on leave, wait a beat before closing so a
     slow or slightly diagonal mouse path to the panel never kills the menu
     mid-click (the bug reported 2026-11-04). */
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 250);
  };

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
      ref={ref}
      /* self-stretch: this hover zone spans the pill's full height, so the
         pointer never crosses a dead strip between the button and the panel
         (the panel hangs from the pill's bottom edge, not the button's). */
      className="flex items-center self-stretch"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => {
          if (closeTimer.current) clearTimeout(closeTimer.current);
          setOpen((v) => !v);
        }}
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
        /* Positioned against the navbar pill (the pill is `relative`), so the
           panel centres on the navbar itself — not on this button. The pt-3
           is a transparent hover bridge between the pill and the card. */
        <div className="absolute left-1/2 top-full z-50 w-[min(1180px,96vw)] -translate-x-1/2 pt-3">
          <div className="max-h-[75vh] overflow-y-auto rounded-[24px] bg-white border border-zinc-200 shadow-[0_24px_60px_rgba(11,31,22,0.14)]">
          <div className="flex">
            {/* Featured panel — the Bulk Suite (desktop only) */}
            <div className="hidden lg:flex w-[300px] shrink-0 flex-col bg-[#0B1F16] px-[26px] py-[28px]">
              <p className="mb-[10px] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8FCE7E]">
                {featured.kicker}
              </p>
              <p className="text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-white">
                {featured.title}
              </p>
              <p className="mt-[10px] text-[13.5px] leading-[1.55] text-[#B9CDB4]">
                {featured.description}
              </p>
              <div className="mt-4">
                {featured.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-[9px] border-b border-white/10 py-[10px] text-sm font-semibold text-white transition-colors hover:text-[#8FCE7E]"
                  >
                    <span aria-hidden className="font-extrabold text-[#2CA01C]">
                      →
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-[22px]">
                <Link
                  href={featured.ctaHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-[#2CA01C] py-[11px] text-center text-sm font-bold text-white transition-colors hover:bg-[#33B122]"
                >
                  {featured.ctaLabel}
                </Link>
              </div>
            </div>

            {/* Tool groups */}
            <div className="min-w-0 flex-1 p-5 sm:p-6 lg:px-[28px] lg:py-[26px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 lg:gap-6">
                {groups.map((group, gi) => (
                  <div key={group.label}>
                    <p className="pt-1 pb-[7px] text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-2 py-[4.5px] text-[13px] font-semibold leading-[1.35] text-zinc-700 transition-colors hover:text-zinc-950"
                      >
                        <span
                          aria-hidden
                          className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: GROUP_DOTS[gi % GROUP_DOTS.length] }}
                        />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
