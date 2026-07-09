"use client";

import { useState } from"react";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from"lucide-react";
import { cn } from"@/lib/utils";

// ─── Maps ─────────────────────────────────────────────────────────────────────

const VARIANTS = {
  info: {
    container:"bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50 text-sky-800 dark:text-sky-200",
    icon:"text-sky-500 dark:text-sky-400",
    close:"text-sky-600/60 hover:text-sky-800 dark:text-sky-400/60 dark:hover:text-sky-200",
    Icon: Info,
  },
  success: {
    container:"bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200",
    icon:"text-emerald-500 dark:text-emerald-400",
    close:"text-emerald-600/60 hover:text-emerald-800 dark:text-emerald-400/60 dark:hover:text-emerald-200",
    Icon: CheckCircle2,
  },
  warning: {
    container:"bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200",
    icon:"text-amber-500 dark:text-amber-400",
    close:"text-amber-600/60 hover:text-amber-800 dark:text-amber-400/60 dark:hover:text-amber-200",
    Icon: AlertTriangle,
  },
  error: {
    container:"bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200",
    icon:"text-red-500 dark:text-red-400",
    close:"text-red-600/60 hover:text-red-800 dark:text-red-400/60 dark:hover:text-red-200",
    Icon: XCircle,
  },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AlertProps {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Alert({
  variant ="info",
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const { container, icon: iconClass, close: closeClass, Icon } = VARIANTS[variant];

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      role="alert"
      className={cn("flex gap-3 rounded-xl border px-4 py-3.5 text-sm",
        container,
        className
      )}
    >
      {/* Icon */}
      <span className={cn("mt-0.5 shrink-0", iconClass)} aria-hidden="true">
        {icon ?? <Icon className="h-4 w-4" />}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold leading-snug mb-1">{title}</p>
        )}
        <div className="leading-relaxed">{children}</div>
      </div>

      {/* Dismiss */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className={cn("ml-1 mt-0.5 shrink-0 self-start rounded p-0.5 transition-colors","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            closeClass
          )}
        >
          <X className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ─── Controlled variant (no internal state) ───────────────────────────────────

export interface AlertBannerProps extends Omit<AlertProps,"dismissible"> {
  visible: boolean;
  onDismiss: () => void;
}

export function AlertBanner({ visible, ...rest }: AlertBannerProps) {
  if (!visible) return null;
  return <Alert dismissible {...rest} />;
}
