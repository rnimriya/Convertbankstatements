"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { FileText, AlertCircle, CheckCircle2, Loader2, Mail, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setSubmitted(true);
      if (data.resetUrl) setDevResetUrl(data.resetUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-black dark:to-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <Link href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-200 dark:shadow-brand-900/30 transition hover:scale-105">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </Link>
          <span className="mt-3 text-xl font-bold text-slate-800 dark:text-white">BankStatements</span>
          <span className="text-xs text-slate-400 dark:text-gray-500">India&apos;s bank statement converter</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 ring-4 ring-emerald-100 dark:ring-emerald-900/40">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Check your inbox</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                  If <span className="font-semibold text-slate-700 dark:text-gray-200">{email}</span> is registered,
                  you&apos;ll receive a password reset link shortly.
                </p>
              </div>
              {devResetUrl && (
                <div className="w-full rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-left">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    🔧 Dev mode — reset link:
                  </p>
                  <a href={devResetUrl} className="break-all text-xs text-brand-600 dark:text-brand-400 hover:underline font-mono">
                    {devResetUrl}
                  </a>
                </div>
              )}
              <Link href="/login" className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
                  <Mail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h1>
              </div>
              <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-gray-400">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                    Email address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="forgot-submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 dark:text-gray-500">
          Need help?{" "}
          <a href="mailto:support@bankstatements.in" className="underline hover:text-slate-600 dark:hover:text-gray-300">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
