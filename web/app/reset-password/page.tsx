"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  XCircle,
} from "lucide-react";

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

  // Password strength helpers
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strength = [hasMinLength, hasUppercase, hasNumber].filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"][strength];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!hasMinLength) {
      setError("Password must be at least 8 characters.");
      return;
    }

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

  // Missing token guard
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Invalid reset link</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This password reset link is missing a token. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="mt-2 flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Password updated!</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Your password has been reset successfully. Redirecting you to sign in…
          </p>
        </div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full animate-[progress_2.5s_linear_forwards] rounded-full bg-brand-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
          <ShieldCheck className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        </div>
      </div>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Choose a strong new password for your account.
      </p>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
          <div className="relative">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= i ? strengthColor : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  Strength:{" "}
                  <span
                    className={
                      strength === 1
                        ? "text-red-500"
                        : strength === 2
                        ? "text-amber-500"
                        : "text-emerald-600"
                    }
                  >
                    {strengthLabel}
                  </span>
                </span>
                <span className="space-x-2">
                  <span className={hasMinLength ? "text-emerald-600" : ""}>8+ chars</span>
                  <span className={hasUppercase ? "text-emerald-600" : ""}>A–Z</span>
                  <span className={hasNumber ? "text-emerald-600" : ""}>0–9</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Confirm new password
          </label>
          <input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 ${
              confirmPassword && confirmPassword !== password
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
            }`}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          type="submit"
          id="reset-submit"
          disabled={loading || (!!confirmPassword && confirmPassword !== password)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Updating…" : "Set new password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          href="/forgot-password"
          className="flex items-center justify-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Request a new reset link
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-brand-50/30 to-blue-50/20 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-200 transition hover:scale-105">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </Link>
          <span className="mt-3 text-xl font-bold text-slate-800">BankStatements</span>
          <span className="text-xs text-slate-400">India&apos;s bank statement converter</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <Suspense fallback={<div className="py-8 text-center text-sm text-slate-400">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Need help?{" "}
          <a href="mailto:support@bankstatements.in" className="underline hover:text-slate-600">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
