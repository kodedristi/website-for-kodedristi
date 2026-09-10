import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import { FirstLoadSplash } from "@/components/motion/first-load-splash";
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
    default: " Kodedristi Software — AI Products, Custom Software & IT Consulting",
    template: "%s — Kodedristi Software",
  },
  description:
    "Kodedristi Software Pvt. Ltd. builds web and mobile apps, SaaS products, AI solutions and custom software, while offering practical IT courses in Nepal.",
  keywords: [
  // Brand
  "Kodedristi",
  "KodeDristi Software",
  "Kodedristi Software Pvt Ltd",
  "Kodedristi Nepal",
  "Kodedristi Software Nepal",

  // Software Development
  "software development Nepal",
  "software development company Nepal",
  "software company Nepal",
  "custom software development",
  "custom software development Nepal",
  "software development services Nepal",
  "IT company Nepal",
  "IT services Nepal",
  "software solutions Nepal",
  "enterprise software development Nepal",
  "business software development Nepal",

  // Web Development
  "web development Nepal",
  "web development company Nepal",
  "website development Nepal",
  "website development company Nepal",
  "custom website development Nepal",
  "web application development Nepal",
  "web app development Nepal",
  "full stack development Nepal",
  "Next.js development Nepal",
  "React development Nepal",
  "Node.js development Nepal",

  // Mobile App Development
  "mobile app development Nepal",
  "mobile application development Nepal",
  "mobile app development company Nepal",
  "Android app development Nepal",
  "iOS app development Nepal",
  "Flutter app development Nepal",
  "cross platform app development Nepal",
  "custom mobile app development Nepal",

  // AI
  "AI software development Nepal",
  "AI development company Nepal",
  "AI company Nepal",
  "AI solutions Nepal",
  "AI development services Nepal",
  "artificial intelligence Nepal",
  "AI application development Nepal",
  "AI automation Nepal",
  "AI automation services Nepal",
  "AI integration services Nepal",
  "custom AI solutions Nepal",
  "machine learning development Nepal",
  "machine learning company Nepal",
  "generative AI development Nepal",
  "AI chatbot development Nepal",
  "AI chatbot Nepal",

  // SaaS & Products
  "SaaS development Nepal",
  "SaaS development company Nepal",
  "SaaS product development Nepal",
  "custom SaaS development",
  "SaaS solutions Nepal",
  "software product development Nepal",
  "startup software development Nepal",
  "MVP development Nepal",
  "MVP development company Nepal",

  // Business / Digital Solutions
  "digital solutions Nepal",
  "digital transformation Nepal",
  "business automation Nepal",
  "business software solutions Nepal",
  "custom business software Nepal",
  "IT consulting Nepal",
  "technology consulting Nepal",
  "digital product development Nepal",
  "technology solutions Nepal",

  // API / Backend
  "API development Nepal",
  "API integration Nepal",
  "backend development Nepal",
  "backend development company Nepal",
  "REST API development Nepal",
  "database development Nepal",
  "cloud software development Nepal",

  // UI/UX
  "UI UX design Nepal",
  "UI UX design company Nepal",
  "UX design Nepal",
  "UI design Nepal",
  "product design Nepal",
  "web design Nepal",
  "mobile app UI UX design Nepal",

  // IT Courses
  "IT courses Nepal",
  "IT training Nepal",
  "IT training institute Nepal",
  "software development courses Nepal",
  "programming courses Nepal",
  "coding courses Nepal",
  "web development course Nepal",
  "full stack development course Nepal",
  "MERN stack course Nepal",
  "React course Nepal",
  "Node.js course Nepal",
  "Python course Nepal",
  "Python programming course Nepal",
  "data analysis course Nepal",
  "machine learning course Nepal",
  "AI course Nepal",
  "AI training Nepal",
  "AI course Kathmandu",
  "programming course Kathmandu",
  "IT training Kathmandu",

  // Local
  "software company Kathmandu",
  "software development Kathmandu",
  "web development Kathmandu",
  "mobile app development Kathmandu",
  "AI company Kathmandu",
  "AI development Kathmandu",
  "IT company Kathmandu",
  "IT services Kathmandu",
  "software developer Nepal",
  "software developers Kathmandu"
],
  openGraph: {
    title: "Kodedristi Software — Software Delivery, AI & Courses",
    description:
      "Kodedristi Software Pvt. Ltd. builds web and mobile apps, SaaS products, AI solutions and custom software, while offering practical IT courses in Nepal.",
    siteName: "Kodedristi Software",
    type: "website",
    images: ["/images/logo.png"],
  },
  twitter: {
    card: "summary",
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
    >
      <head>
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
