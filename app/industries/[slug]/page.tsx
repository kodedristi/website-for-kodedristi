import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/ui/project-card";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { AnswerFaq } from "@/components/seo/answer-faq";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { getProjects, getSolutions } from "@/lib/content/resolvers";
import { buildDetailMetadata, SITE_URL } from "@/lib/content/seo";
import { INDUSTRIES, getIndustry, industryForProject } from "@/lib/data/industries";
import { SOLUTION_SEO } from "@/lib/data/solution-seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return buildDetailMetadata({
    title: industry.title,
    description: industry.description,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const [solutions, projects] = await Promise.all([getSolutions(), getProjects()]);
  // Only solutions that are published - linking to an unpublished one would
  // send readers (and crawlers) to a 404.
  const related = industry.solutions
    .map((s) => solutions.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const caseStudies = projects.filter((p) => industryForProject(p.industry)?.slug === industry.slug).slice(0, 3);
  const path = `/industries/${industry.slug}`;

  return (
    <>
      <ServiceJsonLd
        name={industry.title}
        description={industry.description}
        url={`${SITE_URL}${path}`}
        serviceType={`${industry.name} software development`}
      />
      <BreadcrumbJsonLd
        trail={[
          { name: "Industries", path: "/industries" },
          { name: industry.name, path },
        ]}
      />

      <PageHero eyebrow="Industries" title={industry.title} description={industry.description}>
        <Button href="/contact" size="lg">
          Discuss your project <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <QuickAnswer>{industry.answer}</QuickAnswer>

      <section className="section">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Challenges" title={`What ${industry.name.toLowerCase()} teams struggle with`} />
            <ul className="mt-2 flex flex-col gap-3">
              {industry.challenges.map((c) => (
                <li key={c} className="card p-4 text-sm leading-relaxed text-text-secondary">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="What we build" eyebrowTone="green" title="Software we build for this industry" />
            <ul className="mt-2 flex flex-col gap-2.5">
              {industry.builds.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-hover" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section bg-background-secondary">
          <Container className="flex flex-col gap-6">
            <SectionHeading eyebrow="Services" title="How we deliver it" />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="focus-ring card card-on-panel flex items-center justify-between gap-3 p-5 text-sm font-semibold text-text-primary hover:text-link"
                  >
                    {SOLUTION_SEO[s.slug]?.title ?? s.name} <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {caseStudies.length > 0 && (
        <section className="section">
          <Container className="flex flex-col gap-6">
            <SectionHeading eyebrow="Our work" eyebrowTone="green" title={`${industry.name} projects`} />
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {caseStudies.map((p) => (
                <li key={p.slug} className="flex">
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <AnswerFaq title={`${industry.name} software: common questions`} items={industry.faqs} />
    </>
  );
}
