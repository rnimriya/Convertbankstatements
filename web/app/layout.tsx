import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const BASE = "https://bankstatements.io";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "BankStatements India — Convert Bank PDFs to Excel, CSV & Tally",
    template: "%s | BankStatements India",
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
  authors: [{ name: "BankStatements India", url: BASE }],
  creator: "BankStatements India",
  publisher: "BankStatements India",
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE,
    siteName: "BankStatements India",
    title: "BankStatements India — Convert Bank PDFs to Excel, CSV & Tally",
    description:
      "30+ Indian banks supported. CSV, Excel, OFX for Tally, QFX for QuickBooks, Google Sheets. First 8 pages free. Pay ₹49 per document after that.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BankStatements India — PDF to Excel converter for Indian banks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BankStatements India — Convert Bank PDFs to Excel, CSV & Tally",
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
  name: "BankStatements India",
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
  name: "BankStatements India",
  url: BASE,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
