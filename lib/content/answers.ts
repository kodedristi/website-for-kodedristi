import type { AnswerFaqItem } from "@/components/seo/answer-faq";
import type { CourseData, ProductData, ProjectData, SolutionData } from "@/lib/content/schemas";

/**
 * Plain-language answers assembled from an item's own CMS fields.
 *
 * Nothing here is written by hand per item: every sentence is either one of
 * the item's fields or a neutral frame around it, so an answer can never say
 * something the admin did not enter, and editing the item edits the answer.
 * A question whose field is empty is dropped rather than answered vaguely.
 */

const ABOUT = "Kodedristi Software is a software company in Kathmandu, Nepal, working with clients worldwide.";

function sentence(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function joinList(items: string[]): string {
  return items.map((i) => i.trim()).filter(Boolean).join("; ");
}

function present(text?: string): text is string {
  return Boolean(text && text.trim());
}

/** First sentence of a paragraph, capped, for summaries that sit above the full text. */
export function firstSentence(text?: string, max = 220): string {
  if (!present(text)) return "";
  const t = text.trim().replace(/\s+/g, " ");
  const match = t.match(/^.*?[.!?](\s|$)/);
  const s = match ? match[0].trim() : t;
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

export function solutionAnswers(s: Omit<SolutionData, "icon"> & { slug: string }) {
  const faqs: AnswerFaqItem[] = [];
  if (present(s.tagline)) {
    faqs.push({ question: `What is ${s.name}?`, answer: `${sentence(s.tagline)} ${ABOUT}` });
  }
  if (present(s.problem)) {
    faqs.push({ question: `What problem does ${s.name} solve?`, answer: sentence(s.problem) });
  }
  if (present(s.approach)) {
    faqs.push({ question: `How does Kodedristi approach ${s.name}?`, answer: sentence(s.approach) });
  }
  if (s.deliverables?.some(present)) {
    faqs.push({ question: `What do you deliver in ${s.name}?`, answer: `${joinList(s.deliverables)}.` });
  }
  if (present(s.timeline)) {
    faqs.push({ question: `How long does ${s.name} take?`, answer: sentence(s.timeline) });
  }
  const quick = `${sentence(s.tagline)} ${ABOUT}${present(s.timeline) ? ` Typical timeline: ${sentence(s.timeline)}` : ""}`;
  return { quick, faqs };
}

export function productAnswers(p: Omit<ProductData, "icon"> & { slug: string }) {
  const faqs: AnswerFaqItem[] = [];
  if (present(p.description)) {
    faqs.push({ question: `What is ${p.name}?`, answer: sentence(p.description) });
  }
  if (present(p.audience)) {
    faqs.push({ question: `Who is ${p.name} for?`, answer: sentence(p.audience) });
  }
  if (p.features?.some(present)) {
    faqs.push({ question: `What features does ${p.name} include?`, answer: `${joinList(p.features)}.` });
  }
  const quick = `${sentence(p.tagline)} ${p.name} is built and maintained by Kodedristi Software in Kathmandu, Nepal.`;
  return { quick, faqs };
}

export function courseAnswers(c: CourseData & { slug: string }) {
  const faqs: AnswerFaqItem[] = [];
  if (present(c.duration) || present(c.format)) {
    faqs.push({
      question: `How long is the ${c.name} course and how is it taught?`,
      answer: [present(c.duration) && `Duration: ${c.duration}.`, present(c.format) && `Format: ${c.format}.`]
        .filter(Boolean)
        .join(" "),
    });
  }
  if (present(c.prerequisites)) {
    faqs.push({ question: `What are the prerequisites for ${c.name}?`, answer: sentence(c.prerequisites) });
  }
  if (c.outcomes?.some(present)) {
    faqs.push({ question: `What will I be able to do after ${c.name}?`, answer: `${joinList(c.outcomes)}.` });
  }
  if (present(c.fee)) {
    faqs.push({ question: `How much does the ${c.name} course cost?`, answer: sentence(c.fee) });
  }
  if (present(c.nextStartDate)) {
    faqs.push({ question: `When does the next ${c.name} batch start?`, answer: sentence(c.nextStartDate) });
  }
  const parts = [
    sentence(c.summary),
    present(c.level) && `Level: ${c.level}.`,
    present(c.duration) && `Duration: ${c.duration}.`,
    "Taught by Kodedristi Software in Kathmandu, Nepal.",
  ].filter(Boolean);
  return { quick: parts.join(" "), faqs };
}

/** "40% | faster checkout" lines -> { value, label }. A line without a
 *  separator is skipped: a figure with no meaning attached is not a result. */
export function parseMetrics(lines?: string[]): { value: string; label: string }[] {
  return (lines ?? [])
    .map((line) => line.split("|").map((p) => p.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([value, label]) => ({ value, label }));
}

export function projectAnswers(p: ProjectData & { slug: string }) {
  const bits = [
    p.client && `Client: ${p.client}.`,
    p.industry && `Industry: ${p.industry}.`,
    p.year && `Year: ${p.year}.`,
  ].filter(Boolean);
  return {
    problem: firstSentence(p.businessProblem),
    solution: firstSentence(p.productStrategy),
    result: firstSentence(p.businessResult),
    facts: bits.join(" "),
  };
}
