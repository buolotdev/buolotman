"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./subcontracting.module.css";

interface Opportunity {
  id: string;
  category: string;
  country: string;
  countryLabel: string;
  budget: "small" | "medium" | "large" | "enterprise";
  companyLogo: string;
  companyName: string;
  verified: boolean;
  status: "open" | "urgent";
  title: string;
  copy: string;
  location: string;
  value: string;
  duration: string;
  requirement: { label: string; value: string };
  tags: string[];
  deadline: string;
  searchKeywords: string;
}

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: "opp-1",
    category: "electrical",
    country: "cameroon",
    countryLabel: "Cameroon",
    budget: "large",
    companyLogo: "BC",
    companyName: "BuildCore Construction Ltd",
    verified: true,
    status: "open",
    title: "Electrical Installation Subcontract — Commercial Complex",
    copy: "Seeking an experienced electrical subcontractor for complete internal wiring, distribution boards, lighting circuits, earthing and final commissioning for a multi-unit commercial development in Douala.",
    location: "Douala, Cameroon",
    value: "32M – 45M FCFA",
    duration: "10–14 Weeks",
    requirement: { label: "Experience", value: "5+ Years" },
    tags: ["Electrical Wiring", "Distribution", "Commercial Construction", "Testing & Commissioning"],
    deadline: "September 12, 2026",
    searchKeywords: "electrical installation commercial building douala power distribution wiring"
  },
  {
    id: "opp-2",
    category: "construction",
    country: "rwanda",
    countryLabel: "Rwanda",
    budget: "medium",
    companyLogo: "UP",
    companyName: "Urban Projects Rwanda",
    verified: true,
    status: "urgent",
    title: "Interior Finishing & Tiling Package",
    copy: "Qualified finishing contractor required for floor tiling, wall finishes, minor masonry, ceiling corrections and final snagging for a hospitality renovation project in Kigali.",
    location: "Kigali, Rwanda",
    value: "18M – 24M RWF",
    duration: "6 Weeks",
    requirement: { label: "Team Size", value: "8–15 Workers" },
    tags: ["Tiling", "Masonry", "Finishing", "Renovation"],
    deadline: "September 7, 2026",
    searchKeywords: "tiling finishing renovation kigali construction masonry"
  },
  {
    id: "opp-3",
    category: "technology",
    country: "nigeria",
    countryLabel: "Nigeria",
    budget: "medium",
    companyLogo: "NS",
    companyName: "Nova Systems Africa",
    verified: true,
    status: "open",
    title: "Backend API & Mobile Integration Partner",
    copy: "Technology company requires a subcontract development team to complete API integration, mobile authentication, payment workflow integration, QA and production deployment.",
    location: "Lagos / Remote, Nigeria",
    value: "$12,000 – $18,000",
    duration: "8 Weeks",
    requirement: { label: "Engagement", value: "Hybrid / Remote" },
    tags: ["APIs", "Mobile Apps", "Backend", "QA & Testing"],
    deadline: "September 18, 2026",
    searchKeywords: "software api mobile application lagos technology backend"
  },
  {
    id: "opp-4",
    category: "solar",
    country: "ghana",
    countryLabel: "Ghana",
    budget: "large",
    companyLogo: "GE",
    companyName: "GreenEdge Energy Solutions",
    verified: true,
    status: "open",
    title: "Solar PV Installation Subcontract — Commercial Sites",
    copy: "Solar engineering company is building a pool of qualified installation partners for several commercial rooftop projects covering mounting, cabling, inverter installation, testing and handover.",
    location: "Accra, Ghana",
    value: "$28,000 – $45,000",
    duration: "Multi-site",
    requirement: { label: "Requirement", value: "Licensed Team" },
    tags: ["Solar PV", "Inverters", "Electrical", "Commercial Energy"],
    deadline: "September 25, 2026",
    searchKeywords: "solar renewable energy installation accra ghana pv"
  }
];

const PROCESS_STEPS = [
  {
    num: "1",
    title: "Opportunity Published",
    description: "A company or project team publishes a clearly defined subcontract scope, requirements, location, timeline and application deadline."
  },
  {
    num: "2",
    title: "Qualified Companies Apply",
    description: "Eligible companies submit capability information, quotations, execution plans and supporting documents."
  },
  {
    num: "3",
    title: "Evaluation & Award",
    description: "The project owner reviews relevant experience, verification, capacity, pricing and project approach before selecting a subcontractor."
  },
  {
    num: "4",
    title: "Execute & Build Reputation",
    description: "Work is completed against agreed milestones, records and deliverables, strengthening the provider's Boulot Man project history."
  }
];

const BENEFITS_LIST = [
  {
    num: "01",
    title: "Access Larger Projects",
    description: "Smaller and specialized companies can participate in major projects by competing for clearly defined work packages within their capabilities."
  },
  {
    num: "02",
    title: "Verified Business Visibility",
    description: "Your company profile, capability, verification status and previous work help project owners evaluate your suitability more efficiently."
  },
  {
    num: "03",
    title: "Structured Project Records",
    description: "Quotations, milestones, approvals and project history create a clearer professional record for future opportunities."
  },
  {
    num: "04",
    title: "Specialized Matching",
    description: "Opportunities can be matched by service category, technical specialization, location, experience and operational capacity."
  },
  {
    num: "05",
    title: "Secure Payments",
    description: "Eligible projects can use B-Pay, milestone funding and controlled release structures to support transparent payment workflows."
  },
  {
    num: "06",
    title: "Long-Term Partnerships",
    description: "Successful delivery can lead to repeat subcontracting, preferred-provider relationships and larger future engagements."
  }
];

export default function SubcontractingPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [budget, setBudget] = useState("");

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [applyForm, setApplyForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    experience: "",
    teamSize: "",
    proposal: "",
    quote: ""
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  const filteredOpportunities = OPPORTUNITIES_DATA.filter((opp) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      opp.title.toLowerCase().includes(q) ||
      opp.copy.toLowerCase().includes(q) ||
      opp.companyName.toLowerCase().includes(q) ||
      opp.searchKeywords.toLowerCase().includes(q);

    const matchesCategory = !category || opp.category === category;
    const matchesCountry = !country || opp.country === country;
    const matchesBudget = !budget || opp.budget === budget;

    return matchesSearch && matchesCategory && matchesCountry && matchesBudget;
  });

  const handleApplyClick = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setApplySubmitted(false);
    setApplyModalOpen(true);
  };

  const handleViewDetails = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setDetailsModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplyModalOpen(false);
      setApplyForm({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        experience: "",
        teamSize: "",
        proposal: "",
        quote: ""
      });
    }, 2000);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* =====================================================
           HERO
      ====================================================== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}>Boulot Man Subcontracting Network</div>
              <h1>Find Subcontracting Opportunities Across Africa</h1>
              <p className={styles.heroCopy}>
                Connect with verified companies, project owners and enterprise contractors looking for
                qualified subcontractors, specialized service providers and technical teams to execute
                defined portions of larger projects.
              </p>

              <div className={styles.heroActions}>
                <a href="#opportunities" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Browse Opportunities
                </a>
                <Link href="/signup?role=company" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Join as a Company
                </Link>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <h2>Built for capable companies and professional teams</h2>
              <ul className={styles.heroPoints}>
                <li>Access project packages from verified clients and contractors.</li>
                <li>Compete for specialized scopes without bidding for an entire project.</li>
                <li>Build your company reputation through completed Boulot Man projects.</li>
                <li>Use structured quotations, milestones and secure project payments.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           STATS STRIP
      ====================================================== */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <strong>180+</strong>
              <span>Active subcontract packages</span>
            </div>
            <div className={styles.statItem}>
              <strong>35+</strong>
              <span>Specialized service categories</span>
            </div>
            <div className={styles.statItem}>
              <strong>8</strong>
              <span>Priority African markets</span>
            </div>
            <div className={styles.statItem}>
              <strong>24/7</strong>
              <span>Digital opportunity access</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           OPPORTUNITIES SECTION
      ====================================================== */}
      <section className={styles.section} id="opportunities">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Marketplace</div>
              <h2 className={styles.title}>Current Subcontracting Opportunities</h2>
              <p className={styles.copy}>
                Browse project scopes posted by companies and project teams looking for capable subcontractors.
              </p>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className={styles.filterCard}>
            <div className={styles.filterGrid}>
              <div className={styles.field}>
                <label htmlFor="subSearch">Search opportunities</label>
                <input
                  type="search"
                  id="subSearch"
                  placeholder="e.g. electrical, plumbing, software..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="subCategory">Category</label>
                <select
                  id="subCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  <option value="construction">Construction</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="technology">Technology</option>
                  <option value="solar">Renewable Energy</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="subCountry">Country</label>
                <select
                  id="subCountry"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">All countries</option>
                  <option value="cameroon">Cameroon</option>
                  <option value="rwanda">Rwanda</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="south-africa">South Africa</option>
                  <option value="ivory-coast">Ivory Coast</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="subBudget">Project value</label>
                <select
                  id="subBudget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Any value</option>
                  <option value="small">Under $5,000</option>
                  <option value="medium">$5,000 – $25,000</option>
                  <option value="large">$25,000 – $100,000</option>
                  <option value="enterprise">$100,000+</option>
                </select>
              </div>

              <button
                type="button"
                className={styles.filterBtn}
                onClick={() => {}}
              >
                Search
              </button>
            </div>
          </div>

          <div className={styles.marketLayout}>
            {/* OPPORTUNITY LIST */}
            <div className={styles.opportunityList}>
              {filteredOpportunities.map((opp) => (
                <article key={opp.id} className={styles.opportunityCard}>
                  <div className={styles.opportunityInner}>
                    <div className={styles.opportunityTop}>
                      <div className={styles.opportunityCompany}>
                        <div className={styles.companyLogo}>{opp.companyLogo}</div>
                        <div className={styles.companyMeta}>
                          <h3>{opp.companyName}</h3>
                          {opp.verified && (
                            <div className={styles.verifiedBadge}>✓ Verified Company</div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`${styles.statusBadge} ${
                          opp.status === "urgent" ? styles.statusUrgent : styles.statusOpen
                        }`}
                      >
                        {opp.status === "urgent" ? "Urgent" : "Open"}
                      </span>
                    </div>

                    <h2 className={styles.projectTitle}>{opp.title}</h2>
                    <p className={styles.projectCopy}>{opp.copy}</p>

                    <div className={styles.metaGrid}>
                      <div className={styles.metaItem}>
                        <span>Location</span>
                        <strong>{opp.location}</strong>
                      </div>
                      <div className={styles.metaItem}>
                        <span>Package Value</span>
                        <strong>{opp.value}</strong>
                      </div>
                      <div className={styles.metaItem}>
                        <span>Duration</span>
                        <strong>{opp.duration}</strong>
                      </div>
                      <div className={styles.metaItem}>
                        <span>{opp.requirement.label}</span>
                        <strong>{opp.requirement.value}</strong>
                      </div>
                    </div>

                    <div className={styles.tags}>
                      {opp.tags.map((t, tIdx) => (
                        <span key={tIdx} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.opportunityFooter}>
                    <div className={styles.deadline}>
                      Applications close: <strong>{opp.deadline}</strong>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={`${styles.cardBtn} ${styles.cardBtnOutline}`}
                        onClick={() => handleViewDetails(opp)}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className={`${styles.cardBtn} ${styles.cardBtnPrimary}`}
                        onClick={() => handleApplyClick(opp)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {filteredOpportunities.length === 0 && (
                <div className={styles.sideCard} style={{ textAlign: "center", padding: "40px" }}>
                  <h3>No matching opportunities</h3>
                  <p>Try changing your search terms, country, category or project-value filters.</p>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <h3>Who can apply?</h3>
                <p>
                  Subcontracting opportunities are primarily designed for companies, registered service providers and capable professional teams.
                </p>
                <ul className={styles.sideList}>
                  <li>Verified company profile</li>
                  <li>Relevant technical capability</li>
                  <li>Demonstrated project experience</li>
                  <li>Required licences where applicable</li>
                  <li>Capacity to mobilize the required team</li>
                </ul>
                <Link href="/signup/verify" className={styles.sideLink}>
                  Learn about Company Verification →
                </Link>
              </div>

              <div className={styles.sideCard}>
                <h3>Need subcontractors?</h3>
                <p>
                  Companies executing larger contracts can publish defined scopes and invite qualified Boulot Man companies and teams to submit proposals.
                </p>
                <Link href="/post-task" className={styles.sideLink}>
                  Post a Subcontract Package →
                </Link>
              </div>

              <div className={styles.sideCard}>
                <h3>Secure project execution</h3>
                <p>
                  Eligible subcontract awards can use B-Pay, milestones and structured project records to improve accountability throughout execution.
                </p>
                <Link href="/payments-and-earnings" className={styles.sideLink}>
                  Explore Secure Payments →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           HOW IT WORKS
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>How it works</div>
              <h2 className={styles.title}>From Opportunity to Project Execution</h2>
              <p className={styles.copy}>
                A structured process helps companies find capable subcontractors while giving qualified providers a clearer path to participate in larger contracts.
              </p>
            </div>
          </div>

          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step, idx) => (
              <article key={idx} className={styles.processCard}>
                <div className={styles.processNumber}>{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           BENEFITS
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Why subcontract through Boulot Man</div>
              <h2 className={styles.title}>More Access. Better Visibility. Stronger Project Networks.</h2>
            </div>
          </div>

          <div className={styles.benefitGrid}>
            {BENEFITS_LIST.map((b, idx) => (
              <article key={idx} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{b.num}</div>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           CTA
      ====================================================== */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCopy}>
              <h2>Position Your Company for More Project Opportunities</h2>
              <p>
                Build a complete company profile, verify your business, demonstrate your project capacity and compete for subcontract packages across the Boulot Man network.
              </p>
            </div>
            <Link href="/signup?role=company" className={`${styles.btn} ${styles.btnPrimary}`}>
              Join as a Verified Company
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
           APPLICATION MODAL
      ====================================================== */}
      {applyModalOpen && selectedOpp && (
        <div className={styles.modalOverlay} onClick={() => setApplyModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h2>Apply for Subcontract Opportunity</h2>
                <p>{selectedOpp.title}</p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setApplyModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form className={styles.modalBody} onSubmit={handleApplySubmit}>
              {applySubmitted ? (
                <div style={{ padding: "20px", background: "#ecfdf5", borderRadius: "10px", color: "#065f46" }}>
                  <strong>✓ Application Submitted Successfully!</strong>
                  <p style={{ margin: "6px 0 0", fontSize: "13.5px" }}>
                    Your application for <strong>{selectedOpp.title}</strong> has been submitted to {selectedOpp.companyName} for review.
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="modalCompany">Company Name</label>
                      <input
                        type="text"
                        id="modalCompany"
                        required
                        value={applyForm.companyName}
                        onChange={(e) => setApplyForm({ ...applyForm, companyName: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modalContact">Contact Person</label>
                      <input
                        type="text"
                        id="modalContact"
                        required
                        value={applyForm.contactName}
                        onChange={(e) => setApplyForm({ ...applyForm, contactName: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modalEmail">Business Email</label>
                      <input
                        type="email"
                        id="modalEmail"
                        required
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modalPhone">Phone</label>
                      <input
                        type="tel"
                        id="modalPhone"
                        required
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modalExp">Relevant Experience</label>
                      <select
                        id="modalExp"
                        required
                        value={applyForm.experience}
                        onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                      >
                        <option value="">Select</option>
                        <option>1–3 Years</option>
                        <option>4–6 Years</option>
                        <option>7–10 Years</option>
                        <option>10+ Years</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="modalTeam">Available Team Size</label>
                      <input
                        type="number"
                        id="modalTeam"
                        min="1"
                        required
                        value={applyForm.teamSize}
                        onChange={(e) => setApplyForm({ ...applyForm, teamSize: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                      <label htmlFor="modalProposal">Capability Statement / Proposal Summary</label>
                      <textarea
                        id="modalProposal"
                        placeholder="Describe your relevant experience, capacity, approach and why your company is suitable for this subcontract package."
                        required
                        value={applyForm.proposal}
                        onChange={(e) => setApplyForm({ ...applyForm, proposal: e.target.value })}
                      ></textarea>
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                      <label htmlFor="modalQuote">Proposed Quotation</label>
                      <input
                        type="text"
                        id="modalQuote"
                        placeholder="e.g. 35,000,000 FCFA or $25,000"
                        required
                        value={applyForm.quote}
                        onChange={(e) => setApplyForm({ ...applyForm, quote: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.cardBtnOutline}`}
                      onClick={() => setApplyModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Submit Application
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
           DETAILS MODAL
      ====================================================== */}
      {detailsModalOpen && selectedOpp && (
        <div className={styles.modalOverlay} onClick={() => setDetailsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <div>
                <h2>{selectedOpp.title}</h2>
                <p>Posted by {selectedOpp.companyName} · {selectedOpp.location}</p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setDetailsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#334155", marginBottom: "20px" }}>
                {selectedOpp.copy}
              </p>

              <div className={styles.metaGrid} style={{ marginBottom: "24px" }}>
                <div className={styles.metaItem}>
                  <span>Package Budget</span>
                  <strong>{selectedOpp.value}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span>Duration</span>
                  <strong>{selectedOpp.duration}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span>{selectedOpp.requirement.label}</span>
                  <strong>{selectedOpp.requirement.value}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span>Application Deadline</span>
                  <strong>{selectedOpp.deadline}</strong>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.cardBtnOutline}`}
                  onClick={() => setDetailsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    setDetailsModalOpen(false);
                    setApplyModalOpen(true);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
