import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db/schema";

function logFallback(what: string, err: unknown) {
  console.warn(`[db] "${what}" not readable from DB, using empty fallback.`, err);
}

export type DbUser = {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  google_id: string | null;
  role: string;
  created_at: Date;
  last_login_at: Date | null;
};

export type DbEnrollment = {
  id: number;
  email: string;
  course_slug: string | null;
  course_name: string;
  status: string;
  progress: number;
  enrolled_at: Date;
  updated_at: Date;
};

export async function upsertUser(input: {
  email: string;
  name?: string | null;
  avatar?: string | null;
  googleId?: string | null;
}): Promise<DbUser> {
  await ensureSchema();
  const res = await db.query<DbUser>(
    `INSERT INTO users (email, name, avatar, google_id, last_login_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (email) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, users.name),
       avatar = COALESCE(EXCLUDED.avatar, users.avatar),
       google_id = COALESCE(EXCLUDED.google_id, users.google_id),
       last_login_at = now()
     RETURNING *`,
    [input.email, input.name ?? null, input.avatar ?? null, input.googleId ?? null]
  );
  return res.rows[0];
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureSchema();
  const res = await db.query<DbUser>("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0] ?? null;
}

export async function createSubmission(
  section: string,
  data: Record<string, unknown>
): Promise<void> {
  await ensureSchema();
  await db.query("INSERT INTO contact_submissions (section, data) VALUES ($1, $2)", [
    section,
    JSON.stringify(data),
  ]);
}

/**
 * How many submissions a source (identified by its hashed address, kept in the
 * row's `_ipHash`) has sent inside a window. The database is shared by every
 * server instance, so unlike an in-memory counter this limit holds on
 * serverless hosting.
 */
export async function countRecentSubmissionsFrom(ipHash: string, minutes: number): Promise<number> {
  await ensureSchema();
  const res = await db.query<{ count: number }>(
    `SELECT count(*)::int AS count FROM contact_submissions
     WHERE data->>'_ipHash' = $1 AND created_at > now() - ($2 || ' minutes')::interval`,
    [ipHash, String(minutes)]
  );
  return res.rows[0]?.count ?? 0;
}

/** True when this email already sent the same kind of enquiry moments ago -
 *  a double-click or a retry, which should not create a second row. */
export async function hasRecentDuplicate(
  section: string,
  email: string,
  seconds: number
): Promise<boolean> {
  await ensureSchema();
  const res = await db.query(
    `SELECT 1 FROM contact_submissions
     WHERE section = $1 AND data->>'email' = $2
       AND created_at > now() - ($3 || ' seconds')::interval
     LIMIT 1`,
    [section, email, String(seconds)]
  );
  return res.rows.length > 0;
}

export async function upsertEnrollment(input: {
  email: string;
  courseSlug?: string;
  courseName: string;
}): Promise<void> {
  await ensureSchema();
  await db.query(
    `INSERT INTO user_courses (email, course_slug, course_name, status)
     VALUES ($1, $2, $3, 'applied')
     ON CONFLICT DO NOTHING`,
    [input.email, input.courseSlug ?? null, input.courseName]
  );
}

/**
 * Records one page view.
 *
 * Every view is a row. (It used to insert at most one row per IP per 30
 * minutes whatever the page, so a visitor reading ten pages counted as one
 * view of their landing page, and everyone behind a shared mobile-carrier or
 * office address counted as one person.) The only de-duplication left is a
 * 20-second window for the same visitor and page, which absorbs reloads and a
 * double-fired effect without hiding a real return to the page.
 */
export async function trackVisit(input: {
  ip: string | null;
  userAgent: string | null;
  page: string;
  referrer: string | null;
  referrerHost: string | null;
  visitorId: string;
  sessionId: string;
  device: string;
  country: string | null;
  utmSource: string | null;
  utmMedium: string | null;
}): Promise<void> {
  await ensureSchema();
  await db.query(
    `INSERT INTO visits
       (ip, user_agent, page, referrer, referrer_host, visitor_id, session_id, device, country, utm_source, utm_medium)
     SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
     WHERE NOT EXISTS (
       SELECT 1 FROM visits
       WHERE visitor_id = $6 AND page = $3 AND created_at > now() - interval '20 seconds'
     )`,
    [
      input.ip,
      input.userAgent,
      input.page,
      input.referrer,
      input.referrerHost,
      input.visitorId,
      input.sessionId,
      input.device,
      input.country,
      input.utmSource,
      input.utmMedium,
    ]
  );
}

export type Analytics = {
  /** Page views since accurate tracking began. */
  totalViews: number;
  /** Distinct visitors (by browser id) since accurate tracking began. */
  uniqueVisitors: number;
  /** Distinct sessions (a visit ends after 30 idle minutes). */
  sessions: number;
  /** Visitors with a page view in the last 5 minutes. */
  activeNow: number;
  /** Distinct visitors today / in the last 7 days. */
  today: number;
  last7Days: number;
  /** When the first accurately tracked view happened; null until one has. */
  trackingSince: Date | null;
  topPages: { page: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  devices: { device: string; visitors: number }[];
  countries: { country: string; visitors: number }[];
  daily: { day: string; visitors: number; views: number }[];
  recent: {
    id: number;
    ip: string | null;
    page: string | null;
    userAgent: string | null;
    device: string | null;
    country: string | null;
    source: string | null;
    created_at: Date;
  }[];
};

const emptyAnalytics: Analytics = {
  totalViews: 0,
  uniqueVisitors: 0,
  sessions: 0,
  activeNow: 0,
  today: 0,
  last7Days: 0,
  trackingSince: null,
  topPages: [],
  topSources: [],
  devices: [],
  countries: [],
  daily: [],
  recent: [],
};

export async function getAnalytics(): Promise<Analytics> {
  try {
    return await getAnalyticsFromDb();
  } catch (err) {
    logFallback("analytics", err);
    return emptyAnalytics;
  }
}

/**
 * Every figure is computed over rows that have a session id, i.e. recorded by
 * the current tracker. Older rows were one-per-IP-per-30-minutes and included
 * bots, so mixing them in would make the new numbers look wrong rather than
 * the old ones. A visitor is the browser id (the visit's IP is only a fallback
 * for a row with no id), and day boundaries are Nepal time.
 */
async function getAnalyticsFromDb(): Promise<Analytics> {
  await ensureSchema();
  const NEPAL = "Asia/Kathmandu";
  const person = "COALESCE(visitor_id, ip)";
  const [totals, today, last7, topPages, topSources, devices, countries, daily, recent] =
    await Promise.all([
      db.query<{ views: number; visitors: number; sessions: number; active: number; since: Date | null }>(
        `SELECT count(*)::int AS views,
                count(DISTINCT ${person})::int AS visitors,
                count(DISTINCT session_id)::int AS sessions,
                count(DISTINCT ${person}) FILTER (WHERE created_at > now() - interval '5 minutes')::int AS active,
                min(created_at) AS since
         FROM visits WHERE session_id IS NOT NULL`
      ),
      db.query<{ count: number }>(
        `SELECT count(DISTINCT ${person})::int AS count FROM visits
         WHERE session_id IS NOT NULL
           AND (created_at AT TIME ZONE $1)::date = (now() AT TIME ZONE $1)::date`,
        [NEPAL]
      ),
      db.query<{ count: number }>(
        `SELECT count(DISTINCT ${person})::int AS count FROM visits
         WHERE session_id IS NOT NULL AND created_at >= now() - interval '7 days'`
      ),
      db.query<{ page: string; views: number }>(
        `SELECT page, count(*)::int AS views FROM visits
         WHERE session_id IS NOT NULL GROUP BY page ORDER BY views DESC LIMIT 10`
      ),
      db.query<{ source: string; visitors: number }>(
        `SELECT COALESCE(NULLIF(utm_source, ''), referrer_host, 'Direct') AS source,
                count(DISTINCT ${person})::int AS visitors
         FROM visits WHERE session_id IS NOT NULL
         GROUP BY 1 ORDER BY visitors DESC LIMIT 8`
      ),
      db.query<{ device: string; visitors: number }>(
        `SELECT COALESCE(device, 'unknown') AS device, count(DISTINCT ${person})::int AS visitors
         FROM visits WHERE session_id IS NOT NULL GROUP BY 1 ORDER BY visitors DESC`
      ),
      db.query<{ country: string; visitors: number }>(
        `SELECT country, count(DISTINCT ${person})::int AS visitors
         FROM visits WHERE session_id IS NOT NULL AND country IS NOT NULL
         GROUP BY country ORDER BY visitors DESC LIMIT 8`
      ),
      db.query<{ day: string; visitors: number; views: number }>(
        `SELECT to_char(created_at AT TIME ZONE $1, 'YYYY-MM-DD') AS day,
                count(DISTINCT ${person})::int AS visitors,
                count(*)::int AS views
         FROM visits
         WHERE session_id IS NOT NULL AND created_at >= now() - interval '14 days'
         GROUP BY day ORDER BY day`,
        [NEPAL]
      ),
      db.query<Analytics["recent"][number]>(
        `SELECT id, ip, page, user_agent AS "userAgent", device, country,
                COALESCE(NULLIF(utm_source, ''), referrer_host, 'Direct') AS source, created_at
         FROM visits WHERE session_id IS NOT NULL ORDER BY id DESC LIMIT 25`
      ),
    ]);

  const t = totals.rows[0];
  return {
    totalViews: t?.views ?? 0,
    uniqueVisitors: t?.visitors ?? 0,
    sessions: t?.sessions ?? 0,
    activeNow: t?.active ?? 0,
    today: today.rows[0]?.count ?? 0,
    last7Days: last7.rows[0]?.count ?? 0,
    trackingSince: t?.since ?? null,
    topPages: topPages.rows,
    topSources: topSources.rows,
    devices: devices.rows,
    countries: countries.rows,
    daily: daily.rows,
    recent: recent.rows,
  };
}

export async function listSubmissions(): Promise<
  {
    id: number;
    section: string;
    data: Record<string, unknown>;
    created_at: Date;
    read_at: Date | null;
  }[]
> {
  try {
    await ensureSchema();
    const res = await db.query<{
      id: number;
      section: string;
      data: Record<string, unknown>;
      created_at: Date;
      read_at: Date | null;
    }>(
      "SELECT id, section, data, created_at, read_at FROM contact_submissions ORDER BY id DESC LIMIT 300"
    );
    return res.rows;
  } catch (err) {
    logFallback("submissions", err);
    return [];
  }
}

/** How many submissions no admin has opened yet — drives the sidebar badge. */
export async function countUnreadSubmissions(): Promise<number> {
  try {
    await ensureSchema();
    const res = await db.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM contact_submissions WHERE read_at IS NULL"
    );
    return res.rows[0]?.count ?? 0;
  } catch (err) {
    logFallback("unread submissions", err);
    return 0;
  }
}

/** Stamp every still-unread submission as read. Called when the admin opens
 *  the Submissions page. */
export async function markSubmissionsRead(): Promise<void> {
  await ensureSchema();
  await db.query("UPDATE contact_submissions SET read_at = now() WHERE read_at IS NULL");
}

export async function listUsersWithCourses(): Promise<
  (DbUser & { courses: DbEnrollment[] })[]
> {
  try {
    await ensureSchema();
    const users = await db.query<DbUser>("SELECT * FROM users ORDER BY created_at DESC");
    const courses = await db.query<DbEnrollment>(
      "SELECT * FROM user_courses ORDER BY enrolled_at DESC"
    );
    return users.rows.map((u) => ({
      ...u,
      courses: courses.rows.filter((c) => c.email === u.email),
    }));
  } catch (err) {
    logFallback("users", err);
    return [];
  }
}

export async function getEnrollmentsByEmail(email: string): Promise<DbEnrollment[]> {
  await ensureSchema();
  const res = await db.query<DbEnrollment>(
    "SELECT * FROM user_courses WHERE email = $1 ORDER BY enrolled_at DESC",
    [email]
  );
  return res.rows;
}
