"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./legal.module.css";

interface SectionData {
  id: string;
  num: number;
  title: string;
  icon: string;
  paragraphs: string[];
  bulletPoints?: string[];
  ctaText?: string;
  ctaHref?: string;
  extraElement?: "username" | "contact";
}

const LEGAL_SECTIONS: SectionData[] = [
  {
    id: "terms-of-service",
    num: 1,
    title: "Terms of Service",
    icon: "📄",
    paragraphs: [
      "The Boulot Man Terms of Service govern access to and use of the website, applications, dashboards, marketplace and related Boulot Man services.",
      "The Terms cover key operational and governance matters including:"
    ],
    bulletPoints: [
      "Account creation and eligibility",
      "Client, technician and company accounts",
      "Tasks and project postings",
      "Applications, offers, quotations and hiring",
      "Payments and escrow",
      "User responsibilities",
      "Platform conduct",
      "Reviews and ratings",
      "Verification",
      "Cancellations and disputes",
      "Suspension and termination",
      "Intellectual property",
      "Limitations of liability",
      "Applicable legal requirements"
    ],
    ctaText: "Read Terms of Service",
    ctaHref: "/terms"
  },
  {
    id: "privacy-policy",
    num: 2,
    title: "Privacy Policy",
    icon: "🔒",
    paragraphs: [
      "Boulot Man collects and processes information necessary to operate the platform, verify users, facilitate transactions, improve security and provide relevant services.",
      "Depending on how a user interacts with Boulot Man, information may include:"
    ],
    bulletPoints: [
      "Account information",
      "Contact information",
      "Identity information",
      "Professional information",
      "Company information",
      "Location information",
      "Task and project information",
      "Communications",
      "Transaction information",
      "Device and security information",
      "Verification documents",
      "Reviews and platform activity"
    ],
    ctaText: "Read Privacy Policy",
    ctaHref: "/privacy"
  },
  {
    id: "client-terms",
    num: 3,
    title: "Client Terms",
    icon: "👤",
    paragraphs: [
      "Clients use Boulot Man to discover professionals and companies, post tasks, request quotations, hire providers and manage service engagements.",
      "Clients are responsible for providing accurate information about requested work, including relevant scope, location, schedule, requirements and known conditions that may materially affect execution.",
      "Clients must not use Boulot Man to request unlawful, fraudulent, dangerous or prohibited activities.",
      "Clients are expected to respect agreed payment obligations and platform procedures when engaging professionals through Boulot Man."
    ],
    ctaText: "Read Client Terms",
    ctaHref: "/terms"
  },
  {
    id: "technician-professional-terms",
    num: 4,
    title: "Technician & Professional Terms",
    icon: "🛠️",
    paragraphs: [
      "Technicians, engineers and other independent professionals may create profiles, list services, receive opportunities, apply for tasks and perform work obtained through Boulot Man.",
      "Professionals must provide truthful information concerning their:"
    ],
    bulletPoints: [
      "Identity",
      "Experience",
      "Skills",
      "Qualifications",
      "Certifications",
      "Licences",
      "Availability",
      "Service locations",
      "Portfolio",
      "Professional capabilities"
    ],
    ctaText: "Read Professional Terms",
    ctaHref: "/terms"
  },
  {
    id: "company-provider-terms",
    num: 5,
    title: "Company & Service Provider Terms",
    icon: "🏢",
    paragraphs: [
      "Companies using Boulot Man to obtain service and project opportunities must accurately represent their legal identity and operational capabilities.",
      "Company information may include:"
    ],
    bulletPoints: [
      "Business registration",
      "Authorized representatives",
      "Service categories",
      "Professional licences",
      "Technical workforce",
      "Certifications",
      "Insurance",
      "Equipment",
      "Operational capacity",
      "Previous projects"
    ],
    ctaText: "Read Company Terms",
    ctaHref: "/terms"
  },
  {
    id: "marketplace-rules",
    num: 6,
    title: "Marketplace Rules",
    icon: "⚖️",
    paragraphs: [
      "Boulot Man is built around professional, transparent and responsible interactions.",
      "Users must NOT engage in prohibited actions including:"
    ],
    bulletPoints: [
      "Create fraudulent profiles",
      "Impersonate another person or company",
      "Submit falsified documents",
      "Manipulate ratings or reviews",
      "Post deceptive tasks or projects",
      "Harass or threaten other users",
      "Use the platform for illegal activity",
      "Attempt payment fraud",
      "Abuse dispute or refund procedures",
      "Circumvent platform safeguards",
      "Misrepresent work performed",
      "Misuse another user's personal information"
    ],
    ctaText: "Read Marketplace Rules",
    ctaHref: "/terms"
  },
  {
    id: "verification-policy",
    num: 7,
    title: "Verification Policy",
    icon: "✅",
    paragraphs: [
      "Verification is an important part of the Boulot Man trust system.",
      "Depending on account type and activity, Boulot Man may verify:",
      "Verification means that specified information has been reviewed according to the applicable Boulot Man verification process. It does not constitute an unconditional guarantee of future performance, conduct, workmanship or project outcome.",
      "Verification status may be reviewed, suspended or removed if information expires, changes, becomes inaccurate or is later found to have been misrepresented."
    ],
    bulletPoints: [
      "Phone number",
      "Email",
      "Identity",
      "Professional qualifications",
      "Professional licences",
      "Business registration",
      "Company representatives",
      "Certifications",
      "Professional experience",
      "Project history",
      "Operational capability"
    ],
    ctaText: "Read Verification Policy",
    ctaHref: "/signup/verify"
  },
  {
    id: "payments-escrow",
    num: 8,
    title: "Payments & Escrow",
    icon: "💳",
    paragraphs: [
      "Boulot Man may support payment methods and transaction structures including direct payments, milestones and escrow-backed transactions, depending on service availability and applicable requirements.",
      "Where escrow is used, funds may be held or processed according to the agreed transaction or milestone conditions before release.",
      "Users must comply with the payment instructions applicable to their transaction. Boulot Man may use authorized payment institutions or other service providers to process or facilitate financial transactions."
    ],
    ctaText: "Read Payments & Escrow Policy",
    ctaHref: "/payments-and-earnings"
  },
  {
    id: "cancellations-refunds-disputes",
    num: 9,
    title: "Cancellations, Refunds & Disputes",
    icon: "🔄",
    paragraphs: [
      "Services and projects may occasionally be cancelled or disputed.",
      "Applicable procedures consider factors such as work started, work completed, milestones reached, materials purchased, provider expenses, client approvals, agreed scope, and evidence submitted by both parties.",
      "Users should maintain relevant communications, quotations, approvals, receipts, photographs and other evidence within the platform whenever possible."
    ],
    bulletPoints: [
      "Whether work started",
      "Work completed",
      "Milestones reached",
      "Materials purchased",
      "Provider expenses",
      "Client approvals",
      "Agreed scope",
      "Evidence submitted by both parties",
      "Payment status"
    ],
    ctaText: "Read Dispute Resolution Policy",
    ctaHref: "/dispute-resolution"
  },
  {
    id: "reviews-ratings",
    num: 10,
    title: "Reviews & Ratings",
    icon: "⭐",
    paragraphs: [
      "Boulot Man uses two-way reputation systems. Clients may review technicians and companies, while professionals and companies may also be permitted to review their experience working with clients.",
      "Reviews must reflect genuine platform interactions. Boulot Man strictly prohibits purchased reviews, fake reviews, review manipulation, retaliatory abuse, reviews unrelated to an actual engagement, and threats intended to influence ratings."
    ],
    ctaText: "Read Reviews & Ratings Policy",
    ctaHref: "/terms"
  },
  {
    id: "username-policy",
    num: 11,
    title: "Username & Public Profile Policy",
    icon: "🏷️",
    paragraphs: [
      "Boulot Man users may receive a unique public username and profile link.",
      "Usernames must comply with Boulot Man naming, impersonation and platform-conduct requirements. Usernames are unique across the platform.",
      "A username may be changed a maximum of three times within a rolling 30-day period. Changing a username does not change the underlying Boulot Man account, transaction history, reviews or permanent account identifier.",
      "Boulot Man may reserve, restrict, reclaim or prohibit usernames when reasonably necessary for security, trademark protection, impersonation prevention or platform operation."
    ],
    extraElement: "username",
    ctaText: "Read Username Policy",
    ctaHref: "/terms"
  },
  {
    id: "concierge-services",
    num: 12,
    title: "Concierge Services",
    icon: "🎩",
    paragraphs: [
      "Boulot Man Concierge may assist clients who require additional coordination or supervision of work.",
      "Depending on the engagement, Concierge services may include:"
    ],
    bulletPoints: [
      "Project monitoring",
      "Technician coordination",
      "Progress reporting",
      "Site supervision support",
      "Professional sourcing",
      "Client representation for agreed operational activities"
    ],
    ctaText: "Read Concierge Service Terms",
    ctaHref: "/concierge"
  },
  {
    id: "build-a-team",
    num: 13,
    title: "Build a Team",
    icon: "👥",
    paragraphs: [
      "Build a Team enables clients to request organized groups of professionals for projects or operational requirements.",
      "Boulot Man may assist with identifying and organizing technicians, engineers, supervisors, project personnel or other suitable workers.",
      "Team composition depends on project requirements, availability, qualifications and agreed scope. Specific project responsibilities, payment arrangements and management structures may be governed by additional project terms."
    ],
    ctaText: "Read Build a Team Terms",
    ctaHref: "/build-a-team"
  },
  {
    id: "contractors-terms",
    num: 14,
    title: "Boulot Man Contractors",
    icon: "🏗️",
    paragraphs: [
      "Boulot Man Contractors supports larger or more structured project execution through Boulot Man's enterprise-grade project delivery framework.",
      "Projects may involve verified companies, subcontractors, engineers, technicians, project managers, supervisors, and specialized service providers.",
      "Large projects may require additional contracts, project specifications, milestones, insurance, compliance documentation and payment arrangements."
    ],
    bulletPoints: [
      "Verified companies",
      "Subcontractors",
      "Engineers",
      "Technicians",
      "Project managers",
      "Supervisors",
      "Specialized service providers"
    ],
    ctaText: "Read Contractors Terms",
    ctaHref: "/contractors"
  },
  {
    id: "intellectual-property",
    num: 15,
    title: "Intellectual Property",
    icon: "💡",
    paragraphs: [
      "Boulot Man's brand, platform design, software, trademarks, logos and original platform materials are protected by applicable intellectual-property rights.",
      "Users retain applicable rights to content they create, subject to the permissions necessary for Boulot Man to host, display, process and use that content in operating and promoting the platform as described in applicable policies.",
      "Users must not upload content they do not have the right to use."
    ],
    ctaText: "Read Intellectual Property Policy",
    ctaHref: "/terms"
  },
  {
    id: "safety-prohibited-services",
    num: 16,
    title: "Safety & Prohibited Services",
    icon: "⚠️",
    paragraphs: [
      "Certain tasks, services or activities may be prohibited or restricted because of safety, legal, licensing or platform requirements.",
      "Professionals must only perform work they are legally and professionally qualified to undertake. Boulot Man may remove prohibited listings, restrict accounts or require additional qualifications for regulated services."
    ],
    ctaText: "Read Safety & Prohibited Services Policy",
    ctaHref: "/terms"
  },
  {
    id: "account-suspension",
    num: 17,
    title: "Account Suspension & Termination",
    icon: "🚫",
    paragraphs: [
      "Boulot Man may restrict, suspend or terminate accounts where reasonably necessary because of matters including:",
      "Where appropriate and legally permissible, users may be provided with information regarding account actions and available review or appeal procedures."
    ],
    bulletPoints: [
      "Fraud",
      "Identity misrepresentation",
      "Falsified documents",
      "Serious marketplace misconduct",
      "Payment abuse",
      "Repeated contractual violations",
      "Safety concerns",
      "Illegal activity",
      "Platform manipulation",
      "Serious or repeated policy violations"
    ],
    ctaText: "Read Account Enforcement Policy",
    ctaHref: "/terms"
  },
  {
    id: "cookies-policy",
    num: 18,
    title: "Cookies",
    icon: "🍪",
    paragraphs: [
      "Boulot Man may use cookies and similar technologies to maintain sessions, remember preferences, improve platform performance, understand usage and support security.",
      "Users may have additional controls depending on their jurisdiction and browser or application settings."
    ],
    ctaText: "Read Cookie Policy",
    ctaHref: "/privacy"
  },
  {
    id: "policy-changes",
    num: 19,
    title: "Changes to Legal Policies",
    icon: "📝",
    paragraphs: [
      "Boulot Man may update its legal terms and policies as the platform, applicable laws, payment infrastructure or services evolve.",
      "Where a change materially affects users, Boulot Man may provide notice through appropriate channels such as the platform, account dashboard or registered contact information.",
      "The effective date of the applicable policy will be displayed on the relevant policy page."
    ]
  },
  {
    id: "legal-support",
    num: 20,
    title: "Legal Questions & Support",
    icon: "📍",
    paragraphs: [
      "Users who have questions regarding Boulot Man's legal policies, account matters, privacy, verification or marketplace procedures may contact Boulot Man through the appropriate support channel."
    ],
    extraElement: "contact"
  }
];

const ALL_DOCUMENTS = [
  { title: "Terms of Service", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Client Terms", href: "/terms" },
  { title: "Technician & Professional Terms", href: "/terms" },
  { title: "Company Terms", href: "/terms" },
  { title: "Marketplace Rules", href: "/terms" },
  { title: "Verification Policy", href: "/signup/verify" },
  { title: "Payments & Escrow Policy", href: "/payments-and-earnings" },
  { title: "Cancellation & Refund Policy", href: "/dispute-resolution" },
  { title: "Dispute Resolution Policy", href: "/dispute-resolution" },
  { title: "Reviews & Ratings Policy", href: "/terms" },
  { title: "Username Policy", href: "/terms" },
  { title: "Concierge Service Terms", href: "/concierge" },
  { title: "Build a Team Terms", href: "/build-a-team" },
  { title: "Boulot Man Contractors Terms", href: "/contractors" },
  { title: "Intellectual Property Policy", href: "/terms" },
  { title: "Safety & Prohibited Services Policy", href: "/terms" },
  { title: "Account Enforcement Policy", href: "/terms" },
  { title: "Cookie Policy", href: "/privacy" }
];

export default function LegalCenterPage() {
  const [activeSection, setActiveSection] = useState<string>("terms-of-service");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of LEGAL_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredSections = LEGAL_SECTIONS.filter((sec) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
      sec.bulletPoints?.some((b) => b.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            🛡️ Official Platform Governance
          </div>
          <h1 className={styles.heroTitle}>Boulot Man Legal Center</h1>
          <div className={styles.heroMeta}>
            <span>📅 Effective Date: August 31, 2026</span>
            <span>•</span>
            <span>🕒 Last Updated: August 31, 2026</span>
          </div>
          <p className={styles.heroDescription}>
            Welcome to the Boulot Man Legal Center. Boulot Man operates a digital
            workforce and services marketplace connecting clients with technicians,
            engineers, professionals, service providers and companies. This Legal
            Center explains the principal rules governing access to and use of the
            Boulot Man platform and provides access to the policies applicable to
            different Boulot Man services.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className={styles.mainContainer}>
        <div className={styles.layoutGrid}>
          {/* STICKY SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Policy Directory</h3>
              <input
                type="search"
                className={styles.sidebarSearch}
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <nav className={styles.sidebarNav}>
              {filteredSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`${styles.sidebarLink} ${isActive ? styles.active : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(sec.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        setActiveSection(sec.id);
                      }
                    }}
                  >
                    <span className={styles.sidebarNum}>{sec.num}.</span>
                    <span>{sec.title}</span>
                  </a>
                );
              })}
              {filteredSections.length === 0 && (
                <div style={{ padding: "12px 8px", color: "#94a3b8", fontSize: "13px" }}>
                  No matching policy found.
                </div>
              )}
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className={styles.contentArea}>
            {filteredSections.map((sec) => (
              <article key={sec.id} id={sec.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <div className={styles.cardIcon}>{sec.icon}</div>
                    <h2 className={styles.cardTitle}>{sec.num}. {sec.title}</h2>
                  </div>
                  <span className={styles.sectionBadge}>Section {sec.num < 10 ? `0${sec.num}` : sec.num}</span>
                </div>

                <div className={styles.cardBody}>
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className={styles.bulletList}>
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {sec.extraElement === "username" && (
                    <div className={styles.exampleBox}>
                      <span className={styles.exampleBadge}>Example Public URL:</span>
                      <span className={styles.exampleLink}>boulotman.com/josephelectric</span>
                      <span style={{ color: "#64748b", fontSize: "13px" }}>(@josephelectric)</span>
                    </div>
                  )}

                  {sec.extraElement === "contact" && (
                    <div className={styles.contactCard}>
                      <h3>Boulot Man Legal &amp; Compliance</h3>
                      <p>For inquiries regarding legal documentation, compliance vetting, or enterprise agreements:</p>
                      
                      <div className={styles.contactDetailsGrid}>
                        <div className={styles.contactDetailItem}>
                          <div className={styles.contactDetailLabel}>Headquarters</div>
                          <div className={styles.contactDetailValue}>KK 371 St, Kigali, Rwanda</div>
                        </div>
                        <div className={styles.contactDetailItem}>
                          <div className={styles.contactDetailLabel}>Direct Phone</div>
                          <div className={styles.contactDetailValue}>
                            <a href="tel:0793762949">0793 762 949</a>
                          </div>
                        </div>
                        <div className={styles.contactDetailItem}>
                          <div className={styles.contactDetailLabel}>Legal Inquiries</div>
                          <div className={styles.contactDetailValue}>
                            <a href="mailto:office@boulotman.com">office@boulotman.com</a>
                          </div>
                        </div>
                        <div className={styles.contactDetailItem}>
                          <div className={styles.contactDetailLabel}>Official Portal</div>
                          <div className={styles.contactDetailValue}>
                            <a href="https://www.boulotman.com" target="_blank" rel="noreferrer">www.boulotman.com</a>
                          </div>
                        </div>
                      </div>

                      <Link href="/contact" className={styles.contactBtn}>
                        Contact Legal &amp; Support →
                      </Link>
                    </div>
                  )}

                  {sec.ctaText && sec.ctaHref && (
                    <div className={styles.cardAction}>
                      <Link href={sec.ctaHref} className={styles.actionBtn}>
                        {sec.ctaText} →
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* ALL LEGAL DOCUMENTS DIRECTORY */}
            <div className={styles.docsDirectoryCard}>
              <h3 className={styles.docsTitle}>Boulot Man Legal Documents Directory</h3>
              <p className={styles.docsSubtitle}>
                Direct access to all platform agreements, terms, governance documents, and policies.
              </p>
              <div className={styles.docsGrid}>
                {ALL_DOCUMENTS.map((doc, idx) => (
                  <Link key={idx} href={doc.href} className={styles.docLinkItem}>
                    <span>{doc.title}</span>
                    <span className={styles.docLinkArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
