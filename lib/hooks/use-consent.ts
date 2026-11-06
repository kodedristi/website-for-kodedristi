"use client";

import { useSyncExternalStore } from "react";

/** Fired by the cookie banner when a choice is made, so listeners re-read. */
export const CONSENT_EVENT = "kd-consent-change";

export type Consent = "accepted" | "essential" | null;

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

function read(): Consent {
  const hit = document.cookie.split("; ").find((c) => c.startsWith("kd_consent="));
  const value = hit?.slice("kd_consent=".length);
  return value === "accepted" || value === "essential" ? value : null;
}

/**
 * The visitor's cookie choice: "accepted" (all), "essential" (only), or null
 * if they have not chosen. The server snapshot is null, so nothing that
 * depends on consent renders before the browser has been asked.
 */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => null);
}
