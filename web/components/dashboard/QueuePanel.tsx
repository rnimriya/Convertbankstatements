"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Layers, CheckCircle2, XCircle, Clock, Loader2, RefreshCw,
  FileText, ChevronDown, Download, AlertTriangle,
} from "lucide-react";
import type { SubTier } from "@/types/billing";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

interface Job {
  id: string;
  fileName: string;
  status: "queued" | "processing" | "done" | "failed";
  pageCount: number | null;
  transactionCount: number | null;
  bankName: string | null;
  exportUrls: Record<string, string>;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  processingMs: number | null;
}

interface Props {
  userEmail: string;
  tier: SubTier;
}

const STATUS_CONFIG: Record<Job["status"], { label: string; icon: React.ReactNode; variant: "success" | "warning" | "brand" | "default" }> = {
  queued:     { label: "Queued",     icon: <Clock size={12} />,      variant: "default" },
  processing: { label: "Processing", icon: <Loader2 size={12} className="animate-spin" />, variant: "brand" },
  done:       { label: "Done",       icon: <CheckCircle2 size={12} />, variant: "success" },
  failed:     { label: "Failed",     icon: <XCircle size={12} />,    variant: "warning" },
};

export function QueuePanel({ userEmail, tier }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchJobs = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) setJobs(await res.json());
    } catch { /* non-fatal */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    fetchJobs();
    // Poll every 5 s while there are active jobs
    const id = setInterval(() => {
      setJobs(prev => {
        const hasActive = prev.some(j => j.status === "queued" || j.status === "processing");
        if (hasActive) fetchJobs(true);
        return prev;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [fetchJobs]);

  const handleDownload = (fileName: string, fmt: string, url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(".pdf", "")}_transactions.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400 dark:text-zinc-500" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <EmptyState
          icon={<Layers className="h-full w-full" />}
          title="No jobs in queue"
          description="Async conversions submitted via Bulk Upload or the API will appear here."
        />
      </div>
    );
  }

  const active = jobs.filter(j => j.status === "queued" || j.status === "processing");
  const done = jobs.filter(j => j.status === "done" || j.status === "failed");

  return (
    <div className="space-y-4">
      {/* Refresh */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {active.length > 0 ? (
            <span className="flex items-center gap-1.5 text-navy dark:text-violet-400 font-medium">
              <Loader2 size={14} className="animate-spin" /> {active.length} job{active.length > 1 ? "s" : ""} in progress…
            </span>
          ) : (
            `${done.length} completed job${done.length !== 1 ? "s" : ""}`
          )}
        </p>
        <button
          onClick={() => fetchJobs(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {jobs.map(job => {
          const cfg = STATUS_CONFIG[job.status];
          const isExpanded = expanded === job.id;
          const hasDownloads = Object.keys(job.exportUrls).length > 0;
          const date = new Date(job.createdAt).toLocaleString("en-IN", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          });

          return (
            <div key={job.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                onClick={() => setExpanded(isExpanded ? null : job.id)}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  {job.status === "processing"
                    ? <Loader2 size={20} className="text-brand-600 dark:text-violet-400 animate-spin" />
                    : <FileText size={20} className="text-brand-600 dark:text-violet-400" />
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">{job.fileName}</p>
                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                    {job.bankName && <span className="font-medium">{job.bankName} · </span>}
                    {job.pageCount != null && `${job.pageCount}p`}
                    {job.transactionCount != null && ` · ${job.transactionCount} txns`}
                    {job.processingMs != null && ` · ${(job.processingMs / 1000).toFixed(1)}s`}
                    {!job.pageCount && date}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={cfg.variant} size="sm">
                    <span className="flex items-center gap-1">
                      {cfg.icon} {cfg.label}
                    </span>
                  </Badge>
                  {(hasDownloads || job.error) && (
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 dark:text-zinc-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-4 space-y-3">
                  {job.error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      {job.error}
                    </div>
                  )}
                  {hasDownloads && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Downloads</p>
                      {Object.entries(job.exportUrls).map(([fmt, url]) => (
                        <button
                          key={fmt}
                          onClick={() => handleDownload(job.fileName, fmt, url)}
                          className="flex w-full items-center justify-between rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(249,115,22,0.3)] transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="opacity-80" />
                            Download {fmt.toUpperCase()}
                          </span>
                          <Download size={14} className="opacity-80" />
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Submitted {date}
                    {job.completedAt && ` · Completed ${new Date(job.completedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
