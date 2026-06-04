"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Mode = "login" | "signup";
type ErrorCode = "USER_NOT_FOUND" | "WRONG_PASSWORD" | null;

export function AuthForm({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/dashboard";

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
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-black dark:to-black px-4 py-12">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black p-10 shadow-lg text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-bold text-slate-800 dark:text-gray-200">Account created!</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-black dark:to-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo + theme toggle */}
        <div className="mb-8 flex flex-col items-center relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <Link href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-200 dark:shadow-brand-900/30">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </Link>
          <span className="mt-3 text-xl font-bold text-slate-800 dark:text-white">BankStatements</span>
          <span className="text-xs text-slate-400 dark:text-gray-500">India&apos;s bank statement converter</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            {mode === "login"
              ? "Sign in to convert your bank statements."
              : "Start free — 8 pages on us, no card required."}
          </p>

          {/* Error banner */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              {mode === "login" && errorCode === "USER_NOT_FOUND" && (
                <p className="mt-2 pl-6 text-xs text-red-600 dark:text-red-400">
                  👉{" "}
                  <Link href="/signup" className="font-semibold underline hover:text-red-800 dark:hover:text-red-300">
                    Create a free account
                  </Link>
                </p>
              )}
              {mode === "login" && errorCode === "WRONG_PASSWORD" && (
                <p className="mt-2 pl-6 text-xs text-red-600 dark:text-red-400">
                  👉{" "}
                  <Link href="/forgot-password" className="font-semibold underline hover:text-red-800 dark:hover:text-red-300">
                    Reset your password
                  </Link>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">
                  Full name <span className="text-slate-400 dark:text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10LITE bg-slate-50 dark:bg-black px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">Email address</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10LITE bg-slate-50 dark:bg-black px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Password</label>
                {mode === "login" && (
                  <Link href="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
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
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10LITE bg-slate-50 dark:bg-black px-4 py-2.5 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-200">Confirm password</label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10LITE bg-slate-50 dark:bg-black px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50"
                />
              </div>
            )}

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading
                ? (mode === "login" ? "Signing in…" : "Creating account…")
                : (mode === "login" ? "Sign in" : "Create account")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}<Link href="/signup" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign up free</Link></>
            ) : (
              <>Already have an account?{" "}<Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link></>
            )}
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 dark:text-gray-500">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-600 dark:hover:text-gray-300">Terms</Link> &amp;{" "}
          <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-gray-300">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
