import type { ReactNode } from "react";
import {
  ArrowRight, Check, X, Upload, Search, Download, Table2, FileText,
  BookOpen, FileSpreadsheet, Landmark, CircleCheck, UserRound, Lock,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LegacyHero } from "./LegacyHero";
import BankLinks from "@/components/banks/BankLinks";

export type LegacyTool = { href: string; label: string; desc: string; img: string; tag?: "free" | "pop" };
export type LegacyPlan = { name: string; price: string; suffix: string; per: string; features: string[]; btn: string; hot: boolean };
export type LegacyFaq = { q: string; a: string };

/**
 * LegacyBridge-pattern homepage for convertstatement.in (owner order
 * 2026-11-27: "is website ka design same meri website ke liye bna ke do").
 * Follows LegacyBridge's layout pattern / section structure with
 * ConvertStatement's own copy, icons and verified facts only — no
 * copied text, images, testimonials, stats or certifications.
 * Rendered only when isIndiaSite(); .online keeps the existing design.
 * Content (tools, ₹ pricing, FAQs) comes from the page's existing
 * India variants so there is a single source of truth.
 */

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#047857] mb-3.5">{children}</p>;
}

function SecHead({ eyebrow, title, body, center = false }: { eyebrow: string; title: ReactNode; body?: string; center?: boolean }) {
  return (
    <div className={`max-w-[720px] mb-11 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-[38px] font-extrabold tracking-tight leading-[1.15] text-[#0f172a]">{title}</h2>
      {body && <p className="text-[17px] text-[#64748b] mt-3.5 leading-relaxed">{body}</p>}
    </div>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="w-[52px] h-[52px] rounded-[14px] bg-[#ecfdf5] border border-[#d1fae5] flex items-center justify-center mb-[18px]">
      {children}
    </div>
  );
}

const FACTS = [
  { n: "44", l: "Tools" },
  { n: "34", l: "Free tools" },
  { n: "8", l: "Pages free to start" },
  { n: "~15 sec", l: "Per conversion" },
];

const USE_CASES = [
  { icon: <Table2 size={21} className="text-[#047857]" />, title: "PDF to Excel", body: "Statement PDF to a clean .xlsx — one row per transaction.", href: "/bank-statement-to-excel" },
  { icon: <FileText size={21} className="text-[#047857]" />, title: "PDF to CSV", body: "Plain-text rows that open in any spreadsheet or import tool.", href: "/bank-statement-to-csv" },
  { icon: <BookOpen size={21} className="text-[#047857]" />, title: "PDF to Tally", body: "OFX export your Tally books accept for bank statement import.", href: "#upload" },
  { icon: <FileSpreadsheet size={21} className="text-[#047857]" />, title: "PDF to QuickBooks", body: "QBO Web Connect files QuickBooks can import directly.", href: "/pdf-to-qbo" },
  { icon: <FileText size={21} className="text-[#047857]" />, title: "PDF to Sheets", body: "Send statement rows straight into Google Sheets.", href: "#upload" },
];

const WHO = [
  { title: "Chartered accountants", body: "Client statements converted and balance-checked before they reach your working papers." },
  { title: "Bookkeepers", body: "Monthly statements into Excel, Tally or QuickBooks without line-by-line entry." },
  { title: "Small businesses", body: "Your own statements, ready for GST filing, audits and loan paperwork." },
  { title: "Tax filing", body: "A full year of transactions as clean rows when ITR season arrives." },
  { title: "Loan & visa applications", body: "Statement history in a spreadsheet you can sort, filter and share." },
  { title: "Audits & reconciliation", body: "Bank rows side by side with your books, balances already checked." },
];

const COMPARE: { crit: string; us: string; them: string }[] = [
  { crit: "Time", us: "~15 seconds per conversion", them: "Hours for a long statement" },
  { crit: "Balance check", us: "Checked on every conversion, before download", them: "You find mismatches at month-end" },
  { crit: "Formats", us: "Excel, CSV, Tally, QBO, OFX, Google Sheets from one upload", them: "One format, typed once, fixed by hand" },
  { crit: "Password PDFs", us: "Accepted as they arrive from your bank", them: "Open, read and copy every line yourself" },
  { crit: "Cost to start", us: "First 8 pages free, no account needed", them: "Your team's hours, every single month" },
];

export function LegacyHome({ tools, pricePlans, faqs }: { tools: LegacyTool[]; pricePlans: LegacyPlan[]; faqs: LegacyFaq[] }) {
  const faqGroups: { title: string; items: LegacyFaq[] }[] = [
    { title: "Converting", items: [faqs[3], faqs[2]].filter(Boolean) },
    { title: "Banks & formats", items: [faqs[0], faqs[4]].filter(Boolean) },
    { title: "Pricing & privacy", items: [faqs[5], faqs[1]].filter(Boolean) },
  ];

  return (
    <main className="overflow-x-hidden agri-sans bg-[#FAFAFC]">
      <LegacyHero />

      {/* ─── FACTS STRIP ─────────────────────────────── */}
      <section className="bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <div key={f.l} className={`py-7 px-5 text-center ${i > 0 ? "border-l border-[#e2e8f0]" : ""} ${i >= 2 ? "max-lg:border-t max-lg:border-[#e2e8f0]" : ""} ${i === 2 ? "max-lg:border-l-0" : ""}`}>
              <div className="text-[32px] font-extrabold tracking-tight text-[#047857]">{f.n}</div>
              <div className="text-sm font-semibold text-[#64748b] mt-0.5">{f.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM REFRAME ─────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead
            center
            eyebrow="The real problem"
            title={<>Your bank statement is not the problem.<br />Typing it into Excel is.</>}
            body="Statements arrive as PDFs every month. Your accounting software cannot read them — so someone has to type every line by hand."
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-[18px] border border-[#fecaca] bg-[#fef2f2] p-8">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#dc2626] mb-3">Manual typing</p>
              <h3 className="text-[28px] font-extrabold tracking-tight text-[#0f172a] mb-2.5">Hours of typing</h3>
              <p className="text-[#334155]">The result: typing errors, mismatched balances, and skilled staff stuck doing data entry.</p>
              <ul className="mt-[18px] grid gap-2.5 text-[15px] text-[#334155]">
                {["Every transaction typed line by line", "One wrong digit breaks the balance", "Month-end means overtime and rework"].map((t) => (
                  <li key={t} className="flex gap-2.5 items-start"><X size={17} strokeWidth={2.6} className="text-[#dc2626] shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] border border-[#d1fae5] bg-[#ecfdf5] p-8">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#047857] mb-3">With ConvertStatement</p>
              <h3 className="text-[28px] font-extrabold tracking-tight text-[#0f172a] mb-2.5">Seconds to download</h3>
              <p className="text-[#334155]">The result: clean rows in Excel, CSV or Tally — with the balance checked before you download.</p>
              <ul className="mt-[18px] grid gap-2.5 text-[15px] text-[#334155]">
                {["Upload the PDF, get the table", "Balance check runs on every conversion", "You review the rows, then download"].map((t) => (
                  <li key={t} className="flex gap-2.5 items-start"><Check size={17} strokeWidth={2.6} className="text-[#047857] shrink-0 mt-0.5" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#e2e8f0] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead center eyebrow="How it works" title="Start with one statement" body="One statement is enough to see the result on your own data. Your first 8 pages are free." />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Step 01", icon: <Upload size={24} className="text-[#047857]" />, title: "Upload your statement PDF", body: "Drop the PDF in, or add it from your device, Google Drive, Dropbox or a link. Password-protected statement PDFs are accepted — PDF only, up to 50 MB." },
              { n: "Step 02", icon: <Search size={24} className="text-[#047857]" />, title: "Check the preview", body: "See the transactions the converter found — date, description, amount and balance — with a balance check on every conversion before you download anything." },
              { n: "Step 03", icon: <Download size={24} className="text-[#047857]" />, title: "Download in your format", body: "Excel, CSV, Tally, QuickBooks (QBO), OFX or Google Sheets — one row per transaction, ready for your books." },
            ].map((s) => (
              <div key={s.n} className="bg-white border border-[#e2e8f0] rounded-[18px] p-[30px]">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#047857] mb-4">{s.n}</p>
                <IconTile>{s.icon}</IconTile>
                <h3 className="text-[21px] font-extrabold tracking-tight text-[#0f172a] mb-2">{s.title}</h3>
                <p className="text-[15px] text-[#64748b] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MANTRA ──────────────────────────────────── */}
      <section className="bg-[#0f172a] text-white text-center px-6 py-11">
        <p className="text-xl sm:text-[26px] font-extrabold tracking-tight">One statement. One conversion. <span className="text-[#6ee7b7]">You check it before you download.</span></p>
      </section>

      {/* ─── USE CASES ───────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead eyebrow="Converters" title="One statement, every format your books need" body="44 tools in all — 34 of them free. These are the ones Indian businesses use most." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[18px]">
            {USE_CASES.map((u) => (
              <div key={u.title} className="bg-white border border-[#e2e8f0] rounded-2xl px-5 py-6 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[#ecfdf5] border border-[#d1fae5] flex items-center justify-center mb-3.5">{u.icon}</div>
                <h3 className="text-[17px] font-extrabold tracking-tight text-[#0f172a] mb-1.5">{u.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed flex-1">{u.body}</p>
                <a href={u.href} className="inline-flex items-center gap-1 mt-3.5 text-sm font-bold text-[#047857]">Try free <ArrowRight size={14} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENTO BENEFITS ──────────────────────────── */}
      <section id="features" className="py-20 bg-white border-y border-[#e2e8f0] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead eyebrow="Why ConvertStatement" title="Built for the whole job, not just extraction" body="Extracting text is the easy part. Checking it, formatting it and handing you a file your books accept is the job." />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-[18px] p-8">
              <IconTile><CircleCheck size={24} className="text-[#047857]" /></IconTile>
              <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a] mb-2">Balance check on every conversion</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">Running balances are verified against the statement before you download, so a mismatch surfaces immediately — not at month-end.</p>
              <div className="mt-5 border border-[#e2e8f0] rounded-xl px-4 py-3.5 bg-[#f8fafc] text-[13px]">
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Opening balance</span><b className="text-[#0f172a]">27,450</b></div>
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Credits − Debits</span><b className="text-[#0f172a]">+61,181</b></div>
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Closing balance</span><b className="text-[#0f172a] inline-flex items-center gap-1">88,631 <Check size={13} strokeWidth={3} className="text-[#047857]" /> matches</b></div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[18px] p-8">
              <IconTile><Landmark size={24} className="text-[#047857]" /></IconTile>
              <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a] mb-2">Made for Indian bank statements</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">Statement layouts from the banks Indian businesses actually use — public sector, private and cooperative banks alike.</p>
              <div className="flex flex-wrap gap-[7px] mt-[18px]">
                {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak", "PNB", "Bank of Baroda", "Canara Bank"].map((b) => (
                  <span key={b} className="text-[12.5px] font-bold border border-[#cbd5e1] rounded-full px-3 py-[5px] text-[#334155] bg-white">{b}</span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[18px] p-8">
              <IconTile><UserRound size={24} className="text-[#047857]" /></IconTile>
              <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a] mb-2">No account needed to start</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">Your first 8 pages are free with no signup. Convert a real statement, check the result, and decide from evidence.</p>
              <div className="mt-5 border border-[#e2e8f0] rounded-xl px-4 py-3.5 bg-[#f8fafc] text-[13px]">
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Free pages to start</span><b className="text-[#0f172a]">8 pages</b></div>
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Account required</span><b className="text-[#0f172a]">No</b></div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-[18px] p-8">
              <IconTile><Lock size={24} className="text-[#047857]" /></IconTile>
              <h3 className="text-[22px] font-extrabold tracking-tight text-[#0f172a] mb-2">Password-protected PDFs accepted</h3>
              <p className="text-[15px] text-[#64748b] leading-relaxed">Most Indian bank statements arrive password-protected. ConvertStatement accepts them as they are — enter the password during upload; it is never stored.</p>
              <div className="mt-5 border border-[#e2e8f0] rounded-xl px-4 py-3.5 bg-[#f8fafc] text-[13px]">
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Password-protected PDF</span><b className="text-[#0f172a]">Accepted</b></div>
                <div className="flex justify-between py-[3px] text-[#64748b]"><span>Max file size</span><b className="text-[#0f172a]">50 MB</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── POSITIONING ─────────────────────────────── */}
      <section className="py-20 bg-[#047857] text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-[42px] font-extrabold tracking-tight leading-[1.15]">Keep your bank. Remove the typing.</h2>
          <p className="text-lg text-[#d1fae5] max-w-[640px] mx-auto mt-4 leading-relaxed">ConvertStatement is built to finish one job — statement PDF in, bookkeeping-ready file out — not to hand you another tool to configure.</p>
          <div className="flex justify-center gap-3 flex-wrap mt-[26px]">
            {["No software to install", "No account for the first 8 pages", "No retyping"].map((t) => (
              <span key={t} className="border border-white/35 rounded-full px-[18px] py-[9px] font-bold text-[14.5px]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead eyebrow="Who it's for" title="Where ConvertStatement fits" body="Anyone who receives bank statements as PDFs and needs them as rows in a spreadsheet or accounting package." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {WHO.map((w) => (
              <div key={w.title} className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
                <h3 className="text-[17px] font-extrabold tracking-tight text-[#0f172a] mb-1.5">{w.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ──────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead center eyebrow="Compare" title="ConvertStatement vs typing it yourself" body="Judge it on your own statement — the first 8 pages are free." />
          <div className="bg-white border border-[#e2e8f0] rounded-[18px] overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-[18px] text-left text-[15px]"></th>
                  <th className="p-[18px] text-left text-[15px] bg-[#047857] text-white font-bold">ConvertStatement</th>
                  <th className="p-[18px] text-left text-[15px] bg-[#f1f5f9] text-[#334155] font-bold">Typing by hand</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.crit}>
                    <td className="px-5 py-4 border-t border-[#e2e8f0] text-[15px] font-extrabold text-[#0f172a] whitespace-nowrap align-top">{r.crit}</td>
                    <td className="px-5 py-4 border-t border-[#e2e8f0] text-[15px] text-[#334155] align-top"><span className="flex gap-2.5 items-start"><Check size={17} strokeWidth={2.6} className="text-[#047857] shrink-0 mt-0.5" />{r.us}</span></td>
                    <td className="px-5 py-4 border-t border-[#e2e8f0] text-[15px] text-[#334155] align-top"><span className="flex gap-2.5 items-start"><X size={17} strokeWidth={2.6} className="text-[#dc2626] shrink-0 mt-0.5" />{r.them}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── ALL 44 TOOLS ────────────────────────────── */}
      <section id="tools" className="py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead eyebrow="All tools" title={<>All 44 tools. <span className="text-[#047857]">Thirty-four free.</span></>} body="Pick any tool — thirty-four are completely free, no account needed." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="flex flex-col rounded-[18px] border border-[#e2e8f0] bg-white p-5 hover:border-[#a7f3d0]">
                <img src={t.img} alt="" width={52} height={52} loading="lazy" className="mb-3 h-[52px] w-[52px] rounded-[14px] bg-[#f8fafc] object-contain" />
                <span className="font-display text-[15.5px] font-bold text-[#0f172a]">{t.label}</span>
                <span className="mt-1 flex-1 text-[13px] leading-relaxed text-[#64748b]">{t.desc}</span>
                <span className="mt-3 flex items-center justify-between">
                  {t.tag === "free" ? (
                    <span className="inline-block rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#047857]">100% Free</span>
                  ) : t.tag === "pop" ? (
                    <span className="inline-block rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#92400e]">Most popular</span>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#047857]">Open tool <ArrowRight className="h-3.5 w-3.5" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white border-y border-[#e2e8f0] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead center eyebrow="Pricing" title="Three packages. Prices in rupees." body="Start free with 8 pages. Upgrade when your statements run longer." />
          <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
            {pricePlans.map((p) => (
              <div key={p.name} className={`relative bg-white rounded-[20px] px-[30px] py-[34px] flex flex-col ${p.hot ? "border-2 border-[#047857]" : "border border-[#e2e8f0]"}`}>
                {p.hot && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#047857] text-white text-xs font-extrabold uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full whitespace-nowrap">Most popular</span>}
                <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#64748b]">{p.name}</p>
                <p className="text-[44px] font-extrabold tracking-tight leading-none text-[#0f172a] mt-2.5 mb-1">
                  {p.price}{p.suffix && <small className="text-base font-semibold text-[#64748b]">{p.suffix}</small>}
                </p>
                <p className="text-[15px] font-bold text-[#047857] mb-5">{p.per}</p>
                <ul className="grid gap-[11px] mb-7">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex gap-2.5 items-start text-[15px] text-[#334155]"><Check size={16} strokeWidth={2.6} className="text-[#047857] shrink-0 mt-[3px]" />{feat}</li>
                  ))}
                </ul>
                <a href="/pricing" className={`inline-flex items-center justify-center rounded-[10px] px-5 py-3 text-[15px] font-bold whitespace-nowrap mt-auto w-full ${p.hot ? "bg-[#047857] text-white" : "border border-[#047857] text-[#047857]"}`}>{p.btn}</a>
              </div>
            ))}
          </div>
          <p className="text-center mt-7 text-base text-[#334155]">Not sure yet? <b className="text-[#047857]">Your first 8 pages are free</b> — no account, no card.</p>
        </div>
      </section>

      {/* ─── GROUPED FAQ ─────────────────────────────── */}
      <section id="faq" className="py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <SecHead eyebrow="FAQ" title="More questions? More answers." />
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {faqGroups.map((g) => (
              <div key={g.title}>
                <h3 className="text-[15px] font-extrabold uppercase tracking-[0.1em] text-[#047857] mb-[18px]">{g.title}</h3>
                {g.items.map((f) => (
                  <div key={f.q} className="border-t border-[#e2e8f0] py-[18px]">
                    <h4 className="text-[16.5px] font-extrabold tracking-tight text-[#0f172a] mb-1.5">{f.q}</h4>
                    <p className="text-[15px] text-[#64748b] leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-[18px] bg-[#0f172a] px-7 py-7 sm:px-9 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-white font-display font-bold text-lg">Still have questions?</p>
              <p className="text-[#cbd5e1] text-sm mt-0.5">Send us a message and we&apos;ll help you out.</p>
            </div>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-sm font-bold text-[#0f172a] whitespace-nowrap">Contact us <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* ─── BANKS — INTERNAL LINKS ──────────────────── */}
      <section className="py-20 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow>Banks</Eyebrow>
          <div className="mt-2">
            <BankLinks />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────── */}
      <section className="pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#0f172a] text-white text-center rounded-[24px] px-8 py-16">
            <h2 className="font-display text-3xl sm:text-[38px] font-extrabold tracking-tight">Try it on your own statement</h2>
            <p className="text-[#cbd5e1] text-[17px] max-w-[560px] mx-auto mt-3.5 leading-relaxed">Upload one real bank statement and judge the result yourself. First 8 pages free, no account needed.</p>
            <a href="#upload" className="inline-flex items-center gap-2 rounded-xl bg-white px-[30px] py-4 text-[17px] font-bold text-[#0f172a] whitespace-nowrap mt-[30px]">Convert free <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
