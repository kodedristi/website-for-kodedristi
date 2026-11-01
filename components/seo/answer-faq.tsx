import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQJsonLd } from "@/components/seo/json-ld";

export type AnswerFaqItem = { question: string; answer: string };

/**
 * Questions and answers rendered as plain `<details>` elements, so every
 * answer is in the HTML a crawler receives (the animated accordion elsewhere
 * only mounts the open answer), and the FAQ schema describes text that is
 * really on the page - Google ignores markup that does not match.
 */
export function AnswerFaq({
  title = "Frequently asked questions",
  items,
}: {
  title?: string;
  items: AnswerFaqItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="section bg-background-secondary">
      <FAQJsonLd items={items} />
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="FAQ" eyebrowTone="green" title={title} />
        <div className="flex max-w-3xl flex-col gap-3">
          {items.map((item) => (
            <details key={item.question} className="card card-on-panel p-5">
              <summary className="cursor-pointer font-semibold text-text-primary">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
