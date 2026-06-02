"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

type Mode = "login" | "signup";

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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

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
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      if (mode === "signup") {
        setSuccess(true);
        // Hard redirect so the browser sends the new cookie with the next request
        setTimeout(() => { window.location.href = redirectTo; }, 1200);
      } else {
        // Hard redirect — ensures the bs_token cookie is present when middleware runs
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
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-4 py-12">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-10 shadow-lg text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-bold text-slate-800">Account created!</p>
          <p className="text-sm text-slate-500">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-200">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </Link>
          <span className="mt-3 text-xl font-bold text-slate-800">BankStatements</span>
          <span className="text-xs text-slate-400">India&apos;s bank statement converter</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "login"
              ? "Sign in to convert your bank statements."
              : "Start free — 8 pages on us, no card required."}
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                {mode === "login" && (
                  <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}<Link href="/signup" className="font-semibold text-brand-600 hover:underline">Sign up free</Link></>
            ) : (
              <>Already have an account?{" "}<Link href="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link></>
            )}
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-600">Terms</Link> &amp;{" "}
          <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
