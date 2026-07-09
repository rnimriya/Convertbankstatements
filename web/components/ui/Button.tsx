"use client";

import { forwardRef } from"react";
import { Loader2 } from"lucide-react";
import { cn } from"@/lib/utils";

// ─── Variant & size maps ──────────────────────────────────────────────────────

const VARIANTS = {
  primary:"bg-black text-white font-bold border-0 shadow-none" +"hover:bg-zinc-800 active:bg-zinc-900" +"dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:active:bg-zinc-300" +"focus-visible:ring-black dark:focus-visible:ring-white",
  secondary:"border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-200" +"hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-surface-raised active:bg-zinc-100 dark:bg-zinc-800 dark:active:bg-surface-raised" +"focus-visible:ring-zinc-400",
  ghost:"text-zinc-600 dark:text-zinc-300" +"hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-surface active:bg-zinc-200 dark:bg-zinc-700 dark:active:bg-surface-raised" +"focus-visible:ring-zinc-400",
  danger:"bg-red-600 text-white shadow-sm shadow-red-200 dark:shadow-red-900/30" +"hover:bg-red-700 active:bg-red-800" +"focus-visible:ring-red-500",
  success:"bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30" +"hover:bg-emerald-700 active:bg-emerald-800" +"focus-visible:ring-emerald-500",
} as const;

const SIZES = {
  xs:"h-7 gap-1 rounded-lg px-2.5 text-xs",
  sm:"h-8 gap-1.5 rounded-lg px-3 text-sm",
  md:"h-9 gap-2 rounded-xl px-4 text-sm",
  lg:"h-11 gap-2 rounded-xl px-5 text-base",
  xl:"h-12 gap-2.5 rounded-xl px-6 text-base font-bold",
} as const;

const ICON_SIZES = {
  xs:"h-3 w-3",
  sm:"h-3.5 w-3.5",
  md:"h-4 w-4",
  lg:"h-4 w-4",
  xl:"h-5 w-5",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant ="primary",
      size ="md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(
          // Base"relative inline-flex items-center justify-center font-semibold","select-none whitespace-nowrap transition-colors duration-150",
          // Focus ring"outline-none focus-visible:ring-2 focus-visible:ring-offset-2","focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
          // Disabled"disabled:pointer-events-none disabled:opacity-50",
          // Variant + size
          VARIANTS[variant],
          SIZES[size],
          fullWidth &&"w-full",
          className
        )}
        {...props}
      >
        {/* Left slot — hidden while loading so width stays stable */}
        {loading ? (
          <Loader2
            className={cn(ICON_SIZES[size],"animate-spin")}
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className={cn(ICON_SIZES[size],"shrink-0")} aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {children && (
          <span className={loading ?"opacity-0 absolute" : undefined}>
            {children}
          </span>
        )}

        {/* Right slot */}
        {!loading && rightIcon && (
          <span className={cn(ICON_SIZES[size],"shrink-0")} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName ="Button";
