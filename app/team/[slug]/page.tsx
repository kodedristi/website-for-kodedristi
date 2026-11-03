import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/json-ld";
import { getAuthors } from "@/lib/content/authors";
import { buildDetailMetadata, SITE_URL } from "@/lib/content/seo";

export const revalidate = 3600;

/**
 * An author profile: who wrote the articles, and what they have written.
 * Only team members with at least one article have one - everyone else is
 * a 404 here, so the index never fills with empty profile pages.
 */
export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((a) => ({ slug: a.member.slug }));
}

async function loadAuthor(slug: string) {
  const authors = await getAuthors();
  return authors.find((a) => a.member.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await loadAuthor(slug);
  if (!author) return {};
  const { member } = author;
  return buildDetailMetadata({
    title: `${member.name}, ${member.role}`,
    description: member.bio || `${member.name} is ${member.role} at Kodedristi Software and writes about software development.`,
    path: `/team/${member.slug}`,
    image: member.image,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await loadAuthor(slug);
  if (!author) notFound();
  const { member, articles } = author;
  const url = `${SITE_URL}/team/${member.slug}`;

  return (
    <>
      <PersonJsonLd
        name={member.name}
        jobTitle={member.role}
        description={member.bio}
        image={member.image}
        url={url}
      />
      <BreadcrumbJsonLd
        trail={[
          { name: "Team", path: "/team" },
          { name: member.name, path: `/team/${member.slug}` },
        ]}
      />

      <PageHero eyebrow="Author" title={member.name} description={member.role} />

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {member.image && (
            <div className="relative aspect-4/5 w-full max-w-[280px] overflow-hidden">
              <Image
                src={member.image}
                alt={`${member.name}, ${member.role} at Kodedristi Software`}
                fill
                sizes="280px"
                className="object-cover object-top"
              />
            </div>
          )}
          <div className="flex flex-col gap-4">
            {member.bio && <p className="prose-measure text-[17px] leading-[1.65] text-text-secondary">{member.bio}</p>}
            <Link href="/team" className="focus-ring flex w-fit items-center gap-1.5 text-sm font-semibold text-link">
              Meet the whole team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-6">
          <SectionHeading eyebrow="Articles" title={`Written by ${member.name}`} />
          <ul className="flex flex-col gap-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="focus-ring card card-on-panel flex flex-col gap-1 p-5 hover:text-link"
                >
                  <span className="font-semibold text-text-primary">{a.title}</span>
                  {a.excerpt && <span className="text-sm text-text-muted">{a.excerpt}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
