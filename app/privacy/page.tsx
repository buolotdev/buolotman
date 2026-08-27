"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./privacy.module.css";

const policies = [
  {
    id: "data-collection",
    number: "Policy 01",
    icon: "lucide:database",
    title: "Data We Collect",
    body:
      "We collect verified account information, professional background credentials, task & project specifications, direct message transcripts, escrow transaction records, and device metadata required to deliver reliable marketplace operations.",
  },
  {
    id: "data-usage",
    number: "Policy 02",
    icon: "lucide:cpu",
    title: "How We Use Information",
    body:
      "Your data powers our smart matchmaking engine, processes secure escrow payouts, conducts professional vetting, prevents unauthorized platform abuse, and continually refines the quality and speed of service delivery.",
  },
  {
    id: "data-sharing",
    number: "Policy 03",
    icon: "lucide:share-2",
    title: "Sharing & Disclosure",
    body:
      "We strictly never sell personal data. Information is shared only with counter-parties on active task contracts, payment processing partners, authorized compliance authorities, or trusted cloud infrastructure providers.",
  },
  {
    id: "security-retention",
    number: "Policy 04",
    icon: "lucide:shield-check",
    title: "Security & Retention",
    body:
      "All sensitive information is secured with bank-grade encryption at rest and in transit. We maintain access controls, regular security audits, and retain records in compliance with applicable regional data protection regulations.",
  },
  {
    id: "user-rights",
    number: "Policy 05",
    icon: "lucide:user-check",
    title: "Your Rights & Privacy Choices",
    body:
      "You hold full sovereignty over your account data. You can access, rectify, or export your profile records, configure communication settings, or request formal account closure at any time through your dashboard.",
  },
];

export default function PrivacyPage() {
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
              <iconify-icon icon="lucide:lock" /> Privacy &amp; Data Protection
            </div>
            <div className={styles.heroDate}>
              <iconify-icon icon="lucide:calendar" /> Last Updated: August 2026
            </div>
          </div>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            We are committed to protecting your personal data, project confidentiality, and transaction privacy with international security standards and transparent compliance.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* QUICK NAVIGATION PILLS */}
        <div className={styles.quickNav}>
          {policies.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => scrollToSection(p.id)}
              className={styles.quickPill}
            >
              <iconify-icon icon={p.icon} style={{ color: "#22c55e" }} />
              {p.title}
            </button>
          ))}
        </div>

        {/* SECTIONS LIST */}
        <div className={styles.sectionsList}>
          {policies.map((policy) => (
            <section key={policy.id} id={policy.id} className={styles.termCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrap}>
                  <iconify-icon icon={policy.icon}></iconify-icon>
                </div>
                <div>
                  <span className={styles.cardNumber}>{policy.number}</span>
                  <h2 className={styles.cardTitle}>{policy.title}</h2>
                </div>
              </div>
              <p className={styles.cardBody}>{policy.body}</p>
            </section>
          ))}
        </div>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Questions regarding your data privacy?</h2>
            <p className={styles.ctaDesc}>
              Contact our Data Protection and Security team to exercise your data rights or report any security concerns.
            </p>
          </div>
          <Link href="/help-center" className={styles.ctaBtn}>
            Contact Privacy Officer <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "18px" }}></iconify-icon>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
