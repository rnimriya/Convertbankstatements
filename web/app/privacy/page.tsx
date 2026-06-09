import Link from "next/link";
import { FileText, Shield } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
 title: "Privacy Policy — Convert Statement",
 description: "How Convert Statement collects, uses, and protects your personal and financial data.",
};

const SECTIONS = [
 {
 id: "overview",
 title: "1. Overview",
 content: `Convert Statement ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our bank statement conversion service at convertstatement.online ("Service").

We comply with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules), and applicable data protection laws of India.

By using our Service, you consent to the practices described in this Policy.`,
 },
 {
 id: "data-collected",
 title: "2. Information We Collect",
 content: `We collect only what is necessary to provide the Service:

**Account Information**
- Email address and name (provided during registration)
- Hashed password (we never store your plain-text password)
- Account creation date and subscription tier

**PDF Bank Statements**
- You upload PDF files for processing. These files are processed entirely in memory and are permanently deleted from our servers immediately after the conversion is complete. We never write your PDF to disk, store it in a database, or retain it beyond the current processing session.

**Transaction Data**
- Extracted transaction data (dates, amounts, descriptions) is returned to you and is not stored on our servers after your session ends.

**Usage & Technical Data**
- Page count of documents processed (for billing purposes)
- Number of documents converted (for plan limits)
- Approximate processing time
- IP address and browser/device type (collected automatically for security)

**Payment Information**
- We do not store any card numbers, UPI IDs, or bank account details. All payment processing is handled by Razorpay, which is PCI-DSS compliant. We receive only a transaction reference ID and payment status.`,
 },
 {
 id: "how-we-use",
 title: "3. How We Use Your Information",
 content: `We use the information we collect to:

- Provide, operate, and improve the Service
- Process your bank statement PDFs and return converted data
- Track usage against your plan limits (free pages, monthly allotment)
- Process payments and manage your subscription
- Send transactional emails (account verification, receipts, password reset)
- Detect and prevent fraud or abuse
- Comply with legal obligations

We do not use your financial data for advertising, profiling, or any purpose other than providing the conversion service you requested.`,
 },
 {
 id: "data-not-stored",
 title: "4. What We Do NOT Store",
 content: `We explicitly do not:

- Store your uploaded PDF bank statements after processing
- Store extracted transaction data on our servers
- Share your financial data with third parties (other than as required for payment processing)
- Sell, rent, or trade your personal information
- Use your bank statement data to train AI/ML models
- Share your data with advertisers or marketing companies

Your financial documents belong to you. Once processing is complete, they are gone from our systems.`,
 },
 {
 id: "data-sharing",
 title: "5. Data Sharing & Third Parties",
 content: `We share data only with trusted service providers required to operate the Service:

**Razorpay** — Payment processing (PCI-DSS Level 1 certified). Razorpay's Privacy Policy governs data shared during payment transactions.

**Anthropic (Claude AI)** — When processing scanned or image-based PDFs, we may send the PDF content to Anthropic's API for AI-powered text extraction. This is done under Anthropic's data processing agreement and their API data is not used to train models.

**Hosting Infrastructure** — Our servers are hosted on secure cloud infrastructure. We maintain data processing agreements with all infrastructure providers.

We do not sell your data to any third party under any circumstances.`,
 },
 {
 id: "data-security",
 title: "6. Data Security",
 content: `We implement industry-standard security measures:

- All connections use TLS 1.3 encryption (HTTPS)
- Passwords are hashed using bcrypt with a work factor of 12
- Session tokens use 256-bit HMAC-signed JWTs with 30-day expiry
- PDF files are processed in memory — never written to disk
- Payment data flows only through Razorpay's PCI-DSS certified systems
- Regular security audits and vulnerability assessments

While we implement robust protections, no system can guarantee 100% security. We encourage you to use a strong unique password and to log out after each session.`,
 },
 {
 id: "retention",
 title: "7. Data Retention",
 content: `We retain different data for different periods:

- **Account information** — Retained for the lifetime of your account. Deleted within 30 days of account closure.
- **PDF files** — Not retained. Deleted immediately after processing.
- **Transaction data** — Not retained after the session ends.
- **Billing records** — Retained for 7 years as required by Indian GST and accounting laws.
- **Usage logs** (page counts, document counts) — Retained for the duration of your account for billing purposes.

You may request deletion of your account and all associated data at any time by contacting us.`,
 },
 {
 id: "your-rights",
 title: "8. Your Rights",
 content: `Under applicable Indian and international data protection laws, you have the right to:

- **Access** — Request a copy of the personal data we hold about you
- **Correction** — Request correction of inaccurate personal data
- **Deletion** — Request deletion of your account and associated personal data
- **Portability** — Receive your account data in a machine-readable format
- **Opt-out** — Unsubscribe from promotional emails at any time

To exercise any of these rights, email us at privacy@convertstatement.online. We will respond within 30 days.`,
 },
 {
 id: "cookies",
 title: "9. Cookies & Local Storage",
 content: `We use minimal, essential cookies only:

- **Session cookie** (bs_token) — An HttpOnly, secure JWT cookie used to keep you logged in. Expires after 30 days.
- **Usage cookie** (bs_pages_used) — Tracks free page usage for anonymous users. Expires after 1 year.
- **Payment cookie** (bs_payg_cleared) — A short-lived cookie (30 minutes) confirming a PAYG payment was verified before allowing file processing.

We do not use third-party tracking cookies, advertising cookies, or analytics cookies.`,
 },
 {
 id: "children",
 title: "10. Children's Privacy",
 content: `Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us personal information, please contact us and we will promptly delete it.`,
 },
 {
 id: "changes",
 title: "11. Changes to This Policy",
 content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by displaying a prominent notice on our website. Continued use of the Service after the effective date of any changes constitutes your acceptance of the updated Policy.

The date this Policy was last updated is shown at the top of this page.`,
 },
 {
 id: "contact",
 title: "12. Contact Us",
 content: `For privacy-related questions, requests, or concerns, please contact our Privacy Officer:

**Email:** privacy@convertstatement.online
**Subject line:** Privacy Inquiry

We are committed to resolving complaints about our collection or use of your personal information. We will respond within 30 business days.`,
 },
];

export default function PrivacyPage() {
 return (
 <div className="min-h-screen bg-white">
 {/* Navbar */}
 <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
 <div className="mx-auto flex max-w-5xl items-center justify-between px-6 h-16">
 <Link href="/" className="flex items-center gap-2.5">
 <img src="/logo.svg" alt="Convert Statement" className="h-8 w-8" />
 <span className="hidden sm:inline font-bold text-slate-900 font-display text-[17px]">Convert Statement</span>
 </Link>
 <div className="flex items-center gap-3">
 <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Sign in</Link>
 <Link href="/signup" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
 Get started free
 </Link>
 </div>
 </div>
 </nav>

 {/* Header */}
 <div className="border-b border-slate-100 bg-slate-50 px-6 py-10">
 <div className="mx-auto max-w-3xl">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10">
 <Shield className="h-5 w-5 text-navy" />
 </div>
 <div>
 <h1 className="text-2xl font-extrabold text-slate-900 ">Privacy Policy</h1>
 <p className="text-xs text-slate-400 mt-0.5">Last updated: June 2026 · Effective immediately</p>
 </div>
 </div>
 <p className="mt-4 text-sm leading-relaxed text-slate-500">
 We built Convert Statement with privacy at its core. Your financial documents are never stored on our servers — they are processed in memory and deleted the moment your converted data is ready. This policy explains exactly what we do (and don&apos;t do) with your data.
 </p>
 </div>
 </div>

 {/* Content */}
 <div className="mx-auto max-w-3xl px-6 py-12">
 {/* Table of contents */}
 <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 bg-slate-50 p-5">
 <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 ">Contents</p>
 <div className="grid gap-1 sm:grid-cols-2">
 {SECTIONS.map(({ id, title }) => (
 <a
 key={id}
 href={`#${id}`}
 className="text-sm text-navy hover:underline underline-offset-2"
 >
 {title}
 </a>
 ))}
 </div>
 </div>

 {/* Sections */}
 <div className="space-y-10">
 {SECTIONS.map(({ id, title, content }) => (
 <section key={id} id={id} className="scroll-mt-20">
 <h2 className="mb-3 text-lg font-bold text-slate-900 ">{title}</h2>
 <div className="space-y-3">
 {content.split("\n\n").map((para, i) => {
 if (para.startsWith("**") && para.split("\n").length === 1) {
 return (
 <p key={i} className="text-sm font-semibold text-slate-800 ">
 {para.replace(/\*\*/g, "")}
 </p>
 );
 }
 // Render bold inline text
 const parts = para.split(/(\*\*[^*]+\*\*)/g);
 return (
 <p key={i} className="text-sm leading-relaxed text-slate-600 ">
 {parts.map((part, j) =>
 part.startsWith("**") ? (
 <strong key={j} className="font-semibold text-slate-800 ">
 {part.replace(/\*\*/g, "")}
 </strong>
 ) : (
 part
 )
 )}
 </p>
 );
 })}
 </div>
 </section>
 ))}
 </div>

 {/* Bottom note */}
 <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
 <p className="font-semibold">Our core commitment</p>
 <p className="mt-1">
 Your PDF bank statements are processed in memory and deleted immediately after conversion. We will never sell your data, use it for advertising, or share it with third parties beyond what is needed to run the service.
 </p>
 </div>

 <div className="mt-8 text-center text-xs text-slate-400 ">
 Questions?{" "}
 <a href="mailto:privacy@convertstatement.online" className="text-navy hover:underline">
 privacy@convertstatement.online
 </a>
 </div>
 </div>

 <Footer />
 </div>
 );
}
