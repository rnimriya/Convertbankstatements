"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const DISMISSED_KEY = "cs-review-prompt-dismissed";
const SHOWN_KEY = "cs-review-prompt-shown";

export function ReviewPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
      if (sessionStorage.getItem(SHOWN_KEY)) return;
      sessionStorage.setItem(SHOWN_KEY, "1");
      setVisible(true);
    } catch {
      // Storage unavailable (private mode / blocked) — stay hidden
      // rather than nagging on every conversion.
      return;
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore storage errors — hiding for this render is enough.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative mt-4 rounded-2xl border border-[#D8E8D2] bg-[#EFF7ED] p-4">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss review prompt"
        className="absolute right-3 top-3 text-[#5c6f63] hover:text-[#0B1F16]"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-sm font-semibold text-[#0B1F16]">
        Did ConvertStatement save you time?
      </p>
      <p className="mt-1 pr-6 text-sm leading-relaxed text-[#5c6f63]">
        A short review helps other bookkeepers and accountants find us — it
        takes about a minute.
      </p>
      <Link
        href="/review"
        className="mt-3 inline-flex items-center rounded-full bg-[#2CA01C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007A33]"
      >
        Leave a review
      </Link>
    </div>
  );
}
