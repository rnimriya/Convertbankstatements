"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Eye, EyeOff, Loader2, FileText, AlertCircle, CheckCircle2,
  Zap, Shield, IndianRupee, ArrowRight, ArrowLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Mode = "login" | "signup";
type ErrorCode = "USER_NOT_FOUND" | "WRONG_PASSWORD" | null;

const FEATURES = [
  { Icon: Zap,           text: "All major Indian banks supported" },
  { Icon: Shield,        text: "Files are never stored on our servers" },
  { Icon: CheckCircle2,  text: "CSV, Excel, OFX, QFX & Google Sheets" },
  { Icon: IndianRupee,   text: "Start free — 8 pages, no card needed" },
];

const STATS = [
  { value: "50K+", label: "Docs converted" },
  { value: "30+",  label: "Indian banks" },
  { value: "₹49",  label: "Per document" },
];


const INPUT =
  "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 outline-none transition focus:border-brand-400 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-surface-raised focus:ring-2 focus:ring-brand-400/20";

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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0a0a0a] px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-200 dark:border-brand-800/50 bg-brand-50 dark:bg-brand-900/20 p-12 text-center shadow-glow">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-400 shadow-glow">
            <CheckCircle2 className="h-8 w-8 text-black" />
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-white">Account created!</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      {/* ──────── LEFT PANEL ──────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 bg-[#070d1a] overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_5%_65%,rgba(96,165,250,0.13)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_90%_10%,rgba(96,165,250,0.07)_0%,transparent_60%)] pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #7dd3fc 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-400 shadow-glow-sm transition group-hover:shadow-glow">
              <FileText className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">BankStatements</span>
            <span className="rounded-full bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-400">
              India
            </span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10 max-w-[420px]">
          <h2 className="text-[2rem] font-extrabold text-white leading-tight">
            Convert bank PDFs to<br />
            <span className="text-brand-400">clean spreadsheets</span> — instantly
          </h2>
          <p className="mt-3 text-sm text-blue-200/55 leading-relaxed">
            India&apos;s most accurate bank statement parser.
            Trusted by CAs, bookkeepers and finance teams.
          </p>

          {/* Features */}
          <ul className="mt-8 space-y-3.5">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-400/10 border border-brand-400/20">
                  <Icon className="h-3.5 w-3.5 text-brand-400" />
                </span>
                <span className="text-sm text-blue-100/70">{text}</span>
              </li>
            ))}
          </ul>

        </div>

        {/* Stats + testimonial */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-7 mb-7">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-brand-400">{value}</p>
                <p className="mt-0.5 text-xs text-blue-200/35">{label}</p>
              </div>
            ))}
          </div>
          <blockquote className="border-l-2 border-brand-400/40 pl-4">
            <p className="text-sm text-blue-100/45 italic">
              &ldquo;Saves me 3–4 hours every month. Best tool for CA work.&rdquo;
            </p>
            <footer className="mt-1.5 text-xs text-blue-100/25">
              — Priya Mehta, Chartered Accountant, Mumbai
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ──────── RIGHT PANEL ──────── */}
      <div className="flex flex-1 flex-col bg-white dark:bg-[#0a0a0a]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-400 dark:text-gray-500">
              {mode === "login" ? "No account?" : "Have an account?"}
            </span>
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              className="rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-6 lg:px-16">
          <div className="w-full max-w-sm">

            {/* Mobile-only logo */}
            <div className="mb-8 flex flex-col items-center lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-400 shadow-glow-sm">
                <FileText className="h-5 w-5 text-black" />
              </div>
              <span className="mt-2.5 text-base font-bold text-slate-800 dark:text-white">BankStatements India</span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {mode === "login" ? "Welcome back" : "Start for free"}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-gray-400">
                {mode === "login"
                  ? "Sign in to your account to continue."
                  : "Create your account — 8 pages free, always."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <span>{error}</span>
                    {mode === "login" && errorCode === "USER_NOT_FOUND" && (
                      <p className="mt-1 text-xs">
                        <Link href="/signup" className="font-semibold underline hover:text-red-800 dark:hover:text-red-300">
                          Create a free account →
                        </Link>
                      </p>
                    )}
                    {mode === "login" && errorCode === "WRONG_PASSWORD" && (
                      <p className="mt-1 text-xs">
                        <Link href="/forgot-password" className="font-semibold underline hover:text-red-800 dark:hover:text-red-300">
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Full name{" "}
                    <span className="font-normal text-slate-400 dark:text-gray-500">(optional)</span>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
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
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
                  {mode === "login" && (
                    <Link href="/forgot-password" className="text-xs text-brand-500 dark:text-brand-400 hover:underline">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
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
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-400 py-3 text-sm font-bold text-black shadow-glow-sm hover:bg-brand-300 hover:shadow-glow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />{mode === "login" ? "Signing in…" : "Creating account…"}</>
                ) : (
                  <>{mode === "login" ? "Sign in" : "Create free account"}<ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-gray-500">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
