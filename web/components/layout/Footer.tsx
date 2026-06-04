import Link from "next/link";
import { FileText } from "lucide-react";

const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Sign up free", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-white/10 bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white">BankStatements</span>
              <span className="rounded-full bg-brand-100 dark:bg-brand-900/50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                India
              </span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 dark:text-gray-500">
              Convert Indian bank statement PDFs to clean CSV, Excel & OFX data. Your financial
              documents are never stored on our servers.
            </p>
            <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
              Payments secured by{" "}
              <span className="font-semibold text-slate-500 dark:text-gray-400">Razorpay</span> · UPI / Cards / NetBanking
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10 text-sm sm:gap-14">
            {NAV.map(({ heading, links }) => (
              <div key={heading} className="space-y-2">
                <p className="font-semibold text-slate-700 dark:text-gray-200">{heading}</p>
                {links.map(({ label, href }) => (
                  <p key={label}>
                    <Link href={href} className="text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-100 transition-colors">
                      {label}
                    </Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-white/10 pt-6 flex flex-col items-center justify-between gap-2 sm:flex-row text-xs text-slate-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} BankStatements India. All rights reserved.</p>
          <p>All prices in INR · GST applicable · Data never stored</p>
        </div>
      </div>
    </footer>
  );
}
