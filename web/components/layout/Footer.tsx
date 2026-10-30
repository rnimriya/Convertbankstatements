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

export async function Footer({ variant }: { variant?: "agri" | "light" }) {
  const t = await getTranslations("footer");
  const agri = variant !== "light";

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
      heading: t("quickbooks"),
      links: [
        { label: t("quickbooksReconciliation"), href: "/quickbooks" },
        { label: t("qboDuplicateFinder"),       href: "/tools/free-qbo-cleanup-checker" },
        { label: t("stripeQboConverter"),       href: "/tools/free-stripe-to-quickbooks" },
        { label: t("paypalPayoutQboConverter"),  href: "/tools/free-paypal-to-quickbooks" },
        { label: t("receiptToQbo"),             href: "/tools/free-receipt-to-quickbooks" },
        { label: t("csvToQbo"),                 href: "/tools/csv-to-qbo" },
        { label: t("amazonToQuickbooks"),       href: "/tools/amazon-to-quickbooks" },
        { label: t("shopifyToQuickbooks"),      href: "/tools/shopify-to-quickbooks" },
        { label: t("reconciliationFinder"),     href: "/tools/reconciliation-finder" },
        { label: t("qboImportErrors"),          href: "/tools/qbo-import-errors" },
        { label: t("qboToCsv"),                 href: "/tools/qbo-to-csv" },
        { label: t("ofxToQboFixer"),            href: "/tools/ofx-to-qbo" },
        { label: t("squareToQuickbooks"),       href: "/tools/square-to-quickbooks" },
        { label: t("csvToIif"),                 href: "/tools/csv-to-iif" },
        { label: t("qboSplitter"),              href: "/tools/qbo-splitter" },
        { label: t("etsyToQuickbooks"),         href: "/tools/etsy-to-quickbooks" },
        { label: t("invoiceImportChecker"),     href: "/tools/invoice-import-checker" },
        { label: t("vendor1099Checker"),        href: "/tools/1099-checker" },
        { label: t("payrollJournalGenerator"),  href: "/tools/payroll-journal-generator" },
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

  if (!agri) {
    return (
      <footer className="bg-pine-800">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <p className="text-xs leading-relaxed text-zinc-300">
                {t("tagline")}
              </p>
              <p className="mt-2 text-xs text-zinc-300">
                support@convertstatement.online
              </p>
              <p className="mt-2 text-xs text-zinc-300">
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-zinc-300 hover:border-[#64CB48] hover:text-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-10 text-sm sm:gap-14">
              {NAV.map(({ heading, links }) => (
                <div key={heading} className="space-y-2">
                  <p className="font-semibold text-white">{heading}</p>
                  {links.map(({ label, href }) => (
                    <p key={label}>
                      <Link
                        href={href}
                        className="text-zinc-300 hover:text-white"
                      >
                        {label}
                      </Link>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-pine-700 pt-6 flex flex-col items-center justify-between gap-2 sm:flex-row text-xs text-zinc-400">
            <p>{t("copyright", { year: new Date().getFullYear() })}</p>
            <p>{t("prices")}</p>
          </div>
        </div>
      </footer>
    );
  }

  const [productCol, qbCol, accountCol, legalCol] = NAV;

  return (
    <footer className="bg-[#071106] text-[#E0E6D6]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-b border-[#E0E6D6]/15 pb-[54px] pt-[72px]">
          <p className="agri-mono text-[11px] uppercase tracking-[0.14em] text-[#64CB48]">
            {t("kicker")}
          </p>
          <h2 className="mb-[26px] mt-[18px] max-w-[720px] text-[clamp(34px,4.6vw,54px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            {t("headlineTop")}
            <br />
            {t("headlineBottom")}{" "}
            <span className="agri-serif text-[#BACEBA]">{t("headlineAccent")}</span>
          </h2>
          <Link
            href="/signup"
            className="inline-block rounded-full bg-[#64CB48] px-[26px] py-[14px] text-[15px] font-bold text-[#071106]"
          >
            {t("ctaStart")}
          </Link>
          <span className="mt-3 block text-[13px] text-[#9FA99B] sm:ml-4 sm:mt-0 sm:inline-block">
            {t("ctaNote")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-9 py-[52px] lg:grid-cols-[1.4fr_1fr_1.5fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <p className="max-w-[270px] text-[13px] leading-[1.7] text-[#B9C2B2]">
              {t("tagline")}
            </p>
            <a
              href="mailto:support@convertstatement.online"
              className="mt-3 block break-all text-[13px] text-[#E0E6D6]"
            >
              support@convertstatement.online
            </a>
            <div className="mt-[18px] flex items-center gap-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[#E0E6D6]/25 text-[#E0E6D6] hover:border-[#64CB48] hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="agri-mono mb-4 text-[11px] uppercase tracking-[0.14em] text-[#64CB48]">
              {productCol.heading}
            </h3>
            <ul className="space-y-[10px]">
              {productCol.links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[13.5px] text-[#CBD4C2] hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="agri-mono mb-4 text-[11px] uppercase tracking-[0.14em] text-[#64CB48]">
              {qbCol.heading}
            </h3>
            <ul className="space-y-[10px]">
              {qbCol.links.slice(0, 8).map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[13.5px] text-[#CBD4C2] hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quickbooks" className="text-[13.5px] font-bold text-[#64CB48]">
                  {t("allQuickbooksTools")} →
                </Link>
              </li>
            </ul>
          </div>

          {[accountCol, legalCol].map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="agri-mono mb-4 text-[11px] uppercase tracking-[0.14em] text-[#64CB48]">
                {heading}
              </h3>
              <ul className="space-y-[10px]">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13.5px] text-[#CBD4C2] hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#E0E6D6]/15 pb-[30px] pt-[22px] text-xs text-[#8B968A] sm:flex-row">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("prices")}</p>
          <p>{t("payments")}</p>
        </div>
      </div>
    </footer>
  );
}
