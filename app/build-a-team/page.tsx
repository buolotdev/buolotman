"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import styles from "./build-team.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Build a Team",
    heroDesc: "Your on-demand technical workforce. Boulot Man assembles, deploys, and manages complete teams of verified professionals for construction, engineering, IT, renovation, and large-scale projects.",
    section1Title: "What Is Build a Team?",
    section1DescStart: "Build a Team is a structured Boulot Man service that allows clients to hire ",
    section1DescStrong: "ready-made, coordinated technical teams",
    section1DescEnd: " instead of managing individuals. It is ideal for projects that require multiple skills, long duration, or strict supervision.",
    card1Title: "Who It’s For",
    card1List: ["Homeowners & property developers", "Construction companies", "SMEs & startups", "NGOs & institutions", "Hotels & real estate owners", "Diaspora managing projects remotely"],
    card2Title: "What Problems It Solves",
    card2List: ["Zero recruitment headache", "Dedicated supervision & leadership", "Strict timeline control", "Single point of accountability", "Transparent milestone pricing"],
    card3Title: "Team Types Available",
    card3List: ["Electrical & Power Teams", "Plumbing & Sanitation Crews", "Civil Construction & Renovation", "IT & Network Infrastructure", "Solar & Renewable Energy", "Cross-Functional Squads"],
    howTitle: "How It Works",
    step1: "Submit your project requirements and squad specifications",
    step2: "Boulot Man structures your custom team composition",
    step3: "Verified professionals and team leads are assigned",
    step4: "On-site deployment, schedule coordination & kick-off",
    step5: "Continuous supervision, milestones & progress reports",
    step6: "Final inspection, handover, and quality warranty",
    pricingTitle: "Pricing & Engagement Models",
    pricing1Title: "Per-Professional Rates",
    pricing1Desc: "Daily or weekly rates per specialist for flexible workforce additions.",
    pricing2Title: "Fixed Team Contract",
    pricing2Desc: "All-inclusive fixed milestone budget for clearly defined project scopes.",
    pricing3Title: "Monthly Managed Retainer",
    pricing3Desc: "Dedicated ongoing technical workforce for enterprises and facilities.",
    compareTitle: "Concierge vs. Build a Team",
    thFeature: "Feature",
    thConcierge: "Concierge",
    thBuildTeam: "Build a Team",
    row1Type: "Service Model",
    row1C: "Turnkey project coordination",
    row1B: "Complete workforce deployment",
    row2Size: "Team Size",
    row2C: "1–2 technicians",
    row2B: "3 to 50+ engineers & artisans",
    row3Dur: "Duration",
    row3C: "Short & urgent tasks",
    row3B: "Multi-week to long-term retainers",
    row4Sup: "Supervision",
    row4C: "Concierge Coordinator",
    row4B: "On-site Project Manager / Team Lead",
    row5Best: "Best For",
    row5C: "Home repairs & minor fixes",
    row5B: "Construction, commercial & infrastructure",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "How fast can a full team be deployed?",
        a: "Depending on team size and location, deployment typically happens within 24 to 72 hours."
      },
      {
        q: "Are team members verified and tested?",
        a: "Yes. All team members are ID-verified, skill-assessed, and rated."
      },
      {
        q: "Can diaspora clients manage remotely?",
        a: "Yes. Reports, photos, and updates are provided remotely."
      }
    ],
    ctaTitle: "Build Your Team Today",
    ctaDesc: "Whether it’s a renovation, installation, or full project, Boulot Man gives you a ready workforce — fast, verified, and managed.",
    ctaBtn: "Request a Team",
    modalTitle: "Request a Technical Team",
    modalSub: "Specify your project needs and workforce requirements. Boulot Man will assemble, structure, and dispatch your verified team.",
    
    // Intake Sections
    sec1Title: "1. Team Scale & Structure",
    sec1Badge: "Core Request",
    reqTypeIndividual: "Individual Expert",
    reqTypeIndividualDesc: "Single concierge, engineer, or technician",
    reqTypeSquad: "Dedicated Team / Squad",
    reqTypeSquadDesc: "Multiple cross-functional professionals working together",
    labelTeamSize: "Estimated Team Size *",
    sizeOpt1: "2–3 people (Small Squad)",
    sizeOpt2: "4–7 people (Standard Crew)",
    sizeOpt3: "8+ people (Large Workforce)",
    pmToggleTitle: "Do you require a dedicated Project Manager / Team Lead on-site?",
    pmToggleSub: "Recommended for diaspora & remote owners needing a single point of accountability.",

    sec2Title: "2. Roles & Skills Matrix",
    sec2Badge: "Dynamic Checklist",
    labelCategory: "Primary Project Category *",
    catCivil: "Civil Engineering, Construction & Architecture",
    catTech: "Technology, Networks & Systems",
    catMaintenance: "Handyman, Electrical & Maintenance",
    catSolar: "Solar PV, Power & Renewable Energy",
    catOther: "Multi-Disciplinary / Custom Team",
    rolesTitle: "Specific Roles Needed in Squad (Select all that apply):",
    
    // Civil Roles
    roleCivil1: "Lead Site Engineer / Owner's Rep",
    roleCivil2: "Quantity Surveyor (Material Costing)",
    roleCivil3: "Quality Assurance (QA) Inspectors",
    roleCivil4: "General Masons / Specialized Artisans",

    // Tech Roles
    roleTech1: "IT Solutions Architect",
    roleTech2: "Network / Cabling Engineers",
    roleTech3: "Systems Administrators",
    roleTech4: "Software / DevOps Engineers",

    // Maintenance Roles
    roleMaint1: "Multi-skilled Technicians",
    roleMaint2: "Certified Electricians",
    roleMaint3: "Industrial Plumbers",
    roleMaint4: "HVAC / Cooling Specialists",

    // Solar Roles
    roleSolar1: "Solar PV Design Engineer",
    roleSolar2: "High-Voltage Electrician",
    roleSolar3: "Inverter / Battery Specialist",
    roleSolar4: "Safety & Compliance Officer",

    // Other Roles
    roleOther1: "Master Carpenter & Joiner",
    roleOther2: "Structural Steel Welder",
    roleOther3: "Professional Painter & Plasterer",
    roleOther4: "Site Safety / Security Officer",

    sec3Title: "3. Team Logistics & Duration",
    sec3Badge: "Commitment & Presence",
    labelDuration: "Deployment Duration *",
    durOpt1: "One-off Day Project (Emergency site audit / rapid rollout)",
    durOpt2: "Short-term (1 to 4 weeks)",
    durOpt3: "Medium-term (1 to 6 months)",
    durOpt4: "Long-term Retainer (6+ months / Ongoing site management)",
    labelArrangement: "Working Arrangement *",
    arrOpt1: "Full-time On-site (Daily physical presence)",
    arrOpt2: "Part-time / Rotational (Specified days per week)",
    arrOpt3: "Hybrid (Remote management with weekly physical site inspections)",

    sec4Title: "4. Workspace & Equipment Readiness",
    sec4Badge: "Logistics & Welfare",
    labelEquip: "Tools & Heavy Machinery *",
    equipOpt1: "Boulot Man should fully equip the team.",
    equipOpt2: "The site / client will provide necessary tools and heavy equipment.",
    labelWelfare: "Site Welfare & Access Readiness (Check all that apply):",
    welfareOpt1: "Secure storage available on-site for tools & materials.",
    welfareOpt2: "Power and water supply are active on-site.",
    welfareOpt3: "Permits and local authorizations are already cleared.",

    secContactTitle: "Client & Contact Details",
    labelName: "Your Full Name *",
    labelEmail: "Email Address *",
    labelPhone: "Phone / WhatsApp Number *",
    labelLocation: "Project Location / City *",
    labelDetails: "Project Scope & Additional Requirements",
    placeholderDetails: "Describe project scope, site conditions, certifications, special materials or deadlines...",
    btnSubmit: "Submit Team Request",
    btnSubmitting: "Submitting Team Request...",
    modalSuccess: "Your team request has been submitted successfully! A Boulot Man operations coordinator will contact you shortly."
  },
  fr: {
    heroTitle: "Créer une Équipe",
    heroDesc: "Votre main-d'œuvre technique sur mesure. Boulot Man compose, déploie et supervise des équipes complètes de professionnels vérifiés pour la construction, l'ingénierie, l'IT, la rénovation et les chantiers d'envergure.",
    section1Title: "Qu'est-ce que le service Créer une Équipe ?",
    section1DescStart: "Le service Créer une Équipe est une solution structurée Boulot Man permettant de recruter des ",
    section1DescStrong: "équipes techniques coordonnées et prêtes à l'emploi",
    section1DescEnd: " au lieu de gérer chaque intervenant individuellement. Idéal pour les projets complexes, de longue durée ou nécessitant un encadrement strict.",
    card1Title: "À qui cela s'adresse",
    card1List: ["Propriétaires & promoteurs immobiliers", "Entreprises du BTP & Génie civil", "PME & Startups en expansion", "ONG & institutions", "Hôtels & gestionnaires d'actifs", "Diaspora gérant des chantiers à distance"],
    card2Title: "Avantages & Solutions",
    card2List: ["Zéro stress de recrutement", "Encadrement et supervision continue", "Délais respectés et optimisés", "Responsabilité claire et unique", "Coûts maîtrisés et transparents"],
    card3Title: "Types d'équipes disponibles",
    card3List: ["Équipes Électriciens", "Équipes Plombiers & Sanitaires", "Équipes BTP & Rénovation", "Équipes Réseaux & Informatique", "Équipes Énergie Solaire & Renouvelable", "Équipes Multidisciplinaires"],
    howTitle: "Comment ça fonctionne",
    step1: "Soumission du cahier des charges et des besoins",
    step2: "Conception de la structure de l'équipe par Boulot Man",
    step3: "Sélection des techniciens et chefs d'équipe qualifiés",
    step4: "Déploiement, planning et coordination sur site",
    step5: "Supervision, rapports d'avancement et suivi",
    step6: "Fin de chantier, livraison et garantie",
    pricingTitle: "Modèles de Tarification",
    pricing1Title: "Paiement par Technicien",
    pricing1Desc: "Tarifs journaliers ou hebdomadaires pour renfort ponctuel.",
    pricing2Title: "Forfait par Équipe",
    pricing2Desc: "Budget fixe tout compris pour chantiers définis.",
    pricing3Title: "Contrat / Régie Mensuelle",
    pricing3Desc: "Mise à disposition continue pour entreprises & institutions.",
    compareTitle: "Conciergerie vs Créer une Équipe",
    thFeature: "Caractéristique",
    thConcierge: "Conciergerie",
    thBuildTeam: "Créer une Équipe",
    row1Type: "Type de service",
    row1C: "Gestion clé en main",
    row1B: "Main-d'œuvre complète",
    row2Size: "Taille d'équipe",
    row2C: "1 à 2 techniciens",
    row2B: "3 à 50+ ouvriers & ingénieurs",
    row3Dur: "Durée",
    row3C: "Missions courtes & urgentes",
    row3B: "Plusieurs jours / Long terme",
    row4Sup: "Supervision",
    row4C: "Coordinateur Concierge",
    row4B: "Chef d'équipe / Conducteur de travaux",
    row5Best: "Idéal pour",
    row5C: "Domiciles & petits commerces",
    row5B: "Grands projets & chantiers",
    faqTitle: "Foire Aux Questions",
    faqs: [
      {
        q: "En combien de temps l'équipe est-elle déployée ?",
        a: "Généralement entre 1h et 24h selon l'effectif demandé et la localisation."
      },
      {
        q: "Les ouvriers et techniciens sont-ils vérifiés ?",
        a: "Oui. Tous les membres d'équipe sont contrôlés (identité, qualifications et avis clients)."
      },
      {
        q: "La diaspora peut-elle superviser le chantier à distance ?",
        a: "Absolument. Rapports réguliers, photos, vidéos et suivi en temps réel sont fournis."
      }
    ],
    ctaTitle: "Constituez Votre Équipe Aujourd'hui",
    ctaDesc: "Rénovation, installation industrielle ou construction : bénéficiez d'une main-d'œuvre prête à intervenir, vérifiée et encadrée.",
    ctaBtn: "Demander une Équipe",
    modalTitle: "Demander une Équipe Technique",
    modalSub: "Précisez vos besoins et votre cahier des charges. Boulot Man assemble, structure et déploie votre équipe sur site.",
    
    // Intake Sections FR
    sec1Title: "1. Structure & Échelle de l'Équipe",
    sec1Badge: "Besoin Principal",
    reqTypeIndividual: "Expert Individuel",
    reqTypeIndividualDesc: "Concierge, ingénieur ou technicien spécialisé unique",
    reqTypeSquad: "Équipe Dédiée / Escouade",
    reqTypeSquadDesc: "Plusieurs professionnels coordonnés travaillant ensemble",
    labelTeamSize: "Taille d'Équipe Estimée *",
    sizeOpt1: "2 à 3 personnes (Petite Escouade)",
    sizeOpt2: "4 à 7 personnes (Équipe Standard)",
    sizeOpt3: "8+ personnes (Effectif Important)",
    pmToggleTitle: "Avez-vous besoin d'un Chef de Projet / Team Lead dédié sur site ?",
    pmToggleSub: "Recommandé pour la diaspora et la supervision clé en main avec un responsable unique.",

    sec2Title: "2. Rôles & Matrice de Compétences",
    sec2Badge: "Checklist Dynamique",
    labelCategory: "Corps de Métier Principal *",
    catCivil: "BTP, Génie Civil, Maçonnerie & Architecture",
    catTech: "Technologies, Réseaux & Systèmes IT",
    catMaintenance: "Maintenance Générale, Électricité & Plomberie",
    catSolar: "Solaire PV, Énergie & Réseaux Électriques",
    catOther: "Équipe Multidisciplinaire / Sur Mesure",
    rolesTitle: "Profils spécifiques requis pour votre escouade :",

    // Civil Roles FR
    roleCivil1: "Ingénieur de Chantier / Représentant Maître d'Ouvrage",
    roleCivil2: "Métreur / Vérificateur des Coûts Matériaux",
    roleCivil3: "Contrôleurs Qualité (QA/QC)",
    roleCivil4: "Maçons Qualifiés / Artisans Spécialisés",

    // Tech Roles FR
    roleTech1: "Architecte Solutions IT",
    roleTech2: "Ingénieurs Réseaux & Câblage",
    roleTech3: "Administrateurs Systèmes",
    roleTech4: "Ingénieurs Logiciel & DevOps",

    // Maintenance Roles FR
    roleMaint1: "Techniciens Polyvalents",
    roleMaint2: "Électriciens Certifiés",
    roleMaint3: "Plombiers Industriels",
    roleMaint4: "Frigoristes & Spécialistes CVC",

    // Solar Roles FR
    roleSolar1: "Ingénieur Dimensionnement Solaire PV",
    roleSolar2: "Électricien Haute/Basse Tension",
    roleSolar3: "Spécialiste Onduleurs & Batteries",
    roleSolar4: "Responsable Sécurité & Conformité",

    // Other Roles FR
    roleOther1: "Maître Menuisier / Boiserie",
    roleOther2: "Soudeur Charpentes Métalliques",
    roleOther3: "Peintre Professionnel & Plaquiste",
    roleOther4: "Agent de Sécurité & Gardiennage Chantier",

    sec3Title: "3. Logistique & Durée du Déploiement",
    sec3Badge: "Engagement & Présence",
    labelDuration: "Durée de la Mission *",
    durOpt1: "Mission Ponctuelle (Audit d'urgence / Déploiement rapide 1 jour)",
    durOpt2: "Court Terme (1 à 4 Semaines)",
    durOpt3: "Moyen Terme (1 à 6 Mois)",
    durOpt4: "Contrat Continu / Régie (6+ Mois / Gestion permanente)",
    labelArrangement: "Mode d'Intervention *",
    arrOpt1: "Temps Plein sur Site (Présence physique quotidienne)",
    arrOpt2: "Temps Partiel / Rotation (Jours déterminés par semaine)",
    arrOpt3: "Hybride (Gestion à distance avec visites hebdomadaires sur site)",

    sec4Title: "4. Outillage & Préparation du Site",
    sec4Badge: "Logistique & Chantier",
    labelEquip: "Outillage & Équipements Lourds *",
    equipOpt1: "Boulot Man doit équiper entièrement l'équipe.",
    equipOpt2: "Le site / client fournit les outils nécessaires et engins.",
    labelWelfare: "État du Chantier & Accès (Cochez ce qui s'applique) :",
    welfareOpt1: "Espace de stockage sécurisé disponible pour outils & matériaux.",
    welfareOpt2: "Alimentation eau et électricité active sur place.",
    welfareOpt3: "Autorisations administratives et permis déjà validés.",

    secContactTitle: "Coordonnées du Demandeur",
    labelName: "Nom et Prénom *",
    labelEmail: "Adresse E-mail *",
    labelPhone: "Numéro Téléphone / WhatsApp *",
    labelLocation: "Localisation du Projet / Ville *",
    labelDetails: "Cahier des Charges & Exigences Particulières",
    placeholderDetails: "Décrivez l'envergure du projet, l'état du site, les certifications requises et délais attendus...",
    btnSubmit: "Envoyer la Demande d'Équipe",
    btnSubmitting: "Envoi en cours...",
    modalSuccess: "Votre demande d'équipe a été soumise avec succès ! Un coordinateur d'opérations Boulot Man vous contactera rapidement."
  }
};

export default function BuildATeamPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lang, setLang] = useState("en");

  // Request a Team Modal State
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Structured Intake State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    request_type: "squad", // "individual" | "squad"
    team_size: "4–7 people (Standard Crew)",
    pm_lead_required: true,
    primary_category: "civil", // "civil" | "tech" | "maintenance" | "solar" | "other"
    roles: ["Lead Site Engineer / Owner's Rep", "Quality Assurance (QA) Inspectors"],
    duration: "Short-term (1 to 4 weeks)",
    working_arrangement: "Full-time On-site (Daily physical presence)",
    equipment_provision: "Boulot Man should fully equip the team.",
    site_welfare: ["Secure storage available on-site for tools & materials.", "Power and water supply are active on-site."],
    details: ""
  });

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Toggle roles selection
  const handleToggleRole = (roleText: string) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(roleText);
      return {
        ...prev,
        roles: exists ? prev.roles.filter((r) => r !== roleText) : [...prev.roles, roleText]
      };
    });
  };

  // Toggle site welfare selection
  const handleToggleWelfare = (welfareText: string) => {
    setFormData((prev) => {
      const exists = prev.site_welfare.includes(welfareText);
      return {
        ...prev,
        site_welfare: exists ? prev.site_welfare.filter((w) => w !== welfareText) : [...prev.site_welfare, welfareText]
      };
    });
  };

  // Get dynamic roles checklist based on category
  const getRolesForCategory = () => {
    switch (formData.primary_category) {
      case "civil":
        return [t.roleCivil1, t.roleCivil2, t.roleCivil3, t.roleCivil4];
      case "tech":
        return [t.roleTech1, t.roleTech2, t.roleTech3, t.roleTech4];
      case "maintenance":
        return [t.roleMaint1, t.roleMaint2, t.roleMaint3, t.roleMaint4];
      case "solar":
        return [t.roleSolar1, t.roleSolar2, t.roleSolar3, t.roleSolar4];
      case "other":
      default:
        return [t.roleOther1, t.roleOther2, t.roleOther3, t.roleOther4];
    }
  };

  const getCategoryLabel = () => {
    switch (formData.primary_category) {
      case "civil": return t.catCivil;
      case "tech": return t.catTech;
      case "maintenance": return t.catMaintenance;
      case "solar": return t.catSolar;
      default: return t.catOther;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const categoryLabel = getCategoryLabel();
    const reqTypeLabel = formData.request_type === "individual" ? "👤 Individual Expert" : "👥 Dedicated Team / Squad";
    const pmLabel = formData.pm_lead_required ? "Yes (Dedicated Lead on-site)" : "No (Direct Client Supervision)";

    const detailsBody = `[Build a Team Request]
Client Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}

=== 1. Team Scale & Structure ===
Request Type: ${reqTypeLabel}
Team Size: ${formData.request_type === "individual" ? "1 Specialist" : formData.team_size}
On-Site PM / Team Lead: ${pmLabel}

=== 2. Roles & Skills Matrix ===
Category: ${categoryLabel}
Roles Needed: ${formData.roles.length > 0 ? formData.roles.join(", ") : "Standard Project Crew"}

=== 3. Logistics & Duration ===
Deployment Duration: ${formData.duration}
Working Arrangement: ${formData.working_arrangement}

=== 4. Workspace & Equipment Readiness ===
Equipment Provision: ${formData.equipment_provision}
Site Readiness: ${formData.site_welfare.length > 0 ? formData.site_welfare.join(" | ") : "Standard site readiness"}

=== Scope & Additional Requirements ===
${formData.details || "No additional notes specified."}`;

    const inquiryRecord = {
      id: `TEAM-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      request_type: formData.request_type,
      team_type: categoryLabel,
      team_size: formData.request_type === "individual" ? "1 Specialist" : formData.team_size,
      pm_lead_required: formData.pm_lead_required,
      roles: formData.roles,
      duration: formData.duration,
      working_arrangement: formData.working_arrangement,
      equipment_provision: formData.equipment_provision,
      site_welfare: formData.site_welfare,
      details: detailsBody,
      status: "Pending Review"
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("boulotman_team_inquiries") || "[]");
        localStorage.setItem("boulotman_team_inquiries", JSON.stringify([inquiryRecord, ...existing]));
      } catch {}
    }

    try {
      await Promise.allSettled([
        api.submitInquiry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company_name: `${categoryLabel} (${formData.request_type === "individual" ? "Individual" : formData.team_size})`.trim(),
          inquiry_type: "team_request",
          topic: `Build a Team: ${categoryLabel}`,
          message: detailsBody,
          details: detailsBody,
        } as any),
        api.submitContactForm({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          topic: `Build a Team: ${categoryLabel}`,
          message: detailsBody,
        }),
      ]);
    } catch {}

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);
    }, 3500);
  };

  return (
    <>
      <Header />

      <main className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDesc}</p>
        </div>

        {/* SECTION 1: WHAT IS BUILD A TEAM */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.section1Title}</h2>
          <p className={styles.sectionDesc}>
            {t.section1DescStart}
            <strong>{t.section1DescStrong}</strong>
            {t.section1DescEnd}
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.cardBadge}>{t.card1Title}</span>
              <ul>
                {t.card1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.cardBadge}>{t.card2Title}</span>
              <ul>
                {t.card2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.cardBadge}>{t.card3Title}</span>
              <ul>
                {t.card3List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>
          <div className={styles.grid3}>
            {[t.step1, t.step2, t.step3, t.step4, t.step5, t.step6].map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <span className={styles.stepNum}>{i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING MODELS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.pricingTitle}</h2>
          <div className={styles.grid3}>
            <div className={styles.pricingCard}>
              <h3>{t.pricing1Title}</h3>
              <p>{t.pricing1Desc}</p>
            </div>
            <div className={styles.pricingCard}>
              <h3>{t.pricing2Title}</h3>
              <p>{t.pricing2Desc}</p>
            </div>
            <div className={styles.pricingCard}>
              <h3>{t.pricing3Title}</h3>
              <p>{t.pricing3Desc}</p>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.compareTitle}</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.thFeature}</th>
                  <th>{t.thConcierge}</th>
                  <th>{t.thBuildTeam}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t.row1Type}</td>
                  <td>{t.row1C}</td>
                  <td>{t.row1B}</td>
                </tr>
                <tr>
                  <td>{t.row2Size}</td>
                  <td>{t.row2C}</td>
                  <td>{t.row2B}</td>
                </tr>
                <tr>
                  <td>{t.row3Dur}</td>
                  <td>{t.row3C}</td>
                  <td>{t.row3B}</td>
                </tr>
                <tr>
                  <td>{t.row4Sup}</td>
                  <td>{t.row4C}</td>
                  <td>{t.row4B}</td>
                </tr>
                <tr>
                  <td>{t.row5Best}</td>
                  <td>{t.row5C}</td>
                  <td>{t.row5B}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
          <div className={styles.faqList}>
            {t.faqs.map((faq: any, i: number) => (
              <div key={i} className={styles.faqItem}>
                <div className={styles.faqQuestion} onClick={() => toggleFaq(i)}>
                  <h3>{faq.q}</h3>
                  <span className={styles.faqIcon}>{activeFaq === i ? "−" : "+"}</span>
                </div>
                {activeFaq === i && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div className={styles.ctaLeft}>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaDesc}</p>
          </div>
          <div className={styles.ctaRight}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.ctaBtn}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* ================= REQUEST A TEAM MODAL ================= */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <h2>{t.modalTitle}</h2>
              <p>{t.modalSub}</p>
            </div>

            {success ? (
              <div className={styles.successMsg}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                {t.modalSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 0. CONTACT INFORMATION */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitleRow}>
                    <h3 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:user-check" style={{ color: "#ff4500", fontSize: 18 }} />
                      {t.secContactTitle}
                    </h3>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelName}</label>
                      <input
                        className={styles.input}
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === "fr" ? "ex: Marc Dubois" : "e.g. John Doe"}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelEmail}</label>
                      <input
                        type="email"
                        className={styles.input}
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@domain.com"
                      />
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelPhone}</label>
                      <input
                        className={styles.input}
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+229 97 00 00 00"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelLocation}</label>
                      <input
                        className={styles.input}
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder={lang === "fr" ? "ex: Cotonou / Douala / Abidjan" : "e.g. Cotonou / Lagos / Abidjan"}
                      />
                    </div>
                  </div>
                </div>

                {/* 1. TEAM SCALE & STRUCTURE */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitleRow}>
                    <h3 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:users" style={{ color: "#ff4500", fontSize: 18 }} />
                      {t.sec1Title}
                    </h3>
                    <span className={styles.sectionBadge}>{t.sec1Badge}</span>
                  </div>

                  {/* Request Type Radio Cards */}
                  <div className={styles.typeGrid}>
                    <div
                      className={`${styles.typeCard} ${formData.request_type === "individual" ? styles.typeCardActive : ""}`}
                      onClick={() => setFormData({ ...formData, request_type: "individual" })}
                    >
                      <span className={styles.typeRadioDot} />
                      <div className={styles.typeCardBody}>
                        <div className={styles.typeCardTitle}>👤 {t.reqTypeIndividual}</div>
                        <div className={styles.typeCardDesc}>{t.reqTypeIndividualDesc}</div>
                      </div>
                    </div>

                    <div
                      className={`${styles.typeCard} ${formData.request_type === "squad" ? styles.typeCardActive : ""}`}
                      onClick={() => setFormData({ ...formData, request_type: "squad" })}
                    >
                      <span className={styles.typeRadioDot} />
                      <div className={styles.typeCardBody}>
                        <div className={styles.typeCardTitle}>👥 {t.reqTypeSquad}</div>
                        <div className={styles.typeCardDesc}>{t.reqTypeSquadDesc}</div>
                      </div>
                    </div>
                  </div>

                  {/* Team Size dropdown if squad */}
                  {formData.request_type === "squad" && (
                    <div className={styles.formGroup} style={{ marginTop: 12 }}>
                      <label className={styles.label}>{t.labelTeamSize}</label>
                      <select
                        className={styles.select}
                        value={formData.team_size}
                        onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                      >
                        <option value="2–3 people (Small Squad)">{t.sizeOpt1}</option>
                        <option value="4–7 people (Standard Crew)">{t.sizeOpt2}</option>
                        <option value="8+ people (Large Workforce)">{t.sizeOpt3}</option>
                      </select>
                    </div>
                  )}

                  {/* Leadership Preference Toggle */}
                  <div
                    className={`${styles.toggleRow} ${formData.pm_lead_required ? styles.toggleRowActive : ""}`}
                    onClick={() => setFormData({ ...formData, pm_lead_required: !formData.pm_lead_required })}
                    style={{ marginTop: 12 }}
                  >
                    <div className={styles.toggleInfo}>
                      <div className={styles.toggleTitle}>
                        <iconify-icon icon="lucide:shield-check" style={{ color: "#ff4500", fontSize: 16 }} />
                        {t.pmToggleTitle}
                      </div>
                      <div className={styles.toggleSub}>{t.pmToggleSub}</div>
                    </div>
                    <label className={styles.switch} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={formData.pm_lead_required}
                        onChange={(e) => setFormData({ ...formData, pm_lead_required: e.target.checked })}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>

                {/* 2. ROLES & SKILLS MATRIX (DYNAMIC CHECKLIST) */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitleRow}>
                    <h3 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:layers" style={{ color: "#ff4500", fontSize: 18 }} />
                      {t.sec2Title}
                    </h3>
                    <span className={styles.sectionBadge}>{t.sec2Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelCategory}</label>
                    <select
                      className={styles.select}
                      value={formData.primary_category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setFormData({
                          ...formData,
                          primary_category: newCat,
                          roles: [] // reset roles on category switch
                        });
                      }}
                    >
                      <option value="civil">{t.catCivil}</option>
                      <option value="tech">{t.catTech}</option>
                      <option value="maintenance">{t.catMaintenance}</option>
                      <option value="solar">{t.catSolar}</option>
                      <option value="other">{t.catOther}</option>
                    </select>
                  </div>

                  <div>
                    <label className={styles.label} style={{ marginTop: 10 }}>{t.rolesTitle}</label>
                    <div className={styles.rolesMatrixGrid}>
                      {getRolesForCategory().map((roleItem: string, idx: number) => {
                        const isSelected = formData.roles.includes(roleItem);
                        return (
                          <div
                            key={idx}
                            className={`${styles.roleCheckboxItem} ${isSelected ? styles.roleCheckboxActive : ""}`}
                            onClick={() => handleToggleRole(roleItem)}
                          >
                            <span className={styles.customCheckSquare}>
                              {isSelected && <iconify-icon icon="lucide:check" />}
                            </span>
                            <span>{roleItem}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. TEAM LOGISTICS & DURATION */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitleRow}>
                    <h3 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:calendar-clock" style={{ color: "#ff4500", fontSize: 18 }} />
                      {t.sec3Title}
                    </h3>
                    <span className={styles.sectionBadge}>{t.sec3Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelDuration}</label>
                    <select
                      className={styles.select}
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    >
                      <option value="One-off Day Project (Emergency site audit / rapid rollout)">{t.durOpt1}</option>
                      <option value="Short-term (1 to 4 weeks)">{t.durOpt2}</option>
                      <option value="Medium-term (1 to 6 months)">{t.durOpt3}</option>
                      <option value="Long-term Retainer (6+ months / Ongoing site management)">{t.durOpt4}</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelArrangement}</label>
                    <div className={styles.pillRadioGroup}>
                      {[
                        { val: "Full-time On-site (Daily physical presence)", label: t.arrOpt1 },
                        { val: "Part-time / Rotational (Specified days per week)", label: t.arrOpt2 },
                        { val: "Hybrid (Remote management with weekly physical site inspections)", label: t.arrOpt3 },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`${styles.pillRadioItem} ${formData.working_arrangement === item.val ? styles.pillRadioActive : ""}`}
                          onClick={() => setFormData({ ...formData, working_arrangement: item.val })}
                        >
                          <span className={styles.pillRadioDot} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. WORKSPACE & EQUIPMENT READINESS */}
                <div className={styles.formSection}>
                  <div className={styles.sectionTitleRow}>
                    <h3 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500", fontSize: 18 }} />
                      {t.sec4Title}
                    </h3>
                    <span className={styles.sectionBadge}>{t.sec4Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelEquip}</label>
                    <div className={styles.pillRadioGroup}>
                      {[
                        { val: "Boulot Man should fully equip the team.", label: t.equipOpt1 },
                        { val: "The site / client will provide necessary tools and heavy equipment.", label: t.equipOpt2 },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`${styles.pillRadioItem} ${formData.equipment_provision === item.val ? styles.pillRadioActive : ""}`}
                          onClick={() => setFormData({ ...formData, equipment_provision: item.val })}
                        >
                          <span className={styles.pillRadioDot} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} style={{ marginTop: 8 }}>{t.labelWelfare}</label>
                    <div className={styles.pillRadioGroup}>
                      {[
                        { val: "Secure storage available on-site for tools & materials.", label: t.welfareOpt1 },
                        { val: "Power and water supply are active on-site.", label: t.welfareOpt2 },
                        { val: "Permits and local authorizations are already cleared.", label: t.welfareOpt3 },
                      ].map((item, i) => {
                        const isChecked = formData.site_welfare.includes(item.val);
                        return (
                          <div
                            key={i}
                            className={`${styles.roleCheckboxItem} ${isChecked ? styles.roleCheckboxActive : ""}`}
                            onClick={() => handleToggleWelfare(item.val)}
                          >
                            <span className={styles.customCheckSquare}>
                              {isChecked && <iconify-icon icon="lucide:check" />}
                            </span>
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SCOPE & REQUIREMENTS TEXTAREA */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.labelDetails}</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={t.placeholderDetails}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  <iconify-icon icon={loading ? "lucide:loader" : "lucide:send"} />
                  {loading ? t.btnSubmitting : t.btnSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
