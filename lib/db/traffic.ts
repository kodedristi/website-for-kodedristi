import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db/schema";
import {
  daysIn,
  fillDays,
  periodFor,
  type Period,
  type RangeKey,
  type Totals,
  type TrafficReport,
} from "@/lib/traffic";

/**
 * Everything on the admin Traffic page, for one reporting period and the
 * period before it.
 *
 * Counts only rows from the current tracker (session_id is set); older rows
 * were one-per-IP-per-30-minutes and included bots. A visitor is the browser
 * id, with the IP only as a fallback for a row that has none. Days and hours
 * are Nepal time.
 */

const TZ = "Asia/Kathmandu";
const PERSON = "COALESCE(visitor_id, ip)";
const IN_RANGE = "session_id IS NOT NULL AND created_at >= $1 AND created_at < $2";

/** How a session's first visit is classed. Order matters: tagged campaigns
 *  win over what the referrer looks like. */
const CHANNEL_SQL = `
  CASE
    WHEN utm_medium IN ('cpc', 'ppc', 'paid', 'paidsocial', 'display') THEN 'Paid'
    WHEN utm_medium IN ('email', 'newsletter') OR utm_source IN ('email', 'newsletter') THEN 'Email'
    WHEN referrer_host ~* '(^|\\.)(google|bing|yahoo|duckduckgo|baidu|yandex|ecosia|brave)\\.' THEN 'Organic search'
    WHEN utm_medium IN ('social', 'social-media', 'sm')
      OR referrer_host ~* '(^|\\.)(facebook|fb|instagram|twitter|x|t|linkedin|lnkd|youtube|youtu|tiktok|whatsapp|messenger|pinterest|reddit|threads)\\.' THEN 'Social'
    WHEN referrer_host IS NOT NULL OR NULLIF(utm_source, '') IS NOT NULL THEN 'Referral'
    ELSE 'Direct'
  END`;

const BROWSER_SQL = `
  CASE
    WHEN user_agent ~* 'edg(e|a|ios)?/' THEN 'Edge'
    WHEN user_agent ~* 'opr/|opera' THEN 'Opera'
    WHEN user_agent ~* 'samsungbrowser' THEN 'Samsung Internet'
    WHEN user_agent ~* 'firefox|fxios' THEN 'Firefox'
    WHEN user_agent ~* 'chrome|crios' THEN 'Chrome'
    WHEN user_agent ~* 'safari' THEN 'Safari'
    ELSE 'Other'
  END`;

const SYSTEM_SQL = `
  CASE
    WHEN user_agent ~* 'android' THEN 'Android'
    WHEN user_agent ~* 'iphone|ipad|ipod' THEN 'iOS'
    WHEN user_agent ~* 'windows' THEN 'Windows'
    WHEN user_agent ~* 'mac os x|macintosh' THEN 'macOS'
    WHEN user_agent ~* 'linux|x11' THEN 'Linux'
    ELSE 'Other'
  END`;

async function totalsFor(from: Date, to: Date): Promise<Totals> {
  const res = await db.query<{
    views: number;
    visitors: number;
    sessions: number;
    single: number;
    avg_seconds: string | null;
  }>(
    `WITH s AS (
       SELECT session_id, count(*) AS views, min(created_at) AS first_at, max(created_at) AS last_at
       FROM visits WHERE ${IN_RANGE} GROUP BY session_id
     )
     SELECT COALESCE(sum(views), 0)::int AS views,
            (SELECT count(DISTINCT ${PERSON})::int FROM visits WHERE ${IN_RANGE}) AS visitors,
            count(*)::int AS sessions,
            count(*) FILTER (WHERE views = 1)::int AS single,
            avg(EXTRACT(EPOCH FROM (last_at - first_at))) FILTER (WHERE views > 1) AS avg_seconds
     FROM s`,
    [from, to]
  );
  const r = res.rows[0];
  return {
    views: r?.views ?? 0,
    visitors: r?.visitors ?? 0,
    sessions: r?.sessions ?? 0,
    singlePageSessions: r?.single ?? 0,
    avgSessionSeconds: r?.avg_seconds == null ? null : Math.round(Number(r.avg_seconds)),
  };
}

export async function getTrafficReport(range: RangeKey, now: Date = new Date()): Promise<TrafficReport> {
  await ensureSchema();
  const period: Period = periodFor(range, now);
  const args = [period.from, period.to];

  /** One row per session: where it started and who it was. */
  const firstOfSession = `
    SELECT DISTINCT ON (session_id) session_id, ${PERSON} AS person, page, utm_source, utm_medium, referrer_host, created_at
    FROM visits WHERE ${IN_RANGE}
    ORDER BY session_id, created_at, id`;

  const [
    current,
    previous,
    meta,
    people,
    daily,
    hourly,
    weekday,
    topPages,
    entry,
    exit,
    channels,
    sources,
    campaigns,
    devices,
    countries,
    browsers,
    systems,
    sections,
    contact,
    recent,
  ] = await Promise.all([
    totalsFor(period.from, period.to),
    totalsFor(period.prevFrom, period.prevTo),
    db.query<{ since: Date | null; active: number }>(
      `SELECT min(created_at) AS since,
              count(DISTINCT ${PERSON}) FILTER (WHERE created_at > now() - interval '5 minutes')::int AS active
       FROM visits WHERE session_id IS NOT NULL`
    ),
    db.query<{ new_visitors: number; returning_visitors: number }>(
      `WITH active AS (
         SELECT DISTINCT ${PERSON} AS p FROM visits WHERE ${IN_RANGE}
       ), firsts AS (
         SELECT ${PERSON} AS p, min(created_at) AS f FROM visits WHERE session_id IS NOT NULL GROUP BY 1
       )
       SELECT count(*) FILTER (WHERE f >= $1)::int AS new_visitors,
              count(*) FILTER (WHERE f < $1)::int AS returning_visitors
       FROM active JOIN firsts USING (p)`,
      args
    ),
    db.query<{ day: string; visitors: number; views: number }>(
      `SELECT to_char(created_at AT TIME ZONE '${TZ}', 'YYYY-MM-DD') AS day,
              count(DISTINCT ${PERSON})::int AS visitors, count(*)::int AS views
       FROM visits WHERE ${IN_RANGE} GROUP BY 1 ORDER BY 1`,
      args
    ),
    db.query<{ hour: number; views: number }>(
      `SELECT extract(hour FROM created_at AT TIME ZONE '${TZ}')::int AS hour, count(*)::int AS views
       FROM visits WHERE ${IN_RANGE} GROUP BY 1`,
      args
    ),
    db.query<{ dow: number; views: number }>(
      `SELECT extract(isodow FROM created_at AT TIME ZONE '${TZ}')::int AS dow, count(*)::int AS views
       FROM visits WHERE ${IN_RANGE} GROUP BY 1`,
      args
    ),
    db.query<{ page: string; views: number; visitors: number }>(
      `SELECT page, count(*)::int AS views, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} GROUP BY page ORDER BY views DESC, page LIMIT 15`,
      args
    ),
    db.query<{ page: string; sessions: number; single: number }>(
      `WITH f AS (${firstOfSession}),
            c AS (SELECT session_id, count(*) AS n FROM visits WHERE ${IN_RANGE} GROUP BY session_id)
       SELECT f.page, count(*)::int AS sessions, count(*) FILTER (WHERE c.n = 1)::int AS single
       FROM f JOIN c USING (session_id) GROUP BY f.page ORDER BY sessions DESC, f.page LIMIT 10`,
      args
    ),
    db.query<{ page: string; sessions: number }>(
      `WITH l AS (
         SELECT DISTINCT ON (session_id) session_id, page FROM visits WHERE ${IN_RANGE}
         ORDER BY session_id, created_at DESC, id DESC
       )
       SELECT page, count(*)::int AS sessions FROM l GROUP BY page ORDER BY sessions DESC, page LIMIT 10`,
      args
    ),
    db.query<{ channel: string; visitors: number; sessions: number }>(
      `WITH f AS (${firstOfSession})
       SELECT ${CHANNEL_SQL} AS channel, count(DISTINCT person)::int AS visitors, count(*)::int AS sessions
       FROM f GROUP BY 1 ORDER BY sessions DESC`,
      args
    ),
    db.query<{ source: string; visitors: number; sessions: number }>(
      `WITH f AS (${firstOfSession})
       SELECT COALESCE(NULLIF(utm_source, ''), referrer_host, 'Direct') AS source,
              count(DISTINCT person)::int AS visitors, count(*)::int AS sessions
       FROM f GROUP BY 1 ORDER BY sessions DESC, 1 LIMIT 12`,
      args
    ),
    db.query<{ source: string; medium: string; visitors: number; sessions: number }>(
      `WITH f AS (${firstOfSession})
       SELECT utm_source AS source, COALESCE(NULLIF(utm_medium, ''), '(none)') AS medium,
              count(DISTINCT person)::int AS visitors, count(*)::int AS sessions
       FROM f WHERE NULLIF(utm_source, '') IS NOT NULL
       GROUP BY 1, 2 ORDER BY sessions DESC LIMIT 10`,
      args
    ),
    db.query<{ label: string; visitors: number }>(
      `SELECT COALESCE(device, 'unknown') AS label, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} GROUP BY 1 ORDER BY visitors DESC`,
      args
    ),
    db.query<{ label: string; visitors: number }>(
      `SELECT country AS label, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} AND country IS NOT NULL GROUP BY 1 ORDER BY visitors DESC LIMIT 10`,
      args
    ),
    db.query<{ label: string; visitors: number }>(
      `SELECT ${BROWSER_SQL} AS label, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} GROUP BY 1 ORDER BY visitors DESC`,
      args
    ),
    db.query<{ label: string; visitors: number }>(
      `SELECT ${SYSTEM_SQL} AS label, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} GROUP BY 1 ORDER BY visitors DESC`,
      args
    ),
    db.query<{ section: string; views: number; visitors: number }>(
      `SELECT CASE WHEN page = '/' THEN 'Home'
                   ELSE initcap(replace(split_part(page, '/', 2), '-', ' ')) END AS section,
              count(*)::int AS views, count(DISTINCT ${PERSON})::int AS visitors
       FROM visits WHERE ${IN_RANGE} GROUP BY 1 ORDER BY views DESC LIMIT 12`,
      args
    ),
    db.query<{ viewed: number; enquiries: number }>(
      `SELECT (SELECT count(DISTINCT session_id)::int FROM visits WHERE ${IN_RANGE} AND page = '/contact') AS viewed,
              (SELECT count(*)::int FROM contact_submissions WHERE created_at >= $1 AND created_at < $2) AS enquiries`,
      args
    ),
    db.query<TrafficReport["recent"][number]>(
      `SELECT id, page, COALESCE(NULLIF(utm_source, ''), referrer_host, 'Direct') AS source, device, country, created_at
       FROM visits WHERE ${IN_RANGE} ORDER BY id DESC LIMIT 30`,
      args
    ),
  ]);

  const hours = new Map(hourly.rows.map((r) => [r.hour, r.views]));
  const dows = new Map(weekday.rows.map((r) => [r.dow, r.views]));

  return {
    period,
    trackingSince: meta.rows[0]?.since ?? null,
    activeNow: meta.rows[0]?.active ?? 0,
    current,
    previous,
    newVisitors: people.rows[0]?.new_visitors ?? 0,
    returningVisitors: people.rows[0]?.returning_visitors ?? 0,
    daily: fillDays(daily.rows, daysIn(period)),
    hourly: Array.from({ length: 24 }, (_, hour) => ({ hour, views: hours.get(hour) ?? 0 })),
    weekday: Array.from({ length: 7 }, (_, i) => ({ dow: i + 1, views: dows.get(i + 1) ?? 0 })),
    topPages: topPages.rows,
    entryPages: entry.rows.map((r) => ({ page: r.page, sessions: r.sessions, singlePage: r.single })),
    exitPages: exit.rows,
    channels: channels.rows,
    sources: sources.rows,
    campaigns: campaigns.rows,
    devices: devices.rows,
    countries: countries.rows,
    browsers: browsers.rows,
    systems: systems.rows,
    sections: sections.rows,
    contact: { sessionsViewedContact: contact.rows[0]?.viewed ?? 0, enquiries: contact.rows[0]?.enquiries ?? 0 },
    recent: recent.rows,
  };
}
