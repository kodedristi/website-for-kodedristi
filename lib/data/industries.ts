/**
 * The industries Kodedristi builds software for.
 *
 * Kept as code, not CMS rows, deliberately: each entry is a landing page that
 * targets a distinct search ("fintech software development Nepal"), and the
 * copy is written once to be accurate rather than assembled from admin
 * fields. Nothing here names a client, a result or a compliance
 * certification - those belong in case studies and are only claimed where
 * they are real. `match` links an industry to projects whose free-text
 * `industry` field mentions any of the words.
 */
export type Industry = {
  slug: string;
  name: string;
  /** The `<title>` (before the site suffix) and the page H1 stem. */
  title: string;
  description: string;
  /** The direct answer shown at the top of the page. */
  answer: string;
  challenges: string[];
  builds: string[];
  /** Slugs of solution pages to link to; unpublished ones are skipped. */
  solutions: string[];
  faqs: { question: string; answer: string }[];
  match: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "fintech",
    name: "Fintech & Banking",
    title: "Fintech Software Development in Nepal",
    description:
      "Payment, wallet, lending and banking software built in Nepal by Kodedristi: secure, auditable systems with the integrations financial businesses rely on.",
    answer:
      "Kodedristi builds payment, wallet, lending and banking software for financial businesses in Nepal and abroad. We design for security, audit trails and the integrations finance teams depend on, and agree the scope with you before development starts.",
    challenges: [
      "Protecting sensitive financial data with strict access control",
      "Integrating payment gateways, banks and existing core systems",
      "Audit trails and reports that finance and compliance teams can rely on",
    ],
    builds: [
      "Digital wallets and payment apps",
      "Loan, savings and cooperative management systems",
      "Billing and accounting software",
      "Customer onboarding and verification workflows",
      "Management dashboards and reporting",
    ],
    solutions: ["custom-software", "saas-products", "web-mobile-apps"],
    faqs: [
      {
        question: "Can you build software for a bank, cooperative or fintech startup?",
        answer:
          "Yes. We build custom financial software such as payments, lending and reporting systems. We work with your compliance team on regulatory requirements and agree the scope before development begins.",
      },
      {
        question: "Do you integrate with payment gateways and banking APIs?",
        answer:
          "We integrate the payment gateways and banking APIs your project needs. The specific providers are confirmed while we scope the work.",
      },
      {
        question: "How do you approach security for financial software?",
        answer:
          "Access control, encrypted connections and audit logging are planned into the design from the start. The exact controls depend on your requirements and your regulator's rules.",
      },
    ],
    match: ["fintech", "finance", "financial", "bank", "payment", "insurance"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    title: "Healthcare Software Development in Nepal",
    description:
      "Hospital, clinic and patient-facing software built in Nepal by Kodedristi: appointment, records and reporting systems designed around privacy.",
    answer:
      "Kodedristi builds healthcare software such as clinic and hospital management systems, appointment booking, patient portals and reporting tools. Patient privacy and role-based access are designed in from the start, and we agree requirements with your team before building.",
    challenges: [
      "Keeping patient information private with clear role-based access",
      "Replacing paper and spreadsheets without disrupting daily clinic work",
      "Reporting that gives managers a clear view of operations",
    ],
    builds: [
      "Clinic and hospital management systems",
      "Appointment booking and reminders",
      "Patient portals and mobile apps",
      "Inventory and pharmacy tracking",
      "Operational reports and dashboards",
    ],
    solutions: ["custom-software", "web-mobile-apps", "saas-products"],
    faqs: [
      {
        question: "Can you build a hospital or clinic management system?",
        answer:
          "Yes. We build management systems covering appointments, patient records, billing and reporting, shaped around how your clinic actually works.",
      },
      {
        question: "How is patient data protected?",
        answer:
          "Role-based access, encrypted connections and activity logs are planned in from the start. Exact requirements are agreed with your team and any rules that apply to you.",
      },
      {
        question: "Can new software work alongside our existing records?",
        answer:
          "We plan data migration and integration with your current systems as part of scoping, so staff are not left running two systems for long.",
      },
    ],
    match: ["health", "medical", "hospital", "clinic", "pharma"],
  },
  {
    slug: "education",
    name: "Education & EdTech",
    title: "Education & EdTech Software Development in Nepal",
    description:
      "LMS, school management and e-learning platforms built in Nepal by Kodedristi for schools, colleges, training centres and EdTech startups.",
    answer:
      "Kodedristi builds learning management systems, school and college management software and e-learning platforms for institutions and EdTech startups. We also run IT courses of our own, so we understand how learners and instructors actually use these tools.",
    challenges: [
      "Managing admissions, attendance, results and fees in one place",
      "Delivering courses online with content, quizzes and progress tracking",
      "Giving students, teachers and parents each the view they need",
    ],
    builds: [
      "Learning management systems (LMS)",
      "School and college management software",
      "Online course and exam platforms",
      "Student and parent mobile apps",
      "Admissions, fee and result management",
    ],
    solutions: ["saas-products", "web-mobile-apps", "custom-software"],
    faqs: [
      {
        question: "Do you build learning management systems?",
        answer:
          "Yes. Kodedristi has its own LMS product and also builds custom learning platforms for institutions and EdTech startups.",
      },
      {
        question: "Can you build software for a school or college?",
        answer:
          "Yes. We build management systems for admissions, attendance, fees and results, with separate views for staff, students and parents.",
      },
      {
        question: "Can the platform handle online classes and exams?",
        answer:
          "We build course delivery, quizzes and progress tracking. Live-class features are scoped with you, including which video tools to integrate.",
      },
    ],
    match: ["education", "edtech", "school", "college", "university", "learning", "training"],
  },
  {
    slug: "ecommerce",
    name: "E-commerce & Retail",
    title: "E-commerce Development in Nepal",
    description:
      "Online stores, marketplaces and retail systems built in Nepal by Kodedristi: fast storefronts, order management and local payment integration.",
    answer:
      "Kodedristi builds online stores, marketplaces and retail management systems for businesses selling in Nepal and abroad. We focus on fast storefronts, simple order and inventory management, and the payment and delivery integrations your customers expect.",
    challenges: [
      "A storefront that loads fast and converts on mobile",
      "Keeping stock, orders and delivery in sync",
      "Accepting the payment methods your customers actually use",
    ],
    builds: [
      "Custom online stores and marketplaces",
      "Order, inventory and delivery management",
      "Payment gateway integration",
      "Billing and point-of-sale software",
      "Customer apps and loyalty features",
    ],
    solutions: ["website-development", "web-mobile-apps", "saas-products"],
    faqs: [
      {
        question: "Can you build an online store with local payment options?",
        answer:
          "Yes. We integrate the payment methods your customers use. Which gateways to support is decided while scoping.",
      },
      {
        question: "Do you build marketplaces with multiple sellers?",
        answer:
          "Yes. We build multi-vendor marketplaces with seller dashboards, order handling and commissions, scoped to your model.",
      },
      {
        question: "Can the store connect to inventory and delivery systems?",
        answer:
          "We plan integrations with your inventory, billing and delivery tools so orders flow through without manual re-entry.",
      },
    ],
    match: ["commerce", "retail", "shop", "store", "marketplace", "fashion"],
  },
  {
    slug: "logistics",
    name: "Logistics & Supply Chain",
    title: "Logistics Software Development in Nepal",
    description:
      "Delivery, tracking and warehouse software built in Nepal by Kodedristi: dispatch, shipment tracking and operations dashboards for logistics businesses.",
    answer:
      "Kodedristi builds logistics software including delivery and dispatch management, shipment tracking, warehouse tools and operations dashboards. The aim is to replace phone calls and spreadsheets with one system your team and customers can see.",
    challenges: [
      "Knowing where every shipment is without chasing drivers by phone",
      "Planning dispatch and routes efficiently",
      "Giving customers reliable tracking and proof of delivery",
    ],
    builds: [
      "Delivery and dispatch management",
      "Shipment tracking for customers",
      "Driver and rider mobile apps",
      "Warehouse and inventory tools",
      "Operations dashboards and reports",
    ],
    solutions: ["custom-software", "web-mobile-apps", "saas-products"],
    faqs: [
      {
        question: "Can you build a delivery or courier management system?",
        answer:
          "Yes. We build dispatch, tracking and driver-app systems around how your operation runs.",
      },
      {
        question: "Can customers track their own shipments?",
        answer:
          "Yes. We can build a customer-facing tracking page or app that shows status and proof of delivery.",
      },
      {
        question: "Will it replace our spreadsheets and phone calls?",
        answer:
          "That is the goal. We map your current process first, then build the system to match it and plan the move from your existing tools.",
      },
    ],
    match: ["logistic", "delivery", "courier", "supply", "transport", "shipping"],
  },
  {
    slug: "hospitality",
    name: "Travel & Hospitality",
    title: "Hospitality & Travel Software Development in Nepal",
    description:
      "Booking, reservation and management software for hotels, restaurants and travel businesses, built in Nepal by Kodedristi.",
    answer:
      "Kodedristi builds booking, reservation and management software for hotels, restaurants and travel companies. We combine a clear customer-facing booking experience with the back-office tools your staff use every day.",
    challenges: [
      "Taking bookings online without double-booking",
      "Managing rooms, tables, tours and staff in one place",
      "Reaching travellers who search from abroad",
    ],
    builds: [
      "Booking and reservation systems",
      "Hotel and restaurant management software",
      "Tour and package management",
      "Multi-language booking websites",
      "Customer apps and reporting dashboards",
    ],
    solutions: ["website-development", "web-mobile-apps", "custom-software"],
    faqs: [
      {
        question: "Can you build an online booking system for a hotel or tour company?",
        answer:
          "Yes. We build booking and reservation systems with availability, payments and confirmations, plus an admin side for your staff.",
      },
      {
        question: "Can the website work for international visitors?",
        answer:
          "Yes. We build fast, search-friendly sites and can support multiple languages and currencies, scoped with you.",
      },
      {
        question: "Can it connect to our existing tools?",
        answer:
          "We plan integrations with your current booking, accounting or channel tools during scoping.",
      },
    ],
    match: ["hotel", "hospitality", "travel", "tour", "restaurant", "tourism"],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

/** The industry whose keywords appear in a project's free-text industry field. */
export function industryForProject(industry?: string): Industry | undefined {
  const text = industry?.toLowerCase().trim();
  if (!text) return undefined;
  return INDUSTRIES.find((i) => i.match.some((word) => text.includes(word)));
}
