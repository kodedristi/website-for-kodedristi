/**
 * Turns a stored submission row into what the admin screen shows.
 *
 * Rows come in two shapes. Current ones carry separate `email` and `phone`;
 * rows saved before those fields existed have one free-text `contact` that
 * holds either. Both are normalised here so the screen only ever deals with
 * one shape, and old enquiries keep a working "reply" link.
 */

export type SubmissionField = { key: string; label: string; value: string; long: boolean };

export type SubmissionView = {
  id: number;
  section: string;
  unread: boolean;
  /** Absolute time, fixed to Nepal time so server and browser agree. */
  createdLabel: string;
  /** "Today", "Yesterday" or a date - the group the row sits under. */
  day: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  /** The first line of what they actually asked for, for the collapsed card. */
  preview: string;
  fields: SubmissionField[];
  documentUrl?: string;
  documentName?: string;
  /** Lower-cased text of every value, for the search box. */
  searchText: string;
};

const TZ = "Asia/Kathmandu";

const LABELS: Record<string, string> = {
  service: "Service wanted",
  budget: "Budget",
  timeline: "Timeline",
  brief: "Brief",
  course: "Course",
  experience: "Experience level",
  schedule: "Preferred schedule",
  payment: "Payment status",
  partnershipType: "Partnership type",
  contribution: "Contribution expected",
  goals: "Audience / brand goals",
  title: "Proposal title",
  description: "Proposal details",
  amount: "Proposed amount (NPR)",
  product: "Product",
  interest: "Interested in",
  message: "Message",
};

/** Shown once, in the header or the contact block, so not repeated as fields. */
const SHOWN_ELSEWHERE = new Set([
  "name",
  "email",
  "phone",
  "organization",
  "contact",
  "courseSlug",
  "documentUrl",
  "documentName",
  "website",
]);

const LONG_TEXT = new Set(["brief", "message", "goals", "description", "contribution"]);

/** What to quote on the collapsed card, in order of how much it says. */
const PREVIEW_ORDER = [
  "brief",
  "message",
  "description",
  "goals",
  "contribution",
  "service",
  "course",
  "partnershipType",
  "title",
];

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date); // YYYY-MM-DD
}

function dayLabel(date: Date, now: Date): string {
  const key = dayKey(date);
  if (key === dayKey(now)) return "Today";
  if (key === dayKey(new Date(now.getTime() - 86_400_000))) return "Yesterday";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function toSubmissionView(
  row: { id: number; section: string; data: Record<string, unknown>; created_at: Date; read_at: Date | null },
  now = new Date()
): SubmissionView {
  const data = row.data ?? {};
  let email = str(data.email);
  let phone = str(data.phone);

  // Legacy rows: one `contact` field holding an email or a phone number.
  const legacy = str(data.contact);
  if (legacy && !email && !phone) {
    if (legacy.includes("@")) email = legacy;
    else phone = legacy;
  }

  const fields: SubmissionField[] = Object.entries(data)
    .filter(([k, v]) => !k.startsWith("_") && !SHOWN_ELSEWHERE.has(k) && str(v) !== "")
    .map(([key, v]) => ({
      key,
      label: LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
      value: str(v),
      long: LONG_TEXT.has(key),
    }));

  const previewKey = PREVIEW_ORDER.find((k) => str(data[k]) !== "");
  const preview = previewKey ? str(data[previewKey]) : "";

  const name = str(data.name) || str(data.title) || str(data.product) || str(data.organization) || "Submission";

  return {
    id: row.id,
    section: row.section,
    unread: !row.read_at,
    createdLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(row.created_at),
    day: dayLabel(row.created_at, now),
    name,
    email: email || undefined,
    phone: phone || undefined,
    organization: str(data.organization) || undefined,
    preview,
    fields,
    documentUrl: str(data.documentUrl) || undefined,
    documentName: str(data.documentName) || undefined,
    searchText: [name, email, phone, str(data.organization), ...fields.map((f) => f.value)]
      .join(" ")
      .toLowerCase(),
  };
}
