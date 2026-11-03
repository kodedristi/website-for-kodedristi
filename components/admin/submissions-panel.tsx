"use client";

import { Fragment, useMemo, useState } from "react";
import { Building2, Check, ChevronDown, Copy, FileText, Mail, Phone, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubmissionView } from "@/lib/submissions-view";

/**
 * Each kind of enquiry has its own colour, used on the card's edge, its badge
 * and the filter chip, so a screen of mixed enquiries can be read at a
 * glance. Class names are written out in full, not built from the key,
 * because Tailwind only emits classes it can find in the source.
 */
const TYPES: Record<string, { label: string; bar: string; badge: string; dot: string }> = {
  project: {
    label: "Project enquiry",
    bar: "bg-brand-blue",
    badge: "bg-brand-blue-light text-brand-blue",
    dot: "bg-brand-blue",
  },
  course: {
    label: "Course application",
    bar: "bg-brand-green",
    badge: "bg-brand-green-light text-brand-green-hover",
    dot: "bg-brand-green",
  },
  partnership: {
    label: "Partnership",
    bar: "bg-brand-amber",
    badge: "bg-brand-amber-light text-brand-amber-text",
    dot: "bg-brand-amber",
  },
  proposal: {
    label: "Proposal",
    bar: "bg-violet-500",
    badge: "bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
  },
  product_talk: {
    label: "Product talk",
    bar: "bg-teal-500",
    badge: "bg-teal-100 text-teal-800",
    dot: "bg-teal-500",
  },
};

const FALLBACK_TYPE = {
  label: "Enquiry",
  bar: "bg-text-muted",
  badge: "bg-background-secondary text-text-secondary",
  dot: "bg-text-muted",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "project", label: "Projects" },
  { key: "course", label: "Courses" },
  { key: "partnership", label: "Partnerships" },
  { key: "proposal", label: "Proposals" },
  { key: "product_talk", label: "Product talks" },
];

const typeOf = (section: string) => TYPES[section] ?? FALLBACK_TYPE;

/** `tel:` links want digits and a leading +, nothing else. */
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard blocked (insecure context): the value is still on screen to select.
        }
      }}
      className="focus-ring inline-flex h-6 w-6 items-center justify-center rounded text-text-muted transition-colors hover:bg-background-secondary hover:text-text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand-green-hover" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function SubmissionsPanel({
  submissions,
  newCount = 0,
}: {
  submissions: SubmissionView[];
  /** How many rows were unread when this page loaded - they are marked below,
   *  and the server has already marked them read. */
  newCount?: number;
}) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: submissions.length };
    for (const s of submissions) c[s.section] = (c[s.section] ?? 0) + 1;
    return c;
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter(
      (s) =>
        (tab === "all" || s.section === tab) &&
        (!onlyNew || s.unread) &&
        (!q || s.searchText.includes(q))
    );
  }, [submissions, tab, query, onlyNew]);

  return (
    <div className="flex flex-col gap-4">
      {newCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-green/30 bg-brand-green-light px-5 py-3 text-sm font-medium text-text-primary">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-green" />
            {newCount} new enquir{newCount === 1 ? "y" : "ies"} since you last checked
          </span>
          <button
            type="button"
            onClick={() => setOnlyNew((v) => !v)}
            aria-pressed={onlyNew}
            className="focus-ring rounded-full border border-brand-green/40 bg-surface px-3 py-1 text-xs font-semibold text-brand-green-hover hover:bg-white"
          >
            {onlyNew ? "Show all" : "Show only new"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or message"
            aria-label="Search enquiries"
            className="focus-ring w-full rounded-xl border-[0.5px] border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setTab(f.key)}
              aria-pressed={tab === f.key}
              className={cn(
                "focus-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                tab === f.key
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border bg-background text-text-secondary hover:border-brand-blue/40"
              )}
            >
              {f.key !== "all" && (
                <span className={cn("h-2 w-2 rounded-full", typeOf(f.key).dot)} aria-hidden />
              )}
              {f.label} <span className="opacity-70">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
          {submissions.length === 0 ? "No enquiries yet." : "No enquiries match those filters."}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map((s, i) => {
          const t = typeOf(s.section);
          const open = expanded === s.id;
          const newDay = i === 0 || filtered[i - 1].day !== s.day;
          const subject = encodeURIComponent(`Re: your ${t.label.toLowerCase()} to Kodedristi`);
          return (
            <Fragment key={s.id}>
              {newDay && (
                <li
                  aria-hidden
                  className={cn(
                    "px-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted",
                    i !== 0 && "pt-3"
                  )}
                >
                  {s.day}
                </li>
              )}
              <li>
                <article
                  className={cn(
                    "relative overflow-hidden rounded-xl border bg-surface transition-shadow",
                    s.unread ? "border-brand-green/50 shadow-sm" : "border-border",
                    open && "shadow-md"
                  )}
                >
                  <span className={cn("absolute inset-y-0 left-0 w-1.5", t.bar)} aria-hidden />

                  <div className="flex flex-col gap-3 py-4 pl-6 pr-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", t.badge)}>
                            {t.label}
                          </span>
                          <span className="text-[11px] font-medium text-text-muted">#{s.id}</span>
                          {s.unread && (
                            <span className="rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 truncate text-base font-semibold text-text-primary">{s.name}</h3>
                        {s.organization && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text-muted">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{s.organization}</span>
                          </p>
                        )}
                      </div>
                      <time className="shrink-0 text-right text-xs text-text-muted">{s.createdLabel}</time>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                      {s.email ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-text-muted" />
                          <a href={`mailto:${s.email}?subject=${subject}`} className="font-medium text-link hover:underline">
                            {s.email}
                          </a>
                          <CopyButton value={s.email} label="email" />
                        </span>
                      ) : null}
                      {s.phone ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-text-muted" />
                          <a href={telHref(s.phone)} className="font-medium text-link hover:underline">
                            {s.phone}
                          </a>
                          <CopyButton value={s.phone} label="phone number" />
                        </span>
                      ) : null}
                    </div>

                    {s.preview && !open && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">{s.preview}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : s.id)}
                      aria-expanded={open}
                      className="focus-ring flex w-fit items-center gap-1 rounded text-sm font-semibold text-link"
                    >
                      {open ? "Hide details" : "View details"}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                    </button>
                  </div>

                  {open && (
                    <div className="border-t border-border bg-background-secondary/50 py-5 pl-6 pr-5">
                      {s.fields.length === 0 && !s.documentUrl && (
                        <p className="text-sm text-text-muted">No further details were submitted.</p>
                      )}
                      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                        {s.fields.map((f) => (
                          <div key={f.key} className={cn(f.long && "sm:col-span-2")}>
                            <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                              {f.label}
                            </dt>
                            <dd
                              className={cn(
                                "mt-1 break-words text-sm text-text-primary",
                                f.long && "whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 leading-relaxed"
                              )}
                            >
                              {f.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                        {s.email && (
                          <a
                            href={`mailto:${s.email}?subject=${subject}`}
                            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-blue-hover"
                          >
                            <Mail className="h-4 w-4" /> Reply by email
                          </a>
                        )}
                        {s.phone && (
                          <a
                            href={telHref(s.phone)}
                            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary hover:border-brand-blue/40"
                          >
                            <Phone className="h-4 w-4" /> Call
                          </a>
                        )}
                        {s.documentUrl && (
                          <a
                            href={s.documentUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary hover:border-brand-blue/40"
                          >
                            <FileText className="h-4 w-4" /> {s.documentName ?? "Download document"}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
