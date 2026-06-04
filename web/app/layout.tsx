import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BankStatements — Convert PDFs to CSV, Excel & More",
  description:
    "Convert bank statement PDFs from 1,000+ banks into structured CSV, Excel, OFX, and QFX data. First 8 pages free.",
  keywords: ["bank statement", "PDF to CSV", "OFX", "QFX", "Excel"],
  openGraph: {
    title: "BankStatements — Convert PDFs to Structured Data",
    description: "First 8 pages free. Pay $1.99 per document after that.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-gray-100 antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
