"use client";

import { useState, useEffect } from"react";
import { X, Zap } from"lucide-react";

const BANNER_KEY ="cs_banner_dismissed_taxseason2025";

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(BANNER_KEY)) setVisible(true);
    } catch { /* SSR / private browsing */ }
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(BANNER_KEY,"1"); } catch { /* ignore */ }
  }

  if (!visible) return null;

  return (
    <div className="relative z-[60] bg-zinc-900 dark:bg-zinc-950 dark:border-b dark:border-zinc-800 text-white text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2.5">
        <Zap size={14} className="shrink-0 text-amber-300 fill-amber-300 text-amber-500 dark:text-amber-400" />
        <p className="text-center leading-snug">
          <span className="font-semibold">Tax season approaching!</span>
          {""}Cut your data entry time by 90% —{""}
          <a href="/signup" className="underline underline-offset-2 hover:text-white/80 transition-colors font-medium">
            start free today
          </a>
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss banner"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white dark:bg-zinc-950/10 transition-colors"
        >
          <X className="text-rose-500 dark:text-rose-400"  size={14} />
        </button>
      </div>
    </div>
  );
}
