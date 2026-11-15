/**
 * Topics are the articles' `category` values. They are free text in the admin,
 * so the same topic can arrive as "AI Engineering" and "ai engineering " — the
 * slug is what groups and links them.
 */
export function topicSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Topic = { slug: string; label: string; count: number };

/** Distinct topics, biggest first, then alphabetical. Blank categories are skipped. */
export function collectTopics(categories: string[]): Topic[] {
  const map = new Map<string, Topic>();
  for (const raw of categories) {
    const label = raw.trim();
    const slug = topicSlug(label);
    if (!slug) continue;
    const found = map.get(slug);
    if (found) found.count += 1;
    else map.set(slug, { slug, label, count: 1 });
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  );
}

export function formatArticleDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
