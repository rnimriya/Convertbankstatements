import type { Metadata } from "next";
import { ExternalLink, Heart, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: { absolute: "Leave a Review | Convert Statement" },
  description:
    "Thanks for using ConvertStatement. If it saved you time, a short honest review helps other bookkeepers and accountants find us.",
  alternates: { canonical: "https://www.convertstatement.online/review" },
  openGraph: {
    title: "Leave a Review | Convert Statement",
    description:
      "If ConvertStatement saved you time, a short honest review helps other bookkeepers and accountants find us.",
    url: "https://www.convertstatement.online/review",
  },
};

// Public review profiles (G2, Capterra, …).
// URLs are added here ONLY once a profile is confirmed live — never guess
// or invent a platform URL. While this list is empty, the page shows an
// honest "reviews open soon" note instead of review buttons.
const REVIEWS: { platform: string; url: string }[] = [];

export default function ReviewPage() {
  return (
    <div className="agri-sans min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EFF7ED] to-[#F7FAF5] px-6 pt-[124px] pb-16">
        <div className="relative mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#E3EDE0] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A33]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2CA01C]" />
            Reviews
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E3F2DF]">
              <Heart className="h-5 w-5 text-[#007A33]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#0B1F16] sm:text-[1.8rem]">
              Thanks for using ConvertStatement
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5c6f63]">
            We are glad ConvertStatement was part of your workflow. If it
            saved you time, we would genuinely appreciate a short, honest
            review on one of the public platforms below — it helps other
            bookkeepers and accountants find us. If something did not work
            well, we would rather hear that too: honest feedback is what
            makes the tool better.
          </p>
        </div>
      </div>

      {/* Main body */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        {REVIEWS.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEWS.map(({ platform, url }) => (
              <div
                key={platform}
                className="rounded-2xl border border-[#D8E8D2] bg-[#EFF7ED] p-6"
              >
                <p className="font-display text-lg font-bold text-[#0B1F16]">
                  {platform}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#5c6f63]">
                  Share your experience with ConvertStatement on {platform}.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007A33]"
                >
                  Review us on {platform}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#D8E8D2] bg-[#EFF7ED] p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#007A33]" />
              <div>
                <p className="font-display text-lg font-bold text-[#0B1F16]">
                  Reviews open soon
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c6f63]">
                  Our public review profiles are being set up — reviews open
                  soon. Until then, the most helpful thing you can do is tell
                  another bookkeeper about us, or send us feedback any time
                  via the{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-[#007A33] underline underline-offset-2 hover:no-underline"
                  >
                    contact page
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What to mention in a review */}
        <section className="mt-12">
          <h2 className="font-display text-lg font-bold text-[#0B1F16]">
            What to mention in a review
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5c6f63]">
            There is no script — write in your own words, and be as balanced
            as you like. Details that tend to be most useful for other
            bookkeepers and accountants reading your review:
          </p>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#5c6f63]">
            <li>Which tool or converter you used</li>
            <li>
              What you converted — for example, the type of statement and the
              format you converted it to
            </li>
            <li>The task it helped with, such as an import or a cleanup</li>
            <li>
              Anything that did not work as expected, or that you wish was
              better
            </li>
          </ul>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5c6f63]">
            Please only review ConvertStatement if you have actually used
            it, and describe your own experience.
          </p>
        </section>

        {/* Bottom note */}
        <div className="mt-12 rounded-[24px] border border-[#CBE3C4] bg-[#E3F2DF] p-5 text-sm text-[#00573F]">
          <p className="font-semibold">Prefer to talk to us directly?</p>
          <p className="mt-1">
            Send feedback, corrections, or a feature request any time via
            the{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#007A33] underline underline-offset-2 hover:no-underline"
            >
              contact page
            </Link>{" "}
            — we read every message.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
