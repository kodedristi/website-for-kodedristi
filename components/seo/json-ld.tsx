import Script from "next/script";
import { getSiteSettings } from "@/lib/content/resolvers";
import { SITE_URL } from "@/lib/content/seo";

/** The brand mark, absolute. Used for the Schema.org logo/image fields and
 *  as the share-card fallback where a page has no image of its own. */
const LOGO_URL = `${SITE_URL}/images/logo.png`;

type OrganizationLD = {
  type: "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
};

type CourseLD = {
  type: "Course";
  name: string;
  description: string;
  provider: { name: string; sameAs: string };
  url: string;
  educationalLevel?: string;
  isAccessibleForFree?: boolean;
};

type ArticleLD = {
  type: "Article";
  headline: string;
  description: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo: { url: string } };
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
};

type FAQPageLD = {
  type: "FAQPage";
  mainEntity: {
    type: "Question";
    name: string;
    acceptedAnswer: {
      type: "Answer";
      text: string;
    };
  }[];
};

type BreadcrumbLD = {
  type: "BreadcrumbList";
  itemListElement: {
    position: number;
    name: string;
    item: string;
  }[];
};

type WebSiteLD = {
  type: "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    type: "SearchAction";
    target: string;
    "query-input": string;
  };
};

type Schema = OrganizationLD | CourseLD | ArticleLD | FAQPageLD | BreadcrumbLD | WebSiteLD;

export function JsonLd({ schema }: { schema: Schema | Schema[] }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(schema) ? schema : [schema]),
      }}
    />
  );
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
        type: "Organization",
        name: settings.companyName,
        url: SITE_URL,
        logo: LOGO_URL,
        description:
          "Software delivery, AI automation, and applied IT courses in Kathmandu, Nepal.",
        address: {
          streetAddress: settings.address,
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
        contactPoint: {
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
}: {
  name: string;
  description: string;
  url: string;
  level?: string;
}) {
  return (
    <JsonLd
      schema={{
        type: "Course",
        name,
        description,
        provider: {
          name: "KodeDristi Software",
          sameAs: SITE_URL,
        },
        url,
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
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      schema={{
        type: "Article",
        headline: title,
        description,
        author: { name: author },
        publisher: {
          name: "KodeDristi Software",
          logo: { url: LOGO_URL },
        },
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || LOGO_URL,
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
        type: "FAQPage",
        mainEntity: items.map((item) => ({
          type: "Question" as const,
          name: item.question,
          acceptedAnswer: {
            type: "Answer" as const,
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      schema={{
        type: "WebSite",
        name: "KodeDristi Software",
        url: SITE_URL,
        potentialAction: {
          type: "SearchAction",
          target: `${SITE_URL}/insights?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
