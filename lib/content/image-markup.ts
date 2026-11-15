/**
 * How an image sits inside an article body.
 *
 * An image is one line of the body:
 *
 *   ![Caption](/uploads/photo.webp){width=60 align=right ratio=16:9 frame=off}
 *
 * The `{…}` part is optional, and so is every setting in it. What is left out
 * takes its default (full width, centred, natural shape, with a frame), so an
 * image written as plain `![Caption](/uploads/photo.webp)` renders exactly as
 * it always has. Only the keys below are read — anything else is ignored — so
 * the braces can never carry markup, styles or script into the page.
 *
 * This file has no imports: the article renderer and the admin editor both use
 * it, and they must agree on the format.
 */

export type ImageAlign = "left" | "center" | "right";
export type ImageRatio = "auto" | "16:9" | "4:3" | "1:1";

export type ImageAttrs = {
  /** Percent of the article column, 10–100. */
  width: number;
  align: ImageAlign;
  /** `auto` keeps the picture's own shape; the others crop it to fit. */
  ratio: ImageRatio;
  /** A hairline border and rounded corners. */
  frame: boolean;
};

export const DEFAULT_IMAGE_ATTRS: ImageAttrs = {
  width: 100,
  align: "center",
  ratio: "auto",
  frame: true,
};

export const IMAGE_ALIGNS: ImageAlign[] = ["left", "center", "right"];
export const IMAGE_RATIOS: ImageRatio[] = ["auto", "16:9", "4:3", "1:1"];

const LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{([^}]*)\})?$/;

export type ParsedImage = { alt: string; src: string; attrs: ImageAttrs };

/** The image on a body line, or null when the line is not an image. */
export function parseImageLine(line: string): ParsedImage | null {
  const m = line.trim().match(LINE);
  if (!m) return null;
  const attrs: ImageAttrs = { ...DEFAULT_IMAGE_ATTRS };
  for (const [, key, raw] of Array.from((m[3] ?? "").matchAll(/(\w+)=([\w:%.-]+)/g))) {
    const value = raw.toLowerCase();
    if (key === "width") {
      const n = parseFloat(value);
      if (Number.isFinite(n)) attrs.width = Math.min(100, Math.max(10, Math.round(n)));
    } else if (key === "align" && (IMAGE_ALIGNS as string[]).includes(value)) {
      attrs.align = value as ImageAlign;
    } else if (key === "ratio" && (IMAGE_RATIOS as string[]).includes(value)) {
      attrs.ratio = value as ImageRatio;
    } else if (key === "frame") {
      attrs.frame = !["off", "false", "0", "no"].includes(value);
    }
  }
  return { alt: m[1], src: m[2], attrs };
}

/** The body line for an image. Settings that match the defaults are left out. */
export function buildImageLine(alt: string, src: string, attrs: Partial<ImageAttrs> = {}): string {
  const a = { ...DEFAULT_IMAGE_ATTRS, ...attrs };
  const parts: string[] = [];
  if (a.width !== DEFAULT_IMAGE_ATTRS.width) parts.push(`width=${a.width}`);
  if (a.align !== DEFAULT_IMAGE_ATTRS.align) parts.push(`align=${a.align}`);
  if (a.ratio !== DEFAULT_IMAGE_ATTRS.ratio) parts.push(`ratio=${a.ratio}`);
  if (a.frame !== DEFAULT_IMAGE_ATTRS.frame) parts.push("frame=off");
  const cleanAlt = alt.replace(/[\][\r\n]/g, " ").trim();
  return `![${cleanAlt}](${src})${parts.length ? `{${parts.join(" ")}}` : ""}`;
}

/** `16:9` -> CSS `aspect-ratio` value, or undefined for the natural shape. */
export function cssAspect(ratio: ImageRatio): string | undefined {
  return ratio === "auto" ? undefined : ratio.replace(":", " / ");
}
