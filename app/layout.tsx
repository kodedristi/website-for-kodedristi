import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { FirstLoadSplash, SPLASH_SEEN_SCRIPT } from "@/components/motion/first-load-splash";
import { Navbar } from "@/components/site-header/navbar";
import { Footer } from "@/components/site-footer/footer";
import { GlobalChrome } from "@/components/global-chrome";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AnalyticsTracker } from "@/components/auth/analytics-tracker";
import { CookieConsent } from "@/components/auth/cookie-consent";
import { navGroups } from "@/lib/data/nav";
import { getSolutions } from "@/lib/content/resolvers";
import { SITE_URL } from "@/lib/content/seo";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IT & Software Development Company in Nepal — Kodedristi Software",
    template: "%s — Kodedristi Software",
  },
  description:
    "Kodedristi Software Pvt. Ltd. is an IT and software development company in Kathmandu, Nepal building custom software, web and mobile apps, ERP, CRM, accounting and billing software, SaaS and AI solutions, with software outsourcing and IT courses.",
  // Google ignores this tag; kept short for other engines. The real targeting
  // lives in each page's title, H1 and copy (see docs/seo-keyword-map.md).
  keywords: [
    "IT company in Nepal",
    "best IT company in Nepal",
    "IT company in Kathmandu",
    "software company Nepal",
    "software development company Nepal",
    "software company Kathmandu",
    "IT company Kathmandu",
    "custom software development Nepal",
    "web development company Nepal",
    "mobile app development company Nepal",
    "ERP software Nepal",
    "CRM software Nepal",
    "HR payroll software Nepal",
    "inventory management software Nepal",
    "billing software Nepal",
    "accounting software Nepal",
    "AI development company Nepal",
    "digital transformation Nepal",
    "software outsourcing Nepal",
    "Kodedristi",
  ],
  openGraph: {
    title: "Kodedristi Software — Software Delivery, AI & Courses",
    description:
      "Kodedristi Software Pvt. Ltd. builds web and mobile apps, SaaS products, AI solutions and custom software, while offering practical IT courses in Nepal.",
    siteName: "Kodedristi Software",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
};

/**
 * The Solutions dropdown used to be pure static data. It went stale the
 * moment someone unpublished a solution in the admin — the nav kept
 * linking to it regardless, and every one of those links 404’d. Rebuilding
 * this group from the actual published list on every request means an
 * unpublish is instantly reflected everywhere the nav renders (desktop,
 * mobile, footer all take the same resolved list), and it can never drift
 * out of sync again — there is nothing left to keep in sync.
 */
async function getLiveNavGroups() {
  const solutions = await getSolutions();
  return navGroups.map((group) =>
    group.label === "Solutions"
      ? {
          ...group,
          items: solutions.map((s) => ({
            label: s.name,
            href: `/solutions/${s.slug}`,
            description: s.tagline,
          })),
        }
      : group
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const liveNavGroups = await getLiveNavGroups();
  return (
    <html
      lang="en"
      className={`h-full antialiased ${albertSans.variable}`}
      /* The head script adds `no-splash` to this element before React hydrates. */
      suppressHydrationWarning
    >
      <head>
        {/* Marks repeat visits before first paint so the splash never draws
            for someone who has already seen it this session. */}
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SEEN_SCRIPT }} />
        {/* Scroll reveals are written into the server markup as opacity: 0,
            so with scripting off there is nothing left to turn them back on.
            `!important` is what lets a stylesheet rule beat those inline
            styles. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-background text-text-secondary">
        <SmoothScroll />
        <FirstLoadSplash />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <GlobalChrome navbar={<Navbar navGroups={liveNavGroups} />} footer={<Footer navGroups={liveNavGroups} />}>
          {children}
        </GlobalChrome>
        <AnalyticsTracker />
        <CookieConsent />
      </body>
    </html>
  );
}
