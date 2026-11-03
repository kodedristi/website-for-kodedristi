import { createHash } from "node:crypto";

/**
 * Small request-hygiene helpers shared by the public form endpoints.
 *
 * None of these is a substitute for the others: the origin check stops other
 * websites from driving a visitor's browser at the endpoint, the limiter
 * slows a script that talks to it directly, and the hash lets abuse be
 * counted per source without keeping anyone's raw address.
 */

/**
 * True unless the browser says the request came from a different site.
 *
 * Browsers always send `Origin` on a cross-site POST, so a mismatch is a
 * reliable signal; a missing header (curl, a server) is let through here and
 * left to the rate limit, since a missing header cannot be a victim's browser.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string | null {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

/** A stable, non-reversible token for an address - enough to count repeats
 *  from one source without storing the address itself. */
export function hashIp(ip: string): string {
  const salt = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

const buckets = new Map<string, number[]>();

/**
 * Best-effort per-process limiter. On serverless each instance has its own
 * memory, so this only catches bursts that land on one instance - the form
 * endpoint therefore also counts recent rows in the database, which is
 * shared. Returns true when the call is allowed.
 */
export function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  // Keep the map from growing without bound on a long-lived server.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}
