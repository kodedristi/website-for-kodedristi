import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/resolvers";

/**
 * Canonical origin for every absolute URL the site emits — metadata base,
 * sitemap, robots, JSON-LD. One constant so a domain change is one edit.
 * Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash).
 */
/**
 * The host the site is actually served from. kodedristi.com redirects to
 * www.kodedristi.com, so www is the real address: a canonical, sitemap or
 * schema URL on the bare domain points Google at a URL that redirects away
 * from itself, and the homepage then never gets indexed.
 */
const DEFAULT_SITE_URL = "https://www.kodedristi.com";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  // A malformed value (a stray "||", a comment left inline) must not take the
  // whole build down at `new URL(SITE_URL)` — fall back to the default.
  try {
    const cleaned = raw.replace(/\/+$/, "");
    new URL(cleaned);
    return cleaned;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

/** The 1200x630 branded card from `app/opengraph-image.tsx`, used wherever a
 *  page has no artwork of its own. */
const DEFAULT_SHARE_IMAGE = "/opengraph-image";

/**
 * Builds a page's `<head>` from its CMS row, falling back to what the page
 * already declared.
 *
 * Every field is a fallback rather than an override in the other direction:
 * a page that nobody has touched in the admin keeps exactly the title and
 * description it shipped with, and filling one field in the admin changes
 * that one field only. That is what makes it safe to seed a row for every
 * page up front — thirteen empty rows change nothing until someone types
 * into them.
 *
 * `robots` is only set when the admin has ticked "hide from search engines".
 * Emitting `index, follow` explicitly the rest of the time would override
 * the site-wide default for no reason, and quietly break the day that
 * default changes.
 */
export async function buildPageMetadata(
  page: string,
  defaults: {
    title: string;
    description: string;
    path: string;
    /**
     * Set for the homepage, whose title is the whole site's title. Interior
     * pages want the root layout's "%s — KodeDristi Software" template
     * wrapped around theirs; the homepage would come out saying the company
     * name twice.
     */
    absoluteTitle?: boolean;
  }
): Promise<Metadata> {
  let seo: Awaited<ReturnType<typeof getPageSeo>> = null;
  try {
    seo = await getPageSeo(page);
  } catch {
    // Database unreachable — the shipped title is still a correct title.
  }

  const title = pick(seo?.seoTitle) ?? defaults.title;
  const description = pick(seo?.metaDescription) ?? defaults.description;
  const canonical = pick(seo?.canonicalUrl) ?? defaults.path;
  // The page's own share image when the admin has set one, otherwise the
  // brand mark — a page metadata object replaces the layout's openGraph
  // rather than deep-merging its `images`, so every page has to carry one.
  const ogImage = pick(seo?.ogImage) ?? DEFAULT_SHARE_IMAGE;

  const metadata: Metadata = {
    title: defaults.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: pageAlternates(canonical),
    openGraph: {
      title: pick(seo?.ogTitle) ?? title,
      description: pick(seo?.ogDescription) ?? description,
      url: canonical,
      type: "website",
      images: [{ url: ogImage, alt: pick(seo?.ogImageAlt) ?? title }],
    },
  };

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

/**
 * Canonical plus language alternates for one page.
 *
 * The site is published in English only, so every page declares itself as
 * the English version and as the `x-default` fallback. That is what tells
 * Google the page is meant for English speakers everywhere - Nepal and the
 * overseas clients we outsource for - rather than leaving it to guess a
 * country from the server location. When a translation is added, its URL
 * goes into `languages` here and every page picks it up.
 */
function pageAlternates(canonical: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical,
    languages: { en: canonical, "x-default": canonical },
  };
}

/** `/uploads/a.jpg` -> `https://kodedristi.com/uploads/a.jpg`. Structured data
 *  wants absolute URLs; already-absolute ones pass through untouched. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** ISO 8601 for schema.org date fields, or undefined when the CMS value is
 *  free text that does not parse - an invalid date is worse than none. */
export function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/**
 * Metadata for a CMS-driven detail page (`/insights/<slug>`, `/learn/<slug>`…).
 *
 * These used to return only a title and description, so every detail page
 * went out with no canonical and no share image: Next replaces the layout's
 * `openGraph` rather than merging into it, which left them with a bare title
 * on social cards. `image` is the item's own artwork; without one the card
 * falls back to the brand mark, as it does for the fixed pages.
 */
export function buildDetailMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Set for articles, whose OG type carries publish dates. */
  article?: { publishedTime?: string; section?: string };
}): Metadata {
  const image = pick(opts.image) ?? DEFAULT_SHARE_IMAGE;
  const publishedTime = toIsoDate(opts.article?.publishedTime);
  return {
    title: opts.title,
    description: opts.description,
    alternates: pageAlternates(opts.path),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      images: [{ url: image, alt: opts.title }],
      ...(opts.article
        ? {
            type: "article" as const,
            publishedTime,
            section: opts.article.section,
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

function pick(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
