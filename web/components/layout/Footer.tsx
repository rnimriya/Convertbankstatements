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

/**
 * Site-wide footer — "Tool Index" design (owner-approved 2026-11-04):
 * compact top area (brand, Product / Account / Legal columns, CTA block),
 * a full index of every tool below the divider, then the legal bottom bar.
 * One design everywhere; the `variant` prop is kept so existing callers
 * (e.g. the dashboard shell) keep working unchanged.
 */
export async function Footer({ variant: _variant }: { variant?: "agri" | "light" }) {
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
      heading: t("quickbooks"),
      links: [
        { label: t("quickbooksReconciliation"), href: "/quickbooks" },
        { label: t("allTools"),                 href: "/tools" },
        { label: t("qboDuplicateFinder"),       href: "/tools/free-qbo-cleanup-checker" },
        { label: t("stripeQboConverter"),       href: "/tools/free-stripe-to-quickbooks" },
        { label: t("paypalPayoutQboConverter"),  href: "/tools/free-paypal-to-quickbooks" },
        { label: t("receiptToQbo"),             href: "/tools/free-receipt-to-quickbooks" },
        { label: t("csvToQbo"),                 href: "/tools/csv-to-qbo" },
        { label: t("amazonToQuickbooks"),       href: "/tools/amazon-to-quickbooks" },
        { label: t("shopifyToQuickbooks"),      href: "/tools/shopify-to-quickbooks" },
        { label: t("reconciliationFinder"),     href: "/tools/reconciliation-finder" },
        { label: t("qboImportErrors"),          href: "/tools/qbo-import-errors" },
        { label: t("qboChecker"),               href: "/tools/qbo-checker" },
        { label: t("qboToCsv"),                 href: "/tools/qbo-to-csv" },
        { label: t("ofxToQboFixer"),            href: "/tools/ofx-to-qbo" },
        { label: t("squareToQuickbooks"),       href: "/tools/square-to-quickbooks" },
        { label: t("csvToIif"),                 href: "/tools/csv-to-iif" },
        { label: t("qboSplitter"),              href: "/tools/qbo-splitter" },
        { label: t("etsyToQuickbooks"),         href: "/tools/etsy-to-quickbooks" },
        { label: t("invoiceImportChecker"),     href: "/tools/invoice-import-checker" },
        { label: t("vendor1099Checker"),        href: "/tools/1099-checker" },
        { label: t("payrollJournalGenerator"),  href: "/tools/payroll-journal-generator" },
        { label: t("bulkImporter"),             href: "/tools/bulk-import-quickbooks" },
        { label: t("bulkExporter"),             href: "/tools/bulk-export-quickbooks" },
        { label: t("bulkDeleter"),              href: "/tools/bulk-deleter-quickbooks" },
        { label: t("qboFileEditor"),            href: "/tools/qbo-file-editor" },
        { label: t("qboMerger"),                href: "/tools/qbo-merger" },
        { label: t("iifToExcel"),               href: "/tools/iif-to-excel" },
      ],
    },
    {
      heading: t("formatConverters"),
      links: [
        { label: t("csvToOfx"),   href: "/tools/csv-to-ofx" },
        { label: t("csvToQfx"),   href: "/tools/csv-to-qfx" },
        { label: t("csvToQif"),   href: "/tools/csv-to-qif" },
        { label: t("iifToCsv"),   href: "/tools/iif-to-csv" },
        { label: t("ofxToCsv"),   href: "/tools/ofx-to-csv" },
        { label: t("ofxToQfx"),   href: "/tools/ofx-to-qfx" },
        { label: t("ofxToPdf"),   href: "/tools/ofx-to-pdf" },
        { label: t("qboToIif"),   href: "/tools/qbo-to-iif" },
        { label: t("qboToPdf"),   href: "/tools/qbo-to-pdf" },
        { label: t("qfxToCsv"),   href: "/tools/qfx-to-csv" },
        { label: t("qfxToExcel"), href: "/tools/qfx-to-excel" },
        { label: t("qfxToOfx"),   href: "/tools/qfx-to-ofx" },
        { label: t("qfxToPdf"),   href: "/tools/qfx-to-pdf" },
        { label: t("qfxToQbo"),   href: "/tools/qfx-to-qbo" },
        { label: t("qfxToQif"),   href: "/tools/qfx-to-qif" },
        { label: t("qifToCsv"),   href: "/tools/qif-to-csv" },
        { label: t("qifToExcel"), href: "/tools/qif-to-excel" },
        { label: t("qifToPdf"),   href: "/tools/qif-to-pdf" },
        { label: t("qifToQbo"),   href: "/tools/qif-to-qbo" },
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

  const [productCol, qbCol, formatCol, accountCol, legalCol] = NAV;

  // The tool index: every QuickBooks tool link followed by every format
  // converter — the same arrays the columns above are built from, so the
  // index can never drift from them.
  const indexLinks = [...qbCol.links, ...formatCol.links];

  const headingCls =
    "agri-mono mb-4 min-h-[30px] text-[11px] font-bold uppercase tracking-[0.14em] text-[#2CA01C]";
  const linkCls = "text-[13.5px] text-[#CBD4C2] hover:text-white";

  return (
    <footer className="bg-[#0B1F16] text-[#E3F2DF]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Compact top area: brand, main columns, CTA */}
        <div className="grid grid-cols-2 gap-x-[38px] gap-y-10 pb-[36px] pt-[46px] lg:grid-cols-[1.35fr_0.62fr_0.62fr_0.62fr_0.95fr]">
          <div className="col-span-2 lg:col-span-1">
            <p className="text-[19px] font-extrabold tracking-[-0.015em] text-white">
              Convert<span className="text-[#2CA01C]">Statement</span>
            </p>
            <p className="mt-[14px] max-w-[340px] text-[13px] leading-[1.7] text-[#B9C2B2]">
              {t("tagline")}
            </p>
            <a
              href="mailto:support@convertstatement.online"
              className="mt-3 block text-[13px] text-[#E3F2DF]"
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
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[#E3F2DF]/30 text-[#E3F2DF] hover:border-[#2CA01C] hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {[productCol, accountCol, legalCol].map(({ heading, links }) => (
            <div key={heading}>
              <h3 className={headingCls}>{heading}</h3>
              <ul className="space-y-[9px]">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={linkCls}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 self-start lg:col-span-1">
            <Link
              href="/signup"
              className="inline-block rounded-full bg-[#2CA01C] px-6 py-3 text-[14.5px] font-bold text-white"
            >
              {t("ctaStart")}
            </Link>
            <p className="mt-[10px] text-[12.5px] leading-[1.6] text-[#9FA99B]">
              {t("ctaNote")}
            </p>
          </div>
        </div>

        {/* All-tools index */}
        <div className="border-t border-[#E3F2DF]/[0.14] pb-[38px] pt-[30px]">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
            <p className="agri-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#2CA01C]">
              {t("allToolsIndex")}
            </p>
            <p className="text-[12.5px] text-[#8B968A]">{t("allToolsNote")}</p>
          </div>
          <ul className="columns-2 [column-gap:38px] md:columns-3 lg:columns-5">
            {indexLinks.map(({ label, href }, i) => (
              <li key={href} className="mb-2 break-inside-avoid">
                <Link
                  href={href}
                  className={
                    i < 2
                      ? "text-[13px] font-bold text-white"
                      : "text-[13px] text-[#CBD4C2] hover:text-white"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between gap-2 border-t border-[#E3F2DF]/[0.14] pb-[26px] pt-[20px] text-[12px] text-[#8B968A] sm:flex-row">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("prices")}</p>
          <p>{t("payments")}</p>
        </div>
      </div>
    </footer>
  );
}
