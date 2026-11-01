import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/content/seo";
import { INDUSTRIES } from "@/lib/data/industries";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("industries", {
    title: "Industries We Build Software For",
    description:
      "Kodedristi builds software for fintech, healthcare, education, e-commerce, logistics and hospitality businesses in Nepal and worldwide.",
    path: "/industries",
  });
}

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Industries", path: "/industries" }]} />
      <PageHero
        eyebrow="Industries"
        title="Software built for the way your industry works"
        description="Every sector has its own workflows, integrations and rules. Pick yours to see what we build, the problems we solve and how we work."
      />
      <section className="section">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {INDUSTRIES.map((industry) => (
              <li key={industry.slug} className="flex">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="focus-ring card flex w-full flex-col gap-3 p-6 hover:border-brand-blue/40"
                >
                  <h2 className="text-lg font-semibold text-text-primary">{industry.name}</h2>
                  <p className="text-sm leading-relaxed text-text-muted">{industry.description}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-link">
                    See what we build <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
