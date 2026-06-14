"use client";

import { useState, useEffect } from "react";
import { Users, Mail, X, Crown, UserPlus, Loader2 } from "lucide-react";
import type { SubTier } from "@/types/billing";
import { EmptyState } from "@/components/ui/EmptyState";

interface Member {
  id: string;
  email: string;
  name: string | null;
  role: "owner" | "member";
  joinedAt: string;
  status: "active" | "pending";
}

interface Props {
  tier: SubTier;
  userEmail: string;
}

const MAX_SEATS: Record<string, number> = { BUSINESS: 5, PRO: 0, FREE: 0 };

export function TeamPanel({ tier, userEmail }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const maxSeats = MAX_SEATS[tier] ?? 0;

  useEffect(() => {
    if (tier !== "BUSINESS") { setLoading(false); return; }
    fetch("/api/team")
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tier]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send invite.");
      setInviteMsg({ type: "success", text: `Invitation sent to ${inviteEmail}` });
      setInviteEmail("");
      setMembers(m => [...m, {
        id: data.memberId ?? Math.random().toString(),
        email: inviteEmail.trim(),
        name: null,
        role: "member",
        joinedAt: new Date().toISOString(),
        status: "pending",
      }]);
    } catch (err: unknown) {
      setInviteMsg({ type: "error", text: err instanceof Error ? err.message : "Failed." });
    } finally { setInviting(false); }
  };

  const handleRemove = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Remove ${memberEmail} from your team?`)) return;
    setRemoving(memberId);
    try {
      await fetch(`/api/team/member/${memberId}`, { method: "DELETE" });
      setMembers(m => m.filter(x => x.id !== memberId));
    } finally { setRemoving(null); }
  };

  if (tier !== "BUSINESS") {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
        <EmptyState
          icon={<Users className="h-full w-full" />}
          title="Team seats require Business plan"
          description="Upgrade to Business to add up to 5 team members and get API access."
          cta={{ label: "View Business plan", href: "#billing", variant: "primary", size: "sm" }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === "active");
  const pendingMembers = members.filter(m => m.status === "pending");
  const seatsFilled = members.length;
  const seatsLeft = maxSeats - seatsFilled;

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Seats overview */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-gray-200">Team seats</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">{seatsFilled} of {maxSeats} seats used</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{seatsLeft}</p>
            <p className="text-xs text-slate-400 dark:text-gray-500">seats remaining</p>
          </div>
        </div>

        {/* Seat usage bar */}
        <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(seatsFilled / maxSeats) * 100}%` }}
          />
        </div>
      </div>

      {/* Invite form */}
      {seatsLeft > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-slate-400" />
            Invite team member
          </h3>

          {inviteMsg && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
              inviteMsg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}>
              {inviteMsg.text}
            </div>
          )}

          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              required
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-navy/20 dark:focus:ring-brand-400/20 focus:border-navy dark:focus:border-brand-400"
            />
            <button
              type="submit"
              disabled={inviting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
            >
              {inviting ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              Send invite
            </button>
          </form>
        </div>
      )}

      {/* Members list */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
          <h3 className="font-semibold text-slate-800 dark:text-gray-200">Team members</h3>
        </div>

        {members.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400 dark:text-gray-500">
            No team members yet. Invite your first colleague above.
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {/* Owner (current user) */}
            <MemberRow
              email={userEmail}
              name={null}
              role="owner"
              status="active"
              joinedAt={new Date().toISOString()}
              onRemove={null}
              removing={false}
            />
            {members.map(m => (
              <MemberRow
                key={m.id}
                email={m.email}
                name={m.name}
                role={m.role}
                status={m.status}
                joinedAt={m.joinedAt}
                onRemove={() => handleRemove(m.id, m.email)}
                removing={removing === m.id}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function MemberRow({ email, name, role, status, joinedAt, onRemove, removing }: {
  email: string;
  name: string | null;
  role: "owner" | "member";
  status: "active" | "pending";
  joinedAt: string;
  onRemove: (() => void) | null;
  removing: boolean;
}) {
  const initial = (name ?? email)[0].toUpperCase();
  const date = new Date(joinedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-gray-300 shrink-0">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-slate-800 dark:text-gray-200 truncate">{name ?? email}</p>
          {role === "owner" && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full">
              <Crown size={9} /> Owner
            </span>
          )}
          {status === "pending" && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
              Pending
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 dark:text-gray-500">{name ? email : ""} · Joined {date}</p>
      </div>
      {onRemove && role !== "owner" && (
        <button
          onClick={onRemove}
          disabled={removing}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          title="Remove member"
        >
          {removing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
        </button>
      )}
    </div>
  );
}
