# Kodedristi keyword map

Researched 2026-11-03 from live search results for each phrase. This is a map of **intent,
who ranks, and which page owns the phrase**. It does not contain search volumes or difficulty
scores: web search cannot return them, and invented numbers would mislead. Get the real figures
from **Google Keyword Planner** (free with a Google Ads account) and, once the site has data,
**Search Console → Performance → Queries**, then fill the empty columns below.

Rule: one phrase, one owning page. Two pages chasing the same phrase compete with each other.

## 1. Keyword to page

| Keyword | Intent | What the results look like | Owning page | Status |
|---|---|---|---|---|
| software company in Nepal | Commercial / list | Dominated by directories and rankings (ZoomInfo, Latka, GitHub lists, news "top companies" posts) plus agency pages. High competition. | `/` | Title and H1 retargeted |
| software development company in Nepal | Commercial | Agency homepages and blog posts, Clutch / GoodFirms listings. High. | `/` | Title retargeted |
| software company in Kathmandu | Local commercial | Directory profiles (Clutch, DesignRush, TechBehemoths, SoftwareSuggest) plus agency pages. High. | `/` + Google Business Profile | Needs GBP (section 4) |
| best IT company in Nepal | Commercial / comparison | "Top IT companies" list articles. You rank here by being listed and cited, not by a service page. | `/about` + listings | Off-page work |
| web development company in Nepal | Commercial | Agency pages, Clutch lists, many price-guide blogs. High. | `/solutions/website-development` | Title exists |
| website development cost in Nepal | Informational → commercial | Many vendor blogs with 2026 price guides; figures conflict. Medium-high. | New article (calendar below) | To write |
| mobile app development company in Nepal | Commercial | Agency pages and directory lists. High. | `/solutions/web-mobile-apps` | Title exists |
| custom software development Nepal | Commercial | Agency service pages. Medium-high. | `/solutions/custom-software` | Title exists |
| ERP software Nepal | Commercial / product | Product vendors and ERP implementers. Many are IRD-compliance led. Medium-high. | `/erp-software-nepal` | **New page** |
| billing software Nepal | Commercial / product | Vendors lead with "IRD approved" and VAT. High. | `/products/billing-software` | Title retargeted |
| accounting software Nepal | Commercial / product | Same vendors plus comparison blogs. High. | `/products/accounting-software` | Title retargeted |
| AI development company Nepal | Commercial | Few dedicated AI service pages; directory lists and a handful of firms. Medium. Best opening. | `/solutions/ai-automation` | Title exists |
| digital transformation Nepal | Informational / commercial | News, policy and consultancy pages. Medium. | `/digital-transformation-nepal` | **New page** |
| AI engineering Nepal (career) | Informational | Little dedicated Nepal content. Low-medium. | `/insights/ai-engineering-in-nepal-skills-tools-roadmap` | **New article** |
| become a software engineer in Nepal | Informational | Scattered blogs and course pages. Low-medium. | `/insights/how-to-become-a-software-engineer-in-nepal` | **New article** |
| add AI to business software Nepal | Informational → commercial | Almost no Nepal-specific guides. Low. | `/insights/add-ai-to-business-software-in-nepal` | **New article** |

Columns to fill from Keyword Planner and Search Console: **monthly volume**, **difficulty**,
**current position**.

### Two things the results showed

1. **Billing and accounting buyers search for "IRD approved".** Competing vendors lead with IRD
   billing-software approval and VAT handling. The code does **not** claim this for Kodedristi's
   products, because it cannot be verified from the repository. If a product is approved, state it
   (with the approval reference) in `lib/data/product-seo.ts` and on the product page. Until then,
   do not write it.
2. **Cost searches are served by many vendor blogs with conflicting numbers.** Win these with a
   transparent, scope-based breakdown from real Kodedristi projects, not another generic range.

## 2. What changed in the code

- Homepage title and description, and the site-wide default, now name "software development
  company in Nepal" / Kathmandu and the ERP, billing and accounting products.
- Product page titles and descriptions carry the searched phrase (`lib/data/product-seo.ts`).
- New landing pages: `/erp-software-nepal`, `/digital-transformation-nepal` (Service, FAQ and
  Breadcrumb schema; in sitemap, nav, `llms.txt`).
- Three articles under `/insights` (AI engineering career, software engineering career, adding AI
  to business software), each with a table of contents, 8 to 12 H2 sections, Article schema,
  internal links to services and courses, and cited outbound sources.
- Articles now support headings, lists and links in the admin body field (`## Heading`,
  `- item`, `1. item`, `[text](/path)`, `[text](https://…)`, `**bold**`).
- The `keywords` meta tag was cut from about 130 phrases to 14. Google ignores it, and a long
  list reads as stuffing to other engines.

## 3. Set these in Admin → SEO (they override the code)

The Homepage row in the admin currently holds its own title and description, and **it wins over
the code defaults**. Replace them with:

- **Title:** `Software Development Company in Nepal — Kodedristi`
- **Description:** `Kodedristi is a software development company in Kathmandu, Nepal: custom software, web and mobile apps, ERP, billing and accounting software, AI and outsourcing.`

## 4. Local (Kathmandu)

"Software company in Kathmandu" is a map-pack search, so the Google Business Profile matters more
than any page. Claim it, use the exact name, address and phone shown in the footer, choose
"Software company" as the primary category, and collect genuine client reviews. No fake locations
or reviews.

## 5. Next articles (from the highest-intent topics)

| Order | Title | Primary keyword | Link to |
|---|---|---|---|
| 1 | How to choose a software development company in Nepal | software development company in Nepal | `/`, `/outsourcing`, `/contact` |
| 2 | Website development cost in Nepal (scope-based) | website development cost Nepal | `/solutions/website-development` |
| 3 | Benefits of ERP software for Nepali businesses | ERP software Nepal | `/erp-software-nepal` |
| 4 | Why businesses need custom billing software | billing software Nepal | `/products/billing-software` |
| 5 | Custom vs ready-made software (extend the existing post) | custom software Nepal | `/solutions/custom-software` |

## 6. Legitimate link targets seen in the results

Directories that already list Nepali software firms: Clutch, GoodFirms, DesignRush,
TechBehemoths, SoftwareSuggest. The community-maintained
[tech-companies-in-nepal](https://www.github.com/developers-nepal/tech-companies-in-nepal)
list on GitHub accepts pull requests. Also pursue the partners and universities already on the
site (ask for a link from their project or partner page), and publish the hackathon results as
press releases. No paid links, networks or bulk directories.
