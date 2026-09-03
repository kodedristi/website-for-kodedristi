import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { putUpload } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  odt: "application/vnd.oasis.opendocument.text",
  txt: "text/plain",
};

/**
 * Public endpoint the proposal form posts a document to before the enquiry
 * itself is sent. It only stores the file and hands back a URL — the URL is
 * then carried in the submission payload so the document shows up beside the
 * rest of the proposal in the admin panel.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File is too large. The limit is ${MAX_SIZE / (1024 * 1024)} MB.` },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED[ext]) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF, Word, PowerPoint, Excel or text document." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `proposal-${randomBytes(8).toString("hex")}.${ext}`;
    const url = await putUpload(filename, buffer, ALLOWED[ext]);
    return NextResponse.json({ url, name: file.name.slice(0, 200) });
  } catch (err) {
    console.error("[contact/upload]", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
