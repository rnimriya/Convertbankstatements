"use client";

import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";

interface Props {
  displayName: string;
  email: string;
  initial: string;
}

export function NavUserMenu({ displayName, email, initial }: Props) {
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

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-1.5 pr-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <div className="h-6 w-6 rounded-lg bg-gray-900 flex items-center justify-center text-[11px] font-black text-white shrink-0">
          {initial}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          size={13}
          className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none overflow-hidden z-50"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{displayName}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <LayoutDashboard size={14} className="text-zinc-400 dark:text-zinc-500" />
              Dashboard
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Settings size={14} className="text-zinc-400 dark:text-zinc-500" />
              Settings
            </a>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
