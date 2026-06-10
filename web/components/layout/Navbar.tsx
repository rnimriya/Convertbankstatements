import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-300 dark:border-white/20 bg-white/80 dark:bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
          <div className="hidden sm:block">
            <span className="font-bold text-slate-800 dark:text-white">Convert Statement</span>
          </div>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">{t("howItWorks")}</Link>
          <Link href="/#features" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">{t("features")}</Link>
          <Link href="/pricing" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">{t("pricing")}</Link>
          <Link href="/#faq" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">{t("faq")}</Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">{t("signIn")}</Link>
          <Link href="/" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-all shadow-[0_2px_12px_rgba(249,115,22,0.4)] hover:shadow-[0_4px_16px_rgba(249,115,22,0.5)] hover:scale-[1.03] active:scale-100">
            Free Trial
          </Link>
        </div>
      </div>
    </nav>
  );
}
