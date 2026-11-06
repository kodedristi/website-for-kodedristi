import Link from "next/link";
import { ArrowUpRight01Icon } from "hugeicons-react";
import { RANGES, deltaPercent, type RangeKey, type Suggestion } from "@/lib/traffic";
import { cn } from "@/lib/utils";

/** Server-rendered building blocks for the admin Traffic page. No client
 *  JavaScript: the charts are plain flex bars, readable without script. */

export const nf = (n: number) => n.toLocaleString("en-US");

export function duration(seconds: number | null): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function RangeTabs({ active }: { active: RangeKey }) {
  return (
    <nav aria-label="Reporting period" className="flex flex-wrap gap-2">
      {(Object.keys(RANGES) as RangeKey[]).map((key) => (
        <Link
          key={key}
          href={`/admin/traffic?range=${key}`}
          aria-current={key === active ? "page" : undefined}
          className={cn(
            "focus-ring inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
            key === active
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-border bg-surface text-text-secondary hover:border-brand-blue/40 hover:text-link"
          )}
        >
          {RANGES[key].label}
        </Link>
      ))}
    </nav>
  );
}

/** Change against the previous period. `lowerIsBetter` flips the colours for
 *  measures such as "left after one page", where a fall is good news. */
export function Delta({ current, previous, lowerIsBetter = false }: { current: number; previous: number; lowerIsBetter?: boolean }) {
  const change = deltaPercent(current, previous);
  if (change === null) return <span className="text-xs text-text-muted">no earlier data</span>;
  if (change === 0) return <span className="text-xs text-text-muted">no change</span>;
  const good = lowerIsBetter ? change < 0 : change > 0;
  return (
    <span className={cn("text-xs font-semibold", good ? "text-brand-green-hover" : "text-red-500")}>
      {change > 0 ? "▲" : "▼"} {Math.abs(change)}%
      <span className="ml-1 font-normal text-text-muted">vs previous</span>
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col gap-1 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="text-3xl font-semibold text-text-primary">{value}</p>
      {children}
      {hint && <p className="text-xs leading-relaxed text-text-muted">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("card p-6", className)}>
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Daily visitors (solid) over page views (faint). */
export function DailyChart({ data }: { data: { day: string; visitors: number; views: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  const labelEvery = data.length > 45 ? 14 : data.length > 14 ? 7 : 1;
  const total = data.reduce((s, d) => s + d.visitors, 0);
  return (
    <div>
      <div
        role="img"
        aria-label={`Daily visitors and page views over ${data.length} days, ${nf(total)} visitor-days in total`}
        className={cn("flex h-44 items-end", data.length > 45 ? "gap-px" : "gap-1")}
      >
        {data.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.visitors} visitors, ${d.views} page views`}
            className="relative flex h-full min-w-0 flex-1 items-end"
          >
            <div className="absolute inset-x-0 bottom-0 rounded-t-sm bg-brand-blue/20" style={{ height: `${(d.views / max) * 100}%` }} />
            <div className="absolute inset-x-0 bottom-0 rounded-t-sm bg-brand-blue" style={{ height: `${(d.visitors / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((d, i) => (
          <span key={d.day} className="min-w-0 flex-1 text-[10px] text-text-muted">
            {i % labelEvery === 0 ? d.day.slice(5) : ""}
          </span>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-blue" /> Visitors</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-blue/20" /> Page views</span>
        <span className="ml-auto">Peak day: {nf(max)} views</span>
      </p>
    </div>
  );
}

/** A small column chart with labelled columns, highlighting the busiest. */
export function ColumnChart({
  data,
  label,
  ariaLabel,
}: {
  data: { key: string | number; value: number }[];
  label: (key: string | number, i: number) => string;
  ariaLabel: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const top = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="flex h-28 items-end gap-1">
        {data.map((d, i) => (
          <div key={d.key} title={`${label(d.key, i)}: ${nf(d.value)} views`} className="flex h-full min-w-0 flex-1 items-end">
            <div
              className={cn("w-full rounded-t-sm", d.value === top && top > 0 ? "bg-brand-green" : "bg-brand-blue/70")}
              style={{ height: `${Math.max(d.value > 0 ? 3 : 0, (d.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((d, i) => (
          <span key={d.key} className="min-w-0 flex-1 text-center text-[10px] text-text-muted">
            {data.length > 12 ? (i % 6 === 0 ? label(d.key, i) : "") : label(d.key, i)}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A ranked list where each row's bar is its share of the largest. */
export function RankList({
  rows,
  empty = "No data in this period.",
  format = nf,
  capitalize = false,
}: {
  rows: { label: string; value: number; note?: string }[];
  empty?: string;
  format?: (n: number) => string;
  capitalize?: boolean;
}) {
  if (rows.length === 0) return <p className="text-sm text-text-muted">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={cn("truncate text-text-secondary", capitalize && "capitalize")} title={r.label}>{r.label}</span>
            <span className="shrink-0 tabular-nums font-semibold text-text-primary">
              {format(r.value)}
              {r.note && <span className="ml-1.5 text-xs font-normal text-text-muted">{r.note}</span>}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-background-secondary">
            <div className="h-full rounded-full bg-brand-blue/70" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const LEVEL_STYLE: Record<Suggestion["level"], { label: string; box: string; tag: string }> = {
  warn: { label: "Needs attention", box: "border-red-500/30 bg-red-500/5", tag: "text-red-500" },
  info: { label: "Suggestion", box: "border-brand-blue/25 bg-brand-blue/5", tag: "text-link" },
  good: { label: "Going well", box: "border-brand-green/30 bg-brand-green/5", tag: "text-brand-green-hover" },
};

export function Suggestions({ items, limit }: { items: Suggestion[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items;
  if (shown.length === 0) return <p className="text-sm text-text-muted">Nothing to flag right now.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {shown.map((s) => {
        const style = LEVEL_STYLE[s.level];
        return (
          <li key={s.id} className={cn("rounded-xl border-[0.5px] p-4", style.box)}>
            <p className={cn("text-[11px] font-semibold uppercase tracking-wider", style.tag)}>{style.label}</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{s.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{s.detail}</p>
            {s.action &&
              (s.action.external ? (
                <a
                  href={s.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-2 inline-flex items-center gap-1 text-sm font-semibold text-link"
                >
                  {s.action.label} <ArrowUpRight01Icon className="h-4 w-4" />
                </a>
              ) : (
                <Link href={s.action.href} className="focus-ring mt-2 inline-flex items-center gap-1 text-sm font-semibold text-link">
                  {s.action.label} <ArrowUpRight01Icon className="h-4 w-4" />
                </Link>
              ))}
          </li>
        );
      })}
    </ul>
  );
}
