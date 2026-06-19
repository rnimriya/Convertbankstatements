import { cn } from "@/lib/utils";

const SIZES = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;

const COLORS = {
  current: "text-current",
  brand:   "text-brand-600 dark:text-brand-400",
  white:   "text-white",
  muted:   "text-zinc-400 dark:text-gray-500",
} as const;

export interface SpinnerProps {
  size?: keyof typeof SIZES;
  color?: keyof typeof COLORS;
  label?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  color = "brand",
  label = "Loading…",
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        className={cn("animate-spin", SIZES[size], COLORS[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

// ─── Full-page / section loading overlay ─────────────────────────────────────

export function SpinnerOverlay({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 p-8"
      role="status"
      aria-label={label}
    >
      <Spinner size="lg" color="brand" />
      <p className="text-sm text-zinc-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
