import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/content/seo";
import { getLandingPage } from "@/lib/data/landing-pages";
import { LandingPageView } from "@/components/seo/landing-page-view";

export const revalidate = 3600;

const page = getLandingPage("digital-transformation-nepal");

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(page.slug, {
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
  });
}

export default function DigitalTransformationNepalPage() {
  return <LandingPageView page={page} />;
}
