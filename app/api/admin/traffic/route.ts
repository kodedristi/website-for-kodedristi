import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTrafficReport } from "@/lib/db/traffic";
import { parseRange, suggest } from "@/lib/traffic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The full traffic report and its suggestions as JSON. Admin only. */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const range = parseRange(new URL(req.url).searchParams.get("range"));
    const report = await getTrafficReport(range);
    const suggestions = suggest(report, {
      googleAnalyticsConnected: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()),
    });
    return NextResponse.json({ report, suggestions });
  } catch {
    return NextResponse.json({ error: "Failed to load traffic report" }, { status: 500 });
  }
}
