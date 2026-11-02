import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { Locale } from "@/i18n/routing";
import "../globals.css";

// Cheapcab typography: Manrope for everything — body and headings
// (single family, weights 400-800, same setup as cheapcab.online).
// Fonts are SELF-HOSTED via next/font/local — do not switch back to
// next/font/google: its build-time download from Google failed on Vercel
// on 2026-11-02 (next-font-loader "Cannot read properties of null") and
// took the whole production build down.
const manrope = localFont({
  src: "../fonts/manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
});

const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono.woff2",
  variable: "--font-mono",
  weight: "100 800",
});

// Static locales for prerendering — every public page below this layout can
// then be emitted at build time (no per-request headers()/cookies() left).
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BASE = "https://www.convertstatement.online";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    template: "%s | Convert Statement",
  },
  description:
    "Convert bank statement PDFs from Wells Fargo, Citibank, U.S. Bank, Cadence Bank, Kotak and 400+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds. First 8 pages free.",
  keywords: [
    "Wells Fargo PDF to Excel",
    "Citibank statement converter",
    "bank statement PDF to Excel",
    "bank statement converter",
    "PDF to OFX Tally",
    "bank statement to Google Sheets",
    "CA bank reconciliation tool",
    "PDF to QFX QuickBooks",
  ],
  authors: [{ name: "Convert Statement", url: BASE }],
  creator: "Convert Statement",
  publisher: "Convert Statement",
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE,
    siteName: "Convert Statement",
    title: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    description:
      "Global banks supported. CSV, Excel, OFX for Tally, QFX for QuickBooks, Google Sheets. First 8 pages free. Monthly plans from $5 after that.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Convert Statement — PDF to Excel converter for banks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    description:
      "Global banks. CSV, Excel, OFX, QFX. First 8 pages free. Monthly plans from $5.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "yMseDO6GsCeGGbrHzYqqoSkfIf7GtYFkAYbbWJwGEyI",
    other: {
      "msvalidate.01": "CAC1C057FE476927DB2983B3F0F1AA85",
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Convert Statement",
  url: BASE,
  logo: `${BASE}/logo.svg`,
  sameAs: [
    "https://x.com/convertstatement",
    "https://linkedin.com/company/convertstatement"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Convert Statement",
  url: BASE,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const nonce = BUILD_NONCE;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="yMseDO6GsCeGGbrHzYqqoSkfIf7GtYFkAYbbWJwGEyI" />
        {/*
          Single light theme only: this nonce'd pre-paint script forces
          "light", clears any stored dark preference, and stays CSP-clean
          on static pages.
        */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=document.documentElement;e.classList.remove("dark");e.classList.add("light");e.style.colorScheme="light";try{localStorage.removeItem("theme");}catch(e){}}catch(e){}})();`,
          }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${manrope.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Google Analytics 4 — lazyOnload: analytics must never compete
            with the critical first paint (moved out of <head> 2026-11-01). */}
        <Script
          nonce={nonce}
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-9P4SZSM3B9"
        />
        <Script
          nonce={nonce}
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-9P4SZSM3B9');`,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <AnnouncementBanner />
          {children}
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
