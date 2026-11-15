"use client";

import {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CircleHelp,
  Code,
  Columns2,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  PenLine,
  Quote,
  SquareCode,
  Trash2,
} from "lucide-react";
import { ArticleBody } from "@/components/seo/article-body";
import {
  buildImageLine,
  parseImageLine,
  type ImageAlign,
  type ImageAttrs,
  type ImageRatio,
  type ParsedImage,
} from "@/lib/content/image-markup";
import { MediaPickerDialog, type MediaItem } from "@/components/admin/media-picker";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * An article body is stored as one string per block (see ArticleBody):
 * a heading, a paragraph, a list item, a quote line, an image, a divider,
 * or - between ``` fences - a line of code. The editor shows that as
 * ordinary Markdown text with blank lines between blocks, and turns it back
 * on save, so what is stored never changes shape.
 * ------------------------------------------------------------------ */

const FENCE = /^\s*```/;
const LIST_LINE = /^\s*([-*]|\d+[.)])\s/;
const QUOTE_LINE = /^\s*>/;

/** Stored lines -> editable text. List items and quote lines stay together; everything else gets a blank line. */
export function linesToText(lines: string[]): string {
  let out = "";
  let inCode = false;
  lines.forEach((line, i) => {
    let sep = "";
    if (i > 0) {
      const prev = lines[i - 1];
      sep =
        inCode ||
        (LIST_LINE.test(prev) && LIST_LINE.test(line)) ||
        (QUOTE_LINE.test(prev) && QUOTE_LINE.test(line))
          ? "\n"
          : "\n\n";
    }
    out += sep + line;
    if (FENCE.test(line)) inCode = !inCode;
  });
  return out;
}

/** Editable text -> stored lines. Blank lines separate blocks and are dropped, except inside a code fence. */
export function textToLines(text: string): string[] {
  const out: string[] = [];
  let inCode = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const trimmed = line.trim();
    if (inCode) {
      if (FENCE.test(line)) {
        out.push(trimmed);
        inCode = false;
      } else {
        out.push(line.replace(/\s+$/, ""));
      }
      continue;
    }
    if (!trimmed) continue;
    out.push(trimmed);
    if (FENCE.test(trimmed)) inCode = true;
  }
  return out;
}

type View = "write" | "split" | "preview";

const SNIPPETS: Record<string, string> = {
  sources:
    "## Sources and further reading\n\n- Publisher: [Title of the page](https://example.com)\n- Publisher: [Another source](https://example.com)",
  next: "## Next steps\n\nIf you want help with this, [tell us what you are trying to solve](/contact) and we will suggest a practical way to start.",
};

export function MarkdownEditor({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (lines: string[]) => void;
}) {
  const [text, setText] = useState(() => linesToText(value));
  const [view, setView] = useState<View>("split");
  const [full, setFull] = useState(false);
  const [help, setHelp] = useState(false);
  const [picker, setPicker] = useState(false);
  /* Whether the library was opened to add a new image or to swap the one the
     settings panel is showing. */
  const [pickerMode, setPickerMode] = useState<"insert" | "replace">("insert");
  /* Start offset of the image line the caret is on, or null. The line itself is
     read back from `text` each render, so this can never hold a stale copy. */
  const [imageAt, setImageAt] = useState<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  /* Where to put the caret once React has written the new text back. Setting
     it before the re-render would be undone by it. */
  const pendingSel = useRef<[number, number] | null>(null);

  // Rendering the whole article on every keystroke would make typing lag on a
  // long post; the preview is allowed to trail a beat behind.
  const deferred = useDeferredValue(text);
  const previewLines = useMemo(() => textToLines(deferred), [deferred]);

  useLayoutEffect(() => {
    const ta = taRef.current;
    if (ta && pendingSel.current) {
      ta.setSelectionRange(pendingSel.current[0], pendingSel.current[1]);
      pendingSel.current = null;
    }
  }, [text]);

  // Full screen: hide the page's own scrollbar behind it, and let Escape out.
  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !picker) setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [full, picker]);

  function commit(next: string) {
    setText(next);
    onChange(textToLines(next));
  }

  /**
   * Replaces a range through the browser's own edit command, so every
   * toolbar action lands on the undo stack and Ctrl+Z walks back through
   * them. Falls back to a plain state update where the command is missing.
   */
  function replace(from: number, to: number, insert: string, selStart?: number, selEnd?: number) {
    const ta = taRef.current;
    if (!ta) return;
    const start = selStart ?? from + insert.length;
    pendingSel.current = [start, selEnd ?? start];
    ta.focus();
    ta.setSelectionRange(from, to);
    let done = false;
    try {
      done = document.execCommand("insertText", false, insert);
    } catch {
      done = false;
    }
    if (!done) commit(ta.value.slice(0, from) + insert + ta.value.slice(to));
  }

  function selection() {
    const ta = taRef.current!;
    return { v: ta.value, s: ta.selectionStart, e: ta.selectionEnd };
  }

  function wrap(before: string, after: string, placeholder: string) {
    if (!taRef.current) return;
    const { v, s, e } = selection();
    const sel = v.slice(s, e);
    const wrapped =
      v.slice(Math.max(0, s - before.length), s) === before &&
      v.slice(e, e + after.length) === after &&
      // `*` inside `**bold**` is not italic being switched off.
      !(before === "*" && (v[s - 2] === "*" || v[e + 1] === "*"));
    if (wrapped) {
      replace(s - before.length, e + after.length, sel, s - before.length, s - before.length + sel.length);
      return;
    }
    const inner = sel || placeholder;
    replace(s, e, before + inner + after, s + before.length, s + before.length + inner.length);
  }

  type LineKind = "h2" | "h3" | "ul" | "ol" | "quote";
  const HAS: Record<LineKind, RegExp> = {
    h2: /^## (?!#)/,
    h3: /^### /,
    ul: /^[-*] /,
    ol: /^\d+[.)] /,
    quote: /^> ?/,
  };

  function prefixLines(kind: LineKind) {
    if (!taRef.current) return;
    const { v, s, e } = selection();
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const endAt = e > s && v[e - 1] === "\n" ? e - 1 : e;
    let lineEnd = v.indexOf("\n", endAt);
    if (lineEnd === -1) lineEnd = v.length;
    const lines = v.slice(lineStart, lineEnd).split("\n");
    const filled = lines.filter((l) => l.trim());
    const allHave = filled.length > 0 && filled.every((l) => HAS[kind].test(l));
    const strip = (l: string) => l.replace(/^(#{1,6}\s+|[-*]\s+|\d+[.)]\s+|>\s?)/, "");
    let n = 0;
    const next = lines.map((l) => {
      if (!l.trim() && lines.length > 1) return l;
      const body = strip(l);
      if (allHave) return body;
      n += 1;
      const prefix = { h2: "## ", h3: "### ", ul: "- ", ol: `${n}. `, quote: "> " }[kind];
      return prefix + body;
    });
    const block = next.join("\n");
    const collapsed = s === e;
    replace(lineStart, lineEnd, block, collapsed ? lineStart + block.length : lineStart, lineStart + block.length);
  }

  /** Puts a block on its own, with a blank line either side. */
  function insertBlock(block: string, caretInside?: { offset: number; length: number }) {
    if (!taRef.current) return;
    const { v, s, e } = selection();
    const before = v.slice(0, s);
    const after = v.slice(e);
    const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const trail = after === "" ? "\n" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    const origin = s + lead.length;
    replace(
      s,
      e,
      lead + block + trail,
      caretInside ? origin + caretInside.offset : undefined,
      caretInside ? origin + caretInside.offset + caretInside.length : undefined
    );
  }

  function link() {
    if (!taRef.current) return;
    const { v, s, e } = selection();
    const sel = v.slice(s, e);
    if (sel) {
      const url = "https://";
      replace(s, e, `[${sel}](${url})`, s + sel.length + 3, s + sel.length + 3 + url.length);
    } else {
      const label = "link text";
      replace(s, e, `[${label}](https://)`, s + 1, s + 1 + label.length);
    }
  }

  function codeBlock() {
    if (!taRef.current) return;
    const { v, s, e } = selection();
    const sel = v.slice(s, e);
    insertBlock("```\n" + sel + "\n```", { offset: 4, length: sel.length });
  }

  /** The image under the caret, if the caret is on an image line outside a code block. */
  function detectImage() {
    const ta = taRef.current;
    if (!ta) return;
    const { value: v, selectionStart: s } = ta;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    let lineEnd = v.indexOf("\n", s);
    if (lineEnd === -1) lineEnd = v.length;
    const inCode = ((v.slice(0, lineStart).match(/^\s*```/gm) ?? []).length % 2) === 1;
    setImageAt(!inCode && parseImageLine(v.slice(lineStart, lineEnd)) ? lineStart : null);
  }

  const currentLine = (from: number) => {
    const end = text.indexOf("\n", from);
    return text.slice(from, end === -1 ? text.length : end);
  };
  const image: ParsedImage | null = imageAt !== null ? parseImageLine(currentLine(imageAt)) : null;

  /** Rewrites the image line in place. Goes through state rather than the edit
      command so the panel's controls keep focus while they are being used. */
  function rewriteImage(patch: Partial<ImageAttrs> & { alt?: string; src?: string }) {
    if (!image || imageAt === null) return;
    const { alt, src, ...attrs } = patch;
    const line = buildImageLine(alt ?? image.alt, src ?? image.src, { ...image.attrs, ...attrs });
    const end = imageAt + currentLine(imageAt).length;
    pendingSel.current = [imageAt + line.length, imageAt + line.length];
    commit(text.slice(0, imageAt) + line + text.slice(end));
  }

  function removeImage() {
    if (imageAt === null) return;
    const end = imageAt + currentLine(imageAt).length;
    // Take the line break with it, so no empty block is left behind.
    const next = text.slice(0, imageAt) + text.slice(text[end] === "\n" ? end + 1 : end);
    pendingSel.current = [imageAt, imageAt];
    commit(next);
    setImageAt(null);
  }

  function insertImage(item: MediaItem) {
    setPicker(false);
    if (pickerMode === "replace") {
      rewriteImage({ src: item.url });
      return;
    }
    const alt = item.alt || item.original_name.replace(/\.[^.]+$/, "");
    const line = buildImageLine(alt, item.url);
    // Caret goes inside the new line, which opens the image settings panel.
    insertBlock(line, { offset: 2, length: 0 });
    requestAnimationFrame(detectImage);
  }

  function openLibrary(mode: "insert" | "replace") {
    setPickerMode(mode);
    setPicker(true);
  }

  function insertSnippet(key: string) {
    const snippet = SNIPPETS[key];
    if (snippet) insertBlock(snippet);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && !e.shiftKey && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); wrap("**", "**", "bold text"); return; }
      if (k === "i") { e.preventDefault(); wrap("*", "*", "italic text"); return; }
      if (k === "k") { e.preventDefault(); link(); return; }
    }

    // Enter inside a list or quote carries the marker on (and a second Enter on
    // an empty item ends the list), like every other Markdown editor.
    if (e.key !== "Enter" || e.shiftKey || mod || e.altKey || e.nativeEvent.isComposing) return;
    const { v, s, e: end } = selection();
    if (s !== end) return;
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    let lineEnd = v.indexOf("\n", s);
    if (lineEnd === -1) lineEnd = v.length;
    if (v.slice(s, lineEnd).trim() !== "") return;
    const fences = (v.slice(0, lineStart).match(/^\s*```/gm) ?? []).length;
    if (fences % 2 === 1) return;

    const line = v.slice(lineStart, s);
    const li = line.match(/^(\s*)([-*]|(\d+)([.)])) (.*)$/);
    const q = li ? null : line.match(/^(\s*)> ?(.*)$/);
    if (!li && !q) return;
    const content = (li ? li[5] : q![2]).trim();
    if (!content) {
      e.preventDefault();
      replace(lineStart, s, "");
      return;
    }
    e.preventDefault();
    const indent = (li ?? q)![1];
    const marker = li ? (li[3] ? `${Number(li[3]) + 1}${li[4]}` : li[2]) : ">";
    replace(s, s, `\n${indent}${marker} `);
  }

  const words = useMemo(() => (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length, [text]);
  const sections = useMemo(() => (text.match(/^## /gm) ?? []).length, [text]);
  const minutes = Math.max(1, Math.round(words / 200));

  const showWrite = view !== "preview";
  const showPreview = view === "preview" || view === "split";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border-[0.5px] border-border bg-surface",
        full ? "fixed inset-0 z-[70] rounded-none" : "rounded-2xl"
      )}
    >
      {picker && <MediaPickerDialog onSelect={insertImage} onClose={() => setPicker(false)} />}

      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex flex-wrap items-center gap-x-1 gap-y-1.5 border-b border-border bg-background-secondary px-3 py-2"
      >
        <Tool label="Heading" shortcut="## " onClick={() => prefixLines("h2")}><Heading2 className="h-4 w-4" /></Tool>
        <Tool label="Subheading" shortcut="### " onClick={() => prefixLines("h3")}><Heading3 className="h-4 w-4" /></Tool>
        <Sep />
        <Tool label="Bold" shortcut="Ctrl/⌘ B" onClick={() => wrap("**", "**", "bold text")}><Bold className="h-4 w-4" /></Tool>
        <Tool label="Italic" shortcut="Ctrl/⌘ I" onClick={() => wrap("*", "*", "italic text")}><Italic className="h-4 w-4" /></Tool>
        <Tool label="Inline code" onClick={() => wrap("`", "`", "code")}><Code className="h-4 w-4" /></Tool>
        <Tool label="Link" shortcut="Ctrl/⌘ K" onClick={link}><Link2 className="h-4 w-4" /></Tool>
        <Sep />
        <Tool label="Bulleted list" onClick={() => prefixLines("ul")}><List className="h-4 w-4" /></Tool>
        <Tool label="Numbered list" onClick={() => prefixLines("ol")}><ListOrdered className="h-4 w-4" /></Tool>
        <Tool label="Quote" onClick={() => prefixLines("quote")}><Quote className="h-4 w-4" /></Tool>
        <Tool label="Code block" onClick={codeBlock}><SquareCode className="h-4 w-4" /></Tool>
        <Tool label="Divider" onClick={() => insertBlock("---")}><Minus className="h-4 w-4" /></Tool>
        <Sep />
        <Tool label="Insert image from the library" onClick={() => openLibrary("insert")}>
          <ImagePlus className="h-4 w-4" />
          <span className="hidden text-xs font-semibold xl:inline">Image</span>
        </Tool>
        <select
          aria-label="Insert a ready-made section"
          value=""
          onChange={(e) => insertSnippet(e.target.value)}
          className="focus-ring h-8 rounded-lg border-[0.5px] border-border bg-background px-2 text-xs font-semibold text-text-secondary"
        >
          <option value="">Insert section…</option>
          <option value="sources">Sources and further reading</option>
          <option value="next">Next steps (contact link)</option>
        </select>

        <div className="ml-auto flex items-center gap-1">
          <div role="group" aria-label="View" className="flex rounded-lg border-[0.5px] border-border bg-background p-0.5">
            <ViewButton active={view === "write"} onClick={() => setView("write")} label="Write"><PenLine className="h-3.5 w-3.5" /></ViewButton>
            <ViewButton active={view === "split"} onClick={() => setView("split")} label="Side by side" hideOnSmall><Columns2 className="h-3.5 w-3.5" /></ViewButton>
            <ViewButton active={view === "preview"} onClick={() => setView("preview")} label="Preview"><Eye className="h-3.5 w-3.5" /></ViewButton>
          </div>
          <Tool label="Markdown guide" active={help} onClick={() => setHelp((h) => !h)}><CircleHelp className="h-4 w-4" /></Tool>
          <Tool label={full ? "Exit full screen (Esc)" : "Full screen"} onClick={() => setFull((f) => !f)}>
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Tool>
        </div>
      </div>

      {image && (
        <ImageSettings
          // Remounts when the image changes, so the caption box starts from its text.
          key={`${imageAt}-${image.src}`}
          image={image}
          onChange={rewriteImage}
          onReplace={() => openLibrary("replace")}
          onRemove={removeImage}
          onClose={() => setImageAt(null)}
        />
      )}

      {help && (
        <div className="grid gap-x-8 gap-y-1.5 border-b border-border bg-background px-4 py-3 text-xs text-text-secondary sm:grid-cols-2 lg:grid-cols-3">
          <Guide k="## Heading" v="a section — also builds the contents list" />
          <Guide k="### Subheading" v="a smaller heading inside a section" />
          <Guide k="**bold**  ·  *italic*  ·  `code`" v="inline emphasis" />
          <Guide k="[text](/page)  ·  [text](https://…)" v="site link  ·  external link" />
          <Guide k="- item   ·   1. item" v="bulleted  ·  numbered list" />
          <Guide k="> quote" v="a highlighted quotation" />
          <Guide k="![caption](/uploads/…)" v="an image — use the Image button; click it to set size and position" />
          <Guide k="{width=50 align=right}" v="after an image: width %, left/center/right, ratio=16:9, frame=off" />
          <Guide k="---" v="a divider line" />
          <Guide k="``` … ```" v="a block of code" />
          <Guide k="Blank line" v="starts a new paragraph" />
        </div>
      )}

      <div
        className={cn(
          "grid min-h-0",
          full ? "flex-1" : "h-[78vh] min-h-[620px]",
          view === "split" ? "lg:grid-cols-2" : "grid-cols-1"
        )}
      >
        {showWrite && (
          <textarea
            id={id}
            ref={taRef}
            value={text}
            onChange={(e) => {
              commit(e.target.value);
              detectImage();
            }}
            /* `select` alone is unreliable for a moving caret across browsers, so the
               key and pointer events that move it re-check as well. */
            onSelect={detectImage}
            onKeyUp={detectImage}
            onClick={detectImage}
            onKeyDown={onKeyDown}
            spellCheck
            placeholder={"Start with a short summary paragraph, then use ## headings for each section.\n\nSelect text and use the toolbar, or type Markdown directly."}
            className="focus-ring h-full min-h-0 w-full resize-none bg-surface p-5 font-mono text-[14px] leading-7 text-text-primary placeholder:text-text-muted sm:p-6"
          />
        )}
        {showPreview && (
          <div
            className={cn(
              "min-h-0 overflow-y-auto bg-background p-6 sm:p-8",
              view === "split" && "hidden border-l border-border lg:block"
            )}
            aria-label="Preview"
          >
            <div className="mx-auto max-w-2xl">
              {previewLines.length > 0 ? (
                <ArticleBody body={previewLines} showContents={false} />
              ) : (
                <p className="text-sm text-text-muted">Nothing to preview yet — start writing.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-border bg-background-secondary px-4 py-2 text-xs text-text-muted">
        <span>
          {words.toLocaleString()} words · about {minutes} min read · {sections} {sections === 1 ? "section" : "sections"}
        </span>
        <span className="hidden sm:inline">Ctrl/⌘ B bold · I italic · K link · Enter continues a list</span>
      </div>
    </div>
  );
}

const ALIGN_OPTIONS: { value: ImageAlign; label: string; icon: typeof AlignLeft }[] = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Centre", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
];

const RATIO_OPTIONS: { value: ImageRatio; label: string }[] = [
  { value: "auto", label: "Original shape" },
  { value: "16:9", label: "Wide (16:9)" },
  { value: "4:3", label: "Standard (4:3)" },
  { value: "1:1", label: "Square (1:1)" },
];

const WIDTH_PRESETS = [25, 50, 75, 100];

/** Size, position and shape of the image the caret is on. Every change rewrites that one line. */
function ImageSettings({
  image,
  onChange,
  onReplace,
  onRemove,
  onClose,
}: {
  image: ParsedImage;
  onChange: (patch: Partial<ImageAttrs> & { alt?: string }) => void;
  onReplace: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const { attrs } = image;
  return (
    <div
      role="group"
      aria-label="Image settings"
      className="flex flex-wrap items-start gap-x-6 gap-y-3 border-b border-border bg-background px-4 py-3"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt=""
        className="h-16 w-24 shrink-0 rounded-lg border border-border bg-background-secondary object-cover"
      />

      <label className="flex min-w-48 flex-1 basis-56 flex-col gap-1 text-xs font-semibold text-text-secondary">
        Caption (also the alt text for search and screen readers)
        <input
          type="text"
          defaultValue={image.alt}
          onBlur={(e) => e.target.value !== image.alt && onChange({ alt: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
          placeholder="Describe the image"
          className="focus-ring h-9 rounded-lg border-[0.5px] border-border bg-surface px-3 text-sm font-normal text-text-primary"
        />
      </label>

      <div className="flex flex-col gap-1 text-xs font-semibold text-text-secondary">
        Width
        <div className="flex items-center gap-2">
          {WIDTH_PRESETS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onChange({ width: w })}
              aria-pressed={attrs.width === w}
              className={cn(
                "focus-ring h-8 rounded-lg border-[0.5px] px-2.5 text-xs font-semibold transition-colors",
                attrs.width === w
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border bg-surface text-text-secondary hover:text-link"
              )}
            >
              {w}%
            </button>
          ))}
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={attrs.width}
            onChange={(e) => onChange({ width: Number(e.target.value) })}
            aria-label="Image width, percent of the article column"
            className="w-28 accent-brand-blue"
          />
          <span className="w-10 text-right text-xs tabular-nums text-text-muted">{attrs.width}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs font-semibold text-text-secondary">
        Position
        <div role="group" aria-label="Position" className="flex rounded-lg border-[0.5px] border-border bg-surface p-0.5">
          {ALIGN_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={attrs.align === value}
              onClick={() => onChange({ align: value })}
              className={cn(
                "focus-ring flex h-7 w-8 items-center justify-center rounded-md transition-colors",
                attrs.align === value ? "bg-brand-blue text-white" : "text-text-secondary hover:text-link"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-text-secondary">
        Shape
        <select
          value={attrs.ratio}
          onChange={(e) => onChange({ ratio: e.target.value as ImageRatio })}
          className="focus-ring h-9 rounded-lg border-[0.5px] border-border bg-surface px-2 text-sm font-normal text-text-primary"
        >
          {RATIO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 self-end pb-2 text-xs font-semibold text-text-secondary">
        <input
          type="checkbox"
          checked={attrs.frame}
          onChange={(e) => onChange({ frame: e.target.checked })}
          className="h-4 w-4 rounded border-border accent-brand-blue"
        />
        Border and rounded corners
      </label>

      <div className="ml-auto flex items-center gap-1.5 self-end">
        <button type="button" onClick={onReplace} className="focus-ring h-8 rounded-lg border-[0.5px] border-border bg-surface px-3 text-xs font-semibold text-text-secondary hover:text-link">
          Replace image
        </button>
        <button type="button" onClick={onRemove} aria-label="Remove image" title="Remove image" className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border-[0.5px] border-border bg-surface text-text-muted hover:border-red-500/40 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={onClose} className="focus-ring h-8 rounded-lg px-3 text-xs font-semibold text-text-muted hover:text-text-primary">
          Done
        </button>
      </div>
      <p className="basis-full text-[11px] text-text-muted">
        Width and position apply on tablets and larger; on a phone every image fills the column.
      </p>
    </div>
  );
}

function Sep() {
  return <span aria-hidden className="mx-1 hidden h-5 w-px bg-border sm:inline-block" />;
}

function Tool({
  label,
  shortcut,
  onClick,
  active,
  children,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={shortcut ? `${label} (${shortcut.trim()})` : label}
      aria-label={label}
      aria-pressed={active}
      /* Keeps the textarea focused, and its selection intact, while a button is pressed. */
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "focus-ring inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg px-2 text-text-secondary transition-colors hover:bg-background hover:text-link",
        active && "bg-background text-link"
      )}
    >
      {children}
    </button>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  hideOnSmall,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hideOnSmall?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={cn(
        "focus-ring items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
        hideOnSmall ? "hidden lg:inline-flex" : "inline-flex",
        active ? "bg-brand-blue text-white" : "text-text-secondary hover:text-link"
      )}
    >
      {children}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function Guide({ k, v }: { k: string; v: string }) {
  return (
    <p className="flex flex-wrap gap-x-2">
      <code className="rounded bg-background-secondary px-1.5 py-0.5 font-mono text-text-primary">{k}</code>
      <span>{v}</span>
    </p>
  );
}
