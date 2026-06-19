import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hi", "ta", "te", "kn", "ml", "mr", "gu", "pa"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed", // English has no /en/ prefix; others do
});
