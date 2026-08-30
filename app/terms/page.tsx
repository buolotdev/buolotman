"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./terms.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Official Legal Terms",
    heroDate: "Last Updated: August 2026",
    heroTitle: "Terms of Service",
    heroSubtitle: "Please review the platform agreement and governance policies that ensure a secure, transparent, and trusted marketplace for clients, technicians, and enterprises across Africa.",
    needAssistance: "Need Legal or Compliance Assistance?",
    needAssistanceDesc: "Our legal and platform compliance teams are available to address specific questions regarding contractor contracts, escrow protocols, or enterprise vendor agreements.",
    contactSupport: "Contact Support Team",
    viewPrivacy: "View Privacy Policy",
    sections: [
      {
        id: "use-of-platform",
        number: "Section 01",
        icon: "lucide:layout-grid",
        title: "Use of the Platform",
        body: "Boulot Man connects clients, certified technicians, engineering specialists, and registered companies for lawful, enterprise-grade service contracts. Users must provide verified and accurate information, honor communication protocols, and only use the platform for legitimate project requests, tenders, and authorized bids."
      },
      {
        id: "accounts-security",
        number: "Section 02",
        icon: "lucide:shield-check",
        title: "Accounts & Identity Verification",
        body: "Users are solely responsible for maintaining the confidentiality of their credentials and session security. Professional technicians and companies undergo rigorous administrative verification and document vetting. We maintain the right to suspend or terminate accounts for fraudulent credentials, misrepresentation, abuse, or policy violations."
      },
      {
        id: "payments-escrow",
        number: "Section 03",
        icon: "lucide:lock",
        title: "Payments & Escrow Protection",
        body: "All client project funds are held securely in the Boulot Man Escrow vault until work milestones are verified and formally approved by the client. Instant payouts, withdrawal processing timelines, and fee structures are governed by standard transparent terms with zero hidden fees."
      },
      {
        id: "disputes-mediation",
        number: "Section 04",
        icon: "lucide:scale",
        title: "Disputes & Neutral Mediation",
        body: "If a project disagreement or delivery conflict arises, either party may initiate formal dispute resolution from their dashboard. Boulot Man's specialized mediation panel will examine time-stamped task logs, messages, milestone deliverables, and media evidence to issue a binding, fair determination."
      },
      {
        id: "liability-compliance",
        number: "Section 05",
        icon: "lucide:alert-circle",
        title: "Liability & Platform Governance",
        body: "Boulot Man delivers a secure infrastructure, escrow protection, and specialized matchmaking tools. While professionals are independently verified for skills and credentials, statutory liability is governed by the applicable service agreement and caps established under regional commercial legal frameworks."
      }
    ]
  },
  fr: {
    heroBadge: "Conditions Juridiques Officielles",
    heroDate: "Dernière mise à jour : Août 2026",
    heroTitle: "Conditions Générales d'Utilisation",
    heroSubtitle: "Veuillez consulter les conditions d'utilisation qui garantissent une plateforme sécurisée, transparente et de confiance pour les clients, techniciens et entreprises à travers l'Afrique.",
    needAssistance: "Besoin d'une assistance juridique ou de conformité ?",
    needAssistanceDesc: "Nos équipes juridiques et de conformité sont à votre disposition pour répondre à vos questions concernant les contrats de prestation, le séquestre ou les accords d'entreprise.",
    contactSupport: "Contacter le support",
    viewPrivacy: "Politique de confidentialité",
    sections: [
      {
        id: "use-of-platform",
        number: "Section 01",
        icon: "lucide:layout-grid",
        title: "Utilisation de la Plateforme",
        body: "Boulot Man met en relation des clients, des techniciens certifiés et des entreprises enregistrées pour des prestations de services conformes et professionnelles. Les utilisateurs s'engagent à fournir des informations exactes et à utiliser la plateforme pour des demandes et des offres légitimes."
      },
      {
        id: "accounts-security",
        number: "Section 02",
        icon: "lucide:shield-check",
        title: "Comptes & Vérification d'Identité",
        body: "Les utilisateurs sont seuls responsables de la confidentialité de leurs identifiants. Les professionnels et les entreprises font l'objet d'une vérification administrative rigoureuse. Nous nous réservons le droit de suspendre tout compte en cas de fraude ou de fausse déclaration."
      },
      {
        id: "payments-escrow",
        number: "Section 03",
        icon: "lucide:lock",
        title: "Paiements & Garantie Séquestre",
        body: "Tous les fonds des projets clients sont conservés en toute sécurité sous séquestre jusqu'à validation finale des étapes par le client. Les versements, délais de retrait et frais sont transparents et sans coûts cachés."
      },
      {
        id: "disputes-mediation",
        number: "Section 04",
        icon: "lucide:scale",
        title: "Litiges & Médiation Neutre",
        body: "En cas de désaccord sur une prestation, chaque partie peut ouvrir une procédure de litige depuis son tableau de bord. Notre commission de médiation examine les échanges et preuves pour rendre une décision équitable et contraignante."
      },
      {
        id: "liability-compliance",
        number: "Section 05",
        icon: "lucide:alert-circle",
        title: "Responsabilité & Gouvernance",
        body: "Boulot Man fournit une infrastructure sécurisée et un système de mise en relation de confiance. Bien que les compétences soient vérifiées, la responsabilité légale découle des contrats de prestation conclus selon les lois régionales applicables."
      }
    ]
  }
};

export default function TermsPage() {
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
              <iconify-icon icon="lucide:file-text" /> {t.heroBadge}
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
          {t.sections.map((s: any) => (
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
          {t.sections.map((section: any) => (
            <section key={section.id} id={section.id} className={styles.termCard}>
              <div className={styles.termHeader}>
                <div className={styles.termHeaderLeft}>
                  <div className={styles.termIconWrap}>
                    <iconify-icon icon={section.icon} />
                  </div>
                  <div>
                    <span className={styles.termNumber}>{section.number}</span>
                    <h2 className={styles.termTitle}>{section.title}</h2>
                  </div>
                </div>
              </div>
              <div className={styles.termBody}>
                <p>{section.body}</p>
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
              <iconify-icon icon="lucide:message-square" /> {t.contactSupport}
            </Link>
            <Link href="/privacy" className={styles.helpSecondaryBtn}>
              <iconify-icon icon="lucide:shield" /> {t.viewPrivacy}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
