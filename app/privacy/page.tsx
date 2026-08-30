"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./privacy.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Privacy & Data Protection",
    heroDate: "Last Updated: August 2026",
    heroTitle: "Privacy Policy",
    heroSubtitle: "We are committed to protecting your personal data, project confidentiality, and transaction privacy with international security standards and transparent compliance.",
    needAssistance: "Have Data Privacy or GDPR Questions?",
    needAssistanceDesc: "Our Data Protection Officer and security team are available to assist with data access requests, account privacy configurations, or security inquiries.",
    contactPrivacy: "Contact Privacy Officer",
    viewTerms: "View Terms of Service",
    policies: [
      {
        id: "data-collection",
        number: "Policy 01",
        icon: "lucide:database",
        title: "Data We Collect",
        body: "We collect verified account information, professional background credentials, task & project specifications, direct message transcripts, escrow transaction records, and device metadata required to deliver reliable marketplace operations."
      },
      {
        id: "data-usage",
        number: "Policy 02",
        icon: "lucide:cpu",
        title: "How We Use Information",
        body: "Your data powers our smart matchmaking engine, processes secure escrow payouts, conducts professional vetting, prevents unauthorized platform abuse, and continually refines the quality and speed of service delivery."
      },
      {
        id: "data-sharing",
        number: "Policy 03",
        icon: "lucide:share-2",
        title: "Sharing & Disclosure",
        body: "We strictly never sell personal data. Information is shared only with counter-parties on active task contracts, payment processing partners, authorized compliance authorities, or trusted cloud infrastructure providers."
      },
      {
        id: "security-retention",
        number: "Policy 04",
        icon: "lucide:shield-check",
        title: "Security & Retention",
        body: "All sensitive information is secured with bank-grade encryption at rest and in transit. We maintain access controls, regular security audits, and retain records in compliance with applicable regional data protection regulations."
      },
      {
        id: "user-rights",
        number: "Policy 05",
        icon: "lucide:user-check",
        title: "Your Rights & Privacy Choices",
        body: "You hold full sovereignty over your account data. You can access, rectify, or export your profile records, configure communication settings, or request formal account closure at any time through your dashboard."
      }
    ]
  },
  fr: {
    heroBadge: "Protection de la Vie Privée & Données",
    heroDate: "Dernière mise à jour : Août 2026",
    heroTitle: "Politique de Confidentialité",
    heroSubtitle: "Nous nous engageons à protéger vos données personnelles, la confidentialité de vos projets et vos transactions avec les plus hauts standards de sécurité.",
    needAssistance: "Des questions sur la confidentialité de vos données ?",
    needAssistanceDesc: "Notre délégué à la protection des données et notre équipe de sécurité sont disponibles pour répondre à vos demandes d'accès ou d'export de données.",
    contactPrivacy: "Contacter le Délégué aux données",
    viewTerms: "Conditions d'utilisation",
    policies: [
      {
        id: "data-collection",
        number: "Politique 01",
        icon: "lucide:database",
        title: "Données Collectées",
        body: "Nous collectons les informations de compte vérifiées, les justificatifs professionnels, les détails des missions, l'historique des messages et les transactions de paiement nécessaires au bon fonctionnement de la plateforme."
      },
      {
        id: "data-usage",
        number: "Politique 02",
        icon: "lucide:cpu",
        title: "Utilisation des Données",
        body: "Vos données permettent la mise en relation intelligente avec les prestataires, le traitement sécurisé des paiements, la vérification des profils et la prévention des fraudes."
      },
      {
        id: "data-sharing",
        number: "Politique 03",
        icon: "lucide:share-2",
        title: "Partage et Divulgation",
        body: "Nous ne vendons jamais vos données personnelles. Elles ne sont partagées qu'avec les parties prenantes aux missions, nos partenaires de paiement sécurisé et les autorités légales si requis."
      },
      {
        id: "security-retention",
        number: "Politique 04",
        icon: "lucide:shield-check",
        title: "Sécurité & Conservation",
        body: "Toutes les données sensibles sont chiffrées selon des protocoles bancaires en transit et au repos. Nous réalisons des audits réguliers conformément aux réglementations de protection des données."
      },
      {
        id: "user-rights",
        number: "Politique 05",
        icon: "lucide:user-check",
        title: "Vos Droits & Vos Choix",
        body: "Vous conservez le contrôle total de vos données. Vous pouvez consulter, rectifier ou exporter vos informations, ou demander la clôture de votre compte à tout moment depuis votre tableau de bord."
      }
    ]
  }
};

export default function PrivacyPage() {
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
              <iconify-icon icon="lucide:lock" /> {t.heroBadge}
            </div>
            <div className={styles.heroDate}>
              <iconify-icon icon="lucide:calendar" /> {t.heroDate}
            </div>
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* QUICK NAVIGATION PILLS */}
        <div className={styles.quickNav}>
          {t.policies.map((p: any) => (
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
          {t.policies.map((policy: any) => (
            <section key={policy.id} id={policy.id} className={styles.termCard}>
              <div className={styles.termHeader}>
                <div className={styles.termHeaderLeft}>
                  <div className={styles.termIconWrap}>
                    <iconify-icon icon={policy.icon} />
                  </div>
                  <div>
                    <span className={styles.termNumber}>{policy.number}</span>
                    <h2 className={styles.termTitle}>{policy.title}</h2>
                  </div>
                </div>
              </div>
              <div className={styles.termBody}>
                <p>{policy.body}</p>
              </div>
            </section>
          ))}
        </div>

        {/* BOTTOM HELP CTA */}
        <section className={styles.helpBanner}>
          <div className={styles.helpText}>
            <h3>{t.needAssistance}</h3>
            <p>
              {t.needAssistanceDesc}
            </p>
          </div>
          <div className={styles.helpActions}>
            <Link href="/contact" className={styles.helpPrimaryBtn}>
              <iconify-icon icon="lucide:message-square" /> {t.contactPrivacy}
            </Link>
            <Link href="/terms" className={styles.helpSecondaryBtn}>
              <iconify-icon icon="lucide:file-text" /> {t.viewTerms}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
