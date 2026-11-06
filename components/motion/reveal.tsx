import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals, done in CSS.
 *
 * These used to be framer-motion islands that server-rendered every block as
 * `opacity: 0` and waited for hydration, an IntersectionObserver and a spring
 * to make it visible. On a phone that held the headline and the first screen of
 * content invisible for as long as the JavaScript took to arrive, which is
 * exactly the time Largest Contentful Paint and Speed Index are measuring.
 *
 * Now the markup is plain and visible, and where the browser supports
 * scroll-driven animation (`animation-timeline: view()`) the rule in
 * globals.css fades each block in as it enters the viewport. Blocks already on
 * screen at load are past their entry range and simply show. Browsers without
 * support, and anyone with `prefers-reduced-motion`, get the content with no
 * animation at all. Nothing here ships JavaScript, so these are server
 * components and can sit inside client ones.
 *
 * `delay` is accepted so existing call sites keep compiling, but a scroll
 * timeline has no clock to delay: sequence is expressed by position instead
 * (see RevealGroup).
 */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Direction the content travels from. "none" fades in place. */
  from?: "up" | "left" | "right" | "none";
  /** Ignored; see above. */
  delay?: number;
  /** Render as a different element (e.g. "section", "li"). */
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({ children, className, from = "up", as = "div" }: RevealProps) {
  const Tag: ElementType = as;
  /* `data-reveal` also marks the block for the `<noscript>` rule in the root
     layout, kept as a belt-and-braces guarantee that scripting-off visitors
     never see hidden content. */
  return (
    <Tag data-reveal="" data-from={from} className={cn(className)}>
      {children}
    </Tag>
  );
}

/**
 * Reveals direct children in sequence.
 *
 * The sequence is positional: each later child starts its fade a few pixels
 * further into the scroll than the one before. `stagger` is the old
 * seconds-between-siblings value; it is converted to that pixel step so the
 * groups that asked for a tighter or looser cadence still get one.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const Tag: ElementType = as;
  const style = { "--reveal-step": `${Math.round(stagger * 400)}px` } as CSSProperties;
  return (
    <Tag data-reveal-group="" style={style} className={cn(className)}>
      {children}
    </Tag>
  );
}

/**
 * A single child of RevealGroup. Takes its place in the sequence from its
 * position among its siblings.
 */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag: ElementType = as;
  return (
    <Tag data-reveal="" data-from="up" className={cn(className)}>
      {children}
    </Tag>
  );
}
