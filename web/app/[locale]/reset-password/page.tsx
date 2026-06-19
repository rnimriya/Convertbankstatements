"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText, AlertCircle, CheckCircle2, Loader2,
  Eye, EyeOff, ShieldCheck, ArrowLeft, XCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strength = [hasMinLength, hasUppercase, hasNumber].filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"][strength];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!hasMinLength) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 ring-4 ring-red-100 dark:ring-red-900/40">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Invalid reset link</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            This password reset link is missing a token. Please request a new one.
          </p>
        </div>
        <Link href="/forgot-password" className="mt-2 flex items-center gap-2 rounded-xl bg-brand-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-brand-300 transition-colors">
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 ring-4 ring-emerald-100 dark:ring-emerald-900/40">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Password updated!</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Your password has been reset successfully. Redirecting you to sign in…
          </p>
        </div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-950">
          <div className="h-full animate-[progress_2.5s_linear_forwards] rounded-full bg-brand-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
          <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Reset password</h1>
      </div>
      <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Choose a strong new password for your account.
      </p>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">New password</label>
          <div className="relative">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 pr-11 text-sm text-zinc-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:bg-zinc-950 dark:focus:bg-gray-800 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= i ? strengthColor : "bg-zinc-100 dark:bg-zinc-950"}`} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>
                  Strength:{" "}
                  <span className={strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : "text-emerald-600"}>
                    {strengthLabel}
                  </span>
                </span>
                <span className="space-x-2">
                  <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400" : ""}>8+ chars</span>
                  <span className={hasUppercase ? "text-emerald-600 dark:text-emerald-400" : ""}>A–Z</span>
                  <span className={hasNumber ? "text-emerald-600 dark:text-emerald-400" : ""}>0–9</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Confirm new password</label>
          <input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className={`w-full rounded-xl border bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:bg-white dark:bg-zinc-950 dark:focus:bg-gray-800 focus:ring-2 ${
              confirmPassword && confirmPassword !== password
                ? "border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                : "border-zinc-200 dark:border-zinc-800 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-900/50"
            }`}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          type="submit"
          id="reset-submit"
          disabled={loading || (!!confirmPassword && confirmPassword !== password)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-400 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-brand-300 transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Updating…" : "Set new password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/forgot-password" className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-violet-400 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Request a new reset link
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-black dark:to-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <Link href="/">
            <img src="/logo.svg" alt="Convert Statement" className="h-12 w-12 transition hover:scale-105" />
          </Link>
          <span className="mt-3 text-xl font-bold text-zinc-800 dark:text-white">Convert Statement</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">India&apos;s bank statement converter</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl dark:shadow-none shadow-slate-200/50 dark:shadow-black/50">
          <Suspense fallback={<div className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Need help?{" "}
          <a href="mailto:support@convertstatement.online" className="underline hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
