"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./about.module.css";

export default function AboutUsPage() {
  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:globe" /> Africa's Premier Workforce Infrastructure
          </div>
          <h1 className={styles.heroTitle}>Empowering Africa’s Skilled Workforce</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man is building the digital operating system for physical labor, technical trades, and engineering services across Africa — anchored in identity verification, secure escrow, and quality standards.
          </p>

          <div className={styles.heroActionGroup}>
            <Link href="/post-task" className={styles.heroBtnPrimary}>
              Post a Service Task <iconify-icon icon="lucide:arrow-right" />
            </Link>
            <Link href="/service-providers/technicians" className={styles.heroBtnSecondary}>
              Browse Specialists <iconify-icon icon="lucide:search" />
            </Link>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* STATS SECTION */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>10,000+</h3>
              <p className={styles.statLabel}>Verified Professionals</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>$5M+</h3>
              <p className={styles.statLabel}>Escrow Protected Payouts</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>99.2%</h3>
              <p className={styles.statLabel}>Successful Job Completion</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>5+</h3>
              <p className={styles.statLabel}>Active African Markets</p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Core Pillars</h2>
            <p className={styles.sectionDesc}>
              We are tackling the fundamental trust and efficiency bottlenecks that historically held back the African artisan and technical contracting markets.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:shield-check" />
              </div>
              <h3 className={styles.cardTitle}>Identity &amp; Skill Vetting</h3>
              <p className={styles.cardDesc}>
                Every specialist undergoes multi-tier ID verification, skill credential review, and track-record validation before bidding on high-value client tasks.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.cardTitle}>Guaranteed Escrow Protection</h3>
              <p className={styles.cardDesc}>
                Clients never pay upfront with uncertainty, and technicians never work without guaranteed funds. Capital is secured until verified milestone delivery.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:trending-up" />
              </div>
              <h3 className={styles.cardTitle}>Pan-African Economic Growth</h3>
              <p className={styles.cardDesc}>
                We empower independent contractors and technical SMEs to build formal digital reputations, access enterprise tenders, and scale beyond informal local markets.
              </p>
            </div>
          </div>
        </section>

        {/* BEFORE VS AFTER TRANSFORMATION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Boulot Man Difference</h2>
            <p className={styles.sectionDesc}>
              How our platform transforms informal, high-risk work engagements into structured, enterprise-grade contracting.
            </p>
          </div>

          <div className={styles.compareGrid}>
            <div className={styles.compareCardBefore}>
              <div className={styles.compareBadgeBefore}>
                <iconify-icon icon="lucide:alert-triangle" /> Traditional Informal Market
              </div>
              <ul className={styles.compareList}>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Unverified technicians without criminal or competency checks.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Cash advance risks with no refund guarantees for abandoned jobs.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Zero formal contracts, warranty coverage, or dispute mediation.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Technicians struggle with delayed client payments and lost income.</span>
                </li>
              </ul>
            </div>

            <div className={styles.compareCardAfter}>
              <div className={styles.compareBadgeAfter}>
                <iconify-icon icon="lucide:check-circle-2" /> The Boulot Man Standard
              </div>
              <ul className={styles.compareList}>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>100% Admin-verified profiles with badge transparency & reviews.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Automated Escrow hold: funds released only upon client milestone sign-off.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Formal dispute resolution panel with evidence-based adjudication.</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>Instant Mobile Money &amp; Bank Wallet payouts for specialists upon delivery.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Ready to Experience Verified Service Excellence?</h2>
            <p className={styles.ctaDesc}>
              Whether you need skilled technicians for immediate repair or want to join as a verified service provider, get started today.
            </p>
          </div>
          <Link href="/post-task" className={styles.ctaBtn}>
            Get Started Now <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "18px" }}></iconify-icon>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
