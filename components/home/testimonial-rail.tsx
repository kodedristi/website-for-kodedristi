"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PauseIcon,
  PlayIcon,
  QuoteUpIcon,
} from "hugeicons-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  slug: string;
  name: string;
  role: string;
  quote: string;
  videoUrl?: string;
  posterUrl?: string;
};

/**
 * Classify a testimonial video URL.
 *
 * A `<video>` element can only play a direct media file (mp4/webm/…). Pasting
 * a YouTube/Vimeo link into it fails silently, so those are rewritten into
 * their embed players instead. The embed URL is built with muted autoplay so
 * the clip still behaves like the file-based rail.
 */
type VideoSource = { kind: "file" } | { kind: "embed"; src: string };

function videoSource(url?: string): VideoSource {
  if (!url) return { kind: "file" };
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (youtube) {
    const id = youtube[1];
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      kind: "embed",
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1`,
    };
  }
  return { kind: "file" };
}

/**
 * Video testimonial rail.
 *
 * Playback model — click, not hover, and no separate sound control:
 *
 *  - Every clip sits paused on its first frame. Clicking a card plays it
 *    **with sound**; clicking again pauses it. One click, both things — a
 *    muted talking head that needs a second control to become audible is a
 *    control most visitors never find.
 *  - Exactly one clip plays at a time. Starting one pauses and re-mutes any
 *    other — two testimonials talking over each other is the failure mode.
 *  - A clip that finishes, or is scrolled out of view while playing, stops
 *    and returns to its first frame.
 *  - Under reduced motion the card shows native controls instead, so the
 *    content stays reachable without the custom play affordance.
 */
export function TestimonialRail({ items }: { items: TestimonialItem[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const videosRef = useRef(new Map<string, HTMLVideoElement>());

  const reduceMotion = useReducedMotion();

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  /** Toggle a clip: play it with sound, or pause it if it is already playing. */
  const toggle = useCallback(
    (slug: string) => {
      const video = videosRef.current.get(slug);
      if (!video) return;

      if (activeSlug === slug) {
        video.pause();
        setActiveSlug(null);
        return;
      }

      for (const [otherSlug, other] of videosRef.current) {
        if (otherSlug !== slug) {
          other.pause();
          other.muted = true;
        }
      }

      video.muted = false;
      video.play().catch(() => {
        // Autoplay policy can still refuse an unmuted play on a page with no
        // prior interaction; fall back to muted rather than a dead button.
        video.muted = true;
        video.play().catch(() => {});
      });
      setActiveSlug(slug);
    },
    [activeSlug]
  );

  /** Clip ended or scrolled away: drop it as the active one. */
  const clearActive = useCallback((slug: string) => {
    setActiveSlug((current) => (current === slug ? null : current));
  }, []);

  const updateArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const scrollable = rail.scrollWidth > rail.clientWidth + 8;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(!scrollable || rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateArrows();
    rail.addEventListener("scroll", updateArrows, { passive: true });

    // A one-shot measurement on mount goes stale: web fonts land, video
    // posters decode, and the card count can change with the CMS. Observing
    // the rail keeps the arrows honest about what is actually scrollable.
    const observer = new ResizeObserver(updateArrows);
    observer.observe(rail);
    for (const child of rail.children) observer.observe(child);

    return () => {
      rail.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const step = card ? card.clientWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({
      left: step * direction,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Always shown when there is more than one card, so the control is
          where the visitor expects it. Each arrow disables itself at its end
          of the track (and both disable when the whole rail already fits). */}
      {items.length > 1 && (
        <div className="flex items-center justify-end gap-2">
          <RailButton
            label="Previous testimonials"
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
          >
            <ArrowLeft01Icon className="h-6 w-6" />
          </RailButton>
          <RailButton
            label="More testimonials"
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
          >
            <ArrowRight01Icon className="h-6 w-6" />
          </RailButton>
        </div>
      )}

      <ul
        ref={railRef}
        // `snap-x` plus per-card `snap-start` keeps arrow scrolling and free
        // swiping landing on the same positions, so the two input methods
        // never disagree about where a card sits.
        // `no-scrollbar` hides the track — the rail still scrolls by swipe,
        // wheel and the arrow buttons above.
        // No `scroll-smooth` class here: it would force smooth scrolling even
        // when scrollByCard deliberately passes behavior "auto" for
        // reduced-motion users. Behaviour is decided per call instead.
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
      >
        {items.map((item) => (
          <TestimonialCard
            key={item.slug}
            item={item}
            isPlaying={activeSlug === item.slug}
            reduceMotion={reduceMotion ?? false}
            registerVideo={(el) => {
              if (el) videosRef.current.set(item.slug, el);
              else videosRef.current.delete(item.slug);
            }}
            onToggle={() => toggle(item.slug)}
            onStop={() => clearActive(item.slug)}
          />
        ))}
      </ul>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-border bg-surface text-text-secondary transition-colors duration-micro hover:border-brand-blue/40 hover:text-link disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function TestimonialCard({
  item,
  isPlaying,
  reduceMotion,
  registerVideo,
  onToggle,
  onStop,
}: {
  item: TestimonialItem;
  isPlaying: boolean;
  reduceMotion: boolean;
  registerVideo: (el: HTMLVideoElement | null) => void;
  onToggle: () => void;
  onStop: () => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(item.videoUrl);
  const source = videoSource(item.videoUrl);
  const isEmbed = source.kind === "embed";

  // A clip playing off-screen is disembodied audio and a wasted download —
  // with these files a large one. Stop it once its card leaves the viewport.
  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video || !hasVideo || isEmbed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          video.currentTime = 0;
          video.muted = true;
          onStop();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [hasVideo, isEmbed, onStop]);

  return (
    <li
      ref={cardRef}
      className="w-[68vw] max-w-70 shrink-0 snap-start sm:w-60 lg:w-65"
    >
      <div
        className={cn(
          "relative aspect-9/16 overflow-hidden rounded-2xl border-[0.5px] border-border bg-surface-elevated shadow-card transition-[box-shadow,border-color] duration-ui ease-out-quint",
          isPlaying ? "border-brand-blue/50 shadow-elevated" : "hover:border-brand-blue/40"
        )}
      >
        {isEmbed ? (
          /* YouTube/Vimeo links can't feed a `<video>` element; the embed
             player (muted autoplay) handles them instead. */
          <>
            <iframe
              src={source.src}
              title={`Video testimonial from ${item.name}, ${item.role}`}
              className="absolute inset-0 h-full w-full border-0 object-cover"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-black/60"
            />

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-white/75">{item.role}</p>
            </figcaption>
          </>
        ) : hasVideo ? (
          <>
            <video
              ref={(el) => {
                videoRef.current = el;
                registerVideo(el);
              }}
              src={item.videoUrl}
              poster={item.posterUrl}
              muted
              playsInline
              preload="metadata"
              controls={reduceMotion}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.muted = true;
                }
                onStop();
              }}
              aria-label={`Video testimonial from ${item.name}, ${item.role}`}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {!reduceMotion && (
              <>
                {/* Click layer: play with sound, or pause. Covers the frame
                    but sits under the caption. */}
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label={
                    isPlaying
                      ? `Pause ${item.name}'s testimonial`
                      : `Play ${item.name}'s testimonial with sound`
                  }
                  className="focus-ring absolute inset-0 z-10"
                />

                {/* Centre play badge — the affordance that says the still
                    frame is a video. Fades out while playing. */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-ui",
                    isPlaying ? "opacity-0" : "opacity-100"
                  )}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                    <PlayIcon className="h-6 w-6 translate-x-0.5" />
                  </span>
                </span>

                {/* While playing the centre badge is gone, so this top-right
                    cue is what says the card is still a click target — now to
                    pause. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white transition-opacity duration-micro",
                    isPlaying ? "opacity-100" : "opacity-0"
                  )}
                >
                  <PauseIcon className="h-4.5 w-4.5" />
                </span>
              </>
            )}

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-black/60"
            />

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-white/75">{item.role}</p>
            </figcaption>
          </>
        ) : (
          /* No clip supplied — the written quote fills the same 9:16 frame so
             the rail keeps its rhythm instead of showing a gap. */
          <figure className="flex h-full flex-col p-5">
            <QuoteUpIcon className="h-7.5 w-7.5 shrink-0 text-brand-green" />
            {/* Centred in the leftover space. Top-aligned, a short quote in a
                9:16 frame leaves an obvious hole under it. */}
            <blockquote className="flex flex-1 items-center overflow-y-auto py-4 text-sm leading-relaxed text-text-secondary">
              {item.quote}
            </blockquote>
            <figcaption className="shrink-0">
              <p className="text-sm font-semibold text-text-primary">{item.name}</p>
              <p className="text-xs text-text-muted">{item.role}</p>
            </figcaption>
          </figure>
        )}
      </div>
    </li>
  );
}
