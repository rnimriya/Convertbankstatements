import { cn } from "@/lib/utils";

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANTS = {
  default:
    "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300",
  brand:
    "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300",
  success:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  warning:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  danger:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  info:
    "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
} as const;

const SIZES = {
  sm: "px-2 py-0.5 text-[10px] font-bold",
  md: "px-2.5 py-0.5 text-xs font-semibold",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BadgeProps {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DOT_COLORS: Record<keyof typeof VARIANTS, string> = {
  default: "bg-slate-400",
  brand:   "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  info:    "bg-sky-500",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT_COLORS[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
