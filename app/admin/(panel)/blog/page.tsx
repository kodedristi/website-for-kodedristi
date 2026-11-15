import { CollectionScreen } from "@/components/admin/collection-screen";
import { BlogScheduler } from "@/components/admin/blog-scheduler";
import { listContentRaw } from "@/lib/content/store";
import type { ArticleData } from "@/lib/content/schemas";

export const dynamic = "force-dynamic";

/** The articles and the server's clock, read together so they agree. */
async function loadSchedulerData() {
  const rows = await listContentRaw<ArticleData>("article");
  return {
    nowMs: Date.now(),
    articles: rows.map((r) => ({
      slug: r.slug ?? "",
      title: r.data.title,
      category: r.data.category ?? "",
      published: r.published,
      publishAt: r.data.publishAt ?? null,
    })),
  };
}

/**
 * "Blog" is the word people use; /blog is a redirect to /insights, which is
 * what the site calls it. The admin says both so neither reader is stuck
 * looking for the other's name.
 */
export default async function AdminBlogPage() {
  const { nowMs, articles } = await loadSchedulerData();

  return (
    <CollectionScreen
      type="article"
      title="Blog"
      description="Articles published at /insights — /blog redirects there. Each post gets its own page; pick one to edit its title, excerpt, image, category, date and body, or schedule several to go out on a rhythm."
      viewHref="/insights"
      viewLabel="View blog"
      extra={[
        { href: "/admin/content/page-hero/slug/insights", label: "Edit the blog hero" },
        { href: "/admin/content/page-seo/slug/insights", label: "Search listing" },
      ]}
    >
      <BlogScheduler nowMs={nowMs} articles={articles} />
    </CollectionScreen>
  );
}
