import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/content/seo";
import type { LandingPage } from "@/lib/data/landing-pages";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd, FAQJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";
import { QuickAnswer } from "@/components/seo/quick-answer";

/** Renders one entry of `LANDING_PAGES`: hero, direct answer, content
 *  sections, internal links, FAQ and a closing call to action. */
export function LandingPageView({ page }: { page: LandingPage }) {
  const path = `/${page.slug}`;
  return (
    <>
      <ServiceJsonLd
        name={page.serviceName}
        description={page.description}
        url={`${SITE_URL}${path}`}
        serviceType={page.serviceType}
      />
      <FAQJsonLd items={page.faqs} />
      <BreadcrumbJsonLd trail={[{ name: page.crumb, path }]} />

      <PageHero eyebrow={page.eyebrow} title={page.h1} description={page.intro}>
        <Button href="/contact" size="lg">
          Talk to us <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <QuickAnswer>{page.answer}</QuickAnswer>

      {page.sections.map((section, i) => (
        <section key={section.title} className={i % 2 === 1 ? "section bg-background-secondary" : "section"}>
          <Container className="flex flex-col gap-8">
            <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.intro} />
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {section.cards.map((card) => (
                <div key={card.title} className={i % 2 === 1 ? "card card-on-panel p-6" : "card p-6"}>
                  <h3 className="font-semibold text-text-primary">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{card.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Related" title="Related services" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="focus-ring card flex items-center justify-between gap-3 p-5 text-sm font-semibold text-text-primary hover:text-link"
                >
                  {r.label} <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="FAQ" eyebrowTone="green" title="Common questions" />
          <div className="flex flex-col gap-3">
            {page.faqs.map((f) => (
              <details key={f.question} className="card card-on-panel group p-5">
                <summary className="cursor-pointer font-semibold text-text-primary">{f.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <h3 className="text-lg font-semibold text-text-primary">{page.cta.title}</h3>
            <p className="max-w-lg text-sm leading-relaxed text-text-muted">{page.cta.body}</p>
            <Button href="/contact" size="lg">
              {page.cta.label} <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
