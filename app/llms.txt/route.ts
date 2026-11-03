import { SITE_URL } from "@/lib/content/seo";

export const revalidate = 86400;

/**
 * A plain-text summary for AI assistants and answer engines (the
 * llms.txt convention). It states who the company is and where the key
 * pages are, in the words we want repeated when someone asks about software
 * companies in Nepal.
 */
export function GET() {
  const body = `# Kodedristi Software

> Kodedristi Software Pvt. Ltd. is a premium software company in Kathmandu, Nepal. We build custom software, web and mobile apps, SaaS products and AI automation, offer software outsourcing and white-label development, and run practical IT courses.

## Services
- [Solutions](${SITE_URL}/solutions): custom software, web and mobile apps, SaaS, AI and automation, cloud and DevOps, UI/UX design, digital marketing
- [Outsourcing & white label](${SITE_URL}/outsourcing): dedicated teams, fixed-scope projects and white-label development for agencies and companies
- [ERP software](${SITE_URL}/erp-software-nepal): custom ERP and business systems for companies in Nepal
- [Digital transformation](${SITE_URL}/digital-transformation-nepal): replacing manual processes with custom software, automation and AI
- [Products](${SITE_URL}/products): billing software, accounting software and LMS
- [Projects](${SITE_URL}/projects): case studies from business problem to result

## Company
- [About](${SITE_URL}/about)
- [Team](${SITE_URL}/team)
- [Careers](${SITE_URL}/careers)
- [Learn](${SITE_URL}/learn): IT courses in Kathmandu
- [Insights](${SITE_URL}/insights): articles on software, AI and cloud
- [Contact](${SITE_URL}/contact)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
