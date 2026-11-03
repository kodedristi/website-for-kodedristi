/**
 * Validation for the public enquiry forms.
 *
 * Pure functions with no Node imports, so the browser forms and the API route
 * run the same rules: what the form accepts is exactly what the server will,
 * and the server never trusts that the form ran at all.
 *
 * The route stores only the fields listed in `FIELDS`. Before this, it saved
 * whatever keys a request carried, so anyone could write arbitrary data into
 * the admin's inbox.
 */

export const SECTIONS = ["project", "course", "partnership", "proposal", "product_talk"] as const;
export type Section = (typeof SECTIONS)[number];

type FieldSpec = { key: string; max: number; required?: boolean };

const COMMON: FieldSpec[] = [
  { key: "name", max: 100, required: true },
  { key: "email", max: 254, required: true },
  { key: "phone", max: 30, required: true },
  { key: "organization", max: 150 },
];

const FIELDS: Record<Section, FieldSpec[]> = {
  project: [
    ...COMMON,
    { key: "service", max: 150 },
    { key: "budget", max: 60 },
    { key: "timeline", max: 60 },
    { key: "brief", max: 3000 },
  ],
  course: [
    ...COMMON,
    { key: "course", max: 200, required: true },
    { key: "courseSlug", max: 200 },
    { key: "experience", max: 80 },
    { key: "schedule", max: 200 },
    { key: "payment", max: 80 },
  ],
  partnership: [
    ...COMMON,
    { key: "partnershipType", max: 100 },
    { key: "contribution", max: 500 },
    { key: "goals", max: 3000 },
  ],
  proposal: [
    ...COMMON,
    { key: "title", max: 200, required: true },
    { key: "description", max: 5000, required: true },
    { key: "amount", max: 100 },
    { key: "documentUrl", max: 600 },
    { key: "documentName", max: 200 },
  ],
  product_talk: [
    ...COMMON,
    { key: "product", max: 150, required: true },
    { key: "interest", max: 100 },
    { key: "message", max: 3000 },
  ],
};

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/** Control characters (other than newline and tab) have no place in a form
 *  answer and can corrupt how the admin renders or exports it. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/** Spaces, dashes, dots and brackets are dropped and a leading + is kept:
 *  `+977 98-1234-5678` becomes `+9779812345678`. */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/[^\d]/g, "");
}

/** 7-15 digits is the range real phone numbers fall in (E.164 caps at 15). */
export function isValidPhone(phone: string): boolean {
  return /^\+?\d{7,15}$/.test(normalizePhone(phone));
}

export const FIELD_MESSAGES = {
  name: "Please enter your full name.",
  email: "Enter a valid email address, like name@gmail.com.",
  phone: "Enter a valid phone number with 7 to 15 digits, for example +977 98XXXXXXXX.",
  required: "This field is required.",
  links: "Please remove some links — a few are fine, long lists are not.",
} as const;

const LINK_RE = /(https?:\/\/|www\.)/gi;

/** Free text with a pile of links is the shape of spam; a couple are normal. */
function tooManyLinks(text: string): boolean {
  return (text.match(LINK_RE) ?? []).length > 3;
}

/** Only files this site's own upload endpoint produced may be attached - an
 *  arbitrary URL there would show up in the admin as a trusted "Download". */
function isOwnUpload(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  const base = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  return Boolean(base && url.startsWith(`${base}/storage/v1/object/public/`));
}

export type ValidationResult =
  | { ok: true; section: Section; data: Record<string, string> }
  | { ok: false; fields: Record<string, string> };

export function validateSubmission(section: Section, input: Record<string, unknown>): ValidationResult {
  const data: Record<string, string> = {};
  const fields: Record<string, string> = {};

  for (const spec of FIELDS[section]) {
    const value = cleanText(input[spec.key], spec.max);
    if (!value) {
      if (spec.required) fields[spec.key] = spec.key in FIELD_MESSAGES ? FIELD_MESSAGES[spec.key as keyof typeof FIELD_MESSAGES] : FIELD_MESSAGES.required;
      continue;
    }
    data[spec.key] = value;
  }

  if (data.email) {
    data.email = data.email.toLowerCase();
    if (!isValidEmail(data.email)) fields.email = FIELD_MESSAGES.email;
  }
  if (data.phone) {
    if (isValidPhone(data.phone)) data.phone = normalizePhone(data.phone);
    else fields.phone = FIELD_MESSAGES.phone;
  }
  if (data.documentUrl && !isOwnUpload(data.documentUrl)) {
    delete data.documentUrl;
    delete data.documentName;
  }
  for (const key of ["brief", "message", "goals", "description", "contribution"]) {
    if (data[key] && tooManyLinks(data[key])) fields[key] = FIELD_MESSAGES.links;
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, section, data };
}

export function isSection(value: unknown): value is Section {
  return typeof value === "string" && (SECTIONS as readonly string[]).includes(value);
}
