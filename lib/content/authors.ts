import { getArticles, getTeamMembers } from "@/lib/content/resolvers";

type Member = Awaited<ReturnType<typeof getTeamMembers>>[number];
type Article = Awaited<ReturnType<typeof getArticles>>[number];

const norm = (s?: string) => s?.trim().toLowerCase() ?? "";

/**
 * Articles carry an author as a plain name, matched here to the team member
 * of the same name. Matching on the name the admin typed - rather than a
 * stored id - means an article can be credited to anyone already on the Team
 * page without a second place to keep in sync.
 */
export function articlesBy(member: Member, articles: Article[]): Article[] {
  return articles.filter((a) => norm(a.author) === norm(member.name));
}

export async function findAuthor(name?: string): Promise<Member | null> {
  if (!norm(name)) return null;
  const members = await getTeamMembers();
  return members.find((m) => norm(m.name) === norm(name)) ?? null;
}

/** Team members who have written at least one article - the only ones who get
 *  a profile page, so there are no empty author pages to index. */
export async function getAuthors(): Promise<{ member: Member; articles: Article[] }[]> {
  const [members, articles] = await Promise.all([getTeamMembers(), getArticles()]);
  return members
    .map((member) => ({ member, articles: articlesBy(member, articles) }))
    .filter((a) => a.articles.length > 0);
}
