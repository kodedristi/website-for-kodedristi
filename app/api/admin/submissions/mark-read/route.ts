import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markSubmissionsRead } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Called by the Submissions panel once it has rendered — opening the list
 *  is what counts as reading it. */
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await markSubmissionsRead();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
