import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Convert Statement",
  description:
    "Have questions about our bank statement PDF to Excel converter? Drop us a line and we will respond within 24 hours.",
  alternates: { canonical: "https://www.convertstatement.online/contact" },
  openGraph: {
    title: "Contact Us — Convert Statement",
    description: "Have questions? Drop us a line and we will respond within 24 hours.",
    url: "https://www.convertstatement.online/contact",
  },
};

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar dark />

      {/* Localized Header Banner */}
      <div className="bg-pine-800 px-6 pt-10 pb-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-base text-zinc-300 max-w-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 py-16 -mt-16">
        <ContactForm />
      </div>

      <Footer />
    </div>
  );
}
