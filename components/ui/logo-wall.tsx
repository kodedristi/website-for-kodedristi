import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type LogoWallItem = {
  /** Stable key, and the fallback wordmark when there is no logo file. */
  name: string;
  logo?: string;
  /** Overrides the accessible name where the mark reads differently from the
   *  organisation's name. */
  alt?: string;
  url?: string;
};

/**
 * A wall of organisation logos in equal-size cards.
 *
 * The problem this solves is that supplied logo files never agree: one is a
 * wide wordmark, the next a square badge, the next a small mark centred on a
 * large transparent canvas. Sized by height they end up at wildly different
 * visual weights; sized by width the tall ones tower. So the *card* is the
 * constant — one fixed rectangle, one padding, everywhere — and each mark is
 * fitted inside it with `object-contain`, which scales to whichever axis
 * runs out first and never stretches or crops. A logo is a trademark; a
 * squashed one is the wrong logo.
 *
 * Deliberately plain: no cards, borders, fills or shadows. The logos sit
 * straight on the page in an even grid (six across on wide screens) and the
 * grid itself is the structure.
 *
 * Two columns on a phone is the floor — one column wastes the width, three
 * makes each mark too small to identify — and the counts step up from there
 * rather than jumping straight to the desktop grid, so a tablet never has to
 * scroll sideways to see a row.
 */
export function LogoWall({
  items,
  className,
  columns = "wide",
}: {
  items: LogoWallItem[];
  className?: string;
  /** `wide` fills a full-bleed section; `compact` suits a narrower column. */
  columns?: "wide" | "compact";
}) {
  // The same organisation can reach here twice — the admin allows two rows
  // whose names collide (they get distinct slugs), and the hackathon and
  // company partner lists overlap. A wall that prints one logo twice reads as
  // a bug, and duplicate names also collide as React keys below, so collapse
  // to the first occurrence of each name.
  const seen = new Set<string>();
  const uniqueItems = items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (uniqueItems.length === 0) return null;

  return (
    <RevealGroup
      as="ul"
      stagger={0.03}
      className={cn(
        // `minmax(0,1fr)` rather than a bare `1fr`: a grid track's default
        // minimum is its content, so one stubborn wide logo would push the
        // row past the viewport and give the whole page a horizontal
        // scrollbar. This lets every track shrink instead.
        // Centred and capped, with its own side padding on top of the page
        // gutter, so the wall sits inset from the section edges (wide
        // margins left and right) instead of running edge to edge.
        // On desktop the wall takes 87% of the section's content width, which
        // leaves ~15% of the viewport blank on each side and tops out at
        // ~1400px on very wide screens.
        "mx-auto w-full px-2 sm:px-6 lg:max-w-[80%] lg:px-0 2xl:max-w-[72%]",
        // Rows butt up against each other on desktop (a 160px cell on a 160px
        // pitch, as in the reference), so tall marks nearly touch the row
        // below; the columns are ~38px apart.
        "grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-x-10 sm:gap-y-3 lg:gap-y-0 xl:gap-x-7",
        "[grid-template-columns:repeat(2,minmax(0,1fr))]",
        columns === "wide"
          ? "sm:[grid-template-columns:repeat(3,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))] xl:grid-cols-6"
          : "sm:[grid-template-columns:repeat(3,minmax(0,1fr))] lg:[grid-template-columns:repeat(4,minmax(0,1fr))]",
        className
      )}
    >
      {uniqueItems.map((item) => (
        <RevealItem key={item.name} as="li">
          <LogoCard item={item} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function LogoCard({ item }: { item: LogoWallItem }) {
  const inner = item.logo ? (
    /* A plain <img>, not next/image: these are small, already optimised, and
       the fill/sizes dance next/image needs inside a flexible card buys
       nothing here. `max-h-full max-w-full` with `object-contain` is what
       guarantees the mark is fitted rather than filled. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.logo}
      alt={item.alt?.trim() || item.name}
      loading="lazy"
      className="h-full w-full object-contain object-center lg:object-left"
    />
  ) : (
    /* No file yet: set the name. It is the organisation either way, and a
       grey placeholder box would say less than the name does. */
    <span className="text-center text-[13px] font-semibold leading-tight tracking-[-0.01em] text-text-secondary sm:text-sm">
      {item.name}
    </span>
  );

  /* A fixed-size cell with no border or fill: the logos sit directly on the
     page. Each mark is fitted into its cell (`object-contain` on a
     full-size image) and, on desktop, pinned to the cell's left edge and
     centred vertically, so every column shares one left edge and every row
     one centre line, whatever shape the logo is. Below `lg` the cells are
     narrow and wide, so the marks are centred instead. */
  const shell =
    "flex h-28 items-center justify-center sm:h-36 lg:h-32 lg:justify-start";

  /* A logo is a link only when it has a `url` set in the admin; clear the
     URL there and it is a plain image. */
  if (item.url?.trim()) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        title={item.name}
        className={cn(
          shell,
          "focus-ring transition-transform duration-200 ease-out-quint hover:scale-105"
        )}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={item.name} className={shell}>
      {inner}
    </div>
  );
}
