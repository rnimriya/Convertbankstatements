"use client";

import { Sun, Moon } from"lucide-react";
import { useTheme } from"./ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-950 text-zinc-500 dark:text-violet-400 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-surface-raised transition-colors ${className ??""}`}
    >
      {theme ==="dark" ? <Sun className="h-4 w-4 text-cyan-500 dark:text-cyan-400" /> : <Moon className="h-4 w-4 text-amber-500 dark:text-amber-400" />}
    </button>
  );
}
