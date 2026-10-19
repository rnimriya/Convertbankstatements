"use client";

import { Link } from "@/i18n/navigation";

/**
 * Anonymous navbar right side — identical markup to the logged-out branch of
 * the user section, so static pre-renders match today's anonymous view and
 * double as the Suspense fallback.
 */
export function NavAnonymousActions({ signInLabel }: { signInLabel: string }) {
  return (
    <>
      <Link
        href="/login"
        className="text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        {signInLabel}
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13.5px] font-semibold text-white bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors border-0"
      >
        Free Trial
      </Link>
    </>
  );
}
