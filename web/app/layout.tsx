import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BankStatements — Convert PDFs to CSV, Excel & More",
  description:
    "Convert bank statement PDFs from 1,000+ banks into structured CSV, Excel, OFX, and QFX data. First 8 pages free.",
  keywords: ["bank statement", "PDF to CSV", "OFX", "QFX", "Excel"],
  openGraph: {
    title: "BankStatements — Convert PDFs to Structured Data",
    description: "First 8 pages free. Pay ₹49 per document after that.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply dark class before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
