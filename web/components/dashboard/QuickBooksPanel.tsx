"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpenCheck, Loader2, Plug, Unplug } from "lucide-react";

interface Status {
  configured: boolean;
  connected: boolean;
  realmId: string | null;
  environment: string;
}

export function QuickBooksPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [accountId, setAccountId] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/quickbooks/status");
      const data = await res.json();
      if (res.ok) setStatus(data as Status);
    } catch {
      /* non-critical */
    }
    setAccountId(localStorage.getItem("qb_bank_account_id") ?? "");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function disconnect() {
    setBusy(true);
    try {
      await fetch("/api/quickbooks/disconnect", { method: "POST" });
      await load();
    } catch {
      /* non-fatal */
    }
    setBusy(false);
  }

  return (
    <div className="mt-6 rounded-2xl border border-brand-border bg-brand-surface p-5">
      <div className="flex items-center gap-2">
        <BookOpenCheck size={17} className="text-emerald-600" />
        <h3 className="font-bold text-brand-text">QuickBooks Online — direct connect</h3>
      </div>

      {status === null ? (
        <p className="mt-2 text-sm text-brand-muted flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Checking connection…
        </p>
      ) : !status.configured ? (
        <div className="mt-2 text-sm text-brand-muted leading-relaxed space-y-2">
          <p>
            Send converted transactions straight into QuickBooks Online — no QBO file to
            download and import by hand.
          </p>
          <p className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-3.5 py-2.5 text-amber-800 dark:text-amber-300">
            One-time setup by the site owner: register an app at developer.intuit.com, then set
            QB_CLIENT_ID, QB_CLIENT_SECRET and QB_REDIRECT_URI
            (https://convertstatement.online/api/quickbooks/callback) in the project environment.
            The Connect button appears here as soon as those are in place.
          </p>
        </div>
      ) : status.connected ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
            ✓ Connected to QuickBooks company {status.realmId} ({status.environment})
          </p>
          <div>
            <label className="text-sm text-brand-muted block mb-1.5">
              QuickBooks bank account ID for pushed transactions
            </label>
            <input
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                localStorage.setItem("qb_bank_account_id", e.target.value);
              }}
              placeholder="e.g. 35 (Chart of Accounts → account → ID in the URL)"
              className="w-full sm:w-96 rounded-xl border border-brand-border bg-brand-bg px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <p className="mt-1.5 text-xs text-brand-muted">
              After a conversion, use “Send to QuickBooks” on the result to push the transactions
              into this account.
            </p>
          </div>
          <button
            onClick={disconnect}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Unplug size={14} />} Disconnect
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-brand-muted leading-relaxed">
            Send converted transactions straight into QuickBooks Online — no QBO file to
            download and import by hand.
          </p>
          <a
            href="/api/quickbooks/connect"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Plug size={14} /> Connect QuickBooks
          </a>
        </div>
      )}
    </div>
  );
}
