import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { InsightsBrowser } from "@/components/insights/insights-browser";
import { getArticles, getPageHero } from "@/lib/content/resolvers";

// Ten minutes, not an hour: a scheduled article appears the first time this
// page is rebuilt after its publish time (see lib/content/scheduling.ts).
export const revalidate = 600;

/**
 * Title, description, canonical and social tags come from this page's
 * `page-seo` row when one has been filled in, and from the literals below
 * when it has not - so the admin can rewrite them without a deploy, and a
 * row nobody has touched changes nothing.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("insights", {
    title: "Software & AI Insights from Nepal",
    description:
      "Articles on software development in Nepal, AI, custom software, SaaS, outsourcing and cloud migration from the Kodedristi engineering team.",
    path: "/insights",
  });
}

export default async function InsightsPage() {
  const articles = await getArticles();
  const hero = (await getPageHero("insights")) ?? {
    eyebrow: "Knowledge",
    title: "News & Insights",
    description: "Notes from our engineering and delivery teams — practical, not promotional.",
  };

  // Newest first, so the featured post is the latest one. Only the fields the
  // list needs cross to the client — not every article body.
  const posts = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      category: a.category,
      date: a.date,
      readTime: a.readTime,
    }));

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section className="section">
        <Container>
          <InsightsBrowser posts={posts} />
        </Container>
      </section>
    </>
  );
}
