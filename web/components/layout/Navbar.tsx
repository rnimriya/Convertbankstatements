import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { NavQuickBooksMenu } from "./NavQuickBooksMenu";
import { NavSessionIsland } from "./NavSessionIsland";

export async function Navbar({ dark = false, bg }: { dark?: boolean; bg?: string }) {
  const t = await getTranslations("nav");
  const linkCls = dark
    ? "text-[13.5px] font-medium text-zinc-300 hover:text-white"
    : "text-[13.5px] font-medium text-brand-muted hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

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
        { href: "/tools/invoice-import-checker", label: t("invoiceImportChecker") },
        { href: "/tools/1099-checker", label: t("vendor1099Checker") },
        { href: "/tools/payroll-journal-generator", label: t("payrollJournalGenerator") },
      ],
    },
  ];

  const navCls = bg
    ? "sticky top-0 z-50 w-full border-b border-white/10"
    : dark
      ? "sticky top-0 z-50 w-full bg-[#071106] border-b border-white/10"
      : "sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800";

  return (
    <nav className={navCls} style={bg ? { backgroundColor: bg } : undefined}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className={dark ? "hidden sm:block font-bold text-white text-[15px] tracking-tight" : "hidden sm:block font-bold text-zinc-900 dark:text-white text-[15px] tracking-tight"}>
              Convert Statement
            </span>
          </Link>

          {/* ── Nav links ── */}
          <div className="hidden md:flex items-center gap-8">
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
              dark={dark}
              menuLabel={t("quickbooks")}
              groups={quickBooksGroups}
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

            {/* Mobile: the QuickBooks tools menu (desktop links are hidden below md) */}
            <div className="md:hidden">
              <NavQuickBooksMenu
                dark={dark}
                menuLabel={t("quickbooks")}
                groups={quickBooksGroups}
              />
            </div>

            <NavSessionIsland signInLabel={t("signIn")} dark={dark} />
          </div>

        </div>
      </div>
    </nav>
  );
}
