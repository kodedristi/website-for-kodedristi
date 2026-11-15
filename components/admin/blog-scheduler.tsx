"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, CalendarClock, Loader2 } from "lucide-react";
import {
  formatNepal,
  parsePublishAt,
  planSchedule,
  tomorrowMorning,
} from "@/lib/content/scheduling";
import { cn } from "@/lib/utils";

export type SchedulerArticle = {
  slug: string;
  title: string;
  category: string;
  published: boolean;
  publishAt: string | null;
};

type Status = "live" | "scheduled" | "draft";

function statusOf(a: SchedulerArticle, now: number): Status {
  if (!a.published) return "draft";
  const at = parsePublishAt(a.publishAt);
  return at !== null && at > now ? "scheduled" : "live";
}

const fieldClass =
  "focus-ring h-10 rounded-xl border-[0.5px] border-border bg-background px-3 text-sm text-text-primary focus-visible:border-brand-blue";
const smallButton =
  "focus-ring inline-flex h-8 items-center rounded-full border border-border bg-background px-3 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-blue hover:text-link disabled:opacity-50";

/**
 * Blog scheduling: space a queue of articles out on a fixed rhythm.
 *
 * Only articles that are not live yet can be queued (drafts, and ones already
 * scheduled — which is how a schedule is changed). The preview shows the exact
 * Nepal-time date each one will get before anything is saved; the server
 * recomputes the same dates from the start time and interval.
 */
export function BlogScheduler({
  articles,
  nowMs,
}: {
  articles: SchedulerArticle[];
  /** Server time when the page rendered, so first paint matches on both sides. */
  nowMs: number;
}) {
  const router = useRouter();

  const candidates = useMemo(() => {
    const waiting = articles.filter((a) => statusOf(a, nowMs) !== "live");
    // Already-scheduled articles keep their current order; drafts follow.
    return [...waiting].sort((a, b) => {
      const at = parsePublishAt(a.publishAt);
      const bt = parsePublishAt(b.publishAt);
      if (at !== null && bt !== null) return at - bt;
      if (at !== null) return -1;
      if (bt !== null) return 1;
      return 0;
    });
  }, [articles, nowMs]);

  const counts = useMemo(() => {
    const c = { live: 0, scheduled: 0, draft: 0 };
    for (const a of articles) c[statusOf(a, nowMs)] += 1;
    return c;
  }, [articles, nowMs]);

  const firstScheduled = candidates.find((a) => statusOf(a, nowMs) === "scheduled");
  const [queue, setQueue] = useState<string[]>(() => candidates.map((a) => a.slug));
  const [selected, setSelected] = useState<Set<string>>(() => new Set(candidates.map((a) => a.slug)));
  const [start, setStart] = useState(
    () => firstScheduled?.publishAt?.slice(0, 16) ?? tomorrowMorning(nowMs)
  );
  const [interval, setIntervalDays] = useState("3");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const bySlug = useMemo(() => new Map(articles.map((a) => [a.slug, a])), [articles]);
  const chosen = queue.filter((s) => selected.has(s));
  const days = Number(interval);
  const intervalOk = Number.isInteger(days) && days >= 1 && days <= 60;
  // Cheap enough to compute on every render; the React Compiler memoises it.
  const plan = intervalOk && chosen.length > 0 ? planSchedule(chosen, start, days) : null;
  const planBySlug = new Map((plan ?? []).map((p) => [p.slug, p]));
  const startsInPast = parsePublishAt(start) !== null && parsePublishAt(start)! <= nowMs;

  function move(slug: string, dir: -1 | 1) {
    setQueue((q) => {
      const i = q.indexOf(slug);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= q.length) return q;
      const next = [...q];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function toggle(slug: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function call(body: Record<string, unknown>, label: string) {
    setBusy(label);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blog/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; scheduled?: unknown[] };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      return json;
    } finally {
      setBusy(null);
    }
  }

  async function schedule() {
    try {
      const json = await call(
        { action: "schedule", slugs: chosen, start, intervalDays: days },
        "schedule"
      );
      setMessage({
        kind: "ok",
        text: `Scheduled ${json.scheduled?.length ?? chosen.length} article${chosen.length === 1 ? "" : "s"}. They go live automatically — nothing else to do.`,
      });
      router.refresh();
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message });
    }
  }

  async function single(slug: string, action: "publish-now" | "draft") {
    try {
      await call({ action, slug }, `${action}-${slug}`);
      setMessage({
        kind: "ok",
        text: action === "publish-now" ? "Published now." : "Moved to drafts.",
      });
      router.refresh();
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message });
    }
  }

  return (
    <section
      aria-labelledby="schedule-heading"
      className="rounded-2xl border-[0.5px] border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-amber-light text-brand-amber-text">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h2 id="schedule-heading" className="text-base font-semibold text-text-primary">
              Schedule posts
            </h2>
            <p className="mt-0.5 max-w-xl text-sm text-text-muted">
              Queue articles and space them out — for example one every 3 days. Each goes live by itself
              at the time shown (Nepal time); the site checks on every page build, so allow up to ten
              minutes.
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs font-semibold">
          <li className="rounded-full bg-brand-green/10 px-3 py-1.5 text-brand-green-hover">{counts.live} live</li>
          <li className="rounded-full bg-brand-amber/10 px-3 py-1.5 text-brand-amber-text">{counts.scheduled} scheduled</li>
          <li className="rounded-full bg-background-secondary px-3 py-1.5 text-text-muted">{counts.draft} draft{counts.draft === 1 ? "" : "s"}</li>
        </ul>
      </div>

      {candidates.length === 0 ? (
        <p className="mt-5 rounded-xl bg-background-secondary px-4 py-3 text-sm text-text-muted">
          Nothing to schedule: every article is already live. Create a new article, or move one to drafts,
          and it will appear here.
        </p>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,16rem)_8rem_1fr] sm:items-end">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text-secondary">
              First article goes live
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-text-secondary">
              Days apart
              <input
                type="number"
                min={1}
                max={60}
                value={interval}
                onChange={(e) => setIntervalDays(e.target.value)}
                className={cn(fieldClass, !intervalOk && "border-red-500/60")}
              />
            </label>
            <p className="text-xs text-text-muted sm:pb-2.5">
              {plan && plan.length > 0
                ? `${plan.length} article${plan.length === 1 ? "" : "s"} · last one on ${formatNepal(parsePublishAt(plan[plan.length - 1].publishAt)!).split(" · ")[0]}`
                : "Tick the articles to include."}
            </p>
          </div>

          {startsInPast && (
            <p className="mt-3 rounded-xl border-[0.5px] border-brand-amber/40 bg-brand-amber/10 px-4 py-2.5 text-xs text-brand-amber-text">
              That start time has already passed, so the first article will go live immediately.
            </p>
          )}

          <ol className="mt-4 divide-y divide-border overflow-hidden rounded-xl border-[0.5px] border-border">
            {queue.map((slug, i) => {
              const a = bySlug.get(slug);
              if (!a) return null;
              const planned = planBySlug.get(slug);
              const status = statusOf(a, nowMs);
              const current = parsePublishAt(a.publishAt);
              return (
                <li
                  key={slug}
                  className={cn(
                    "flex flex-wrap items-center gap-x-4 gap-y-2 bg-background px-4 py-3",
                    !selected.has(slug) && "opacity-55"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(slug)}
                    onChange={() => toggle(slug)}
                    aria-label={`Include ${a.title}`}
                    className="h-4 w-4 shrink-0 rounded border-border accent-brand-blue"
                  />
                  <span className="w-7 shrink-0 text-xs tabular-nums text-text-muted">{selected.has(slug) ? chosen.indexOf(slug) + 1 : "–"}</span>
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block truncate text-sm font-semibold text-text-primary">{a.title}</span>
                    <span className="block truncate text-xs text-text-muted">
                      {a.category || "No topic"} ·{" "}
                      {status === "scheduled" && current !== null
                        ? `currently ${formatNepal(current)}`
                        : "draft"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-text-secondary">
                    {selected.has(slug) && planned
                      ? formatNepal(parsePublishAt(planned.publishAt)!)
                      : "Not scheduled"}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <button type="button" onClick={() => move(slug, -1)} disabled={i === 0} aria-label="Move earlier" className={cn(smallButton, "w-8 justify-center px-0")}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(slug, 1)} disabled={i === queue.length - 1} aria-label="Move later" className={cn(smallButton, "w-8 justify-center px-0")}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => single(slug, "publish-now")} disabled={busy !== null} className={smallButton}>
                      Publish now
                    </button>
                    {status === "scheduled" && (
                      <button type="button" onClick={() => single(slug, "draft")} disabled={busy !== null} className={smallButton}>
                        Move to drafts
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={schedule}
              disabled={busy !== null || chosen.length === 0 || !plan}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-60"
            >
              {busy === "schedule" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
              Schedule {chosen.length} article{chosen.length === 1 ? "" : "s"}
            </button>
            <p className="text-xs text-text-muted">The order above is the publishing order. Use the arrows to change it.</p>
          </div>
        </>
      )}

      {message && (
        <p
          role="status"
          className={cn(
            "mt-4 rounded-xl border-[0.5px] px-4 py-3 text-sm",
            message.kind === "ok"
              ? "border-brand-green/30 bg-brand-green/10 font-medium text-brand-green-hover"
              : "border-red-500/30 bg-red-500/5 text-text-primary"
          )}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
