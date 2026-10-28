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
      <Navbar dark />

      {/* Localized Header Banner */}
      <div className="relative overflow-hidden bg-[#071106] px-6 pt-10 pb-24">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[420px] w-[1100px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(100,203,72,0.38), rgba(19,84,28,0.28) 55%, transparent 75%)" }} />
        <div className="relative mx-auto max-w-6xl">
          <p className="agri-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#B9D6B2] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64CB48] shrink-0" />
            Contact
          </p>
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
