const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content-Security-Policy is set per-request in middleware.ts with a nonce
  // (so 'unsafe-inline' can be dropped from script-src). It can't live here as a
  // static header because the nonce changes on every request.
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    // Tree-shake lucide-react aggressively — the icon set is imported
    // across dozens of components and dominates client JS otherwise.
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    // Redirect removed locale prefixes (kn/mr/te/hi etc.) to the canonical
    // English URLs. These old locale URLs are indexed in Google but now 404
    // since the site only supports English. 301 preserves SEO value.
    const removedLocales = ["kn", "mr", "te", "hi", "ta", "bn", "gu", "ml", "pa", "or"];
    return removedLocales.map((locale) => ({
      source: `/${locale}/:path*`,
      destination: "/:path*",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
