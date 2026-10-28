"use client";

import { useEffect, useState } from "react";

import { NavUserMenu } from "./NavUserMenu";
import { NavAnonymousActions } from "./NavAnonymousActions";

type MeUser = { name?: string | null; email: string } | null;

/**
 * Session-dependent right side of the navbar, resolved client-side so public
 * pages stay statically rendered (the server navbar shell has no cookie
 * access). Static HTML shows the anonymous actions — identical to today's
 * anonymous view; logged-in visitors swap to their menu once /api/auth/me
 * resolves.
 */
export function NavSessionIsland({ signInLabel, dark = false }: { signInLabel: string; dark?: boolean }) {
  const [user, setUser] = useState<MeUser | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setUser(data?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (user === undefined || user === null) {
    return <NavAnonymousActions signInLabel={signInLabel} dark={dark} />;
  }

  const displayName = user.name ?? user.email.split("@")[0];
  const initial = displayName[0]?.toUpperCase() ?? "";
  return <NavUserMenu displayName={displayName} email={user.email} initial={initial} />;
}
