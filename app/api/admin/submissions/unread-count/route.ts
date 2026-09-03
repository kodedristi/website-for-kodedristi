import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { countUnreadSubmissions } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Polled by the admin sidebar so the "new submissions" badge stays live
 *  without a full page reload. */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const count = await countUnreadSubmissions();
  return NextResponse.json({ count });
}
