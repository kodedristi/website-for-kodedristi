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
    title: "ERP Software in Nepal: Custom Enterprise Resource Planning",
    description:
      "Custom enterprise resource planning (ERP) software for Nepali businesses: accounting, inventory, sales, HR and reporting in one system, built by Kodedristi in Kathmandu.",
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
      { label: "CRM software", href: "/crm-software-nepal" },
      { label: "HR & payroll software", href: "/hr-payroll-software-nepal" },
      { label: "Inventory management software", href: "/inventory-management-software-nepal" },
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
      { label: "CRM software", href: "/crm-software-nepal" },
      { label: "HR & payroll software", href: "/hr-payroll-software-nepal" },
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
  {
    slug: "crm-software-nepal",
    crumb: "CRM Software",
    title: "CRM Software Development in Nepal",
    description:
      "Custom CRM software for Nepali businesses: track leads, customers and follow-ups in one system, connected to your website and billing, built by Kodedristi in Kathmandu.",
    eyebrow: "CRM software",
    h1: "CRM software development for businesses in Nepal",
    intro:
      "Keep every enquiry, customer and follow-up in one place, so sales do not depend on one person's phone or a shared spreadsheet.",
    answer:
      "Kodedristi builds custom CRM (customer relationship management) software for businesses in Nepal: lead capture from your website and enquiries, customer records, a sales pipeline with reminders, and reports, connected to the billing or accounting tools you already use. We scope it with you first, deliver in phases and hand over the source code.",
    serviceName: "Custom CRM Software Development",
    serviceType: "CRM software development",
    sections: [
      {
        eyebrow: "Features",
        title: "What a CRM can cover",
        intro: "Pick what your team needs. Everything beyond that can be added later.",
        cards: [
          {
            title: "Lead and enquiry capture",
            body: "Website forms, phone enquiries and walk-ins land in one list with a source, an owner and a status.",
          },
          {
            title: "Customer records",
            body: "Contacts, companies, history, notes and documents together, so anyone can pick up a conversation.",
          },
          {
            title: "Pipeline and follow-ups",
            body: "Stages that match your sales process, with reminders so no enquiry goes quiet by accident.",
          },
          {
            title: "Quotes and invoices",
            body: "Move from a won deal to a quotation and invoice without re-typing, linked to your billing software.",
          },
          {
            title: "Reports",
            body: "Leads by source, conversion by stage, and sales by person, drawn from the same live data.",
          },
          {
            title: "Integrations",
            body: "Your website, email, SMS and payment tools, connected through APIs where they offer them.",
          },
        ],
      },
      {
        eyebrow: "Choosing",
        title: "Custom CRM or an off-the-shelf one?",
        cards: [
          {
            title: "A ready-made CRM fits when",
            body: "Your sales process is standard, your team is small and you mainly need contacts, a pipeline and reminders.",
          },
          {
            title: "A custom CRM fits when",
            body: "Your process has unusual stages, approvals or pricing rules, or the CRM must sit inside a system you already run.",
          },
          {
            title: "Either way",
            body: "Decide who owns the data, how you will export it, and what it will cost as your team grows.",
          },
        ],
      },
      {
        eyebrow: "Process",
        title: "How we deliver a CRM",
        cards: [
          {
            title: "1. Map the sales process",
            body: "We follow an enquiry from first contact to payment and agree the stages, fields and reports you need.",
          },
          {
            title: "2. Build the core first",
            body: "Leads, customers and pipeline go live first so your team starts using it and feedback shapes the rest.",
          },
          {
            title: "3. Migrate and train",
            body: "We import your existing contacts, train the team and stay close through the first weeks.",
          },
        ],
      },
    ],
    related: [
      { label: "ERP software development", href: "/erp-software-nepal" },
      { label: "Billing software", href: "/products/billing-software" },
      { label: "Custom software development", href: "/solutions/custom-software" },
      { label: "Digital transformation", href: "/digital-transformation-nepal" },
    ],
    faqs: [
      {
        question: "What is CRM software?",
        answer:
          "CRM stands for customer relationship management. It is software that records every lead, customer and interaction in one place and helps a team follow up, so sales do not rely on memory, chat history or scattered spreadsheets.",
      },
      {
        question: "What is the best CRM for a small business in Nepal?",
        answer:
          "It depends on your process and size. A ready-made CRM is usually enough when your sales steps are standard. Look at how easily you can export your data, whether it works for your team's language and devices, support when you need it, and the price at your team size in two or three years. If none fit your process, a custom build may.",
      },
      {
        question: "Can the CRM connect to our website and billing?",
        answer:
          "Yes. Website forms can create leads automatically, and a won deal can become a quotation or invoice in your billing or accounting software. We confirm the exact integrations during scoping.",
      },
      {
        question: "How long does a CRM project take?",
        answer:
          "A focused CRM with leads, customers and a pipeline is usually delivered in phases, with the core in use well before the whole system is finished. You get a written timeline after scoping.",
      },
      {
        question: "Do we own the source code?",
        answer:
          "Ownership and handover of the source code and documentation are agreed in the contract before work begins.",
      },
    ],
    cta: {
      title: "Want a CRM that fits how you sell?",
      body: "Tell us how an enquiry becomes a customer today. We will reply with questions, an approach and an estimate.",
      label: "Discuss your CRM project",
    },
  },
  {
    slug: "hr-payroll-software-nepal",
    crumb: "HR & Payroll Software",
    title: "HR & Payroll Software Development in Nepal",
    description:
      "HR and payroll software for Nepali companies: employee records, attendance, leave and salary processing built around your rules by Kodedristi in Kathmandu.",
    eyebrow: "HR & payroll software",
    h1: "HR and payroll software development for companies in Nepal",
    intro:
      "Employee records, attendance, leave and monthly payroll in one system, instead of a spreadsheet that one person understands.",
    answer:
      "Kodedristi builds custom HR and payroll software for companies in Nepal: employee records, attendance from devices or mobile check-in, leave management and salary processing with payslips, set up around your own pay rules. Statutory deductions such as tax and social security contributions are confirmed with your accountant during scoping, because the rules change.",
    serviceName: "Custom HR and Payroll Software Development",
    serviceType: "HR and payroll software development",
    sections: [
      {
        eyebrow: "Modules",
        title: "What HR and payroll software can cover",
        intro: "Small companies often start with attendance and payroll, then add the rest.",
        cards: [
          {
            title: "Employee records",
            body: "Profiles, contracts, documents and history in one secure place with role-based access.",
          },
          {
            title: "Attendance",
            body: "Entries from biometric devices, mobile check-in or manual correction, with shifts and late rules you define.",
          },
          {
            title: "Leave management",
            body: "Leave types, balances, requests and approvals, visible to employees and managers.",
          },
          {
            title: "Payroll",
            body: "Salary structures, allowances, deductions and advances calculated from attendance, with payslips and bank-ready summaries.",
          },
          {
            title: "Employee self-service",
            body: "Staff view payslips, apply for leave and update details without asking the office.",
          },
          {
            title: "Reports",
            body: "Headcount, attendance, leave and payroll cost, ready for management and your accountant.",
          },
        ],
      },
      {
        eyebrow: "Accuracy",
        title: "Getting payroll right",
        cards: [
          {
            title: "Rules written down first",
            body: "We document how your company pays, including overtime, allowances and unpaid leave, before any code.",
          },
          {
            title: "Statutory rules checked",
            body: "Tax and social security rules are confirmed with your accountant and updated when the rules change.",
          },
          {
            title: "Audit trail",
            body: "Every change to pay data is logged, so you can explain any figure to an employee or auditor.",
          },
        ],
      },
      {
        eyebrow: "Process",
        title: "How we deliver it",
        cards: [
          {
            title: "1. Map current practice",
            body: "We review how attendance, leave and salaries are handled today and where errors creep in.",
          },
          {
            title: "2. Run in parallel",
            body: "The first payroll runs beside your existing method so you can compare results before switching over.",
          },
          {
            title: "3. Train and support",
            body: "We train HR and managers and stay available through the first pay cycles.",
          },
        ],
      },
    ],
    related: [
      { label: "ERP software development", href: "/erp-software-nepal" },
      { label: "Accounting software", href: "/products/accounting-software" },
      { label: "Custom software development", href: "/solutions/custom-software" },
      { label: "Digital transformation", href: "/digital-transformation-nepal" },
    ],
    faqs: [
      {
        question: "Does a small company need payroll software?",
        answer:
          "Once you have more than a handful of staff, or pay varies with attendance, overtime or allowances, a spreadsheet becomes slow and error-prone. Payroll software saves the monthly calculation time and gives employees clear payslips. A very small team with fixed salaries may manage without it.",
      },
      {
        question: "Can it work with our attendance devices?",
        answer:
          "Often yes. Many biometric attendance devices can export or sync records, and we can also support mobile check-in. We confirm which devices you use and how they connect during scoping.",
      },
      {
        question: "Does it handle tax and social security deductions?",
        answer:
          "We build the calculation rules you need and confirm the current statutory requirements with you and your accountant, since they change. We do not assume them.",
      },
      {
        question: "Can employees see their own payslips and leave?",
        answer:
          "Yes. Employee self-service lets staff view payslips, check leave balances and request leave, with access limited to their own records.",
      },
      {
        question: "Do we own the source code?",
        answer:
          "Ownership and handover of the source code and documentation are agreed in the contract before work begins.",
      },
    ],
    cta: {
      title: "Ready to simplify HR and payroll?",
      body: "Describe how you track attendance and pay staff today. We will suggest an approach and an estimate.",
      label: "Discuss HR and payroll software",
    },
  },
  {
    slug: "inventory-management-software-nepal",
    crumb: "Inventory Management Software",
    title: "Inventory Management Software in Nepal",
    description:
      "Inventory management software for Nepali shops, distributors and warehouses: stock, purchasing and sales in one system, built by Kodedristi in Kathmandu.",
    eyebrow: "Inventory management software",
    h1: "Inventory management software for businesses in Nepal",
    intro:
      "Know what you have, where it is and when to reorder, across one shop or several, without counting by hand.",
    answer:
      "Kodedristi builds custom inventory management software for businesses in Nepal: stock across shops or warehouses, purchasing and suppliers, sales and billing, batch and expiry tracking where you need it, and reorder alerts. It can stand alone or become the stock module of a larger ERP, and we hand over the source code.",
    serviceName: "Custom Inventory Management Software Development",
    serviceType: "Inventory management software development",
    sections: [
      {
        eyebrow: "Features",
        title: "What inventory software can cover",
        intro: "Retailers, distributors, pharmacies and manufacturers need different things, so we build to your case.",
        cards: [
          {
            title: "Multi-location stock",
            body: "Quantities per shop, warehouse or van, with transfers between them recorded and traceable.",
          },
          {
            title: "Purchasing and suppliers",
            body: "Purchase orders, goods received, supplier records and what you owe, matched to stock.",
          },
          {
            title: "Sales and billing",
            body: "Every sale reduces stock automatically and links to your invoices and receipts.",
          },
          {
            title: "Batches and expiry",
            body: "Batch numbers and expiry dates with near-expiry alerts, for products where they matter.",
          },
          {
            title: "Reorder alerts",
            body: "Minimum levels per item that warn you before you run out, not after.",
          },
          {
            title: "Barcodes and reports",
            body: "Barcode scanning for speed, plus stock valuation, movement and slow-moving reports.",
          },
        ],
      },
      {
        eyebrow: "Fit",
        title: "Who it is for",
        cards: [
          {
            title: "Shops and retailers",
            body: "Fast billing, accurate counts and fewer losses from untracked stock.",
          },
          {
            title: "Distributors and wholesalers",
            body: "Several locations, credit customers and supplier orders handled in one place.",
          },
          {
            title: "Pharmacies and similar trades",
            body: "Batch and expiry control so old stock is sold first and expired stock is flagged.",
          },
        ],
      },
      {
        eyebrow: "Process",
        title: "How we deliver it",
        cards: [
          {
            title: "1. Understand your stock flow",
            body: "We follow goods from supplier to shelf to customer and agree the items, units and rules.",
          },
          {
            title: "2. Load your data",
            body: "We import your item list and opening stock, and check counts with you before go-live.",
          },
          {
            title: "3. Go live and refine",
            body: "We train your staff, support the first weeks and adjust from real use.",
          },
        ],
      },
    ],
    related: [
      { label: "ERP software development", href: "/erp-software-nepal" },
      { label: "Billing software", href: "/products/billing-software" },
      { label: "Accounting software", href: "/products/accounting-software" },
      { label: "Custom software development", href: "/solutions/custom-software" },
    ],
    faqs: [
      {
        question: "What is inventory management software?",
        answer:
          "It is software that tracks the quantity and location of your stock, records purchases and sales, and tells you when to reorder, so counts stay accurate without manual tallying.",
      },
      {
        question: "Can it handle several shops or warehouses?",
        answer:
          "Yes. Stock is held per location, with transfers between locations recorded, and reports can be viewed per location or combined.",
      },
      {
        question: "Can it track batches and expiry dates?",
        answer:
          "Yes, where your products need it. Batch numbers and expiry dates can be recorded on receipt and shown at sale, with alerts for stock nearing expiry.",
      },
      {
        question: "Does it connect to billing and accounting?",
        answer:
          "Yes. Sales can create invoices and reduce stock in one step, and purchases and stock value can flow into your accounts. We confirm the connections during scoping.",
      },
      {
        question: "Do we own the source code?",
        answer:
          "Ownership and handover of the source code and documentation are agreed in the contract before work begins.",
      },
    ],
    cta: {
      title: "Ready to get stock under control?",
      body: "Tell us what you sell and how many locations you run. We will reply with an approach and an estimate.",
      label: "Discuss inventory software",
    },
  },
];

export function getLandingPage(slug: string): LandingPage {
  const page = LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown landing page: ${slug}`);
  return page;
}
