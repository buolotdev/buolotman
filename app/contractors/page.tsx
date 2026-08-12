"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./contractors.module.css";
import { api } from "@/app/lib/api";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Contractors & Enterprise Solutions",
    heroSubtitle: "Boulot Man Contractors is the enterprise-grade execution arm of the Boulot Man platform. We deliver medium to large-scale technical, engineering, and construction projects through verified professionals, structured teams, and strict project governance.",
    overviewTitle: "What Is Boulot Man Contractors?",
    overviewDesc: "Boulot Man Contractors provides end-to-end project execution for organizations that require reliability, compliance, and accountability. This service is designed for enterprises, governments, NGOs, developers, and institutions that cannot rely on informal labor or unmanaged teams.",
    whoWeServe: "Who We Serve",
    whoWeServeList: [
      "Large contractors & engineering firms",
      "Infrastructure & construction companies",
      "Government agencies & public institutions",
      "NGOs & international organizations",
      "Hotels, factories & warehouses",
      "Diaspora-led development projects"
    ],
    whatWeDeliver: "What We Deliver",
    whatWeDeliverList: [
      "Full project execution",
      "Certified technical workforce",
      "Engineering supervision",
      "Compliance & documentation",
      "Quality assurance"
    ],
    whyChoose: "Why Enterprises Choose Us",
    whyChooseList: [
      "Verified professionals only",
      "Structured governance",
      "Escrow & milestone payments",
      "Clear accountability",
      "Cross-border readiness"
    ],
    servicesTitle: "Contracting Services",
    servicesList: [
      {
        title: "Construction & Civil Works",
        items: [
          "Residential & commercial construction",
          "Renovation & remodeling",
          "Finishing & interior works",
          "Structural & masonry works"
        ]
      },
      {
        title: "Electrical, Mechanical & Energy",
        items: [
          "Industrial & residential wiring",
          "HVAC & mechanical installations",
          "Solar & hybrid power systems",
          "Generators & backup power"
        ]
      },
      {
        title: "ICT & Security Infrastructure",
        items: [
          "CCTV & access control",
          "Enterprise networking",
          "Server rooms & data cabling",
          "Smart building integration"
        ]
      }
    ],
    howItWorks: "How Enterprise Engagement Works",
    howItWorksSteps: [
      "Enterprise consultation & needs assessment",
      "Technical evaluation & site assessment",
      "Project plan, budget & timeline",
      "Deployment of verified teams",
      "Supervision, reporting & compliance",
      "Completion, handover & warranty"
    ],
    accessTitle: "Enterprise Access Model",
    tableHeaderTier: "Tier",
    tableHeaderAccess: "Access Type",
    tableHeaderBest: "Best For",
    tableRowProAccess: "Subscription",
    tableRowProBest: "Mid-size companies & contractors",
    tableRowEntAccess: "Approval Only",
    tableRowEntBest: "Large organizations & governments",
    ctaTitle: "Request Enterprise Access",
    ctaDesc: "Enterprise access is by request only. Speak directly with Boulot Man management to discuss workforce needs, compliance requirements, and project scope.",
    ctaBtn: "Chat with Management",
    modalTitle: "Enterprise Consultation",
    modalName: "Full Name",
    modalNamePlaceholder: "Your name",
    modalCompany: "Company / Organization",
    modalCompanyPlaceholder: "Company Name",
    modalEmail: "Email",
    modalEmailPlaceholder: "your@email.com",
    modalPhone: "Phone Number",
    modalPhonePlaceholder: "+123...",
    modalDetails: "Project Details",
    modalDetailsPlaceholder: "Describe your project needs...",
    modalSubmitBtn: "Send Request",
    modalSubmittingBtn: "Submitting...",
    modalSuccess: "Your request has been received. Our Enterprise team will contact you shortly!",
  },
  fr: {
    heroTitle: "Entrepreneurs et Solutions d'Entreprise",
    heroSubtitle: "Boulot Man Contractors est la branche d'exécution de niveau entreprise de la plateforme Boulot Man. Nous réalisons des projets techniques, d'ingénierie et de construction de moyenne à grande échelle par l'intermédiaire de professionnels vérifiés, d'équipes structurées et d'une gouvernance de projet stricte.",
    overviewTitle: "Qu'est-ce que Boulot Man Contractors ?",
    overviewDesc: "Boulot Man Contractors assure l'exécution de projets de bout en bout pour les organisations qui exigent fiabilité, conformité et responsabilité. Ce service est conçu pour les entreprises, les gouvernements, les ONG, les promoteurs et les institutions qui ne peuvent pas compter sur une main-d'œuvre informelle ou des équipes non gérées.",
    whoWeServe: "Qui nous servons",
    whoWeServeList: [
      "Grands entrepreneurs et entreprises d'ingénierie",
      "Entreprises d'infrastructure et de construction",
      "Agences gouvernementales et institutions publiques",
      "ONG et organisations internationales",
      "Hôtels, usines et entrepôts",
      "Projets de développement menés par la diaspora"
    ],
    whatWeDeliver: "Ce que nous livrons",
    whatWeDeliverList: [
      "Exécution complète du projet",
      "Main-d'œuvre technique certifiée",
      "Supervision technique d'ingénierie",
      "Conformité et documentation",
      "Assurance qualité"
    ],
    whyChoose: "Pourquoi les entreprises nous choisissent",
    whyChooseList: [
      "Professionnels vérifiés uniquement",
      "Gouvernance structurée",
      "Paiements sous séquestre et par jalons",
      "Responsabilité claire",
      "Disponibilité transfrontalière"
    ],
    servicesTitle: "Services de Contractualisation",
    servicesList: [
      {
        title: "Construction & Génie Civil",
        items: [
          "Construction résidentielle et commerciale",
          "Rénovation et remodelage",
          "Travaux de finition et d'intérieur",
          "Travaux structurels et maçonnerie"
        ]
      },
      {
        title: "Électricité, Mécanique & Énergie",
        items: [
          "Câblage industriel et résidentiel",
          "Installations CVC et mécaniques",
          "Systèmes d'énergie solaire et hybride",
          "Générateurs et alimentation de secours"
        ]
      },
      {
        title: "Infrastructures TIC & Sécurité",
        items: [
          "Vidéosurveillance et contrôle d'accès",
          "Réseau d'entreprise",
          "Salles de serveurs et câblage de données",
          "Intégration de bâtiments intelligents"
        ]
      }
    ],
    howItWorks: "Comment fonctionne l'engagement d'entreprise",
    howItWorksSteps: [
      "Consultation d'entreprise et évaluation des besoins",
      "Évaluation technique et évaluation du site",
      "Plan de projet, budget et calendrier",
      "Déploiement d'équipes vérifiées",
      "Supervision, rapports et conformité",
      "Achèvement, remise et garantie"
    ],
    accessTitle: "Modèle d'Accès Entreprise",
    tableHeaderTier: "Niveau",
    tableHeaderAccess: "Type d'Accès",
    tableHeaderBest: "Idéal Pour",
    tableRowProAccess: "Abonnement",
    tableRowProBest: "Entreprises et entrepreneurs de taille moyenne",
    tableRowEntAccess: "Sur Approbation Uniquement",
    tableRowEntBest: "Grandes organisations et gouvernements",
    ctaTitle: "Demander l'Accès Entreprise",
    ctaDesc: "L'accès entreprise se fait uniquement sur demande. Parlez directement avec la direction de Boulot Man pour discuter des besoins en main-d'œuvre, des exigences de conformité et de la portée du projet.",
    ctaBtn: "Discuter avec la Direction",
    modalTitle: "Consultation d'Entreprise",
    modalName: "Nom Complet",
    modalNamePlaceholder: "Votre nom",
    modalCompany: "Entreprise / Organisation",
    modalCompanyPlaceholder: "Nom de l'entreprise",
    modalEmail: "Adresse E-mail",
    modalEmailPlaceholder: "votre@email.com",
    modalPhone: "Numéro de Téléphone",
    modalPhonePlaceholder: "+123...",
    modalDetails: "Détails du Projet",
    modalDetailsPlaceholder: "Décrivez les besoins de votre projet...",
    modalSubmitBtn: "Envoyer la Demande",
    modalSubmittingBtn: "Envoi en cours...",
    modalSuccess: "Votre demande a été reçue. Notre équipe Entreprise vous contactera sous peu !",
  }
};

function CheckItem({ text }: { text: string }) {
  return (
    <li className={styles.checkItem}>
      <div className={styles.checkIcon}>
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
      </div>
      <span>{text}</span>
    </li>
  );
}

export default function ContractorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company_name: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Language state
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") || "en";
      if (savedLang === "fr" || savedLang === "en") {
        setLang(savedLang);
      } else if (savedLang === "rw") {
        setLang("fr"); // Fallback to French for Rwanda
      } else {
        setLang("en"); // Default fallback
      }
    }
  }, []);

  const t = translations[lang] || translations["en"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitInquiry({ ...formData, inquiry_type: "enterprise" });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", company_name: "", details: "" });
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
        </div>
      </section>

      <main className={styles.container}>
        {/* OVERVIEW */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.overviewTitle}</h2>
            <p className={styles.sectionDesc}>{t.overviewDesc}</p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.badge}>{t.whoWeServe}</span>
              <ul className={styles.featureList}>
                {t.whoWeServeList.map((item: string, idx: number) => (
                  <CheckItem key={idx} text={item} />
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>{t.whatWeDeliver}</span>
              <ul className={styles.featureList}>
                {t.whatWeDeliverList.map((item: string, idx: number) => (
                  <CheckItem key={idx} text={item} />
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>{t.whyChoose}</span>
              <ul className={styles.featureList}>
                {t.whyChooseList.map((item: string, idx: number) => (
                  <CheckItem key={idx} text={item} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>
          </div>

          <div className={styles.grid3}>
            {t.servicesList.map((srv: any, idx: number) => (
              <div className={styles.card} key={idx}>
                <h3 className={styles.cardTitle}>{srv.title}</h3>
                <ul className={styles.featureList}>
                  {srv.items.map((item: string, sIdx: number) => (
                    <CheckItem key={sIdx} text={item} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.howItWorks}</h2>
          </div>

          <div className={styles.flow}>
            {t.howItWorksSteps.map((step: string, idx: number) => (
              <div className={styles.flowStep} key={idx}>
                <span className={styles.stepLabel}>
                  {lang === "fr" ? `ÉTAPE ${idx + 1}` : `STEP ${idx + 1}`}
                </span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE TIERS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.accessTitle}</h2>
          </div>

          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>{t.tableHeaderTier}</th>
                  <th>{t.tableHeaderAccess}</th>
                  <th>{t.tableHeaderBest}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Pro</td>
                  <td>{t.tableRowProAccess}</td>
                  <td>{t.tableRowProBest}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#FF4500" }}>Enterprise</td>
                  <td>{t.tableRowEntAccess}</td>
                  <td>{t.tableRowEntBest}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
            <p className={styles.ctaDesc}>{t.ctaDesc}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.ctaBtn}
              <iconify-icon icon="lucide:arrow-up-right" style={{ fontSize: "22px" }}></iconify-icon>
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>{t.modalTitle}</h2>

            {success ? (
              <div className={styles.successMsg}>{t.modalSuccess}</div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>{t.modalName}</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.modalNamePlaceholder}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.modalCompany}</label>
                  <input
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder={t.modalCompanyPlaceholder}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.modalEmail}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.modalEmailPlaceholder}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.modalPhone}</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.modalPhonePlaceholder}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.modalDetails}</label>
                  <textarea
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    placeholder={t.modalDetailsPlaceholder}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? t.modalSubmittingBtn : t.modalSubmitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
