"use client";

import { useEffect, useMemo, useState } from "react";
import { getImageProps } from "next/image";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * One slide's picture, art-directed in the markup itself.
 *
 * The mobile image used to be chosen in JavaScript after hydration, so a
 * phone downloaded the desktop image first (the server render cannot know the
 * viewport), then a second one once the script ran, and its largest paint
 * moved from one to the other. A `<picture>` lets the browser pick before it
 * fetches anything. `getImageProps` keeps next/image's resizing and formats.
 */
function SlidePicture({
  src,
  mobileSrc,
  priority,
}: {
  src: string;
  mobileSrc?: string;
  priority: boolean;
}) {
  const common = { alt: "", fill: true, sizes: "100vw", priority } as const;
  const {
    props: { srcSet: desktopSet, ...img },
  } = getImageProps({ ...common, src });
  const mobileSet = mobileSrc ? getImageProps({ ...common, src: mobileSrc }).props.srcSet : undefined;

  return (
    <picture>
      {mobileSet && <source media="(max-width: 767px)" srcSet={mobileSet} sizes="100vw" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- props come from getImageProps */}
      <img {...img} srcSet={desktopSet} className="object-cover object-center" />
    </picture>
  );
}

export type BackdropSlide = {
  imageUrl: string;
  mobileImageUrl?: string;
  displayOrder?: number | string;
  textTone?: "light" | "dark";
  overlayOpacity?: string | number;
};

/**
 * A section's background, as a slow crossfade through admin-managed images.
 *
 * The photographs are shown as they were uploaded — no blanket scrim. A wash
 * dark enough to guarantee contrast over *any* image is dark enough to ruin
 * every image, so legibility is handled per picture instead: each slide
 * carries the text colour it wants, and the copy passed in as `children`
 * takes that colour and crossfades with it.
 *
 * Decorative, so the picture layer is `aria-hidden` and carries no controls —
 * a background is not a carousel, and prev/next buttons would put scenery in
 * the tab order ahead of the section's real content. Rotation stops for
 * `prefers-reduced-motion`, and the admin's switch stops it for everyone.
 *
 * Every slide stays mounted and cross-fades by opacity rather than swapping
 * `src`. Swapping means the incoming image only starts loading when it is
 * needed, which shows as a flash of empty background on a slow connection.
 */
export function SectionBackdropSlideshow({
  slides,
  intervalSeconds = 6,
  autoPlay = true,
  className,
  children,
}: {
  slides: BackdropSlide[];
  intervalSeconds?: number;
  autoPlay?: boolean;
  className?: string;
  /** The section's copy. Rendered inside the tone wrapper so it can follow
   *  the active slide's text colour. */
  children?: React.ReactNode;
}) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);

  const ordered = useMemo(
    () =>
      [...slides].sort(
        (a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0)
      ),
    [slides]
  );

  const count = ordered.length;
  const rotating = autoPlay && !reduceMotion && count > 1;

  // Hooks run before any early return — bailing out above this line would
  // change the hook order between renders.
  useEffect(() => {
    if (!rotating) return;
    const ms = Math.max(2, Number(intervalSeconds) || 6) * 1000;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ms);
    return () => clearInterval(id);
  }, [rotating, count, intervalSeconds]);

  // Derived, not stored: if the image list shrinks in the admin the saved
  // pointer can sit past the end, and wrapping it here avoids an effect whose
  // only job is to correct state it just rendered from.
  const active = count > 0 ? index % count : 0;
  const tone = ordered[active]?.textTone === "dark" ? "dark" : "light";

  return (
    <>
      {count > 0 && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
            className
          )}
        >
          {ordered.map((slide, i) => {
            const wash = Number(slide.overlayOpacity ?? 0) / 100;
            const slideTone = slide.textTone === "dark" ? "dark" : "light";
            return (
              <div
                key={`${slide.imageUrl}-${i}`}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                <SlidePicture
                  src={slide.imageUrl}
                  mobileSrc={slide.mobileImageUrl}
                  priority={i === 0}
                />
                {/* Tinted to match the text: white copy wants the picture
                    pushed darker, black copy wants it pushed lighter. Only
                    drawn when the admin asks for it. */}
                {wash > 0 && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: slideTone === "dark" ? "#ffffff" : "#0f1219",
                      opacity: wash,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        data-tone={tone}
        className={cn(
          "group/tone flex grow flex-col transition-colors duration-1000 ease-out motion-reduce:transition-none",
          tone === "dark" ? "text-surface-ink" : "text-white"
        )}
      >
        {children}
      </div>
    </>
  );
}
