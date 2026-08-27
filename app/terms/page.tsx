"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./terms.module.css";

const sections = [
  {
    id: "use-of-platform",
    number: "Section 01",
    icon: "lucide:layout-grid",
    title: "Use of the Platform",
    body:
      "Boulot Man connects clients, certified technicians, engineering specialists, and registered companies for lawful, enterprise-grade service contracts. Users must provide verified and accurate information, honor communication protocols, and only use the platform for legitimate project requests, tenders, and authorized bids.",
  },
  {
    id: "accounts-security",
    number: "Section 02",
    icon: "lucide:shield-check",
    title: "Accounts & Identity Verification",
    body:
      "Users are solely responsible for maintaining the confidentiality of their credentials and session security. Professional technicians and companies undergo rigorous administrative verification and document vetting. We maintain the right to suspend or terminate accounts for fraudulent credentials, misrepresentation, abuse, or policy violations.",
  },
  {
    id: "payments-escrow",
    number: "Section 03",
    icon: "lucide:lock",
    title: "Payments & Escrow Protection",
    body:
      "All client project funds are held securely in the Boulot Man Escrow vault until work milestones are verified and formally approved by the client. Instant payouts, withdrawal processing timelines, and fee structures are governed by standard transparent terms with zero hidden fees.",
  },
  {
    id: "disputes-mediation",
    number: "Section 04",
    icon: "lucide:scale",
    title: "Disputes & Neutral Mediation",
    body:
      "If a project disagreement or delivery conflict arises, either party may initiate formal dispute resolution from their dashboard. Boulot Man's specialized mediation panel will examine time-stamped task logs, messages, milestone deliverables, and media evidence to issue a binding, fair determination.",
  },
  {
    id: "liability-compliance",
    number: "Section 05",
    icon: "lucide:alert-circle",
    title: "Liability & Platform Governance",
    body:
      "Boulot Man delivers a secure infrastructure, escrow protection, and specialized matchmaking tools. While professionals are independently verified for skills and credentials, statutory liability is governed by the applicable service agreement and caps established under regional commercial legal frameworks.",
  },
];

export default function TermsPage() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <div className={styles.heroBadge}>
              <iconify-icon icon="lucide:file-text" /> Official Legal Terms
            </div>
            <div className={styles.heroDate}>
              <iconify-icon icon="lucide:calendar" /> Last Updated: August 2026
            </div>
          </div>
          <h1 className={styles.heroTitle}>Terms of Service</h1>
          <p className={styles.heroSubtitle}>
            Please review the platform agreement and governance policies that ensure a secure, transparent, and trusted marketplace for clients, technicians, and enterprises across Africa.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* QUICK NAVIGATION PILLS */}
        <div className={styles.quickNav}>
          {sections.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={styles.quickPill}
            >
              <iconify-icon icon={s.icon} style={{ color: "#FF4500" }} />
              {s.title}
            </button>
          ))}
        </div>

        {/* SECTIONS LIST */}
        <div className={styles.sectionsList}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.termCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrap}>
                  <iconify-icon icon={section.icon}></iconify-icon>
                </div>
                <div>
                  <span className={styles.cardNumber}>{section.number}</span>
                  <h2 className={styles.cardTitle}>{section.title}</h2>
                </div>
              </div>
              <p className={styles.cardBody}>{section.body}</p>
            </section>
          ))}
        </div>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Have questions about our terms?</h2>
            <p className={styles.ctaDesc}>
              Our compliance and legal support specialists are available to clarify contracts, privacy, and dispute policies.
            </p>
          </div>
          <Link href="/help-center" className={styles.ctaBtn}>
            Contact Legal Support <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "18px" }}></iconify-icon>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
