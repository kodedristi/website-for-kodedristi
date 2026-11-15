import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { LogoWall } from "@/components/ui/logo-wall";
import { getHackathonPartners, getSectionHeading } from "@/lib/content/resolvers";
import { cn } from "@/lib/utils";

/**
 * "Trusted By Leading Organizations" — the logo wall that follows the
 * hackathon banner.
 *
 * A centred title with a short blue rule, then the logos sitting bare on the
 * page in an inset six-column grid. The layout lives in `LogoWall`, which the
 * /partners page uses too, so both walls look the same.
 *
 * Renders nothing when the list is empty. A wall with no organisations on it
 * is worse than no wall.
 */
export async function HackathonPartners({ className }: { className?: string }) {
  const [partners, heading] = await Promise.all([
    getHackathonPartners(),
    getSectionHeading("hackathon-partners"),
  ]);

  if (partners.length === 0) return null;

  return (
    <section className={cn("section", className)}>
      <Container className="flex flex-col gap-4 sm:gap-3">
        <Reveal>
          <SectionHeading
            accent
            title={heading?.title ?? "Trusted By Leading Organizations"}
          />
        </Reveal>

        <LogoWall
          items={partners.map((p) => ({
            name: p.name,
            logo: p.logo,
            url: p.url,
          }))}
        />
      </Container>
    </section>
  );
}
