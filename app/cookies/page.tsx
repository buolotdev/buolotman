"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./cookies.module.css";

interface CookieSection {
  id: string;
  num: number;
  title: string;
  category: "overview" | "categories" | "table" | "preferences" | "browsers" | "governance";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  hasTable?: boolean;
  hasPreferences?: boolean;
  callout?: string;
  directory?: string[];
}

const COOKIE_SECTIONS: CookieSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "WHAT ARE COOKIES & TRACKING TECHNOLOGIES",
    category: "overview",
    content: [
      "Cookies are small text files placed on your computer, smartphone, or tablet when you visit Boulot Man websites, web dashboards, or applications.",
      "Alongside cookies, Boulot Man may use local storage, session storage, and secure cryptographic tokens to authenticate users, remember preferences, safeguard transactions, and analyze marketplace performance."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "WHY BOULOT MAN USES COOKIES",
    category: "overview",
    content: [
      "Cookies are fundamental to providing a safe, reliable, and tailored technical services marketplace across Africa. We use cookies to:",
      "• Maintain authenticated user sessions without requiring repeated logins",
      "• Secure forms against Cross-Site Request Forgery (CSRF) and automated bot attacks",
      "• Remember country selection (e.g. Rwanda, Cameroon, Nigeria) and currency preferences",
      "• Support real-time messaging, task bids, and escrow disbursement alerts",
      "• Measure site traffic, page load performance, and platform feature adoption"
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "CATEGORIES OF COOKIES WE USE",
    category: "categories",
    content: [
      "Boulot Man classifies cookies into four distinct functional categories:"
    ],
    subsections: [
      {
        title: "3.1 Strictly Necessary / Essential Cookies (Always Active)",
        items: [
          "Required for core site operation, login security, CSRF protection, and escrow transaction state.",
          "These cannot be disabled without breaking marketplace functionality."
        ]
      },
      {
        title: "3.2 Functional & Preference Cookies",
        items: [
          "Store your UI language (English/Français), selected currency (RWF, XAF, NGN, KES), and dashboard preferences."
        ]
      },
      {
        title: "3.3 Performance & Analytics Cookies",
        items: [
          "Collect aggregated, anonymous telemetry to measure response times, detect server errors, and optimize search algorithms."
        ]
      },
      {
        title: "3.4 Marketing & Referral Attribution Cookies",
        items: [
          "Track referral links and authorized partnership campaigns to attribute new technician registrations."
        ]
      }
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "TECHNICAL COOKIE AUDIT TABLE",
    category: "table",
    content: [
      "Below is a detailed inventory of the primary cookies and local storage tokens utilized across the Boulot Man platform:"
    ],
    hasTable: true
  },
  {
    id: "sec-5",
    num: 5,
    title: "MANAGE YOUR COOKIE PREFERENCES",
    category: "preferences",
    content: [
      "You have direct control over optional functional, analytics, and marketing cookies. You can toggle your preferences below at any time:"
    ],
    hasPreferences: true
  },
  {
    id: "sec-6",
    num: 6,
    title: "HOW TO CONTROL COOKIES VIA BROWSER SETTINGS",
    category: "browsers",
    content: [
      "In addition to our on-site preferences, most modern web browsers allow you to block or delete cookies through browser settings:",
      "• Google Chrome: Settings → Privacy and Security → Third-party cookies",
      "• Apple Safari: Preferences → Privacy → Block all cookies",
      "• Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data",
      "• Microsoft Edge: Settings → Cookies and Site Permissions",
      "Please note that disabling strictly necessary cookies will prevent login and task escrow funding."
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "THIRD-PARTY SERVICE PROVIDERS",
    category: "governance",
    content: [
      "Certain integrated features (such as payment gateways, mapping services, and infrastructure analytics) may deploy their own cookies subject to their independent privacy terms. All third-party providers are vetted for strict data-protection compliance."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "DO NOT TRACK (DNT) SIGNALS",
    category: "governance",
    content: [
      "Boulot Man honors recognized Global Privacy Control (GPC) signals and respects browser Do Not Track preferences for optional telemetry."
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "CONTACT DATA PROTECTION OFFICER",
    category: "governance",
    content: [
      "For inquiries regarding our use of cookies and tracking technologies, contact our Privacy Compliance team:"
    ],
    callout: "Boulot Man Privacy & Cookie Compliance\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-10",
    num: 10,
    title: "RELATED POLICIES",
    category: "governance",
    content: [
      "This Cookie Policy operates in harmony with the broader Boulot Man legal framework:"
    ],
    directory: [
      "Privacy Policy",
      "Terms of Service",
      "Trust & Safety",
      "Payments & Escrow Policy",
      "Refunds & Cancellations Policy",
      "Community Guidelines"
    ]
  }
];

export default function CookiesPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");

  // Cookie Preference States
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bm_cookie_preferences");
      if (saved) {
        setCookiePrefs(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem("bm_cookie_preferences", JSON.stringify(cookiePrefs));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {}
  };

  const filteredSections = COOKIE_SECTIONS.filter((s) => {
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
              <span className={styles.heroBadge}>🍪 Cookies &amp; Tracking Transparency</span>
              <span className={styles.heroDate}>Effective Date: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Cookie Policy</h1>
            <p className={styles.heroSubtitle}>
              Learn how Boulot Man uses cookies and local storage to keep your session secure, remember
              your regional preferences, and deliver a smooth technical service experience.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("overview");
                  handleScrollTo("sec-1");
                }}
              >
                🔍 Overview (Sec 1-2)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("categories");
                  handleScrollTo("sec-3");
                }}
              >
                📑 Categories (Sec 3)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("table");
                  handleScrollTo("sec-4");
                }}
              >
                📊 Cookie Audit Table (Sec 4)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("preferences");
                  handleScrollTo("sec-5");
                }}
              >
                ⚙️ Manage Preferences (Sec 5)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("browsers");
                  handleScrollTo("sec-6");
                }}
              >
                🌐 Browser Controls (Sec 6)
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
                placeholder="Search cookie policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Cookie Policy</span>
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
              className={styles.cookiePrefBtn}
              onClick={() => handleScrollTo("sec-5")}
            >
              ⚙️ Manage Cookie Preferences
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

                  {/* COOKIE AUDIT TABLE */}
                  {sec.hasTable && (
                    <div className={styles.tableResponsive}>
                      <table className={styles.cookieTable}>
                        <thead>
                          <tr>
                            <th>Cookie Name</th>
                            <th>Category</th>
                            <th>Purpose</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><code>bm_session</code></td>
                            <td>Essential</td>
                            <td>Maintains encrypted user authentication session</td>
                            <td>Session / 30 Days</td>
                          </tr>
                          <tr>
                            <td><code>bm_csrf_token</code></td>
                            <td>Essential</td>
                            <td>Protects against Cross-Site Request Forgery</td>
                            <td>Session</td>
                          </tr>
                          <tr>
                            <td><code>bm_lang</code></td>
                            <td>Functional</td>
                            <td>Remembers preferred UI language (EN / FR)</td>
                            <td>1 Year</td>
                          </tr>
                          <tr>
                            <td><code>bm_currency</code></td>
                            <td>Functional</td>
                            <td>Stores selected currency (RWF, XAF, NGN, KES)</td>
                            <td>1 Year</td>
                          </tr>
                          <tr>
                            <td><code>bm_location_pref</code></td>
                            <td>Functional</td>
                            <td>Stores preferred search city &amp; radius</td>
                            <td>6 Months</td>
                          </tr>
                          <tr>
                            <td><code>_ga_bm_analytics</code></td>
                            <td>Analytics</td>
                            <td>Measures anonymous page load performance</td>
                            <td>2 Years</td>
                          </tr>
                          <tr>
                            <td><code>bm_referral_id</code></td>
                            <td>Marketing</td>
                            <td>Attributes authorized partner referral signups</td>
                            <td>30 Days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* INTERACTIVE PREFERENCES MANAGER */}
                  {sec.hasPreferences && (
                    <div className={styles.prefBox}>
                      <div className={styles.prefItem}>
                        <div className={styles.prefInfo}>
                          <h4>Strictly Necessary Cookies</h4>
                          <p>Essential for login security, task payments, and CSRF protection. Cannot be disabled.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input type="checkbox" checked={cookiePrefs.essential} disabled />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <div className={styles.prefItem}>
                        <div className={styles.prefInfo}>
                          <h4>Functional &amp; Regional Preferences</h4>
                          <p>Remembers your preferred language, currency, and dashboard layout.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={cookiePrefs.functional}
                            onChange={(e) => setCookiePrefs({ ...cookiePrefs, functional: e.target.checked })}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <div className={styles.prefItem}>
                        <div className={styles.prefInfo}>
                          <h4>Performance &amp; Analytics Cookies</h4>
                          <p>Helps us understand platform usage, error rates, and optimize search algorithms.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={cookiePrefs.analytics}
                            onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <div className={styles.prefItem}>
                        <div className={styles.prefInfo}>
                          <h4>Marketing &amp; Partnership Attribution</h4>
                          <p>Used to measure campaign effectiveness and referral bonus attribution.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={cookiePrefs.marketing}
                            onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </div>

                      <button
                        type="button"
                        className={styles.savePrefBtn}
                        onClick={handleSavePreferences}
                      >
                        {savedSuccess ? "✓ Preferences Saved!" : "Save Cookie Preferences"}
                      </button>
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

                  {sec.id === "sec-9" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Privacy &amp; Data Protection Officer</h3>
                      <p>
                        For technical inquiries regarding tracking technologies or cookie disclosures:
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
                          <span>Privacy Email</span>
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
                  Try a different search term like "essential", "analytics", "preferences", or "table".
                </p>
                <button
                  type="button"
                  className={styles.cookiePrefBtn}
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
