"use client";

import { Link } from "@/i18n/navigation";

/**
 * Anonymous navbar right side — identical markup to the logged-out branch of
 * the user section, so static pre-renders match today's anonymous view and
 * double as the Suspense fallback.
 */
export function NavAnonymousActions({ signInLabel, dark = false }: { signInLabel: string; dark?: boolean }) {
  return (
    <>
      <Link
        href="/login"
        className={dark ? "text-[13.5px] font-medium text-white hover:text-zinc-200" : "text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"}
      >
        {signInLabel}
      </Link>
      <Link
        href="/signup"
        className={dark ? "inline-flex items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-[13.5px] font-semibold text-[#0B3D2E] bg-pine-400 hover:bg-pine-300 border-0" : "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white bg-[#2CA01C] hover:bg-[#238a17] border-0"}
      >
        Free Trial
      </Link>
    </>
  );
}
