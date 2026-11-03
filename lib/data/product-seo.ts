/**
 * What each product page is called in search results, keyed by product slug.
 *
 * The CMS names ("Billing Software") are right for the site's own nav but too
 * bare for a result title: they carry no market and no purpose. These carry
 * the phrase people search ("billing software Nepal") and fall back to the
 * CMS name and tagline for any product not listed.
 *
 * Nothing here claims a certification or approval (for example IRD
 * billing-software approval). If a product holds one, state it here and on
 * the product page only once it can be shown.
 */
export const PRODUCT_SEO: Record<string, { title: string; description: string }> = {
  "billing-software": {
    title: "Billing Software in Nepal for Invoicing & Payments",
    description:
      "Billing software for businesses in Nepal: recurring and one-off invoices, payment tracking, reminders and reports, built by Kodedristi in Kathmandu.",
  },
  "accounting-software": {
    title: "Accounting Software in Nepal for Growing Businesses",
    description:
      "Accounting software built in Nepal: general ledger, bank reconciliation, multi-user roles and financial reports for finance teams, by Kodedristi.",
  },
  lms: {
    title: "LMS Software in Nepal for Institutes & Training Providers",
    description:
      "Learning management system built in Nepal: courses, cohorts, assessments, certificates and payments for institutes, by Kodedristi in Kathmandu.",
  },
};
