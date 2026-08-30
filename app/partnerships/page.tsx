"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useToast } from "@/app/components/Toast";
import styles from "./partnerships.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Strategic Ecosystem Partnerships",
    heroTitle: "Partner With Africa’s #1 On-Demand Workforce Network",
    heroSubtitle: "Collaborate with Boulot Man to empower certified technical professionals, scale enterprise service operations, drive youth employment, and unlock digital workforce growth across the continent.",
    btnSubmitProposal: "Submit Partnership Proposal",
    btnExploreTracks: "Explore Partnership Tracks",
    stat1Number: "50,000+",
    stat1Label: "Skilled Tradespeople & Engineers",
    stat2Number: "15+",
    stat2Label: "Strategic Institutional Alliances",
    stat3Number: "99.4%",
    stat3Label: "Service Level Agreement (SLA) Compliance",
    stat4Number: "7+",
    stat4Label: "Active High-Growth African Markets",
    tracksBadge: "Collaboration Tracks",
    tracksTitle: "Tailored Solutions For Every Institutional Partner",
    tracksDesc: "Whether you are an enterprise looking for dependable nationwide technical maintenance, a government body driving employment, or an institute training artisans, we have dedicated infrastructure for you.",
    btnPartnerTrack: "Partner in this Track",
    whyBadge: "The Boulot Man Advantage",
    whyTitle: "Why Leading Organizations Choose Boulot Man",
    whyDesc: "Built from the ground up for the realities of African commerce: identity vetting, milestone escrow protection, and nationwide field execution.",
    benefit1Title: "Multi-Tier Verified Network",
    benefit1Desc: "National ID, passport, background checks, and trade license verification eliminate the uncertainty of hiring informal artisans.",
    benefit2Title: "Milestone Escrow Architecture",
    benefit2Desc: "Institutional funds are held securely with automated Mobile Money & card payouts only when deliverables pass strict QA inspection.",
    benefit3Title: "API & Enterprise Integration",
    benefit3Desc: "Connect our workforce infrastructure directly with your company ERP, CRM, or ticketing system for automated dispatching.",
    benefit4Title: "Real-Time SLA & Telemetry",
    benefit4Desc: "Full visibility into task turnaround times, technician location tracking, customer satisfaction ratings, and cost savings.",
    benefit5Title: "Pan-African Footprint",
    benefit5Desc: "Standardized quality across East, West, and Central Africa with localized currency support and regulatory compliance.",
    benefit6Title: "Co-Branded Impact & PR",
    benefit6Desc: "Joint press releases, CSR milestone features, and co-marketing campaigns highlighting tangible economic empowerment.",
    formBadge: "Get In Touch",
    formTitle: "Start A Strategic Conversation",
    formDesc: "Fill out the partnership overview below and our executive partnerships team will reach out with a tailored collaboration framework.",
    labelOrg: "Organization / Company Name *",
    phOrg: "e.g. Acme Telecom / Ministry of Youth",
    labelContact: "Contact Person & Title *",
    phContact: "e.g. John Doe, Head of Operations",
    labelEmail: "Work Email Address *",
    phEmail: "partner@organization.com",
    labelPhone: "Phone / WhatsApp Number",
    phPhone: "+250 788 123 456",
    labelCountry: "Primary Country / Region",
    labelTrack: "Partnership Track",
    labelObjectives: "Partnership Objectives & Scope",
    phObjectives: "Briefly describe your organization's goals and how you'd like to collaborate with Boulot Man...",
    btnSubmitting: "Submitting Proposal...",
    btnSubmitForm: "Submit Partnership Proposal",
    faqBadge: "Frequently Asked Questions",
    faqTitle: "Everything You Need To Know",
    faqDesc: "Answers to common questions regarding institutional onboarding, contracts, and integrations.",
    bottomTitle: "Ready to Transform Africa's Skilled Workforce Together?",
    bottomDesc: "Join dozens of forward-thinking enterprises, agencies, and institutions leveraging Boulot Man's digital infrastructure.",
    btnBottomContact: "Contact Strategic Partnerships",
    btnLearnMission: "Learn About Our Mission",
    modalTitle: "Submit Partnership Proposal",
    modalTrackLabel: "Track:",
    modalOrgLabel: "Organization Name *",
    modalContactLabel: "Contact Person *",
    modalEmailLabel: "Email Address *",
    modalPhoneLabel: "Phone / WhatsApp",
    modalNotesLabel: "Collaboration Notes",
    phModalNotes: "Briefly describe your proposal...",
    btnSendProposal: "Send Proposal",
    toastWarningTitle: "Incomplete Form",
    toastWarningMsg: "Please fill in your organization name, contact person, and email address.",
    toastSuccessTitle: "Proposal Received!",
    toastSuccessMsg: "Thank you for reaching out. Our strategic partnership team will review your submission and contact you within 24 business hours."
  },
  fr: {
    heroBadge: "Partenariats Stratégiques & Écosystème",
    heroTitle: "Associez-vous au Réseau N°1 de Services Techniques en Afrique",
    heroSubtitle: "Collaborez avec Boulot Man pour soutenir les artisans qualifiés, optimiser vos interventions d'entreprise, favoriser l'emploi des jeunes et structurer le travail technique sur le continent.",
    btnSubmitProposal: "Soumettre une Proposition",
    btnExploreTracks: "Découvrir les Programmes",
    stat1Number: "50 000+",
    stat1Label: "Techniciens & Ingénieurs Qualifiés",
    stat2Number: "15+",
    stat2Label: "Alliances Institutionnelles Stratégiques",
    stat3Number: "99.4%",
    stat3Label: "Respect des Engagements de Service (SLA)",
    stat4Number: "7+",
    stat4Label: "Marchés Africains en Forte Croissance",
    tracksBadge: "Programmes de Partenariat",
    tracksTitle: "Des Solutions Dédiées à Chaque Partenaire Institutionnel",
    tracksDesc: "Que vous soyez une grande entreprise cherchant une maintenance technique fiable, une institution publique pour l'emploi ou un centre de formation TVET, nous mettons notre infrastructure à votre service.",
    btnPartnerTrack: "Rejoindre ce Programme",
    whyBadge: "L'Avantage Boulot Man",
    whyTitle: "Pourquoi les Grandes Organisations Choisissent Boulot Man",
    whyDesc: "Conçu spécifiquement pour le contexte africain : vérification d'identité, paiements sous séquestre sécurisé et déploiement terrain coordonné.",
    benefit1Title: "Réseau Vérifié Multi-Niveaux",
    benefit1Desc: "Contrôle des pièces d'identité, diplômes professionnels et antécédents pour éliminer toute incertitude lors du recrutement d'artisans.",
    benefit2Title: "Séquestre Financier par Jalons",
    benefit2Desc: "Fonds institutionnels sécurisés et débloqués automatiquement par Mobile Money ou virement uniquement après validation du contrôle qualité.",
    benefit3Title: "Intégration API & ERP d'Entreprise",
    benefit3Desc: "Connectez directement notre infrastructure de main-d'œuvre à vos outils ERP, CRM ou logiciels de gestion d'incidents.",
    benefit4Title: "Suivi & Données SLA en Temps Réel",
    benefit4Desc: "Visibilité totale sur les délais d'intervention, la géolocalisation des équipes, la satisfaction client et les économies d'échelle.",
    benefit5Title: "Présence Panafricaine",
    benefit5Desc: "Standards de qualité homogènes en Afrique de l'Est, de l'Ouest et Centrale, avec gestion multidevise et conformité légale.",
    benefit6Title: "Impact Économique & Communication Conjointe",
    benefit6Desc: "Communiqués de presse conjoints, valorisation RSE et campagnes valorisant l'impact concret sur l'autonomisation économique locale.",
    formBadge: "Contact Direct",
    formTitle: "Démarrer une Collaboration Stratégique",
    formDesc: "Présentez brièvement vos besoins ci-dessous. Notre équipe Partenariats Stratégiques prendra contact pour vous proposer un cadre de collaboration sur-mesure.",
    labelOrg: "Nom de l'Organisation / Entreprise *",
    phOrg: "ex. Acme Telecom / Ministère de la Jeunesse",
    labelContact: "Nom du Contact & Fonction *",
    phContact: "ex. Jean Dupont, Directeur des Opérations",
    labelEmail: "Adresse E-mail Professionnelle *",
    phEmail: "partenaire@organisation.com",
    labelPhone: "Numéro de Téléphone / WhatsApp",
    phPhone: "+250 788 123 456",
    labelCountry: "Pays / Région Principale",
    labelTrack: "Type de Partenariat",
    labelObjectives: "Objectifs & Périmètre du Projet",
    phObjectives: "Décrivez brièvement les objectifs de votre organisation et votre vision de collaboration avec Boulot Man...",
    btnSubmitting: "Envoi en cours...",
    btnSubmitForm: "Envoyer la Proposition",
    faqBadge: "Foire Aux Questions",
    faqTitle: "Tout Ce Que Vous Devez Savoir",
    faqDesc: "Réponses aux questions courantes sur l'intégration institutionnelle, les contrats et les déploiements.",
    bottomTitle: "Prêt à Transformer la Main-d'œuvre Qualifiée Africaine ?",
    bottomDesc: "Rejoignez les dizaines d'entreprises, institutions et agences qui font confiance à l'infrastructure Boulot Man.",
    btnBottomContact: "Contacter les Partenariats Stratégiques",
    btnLearnMission: "Découvrir Notre Mission",
    modalTitle: "Soumettre une Proposition",
    modalTrackLabel: "Programme :",
    modalOrgLabel: "Nom de l'Organisation *",
    modalContactLabel: "Nom du Contact *",
    modalEmailLabel: "Adresse E-mail *",
    modalPhoneLabel: "Téléphone / WhatsApp",
    modalNotesLabel: "Détails de la Collaboration",
    phModalNotes: "Décrivez brièvement votre proposition...",
    btnSendProposal: "Envoyer la Proposition",
    toastWarningTitle: "Formulaire Incomplet",
    toastWarningMsg: "Veuillez renseigner le nom de l'organisation, le contact et l'adresse e-mail.",
    toastSuccessTitle: "Proposition Reçue !",
    toastSuccessMsg: "Merci de votre démarche. Notre équipe partenariats étudiera votre demande et vous répondra sous 24 heures ouvrées."
  }
};

const PARTNERSHIP_TRACKS = [
  {
    id: "enterprise",
    titleEn: "Enterprise & Facility Management",
    titleFr: "Gestion Technique d'Entreprise & Maintenance",
    icon: "lucide:building-2",
    iconClass: styles.trackIcon1,
    descEn: "Deploy on-demand technical teams, scheduled facility maintenance, and nationwide field engineering with dedicated account managers and strict SLA guarantees.",
    descFr: "Déployez des équipes techniques à la demande, planifiez la maintenance de vos bâtiments et chantiers avec un compte dédié et des garanties SLA strictes.",
    featuresEn: [
      "Dedicated corporate SLA & 2-hour response guarantees",
      "Consolidated monthly billing & digital tax invoicing",
      "Custom ERP & ticketing system API integrations",
      "Vetted multi-trade technician teams across regions",
    ],
    featuresFr: [
      "Garantie d'intervention rapide sous 2 heures avec SLA dédié",
      "Facturation mensuelle consolidée et conformité fiscale",
      "Intégrations API ERP et ticketing sur-mesure",
      "Équipes multi-métiers certifiées et déployées régionalement",
    ],
    defaultTrack: "Enterprise & Corporate Solutions",
  },
  {
    id: "government-ngo",
    titleEn: "Government & NGO Youth Employment",
    titleFr: "Gouvernements, Bailleurs & Emploi des Jeunes",
    icon: "lucide:landmark",
    iconClass: styles.trackIcon2,
    descEn: "Partner with Boulot Man on workforce development, TVET graduate onboarding, digital identity verification, and scalable local job creation initiatives.",
    descFr: "Associez-vous à Boulot Man pour l'insertion des diplômés TVET, la certification d'identité numérique et les programmes massifs d'emploi des jeunes.",
    featuresEn: [
      "Digital workforce identity & credential authentication",
      "Transparent job placement tracking & impact analytics",
      "Direct mobile stipend / subsidy escrow disbursements",
      "Upskilling pipelines aligned with regional infrastructure demand",
    ],
    featuresFr: [
      "Authentification de l'identité et des compétences numériques",
      "Suivi transparent des insertions professionnelles et métriques d'impact",
      "Versement direct de bourses et subventions via séquestre mobile",
      "Parcours de perfectionnement alignés sur la demande des chantiers",
    ],
    defaultTrack: "Government & NGO Program",
  },
  {
    id: "tvet-institutes",
    titleEn: "Vocational & Technical Training Institutes",
    titleFr: "Centres de Formation Professionnelle & TVET",
    icon: "lucide:graduation-cap",
    iconClass: styles.trackIcon3,
    descEn: "Connect your certified graduates and apprentices directly into high-paying commercial and residential contracts with built-in digital work portfolios.",
    descFr: "Offrez à vos diplômés et apprentis un accès direct à des missions rémunérées auprès de clients particuliers et entreprises vérifiés.",
    featuresEn: [
      "Direct pathway from graduation to active client bookings",
      "Verified digital trade badge issuance on profiles",
      "Apprenticeship supervision & real-world rating system",
      "Curriculum alignment with real-time employer market trends",
    ],
    featuresFr: [
      "Passerelle directe entre la formation et les premières missions",
      "Délivrance de badges de compétence certifiés sur les profils",
      "Encadrement de l'apprentissage avec notation client en conditions réelles",
      "Adaptation des programmes aux compétences techniques les plus demandées",
    ],
    defaultTrack: "Vocational & Training Institute",
  },
  {
    id: "fintech-suppliers",
    titleEn: "Fintech, Tool & Equipment Suppliers",
    titleFr: "Fintech, Outillage & Équipementiers",
    icon: "lucide:wrench",
    iconClass: styles.trackIcon4,
    descEn: "Provide equipment financing, discounted materials, micro-insurance, and seamless digital financial services to Africa's largest verified technician base.",
    descFr: "Proposez du financement de matériel, des matériaux à tarifs négociés, de la micro-assurance et des services financiers adaptés aux artisans.",
    featuresEn: [
      "Exclusive marketplace merchant placement to 50k+ tradespeople",
      "Equipment buy-now-pay-later (BNPL) credit scoring integration",
      "Seamless mobile escrow payout & micro-insurance rails",
      "Co-branded promotional campaigns across member dashboard",
    ],
    featuresFr: [
      "Visibilité marchande directe auprès de +50 000 professionnels qualifiés",
      "Intégration de micro-crédit et paiement fractionné pour l'outillage",
      "Passerelles automatisées de micro-assurance et paiement mobile",
      "Campagnes promotionnelles ciblées sur l'espace pro",
    ],
    defaultTrack: "Fintech, Tools & Hardware Supplier",
  },
];

const FAQS_DATA = [
  {
    qEn: "How does an enterprise partnership with Boulot Man work?",
    aEn: "Enterprise partners receive a dedicated dashboard to dispatch service requests, monitor job SLAs in real-time, access centralized billing, and receive customized technical workforce allocations across all covered cities.",
    qFr: "Comment fonctionne un partenariat d'entreprise avec Boulot Man ?",
    aFr: "Les partenaires entreprises disposent d'un portail dédié pour planifier des interventions, suivre les engagements SLA en direct, centraliser la facturation et mobiliser des techniciens certifiés sur toutes leurs implantations."
  },
  {
    qEn: "Can NGOs and development agencies monitor impact and fund disbursement?",
    aEn: "Yes. Our platform provides comprehensive administrative dashboards with granular analytics on youth onboarding, verified skill accreditations, task completion volumes, and transparent escrow milestone payouts.",
    qFr: "Les ONG et bailleurs peuvent-ils mesurer l'impact et la traçabilité des fonds ?",
    aFr: "Oui. Notre plateforme fournit des tableaux de bord d'administration avec des indicateurs précis sur l'insertion des jeunes, les certifications obtenues, les volumes de tâches exécutées et la libération transparente des fonds sous séquestre."
  },
  {
    qEn: "What is required for TVET and trade institutes to partner with Boulot Man?",
    aEn: "Accredited institutions can integrate their certification rosters with our verification system, allowing graduating artisans to automatically obtain verified credentials and priority access to active client jobs.",
    qFr: "Que faut-il pour qu'un centre TVET devienne partenaire de Boulot Man ?",
    aFr: "Les centres de formation certifiés peuvent connecter leurs promotions de diplômés à notre système de vérification pour attribuer des badges authentifiés et donner une priorité d'accès aux opportunités de travail."
  },
  {
    qEn: "Which countries are currently supported for institutional partnerships?",
    aEn: "We currently support enterprise operations in Rwanda, Nigeria, Kenya, Ghana, South Africa, Ivory Coast, and Cameroon, with active cross-border expansion underway.",
    qFr: "Quels sont les pays couverts pour les partenariats institutionnels ?",
    aFr: "Nous opérons actuellement au Rwanda, au Nigéria, au Kenya, au Ghana, en Afrique du Sud, en Côte d'Ivoire et au Cameroun, avec une expansion continue sur le continent."
  },
];

export default function PartnershipsPage() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("Enterprise & Corporate Solutions");
  const [submitting, setSubmitting] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
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
      toast.warning(t.toastWarningTitle, t.toastWarningMsg);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      toast.success(
        t.toastSuccessTitle,
        t.toastSuccessMsg
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
            <iconify-icon icon="lucide:handshake" style={{ fontSize: "16px" }} /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>

          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => openInquiryModal("Enterprise & Corporate Solutions")}
              className={styles.heroBtnPrimary}
            >
              <iconify-icon icon="lucide:send" style={{ fontSize: "18px" }} /> {t.btnSubmitProposal}
            </button>
            <a href="#partner-tracks" className={styles.heroBtnSecondary}>
              <iconify-icon icon="lucide:layers" style={{ fontSize: "18px" }} /> {t.btnExploreTracks}
            </a>
          </div>
        </div>
      </section>

      <main className={styles.container}>
        {/* ================= STATS SECTION ================= */}
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

        {/* ================= STRATEGIC TRACKS ================= */}
        <section id="partner-tracks" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{t.tracksBadge}</div>
            <h2 className={styles.sectionTitle}>{t.tracksTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.tracksDesc}
            </p>
          </div>

          <div className={styles.tracksGrid}>
            {PARTNERSHIP_TRACKS.map((track) => {
              const title = lang === "fr" ? track.titleFr : track.titleEn;
              const desc = lang === "fr" ? track.descFr : track.descEn;
              const features = lang === "fr" ? track.featuresFr : track.featuresEn;

              return (
                <div key={track.id} className={styles.trackCard}>
                  <div>
                    <div className={`${styles.trackIconWrap} ${track.iconClass}`}>
                      <iconify-icon icon={track.icon} />
                    </div>
                    <h3 className={styles.trackTitle}>{title}</h3>
                    <p className={styles.trackDesc}>{desc}</p>
                    <ul className={styles.trackFeatures}>
                      {features.map((feat, idx) => (
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
                    {t.btnPartnerTrack} <iconify-icon icon="lucide:arrow-right" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= WHY PARTNER (BENEFITS) ================= */}
        <section className={styles.section} style={{ background: "#ffffff", borderRadius: "24px", padding: "48px 36px", border: "1px solid #e2e8f0" }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{t.whyBadge}</div>
            <h2 className={styles.sectionTitle}>{t.whyTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.whyDesc}
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:shield-check" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit1Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit1Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit2Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit2Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:cpu" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit3Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit3Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:bar-chart-3" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit4Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit4Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:globe" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit5Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit5Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <iconify-icon icon="lucide:sparkles" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit6Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit6Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ================= INLINE PROPOSAL FORM ================= */}
        <section id="inquiry-form" className={styles.section}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader} style={{ marginBottom: "32px" }}>
              <div className={styles.sectionBadge}>{t.formBadge}</div>
              <h2 className={styles.sectionTitle}>{t.formTitle}</h2>
              <p className={styles.sectionDesc}>
                {t.formDesc}
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>{t.labelOrg}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.phOrg}
                    className={styles.formInput}
                    value={form.orgName}
                    onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>{t.labelContact}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.phContact}
                    className={styles.formInput}
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>{t.labelEmail}</label>
                  <input
                    type="email"
                    required
                    placeholder={t.phEmail}
                    className={styles.formInput}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>{t.labelPhone}</label>
                  <input
                    type="tel"
                    placeholder={t.phPhone}
                    className={styles.formInput}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>{t.labelCountry}</label>
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
                  <label className={styles.formLabel}>{t.labelTrack}</label>
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
                  <label className={styles.formLabel}>{t.labelObjectives}</label>
                  <textarea
                    rows={4}
                    placeholder={t.phObjectives}
                    className={styles.formTextarea}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? (
                  <>{t.btnSubmitting}</>
                ) : (
                  <>
                    <iconify-icon icon="lucide:send" /> {t.btnSubmitForm}
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{t.faqBadge}</div>
            <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
            <p className={styles.sectionDesc}>{t.faqDesc}</p>
          </div>

          <div className={styles.faqGrid}>
            {FAQS_DATA.map((faq, idx) => {
              const q = lang === "fr" ? faq.qFr : faq.qEn;
              const a = lang === "fr" ? faq.aFr : faq.aEn;

              return (
                <div key={idx} className={styles.faqItem}>
                  <div
                    className={styles.faqHeader}
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                  >
                    <span>{q}</span>
                    <iconify-icon
                      icon={faqOpenIndex === idx ? "lucide:chevron-up" : "lucide:chevron-down"}
                      style={{ fontSize: "20px", color: "#001F3F" }}
                    />
                  </div>
                  {faqOpenIndex === idx && <div className={styles.faqContent}>{a}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className={styles.bottomCta}>
          <h2>{t.bottomTitle}</h2>
          <p>
            {t.bottomDesc}
          </p>
          <div className={styles.heroActionGroup}>
            <button
              type="button"
              onClick={() => openInquiryModal("Enterprise & Corporate Solutions")}
              className={styles.heroBtnPrimary}
            >
              <iconify-icon icon="lucide:mail" /> {t.btnBottomContact}
            </button>
            <Link href="/about" className={styles.heroBtnSecondary}>
              <iconify-icon icon="lucide:info" /> {t.btnLearnMission}
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
              {t.modalTitle}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 20px 0" }}>
              {t.modalTrackLabel} <strong style={{ color: "#ff4500" }}>{selectedTrack}</strong>
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                <div>
                  <label className={styles.formLabel}>{t.modalOrgLabel}</label>
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
                  <label className={styles.formLabel}>{t.modalContactLabel}</label>
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
                  <label className={styles.formLabel}>{t.modalEmailLabel}</label>
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
                  <label className={styles.formLabel}>{t.modalPhoneLabel}</label>
                  <input
                    type="tel"
                    placeholder="+250 ..."
                    className={styles.formInput}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>{t.modalNotesLabel}</label>
                  <textarea
                    rows={3}
                    placeholder={t.phModalNotes}
                    className={styles.formTextarea}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? t.btnSubmitting : t.btnSendProposal}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

