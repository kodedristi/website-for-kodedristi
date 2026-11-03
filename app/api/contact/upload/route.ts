import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { putUpload } from "@/lib/storage";
import { allowRequest, clientIp, isSameOrigin } from "@/lib/request-guard";

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
 * The first bytes of each allowed type. The file name and the browser's
 * reported type are both chosen by the sender, so neither proves what the
 * file is; the leading bytes do. Modern Office files and ODT are zip
 * archives, legacy Office files are OLE containers.
 */
const PDF = [0x25, 0x50, 0x44, 0x46];
const ZIP = [0x50, 0x4b, 0x03, 0x04];
const OLE = [0xd0, 0xcf, 0x11, 0xe0];
const SIGNATURES: Record<string, number[][]> = {
  pdf: [PDF],
  docx: [ZIP],
  pptx: [ZIP],
  xlsx: [ZIP],
  odt: [ZIP],
  doc: [OLE],
  ppt: [OLE],
  xls: [OLE],
};

function matchesType(ext: string, bytes: Buffer): boolean {
  if (ext === "txt") return !bytes.subarray(0, 4096).includes(0); // text has no NUL bytes
  return (SIGNATURES[ext] ?? []).some((sig) => sig.every((b, i) => bytes[i] === b));
}

/**
 * Public endpoint the proposal form posts a document to before the enquiry
 * itself is sent. It only stores the file and hands back a URL — the URL is
 * then carried in the submission payload so the document shows up beside the
 * rest of the proposal in the admin panel.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }
  // Uploads are the heaviest thing an anonymous visitor can ask of us.
  const ip = clientIp(request);
  if (ip && !allowRequest(`upload:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again in a few minutes." },
      { status: 429 }
    );
  }

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
    if (!matchesType(ext, buffer)) {
      return NextResponse.json(
        { error: "That file doesn't look like a real ." + ext + " document." },
        { status: 400 }
      );
    }
    const filename = `proposal-${randomBytes(8).toString("hex")}.${ext}`;
    const url = await putUpload(filename, buffer, ALLOWED[ext]);
    return NextResponse.json({ url, name: file.name.slice(0, 200) });
  } catch (err) {
    console.error("[contact/upload]", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
