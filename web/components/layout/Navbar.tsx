import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { NavQuickBooksMenu } from "./NavQuickBooksMenu";
import { NavSessionIsland } from "./NavSessionIsland";

export async function Navbar() {
  const t = await getTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-zinc-200 dark:bg-zinc-950/80 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
            <span className="hidden sm:block font-bold text-zinc-900 dark:text-white text-[15px] tracking-tight">
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
                className="text-[13.5px] font-medium text-brand-muted hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
            <NavQuickBooksMenu
              menuLabel={t("quickbooks")}
              items={[
                { href: "/quickbooks", label: t("quickbooksReconciliation") },
                { href: "/tools/free-qbo-cleanup-checker", label: t("qboDuplicateFinder") },
                { href: "/tools/free-stripe-to-quickbooks", label: t("stripeQboConverter") },
                { href: "/tools/free-paypal-to-quickbooks", label: t("paypalPayoutQboConverter") },
                { href: "/tools/free-receipt-to-quickbooks", label: t("receiptToQbo") },
              ]}
            />
            <Link
              href="/#faq"
              className="text-[13.5px] font-medium text-brand-muted hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"
            >
              {t("faq")}
            </Link>
          </div>

          {/* ── Right side — session resolves client-side so pages stay static ── */}
          <div className="flex items-center gap-3">

            <NavSessionIsland signInLabel={t("signIn")} />
          </div>

        </div>
      </div>
    </nav>
  );
}
