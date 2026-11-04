import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { MobileMenu } from "./MobileMenu";
import { NavQuickBooksMenu } from "./NavQuickBooksMenu";
import { NavSessionIsland } from "./NavSessionIsland";

export async function Navbar({ dark = false, bg }: { dark?: boolean; bg?: string }) {
  const t = await getTranslations("nav");
  const linkCls = "text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900";

  const quickBooksGroups = [
    {
      label: t("groupConverters"),
      items: [
        { href: "/quickbooks", label: t("quickbooksReconciliation") },
        { href: "/tools/csv-to-qbo", label: t("csvToQbo") },
        { href: "/tools/qbo-to-csv", label: t("qboToCsv") },
        { href: "/tools/csv-to-iif", label: t("csvToIif") },
        { href: "/tools/ofx-to-qbo", label: t("ofxToQboFixer") },
        { href: "/tools/free-receipt-to-quickbooks", label: t("receiptToQbo") },
        { href: "/tools/bulk-import-quickbooks", label: t("bulkImporter") },
        { href: "/tools/bulk-export-quickbooks", label: t("bulkExporter") },
        { href: "/tools/iif-to-excel", label: t("iifToExcel") },
      ],
    },
    {
      label: t("groupPayouts"),
      items: [
        { href: "/tools/free-stripe-to-quickbooks", label: t("stripeQboConverter") },
        { href: "/tools/free-paypal-to-quickbooks", label: t("paypalPayoutQboConverter") },
        { href: "/tools/amazon-to-quickbooks", label: t("amazonToQuickbooks") },
        { href: "/tools/shopify-to-quickbooks", label: t("shopifyToQuickbooks") },
        { href: "/tools/square-to-quickbooks", label: t("squareToQuickbooks") },
        { href: "/tools/etsy-to-quickbooks", label: t("etsyToQuickbooks") },
      ],
    },
    {
      label: t("groupCheckersFixers"),
      items: [
        { href: "/tools/free-qbo-cleanup-checker", label: t("qboDuplicateFinder") },
        { href: "/tools/qbo-checker", label: t("qboChecker") },
        { href: "/tools/qbo-import-errors", label: t("qboImportErrors") },
        { href: "/tools/reconciliation-finder", label: t("reconciliationFinder") },
        { href: "/tools/qbo-splitter", label: t("qboSplitter") },
        { href: "/tools/bulk-deleter-quickbooks", label: t("bulkDeleter") },
        { href: "/tools/qbo-file-editor", label: t("qboFileEditor") },
        { href: "/tools/qbo-merger", label: t("qboMerger") },
        { href: "/tools/invoice-import-checker", label: t("invoiceImportChecker") },
        { href: "/tools/1099-checker", label: t("vendor1099Checker") },
        { href: "/tools/payroll-journal-generator", label: t("payrollJournalGenerator") },
      ],
    },
  ];

  const quickBooksFeatured = {
    kicker: t("bulkSuiteKicker"),
    title: t("bulkSuiteTitle"),
    description: t("bulkSuiteDesc"),
    links: [
      { href: "/tools/bulk-import-quickbooks", label: t("bulkImporter") },
      { href: "/tools/bulk-export-quickbooks", label: t("bulkExporter") },
      { href: "/tools/bulk-deleter-quickbooks", label: t("bulkDeleter") },
    ],
    ctaLabel: t("browseAllTools"),
    ctaHref: "/tools",
  };

  return (
    <div className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-1 -mb-[72px]">
      <nav className="relative mx-auto max-w-6xl rounded-full bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-[0_10px_36px_rgba(11,31,22,0.10)]">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">

          {/* ── Left: mobile hamburger (opens the left drawer) + logo ── */}
          <div className="flex items-center gap-1.5 shrink-0">
            <MobileMenu
              mainLinks={[
                { href: "/#how-it-works", label: t("howItWorks") },
                { href: "/#features", label: t("features") },
                { href: "/pricing", label: t("pricing") },
                { href: "/#faq", label: t("faq") },
              ]}
              groups={quickBooksGroups}
              featured={quickBooksFeatured}
              quickbooksLabel={t("quickbooks")}
              allToolsLabel={t("allTools")}
              menuLabel={t("menu")}
              closeLabel={t("close")}
            />
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
              <span className="hidden sm:block font-display font-bold text-zinc-900 text-[15px] tracking-tight">
                Convert Statement
              </span>
            </Link>
          </div>

          {/* ── Nav links ── */}
          {/* self-stretch: the row spans the pill's full height so the
              QuickBooks hover zone reaches the pill's bottom edge with no
              dead strip before the dropdown panel. */}
          <div className="hidden md:flex items-center gap-8 self-stretch">
            {[
              { href: "/#how-it-works", label: t("howItWorks") },
              { href: "/#features",     label: t("features") },
              { href: "/pricing",       label: t("pricing") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={linkCls}
              >
                {label}
              </Link>
            ))}
            <NavQuickBooksMenu
              dark={false}
              menuLabel={t("quickbooks")}
              groups={quickBooksGroups}
              featured={quickBooksFeatured}
            />
            <Link
              href="/#faq"
              className={linkCls}
            >
              {t("faq")}
            </Link>
          </div>

          {/* ── Right side — session resolves client-side so pages stay static ── */}
          <div className="flex items-center gap-3">
            <NavSessionIsland signInLabel={t("signIn")} dark={false} />
          </div>

        </div>
      </nav>
    </div>
  );
}
