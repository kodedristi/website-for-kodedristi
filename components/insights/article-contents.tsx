"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** How far below the top of the viewport a heading counts as "reached". It has
 *  to clear the sticky header (~123px with the announcement bar) plus a little
 *  air, and match the `scroll-mt-28` the headings use for anchor jumps. */
const READ_LINE = 150;

/**
 * The article's contents, with the section currently being read marked.
 *
 * "Current" is the last heading that has scrolled up past the read line — so
 * the marker moves as a heading reaches the top of the screen, not when it
 * first peeks in at the bottom. Before the first heading it is the first one,
 * and at the very end of the page it is the last one (a short final section
 * would otherwise never get its turn).
 *
 */
export function ArticleContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = headings[0].id;
      if (atBottom) {
        current = headings[headings.length - 1].id;
      } else {
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (el && el.getBoundingClientRect().top <= READ_LINE) current = h.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  /* The list is never a scroll box of its own. A box inside the sidebar would
     capture the mouse wheel while the pointer was over it, so the page would
     stop scrolling there; the whole list is simply shown. */
  return (
    <nav aria-label="In this article">
      <p className="eyebrow mb-3">In this article</p>
      <div>
        <ol className="flex flex-col border-l border-border text-sm">
          {headings.map((h) => {
            const active = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setActiveId(h.id)}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "focus-ring -ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors",
                    active
                      ? "border-brand-blue font-semibold text-link"
                      : "border-transparent text-text-secondary hover:border-text-muted/40 hover:text-link"
                  )}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
