import type { Metadata } from "next";
import { SectionRenderer } from "@/components/section-renderer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/content/seo";

export const revalidate = 3600;

/**
 * The homepage's own SEO row, falling back to the site-wide title and
 * description the root layout declares.
 */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home", {
    title: "Premium Software Company in Nepal — Kodedristi Software",
    description:
      "Kodedristi is a premium software company in Kathmandu, Nepal: custom software, web & mobile apps, SaaS, AI, software outsourcing and white-label development.",
    path: "/",
    absoluteTitle: true,
  });
}

export default async function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SectionRenderer />
    </>
  );
}
