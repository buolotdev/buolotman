"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import { MASTER_CATEGORIES } from "@/app/lib/categories";

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
    saveAndCompleteLater: "Save & Complete Later",
    saveAndCompleteProfile: "Save and Complete Profile",
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
    primaryDomain: "Primary Industry Domain *",
    subSpecialization: "Sub-Sector / Specialization *",
    selectDomainPlaceholder: "Select primary domain...",
    selectSpecializationPlaceholder: "Select specialization...",
    otherOption: "Other (Specify Custom)",
    customDomainLabel: "Specify Custom Industry Domain *",
    customDomainPlaceholder: "e.g. Industrial Automation & Robotics",
    customSpecLabel: "Specify Custom Specialization / Sector *",
    customSpecPlaceholder: "e.g. PLC Programming & SCADA Integration",
    suggestedKeywords: "Quick Add Trade Keywords from this Domain:",
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
    saveAndCompleteLater: "Enregistrer & Compléter plus tard",
    saveAndCompleteProfile: "Enregistrer et Finaliser le Profil",
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
    primaryDomain: "Domaine d'Activité Principal *",
    subSpecialization: "Spécialisation / Sous-Secteur *",
    selectDomainPlaceholder: "Sélectionnez un domaine principal...",
    selectSpecializationPlaceholder: "Sélectionnez une spécialisation...",
    otherOption: "Autre (Préciser manuellement)",
    customDomainLabel: "Préciser le Domaine d'Activité Personnalisé *",
    customDomainPlaceholder: "ex: Automatisation Industrielle & Robotique",
    customSpecLabel: "Préciser la Spécialisation / Métier Personnalisé *",
    customSpecPlaceholder: "ex: Programmation Automates & Systèmes SCADA",
    suggestedKeywords: "Ajout Rapide de Mots-Clés depuis ce Domaine :",
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

const DEFAULT_TEAM: TeamMember[] = [];

const DEFAULT_CAPABILITIES = {
  maxProjectBudget: "",
  simultaneousProjects: "",
  permanentWorkforce: "",
  qualifiedEngineers: "",
  fieldSupervisors: "",
  geographicMobility: "",
  facilities: "",
  equipment: [] as string[]
};

export default function CompanyProfilePage() {
  const router = useRouter();
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
    industry: "",
    subject_title: "",
    about: "",
    website: "",
    country: "",
    city: "",
    headquarters: "",
    employee_count: "",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_phone: "",
    primary_email: "",
    preferred_language: "fr",
    working_hours: "",
    areas_of_expertise: [] as string[],
    services_offered: [] as string[],
  });

  const [username, setUsername] = useState("");
  const [usernameAvailability, setUsernameAvailability] = useState<{ available: boolean; message: string } | null>(null);
  const usernameCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUsernameChange = (val: string) => {
    const clean = val.replace(/\s+/g, "_").toLowerCase();
    setUsername(clean);
    if (usernameCheckTimerRef.current) clearTimeout(usernameCheckTimerRef.current);
    const candidate = clean.replace(/^@/, "").trim();
    if (!candidate || candidate === (user?.username || "").toLowerCase()) {
      setUsernameAvailability(null);
      return;
    }
    if (candidate.length < 3) {
      setUsernameAvailability({ available: false, message: "Min 3 characters" });
      return;
    }
    usernameCheckTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.checkUsername(candidate);
        setUsernameAvailability({ available: res.available, message: res.message || (res.available ? "Available ✓" : "Taken ✗") });
      } catch {
        setUsernameAvailability(null);
      }
    }, 400);
  };

  const [expertiseInput, setExpertiseInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Hierarchical Category & Subcategory State
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [customMainCategory, setCustomMainCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");

  const activeCategoryObj = useMemo(() => {
    if (!selectedMainCategory || selectedMainCategory === "Other") return null;
    return MASTER_CATEGORIES.find(
      (c) => c.name.toLowerCase() === selectedMainCategory.toLowerCase()
    ) || null;
  }, [selectedMainCategory]);

  const availableSubcategories = useMemo(() => {
    if (!activeCategoryObj) return [];
    return activeCategoryObj.skills || [];
  }, [activeCategoryObj]);

  const handleMainCategoryChange = (val: string) => {
    setSelectedMainCategory(val);
    setSelectedSubCategory("");
    setCustomSubCategory("");
    if (val === "Other") {
      setForm((prev) => ({ ...prev, industry: customMainCategory || "Other" }));
    } else {
      setCustomMainCategory("");
      setForm((prev) => ({ ...prev, industry: val }));
    }
  };

  const handleSubCategoryChange = (val: string) => {
    setSelectedSubCategory(val);
    if (val === "Other") {
      setForm((prev) => ({
        ...prev,
        industry: customSubCategory || (selectedMainCategory !== "Other" ? `${selectedMainCategory} - Other` : "Other"),
      }));
    } else if (val) {
      setCustomSubCategory("");
      setForm((prev) => ({ ...prev, industry: val }));
    } else {
      setForm((prev) => ({ ...prev, industry: selectedMainCategory || "" }));
    }
  };

  const handleCustomMainCategoryChange = (val: string) => {
    setCustomMainCategory(val);
    setForm((prev) => ({ ...prev, industry: val.trim() || "Other" }));
  };

  const handleCustomSubCategoryChange = (val: string) => {
    setCustomSubCategory(val);
    setForm((prev) => ({
      ...prev,
      industry: val.trim() || (selectedMainCategory !== "Other" ? `${selectedMainCategory} - Other` : "Other"),
    }));
  };

  const handleAddQuickKeyword = (kw: string) => {
    if (!kw || form.areas_of_expertise.includes(kw)) return;
    setForm((prev) => ({
      ...prev,
      areas_of_expertise: [...prev.areas_of_expertise, kw],
    }));
    toast.success("Keyword Added", `"${kw}" added to your expertise keywords.`);
  };

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
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [insuranceCoverage, setInsuranceCoverage] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
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
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; type?: 'avatar' | 'banner' } | null>(null);
  const isInitialSyncedRef = useRef(false);

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

  // Sync profile data to form once without resetting user's ongoing input
  useEffect(() => {
    if (profile && !profileLoading && !isInitialSyncedRef.current) {
      isInitialSyncedRef.current = true;
      const initialIndustry = profile.industry || user?.company_profile?.industry || "";
      setForm({
        company_name: profile.company_name || user?.company_name || "",
        trading_name: profile.trading_name || profile.company_name || user?.company_name || "",
        company_type: profile.company_type || "Limited Liability Company (SARL)",
        year_founded: profile.year_founded || "",
        industry: initialIndustry,
        subject_title: profile.subject_title || "",
        about: profile.about || "",
        website: profile.website || "",
        country: profile.country || user?.country || "",
        city: profile.city || user?.city || "",
        headquarters: profile.headquarters || user?.address || "",
        employee_count: profile.employee_count || "",
        primary_contact_name: profile.primary_contact_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        primary_contact_role: profile.primary_contact_role || "",
        primary_phone: profile.primary_phone || user?.phone || "",
        primary_email: profile.primary_email || user?.email || "",
        preferred_language: profile.preferred_language || "fr",
        working_hours: profile.working_hours || "",
        areas_of_expertise: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        services_offered: Array.isArray(profile.services_offered) ? profile.services_offered : [],
      });
      if (profile.logo_url) setLogoUrl(profile.logo_url);
      if (profile.cover_url) setCoverUrl(profile.cover_url);
      if (user?.username) setUsername(user.username);

      // Hierarchical Category Resolution
      const rawInd = initialIndustry.trim();
      if (rawInd) {
        const directCatMatch = MASTER_CATEGORIES.find(
          (c) => c.name.toLowerCase() === rawInd.toLowerCase()
        );
        if (directCatMatch) {
          setSelectedMainCategory(directCatMatch.name);
          setSelectedSubCategory("");
        } else {
          const skillCatMatch = MASTER_CATEGORIES.find((c) =>
            c.skills.some((s) => s.toLowerCase() === rawInd.toLowerCase())
          );
          if (skillCatMatch) {
            setSelectedMainCategory(skillCatMatch.name);
            const foundSkill = skillCatMatch.skills.find(
              (s) => s.toLowerCase() === rawInd.toLowerCase()
            );
            setSelectedSubCategory(foundSkill || rawInd);
          } else {
            // Check if composite "Main - Sub" or custom
            const parts = rawInd.split(" - ");
            if (parts.length === 2 && MASTER_CATEGORIES.some((c) => c.name.toLowerCase() === parts[0].toLowerCase())) {
              const pCat = MASTER_CATEGORIES.find((c) => c.name.toLowerCase() === parts[0].toLowerCase())!;
              setSelectedMainCategory(pCat.name);
              if (parts[1] === "Other") {
                setSelectedSubCategory("Other");
              } else {
                setSelectedSubCategory("Other");
                setCustomSubCategory(parts[1]);
              }
            } else {
              setSelectedMainCategory("Other");
              setCustomMainCategory(rawInd);
              setSelectedSubCategory("Other");
              setCustomSubCategory(rawInd);
            }
          }
        }
      }
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

  // Calculate Real-time Profile Completeness Percentage (0 - 100%)
  const profileCompleteness = useMemo(() => {
    let score = 0;

    // 1. Basic Company Information (25 pts)
    if (form.company_name?.trim()) score += 5;
    if (form.industry?.trim()) score += 5;
    if (form.about?.trim()) score += 5;
    if (form.primary_contact_name?.trim()) score += 5;
    if (form.primary_phone?.trim() || form.primary_email?.trim() || form.city?.trim()) score += 5;

    // 2. Visual Branding (20 pts)
    if (logoUrl || profile?.logo_url) score += 10;
    if (coverUrl || profile?.cover_url) score += 10;

    // 3. Services Catalog (15 pts)
    if (services.length > 0 || (form.services_offered && form.services_offered.length > 0)) score += 15;

    // 4. Past Projects & Portfolio Showcase (15 pts)
    if (projects.length > 0) score += 15;

    // 5. Key Personnel & Leadership (10 pts)
    if (teamMembers.length > 0) score += 10;

    // 6. Operational Capabilities & Fleet (10 pts)
    if (capabilities.equipment?.length > 0 || capabilities.permanentWorkforce || capabilities.maxProjectBudget) score += 10;

    // 7. Insurance, Banking or Legal Docs (5 pts)
    if (insuranceProvider?.trim() || insurancePolicyNo?.trim() || bankName?.trim() || documents.length > 0) score += 5;

    return Math.min(100, Math.max(0, score));
  }, [form, logoUrl, coverUrl, profile, services, projects, teamMembers, capabilities, insuranceProvider, insurancePolicyNo, bankName, documents]);

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
      const localPreview = URL.createObjectURL(croppedFile);
      setLogoUrl(localPreview);
      setUploadingLogo(true);
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url || res.avatar || res.image;
        if (url) setLogoUrl(url);
        await api.updateCompanyProfile({ logo_url: url || localPreview });
        toast.success("Logo Updated", "Company logo has been updated successfully.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload company logo.");
      } finally {
        setUploadingLogo(false);
      }
    } else {
      const localPreview = URL.createObjectURL(croppedFile);
      setCoverUrl(localPreview);
      setUploadingCover(true);
      try {
        const res = await api.uploadBanner(croppedFile);
        const url = res.banner_url || res.url || res.file_url || res.banner || res.cover_image;
        if (url) setCoverUrl(url);
        await api.updateCompanyProfile({ cover_url: url || localPreview });
        toast.success("Banner Updated", "Company cover banner has been updated.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload banner.");
      } finally {
        setUploadingCover(false);
      }
    }
  };

  // Save All Profile Details
  const handleSaveProfile = async (advanceToNext: boolean = true, forceReturnToDashboard: boolean = false) => {
    setSaving(true);
    try {
      const cleanU = username.trim().replace(/^@/, "");
      await api.updateCompanyProfile({
        company_name: form.company_name.trim(),
        username: cleanU,
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
      const isLastTab = activeTab === "insurance" || currentIdx === TAB_ORDER.length - 1;

      // When finishing on last tab or explicitly choosing to save and complete/finish:
      if (isLastTab || forceReturnToDashboard) {
        if (profileCompleteness >= 100) {
          toast.success(
            lang === "fr" ? "Profil Complété ! 🎉" : "Profile Completed! 🎉",
            lang === "fr"
              ? "Votre profil a été complété ! Tous les détails de l'entreprise sont configurés."
              : "Your profile has been completed! All enterprise details are fully set up."
          );
        } else {
          toast.info(
            lang === "fr" ? `Profil Enregistré (${profileCompleteness}%)` : `Profile Saved (${profileCompleteness}%)`,
            lang === "fr"
              ? `Profil enregistré à ${profileCompleteness}%. Vous pouvez enregistrer et compléter les détails restants plus tard.`
              : `Profile saved at ${profileCompleteness}% completion. You can save and complete the remaining details later.`
          );
        }

        setTimeout(() => {
          router.push("/dashboard/company");
        }, 1200);
        return;
      }

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
    const handleName = username || user?.username || profile?.username;
    const url = typeof window !== "undefined" ? window.location.origin + (handleName ? `/profile/@${handleName.replace(/^@/, '')}` : `/profile/${profile?.id || user?.id}`) : "";
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
      const res = await api.uploadTechnicianDocument(file);
      await api.createTechnicianDocument({
        title: slotName,
        document_type: docType === "certificate" ? "certificate" : "id",
        file_url: res.file_url,
      });
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

      {/* FULL IMAGE LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 15, 30, 0.88)",
            backdropFilter: "blur(12px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div
            style={{
              position: "relative",
              width: lightboxImg.type === 'banner' ? "min(920px, 94vw)" : "min(500px, 90vw)",
              maxWidth: "100%",
              background: "#0b1523",
              borderRadius: 20,
              boxShadow: "0 25px 60px rgba(0,0,0,0.65)",
              border: "1px solid rgba(255,255,255,0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <iconify-icon
                  icon={lightboxImg.type === 'banner' ? "lucide:image" : "lucide:building-2"}
                  style={{ fontSize: 18, color: "#ff4500" }}
                />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{lightboxImg.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Image Display */}
            <div style={{
              padding: lightboxImg.type === 'banner' ? "16px" : "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#060c14",
              minHeight: lightboxImg.type === 'banner' ? 240 : 320,
              maxHeight: "68vh",
              overflow: "hidden",
            }}>
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "64vh",
                  objectFit: "contain",
                  borderRadius: lightboxImg.type === 'avatar' ? 16 : 12,
                  display: "block",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
                }}
              />
            </div>

            {/* Modal Footer */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              background: "rgba(255,255,255,0.03)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <button
                type="button"
                onClick={() => {
                  const isBanner = lightboxImg.type === 'banner';
                  setLightboxImg(null);
                  if (isBanner) {
                    coverInputRef.current?.click();
                  } else {
                    logoInputRef.current?.click();
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: "#ff4500",
                  color: "#ffffff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <iconify-icon icon="lucide:camera" style={{ fontSize: 15 }} />
                {lightboxImg.type === 'banner' ? t.changeCover : "Change Logo"}
              </button>

              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 1. TOP HERO BANNER ==================== */}
      <section className={styles.heroCard}>
        <div
          className={styles.cover}
          onClick={() => {
            const currentCover = coverUrl || profile?.cover_url;
            if (currentCover) {
              setLightboxImg({ src: getImageUrl(currentCover), title: `${companyName}'s Cover Banner`, type: 'banner' });
            } else {
              coverInputRef.current?.click();
            }
          }}
          title={(coverUrl || profile?.cover_url) ? "Click to view full banner" : "Click to add cover photo"}
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
            <button
              type="button"
              className={styles.bannerUploadBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                coverInputRef.current?.click();
              }}
              title={(coverUrl || profile?.cover_url) ? t.changeCover : t.addCover}
            >
              {uploadingCover ? (
                <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> {t.uploading}</>
              ) : (
                <><iconify-icon icon="lucide:camera" style={{ fontSize: "16px" }} /> {(coverUrl || profile?.cover_url) ? t.changeCover : t.addCover}</>
              )}
            </button>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            style={{ display: "none" }}
            onChange={(e) => onFileSelect(e, "cover")}
          />
        </div>

        <div className={styles.heroBody}>
          <div className={styles.identityBlock}>
            <div className={styles.avatarWrapper}>
              <div
                className={styles.avatarLarge}
                onClick={() => {
                  const currentLogo = logoUrl || profile?.logo_url;
                  if (currentLogo) {
                    setLightboxImg({ src: getImageUrl(currentLogo), title: `${companyName}'s Company Logo`, type: 'avatar' });
                  } else {
                    logoInputRef.current?.click();
                  }
                }}
                title={logoUrl || profile?.logo_url ? "Click to view full logo" : "Click camera to upload logo"}
              >
                {logoUrl || profile?.logo_url ? (
                  <img
                    src={getImageUrl(logoUrl || profile?.logo_url)}
                    alt="Company Logo"
                    className={styles.avatarImg}
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Sleek Floating Camera Button Badge for Upload */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  logoInputRef.current?.click();
                }}
                title="Upload company logo"
                className={styles.avatarCameraBadge}
              >
                {uploadingLogo ? (
                  <iconify-icon icon="lucide:loader-2" className={styles.spinIcon} style={{ fontSize: 16 }} />
                ) : (
                  <iconify-icon icon="lucide:camera" style={{ fontSize: 16 }} />
                )}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
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
                <span
                  style={{
                    background: profileCompleteness >= 100 ? "rgba(22, 163, 74, 0.15)" : "rgba(234, 88, 12, 0.12)",
                    color: profileCompleteness >= 100 ? "#16a34a" : "#ea580c",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    border: profileCompleteness >= 100 ? "1px solid #bbf7d0" : "1px solid #fed7aa",
                  }}
                  title="Real-time profile completeness level"
                >
                  <iconify-icon icon={profileCompleteness >= 100 ? "lucide:check-circle-2" : "lucide:pie-chart"} />
                  {profileCompleteness}% {lang === "fr" ? "Complété" : "Complete"}
                </span>
              </div>
              <div className={styles.metaList}>
                {form.industry && <span><iconify-icon icon="lucide:building-2" /> {form.industry}</span>}
                {(form.city || form.country) ? (
                  <span><iconify-icon icon="lucide:map-pin" /> {[form.city, form.country].filter(Boolean).join(", ")}</span>
                ) : null}
                {form.year_founded ? (
                  <span><iconify-icon icon="lucide:calendar" /> Est. {form.year_founded}</span>
                ) : null}
                {(capabilities.permanentWorkforce || form.employee_count) ? (
                  <span><iconify-icon icon="lucide:users" /> {capabilities.permanentWorkforce || form.employee_count}</span>
                ) : null}
                <span>
                  <iconify-icon icon="lucide:star" />{" "}
                  {profile?.review_count && Number(profile.review_count) > 0 && profile?.average_rating && Number(profile.average_rating) > 0
                    ? `${Number(profile.average_rating).toFixed(1)} (${profile.review_count} ${t.reviews})`
                    : `New (0 ${t.reviews})`}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button type="button" className={styles.outlineButton} onClick={handleShare}>
              <iconify-icon icon="lucide:share-2" />
              {shareCopied ? t.copied : t.share}
            </button>
            <Link
              href={username ? `/profile/@${username.replace(/^@/, '')}` : (profile?.id ? `/profile/${profile.id}` : "/contractors")}
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

          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <iconify-icon icon="lucide:at-sign" style={{ color: "#ff4500", fontSize: 18 }} />
                Company Username & Public Handle
              </label>
              {usernameAvailability && (
                <span style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: usernameAvailability.available ? "#16a34a" : "#dc2626",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  <iconify-icon icon={usernameAvailability.available ? "lucide:check-circle-2" : "lucide:alert-circle"} />
                  {usernameAvailability.message}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <span style={{
                position: "absolute",
                left: 14,
                color: "#64748b",
                fontWeight: 700,
                fontSize: "15px",
                pointerEvents: "none"
              }}>@</span>
              <input
                type="text"
                className={styles.input}
                style={{ paddingLeft: 32, background: "#ffffff" }}
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="company_handle"
                autoComplete="off"
              />
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                Login with this handle or share direct corporate link: <strong>boulotman.com/profile/@{username ? username.replace(/^@/, '') : 'handle'}</strong>
              </p>
              {username && (
                <button
                  type="button"
                  onClick={() => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://boulotman.com'}/profile/@${username.replace(/^@/, '')}`;
                    navigator.clipboard.writeText(url);
                    toast.show("success", "Company profile link copied to clipboard!");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4500",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: 0
                  }}
                >
                  <iconify-icon icon="lucide:copy" /> Copy Profile Link
                </button>
              )}
            </div>
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
              <label className={styles.label}>{t.yearFounded}</label>
              <input
                className={styles.input}
                placeholder="e.g. 2014"
                value={form.year_founded}
                onChange={(e) => setForm({ ...form, year_founded: e.target.value })}
              />
            </div>
          </div>

          {/* Hierarchical Industry Domain & Sub-Sector Selector */}
          <div style={{
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 16,
            padding: "18px 20px",
            marginBottom: 20,
            marginTop: 4,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <iconify-icon icon="lucide:layers" style={{ color: "#ff4500", fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: "#001f3f" }}>
                {t.primaryIndustry}
              </span>
            </div>

            <div className={styles.twoCol} style={{ marginBottom: (selectedMainCategory === "Other" || selectedSubCategory === "Other") ? 14 : 0 }}>
              <div>
                <label className={styles.label} style={{ fontSize: 13, fontWeight: 700 }}>
                  {t.primaryDomain}
                </label>
                <select
                  className={styles.select}
                  value={selectedMainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  style={{ background: "#ffffff", borderColor: selectedMainCategory ? "#ff4500" : "#cbd5e1" }}
                >
                  <option value="" disabled>{t.selectDomainPlaceholder}</option>
                  {MASTER_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Other">✨ {t.otherOption}</option>
                </select>
              </div>

              <div>
                <label className={styles.label} style={{ fontSize: 13, fontWeight: 700 }}>
                  {t.subSpecialization}
                </label>
                <select
                  className={styles.select}
                  value={selectedSubCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  disabled={!selectedMainCategory || selectedMainCategory === "Other"}
                  style={{
                    background: (!selectedMainCategory || selectedMainCategory === "Other") ? "#f1f5f9" : "#ffffff",
                    borderColor: selectedSubCategory ? "#ff4500" : "#cbd5e1",
                    cursor: (!selectedMainCategory || selectedMainCategory === "Other") ? "not-allowed" : "pointer"
                  }}
                >
                  <option value="">{t.selectSpecializationPlaceholder}</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="Other">✨ {t.otherOption}</option>
                </select>
              </div>
            </div>

            {/* Custom Input when Main Category is Other */}
            {selectedMainCategory === "Other" && (
              <div style={{ marginTop: 12, padding: "12px 14px", background: "#fff7ed", border: "1.5px dashed #ffedd5", borderRadius: 12 }}>
                <label className={styles.label} style={{ color: "#c2410c", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <iconify-icon icon="lucide:edit-3" /> {t.customDomainLabel}
                </label>
                <input
                  className={styles.input}
                  style={{ background: "#ffffff", borderColor: "#fdba74", marginBottom: 0 }}
                  placeholder={t.customDomainPlaceholder}
                  value={customMainCategory}
                  onChange={(e) => handleCustomMainCategoryChange(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {/* Custom Input when Sub-Category is Other */}
            {selectedMainCategory !== "Other" && selectedSubCategory === "Other" && (
              <div style={{ marginTop: 12, padding: "12px 14px", background: "#fff7ed", border: "1.5px dashed #ffedd5", borderRadius: 12 }}>
                <label className={styles.label} style={{ color: "#c2410c", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <iconify-icon icon="lucide:edit-3" /> {t.customSpecLabel}
                </label>
                <input
                  className={styles.input}
                  style={{ background: "#ffffff", borderColor: "#fdba74", marginBottom: 0 }}
                  placeholder={t.customSpecPlaceholder}
                  value={customSubCategory}
                  onChange={(e) => handleCustomSubCategoryChange(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {/* Quick Add Trade Keywords from Domain */}
            {selectedMainCategory && selectedMainCategory !== "Other" && availableSubcategories.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #cbd5e1" }}>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <iconify-icon icon="lucide:sparkles" style={{ color: "#ff4500" }} />
                  {t.suggestedKeywords}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {availableSubcategories.map((sub) => {
                    const isAdded = form.areas_of_expertise.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleAddQuickKeyword(sub)}
                        disabled={isAdded}
                        style={{
                          background: isAdded ? "#e2e8f0" : "#ffffff",
                          color: isAdded ? "#94a3b8" : "#001f3f",
                          border: isAdded ? "1px solid #cbd5e1" : "1px solid #cbd5e1",
                          borderRadius: 999,
                          padding: "4px 12px",
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: isAdded ? "default" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isAdded ? "✓" : "+"} {sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
      {activeTab === "verification" && (() => {
        const hasDocs = documents.length > 0;
        const hasApprovedDocs = documents.some((d: any) => d.is_verified || d.status === "verified");
        const isTier2Verified = isVerified || hasApprovedDocs;
        const isTier2Pending = !isTier2Verified && hasDocs;
        const isTier3Verified = isTier2Verified && (services.length > 0 || projects.length > 0 || teamMembers.length > 0);
        const isTier4Verified = isTier2Verified && isTier3Verified && profileCompleteness >= 90;

        return (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3><iconify-icon icon="lucide:shield-check" style={{ color: isTier2Verified ? "#16a34a" : "#f59e0b" }} /> {t.verificationTitle}</h3>
              {isTier2Verified ? (
                <span className={styles.verifiedBadge}>
                  <iconify-icon icon="lucide:check-circle-2" /> {isTier3Verified ? t.tier3Badge : `${t.tier2Title} ✓`}
                </span>
              ) : isTier2Pending ? (
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <iconify-icon icon="lucide:clock-4" /> {lang === "fr" ? "Vérification en cours d'examen" : "Verification Under Review"}
                </span>
              ) : (
                <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <iconify-icon icon="lucide:alert-circle" /> {lang === "fr" ? "Documents Requis (Non Vérifié)" : "Documents Required (Unverified)"}
                </span>
              )}
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

              <div className={`${styles.tierCard} ${isTier2Verified ? styles.tierCardActive : (isTier2Pending ? styles.tierCardCurrent : "")}`}>
                <div className={styles.tierHeader}>
                  <span style={{ fontSize: 20 }}>🥈</span>
                  {isTier2Verified ? (
                    <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>{t.tier2Title} ✓</span>
                  ) : isTier2Pending ? (
                    <span className={styles.tierBadge} style={{ background: "#fef3c7", color: "#b45309" }}>{lang === "fr" ? "En cours d'examen" : "Under Review"}</span>
                  ) : (
                    <span className={styles.tierBadge} style={{ background: "#fee2e2", color: "#b91c1c" }}>{lang === "fr" ? "Documents Requis" : "Action Required"}</span>
                  )}
                </div>
                <h4 className={styles.tierTitle}>{t.tier2Title}</h4>
                <p className={styles.tierDesc}>{t.tier2Desc}</p>
              </div>

              <div className={`${styles.tierCard} ${isTier3Verified ? styles.tierCardCurrent : ""}`}>
                <div className={styles.tierHeader}>
                  <span style={{ fontSize: 20 }}>🥇</span>
                  {isTier3Verified ? (
                    <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>{t.tier3Badge}</span>
                  ) : isTier2Verified ? (
                    <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#64748b" }}>{lang === "fr" ? "En cours" : "In Progress"}</span>
                  ) : (
                    <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#94a3b8" }}>{lang === "fr" ? "Verrouillé (Niveau 2 Requis)" : "Locked (Requires Tier 2)"}</span>
                  )}
                </div>
                <h4 className={styles.tierTitle}>{t.tier3Title}</h4>
                <p className={styles.tierDesc}>{t.tier3Desc}</p>
              </div>

              <div className={`${styles.tierCard} ${isTier4Verified ? styles.tierCardActive : ""}`}>
                <div className={styles.tierHeader}>
                  <span style={{ fontSize: 20 }}>💎</span>
                  <span className={styles.tierBadge} style={{ background: isTier4Verified ? "#dcfce7" : "#f1f5f9", color: isTier4Verified ? "#16a34a" : "#64748b" }}>
                    {isTier4Verified ? "Top Tier ✓" : t.targetLevel}
                  </span>
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
      );
    })()}

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
              <span className={styles.capStatNumber}>{capabilities.maxProjectBudget || "—"}</span>
              <span className={styles.capStatLabel}>{t.maxProjectCapacity}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.simultaneousProjects || "—"}</span>
              <span className={styles.capStatLabel}>{t.concurrentSites}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.qualifiedEngineers || "—"}</span>
              <span className={styles.capStatLabel}>{t.charteredEngineers}</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.permanentWorkforce || form.employee_count || "—"}</span>
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
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            {t.servicesDesc}
          </p>

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 18, flexWrap: "wrap", borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard/company" className={styles.outlineButton}>
            <iconify-icon icon="lucide:arrow-left" /> {t.backToDashboard}
          </Link>
          {activeTab !== "insurance" && (
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => handleSaveProfile(false, true)}
              disabled={saving}
              title="Save current progress and return to dashboard"
            >
              <iconify-icon icon="lucide:bookmark" /> {t.saveAndCompleteLater}
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
              icon={saving ? "lucide:loader" : activeTab === "insurance" ? "lucide:check-circle-2" : "lucide:arrow-right"}
              className={saving ? styles.spinIcon : ""}
            />
            {saving
              ? t.saving
              : activeTab === "insurance"
              ? (lang === "fr" ? "Enregistrer et Finaliser le Profil" : "Save and Complete Profile")
              : t.saveAndContinue}
          </button>
        </div>
      </div>
    </div>
  );
}

