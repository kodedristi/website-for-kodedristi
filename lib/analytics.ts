/**
 * Helpers for the first-party visitor tracker (`/api/analytics/track`).
 *
 * Pure functions with no imports, so the rules that decide "is this a real
 * person, and where did they come from" can be tested on their own.
 */

/**
 * User agents that are not a person reading the site: search and social
 * crawlers, link previewers, uptime and speed monitors, headless browsers and
 * HTTP libraries. Googlebot runs JavaScript, so without this the tracker
 * counts every crawl as a visitor.
 */
const BOT_PATTERN =
  /bot\b|bot[\/ ;)]|crawl|spider|slurp|mediapartners|facebookexternalhit|facebot|embedly|pinterest|whatsapp|telegram|discord|slack|linkedinbot|bingpreview|lighthouse|pagespeed|gtmetrix|pingdom|uptime|statuscake|monitor|headless|phantomjs|puppeteer|playwright|selenium|webdriver|curl\/|wget|python-requests|python-urllib|aiohttp|httpx|axios|node-fetch|undici|go-http-client|okhttp|java\/|libwww|apache-httpclient|scrapy|vercel/i;

/** Empty user agents are scripts, never browsers. */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}

export type Device = "mobile" | "tablet" | "desktop";

export function deviceFromUserAgent(userAgent: string | null | undefined): Device {
  const ua = userAgent ?? "";
  if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    return "tablet";
  }
  if (/mobi|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) return "mobile";
  return "desktop";
}

/**
 * The host a visitor arrived from, or null for direct visits and for
 * navigation within the site itself (a page view reached from another page
 * of ours is not a "source").
 */
export function referrerHost(referrer: unknown, ownHosts: string[]): string | null {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host) return null;
    const own = ownHosts.map((h) => h.replace(/:\d+$/, "").replace(/^www\./, "").toLowerCase());
    return own.includes(host) ? null : host.slice(0, 120);
  } catch {
    return null;
  }
}

/** A path worth recording: absolute, query and fragment dropped, bounded, and
 *  never an admin or API route. */
export function cleanPath(page: unknown): string | null {
  if (typeof page !== "string") return null;
  const path = page.split(/[?#]/)[0].trim().slice(0, 300);
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api/")) return null;
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** Visitor and session ids are random tokens we generated; anything else is
 *  someone poking the endpoint. */
export function cleanId(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9-]{8,64}$/.test(value) ? value : null;
}

/** A campaign tag such as `utm_source=facebook`. Short, printable, or dropped. */
export function cleanTag(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return /^[a-z0-9 _.\-+]{1,60}$/.test(v) ? v : null;
}

/** ISO 3166 alpha-2 from the edge's geo header, or null. */
export function cleanCountry(value: string | null | undefined): string | null {
  const v = value?.trim().toUpperCase();
  return v && /^[A-Z]{2}$/.test(v) ? v : null;
}
