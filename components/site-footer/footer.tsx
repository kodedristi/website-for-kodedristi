import Link from "next/link";
import Image from "next/image";
import {
  Mail01Icon,
  Location01Icon,
  Call02Icon,
  Clock01Icon,
  ArrowRight01Icon,
  Facebook01Icon,
  Linkedin01Icon,
  InstagramIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "hugeicons-react";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/content/resolvers";
import type { NavGroup } from "@/lib/data/nav";

/**
 * Contact details and social links come from the `site-settings` row rather
 * than from this file, so they are one edit in the admin instead of several
 * across the footer, the contact page and the structured data.
 */

const EXPLORE_LINKS = [
  { label: "National AI Hackathon", href: "/hackathon" },
  { label: "Dristi Lagani", href: "/dristi-lagani" },
  { label: "News / Insights", href: "/insights" },
  { label: "Courses", href: "/learn" },
  { label: "Gallery", href: "/gallery/hackathon" },
];

export async function Footer({ navGroups }: { navGroups: NavGroup[] }) {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const hours = [settings.officeHours, settings.officeDays]
    .filter((part) => part && part.trim())
    .join(" · ");

  const socials = [
    { href: settings.facebook, label: "Facebook", Icon: Facebook01Icon },
    { href: settings.linkedin, label: "LinkedIn", Icon: Linkedin01Icon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof Facebook01Icon } =>
    Boolean(s.href && s.href.trim())
  );

  return (
    <footer className="relative z-10 border-t border-border bg-footer-bg text-footer-text">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-4">
            <div className="relative h-11 w-24.5">
              <Image
                src="/images/logo.png"
                alt="KodeDristi Software Pvt. Ltd."
                fill
                sizes="98px"
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-footer-text-muted">
              {settings.tagline}
              {settings.footerNote && (
                <span className="mt-1 block text-base font-semibold text-footer-text">
                  {settings.footerNote}
                </span>
              )}
            </p>

            <div className="flex flex-col gap-2.5 text-sm text-footer-text-muted">
              <a href={settings.phoneHref} className="flex items-center gap-2.5 hover:text-footer-heading">
                <Call02Icon className="h-5 w-5 shrink-0 text-brand-green" /> {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-footer-heading"
              >
                <Mail01Icon className="h-5 w-5 shrink-0 text-brand-green" /> {settings.email}
              </a>
              <span className="flex items-center gap-2.5">
                <Location01Icon className="h-5 w-5 shrink-0 text-brand-green" /> {settings.address}
              </span>
              {hours && (
                <span className="flex items-center gap-2.5">
                  <Clock01Icon className="h-5 w-5 shrink-0 text-brand-green" /> {hours}
                </span>
              )}
            </div>

            {socials.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-footer-divider text-footer-text-muted transition-colors hover:border-brand-green hover:text-brand-green"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav groups + Explore */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:col-span-2 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-3.5">
                <Link
                  href={group.href}
                  className="text-sm font-semibold text-footer-heading hover:text-brand-green"
                >
                  {group.label}
                </Link>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-footer-text-muted hover:text-brand-green"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-3.5">
              <span className="text-sm font-semibold text-footer-heading">Explore</span>
              <ul className="flex flex-col gap-2.5">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-footer-text-muted hover:text-brand-green"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Call-to-action strip */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-card border-[0.5px] border-footer-divider bg-surface/40 px-6 py-6 sm:flex-row sm:items-center lg:mt-16">
          <div>
            <p className="text-base font-semibold text-footer-heading">
              Have a project or proposal in mind?
            </p>
            <p className="mt-0.5 text-sm text-footer-text-muted">
              Tell us what you&apos;re building — we reply within one business day.
            </p>
          </div>
          <Link
            href="/contact?section=proposal"
            className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-control bg-brand-green px-5 py-2.5 text-sm font-semibold text-text-on-green transition-colors hover:bg-brand-green-hover"
          >
            Send a proposal <ArrowRight01Icon className="h-5 w-5" />
          </Link>
        </div>
      </Container>

      <div className="border-t border-footer-divider">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-footer-text-muted sm:flex-row">
          <p>
            &copy; {year} {settings.companyName} All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/about" className="hover:text-brand-green">
              About
            </Link>
            <Link href="/contact" className="hover:text-brand-green">
              Contact
            </Link>
            <Link href="/sitemap.xml" className="hover:text-brand-green">
              Sitemap
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
