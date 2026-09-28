"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./concierge.module.css";
import { api } from "@/app/lib/api";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Boulot Man Concierge Services",
    heroSubtitle: "A premium, fully managed technical service designed for individuals, families, companies, and diaspora clients who want all their technical needs handled professionally — without stress.",
    section1Title: "What Is Boulot Man Concierge?",
    section1DescStart: "Boulot Man Concierge is a ",
    section1DescStrong: "VIP, hands-off service",
    section1DescEnd: " where Boulot Man manages everything for you — from technician selection to supervision, reporting, follow-up, and quality control.",
    card1Title: "Who It's For",
    card1List: ["Busy professionals", "Families & homeowners", "Property managers & landlords", "Companies & offices", "Embassies, NGOs & institutions", "Diaspora managing property remotely"],
    card2Title: "Why Concierge?",
    card2List: ["No searching for technicians", "No coordination stress", "Priority response", "Supervised work", "Quality guarantee"],
    card3Title: "Service Coverage",
    card3List: ["Homes & apartments", "Offices & commercial spaces", "Facilities & compounds", "Remote & diaspora properties"],
    howTitle: "How Concierge Works",
    step1: "Client requests support via website, phone, or WhatsApp",
    step2: "Needs assessment (issue, urgency, location, scope)",
    step3: "Verified specialist / concierge coordinator assigned",
    step4: "On-site or remote execution supervised by Boulot Man",
    step5: "Milestone completion report, photos & verification",
    step6: "Payment release, warranty & post-service follow-up",
    servicesTitle: "Services Covered",
    cat1Title: "Home & Office",
    cat1List: ["Electrical repairs & installations", "Plumbing & sanitation", "AC & refrigeration", "Carpentry & furniture repair", "Painting & renovations"],
    cat2Title: "Security & Energy",
    cat2List: ["CCTV & access control", "Solar PV systems", "Generators & backup power", "Smart home automation"],
    cat3Title: "Special Services",
    cat3List: ["Owner's representative & site audit", "IT & infrastructure setups", "Commercial maintenance", "Turnkey renovation oversight"],
    faqTitle: "Concierge FAQ",
    faqs: [
      {
        q: "How is Concierge different from regular services?",
        a: "Concierge means Boulot Man manages everything for you end-to-end. Regular marketplace services require you to coordinate technicians yourself."
      },
      {
        q: "Is Concierge available for diaspora clients?",
        a: "Yes! Diaspora clients receive continuous photo/video logs, milestone verification, and direct WhatsApp updates."
      },
      {
        q: "How fast is the response time?",
        a: "Emergency requests receive dispatch coordination within 1 hour. Planned requests are scheduled immediately."
      }
    ],
    ctaTitle: "Let Us Handle Everything",
    ctaDesc: "Stop managing technicians. Focus on your life or business while Boulot Man Concierge takes care of the rest.",
    ctaBtn: "Request Concierge Service",

    // MODAL TRANSLATIONS
    modalTitle: "Request Concierge Service",
    modalSub: "Complete the project overview and logistics. Our VIP operations team will assign a dedicated concierge coordinator.",
    
    // Contact
    secContactTitle: "Client & Contact Details",
    labelName: "Full Name *",
    labelEmail: "Email Address *",
    labelPhone: "Phone / WhatsApp Number *",

    // Section 1: General Project Overview
    sec1Title: "1. General Project Overview",
    sec1Badge: "Universal Entry",
    labelTitle: "Project / Request Title *",
    placeholderTitle: "e.g. Smart Home Network Installation, Villa Construction Oversight, Office Plumbing",
    labelCategory: "Service Category *",
    catCivil: "Civil Engineering & Property Representation",
    catCivilDesc: "Site supervision, owner's proxy, material verification & construction oversight",
    catTech: "Technology & Digital Services",
    catTechDesc: "IT setups, networking, smart systems, server & software configuration",
    catHandyman: "Handyman & Facility Maintenance",
    catHandymanDesc: "Urgent repairs, electrical fixes, plumbing, renovations & installations",
    catOther: "Other / Custom Project",
    catOtherDesc: "Hybrid, specialized technical or unlisted multi-disciplinary needs",
    labelDetails: "Detailed Project Description *",
    placeholderDetails: "Describe what needs to be executed, managed, repaired, or audited in detail...",

    // Section 2: Location & Logistics
    sec2Title: "2. Location & Logistics",
    sec2Badge: "Dispatch & Access",
    labelLocType: "Location Category *",
    locPhysical: "📍 Physical Site / Property",
    locRemote: "💻 Remote / Virtual",
    labelCity: "City & Neighborhood *",
    placeholderCity: "e.g. Cotonou (Haie Vive), Lagos (Lekki), Abidjan (Cocody)",
    labelAccess: "Access & Entry Instructions *",
    placeholderAccess: "Provide gate codes, on-site keyholder contact, or remote SSH / VPN / Zoom credentials...",

    // Section 3: Dynamic Scope
    sec3Title: "3. Dynamic Service Scope",
    sec3Badge: "Category Specific",
    
    // Civil Scope
    labelCivilPhase: "Current Site Phase *",
    phase1: "Raw Land & Pre-construction Survey",
    phase2: "Foundation & Sub-structure Groundwork",
    phase3: "Structural Shell & Framing",
    phase4: "MEP, Rough-ins & Utilities",
    phase5: "Interior & Finishing",
    phase6: "Final Handover & Snagging Inspection",
    labelCivilTasks: "Authorized Representative Tasks (Select all that apply):",
    taskCivil1: "Procurement & Material Quality Verification",
    taskCivil2: "Milestone Validation & Escrow Approval",
    taskCivil3: "Contractor Quality & Compliance Audit",
    taskCivil4: "Diaspora Photo & Drone Video Progress Logs",
    taskCivil5: "Permits, Survey & Municipal Authority Liaison",
    labelCivilPlans: "Plan / Blueprint Availability *",
    plansOpt1: "Architectural & Structural Plans Ready",
    plansOpt2: "Preliminary Sketches Only",
    plansOpt3: "No Existing Plans / Need Drafting & Survey",

    // Tech Scope
    labelTechSystems: "Tech Stack & Hardware Systems (Select all that apply):",
    sysTech1: "Cloud / Virtual Servers & DevOps",
    sysTech2: "Structured Cabling, Fiber LAN & High-speed WiFi",
    sysTech3: "CCTV, Biometrics & Smart Access Control",
    sysTech4: "Smart Home & IoT Automation",
    sysTech5: "Custom Software, API & Database Config",
    labelTechAccess: "Access Requirements *",
    techAcc1: "Cloud / SSH / VPN Remote Credentials Provided",
    techAcc2: "Physical On-site Server Rack & Hardware Setup",
    techAcc3: "Hybrid Physical & Remote Systems Management",
    labelTechSecurity: "Security & Compliance Parameters (Select all that apply):",
    secTech1: "Mutual NDA Required Before Engagement",
    secTech2: "Strict Enterprise Audit Log & Data Confidentiality",
    secTech3: "Standard Platform Confidentiality",

    // Handyman Scope
    labelHandymanUrgency: "Issue Urgency *",
    hmUrg1: "Emergency / Immediate Same-Day Fix",
    hmUrg2: "Within 24 to 48 Hours",
    hmUrg3: "Scheduled Preventative Maintenance",
    labelHandymanMaterials: "Tool & Material Availability *",
    hmMat1: "Client provides all materials and spare parts.",
    hmMat2: "Boulot Man should source, supply, and deliver all materials.",
    hmMat3: "Diagnostic inspection needed before purchasing materials.",
    labelHandymanSpace: "Space Type *",
    hmSpace1: "Residential (House / Apartment / Villa)",
    hmSpace2: "Commercial (Office / Retail / Restaurant / Facility)",
    hmSpace3: "Industrial (Warehouse / Factory / Plant)",

    // Other Scope
    labelOtherScope: "Specialized Scope & Custom Requirements",
    placeholderOtherScope: "Specify any unique tooling, certifications, or custom coordination required...",

    // Section 4: Technical Uploads & Media
    sec4Title: "4. Technical Uploads & Media",
    sec4Badge: "Verification Zone",
    uploadZoneText: "Click or drag to attach photos, blueprints, quotes, or error codes",
    uploadZoneSub: "Supported formats: PNG, JPG, PDF, DWG, DOCX (Up to 10MB each)",

    // Section 5: Timelines, Reporting & Budget
    sec5Title: "5. Timelines, Reporting & Budget",
    sec5Badge: "Terms & SLA",
    labelUrgency: "Urgency Level *",
    urgOpt1: "🚨 Emergency / Immediate Response",
    urgOpt2: "⚡ Within 48 Hours",
    urgOpt3: "📅 Planned Project",
    labelUpdates: "Reporting & Updates Frequency *",
    updOpt1: "Daily Progress Logs & Photo Reports",
    updOpt2: "Weekly Executive Summary",
    updOpt3: "Milestone-based Reporting Only",
    labelChannels: "Preferred Communication Channels (Select all that apply):",
    chan1: "WhatsApp Direct Updates",
    chan2: "Email Reports & PDF Deliverables",
    chan3: "Boulot Man Dashboard Portal",
    chan4: "Direct Phone Calls & Video Briefings",
    labelBudget: "Estimated Budget Tier *",
    budgOpt1: "< $250 / 150,000 XOF (Minor Fix / Single Inspection)",
    budgOpt2: "$250 – $1,000 / 150,000 – 600,000 XOF (Standard Project)",
    budgOpt3: "$1,000 – $5,000 / 600,000 – 3,000,000 XOF (Major Installation / Monthly Retainer)",
    budgOpt4: "$5,000+ / 3,000,000+ XOF (Large Infrastructure / Complete Oversight)",
    budgOpt5: "Enterprise / Request Custom Quotation",

    btnSubmit: "Submit Concierge Request",
    btnSubmitting: "Submitting Request...",
    modalSuccess: "Your Concierge request has been successfully submitted! A dedicated VIP operations manager will contact you within the hour."
  },
  fr: {
    heroTitle: "Services Conciergerie Boulot Man",
    heroSubtitle: "Un service technique haut de gamme entièrement managé, conçu pour les particuliers, familles, entreprises et la diaspora souhaitant déléguer tous leurs travaux en toute sérénité.",
    section1Title: "Qu'est-ce que la Conciergerie Boulot Man ?",
    section1DescStart: "La Conciergerie Boulot Man est un ",
    section1DescStrong: "service VIP clé en main",
    section1DescEnd: " où Boulot Man gère l'intégralité de vos besoins — du choix des techniciens jusqu'à la supervision, les rapports d'intervention et le contrôle qualité.",
    card1Title: "À qui s'adresse ce service",
    card1List: ["Professionnels & cadres actifs", "Familles & propriétaires résidents", "Gestionnaires d'immeubles & bailleurs", "Entreprises, sièges & agences", "Ambassades, ONG & institutions", "Diaspora gérant leur patrimoine à distance"],
    card2Title: "Pourquoi la Conciergerie ?",
    card2List: ["Plus besoin de chercher des artisans", "Zéro stress d'organisation", "Interventions en priorité absolue", "Travaux supervisés par un régisseur", "Garantie satisfaction et conformité"],
    card3Title: "Périmètre d'intervention",
    card3List: ["Résidences, villas & appartements", "Bureaux & locaux professionnels", "Complexes immobiliers & domaines", "Propriétés gérées pour la diaspora"],
    howTitle: "Fonctionnement du Service",
    step1: "Demande d'intervention par formulaire, téléphone ou WhatsApp",
    step2: "Diagnostic des besoins (nature du problème, urgence, lieu)",
    step3: "Sélection et affectation du spécialiste / régisseur dédié",
    step4: "Exécution supervisée sur site ou à distance par Boulot Man",
    step5: "Rapport d'intervention détaillé, photos et validation",
    step6: "Paiement sécurisé, garantie et suivi après-service",
    servicesTitle: "Prestations Prises en Charge",
    cat1Title: "Bâtiment & Résidentiel",
    cat1List: ["Dépannage et installations électriques", "Plomberie & assainissement", "Climatisation & réfrigération", "Menuiserie & mobilier", "Peinture & rénovations intérieures"],
    cat2Title: "Sécurité & Énergie",
    cat2List: ["Vidéosurveillance & contrôle d'accès", "Installations solaires photovoltaïques", "Groupes électrogènes & onduleurs", "Systèmes connectés & domotique"],
    cat3Title: "Services Spéciaux",
    cat3List: ["Représentation de maître d'ouvrage & audits", "Infrastructures réseaux & IT", "Maintenance multi-sites", "Supervision de rénovation clé en main"],
    faqTitle: "Foire Aux Questions Conciergerie",
    faqs: [
      {
        q: "En quoi la Conciergerie diffère-t-elle du service classique ?",
        a: "Avec la Conciergerie, Boulot Man prend tout en charge de A à Z avec un coordinateur dédié. Sur le service classique, vous choisissez et pilotez vous-même les techniciens."
      },
      {
        q: "La diaspora peut-elle utiliser la Conciergerie ?",
        a: "Tout à fait. Nous transmettons rapports, photos et suivis en temps réel pour une gestion transparente de vos biens à distance."
      },
      {
        q: "Quel est le délai d'intervention ?",
        a: "Urgences : prise en charge sous 1 heure. Demandes planifiées : programmation immédiate."
      }
    ],
    ctaTitle: "Confiez-nous la gestion de vos travaux",
    ctaDesc: "Ne perdez plus de temps avec les artisans. Concentrez-vous sur vos priorités pendant que la Conciergerie Boulot Man s'occupe de tout.",
    ctaBtn: "Demander le Service Conciergerie",

    // MODAL TRANSLATIONS FR
    modalTitle: "Demander la Conciergerie VIP",
    modalSub: "Précisez vos besoins et votre périmètre. Notre équipe d'opérations VIP vous assigne un régisseur dédié.",
    
    // Contact FR
    secContactTitle: "Coordonnées du Demandeur",
    labelName: "Nom et Prénom *",
    labelEmail: "Adresse E-mail *",
    labelPhone: "Numéro de Téléphone / WhatsApp *",

    // Section 1 FR
    sec1Title: "1. Présentation Générale du Projet",
    sec1Badge: "Point d'Entrée",
    labelTitle: "Titre du Projet / de la Demande *",
    placeholderTitle: "ex: Installation Réseau Domotique, Suivi de Chantier Villa, Plomberie Bureaux",
    labelCategory: "Catégorie de Service *",
    catCivil: "Génie Civil & Représentation Propriétaire",
    catCivilDesc: "Supervision de chantier, mandataire du propriétaire, contrôle matériaux & travaux",
    catTech: "Technologies & Services Numériques",
    catTechDesc: "Installations IT, réseaux, domotique, serveurs & configurations logicielles",
    catHandyman: "Travaux, Dépannage & Maintenance",
    catHandymanDesc: "Réparations urgentes, électricité, plomberie, rénovations & maintenance",
    catOther: "Autre Projet / Sur-Mesure",
    catOtherDesc: "Besoins hybrides, spécialisés ou multidisciplinaires non listés",
    labelDetails: "Description Détaillée du Projet *",
    placeholderDetails: "Décrivez ce qui doit être exécuté, géré, réparé ou audité en détail...",

    // Section 2 FR
    sec2Title: "2. Localisation & Logistique",
    sec2Badge: "Accès & Déploiement",
    labelLocType: "Type de Localisation *",
    locPhysical: "📍 Site Physique / Propriété",
    locRemote: "💻 À Distance / Virtuel",
    labelCity: "Ville & Quartier *",
    placeholderCity: "ex: Cotonou (Haie Vive), Douala (Bonanjo), Abidjan (Cocody)",
    labelAccess: "Instructions d'Accès & Entrée *",
    placeholderAccess: "Indiquez les codes de portail, contact du gardien, ou identifiants SSH / VPN / Zoom...",

    // Section 3 FR
    sec3Title: "3. Périmètre Technique Spécifique",
    sec3Badge: "Sur-Mesure",
    
    // Civil Scope FR
    labelCivilPhase: "Phase Actuelle du Site *",
    phase1: "Terrain Nu & Études Préalables",
    phase2: "Fondations & Gros Œuvre Inférieur",
    phase3: "Structure, Maçonnerie & Gros Œuvre",
    phase4: "Second Œuvre, Électricité & Plomberie",
    phase5: "Finitions & Aménagements Intérieurs",
    phase6: "Livraison Finale & Contrôle des Réserves",
    labelCivilTasks: "Missions du Représentant Mandataire (Plusieurs choix possibles) :",
    taskCivil1: "Contrôle Qualité & Approvisionnement des Matériaux",
    taskCivil2: "Validation des Jalons & Déblocage des Paiements",
    taskCivil3: "Audit Qualité & Conformité des Entrepreneurs",
    taskCivil4: "Rapports Photos, Vidéos & Drones pour la Diaspora",
    taskCivil5: "Liaison Administrative, Permis & Cadastre",
    labelCivilPlans: "Disponibilité des Plans / Devis *",
    plansOpt1: "Plans Architecturaux & Techniques Disponibles",
    plansOpt2: "Croquis & Esquisses Préliminaires Uniquement",
    plansOpt3: "Aucun Plan / Besoin de Relevé & Dessin",

    // Tech Scope FR
    labelTechSystems: "Technologies & Équipements Requis (Plusieurs choix possibles) :",
    sysTech1: "Serveurs Cloud, Virtualisation & DevOps",
    sysTech2: "Câblage Structuré, Fibre Optique & WiFi Haut Débit",
    sysTech3: "Vidéosurveillance, Biométrie & Contrôle d'Accès",
    sysTech4: "Domotique & Automatisation IoT",
    sysTech5: "Logiciels Sur-Mesure, API & Bases de Données",
    labelTechAccess: "Modalités d'Accès Requis *",
    techAcc1: "Accès Distant Fourni (Identifiants Cloud / SSH / VPN)",
    techAcc2: "Intervention Physique sur Baie & Matériel Sur Site",
    techAcc3: "Gestion Hybride Physique & Distante",
    labelTechSecurity: "Paramètres de Sécurité & Confidentialité :",
    secTech1: "Accord de Confidentialité (NDA) Exigé",
    secTech2: "Sécurité Entreprise Stricte & Traçabilité Complète",
    secTech3: "Confidentialité Standard de la Plateforme",

    // Handyman Scope FR
    labelHandymanUrgency: "Niveau d'Urgence *",
    hmUrg1: "Urgence Absolue / Dépannage Immédiat dans la Journée",
    hmUrg2: "Intervention sous 24 à 48 Heures",
    hmUrg3: "Maintenance Programmée & Préventive",
    labelHandymanMaterials: "Fourniture des Outils & Matériaux *",
    hmMat1: "Le client fournit tous les matériaux et pièces détachées.",
    hmMat2: "Boulot Man doit sourcer, fournir et livrer les matériaux.",
    hmMat3: "Diagnostic sur place requis avant achat du matériel.",
    labelHandymanSpace: "Type d'Espace *",
    hmSpace1: "Résidentiel (Maison / Appartement / Villa)",
    hmSpace2: "Commercial (Bureaux / Boutique / Restaurant / Locaux)",
    hmSpace3: "Industriel (Entrepôt / Usine / Atelier)",

    // Other Scope FR
    labelOtherScope: "Besoins Spécifiques & Cahier des Charges",
    placeholderOtherScope: "Précisez les compétences, outillages ou besoins particuliers requis...",

    // Section 4 FR
    sec4Title: "4. Documents & Fichiers Techniques",
    sec4Badge: "Zone de Contrôle",
    uploadZoneText: "Cliquez ou glissez vos photos, plans, devis ou codes d'erreur",
    uploadZoneSub: "Formats acceptés : PNG, JPG, PDF, DWG, DOCX (Max 10 Mo par fichier)",

    // Section 5 FR
    sec5Title: "5. Délais, Rapports & Budget",
    sec5Badge: "Modalités & SLA",
    labelUrgency: "Délai d'Intervention Souhaité *",
    urgOpt1: "🚨 Urgence Immédiate / Réponse Prioritaire",
    urgOpt2: "⚡ Sous 48 Heures",
    urgOpt3: "📅 Projet Planifié",
    labelUpdates: "Fréquence des Rapports d'Avancement *",
    updOpt1: "Rapports Quotidiens avec Photos & Journal",
    updOpt2: "Synthèse Hebdomadaire",
    updOpt3: "Rapport aux Jalons Clés Uniquement",
    labelChannels: "Canaux de Communication Préférés :",
    chan1: "Suivi Direct par WhatsApp",
    chan2: "Rapports E-mail & Livrables PDF",
    chan3: "Portail Dashboard Boulot Man",
    chan4: "Appels Téléphoniques & Points Vidéo",
    labelBudget: "Tranche Budgétaire Estimée *",
    budgOpt1: "< 250 $ / 150 000 FCFA (Petite intervention / Audit ponctuel)",
    budgOpt2: "250 $ – 1 000 $ / 150 000 – 600 000 FCFA (Projet Standard)",
    budgOpt3: "1 000 $ – 5 000 $ / 600 000 – 3 000 000 FCFA (Projet Majeur / Forfait Mensuel)",
    budgOpt4: "5 000 $+ / 3 000 000+ FCFA (Grand Chantier / Encadrement Global)",
    budgOpt5: "Entreprise / Devis Sur-Mesure",

    btnSubmit: "Envoyer la Demande Conciergerie",
    btnSubmitting: "Envoi en cours...",
    modalSuccess: "Votre demande Conciergerie a été enregistrée avec succès ! Un régisseur VIP dédié vous contactera dans l'heure."
  }
};

export default function ConciergePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lang, setLang] = useState("en");

  // Form State covering all 5 sections
  const [formData, setFormData] = useState({
    // Contact
    name: "",
    email: "",
    phone: "",

    // 1. General Project Overview
    title: "",
    category: "civil", // civil | tech | handyman | other
    details: "",

    // 2. Location & Logistics
    location_type: "physical", // physical | remote
    city: "",
    access_instructions: "",

    // 3. Dynamic Scope
    // Civil
    civil_phase: "Raw Land & Pre-construction Survey",
    civil_tasks: [] as string[],
    civil_plans: "Architectural & Structural Plans Ready",

    // Tech
    tech_systems: [] as string[],
    tech_access: "Cloud / SSH / VPN Remote Credentials Provided",
    tech_security: [] as string[],

    // Handyman
    handyman_urgency: "Within 24 to 48 Hours",
    handyman_materials: "Boulot Man should source, supply, and deliver all materials.",
    handyman_space: "Residential (House / Apartment / Villa)",

    // Other
    other_scope: "",

    // 4. Attachments
    attached_files: [] as Array<{ name: string; size: number; type: string; data: string }>,

    // 5. Timelines, Reporting & Budget
    urgency_level: "⚡ Within 48 Hours",
    update_frequency: "Daily Progress Logs & Photo Reports",
    communication_channels: ["WhatsApp Direct Updates", "Email Reports & PDF Deliverables"] as string[],
    budget_tier: "$250 – $1,000 / 150,000 – 600,000 XOF (Standard Project)"
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

  // Toggle helpers for multi-select arrays
  const handleToggleCivilTask = (task: string) => {
    setFormData((prev) => ({
      ...prev,
      civil_tasks: prev.civil_tasks.includes(task)
        ? prev.civil_tasks.filter((x) => x !== task)
        : [...prev.civil_tasks, task]
    }));
  };

  const handleToggleTechSystem = (sys: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_systems: prev.tech_systems.includes(sys)
        ? prev.tech_systems.filter((x) => x !== sys)
        : [...prev.tech_systems, sys]
    }));
  };

  const handleToggleTechSec = (sec: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_security: prev.tech_security.includes(sec)
        ? prev.tech_security.filter((x) => x !== sec)
        : [...prev.tech_security, sec]
    }));
  };

  const handleToggleChannel = (chan: string) => {
    setFormData((prev) => ({
      ...prev,
      communication_channels: prev.communication_channels.includes(chan)
        ? prev.communication_channels.filter((x) => x !== chan)
        : [...prev.communication_channels, chan]
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
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

    setFormData((prev) => ({
      ...prev,
      attached_files: [...prev.attached_files, ...loadedFiles]
    }));
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      attached_files: prev.attached_files.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const getCategoryLabel = () => {
    switch (formData.category) {
      case "civil": return t.catCivil;
      case "tech": return t.catTech;
      case "handyman": return t.catHandyman;
      default: return t.catOther;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const categoryLabel = getCategoryLabel();
    const locLabel = formData.location_type === "physical" ? "📍 Physical Site / Property" : "💻 Remote / Virtual";

    // Dynamic scope section summary
    let scopeSummary = "";
    if (formData.category === "civil") {
      scopeSummary = `Site Phase: ${formData.civil_phase}
Tasks: ${formData.civil_tasks.length > 0 ? formData.civil_tasks.join(", ") : "Standard Site Oversight"}
Plans & Blueprints: ${formData.civil_plans}`;
    } else if (formData.category === "tech") {
      scopeSummary = `Tech Systems: ${formData.tech_systems.length > 0 ? formData.tech_systems.join(", ") : "Standard IT Setup"}
Access: ${formData.tech_access}
Security & Compliance: ${formData.tech_security.length > 0 ? formData.tech_security.join(", ") : "Standard Platform Confidentiality"}`;
    } else if (formData.category === "handyman") {
      scopeSummary = `Urgency: ${formData.handyman_urgency}
Materials: ${formData.handyman_materials}
Space Type: ${formData.handyman_space}`;
    } else {
      scopeSummary = `Custom Scope: ${formData.other_scope || "Standard custom technical specifications"}`;
    }

    const attachedNames = formData.attached_files.map((f) => f.name);
    const detailsBody = `[VIP Concierge Request]
Project Title: ${formData.title}
Client Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

=== 1. General Project Overview ===
Category: ${categoryLabel}
Description: ${formData.details}

=== 2. Location & Logistics ===
Location Type: ${locLabel}
City / Neighborhood: ${formData.city}
Access Instructions: ${formData.access_instructions || "Provided upon dispatch"}

=== 3. Dynamic Service Scope ===
${scopeSummary}

=== 4. Technical Uploads & Media ===
Attachments: ${attachedNames.length > 0 ? attachedNames.join(", ") : "None attached"}

=== 5. Timelines, Reporting & Budget ===
Urgency Level: ${formData.urgency_level}
Updates Frequency: ${formData.update_frequency}
Communication Channels: ${formData.communication_channels.join(", ")}
Estimated Budget: ${formData.budget_tier}`;

    const inquiryRecord = {
      id: `CONC-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      title: formData.title,
      category: categoryLabel,
      location_type: formData.location_type,
      city: formData.city,
      details: detailsBody,
      attached_files: formData.attached_files,
      budget_tier: formData.budget_tier,
      urgency: formData.urgency_level,
      status: "Pending Review"
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("boulotman_concierge_inquiries") || "[]");
        localStorage.setItem("boulotman_concierge_inquiries", JSON.stringify([inquiryRecord, ...existing]));
      } catch {}
    }

    try {
      await Promise.allSettled([
        api.submitInquiry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company_name: `Concierge: ${formData.title || categoryLabel}`.trim(),
          inquiry_type: "concierge",
          topic: `VIP Concierge: ${formData.title || categoryLabel}`,
          message: detailsBody,
          details: detailsBody,
        } as any),
        api.submitContactForm({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          topic: `VIP Concierge: ${formData.title || categoryLabel}`,
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
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.section1Title}</h2>
          <p className={styles.sectionDesc}>
            {t.section1DescStart}
            <strong>{t.section1DescStrong}</strong>
            {t.section1DescEnd}
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.card1Title}</h3>
              <ul>
                {t.card1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3>{t.card2Title}</h3>
              <ul>
                {t.card2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3>{t.card3Title}</h3>
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
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 1</span>
              <p>{t.step1}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 2</span>
              <p>{t.step2}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 3</span>
              <p>{t.step3}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 4</span>
              <p>{t.step4}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 5</span>
              <p>{t.step5}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 6</span>
              <p>{t.step6}</p>
            </div>
          </div>
        </div>

        {/* SERVICES COVERED */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.cat1Title}</h3>
              <ul>
                {t.cat1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.cat2Title}</h3>
              <ul>
                {t.cat2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.cat3Title}</h3>
              <ul>
                {t.cat3List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
          <div className={styles.card}>
            {t.faqs.map((faq: any, index: number) => (
              <div 
                key={index} 
                className={styles.accordionItem} 
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.accordionTitle}>
                  {faq.q}
                  <span>{activeFaq === index ? "−" : "+"}</span>
                </div>
                {activeFaq === index && (
                  <div className={styles.accordionContent}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaDesc}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.ctaBtn}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* ================= VIP CONCIERGE REQUEST MODAL ================= */}
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

            {/* MODAL HEADER */}
            <div className={styles.modalHeader}>
              <h2>{t.modalTitle}</h2>
              <p>{t.modalSub}</p>
            </div>

            {success ? (
              <div className={styles.successMsg}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✨</div>
                <h3 style={{ color: "#166534", margin: "0 0 6px 0", fontSize: 18 }}>{t.modalSuccess}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 0. CLIENT & CONTACT DETAILS */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:user-check" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.secContactTitle}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelName}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === "fr" ? "ex: Marc Dubois" : "e.g. Jean Dupont"}
                    />
                  </div>

                  <div className={styles.twoCol}>
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
                  </div>
                </div>

                {/* 1. GENERAL PROJECT OVERVIEW */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:compass" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.sec1Title}</span>
                    </div>
                    <span className={styles.blockBadge}>{t.sec1Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelTitle}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t.placeholderTitle}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelCategory}</label>
                    <div className={styles.categoryGrid}>
                      {[
                        { id: "civil", icon: "🏗️", name: t.catCivil, desc: t.catCivilDesc },
                        { id: "tech", icon: "💻", name: t.catTech, desc: t.catTechDesc },
                        { id: "handyman", icon: "🛠️", name: t.catHandyman, desc: t.catHandymanDesc },
                        { id: "other", icon: "❓", name: t.catOther, desc: t.catOtherDesc },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className={`${styles.categoryCard} ${formData.category === item.id ? styles.categoryCardActive : ""}`}
                          onClick={() => setFormData({ ...formData, category: item.id })}
                        >
                          <span className={styles.categoryIcon}>{item.icon}</span>
                          <div className={styles.categoryInfo}>
                            <div className={styles.categoryName}>{item.name}</div>
                            <div className={styles.categoryDesc}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelDetails}</label>
                    <textarea
                      className={styles.textarea}
                      required
                      rows={3}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder={t.placeholderDetails}
                    />
                  </div>
                </div>

                {/* 2. LOCATION & LOGISTICS */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:map-pin" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.sec2Title}</span>
                    </div>
                    <span className={styles.blockBadge}>{t.sec2Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelLocType}</label>
                    <div className={styles.toggleRow}>
                      <div
                        className={`${styles.toggleBtn} ${formData.location_type === "physical" ? styles.toggleBtnActive : ""}`}
                        onClick={() => setFormData({ ...formData, location_type: "physical" })}
                      >
                        <span className={styles.radioDot} />
                        <span>{t.locPhysical}</span>
                      </div>
                      <div
                        className={`${styles.toggleBtn} ${formData.location_type === "remote" ? styles.toggleBtnActive : ""}`}
                        onClick={() => setFormData({ ...formData, location_type: "remote" })}
                      >
                        <span className={styles.radioDot} />
                        <span>{t.locRemote}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelCity}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={t.placeholderCity}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelAccess}</label>
                    <textarea
                      className={styles.textarea}
                      rows={2}
                      value={formData.access_instructions}
                      onChange={(e) => setFormData({ ...formData, access_instructions: e.target.value })}
                      placeholder={t.placeholderAccess}
                    />
                  </div>
                </div>

                {/* 3. DYNAMIC SERVICE SCOPE */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:sliders" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.sec3Title} ({getCategoryLabel()})</span>
                    </div>
                    <span className={styles.blockBadge}>{t.sec3Badge}</span>
                  </div>

                  {/* 3A. CIVIL ENGINEERING */}
                  {formData.category === "civil" && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelCivilPhase}</label>
                        <select
                          className={styles.select}
                          value={formData.civil_phase}
                          onChange={(e) => setFormData({ ...formData, civil_phase: e.target.value })}
                        >
                          <option value="Raw Land & Pre-construction Survey">{t.phase1}</option>
                          <option value="Foundation & Sub-structure Groundwork">{t.phase2}</option>
                          <option value="Structural Shell & Framing">{t.phase3}</option>
                          <option value="MEP, Rough-ins & Utilities">{t.phase4}</option>
                          <option value="Interior & Finishing">{t.phase5}</option>
                          <option value="Final Handover & Snagging Inspection">{t.phase6}</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelCivilTasks}</label>
                        <div className={styles.checklistGrid}>
                          {[
                            { id: "procurement", label: t.taskCivil1 },
                            { id: "milestones", label: t.taskCivil2 },
                            { id: "quality_audit", label: t.taskCivil3 },
                            { id: "diaspora_logs", label: t.taskCivil4 },
                            { id: "permits_legal", label: t.taskCivil5 },
                          ].map((item) => {
                            const isSelected = formData.civil_tasks.includes(item.label);
                            return (
                              <div
                                key={item.id}
                                className={`${styles.checkItem} ${isSelected ? styles.checkItemActive : ""}`}
                                onClick={() => handleToggleCivilTask(item.label)}
                              >
                                <span className={styles.customCheck}>
                                  {isSelected && <iconify-icon icon="lucide:check" />}
                                </span>
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelCivilPlans}</label>
                        <div className={styles.radioStack}>
                          {[
                            { val: "Architectural & Structural Plans Ready", label: t.plansOpt1 },
                            { val: "Preliminary Sketches Only", label: t.plansOpt2 },
                            { val: "No Existing Plans / Need Drafting & Survey", label: t.plansOpt3 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`${styles.radioRow} ${formData.civil_plans === item.val ? styles.radioRowActive : ""}`}
                              onClick={() => setFormData({ ...formData, civil_plans: item.val })}
                            >
                              <span className={styles.radioDot} />
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3B. TECHNOLOGY & DIGITAL */}
                  {formData.category === "tech" && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelTechSystems}</label>
                        <div className={styles.checklistGrid}>
                          {[
                            { id: "cloud", label: t.sysTech1 },
                            { id: "cabling_lan", label: t.sysTech2 },
                            { id: "cctv_access", label: t.sysTech3 },
                            { id: "smarthome_iot", label: t.sysTech4 },
                            { id: "custom_app_api", label: t.sysTech5 },
                          ].map((item) => {
                            const isSelected = formData.tech_systems.includes(item.label);
                            return (
                              <div
                                key={item.id}
                                className={`${styles.checkItem} ${isSelected ? styles.checkItemActive : ""}`}
                                onClick={() => handleToggleTechSystem(item.label)}
                              >
                                <span className={styles.customCheck}>
                                  {isSelected && <iconify-icon icon="lucide:check" />}
                                </span>
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelTechAccess}</label>
                        <div className={styles.radioStack}>
                          {[
                            { val: "Cloud / SSH / VPN Remote Credentials Provided", label: t.techAcc1 },
                            { val: "Physical On-site Server Rack & Hardware Setup", label: t.techAcc2 },
                            { val: "Hybrid Physical & Remote Systems Management", label: t.techAcc3 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`${styles.radioRow} ${formData.tech_access === item.val ? styles.radioRowActive : ""}`}
                              onClick={() => setFormData({ ...formData, tech_access: item.val })}
                            >
                              <span className={styles.radioDot} />
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelTechSecurity}</label>
                        <div className={styles.checklistGrid}>
                          {[
                            { id: "nda", label: t.secTech1 },
                            { id: "strict_audit", label: t.secTech2 },
                            { id: "standard_confidential", label: t.secTech3 },
                          ].map((item) => {
                            const isSelected = formData.tech_security.includes(item.label);
                            return (
                              <div
                                key={item.id}
                                className={`${styles.checkItem} ${isSelected ? styles.checkItemActive : ""}`}
                                onClick={() => handleToggleTechSec(item.label)}
                              >
                                <span className={styles.customCheck}>
                                  {isSelected && <iconify-icon icon="lucide:check" />}
                                </span>
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3C. HANDYMAN & MAINTENANCE */}
                  {formData.category === "handyman" && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelHandymanUrgency}</label>
                        <div className={styles.radioStack}>
                          {[
                            { val: "Emergency / Immediate Same-Day Fix", label: t.hmUrg1 },
                            { val: "Within 24 to 48 Hours", label: t.hmUrg2 },
                            { val: "Scheduled Preventative Maintenance", label: t.hmUrg3 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`${styles.radioRow} ${formData.handyman_urgency === item.val ? styles.radioRowActive : ""}`}
                              onClick={() => setFormData({ ...formData, handyman_urgency: item.val })}
                            >
                              <span className={styles.radioDot} />
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelHandymanMaterials}</label>
                        <div className={styles.radioStack}>
                          {[
                            { val: "Client provides all materials and spare parts.", label: t.hmMat1 },
                            { val: "Boulot Man should source, supply, and deliver all materials.", label: t.hmMat2 },
                            { val: "Diagnostic inspection needed before purchasing materials.", label: t.hmMat3 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`${styles.radioRow} ${formData.handyman_materials === item.val ? styles.radioRowActive : ""}`}
                              onClick={() => setFormData({ ...formData, handyman_materials: item.val })}
                            >
                              <span className={styles.radioDot} />
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>{t.labelHandymanSpace}</label>
                        <div className={styles.radioStack}>
                          {[
                            { val: "Residential (House / Apartment / Villa)", label: t.hmSpace1 },
                            { val: "Commercial (Office / Retail / Restaurant / Facility)", label: t.hmSpace2 },
                            { val: "Industrial (Warehouse / Factory / Plant)", label: t.hmSpace3 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`${styles.radioRow} ${formData.handyman_space === item.val ? styles.radioRowActive : ""}`}
                              onClick={() => setFormData({ ...formData, handyman_space: item.val })}
                            >
                              <span className={styles.radioDot} />
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3D. OTHER / CUSTOM */}
                  {formData.category === "other" && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelOtherScope}</label>
                      <textarea
                        className={styles.textarea}
                        rows={3}
                        value={formData.other_scope}
                        onChange={(e) => setFormData({ ...formData, other_scope: e.target.value })}
                        placeholder={t.placeholderOtherScope}
                      />
                    </div>
                  )}
                </div>

                {/* 4. TECHNICAL UPLOADS & MEDIA */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:paperclip" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.sec4Title}</span>
                    </div>
                    <span className={styles.blockBadge}>{t.sec4Badge}</span>
                  </div>

                  <label className={styles.uploadZone}>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.dwg,.txt"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                    <div className={styles.uploadIcon}>
                      <iconify-icon icon="lucide:upload-cloud" />
                    </div>
                    <div className={styles.uploadText}>{t.uploadZoneText}</div>
                    <div className={styles.uploadSub}>{t.uploadZoneSub}</div>
                  </label>

                  {formData.attached_files.length > 0 && (
                    <div className={styles.fileList}>
                      {formData.attached_files.map((file, idx) => (
                        <span key={idx} className={styles.fileBadge}>
                          <iconify-icon icon="lucide:file-text" />
                          <span>{file.name}</span>
                          <span
                            className={styles.fileRemove}
                            onClick={() => handleRemoveFile(idx)}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. TIMELINES, REPORTING & BUDGET */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <div className={styles.blockTitleText}>
                      <iconify-icon icon="lucide:clock-4" style={{ color: "#FF4500", fontSize: 17 }} />
                      <span>{t.sec5Title}</span>
                    </div>
                    <span className={styles.blockBadge}>{t.sec5Badge}</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelUrgency}</label>
                    <div className={styles.radioStack}>
                      {[
                        { val: "🚨 Emergency / Immediate Response", label: t.urgOpt1 },
                        { val: "⚡ Within 48 Hours", label: t.urgOpt2 },
                        { val: "📅 Planned Project", label: t.urgOpt3 },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`${styles.radioRow} ${formData.urgency_level === item.val ? styles.radioRowActive : ""}`}
                          onClick={() => setFormData({ ...formData, urgency_level: item.val })}
                        >
                          <span className={styles.radioDot} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelUpdates}</label>
                      <select
                        className={styles.select}
                        value={formData.update_frequency}
                        onChange={(e) => setFormData({ ...formData, update_frequency: e.target.value })}
                      >
                        <option value="Daily Progress Logs & Photo Reports">{t.updOpt1}</option>
                        <option value="Weekly Executive Summary">{t.updOpt2}</option>
                        <option value="Milestone-based Reporting Only">{t.updOpt3}</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.labelBudget}</label>
                      <select
                        className={styles.select}
                        value={formData.budget_tier}
                        onChange={(e) => setFormData({ ...formData, budget_tier: e.target.value })}
                      >
                        <option value="< $250 / 150,000 XOF">{t.budgOpt1}</option>
                        <option value="$250 – $1,000 / 150,000 – 600,000 XOF">{t.budgOpt2}</option>
                        <option value="$1,000 – $5,000 / 600,000 – 3,000,000 XOF">{t.budgOpt3}</option>
                        <option value="$5,000+ / 3,000,000+ XOF">{t.budgOpt4}</option>
                        <option value="Enterprise / Request Custom Quotation">{t.budgOpt5}</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelChannels}</label>
                    <div className={styles.checklistGrid}>
                      {[
                        { id: "wa", label: t.chan1 },
                        { id: "email", label: t.chan2 },
                        { id: "dash", label: t.chan3 },
                        { id: "phone", label: t.chan4 },
                      ].map((item) => {
                        const isSelected = formData.communication_channels.includes(item.label);
                        return (
                          <div
                            key={item.id}
                            className={`${styles.checkItem} ${isSelected ? styles.checkItemActive : ""}`}
                            onClick={() => handleToggleChannel(item.label)}
                          >
                            <span className={styles.customCheck}>
                              {isSelected && <iconify-icon icon="lucide:check" />}
                            </span>
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  <iconify-icon icon={loading ? "lucide:loader" : "lucide:sparkles"} />
                  {loading ? t.btnSubmitting : t.btnSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
