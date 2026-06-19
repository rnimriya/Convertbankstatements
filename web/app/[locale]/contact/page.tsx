import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Convert Statement",
  description:
    "Have questions about our bank statement PDF to Excel converter? Drop us a line and we will respond within 24 hours.",
  alternates: { canonical: "https://convertstatement.online/contact" },
  openGraph: {
    title: "Contact Us — Convert Statement",
    description: "Have questions? Drop us a line and we will respond within 24 hours.",
    url: "https://convertstatement.online/contact",
  },
};

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="min-h-screen bg-white dark:bg-surface">
      <Navbar />

      {/* Localized Header Banner */}
      <div className="border-b border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-surface px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-base text-zinc-500 dark:text-gray-400 max-w-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <ContactForm />
      </div>

      <Footer />
    </div>
  );
}
