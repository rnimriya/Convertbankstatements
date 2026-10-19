import { defineRouting } from "next-intl/routing";

export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed", // English has no /en/ prefix; others do
  // Single-locale site: never set the NEXT_LOCALE cookie. A Set-Cookie header
  // on every response marks pages uncacheable at the edge (private/no-store),
  // which silently defeated static caching for all public pages.
  localeCookie: false,
});
