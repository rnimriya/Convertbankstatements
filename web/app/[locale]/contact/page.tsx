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
    <div className="agri-sans min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[116px] pb-14">
        <div className="relative mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#E3EDE0] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A33]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2CA01C] shrink-0" />
            Contact
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold text-[#0B1F16] sm:text-[1.8rem]">
            {t("title")}
          </h1>
          <p className="mt-2.5 text-base text-[#5c6f63] max-w-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 py-14">
        <ContactForm />
      </div>

      <Footer />
    </div>
  );
}
