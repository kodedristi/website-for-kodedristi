import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { revalidatePublicRoutes } from "@/lib/content/revalidate";
import { listContentRaw, saveContent } from "@/lib/content/store";
import { nepalDate, parsePublishAt, planSchedule } from "@/lib/content/scheduling";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BATCH = 60;

type Body =
  | { action: "schedule"; slugs: string[]; start: string; intervalDays: number }
  | { action: "publish-now" | "draft"; slug: string };

/**
 * Scheduling for the Blog screen.
 *
 * The dates are computed here from the start time and the interval, never
 * taken from the browser, so a batch is always evenly spaced and a stale or
 * hand-edited form cannot invent a date. Each article is merged into its own
 * stored data rather than replaced, so nothing else on it is touched.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const rows = await listContentRaw("article");
    const bySlug = new Map(rows.map((r) => [r.slug, r]));

    if (body.action === "schedule") {
      const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s) => typeof s === "string") : [];
      const interval = Number(body.intervalDays);
      if (slugs.length === 0 || slugs.length > MAX_BATCH) {
        return NextResponse.json({ error: `Choose between 1 and ${MAX_BATCH} articles.` }, { status: 400 });
      }
      if (new Set(slugs).size !== slugs.length) {
        return NextResponse.json({ error: "An article was listed twice." }, { status: 400 });
      }
      if (!Number.isInteger(interval) || interval < 1 || interval > 60) {
        return NextResponse.json({ error: "Days between posts must be a whole number from 1 to 60." }, { status: 400 });
      }
      const plan = planSchedule(slugs, String(body.start), interval);
      if (!plan) {
        return NextResponse.json({ error: "Choose a valid start date and time." }, { status: 400 });
      }
      const missing = plan.filter((p) => !bySlug.has(p.slug));
      if (missing.length > 0) {
        return NextResponse.json({ error: `Unknown article: ${missing[0].slug}` }, { status: 404 });
      }
      // Articles that are already live are not part of a queue: scheduling one
      // would silently take a public page offline.
      const now = Date.now();
      const live = plan.find((p) => {
        const row = bySlug.get(p.slug)!;
        const at = parsePublishAt((row.data as { publishAt?: string }).publishAt);
        return row.published && (at === null || at <= now);
      });
      if (live) {
        return NextResponse.json(
          { error: `"${live.slug}" is already live. Only drafts and scheduled articles can be scheduled.` },
          { status: 409 }
        );
      }

      for (const p of plan) {
        const row = bySlug.get(p.slug)!;
        await saveContent({
          id: row.id,
          type: "article",
          slug: p.slug,
          data: { ...row.data, publishAt: p.publishAt, date: p.date },
          published: true,
        });
      }
      revalidatePublicRoutes();
      return NextResponse.json({ ok: true, scheduled: plan });
    }

    if (body.action === "publish-now" || body.action === "draft") {
      const row = typeof body.slug === "string" ? bySlug.get(body.slug) : undefined;
      if (!row) return NextResponse.json({ error: "Article not found." }, { status: 404 });
      const data: Record<string, unknown> = { ...row.data };
      delete data.publishAt;
      if (body.action === "publish-now") data.date = nepalDate(Date.now());
      await saveContent({
        id: row.id,
        type: "article",
        slug: row.slug!,
        data,
        published: body.action === "publish-now",
      });
      revalidatePublicRoutes();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
