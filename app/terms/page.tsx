"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./terms.module.css";

interface TermsSection {
  id: string;
  num: number;
  title: string;
  category: "general" | "accounts" | "marketplace" | "payments" | "services" | "safety" | "legal";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  callout?: string;
  directory?: string[];
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "ABOUT BOULOT MAN",
    category: "general",
    content: [
      "Boulot Man is a workforce, technical-services and project marketplace designed to connect individuals, households, businesses, organizations and other clients with technicians, engineers, independent professionals, service providers and companies.",
      "Depending on availability and location, Boulot Man provides features including: Professional and company discovery, Technician and company profiles, Task and project posting, Applications and offers, Requests for quotations, Hiring and engagement tools, Messaging and communication, Reviews and ratings, Identity and professional verification, Company verification, Payments, Milestone payments, Escrow-supported transactions, Project-management tools, Concierge services, Build a Team services, Boulot Man Contractors, Subcontracting opportunities, Matching algorithms, Dashboards, and Construction/technical marketplaces."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "DEFINITIONS",
    category: "general",
    content: [
      "For the purposes of these Terms of Service:",
      "• “Boulot Man,” “we,” “our,” or “us” means the Boulot Man entity responsible for providing the applicable Platform or service.",
      "• “Platform” means Boulot Man websites, mobile applications, dashboards, software, communication tools and related digital services.",
      "• “User” means any person or organization accessing or using Boulot Man.",
      "• “Client” means a User seeking, requesting, purchasing or commissioning services through Boulot Man.",
      "• “Technician” or “Professional” means an individual offering professional, technical, engineering, handyman or related services.",
      "• “Company” means a business, contractor, service provider, enterprise or other organization offering services through Boulot Man.",
      "• “Provider” means a Technician, Professional or Company offering or performing services.",
      "• “Task” means work or services requested or posted by a Client.",
      "• “Project” means an engagement involving defined deliverables, quotations, milestones, multiple professionals, companies, supervision or structured execution.",
      "• “Engagement” means an arrangement between a Client and Provider relating to services obtained through Boulot Man.",
      "• “User Content” means information, photographs, documents, reviews, messages, portfolio materials, and project information submitted by Users.",
      "• “Verification” means a Boulot Man process used to review specified information about a User, Professional or Company."
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "ELIGIBILITY",
    category: "general",
    content: [
      "You may create and use a Boulot Man account only if you are legally capable of entering into binding contracts. Businesses and organizations may use Boulot Man only through persons authorized to act on their behalf.",
      "By creating an account, you represent that: The information you provide is accurate; You have legal capacity or proper authorization; Your use will comply with applicable law; You are not prohibited from using the Platform; and You will comply with these Terms."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "ACCOUNT TYPES",
    category: "accounts",
    content: [
      "Boulot Man provides distinct account types with tailored workflows:"
    ],
    subsections: [
      {
        title: "4.1 Client Accounts",
        items: [
          "Search for Technicians, Engineers and Companies",
          "Post tasks and projects, request quotations, and invite providers",
          "Hire providers, communicate, make payments, and manage escrow milestones",
          "Review completed work and manage project history"
        ]
      },
      {
        title: "4.2 Technician and Professional Accounts",
        items: [
          "Create verified professional profiles and showcase skills/portfolio",
          "Receive service requests, apply for open tasks, and submit bids",
          "Communicate with clients, perform services, and receive secure payouts",
          "Participate in teams, contractor projects, and build reputation"
        ]
      },
      {
        title: "4.3 Company Accounts",
        items: [
          "Create verified corporate profiles and list organizational capabilities",
          "Submit formal quotations, bid for enterprise tenders and subcontracting",
          "Manage team members, supervisors, fleet, and corporate payouts",
          "Participate in structured Boulot Man Contractors programs"
        ]
      }
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "ACCOUNT REGISTRATION",
    category: "accounts",
    content: [
      "Users must provide accurate, current and complete information when registering. Users must update information when it changes materially. Providing false, misleading or fraudulent information may result in account restriction, suspension or permanent termination."
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "ACCOUNT SECURITY",
    category: "accounts",
    content: [
      "Users are responsible for maintaining the confidentiality and security of their login credentials. You must not knowingly permit unauthorized persons to use your account.",
      "You must promptly notify Boulot Man if you suspect your account has been compromised, your password stolen, or unauthorized transactions have occurred."
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "USERNAMES AND PUBLIC PROFILE LINKS",
    category: "accounts",
    content: [
      "Boulot Man may allow Users to create a unique username generating a public link (e.g., boulotman.com/username).",
      "Users must not select usernames that impersonate others, mislead regarding affiliation, infringe trademarks, or contain abusive content.",
      "A User may change their username a maximum of three times within a rolling 30-day period. Changing a username does not reset reviews, transactions, or underlying account records."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "USER PROFILES",
    category: "accounts",
    content: [
      "Technicians and Companies must accurately represent their identity, profession, skills, qualifications, experience, certifications, licences, portfolio, availability, service area, and capacity. Users must not claim credentials they do not possess."
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "VERIFICATION",
    category: "accounts",
    content: [
      "Boulot Man operates verification programs reviewing phone numbers, email addresses, identity documents, qualifications, licences, business registrations, references, and capabilities.",
      "Verification indicates that specified information was reviewed at a particular time and does not constitute an absolute guarantee of future conduct, safety, or workmanship. Users remain responsible for evaluating suitability."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "POSTING TASKS AND PROJECTS",
    category: "marketplace",
    content: [
      "Clients posting tasks or projects must provide reasonably accurate details concerning work required, category, location, schedule, budget, site conditions, materials, and deliverables without misrepresenting scope."
    ]
  },
  {
    id: "sec-11",
    num: 11,
    title: "APPLICATIONS, OFFERS AND QUOTATIONS",
    category: "marketplace",
    content: [
      "Providers applying for tasks must accurately describe proposed services, price, timeframe, conditions, and materials. Submitting an application does not guarantee selection, and receiving an invitation does not obligate acceptance."
    ]
  },
  {
    id: "sec-12",
    num: 12,
    title: "SERVICE AGREEMENTS BETWEEN USERS",
    category: "marketplace",
    content: [
      "When a Client hires a Provider through the marketplace, a direct service contract is formed between Client and Provider governing scope, price, milestones, and completion.",
      "Unless Boulot Man expressly enters into a separate agreement as contractor or project manager, marketplace operation does not make Boulot Man the direct employer of an independent Technician or employee of a Client."
    ]
  },
  {
    id: "sec-13",
    num: 13,
    title: "PROFESSIONAL RESPONSIBILITIES",
    category: "marketplace",
    content: [
      "Professionals must perform accepted work professionally, follow safety requirements, possess legally required licences, use proper tools, communicate delays, respect Client property, follow agreed scope, and comply with applicable law."
    ]
  },
  {
    id: "sec-14",
    num: 14,
    title: "CLIENT RESPONSIBILITIES",
    category: "marketplace",
    content: [
      "Clients must provide accurate project info, reasonable site access, disclose known hazards, communicate changes, pay agreed amounts, avoid abusive behavior, respect safety, and review work in good faith."
    ]
  },
  {
    id: "sec-15",
    num: 15,
    title: "COMPANIES AND CONTRACTORS",
    category: "marketplace",
    content: [
      "Companies are responsible for ensuring that their employees, representatives, and subcontractors possess required qualifications and authority, without exaggerating workforce size, equipment, licences, or financial capacity."
    ]
  },
  {
    id: "sec-16",
    num: 16,
    title: "PRICING",
    category: "payments",
    content: [
      "Providers set their own rates (hourly, daily, fixed price, inspection fee, milestone quotation). Users should clarify whether prices include materials, transport, permits, and applicable taxes before work starts."
    ]
  },
  {
    id: "sec-17",
    num: 17,
    title: "PAYMENTS",
    category: "payments",
    content: [
      "Boulot Man facilitates secure payments directly or via authorized payment processors. Applicable service fees, processing charges, or project-management fees are disclosed prior to transaction initiation."
    ]
  },
  {
    id: "sec-18",
    num: 18,
    title: "ESCROW AND MILESTONE PAYMENTS",
    category: "payments",
    content: [
      "For milestone-based work, Clients fund an agreed amount into escrow before work begins. Release occurs upon completion, Client approval, or formal dispute resolution. Misuse of escrow or fraudulent chargebacks is strictly prohibited."
    ]
  },
  {
    id: "sec-19",
    num: 19,
    title: "TAXES",
    category: "payments",
    content: [
      "Users are responsible for taxes applicable to their earnings, purchases, and business activities, unless statutory regulations require Boulot Man or payment gateways to collect or remit specific taxes."
    ]
  },
  {
    id: "sec-20",
    num: 20,
    title: "CANCELLATIONS",
    category: "payments",
    content: [
      "Cancellation rights and obligations depend on whether work has commenced, materials purchased, provider mobilization, milestones completed, and agreed project terms."
    ]
  },
  {
    id: "sec-21",
    num: 21,
    title: "REFUNDS",
    category: "payments",
    content: [
      "Refund eligibility is assessed based on non-performance, partial completion, materials purchased, unauthorized transactions, and consumer protection laws. Requesting a refund does not automatically guarantee full reimbursement."
    ]
  },
  {
    id: "sec-22",
    num: 22,
    title: "DISPUTES BETWEEN USERS",
    category: "marketplace",
    content: [
      "Users should first attempt amicable resolution. If unresolved, Boulot Man dispute tools allow submission of messages, photos, contracts, receipts, and inspection reports for fair mediation and binding determination."
    ]
  },
  {
    id: "sec-23",
    num: 23,
    title: "REVIEWS AND RATINGS",
    category: "marketplace",
    content: [
      "Boulot Man operates a two-way reputation system reflecting genuine engagements. Users must not buy, sell, fabricate, or coordinate reviews, or use reviews as threats. Inappropriate reviews may be removed."
    ]
  },
  {
    id: "sec-24",
    num: 24,
    title: "COMMUNICATIONS",
    category: "marketplace",
    content: [
      "Platform communication tools must not be used for spam, fraud, harassment, threats, malicious links, or unauthorized advertising. Communications may be processed for safety, support, and dispute resolution."
    ]
  },
  {
    id: "sec-25",
    num: 25,
    title: "CIRCUMVENTION AND OFF-PLATFORM TRANSACTIONS",
    category: "marketplace",
    content: [
      "Users must not manipulate platform systems to evade fees, escrow safeguards, or safety protections. Transactions conducted off-platform forfeit Boulot Man payment protections, dispute mediation, and records."
    ]
  },
  {
    id: "sec-26",
    num: 26,
    title: "CONCIERGE SERVICES",
    category: "services",
    content: [
      "Boulot Man Concierge provides project coordination, professional sourcing, site visits, and progress monitoring under specific client service agreements."
    ]
  },
  {
    id: "sec-27",
    num: 27,
    title: "BUILD A TEAM",
    category: "services",
    content: [
      "Boulot Man assists clients in assembling multi-disciplinary teams of technicians, engineers, and supervisors for construction, technical, and operational projects."
    ]
  },
  {
    id: "sec-28",
    num: 28,
    title: "BOULOT MAN CONTRACTORS",
    category: "services",
    content: [
      "Boulot Man Contractors provides structured execution for enterprise projects involving project managers, verified companies, engineers, and subcontractors governed by specific written contracts."
    ]
  },
  {
    id: "sec-29",
    num: 29,
    title: "INDEPENDENT PROFESSIONALS",
    category: "services",
    content: [
      "Independent Technicians determine how they perform their services subject to agreed client requirements, professional standards, and safety laws. Creating a profile does not constitute an employment contract with Boulot Man."
    ]
  },
  {
    id: "sec-30",
    num: 30,
    title: "SAFETY",
    category: "safety",
    content: [
      "Users must take reasonable safety precautions. Providers must adhere to occupational and technical safety standards. Clients must disclose known physical hazards. Immediate danger should be reported to local emergency authorities."
    ]
  },
  {
    id: "sec-31",
    num: 31,
    title: "PROHIBITED ACTIVITIES",
    category: "safety",
    content: [
      "Users must not engage in fraud, theft, illegal services, system hacking, identity forgery, impersonation, money laundering, harassment, or distribution of malware on Boulot Man."
    ]
  },
  {
    id: "sec-32",
    num: 32,
    title: "NON-DISCRIMINATION AND PROFESSIONAL CONDUCT",
    category: "safety",
    content: [
      "Boulot Man strictly prohibits unlawful discrimination, hate speech, threats, and abusive behavior. Legitimate selection based on skills, licences, availability, and experience is permitted."
    ]
  },
  {
    id: "sec-33",
    num: 33,
    title: "USER CONTENT",
    category: "safety",
    content: [
      "Users retain ownership of their original content while granting Boulot Man license to host, store, display, and process content necessary to operate and improve the platform."
    ]
  },
  {
    id: "sec-34",
    num: 34,
    title: "INTELLECTUAL PROPERTY",
    category: "legal",
    content: [
      "Boulot Man trademarks, logos, software, designs, and databases are protected by IP laws. Unauthorized copying, scraping, reverse engineering, or brand misuse is prohibited."
    ]
  },
  {
    id: "sec-35",
    num: 35,
    title: "COPYRIGHT AND RIGHTS COMPLAINTS",
    category: "legal",
    content: [
      "Rights owners may submit formal copyright infringement notices with identifying details. Boulot Man investigates and removes infringing content promptly."
    ]
  },
  {
    id: "sec-36",
    num: 36,
    title: "THIRD-PARTY SERVICES",
    category: "legal",
    content: [
      "Platform features may integrate third-party payment gateways, mapping, and identity verification services governed by their respective terms."
    ]
  },
  {
    id: "sec-37",
    num: 37,
    title: "PLATFORM AVAILABILITY",
    category: "legal",
    content: [
      "Boulot Man strives for high availability but does not guarantee uninterrupted service due to maintenance, software updates, network issues, or force majeure."
    ]
  },
  {
    id: "sec-38",
    num: 38,
    title: "PLATFORM CHANGES",
    category: "legal",
    content: [
      "Boulot Man may introduce, modify, or discontinue features, categories, pricing, or fees with appropriate advance notice where required."
    ]
  },
  {
    id: "sec-39",
    num: 39,
    title: "ACCOUNT RESTRICTIONS",
    category: "accounts",
    content: [
      "Boulot Man may restrict account functionality to investigate fraud, verify identity, manage payment disputes, or address security risks."
    ]
  },
  {
    id: "sec-40",
    num: 40,
    title: "ACCOUNT SUSPENSION AND TERMINATION",
    category: "accounts",
    content: [
      "Accounts may be suspended or terminated for severe fraud, impersonation, safety breaches, payment abuse, or material violations of these Terms."
    ]
  },
  {
    id: "sec-41",
    num: 41,
    title: "USER ACCOUNT CLOSURE",
    category: "accounts",
    content: [
      "Users may close accounts once outstanding jobs and payments are settled. Necessary legal, financial, and tax records are retained per statutory requirements."
    ]
  },
  {
    id: "sec-42",
    num: 42,
    title: "NO GUARANTEE OF WORK OR HIRING",
    category: "legal",
    content: [
      "Creating an account does not guarantee contracts, tasks, or revenue; posting a task does not guarantee that a provider will apply or accept."
    ]
  },
  {
    id: "sec-43",
    num: 43,
    title: "NO GUARANTEE OF USER PERFORMANCE",
    category: "legal",
    content: [
      "Unless Boulot Man assumes direct contractor responsibility under a separate written agreement, Boulot Man does not guarantee subjective perfection of independent provider work."
    ]
  },
  {
    id: "sec-44",
    num: 44,
    title: "WARRANTIES AND PLATFORM DISCLAIMER",
    category: "legal",
    content: [
      "The Platform is provided on an 'as available' basis to the maximum extent permitted by applicable law, preserving non-waivable statutory consumer protections."
    ]
  },
  {
    id: "sec-45",
    num: 45,
    title: "LIMITATION OF LIABILITY",
    category: "legal",
    content: [
      "To the maximum extent permitted by law, Boulot Man is not liable for indirect or consequential losses arising solely from independent peer-to-peer user transactions."
    ]
  },
  {
    id: "sec-46",
    num: 46,
    title: "INDEMNIFICATION",
    category: "legal",
    content: [
      "Users agree to indemnify Boulot Man against third-party claims arising from their fraud, unlawful conduct, or material breach of these Terms."
    ]
  },
  {
    id: "sec-47",
    num: 47,
    title: "PRIVACY AND DATA PROTECTION",
    category: "legal",
    content: [
      "Personal data is handled in strict compliance with the Boulot Man Privacy Policy. Client addresses and private documents must not be misused or publicly disclosed."
    ]
  },
  {
    id: "sec-48",
    num: 48,
    title: "RECORDS AND ELECTRONIC COMMUNICATIONS",
    category: "legal",
    content: [
      "Users consent to receive legal notices and transaction records electronically via email, SMS, app notifications, and platform dashboards."
    ]
  },
  {
    id: "sec-49",
    num: 49,
    title: "LEGAL COMPLIANCE",
    category: "legal",
    content: [
      "Users must comply with all applicable business licensing, professional certification, tax, labor, construction, and data regulations."
    ]
  },
  {
    id: "sec-50",
    num: 50,
    title: "COUNTRY-SPECIFIC TERMS",
    category: "legal",
    content: [
      "Country-specific regulations across Rwanda, Cameroon, Nigeria, Kenya, Ghana, South Africa, and Ivory Coast supplement these Terms where mandatory local laws apply."
    ]
  },
  {
    id: "sec-51",
    num: 51,
    title: "GOVERNING LAW AND DISPUTE RESOLUTION",
    category: "legal",
    content: [
      "Governing law and jurisdiction depend on the contracting entity and user location. Users are encouraged to utilize platform dispute resolution prior to formal proceedings."
    ]
  },
  {
    id: "sec-52",
    num: 52,
    title: "FORCE MAJEURE",
    category: "legal",
    content: [
      "Parties are not liable for performance failures resulting from natural disasters, armed conflict, severe weather, grid failures, or other extraordinary events beyond reasonable control."
    ]
  },
  {
    id: "sec-53",
    num: 53,
    title: "CHANGES TO THESE TERMS",
    category: "legal",
    content: [
      "Boulot Man may update these Terms periodically with revised effective dates. Continued use following updates indicates acceptance where legally permitted."
    ]
  },
  {
    id: "sec-54",
    num: 54,
    title: "SEVERABILITY",
    category: "legal",
    content: [
      "If any provision is determined invalid or unenforceable, the remaining provisions remain in full force and effect."
    ]
  },
  {
    id: "sec-55",
    num: 55,
    title: "NO WAIVER",
    category: "legal",
    content: [
      "Failure by Boulot Man to enforce any provision on one occasion does not constitute a permanent waiver of rights."
    ]
  },
  {
    id: "sec-56",
    num: 56,
    title: "ASSIGNMENT",
    category: "legal",
    content: [
      "Users may not transfer accounts without authorization. Boulot Man may assign rights in connection with corporate reorganization or merger."
    ]
  },
  {
    id: "sec-57",
    num: 57,
    title: "ENTIRE AGREEMENT",
    category: "legal",
    content: [
      "These Terms, junto with the Privacy Policy, service agreements, and incorporated policies, constitute the entire agreement between the user and Boulot Man."
    ]
  },
  {
    id: "sec-58",
    num: 58,
    title: "ORDER OF PRECEDENCE",
    category: "legal",
    content: [
      "Specific written contracts (e.g. Boulot Man Contractors enterprise agreements) prevail over general terms regarding that specific project."
    ]
  },
  {
    id: "sec-59",
    num: 59,
    title: "CONTACT AND LEGAL NOTICES",
    category: "legal",
    content: [
      "Legal inquiries and formal notices may be directed to Boulot Man through official channels:"
    ],
    callout: "Boulot Man Inc.\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-60",
    num: 60,
    title: "RELATED POLICIES",
    category: "legal",
    content: [
      "These Terms of Service operate alongside the full suite of Boulot Man governance policies:"
    ],
    directory: [
      "Privacy Policy",
      "Client Terms",
      "Technician & Professional Terms",
      "Company Terms",
      "Marketplace Rules",
      "Verification Policy",
      "Payments & Escrow Policy",
      "Cancellation & Refund Policy",
      "Dispute Resolution Policy",
      "Reviews & Ratings Policy",
      "Username Policy",
      "Concierge Service Terms",
      "Build a Team Terms",
      "Boulot Man Contractors Terms",
      "Intellectual Property Policy",
      "Safety & Prohibited Services Policy",
      "Account Enforcement Policy",
      "Cookie Policy"
    ]
  },
  {
    id: "sec-61",
    num: 61,
    title: "ACCEPTANCE",
    category: "legal",
    content: [
      "By creating an account or accessing the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
      "BOULOT MAN — Building the premier trusted digital workforce ecosystem for Africa."
    ]
  }
];

export default function TermsOfServicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");

  const filteredSections = TERMS_SECTIONS.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.num.toString().includes(q) ||
      s.content.some((c) => c.toLowerCase().includes(q));

    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleScrollTo = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* =====================================================
           HERO SECTION
      ====================================================== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>📜 Official Legal Terms</span>
              <span className={styles.heroDate}>Effective Date &amp; Updated: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Terms of Service</h1>
            <p className={styles.heroSubtitle}>
              Please review the platform agreement and governance policies that ensure a secure, transparent,
              and trusted marketplace for clients, technicians, and enterprises across Africa.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("general");
                  handleScrollTo("sec-1");
                }}
              >
                🏢 Use of Platform (Sec 1-3)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("accounts");
                  handleScrollTo("sec-4");
                }}
              >
                🛡️ Accounts &amp; Verification (Sec 4-9)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("marketplace");
                  handleScrollTo("sec-10");
                }}
              >
                🤝 Marketplace &amp; Contracts (Sec 10-15)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("payments");
                  handleScrollTo("sec-16");
                }}
              >
                🔒 Payments &amp; Escrow (Sec 16-21)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("services");
                  handleScrollTo("sec-26");
                }}
              >
                ⚡ Enterprise Services (Sec 26-29)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("safety");
                  handleScrollTo("sec-30");
                }}
              >
                ⚠️ Safety &amp; Conduct (Sec 30-33)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("legal");
                  handleScrollTo("sec-34");
                }}
              >
                ⚖️ Liability &amp; Governance (Sec 34-61)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           MAIN LAYOUT: STICKY SIDEBAR + 61 SECTIONS
      ====================================================== */}
      <div className={styles.container}>
        <div className={styles.mainLayout}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search 61 terms sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Table of Contents</span>
              <span className={styles.sectionCount}>{filteredSections.length} / 61</span>
            </div>

            <div className={styles.sidebarNav}>
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className={`${styles.navItem} ${activeSectionId === sec.id ? styles.navItemActive : ""}`}
                  onClick={() => handleScrollTo(sec.id)}
                >
                  <span className={styles.navItemNum}>#{sec.num}</span>
                  <span>{sec.title}</span>
                </button>
              ))}
            </div>

            <Link href="/legal" className={styles.legalCenterLink}>
              🏛️ Visit Legal Center
            </Link>
          </aside>

          {/* POLICY CONTENT: ALL 61 SECTIONS */}
          <main className={styles.policyContent}>
            {filteredSections.map((sec) => (
              <article key={sec.id} id={sec.id} className={styles.policyCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.sectionBadge}>Section {sec.num}</span>
                  <h2 className={styles.cardTitle}>{sec.title}</h2>
                </div>

                <div className={styles.cardBody}>
                  {sec.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}

                  {sec.subsections && (
                    <div style={{ marginTop: "16px" }}>
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className={styles.subSection}>
                          <div className={styles.subSectionTitle}>{sub.title}</div>
                          <ul className={styles.policyList}>
                            {sub.items.map((item, iIdx) => (
                              <li key={iIdx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.directory && (
                    <div className={styles.directoryGrid}>
                      {sec.directory.map((policy, pIdx) => (
                        <div key={pIdx} className={styles.directoryCard}>
                          <span>📄</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === "sec-59" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Official Contact and Legal Notices</h3>
                      <p>
                        Formal notices and legal inquiries may be directed through the official corporate channels:
                      </p>
                      <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                          <span>Corporate Office</span>
                          <strong>KK 371 St, Kigali, Rwanda</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Direct Phone</span>
                          <strong>0793 762 949</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Legal Email</span>
                          <strong>
                            <a href="mailto:office@boulotman.com">office@boulotman.com</a>
                          </strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Website</span>
                          <strong>
                            <a href="https://www.boulotman.com">www.boulotman.com</a>
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {filteredSections.length === 0 && (
              <div className={styles.policyCard} style={{ textAlign: "center", padding: "60px 20px" }}>
                <h3 style={{ color: "#001f3f", marginBottom: "8px" }}>No matching sections found</h3>
                <p style={{ color: "#64748b" }}>
                  Try a different search term like "escrow", "concierge", "verification", or "cancellation".
                </p>
                <button
                  type="button"
                  className={styles.legalCenterLink}
                  style={{ display: "inline-flex", width: "auto", margin: "16px auto 0" }}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Search Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
