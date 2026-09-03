"use client";

import { useState, type FormEvent } from "react";
import { CheckmarkCircle02Icon, Loading01Icon, SentIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { solutions } from "@/lib/data/solutions";
import { courses } from "@/lib/data/courses";

type Reason = "project" | "course" | "partnership" | "proposal";

const REASONS: { key: Reason; label: string }[] = [
  { key: "project", label: "Project Enquiry" },
  { key: "course", label: "Course Application" },
  { key: "partnership", label: "Partnership / Sponsorship" },
  { key: "proposal", label: "Proposal" },
];

const BUDGET_RANGES = ["Under NPR 5 lakh", "NPR 5–15 lakh", "NPR 15–40 lakh", "NPR 40 lakh+", "Not sure yet"];
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3–6 months", "Flexible"];
const PARTNERSHIP_TYPES = ["Academic partnership", "Corporate training", "Hackathon sponsorship", "Referral partnership"];

const fieldClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue";
const labelClasses = "text-sm font-medium text-text-secondary";

export function EnquiryForm({
  initialReason,
  lockReason,
  className,
}: {
  initialReason?: string;
  /** When set, the reason tabs are hidden and the form is fixed to this one
   *  kind of enquiry — used for the homepage's embedded proposal form. */
  lockReason?: Reason;
  /** Extra classes for the outer card — e.g. a solid surface where the form
   *  sits on a tinted panel and the default `card` fill would blend in. */
  className?: string;
}) {
  const [reason, setReason] = useState<Reason>(
    lockReason ?? (initialReason as Reason) ?? "project"
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(false);
    setErrorMessage(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => data.get(key)?.toString() ?? "";
    const payload: Record<string, unknown> = {
      section: reason,
      name: value("name"),
      contact: value("contact"),
      organization: value("organization"),
    };
    if (reason === "project") {
      payload.service = value("service");
      payload.budget = value("budget");
      payload.timeline = value("timeline");
      payload.brief = value("brief");
    } else if (reason === "course") {
      const courseName = value("course");
      payload.course = courseName;
      payload.courseSlug = courses.find((c) => c.name === courseName)?.slug ?? "";
      payload.experience = value("experience");
      payload.schedule = value("schedule");
      payload.payment = value("payment");
    } else if (reason === "partnership") {
      payload.partnershipType = value("partnershipType");
      payload.contribution = value("contribution");
      payload.goals = value("goals");
    } else if (reason === "proposal") {
      payload.title = value("proposalTitle");
      payload.description = value("proposalDescription");
      payload.amount = value("proposalAmount");

      const doc = data.get("proposalDocument");
      if (doc instanceof File && doc.size > 0) {
        try {
          const upload = new FormData();
          upload.append("file", doc);
          const res = await fetch("/api/contact/upload", { method: "POST", body: upload });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(json.error || "Document upload failed");
          payload.documentUrl = json.url;
          payload.documentName = json.name;
        } catch (err) {
          setStatus("idle");
          setError(true);
          setErrorMessage(err instanceof Error ? err.message : "Document upload failed.");
          return;
        }
      }
    }
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("submitted");
    } catch {
      setStatus("idle");
      setError(true);
    }
  }

  if (status === "submitted") {
    return (
      <div className={cn("flex flex-col items-center gap-3 card p-10 text-center", className)}>
        <CheckmarkCircle02Icon className="h-12 w-12 text-brand-green-hover" />
        <h3 className="text-xl font-semibold text-text-primary">Thanks — we&apos;ve got it.</h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-muted">
          A confirmation email is on its way, along with a calendar link to book a call.
          Our team typically responds within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 card p-6 sm:p-8", className)}
    >
      {!lockReason && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Reason for contact">
          {REASONS.map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={reason === r.key}
              onClick={() => setReason(r.key)}
              className={cn(
                "focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                reason === r.key
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border bg-background text-text-secondary hover:border-brand-blue/40"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" required className={fieldClasses} placeholder="Your full name" />
        </Field>
        <Field label="Work email or phone" htmlFor="contact">
          <input id="contact" name="contact" required className={fieldClasses} placeholder="you@company.com" />
        </Field>

        {reason !== "course" && (
          <Field label="Organization" htmlFor="organization">
            <input id="organization" name="organization" className={fieldClasses} placeholder="Company / institution" />
          </Field>
        )}

        {reason === "project" && (
          <>
            <Field label="Service" htmlFor="service">
              <select id="service" name="service" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select a solution
                </option>
                {solutions.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Budget range" htmlFor="budget">
              <select id="budget" name="budget" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select a range
                </option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Timeline" htmlFor="timeline">
              <select id="timeline" name="timeline" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select a timeline
                </option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Brief" htmlFor="brief" full>
              <textarea
                id="brief"
                name="brief"
                rows={4}
                className={fieldClasses}
                placeholder="What are you trying to build or solve?"
              />
            </Field>
          </>
        )}

        {reason === "course" && (
          <>
            <Field label="Selected course" htmlFor="course">
              <select id="course" name="course" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Experience level" htmlFor="experience">
              <select id="experience" name="experience" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select your level
                </option>
                <option>No prior experience</option>
                <option>Some self-taught / coursework</option>
                <option>Working professional</option>
              </select>
            </Field>
            <Field label="Preferred schedule" htmlFor="schedule">
              <input id="schedule" name="schedule" className={fieldClasses} placeholder="e.g. weekday evenings" />
            </Field>
            <Field label="Payment status" htmlFor="payment">
              <select id="payment" name="payment" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select status
                </option>
                <option>Not yet paid</option>
                <option>Deposit paid</option>
                <option>Fully paid</option>
              </select>
            </Field>
          </>
        )}

        {reason === "partnership" && (
          <>
            <Field label="Partnership type" htmlFor="partnershipType">
              <select id="partnershipType" name="partnershipType" className={fieldClasses} defaultValue="">
                <option value="" disabled>
                  Select a type
                </option>
                {PARTNERSHIP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Contribution expected" htmlFor="contribution">
              <input id="contribution" name="contribution" className={fieldClasses} placeholder="e.g. funding, mentors, venue" />
            </Field>
            <Field label="Audience / brand goals" htmlFor="goals" full>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                className={fieldClasses}
                placeholder="Who are you trying to reach, and what does success look like?"
              />
            </Field>
          </>
        )}

        {reason === "proposal" && (
          <>
            <Field label="Proposal title" htmlFor="proposalTitle">
              <input
                id="proposalTitle"
                name="proposalTitle"
                required
                className={fieldClasses}
                placeholder="What is your proposal about?"
              />
            </Field>
            <Field label="Proposal amount (NPR)" htmlFor="proposalAmount">
              <input
                id="proposalAmount"
                name="proposalAmount"
                type="text"
                className={fieldClasses}
                placeholder="e.g., 500,000 - 2,000,000"
              />
            </Field>
            <Field label="Proposal details" htmlFor="proposalDescription" full>
              <textarea
                id="proposalDescription"
                name="proposalDescription"
                required
                rows={6}
                className={fieldClasses}
                placeholder="Describe your proposal in detail — scope, timeline, deliverables and expected outcomes."
              />
            </Field>
            <Field label="Proposal document" htmlFor="proposalDocument" full>
              <input
                id="proposalDocument"
                name="proposalDocument"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.txt"
                className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-blue-hover"
              />
              <p className="text-xs text-text-muted">
                PDF, Word, PowerPoint, Excel or text — up to 10 MB. Optional.
              </p>
            </Field>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-xl border-[0.5px] border-brand-blue/30 bg-brand-blue/5 px-4 py-3 text-sm text-text-primary">
          {errorMessage ?? "Something went wrong sending your request. Please try again."}
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? (
          <>
            <Loading01Icon className="h-6 w-6 animate-spin" /> Sending
          </>
        ) : (
          <>
            {reason === "project" && "Request Proposal"}
            {reason === "course" && "Apply"}
            {reason === "partnership" && "Send Proposal Request"}
            {reason === "proposal" && "Submit Proposal"}
            <SentIcon className="h-6 w-6" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  full,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {children}
    </div>
  );
}
