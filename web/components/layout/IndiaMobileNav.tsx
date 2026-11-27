"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Home,
  LayoutGrid,
  ListChecks,
  Mail,
  Newspaper,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import type { QuickBooksMenuGroup } from "./NavQuickBooksMenu";
import { NavSessionIsland } from "./NavSessionIsland";

/* convertstatement.in mobile navigation — GetMeHelp pattern (owner order
   2026-11-27: "navigation helpme in jaisa bana do"): round hamburger in the
   logo bar, left slide-in drawer with icon links, expandable Tools
   accordion, auth + green CTA pill at the bottom. IN-only; .online keeps
   the existing MobileMenu. */
export function IndiaMobileNav({
  groups,
  labels,
  dark = false,
}: {
  groups: QuickBooksMenuGroup[];
  dark?: boolean;
  labels: {
    menu: string;
    close: string;
    signIn: string;
    howItWorks: string;
    features: string;
    pricing: string;
    blog: string;
    faq: string;
    contact: string;
    allTools: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const pathname = usePathname();

  // Close whenever the route changes (link taps navigate).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const close = () => setOpen(false);
  // Close when any link/button inside the auth area is tapped.
  const authClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) close();
  };

  const linkCls =
    "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-semibold text-zinc-900 hover:bg-[#ECFDF5] hover:text-[#047857]";
  const iconCls = "shrink-0 text-[#047857]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.menu}
        aria-expanded={open}
        className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full border lg:hidden ${
          dark ? "border-white/30 text-white" : "border-[#E8E8E8] text-zinc-900"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className={`fixed inset-0 z-[80] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        {/* Backdrop */}
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        {/* Panel */}
        <aside
          className={`absolute inset-y-0 left-0 flex w-[84vw] max-w-[320px] flex-col bg-white shadow-[24px_0_44px_rgba(11,11,15,.25)] transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label={labels.menu}
        >
          <div className="flex items-center justify-between border-b border-[#E7EFE9] px-4 py-3">
            <Link href="/" onClick={close} className="flex items-center gap-2.5 shrink-0">
              <img src="/logo.svg" alt="Convert Statement" className="h-9 w-9" />
              <span className="font-display font-extrabold text-zinc-900 text-[16px] tracking-tight">
                Convert Statement
              </span>
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E8E8E8] text-zinc-900"
            >
              <X size={19} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <Link href="/" onClick={close} className={linkCls}>
              <Home size={19} className={iconCls} />
              Home
            </Link>

            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              className={`${linkCls} w-full text-left`}
            >
              <LayoutGrid size={19} className={iconCls} />
              Tools
              <ChevronDown
                size={17}
                className={`ml-auto shrink-0 text-zinc-400 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {toolsOpen && (
              <div className="mb-1 ml-4 border-l border-[#E7EFE9] pl-2">
                <Link
                  href="/tools"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-bold text-[#047857]"
                >
                  {labels.allTools}
                </Link>
                {groups.map((group) => (
                  <div key={group.label}>
                    <p className="px-2.5 pt-3 pb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-400">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-800 hover:bg-[#ECFDF5] hover:text-[#047857]"
                      >
                        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#047857]" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <Link href="/#how-it-works" onClick={close} className={linkCls}>
              <ListChecks size={19} className={iconCls} />
              {labels.howItWorks}
            </Link>
            <Link href="/#features" onClick={close} className={linkCls}>
              <Sparkles size={19} className={iconCls} />
              {labels.features}
            </Link>
            <Link href="/pricing" onClick={close} className={linkCls}>
              <Tag size={19} className={iconCls} />
              {labels.pricing}
            </Link>
            <Link href="/blog" onClick={close} className={linkCls}>
              <Newspaper size={19} className={iconCls} />
              {labels.blog}
            </Link>
            <Link href="/#faq" onClick={close} className={linkCls}>
              <CircleHelp size={19} className={iconCls} />
              {labels.faq}
            </Link>
            <Link href="/contact" onClick={close} className={linkCls}>
              <Mail size={19} className={iconCls} />
              {labels.contact}
            </Link>
          </nav>

          <div className="border-t border-[#E7EFE9] px-4 py-4">
            <div
              onClick={authClick}
              className="india-nav-auth flex items-center gap-2 [&>a]:flex-1 [&>a]:text-center [&>div]:flex-1"
            >
              <NavSessionIsland signInLabel={labels.signIn} signUpLabel="Sign Up" />
            </div>
            <Link
              href="/#upload"
              onClick={close}
              className="mt-3 flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-[#065F46] bg-[#047857] py-1.5 pl-1.5 pr-2 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(4,120,87,.45)]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-900 text-lg font-bold leading-none text-white">
                +
              </span>
              <span>Convert a statement</span>
              <span className="rounded-full bg-[#D1FAE5] px-2.5 py-[3px] text-[10.5px] font-extrabold tracking-wide text-[#047857]">
                FREE
              </span>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
