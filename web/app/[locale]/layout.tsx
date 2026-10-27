import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { BUILD_NONCE } from "@/lib/csp-nonce";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import type { Locale } from "@/i18n/routing";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Google Analytics 4 */}
        <script async nonce={nonce} src="https://www.googletagmanager.com/gtag/js?id=G-9P4SZSM3B9" />
        {/*
          Pre-paint theme init (mirrors next-themes: storageKey "theme",
          attribute "class", system default). next-themes' own inline script
          can't reliably carry our CSP nonce (it renders nonce="" on the
          client), so this nonce'd copy applies the theme before first paint
          and stays CSP-clean on static pages.
        */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"system";var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;var e=document.documentElement;e.classList.remove("light","dark");e.classList.add(r);e.style.colorScheme=r;}catch(e){}})();`,
          }}
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-9P4SZSM3B9');`,
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
      <body className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange nonce={nonce}>
          <NextIntlClientProvider messages={messages}>
            <AnnouncementBanner />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
