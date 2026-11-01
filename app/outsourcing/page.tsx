import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata, SITE_URL } from "@/lib/content/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd, FAQJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("outsourcing", {
    title: "Software Outsourcing & White-Label Development in Nepal",
    description:
      "Outsource software development to Kodedristi in Kathmandu, Nepal: dedicated teams, project delivery and white-label web, mobile, SaaS and AI development under your brand.",
    path: "/outsourcing",
  });
}

const MODELS = [
  {
    title: "Dedicated development team",
    body: "Engineers, designers and QA who work only on your product, run to your roadmap and report in your tools. Best for long-running products that need steady capacity.",
  },
  {
    title: "Fixed-scope project delivery",
    body: "A defined scope, timeline and price for a web app, mobile app, SaaS platform or AI feature. We own delivery and hand over the source code and documentation.",
  },
  {
    title: "Team extension",
    body: "Add Kodedristi developers to your in-house team to cover a deadline or a missing skill, without a long hiring cycle.",
  },
];

const WHITE_LABEL = [
  "We build under your brand — your clients deal with you, not with us.",
  "Web apps, mobile apps, SaaS products, dashboards, integrations and AI automation.",
  "Delivery can be covered by an NDA, with full source-code and documentation handover.",
  "Clear scope, milestones and weekly progress updates so you can report confidently to your own client.",
];

const SERVICES = [
  { label: "Web & mobile app development", href: "/solutions/web-mobile-apps" },
  { label: "SaaS product development", href: "/solutions/saas-products" },
  { label: "AI & automation", href: "/solutions/ai-automation" },
  { label: "Custom software development", href: "/solutions/custom-software" },
  { label: "UI/UX design", href: "/solutions/ui-ux-design" },
  { label: "Cloud, DevOps & security", href: "/solutions/devops-security" },
];

/** Nepal is UTC+5:45 and does not use daylight saving, so only the other
 *  side's offset moves; ranges cover summer/winter time. */
const MARKETS = [
  {
    market: "Australia",
    offset: "Sydney is 4¼–5¼ hours ahead of Nepal",
    overlap: "Our morning is your afternoon, so the working days line up for daily check-ins.",
  },
  {
    market: "Singapore & Southeast Asia",
    offset: "Singapore is 2¼ hours ahead of Nepal",
    overlap: "Almost the whole working day overlaps.",
  },
  {
    market: "UAE & Gulf",
    offset: "Dubai is 1¾ hours behind Nepal",
    overlap: "Nearly full overlap for calls and reviews.",
  },
  {
    market: "United Kingdom & Europe",
    offset: "London is 4¾–5¾ hours behind Nepal",
    overlap: "Our afternoon is your morning, which suits daily stand-ups.",
  },
  {
    market: "United States & Canada",
    offset: "New York is 9¾–10¾ hours behind Nepal",
    overlap: "Our evening is your morning: the team can overlap early in your day and hand work back overnight.",
  },
];

const FAQS = [
  {
    question: "Do you work with clients outside Nepal?",
    answer:
      "Yes. Kodedristi works with companies and agencies from anywhere in the world, as well as in Nepal. Communication is in English, and we agree meeting windows that suit your time zone.",
  },
  {
    question: "Why outsource software development to Nepal?",
    answer:
      "Nepal has a growing pool of skilled engineers and lower costs than most Western markets, and Kathmandu (GMT+5:45) overlaps with working hours across Asia-Pacific, the Middle East and part of Europe. Kodedristi gives you a managed team, so you get the cost benefit without managing freelancers yourself.",
  },
  {
    question: "What is white-label software development?",
    answer:
      "White-label development means Kodedristi builds software that you deliver to your own clients under your brand. Agencies and consultancies use it to take on projects without growing a full in-house engineering team.",
  },
  {
    question: "Do you work under NDA, and who owns the code?",
    answer:
      "We can work under an NDA. Ownership and handover of the source code are agreed in the contract before work begins, so there is no ambiguity at delivery.",
  },
  {
    question: "What kind of software can you build?",
    answer:
      "Web applications, mobile apps, SaaS platforms, internal business systems, API integrations, AI chatbots and automation, plus the UI/UX design and cloud setup around them.",
  },
  {
    question: "How do we get started?",
    answer:
      "Send us a short description of what you want to build through the contact page. We will reply with questions, a proposed approach and an estimate, and you decide whether to go ahead.",
  },
];

export default function OutsourcingPage() {
  const url = `${SITE_URL}/outsourcing`;
  return (
    <>
      <ServiceJsonLd
        name="Software Outsourcing & White-Label Development"
        description="Dedicated teams, fixed-scope project delivery and white-label software development from Kathmandu, Nepal."
        url={url}
        serviceType="Software outsourcing"
      />
      <FAQJsonLd items={FAQS} />
      <BreadcrumbJsonLd trail={[{ name: "Outsourcing", path: "/outsourcing" }]} />

      <PageHero
        eyebrow="Outsourcing"
        title="Software outsourcing & white-label development from Nepal"
        description="A dependable software team in Kathmandu for companies and agencies that want quality engineering without building a department. Outsource a project, extend your team, or have us build under your brand."
      >
        <Button href="/contact" size="lg">
          Talk to us <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="Engagement models" title="Three ways to work with Kodedristi" />
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {MODELS.map((m) => (
              <div key={m.title} className="card p-6">
                <h3 className="font-semibold text-text-primary">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{m.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="White label"
            eyebrowTone="green"
            title="White-label software development for agencies and consultancies"
            description="Win the project, keep the client relationship, and let our engineers do the building."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {WHITE_LABEL.map((point) => (
              <li key={point} className="card card-on-panel p-5 text-sm leading-relaxed text-text-secondary">
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Global clients"
            title="Outsource from anywhere in the world"
            description="Wherever your company is based, we agree meeting windows around your day and work in English. Nepal is UTC+5:45 all year; here is how that overlaps with a few common locations."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETS.map((m) => (
              <div key={m.market} className="card p-5">
                <h3 className="font-semibold text-text-primary">{m.market}</h3>
                <p className="mt-1 text-sm font-medium text-text-secondary">{m.offset}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{m.overlap}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-background-secondary">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="What we build" title="Services available for outsourcing" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="focus-ring card card-on-panel flex items-center justify-between gap-3 p-5 text-sm font-semibold text-text-primary hover:text-link"
                >
                  {s.label} <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading eyebrow="FAQ" eyebrowTone="green" title="Outsourcing to Nepal: common questions" />
          <div className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <details key={f.question} className="card group p-5">
                <summary className="cursor-pointer font-semibold text-text-primary">{f.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <h3 className="text-lg font-semibold text-text-primary">Have a project to outsource?</h3>
            <p className="max-w-lg text-sm leading-relaxed text-text-muted">
              Tell us what you want to build and we will come back with an approach and an estimate.
            </p>
            <Button href="/contact" size="lg">
              Start a Project <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
