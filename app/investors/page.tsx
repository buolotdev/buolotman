"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./investors.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Strategic Investment & Scale",
    heroTitle: "Backing the Digital Infrastructure of African Labor",
    heroSubtitle: "Boulot Man captures the $200B+ transition of informal African skilled trades and engineering into transparent, high-retention digital contracting powered by escrow and mobile money rails.",
    btnRequestBrief: "Request Investor Brief & Deck",
    btnConsultation: "Institutional Consultation",
    stat1Number: "$200B+",
    stat1Label: "Pan-African TAM",
    stat2Number: "100%",
    stat2Label: "Escrow Retained GMV",
    stat3Number: "3.8x",
    stat3Label: "YoY Transaction Volume",
    stat4Number: "5+",
    stat4Label: "Target Launch Markets",
    thesisTitle: "Investment Thesis & Unit Economics",
    thesisDesc: "Why Boulot Man represents a generational opportunity to capture high-margin enterprise contracting and high-frequency consumer maintenance across Africa.",
    pillar1Title: "Full-Stack Market Monetization",
    pillar1Desc: "Diversified revenue streams spanning take-rate platform commissions on escrow payouts, subscription tiers for companies & pros, and enterprise contractor management fees.",
    pillar2Title: "Defensible Network Effects",
    pillar2Desc: "As more vetted specialists accumulate verified reviews and project credentials, switching costs soar and Boulot Man becomes the definitive trust credential across Africa.",
    pillar3Title: "Localized Payment Infrastructure",
    pillar3Desc: "Native integration with M-Pesa, MTN Mobile Money, Orange Money, CamPay, and direct cross-border clearing houses enables instant liquidity and high collection rates.",
    moatsTitle: "Strategic Platform Moats",
    moatsDesc: "Proprietary capabilities that protect our long-term market leadership and create high barriers to entry.",
    moat1Title: "Proprietary Identity & Skills Vetting",
    moat1Desc: "Multi-layer verification protocols linking national IDs, professional certifications, and criminal background checks with our administrative review engine.",
    moat2Title: "Enterprise & NGO Governance Suite",
    moat2Desc: "Built-in contractor pooling, multi-seat project management, and automated invoicing designed for multinational corporations, real estate developers, and international agencies.",
    ctaTitle: "Connect with Our Executive Leadership",
    ctaDesc: "Request our data room, audited operational metrics, and institutional deck for upcoming financing rounds.",
    ctaBtn: "Request Investor Relations Packet",
    modalTitle: "Investor Relations Inquiry",
    modalSubtitle: "Please provide your institution details to receive our deck and financial models.",
    modalSuccess: "🎉 Thank you. Our Executive Team will contact your office and send the investor deck directly.",
    labelFullName: "Full Name",
    phFullName: "Alex Morgan",
    labelFirm: "Firm / Organization",
    phFirm: "Horizon Capital / Family Office",
    labelEmail: "Institutional Email",
    phEmail: "alex@horizoncap.com",
    labelCategory: "Investor Category",
    optVC: "Venture Capital / Private Equity",
    optFamily: "Family Office",
    optStrategic: "Strategic / Corporate Partner",
    optDFI: "Development Finance Institution (DFI)",
    optAngel: "Angel / Syndicate",
    labelNotes: "Specific Inquiries / Target Cheque Size",
    phNotes: "Share any specific notes or timeline for engagement...",
    btnSubmitModal: "Request Deck & Consultation"
  },
  fr: {
    heroBadge: "Investissement Stratégique & Croissance",
    heroTitle: "L'Infrastructure Numérique du Travail Qualifié en Afrique",
    heroSubtitle: "Boulot Man digitalise le marché de plus de 200 milliards de dollars des métiers techniques et du BTP en Afrique grâce au séquestre sécurisé et aux passerelles Mobile Money.",
    btnRequestBrief: "Demander le Dossier Investisseur",
    btnConsultation: "Entretien Institutionnel",
    stat1Number: "+200 Mrd $",
    stat1Label: "Marché Total Panafricain",
    stat2Number: "100%",
    stat2Label: "Volume d'Affaires Sécurisé",
    stat3Number: "x3.8",
    stat3Label: "Croissance Annuelle des Volumes",
    stat4Number: "5+",
    stat4Label: "Marchés Cibles Déployés",
    thesisTitle: "Thèse d'Investissement & Modèle Économique",
    thesisDesc: "Pourquoi Boulot Man constitue une opportunité majeure pour capter les contrats d'entreprise à forte marge et la maintenance grand public en Afrique.",
    pillar1Title: "Monétisation Globale de la Plateforme",
    pillar1Desc: "Flux de revenus diversifiés : commissions sur les transactions sous séquestre, abonnements premium pour entreprises & artisans et gestion de flotte d'artisans.",
    pillar2Title: "Effets de Réseau Pérennes",
    pillar2Desc: "Plus le nombre de spécialistes certifiés augmente, plus la valeur du réseau grandit, faisant de Boulot Man la référence incontournable de la confiance en Afrique.",
    pillar3Title: "Paiements Locaux Intégrés",
    pillar3Desc: "Interconnexion native avec M-Pesa, MTN Mobile Money, Orange Money, CamPay et virements bancaires assurant une liquidité instantanée.",
    moatsTitle: "Avantages Concurrentiels Stratégiques",
    moatsDesc: "Innovations propriétaires qui renforcent notre leadership et constituent de fortes barrières à l'entrée.",
    moat1Title: "Vérification d'Identité & Compétences Propriétaire",
    moat1Desc: "Protocoles multi-niveaux associant pièces d'identité nationales, certifications professionnelles et contrôle d'antécédents via notre moteur administratif.",
    moat2Title: "Portail Dédié Entreprises & ONG",
    moat2Desc: "Gestion centralisée des sous-traitants, comptes multi-utilisateurs et facturation automatique pour promoteurs immobiliers et institutions internationales.",
    ctaTitle: "Échanger avec la Direction Générale",
    ctaDesc: "Accédez à notre data room, nos métriques d'exploitation auditées et notre deck institutionnel pour les prochains tours de financement.",
    ctaBtn: "Recevoir le Pack Investisseur",
    modalTitle: "Demande Relations Investisseurs",
    modalSubtitle: "Veuillez renseigner vos coordonnées institutionnelles pour recevoir notre deck et modèle financier.",
    modalSuccess: "🎉 Merci. Notre équipe de direction prendra contact avec votre bureau et vous transmettra le deck.",
    labelFullName: "Nom complet",
    phFullName: "Alex Morgan",
    labelFirm: "Fonds / Institution",
    phFirm: "Horizon Capital / Family Office",
    labelEmail: "Adresse e-mail institutionnelle",
    phEmail: "alex@horizoncap.com",
    labelCategory: "Catégorie d'Investisseur",
    optVC: "Capital-Risque / Private Equity",
    optFamily: "Family Office",
    optStrategic: "Partenaire Stratégique / Corporate",
    optDFI: "Institution de Financement du Développement (DFI)",
    optAngel: "Business Angel / Syndicat",
    labelNotes: "Demandes spécifiques / Montant envisagé",
    phNotes: "Précisez vos attentes ou votre calendrier d'investissement...",
    btnSubmitModal: "Demander le Dossier & Entretien"
  }
};

export default function InvestorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", organization: "", email: "", type: "Venture Capital / PE", notes: "" });
  const [submitted, setSubmitted] = useState(false);
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
            <iconify-icon icon="lucide:trending-up" /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>

          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={styles.heroBtnPrimary}
            >
              {t.btnRequestBrief} <iconify-icon icon="lucide:arrow-right" />
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={styles.heroBtnSecondary}
            >
              {t.btnConsultation} <iconify-icon icon="lucide:calendar" />
            </button>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* STATS HIGHLIGHT */}
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

        {/* THESIS PILLARS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.thesisTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.thesisDesc}
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:layers" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar1Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar1Desc}
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:zap" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar2Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar2Desc}
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIconWrap}>
                <iconify-icon icon="lucide:smartphone" />
              </div>
              <h3 className={styles.cardTitle}>{t.pillar3Title}</h3>
              <p className={styles.cardDesc}>
                {t.pillar3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* STRUCTURAL MOATS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.moatsTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.moatsDesc}
            </p>
          </div>

          <div className={styles.moatGrid}>
            <div className={styles.moatCard}>
              <div className={styles.moatHeader}>
                <iconify-icon icon="lucide:fingerprint" className={styles.moatIcon} />
                <h3 className={styles.moatTitle}>{t.moat1Title}</h3>
              </div>
              <p className={styles.moatDesc}>
                {t.moat1Desc}
              </p>
            </div>

            <div className={styles.moatCard}>
              <div className={styles.moatHeader}>
                <iconify-icon icon="lucide:building-2" className={styles.moatIcon} />
                <h3 className={styles.moatTitle}>{t.moat2Title}</h3>
              </div>
              <p className={styles.moatDesc}>
                {t.moat2Desc}
              </p>
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
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={styles.ctaBtn}
          >
            {t.ctaBtn} <iconify-icon icon="lucide:arrow-right" />
          </button>
        </section>
      </main>

      <Footer />

      {/* INVESTOR INQUIRY MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <h2>{t.modalTitle}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              {t.modalSubtitle}
            </p>

            {submitted ? (
              <div className={styles.successMsg}>
                {t.modalSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>{t.labelFullName}</label>
                  <input
                    required
                    type="text"
                    placeholder={t.phFullName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelFirm}</label>
                  <input
                    required
                    type="text"
                    placeholder={t.phFirm}
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelEmail}</label>
                  <input
                    required
                    type="email"
                    placeholder={t.phEmail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelCategory}</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Venture Capital / PE">{t.optVC}</option>
                    <option value="Family Office">{t.optFamily}</option>
                    <option value="Strategic / Corporate Partner">{t.optStrategic}</option>
                    <option value="Development Finance / DFI">{t.optDFI}</option>
                    <option value="Angel / Syndicate">{t.optAngel}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelNotes}</label>
                  <textarea
                    rows={3}
                    placeholder={t.phNotes}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {t.btnSubmitModal} <iconify-icon icon="lucide:send" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
