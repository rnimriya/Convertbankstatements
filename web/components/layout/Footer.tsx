import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const SOCIAL = [
  {
    label: "X (Twitter)",
    href: "https://x.com/convertstatement",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.07 2.25h6.893l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/convertstatement",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export async function Footer() {
  const t = await getTranslations("footer");

  const NAV = [
    {
      heading: t("product"),
      links: [
        { label: t("features"),    href: "/#features" },
        { label: t("howItWorks"),  href: "/#how-it-works" },
        { label: t("pricing"),     href: "/pricing" },
        { label: t("blog"),        href: "/blog" },
        { label: t("faq"),         href: "/#faq" },
        { label: t("contact"),     href: "/contact" },
      ],
    },
    {
      heading: t("account"),
      links: [
        { label: t("signIn"),      href: "/login" },
        { label: t("signUpFree"),  href: "/signup" },
        { label: t("dashboard"),   href: "/dashboard" },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("privacyPolicy"),   href: "/privacy" },
        { label: t("termsOfService"),  href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-gray-500">
              {t("tagline")}
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-gray-500">
              {t("payments")}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-gray-500 hover:border-zinc-400 hover:text-zinc-900 dark:hover:border-brand-400/40 dark:hover:text-brand-400 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-10 text-sm sm:gap-14">
            {NAV.map(({ heading, links }) => (
              <div key={heading} className="space-y-2">
                <p className="font-semibold text-zinc-900 dark:text-gray-200">{heading}</p>
                {links.map(({ label, href }) => (
                  <p key={label}>
                    <Link
                      href={href}
                      className="text-zinc-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 dark:border-white/10 pt-6 flex flex-col items-center justify-between gap-2 sm:flex-row text-xs text-zinc-500 dark:text-gray-600">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("prices")}</p>
        </div>
      </div>
    </footer>
  );
}
