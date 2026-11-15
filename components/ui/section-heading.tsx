import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  eyebrowTone = "blue",
  title,
  description,
  align = "left",
  accent = false,
  className,
}: {
  eyebrow?: string;
  eyebrowTone?: "blue" | "green" | "amber";
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** A short blue rule under the title (a long dash and a short one). */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        accent && "gap-6 sm:gap-8",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "eyebrow",
            eyebrowTone === "blue"
              ? "text-link"
              : eyebrowTone === "green"
                ? "text-brand-green-hover"
                : "text-brand-amber-text"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "display-md font-semibold text-text-primary",
          accent && "font-bold tracking-wide"
        )}
      >
        {title}
      </h2>
      {accent && (
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="h-0.5 w-16 bg-[#2f9bd8]" />
          <span className="h-0.5 w-1.5 bg-[#2f9bd8]" />
        </span>
      )}
      {description && (
        <p className="max-w-2xl text-[15px] leading-relaxed text-text-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
