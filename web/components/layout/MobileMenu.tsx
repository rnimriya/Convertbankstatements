"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { QuickBooksMenuGroup } from "./NavQuickBooksMenu";

/* Group dot colours — same QuickBooks green family as the desktop mega menu */
const GROUP_DOTS = ["#2CA01C", "#007A33", "#00573F"];

export function MobileMenu({
  mainLinks,
  groups,
  quickbooksLabel,
  allToolsLabel,
  menuLabel,
  closeLabel,
}: {
  mainLinks: { href: string; label: string }[];
  groups: QuickBooksMenuGroup[];
  quickbooksLabel: string;
  allToolsLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* lock body scroll while the drawer is open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open ]);

  /* close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open ]);

  const close = () => setOpen(false);

  /* The drawer is portalled to <body>: the navbar pill's backdrop-blur would
     otherwise become the containing block for `fixed` and clip the drawer. */
  const drawer = (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[60] bg-zinc-950/45 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Left slide-in drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[70] flex w-[300px] max-w-[85vw] flex-col bg-white shadow-[24px_0_60px_rgba(11,31,22,0.18)] transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer header: logo + close */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-4">
          <Link href="/" onClick={close} className="flex items-center gap-2.5" tabIndex={open ? 0 : -1}>
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="font-display font-bold text-zinc-900 text-[15px] tracking-tight">
              Convert Statement
            </span>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            tabIndex={open ? 0 : -1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X size={19} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Main links */}
          <nav className="flex flex-col">
            {mainLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
              >
                {label}
                <ArrowRight size={15} className="text-zinc-300" />
              </Link>
            ))}
          </nav>

          {/* QuickBooks tools */}
          <p className="px-3 pt-6 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
            {quickbooksLabel}
          </p>
          {groups.map((group, gi) => (
            <div key={group.label} className="pt-2">
              <p className="px-3 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                {group.label}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
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

          <Link
            href="/tools"
            onClick={close}
            tabIndex={open ? 0 : -1}
            className="mt-4 flex items-center justify-between rounded-xl bg-[#EAF6EC] px-3 py-3 text-[14px] font-bold text-[#00573F] hover:bg-[#DFF0E2] transition-colors"
          >
            {allToolsLabel}
            <ArrowRight size={15} />
          </Link>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {/* Hamburger — mobile only, sits at the left of the navbar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="md:hidden -ml-1 flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
