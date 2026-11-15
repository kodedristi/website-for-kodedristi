"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArticleCover } from "@/components/insights/article-cover";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { collectTopics, formatArticleDate, topicSlug } from "@/lib/insights-topics";

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  date: string;
  readTime: string;
};

const ALL = "all";

/**
 * The insights index as a blog: topics down the left, posts to the right.
 *
 * Filtering is client-side on purpose. The page stays a statically cached
 * server page, every article link is in the HTML a crawler receives (the
 * unfiltered view), and a topic is shareable as `/insights#topic-slug`, which
 * the article pages link to.
 */
export function InsightsBrowser({ posts }: { posts: InsightPost[] }) {
  const topics = useMemo(() => collectTopics(posts.map((p) => p.category)), [posts]);
  const [active, setActive] = useState<string>(ALL);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Set when the change should bring the results into view; the effect below acts
  // on it once the list has re-rendered. A click only scrolls when the results are
  // not already comfortably on screen; arriving on a topic link always does, since
  // the reader asked for that topic and the page would otherwise open on the hero.
  const scrollToResults = useRef<false | "if-needed" | "always">(false);

  // Honour `/insights#some-topic` on arrival (and when the hash changes).
  useEffect(() => {
    const read = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const known = topics.some((t) => t.slug === hash);
      // A topic link from another page: the browser finds no element with that
      // id, so it leaves the page at the top. Take the reader to the posts.
      if (known) scrollToResults.current = "always";
      setActive(known ? hash : ALL);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [topics]);

  const choose = (slug: string) => {
    scrollToResults.current = "if-needed";
    setActive(slug);
    const url = slug === ALL ? window.location.pathname : `#${slug}`;
    window.history.replaceState(null, "", url);
  };

  /* Changing topic swaps the list for one of a different height. When it is
     shorter, the browser clamps the scroll position and the reader is dropped
     near the top of the page — looking at the navbar instead of the posts they
     asked for. So after the new list is in, bring the start of the results back
     under the sticky header, but only if it is not already comfortably on
     screen (a click made while reading at the top should not move the page). */
  useEffect(() => {
    const mode = scrollToResults.current;
    if (!mode) return;
    scrollToResults.current = false;
    const el = resultsRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top;
      if (mode === "always" || top < 90 || top > window.innerHeight * 0.6) {
        // On arrival the page is still settling (images, fonts), and the site's
        // smooth scrolling gets cancelled part-way by that; jump straight there.
        el.scrollIntoView({ block: "start", behavior: mode === "always" ? "instant" : "auto" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const visible = active === ALL ? posts : posts.filter((p) => topicSlug(p.category) === active);
  const activeLabel = topics.find((t) => t.slug === active)?.label;
  const [lead, ...rest] = visible;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
      {/* Topics — a sticky column on desktop, a swipeable row of chips on a phone. */}
      <aside aria-label="Topics" className="lg:sticky lg:top-28">
        <p className="eyebrow mb-3 hidden lg:block">Topics</p>
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
          <TopicButton
            label="All articles"
            count={posts.length}
            active={active === ALL}
            onClick={() => choose(ALL)}
          />
          {topics.map((t) => (
            <TopicButton
              key={t.slug}
              label={t.label}
              count={t.count}
              active={active === t.slug}
              onClick={() => choose(t.slug)}
            />
          ))}
        </ul>
      </aside>

      <div className="min-w-0">
        <div
          ref={resultsRef}
          className="mb-6 flex scroll-mt-28 items-baseline justify-between gap-4 border-b border-border pb-4"
        >
          <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            {activeLabel ?? "Latest articles"}
          </h2>
          <p className="shrink-0 text-sm text-text-muted" aria-live="polite">
            {visible.length} {visible.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {lead ? (
          <div className="flex flex-col gap-10 sm:gap-12">
            <FeaturedPost post={lead} />
            {rest.length > 0 && (
              <ul className="flex flex-col divide-y divide-border border-y border-border">
                {rest.map((post) => (
                  <li key={post.slug}>
                    <PostRow post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="py-16 text-center text-text-muted">No articles in this topic yet.</p>
        )}
      </div>
    </div>
  );
}

function TopicButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li className="shrink-0 lg:shrink">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "focus-ring flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-full border px-4 py-2 text-left text-sm transition-colors lg:whitespace-normal lg:rounded-lg lg:border-transparent lg:px-3 lg:py-2.5",
          active
            ? "border-brand-blue bg-brand-blue font-semibold text-white lg:border-transparent lg:bg-brand-blue-light lg:text-link"
            : "border-border text-text-secondary hover:text-link lg:hover:bg-background-secondary"
        )}
      >
        <span>{label}</span>
        <span
          className={cn(
            "text-xs tabular-nums",
            active ? "text-white/80 lg:text-link/70" : "text-text-muted"
          )}
        >
          {count}
        </span>
      </button>
    </li>
  );
}

function Meta({ post }: { post: InsightPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
      <time dateTime={post.date}>{formatArticleDate(post.date)}</time>
      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readTime}
      </span>
    </p>
  );
}

/** The newest post in view, given room: artwork (or a reserved well) plus a real standfirst. */
function FeaturedPost({ post }: { post: InsightPost }) {
  return (
    <article className="group/post relative grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-8">
      <ArticleCover
        image={post.image}
        category={post.category}
        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
        className="rounded-2xl"
      />
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-link">{post.category}</p>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-text-primary text-balance sm:text-[32px]">
          <Link
            href={`/insights/${post.slug}`}
            className="focus-ring after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-base leading-relaxed text-text-secondary text-pretty">{post.excerpt}</p>
        <Meta post={post} />
        <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-link">
          Read article <ArrowRight className="h-4 w-4 transition-transform group-hover/post:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}

function PostRow({ post }: { post: InsightPost }) {
  return (
    <article className="group/post relative flex items-start gap-6 py-7">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="eyebrow text-link">{post.category}</p>
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-text-primary text-balance">
          <Link
            href={`/insights/${post.slug}`}
            className="focus-ring after:absolute after:inset-0 after:content-[''] group-hover/post:text-link"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[15px] leading-relaxed text-text-secondary">{post.excerpt}</p>
        <Meta post={post} />
      </div>
      <ArticleCover
        image={post.image}
        category={post.category}
        sizes="176px"
        className="hidden aspect-[4/3] w-44 shrink-0 rounded-xl sm:block"
      />
    </article>
  );
}
