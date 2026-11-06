/**
 * Traffic insights: reporting periods, comparison, and the suggestions the
 * admin page shows. Pure functions with no imports, so they can be tested
 * without a database.
 */

export const RANGES = {
  today: { label: "Today", days: 1 },
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  "90d": { label: "90 days", days: 90 },
} as const;

export type RangeKey = keyof typeof RANGES;
export const DEFAULT_RANGE: RangeKey = "7d";

export function parseRange(value: unknown): RangeKey {
  return typeof value === "string" && value in RANGES ? (value as RangeKey) : DEFAULT_RANGE;
}

/** Nepal is UTC+5:45 all year (no daylight saving). */
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60_000;

/** "2026-11-06": the calendar date in Nepal for an instant. */
export function nepalDate(at: Date): string {
  return new Date(at.getTime() + NEPAL_OFFSET_MS).toISOString().slice(0, 10);
}

/** The instant a Nepal calendar day begins, `daysAgo` days before `now`'s. */
export function nepalDayStart(now: Date, daysAgo = 0): Date {
  const local = new Date(now.getTime() + NEPAL_OFFSET_MS);
  const midnightLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - daysAgo);
  return new Date(midnightLocal - NEPAL_OFFSET_MS);
}

export type Period = {
  range: RangeKey;
  days: number;
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
};

/**
 * The period being reported and the one of equal length just before it, for
 * comparison. Whole Nepal days: "7 days" is today plus the six days before,
 * so the day in progress is included but the comparison period is complete.
 */
export function periodFor(range: RangeKey, now: Date = new Date()): Period {
  const days = RANGES[range].days;
  const from = nepalDayStart(now, days - 1);
  return { range, days, from, to: now, prevFrom: nepalDayStart(now, 2 * days - 1), prevTo: from };
}

/** Every Nepal calendar day in the period, oldest first. */
export function daysIn(period: Period): string[] {
  const out: string[] = [];
  for (let i = period.days - 1; i >= 0; i--) out.push(nepalDate(nepalDayStart(period.to, i)));
  return out;
}

/** Fills days with no visits as zeros so a chart's x-axis is continuous. */
export function fillDays(
  rows: { day: string; visitors: number; views: number }[],
  days: string[]
): { day: string; visitors: number; views: number }[] {
  const by = new Map(rows.map((r) => [r.day, r]));
  return days.map((day) => by.get(day) ?? { day, visitors: 0, views: 0 });
}

/** Percentage change from `previous` to `current`, or null when there is no
 *  previous figure to compare with (zero would be an infinite increase). */
export function deltaPercent(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function percent(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

export type Totals = {
  views: number;
  visitors: number;
  sessions: number;
  /** Sessions with exactly one page view. */
  singlePageSessions: number;
  /** Mean time between first and last view, for sessions with more than one. */
  avgSessionSeconds: number | null;
};

export type Ranked = { label: string; visitors: number };

export type TrafficReport = {
  period: Period;
  trackingSince: Date | null;
  activeNow: number;
  current: Totals;
  previous: Totals;
  newVisitors: number;
  returningVisitors: number;
  daily: { day: string; visitors: number; views: number }[];
  hourly: { hour: number; views: number }[];
  weekday: { dow: number; views: number }[];
  topPages: { page: string; views: number; visitors: number }[];
  entryPages: { page: string; sessions: number; singlePage: number }[];
  exitPages: { page: string; sessions: number }[];
  channels: { channel: string; visitors: number; sessions: number }[];
  sources: { source: string; visitors: number; sessions: number }[];
  campaigns: { source: string; medium: string; visitors: number; sessions: number }[];
  devices: Ranked[];
  countries: Ranked[];
  browsers: Ranked[];
  systems: Ranked[];
  sections: { section: string; views: number; visitors: number }[];
  /** Sessions that opened the Contact page, and enquiries sent, in the period. */
  contact: { sessionsViewedContact: number; enquiries: number };
  recent: {
    id: number;
    page: string | null;
    source: string | null;
    device: string | null;
    country: string | null;
    created_at: Date;
  }[];
};

export type Suggestion = {
  id: string;
  level: "warn" | "info" | "good";
  title: string;
  detail: string;
  action?: { label: string; href: string; external?: boolean };
};

/** Behavioural suggestions need enough visitors to mean anything. */
export const MIN_VISITORS_FOR_SUGGESTIONS = 30;

const LEVEL_ORDER = { warn: 0, info: 1, good: 2 } as const;

function hourLabel(h: number): string {
  return `${String(h % 24).padStart(2, "0")}:00`;
}

/**
 * What to do about the numbers.
 *
 * Every suggestion states the figure it is based on, and none is shown
 * without enough data behind it: with fewer than MIN_VISITORS_FOR_SUGGESTIONS
 * visitors the only advice given is to keep collecting, plus setup steps that
 * do not depend on behaviour. Ordered most urgent first.
 */
export function suggest(report: TrafficReport, opts: { googleAnalyticsConnected: boolean }): Suggestion[] {
  const out: Suggestion[] = [];
  const { current: cur, previous: prev } = report;

  if (!opts.googleAnalyticsConnected) {
    out.push({
      id: "ga-not-connected",
      level: "info",
      title: "Google Analytics is not connected",
      detail:
        "The figures here come from the site's own tracker. A Google Analytics 4 property adds audience and conversion reports too: create one, then set NEXT_PUBLIC_GA_MEASUREMENT_ID (the G-… ID) in your hosting settings and redeploy. It loads only for visitors who accept cookies.",
    });
  }

  if (cur.visitors < MIN_VISITORS_FOR_SUGGESTIONS) {
    out.unshift({
      id: "low-data",
      level: "info",
      title: "Not enough visitors yet to draw conclusions",
      detail: `${cur.visitors} visitor${cur.visitors === 1 ? "" : "s"} in this period. Advice about behaviour needs ${MIN_VISITORS_FOR_SUGGESTIONS}+ visitors to be reliable; try a longer period or check back as traffic grows.`,
    });
    return out;
  }

  // ---- movement against the previous period
  const change = deltaPercent(cur.visitors, prev.visitors);
  if (change !== null && prev.visitors >= 20) {
    if (change <= -25) {
      out.push({
        id: "traffic-down",
        level: "warn",
        title: `Visitors are down ${Math.abs(change)}% on the previous period`,
        detail: `${cur.visitors} visitors against ${prev.visitors}. Check Google Search Console for lost rankings or indexing errors, and whether a campaign or post that drove traffic has ended.`,
        action: { label: "Open Search Console", href: "https://search.google.com/search-console", external: true },
      });
    } else if (change >= 25) {
      out.push({
        id: "traffic-up",
        level: "good",
        title: `Visitors are up ${change}% on the previous period`,
        detail: `${cur.visitors} visitors against ${prev.visitors}. Find what changed (a post, a campaign, a ranking) in the sources below, and do more of it.`,
      });
    }
  }

  // ---- do people look further than the first page?
  if (cur.sessions >= 20) {
    const single = percent(cur.singlePageSessions, cur.sessions);
    if (single >= 65) {
      const worst = [...report.entryPages]
        .filter((p) => p.sessions >= 5)
        .sort((a, b) => b.singlePage / b.sessions - a.singlePage / a.sessions || b.sessions - a.sessions)[0];
      out.push({
        id: "high-single-page",
        level: "warn",
        title: `${single}% of visits end after one page`,
        detail: worst
          ? `The page where this happens most is ${worst.page} (${percent(worst.singlePage, worst.sessions)}% of its ${worst.sessions} visits leave straight away). Give it a clear next step: a link to a related page and a contact button.`
          : "Give your most-visited pages a clear next step: a link to a related page and a contact button.",
        action: { label: "Edit pages", href: "/admin/pages" },
      });
    }
  }

  const topEntry = report.entryPages[0];
  if (topEntry && cur.sessions >= 20 && percent(topEntry.sessions, cur.sessions) >= 40 && topEntry.page !== "/") {
    out.push({
      id: "one-page-brings-visitors",
      level: "info",
      title: `${percent(topEntry.sessions, cur.sessions)}% of visits start on one page`,
      detail: `${topEntry.page} is where most visitors first arrive. Make sure it links to your services and has a way to get in touch; it is doing the work of a homepage.`,
    });
  }

  // ---- from interest to enquiry
  const { sessionsViewedContact: viewedContact, enquiries } = report.contact;
  if (viewedContact >= 10 && enquiries / viewedContact < 0.1) {
    out.push({
      id: "contact-drop-off",
      level: "warn",
      title: "Visitors open Contact but few send an enquiry",
      detail: `${viewedContact} visits opened the Contact page and ${enquiries} enquir${enquiries === 1 ? "y was" : "ies were"} sent. Try the form on a phone: check it is short, that required fields are clear, and that the confirmation is obvious.`,
      action: { label: "Open submissions", href: "/admin/submissions" },
    });
  } else if (viewedContact === 0 && cur.sessions >= 50) {
    out.push({
      id: "contact-unseen",
      level: "warn",
      title: "Almost nobody opens the Contact page",
      detail: `None of ${cur.sessions} visits reached /contact. Add a visible "Talk to us" button to the header and to the end of your service pages.`,
    });
  }

  // ---- where visitors come from
  const channelShare = (name: string) => {
    const total = report.channels.reduce((s, c) => s + c.visitors, 0);
    return percent(report.channels.find((c) => c.channel === name)?.visitors ?? 0, total);
  };
  const direct = channelShare("Direct");
  const search = channelShare("Organic search");
  if (search >= 30) {
    out.push({
      id: "search-working",
      level: "good",
      title: `${search}% of visitors find you through search`,
      detail: "Search is a strong source. Keep publishing answers to the questions your customers ask, and update older articles instead of leaving them to go stale.",
    });
  } else if (direct >= 70 && search < 10) {
    out.push({
      id: "little-search",
      level: "info",
      title: "Little traffic comes from search engines",
      detail: `${direct}% of visitors arrive directly and ${search}% from search. Submit your sitemap to Google Search Console and Bing Webmaster Tools, and publish articles that target what people search for.`,
      action: { label: "Open Search Console", href: "https://search.google.com/search-console", external: true },
    });
  }
  if (report.campaigns.length === 0 && channelShare("Social") + channelShare("Referral") >= 10) {
    out.push({
      id: "tag-campaigns",
      level: "info",
      title: "Tag your links so campaigns can be measured",
      detail: "Add ?utm_source=facebook&utm_medium=social (or your own names) to links you share. Without it, visits from posts and emails are mixed in with other referrals.",
    });
  }

  // ---- who and when
  const phones = report.devices.find((d) => d.label === "mobile")?.visitors ?? 0;
  const deviceTotal = report.devices.reduce((s, d) => s + d.visitors, 0);
  if (deviceTotal >= 20 && percent(phones, deviceTotal) >= 60) {
    out.push({
      id: "mostly-mobile",
      level: "info",
      title: `${percent(phones, deviceTotal)}% of visitors are on a phone`,
      detail: "Look at your key pages on a phone before a laptop, and keep images and videos light so they load fast on mobile data.",
      action: { label: "Test page speed", href: "https://pagespeed.web.dev", external: true },
    });
  }

  const countryTotal = report.countries.reduce((s, c) => s + c.visitors, 0);
  const nepal = report.countries.find((c) => c.label === "NP")?.visitors ?? 0;
  if (countryTotal >= 20 && percent(countryTotal - nepal, countryTotal) >= 40) {
    out.push({
      id: "international-audience",
      level: "info",
      title: `${percent(countryTotal - nepal, countryTotal)}% of visitors are outside Nepal`,
      detail: "A large international audience is a reason to feature the outsourcing page and case studies prominently, and to keep content in clear English.",
      action: { label: "Outsourcing page", href: "/outsourcing", external: false },
    });
  }

  const totalViewsByHour = report.hourly.reduce((s, h) => s + h.views, 0);
  if (totalViewsByHour >= 50) {
    let best = { start: 0, views: 0 };
    for (let h = 0; h < 24; h++) {
      const views = [0, 1, 2].reduce((s, k) => s + (report.hourly.find((x) => x.hour === (h + k) % 24)?.views ?? 0), 0);
      if (views > best.views) best = { start: h, views };
    }
    if (percent(best.views, totalViewsByHour) >= 35) {
      out.push({
        id: "peak-hours",
        level: "info",
        title: `Most visits arrive between ${hourLabel(best.start)} and ${hourLabel(best.start + 3)} (Nepal time)`,
        detail: `${percent(best.views, totalViewsByHour)}% of page views fall in that window. Publish articles and send campaigns shortly before it.`,
      });
    }
  }

  const returningShare = percent(report.returningVisitors, report.newVisitors + report.returningVisitors);
  if (cur.visitors >= 50 && returningShare < 10) {
    out.push({
      id: "few-returning",
      level: "info",
      title: `Only ${returningShare}% of visitors are returning`,
      detail: "Most people visit once. Give them a reason to come back: a regular article, a newsletter sign-up, or following your social pages.",
    });
  }

  const topArticle = report.topPages.find((p) => p.page.startsWith("/insights/") && p.views >= 10);
  if (topArticle) {
    out.push({
      id: "top-article",
      level: "good",
      title: `Your most-read article is ${topArticle.page.replace("/insights/", "")}`,
      detail: `${topArticle.views} views from ${topArticle.visitors} visitors. Link to it from the homepage and the matching service page, and write a follow-up on the same topic.`,
      action: { label: "Open the article", href: topArticle.page },
    });
  }

  return out.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
}
