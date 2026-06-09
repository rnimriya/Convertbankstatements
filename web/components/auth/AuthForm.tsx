"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight,
} from "lucide-react";

type Mode = "login" | "signup";
type ErrorCode = "USER_NOT_FOUND" | "WRONG_PASSWORD" | null;

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10";

export function AuthForm({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const rawRedirect = params.get("redirectTo") ?? "";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorCode(null);

    if (mode === "signup") {
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
      if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body = mode === "signup"
        ? { name: name.trim() || undefined, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code ?? null);
        throw new Error(data.error ?? "Something went wrong.");
      }

      if (mode === "signup") {
        setSuccess(true);
        setTimeout(() => { window.location.href = redirectTo; }, 1200);
      } else {
        window.location.href = redirectTo;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="font-display text-xl font-bold text-slate-900">Account created!</p>
          <p className="text-sm text-slate-500">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo + heading */}
          <div className="mb-8 text-center">
            <img src="/logo.svg" alt="Convert Statement" className="mx-auto mb-5 h-12 w-12" />
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
              {mode === "login" ? "Welcome back" : "Start for free"}
            </h1>
            <p className="mt-2 text-[0.95rem] text-slate-500">
              {mode === "login"
                ? "Sign in to your account to continue."
                : "Create your account — 8 pages free, always."}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span>{error}</span>
                    {mode === "login" && errorCode === "USER_NOT_FOUND" && (
                      <p className="mt-1 text-xs">
                        <Link href="/signup" className="font-semibold underline hover:text-red-900">
                          Create a free account →
                        </Link>
                      </p>
                    )}
                    {mode === "login" && errorCode === "WRONG_PASSWORD" && (
                      <p className="mt-1 text-xs">
                        <Link href="/forgot-password" className="font-semibold underline hover:text-red-900">
                          Reset your password →
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Full name{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className={INPUT}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={INPUT}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  {mode === "login" && (
                    <Link href="/forgot-password" className="text-xs text-navy hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
                    className={`${INPUT} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <input
                    id="auth-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={INPUT}
                  />
                </div>
              )}

              <button
                id="auth-submit"
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in…" : "Creating account…"}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign in" : "Create free account"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-600 transition-colors">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Back link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">
              ← Back to home
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
