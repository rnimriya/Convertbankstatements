"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function VerifyEmailContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";
  const error = params.get("error");

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm max-w-md w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-zinc-900 dark:text-white">Email verified!</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Your email has been successfully verified. You now have access to all features.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:opacity-90 transition-opacity"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-red-200 dark:border-red-900 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm max-w-md w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-zinc-900 dark:text-white">
              {error === "missing_token" ? "Invalid link" : "Link expired"}
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {error === "missing_token"
                ? "This verification link is invalid. Please request a new one."
                : "This verification link has expired or already been used. Please request a new one from your dashboard."}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:opacity-90 transition-opacity"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 text-center shadow-sm max-w-md w-full">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <p className="font-display text-xl font-bold text-zinc-900 dark:text-white">Check your inbox</p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            We've sent a verification link to your email address. Click the link to verify your account.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-navy dark:text-violet-400 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
