"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Smooth scrolling for the marketing site.
 *
 * Lenis was already a dependency but had never been wired up. It is mounted
 * here rather than in the layout so it can be scoped by route and torn down
 * cleanly on navigation.
 *
 * Deliberately NOT applied to /admin: the panel is a data tool where people
 * scan long tables, and inertial scrolling actively fights that. Smoothing
 * belongs on pages you read, not pages you work in.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // Honour the OS setting. Inertial scrolling is a vestibular trigger, so
    // this is a hard opt-out, not a reduced-intensity path.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    // Touch screens keep the OS's own scrolling (`syncTouch` is off below), so
    // on a phone Lenis would load, parse and then do nothing. Only devices
    // with a mouse or trackpad get it.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let frame = 0;
    let teardown: (() => void) | undefined;

    // The library is fetched after the page is idle rather than bundled into
    // the first load: smooth scrolling is an enhancement nobody is waiting on.
    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis({
        // Tuned to feel like weight rather than lag. Higher lerp values drift
        // behind the input device and read as input latency.
        lerp: 0.12,
        wheelMultiplier: 1,
        // Native touch scrolling on mobile: the OS already does this well, and
        // overriding it costs battery and breaks pull-to-refresh.
        syncTouch: false,
      });

      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);

      teardown = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
      : window.setTimeout(() => void start(), 500);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      teardown?.();
    };
  }, [isAdmin]);

  return null;
}
