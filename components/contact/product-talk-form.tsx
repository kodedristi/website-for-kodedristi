"use client";

import { useState, type FormEvent } from "react";
import { CheckmarkCircle02Icon, Loading01Icon, SentIcon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";
import {
  ContactDetailsFields,
  Field,
  Honeypot,
  checkContactDetails,
  fieldClasses,
  postSubmission,
  type FieldErrors,
} from "@/components/contact/contact-fields";

const INTERESTS = ["Live demo", "Pricing & licensing", "White-label / partnership", "Custom build like this"];

export function ProductTalkForm({ defaultProduct }: { defaultProduct?: string }) {
  const [product, setProduct] = useState(defaultProduct ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(false);
    setErrorMessage(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => data.get(key)?.toString() ?? "";

    // Same rules the server applies; this only spares the visitor a round trip.
    const problems = checkContactDetails({ name: value("name"), email: value("email"), phone: value("phone") });
    setFieldErrors(problems);
    if (Object.keys(problems).length > 0) {
      setStatus("idle");
      form.querySelector<HTMLElement>(`[name="${Object.keys(problems)[0]}"]`)?.focus();
      return;
    }

    const payload: Record<string, unknown> = {
      section: "product_talk",
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      organization: value("organization"),
      website: value("website"),
      product: value("product"),
      interest: value("interest"),
      message: value("message"),
    };
    const result = await postSubmission(payload);
    if (result.ok) {
      setStatus("submitted");
      return;
    }
    setStatus("idle");
    setError(true);
    setErrorMessage(result.message);
    if (result.fields) setFieldErrors(result.fields);
  }

  if (status === "submitted") {
    return (
      <div className="flex flex-col items-center gap-3 card p-10 text-center">
        <CheckmarkCircle02Icon className="h-12 w-12 text-brand-green-hover" />
        <h3 className="text-xl font-semibold text-text-primary">Talk booked — we&apos;re on it.</h3>
        <p className="max-w-sm text-sm leading-relaxed text-text-muted">
          A confirmation email is on its way, along with a calendar link to book your product
          call. Our team typically responds within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")} className="mt-2">
          Book another talk
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 card p-6 sm:p-8">
      <div className="relative grid gap-5 sm:grid-cols-2">
        <Honeypot />
        <ContactDetailsFields idPrefix="pt-" errors={fieldErrors} />
        <Field label="Product" htmlFor="pt-product" required error={fieldErrors.product}>
          <select
            id="pt-product"
            name="product"
            className={fieldClasses}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a product
            </option>
            {products.map((p) => (
              <option key={p.slug} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="What are you interested in?" htmlFor="pt-interest">
          <select id="pt-interest" name="interest" className={fieldClasses} defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Anything else?" htmlFor="pt-message" full error={fieldErrors.message}>
          <textarea
            id="pt-message"
            name="message"
            rows={3}
            className={fieldClasses}
            placeholder="Team size, current setup, or questions you'd like answered on the call."
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl border-[0.5px] border-brand-blue/30 bg-brand-blue/5 px-4 py-3 text-sm text-text-primary">
          {errorMessage ?? "Something went wrong booking your call. Please try again."}
        </p>
      )}
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? (
          <>
            <Loading01Icon className="h-6 w-6 animate-spin" /> Sending
          </>
        ) : (
          <>
            Book a Product Talk <SentIcon className="h-6 w-6" />
          </>
        )}
      </Button>
    </form>
  );
}
