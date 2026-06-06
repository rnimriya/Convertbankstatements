import { cn } from "@/lib/utils";

// ─── Base shimmer ─────────────────────────────────────────────────────────────

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-white/10",
        className
      )}
    />
  );
}

// ─── Text lines ───────────────────────────────────────────────────────────────

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          // Last line is shorter — mimics natural paragraph layout
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

// ─── Avatar / icon circle ─────────────────────────────────────────────────────

export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  return (
    <SkeletonBase className={cn("rounded-full shrink-0", sizeMap[size], className)} />
  );
}

// ─── Generic rectangle (card, image, etc.) ───────────────────────────────────

export function SkeletonRect({ className }: { className?: string }) {
  return <SkeletonBase className={cn("h-full w-full", className)} />;
}

// ─── Pre-built: single list row ───────────────────────────────────────────────

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black px-5 py-4",
        className
      )}
      aria-hidden="true"
    >
      <SkeletonBase className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBase className="h-4 w-3/5" />
        <SkeletonBase className="h-3 w-2/5" />
      </div>
      <SkeletonBase className="h-5 w-14 rounded-full shrink-0" />
    </div>
  );
}

// ─── Pre-built: stat card ─────────────────────────────────────────────────────

export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black p-4 space-y-2",
        className
      )}
      aria-hidden="true"
    >
      <SkeletonBase className="h-6 w-16 mx-auto" />
      <SkeletonBase className="h-3 w-12 mx-auto" />
    </div>
  );
}

// ─── Pre-built: upload card loading ──────────────────────────────────────────

export function SkeletonUploadResult({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)} aria-hidden="true">
      <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black p-5 space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBase className="h-6 w-6 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBase className="h-4 w-40" />
            <SkeletonBase className="h-3 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <div className="space-y-2">
          <SkeletonBase className="h-3 w-20" />
          {[0, 1].map((i) => (
            <SkeletonBase key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-black overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-50 dark:border-white/5">
          <SkeletonBase className="h-4 w-40" />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-50 dark:border-white/5 last:border-0">
            <div className="flex-1 space-y-1.5">
              <SkeletonBase className="h-3 w-4/5" />
              <SkeletonBase className="h-2.5 w-2/5" />
            </div>
            <SkeletonBase className="h-3 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Default export: raw base ─────────────────────────────────────────────────

export { SkeletonBase as Skeleton };
