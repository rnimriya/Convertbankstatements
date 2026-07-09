"use client";

import { useState, FormEvent } from"react";
import { useSearchParams } from"next/navigation";
import { useTranslations } from"next-intl";
import { Link } from"@/i18n/navigation";
import {
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight,
} from"lucide-react";

type Mode ="login" |"signup";
type ErrorCode ="USER_NOT_FOUND" |"WRONG_PASSWORD" | null;

const INPUT ="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition focus:border-navy focus:bg-white dark:bg-zinc-950 dark:focus:bg-gray-800 focus:ring-2 focus:ring-navy/10";

export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("auth");
  const params = useSearchParams();
  const rawRedirect = params.get("redirectTo") ??"";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      :"/dashboard";
  const referralCode = params.get("ref") ?? undefined;

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

    if (mode ==="signup") {
      if (password !== confirmPassword) { setError(t("passwordMismatch")); return; }
      if (password.length < 8) { setError(t("passwordTooShort")); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode ==="signup" ?"/api/auth/signup" :"/api/auth/login";
      const body = mode ==="signup"
        ? { name: name.trim() || undefined, email, password, referralCode }
        : { email, password };

      const res = await fetch(endpoint, {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code ?? null);
        throw new Error(data.error ??"Something went wrong.");
      }

      if (mode ==="signup") {
        setSuccess(true);
        setTimeout(() => { window.location.href = redirectTo; }, 1200);
      } else {
        window.location.href = redirectTo;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message :"Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-zinc-900 p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="font-display text-xl font-bold text-zinc-900 dark:text-white">{t("accountCreated")}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("redirecting")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img src="/logo.svg" alt="Convert Statement" className="mx-auto mb-5 h-12 w-12" />
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {mode ==="login" ? t("loginTitle") : t("signupTitle")}
            </h1>
            <p className="mt-2 text-[0.95rem] text-zinc-500 dark:text-zinc-400">
              {mode ==="login" ? t("loginSubtitle") : t("signupSubtitle")}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
            {mode ==="signup" && referralCode && (
              <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p className="font-semibold">{t("referralTitle")}</p>
                <p className="text-xs mt-0.5 text-emerald-600">{t("referralDesc")}</p>
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
                  <div>
                    <span>{error}</span>
                    {mode ==="login" && errorCode ==="USER_NOT_FOUND" && (
                      <p className="mt-1 text-xs">
                        <Link href="/signup" className="font-semibold underline hover:text-red-900">
                          {t("createAccountLink")}
                        </Link>
                      </p>
                    )}
                    {mode ==="login" && errorCode ==="WRONG_PASSWORD" && (
                      <p className="mt-1 text-xs">
                        <Link href="/forgot-password" className="font-semibold underline hover:text-red-900">
                          {t("resetPasswordLink")}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode ==="signup" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {t("nameLabel")}{""}
                    <span className="font-normal text-zinc-400 dark:text-zinc-500">{t("nameOptional")}</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className={INPUT}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {t("emailLabel")}
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className={INPUT}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{t("passwordLabel")}</label>
                  {mode ==="login" && (
                    <Link href="/forgot-password" className="text-xs text-navy dark:text-violet-400 hover:underline">
                      {t("forgotPassword")}
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ?"text" :"password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode ==="signup" ? t("passwordMinChars") : t("passwordPlaceholder")}
                    className={`${INPUT} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> : <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" />}
                  </button>
                </div>
              </div>

              {mode ==="signup" && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {t("confirmLabel")}
                  </label>
                  <input
                    id="auth-confirm-password"
                    type={showPassword ?"text" :"password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPlaceholder")}
                    className={INPUT}
                  />
                </div>
              )}

              <button
                id="auth-submit"
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white py-3 text-sm font-bold text-white dark:text-black shadow-lg shadow-navy/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500 dark:text-purple-400" />
                    {mode ==="login" ? t("loginLoading") : t("signupLoading")}
                  </>
                ) : (
                  <>
                    {mode ==="login" ? t("loginButton") : t("signupButton")}
                    <ArrowRight className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {t.rich("termsText", {
                terms: (chunks) => (
                  <Link href="/terms" className="underline hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 transition-colors">
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link href="/privacy" className="underline hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 transition-colors">
                    {chunks}
                  </Link>
                ),
              })}
            </p>

            <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {mode ==="login" ? t("switchToSignup") : t("switchToLogin")}{""}
              <Link
                href={mode ==="login" ?"/signup" :"/login"}
                className="font-semibold text-navy dark:text-violet-400 hover:underline"
              >
                {mode ==="login" ? t("signupLink") : t("loginLink")}
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            <Link href="/" className="hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-gray-300 transition-colors">
              {t("backToHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
