"use client";

/**
 * AutoPay Khoj — Khoj Pro checkout buttons (Day 8 prep, 2026-11-11).
 *
 * Flow mirrors the converter's RazorpayCheckout: ask our API to create
 * the subscription, then open Razorpay Checkout with its id. Success
 * copy is deliberately precise — payment in the popup is not the same
 * as Pro being on; the webhook activates Pro when Razorpay confirms
 * the charge, and the message says exactly that.
 */
import { useState } from "react";
import Link from "next/link";

type PlanKey = "khoj_monthly" | "khoj_annual";

interface RzpInstance { open(): void }
type RzpCtor = new (options: Record<string, unknown>) => RzpInstance;

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as { Razorpay?: RzpCtor }).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function KhojProCheckout() {
  const [busy, setBusy] = useState<PlanKey | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  async function start(plan: PlanKey) {
    setNote(null);
    setNeedsLogin(false);
    setBusy(plan);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("The payment window could not load. Please check your connection and try again.");

      const res = await fetch("/api/autopay-pro/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      if (!res.ok || !data?.subscriptionId) {
        throw new Error(data?.error ?? "Could not start the subscription. Please try again.");
      }

      const RazorpayCtor = (window as unknown as { Razorpay?: RzpCtor }).Razorpay;
      if (!RazorpayCtor) throw new Error("The payment window could not load. Please try again.");
      const rzp = new RazorpayCtor({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Convert Statement",
        description: plan === "khoj_monthly" ? "AutoPay Khoj Pro — Monthly (₹99/month)" : "AutoPay Khoj Pro — Yearly (₹699/year)",
        theme: { color: "#2CA01C" },
        handler: () => {
          setNote({
            ok: true,
            text: "Payment received. Khoj Pro switches on as soon as Razorpay confirms the charge — usually a few seconds. It will show as active in your account.",
          });
        },
        modal: {
          ondismiss: () => setNote({ ok: false, text: "Checkout closed — nothing was charged." }),
        },
      });
      rzp.open();
    } catch (err) {
      setNote({ ok: false, text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void start("khoj_monthly")}
          className="inline-flex items-center gap-2 rounded-full bg-[#2CA01C] px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy === "khoj_monthly" ? "Starting…" : "Go Pro — ₹99/month"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void start("khoj_annual")}
          className="inline-flex items-center gap-2 rounded-full border border-[#00573F] bg-white px-6 py-3 text-sm font-bold text-[#00573F] disabled:opacity-60"
        >
          {busy === "khoj_annual" ? "Starting…" : "Go Pro — ₹699/year"}
        </button>
      </div>
      {needsLogin && (
        <p className="mt-3 text-sm font-semibold text-[#B54708]">
          Please <Link href="/login" className="underline">log in</Link> first — Khoj Pro attaches to your
          ConvertStatement account so your alerts know where to go.
        </p>
      )}
      {note && (
        <p className={`mt-3 text-sm font-semibold ${note.ok ? "text-[#007A33]" : "text-[#B42318]"}`}>{note.text}</p>
      )}
    </div>
  );
}
