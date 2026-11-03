/**
 * Keyword landing pages that have no CMS equivalent.
 *
 * Each entry targets one search phrase that people in Nepal use when they are
 * looking to hire, and is written once to be accurate. Nothing here names a
 * client, a result, a price or a compliance approval: those are claimed only
 * where they are real, in case studies and on the product pages.
 */
export type LandingPage = {
  /** `page-seo` slug and the URL segment. */
  slug: string;
  /** Breadcrumb label. */
  crumb: string;
  /** `<title>` before the site suffix; also the main search phrase. */
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** The direct answer under the hero. */
  answer: string;
  serviceName: string;
  serviceType: string;
  sections: {
    eyebrow: string;
    title: string;
    intro?: string;
    cards: { title: string; body: string }[];
  }[];
  /** Internal links shown near the end; hrefs must exist. */
  related: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
  cta: { title: string; body: string; label: string };
};

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "erp-software-nepal",
    crumb: "ERP Software",
    title: "ERP Software Development in Nepal",
    description:
      "Custom ERP software for Nepali businesses: accounting, inventory, sales, HR and reporting in one system, scoped and built by Kodedristi in Kathmandu.",
    eyebrow: "ERP software",
    h1: "ERP software development for businesses in Nepal",
    intro:
      "One system for accounts, stock, sales, purchasing and people, built around how your business actually runs instead of how a package assumes it does.",
    answer:
      "Kodedristi designs and builds custom ERP software for businesses in Nepal: the modules you need (accounting, inventory, sales, purchasing, HR, reporting) connected to one database, with Nepal's VAT and invoicing practice taken into account. We scope the system with you first, deliver it in phases, and hand over the source code and documentation.",
    serviceName: "Custom ERP Software Development",
    serviceType: "ERP software development",
    sections: [
      {
        eyebrow: "Modules",
        title: "What an ERP system can cover",
        intro: "You choose the modules. We build only what your business needs and add more later.",
        cards: [
          {
            title: "Accounting & finance",
            body: "Ledgers, vouchers, bank reconciliation, VAT-aware invoices and the reports your accountant asks for.",
          },
          {
            title: "Inventory & purchasing",
            body: "Stock across branches or warehouses, purchase orders, supplier records and reorder alerts.",
          },
          {
            title: "Sales & billing",
            body: "Quotations, invoices, receipts, customer statements and outstanding balances in one place.",
          },
          {
            title: "HR & payroll",
            body: "Employee records, attendance, leave and payroll rules matched to how your company pays.",
          },
          {
            title: "Reports & dashboards",
            body: "Management views of sales, stock, cash and receivables, drawn from the same live data.",
          },
          {
            title: "Integrations",
            body: "Payment gateways, SMS, e-commerce and the tools you already use, connected through APIs.",
          },
        ],
      },
      {
        eyebrow: "Custom vs ready-made",
        title: "When custom ERP makes sense",
        cards: [
          {
            title: "Your process does not fit a package",
            body: "Approvals, pricing rules or production steps that off-the-shelf software forces you to work around.",
          },
          {
            title: "You are outgrowing spreadsheets and separate tools",
            body: "Sales in one tool, stock in another and accounts in a third, with people re-typing between them.",
          },
          {
            title: "You want to own the system",
            body: "No per-user licence that grows with your team, and the source code is yours.",
          },
        ],
      },
      {
        eyebrow: "Process",
        title: "How we deliver an ERP",
        cards: [
          {
            title: "1. Map the workflow",
            body: "We sit with the people who do the work, document how it runs today and agree what the system should do.",
          },
          {
            title: "2. Build in phases",
            body: "The most valuable module goes live first, so you use real software early and feedback shapes the rest.",
          },
          {
            title: "3. Migrate and train",
            body: "We move your existing data across, train your team and stay on hand through the first weeks of use.",
          },
        ],
      },
    ],
    related: [
      { label: "Custom software development", href: "/solutions/custom-software" },
      { label: "Billing software", href: "/products/billing-software" },
      { label: "Accounting software", href: "/products/accounting-software" },
      { label: "Web & mobile apps", href: "/solutions/web-mobile-apps" },
    ],
    faqs: [
      {
        question: "What is ERP software?",
        answer:
          "ERP (enterprise resource planning) software connects a company's core functions, such as accounting, inventory, sales, purchasing and HR, in one system with a single set of data, so teams stop duplicating work across separate tools.",
      },
      {
        question: "Should we build a custom ERP or buy a ready-made one?",
        answer:
          "A ready-made package is faster to start and fine when your process is standard. A custom ERP suits businesses whose workflow is unusual, who want to own the code, or who would otherwise pay growing licence fees. We will tell you honestly if a package would serve you better.",
      },
      {
        question: "Can the ERP handle Nepal's VAT and invoicing requirements?",
        answer:
          "We build invoicing and VAT handling around Nepal's practice. Rules and reporting requirements from the Inland Revenue Department change, so we confirm the current requirements with you and your accountant during scoping rather than assuming them.",
      },
      {
        question: "How long does an ERP project take?",
        answer:
          "It depends on the number of modules and integrations. We deliver in phases, so the first module is usually in use well before the whole system is finished. You get a timeline in writing after scoping.",
      },
      {
        question: "Do we own the source code?",
        answer:
          "Ownership and handover of the source code and documentation are agreed in the contract before work begins.",
      },
    ],
    cta: {
      title: "Planning an ERP or business system?",
      body: "Describe how your business runs today. We will reply with questions, a proposed approach and an estimate.",
      label: "Discuss your ERP project",
    },
  },
  {
    slug: "digital-transformation-nepal",
    crumb: "Digital Transformation",
    title: "Digital Transformation Services in Nepal",
    description:
      "Digital transformation for Nepali businesses: replace manual processes with custom software, automation and AI, delivered step by step by Kodedristi in Kathmandu.",
    eyebrow: "Digital transformation",
    h1: "Digital transformation for businesses in Nepal",
    intro:
      "Move paperwork, spreadsheets and repeated manual steps into software that your team and customers actually use, one process at a time.",
    answer:
      "Digital transformation means replacing manual, paper or spreadsheet processes with software that fits how your business works. Kodedristi, a software company in Kathmandu, helps Nepali businesses do this in stages: we map the process, build the system (web, mobile, automation or AI) and train your team, starting with the change that saves the most time.",
    serviceName: "Digital Transformation",
    serviceType: "Digital transformation consulting and software development",
    sections: [
      {
        eyebrow: "Where to start",
        title: "Common first steps",
        intro: "Most businesses do not need everything at once. These are the changes that usually pay back first.",
        cards: [
          {
            title: "Billing and accounting",
            body: "Replace handwritten or spreadsheet invoicing with software that tracks payments and produces your reports.",
          },
          {
            title: "Customer and order management",
            body: "One record of every customer, enquiry and order instead of messages scattered across phones.",
          },
          {
            title: "A website and online presence",
            body: "A fast, search-friendly website that brings in enquiries and lets customers act without calling.",
          },
          {
            title: "Workflow automation",
            body: "Approvals, reminders, reports and data entry that currently depend on someone remembering to do them.",
          },
          {
            title: "Mobile apps for staff and customers",
            body: "Field teams, deliveries or bookings handled from a phone with the data flowing to the office.",
          },
          {
            title: "AI where it helps",
            body: "Chatbots, document processing and forecasting, applied to a defined problem instead of added for show.",
          },
        ],
      },
      {
        eyebrow: "Approach",
        title: "How we work with you",
        cards: [
          {
            title: "Understand the process",
            body: "We observe how work moves through your business and find where time and accuracy are lost.",
          },
          {
            title: "Prioritise",
            body: "We rank changes by effort and benefit and agree a first project small enough to finish quickly.",
          },
          {
            title: "Build and adopt",
            body: "We deliver working software, train the people who use it and adjust from their feedback.",
          },
        ],
      },
    ],
    related: [
      { label: "ERP software development", href: "/erp-software-nepal" },
      { label: "AI & automation", href: "/solutions/ai-automation" },
      { label: "Custom software development", href: "/solutions/custom-software" },
      { label: "Website development", href: "/solutions/website-development" },
      { label: "Industries we serve", href: "/industries" },
    ],
    faqs: [
      {
        question: "What does digital transformation mean for a small business?",
        answer:
          "For most small and mid-sized businesses it means moving the processes that eat the most time, such as billing, orders, stock or reporting, from paper and spreadsheets into software, then building from there. It is a series of practical steps, not one large project.",
      },
      {
        question: "Where should a business in Nepal start?",
        answer:
          "Start with the process that costs the most time or causes the most errors. For many companies that is invoicing and accounting or order tracking. We help you pick the first project after a short review of how you work today.",
      },
      {
        question: "Do we need to replace all our existing systems?",
        answer:
          "No. We connect to the tools you already use where that makes sense and replace only what is holding you back.",
      },
      {
        question: "How do you make sure our team uses the new system?",
        answer:
          "We design with the people who will use it, train them before launch and stay available afterwards. A system nobody uses has not transformed anything.",
      },
    ],
    cta: {
      title: "Ready to take the first step?",
      body: "Tell us which process is slowing your business down. We will suggest a practical starting point.",
      label: "Talk to us about your business",
    },
  },
];

export function getLandingPage(slug: string): LandingPage {
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown landing page: ${slug}`);
  return page;
}
