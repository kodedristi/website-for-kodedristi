import { NextResponse } from "next/server";
import {
  countRecentSubmissionsFrom,
  createSubmission,
  getUserByEmail,
  hasRecentDuplicate,
  upsertEnrollment,
  upsertUser,
} from "@/lib/db/queries";
import { isSection, validateSubmission } from "@/lib/contact-validation";
import { allowRequest, clientIp, hashIp, isSameOrigin } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Larger than any legitimate form payload (the longest field is 5,000
 *  characters); anything bigger is not a person filling in a form. */
const MAX_BODY_BYTES = 30_000;
/** Per source: a burst limit and a daily ceiling. */
const BURST = { limit: 5, minutes: 10 };
const DAILY = { limit: 30, minutes: 24 * 60 };

function fail(error: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json({ error, ...(fields ? { fields } : {}) }, { status });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail("Request not allowed.", 403);
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail("Unsupported request.", 415);
  }
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return fail("Request too large.", 413);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("Request too large.", 413);

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: a field real visitors never see. A bot that fills it gets the
  // same "ok" a person would, so it has nothing to learn from and retry on.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isSection(body.section)) return fail("Invalid section.", 400);
  const result = validateSubmission(body.section, body);
  if (!result.ok) return fail("Please check the highlighted fields.", 422, result.fields);
  const { section, data } = result;

  const ip = clientIp(req);
  const ipHash = ip ? hashIp(ip) : null;
  if (ipHash && !allowRequest(`submit:${ipHash}`, BURST.limit, BURST.minutes * 60_000)) {
    return fail("Too many requests. Please try again in a few minutes.", 429);
  }

  try {
    if (ipHash) {
      const [burst, daily] = await Promise.all([
        countRecentSubmissionsFrom(ipHash, BURST.minutes),
        countRecentSubmissionsFrom(ipHash, DAILY.minutes),
      ]);
      if (burst >= BURST.limit || daily >= DAILY.limit) {
        return fail("Too many requests. Please try again later.", 429);
      }
    }

    // A double-click or a retry: report success without a second row.
    if (await hasRecentDuplicate(section, data.email, 120)) {
      return NextResponse.json({ ok: true });
    }

    await createSubmission(section, {
      ...data,
      // Underscore keys are bookkeeping for the rate limit and abuse review;
      // the admin screen does not show them.
      ...(ipHash ? { _ipHash: ipHash } : {}),
      _ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
    });

    if (section === "course") {
      let user = await getUserByEmail(data.email);
      // No name here: a form answer must not overwrite the display name of an
      // existing account that happens to share the email.
      if (!user) user = await upsertUser({ email: data.email });
      await upsertEnrollment({
        email: data.email,
        courseSlug: data.courseSlug || undefined,
        courseName: data.course || "Course",
      });
    }
  } catch (err) {
    console.error("[contact/submit]", err);
    return fail("We couldn't save your request. Please try again.", 500);
  }

  return NextResponse.json({ ok: true });
}
