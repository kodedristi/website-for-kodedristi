"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/hooks/use-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** A GA4 Measurement ID looks like G-XXXXXXXXXX; anything else is ignored. */
const MEASUREMENT_ID = (() => {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id && /^G-[A-Z0-9]{6,14}$/.test(id) ? id : null;
})();

/**
 * Google Analytics 4, switched on only when both are true:
 *  - NEXT_PUBLIC_GA_MEASUREMENT_ID is set, and
 *  - the visitor pressed "Accept all" on the cookie banner.
 *
 * Until then no request goes to Google and no script is downloaded, so the
 * site's speed and its "essential cookies only" promise are unaffected. The
 * script loads after the page is idle. The first page view is sent by GA's
 * own config call; later client-side navigations, which do not reload the
 * page, are reported here.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const consent = useConsent();
  const enabled = MEASUREMENT_ID !== null && consent === "accepted" && !pathname.startsWith("/admin");
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (lastPath.current === null) {
      // First page since GA was enabled: the config call reports it.
      lastPath.current = pathname;
      return;
    }
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <>
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${MEASUREMENT_ID}',{anonymize_ip:true});`}
      </Script>
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
    </>
  );
}

/** Whether GA is configured, so the cookie banner can describe it truthfully. */
export const GA_ENABLED = MEASUREMENT_ID !== null;
