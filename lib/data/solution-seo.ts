/**
 * What each solution page is called in search results.
 *
 * The CMS names are written for the site's own voice ("Build Apps",
 * "Build Website"), but a search result is a title read out of context, and
 * it is also the label Google shows on each sitelink under the homepage. So
 * the `<title>` and meta description come from here, keyed by the solution's
 * slug, and fall back to the CMS name and tagline for any slug not listed -
 * a solution added in the admin still gets a title, just not a tuned one.
 *
 * Titles are kept short: Google truncates sitelink and result titles around
 * 60 characters, and the " — Kodedristi Software" suffix is added on top.
 */
export const SOLUTION_SEO: Record<string, { title: string; description: string }> = {
  "web-mobile-apps": {
    title: "Web & Mobile App Development in Nepal",
    description:
      "Custom web and mobile app development in Nepal: product-grade apps for iOS, Android and the web, designed and built by Kodedristi in Kathmandu.",
  },
  "website-development": {
    title: "Website Development in Nepal",
    description:
      "Fast, search-friendly business websites built in Nepal: design, development, content structure and launch by Kodedristi Software.",
  },
  "saas-products": {
    title: "SaaS Product Development in Nepal",
    description:
      "SaaS development in Nepal: multi-tenant platforms built to scale, from MVP to production, by Kodedristi Software.",
  },
  "ai-automation": {
    title: "AI & Automation Development in Nepal",
    description:
      "Applied AI, chatbots and workflow automation that remove manual work, built by Kodedristi Software in Kathmandu.",
  },
  "custom-software": {
    title: "Custom Software Development in Nepal",
    description:
      "Purpose-built software for your workflow: custom business systems designed and developed by Kodedristi in Nepal.",
  },
  cloud: {
    title: "Cloud Architecture & Migration in Nepal",
    description:
      "Cloud architecture, migration and cost control for growing businesses, from Kodedristi Software in Kathmandu.",
  },
  "devops-security": {
    title: "DevOps & Security Services in Nepal",
    description:
      "CI/CD, infrastructure and security so you can ship faster with less downtime, from Kodedristi Software.",
  },
  "domain-hosting": {
    title: "Domain & Web Hosting in Nepal",
    description:
      "Reliable domain registration, web hosting and infrastructure for businesses in Nepal, managed by Kodedristi.",
  },
  seo: {
    title: "SEO Services in Nepal",
    description:
      "Search engine optimisation that builds organic traffic: technical SEO, content and local SEO from Kodedristi Software.",
  },
  "ui-ux-design": {
    title: "UI/UX Design Services in Nepal",
    description:
      "Interfaces people find intuitive: UI/UX design for web and mobile products by Kodedristi in Kathmandu.",
  },
  "graphic-design": {
    title: "Graphic Design & Branding in Nepal",
    description:
      "Brand identity, creatives and print assets designed by the Kodedristi team in Kathmandu, Nepal.",
  },
  "digital-marketing": {
    title: "Digital Marketing in Nepal",
    description:
      "Campaigns and strategy that drive measurable results, from Kodedristi Software's digital marketing team.",
  },
};
