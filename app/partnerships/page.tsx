"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useToast } from "@/app/components/Toast";
import { api } from "@/app/lib/api";
import styles from "./partnerships.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Strategic Ecosystem & Institutional Partnerships",
    heroTitle: "Partner With Africa’s #1 On-Demand Technical Workforce Infrastructure",
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
    formBadge: "Enterprise Intake",
    formTitle: "Submit Strategic Partnership Proposal",
    formDesc: "Provide your institutional requirements below. Our executive partnerships committee will evaluate your submission and schedule a formal briefing within 24 business hours.",
    
    sec1: "1. Organization Profile",
    labelOrg: "Organization / Company Legal Name *",
    phOrg: "e.g. Acme Telecom / Ministry of Digital Economy",
    labelOrgType: "Organization Type *",
    labelWebsite: "Official Website / Portal",
    phWebsite: "https://example.com",
    labelCountry: "Headquarters / Target Country *",

    sec2: "2. Partnership Track & Scope",
    labelTrack: "Primary Collaboration Track *",
    labelScale: "Estimated Target Scale / Scope *",
    phScale: "e.g. 500+ technicians / 12 regional sites / $250k grant program",
    labelBudget: "Budget / Investment Tier",
    labelTimeframe: "Target Launch Timeframe",

    sec3: "3. Executive Contact & Meeting Preference",
    labelContact: "Lead Contact Person & Title *",
    phContact: "e.g. Sarah K., Director of Strategic Alliances",
    labelEmail: "Official Work Email *",
    phEmail: "partner@organization.com",
    labelPhone: "Direct Phone / WhatsApp Number *",
    phPhone: "+250 788 123 456",
    labelMeeting: "Preferred Briefing Platform",

    sec4: "4. Proposal Narrative & Objectives",
    labelObjectives: "Detailed Objectives & Value Proposition *",
    phObjectives: "Detail the specific goals, integration touchpoints, target outcomes, and operational synergy you envision with Boulot Man...",

    sec5: "5. Supporting Documentation & RFPs",
    uploadPrompt: "Click to upload Concept Notes, RFPs, Pitch Decks, or MoUs (PDF, DOCX, PNG up to 25MB)",
    noFiles: "No documents attached yet.",

    btnSubmitting: "Submitting Proposal...",
    btnSubmitForm: "Submit Official Partnership Proposal",
    faqBadge: "Frequently Asked Questions",
    faqTitle: "Everything You Need To Know",
    faqDesc: "Answers to common questions regarding institutional onboarding, contracts, and integrations.",
    bottomTitle: "Ready to Transform Africa's Skilled Workforce Together?",
    bottomDesc: "Join dozens of forward-thinking enterprises, agencies, and institutions leveraging Boulot Man's digital infrastructure.",
    btnBottomContact: "Contact Strategic Partnerships",
    btnLearnMission: "Learn About Our Mission",
    modalTitle: "Strategic Partnership Fast-Track",
    modalTrackLabel: "Selected Track:",
    modalOrgLabel: "Organization Name *",
    modalContactLabel: "Contact Person & Title *",
    modalEmailLabel: "Work Email *",
    modalPhoneLabel: "Phone / WhatsApp *",
    modalNotesLabel: "Collaboration Overview",
    phModalNotes: "Briefly outline your goals, budget tier, and geographic targets...",
    btnSendProposal: "Send Partnership Inquiry",
    toastWarningTitle: "Incomplete Information",
    toastWarningMsg: "Please complete all mandatory fields (Organization, Contact, Work Email, Phone, Track, and Scope).",
    toastSuccessTitle: "Partnership Proposal Submitted!",
    toastSuccessMsg: "Thank you for reaching out. Our strategic alliance director has received your proposal and will respond within 24 business hours."
  },
  fr: {
    heroBadge: "Partenariats Stratégiques & Écosystème",
    heroTitle: "Associez-vous à l'Infrastructure N°1 de Main-d'œuvre Technique en Afrique",
    heroSubtitle: "Collaborez avec Boulot Man pour structurer les artisans qualifiés, automatiser vos opérations d'entreprise, booster l'emploi des jeunes et accélérer la croissance de la main-d'œuvre numérique.",
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
    formBadge: "Formulaire Entreprise",
    formTitle: "Soumettre une Proposition de Partenariat Stratégique",
    formDesc: "Détaillez vos besoins institutionnels ci-dessous. Notre comité partenariats étudiera votre dossier et planifiera un entretien formel sous 24 heures ouvrées.",
    
    sec1: "1. Profil de l'Organisation",
    labelOrg: "Nom Légal de l'Organisation / Entreprise *",
    phOrg: "ex. Acme Telecom / Ministère de l'Économie Numérique",
    labelOrgType: "Type d'Organisation *",
    labelWebsite: "Site Web Officiel / Portail",
    phWebsite: "https://exemple.com",
    labelCountry: "Siège / Pays Cible *",

    sec2: "2. Programme de Partenariat & Envergure",
    labelTrack: "Programme de Collaboration Principal *",
    labelScale: "Envergure / Volume Estimé *",
    phScale: "ex. 500+ techniciens / 12 sites régionaux / Programme subventionné 250k$",
    labelBudget: "Budget / Fourchette d'Investissement",
    labelTimeframe: "Échéance de Déploiement Souhaitée",

    sec3: "3. Contact Exécutif & Préférence de Réunion",
    labelContact: "Nom du Contact & Titre / Fonction *",
    phContact: "ex. Sarah K., Directrice des Alliances Stratégiques",
    labelEmail: "E-mail Professionnel Officiel *",
    phEmail: "partenaire@organisation.com",
    labelPhone: "Numéro Direct / WhatsApp *",
    phPhone: "+250 788 123 456",
    labelMeeting: "Plateforme de Réunion Préférée",

    sec4: "4. Proposition & Objectifs Détaillés",
    labelObjectives: "Objectifs & Synergie Opérationnelle *",
    phObjectives: "Décrivez précisément vos objectifs stratégiques, les besoins d'intégration, les résultats attendus et la valeur conjointe...",

    sec5: "5. Documents & Termes de Référence (TDR)",
    uploadPrompt: "Cliquez pour joindre notes conceptuelles, TDR, présentations ou accords types (PDF, DOCX, PNG jusqu'à 25 Mo)",
    noFiles: "Aucun document joint pour le moment.",

    btnSubmitting: "Envoi en cours...",
    btnSubmitForm: "Soumettre la Proposition Officielle",
    faqBadge: "Foire Aux Questions",
    faqTitle: "Tout Ce Que Vous Devez Savoir",
    faqDesc: "Réponses aux questions courantes sur l'intégration institutionnelle, les contrats et les déploiements.",
    bottomTitle: "Prêt à Transformer la Main-d'œuvre Qualifiée Africaine ?",
    bottomDesc: "Rejoignez les dizaines d'entreprises, institutions et agences qui font confiance à l'infrastructure Boulot Man.",
    btnBottomContact: "Contacter les Partenariats Stratégiques",
    btnLearnMission: "Découvrir Notre Mission",
    modalTitle: "Partenariat Stratégique Accéléré",
    modalTrackLabel: "Programme sélectionné :",
    modalOrgLabel: "Nom de l'Organisation *",
    modalContactLabel: "Nom & Titre du Contact *",
    modalEmailLabel: "E-mail Professionnel *",
    modalPhoneLabel: "Téléphone / WhatsApp *",
    modalNotesLabel: "Aperçu de la Collaboration",
    phModalNotes: "Décrivez brièvement vos objectifs, le budget envisagé et la zone géographique...",
    btnSendProposal: "Envoyer la Demande",
    toastWarningTitle: "Formulaire Incomplet",
    toastWarningMsg: "Veuillez remplir tous les champs obligatoires (Organisation, Contact, E-mail, Téléphone, Programme et Objectifs).",
    toastSuccessTitle: "Proposition de Partenariat Reçue !",
    toastSuccessMsg: "Merci de votre démarche. Notre direction des partenariats examinera votre dossier et vous contactera sous 24 heures ouvrées."
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

  // Files state
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number; type: string; data: string }>>([]);

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
    orgType: "Corporation / Enterprise",
    website: "",
    country: "Rwanda",
    track: "Enterprise & Corporate Solutions",
    scale: "",
    budget: "$25,000 - $100,000",
    timeframe: "Immediate / Q1",
    contactName: "",
    email: "",
    phone: "",
    meetingPlatform: "Google Meet",
    details: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const loadedFiles: Array<{ name: string; size: number; type: string; data: string }> = [];

      for (const file of filesArray) {
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });

        loadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          data: base64Data
        });
      }

      setAttachedFiles((prev) => [...prev, ...loadedFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const openInquiryModal = (trackName?: string) => {
    if (trackName) {
      setSelectedTrack(trackName);
      setForm((prev) => ({ ...prev, track: trackName }));
    }
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName.trim() || !form.email.trim() || !form.contactName.trim() || !form.phone.trim()) {
      toast.warning(t.toastWarningTitle, t.toastWarningMsg);
      return;
    }

    setSubmitting(true);
    try {
      const attachedNames = attachedFiles.map((f) => f.name);
      const payloadDetails = `=== 1. Organization Profile ===
Organization / Company Legal Name: ${form.orgName}
Organization Type: ${form.orgType}
Official Website: ${form.website || "N/A"}
Country / Region: ${form.country}

=== 2. Partnership Track & Scale ===
Partnership Track: ${form.track}
Estimated Scale / Scope: ${form.scale || "Not specified"}
Budget / Investment Tier: ${form.budget}
Target Launch Timeframe: ${form.timeframe}

=== 3. Executive Contact & Meeting ===
Lead Contact: ${form.contactName}
Work Email: ${form.email}
Phone / WhatsApp: ${form.phone}
Preferred Meeting: ${form.meetingPlatform}

=== 4. Objectives & Requirements ===
${form.details || "No additional narrative provided."}

=== 5. Documentation ===
Attachments: ${attachedNames.length > 0 ? attachedNames.join(", ") : "None attached"}`;

      const newInquiry = {
        id: `PARTNER-${Date.now().toString().slice(-6)}`,
        created_at: new Date().toISOString(),
        topic: `[PARTNERSHIP PROPOSAL] ${form.orgName} - ${form.track}`,
        name: form.contactName,
        company_name: form.orgName,
        email: form.email,
        phone: form.phone,
        city: form.country,
        category: form.track,
        details: payloadDetails,
        attached_files: attachedFiles,
        status: "Pending",
      };

      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("boulotman_partnership_inquiries") || "[]");
        localStorage.setItem("boulotman_partnership_inquiries", JSON.stringify([newInquiry, ...existing]));
      }

      await Promise.allSettled([
        api.submitInquiry({
          name: form.contactName,
          email: form.email,
          phone: form.phone,
          company_name: form.orgName,
          inquiry_type: "partnership",
          details: payloadDetails
        }),
        api.createSupportTicket({
          subject: `[Partnership Proposal] ${form.orgName} - ${form.track}`,
          body: `Executive Contact: ${form.contactName} (${form.email} | ${form.phone})\nOrg Type: ${form.orgType}\nCountry: ${form.country}\nTrack: ${form.track}\nScale: ${form.scale}\nBudget: ${form.budget}\nTimeframe: ${form.timeframe}\nMeeting: ${form.meetingPlatform}\nAttachments: ${attachedNames.join(", ") || "None"}\n\nObjectives:\n${form.details}`
        })
      ]);

      setModalOpen(false);
      toast.success(t.toastSuccessTitle, t.toastSuccessMsg);
      setForm({
        orgName: "",
        orgType: "Corporation / Enterprise",
        website: "",
        country: "Rwanda",
        track: "Enterprise & Corporate Solutions",
        scale: "",
        budget: "$25,000 - $100,000",
        timeframe: "Immediate / Q1",
        contactName: "",
        email: "",
        phone: "",
        meetingPlatform: "Google Meet",
        details: "",
      });
      setAttachedFiles([]);
    } catch (err) {
      toast.error("Submission Error", "Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            <a href="#inquiry-form" className={styles.heroBtnPrimary}>
              <iconify-icon icon="lucide:send" style={{ fontSize: "18px" }} /> {t.btnSubmitProposal}
            </a>
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

        {/* ================= INLINE ENTERPRISE PROPOSAL FORM ================= */}
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
              {/* SECTION 1 */}
              <div className={styles.formBlock}>
                <h3 className={styles.blockTitle}>
                  <iconify-icon icon="lucide:building-2" /> {t.sec1}
                </h3>
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
                    <label className={styles.formLabel}>{t.labelOrgType}</label>
                    <select
                      className={styles.formSelect}
                      value={form.orgType}
                      onChange={(e) => setForm({ ...form, orgType: e.target.value })}
                    >
                      <option value="Corporation / Enterprise">Corporation / Enterprise</option>
                      <option value="Government Agency / Ministry">Government Agency / Ministry</option>
                      <option value="International NGO / Development Body">International NGO / Development Body</option>
                      <option value="TVET / University / Polytechnic">TVET / University / Polytechnic</option>
                      <option value="Hardware / Equipment Manufacturer">Hardware / Equipment Manufacturer</option>
                      <option value="Telecom / Energy Infrastructure">Telecom / Energy Infrastructure</option>
                      <option value="Financial Institution / FinTech">Financial Institution / FinTech</option>
                      <option value="Other">Other Institutional Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelWebsite}</label>
                    <input
                      type="url"
                      placeholder={t.phWebsite}
                      className={styles.formInput}
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelCountry}</label>
                    <select
                      className={styles.formSelect}
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    >
                      <option value="Rwanda">Rwanda (Kigali HQ)</option>
                      <option value="Cameroon">Cameroon (Douala / Yaoundé)</option>
                      <option value="Nigeria">Nigeria (Lagos / Abuja)</option>
                      <option value="Kenya">Kenya (Nairobi)</option>
                      <option value="Ghana">Ghana (Accra)</option>
                      <option value="Ivory Coast">Ivory Coast (Abidjan)</option>
                      <option value="South Africa">South Africa (Johannesburg)</option>
                      <option value="Tanzania">Tanzania (Dar es Salaam)</option>
                      <option value="Pan-African / Cross-Border">Pan-African / Cross-Border</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className={styles.formBlock}>
                <h3 className={styles.blockTitle}>
                  <iconify-icon icon="lucide:layers" /> {t.sec2}
                </h3>
                <div className={styles.formGrid}>
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
                      <option value="Telecom & Energy Infrastructure Dispatch">Telecom &amp; Energy Infrastructure Dispatch</option>
                      <option value="Other">Other Strategic Initiative</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelScale}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.phScale}
                      className={styles.formInput}
                      value={form.scale}
                      onChange={(e) => setForm({ ...form, scale: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelBudget}</label>
                    <select
                      className={styles.formSelect}
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    >
                      <option value="Under $25,000">Under $25,000 USD / Equiv</option>
                      <option value="$25,000 - $100,000">$25,000 - $100,000 USD</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000 USD</option>
                      <option value="$500,000+ Enterprise Scale">$500,000+ Enterprise Scale</option>
                      <option value="Institutional Grant / Non-Commercial">Institutional Grant / Non-Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelTimeframe}</label>
                    <select
                      className={styles.formSelect}
                      value={form.timeframe}
                      onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                    >
                      <option value="Immediate / Q1">Immediate / Q1 Launch</option>
                      <option value="1 - 3 Months">1 - 3 Months Preparation</option>
                      <option value="3 - 6 Months">3 - 6 Months Planning</option>
                      <option value="Annual Strategic Roadmap">Annual Strategic Roadmap</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div className={styles.formBlock}>
                <h3 className={styles.blockTitle}>
                  <iconify-icon icon="lucide:user-check" /> {t.sec3}
                </h3>
                <div className={styles.formGrid}>
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
                      required
                      placeholder={t.phPhone}
                      className={styles.formInput}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel}>{t.labelMeeting}</label>
                    <select
                      className={styles.formSelect}
                      value={form.meetingPlatform}
                      onChange={(e) => setForm({ ...form, meetingPlatform: e.target.value })}
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                      <option value="Zoom">Zoom</option>
                      <option value="In-Person at Boulot Man Hub">In-Person at Boulot Man Hub</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4 */}
              <div className={styles.formBlock}>
                <h3 className={styles.blockTitle}>
                  <iconify-icon icon="lucide:file-text" /> {t.sec4}
                </h3>
                <div className={styles.formGroupFull}>
                  <label className={styles.formLabel}>{t.labelObjectives}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={t.phObjectives}
                    className={styles.formTextarea}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION 5 */}
              <div className={styles.formBlock}>
                <h3 className={styles.blockTitle}>
                  <iconify-icon icon="lucide:paperclip" /> {t.sec5}
                </h3>
                <label className={styles.uploadZone}>
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  />
                  <iconify-icon icon="lucide:upload-cloud" style={{ fontSize: "28px", color: "#ff4500" }} />
                  <span style={{ fontSize: "14px", color: "#001F3F", fontWeight: 600 }}>{t.uploadPrompt}</span>
                </label>

                {attachedFiles.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    {attachedFiles.map((file, idx) => (
                      <span key={idx} className={styles.fileBadge}>
                        📎 {file.name}
                        <button type="button" onClick={() => removeFile(idx)} className={styles.fileRemove}>
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "8px 0 0 0" }}>{t.noFiles}</p>
                )}
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
            <a
              href="#inquiry-form"
              className={styles.heroBtnPrimary}
            >
              <iconify-icon icon="lucide:mail" /> {t.btnBottomContact}
            </a>
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
                    placeholder="e.g. Acme Corp / Ministry of Youth"
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                      required
                      placeholder="+250 ..."
                      className={styles.formInput}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.formLabel}>{t.labelScale}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500+ workers / 10 regional hubs"
                    className={styles.formInput}
                    value={form.scale}
                    onChange={(e) => setForm({ ...form, scale: e.target.value })}
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
