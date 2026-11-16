import { randomBytes } from "crypto";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createSignedUpload,
  putLocalStream,
  storageConfigured,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Testimonial clips are short vertical videos; this is a ceiling against a
 *  mistaken upload, not a target. Note Supabase has its own limit on top
 *  (50 MB on the free plan unless the bucket/project limit is raised). */
const MAX_VIDEO = 100 * 1024 * 1024;

const EXTENSIONS = new Set(["mp4", "webm", "mov"]);
const TYPE_TO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
/** The only filenames this route will ever write — random hex, known
 *  extension. Anything else (path separators, `..`) cannot match. */
const SAFE_NAME = /^[a-f0-9]{16}\.(mp4|webm|mov)$/;

function mb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function requireAdmin() {
  const session = await getSession();
  return session && session.role === "admin" ? session : null;
}

/**
 * Step 1 of a video upload: ask where to send the file.
 *
 * Body: `{ name, type, size }`. The file itself never passes through here when
 * Supabase is configured — see `createSignedUpload` for why. Returns
 * `{ mode: "signed", uploadUrl, publicUrl }` for the browser to PUT the file
 * to, or `{ mode: "local", uploadUrl, publicUrl }` for dev without Supabase.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, type, size } = (await request.json()) as {
      name?: string;
      type?: string;
      size?: number;
    };

    const fromName = name?.split(".").pop()?.toLowerCase() ?? "";
    const ext = EXTENSIONS.has(fromName) ? fromName : TYPE_TO_EXT[type ?? ""];
    if (!ext) {
      return NextResponse.json(
        { error: "Upload an MP4 (recommended), WebM or MOV video." },
        { status: 400 }
      );
    }
    if (typeof size === "number" && size > MAX_VIDEO) {
      return NextResponse.json(
        { error: `That video is ${mb(size)}. The limit is ${mb(MAX_VIDEO)} — compress it first.` },
        { status: 400 }
      );
    }

    const filename = `${randomBytes(8).toString("hex")}.${ext}`;

    if (storageConfigured()) {
      const { uploadUrl, publicUrl } = await createSignedUpload(filename);
      return NextResponse.json({ mode: "signed", uploadUrl, publicUrl });
    }

    return NextResponse.json({
      mode: "local",
      uploadUrl: `/api/admin/uploads/video?file=${filename}`,
      publicUrl: `/uploads/${filename}`,
    });
  } catch (err) {
    console.error("[upload/video]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}

/**
 * Step 2, local development only: receive the raw file and stream it to
 * `public/uploads`. With Supabase configured the browser uploads directly to
 * Supabase and never calls this.
 */
export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (storageConfigured()) {
    return NextResponse.json(
      { error: "Videos upload directly to storage; this endpoint is for local development." },
      { status: 400 }
    );
  }

  const file = new URL(request.url).searchParams.get("file") ?? "";
  if (!SAFE_NAME.test(file) || !request.body) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  try {
    const declared = Number(request.headers.get("content-length") ?? 0);
    const { url, bytes } = await putLocalStream(file, request.body);

    // Next buffers only the first N bytes of a body through middleware; if
    // that ever truncates a clip, fail loudly instead of saving half a video.
    if (declared && bytes !== declared) {
      await unlink(join(process.cwd(), "public", "uploads", file)).catch(() => {});
      return NextResponse.json(
        { error: "The upload was cut short. Try again, or raise proxyClientMaxBodySize in next.config.ts." },
        { status: 500 }
      );
    }
    return NextResponse.json({ url, bytes });
  } catch (err) {
    console.error("[upload/video]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
