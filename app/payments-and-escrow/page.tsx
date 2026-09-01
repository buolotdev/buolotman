"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./payments.module.css";

interface PaymentSection {
  id: string;
  num: number;
  title: string;
  category: "vault" | "methods" | "milestones" | "fees" | "security" | "governance";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  callout?: string;
  directory?: string[];
}

const PAYMENT_SECTIONS: PaymentSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "BOULOT MAN ESCROW VAULT GUARANTEE",
    category: "vault",
    content: [
      "Boulot Man operates a secure, milestone-based Escrow Vault protecting both parties in every technical service transaction across Africa.",
      "When a client hires a technician or awards a company project, funds are placed in the secure Boulot Man Escrow account before mobilization. The funds are strictly held and only disbursed when the client reviews and approves the completed milestone."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "PAN-AFRICAN PAYMENT RAILS & INTEGRATIONS",
    category: "methods",
    content: [
      "We support localized, frictionless digital payment methods tailored to each country of operation:"
    ],
    subsections: [
      {
        title: "2.1 Mobile Money (MoMo)",
        items: [
          "MTN Mobile Money & Airtel Money (Rwanda, Uganda, Ghana)",
          "MTN MoMo & Orange Money (Cameroon, Ivory Coast)",
          "M-Pesa (Kenya)"
        ]
      },
      {
        title: "2.2 Bank Cards & Direct Wire",
        items: [
          "Visa, Mastercard, and Verve card payments processed via PCI-DSS Level 1 encrypted gateways",
          "Direct Corporate Bank Wire for large enterprise construction and engineering tenders"
        ]
      }
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "MILESTONE FUNDING & RELEASE ARCHITECTURE",
    category: "milestones",
    content: [
      "For structured or large projects, work is partitioned into defined sequential milestones. The client funds each milestone prior to work commencement. Upon milestone submission with photographic or engineering sign-off proof, the client has 5 business days to inspect and release funds."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "AUTOMATIC DISBURSAL & REVIEW WINDOW",
    category: "milestones",
    content: [
      "If a client receives completed deliverable proof and does not approve or dispute within the specified 7-day review window, automated reminder alerts are sent. If no response or defect report is filed within the subsequent 48-hour grace period, funds are automatically disbursed to the provider."
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "TRANSPARENT FEE STRUCTURE — ZERO HIDDEN CHARGES",
    category: "fees",
    content: [
      "Boulot Man believes in total pricing transparency with zero surprise fees:"
    ],
    listItems: [
      "Client Service Fee: Low, transparent transaction charge displayed upfront prior to payment",
      "Technician Service Fee: Nominal platform facilitation fee deducted upon successful milestone payout",
      "Enterprise & Concierge: Fixed project management rate agreed in written contract",
      "Zero registration fees and zero bidding fees for standard accounts"
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "WITHDRAWAL TIMELINES & INSTANT PAYOUTS",
    category: "methods",
    content: [
      "Once milestones are released, technicians and companies can withdraw earnings directly to Mobile Money or Bank Accounts:",
      "• Mobile Money (MTN, Orange, Airtel): Instant to 2 hours",
      "• Local Commercial Bank Accounts: Same day to 24 business hours"
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "DISPUTE FREEZE & ESCROW MEDIATION",
    category: "security",
    content: [
      "If a client or provider raises a formal dispute, escrowed funds for that milestone are instantly locked in the vault. Neither party can withdraw funds until the dispute resolution panel concludes neutral evidence examination."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "ANTI-FRAUD & CHARGEBACK PROTECTION",
    category: "security",
    content: [
      "All transactions undergo automated fraud risk scoring, tokenized card vaulting, and session integrity verification to prevent stolen card abuse and fraudulent chargebacks."
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "OFF-PLATFORM PAYMENT RISKS",
    category: "security",
    content: [
      "Transacting outside Boulot Man payment rails (such as direct unrecorded cash or private transfers) strictly forfeits escrow guarantees, milestone dispute mediation, and insurance coverage."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "TAXATION & STATUTORY COMPLIANCE",
    category: "governance",
    content: [
      "Users are responsible for declaring personal or corporate income taxes. Where required by regional tax authorities, Boulot Man complies with statutory withholding and value-added tax reporting."
    ]
  },
  {
    id: "sec-11",
    num: 11,
    title: "FINANCIAL SUPPORT CONTACT",
    category: "governance",
    content: [
      "For billing, invoice, escrow, or withdrawal assistance, contact our Payments Support desk:"
    ],
    callout: "Boulot Man Payments & Financial Operations\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-12",
    num: 12,
    title: "RELATED POLICIES",
    category: "governance",
    content: [
      "This Payments & Escrow Policy operates in conjunction with:"
    ],
    directory: [
      "Terms of Service",
      "Privacy Policy",
      "Trust & Safety",
      "Refunds & Cancellations Policy",
      "Dispute Resolution Policy",
      "Company Terms",
      "Technician & Professional Terms"
    ]
  }
];

export default function PaymentsEscrowPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");

  const filteredSections = PAYMENT_SECTIONS.filter((s) => {
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
              <span className={styles.heroBadge}>🔒 Escrow &amp; Payment Safeguards</span>
              <span className={styles.heroDate}>Effective Date: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Payments &amp; Escrow Policy</h1>
            <p className={styles.heroSubtitle}>
              Protected milestone funding, instant mobile money payouts, and zero hidden charges across
              Africa's most trusted engineering and technical services marketplace.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("vault");
                  handleScrollTo("sec-1");
                }}
              >
                🛡️ Escrow Vault (Sec 1)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("methods");
                  handleScrollTo("sec-2");
                }}
              >
                📱 Mobile Money &amp; Cards (Sec 2, 6)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("milestones");
                  handleScrollTo("sec-3");
                }}
              >
                ⚡ Milestones &amp; Release (Sec 3-4)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("fees");
                  handleScrollTo("sec-5");
                }}
              >
                💰 Zero Hidden Fees (Sec 5)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("security");
                  handleScrollTo("sec-7");
                }}
              >
                🔒 Security &amp; Disputes (Sec 7-9)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           MAIN LAYOUT: STICKY SIDEBAR + POLICY CONTENT
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
                placeholder="Search payment & escrow rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Escrow Guidelines</span>
              <span className={styles.sectionCount}>{filteredSections.length} Sections</span>
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

          {/* POLICY CONTENT */}
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

                  {sec.listItems && (
                    <ul className={styles.policyList} style={{ marginTop: "14px" }}>
                      {sec.listItems.map((item, lIdx) => (
                        <li key={lIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {sec.directory && (
                    <div className={styles.directoryGrid}>
                      {sec.directory.map((policy, pIdx) => (
                        <div key={pIdx} className={styles.directoryCard}>
                          <span>💳</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === "sec-11" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Payments &amp; Escrow Operations</h3>
                      <p>
                        For transaction confirmations, withdrawal tracking, or escrow queries:
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
                          <span>Financial Email</span>
                          <strong>
                            <a href="mailto:office@boulotman.com">office@boulotman.com</a>
                          </strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Platform</span>
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
                  Try a different search term like "mobile money", "milestone", "fees", or "vault".
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
