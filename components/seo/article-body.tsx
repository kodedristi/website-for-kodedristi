import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders an article's `body` (one string per CMS line) with light markup, so
 * a post can have the structure search engines read: headings, lists and
 * links, instead of a wall of identical paragraphs.
 *
 *   ## Heading        -> <h2> with an anchor id (and an entry in the contents list)
 *   ### Subheading    -> <h3>
 *   - item            -> consecutive lines become one <ul>
 *   1. item           -> consecutive lines become one <ol>
 *   [text](/path)     -> internal link
 *   [text](https://…) -> external link (opens in a new tab, noopener)
 *   **bold**          -> <strong>
 *   anything else     -> <p>
 *
 * Plain paragraphs render exactly as before, so articles written without any
 * markup are unchanged. Output is built from React elements, never from
 * `dangerouslySetInnerHTML`, and a link whose target is neither a site path
 * nor https is shown as plain text, so CMS content cannot inject script or a
 * `javascript:` URL.
 */

type HeadingBlock = { kind: "h2" | "h3"; text: string; id: string };

type Block =
  | HeadingBlock
  | { kind: "p"; text: string }
  | { kind: "ul" | "ol"; items: string[] };

const HEADING = /^(#{2,3})\s+(.+)$/;
const BULLET = /^[-*]\s+(.+)$/;
const NUMBERED = /^\d+[.)]\s+(.+)$/;

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

  for (const raw of body) {
    const line = raw.trim();
    if (!line) continue;

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
  return blocks;
}

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const linkClass = "focus-ring font-semibold text-link underline underline-offset-2 hover:no-underline";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));

    const [, label, href, bold] = match;
    if (bold) {
      nodes.push(<strong key={key++} className="font-semibold text-text-primary">{bold}</strong>);
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

export function ArticleBody({ body }: { body: string[] }) {
  const blocks = parseBlocks(body);
  const contents = blocks.filter((b): b is HeadingBlock => b.kind === "h2");

  return (
    <div className="flex flex-col gap-5">
      {contents.length >= 3 && (
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
              <h2 key={i} id={block.id} className="mt-6 scroll-mt-28 text-2xl font-semibold text-text-primary">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={block.id} className="mt-2 scroll-mt-28 text-lg font-semibold text-text-primary">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-6 text-base leading-relaxed text-text-secondary">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="flex list-decimal flex-col gap-2 pl-6 text-base leading-relaxed text-text-secondary">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className="text-base leading-relaxed text-text-secondary">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
