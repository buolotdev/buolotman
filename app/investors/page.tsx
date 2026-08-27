"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./investors.module.css";

export default function InvestorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", organization: "", email: "", type: "Venture Capital / PE", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setFormData({ name: "", organization: "", email: "", type: "Venture Capital / PE", notes: "" });
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:trending-up" /> Strategic Investment &amp; Scale
          </div>
          <h1 className={styles.heroTitle}>Backing the Digital Infrastructure of African Labor</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man captures the $200B+ transition of informal African skilled trades and engineering into transparent, high-retention digital contracting powered by escrow and mobile money rails.
          </p>

          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={styles.heroBtnPrimary}
            >
              Request Investor Brief &amp; Deck <iconify-icon icon="lucide:arrow-right" />
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={styles.heroBtnSecondary}
            >
              Institutional Consultation <iconify-icon icon="lucide:calendar" />
            </button>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* STATS HIGHLIGHT */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>$200B+</h3>
              <p className={styles.statLabel}>Pan-African TAM</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>100%</h3>
              <p className={styles.statLabel}>Escrow Retained GMV</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>3.8x</h3>
              <p className={styles.statLabel}>YoY Transaction Volume</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>5+</h3>
              <p className={styles.statLabel}>Target Launch Markets</p>
            </div>
          </div>
        </section>

        {/* THESIS PILLARS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Investment Thesis &amp; Unit Economics</h2>
            <p className={styles.sectionDesc}>
              Why Boulot Man represents a generational opportunity to capture high-margin enterprise contracting and high-frequency consumer maintenance across Africa.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:layers" />
              </div>
              <h3 className={styles.cardTitle}>Full-Stack Market Monetization</h3>
              <p className={styles.cardDesc}>
                Diversified revenue streams spanning take-rate platform commissions on escrow payouts, subscription tiers for companies &amp; pros, and enterprise contractor management fees.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:zap" />
              </div>
              <h3 className={styles.cardTitle}>Defensible Network Effects</h3>
              <p className={styles.cardDesc}>
                As more vetted specialists accumulate verified reviews and project credentials, switching costs soar and Boulot Man becomes the definitive trust credential across Africa.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:smartphone" />
              </div>
              <h3 className={styles.cardTitle}>Localized Payment Infrastructure</h3>
              <p className={styles.cardDesc}>
                Native integration with M-Pesa, MTN Mobile Money, Orange Money, CamPay, and direct cross-border clearing houses enables instant liquidity and high collection rates.
              </p>
            </div>
          </div>
        </section>

        {/* STRUCTURAL MOATS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Strategic Platform Moats</h2>
            <p className={styles.sectionDesc}>
              Proprietary capabilities that protect our long-term market leadership and create high barriers to entry.
            </p>
          </div>

          <div className={styles.moatGrid}>
            <div className={styles.moatCard}>
              <div className={styles.moatHeader}>
                <iconify-icon icon="lucide:fingerprint" className={styles.moatIcon} />
                <h3 className={styles.moatTitle}>Proprietary Identity &amp; Skills Vetting</h3>
              </div>
              <p className={styles.moatDesc}>
                Multi-layer verification protocols linking national IDs, professional certifications, and criminal background checks with our administrative review engine.
              </p>
            </div>

            <div className={styles.moatCard}>
              <div className={styles.moatHeader}>
                <iconify-icon icon="lucide:building-2" className={styles.moatIcon} />
                <h3 className={styles.moatTitle}>Enterprise &amp; NGO Governance Suite</h3>
              </div>
              <p className={styles.moatDesc}>
                Built-in contractor pooling, multi-seat project management, and automated invoicing designed for multinational corporations, real estate developers, and international agencies.
              </p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Connect with Our Executive Leadership</h2>
            <p className={styles.ctaDesc}>
              Request our data room, audited operational metrics, and institutional deck for upcoming financing rounds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={styles.ctaBtn}
          >
            Request Investor Relations Packet <iconify-icon icon="lucide:arrow-right" />
          </button>
        </section>
      </main>

      <Footer />

      {/* INVESTOR INQUIRY MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <h2>Investor Relations Inquiry</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              Please provide your institution details to receive our deck and financial models.
            </p>

            {submitted ? (
              <div className={styles.successMsg}>
                🎉 Thank you. Our Executive Team will contact your office and send the investor deck directly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Firm / Organization</label>
                  <input
                    required
                    type="text"
                    placeholder="Horizon Capital / Family Office"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Institutional Email</label>
                  <input
                    required
                    type="email"
                    placeholder="alex@horizoncap.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Investor Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Venture Capital / PE">Venture Capital / Private Equity</option>
                    <option value="Family Office">Family Office</option>
                    <option value="Strategic / Corporate Partner">Strategic / Corporate Partner</option>
                    <option value="Development Finance / DFI">Development Finance Institution (DFI)</option>
                    <option value="Angel / Syndicate">Angel / Syndicate</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Specific Inquiries / Target Cheque Size</label>
                  <textarea
                    rows={3}
                    placeholder="Share any specific notes or timeline for engagement..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Request Deck &amp; Consultation <iconify-icon icon="lucide:send" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
