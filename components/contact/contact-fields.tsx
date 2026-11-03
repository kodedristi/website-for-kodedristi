"use client";

import { cn } from "@/lib/utils";
import {
  FIELD_MESSAGES,
  isValidEmail,
  isValidPhone,
} from "@/lib/contact-validation";

/** Shared by the enquiry form and the product-talk form so the two cannot
 *  drift apart on what they ask for or how they check it. */

export const fieldClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue aria-[invalid=true]:border-red-600";
export const labelClasses = "text-sm font-medium text-text-secondary";

export type FieldErrors = Record<string, string>;

export function Field({
  label,
  htmlFor,
  children,
  full,
  required,
  error,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  full?: boolean;
  /** Adds the visible asterisk; the input carries the real `required`. */
  required?: boolean;
  error?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-red-600">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Name, email and phone - all required - plus the optional organisation.
 * `idPrefix` keeps ids unique when two forms share a page.
 */
export function ContactDetailsFields({
  idPrefix = "",
  errors,
  organization = true,
}: {
  idPrefix?: string;
  errors: FieldErrors;
  organization?: boolean;
}) {
  const id = (name: string) => `${idPrefix}${name}`;
  const describe = (name: string) => (errors[name] ? `${id(name)}-error` : undefined);

  return (
    <>
      <Field label="Full name" htmlFor={id("name")} required error={errors.name}>
        <input
          id={id("name")}
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className={fieldClasses}
          placeholder="Your full name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describe("name")}
        />
      </Field>
      <Field label="Email address" htmlFor={id("email")} required error={errors.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          className={fieldClasses}
          placeholder="you@gmail.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describe("email")}
        />
      </Field>
      <Field label="Phone number" htmlFor={id("phone")} required error={errors.phone}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          required
          maxLength={30}
          autoComplete="tel"
          inputMode="tel"
          className={fieldClasses}
          placeholder="+977 98XXXXXXXX"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describe("phone")}
        />
      </Field>
      {organization && (
        <Field label="Organization" htmlFor={id("organization")} error={errors.organization}>
          <input
            id={id("organization")}
            name="organization"
            maxLength={150}
            autoComplete="organization"
            className={fieldClasses}
            placeholder="Company / institution"
          />
        </Field>
      )}
    </>
  );
}

/**
 * A field real visitors never see or reach. Automated form-fillers fill every
 * input they find; the server drops anything that comes in with this one set.
 * Moved off-screen rather than `display: none`, which some bots skip.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Client-side check of the three required contact fields. The server runs
 *  the same rules; this is only so the visitor hears about it before sending. */
export function checkContactDetails(values: { name: string; email: string; phone: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = FIELD_MESSAGES.name;
  if (!isValidEmail(values.email.trim().toLowerCase())) errors.email = FIELD_MESSAGES.email;
  if (!isValidPhone(values.phone)) errors.phone = FIELD_MESSAGES.phone;
  return errors;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fields?: FieldErrors };

export async function postSubmission(payload: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: FieldErrors };
    return {
      ok: false,
      message: json.error ?? "Something went wrong sending your request. Please try again.",
      fields: json.fields,
    };
  } catch {
    return { ok: false, message: "We couldn't reach the server. Check your connection and try again." };
  }
}
