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
    label: "Facebook",
    href: "https://facebook.com/convertstatement",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/convertstatement",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
    <footer className="border-t border-slate-100 dark:border-white/10 bg-white dark:bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="ConvertStatement" className="h-7 w-7" />
              <span className="font-bold text-slate-800 dark:text-white">ConvertStatement</span>
              <span className="rounded-full bg-brand-100 dark:bg-brand-900/50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                India
              </span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 dark:text-gray-500">
              Convert Indian bank statement PDFs to clean CSV, Excel and OFX data. Your financial
              documents are never stored on our servers.
            </p>
            <p className="mt-3 text-xs text-slate-400 dark:text-gray-500">
              Payments secured by{" "}
              <span className="font-semibold text-slate-500 dark:text-gray-400">Razorpay</span> · UPI / Cards / NetBanking
            </p>

            {/* Social links */}
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 hover:border-brand-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
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
                <p className="font-semibold text-slate-700 dark:text-gray-200">{heading}</p>
                {links.map(({ label, href }) => (
                  <p key={label}>
                    <Link
                      href={href}
                      className="text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
                    >
                      {label}
                    </Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-white/10 pt-6 flex flex-col items-center justify-between gap-2 sm:flex-row text-xs text-slate-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} ConvertStatement. All rights reserved.</p>
          <p>All prices in INR · GST applicable · Data never stored</p>
        </div>
      </div>
    </footer>
  );
}
