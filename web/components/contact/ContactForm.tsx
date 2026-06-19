"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError(t("errorMessage"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t("errorMessage"));
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("errorMessage");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-3">
      {/* Contact Info Sidebar */}
      <div className="md:col-span-1 space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-500" />
            {t("emailUs")}
          </h2>
          <a
            href="mailto:support@convertstatement.online"
            className="mt-2 block text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            support@convertstatement.online
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-500" />
            {t("supportHours")}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400 font-medium">
            {t("hours")}
          </p>
        </div>
      </div>

      {/* Main Contact Form Panel */}
      <div className="md:col-span-2">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-8 shadow-sm">
          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {t("success")}
              </h3>
              <p className="mx-auto max-w-sm text-sm text-slate-500 dark:text-gray-400">
                {t("successMessage")}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface px-6 py-2.5 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-100 transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {t("name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface/50 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface/50 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                  {t("subject")}
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t("subjectPlaceholder")}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface/50 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("messagePlaceholder")}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface/50 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-400 px-6 py-3.5 font-bold text-black shadow-glow hover:bg-brand-300 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("submitting")}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{t("submit")}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
