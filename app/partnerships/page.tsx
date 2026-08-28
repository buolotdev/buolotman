"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useToast } from "@/app/components/Toast";
import styles from "./partnerships.module.css";

const PARTNERSHIP_TRACKS = [
  {
    id: "enterprise",
    title: "Enterprise & Facility Management",
    icon: "lucide:building-2",
    iconClass: styles.trackIcon1,
    desc: "Deploy on-demand technical teams, scheduled facility maintenance, and nationwide field engineering with dedicated account managers and strict SLA guarantees.",
    features: [
      "Dedicated corporate SLA & 2-hour response guarantees",
      "Consolidated monthly billing & digital tax invoicing",
      "Custom ERP & ticketing system API integrations",
      "Vetted multi-trade technician teams across regions",
    ],
    defaultTrack: "Enterprise & Corporate Solutions",
  },
  {
    id: "government-ngo",
    title: "Government & NGO Youth Employment",
    icon: "lucide:landmark",
    iconClass: styles.trackIcon2,
    desc: "Partner with Boulot Man on workforce development, TVET graduate onboarding, digital identity verification, and scalable local job creation initiatives.",
    features: [
      "Digital workforce identity & credential authentication",
      "Transparent job placement tracking & impact analytics",
      "Direct mobile stipend / subsidy escrow disbursements",
      "Upskilling pipelines aligned with regional infrastructure demand",
    ],
    defaultTrack: "Government & NGO Program",
  },
  {
    id: "tvet-institutes",
    title: "Vocational & Technical Training Institutes",
    icon: "lucide:graduation-cap",
    iconClass: styles.trackIcon3,
    desc: "Connect your certified graduates and apprentices directly into high-paying commercial and residential contracts with built-in digital work portfolios.",
    features: [
      "Direct pathway from graduation to active client bookings",
      "Verified digital trade badge issuance on profiles",
      "Apprenticeship supervision & real-world rating system",
      "Curriculum alignment with real-time employer market trends",
    ],
    defaultTrack: "Vocational & Training Institute",
  },
  {
    id: "fintech-suppliers",
    title: "Fintech, Tool & Equipment Suppliers",
    icon: "lucide:wrench",
    iconClass: styles.trackIcon4,
    desc: "Provide equipment financing, discounted materials, micro-insurance, and seamless digital financial services to Africa's largest verified technician base.",
    features: [
      "Exclusive marketplace merchant placement to 50k+ tradespeople",
      "Equipment buy-now-pay-later (BNPL) credit scoring integration",
      "Seamless mobile escrow payout & micro-insurance rails",
      "Co-branded promotional campaigns across member dashboard",
    ],
    defaultTrack: "Fintech, Tools & Hardware Supplier",
  },
];

const FAQS = [
  {
    q: "How does an enterprise partnership with Boulot Man work?",
    a: "Enterprise partners receive a dedicated dashboard to dispatch service requests, monitor job SLAs in real-time, access centralized billing, and receive customized technical workforce allocations across all covered cities.",
  },
  {
    q: "Can NGOs and development agencies monitor impact and fund disbursement?",
    a: "Yes. Our platform provides comprehensive administrative dashboards with granular analytics on youth onboarding, verified skill accreditations, task completion volumes, and transparent escrow milestone payouts.",
  },
  {
    q: "What is required for TVET and trade institutes to partner with Boulot Man?",
    a: "Accredited institutions can integrate their certification rosters with our verification system, allowing graduating artisans to automatically obtain verified credentials and priority access to active client jobs.",
  },
  {
    q: "Which countries are currently supported for institutional partnerships?",
    a: "We currently support enterprise operations in Rwanda, Nigeria, Kenya, Ghana, South Africa, Ivory Coast, and Cameroon, with active cross-border expansion underway.",
  },
];

export default function PartnershipsPage() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("Enterprise & Corporate Solutions");
  const [submitting, setSubmitting] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "Rwanda",
    track: "Enterprise & Corporate Solutions",
    details: "",
  });

  const openInquiryModal = (trackName?: string) => {
    if (trackName) {
      setSelectedTrack(trackName);
      setForm((prev) => ({ ...prev, track: trackName }));
    }
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName.trim() || !form.email.trim() || !form.contactName.trim()) {
      toast.warning("Incomplete Form", "Please fill in your organization name, contact person, and email address.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      toast.success(
        "Proposal Received!",
        "Thank you for reaching out. Our strategic partnership team will review your submission and contact you within 24 business hours."
      );
      setForm({
        orgName: "",
        contactName: "",
        email: "",
        phone: "",
        country: "Rwanda",
        track: "Enterprise & Corporate Solutions",
        details: "",
      });
    }, 800);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* ================= HERO SECTION ================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:handshake" style={{ fontSize: "16px" }} /> Strategic Ecosystem Partnerships
          </div>
          <h1 className={styles.heroTitle}>Partner With Africa’s #1 On-Demand Workforce Network</h1>
          <p className={styles.heroSubtitle}>
            Collaborate with Boulot Man to empower certified technical professionals, scale enterprise service operations, drive youth employment, and unlock digital workforce growth across the continent.
          </p>

          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => openInquiryModal("Enterprise & Corporate Solutions")}
              className={styles.heroBtnPrimary}
            >
              <iconify-icon icon="lucide:send" style={{ fontSize: "18px" }} /> Submit Partnership Proposal
            </button>
            <a href="#partner-tracks" className={styles.heroBtnSecondary}>
              <iconify-icon icon="lucide:layers" style={{ fontSize: "18px" }} /> Explore Partnership Tracks
            </a>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* ================= STATS SECTION ================= */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>50,000+</h3>
              <p className={styles.statLabel}>Skilled Tradespeople &amp; Engineers</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>15+</h3>
              <p className={styles.statLabel}>Strategic Institutional Alliances</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>99.4%</h3>
              <p className={styles.statLabel}>Service Level Agreement (SLA) Compliance</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>7+</h3>
              <p className={styles.statLabel}>Active High-Growth African Markets</p>
            </div>
          </div>
        </section>

        {/* ================= STRATEGIC TRACKS ================= */}
        <section id="partner-tracks" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Collaboration Tracks</div>
            <h2 className={styles.sectionTitle}>Tailored Solutions For Every Institutional Partner</h2>
            <p className={styles.sectionDesc}>
              Whether you are an enterprise looking for dependable nationwide technical maintenance, a government body driving employment, or an institute training artisans, we have dedicated infrastructure for you.
            </p>
          </div>

          <div className={styles.tracksGrid}>
            {PARTNERSHIP_TRACKS.map((track) => (
              <div key={track.id} className={styles.trackCard}>
                <div>
                  <div className={`${styles.trackIconWrap} ${track.iconClass}`}>
                    <iconify-icon icon={track.icon} />
                  </div>
                  <h3 className={styles.trackTitle}>{track.title}</h3>
                  <p className={styles.trackDesc}>{track.desc}</p>
                  <ul className={styles.trackFeatures}>
                    {track.features.map((feat, idx) => (
                      <li key={idx} className={styles.trackFeatureItem}>
                        <iconify-icon icon="lucide:check-circle-2" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => openInquiryModal(track.defaultTrack)}
                  className={styles.trackBtn}
                >
                  Partner in this Track <iconify-icon icon="lucide:arrow-right" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHY PARTNER (BENEFITS) ================= */}
        <section className={styles.section} style={{ background: "#ffffff", borderRadius: "24px", padding: "48px 36px", border: "1px solid #e2e8f0" }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>The Boulot Man Advantage</div>
            <h2 className={styles.sectionTitle}>Why Leading Organizations Choose Boulot Man</h2>
            <p className={styles.sectionDesc}>
              Built from the ground up for the realities of African commerce: identity vetting, milestone escrow protection, and nationwide field execution.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:shield-check" />
              </div>
              <h3 className={styles.benefitTitle}>Multi-Tier Verified Network</h3>
              <p className={styles.benefitDesc}>
                National ID, passport, background checks, and trade license verification eliminate the uncertainty of hiring informal artisans.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.benefitTitle}>Milestone Escrow Architecture</h3>
              <p className={styles.benefitDesc}>
                Institutional funds are held securely with automated Mobile Money &amp; card payouts only when deliverables pass strict QA inspection.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:cpu" />
              </div>
              <h3 className={styles.benefitTitle}>API &amp; Enterprise Integration</h3>
              <p className={styles.benefitDesc}>
                Connect our workforce infrastructure directly with your company ERP, CRM, or ticketing system for automated dispatching.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:bar-chart-3" />
              </div>
              <h3 className={styles.benefitTitle}>Real-Time SLA &amp; Telemetry</h3>
              <p className={styles.benefitDesc}>
                Full visibility into task turnaround times, technician location tracking, customer satisfaction ratings, and cost savings.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:globe" />
              </div>
              <h3 className={styles.benefitTitle}>Pan-African Footprint</h3>
              <p className={styles.benefitDesc}>
                Standardized quality across East, West, and Central Africa with localized currency support and regulatory compliance.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:sparkles" />
              </div>
              <h3 className={styles.benefitTitle}>Co-Branded Impact &amp; PR</h3>
              <p className={styles.benefitDesc}>
                Joint press releases, CSR milestone features, and co-marketing campaigns highlighting tangible economic empowerment.
              </p>
            </div>
          </div>
        </section>

        {/* ================= INLINE PROPOSAL FORM ================= */}
        <section id="inquiry-form" className={styles.section}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader} style={{ marginBottom: "32px" }}>
              <div className={styles.sectionBadge}>Get In Touch</div>
              <h2 className={styles.sectionTitle}>Start A Strategic Conversation</h2>
              <p className={styles.sectionDesc}>
                Fill out the partnership overview below and our executive partnerships team will reach out with a tailored collaboration framework.
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Organization / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Telecom / Ministry of Youth"
                    className={styles.formInput}
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Contact Person &amp; Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe, Head of Operations"
                    className={styles.formInput}
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@organization.com"
                    className={styles.formInput}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+250 788 123 456"
                    className={styles.formInput}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Primary Country / Region</label>
                  <select
                    className={styles.formSelect}
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  >
                    <option value="Rwanda">Rwanda</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Ivory Coast">Ivory Coast</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Pan-African / Global">Pan-African / Global</option>
                  </select>
                </div>

                <div>
                  <label className={styles.formLabel}>Partnership Track</label>
                  <select
                    className={styles.formSelect}
                    value={form.track}
                    onChange={(e) => setForm({ ...form, track: e.target.value })}
                  >
                    <option value="Enterprise & Corporate Solutions">Enterprise &amp; Facility Management</option>
                    <option value="Government & NGO Program">Government &amp; NGO Youth Employment</option>
                    <option value="Vocational & Training Institute">Vocational &amp; Technical Training Institute</option>
                    <option value="Fintech, Tools & Hardware Supplier">Fintech, Tool &amp; Equipment Supplier</option>
                    <option value="Other">Other Strategic Initiative</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>Partnership Objectives &amp; Scope</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe your organization's goals and how you'd like to collaborate with Boulot Man..."
                    className={styles.formTextarea}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? (
                  <>Submitting Proposal...</>
                ) : (
                  <>
                    <iconify-icon icon="lucide:send" /> Submit Partnership Proposal
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>Frequently Asked Questions</div>
            <h2 className={styles.sectionTitle}>Everything You Need To Know</h2>
            <p className={styles.sectionDesc}>Answers to common questions regarding institutional onboarding, contracts, and integrations.</p>
          </div>

          <div className={styles.faqGrid}>
            {FAQS.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <div
                  className={styles.faqHeader}
                  onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <iconify-icon
                    icon={faqOpenIndex === idx ? "lucide:chevron-up" : "lucide:chevron-down"}
                    style={{ fontSize: "20px", color: "#001F3F" }}
                  />
                </div>
                {faqOpenIndex === idx && <div className={styles.faqContent}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className={styles.bottomCta}>
          <h2>Ready to Transform Africa's Skilled Workforce Together?</h2>
          <p>
            Join dozens of forward-thinking enterprises, agencies, and institutions leveraging Boulot Man's digital infrastructure.
          </p>
          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => openInquiryModal("Enterprise & Corporate Solutions")}
              className={styles.heroBtnPrimary}
            >
              <iconify-icon icon="lucide:mail" /> Contact Strategic Partnerships
            </button>
            <Link href="/about" className={styles.heroBtnSecondary}>
              <iconify-icon icon="lucide:info" /> Learn About Our Mission
            </Link>
          </div>
        </section>
      </main>

      {/* ================= MODAL INQUIRY FORM ================= */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#001F3F", margin: "0 0 6px 0" }}>
              Submit Partnership Proposal
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 20px 0" }}>
              Track: <strong style={{ color: "#ff4500" }}>{selectedTrack}</strong>
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div>
                  <label className={styles.formLabel}>Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    className={styles.formInput}
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name & Title"
                    className={styles.formInput}
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.com"
                    className={styles.formInput}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+250 ..."
                    className={styles.formInput}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Collaboration Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your proposal..."
                    className={styles.formTextarea}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? "Submitting..." : "Send Proposal"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
