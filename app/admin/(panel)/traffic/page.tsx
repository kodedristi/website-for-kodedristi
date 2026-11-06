import { getTrafficReport } from "@/lib/db/traffic";
import { parseRange, percent, suggest, type TrafficReport } from "@/lib/traffic";
import {
  ColumnChart,
  DailyChart,
  Delta,
  Panel,
  RangeTabs,
  RankList,
  StatCard,
  Suggestions,
  duration,
  nf,
} from "@/components/admin/traffic/traffic-widgets";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const nepalTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kathmandu",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function perSession(t: { views: number; sessions: number }): number {
  return t.sessions > 0 ? Math.round((t.views / t.sessions) * 10) / 10 : 0;
}

export default async function AdminTrafficPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const sp = await searchParams;
  const range = parseRange(Array.isArray(sp.range) ? sp.range[0] : sp.range);

  let report: TrafficReport | null = null;
  try {
    report = await getTrafficReport(range);
  } catch (err) {
    console.error("[traffic] report failed", err);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Insights</p>
          <h1 className="mt-1 text-2xl font-semibold text-text-primary">Traffic</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Who visits, where they come from, what they read and what to do about it. Real visitors only:
            bots, crawlers and speed tests are excluded. Days and hours are Nepal time.
          </p>
        </div>
        <RangeTabs active={range} />
      </header>

      {!report ? (
        <p className="rounded-xl border-[0.5px] border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-text-primary">
          The traffic report could not be loaded. The database may be unreachable; try again in a moment.
        </p>
      ) : (
        <Report report={report} />
      )}
    </div>
  );
}

function Report({ report }: { report: TrafficReport }) {
  const { current: cur, previous: prev } = report;
  const suggestions = suggest(report, {
    googleAnalyticsConnected: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()),
  });
  const singleNow = percent(cur.singlePageSessions, cur.sessions);
  const singlePrev = percent(prev.singlePageSessions, prev.sessions);
  const newShare = percent(report.newVisitors, report.newVisitors + report.returningVisitors);
  const peakHour = report.hourly.reduce((b, h) => (h.views > b.views ? h : b), report.hourly[0]);
  const sinceNote = report.trackingSince
    ? `Counting real visitors since ${report.trackingSince.toLocaleDateString("en-GB", { timeZone: "Asia/Kathmandu", day: "numeric", month: "short", year: "numeric" })}.`
    : "No tracked visits yet.";

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-border bg-surface px-3 py-1 font-semibold text-text-primary">
          <span className={report.activeNow > 0 ? "h-2 w-2 rounded-full bg-brand-green" : "h-2 w-2 rounded-full bg-text-muted/40"} />
          {report.activeNow} active now
        </span>
        <span className="text-xs text-text-muted">{sinceNote}</span>
      </div>

      <section aria-labelledby="suggestions-heading" className="flex flex-col gap-3">
        <h2 id="suggestions-heading" className="text-sm font-semibold text-text-primary">
          What to do next
        </h2>
        <Suggestions items={suggestions} />
      </section>

      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Visitors" value={nf(cur.visitors)}>
          <Delta current={cur.visitors} previous={prev.visitors} />
        </StatCard>
        <StatCard label="Page views" value={nf(cur.views)}>
          <Delta current={cur.views} previous={prev.views} />
        </StatCard>
        <StatCard label="Visits (sessions)" value={nf(cur.sessions)} hint="A visit ends after 30 minutes without activity.">
          <Delta current={cur.sessions} previous={prev.sessions} />
        </StatCard>
        <StatCard label="Pages per visit" value={String(perSession(cur))}>
          <Delta current={perSession(cur)} previous={perSession(prev)} />
        </StatCard>
        <StatCard label="Left after one page" value={`${singleNow}%`} hint="Visits that viewed a single page. Lower is better.">
          <Delta current={singleNow} previous={singlePrev} lowerIsBetter />
        </StatCard>
        <StatCard
          label="Time on site"
          value={duration(cur.avgSessionSeconds)}
          hint="Average for visits that viewed more than one page."
        />
        <StatCard
          label="New visitors"
          value={`${newShare}%`}
          hint={`${nf(report.newVisitors)} new, ${nf(report.returningVisitors)} returning.`}
        />
        <StatCard
          label="Enquiries sent"
          value={nf(report.contact.enquiries)}
          hint={`${percent(report.contact.enquiries, cur.visitors)}% of visitors.`}
        />
      </section>

      <Panel title="Visitors and page views" subtitle="Per day">
        <DailyChart data={report.daily} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Where visitors come from" subtitle="Channel of each visit's first page; visitors">
          <RankList rows={report.channels.map((c) => ({ label: c.channel, value: c.visitors, note: `${c.sessions} visits` }))} />
        </Panel>
        <Panel title="Sources" subtitle="Referring site or campaign tag">
          <RankList rows={report.sources.map((s) => ({ label: s.source, value: s.visitors, note: `${s.sessions} visits` }))} />
        </Panel>
      </div>

      <Panel
        title="Tagged campaigns"
        subtitle="Links shared with ?utm_source= and ?utm_medium="
      >
        <RankList
          rows={report.campaigns.map((c) => ({ label: `${c.source} / ${c.medium}`, value: c.visitors, note: `${c.sessions} visits` }))}
          empty="No tagged links used in this period. Add ?utm_source=facebook&utm_medium=social to links you share to measure them."
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Most viewed pages" subtitle="Page views">
          <RankList rows={report.topPages.map((p) => ({ label: p.page, value: p.views, note: `${p.visitors} visitors` }))} />
        </Panel>
        <Panel title="What people read" subtitle="Page views by section of the site">
          <RankList rows={report.sections.map((s) => ({ label: s.section, value: s.views, note: `${s.visitors} visitors` }))} />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Where visits start" subtitle="Entry pages, and how many left straight away">
          <RankList
            rows={report.entryPages.map((p) => ({
              label: p.page,
              value: p.sessions,
              note: `${percent(p.singlePage, p.sessions)}% left after 1 page`,
            }))}
          />
        </Panel>
        <Panel title="Where visits end" subtitle="Exit pages">
          <RankList rows={report.exitPages.map((p) => ({ label: p.page, value: p.sessions }))} />
        </Panel>
      </div>

      <Panel title="From visit to enquiry" subtitle="Approximate: enquiries are counted from the Submissions inbox, not matched to individual visits">
        <RankList
          rows={[
            { label: "Visits", value: cur.sessions },
            { label: "Visits that opened the Contact page", value: report.contact.sessionsViewedContact },
            { label: "Enquiries sent", value: report.contact.enquiries },
          ]}
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="When people visit"
          subtitle={`By hour, Nepal time${cur.views > 0 ? `. Busiest: ${String(peakHour.hour).padStart(2, "0")}:00` : ""}`}
        >
          <ColumnChart
            data={report.hourly.map((h) => ({ key: h.hour, value: h.views }))}
            label={(k) => `${String(k).padStart(2, "0")}h`}
            ariaLabel="Page views by hour of day in Nepal time"
          />
        </Panel>
        <Panel title="Busiest days of the week" subtitle="Page views">
          <ColumnChart
            data={report.weekday.map((d) => ({ key: d.dow, value: d.views }))}
            label={(k) => WEEKDAYS[Number(k) - 1]}
            ariaLabel="Page views by day of the week"
          />
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Panel title="Devices" subtitle="Visitors">
          <RankList capitalize rows={report.devices.map((d) => ({ label: d.label, value: d.visitors }))} />
        </Panel>
        <Panel title="Countries" subtitle="Visitors">
          <RankList rows={report.countries.map((c) => ({ label: c.label, value: c.visitors }))} empty="Country is recorded when hosted on Vercel." />
        </Panel>
        <Panel title="Browsers" subtitle="Visitors">
          <RankList rows={report.browsers.map((b) => ({ label: b.label, value: b.visitors }))} />
        </Panel>
        <Panel title="Operating systems" subtitle="Visitors">
          <RankList rows={report.systems.map((s) => ({ label: s.label, value: s.visitors }))} />
        </Panel>
      </div>

      <Panel title="Latest visits" subtitle="Most recent page views in this period (Nepal time)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
                <th className="pb-2 pr-4 font-semibold">Time</th>
                <th className="pb-2 pr-4 font-semibold">Page</th>
                <th className="pb-2 pr-4 font-semibold">Source</th>
                <th className="pb-2 pr-4 font-semibold">Device</th>
                <th className="pb-2 font-semibold">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {report.recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-text-muted">No visits in this period.</td>
                </tr>
              )}
              {report.recent.map((v) => (
                <tr key={v.id} className="text-text-secondary">
                  <td className="whitespace-nowrap py-2.5 pr-4">{nepalTime.format(new Date(v.created_at))}</td>
                  <td className="max-w-[240px] truncate py-2.5 pr-4">{v.page ?? "—"}</td>
                  <td className="max-w-[160px] truncate py-2.5 pr-4">{v.source ?? "—"}</td>
                  <td className="py-2.5 pr-4 capitalize">{v.device ?? "—"}</td>
                  <td className="py-2.5 text-text-muted">{v.country ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
