/**
 * The OAuth callback URL Google redirects back to.
 *
 * Google requires an exact match against a URI registered in the Cloud
 * Console, so this is derived from the host the request actually came in on
 * rather than a single hard-coded origin — visiting via the apex domain, the
 * www subdomain or the vercel.app URL each produces the matching callback,
 * and every one you use just has to be added to the client's "Authorised
 * redirect URIs" list. `GOOGLE_REDIRECT_URI` overrides it outright when a
 * fixed value is needed.
 */
export function resolveRedirectUri(host?: string | null): string {
  const override = process.env.GOOGLE_REDIRECT_URI;
  if (override) return override;

  if (host) {
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const protocol = isLocal ? "http" : "https";
    return `${protocol}://${host}/api/auth/google/callback`;
  }

  const fallback = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${fallback.replace(/\/+$/, "")}/api/auth/google/callback`;
}
