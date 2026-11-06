import { getSiteSettings } from "@/lib/content/resolvers";
import { SITE_URL, absoluteUrl, toIsoDate } from "@/lib/content/seo";

/** The brand mark, absolute. Used for the Schema.org logo/image fields and
 *  as the share-card fallback where a page has no image of its own. */
const LOGO_URL = `${SITE_URL}/images/logo.png`;

const ORG_NAME = "KodeDristi Software";

/** We serve clients from anywhere, so the service area is the world rather
 *  than a list of countries - a list would read as a limit. */
const SERVICE_AREA = [{ "@type": "Place", name: "Worldwide" }];

type JsonLdNode = { "@type": string | string[]; [key: string]: unknown };

/**
 * Renders one or more schema.org nodes as a single JSON-LD block.
 *
 * Search engines only read the block when it carries `@context` and `@type`;
 * without them it is ignored as unstructured text, so they are added here
 * rather than left to every caller to remember. A plain `<script>` is used
 * instead of `next/script` (which is for executable code, and dedupes by
 * `id` - several blocks sharing one id would collapse into the first).
 * `<` is escaped so CMS text containing `</script>` cannot break out of the
 * tag.
 */
export function JsonLd({ schema }: { schema: JsonLdNode | JsonLdNode[] }) {
  const nodes = Array.isArray(schema) ? schema : [schema];
  const json = JSON.stringify(
    nodes.map((node) => ({ "@context": "https://schema.org", ...node }))
  ).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/**
 * Structured data reads the same `site-settings` row the footer does, so a
 * phone number changed in the admin is corrected in search results too
 * rather than being a fourth copy nobody remembers to update.
 */
export async function OrganizationJsonLd() {
  const settings = await getSiteSettings();
  const sameAs = [settings.facebook, settings.instagram, settings.tiktok, settings.linkedin]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u));
  return (
    <JsonLd
      schema={{
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: settings.companyName,
        alternateName: ["Kodedristi", "KodeDristi Software Pvt. Ltd."],
        url: SITE_URL,
        logo: LOGO_URL,
        image: LOGO_URL,
        description:
          "IT and software company in Kathmandu, Nepal: custom software, web and mobile apps, ERP, CRM and accounting software, SaaS, AI automation, software outsourcing, white-label development and applied IT courses.",
        areaServed: SERVICE_AREA,
        availableLanguage: ["English", "Nepali"],
        knowsAbout: [
          "IT services",
          "Custom software development",
          "ERP software",
          "CRM software",
          "HR and payroll software",
          "Accounting and billing software",
          "Web application development",
          "Mobile app development",
          "SaaS product development",
          "Artificial intelligence and automation",
          "Software outsourcing",
          "White-label software development",
          "UI/UX design",
          "Cloud and DevOps",
          "IT training",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
        contactPoint: {
          "@type": "ContactPoint",
          // `tel:+9779851362001` -> `+9779851362001`. The stored href is
          // what a phone dials, which is the same digits schema.org wants.
          telephone: settings.phoneHref.replace(/^tel:/, "") || settings.phone,
          contactType: "customer service",
        },
        sameAs,
      }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  url,
  level,
  image,
}: {
  name: string;
  description: string;
  url: string;
  level?: string;
  image?: string;
}) {
  return (
    <JsonLd
      schema={{
        "@type": "Course",
        name,
        description,
        provider: {
          "@type": "Organization",
          name: ORG_NAME,
          sameAs: SITE_URL,
        },
        url,
        ...(image ? { image: absoluteUrl(image) } : {}),
        educationalLevel: level || "Intermediate",
        isAccessibleForFree: false,
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  author,
  authorUrl,
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  /** Set when `author` is a named person with a profile page; the byline is
   *  then a Person rather than the company. */
  authorUrl?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  // Dates are free text in the CMS; leave the field out rather than emit
  // something a validator rejects.
  const published = toIsoDate(datePublished);
  const modified = toIsoDate(dateModified) ?? published;
  return (
    <JsonLd
      schema={{
        "@type": "Article",
        headline: title,
        description,
        author: authorUrl
          ? { "@type": "Person", name: author, url: authorUrl, worksFor: { "@id": `${SITE_URL}/#organization` } }
          : { "@type": "Organization", name: author, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          logo: { "@type": "ImageObject", url: LOGO_URL },
        },
        ...(published ? { datePublished: published } : {}),
        ...(modified ? { dateModified: modified } : {}),
        image: image ? absoluteUrl(image) : LOGO_URL,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
      }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      schema={{
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/**
 * `trail` runs from just below the homepage down to the current page, which
 * is its last entry; "Home" is prepended here.
 */
export function BreadcrumbJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  const crumbs = [{ name: "Home", path: "/" }, ...trail];
  return (
    <JsonLd
      schema={{
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return (
    <JsonLd
      schema={{
        "@type": "Service",
        name,
        description,
        url,
        serviceType,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: SERVICE_AREA,
      }}
    />
  );
}

export function PersonJsonLd({
  name,
  jobTitle,
  description,
  image,
  url,
}: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      schema={{
        "@type": "Person",
        "@id": `${url}#person`,
        name,
        url,
        ...(jobTitle ? { jobTitle } : {}),
        ...(description ? { description } : {}),
        ...(image ? { image: absoluteUrl(image) } : {}),
        worksFor: { "@id": `${SITE_URL}/#organization` },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      schema={{
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: ORG_NAME,
        // The names Google may show above the result, in place of the domain.
        alternateName: ["Kodedristi", "Kodedristi Software Pvt. Ltd."],
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      }}
    />
  );
}
