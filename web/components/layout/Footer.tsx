import Link from "next/link";

const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Features",     href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing",      href: "/pricing" },
      { label: "Blog",         href: "/blog" },
      { label: "FAQ",          href: "/#faq" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in",      href: "/login" },
      { label: "Sign up free", href: "/signup" },
      { label: "Dashboard",    href: "/dashboard" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

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

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
              <span className="font-bold text-slate-800 font-display">Convert Statement</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Convert Indian bank statement PDFs to clean CSV, Excel and OFX data. Your financial
              documents are never stored on our servers.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Payments secured by{" "}
              <span className="font-semibold text-slate-500">Razorpay</span> · UPI / Cards / NetBanking
            </p>

            {/* Social links */}
            <div className="mt-4 flex items-center gap-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-navy/40 hover:text-navy transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-10 text-sm sm:gap-14">
            {NAV.map(({ heading, links }) => (
              <div key={heading} className="space-y-2">
                <p className="font-semibold text-slate-700">{heading}</p>
                {links.map(({ label, href }) => (
                  <p key={label}>
                    <Link
                      href={href}
                      className="text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {label}
                    </Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col items-center justify-between gap-2 sm:flex-row text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Convert Statement. All rights reserved.</p>
          <p>All prices in INR · GST applicable · Data never stored</p>
        </div>
      </div>
    </footer>
  );
}
