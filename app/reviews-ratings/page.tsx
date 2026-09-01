"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./reviews.module.css";

interface ReviewSection {
  id: string;
  num: number;
  title: string;
  category: "principles" | "criteria" | "integrity" | "moderation" | "responses" | "impact" | "governance";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  callout?: string;
  directory?: string[];
}

const REVIEW_SECTIONS: ReviewSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "PURPOSE OF THE REPUTATION SYSTEM",
    category: "principles",
    content: [
      "The Boulot Man Reviews & Ratings system provides transparent, authentic feedback reflecting genuine interactions between Clients, Technicians, Engineers, and Companies.",
      "Our two-way reputation architecture empowers users to make informed hiring decisions, rewards top-quality craftsmanship, and ensures accountability across Africa's skilled workforce."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "TWO-WAY FEEDBACK MODEL",
    category: "principles",
    content: [
      "Trust operates symmetrically on Boulot Man:",
      "• Clients review Providers regarding workmanship quality, communication, punctuality, site cleanliness, and scope adherence.",
      "• Providers review Clients regarding communication clarity, site safety, timely milestone approval, and payment fairness."
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "VERIFIED ENGAGEMENT PREREQUISITE",
    category: "principles",
    content: [
      "Reviews can only be submitted following a verified task or contract conducted through the Platform. Unrelated third parties, anonymous visitors, or users who have not engaged in a transaction cannot leave ratings."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "EVALUATION CRITERIA & RATING DIMENSIONS",
    category: "criteria",
    content: [
      "When rating an engagement on a 1-to-5 star scale, users evaluate several core performance dimensions:"
    ],
    subsections: [
      {
        title: "4.1 Workmanship & Technical Quality (⭐⭐⭐⭐⭐)",
        items: [
          "Did the completed work satisfy the agreed technical specifications and engineering standards?",
          "Were appropriate materials, tools, and professional practices utilized?"
        ]
      },
      {
        title: "4.2 Communication & Responsiveness",
        items: [
          "Did the professional provide clear updates regarding progress, timeline, and material procurement?",
          "Were delays or site issues communicated proactively?"
        ]
      },
      {
        title: "4.3 Punctuality & Schedule Reliability",
        items: [
          "Did the technician arrive on time for scheduled appointments and milestone handovers?"
        ]
      },
      {
        title: "4.4 Professional Conduct & Site Respect",
        items: [
          "Was the work area kept safe and clean, and was client property treated with care?"
        ]
      }
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "REVIEW INTEGRITY & PROHIBITED CONDUCT",
    category: "integrity",
    content: [
      "To maintain uncompromising trust, Boulot Man strictly enforces zero-tolerance policies against rating manipulation:"
    ],
    listItems: [
      "Buying or selling reviews for cash, discounts, or future favors",
      "Fabricating fake tasks or self-hiring using secondary accounts to generate ratings",
      "Coercing, threatening, or conditioning work completion on receiving 5-star ratings",
      "Extorting providers by threatening negative reviews to obtain free additional work",
      "Posting defamatory, abusive, racially discriminatory, or profane language",
      "Publishing private personal data (phone numbers, IDs, home addresses) in review text"
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "REVIEW SUBMISSION TIMELINES",
    category: "moderation",
    content: [
      "Following milestone completion and final payment release, both parties have a 14-calendar-day window to submit feedback. Once both reviews are submitted (or the 14-day window closes), feedback is published simultaneously to ensure complete honesty without retaliatory bias."
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "PROVIDER RIGHT OF REPLY",
    category: "responses",
    content: [
      "Professionals and Companies have the right to post a professional public response to any client review on their profile card. Responses must remain respectful, factual, and devoid of personal attacks or private contact disclosure."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "REVIEW DISPUTE & REMOVAL PROTOCOL",
    category: "moderation",
    content: [
      "Boulot Man does not remove reviews simply because they are critical. However, a review will be removed or edited by Trust & Safety upon investigation if it:",
      "• Violates Community Guidelines (hate speech, vulgarity, threats)",
      "• Contains private identity documents or unauthorized phone numbers",
      "• Relates to an unrelated third-party dispute or force majeure event",
      "• Is proven to be an act of malicious extortion or review manipulation",
      "• Confirmed to involve fraudulent task collusion"
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "REPUTATION IMPACT ON PLATFORM PLACEMENT",
    category: "impact",
    content: [
      "Aggregated review scores directly influence search ranking algorithms, verified badge eligibility, invitation to high-value Boulot Man Contractors tenders, and concierge client matching. Consistently high ratings earn 'Top Rated Pro' badges."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "CONTACT & REPORTING REVIEWS",
    category: "governance",
    content: [
      "If you suspect fraudulent, coerced, or abusive reviews, submit a report directly to the Trust & Safety review audit unit:"
    ],
    callout: "Boulot Man Reputation & Trust Division\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-11",
    num: 11,
    title: "RELATED POLICIES",
    category: "governance",
    content: [
      "This Reviews & Ratings Policy operates alongside the complete legal governance suite:"
    ],
    directory: [
      "Terms of Service",
      "Privacy Policy",
      "Trust & Safety",
      "Payments & Escrow Policy",
      "Refunds & Cancellations Policy",
      "Dispute Resolution Policy",
      "Marketplace Rules",
      "Verification Policy"
    ]
  }
];

export default function ReviewsRatingsPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [showModal, setShowModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    reviewUrl: "",
    violationType: "Fake / Fabricated Review",
    explanation: ""
  });

  const filteredSections = REVIEW_SECTIONS.filter((s) => {
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

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitted(true);
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
              <span className={styles.heroBadge}>⭐ Reputation &amp; Feedback Standards</span>
              <span className={styles.heroDate}>Effective Date: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Reviews &amp; Ratings Policy</h1>
            <p className={styles.heroSubtitle}>
              Our authentic two-way reputation architecture ensures transparent, genuine, and verified
              reviews while strictly protecting against fake ratings, extortion, and manipulation.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("principles");
                  handleScrollTo("sec-1");
                }}
              >
                🤝 2-Way Reputation (Sec 1-3)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("criteria");
                  handleScrollTo("sec-4");
                }}
              >
                ⭐ Rating Dimensions (Sec 4)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("integrity");
                  handleScrollTo("sec-5");
                }}
              >
                🚫 Anti-Manipulation Rules (Sec 5)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("moderation");
                  handleScrollTo("sec-6");
                }}
              >
                ⚖️ Moderation &amp; Removal (Sec 6-8)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("responses");
                  handleScrollTo("sec-7");
                }}
              >
                💬 Right of Reply (Sec 7)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("impact");
                  handleScrollTo("sec-9");
                }}
              >
                🚀 Search &amp; Badges (Sec 9)
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
                placeholder="Search reputation rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Reputation Standards</span>
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

            <button
              type="button"
              className={styles.reportBtn}
              onClick={() => {
                setShowModal(true);
                setModalSubmitted(false);
              }}
            >
              🚨 Report Fake Review
            </button>
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
                          <span>⭐</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === "sec-10" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Reputation Audit &amp; Trust Team</h3>
                      <p>
                        To dispute an abusive review or report rating coercion, reach out to our dedicated integrity panel:
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
                          <span>Trust Email</span>
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
                  Try a different search term like "extortion", "dimensions", "reply", or "removal".
                </p>
                <button
                  type="button"
                  className={styles.reportBtn}
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

      {/* =====================================================
           REPORT REVIEW MODAL
      ====================================================== */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Report Review Violation</h2>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {modalSubmitted ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>⭐</div>
                <h3 style={{ color: "#001f3f", margin: "0 0 8px" }}>Review Flagged for Audit</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
                  Your report has been received by the Trust &amp; Safety Reputation Integrity team. We will
                  examine task logs, messages, and evidence to take corrective moderation action.
                </p>
                <button
                  type="button"
                  className={styles.formSubmitBtn}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: 0, marginBottom: "18px" }}>
                  Report reviews involving extortion, hate speech, false non-engagement, or rating manipulation.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="repName">Your Name</label>
                    <input
                      type="text"
                      id="repName"
                      required
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="repEmail">Your Email</label>
                    <input
                      type="email"
                      id="repEmail"
                      required
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="repLink">Profile / Task / Review URL</label>
                    <input
                      type="text"
                      id="repLink"
                      required
                      placeholder="e.g. boulotman.com/profile/josephelectric or Task #TSK-102"
                      value={reportForm.reviewUrl}
                      onChange={(e) => setReportForm({ ...reportForm, reviewUrl: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="repType">Violation Category</label>
                    <select
                      id="repType"
                      value={reportForm.violationType}
                      onChange={(e) => setReportForm({ ...reportForm, violationType: e.target.value })}
                    >
                      <option>Fake / Fabricated Review</option>
                      <option>Review Extortion / Threatening for Free Work</option>
                      <option>Hate Speech / Defamation / Vulgarity</option>
                      <option>Contains Private Contact or Identity Data</option>
                      <option>Conflict of Interest / Competitor Manipulation</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="repExplanation">Detailed Evidence &amp; Context</label>
                    <textarea
                      id="repExplanation"
                      rows={4}
                      required
                      placeholder="Please provide specifics of the engagement, chat timestamps, or screenshots demonstrating the violation."
                      value={reportForm.explanation}
                      onChange={(e) => setReportForm({ ...reportForm, explanation: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className={styles.formSubmitBtn}>
                  Submit Report for Moderation
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
