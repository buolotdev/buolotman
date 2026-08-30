"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import ImageCropperModal from "@/app/components/ImageCropperModal";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears?: string;
  technicianId?: string;
  avatarUrl?: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    changeCover: "Change Cover Photo",
    addCover: "Add Cover Photo",
    verifiedCompany: "Verified Company ✓",
    businessRegistered: "Business Registered",
    insured: "Insured ✓",
    reviews: "Reviews",
    share: "Share",
    copied: "Copied",
    viewPublicProfile: "View Public Profile",
    saveChanges: "Save & Continue",
    saveAndContinue: "Save & Continue",
    prevStep: "Previous Step",
    teamModalSub: "Highlight technical leadership and qualified site personnel.",
    saveSuccessNext: "Step saved! Proceeding to next section.",
    saving: "Saving...",
    savingAll: "Saving All Changes...",
    saveEnterpriseProfile: "Save Enterprise Profile",
    backToDashboard: "Back to Dashboard",
    tabOverview: "1. Overview & Branding",
    tabVerification: "2. Legal Verification & Badges",
    tabCapabilities: "3. Capabilities & Fleet",
    tabServices: "4. Services Offered",
    tabProjects: "5. Past Projects",
    tabTeam: "6. Key Personnel",
    tabInsurance: "7. Insurance & Matchmaking",
    companyOverviewTitle: "Company Overview & Contact Information",
    legalCompanyName: "Legal Registered Company Name *",
    tradingName: "Trading / Commercial Name (Optional)",
    companyStructure: "Company Structure / Type",
    primaryIndustry: "Primary Industry Sector *",
    yearFounded: "Year Founded / Established",
    headcount: "Total Company Headcount",
    contactPersonName: "Primary Contact Person Full Name",
    contactPersonRole: "Contact Person Position / Title",
    businessPhone: "Official Business Phone",
    corporateEmail: "Official Corporate Email",
    websiteUrl: "Official Website URL",
    headquartersAddress: "Headquarters Physical Address",
    tagline: "Executive Tagline / Slogan",
    biography: "Comprehensive Company Biography & Overview",
    biographyPlaceholder: "Provide a detailed overview of your company history, mission, execution standards, and key achievements...",
    areasOfExpertise: "Areas of Expertise & Trade Keywords",
    tagPlaceholder: "Type tag (e.g. High-Voltage, Renovation, BOQ) and click Add",
    add: "Add",
    verificationTitle: "Legal & Business Verification (4-Tier Progression)",
    tier3Badge: "Tier 3: Capability Verified ✓",
    tier1Title: "1. Registered Company",
    tier1Desc: "Basic corporate profile and contact information created.",
    tier2Title: "2. Business Verified",
    tier2Desc: "Legal incorporation (RCCM) and Tax ID (IFU) validated.",
    tier3Title: "3. Capability Verified",
    tier3Desc: "Engineers, equipment fleet, and past project portfolio confirmed.",
    tier4Title: "4. Verified Company",
    tier4Desc: "Full insurance compliance and top-tier marketplace trust rating.",
    completedStatus: "Completed ✓",
    targetLevel: "Target Level",
    confidentialNotice: "Upload legal registration certificates and official trade licenses. Documents remain 100% confidential to Boulot Man administrators and are never exposed publicly to clients.",
    rccmTitle: "Business Registration (RCCM Certificate)",
    rccmSub: "Official Commercial Registry Certificate",
    ifuTitle: "Tax ID / IFU Clearance Certificate",
    ifuSub: "Taxpayer Identification & Status Document",
    repTitle: "Authorized Representative ID & Authorization",
    repSub: "National ID/Passport & Power of Attorney",
    uploadFile: "Upload File",
    uploading: "Uploading...",
    vaultTitle: "Verified Document Vault",
    noDocs: "No documents uploaded yet. Upload your RCCM and IFU documents using the buttons above.",
    verifiedStatus: "Verified ✓",
    underReviewStatus: "Under Review",
    view: "View",
    capabilitiesTitle: "Execution Capacity, Equipment & Fleet",
    capabilitiesDesc: "State your actual operational capacity so Boulot Man can accurately match your company with large infrastructure, construction, and enterprise tenders.",
    maxProjectCapacity: "Maximum Project Capacity",
    concurrentSites: "Concurrent Project Sites",
    charteredEngineers: "Chartered Engineers",
    permanentWorkforce: "Permanent Workforce",
    maxSingleValue: "Maximum Single Project Value (XOF)",
    simultaneousCapacity: "Simultaneous Project Sites Capacity",
    engineersCount: "Number of Qualified Engineers on Staff",
    mobilityRadius: "Geographic Mobilization Radius",
    facilitiesLabel: "Office, Workshops & Warehouse Facilities",
    equipmentLabel: "Owned & Leased Heavy Machinery, Equipment & Fleet",
    addEquipmentPlaceholder: "Add equipment (e.g. 20T Crane, Scaffolding, Excavator)",
    addEquipmentBtn: "Add Equipment",
    servicesCatalogTitle: "Commercial Services Offered & Catalog",
    addNewService: "Add New Service",
    cancel: "Cancel",
    servicesDesc: "List all services your company provides. Clients browsing for enterprise contractors will see these on your public company profile.",
    addServiceBoxTitle: "Add a New Service Offering",
    serviceTitle: "Service Title *",
    serviceCategory: "Category",
    pricingModel: "Pricing / Quotation Model",
    shortScopeDesc: "Short Scope Description",
    confirmAddService: "Confirm & Add Service",
    noServices: "No services listed yet. Click \"Add New Service\" above to list your company offerings.",
    projectsTitle: "Past Projects & Portfolio Showcase",
    addPastProject: "Add Past Project",
    projectsDesc: "Showcase successfully completed contracts, site photographs, client case studies, and contract values to build high trust with clients.",
    addProjectBoxTitle: "Add a Completed Contract / Case Study",
    projectName: "Project Name / Title *",
    clientOrg: "Client / Partner Organization",
    contractValue: "Contract / Project Value (XOF)",
    completionTimeline: "Project Completion Timeline",
    addToPortfolio: "Add to Portfolio",
    noProjects: "No portfolio projects added yet. Click \"Add Past Project\" above to showcase your work.",
    teamTitle: "Key Personnel & Engineering Leadership",
    addTeamMember: "Add Team Member",
    teamDesc: "Highlight your Managing Director, Project Managers, Lead Civil/Electrical Engineers, Site Supervisors, and HSE Safety Officers.",
    experience: "Experience",
    addKeyPersonnelTitle: "Add Key Technical Personnel",
    fullName: "Full Name *",
    positionRole: "Position / Role *",
    qualificationsDegrees: "Qualification / Degrees",
    yearsExp: "Years of Experience",
    saveMember: "Save Member",
    insuranceTitle: "Insurance, Corporate Payouts & Project Participation",
    insuranceBoxTitle: "Corporate Insurance & Safety Compliance",
    insuranceBoxDesc: "Holding public liability and workers' compensation insurance qualifies your company for high-budget government and institutional tenders.",
    insuranceProvider: "Insurance Provider",
    policyNumber: "Policy Number",
    coverageScope: "Coverage Scope & Amount",
    bankingTitle: "Corporate Banking & Payout Account (Confidential)",
    bankName: "Bank Name",
    accountNumber: "Account Number / IBAN",
    matchmakingTitle: "Boulot Man Project Matchmaking Preferences",
    largeBiddingTitle: "Large Project Bidding",
    largeBiddingSub: "Receive notifications for tenders over 10,000,000 XOF",
    subcontractingTitle: "Subcontracting Opportunities",
    subcontractingSub: "Partner with international contractors on local site execution",
    conciergeTitle: "Concierge Supervision",
    conciergeSub: "Direct dispatch for Boulot Man managed enterprise clients",
    emergencyTitle: "24/7 Emergency Dispatch",
    emergencySub: "Priority mobilization for urgent utility/commercial breakdowns",
  },
  fr: {
    changeCover: "Changer la photo de couverture",
    addCover: "Ajouter une photo de couverture",
    verifiedCompany: "Entreprise Vérifiée ✓",
    businessRegistered: "Entreprise Enregistrée",
    insured: "Assurée ✓",
    reviews: "Avis",
    share: "Partager",
    copied: "Copié",
    viewPublicProfile: "Voir le profil public",
    saveChanges: "Enregistrer & Continuer",
    saveAndContinue: "Enregistrer & Continuer",
    prevStep: "Étape précédente",
    teamModalSub: "Mettez en avant vos ingénieurs et cadres techniques qualifiés.",
    saveSuccessNext: "Étape enregistrée ! Passage à l'étape suivante.",
    saving: "Enregistrement...",
    savingAll: "Enregistrement de tout le profil...",
    saveEnterpriseProfile: "Enregistrer le Profil Entreprise",
    backToDashboard: "Retour au tableau de bord",
    tabOverview: "1. Présentation & Image",
    tabVerification: "2. Vérification Légale & Badges",
    tabCapabilities: "3. Capacités & Flotte",
    tabServices: "4. Services Proposés",
    tabProjects: "5. Réalisations",
    tabTeam: "6. Personnel Clé",
    tabInsurance: "7. Assurance & Jumelage",
    companyOverviewTitle: "Présentation de l'Entreprise & Coordonnées",
    legalCompanyName: "Raison Sociale Légale *",
    tradingName: "Nom Commercial (Facultatif)",
    companyStructure: "Forme Juridique / Structure",
    primaryIndustry: "Secteur d'Activité Principal *",
    yearFounded: "Année de Création",
    headcount: "Effectif Total de l'Entreprise",
    contactPersonName: "Nom Complet du Contact Principal",
    contactPersonRole: "Fonction / Titre du Contact",
    businessPhone: "Téléphone Professionnel",
    corporateEmail: "E-mail Professionnel",
    websiteUrl: "Site Web Officiel",
    headquartersAddress: "Adresse Physique du Siège",
    tagline: "Slogan / Phrase d'Accroche",
    biography: "Présentation Complète & Historique de l'Entreprise",
    biographyPlaceholder: "Décrivez l'historique de votre entreprise, votre mission, vos standards d'exécution et vos réussites majeures...",
    areasOfExpertise: "Domaines d'Expertise & Mots-clés Métier",
    tagPlaceholder: "Saisissez un mot-clé (ex: Haute Tension, Rénovation, DQE) et cliquez sur Ajouter",
    add: "Ajouter",
    verificationTitle: "Vérification Juridique & Statut Entreprise (Progression 4 Niveaux)",
    tier3Badge: "Niveau 3 : Capacité Confirmée ✓",
    tier1Title: "1. Entreprise Enregistrée",
    tier1Desc: "Profil d'entreprise de base et coordonnées créés.",
    tier2Title: "2. Entreprise Validée",
    tier2Desc: "Immatriculation RCCM et Identifiant Fiscal (IFU) validés.",
    tier3Title: "3. Capacité Confirmée",
    tier3Desc: "Ingénieurs, parc de matériel et portefeuille de projets confirmés.",
    tier4Title: "4. Entreprise Vérifiée d'Élite",
    tier4Desc: "Conformité d'assurance complète et niveau de confiance maximal.",
    completedStatus: "Complété ✓",
    targetLevel: "Niveau Visé",
    confidentialNotice: "Téléversez vos certificats d'enregistrement légal et agréments officiels. Vos documents demeurent 100% confidentiels aux administrateurs Boulot Man et ne sont jamais rendus publics.",
    rccmTitle: "Registre du Commerce (Certificat RCCM)",
    rccmSub: "Extrait officiel du Registre du Commerce et du Crédit Mobilier",
    ifuTitle: "Attestation Fiscale / Numéro IFU",
    ifuSub: "Document officiel d'identification fiscale et de situation",
    repTitle: "Pièce d'Identité & Pouvoir du Représentant",
    repSub: "CNI/Passeport et Mandat / Procuration de gestion",
    uploadFile: "Téléverser",
    uploading: "Téléversement...",
    vaultTitle: "Coffre-fort des Documents Vérifiés",
    noDocs: "Aucun document téléversé pour le moment. Utilisez les boutons ci-dessus pour envoyer votre RCCM et IFU.",
    verifiedStatus: "Vérifié ✓",
    underReviewStatus: "En cours d'examen",
    view: "Consulter",
    capabilitiesTitle: "Capacité d'Exécution, Matériel & Flotte",
    capabilitiesDesc: "Renseignez vos capacités opérationnelles réelles pour permettre à Boulot Man de vous jumeler aux grands appels d'offres et chantiers d'envergure.",
    maxProjectCapacity: "Capacité Maximale par Projet",
    concurrentSites: "Chantiers Simultanés",
    charteredEngineers: "Ingénieurs Agréés",
    permanentWorkforce: "Effectif Permanent",
    maxSingleValue: "Valeur Maximale d'un Projet Unique (XOF)",
    simultaneousCapacity: "Capacité de Chantiers Simultanés",
    engineersCount: "Nombre d'Ingénieurs Qualifiés",
    mobilityRadius: "Rayon de Mobilité Géographique",
    facilitiesLabel: "Bureaux, Ateliers & Entrepôts",
    equipmentLabel: "Engins Lourds, Véhicules & Équipements Détenus ou Loués",
    addEquipmentPlaceholder: "Ajouter un engin (ex: Grue 20T, Échafaudage, Pelleteuse)",
    addEquipmentBtn: "Ajouter l'Équipement",
    servicesCatalogTitle: "Catalogue des Prestations & Services Proposés",
    addNewService: "Ajouter un Service",
    cancel: "Annuler",
    servicesDesc: "Listez l'ensemble des services proposés par votre entreprise. Les clients professionnels les verront sur votre profil public.",
    addServiceBoxTitle: "Ajouter une Nouvelle Prestation",
    serviceTitle: "Intitulé du Service *",
    serviceCategory: "Catégorie",
    pricingModel: "Modèle de Tarification / Devis",
    shortScopeDesc: "Description Courte du Périmètre",
    confirmAddService: "Valider & Ajouter le Service",
    noServices: "Aucun service répertorié pour l'instant. Cliquez sur « Ajouter un Service » ci-dessus pour compléter votre offre.",
    projectsTitle: "Historique des Projets & Réalisations",
    addPastProject: "Ajouter un Projet",
    projectsDesc: "Mettez en avant vos chantiers achevés, photos de réalisations, références clients et montants de contrat pour rassurer vos futurs partenaires.",
    addProjectBoxTitle: "Ajouter un Chantier Achevée / Référence",
    projectName: "Nom / Titre du Projet *",
    clientOrg: "Client / Maître d'Ouvrage",
    contractValue: "Montant du Contrat (XOF)",
    completionTimeline: "Délai de Réalisation",
    addToPortfolio: "Ajouter au Portfolio",
    noProjects: "Aucun projet dans le portfolio pour l'instant. Cliquez sur « Ajouter un Projet » ci-dessus pour valoriser vos réalisations.",
    teamTitle: "Direction Technique & Personnel Clé",
    addTeamMember: "Ajouter un Membre",
    teamDesc: "Mettez en valeur votre Direction Générale, Chefs de Projet, Ingénieurs BTP/Électricité, Superviseurs et Responsables HSE.",
    experience: "d'expérience",
    addKeyPersonnelTitle: "Ajouter un Personnel Technique Clé",
    fullName: "Nom Complet *",
    positionRole: "Poste / Fonction *",
    qualificationsDegrees: "Diplômes / Qualifications",
    yearsExp: "Années d'Expérience",
    saveMember: "Enregistrer le Membre",
    insuranceTitle: "Assurances, Comptes Bancaires & Jumelage de Projets",
    insuranceBoxTitle: "Assurances Professionnelles & Conformité Sécurité",
    insuranceBoxDesc: "Disposer d'une assurance Responsabilité Civile Professionnelle et Décennale vous rend éligible aux marchés publics et institutionnels à gros budget.",
    insuranceProvider: "Compagnie d'Assurance",
    policyNumber: "Numéro de Police d'Assurance",
    coverageScope: "Plafond & Étendue de Couverture",
    bankingTitle: "Compte Bancaire de Règlement (Confidentiel)",
    bankName: "Nom de la Banque",
    accountNumber: "Numéro de Compte / IBAN",
    matchmakingTitle: "Préférences de Jumelage & Opportunités Boulot Man",
    largeBiddingTitle: "Appels d'Offres Majeurs",
    largeBiddingSub: "Recevoir des notifications pour les marchés supérieurs à 10 000 000 XOF",
    subcontractingTitle: "Opportunités de Sous-traitance",
    subcontractingSub: "Partenariat avec des majors internationaux sur l'exécution locale",
    conciergeTitle: "Supervision Grands Comptes",
    conciergeSub: "Attribution directe sur les missions d'entreprises gérées par Boulot Man",
    emergencyTitle: "Interventions d'Urgence 24h/7j",
    emergencySub: "Mobilisation prioritaire pour pannes techniques critiques ou sinistres",
  }
};

export const ALL_SERVICE_CATEGORIES = [
  "Civil & Building Construction",
  "Architecture, 3D Rendering & Interior Design",
  "Electrical, Power & Solar Energy",
  "HVAC, Industrial Cooling & Refrigeration",
  "Plumbing, Water Sanitation & Boreholes",
  "Software, Web & Mobile App Development",
  "IT Networks, Structured Cabling & CCTV",
  "Cybersecurity, Systems & Data Protection",
  "Cloud Infrastructure, DevOps & Server Hosting",
  "Mechanical Engineering & Industrial Machinery",
  "Metal Fabrication, Welding & Steel Structures",
  "Renewable Energy & Solar PV Farms",
  "Automotive, Mobile Mechanic & Fleet Servicing",
  "Telecom, Fiber Optics & Tower Installations",
  "Facility Management, Commercial Cleaning & Pest Control",
  "Heavy Logistics, Transport & Equipment Rental",
  "Audio-Visual, Photography & Media Production",
  "Quantity Surveying, BOQ & Cost Control",
  "Fire Safety, Smoke Detection & Access Control",
  "Interior Finishing, Tiling, Painting & Plastering",
  "Elevators, Escalators & Lifting Equipment",
  "Landscaping, Environmental & Agricultural Irrigation",
  "Corporate Consulting & Enterprise IT Support"
];

export const TAB_ORDER = [
  "overview",
  "verification",
  "capabilities",
  "services",
  "projects",
  "team",
  "insurance",
] as const;

export type TabType = typeof TAB_ORDER[number];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Nelson Tagor",
    role: "Managing Director / CEO",
    qualification: "M.Sc. Civil & Structural Engineering",
    experienceYears: "14+ Years",
  },
  {
    id: "tm-2",
    name: "Marcelle Dossou",
    role: "Lead Project Manager",
    qualification: "PMP Certified / B.Sc. Construction Mgmt",
    experienceYears: "9+ Years",
  },
  {
    id: "tm-3",
    name: "Alexandre Houeto",
    role: "Chief Electrical & Solar Engineer",
    qualification: "Chartered Electrical Engineer (OIB)",
    experienceYears: "11+ Years",
  }
];

const DEFAULT_CAPABILITIES = {
  maxProjectBudget: "250,000,000 XOF",
  simultaneousProjects: "5 Sites",
  permanentWorkforce: "42 Staff",
  qualifiedEngineers: "8 Engineers",
  fieldSupervisors: "6 Supervisors",
  geographicMobility: "Nationwide & Cross-Border (West Africa)",
  facilities: "Central Workshop & 1,200m² Storage Depot",
  equipment: [
    "Caterpillar 320D Excavator",
    "2x Mercedes 20T Dump Trucks",
    "Potain Self-Erecting Tower Crane",
    "50kVA Perkins Diesel Backup Generator",
    "Total Station Leica TS07 Survey Gear",
    "Heavy Scaffolding Systems (2,000m²)"
  ]
};

export default function CompanyProfilePage() {
  const toast = useToast();
  const dialog = useDialog();

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

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Fetches
  const { data: user, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: rawCategories } = useFetch(() => api.getCategories().catch(() => []), []);
  const { data: servicesData, refetch: refetchServices } = useFetch(() => api.getCompanyServices(), []);
  const { data: projectsData, refetch: refetchProjects } = useFetch(() => api.getCompanyProjects(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);
  const documents = useMemo(() => (Array.isArray(rawDocuments) ? rawDocuments : []), [rawDocuments]);

  // Combined comprehensive categories
  const availableCategories = useMemo(() => {
    const dynamic = Array.isArray(rawCategories)
      ? rawCategories.map((c: any) => c.name || c.title).filter(Boolean)
      : [];
    return Array.from(new Set([...ALL_SERVICE_CATEGORIES, ...dynamic]));
  }, [rawCategories]);

  // Form State - Overview & Branding
  const [form, setForm] = useState({
    company_name: "",
    trading_name: "",
    company_type: "Limited Liability Company (SARL)",
    year_founded: "",
    industry: "Civil & Building Construction",
    subject_title: "",
    about: "",
    website: "",
    country: "",
    city: "",
    headquarters: "",
    employee_count: "25 - 50 Employees",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_phone: "",
    primary_email: "",
    preferred_language: "fr",
    working_hours: "Mon - Sat: 07:30 - 18:00",
    areas_of_expertise: [] as string[],
    services_offered: [] as string[],
  });

  const [expertiseInput, setExpertiseInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Form State - Capabilities & Fleet
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES);
  const [equipmentInput, setEquipmentInput] = useState("");

  // Form State - Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("");
  const [newTeamQual, setNewTeamQual] = useState("");
  const [newTeamExp, setNewTeamExp] = useState("");

  // Form State - Insurance, Banking & Matchmaking
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("AXA-BENIN-PL-902341");
  const [insuranceProvider, setInsuranceProvider] = useState("AXA Assurances Bénin");
  const [insuranceCoverage, setInsuranceCoverage] = useState("500,000,000 XOF Public Liability");
  const [bankName, setBankName] = useState("Bank of Africa (BOA)");
  const [accountNumber, setAccountNumber] = useState("BJ061 01001 0023491823 45");
  const [swiftBic, setSwiftBic] = useState("AFRIBJBJ");
  const [matchLargeBidding, setMatchLargeBidding] = useState(true);
  const [matchSubcontracting, setMatchSubcontracting] = useState(true);
  const [matchConcierge, setMatchConcierge] = useState(true);
  const [matchEmergency, setMatchEmergency] = useState(false);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: "logo" | "cover" } | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Add Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Civil & Building Construction");
  const [newServicePricing, setNewServicePricing] = useState("Request Quote");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [addingService, setAddingService] = useState(false);

  // Add Portfolio Project Form State
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectTimeline, setNewProjectTimeline] = useState("");
  const [addingProject, setAddingProject] = useState(false);

  // Sync profile data to form
  useEffect(() => {
    if (profile && !profileLoading) {
      setForm({
        company_name: profile.company_name || user?.company_name || "",
        trading_name: profile.trading_name || profile.company_name || user?.company_name || "",
        company_type: profile.company_type || "Limited Liability Company (SARL)",
        year_founded: profile.year_founded || "",
        industry: profile.industry || "Construction",
        subject_title: profile.subject_title || "",
        about: profile.about || "",
        website: profile.website || "",
        country: profile.country || user?.country || "Benin",
        city: profile.city || user?.city || "Cotonou",
        headquarters: profile.headquarters || user?.address || "",
        employee_count: profile.employee_count || "25 - 50 Employees",
        primary_contact_name: profile.primary_contact_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        primary_contact_role: profile.primary_contact_role || "Managing Director",
        primary_phone: profile.primary_phone || user?.phone || "",
        primary_email: profile.primary_email || user?.email || "",
        preferred_language: profile.preferred_language || "fr",
        working_hours: profile.working_hours || "Mon - Sat: 07:30 - 18:00",
        areas_of_expertise: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        services_offered: Array.isArray(profile.services_offered) ? profile.services_offered : [],
      });
      if (profile.logo_url) setLogoUrl(profile.logo_url);
      if (profile.cover_url) setCoverUrl(profile.cover_url);
    }
  }, [profile, profileLoading, user]);

  // Load Saved Capabilities & Team from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawCaps = localStorage.getItem("boulotman_company_capabilities");
      if (rawCaps) {
        try { setCapabilities(JSON.parse(rawCaps)); } catch {}
      }
      const rawTeam = localStorage.getItem("boulotman_company_team");
      if (rawTeam) {
        try { setTeamMembers(JSON.parse(rawTeam)); } catch {}
      }
    }
  }, []);

  const isVerified = Boolean(profile?.is_verified || user?.is_verified || user?.company_profile?.is_verified);
  const companyName = form.company_name || user?.company_name || "Enterprise Contractor";
  const initials = useMemo(() => {
    return companyName.substring(0, 2).toUpperCase() || "CO";
  }, [companyName]);

  const services = useMemo(() => {
    if (Array.isArray(servicesData) && servicesData.length > 0) return servicesData;
    if (Array.isArray(profile?.services) && profile.services.length > 0) return profile.services;
    if (form.services_offered && form.services_offered.length > 0) {
      return form.services_offered.map((title, idx) => ({
        id: `mock-${idx}`,
        title,
        category: "General Contracting",
        pricing_model: "Request Quote",
        description: "",
      }));
    }
    return [];
  }, [servicesData, profile, form.services_offered]);

  const projects = useMemo(() => {
    if (Array.isArray(projectsData) && projectsData.length > 0) return projectsData;
    if (Array.isArray(profile?.projects) && profile.projects.length > 0) return profile.projects;
    return [];
  }, [projectsData, profile]);

  // Image Upload Handlers
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropData({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const { type } = cropData;
    setCropData(null);

    if (type === "logo") {
      setUploadingLogo(true);
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url;
        setLogoUrl(url);
        await api.updateCompanyProfile({ logo_url: url });
        await refetchProfile();
        toast.success("Logo Updated", "Company logo has been updated successfully.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload company logo.");
      } finally {
        setUploadingLogo(false);
      }
    } else {
      setUploadingCover(true);
      try {
        const res = await api.uploadBanner(croppedFile);
        const url = res.banner_url || res.url || res.file_url;
        setCoverUrl(url);
        await api.updateCompanyProfile({ cover_url: url });
        await refetchProfile();
        toast.success("Banner Updated", "Company cover banner has been updated.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload banner.");
      } finally {
        setUploadingCover(false);
      }
    }
  };

  // Save All Profile Details
  const handleSaveProfile = async (advanceToNext: boolean = true) => {
    setSaving(true);
    try {
      await api.updateCompanyProfile({
        company_name: form.company_name.trim(),
        trading_name: form.trading_name.trim(),
        company_type: form.company_type,
        year_founded: form.year_founded.trim(),
        industry: form.industry,
        subject_title: form.subject_title.trim(),
        about: form.about.trim(),
        website: form.website.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        headquarters: form.headquarters.trim(),
        employee_count: form.employee_count,
        primary_contact_name: form.primary_contact_name.trim(),
        primary_contact_role: form.primary_contact_role.trim(),
        primary_phone: form.primary_phone.trim(),
        primary_email: form.primary_email.trim(),
        preferred_language: form.preferred_language,
        working_hours: form.working_hours.trim(),
        areas_of_expertise: form.areas_of_expertise,
      });

      // Save capabilities & team to localStorage
      localStorage.setItem("boulotman_company_capabilities", JSON.stringify(capabilities));
      localStorage.setItem("boulotman_company_team", JSON.stringify(teamMembers));
      if (profile?.id) {
        localStorage.setItem(`boulotman_company_team_${profile.id}`, JSON.stringify(teamMembers));
        localStorage.setItem(`boulotman_company_capabilities_${profile.id}`, JSON.stringify(capabilities));
      }
      if (user?.id) {
        localStorage.setItem(`boulotman_company_team_${user.id}`, JSON.stringify(teamMembers));
        localStorage.setItem(`boulotman_company_capabilities_${user.id}`, JSON.stringify(capabilities));
      }

      await refetchProfile();
      await refetchUser();

      const currentIdx = TAB_ORDER.indexOf(activeTab);
      if (advanceToNext && currentIdx < TAB_ORDER.length - 1) {
        const nextTab = TAB_ORDER[currentIdx + 1];
        setActiveTab(nextTab);
        toast.success(
          lang === "fr" ? "Étape Enregistrée" : "Section Saved",
          t.saveSuccessNext || (lang === "fr" ? "Passage automatique à l'étape suivante !" : "Changes saved! Moving to the next step.")
        );
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 380, behavior: "smooth" });
        }
      } else {
        toast.success(
          lang === "fr" ? "Profil Enregistré" : "Profile Saved",
          lang === "fr" ? "Toutes les informations de l'entreprise ont été enregistrées avec succès." : "Company profile and enterprise details updated successfully."
        );
      }
    } catch (err: any) {
      toast.error(
        lang === "fr" ? "Échec de l'enregistrement" : "Save Failed",
        err?.message || (lang === "fr" ? "Impossible d'enregistrer les modifications." : "Could not save company profile changes.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.origin + `/profile/${profile?.id || user?.id}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      toast.info("Link Copied", "Public company profile link copied to clipboard.");
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Expertise Tags
  const addExpertise = () => {
    if (!expertiseInput.trim()) return;
    const val = expertiseInput.trim();
    if (!form.areas_of_expertise.includes(val)) {
      setForm(prev => ({ ...prev, areas_of_expertise: [...prev.areas_of_expertise, val] }));
    }
    setExpertiseInput("");
  };

  const removeExpertise = (tag: string) => {
    setForm(prev => ({
      ...prev,
      areas_of_expertise: prev.areas_of_expertise.filter(t => t !== tag),
    }));
  };

  // Equipment Tags
  const addEquipment = () => {
    if (!equipmentInput.trim()) return;
    const val = equipmentInput.trim();
    if (!capabilities.equipment.includes(val)) {
      const updated = { ...capabilities, equipment: [...capabilities.equipment, val] };
      setCapabilities(updated);
      localStorage.setItem("boulotman_company_capabilities", JSON.stringify(updated));
    }
    setEquipmentInput("");
  };

  const removeEquipment = (item: string) => {
    const updated = { ...capabilities, equipment: capabilities.equipment.filter(e => e !== item) };
    setCapabilities(updated);
    localStorage.setItem("boulotman_company_capabilities", JSON.stringify(updated));
  };

  // Services CRUD
  const handleCreateService = async () => {
    if (!newServiceTitle.trim()) {
      toast.error("Required", "Please provide a service title.");
      return;
    }
    setAddingService(true);
    try {
      await api.createCompanyService({
        title: newServiceTitle.trim(),
        category: newServiceCategory,
        pricing_model: newServicePricing,
        description: newServiceDesc.trim(),
        status: "Active",
      });
      if (!form.services_offered.includes(newServiceTitle.trim())) {
        const updated = [...form.services_offered, newServiceTitle.trim()];
        setForm(prev => ({ ...prev, services_offered: updated }));
        await api.updateCompanyProfile({ services_offered: updated });
      }
      await refetchServices();
      await refetchProfile();
      setNewServiceTitle("");
      setNewServiceDesc("");
      setShowAddService(false);
      toast.success("Service Added", "New enterprise service is now visible to clients.");
    } catch (err: any) {
      toast.error("Failed to add service", err?.message || "Please try again.");
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string | number, serviceTitle: string) => {
    const ok = await dialog.confirm({
      title: "Remove Service?",
      message: `Are you sure you want to remove "${serviceTitle}"?`,
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      if (typeof serviceId === "number" || !String(serviceId).startsWith("mock-")) {
        await api.deleteCompanyService(Number(serviceId));
      }
      const updated = form.services_offered.filter(s => s !== serviceTitle);
      setForm(prev => ({ ...prev, services_offered: updated }));
      await api.updateCompanyProfile({ services_offered: updated });
      await refetchServices();
      await refetchProfile();
      toast.success("Service Removed", "Service deleted successfully.");
    } catch (err: any) {
      toast.error("Error", err?.message || "Failed to delete service.");
    }
  };

  // Projects CRUD
  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error("Required", "Please provide a project title.");
      return;
    }
    setAddingProject(true);
    try {
      await api.createCompanyProject({
        title: newProjectTitle.trim(),
        client_name: newProjectClient.trim() || "Corporate Client",
        location: newProjectUrl.trim(),
        budget: newProjectBudget ? Number(newProjectBudget.replace(/[^0-9.]/g, "")) : null,
        timeline: newProjectTimeline.trim() || "Completed",
        status: "completed",
        progress: 100,
      });
      await refetchProjects();
      setNewProjectTitle("");
      setNewProjectClient("");
      setNewProjectUrl("");
      setNewProjectBudget("");
      setNewProjectTimeline("");
      setShowAddProject(false);
      toast.success("Portfolio Updated", "Project added to your past projects showcase.");
    } catch (err: any) {
      toast.error("Failed to add project", err?.message || "Please try again.");
    } finally {
      setAddingProject(false);
    }
  };

  // Team CRUD
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamRole.trim()) {
      toast.error("Required", "Please provide name and position.");
      return;
    }
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newTeamName.trim(),
      role: newTeamRole.trim(),
      qualification: newTeamQual.trim() || "Qualified Technical Personnel",
      experienceYears: newTeamExp.trim() || "5+ Years",
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem("boulotman_company_team", JSON.stringify(updated));
    if (profile?.id) localStorage.setItem(`boulotman_company_team_${profile.id}`, JSON.stringify(updated));
    if (user?.id) localStorage.setItem(`boulotman_company_team_${user.id}`, JSON.stringify(updated));
    setNewTeamName("");
    setNewTeamRole("");
    setNewTeamQual("");
    setNewTeamExp("");
    setShowAddTeamModal(false);
    toast.success("Team Member Added", `${newMember.name} added to key personnel.`);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = teamMembers.filter(t => t.id !== id);
    setTeamMembers(updated);
    localStorage.setItem("boulotman_company_team", JSON.stringify(updated));
    if (profile?.id) localStorage.setItem(`boulotman_company_team_${profile.id}`, JSON.stringify(updated));
    if (user?.id) localStorage.setItem(`boulotman_company_team_${user.id}`, JSON.stringify(updated));
    toast.info("Member Removed", "Key personnel removed from company profile.");
  };

  // Document Upload Handlers
  const handleDocumentUpload = async (file: File, slotName: string, docType: string) => {
    setUploadingSlot(slotName);
    try {
      await api.uploadTechnicianDocument(file);
      await mutateDocuments();
      toast.success("Document Uploaded", `${slotName} uploaded for admin verification.`);
    } catch (err: any) {
      toast.error("Upload Failed", err?.message || "Please try again.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDeleteDoc = async (docId: number, title: string) => {
    const ok = await dialog.confirm({
      title: "Delete Document?",
      message: `Are you sure you want to remove "${title}"?`,
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      await api.deleteTechnicianDocument(docId);
      await mutateDocuments();
      toast.success("Document Deleted", "Document removed.");
    } catch (err: any) {
      toast.error("Error", err?.message || "Failed to delete document.");
    }
  };

  return (
    <div className={styles.content}>
      {/* CROPPER MODAL */}
      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === "logo" ? 1 : 16 / 5}
          isCircular={cropData.type === "logo"}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}

      {/* ==================== 1. TOP HERO BANNER ==================== */}
      <section className={styles.heroCard}>
        <div
          className={styles.cover}
          onClick={() => coverInputRef.current?.click()}
          title="Click to change banner"
          style={{
            cursor: "pointer",
            backgroundImage: (coverUrl || profile?.cover_url)
              ? `url(${getImageUrl(coverUrl || profile?.cover_url)})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: (coverUrl || profile?.cover_url)
              ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
              : "linear-gradient(135deg, #001f3f 0%, #1e3a8a 100%)",
          }} />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerUploadHint}>
              {uploadingCover ? (
                <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> {t.uploading}</>
              ) : (
                <><iconify-icon icon="lucide:camera" /> {(coverUrl || profile?.cover_url) ? t.changeCover : t.addCover}</>
              )}
            </div>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => onFileSelect(e, "cover")}
          />
        </div>

        <div className={styles.heroBody}>
          <div className={styles.identityBlock}>
            <div
              className={styles.avatarLarge}
              onClick={() => logoInputRef.current?.click()}
              title="Click to change company logo"
              style={{ cursor: "pointer" }}
            >
              {logoUrl || profile?.logo_url ? (
                <Image
                  src={getImageUrl(logoUrl || profile?.logo_url)}
                  alt="Company Logo"
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              ) : (
                initials
              )}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.45)", display: "flex",
                alignItems: "center", justifyContent: "center",
                opacity: uploadingLogo ? 1 : 0, transition: "opacity 0.2s",
                fontSize: 16, color: "#fff",
              }}>
                {uploadingLogo ? "..." : <iconify-icon icon="lucide:camera" />}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => onFileSelect(e, "logo")}
              />
            </div>

            <div className={styles.identityMeta}>
              <div className={styles.nameRow}>
                <h1>{companyName}</h1>
                {isVerified ? (
                  <span className={styles.verifiedBadge} title="Boulot Man Verified Enterprise">
                    <iconify-icon icon="lucide:badge-check" style={{ fontSize: 16 }} />
                    <span>{t.verifiedCompany}</span>
                  </span>
                ) : (
                  <span style={{ background: "rgba(2,132,199,0.1)", color: "#0284c7", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:building-2" /> {t.businessRegistered}
                  </span>
                )}
                <span style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <iconify-icon icon="lucide:shield-check" /> {t.insured}
                </span>
              </div>
              <div className={styles.metaList}>
                <span><iconify-icon icon="lucide:building-2" /> {form.industry || "Commercial & Industrial"}</span>
                <span><iconify-icon icon="lucide:map-pin" /> {form.city ? `${form.city}, ` : ""}{form.country || "Benin"}</span>
                {form.year_founded && <span><iconify-icon icon="lucide:calendar" /> Est. {form.year_founded}</span>}
                {capabilities.permanentWorkforce && <span><iconify-icon icon="lucide:users" /> {capabilities.permanentWorkforce}</span>}
                <span><iconify-icon icon="lucide:star" /> {profile?.average_rating && Number(profile.average_rating) > 0 ? Number(profile.average_rating).toFixed(1) : "5.0"} ({profile?.review_count ?? 0} {t.reviews})</span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button type="button" className={styles.outlineButton} onClick={handleShare}>
              <iconify-icon icon="lucide:share-2" />
              {shareCopied ? t.copied : t.share}
            </button>
            <Link
              href={profile?.id ? `/profile/${profile.id}` : "/contractors"}
              className={styles.outlineButton}
              target="_blank"
            >
              <iconify-icon icon="lucide:external-link" /> {t.viewPublicProfile}
            </Link>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => handleSaveProfile(true)}
              disabled={saving}
            >
              <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} className={saving ? styles.spinIcon : ""} />
              {saving ? t.saving : t.saveChanges}
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 7-TAB NAVIGATION ==================== */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <iconify-icon icon="lucide:building" /> {t.tabOverview}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "verification" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("verification")}
        >
          <iconify-icon icon="lucide:shield-check" /> {t.tabVerification}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "capabilities" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("capabilities")}
        >
          <iconify-icon icon="lucide:hard-hat" /> {t.tabCapabilities}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "services" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("services")}
        >
          <iconify-icon icon="lucide:layers" /> {t.tabServices} ({services.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "projects" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          <iconify-icon icon="lucide:folder-check" /> {t.tabProjects} ({projects.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "team" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("team")}
        >
          <iconify-icon icon="lucide:users" /> {t.tabTeam} ({teamMembers.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "insurance" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("insurance")}
        >
          <iconify-icon icon="lucide:lock" /> {t.tabInsurance}
        </button>
      </div>

      {/* ==================== TAB 1: OVERVIEW & BRANDING ==================== */}
      {activeTab === "overview" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:building-2" /> {t.companyOverviewTitle}</h3>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.legalCompanyName}</label>
              <input
                className={styles.input}
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="e.g. ABC Construction International SARL"
              />
            </div>
            <div>
              <label className={styles.label}>{t.tradingName}</label>
              <input
                className={styles.input}
                value={form.trading_name}
                onChange={(e) => setForm({ ...form, trading_name: e.target.value })}
                placeholder="e.g. ABC Bâtiment"
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.companyStructure}</label>
              <select
                className={styles.select}
                value={form.company_type}
                onChange={(e) => setForm({ ...form, company_type: e.target.value })}
              >
                <option value="Limited Liability Company (SARL)">Limited Liability Company (SARL / Ltd)</option>
                <option value="Public Limited Company (SA)">Public Limited Company (SA / Corp)</option>
                <option value="Sole Proprietorship (Ets)">Sole Proprietorship (Établissement)</option>
                <option value="Partnership / Joint Venture">Partnership / Joint Venture</option>
                <option value="Cooperative / Consortium">Cooperative / Consortium</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>{t.primaryIndustry}</label>
              <select
                className={styles.select}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.yearFounded}</label>
              <input
                className={styles.input}
                placeholder="e.g. 2014"
                value={form.year_founded}
                onChange={(e) => setForm({ ...form, year_founded: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>{t.headcount}</label>
              <select
                className={styles.select}
                value={form.employee_count}
                onChange={(e) => setForm({ ...form, employee_count: e.target.value })}
              >
                <option value="1 - 10 Employees">1 - 10 Employees (Small Contractor)</option>
                <option value="11 - 25 Employees">11 - 25 Employees (Growing Enterprise)</option>
                <option value="26 - 50 Employees">26 - 50 Employees (Mid-Sized Company)</option>
                <option value="50 - 150 Employees">50 - 150 Employees (Large Contractor)</option>
                <option value="150+ Employees">150+ Employees (Major Corporation)</option>
              </select>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.contactPersonName}</label>
              <input
                className={styles.input}
                placeholder="e.g. Nelson Tagor"
                value={form.primary_contact_name}
                onChange={(e) => setForm({ ...form, primary_contact_name: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>{t.contactPersonRole}</label>
              <input
                className={styles.input}
                placeholder="e.g. Managing Director & CEO"
                value={form.primary_contact_role}
                onChange={(e) => setForm({ ...form, primary_contact_role: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.businessPhone}</label>
              <input
                className={styles.input}
                placeholder="+229 97 00 00 00"
                value={form.primary_phone}
                onChange={(e) => setForm({ ...form, primary_phone: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>{t.corporateEmail}</label>
              <input
                className={styles.input}
                placeholder="contact@yourcompany.com"
                value={form.primary_email}
                onChange={(e) => setForm({ ...form, primary_email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.websiteUrl}</label>
              <input
                className={styles.input}
                placeholder="https://www.yourcompany.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>{t.headquartersAddress}</label>
              <input
                className={styles.input}
                placeholder="Plot 45, Industrial Zone, Boulevard de la Marina"
                value={form.headquarters}
                onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
              />
            </div>
          </div>

          <label className={styles.label}>{t.tagline}</label>
          <input
            className={styles.input}
            placeholder="e.g. Turnkey Civil Engineering & Renewable Power Solutions across West Africa"
            value={form.subject_title}
            onChange={(e) => setForm({ ...form, subject_title: e.target.value })}
          />

          <label className={styles.label}>{t.biography}</label>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder={t.biographyPlaceholder}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />

          {/* Areas of Expertise Tags */}
          <div style={{ marginTop: 20 }}>
            <label className={styles.label}>{t.areasOfExpertise}</label>
            <div className={styles.tags}>
              {form.areas_of_expertise.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <iconify-icon icon="lucide:x" className={styles.tagRemove} onClick={() => removeExpertise(tag)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, maxWidth: 500 }}>
              <input
                className={styles.input}
                style={{ marginBottom: 0 }}
                placeholder={t.tagPlaceholder}
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(); } }}
              />
              <button type="button" className={styles.outlineButton} onClick={addExpertise}>{t.add}</button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== TAB 2: LEGAL VERIFICATION & 4-TIER BADGES ==================== */}
      {activeTab === "verification" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} /> {t.verificationTitle}</h3>
            <span className={styles.verifiedBadge}>
              <iconify-icon icon="lucide:check-circle-2" /> {t.tier3Badge}
            </span>
          </div>

          {/* 4-Tier Interactive Tracker */}
          <div className={styles.tierGrid}>
            <div className={`${styles.tierCard} ${styles.tierCardActive}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥉</span>
                <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>{t.completedStatus}</span>
              </div>
              <h4 className={styles.tierTitle}>{t.tier1Title}</h4>
              <p className={styles.tierDesc}>{t.tier1Desc}</p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierCardActive}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥈</span>
                <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>{t.tier2Title} ✓</span>
              </div>
              <h4 className={styles.tierTitle}>{t.tier2Title}</h4>
              <p className={styles.tierDesc}>{t.tier2Desc}</p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierCardCurrent}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥇</span>
                <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>{t.tier3Badge}</span>
              </div>
              <h4 className={styles.tierTitle}>{t.tier3Title}</h4>
              <p className={styles.tierDesc}>{t.tier3Desc}</p>
            </div>

            <div className={styles.tierCard}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>💎</span>
                <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#64748b" }}>{t.targetLevel}</span>
              </div>
              <h4 className={styles.tierTitle}>{t.tier4Title}</h4>
              <p className={styles.tierDesc}>{t.tier4Desc}</p>
            </div>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.confidentialNotice}
          </p>

          {/* Upload Document Slots */}
          <div className={styles.docGrid}>
            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:file-text" /></div>
                <div>
                  <h5 className={styles.docTitle}>{t.rccmTitle}</h5>
                  <p className={styles.docSub}>{t.rccmSub}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "RCCM Certificate"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "RCCM Certificate", "certificate");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "RCCM Certificate" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "RCCM Certificate" ? t.uploading : t.uploadFile}
              </button>
            </div>

            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:receipt" /></div>
                <div>
                  <h5 className={styles.docTitle}>{t.ifuTitle}</h5>
                  <p className={styles.docSub}>{t.ifuSub}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "IFU Tax Certificate"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "IFU Tax Certificate", "certificate");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "IFU Tax Certificate" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "IFU Tax Certificate" ? t.uploading : t.uploadFile}
              </button>
            </div>

            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:user-check" /></div>
                <div>
                  <h5 className={styles.docTitle}>{t.repTitle}</h5>
                  <p className={styles.docSub}>{t.repSub}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "Representative Authorization"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "Representative Authorization", "identity");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "Representative Authorization" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "Representative Authorization" ? t.uploading : t.uploadFile}
              </button>
            </div>
          </div>

          {/* Submitted Document List */}
          <div className={styles.submittedDocsList}>
            <strong style={{ fontSize: 14, color: "#001f3f", display: "flex", alignItems: "center", gap: 6 }}>
              <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500" }} /> {t.vaultTitle} ({documents.length})
            </strong>

            {documents.length === 0 ? (
              <div style={{ padding: 18, background: "#f8fafc", borderRadius: 12, textAlign: "center", color: "#64748b", fontSize: 13, border: "1px dashed #cbd5e1" }}>
                {t.noDocs}
              </div>
            ) : (
              documents.map((doc: any) => (
                <div key={doc.id} className={styles.submittedDocItem}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <iconify-icon icon="lucide:file-check" style={{ fontSize: 24, color: "#001f3f" }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{doc.title || "Legal Document"}</strong>
                      <small style={{ color: "#64748b", fontSize: 12 }}>
                        {doc.document_type === "certificate" ? "Corporate Registration" : "Official Verification"} • Uploaded {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Recently"}
                      </small>
                    </div>
                  </div>

                  <div className={styles.docActions}>
                    <span className={`${styles.docStatusPill} ${doc.is_verified ? styles.statusApproved : styles.statusPending}`}>
                      <iconify-icon icon={doc.is_verified ? "lucide:check-circle-2" : "lucide:clock"} />
                      {doc.is_verified ? t.verifiedStatus : t.underReviewStatus}
                    </span>
                    {doc.file_url && (
                      <a href={getImageUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" className={styles.docViewLink}>
                        <iconify-icon icon="lucide:eye" /> {t.view}
                      </a>
                    )}
                    <button type="button" className={styles.docDeleteBtn} onClick={() => handleDeleteDoc(doc.id, doc.title)}>
                      <iconify-icon icon="lucide:trash-2" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 3: EXECUTION CAPABILITIES & FLEET ==================== */}
      {activeTab === "capabilities" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:hard-hat" style={{ color: "#ff4500" }} /> {t.capabilitiesTitle}</h3>
          </div>

          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.capabilitiesDesc}
          </p>

          {/* Quick Metrics Grid */}
          <div className={styles.capabilitiesGrid}>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.maxProjectBudget}</span>
              <span className={styles.capStatLabel}>{t.maxProjectCapacity}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.simultaneousProjects}</span>
              <span className={styles.capStatLabel}>{t.concurrentSites}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.qualifiedEngineers}</span>
              <span className={styles.capStatLabel}>{t.charteredEngineers}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.permanentWorkforce}</span>
              <span className={styles.capStatLabel}>{t.permanentWorkforce}</span>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.maxSingleValue}</label>
              <input
                className={styles.input}
                value={capabilities.maxProjectBudget}
                onChange={(e) => setCapabilities({ ...capabilities, maxProjectBudget: e.target.value })}
                placeholder="e.g. 250,000,000 XOF"
              />
            </div>
            <div>
              <label className={styles.label}>{t.simultaneousCapacity}</label>
              <input
                className={styles.input}
                value={capabilities.simultaneousProjects}
                onChange={(e) => setCapabilities({ ...capabilities, simultaneousProjects: e.target.value })}
                placeholder="e.g. 5 Concurrent Sites"
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.engineersCount}</label>
              <input
                className={styles.input}
                value={capabilities.qualifiedEngineers}
                onChange={(e) => setCapabilities({ ...capabilities, qualifiedEngineers: e.target.value })}
                placeholder="e.g. 8 Engineers"
              />
            </div>
            <div>
              <label className={styles.label}>{t.mobilityRadius}</label>
              <input
                className={styles.input}
                value={capabilities.geographicMobility}
                onChange={(e) => setCapabilities({ ...capabilities, geographicMobility: e.target.value })}
                placeholder="e.g. Nationwide & Cross-Border (West Africa)"
              />
            </div>
          </div>

          <label className={styles.label}>{t.facilitiesLabel}</label>
          <input
            className={styles.input}
            value={capabilities.facilities}
            onChange={(e) => setCapabilities({ ...capabilities, facilities: e.target.value })}
            placeholder="e.g. Central Workshop & 1,200m² Storage Depot in Cotonou Industrial Zone"
          />

          {/* Equipment & Heavy Machinery Fleet */}
          <div style={{ marginTop: 20 }}>
            <label className={styles.label}>{t.equipmentLabel}</label>
            <div className={styles.equipmentGrid}>
              {capabilities.equipment.map((eq) => (
                <span key={eq} className={styles.equipmentTag}>
                  <iconify-icon icon="lucide:truck" style={{ color: "#ff4500" }} />
                  {eq}
                  <iconify-icon icon="lucide:x" style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => removeEquipment(eq)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, maxWidth: 550, marginTop: 12 }}>
              <input
                className={styles.input}
                style={{ marginBottom: 0 }}
                placeholder={t.addEquipmentPlaceholder}
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }}
              />
              <button type="button" className={styles.outlineButton} onClick={addEquipment}>{t.addEquipmentBtn}</button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== TAB 4: SERVICES OFFERED ==================== */}
      {activeTab === "services" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:layers" /> {t.servicesCatalogTitle}</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddService(!showAddService)}
            >
              <iconify-icon icon={showAddService ? "lucide:x" : "lucide:plus"} />
              {showAddService ? t.cancel : t.addNewService}
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.servicesDesc}
          </p>

          {/* Add Service Box */}
          {showAddService && (
            <div className={styles.addItemBox}>
              <div className={styles.addItemHeader}>{t.addServiceBoxTitle}</div>
              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>{t.serviceTitle}</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Commercial Building Construction & Finishing"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>{t.serviceCategory}</label>
                  <select
                    className={styles.select}
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>{t.pricingModel}</label>
                  <select
                    className={styles.select}
                    value={newServicePricing}
                    onChange={(e) => setNewServicePricing(e.target.value)}
                  >
                    <option value="Request Quote">Request Quote (Enterprise Tender)</option>
                    <option value="Fixed Quote">Fixed Project Price</option>
                    <option value="Daily Rate">Daily Rate</option>
                    <option value="Consultation Fee">Initial Consultation Fee</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>{t.shortScopeDesc}</label>
                  <input
                    className={styles.input}
                    placeholder="Brief description of work scope, supervision and standards"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.addActions}>
                <button type="button" className={styles.addBtn} onClick={handleCreateService} disabled={addingService}>
                  <iconify-icon icon={addingService ? "lucide:loader" : "lucide:check"} />
                  {addingService ? t.saving : t.confirmAddService}
                </button>
                <button type="button" className={styles.outlineButton} style={{ minHeight: 38, padding: "0 16px" }} onClick={() => setShowAddService(false)}>
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className={styles.servicesGrid}>
            {services.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
                {t.noServices}
              </div>
            ) : (
              services.map((srv: any, idx: number) => (
                <div key={srv.id || idx} className={styles.serviceCard}>
                  <button type="button" className={styles.serviceDeleteBtn} title="Delete Service" onClick={() => handleDeleteService(srv.id, srv.title)}>
                    <iconify-icon icon="lucide:trash-2" />
                  </button>
                  <span className={styles.serviceCategoryBadge}>{srv.category || "Service"}</span>
                  <h4 className={styles.serviceTitle}>{srv.title}</h4>
                  <div className={styles.servicePricePill}>
                    <iconify-icon icon="lucide:tag" /> {srv.pricing_model || "Request Quote"}
                  </div>
                  {srv.description && <p className={styles.serviceDesc}>{srv.description}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 5: PAST PROJECTS & PORTFOLIO SHOWCASE ==================== */}
      {activeTab === "projects" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:folder-check" /> {t.projectsTitle}</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddProject(!showAddProject)}
            >
              <iconify-icon icon={showAddProject ? "lucide:x" : "lucide:plus"} />
              {showAddProject ? t.cancel : t.addPastProject}
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.projectsDesc}
          </p>

          {/* Add Project Form Box */}
          {showAddProject && (
            <div className={styles.addItemBox}>
              <div className={styles.addItemHeader}>{t.addProjectBoxTitle}</div>
              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>{t.projectName}</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. 5-Storey Residential Complex - Haie Vive"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>{t.clientOrg}</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Société Immobilière du Bénin"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>{t.contractValue}</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. 85,000,000 XOF"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>{t.completionTimeline}</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Completed in 8 Months (2025)"
                    value={newProjectTimeline}
                    onChange={(e) => setNewProjectTimeline(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.addActions}>
                <button type="button" className={styles.addBtn} onClick={handleCreateProject} disabled={addingProject}>
                  <iconify-icon icon={addingProject ? "lucide:loader" : "lucide:check"} />
                  {addingProject ? t.saving : t.addToPortfolio}
                </button>
                <button type="button" className={styles.outlineButton} style={{ minHeight: 38, padding: "0 16px" }} onClick={() => setShowAddProject(false)}>
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          <div className={styles.portfolioGrid}>
            {projects.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
                {t.noProjects}
              </div>
            ) : (
              projects.map((proj: any, idx: number) => (
                <div key={proj.id || idx} className={styles.portfolioCard}>
                  <div className={styles.portfolioThumbnail}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: 36 }}>
                      <iconify-icon icon="lucide:building" />
                    </div>
                    {proj.budget && (
                      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", color: "#4ade80", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                        {Number(proj.budget).toLocaleString()} XOF
                      </div>
                    )}
                  </div>
                  <div className={styles.portfolioInfo}>
                    <h4 className={styles.portfolioTitle}>{proj.title}</h4>
                    <div className={styles.portfolioMeta}>
                      <span><iconify-icon icon="lucide:user" /> {proj.client_name || "Corporate Client"}</span>
                      <span><iconify-icon icon="lucide:check-circle" /> {proj.status || "Completed"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 6: KEY PERSONNEL & TEAM ==================== */}
      {activeTab === "team" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:users" style={{ color: "#001f3f" }} /> {t.teamTitle}</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddTeamModal(true)}
            >
              <iconify-icon icon="lucide:plus" /> {t.addTeamMember}
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.teamDesc}
          </p>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div className={styles.teamInfo}>
                  <h4 className={styles.teamName}>{member.name}</h4>
                  <div className={styles.teamRole}>{member.role}</div>
                  <p className={styles.teamQualification}>🎓 {member.qualification}</p>
                  {member.experienceYears && (
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, display: "inline-block", marginTop: 4 }}>
                      ⏳ {member.experienceYears} {t.experience}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTeamMember(member.id)}
                  style={{ position: "absolute", top: 12, right: 12, border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}
                  title="Remove Member"
                >
                  <iconify-icon icon="lucide:trash-2" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Team Modal */}
          {showAddTeamModal && (
            <div className={styles.modalOverlay} onClick={() => setShowAddTeamModal(false)}>
              <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <div className={styles.modalIcon}>
                      <iconify-icon icon="lucide:user-plus" />
                    </div>
                    <div>
                      <h3>{t.addKeyPersonnelTitle}</h3>
                      <p>{t.teamModalSub}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowAddTeamModal(false)} className={styles.modalCloseBtn}>
                    <iconify-icon icon="lucide:x" />
                  </button>
                </div>

                <form onSubmit={handleAddTeamMember}>
                  <div className={styles.modalBody}>
                    <div className={styles.twoCol}>
                      <div>
                        <label className={styles.label}>{t.fullName}</label>
                        <input className={styles.input} value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="e.g. Dr. Marcelle Dossou" required />
                      </div>
                      <div>
                        <label className={styles.label}>{t.positionRole}</label>
                        <input className={styles.input} value={newTeamRole} onChange={(e) => setNewTeamRole(e.target.value)} placeholder="e.g. Lead Structural Engineer" required />
                      </div>
                    </div>
                    <div className={styles.twoCol}>
                      <div>
                        <label className={styles.label}>{t.qualificationsDegrees}</label>
                        <input className={styles.input} value={newTeamQual} onChange={(e) => setNewTeamQual(e.target.value)} placeholder="e.g. M.Sc. Civil Engineering / Chartered Member" />
                      </div>
                      <div>
                        <label className={styles.label}>{t.yearsExp}</label>
                        <input className={styles.input} value={newTeamExp} onChange={(e) => setNewTeamExp(e.target.value)} placeholder="e.g. 10+ Years" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <button type="button" onClick={() => setShowAddTeamModal(false)} className={styles.outlineButton}>
                      {t.cancel}
                    </button>
                    <button type="submit" className={styles.primaryButton}>
                      <iconify-icon icon="lucide:check" />
                      {t.saveMember}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================== TAB 7: INSURANCE, BANKING & MATCHMAKING ==================== */}
      {activeTab === "insurance" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:lock" style={{ color: "#001f3f" }} /> {t.insuranceTitle}</h3>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 24, color: "#16a34a", flexShrink: 0 }} />
            <div>
              <strong style={{ display: "block", color: "#166534", fontSize: 14 }}>{t.insuranceBoxTitle}</strong>
              <span style={{ fontSize: 13, color: "#166534" }}>{t.insuranceBoxDesc}</span>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.insuranceProvider}</label>
              <input className={styles.input} value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} placeholder="e.g. AXA Assurances Bénin" />
            </div>
            <div>
              <label className={styles.label}>{t.policyNumber}</label>
              <input className={styles.input} value={insurancePolicyNo} onChange={(e) => setInsurancePolicyNo(e.target.value)} placeholder="e.g. POL-8923401-CIVIL" />
            </div>
          </div>

          <label className={styles.label}>{t.coverageScope}</label>
          <input className={styles.input} value={insuranceCoverage} onChange={(e) => setInsuranceCoverage(e.target.value)} placeholder="e.g. 500,000,000 XOF Public Liability & Comprehensive Contractor All Risks" />

          {/* Private Corporate Banking */}
          <h4 style={{ margin: "24px 0 14px", fontSize: 16, fontWeight: 800, color: "#001f3f" }}>{t.bankingTitle}</h4>
          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>{t.bankName}</label>
              <input className={styles.input} value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Bank of Africa (BOA)" />
            </div>
            <div>
              <label className={styles.label}>{t.accountNumber}</label>
              <input className={styles.input} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="BJ061 01001 0023491823 45" />
            </div>
          </div>

          {/* Project Participation Matchmaking */}
          <h4 style={{ margin: "24px 0 10px", fontSize: 16, fontWeight: 800, color: "#001f3f" }}>{t.matchmakingTitle}</h4>
          <div className={styles.matchmakingGrid}>
            <div className={`${styles.matchCard} ${matchLargeBidding ? styles.matchCardActive : ""}`} onClick={() => setMatchLargeBidding(!matchLargeBidding)}>
              <input type="checkbox" checked={matchLargeBidding} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{t.largeBiddingTitle}</strong>
                <small style={{ color: "#64748b" }}>{t.largeBiddingSub}</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchSubcontracting ? styles.matchCardActive : ""}`} onClick={() => setMatchSubcontracting(!matchSubcontracting)}>
              <input type="checkbox" checked={matchSubcontracting} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{t.subcontractingTitle}</strong>
                <small style={{ color: "#64748b" }}>{t.subcontractingSub}</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchConcierge ? styles.matchCardActive : ""}`} onClick={() => setMatchConcierge(!matchConcierge)}>
              <input type="checkbox" checked={matchConcierge} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{t.conciergeTitle}</strong>
                <small style={{ color: "#64748b" }}>{t.conciergeSub}</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchEmergency ? styles.matchCardActive : ""}`} onClick={() => setMatchEmergency(!matchEmergency)}>
              <input type="checkbox" checked={matchEmergency} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{t.emergencyTitle}</strong>
                <small style={{ color: "#64748b" }}>{t.emergencySub}</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== BOTTOM SAVE ACTION & STEP PROGRESSION ==================== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        <Link href="/dashboard/company" className={styles.outlineButton}>
          <iconify-icon icon="lucide:arrow-left" /> {t.backToDashboard}
        </Link>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {activeTab !== "overview" && (
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => {
                const currentIdx = TAB_ORDER.indexOf(activeTab);
                if (currentIdx > 0) {
                  setActiveTab(TAB_ORDER[currentIdx - 1]);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 380, behavior: "smooth" });
                  }
                }
              }}
            >
              <iconify-icon icon="lucide:chevron-left" />
              {t.prevStep}
            </button>
          )}

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => handleSaveProfile(true)}
            disabled={saving}
            style={{ minHeight: 48, padding: "0 28px", fontSize: 15 }}
          >
            <iconify-icon
              icon={saving ? "lucide:loader" : activeTab === "insurance" ? "lucide:check" : "lucide:arrow-right"}
              className={saving ? styles.spinIcon : ""}
            />
            {saving
              ? t.saving
              : activeTab === "insurance"
              ? t.saveEnterpriseProfile
              : t.saveAndContinue}
          </button>
        </div>
      </div>
    </div>
  );
}

