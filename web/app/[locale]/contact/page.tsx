import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { isIndiaSite } from "@/lib/site-region";
import { IndiaHeadingBand, IndiaStickyBar } from "@/components/inner-india/IndiaInner";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.convertstatement.online";

export const metadata: Metadata = {
  title: "Contact Us — Convert Statement",
  description:
    "Have questions about our bank statement PDF to Excel converter? Drop us a line and we will respond within 24 hours.",
  alternates: { canonical: `${BASE}/contact` },
  openGraph: {
    title: "Contact Us — Convert Statement",
    description: "Have questions? Drop us a line and we will respond within 24 hours.",
    url: `${BASE}/contact`,
  },
};

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const IN = isIndiaSite();

  return (
    <div className={IN ? "agri-sans min-h-screen bg-[#FAFAFC]" : "agri-sans min-h-screen bg-white"}>
      <Navbar />

      {/* Header */}
      {IN ? (
        <IndiaHeadingBand title={t("title")} subtitle={t("subtitle")} />
      ) : (
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[124px] pb-16">
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
      )}

      {/* Main Body Container */}
      <div className={IN ? "relative z-20 mx-auto max-w-7xl px-4 py-16" : "relative z-20 mx-auto max-w-6xl px-6 py-14"}>
        <ContactForm />
      </div>

      {IN && <IndiaStickyBar />}
      <Footer />
    </div>
  );
}
