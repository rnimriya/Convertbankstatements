"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-surface text-zinc-500 dark:text-brand-400 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-surface-raised transition-colors ${className ?? ""}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
