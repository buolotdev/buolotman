"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useToast } from "@/app/components/Toast";
import { api } from "@/app/lib/api";
import styles from "./contractors.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    eyebrow: "Boulot Man Contractors",
    heroTitle: "Enterprise-Grade Project Execution Across Africa",
    heroCopy: "Boulot Man Contractors is the dedicated execution arm of Boulot Man, designed for enterprises, property developers, institutions, and diaspora clients requiring turnkey multidisciplinary technical delivery through vetted, coordinated teams.",
    btnRequestHero: "Request Project Execution",
    btnCapabilitiesHero: "Explore Our Capabilities",
    heroCardTitle: "One Coordinated Execution Partner",
    heroList: [
      "Turnkey planning, bills of quantities (BOQ) & scope organization.",
      "Rapid mobilization of certified companies, engineers & master artisans.",
      "Procurement, subcontractor management & logistics oversight.",
      "Milestone-based project supervision with daily photo reports.",
      "Strict quality control (QA/QC) & site safety compliance.",
      "B-Pay milestone escrow protection & structured financial release."
    ],
    strip1Num: "100%",
    strip1Label: "Vetted Contractors & Engineers",
    strip2Num: "50+",
    strip2Label: "Multidisciplinary Trades Covered",
    strip3Num: "99.2%",
    strip3Label: "On-Time Milestone Delivery",
    strip4Num: "Pan-African",
    strip4Label: "East, West & Central Africa Footprint",
    
    // Services
    servicesBadge: "Execution Capabilities",
    servicesTitle: "Complete Multidisciplinary Technical Scopes",
    servicesDesc: "From commercial construction and solar microgrids to enterprise IT and planned facility retainers, our coordinated teams handle every phase.",
    
    // Process
    processBadge: "Structured Delivery",
    processTitle: "How We Deliver Your Projects",
    processDesc: "A disciplined 5-stage engineering lifecycle providing absolute transparency from intake to final handover.",

    // Scales
    scalesBadge: "Target Sectors",
    scalesTitle: "Projects of Every Scale & Complexity",
    scalesDesc: "Whether executing institutional infrastructure or private developments, our framework scales seamlessly.",

    // Who it serves
    whoBadge: "Client Profiles",
    whoTitle: "Built For Demanding Stakeholders",
    whoDesc: "Tailored project management workflows for organizations and individuals across the continent and diaspora.",

    // Trust & Payment
    trustBadge: "Financial Security",
    trustTitle: "Milestone Escrow & Controlled Release",
    trustDesc: "Funds are deposited securely and released in verified tranches only after independent inspection.",

    // Form
    formBadge: "Project Review Intake",
    formTitle: "Submit Your Project For Comprehensive Assessment",
    formDesc: "Provide project drawings, scope specifications, and workforce requirements below. Our senior engineering coordinators will evaluate your submission and provide a detailed technical execution proposal within 24–48 hours.",
    
    sec1: "1. Client & Organization Profile",
    labelName: "Your Full Name *",
    phName: "e.g. Jean-Paul M. / Eng. Sarah Adams",
    labelClientType: "Client / Entity Type *",
    labelEmail: "Email Address *",
    phEmail: "lead@organization.com",
    labelPhone: "Phone / WhatsApp (with Country Code) *",
    phPhone: "+250 788 123 456",
    labelCountry: "Project Country *",
    labelCity: "Project City / District *",
    phCity: "e.g. Kigali / Douala / Abidjan / Lagos",

    sec2: "2. Project Classification & Trade Requirements",
    labelTitle: "Project Title / Scope Headline *",
    phTitle: "e.g. 4-Story Commercial Building MEP & Renovation",
    labelCategory: "Primary Engineering Domain *",
    labelPhase: "Current Project Phase *",
    labelTrades: "Key Technical Trades & Specialists Needed (Select all that apply):",

    sec3: "3. On-Site Supervision & Management",
    labelPM: "On-Site Project Management Requirement *",
    pmOpt1Title: "Dedicated On-Site Project Manager / Clerk of Works",
    pmOpt1Sub: "Full daily on-site leadership, quality audits, material tracking & daily photo reporting (Recommended for Diaspora & Large Projects).",
    pmOpt2Title: "Standard Lead Supervisor & Crew Dispatch",
    pmOpt2Sub: "Specialized team lead with milestone inspections and periodic digital progress briefings.",

    sec4: "4. Timelines & Budget Framework",
    labelStart: "Target Mobilization / Start Date *",
    labelDuration: "Estimated Project Duration *",
    labelBudget: "Estimated Investment / Budget Tier *",
    labelPayment: "Milestone Payment Structure Preference *",

    sec5: "5. Scope Narrative & Technical Specifications",
    labelDesc: "Detailed Project Description & Specific Deliverables *",
    phDesc: "Detail the technical scope, bills of quantities (BOQ), site access conditions, existing utilities, and key project deliverables...",

    sec6: "6. Architectural Blueprints, Drawings & RFPs",
    uploadPrompt: "Click to upload Architectural Drawings, CAD/DWG, BOQs, RFPs, or Site Photos (PDF, DWG, DOCX, PNG, ZIP up to 25MB)",
    noFiles: "No blueprints or documents attached yet.",

    btnSubmitting: "Submitting Project Review...",
    btnSubmitted: "✔ Project Review Submitted",
    btnSubmit: "Submit Project for Engineering Review",

    toastWarningTitle: "Incomplete Details",
    toastWarningMsg: "Please fill in all mandatory fields (Name, Email, Phone, Country, City, Project Title, and Description).",
    toastSuccessTitle: "Project Review Request Received!",
    toastSuccessMsg: "Thank you. Our senior project execution director has received your inquiry and will contact you within 24 business hours.",

    finalTitle: "Are You a Vetted Company Interested in Subcontracting?",
    finalDesc: "Licensed technical firms and specialized contractors can join the Boulot Man contractor network for high-value assignments across Africa.",
    btnFinalJoin: "Join as a Certified Company"
  },
  fr: {
    eyebrow: "Boulot Man Contractors",
    heroTitle: "Exécution de Projets Techniques Majeurs à Travers l'Afrique",
    heroCopy: "Boulot Man Contractors est la division d'exécution dédiée aux entreprises, promoteurs, institutions et membres de la diaspora nécessitant une réalisation technique clé en main par des équipes coordonnées et certifiées.",
    btnRequestHero: "Demander une Étude de Projet",
    btnCapabilitiesHero: "Explorer Nos Compétences",
    heroCardTitle: "Votre Partenaire Unique d'Exécution",
    heroList: [
      "Planification clé en main, métrés (devis quantitatif) et cadrage de projet.",
      "Mobilisation rapide d'entreprises, ingénieurs et maîtres artisans qualifiés.",
      "Approvisionnement, gestion des sous-traitants et logistique de chantier.",
      "Supervision par jalons avec rapports photographiques réguliers.",
      "Contrôle qualité strict (QA/QC) et respect des normes de sécurité.",
      "Garantie B-Pay avec séquestre financier et déblocage échelonné sécurisé."
    ],
    strip1Num: "100%",
    strip1Label: "Entreprises & Artisans Vétifiés",
    strip2Num: "50+",
    strip2Label: "Corps d'État Techniques Couverts",
    strip3Num: "99.2%",
    strip3Label: "Respect des Jalons & Délais",
    strip4Num: "Panafricain",
    strip4Label: "Présence en Afrique de l'Est, Ouest et Centrale",

    // Services
    servicesBadge: "Domaines d'Expertise",
    servicesTitle: "Tous Corps d'État & Compétences Pluridisciplinaires",
    servicesDesc: "De la construction de bâtiments aux micro-réseaux solaires, en passant par l'infrastructure réseau et les contrats de maintenance, nos équipes gèrent chaque étape.",

    // Process
    processBadge: "Méthodologie Éprouvée",
    processTitle: "Comment Nous Réalisons Vos Projets",
    processDesc: "Un cycle d'ingénierie rigoureux en 5 étapes garantissant une transparence totale de la prise en charge à la réception finale.",

    // Scales
    scalesBadge: "Types de Projets",
    scalesTitle: "Des Projets de Toute Envergure et Complexité",
    scalesDesc: "Qu'il s'agisse de grandes infrastructures institutionnelles ou de chantiers privés, notre méthodologie s'adapte parfaitement.",

    // Who it serves
    whoBadge: "Profils Clients",
    whoTitle: "Conçu Pour les Exigences des Professionnels",
    whoDesc: "Des processus de gestion de chantier sur mesure pour les entreprises, investisseurs et membres de la diaspora.",

    // Trust & Payment
    trustBadge: "Sécurité Financière",
    trustTitle: "Paiements par Jalons et Déblocage Contrôlé",
    trustDesc: "Les fonds sont sécurisés et ne sont débloqués qu'après validation et inspection des livrables.",

    // Form
    formBadge: "Dossier Technique",
    formTitle: "Soumettez Votre Projet Pour une Évaluation Approfondie",
    formDesc: "Fournissez vos plans, spécifications techniques et besoins en effectifs ci-dessous. Nos ingénieurs coordinateurs évalueront votre dossier et vous transmettront une proposition technique sous 24 à 48 heures.",

    sec1: "1. Profil du Client & Organisation",
    labelName: "Nom Complet *",
    phName: "ex. Jean-Paul M. / Ing. Sarah Adams",
    labelClientType: "Type de Client / Entité *",
    labelEmail: "Adresse Email Professionnelle *",
    phEmail: "contact@organisation.com",
    labelPhone: "Téléphone / WhatsApp (avec Indicatif) *",
    phPhone: "+250 788 123 456",
    labelCountry: "Pays du Projet *",
    labelCity: "Ville / Quartier du Projet *",
    phCity: "ex. Kigali / Douala / Abidjan / Yaoundé",

    sec2: "2. Classification du Projet & Métiers Requis",
    labelTitle: "Titre du Projet / Intitulé *",
    phTitle: "ex. Rénovation et Installation MEP d'un Immeuble Commercial",
    labelCategory: "Domaine Principal d'Ingénierie *",
    labelPhase: "Phase Actuelle du Projet *",
    labelTrades: "Spécialités Techniques Requises (Sélectionnez toutes les options applicables) :",

    sec3: "3. Supervision & Encadrement de Chantier",
    labelPM: "Niveau d'Encadrement Requis *",
    pmOpt1Title: "Chef de Projet Dédié & Conducteur de Travaux sur Site",
    pmOpt1Sub: "Présence quotidienne, contrôle qualité strict, suivi des matériaux et rapports photos réguliers (Recommandé pour la Diaspora et Grands Travaux).",
    pmOpt2Title: "Superviseur d'Équipe Standard & Gestion par Jalons",
    pmOpt2Sub: "Chef d'équipe technique avec contrôles aux étapes clés et points d'avancement numériques.",

    sec4: "4. Calendrier & Cadre Budgétaire",
    labelStart: "Date de Démarrage Prévue *",
    labelDuration: "Durée Estimée des Travaux *",
    labelBudget: "Tranche Budgétaire / Investissement Estimé *",
    labelPayment: "Mode de Paiement par Jalons Préféré *",

    sec5: "5. Descriptif Technique & Cahier des Charges",
    labelDesc: "Description Détaillée & Livrables Attendus *",
    phDesc: "Précisez l'étendue des travaux, les métrés disponibles, les contraintes d'accès au site, les raccordements et les objectifs clés...",

    sec6: "6. Plans Architecturaux, Métrés & Documents Techniques",
    uploadPrompt: "Cliquez pour téléverser plans architecturaux, fichiers CAD/DWG, devis quantitatifs ou photos (PDF, DWG, DOCX, PNG, ZIP jusqu'à 25 Mo)",
    noFiles: "Aucun document ou plan joint pour le moment.",

    btnSubmitting: "Envoi de la Demande en Cours...",
    btnSubmitted: "✔ Demande Transmise avec Succès",
    btnSubmit: "Soumettre le Projet pour Analyse Technique",

    toastWarningTitle: "Informations Incomplètes",
    toastWarningMsg: "Veuillez renseigner tous les champs obligatoires (Nom, Email, Téléphone, Pays, Ville, Titre du Projet et Descriptif).",
    toastSuccessTitle: "Dossier de Projet Réceptionné !",
    toastSuccessMsg: "Merci. Notre direction de l'ingénierie a bien reçu votre demande et vous contactera sous 24 heures ouvrées.",

    finalTitle: "Vous Êtes une Entreprise Qualifiée Souhaitant Sous-Traiter ?",
    finalDesc: "Rejoignez le réseau d'entreprises et d'artisans certifiés Boulot Man pour intervenir sur des chantiers d'envergure en Afrique.",
    btnFinalJoin: "Devenir Entreprise Partenaire"
  }
};

const SERVICES_CAPABILITIES = [
  {
    num: "01",
    title: "Building & Construction",
    titleFr: "Bâtiment & Génie Civil",
    description: "Residential, commercial and institutional construction, structural works, finishing and coordinated site execution.",
    descriptionFr: "Construction résidentielle, commerciale et institutionnelle, gros œuvre, second œuvre et pilotage de chantier."
  },
  {
    num: "02",
    title: "Electrical & High-Voltage Systems",
    titleFr: "Électricité & Courants Forts",
    description: "Industrial power distribution, generators, switchgear, transformer stations, architectural lighting and safety earthing.",
    descriptionFr: "Distribution électrique industrielle, groupes électrogènes, armoires, postes de transformation et éclairage."
  },
  {
    num: "03",
    title: "Plumbing, Hydraulics & Water Systems",
    titleFr: "Plomberie & Réseaux Hydrauliques",
    description: "Pumping stations, water towers, sanitary networks, drainage, treatment facilities, borehole drilling and municipal connections.",
    descriptionFr: "Stations de pompage, châteaux d'eau, réseaux sanitaires, assainissement, forages et raccordements."
  },
  {
    num: "04",
    title: "Mechanical & Industrial HVAC",
    titleFr: "Génie Mécanique & CVC / Climatisation",
    description: "Centralized air conditioning, ventilation, chillers, industrial equipment installation, pumps, motors and predictive maintenance.",
    descriptionFr: "Climatisation centralisée, ventilation, groupes froids, installation d'équipements industriels et maintenance."
  },
  {
    num: "05",
    title: "Solar PV & Commercial Renewable Energy",
    titleFr: "Énergie Solaire & Renouvelable",
    description: "Commercial & industrial rooftop solar, hybrid microgrids, lithium storage systems, inverters and engineering commissioning.",
    descriptionFr: "Centrales solaires industrielles et toitures, micro-réseaux hybrides, stockage lithium et mise en service."
  },
  {
    num: "06",
    title: "Technology & Enterprise IT Infrastructure",
    titleFr: "Infrastructure Réseau & Systèmes IT",
    description: "Structured cabling, data center builds, server rack deployment, fiber backbones, IP surveillance and access control.",
    descriptionFr: "Câblage structuré, salles serveurs, dorsales fibre optique, vidéosurveillance IP et contrôle d'accès."
  },
  {
    num: "07",
    title: "Telecom & Towers Infrastructure",
    titleFr: "Télécoms & Infrastructures Réseaux",
    description: "Telecom tower erection, wireless links, last-mile fiber trenching, VSAT satellite terminals and field telecommunications.",
    descriptionFr: "Érection de pylônes télécoms, faisceaux hertziens, tranchées fibre optique et stations VSAT."
  },
  {
    num: "08",
    title: "Comprehensive Facility Maintenance & Retainers",
    titleFr: "Maintenance Multitechnique & Gestion Immobilière",
    description: "Planned preventive maintenance, rapid corrective dispatch, multi-site technical audits and facilities service agreements.",
    descriptionFr: "Maintenance préventive planifiée, dépannage rapide multi-sites, audits techniques et contrats d'entretien."
  },
  {
    num: "09",
    title: "Specialized Engineering Assignments",
    titleFr: "Missions Spécialisées d'Ingénierie",
    description: "Multidisciplinary custom crews for geotechnical surveys, specialized fabrication, heavy machinery and precision technical setups.",
    descriptionFr: "Équipes pluridisciplinaires sur mesure pour études de sol, chaudronnerie, engins lourds et installations de précision."
  }
];

const PROCESS_STEPS = [
  {
    num: "1",
    title: "Comprehensive Intake & Blueprint Review",
    titleFr: "Évaluation Initiale & Analyse des Plans",
    description: "Boulot Man reviews your architectural drawings, bills of quantities, technical requirements, site constraints and timeline.",
    descriptionFr: "Analyse complète de vos plans, métrés, contraintes de chantier, budget et délais attendus."
  },
  {
    num: "2",
    title: "Scope Partitioning & Crew Mobilization",
    titleFr: "Découpage & Mobilisation des Équipes",
    description: "The project is structured into clear work packages and vetted specialist firms, engineers and artisans are assembled.",
    descriptionFr: "Structuration du chantier par lots et sélection des entreprises, ingénieurs et artisans certifiés."
  },
  {
    num: "3",
    title: "Milestone Contract & Escrow Setup",
    titleFr: "Contrat par Jalons & Sécurisation B-Pay",
    description: "Deliverables, schedules, payment tranches, inspection criteria and warranty terms are formalized with milestone protection.",
    descriptionFr: "Formalisation des livrables, calendrier d'exécution, tranches de paiement et critères de validation."
  },
  {
    num: "4",
    title: "On-Site Execution & Continuous Supervision",
    titleFr: "Exécution sur Site & Contrôle Quotidien",
    description: "Crews mobilize with dedicated project management, rigorous QA/QC inspections and daily digital photo progress updates.",
    descriptionFr: "Démarrage des travaux avec encadrement de chantier, audits réguliers et rapports photos d'avancement."
  },
  {
    num: "5",
    title: "Commissioning, Punch List & Quality Handover",
    titleFr: "Réception Finale & Levée des Réserves",
    description: "Every technical system is tested, final punch-list items are resolved, and as-built documentation is handed over.",
    descriptionFr: "Tests de conformité, levée des réserves et remise des plans de récolement et garanties d'achèvement."
  }
];

const AVAILABLE_TRADES = [
  "Civil Engineers & Site Masons",
  "Certified Master Electricians",
  "Licensed Hydraulic & Plumbing Techs",
  "HVAC & Industrial Cooling Techs",
  "Solar PV Engineers & Installers",
  "Fiber Optic & IT Network Specialists",
  "Structural Steel & Welding Techs",
  "Carpentry, Tiling & Finishing Crews",
  "Health, Safety & Environment (HSE) Officers",
  "Certified QA / QC Site Inspectors"
];

export default function ContractorsPage() {
  const toast = useToast();
  const [lang, setLang] = useState("en");

  const [formData, setFormData] = useState({
    clientName: "",
    clientType: "Corporation / Enterprise",
    email: "",
    phone: "",
    country: "Rwanda",
    city: "",
    projectTitle: "",
    category: "Building Construction & Renovation",
    projectPhase: "Full Turnkey Execution (Start to Finish)",
    tradesRequired: ["Civil Engineers & Site Masons", "Certified Master Electricians"] as string[],
    projectManagerRequired: "Dedicated On-Site Project Manager / Clerk of Works",
    startDate: "Immediate (Within 7-14 Days)",
    duration: "1 to 3 Months",
    budget: "$25,000 – $100,000 (Standard Execution)",
    paymentPreference: "B-Pay Milestone Escrow (Protected Tranches)",
    description: ""
  });

  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number; type: string; data: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const toggleTrade = (trade: string) => {
    setFormData((prev) => ({
      ...prev,
      tradesRequired: prev.tradesRequired.includes(trade)
        ? prev.tradesRequired.filter((t) => t !== trade)
        : [...prev.tradesRequired, trade]
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.projectTitle.trim() || !formData.description.trim()) {
      toast.warning(t.toastWarningTitle, t.toastWarningMsg);
      return;
    }

    setSubmitting(true);

    const attachedNames = attachedFiles.map((f) => f.name);

    const detailsBody = `[Contractor Project Execution Review]
Project Title: ${formData.projectTitle}
Client Name: ${formData.clientName}
Client Type: ${formData.clientType}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.city}, ${formData.country}

=== 1. Project Domain & Phase ===
Primary Category: ${formData.category}
Current Phase: ${formData.projectPhase}
Required Trades: ${formData.tradesRequired.length > 0 ? formData.tradesRequired.join(", ") : "Multi-Trade General Crew"}

=== 2. On-Site Supervision & Management ===
Management Requirement: ${formData.projectManagerRequired}

=== 3. Timelines & Financial Framework ===
Target Start: ${formData.startDate}
Estimated Duration: ${formData.duration}
Budget Tier: ${formData.budget}
Payment Structure: ${formData.paymentPreference}

=== 4. Technical Scope & Specifications ===
${formData.description}

=== 5. Blueprints & RFP Attachments ===
Attachments: ${attachedNames.length > 0 ? attachedNames.join(", ") : "None attached"}`;

    const inquiryPayload = {
      id: `CTR-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      name: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      clientType: formData.clientType,
      country: formData.country,
      city: formData.city,
      category: formData.category,
      projectTitle: formData.projectTitle,
      budget: formData.budget,
      duration: formData.duration,
      details: detailsBody,
      attached_files: attachedFiles,
      status: "Pending Review"
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("boulotman_contractor_inquiries") || "[]");
        localStorage.setItem("boulotman_contractor_inquiries", JSON.stringify([inquiryPayload, ...existing]));
      } catch (err) {
        console.error("Local storage sync error", err);
      }
    }

    try {
      await Promise.allSettled([
        api.submitInquiry({
          name: formData.clientName,
          email: formData.email,
          phone: formData.phone,
          company_name: `${formData.clientType} - ${formData.projectTitle}`.trim(),
          inquiry_type: "enterprise",
          details: detailsBody
        }),
        api.createSupportTicket({
          subject: `[Contractor Project] ${formData.projectTitle} - ${formData.clientName} (${formData.country})`,
          body: detailsBody
        })
      ]);

      setSubmitted(true);
      toast.success(t.toastSuccessTitle, t.toastSuccessMsg);
    } catch (err) {
      setSubmitted(true);
      toast.success(t.toastSuccessTitle, t.toastSuccessMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}>{t.eyebrow}</div>
              <h1>{t.heroTitle}</h1>
              <p className={styles.heroCopy}>{t.heroCopy}</p>
              <div className={styles.heroActions}>
                <a href="#request-project" className={`${styles.btn} ${styles.btnPrimary}`}>
                  {t.btnRequestHero}
                </a>
                <a href="#services" className={`${styles.btn} ${styles.btnSecondary}`}>
                  {t.btnCapabilitiesHero}
                </a>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <h2>{t.heroCardTitle}</h2>
              <ul className={styles.heroList}>
                {t.heroList.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introItem}>
              <strong>{t.strip1Num}</strong>
              <span>{t.strip1Label}</span>
            </div>
            <div className={styles.introItem}>
              <strong>{t.strip2Num}</strong>
              <span>{t.strip2Label}</span>
            </div>
            <div className={styles.introItem}>
              <strong>{t.strip3Num}</strong>
              <span>{t.strip3Label}</span>
            </div>
            <div className={styles.introItem}>
              <strong>{t.strip4Num}</strong>
              <span>{t.strip4Label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES & CAPABILITIES */}
      <section className={styles.section} id="services">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{t.servicesBadge}</span>
            <h2 className={styles.title}>{t.servicesTitle}</h2>
            <p className={styles.sectionDesc}>{t.servicesDesc}</p>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES_CAPABILITIES.map((srv, idx) => (
              <article key={idx} className={styles.serviceCard}>
                <div className={styles.serviceNum}>{srv.num}</div>
                <h3>{lang === "fr" ? srv.titleFr : srv.title}</h3>
                <p>{lang === "fr" ? srv.descriptionFr : srv.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>{t.processBadge}</span>
            <h2 className={styles.title}>{t.processTitle}</h2>
            <p className={styles.sectionDesc}>{t.processDesc}</p>
          </div>

          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step, idx) => (
              <article key={idx} className={styles.processCard}>
                <div className={styles.processStep}>{step.num}</div>
                <h3>{lang === "fr" ? step.titleFr : step.title}</h3>
                <p>{lang === "fr" ? step.descriptionFr : step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INTAKE / REQUEST FORM */}
      <section className={styles.requestSection} id="request-project">
        <div className={styles.container}>
          <div className={styles.requestGrid}>
            <div className={styles.requestCopy}>
              <span className={styles.sectionBadge} style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}>
                {t.formBadge}
              </span>
              <h2>{t.formTitle}</h2>
              <p>{t.formDesc}</p>

              <ul className={styles.requestPoints}>
                <li>Construction, civil engineering and renovation developments</li>
                <li>Commercial electrical, high-voltage substations & solar plants</li>
                <li>Industrial mechanical installations, HVAC & piping networks</li>
                <li>Enterprise IT cabling, data rooms & telecom tower sites</li>
                <li>Remote diaspora oversight with full milestone escrow security</li>
              </ul>
            </div>

            <form className={styles.formCard} onSubmit={handleSubmit}>
              <h3>{t.formTitle}</h3>
              <p>{t.formDesc}</p>

              {submitted && (
                <div className={styles.successMsg}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 24, color: "#10b981", flexShrink: 0 }} />
                  <div>
                    <strong>{t.toastSuccessTitle}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 13.5 }}>{t.toastSuccessMsg}</p>
                  </div>
                </div>
              )}

              {/* SECTION 1: Client & Org */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:user" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec1}</span>
                  </div>
                  <span className={styles.blockBadge}>Entity Info</span>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>{t.labelName}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.phName}
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelClientType}</label>
                    <select
                      value={formData.clientType}
                      onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    >
                      <option>Corporation / Enterprise</option>
                      <option>Property Developer / General Contractor</option>
                      <option>Individual / Property Owner</option>
                      <option>Diaspora Investor / Remote Owner</option>
                      <option>NGO / International Organization</option>
                      <option>Institution / Public Agency</option>
                      <option>SME / Commercial Business</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelEmail}</label>
                    <input
                      type="email"
                      required
                      placeholder={t.phEmail}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelPhone}</label>
                    <input
                      type="tel"
                      required
                      placeholder={t.phPhone}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelCountry}</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option>Rwanda</option>
                      <option>Cameroon</option>
                      <option>Ivory Coast (Côte d'Ivoire)</option>
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>Senegal</option>
                      <option>DR Congo</option>
                      <option>South Africa</option>
                      <option>Other African Region</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelCity}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.phCity}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Project Classification & Trades */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:layers" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec2}</span>
                  </div>
                  <span className={styles.blockBadge}>Scope Matrix</span>
                </div>

                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label>{t.labelTitle}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.phTitle}
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelCategory}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Building Construction & Renovation</option>
                      <option>Electrical & High-Voltage Infrastructure</option>
                      <option>Plumbing & Municipal Water Systems</option>
                      <option>Mechanical, Industrial & HVAC</option>
                      <option>Solar PV & Commercial Renewable Energy</option>
                      <option>Telecom & Fiber Network Deployments</option>
                      <option>IT Systems & Enterprise Digital Infrastructure</option>
                      <option>Comprehensive Facility Maintenance & Retainers</option>
                      <option>Specialized Multi-Disciplinary Engineering</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelPhase}</label>
                    <select
                      value={formData.projectPhase}
                      onChange={(e) => setFormData({ ...formData, projectPhase: e.target.value })}
                    >
                      <option>Full Turnkey Execution (Start to Finish)</option>
                      <option>Architectural Drawings & Pre-Feasibility</option>
                      <option>Groundwork, Foundation & Core Structural</option>
                      <option>MEP Installations & Technical Fit-Out</option>
                      <option>Interior / Exterior Finishing & Renovation</option>
                      <option>Commissioning, Handover & Punch List</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label>{t.labelTrades}</label>
                    <div className={styles.pillGrid}>
                      {AVAILABLE_TRADES.map((trade, idx) => {
                        const isSelected = formData.tradesRequired.includes(trade);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleTrade(trade)}
                            className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ""}`}
                          >
                            <iconify-icon icon={isSelected ? "lucide:check-square" : "lucide:square"} />
                            <span>{trade}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Supervision */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec3}</span>
                  </div>
                  <span className={styles.blockBadge}>Oversight</span>
                </div>

                <div className={styles.radioCardGrid}>
                  <div
                    className={`${styles.radioCard} ${
                      formData.projectManagerRequired.includes("Dedicated") ? styles.radioCardSelected : ""
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        projectManagerRequired: "Dedicated On-Site Project Manager / Clerk of Works"
                      })
                    }
                  >
                    <div className={styles.radioCardTitle}>
                      <iconify-icon icon="lucide:hard-hat" style={{ color: "#ff4500" }} />
                      <span>{t.pmOpt1Title}</span>
                    </div>
                    <div className={styles.radioCardSub}>{t.pmOpt1Sub}</div>
                  </div>

                  <div
                    className={`${styles.radioCard} ${
                      !formData.projectManagerRequired.includes("Dedicated") ? styles.radioCardSelected : ""
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        projectManagerRequired: "Standard Lead Supervisor & Crew Dispatch"
                      })
                    }
                  >
                    <div className={styles.radioCardTitle}>
                      <iconify-icon icon="lucide:users" style={{ color: "#ff4500" }} />
                      <span>{t.pmOpt2Title}</span>
                    </div>
                    <div className={styles.radioCardSub}>{t.pmOpt2Sub}</div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Timelines & Budget */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:clock-4" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec4}</span>
                  </div>
                  <span className={styles.blockBadge}>Commercial Terms</span>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>{t.labelStart}</label>
                    <select
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    >
                      <option>Immediate (Within 7-14 Days)</option>
                      <option>Within 1 Month</option>
                      <option>Planned Q1 / Q2 Rollout</option>
                      <option>Flexible / Tender Stage</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelDuration}</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    >
                      <option>Under 1 Month</option>
                      <option>1 to 3 Months</option>
                      <option>3 to 6 Months</option>
                      <option>6 to 12+ Months (Multi-Stage)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelBudget}</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option>$5,000 – $25,000 (Initial Scope)</option>
                      <option>$25,000 – $100,000 (Standard Execution)</option>
                      <option>$100,000 – $500,000 (Major Commercial)</option>
                      <option>$500,000+ (Large-Scale Infrastructure)</option>
                      <option>Tender / Under Estimation</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.labelPayment}</label>
                    <select
                      value={formData.paymentPreference}
                      onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                    >
                      <option>B-Pay Milestone Escrow (Protected Tranches)</option>
                      <option>Mobilization Advance + Progress QA Tranches</option>
                      <option>Commercial Letter of Credit / Retainer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Scope Description */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:file-text" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec5}</span>
                  </div>
                  <span className={styles.blockBadge}>Technical Narrative</span>
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelDesc}</label>
                  <textarea
                    required
                    placeholder={t.phDesc}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION 6: Blueprints & Uploads */}
              <div className={styles.formBlock}>
                <div className={styles.blockHeader}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span>{t.sec6}</span>
                  </div>
                  <span className={styles.blockBadge}>Drawings & RFPs</span>
                </div>

                <label className={styles.uploadZone}>
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept=".pdf,.dwg,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  />
                  <iconify-icon icon="lucide:upload-cloud" className={styles.uploadIcon} />
                  <span className={styles.uploadText}>{t.uploadPrompt}</span>
                  <span className={styles.uploadSub}>PDF, DWG, DOCX, PNG, JPG, ZIP (Max 25MB per file)</span>
                </label>

                {attachedFiles.length > 0 ? (
                  <div className={styles.fileList}>
                    {attachedFiles.map((file, idx) => (
                      <span key={idx} className={styles.fileBadge}>
                        📎 {file.name}
                        <span className={styles.fileRemove} onClick={() => removeFile(idx)}>
                          ✕
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: "10px 0 0 0" }}>{t.noFiles}</p>
                )}
              </div>

              <button type="submit" disabled={submitting || submitted} className={styles.submitBtn}>
                {submitting ? (
                  <>
                    <iconify-icon icon="lucide:loader-2" className="spin" />
                    <span>{t.btnSubmitting}</span>
                  </>
                ) : submitted ? (
                  <>
                    <iconify-icon icon="lucide:check-circle" />
                    <span>{t.btnSubmitted}</span>
                  </>
                ) : (
                  <>
                    <iconify-icon icon="lucide:send" />
                    <span>{t.btnSubmit}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalSection}>
        <div className={styles.container}>
          <div className={styles.finalCard}>
            <div className={styles.finalCopy}>
              <h2>{t.finalTitle}</h2>
              <p>{t.finalDesc}</p>
            </div>
            <Link href="/signup?role=company" className={`${styles.btn} ${styles.btnPrimary}`}>
              {t.btnFinalJoin}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
