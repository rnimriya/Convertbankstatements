"use client";

import { useState, useRef, useEffect } from "react";
import {
  User, Mail, Shield, Bell, CheckCircle2, AlertTriangle,
  ExternalLink, ChevronRight, KeyRound, Loader2, Camera,
} from "lucide-react";
import type { SubTier } from "@/types/billing";

const SECTION = "rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-sm";
const ROW = "flex items-center justify-between px-5 py-4 gap-4";
const LABEL = "text-sm font-medium text-slate-800";
const DESC = "text-xs text-slate-400 mt-0.5";

const AVATAR_KEY = "cs_avatar";

interface Props {
  userEmail: string;
  userName: string | null;
  emailVerified: boolean;
  tier: SubTier;
  onVerificationSent: () => void;
}

export function AccountSettings({ userEmail, userName, emailVerified, tier, onVerificationSent }: Props) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [sheetsConnecting, setSheetsConnecting] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifUsage, setNotifUsage] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = userName ?? userEmail.split("@")[0];
  const initial = displayName[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved) setAvatarUrl(saved);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2 MB.");
      return;
    }
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem(AVATAR_KEY, dataUrl);
      setAvatarUrl(dataUrl);
      setAvatarUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    localStorage.removeItem(AVATAR_KEY);
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendVerification = async () => {
    setSending(true);
    try {
      await fetch("/api/auth/send-verification", { method: "POST" });
      setSent(true);
      onVerificationSent();
    } finally { setSending(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password.");
      setPwMsg({ type: "success", text: "Password updated successfully." });
      setOldPw(""); setNewPw("");
      setChangingPw(false);
    } catch (err: unknown) {
      setPwMsg({ type: "error", text: err instanceof Error ? err.message : "Failed." });
    } finally { setPwLoading(false); }
  };

  const connectSheets = async () => {
    setSheetsConnecting(true);
    try {
      const res = await fetch("/api/google-sheets/auth-url");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setSheetsConnecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── AVATAR / PROFILE HEADER ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: avatarUrl ? undefined : "linear-gradient(135deg,#1A47C8,#3b6ef5)" }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-white">{initial}</span>
              )}
            </div>

            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-navy flex items-center justify-center shadow-lg border-2 border-white hover:bg-navy/90 transition-colors"
              title="Upload photo"
            >
              {avatarUploading
                ? <Loader2 size={13} className="text-white animate-spin" />
                : <Camera size={13} className="text-white" />
              }
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-slate-900 truncate">{displayName}</p>
            <p className="text-sm text-slate-400 truncate">{userEmail}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                tier === "BUSINESS" ? "bg-blue-100 text-blue-700" :
                tier === "PRO"      ? "bg-violet-100 text-violet-700" :
                tier === "BASIC"    ? "bg-teal-100 text-teal-700" :
                "bg-slate-100 text-slate-600"
              }`}>
                {tier}
              </span>
              {emailVerified
                ? <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 size={11} /> Verified</span>
                : <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600"><AlertTriangle size={11} /> Unverified</span>
              }
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-navy hover:bg-navy/90 transition-colors disabled:opacity-50"
            >
              {avatarUploading ? "Uploading…" : "Change photo"}
            </button>
            {avatarUrl && (
              <button
                onClick={removeAvatar}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">JPG, PNG or WebP · Max 2 MB · Stored locally in your browser</p>
      </div>

      {/* Profile */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">Profile</h2>
        <div className={SECTION}>
          <div className={ROW}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
                <User size={16} />
              </div>
              <div>
                <p className={LABEL}>Display name</p>
                <p className={DESC}>{userName ?? "Not set"}</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">Coming soon</span>
          </div>

          <div className={ROW}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
                <Mail size={16} />
              </div>
              <div>
                <p className={LABEL}>Email address</p>
                <p className={DESC}>{userEmail}</p>
              </div>
            </div>
            {emailVerified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={13} /> Verified
              </span>
            ) : sent ? (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                <CheckCircle2 size={13} /> Email sent
              </span>
            ) : (
              <button
                onClick={sendVerification}
                disabled={sending}
                className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline disabled:opacity-50"
              >
                {sending ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
                Verify email
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">Security</h2>
        <div className={SECTION}>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
                  <KeyRound size={16} />
                </div>
                <div>
                  <p className={LABEL}>Password</p>
                  <p className={DESC}>Change your account password</p>
                </div>
              </div>
              <button
                onClick={() => setChangingPw(v => !v)}
                className="text-xs font-semibold text-navy hover:underline flex items-center gap-1"
              >
                {changingPw ? "Cancel" : "Change"} <ChevronRight size={12} />
              </button>
            </div>

            {changingPw && (
              <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
                {pwMsg && (
                  <p className={`text-xs px-3 py-2 rounded-lg ${pwMsg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {pwMsg.text}
                  </p>
                )}
                <input
                  type="password"
                  placeholder="Current password"
                  value={oldPw}
                  onChange={e => setOldPw(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {pwLoading && <Loader2 size={14} className="animate-spin" />}
                  Update password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">Integrations</h2>
        <div className={SECTION}>
          <div className={ROW}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 2h8l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="#34A853" opacity="0.2"/>
                  <path d="M14 2l6 6h-6V2z" fill="#34A853"/>
                  <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#34A853"/>
                  <rect x="7" y="14" width="10" height="1.5" rx="0.75" fill="#34A853"/>
                  <rect x="7" y="17" width="6" height="1.5" rx="0.75" fill="#34A853"/>
                </svg>
              </div>
              <div>
                <p className={LABEL}>Google Sheets</p>
                <p className={DESC}>
                  {(tier === "PRO" || tier === "BUSINESS")
                    ? "Export conversions directly to your Sheets"
                    : "Upgrade to Pro to enable Google Sheets export"}
                </p>
              </div>
            </div>
            {(tier === "PRO" || tier === "BUSINESS") ? (
              sheetsConnected ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 size={13} /> Connected
                </span>
              ) : (
                <button
                  onClick={connectSheets}
                  disabled={sheetsConnecting}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  {sheetsConnecting ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
                  Connect
                </button>
              )
            ) : (
              <span className="text-xs text-slate-400">Pro required</span>
            )}
          </div>

          <div className={ROW}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path className="text-slate-500" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
                </svg>
              </div>
              <div>
                <p className={LABEL}>REST API</p>
                <p className={DESC}>
                  {tier === "BUSINESS" ? "Your API key is available below" : "Upgrade to Business for API access"}
                </p>
              </div>
            </div>
            {tier === "BUSINESS" ? (
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <KeyRound size={12} /> View key
              </button>
            ) : (
              <span className="text-xs text-slate-400">Business required</span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">Notifications</h2>
        <div className={SECTION}>
          <NotifRow
            label="Email notifications"
            description="Receive confirmations for completed conversions"
            value={notifEmail}
            onChange={setNotifEmail}
          />
          <NotifRow
            label="Usage alerts"
            description="Notify me when I reach 80% of my page limit"
            value={notifUsage}
            onChange={setNotifUsage}
          />
        </div>
      </div>

    </div>
  );
}

function NotifRow({ label, description, value, onChange }: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
          <Bell size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy/20 ${value ? "bg-navy" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
