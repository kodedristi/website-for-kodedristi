/**
 * Scheduled publishing for articles.
 *
 * An article carries an optional `publishAt`. The rule is one line: it is
 * public when it is published *and* its `publishAt` is empty or already past.
 * There is no job runner and nothing to wake up — the public pages ask this
 * question every time they render, so an article appears the first time a page
 * is rebuilt after its time (the insights routes revalidate every ten
 * minutes).
 *
 * Times are Nepal Standard Time, UTC+05:45, which has no daylight saving, so
 * a plain offset is exact all year. `publishAt` is stored as the admin typed
 * it ("2026-11-16T09:00", a `datetime-local` value) and read as Nepal time.
 *
 * This file has no imports on purpose: the admin screens and the server both
 * use it, and it is small enough to test on its own.
 */

const NPT_OFFSET = "+05:45";
const NPT_OFFSET_MS = (5 * 60 + 45) * 60_000;
const DAY_MS = 86_400_000;

const LOCAL = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/** Milliseconds since the epoch for a stored `publishAt`, or null when empty or unreadable. */
export function parsePublishAt(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const v = value.trim();
  const m = v.match(LOCAL);
  const ms = m
    ? Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4] ?? "00"}:${m[5] ?? "00"}:${m[6] ?? "00"}${NPT_OFFSET}`)
    : Date.parse(v);
  return Number.isNaN(ms) ? null : ms;
}

/** True when the article may be shown now. An unreadable `publishAt` counts as no schedule. */
export function isLive(data: { publishAt?: unknown }, now: number = Date.now()): boolean {
  const at = parsePublishAt(data.publishAt);
  return at === null || at <= now;
}

/** True when the article is waiting for a future date. */
export function isScheduled(data: { publishAt?: unknown }, now: number = Date.now()): boolean {
  const at = parsePublishAt(data.publishAt);
  return at !== null && at > now;
}

/** `YYYY-MM-DD` of an instant, in Nepal. */
export function nepalDate(ms: number): string {
  return new Date(ms + NPT_OFFSET_MS).toISOString().slice(0, 10);
}

/** `YYYY-MM-DDTHH:mm` of an instant, in Nepal — the shape a `datetime-local` input wants. */
export function nepalLocalInput(ms: number): string {
  return new Date(ms + NPT_OFFSET_MS).toISOString().slice(0, 16);
}

/** "Mon, 16 Nov · 9:00 AM" — for the admin. Always Nepal time, wherever the admin is browsing from. */
export function formatNepal(ms: number): string {
  const d = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
  const t = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kathmandu",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
  return `${d} · ${t}`;
}

/** "16 Nov" — short enough for a badge. */
export function formatNepalShort(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    day: "numeric",
    month: "short",
  }).format(new Date(ms));
}

/** 9:00 the next morning, Nepal time — the default start for a new schedule. */
export function tomorrowMorning(now: number = Date.now()): string {
  const tomorrow = nepalDate(now + DAY_MS);
  return `${tomorrow}T09:00`;
}

export type PlannedPost = { slug: string; publishAt: string; date: string };

/**
 * Spaces `slugs` out, in order, `intervalDays` apart starting at `startLocal`.
 * Returns null when the start is not a readable date.
 */
export function planSchedule(
  slugs: string[],
  startLocal: string,
  intervalDays: number
): PlannedPost[] | null {
  const start = parsePublishAt(startLocal);
  if (start === null) return null;
  return slugs.map((slug, i) => {
    const at = start + i * intervalDays * DAY_MS;
    return { slug, publishAt: nepalLocalInput(at), date: nepalDate(at) };
  });
}
