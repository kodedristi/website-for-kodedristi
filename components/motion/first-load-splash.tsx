"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * First-load splash: the KodeDristi logo shown once, over the first moment of
 * the page.
 *
 * Why it only appears once: it mounts in the root layout, which Next.js keeps
 * mounted across client-side navigations. A session flag, read by a tiny
 * script in the document head before first paint (see `SPLASH_SEEN_SCRIPT`),
 * also skips it on a reload or return visit in the same tab.
 *
 * Its timing is CSS, not JavaScript. It used to lift only once the script had
 * hydrated the page and the window `load` event had fired, so on a phone the
 * visitor stared at a logo for as long as the JavaScript took to arrive, while
 * the page behind it was already in the HTML. Now `.splash-root` plays a fixed
 * hold-then-fade (globals.css) that starts at first paint and ends the same
 * moment however slow the device is. This component only takes the finished,
 * invisible overlay out of the DOM afterwards.
 */

export const SPLASH_SEEN_KEY = "kd-splash-seen";

/** Runs in <head> before first paint: marks the document so the overlay is
 *  never drawn on a repeat visit. */
export const SPLASH_SEEN_SCRIPT = `try{if(sessionStorage.getItem("${SPLASH_SEEN_KEY}")==="1")document.documentElement.classList.add("no-splash")}catch(e){}`;

/** Hold (600ms) + fade (400ms) from globals.css, plus a little slack. */
const SPLASH_TOTAL_MS = 1100;

export function FirstLoadSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
    } catch {
      // Storage blocked: every page load behaves like a first visit.
    }
    const timer = setTimeout(() => setGone(true), Math.max(0, SPLASH_TOTAL_MS - performance.now()));
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div
      className="splash-root fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      role="status"
      aria-label="KodeDristi is loading"
    >
      <div className="splash-logo">
        <div className="relative h-24 w-[214px]">
          <Image
            src="/images/logo.png"
            alt="KodeDristi Software Pvt. Ltd."
            fill
            priority
            className="object-contain object-center"
            sizes="214px"
          />
        </div>
      </div>
    </div>
  );
}
