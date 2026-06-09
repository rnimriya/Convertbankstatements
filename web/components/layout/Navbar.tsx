import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 dark:border-white/10 bg-white/80 dark:bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
          <div className="hidden sm:block">
            <span className="font-bold text-slate-800 dark:text-white">Convert Statement</span>
            <span className="ml-1.5 rounded-full bg-brand-100 dark:bg-brand-900/50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">India</span>
          </div>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">How it works</Link>
          <Link href="/#features" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">Pricing</Link>
          <Link href="/blog" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">Blog</Link>
          <Link href="/#faq" className="text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-brand-400 px-4 py-2 text-sm font-semibold text-black hover:bg-brand-300 transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}
