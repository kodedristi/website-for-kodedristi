"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "kd_vid";
const SESSION_KEY = "kd_visit_session";
/** A session ends after this long without a page view, as in other analytics tools. */
const SESSION_IDLE_MS = 30 * 60 * 1000;

type Session = { id: string; last: number; ref: string; utmSource: string; utmMedium: string };

function randomId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readCookie(name: string): string | null {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

/** The browser's stable id: created once, kept in localStorage and a cookie. */
function visitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY) ?? readCookie(VISITOR_KEY);
    if (!id) id = randomId();
    localStorage.setItem(VISITOR_KEY, id);
    document.cookie = `${VISITOR_KEY}=${id}; path=/; max-age=31536000; samesite=lax`;
    return id;
  } catch {
    // Storage blocked (private mode): fall back to a cookie, then to a
    // throwaway id, which counts this page load as its own visitor.
    return readCookie(VISITOR_KEY) ?? randomId();
  }
}

/**
 * The current session, started if there is none or the last one went idle.
 *
 * Where the visitor came from is read once, when the session starts, and
 * carried on every later page view of that session. Reading it per page would
 * report each internal click as "direct", because the referrer of a
 * client-side navigation is the page they were already on.
 */
function currentSession(): Session {
  const now = Date.now();
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as Session | null;
    if (saved && saved.id && now - saved.last < SESSION_IDLE_MS) {
      saved.last = now;
      localStorage.setItem(SESSION_KEY, JSON.stringify(saved));
      return saved;
    }
  } catch {
    // Unreadable or blocked storage: start a fresh session below.
  }

  const params = new URLSearchParams(window.location.search);
  const session: Session = {
    id: randomId(),
    last: now,
    ref: document.referrer || "",
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Blocked: this page view is recorded as its own session.
  }
  return session;
}

/**
 * Counts page views for the admin dashboard.
 *
 * Skips automated browsers (`navigator.webdriver` is true under Lighthouse,
 * Puppeteer and Playwright) and pages the browser is only prerendering, so a
 * speed test or a speculative load is not reported as a visitor. The server
 * applies the same rule to crawler user agents.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (navigator.webdriver) return;
    if ((document as Document & { prerendering?: boolean }).prerendering) return;

    const timer = window.setTimeout(() => {
      const session = currentSession();
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          visitorId: visitorId(),
          sessionId: session.id,
          referrer: session.ref,
          utmSource: session.utmSource,
          utmMedium: session.utmMedium,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 300);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
