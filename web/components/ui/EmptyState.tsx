import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./Button";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateCTAProps
  extends Pick<ButtonProps, "variant" | "size" | "leftIcon" | "rightIcon" | "onClick" | "disabled"> {
  label: string;
  href?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  cta?: EmptyStateCTAProps;
  secondaryCta?: EmptyStateCTAProps;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZE = {
  sm: {
    wrapper: "py-8 px-4",
    icon: "h-8 w-8",
    iconBox: "h-12 w-12 rounded-xl mb-3",
    title: "text-sm font-semibold",
    description: "text-xs mt-1",
    actions: "mt-4 gap-2",
  },
  md: {
    wrapper: "py-12 px-6",
    icon: "h-10 w-10",
    iconBox: "h-16 w-16 rounded-2xl mb-4",
    title: "text-base font-semibold",
    description: "text-sm mt-1.5",
    actions: "mt-5 gap-2.5",
  },
  lg: {
    wrapper: "py-16 px-8",
    icon: "h-12 w-12",
    iconBox: "h-20 w-20 rounded-2xl mb-5",
    title: "text-lg font-semibold",
    description: "text-sm mt-2",
    actions: "mt-6 gap-3",
  },
} as const;

// ─── CTA button ───────────────────────────────────────────────────────────────

function CTAButton({ label, href, ...btnProps }: EmptyStateCTAProps) {
  if (href) {
    return (
      <a href={href}>
        <Button {...btnProps}>{label}</Button>
      </a>
    );
  }
  return <Button {...btnProps}>{label}</Button>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  cta,
  secondaryCta,
  className,
  size = "md",
}: EmptyStateProps) {
  const s = SIZE[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        s.wrapper,
        className
      )}
      role="status"
    >
      {/* Icon well */}
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center",
            "bg-zinc-100 dark:bg-white dark:bg-zinc-950/5",
            "text-zinc-400 dark:text-zinc-500",
            s.iconBox
          )}
          aria-hidden="true"
        >
          <span className={s.icon}>{icon}</span>
        </div>
      )}

      {/* Text */}
      <p className={cn("text-zinc-800 dark:text-gray-100", s.title)}>{title}</p>
      {description && (
        <p className={cn("text-zinc-500 dark:text-zinc-400 max-w-xs", s.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(cta || secondaryCta) && (
        <div className={cn("flex flex-wrap items-center justify-center", s.actions)}>
          {cta && (
            <CTAButton
              variant={cta.variant ?? "primary"}
              size={cta.size ?? (size === "sm" ? "sm" : "md")}
              {...cta}
            />
          )}
          {secondaryCta && (
            <CTAButton
              variant={secondaryCta.variant ?? "secondary"}
              size={secondaryCta.size ?? (size === "sm" ? "sm" : "md")}
              {...secondaryCta}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pre-built: no data yet ───────────────────────────────────────────────────

export function EmptyStateNoData({
  title = "No data yet",
  description = "Nothing to show here right now.",
  ...rest
}: Partial<EmptyStateProps>) {
  return <EmptyState title={title} description={description} {...rest} />;
}
