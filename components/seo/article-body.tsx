import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cssAspect, parseImageLine, type ImageAttrs } from "@/lib/content/image-markup";

/**
 * Renders an article's `body` (one string per CMS line) with light markup, so
 * a post can have the structure search engines read: headings, lists and
 * links, instead of a wall of identical paragraphs.
 *
 *   ## Heading        -> <h2> with an anchor id (and an entry in the contents list)
 *   ### Subheading    -> <h3>
 *   - item            -> consecutive lines become one <ul>
 *   1. item           -> consecutive lines become one <ol>
 *   > quote           -> consecutive lines become one <blockquote>
 *   ![alt](/img.webp) -> a figure (alone on its line; alt text becomes the caption).
 *                        Optional `{width=60 align=right ratio=16:9 frame=off}` after it
 *                        sets its size and position; see lib/content/image-markup.ts.
 *   ---               -> a divider
 *   ``` … ```         -> a code block (lines between the fences, indentation kept)
 *   [text](/path)     -> internal link
 *   [text](https://…) -> external link (opens in a new tab, noopener)
 *   **bold**          -> <strong>
 *   *italic*          -> <em>
 *   `code`            -> <code>
 *   anything else     -> <p>
 *
 * Plain paragraphs render exactly as before, so articles written without any
 * markup are unchanged. Output is built from React elements, never from
 * `dangerouslySetInnerHTML`, and a link or image whose target is neither a
 * site path nor https is shown as plain text (or dropped), so CMS content
 * cannot inject script or a `javascript:` URL.
 */

type HeadingBlock = { kind: "h2" | "h3"; text: string; id: string };

type Block =
  | HeadingBlock
  | { kind: "p"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "quote"; lines: string[] }
  | { kind: "image"; alt: string; src: string; attrs: ImageAttrs }
  | { kind: "hr" }
  | { kind: "code"; lines: string[] };

const HEADING = /^(#{2,3})\s+(.+)$/;
const BULLET = /^[-*]\s+(.+)$/;
const NUMBERED = /^\d+[.)]\s+(.+)$/;
const QUOTE = /^>\s?(.*)$/;
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;
const FENCE = /^```/;

/** Only site paths and https URLs may be loaded as an image. */
function safeSrc(src: string): boolean {
  return (src.startsWith("/") && !src.startsWith("//")) || /^https:\/\//i.test(src);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBlocks(body: string[]): Block[] {
  const blocks: Block[] = [];
  const seen = new Map<string, number>();

  let code: { kind: "code"; lines: string[] } | null = null;

  for (const raw of body) {
    const line = raw.trim();

    // Inside a fence every line is code — including blank ones and indentation.
    if (code) {
      if (FENCE.test(line)) {
        blocks.push(code);
        code = null;
      } else {
        code.lines.push(raw.replace(/\s+$/, ""));
      }
      continue;
    }

    if (!line) continue;

    if (FENCE.test(line)) {
      code = { kind: "code", lines: [] };
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ kind: "hr" });
      continue;
    }

    const image = parseImageLine(line);
    if (image && safeSrc(image.src)) {
      blocks.push({ kind: "image", alt: image.alt, src: image.src, attrs: image.attrs });
      continue;
    }

    const quote = line.match(QUOTE);
    if (quote) {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "quote") last.lines.push(quote[1]);
      else blocks.push({ kind: "quote", lines: [quote[1]] });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const base = slugify(heading[2]) || "section";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      blocks.push({
        kind: heading[1].length === 2 ? "h2" : "h3",
        text: heading[2],
        id: count === 0 ? base : `${base}-${count + 1}`,
      });
      continue;
    }

    const bullet = line.match(BULLET);
    const numbered = bullet ? null : line.match(NUMBERED);
    const listKind = bullet ? "ul" : numbered ? "ol" : null;
    if (listKind) {
      const item = (bullet ?? numbered)![1];
      const last = blocks[blocks.length - 1];
      if (last && last.kind === listKind) last.items.push(item);
      else blocks.push({ kind: listKind, items: [item] });
      continue;
    }

    blocks.push({ kind: "p", text: line });
  }
  // An unclosed fence still renders what was written rather than dropping it.
  if (code) blocks.push(code);
  return blocks;
}

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|`([^`]+)`/g;
const linkClass = "focus-ring font-semibold text-link underline underline-offset-2 hover:no-underline";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));

    const [, label, href, bold, italic, code] = match;
    if (bold) {
      nodes.push(<strong key={key++} className="font-semibold text-text-primary">{bold}</strong>);
    } else if (italic) {
      nodes.push(<em key={key++}>{italic}</em>);
    } else if (code) {
      nodes.push(
        <code key={key++} className="rounded-md bg-background-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-text-primary">
          {code}
        </code>
      );
    } else if (href.startsWith("/") && !href.startsWith("//")) {
      nodes.push(<Link key={key++} href={href} className={linkClass}>{label}</Link>);
    } else if (/^https:\/\//i.test(href)) {
      nodes.push(
        <a key={key++} href={href} target="_blank" rel="noopener" className={linkClass}>
          {label}
        </a>
      );
    } else {
      nodes.push(label);
    }
    last = start + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** The `##` headings of a body, with the anchor ids ArticleBody gives them. */
export function getArticleHeadings(body: string[]): { id: string; text: string }[] {
  return parseBlocks(body)
    .filter((b): b is HeadingBlock => b.kind === "h2")
    .map(({ id, text }) => ({ id, text }));
}

export function ArticleBody({
  body,
  showContents = true,
}: {
  body: string[];
  /** Set false when the page renders its own contents list (the article page's left column). */
  showContents?: boolean;
}) {
  const blocks = parseBlocks(body);
  const contents = blocks.filter((b): b is HeadingBlock => b.kind === "h2");
  // The first plain paragraph is the standfirst; it is set larger.
  const leadIndex = blocks.findIndex((b) => b.kind === "p");

  return (
    <div className="flex flex-col gap-6">
      {showContents && contents.length >= 3 && (
        <nav aria-label="Contents" className="panel p-5">
          <p className="text-sm font-semibold text-text-primary">In this article</p>
          <ol className="mt-3 flex flex-col gap-1.5 text-sm">
            {contents.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="focus-ring text-text-secondary hover:text-link">
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-8 scroll-mt-28 border-t border-border pt-8 text-2xl font-semibold leading-tight tracking-tight text-text-primary first:mt-0 first:border-t-0 first:pt-0 sm:text-[30px]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={block.id} className="mt-2 scroll-mt-28 text-xl font-semibold tracking-tight text-text-primary">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="flex list-disc flex-col gap-2.5 pl-6 text-[17px] leading-8 text-text-secondary marker:text-link">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="flex list-decimal flex-col gap-2.5 pl-6 text-[17px] leading-8 text-text-secondary marker:font-semibold marker:text-link">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="flex flex-col gap-3 border-l-4 border-brand-blue bg-background-secondary py-4 pr-5 pl-5 text-lg leading-8 text-text-primary"
              >
                {block.lines.map((l, j) => (
                  <p key={j}>{renderInline(l)}</p>
                ))}
              </blockquote>
            );
          case "image":
            return (
              <figure
                key={i}
                className={cn(
                  "flex flex-col",
                  block.attrs.align === "center" && "items-center",
                  block.attrs.align === "right" && "items-end"
                )}
              >
                {/* The width applies from `sm` up; on a phone every image takes the
                    full column, because a half-width picture there is a thumbnail. */}
                <div
                  className="flex w-full flex-col gap-2.5 sm:w-(--img-w)"
                  style={{ "--img-w": `${block.attrs.width}%` } as CSSProperties}
                >
                  {/* A plain <img>: the source can be any https host or an upload,
                      and the body's width is the only size that matters here. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.src}
                    alt={block.alt}
                    loading="lazy"
                    style={{ aspectRatio: cssAspect(block.attrs.ratio) }}
                    className={cn(
                      "w-full",
                      block.attrs.ratio !== "auto" && "object-cover",
                      block.attrs.frame && "rounded-2xl border border-border"
                    )}
                  />
                  {block.alt && (
                    <figcaption
                      className={cn(
                        "text-sm text-text-muted",
                        block.attrs.align === "center" && "text-center",
                        block.attrs.align === "right" && "text-right"
                      )}
                    >
                      {block.alt}
                    </figcaption>
                  )}
                </div>
              </figure>
            );
          case "hr":
            return <hr key={i} className="my-2 border-border" />;
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-xl bg-surface-ink p-5 font-mono text-[14px] leading-7 text-white"
              >
                <code>{block.lines.join("\n")}</code>
              </pre>
            );
          default:
            return (
              <p
                key={i}
                className={
                  i === leadIndex
                    ? "text-xl leading-9 text-text-primary text-pretty"
                    : "text-[17px] leading-8 text-text-secondary text-pretty"
                }
              >
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
