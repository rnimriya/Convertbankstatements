/**
 * QuickBooks Online connection (Intuit OAuth 2.0).
 *
 * Activation requires the site owner to register an app at
 * developer.intuit.com and set these env vars (Vercel project settings):
 *   QB_CLIENT_ID, QB_CLIENT_SECRET, QB_REDIRECT_URI
 *   (e.g. https://convertstatement.online/api/quickbooks/callback)
 *   QB_ENVIRONMENT = "sandbox" (default) or "production"
 * Until then every helper reports { configured: false } and the UI shows
 * setup instructions instead of a dead button.
 *
 * Connection storage (Redis, same pattern as portals):
 *   cs:qb:{uid} → JSON { realmId, accessToken, refreshToken, expiresAt }
 */
import { Redis } from "@upstash/redis";

export interface QbConnection {
  realmId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}

const _mem = new Map<string, QbConnection>();

function useRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let _redis: Redis | null = null;
function r(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

const KEY = (uid: string) => `cs:qb:${uid}`;

export function qbConfigured(): boolean {
  return Boolean(process.env.QB_CLIENT_ID && process.env.QB_CLIENT_SECRET && process.env.QB_REDIRECT_URI);
}

function qbEnv(): "sandbox" | "production" {
  return process.env.QB_ENVIRONMENT === "production" ? "production" : "sandbox";
}

export function qbApiBase(realmId: string): string {
  const host = qbEnv() === "production" ? "quickbooks.api.intuit.com" : "sandbox-quickbooks.api.intuit.com";
  return `https://${host}/v3/company/${realmId}`;
}

export function qbAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.QB_CLIENT_ID!,
    response_type: "code",
    scope: "com.intuit.quickbooks.accounting",
    redirect_uri: process.env.QB_REDIRECT_URI!,
    state,
  });
  return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
}

async function tokenRequest(body: URLSearchParams): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const basic = Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Intuit token request failed (${res.status}) ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function saveConnection(uid: string, conn: QbConnection): Promise<void> {
  if (useRedis()) await r().set(KEY(uid), JSON.stringify(conn));
  else _mem.set(uid, conn);
}

export async function getConnection(uid: string): Promise<QbConnection | null> {
  if (useRedis()) {
    const raw = await r().get(KEY(uid));
    if (!raw) return null;
    return (typeof raw === "string" ? JSON.parse(raw) : raw) as QbConnection;
  }
  return _mem.get(uid) ?? null;
}

export async function deleteConnection(uid: string): Promise<void> {
  if (useRedis()) await r().del(KEY(uid));
  else _mem.delete(uid);
}

export async function exchangeCode(uid: string, code: string, realmId: string): Promise<QbConnection> {
  const tokens = await tokenRequest(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.QB_REDIRECT_URI!,
    })
  );
  const conn: QbConnection = {
    realmId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
  await saveConnection(uid, conn);
  return conn;
}

/** Returns a valid access token, refreshing when expired. */
export async function freshAccessToken(uid: string): Promise<{ token: string; realmId: string } | null> {
  const conn = await getConnection(uid);
  if (!conn) return null;
  if (conn.expiresAt > Date.now() + 60_000) {
    return { token: conn.accessToken, realmId: conn.realmId };
  }
  try {
    const tokens = await tokenRequest(
      new URLSearchParams({ grant_type: "refresh_token", refresh_token: conn.refreshToken })
    );
    const updated: QbConnection = {
      realmId: conn.realmId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };
    await saveConnection(uid, updated);
    return { token: updated.accessToken, realmId: updated.realmId };
  } catch {
    return null;
  }
}

/**
 * Push converted transactions into the connected QuickBooks company:
 * money-out → Purchase (Cash), money-in → Deposit, both against the
 * bank account the user picked in the dashboard panel.
 */
export async function pushTransactions(
  uid: string,
  bankAccountId: string,
  transactions: { date: string; description: string; amount: number }[]
): Promise<{ created: number; failed: number }> {
  const auth = await freshAccessToken(uid);
  if (!auth) throw new Error("QuickBooks connection expired — please reconnect.");
  const base = qbApiBase(auth.realmId);
  let created = 0;
  let failed = 0;

  for (const t of transactions.slice(0, 200)) {
    const isOut = t.amount < 0;
    const entity = isOut
      ? {
          AccountRef: { value: bankAccountId },
          PaymentType: "Cash",
          TxnDate: t.date,
          PrivateNote: t.description.slice(0, 500),
          Line: [
            {
              DetailType: "AccountBasedExpenseLineDetail",
              Amount: Math.abs(t.amount),
              Description: t.description.slice(0, 500),
              AccountBasedExpenseLineDetail: { AccountRef: { value: bankAccountId } },
            },
          ],
        }
      : {
          DepositToAccountRef: { value: bankAccountId },
          TxnDate: t.date,
          PrivateNote: t.description.slice(0, 500),
          Line: [
            {
              DetailType: "DepositLineDetail",
              Amount: t.amount,
              Description: t.description.slice(0, 500),
              DepositLineDetail: { AccountRef: { value: bankAccountId } },
            },
          ],
        };
    try {
      const res = await fetch(`${base}/${isOut ? "purchase" : "deposit"}?minorversion=73`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(entity),
      });
      if (res.ok) created++;
      else failed++;
    } catch {
      failed++;
    }
  }
  return { created, failed };
}
