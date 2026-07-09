import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Link } from "@/i18n/navigation";

import { NavUserMenu } from "./NavUserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { verifyJWT } from "@/lib/auth/jwt";

export async function Navbar() {
  const t = await getTranslations("nav");

  const cookieStore = await cookies();
  const token = cookieStore.get("bs_token")?.value ?? "";
  const user = token ? await verifyJWT(token) : null;

  const displayName = user ? (user.name ?? user.email.split("@")[0]) : null;
  const initial = displayName?.[0]?.toUpperCase() ?? "";

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
              { href: "/#faq",          label: t("faq") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13.5px] font-medium text-brand-muted hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />


            {user && displayName ? (
              <>
                <NavUserMenu displayName={displayName} email={user.email} initial={initial} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13.5px] font-semibold text-white bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors border-0"
                >
                  Free Trial
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
