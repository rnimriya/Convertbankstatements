"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors ${className ?? ""}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
