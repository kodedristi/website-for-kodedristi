import Image from "next/image";
import { topicSlug } from "@/lib/insights-topics";
import { cn } from "@/lib/utils";

const TONES = [
  "bg-brand-blue-light text-brand-blue",
  "bg-brand-green-light text-brand-green-hover",
  "bg-brand-amber-light text-brand-amber-text",
] as const;

/** A stable pick per topic, so every article in a topic shares one colour. */
function toneFor(category: string): string {
  const slug = topicSlug(category);
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return TONES[sum % TONES.length];
}

/** Up to two initials of the topic: "AI & Automation" -> "AA", "Cloud" -> "C". */
function initials(category: string): string {
  return category
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * An article's cover. The card's artwork when it has some; otherwise a tinted
 * well carrying the topic's initials, so a post without an image still looks
 * finished and the grid never has holes in it. The well is always laid out,
 * so artwork can be added later without anything moving.
 */
export function ArticleCover({
  image,
  category,
  alt = "",
  sizes,
  className,
}: {
  image?: string;
  category: string;
  alt?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden",
        !image && toneFor(category),
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover/post:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        <>
          {/* Concentric rings, bleeding off the corner. */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute -right-10 -top-10 h-3/4 w-auto overflow-visible opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="55" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="105" />
          </svg>
          <span
            aria-hidden
            className="absolute bottom-3 left-5 select-none text-5xl font-bold leading-none tracking-tight opacity-35 sm:text-6xl"
          >
            {initials(category)}
          </span>
        </>
      )}
    </div>
  );
}
