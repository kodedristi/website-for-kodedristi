import type { MetadataRoute } from "next";
import { listContent } from "@/lib/content/store";
import { SEO_PAGES, type PageSeoData } from "@/lib/content/schemas";
import { SITE_URL as BASE, absoluteUrl } from "@/lib/content/seo";
import { INDUSTRIES } from "@/lib/data/industries";
import { getAuthors } from "@/lib/content/authors";

/** Content types that own a `/<segment>/<slug>` page. */
const DETAIL_ROUTES: { type: string; segment: string }[] = [
  { type: "project", segment: "projects" },
  { type: "article", segment: "insights" },
  { type: "solution", segment: "solutions" },
  { type: "product", segment: "products" },
  { type: "course", segment: "learn" },
  { type: "gallery", segment: "gallery" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages the admin has ticked "hide from search engines" on must not be
  // advertised here - a sitemap entry for a noindex page is a contradiction
  // Search Console reports as an error.
  const hidden = new Set<string>();
  try {
    const rows = await listContent<PageSeoData>("page-seo");
    for (const row of rows) {
      if (row.data.noIndex && row.data.path) hidden.add(row.data.path);
    }
  } catch {
    // DB down - fall through with nothing hidden.
  }

  // Static pages come from the same list the admin's SEO screen uses, so a
  // new page added there appears here without a second edit. No
  // `lastModified`: these are not tracked per page, and stamping every URL
  // "now" teaches crawlers to ignore the field.
  const staticPages: MetadataRoute.Sitemap = SEO_PAGES.filter((p) => !hidden.has(p.path)).map(
    (p) => ({
      url: p.path === "/" ? BASE : `${BASE}${p.path}`,
    })
  );

  // One failing content type must not drop the others.
  const detailGroups = await Promise.all(
    DETAIL_ROUTES.map(async ({ type, segment }): Promise<MetadataRoute.Sitemap> => {
      try {
        const items = await listContent(type);
        return items
          .filter((item) => item.slug)
          .map((item) => {
            // Items keep their artwork under `image` (or `coverImage` for
            // galleries); listing it lets Google Images find it.
            const data = item.data as { image?: string; coverImage?: string };
            const image = (data.image || data.coverImage)?.trim();
            return {
              url: `${BASE}/${segment}/${item.slug}`,
              lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
              ...(image ? { images: [absoluteUrl(image)] } : {}),
            };
          });
      } catch {
        // DB down - this type contributes nothing.
        return [];
      }
    })
  );

  // Industry pages are defined in code, not the CMS.
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map((i) => ({
    url: `${BASE}/industries/${i.slug}`,
  }));

  // Author profiles exist only for team members with an article.
  let authorPages: MetadataRoute.Sitemap = [];
  try {
    authorPages = (await getAuthors()).map((a) => ({ url: `${BASE}/team/${a.member.slug}` }));
  } catch {
    // DB down - no author pages this time.
  }

  return [...staticPages, ...industryPages, ...authorPages, ...detailGroups.flat()];
}
