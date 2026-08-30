"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./about.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Africa's Premier Workforce Infrastructure",
    heroTitle: "Empowering Africa’s Skilled Workforce",
    heroSubtitle: "Boulot Man is building the digital operating system for physical labor, technical trades, and engineering services across Africa — anchored in identity verification, secure escrow, and quality standards.",
    btnPostTask: "Post a Service Task",
    btnBrowseSpecialists: "Browse Specialists",
    stat1Number: "10,000+",
    stat1Label: "Verified Professionals",
    stat2Number: "$5M+",
    stat2Label: "Escrow Protected Payouts",
    stat3Number: "99.2%",
    stat3Label: "Successful Job Completion",
    stat4Number: "5+",
    stat4Label: "Active African Markets",
    pillarsTitle: "Our Core Pillars",
    pillarsDesc: "We are tackling the fundamental trust and efficiency bottlenecks that historically held back the African artisan and technical contracting markets.",
    pillar1Title: "Identity & Skill Vetting",
    pillar1Desc: "Every specialist undergoes multi-tier ID verification, skill credential review, and track-record validation before bidding on high-value client tasks.",
    pillar2Title: "Guaranteed Escrow Protection",
    pillar2Desc: "Clients never pay upfront with uncertainty, and technicians never work without guaranteed funds. Capital is secured until verified milestone delivery.",
    pillar3Title: "Pan-African Economic Growth",
    pillar3Desc: "We empower independent contractors and technical SMEs to build formal digital reputations, access enterprise tenders, and scale beyond informal local markets.",
    diffTitle: "The Boulot Man Difference",
    diffDesc: "How our platform transforms informal, high-risk work engagements into structured, enterprise-grade contracting.",
    tradMarketBadge: "Traditional Informal Market",
    trad1: "Unverified technicians without criminal or competency checks.",
    trad2: "Cash advance risks with no refund guarantees for abandoned jobs.",
    trad3: "Zero formal contracts, warranty coverage, or dispute mediation.",
    trad4: "Technicians struggle with delayed client payments and lost income.",
    standardBadge: "The Boulot Man Standard",
    std1: "100% Admin-verified profiles with badge transparency & reviews.",
    std2: "Automated Escrow hold: funds released only upon client milestone sign-off.",
    std3: "Formal dispute resolution panel with evidence-based adjudication.",
    std4: "Instant Mobile Money & Bank Wallet payouts for specialists upon delivery.",
    ctaTitle: "Ready to Experience Verified Service Excellence?",
    ctaDesc: "Whether you need skilled technicians for immediate repair or want to join as a verified service provider, get started today.",
    ctaBtn: "Get Started Now"
  },
  fr: {
    heroBadge: "Première Infrastructure de Main-d'œuvre en Afrique",
    heroTitle: "Valoriser la Main-d'œuvre Qualifiée Africaine",
    heroSubtitle: "Boulot Man conçoit le système d'exploitation digital pour les métiers techniques, l'artisanat et l'ingénierie en Afrique — fondé sur la vérification des compétences, le séquestre sécurisé et l'excellence.",
    btnPostTask: "Publier une mission",
    btnBrowseSpecialists: "Découvrir les spécialistes",
    stat1Number: "10 000+",
    stat1Label: "Professionnels Vérifiés",
    stat2Number: "+ de 5M $",
    stat2Label: "Fonds Sécurisés sous Séquestre",
    stat3Number: "99.2%",
    stat3Label: "Taux de Réussite des Projets",
    stat4Number: "5+",
    stat4Label: "Marchés Africains Actifs",
    pillarsTitle: "Nos Piliers Fondamentaux",
    pillarsDesc: "Nous résolvons les défis majeurs de confiance et d'efficacité qui freinaient jusqu'ici le secteur des prestations techniques en Afrique.",
    pillar1Title: "Vérification d'Identité & Compétences",
    pillar1Desc: "Chaque professionnel passe par une vérification d'identité approfondie et un contrôle des qualifications avant de pouvoir postuler.",
    pillar2Title: "Garantie Séquestre Intégrale",
    pillar2Desc: "Les clients ne payent plus dans l'incertitude et les prestataires ont l'assurance d'être rémunérés dès la validation des travaux.",
    pillar3Title: "Croissance Économique Panafricaine",
    pillar3Desc: "Nous permettons aux artisans et PME techniques de bâtir une réputation numérique solide, d'accéder aux marchés d'entreprise et d'évoluer durablement.",
    diffTitle: "La Différence Boulot Man",
    diffDesc: "Comment notre plateforme transforme le travail informel en contrats fiables, transparents et professionnels.",
    tradMarketBadge: "Marché Informel Traditionnel",
    trad1: "Artisans non vérifiés sans garanties de compétences ni antécédents.",
    trad2: "Avances d'argent risquées sans possibilité de remboursement en cas d'abandon.",
    trad3: "Aucun contrat officiel, aucune garantie ni médiation en cas de litige.",
    trad4: "Paiements retardés ou impayés pour les prestataires sérieux.",
    standardBadge: "Le Standard Boulot Man",
    std1: "Profils 100% vérifiés avec badges de certification et avis clients authentiques.",
    std2: "Séquestre automatique : fonds débloqués uniquement après validation des étapes.",
    std3: "Commission de médiation dédiée avec arbitrage impartial sur pièces.",
    std4: "Paiements instantanés Mobile Money et virement bancaire dès livraison.",
    ctaTitle: "Prêt à Découvrir l'Excellence de Nos Services ?",
    ctaDesc: "Que vous recherchiez un expert pour une intervention urgente ou que vous souhaitiez proposer vos services vérifiés, rejoignez-nous.",
    ctaBtn: "Commencer Maintenant"
  }
};

export default function AboutUsPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:globe" /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>

          <div className={styles.heroActionGroup}>
            <Link href="/post-task" className={styles.heroBtnPrimary}>
              {t.btnPostTask} <iconify-icon icon="lucide:arrow-right" />
            </Link>
            <Link href="/service-providers/technicians" className={styles.heroBtnSecondary}>
              {t.btnBrowseSpecialists} <iconify-icon icon="lucide:search" />
            </Link>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* STATS SECTION */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{t.stat1Number}</h3>
              <p className={styles.statLabel}>{t.stat1Label}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{t.stat2Number}</h3>
              <p className={styles.statLabel}>{t.stat2Label}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{t.stat3Number}</h3>
              <p className={styles.statLabel}>{t.stat3Label}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statNumber}>{t.stat4Number}</h3>
              <p className={styles.statLabel}>{t.stat4Label}</p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.pillarsTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.pillarsDesc}
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:shield-check" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar1Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar1Desc}
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar2Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar2Desc}
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:trending-up" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar3Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* BEFORE VS AFTER TRANSFORMATION */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.diffTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.diffDesc}
            </p>
          </div>

          <div className={styles.compareGrid}>
            <div className={styles.compareCardBefore}>
              <div className={styles.compareBadgeBefore}>
                <iconify-icon icon="lucide:alert-triangle" /> {t.tradMarketBadge}
              </div>
              <ul className={styles.compareList}>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.trad1}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.trad2}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.trad3}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:x-circle" style={{ color: "#e11d48", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.trad4}</span>
                </li>
              </ul>
            </div>

            <div className={styles.compareCardAfter}>
              <div className={styles.compareBadgeAfter}>
                <iconify-icon icon="lucide:check-circle-2" /> {t.standardBadge}
              </div>
              <ul className={styles.compareList}>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.std1}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.std2}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.std3}</span>
                </li>
                <li>
                  <iconify-icon icon="lucide:check-circle" style={{ color: "#16a34a", fontSize: "18px", flexShrink: 0, marginTop: "2px" }} />
                  <span>{t.std4}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
            <p className={styles.ctaDesc}>
              {t.ctaDesc}
            </p>
          </div>
          <Link href="/post-task" className={styles.ctaBtn}>
            {t.ctaBtn} <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "18px" }}></iconify-icon>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

