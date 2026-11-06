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

- **Title:** `IT Company in Nepal — Software Development | Kodedristi`
- **Description:** `Kodedristi is an IT and software development company in Kathmandu, Nepal: custom software, web and mobile apps, ERP, CRM, accounting software, AI and outsourcing.`

(Changed 2026-11-06 after the Google Trends data in section 7: people in Nepal search "IT company".)

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

## 7. Google Trends, Nepal, 2026 (supplied 2026-11-06)

Four Google Trends exports (Jan to Nov 2026, Nepal). How to read them, and what was done:

**Caveats.** Trends gives *relative* interest (0 to 100 inside one export), not search volume, and
the four exports are scaled separately, so numbers cannot be compared between files. "Increase
percent" on a base of 0 or 1 is noise (a rise from 0 to 1 shows as thousands of percent), so those
rows are treated as direction only. Rows with no link to our business (Walmart and Lidl "near me",
anime and streaming apps, "task earning" apps, consumer antivirus, photo editing) were ignored.

| Signal in the data | What it says | Applied |
|---|---|---|
| "it company in nepal" 100, "it company near me" 16 (+250%), "best it company in nepal" 13, "it company in kathmandu" 12, "leapfrog" 3 | In Nepal the head term is **"IT company"**, not "software company". Leapfrog is the brand people search for next to it. | Homepage title, description, layout default, About title, Organization schema and `llms.txt` now lead with "IT company in Nepal". |
| "accounting software" 5 (+50%), "accounting software solutions", "best small business accounting software", "accounting software for small business" | Strongest business-software interest, and small business is the qualifier. | Accounting product title retargeted to "small business"; new article *Accounting Software for Small Business in Nepal*. |
| "erp software", "enterprise resource planning software" (Breakout) | The spelled-out phrase is rising. | ERP page title and description now use "enterprise resource planning". |
| "crm software" (+60%), "best crm software for small business" (Breakout) | Small-business CRM demand. | New page `/crm-software-nepal`, with the "best CRM for a small business" question answered in its FAQ. |
| "human resources software" (+650%), "payroll software for small companies" (Breakout), "zkteco attendance management software" | HR, payroll and attendance devices are all moving. | New page `/hr-payroll-software-nepal`. |
| "inventory management software" (+50%), "ims software", "pharma software" | Stock tracking, including batch and expiry. | New page `/inventory-management-software-nepal`. |
| "website to app" 100 (the top query in its export), "nagarik app" 4 | People want to turn websites into apps. "mobile app development" itself is falling (-50%). | New article *Website to App*; no extra spend on the generic "mobile app development" head term. |
| "software testing" 3 (+100%), "software testing strategies" 2 (+2,300%), "mvp in software development" (+120%), "agile methodology" (+70%), "react development", "node.js backend", "docker containerization" | Developer-learning interest. It feeds the courses and the engineering brand. | New article *Software Testing Strategies*. MVP and agile are next in the queue. |
| "software engineer" 5, "software engineering" 5, "software engineer salary" 2 | Career interest. | Covered by *How to Become a Software Engineer in Nepal*. A salary article needs real pay data first, so it is not written. |
| "shikshya software" (school software), "busy software", "sathi software", "cheque printing software" | Local product-brand searches. | Not targeted. These are competitors' product names; ranking on them would need a real product. |

No signal in these exports for security products (the only security term is consumer antivirus)
or SaaS as a category, so nothing was added for them.

**Also supplied (a pasted list, not an export): "Creative Cloud ~2.24M, Technology ~1M, AI ~673K,
VR ~301K searches".** The source and region are unknown and the figures are unverified. They are
global, generic head terms with no buying intent for a Nepal software company, and Creative Cloud
is an Adobe product search. AI is already covered by the AI pages and articles; VR and "technology"
were not targeted.

**Next, in order:** MVP in software development (startups); agile methodology; a school
management page only if a real product exists; the articles in section 5.
ok
