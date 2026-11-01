import { Container } from "@/components/ui/container";

/**
 * A short, self-contained answer set directly under a page's hero.
 *
 * Search engines and AI answer tools lift the passage that answers the
 * question the page is about, so the answer is stated plainly up top rather
 * than left for a reader to assemble from the sections below.
 */
export function QuickAnswer({ label = "In short", children }: { label?: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-8">
        <div className="max-w-3xl">
          <p className="eyebrow text-link">{label}</p>
          <p className="mt-3 text-[17px] leading-[1.6] text-text-primary">{children}</p>
        </div>
      </Container>
    </section>
  );
}
