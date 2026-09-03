import { ArrowRight01Icon } from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { getHomeFinalCtaData } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

export async function FinalCta({ className }: { className?: string }) {
  const content = await getHomeFinalCtaData();

  return (
    /* Loose rhythm: the closing ask gets more air than the sections above it,
       so the page resolves rather than simply stopping. */
    <section className={cn("section-loose", className)}>
      <Container>
        {/* Same soft-green wash the tiles and the footer use, not a bespoke
            dark/indigo panel — the closing ask reads as one more surface in
            the site's own material rather than a color the rest of the page
            never otherwise commits to. */}
        <Reveal className="relative overflow-hidden rounded-card bg-background-secondary px-6 py-12 sm:px-12 sm:py-14">
          {/* Decorative corner accents */}
          <div className="absolute left-0 top-0 h-24 w-1 bg-brand-green" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 h-24 w-1 bg-brand-green" aria-hidden="true" />

          {/* Copy on the left, the proposal form itself on the right — the
              closing ask is now something the visitor can act on without
              leaving the page. Stacks on smaller screens. */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
            <div className="flex flex-col gap-4">
              <h2 className="display-md max-w-xl font-semibold">{content.title}</h2>
              <p className="prose-measure text-base leading-relaxed text-text-secondary sm:text-[17px]">
                {content.description}
              </p>
              <Button
                href={content.secondaryHref}
                variant="outline"
                size="lg"
                className="mt-1 w-fit hover:border-brand-blue/20 hover:bg-transparent"
              >
                {content.secondaryLabel}
                <ArrowRight01Icon className="h-6 w-6 transition-transform duration-micro ease-out-quint group-hover/btn:translate-x-0.5" />
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Request for proposal
              </p>
              <EnquiryForm
                lockReason="proposal"
                className="border-[0.5px] border-border bg-surface shadow-card"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
