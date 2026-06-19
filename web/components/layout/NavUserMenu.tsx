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
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white pl-1.5 pr-3 py-1.5 hover:bg-slate-50 transition-colors"
      >
        <div className="h-6 w-6 rounded-lg bg-gray-900 flex items-center justify-center text-[11px] font-black text-white shrink-0">
          {initial}
        </div>
        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <LayoutDashboard size={14} className="text-slate-400" />
              Dashboard
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Settings size={14} className="text-slate-400" />
              Settings
            </a>
          </div>

          <div className="border-t border-slate-100 py-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
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
