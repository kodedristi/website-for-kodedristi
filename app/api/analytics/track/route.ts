import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/db/queries";
import { allowRequest, clientIp, isSameOrigin } from "@/lib/request-guard";
import {
  cleanCountry,
  cleanId,
  cleanPath,
  cleanTag,
  deviceFromUserAgent,
  isBot,
  referrerHost,
} from "@/lib/analytics";
import { SITE_URL } from "@/lib/content/seo";

export const runtime = "nodejs";

/** Hosts that count as "our own site" when deciding whether a referrer is a
 *  traffic source: the configured site, the request's own host, the bare and
 *  www forms of the domain, and the local dev server. */
function ownHosts(req: Request): string[] {
  const hosts = ["kodedristi.com", "www.kodedristi.com", "localhost"];
  try {
    hosts.push(new URL(SITE_URL).host);
  } catch {
    // SITE_URL is validated at startup; nothing to add.
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) hosts.push(host);
  return hosts;
}

/**
 * Records a page view for the admin dashboard.
 *
 * The response never tells the caller why a view was ignored. A bot, a
 * malformed body and a rate-limited burst all answer 200/202 the same way, so
 * the endpoint reveals nothing a script could use to tune itself, and a real
 * visitor's console never shows an error for analytics.
 */
export async function POST(req: Request) {
  const ok = NextResponse.json({ ok: true });

  if (!isSameOrigin(req)) return ok;

  const userAgent = req.headers.get("user-agent");
  if (isBot(userAgent)) return ok;

  const ip = clientIp(req);
  // A real person does not view more than a couple of pages a second; this
  // stops a script filling the table without touching ordinary browsing.
  if (!allowRequest(`track:${ip ?? "unknown"}`, 90, 60_000)) return ok;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return ok;

  const page = cleanPath(body.page);
  const visitorId = cleanId(body.visitorId);
  const sessionId = cleanId(body.sessionId);
  // Without all three it is not a page view from our tracker.
  if (!page || !visitorId || !sessionId) return ok;

  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

  try {
    await trackVisit({
      ip,
      userAgent: userAgent ? userAgent.slice(0, 400) : null,
      page,
      referrer,
      referrerHost: referrerHost(referrer, ownHosts(req)),
      visitorId,
      sessionId,
      device: deviceFromUserAgent(userAgent),
      // Set by Vercel's edge from the connecting address; absent elsewhere.
      country: cleanCountry(req.headers.get("x-vercel-ip-country")),
      utmSource: cleanTag(body.utmSource),
      utmMedium: cleanTag(body.utmMedium),
    });
  } catch {
    // Analytics is fire-and-forget. A 500 here surfaces in every visitor's
    // console and in error monitoring for something the client can neither
    // retry nor act on, and a page view is not "failed" because we couldn't
    // record it. 202 says "received, not persisted", which is the truth.
    return NextResponse.json({ ok: false }, { status: 202 });
  }
  return ok;
}
