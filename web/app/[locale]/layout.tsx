import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import type { Locale } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const BASE = "https://convertstatement.online";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    template: "%s | Convert Statement",
  },
  description:
    "Convert Indian bank statement PDFs from SBI, HDFC, ICICI, Axis, Kotak and 25+ more into CSV, Excel, OFX for Tally, or Google Sheets in under 15 seconds. First 8 pages free.",
  keywords: [
    "bank statement PDF to Excel India",
    "SBI statement to CSV",
    "HDFC PDF to Excel",
    "bank statement converter India",
    "PDF to OFX Tally",
    "bank statement to Google Sheets",
    "CA bank reconciliation tool",
    "Indian bank PDF converter",
    "bank statement extractor",
    "PDF to QFX QuickBooks India",
  ],
  authors: [{ name: "Convert Statement", url: BASE }],
  creator: "Convert Statement",
  publisher: "Convert Statement",
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE,
    siteName: "Convert Statement",
    title: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    description:
      "30+ Indian banks supported. CSV, Excel, OFX for Tally, QFX for QuickBooks, Google Sheets. First 8 pages free. Pay ₹49 per document after that.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Convert Statement — PDF to Excel converter for Indian banks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Statement — Convert Bank PDFs to Excel, CSV & Tally",
    description:
      "30+ Indian banks. CSV, Excel, OFX, QFX. First 8 pages free. Pay ₹49/doc.",
    images: ["/og-image.png"],
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Convert Statement",
  url: BASE,
  logo: `${BASE}/logo.svg`,
  sameAs: [],
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

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${bricolage.variable} ${inter.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <AnnouncementBanner />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
