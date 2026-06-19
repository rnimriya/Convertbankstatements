"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  ta: "🇮🇳",
  te: "🇮🇳",
  kn: "🇮🇳",
  ml: "🇮🇳",
  mr: "🇮🇳",
  gu: "🇮🇳",
  pa: "🇮🇳",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("languages");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        aria-label={t("label")}
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{t(locale)}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-background shadow-lg z-50 py-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${
                loc === locale ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              <span>{LOCALE_FLAGS[loc]}</span>
              <span>{t(loc)}</span>
              {loc === locale && (
                <svg className="ml-auto h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
