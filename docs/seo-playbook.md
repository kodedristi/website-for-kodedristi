# Kodedristi SEO playbook

The code-side SEO (metadata, structured data, sitemap, speed, redirects) is done. This file is
the work that happens outside the code. Rankings come from doing these consistently for months,
not from any single change.

## 0. Do first

- [ ] Admin → SEO → Homepage: untick **Hide from search engines** (the homepage is currently noindex).
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://www.kodedristi.com` in the production environment (or leave
      it unset: the code default is the www host). kodedristi.com redirects to www, so a canonical
      on the bare domain points Google at a URL that redirects away from itself.
- [ ] Verify the domain in Google Search Console and submit `https://www.kodedristi.com/sitemap.xml`.
- [ ] Admin → SEO: check the **Homepage** row. Any title or description typed there overrides the
      one in code, so make it match `docs/seo-keyword-map.md` (section 3).
- [ ] Import the property into Bing Webmaster Tools.
- [ ] Use URL Inspection → Request indexing on `/`, `/outsourcing`, `/solutions`, `/about`, `/contact`.

## 0b. Reading Search Console → Pages ("Why pages aren't indexed")

Click a reason to see the exact URLs; then decide whether it is expected.

| Reason | Expected? | What to do |
|---|---|---|
| Excluded by 'noindex' tag | Yes for `/profile` and `/admin/login`: they carry noindex on purpose. | Nothing. If a **public** page is listed, untick "Hide from search engines" for it in Admin → SEO. |
| Page with redirect | Yes for `/blog` (redirects to `/insights`) and for any `kodedristi.com` (no www) URL. | Nothing for those. If many URLs are listed, check their canonical host: it must be `www.kodedristi.com`. |
| Not found (404) | Only for URLs that never existed or were removed on purpose. | Open the URL: if it should exist, restore it; if it moved, add a redirect in `next.config.ts`; otherwise leave it, Google drops 404s on its own. |
| Alternate page with proper canonical tag | Yes: another page is the canonical. | Nothing, unless the canonical points at the wrong page. |

After fixing anything, click **Validate fix**. Validation takes days to weeks; "Not started" is normal until you press it.

**Canonical host.** Production once had `NEXT_PUBLIC_SITE_URL=https://kodedristi.com`, which made
every canonical and sitemap URL point at the redirecting domain. The code now rewrites the bare
domain to `www` whatever the variable says, but set it to `https://www.kodedristi.com` anyway.

## 1. Content SEO

Each page targets one main search phrase. Keep the phrase in the title, the H1, the first
paragraph and the meta description, and write for the person searching, not for a keyword count.

| Page | Main phrase |
|---|---|
| `/` | software company in Nepal |
| `/outsourcing` | software outsourcing Nepal / white-label software development |
| `/solutions/web-mobile-apps` | web and mobile app development Nepal |
| `/solutions/saas-products` | SaaS development company Nepal |
| `/solutions/ai-automation` | AI development company Nepal |
| `/solutions/custom-software` | custom software development Nepal |
| `/products/billing-software` | billing software Nepal |
| `/products/accounting-software` | accounting software Nepal |
| `/learn` | IT courses in Kathmandu |

Articles (Admin → Blog). One a week beats ten in a day. Aim for 1,000+ words that answer the
question fully, with a real example, and link each one to the matching service page.

1. How to outsource software development to Nepal: cost, process and risks
2. White-label software development: how agencies use it to scale
3. Custom software vs off-the-shelf: how to choose
4. How much does it cost to build a mobile app in Nepal?
5. How to build a SaaS product: from idea to first customer
6. Dedicated development team vs fixed-price project
7. AI automation for Nepali businesses: where to start
8. Choosing a software development company: 10 questions to ask
9. Billing and accounting software for Nepali businesses: what to look for
10. Case-study write-ups for each project (problem, approach, result, with numbers you can stand behind)

Rules that keep content ranking: only claim what is true and provable, name real clients only
with permission, give every article a unique title and meta description, add a real author, and
update old articles instead of leaving them to go stale.

## 2. Local SEO (Kathmandu)

- [ ] **Google Business Profile**: claim it at business.google.com. Category "Software company",
      secondary "Web designer", "Computer training school" if you run courses. Add address, phone,
      hours, website, services, and real photos of the office and team.
- [ ] **NAP consistency**: the business name, address and phone must read exactly the same on the
      website footer, Google Business Profile, Facebook, LinkedIn and every directory. Change it in
      one place (Admin → Settings) and copy from there.
- [ ] Add a Google Maps embed and directions to the Contact page.
- [ ] Ask every happy client for a Google review. Reply to every review. Never buy reviews.
- [ ] Add posts and photos to the Business Profile monthly.
- [ ] Local citations: list the business in Nepali business directories and chambers of commerce.

## 3. Off-page SEO (links and mentions)

Links from respected sites are the strongest ranking signal and the slowest to earn. Do not buy
links or join link schemes; they can get the site removed from Google.

- [ ] Directories: Clutch, GoodFirms, DesignRush, The Manifest, Upwork agency profile, LinkedIn
      company page, Crunchbase. Fill every field and use the same description.
- [ ] Ask clients for a Clutch/GoodFirms review and a link to their project on their site.
- [ ] Partners and universities already on the site (Partners page): ask them to link back.
- [ ] Publish guest articles and give expert quotes to Nepali and international tech publications.
- [ ] Run and promote the National AI Hackathon: event pages and press coverage earn real links.
- [ ] Open-source or free tools others will link to (calculators, templates, checklists).
- [ ] Check backlinks monthly in Search Console (Links report) and disavow nothing unless you are
      sure a link is spam.

## 4. Social SEO

Social signals do not rank pages directly, but profiles rank for the brand name, and shares send
traffic and links.

- [ ] Same name, logo and description on Facebook, LinkedIn, Instagram, YouTube and X. Add the
      links in Admin → Settings so they appear in the site's structured data (`sameAs`).
- [ ] Every link you post shows a 1200×630 card now (generated automatically). Test pages in the
      Facebook Sharing Debugger and LinkedIn Post Inspector after deploy to refresh their cache.
- [ ] Post project results, hackathon updates, course intakes and articles weekly.
- [ ] Short videos of the team and projects (YouTube Shorts, Reels) with the company name in the
      title and description.

## 5. Measure

Check weekly in Search Console: impressions, clicks, average position per page and query, indexing
errors. Check monthly: which queries bring enquiries, not just visits. Adjust the content plan
toward the phrases that bring real enquiries.
