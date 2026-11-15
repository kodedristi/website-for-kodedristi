import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getArticle, getArticles } from "@/lib/content/resolvers";
import { buildDetailMetadata, SITE_URL } from "@/lib/content/seo";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { findAuthor } from "@/lib/content/authors";
import { ArticleBody, getArticleHeadings } from "@/components/seo/article-body";
import { collectTopics, formatArticleDate, topicSlug } from "@/lib/insights-topics";
import { ArticleContents } from "@/components/insights/article-contents";
import { ArticleCover } from "@/components/insights/article-cover";

// Matches /insights: a scheduled article's own page must not keep serving a
// cached "not found" for long after it goes live.
export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return buildDetailMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    image: article.image,
    article: { publishedTime: article.date, section: article.category },
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const all = await getArticles();
  // A named, linked author when the article credits a team member; the
  // company otherwise.
  const author = await findAuthor(article.author);
  const headings = getArticleHeadings(article.body);
  const topics = collectTopics(all.map((a) => a.category));
  const currentTopic = topicSlug(article.category);
  // Same topic first, then the newest of the rest.
  const related = all
    .filter((a) => a.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(topicSlug(b.category) === currentTopic) - Number(topicSlug(a.category) === currentTopic) ||
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3);

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        author={author?.name ?? "KodeDristi Team"}
        authorUrl={author ? `${SITE_URL}/team/${author.slug}` : undefined}
        datePublished={article.date}
        image={article.image}
        url={`${SITE_URL}/insights/${article.slug}`}
      />
      <BreadcrumbJsonLd
        trail={[
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${article.slug}` },
        ]}
      />
      <PageHero eyebrow={article.category} title={article.title}>
        <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(article.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {article.readTime}
          </span>
          {author && (
            <span>
              By{" "}
              <Link href={`/team/${author.slug}`} className="focus-ring font-semibold text-link">
                {author.name}
              </Link>
            </span>
          )}
        </div>
      </PageHero>

      <section className="section">
        <Container className="grid items-start gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          {/* Left column: where you are in this article, and the other topics.
              Sticky on desktop; on a phone it follows the article. */}
          <aside
            aria-label="Article navigation"
            /* Sticky only when the window is tall enough to show all of it; on a
               shorter screen it scrolls with the page, so nothing is cut off and
               it never needs a scrollbar of its own. */
            className="order-2 flex flex-col gap-7 lg:order-1 lg:top-28 lg:[@media(min-height:860px)]:sticky"
          >
            <Link
              href="/insights"
              className="focus-ring flex w-fit items-center gap-1.5 text-sm font-semibold text-link"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All insights
            </Link>

            {headings.length > 0 && <ArticleContents headings={headings} />}

            <nav aria-label="Topics">
              <p className="eyebrow mb-3">Topics</p>
              {/* Compact tags rather than a tall list, so the whole sidebar fits on
                  screen and never needs a scrollbar of its own. */}
              <ul className="flex flex-wrap gap-1.5">
                {topics.map((t) => {
                  const current = t.slug === currentTopic;
                  return (
                    <li key={t.slug}>
                      <Link
                        href={`/insights#${t.slug}`}
                        aria-current={current ? "true" : undefined}
                        className={
                          "focus-ring inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors " +
                          (current
                            ? "border-transparent bg-brand-blue-light font-semibold text-link"
                            : "border-border text-text-secondary hover:border-brand-blue/40 hover:text-link")
                        }
                      >
                        {t.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <article className="order-1 flex min-w-0 max-w-3xl flex-col gap-12 lg:order-2">
            {article.image && (
              <ArticleCover
                image={article.image}
                category={article.category}
                alt={article.title}
                sizes="(min-width: 1024px) 768px, 100vw"
                className="rounded-2xl border border-border"
              />
            )}
            <ArticleBody body={article.body} showContents={false} />

            <div className="card flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-text-primary">Have a project in mind?</p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  Tell us what you&apos;re trying to solve.
                </p>
              </div>
              <Button href="/contact" className="shrink-0">
                Start a Project <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </article>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section border-t border-border bg-background-secondary">
          <Container className="flex flex-col gap-8">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">Keep reading</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug} className="flex">
                  <article className="card card-on-panel card-hover group/post relative flex w-full flex-col overflow-hidden">
                    <ArticleCover
                      image={a.image}
                      category={a.category}
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <p className="eyebrow text-link">{a.category}</p>
                      <h3 className="text-lg font-semibold leading-snug tracking-tight text-text-primary">
                        <Link
                          href={`/insights/${a.slug}`}
                          className="focus-ring after:absolute after:inset-0 after:content-['']"
                        >
                          {a.title}
                        </Link>
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-text-muted">{a.excerpt}</p>
                      <p className="mt-auto pt-2 text-sm text-text-muted">
                        {formatArticleDate(a.date)} · {a.readTime}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
