import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { QuickBooksMenuGroup } from "./NavQuickBooksMenu";
import { NavSessionIsland } from "./NavSessionIsland";
import { IndiaMobileNav } from "./IndiaMobileNav";

/* convertstatement.in navigation — FINAL (owner picked Option 2,
   2026-11-27 22:19 IST): clean single white bar — logo left, links
   centre with a FULL-WIDTH Tools mega menu (owner order 2026-11-27
   22:33 IST: "mega menu same full page banao or width 100% rakho"),
   auth + green CTA right, mobile left slide-in drawer. No top strip.
   IN-only — .online keeps the existing pill Navbar untouched. Green
   is #047857. Tools data arrives QB-filtered from Navbar.tsx, so no
   QuickBooks links appear. */

type T = Awaited<ReturnType<typeof getTranslations<"nav">>>;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <img src="/logo.svg" alt="Convert Statement" className="h-9 w-9 md:h-10 md:w-10" />
      <span className="hidden sm:block font-display font-extrabold text-[17px] tracking-tight text-zinc-900">
        Convert Statement
      </span>
    </Link>
  );
}

function ConvertPill({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/#upload"
      className={`items-center gap-2.5 whitespace-nowrap rounded-full border border-[#065F46] bg-[#047857] py-1.5 pl-1.5 pr-2 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(4,120,87,.45)] ${className}`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-900 text-lg font-bold leading-none text-white">
        +
      </span>
      <span>Convert a statement</span>
      <span className="rounded-full bg-[#D1FAE5] px-2.5 py-[3px] text-[10.5px] font-extrabold tracking-wide text-[#047857]">
        FREE
      </span>
    </Link>
  );
}

/* Tools dropdown panel content: tool group columns only (owner order
   2026-11-27: "last wala section hta ke dikaho" — the right-hand CTA
   column was removed; groups spread across the full-width panel). */
function ToolsPanel({ groups }: { groups: QuickBooksMenuGroup[] }) {
  return (
    <span
      className="grid"
      style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0,1fr))` }}
    >
      {groups.map((group, gi) => (
        <span
          key={group.label}
          className={`block px-6 py-7 ${gi < groups.length - 1 ? "border-r border-[#E7EFE9]" : ""}`}
        >
          <span className="mb-4 flex items-center gap-2 text-[12.5px] font-extrabold uppercase tracking-[1.4px] text-[#047857]">
            {group.label}
            <span className="h-px flex-1 bg-[#D1FAE5]" />
          </span>
          <span className={group.items.length > 7 ? "grid grid-cols-2 gap-x-3" : "block"}>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-[14.5px] font-medium text-zinc-800 hover:bg-[#ECFDF5] hover:text-[#047857]"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#047857]" />
                {item.label}
              </Link>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

function mobileLabels(t: T) {
  return {
    menu: t("menu"),
    close: t("close"),
    signIn: t("signIn"),
    howItWorks: t("howItWorks"),
    features: t("features"),
    pricing: t("pricing"),
    blog: t("blog"),
    faq: t("faq"),
    contact: t("contact"),
    allTools: t("allTools"),
  };
}

export async function IndiaNavbar({ groups }: { groups: QuickBooksMenuGroup[] }) {
  const t = await getTranslations("nav");
  const linkCls = "whitespace-nowrap py-2 text-[14.5px] font-semibold text-zinc-700 hover:text-[#047857]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7EFE9] bg-white shadow-[0_2px_16px_rgba(11,31,22,.05)]">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/#how-it-works" className={linkCls}>
            {t("howItWorks")}
          </Link>
          <span className="group">
            <Link href="/tools" className={`inline-flex items-center gap-1 ${linkCls}`}>
              Tools
              <ChevronDown size={14} strokeWidth={2.4} className="text-[#047857]" />
            </Link>
            {/* Full-width mega menu (owner order 2026-11-27: "mega menu
                same full page banao or width 100% rakho") — panel spans
                100% of the viewport (absolute inset-x-0 against the
                sticky header), content stays in the max-w-7xl grid. */}
            <span className="absolute inset-x-0 top-full z-50 hidden w-full group-hover:block group-focus-within:block">
              <span className="block border-b border-[#E7EFE9] bg-white shadow-[0_24px_60px_rgba(11,31,22,.14)]">
                <span className="mx-auto block max-w-7xl px-4">
                  <ToolsPanel groups={groups} />
                </span>
              </span>
            </span>
          </span>
          <Link href="/#features" className={linkCls}>
            {t("features")}
          </Link>
          <Link href="/pricing" className={linkCls}>
            {t("pricing")}
          </Link>
          <Link href="/blog" className={linkCls}>
            {t("blog")}
          </Link>
          <Link href="/#faq" className={linkCls}>
            {t("faq")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <span className="india-nav-auth hidden sm:block">
            <NavSessionIsland signInLabel={t("signIn")} signUpLabel="Sign Up" />
          </span>
          <ConvertPill className="hidden xl:flex" />
          <IndiaMobileNav groups={groups} labels={mobileLabels(t)} />
        </div>
      </div>
    </header>
  );
}
