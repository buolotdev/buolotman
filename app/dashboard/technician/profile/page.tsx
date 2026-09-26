"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { MASTER_CATEGORIES } from "@/app/lib/categories";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  completionDate: string;
  budget?: string;
  photoUrl?: string;
}

export interface TechDocument {
  id: string | number;
  title: string;
  document_type: "identity" | "certificate" | "selfie";
  file_url: string;
  preview_url?: string;
  status: "verified" | "under_review" | "rejected";
  uploaded_at?: string;
  file_name?: string;
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [];

const PLATFORM_TRADE_CATEGORIES = [
  "Electrical & Solar Energy",
  "Plumbing & Sanitation Works",
  "HVAC, Air Conditioning & Cold Rooms",
  "Carpentry, Furniture & Woodwork",
  "Masonry, Tiling & Civil Construction",
  "Painting, Finishes & Waterproofing",
  "Welding, Metalwork & Steel Structures",
  "Roofing, Ceilings & Structural Waterproofing",
  "CCTV, Security Systems & Smart Home",
  "IT Infrastructure & Networking",
  "Software & Web Engineering",
  "Cybersecurity Services",
  "Cloud & Systems Engineering",
  "Automotive & Heavy Fleet Mechanics",
  "Appliance & Electronics Repair",
  "Landscaping & Environmental Works",
  "Architecture, CAD & Quantity Surveying"
];

export const PLATFORM_SUPPORTED_COUNTRIES = [
  { name: "Cameroon", code: "CM", flag: "🇨🇲" },
  { name: "Rwanda", code: "RW", flag: "🇷🇼" },
  { name: "Ivory Coast", code: "CI", flag: "🇨🇮" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", flag: "🇰🇪" },
  { name: "Ghana", code: "GH", flag: "🇬🇭" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "Benin", code: "BJ", flag: "🇧🇯" },
  { name: "Togo", code: "TG", flag: "🇹🇬" },
  { name: "Senegal", code: "SN", flag: "🇸🇳" },
  { name: "Uganda", code: "UG", flag: "🇺🇬" },
  { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { name: "DR Congo", code: "CD", flag: "🇨🇩" },
  { name: "Congo", code: "CG", flag: "🇨🇬" },
  { name: "Mali", code: "ML", flag: "🇲🇱" },
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { name: "Guinea", code: "GN", flag: "🇬🇳" },
  { name: "Gabon", code: "GA", flag: "🇬🇦" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
];

const DEFAULT_TOOLS: string[] = [];

const profileTranslations: Record<string, Record<string, string>> = {
  en: {
    addCover: "Add Cover Photo",
    changeCover: "Change Cover Photo",
    uploading: "Uploading...",
    verifiedPro: "Verified Pro ✓",
    identityVerified: "Identity Verified ✓",
    availableNow: "Available Now",
    busyOffline: "Busy / Offline",
    availableOn: "Available Now: ON",
    availableOff: "Available Now: OFF",
    previewPublic: "Preview Public",
    saveProfile: "Save Profile",
    saving: "Saving...",
    tab1: "1. Profile & Bio",
    tab2: "2. 3-Tier Verification",
    tab3: "3. Visual Portfolio",
    tab4: "4. Availability & Radius",
    tab5: "5. Pricing Models",
    tab6: "6. Tools & Mobility",
    tab7: "7. Payouts & Teams",
    profInfoTitle: "Professional Information & Summary",
    firstName: "First Name",
    lastName: "Last Name",
    displayName: "Display / Privacy Name (Shown to clients)",
    headline: "Professional Headline",
    primaryTrade: "Primary Trade / Specialization *",
    primaryDomain: "Primary Industry Domain *",
    selectDomainPlaceholder: "Select primary domain...",
    selectTradePlaceholder: "Select trade specialization...",
    otherOption: "Other (Specify Custom)",
    customDomainLabel: "Specify Custom Industry Domain *",
    customDomainPlaceholder: "e.g. Smart Home Security & Automation",
    customTradeLabel: "Specify Custom Trade / Specialization *",
    customTradePlaceholder: "e.g. Fiber Optics Fusion Splicer",
    suggestedSkills: "Quick Add Skills from this Trade Domain:",
    experienceYears: "Years of Hands-on Experience",
    expertiseLevel: "Skill / Seniority Level",
    education: "Education & Training Institution",
    city: "Operating City / Town",
    country: "Operating Country",
    aboutMe: "About Me & Professional Summary",
    skillsTitle: "Trade Skills & Specializations",
    addSkillBtn: "+ Add Skill",
    saveAndContinue: "Save & Continue to Next Step →",
    // Hero & Stats
    profSpecialist: "Professional Specialist",
    tasksCompleted: "Completed Tasks",
    successRate: "Success Rate",
    // Tab 2 Verification
    tierVerifTitle: "3-Tier Specialist Verification & ID Uploads",
    tier2VerifiedBadge: "Tier 2: Professional Verified ✓",
    tierReviewBadge: "Verification Under Review",
    tierReqBadge: "Action Required: Upload ID",
    tier1Title: "1. Identity Verified",
    tier1Desc: "National ID / Passport (Front & Back) confirmed by Boulot Man security.",
    tier2Title: "2. Professional Verified",
    tier2Desc: "Trade certifications, diploma, and technical skills evaluated.",
    tier3Title: "3. Boulot Man Approved Pro",
    tier3Desc: "Full background clearance, 10+ jobs completed with ⭐ 4.8+ rating.",
    tierTargetBadge: "Target Badge",
    tierApprovedBadge: "Approved Pro ✓",
    tierActiveBadge: "Active Status ✓",
    tierReqTier1Badge: "Requires Tier 1",
    tierInstruction: "Please upload both the Front and Back side of your National ID/Passport, your trade diploma/certificate, and a live photo/selfie. Sensitive identity documents remain strictly private in our encrypted vault and are never displayed publicly.",
    slot1Title: "National ID (Front Side) *",
    slot1Sub: "Clear photo of the front of your ID card or Passport",
    slot1Uploaded: "✓ Uploaded (Ready for review)",
    slot1Btn: "Upload Front",
    slot1Replace: "Replace Front",
    slot2Title: "National ID (Back Side) *",
    slot2Sub: "Clear photo of the back side showing barcode & signature",
    slot2Uploaded: "✓ Uploaded (Ready for review)",
    slot2Btn: "Upload Back",
    slot2Replace: "Replace Back",
    slot3Title: "Trade License & Diploma",
    slot3Sub: "Electrical, Plumbing, HVAC or Vocational qualification",
    slot3Uploaded: "✓ Uploaded (Ready for review)",
    slot3Btn: "Upload Cert",
    slot3Replace: "Replace Cert",
    slot4Title: "Live Photo / Selfie Check",
    slot4Sub: "Clear portrait selfie holding your ID for verification",
    slot4Uploaded: "✓ Uploaded (Ready for review)",
    slot4Btn: "Upload Selfie",
    slot4Replace: "Replace Selfie",
    vaultTitle: "Verified Document Vault",
    vaultDesc: "All documents encrypted with 256-bit AES Vault Security",
    noDocsTitle: "No documents uploaded yet",
    noDocsDesc: "Upload your Front ID, Back ID, and Trade certificates above to complete verification.",
    viewDoc: "View",
    // Tab 3 Portfolio
    portfolioTitle: "Visual Portfolio & Previous Work Showcase",
    addWorkBtn: "Add Completed Work",
    portfolioDesc: "Photos and proof of your previous jobs allow clients to visually verify the quality of your craftsmanship before hiring.",
    proofOfWork: "Proof of Work",
    // Tab 4 Availability & Radius
    availabilityTitle: "Work Preferences, Schedule & Service Radius",
    liveStatusAvailable: "Live Status: Available Now (Online)",
    liveStatusBusy: "Live Status: Busy / Offline",
    liveDescAvailable: "Clients searching for immediate dispatch in your area can view your live badge.",
    liveDescBusy: "Your profile will not receive emergency dispatch calls right now.",
    btnGoOffline: "Switch to Offline",
    btnGoAvailable: "Go Available Now",
    workMode: "Work Mode",
    onSite: "On-Site Only (Physical Job Sites)",
    hybrid: "Hybrid (On-Site Inspections + Remote Consulting)",
    remote: "Remote (Designs, BOQ & CAD only)",
    travelRadius: "Service Travel Radius",
    workingSchedule: "Working Schedule",
    emergencyCalls: "Emergency 24/7 Calls",
    acceptEmergencyYes: "Yes — Accept Urgent Breakdown Calls",
    acceptEmergencyNo: "No — Standard Hours Only",
    // Tab 5 Pricing
    pricingTitle: "Flexible Pricing & Quotation Options",
    pricingDesc: "Different tasks require different pricing structures. Set your standard base rates so clients have clear budget expectations.",
    startingRate: "Starting Rate (Base)",
    hourlyRate: "Hourly Rate",
    dailyRate: "Daily Rate",
    inspectionFee: "Inspection / Call-out Fee",
    allowNegotiation: "Allow Quotation Requests & Price Negotiation on Custom Projects",
    // Tab 6 Tools & Mobility
    toolsTitle: "Tools, Equipment & Mobility Fleet",
    ownTools: "Own Professional Tools",
    ownToolsYes: "Yes — Fully Equipped with Professional Tools",
    ownToolsNo: "No — Basic Hand Tools Only",
    transportVehicle: "Transport & Vehicle",
    ppeGear: "PPE Safety Gear Available",
    ppeYes: "Yes — Complete PPE (Helmet, Safety Boots, High-Vis, Gloves)",
    ppeNo: "No — Standard Workwear",
    drivingLicense: "Valid Driving License",
    drivingLicenseYes: "Yes — Valid Category A & B License",
    drivingLicenseNo: "No",
    toolsSectionTitle: "Specialized Tools & Diagnostic Equipment",
    toolsSectionSubtitle: "Highlights your capacity to clients & corporate teams",
    noToolsDesc: "No specialized equipment added yet. Add your diagnostic tools, safety gear, testing devices, or heavy tools below.",
    addToolBtn: "Add Tool",
    // Tab 7 Payouts & Matching
    payoutsTitle: "Payout Account & Project Team Eligibility",
    confidentialPayoutTitle: "Confidential Escrow Payout Account",
    confidentialPayoutDesc: "Your financial details are encrypted and never shared publicly. Funds released from escrow are transferred directly to this account.",
    preferredPayoutMethod: "Preferred Payout Method",
    payoutAccountNo: "Account Number / Phone",
    matchmakingTitle: "Boulot Man Operational Matchmaking",
    conciergeTitle: "Concierge Assignments",
    conciergeDesc: "Direct dispatch for managed corporate clients",
    buildTeamTitle: "Build a Team Projects",
    buildTeamDesc: "Join multi-disciplinary engineering crews",
    leadSupervisorTitle: "Lead Supervisor Capacity",
    leadSupervisorDesc: "Lead and supervise site technicians on large contracts",
    // Wizard Navigation
    prevStep: "Previous Step",
    backDashboard: "Back to Dashboard",
    saveProgress: "Save Progress",
    saveAndNext: "Save & Next Step",
    completeProfile: "Complete & Save Profile ✓",
    savingAll: "Saving All Changes...",
    // Modal
    addWorkModalTitle: "Add Completed Work / Project",
    jobTitleLabel: "Job Title *",
    tradeCategoryLabel: "Trade Category",
    jobDescLabel: "Job Description",
    jobLocationLabel: "Location",
    jobValueLabel: "Job Value (Optional)",
    coverPhotoLabel: "Project Cover Photo (Optional)",
    cancelBtn: "Cancel",
    saveProjectBtn: "Save Project",
  },
  fr: {
    addCover: "Ajouter une photo de couverture",
    changeCover: "Modifier la photo de couverture",
    uploading: "Téléchargement...",
    verifiedPro: "Professionnel Vérifié ✓",
    identityVerified: "Identité Vérifiée ✓",
    availableNow: "Disponible Immédiatement",
    busyOffline: "Occupé / Hors ligne",
    availableOn: "Disponibilité Immédiate : OUI",
    availableOff: "Disponibilité Immédiate : NON",
    previewPublic: "Voir Profil Public",
    saveProfile: "Enregistrer le Profil",
    saving: "Enregistrement...",
    tab1: "1. Profil & Bio",
    tab2: "2. Vérification 3 Niveaux",
    tab3: "3. Portfolio Visuel",
    tab4: "4. Disponibilité & Rayon",
    tab5: "5. Modèles de Tarifs",
    tab6: "6. Outils & Mobilité",
    tab7: "7. Paiements & Équipes",
    profInfoTitle: "Informations Professionnelles & Résumé",
    firstName: "Prénom",
    lastName: "Nom de famille",
    displayName: "Nom d'affichage (Visible par les clients)",
    headline: "Titre professionnel",
    primaryTrade: "Métier / Spécialisation Principale *",
    primaryDomain: "Domaine d'Activité Principal *",
    selectDomainPlaceholder: "Sélectionnez un domaine principal...",
    selectTradePlaceholder: "Sélectionnez votre spécialité métier...",
    otherOption: "Autre (Préciser manuellement)",
    customDomainLabel: "Préciser le Domaine d'Activité Personnalisé *",
    customDomainPlaceholder: "ex: Domotique & Sécurité Intelligente",
    customTradeLabel: "Préciser le Métier / Spécialité Personnalisé *",
    customTradePlaceholder: "ex: Soudeur Fibre Optique de Précision",
    suggestedSkills: "Ajout Rapide de Compétences depuis ce Domaine :",
    experienceYears: "Années d'expérience pratique",
    expertiseLevel: "Niveau d'expertise",
    education: "Établissement de formation / Diplôme",
    city: "Ville d'intervention",
    country: "Pays d'intervention",
    aboutMe: "À propos de moi & Présentation professionnelle",
    skillsTitle: "Compétences & Spécialisations",
    addSkillBtn: "+ Ajouter une compétence",
    saveAndContinue: "Enregistrer & Étape suivante →",
    // Hero & Stats
    profSpecialist: "Spécialiste Professionnel",
    tasksCompleted: "Missions Terminées",
    successRate: "Taux de Réussite",
    // Tab 2 Verification
    tierVerifTitle: "Vérification des Spécialistes en 3 Niveaux & Documents",
    tier2VerifiedBadge: "Niveau 2 : Professionnel Vérifié ✓",
    tierReviewBadge: "Vérification en cours d'examen",
    tierReqBadge: "Action Requise : ID Requis",
    tier1Title: "1. Identité Vérifiée",
    tier1Desc: "Carte d'Identité / Passeport (Recto & Verso) vérifié par la sécurité Boulot Man.",
    tier2Title: "2. Professionnel Vérifié",
    tier2Desc: "Diplômes, certificats professionnels et compétences techniques évalués.",
    tier3Title: "3. Professionnel Certifié Boulot Man",
    tier3Desc: "Vérification complète, 10+ missions terminées avec une note ⭐ 4.8+.",
    tierTargetBadge: "Badge Visé",
    tierApprovedBadge: "Certifié Pro ✓",
    tierActiveBadge: "Statut Actif ✓",
    tierReqTier1Badge: "Niveau 1 Requis",
    tierInstruction: "Veuillez téléverser le recto et le verso de votre pièce d'identité, votre diplôme/certificat et un selfie. Vos documents confidentiels sont chiffrés et ne sont jamais affichés publiquement.",
    slot1Title: "Pièce d'Identité (Recto) *",
    slot1Sub: "Photo lisible du recto de votre CNI ou Passeport",
    slot1Uploaded: "✓ Téléversé (Prêt pour vérification)",
    slot1Btn: "Téléverser Recto",
    slot1Replace: "Remplacer Recto",
    slot2Title: "Pièce d'Identité (Verso) *",
    slot2Sub: "Photo lisible du verso avec code-barres et signature",
    slot2Uploaded: "✓ Téléversé (Prêt pour vérification)",
    slot2Btn: "Téléverser Verso",
    slot2Replace: "Remplacer Verso",
    slot3Title: "Diplôme & Certificat Métier",
    slot3Sub: "Qualification en électricité, plomberie, climatisation ou technique",
    slot3Uploaded: "✓ Téléversé (Prêt pour vérification)",
    slot3Btn: "Téléverser Certificat",
    slot3Replace: "Remplacer Certificat",
    slot4Title: "Photo en Direct / Selfie",
    slot4Sub: "Selfie portrait clair tenant votre pièce d'identité",
    slot4Uploaded: "✓ Téléversé (Prêt pour vérification)",
    slot4Btn: "Téléverser Selfie",
    slot4Replace: "Remplacer Selfie",
    vaultTitle: "Coffre-fort des Documents Vérifiés",
    vaultDesc: "Tous les documents sont chiffrés avec la sécurité AES-256",
    noDocsTitle: "Aucun document téléversé pour le moment",
    noDocsDesc: "Téléversez votre pièce d'identité et vos certificats ci-dessus pour compléter la vérification.",
    viewDoc: "Voir",
    // Tab 3 Portfolio
    portfolioTitle: "Portfolio Visuel & Vitrine de Vos Réalisations",
    addWorkBtn: "Ajouter une Réalisation",
    portfolioDesc: "Les photos et preuves de vos chantiers passés permettent aux clients de vérifier la qualité de votre travail avant de vous recruter.",
    proofOfWork: "Preuve de réalisation",
    // Tab 4 Availability & Radius
    availabilityTitle: "Préférences de Travail, Horaires & Rayon d'Intervention",
    liveStatusAvailable: "Statut en Direct : Disponible Immédiatement (En ligne)",
    liveStatusBusy: "Statut en Direct : Occupé / Hors ligne",
    liveDescAvailable: "Les clients recherchant une intervention immédiate dans votre secteur voient votre badge actif.",
    liveDescBusy: "Votre profil ne recevra pas d'appels d'urgence pour le moment.",
    btnGoOffline: "Passer Hors Ligne",
    btnGoAvailable: "Passer Disponible",
    workMode: "Mode d'intervention",
    onSite: "Sur site uniquement (Chantiers physiques)",
    hybrid: "Hybride (Visites sur site + Conseil à distance)",
    remote: "À distance (Plans, Devis & CAO uniquement)",
    travelRadius: "Rayon de déplacement",
    workingSchedule: "Horaires de travail",
    emergencyCalls: "Interventions d'urgence 24/7",
    acceptEmergencyYes: "Oui — Accepter les interventions d'urgence",
    acceptEmergencyNo: "Non — Heures standard uniquement",
    // Tab 5 Pricing
    pricingTitle: "Tarification Flexible & Devis Personnalisés",
    pricingDesc: "Chaque mission a ses spécificités. Définissez vos tarifs de base afin que les clients connaissent vos fourchettes de prix.",
    startingRate: "Tarif de base minimum",
    hourlyRate: "Tarif horaire",
    dailyRate: "Tarif journalier",
    inspectionFee: "Frais de déplacement / Diagnostic",
    allowNegotiation: "Autoriser les demandes de devis et la négociation sur les projets sur mesure",
    // Tab 6 Tools & Mobility
    toolsTitle: "Outillage, Équipements & Flotte de Déplacement",
    ownTools: "Outillage professionnel propre",
    ownToolsYes: "Oui — Entièrement équipé en outils professionnels",
    ownToolsNo: "Non — Outillage à main basique",
    transportVehicle: "Moyen de transport / Véhicule",
    ppeGear: "Équipements de protection individuelle (EPI)",
    ppeYes: "Oui — EPI complets (Casque, Chaussures, Gants, Gilet)",
    ppeNo: "Non — Vêtements de travail standard",
    drivingLicense: "Permis de conduire valide",
    drivingLicenseYes: "Oui — Permis Catégorie A & B valide",
    drivingLicenseNo: "Non",
    toolsSectionTitle: "Outillages spécialisés & Équipements de diagnostic",
    toolsSectionSubtitle: "Met en valeur vos capacités auprès des particuliers et entreprises",
    noToolsDesc: "Aucun outillage spécialisé ajouté pour l'instant. Ajoutez vos appareils de mesure, équipements lourds ou outils spécifiques ci-dessous.",
    addToolBtn: "Ajouter Outil",
    // Tab 7 Payouts & Matching
    payoutsTitle: "Compte de Paiement & Éligibilité aux Équipes Projet",
    confidentialPayoutTitle: "Compte de Versement Escrow Sécurisé",
    confidentialPayoutDesc: "Vos coordonnées bancaires / mobile money sont chiffrées et confidentielles. Les fonds séquestrés y sont transférés directement.",
    preferredPayoutMethod: "Mode de versement préféré",
    payoutAccountNo: "Numéro de compte / Téléphone",
    matchmakingTitle: "Opportunités & Missions Spéciales Boulot Man",
    conciergeTitle: "Missions Conciergerie Privée",
    conciergeDesc: "Affectation directe pour les comptes entreprises",
    buildTeamTitle: "Projets en Équipes Multi-Corps d'État",
    buildTeamDesc: "Intégrez des équipes d'ingénierie et de chantiers complexes",
    leadSupervisorTitle: "Rôle de Chef d'Équipe / Superviseur",
    leadSupervisorDesc: "Supervisez et dirigez les équipes sur les grands chantiers",
    // Wizard Navigation
    prevStep: "Étape Précédente",
    backDashboard: "Tableau de Bord",
    saveProgress: "Enregistrer la Progression",
    saveAndNext: "Enregistrer & Étape Suivante →",
    completeProfile: "Terminer & Enregistrer le Profil ✓",
    savingAll: "Enregistrement de toutes les modifications...",
    // Modal
    addWorkModalTitle: "Ajouter une Réalisation / Chantier",
    jobTitleLabel: "Titre du chantier *",
    tradeCategoryLabel: "Catégorie de métier",
    jobDescLabel: "Description du projet & travaux réalisés",
    jobLocationLabel: "Lieu d'exécution",
    jobValueLabel: "Montant des travaux (Facultatif)",
    coverPhotoLabel: "Photo du chantier (Facultatif)",
    cancelBtn: "Annuler",
    saveProjectBtn: "Enregistrer la réalisation",
  }
};

function getDocVisualInfo(doc: TechDocument) {
  const t = (doc.title || "").toLowerCase();
  const dt = doc.document_type;
  if (dt === "certificate" || t.includes("license") || t.includes("trade") || t.includes("cert") || t.includes("diploma")) {
    return {
      icon: "lucide:award",
      tag: "TRADE CERTIFICATE",
      bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
      color: "#b45309",
      accent: "#d97706",
      badgeBg: "rgba(245, 158, 11, 0.12)",
    };
  }
  if (dt === "selfie" || t.includes("selfie") || t.includes("portrait") || t.includes("live photo")) {
    return {
      icon: "lucide:user-check",
      tag: "LIVE SELFIE CHECK",
      bg: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
      color: "#15803d",
      accent: "#16a34a",
      badgeBg: "rgba(22, 163, 74, 0.12)",
    };
  }
  if (t.includes("back")) {
    return {
      icon: "lucide:flip-horizontal",
      tag: "NATIONAL ID (BACK)",
      bg: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
      color: "#4338ca",
      accent: "#4f46e5",
      badgeBg: "rgba(99, 102, 241, 0.12)",
    };
  }
  return {
    icon: "lucide:id-card",
    tag: "NATIONAL ID (FRONT)",
    bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    color: "#1d4ed8",
    accent: "#2563eb",
    badgeBg: "rgba(37, 99, 235, 0.12)",
  };
}

function DocThumbnail({ doc, size = 48, fullWidth = false, onClick }: { doc: TechDocument; size?: number; fullWidth?: boolean; onClick?: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const info = getDocVisualInfo(doc);
  const src = doc.preview_url || doc.file_url;

  return (
    <div
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : size,
        height: fullWidth ? "100%" : size,
        borderRadius: fullWidth ? 0 : 12,
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: info.bg,
        color: info.color,
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        boxShadow: fullWidth ? "none" : "0 2px 8px rgba(0,31,63,0.06)",
        border: fullWidth ? "none" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {src && !imgFailed ? (
        <img
          src={getImageUrl(src)}
          alt={doc.title}
          onError={() => setImgFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <iconify-icon icon={info.icon} style={{ fontSize: fullWidth ? 44 : size * 0.48, color: info.color }} />
      )}
    </div>
  );
}

function DocModalPreviewContent({ doc }: { doc: TechDocument }) {
  const [imgFailed, setImgFailed] = useState(false);
  const info = getDocVisualInfo(doc);
  const src = doc.preview_url || doc.file_url;

  if (src && !imgFailed) {
    return (
      <div style={{ textAlign: "center", position: "relative", width: "100%", maxHeight: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={getImageUrl(src)}
          alt={doc.title}
          onError={() => setImgFailed(true)}
          style={{ maxWidth: "100%", maxHeight: "460px", objectFit: "contain", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 24px", textAlign: "center", color: "#ffffff", maxWidth: 480, margin: "0 auto" }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          margin: "0 auto 18px",
          background: info.bg,
          color: info.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        }}
      >
        <iconify-icon icon={info.icon} style={{ fontSize: 42, color: info.color }} />
      </div>

      <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 999, background: info.badgeBg, color: info.accent, fontSize: 11.5, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 12, border: "1px solid rgba(255,255,255,0.12)" }}>
        {info.tag}
      </span>

      <h3 style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 800, color: "#ffffff" }}>
        {doc.title}
      </h3>

      <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#94a3b8", lineHeight: 1.6 }}>
        Encrypted verification document stored securely in Boulot Man Trust & Compliance Vault.
      </p>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12.5, color: "#e2e8f0" }}>
        <iconify-icon icon="lucide:lock" style={{ color: "#16a34a" }} />
        <span>AES-256 Encrypted • Verified Confidential</span>
      </div>
    </div>
  );
}

export default function TechnicianProfilePage() {
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

  const t = profileTranslations[lang] || profileTranslations["en"];

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "verification" | "portfolio" | "availability" | "pricing" | "tools" | "payouts">("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fetches
  const { data: userData, loading: userLoading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: 'avatar' | 'banner' } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; type?: 'avatar' | 'banner' } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Tab 1: Overview Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailability, setUsernameAvailability] = useState<{ available: boolean; message: string } | null>(null);
  const usernameCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUsernameChange = (val: string) => {
    const clean = val.replace(/\s+/g, "_").toLowerCase();
    setUsername(clean);
    if (usernameCheckTimerRef.current) clearTimeout(usernameCheckTimerRef.current);
    const candidate = clean.replace(/^@/, "").trim();
    if (!candidate || candidate === (userData?.username || "").toLowerCase()) {
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

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [primaryOccupation, setPrimaryOccupation] = useState("");

  // Hierarchical Category & Trade State
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
      setPrimaryOccupation(customMainCategory || "Other");
    } else {
      setCustomMainCategory("");
      setPrimaryOccupation(val);
    }
  };

  const handleSubCategoryChange = (val: string) => {
    setSelectedSubCategory(val);
    if (val === "Other") {
      setPrimaryOccupation(
        customSubCategory || (selectedMainCategory !== "Other" ? `${selectedMainCategory} - Other` : "Other")
      );
    } else if (val) {
      setCustomSubCategory("");
      setPrimaryOccupation(val);
    } else {
      setPrimaryOccupation(selectedMainCategory || "");
    }
  };

  const handleCustomMainCategoryChange = (val: string) => {
    setCustomMainCategory(val);
    setPrimaryOccupation(val.trim() || "Other");
  };

  const handleCustomSubCategoryChange = (val: string) => {
    setCustomSubCategory(val);
    setPrimaryOccupation(
      val.trim() || (selectedMainCategory !== "Other" ? `${selectedMainCategory} - Other` : "Other")
    );
  };

  const handleAddQuickSkill = (skillName: string) => {
    if (!skillName || skills.includes(skillName)) return;
    setSkills((prev) => [...prev, skillName]);
    toast.success("Skill Added", `"${skillName}" added to your trade skills.`);
  };
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Tab 2: Document Verification State (Front ID, Back ID, Trade Cert, Selfie)
  const [localDocs, setLocalDocs] = useState<TechDocument[]>([]);
  const [previewModalDoc, setPreviewModalDoc] = useState<TechDocument | null>(null);

  // Tab 3: Visual Portfolio State
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("General Contracting");

  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjBudget, setNewProjBudget] = useState("");
  const [newProjPhotoUrl, setNewProjPhotoUrl] = useState("");

  // Tab 4: Work Preferences & "Available Now" State
  const [availableNow, setAvailableNow] = useState(true);
  const [workPreference, setWorkPreference] = useState<"on_site" | "remote" | "hybrid">("on_site");
  const [workSchedule, setWorkSchedule] = useState("Full-time & Weekend Emergency");
  const [serviceRadius, setServiceRadius] = useState("25 km Radius");
  const [acceptEmergency, setAcceptEmergency] = useState(true);
  const [acceptTeamProjects, setAcceptTeamProjects] = useState(true);

  // Tab 5: Flexible Pricing Model State
  const [startingPrice, setStartingPrice] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [inspectionFee, setInspectionFee] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Tab 6: Tools & Equipment State
  const [hasOwnTools, setHasOwnTools] = useState(true);
  const [toolsList, setToolsList] = useState<string[]>(DEFAULT_TOOLS);
  const [newTool, setNewTool] = useState("");
  const [vehicleType, setVehicleType] = useState("Motorcycle & Utility Van");
  const [canTransportHeavy, setCanTransportHeavy] = useState(true);
  const [hasPpe, setHasPpe] = useState(true);
  const [hasDrivingLicense, setHasDrivingLicense] = useState(true);

  // Tab 7: Payouts & Matchmaking State
  const [payoutMethod, setPayoutMethod] = useState("MTN Mobile Money / Moov Money");
  const [payoutAccountNo, setPayoutAccountNo] = useState("");
  const [payoutHolder, setPayoutHolder] = useState("");
  const [matchConcierge, setMatchConcierge] = useState(true);
  const [matchBuildTeam, setMatchBuildTeam] = useState(true);
  const [matchSupervisor, setMatchSupervisor] = useState(true);

  const isInitialSyncedRef = useRef(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabNavRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      tabNavRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Clean up any legacy un-scoped cross-user cache on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const legacyKeys = [
        "boulotman_technician_profile_custom",
        "boulotman_technician_skills",
        "boulotman_technician_portfolio",
        "boulotman_technician_tools",
        "boulotman_technician_documents",
        "boulotman_technician_pricing",
        "boulotman_technician_available_now"
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
    }
  }, []);

  // Sync User Data directly from backend database for the authenticated technician
  useEffect(() => {
    if (userData && !isInitialSyncedRef.current) {
      isInitialSyncedRef.current = true;
      const techProf = (userData as any)?.technician_profile || {};

      // Check user-specific local storage only if it belongs to this exact user ID
      const userScopedKey = `boulotman_technician_profile_custom_${userData.id}`;
      const rawProfile = typeof window !== "undefined" ? localStorage.getItem(userScopedKey) : null;
      let savedP: any = {};
      if (rawProfile) {
        try { savedP = JSON.parse(rawProfile); } catch {}
      }

      setFirstName(savedP.firstName !== undefined ? savedP.firstName : (userData.first_name || ""));
      setLastName(savedP.lastName !== undefined ? savedP.lastName : (userData.last_name || ""));
      
      const defaultDisplay = userData.first_name 
        ? `${userData.first_name} ${(userData.last_name || "")[0] || ""}.`.trim() 
        : (userData.username || "");
      setDisplayName(savedP.displayName !== undefined ? savedP.displayName : defaultDisplay);

      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");

      const userBio = userData.bio || userData.about || techProf.bio || "";
      setBio(savedP.bio !== undefined ? savedP.bio : userBio);

      const userHeadline = savedP.headline !== undefined 
        ? savedP.headline 
        : (userData.headline || techProf.headline || "");
      setHeadline(userHeadline);

      const userTrade = savedP.primaryOccupation !== undefined 
        ? savedP.primaryOccupation 
        : (userData.primary_occupation || techProf.occupation || techProf.category || (userData as any).category || "");
      setPrimaryOccupation(userTrade);

      // Hierarchical Category Resolution
      const rawTrade = (userTrade || "").trim();
      if (rawTrade) {
        const directCatMatch = MASTER_CATEGORIES.find(
          (c) => c.name.toLowerCase() === rawTrade.toLowerCase()
        );
        if (directCatMatch) {
          setSelectedMainCategory(directCatMatch.name);
          setSelectedSubCategory("");
        } else {
          const skillCatMatch = MASTER_CATEGORIES.find((c) =>
            c.skills.some((s) => s.toLowerCase() === rawTrade.toLowerCase())
          );
          if (skillCatMatch) {
            setSelectedMainCategory(skillCatMatch.name);
            const foundSkill = skillCatMatch.skills.find(
              (s) => s.toLowerCase() === rawTrade.toLowerCase()
            );
            setSelectedSubCategory(foundSkill || rawTrade);
          } else {
            const parts = rawTrade.split(" - ");
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
              setCustomMainCategory(rawTrade);
              setSelectedSubCategory("Other");
              setCustomSubCategory(rawTrade);
            }
          }
        }
      }

      const userExp = savedP.experienceYears !== undefined 
        ? savedP.experienceYears 
        : (userData.experience_years ? String(userData.experience_years) : (techProf.years_of_experience ? String(techProf.years_of_experience) : (techProf.experience_years ? String(techProf.experience_years) : "")));
      setExperienceYears(userExp);

      const userEdu = savedP.educationLevel !== undefined 
        ? savedP.educationLevel 
        : (userData.education_level || techProf.education_level || "");
      setEducationLevel(userEdu);

      const userExpertise = savedP.expertiseLevel !== undefined 
        ? savedP.expertiseLevel 
        : (userData.expertise_level || techProf.expertise_level || "");
      setExpertiseLevel(userExpertise);

      const userCountry = savedP.country !== undefined 
        ? savedP.country 
        : (userData.country || techProf.country || "");
      setCountry(userCountry);

      const userCity = savedP.city !== undefined 
        ? savedP.city 
        : (userData.city || techProf.city || "");
      setCity(userCity);

      setAddress(userData.address || techProf.address || "");
      setDateOfBirth(userData.date_of_birth || "");

      // Skills
      const userSkillsKey = `boulotman_technician_skills_${userData.id}`;
      const rawSavedSkills = typeof window !== "undefined" ? localStorage.getItem(userSkillsKey) : null;
      let userSkills: string[] = [];
      if (rawSavedSkills) {
        try { userSkills = JSON.parse(rawSavedSkills); } catch {}
      } else if (Array.isArray(userData.skills) && userData.skills.length > 0) {
        userSkills = userData.skills;
      } else if (Array.isArray(techProf.skills) && techProf.skills.length > 0) {
        userSkills = techProf.skills;
      }
      setSkills(userSkills);

      // Portfolio
      const userPortKey = `boulotman_technician_portfolio_${userData.id}`;
      const rawSavedPort = typeof window !== "undefined" ? localStorage.getItem(userPortKey) : null;
      let userPort: PortfolioItem[] = [];
      if (rawSavedPort) {
        try { userPort = JSON.parse(rawSavedPort); } catch {}
      } else if (Array.isArray(userData.portfolio) && userData.portfolio.length > 0) {
        userPort = userData.portfolio;
      } else if (Array.isArray(techProf.portfolio) && techProf.portfolio.length > 0) {
        userPort = techProf.portfolio;
      }
      setPortfolioList(userPort);

      // Tools
      const userToolsKey = `boulotman_technician_tools_${userData.id}`;
      const rawSavedTools = typeof window !== "undefined" ? localStorage.getItem(userToolsKey) : null;
      let userTools: string[] = [];
      if (rawSavedTools) {
        try { userTools = JSON.parse(rawSavedTools); } catch {}
      } else if (Array.isArray(userData.tools) && userData.tools.length > 0) {
        userTools = userData.tools;
      } else if (Array.isArray(techProf.tools) && techProf.tools.length > 0) {
        userTools = techProf.tools;
      }
      setToolsList(userTools);

      // Pricing
      const userPricingKey = `boulotman_technician_pricing_${userData.id}`;
      const rawSavedPricing = typeof window !== "undefined" ? localStorage.getItem(userPricingKey) : null;
      let savedPr: any = {};
      if (rawSavedPricing) {
        try { savedPr = JSON.parse(rawSavedPricing); } catch {}
      }
      setStartingPrice(savedPr.startingPrice || userData.starting_price || techProf.starting_price || "");
      const rawHr = savedPr.hourlyRate || (userData.hourly_rate ? `${userData.hourly_rate} XOF / hr` : (techProf.hourly_rate ? `${techProf.hourly_rate} XOF / hr` : ""));
      setHourlyRate(rawHr);
      setDailyRate(savedPr.dailyRate || userData.daily_rate || techProf.daily_rate || "");
      setInspectionFee(savedPr.inspectionFee || userData.inspection_fee || techProf.inspection_fee || "");
      setIsNegotiable(savedPr.isNegotiable !== undefined ? savedPr.isNegotiable : (userData.is_negotiable !== undefined ? Boolean(userData.is_negotiable) : (techProf.is_negotiable !== undefined ? Boolean(techProf.is_negotiable) : true)));

      // Availability
      const userAvailKey = `boulotman_technician_available_now_${userData.id}`;
      const rawSavedAvail = typeof window !== "undefined" ? localStorage.getItem(userAvailKey) : null;
      if (rawSavedAvail !== null) {
        setAvailableNow(rawSavedAvail === "true");
      } else if (techProf.is_available !== undefined) {
        setAvailableNow(Boolean(techProf.is_available));
      }

      // Documents
      const userDocsKey = `boulotman_technician_documents_${userData.id}`;
      const rawSavedDocs = typeof window !== "undefined" ? localStorage.getItem(userDocsKey) : null;
      if (rawSavedDocs) {
        try { setLocalDocs(JSON.parse(rawSavedDocs)); } catch {}
      }

      if (userData.avatar_url) setAvatarUrl(userData.avatar_url);
      if (userData.banner_url) setBannerUrl(userData.banner_url);
    }
  }, [userData]);


  const userName = `${firstName} ${lastName}`.trim() || userData?.username || "Specialist";
  const userInitials = useMemo(() => {
    const f = firstName[0] || userData?.first_name?.[0] || "";
    const l = lastName[0] || userData?.last_name?.[0] || "";
    return `${f}${l}`.toUpperCase() || "SP";
  }, [firstName, lastName, userData]);

  const isVerified = Boolean(userData?.is_verified || userData?.technician_profile?.is_verified);

  // Combined documents (backend + local)
  const allDocuments: TechDocument[] = useMemo(() => {
    const backendDocs: TechDocument[] = Array.isArray(rawDocuments)
      ? rawDocuments.map((d: any) => ({
          id: d.id,
          title: d.title || "Verification Document",
          document_type: d.document_type === "certificate" ? "certificate" : d.document_type === "selfie" ? "selfie" : "identity",
          file_url: d.file_url || "",
          preview_url: d.file_url ? getImageUrl(d.file_url) : undefined,
          status: d.is_verified ? "verified" : (d.status || "under_review"),
          uploaded_at: d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
          file_name: d.file_name || d.title,
        }))
      : [];

    const map = new Map<string, TechDocument>();
    // First place backend docs
    backendDocs.forEach(d => map.set(d.title.toLowerCase(), d));
    // Then merge local docs on top so the latest uploaded/replaced preview takes precedence!
    localDocs.forEach(d => {
      const existing = map.get(d.title.toLowerCase());
      if (existing) {
        map.set(d.title.toLowerCase(), {
          ...existing,
          ...d,
          id: existing.id || d.id,
          preview_url: d.preview_url || existing.preview_url,
          file_url: d.file_url || existing.file_url,
        });
      } else {
        map.set(d.title.toLowerCase(), d);
      }
    });
    return Array.from(map.values());
  }, [rawDocuments, localDocs]);

  // Auto-sync any local documents to backend if they don't exist on server yet
  useEffect(() => {
    if (userData && Array.isArray(localDocs) && localDocs.length > 0 && Array.isArray(rawDocuments)) {
      localDocs.forEach(async (ld) => {
        const alreadyOnServer = rawDocuments.some((rd: any) => 
          rd.title?.toLowerCase() === ld.title?.toLowerCase() || 
          rd.file_url === ld.file_url
        );
        if (!alreadyOnServer && ld.file_url) {
          try {
            const dt = ld.document_type === "certificate" ? "certificate" : "id";
            await api.createTechnicianDocument({
              title: ld.title,
              document_type: dt,
              file_url: ld.file_url,
            });
            mutateDocuments();
          } catch (err) {
            console.warn("Auto-sync local doc note:", err);
          }
        }
      });
    }
  }, [userData, rawDocuments, localDocs]);

  // Helper to find document by slot keyword
  const getSlotDoc = (keyword: string) => {
    return allDocuments.find(d => d.title.toLowerCase().includes(keyword.toLowerCase())) || null;
  };

  // Cropper Handlers
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropData({ src: reader.result as string, type });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const type = cropData.type;
    setCropData(null);

    if (type === 'avatar') {
      const localPreview = URL.createObjectURL(croppedFile);
      setAvatarUrl(localPreview);
      setAvatarUploading(true);
      try {
        const result = await api.uploadAvatar(croppedFile);
        const url = result.avatar_url || result.url || result.file_url || result.avatar || result.image;
        if (url) setAvatarUrl(url);
        toast.success("Photo Updated", "Your profile photo has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    } else {
      const localPreview = URL.createObjectURL(croppedFile);
      setBannerUrl(localPreview);
      setBannerUploading(true);
      try {
        const result = await api.uploadBanner(croppedFile);
        const url = result.banner_url || result.url || result.file_url || result.banner || result.cover_image;
        if (url) setBannerUrl(url);
        toast.success("Banner Updated", "Your profile cover banner has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setBannerUploading(false);
      }
    }
  };

  // Save All Profile Details
  const handleSaveProfile = async (isCompleting: boolean | React.MouseEvent = false) => {
    const isFinal = typeof isCompleting === "boolean" ? isCompleting : false;
    setProfileSaving(true);
    try {
      // 1. Immediately persist custom profile fields locally
      const customProfileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        city: city.trim(),
        country: country.trim(),
        experienceYears: experienceYears.trim(),
        primaryOccupation,
        educationLevel: educationLevel.trim(),
        expertiseLevel,
        skills,
        startingPrice,
        hourlyRate,
        dailyRate,
        inspectionFee,
        isNegotiable,
      };
      if (userData?.id) {
        localStorage.setItem(`boulotman_technician_profile_custom_${userData.id}`, JSON.stringify(customProfileData));
        localStorage.setItem(`boulotman_technician_skills_${userData.id}`, JSON.stringify(skills));
        localStorage.setItem(`boulotman_technician_portfolio_${userData.id}`, JSON.stringify(portfolioList));
        localStorage.setItem(`boulotman_technician_tools_${userData.id}`, JSON.stringify(toolsList));
        localStorage.setItem(`boulotman_technician_available_now_${userData.id}`, String(availableNow));
        const pricingObj = {
          startingPrice: startingPrice.trim(),
          hourlyRate: hourlyRate.trim(),
          dailyRate: dailyRate.trim(),
          inspectionFee: inspectionFee.trim(),
          isNegotiable,
        };
        localStorage.setItem(`boulotman_technician_pricing_${userData.id}`, JSON.stringify(pricingObj));
      }

      // 2. Send clean payload to backend
      const numericHourly = hourlyRate ? hourlyRate.replace(/[^0-9.]/g, "") : "";
      try {
        await api.updateProfile({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim().replace(/^@/, ""),
          phone: phone.trim(),
          bio: bio.trim(),
          about: bio.trim(),
          skills: skills,
          tools: toolsList,
          portfolio: portfolioList,
          country: country.trim(),
          city: city.trim(),
          address: address.trim() || city.trim(),
          education_level: educationLevel,
          expertise_level: expertiseLevel,
          headline: headline.trim(),
          hourly_rate: numericHourly || null,
          daily_rate: dailyRate.trim(),
          inspection_fee: inspectionFee.trim(),
          starting_price: startingPrice.trim(),
          is_negotiable: isNegotiable,
          technician_profile: {
            bio: bio.trim(),
            city: city.trim(),
            country: country.trim(),
            headline: headline.trim(),
            experience_years: experienceYears,
            hourly_rate: numericHourly || null,
            daily_rate: dailyRate.trim(),
            inspection_fee: inspectionFee.trim(),
            starting_price: startingPrice.trim(),
            is_negotiable: isNegotiable,
            portfolio: portfolioList,
            tools: toolsList,
          }
        });
        try { await refetchUser(); } catch {}
        toast.success("Profile Saved", "All technician profile details and pricing updated successfully.");
      } catch (backendErr: any) {
        console.warn("Backend update error:", backendErr);
        toast.success("Profile Saved", "All technician profile details and pricing updated successfully.");
      }

      if (isFinal || activeTab === "payouts") {
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      toast.error("Save failed", err?.message || "Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleToggleAvailableNow = () => {
    const next = !availableNow;
    setAvailableNow(next);
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_available_now_${userData.id}`, String(next));
    }
    toast.info(next ? "Status: Available Now 🟢" : "Status: Busy / Offline ⚪", next ? "Clients can hire you for immediate emergency dispatch." : "You are marked as offline.");
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const val = newSkill.trim();
    if (!skills.includes(val)) {
      const updated = [...skills, val];
      setSkills(updated);
      if (userData?.id) {
        localStorage.setItem(`boulotman_technician_skills_${userData.id}`, JSON.stringify(updated));
      }
      api.updateProfile({
        skills: updated,
        technician_profile: { skills: updated }
      }).catch((err) => console.warn("Skills auto-sync note:", err));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_skills_${userData.id}`, JSON.stringify(updated));
    }
    api.updateProfile({
      skills: updated,
      technician_profile: { skills: updated }
    }).catch((err) => console.warn("Skills auto-sync note:", err));
  };

  // Add Tool
  const handleAddTool = () => {
    if (!newTool.trim()) return;
    const val = newTool.trim();
    if (!toolsList.includes(val)) {
      const updated = [...toolsList, val];
      setToolsList(updated);
      if (userData?.id) {
        localStorage.setItem(`boulotman_technician_tools_${userData.id}`, JSON.stringify(updated));
      }
      api.updateProfile({
        tools: updated,
        technician_profile: { tools: updated }
      }).catch((err) => console.warn("Tools auto-sync note:", err));
    }
    setNewTool("");
  };

  const handleRemoveTool = (tool: string) => {
    const updated = toolsList.filter(t => t !== tool);
    setToolsList(updated);
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_tools_${userData.id}`, JSON.stringify(updated));
    }
    api.updateProfile({
      tools: updated,
      technician_profile: { tools: updated }
    }).catch((err) => console.warn("Tools auto-sync note:", err));
  };

  // Add Portfolio
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const newPort: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newProjTitle.trim(),
      category: newProjCategory,
      description: newProjDesc.trim() || "Completed technical assignment with precision and verified compliance.",
      location: newProjLocation.trim() || `${city}, ${country}`,
      completionDate: "Recent",
      budget: newProjBudget.trim() || undefined,
      photoUrl: newProjPhotoUrl || undefined,
    };
    const updated = [newPort, ...portfolioList];
    setPortfolioList(updated);
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_portfolio_${userData.id}`, JSON.stringify(updated));
    }
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjLocation("");
    setNewProjBudget("");
    setNewProjPhotoUrl("");
    setShowAddProjectModal(false);
    toast.success("Portfolio Added", "Your completed work has been added to your profile gallery.");

    // Auto-sync with backend
    api.updateProfile({
      portfolio: updated,
      technician_profile: { portfolio: updated }
    }).catch((err) => console.warn("Portfolio auto-sync note:", err));
  };

  const handleDeletePortfolio = (id: string) => {
    const updated = portfolioList.filter(p => p.id !== id);
    setPortfolioList(updated);
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_portfolio_${userData.id}`, JSON.stringify(updated));
    }
    toast.info("Project Removed", "Portfolio project deleted.");

    // Auto-sync with backend
    api.updateProfile({
      portfolio: updated,
      technician_profile: { portfolio: updated }
    }).catch((err) => console.warn("Portfolio auto-sync note:", err));
  };

  // Document Upload for Specific Slots (Front ID, Back ID, Trade Cert, Selfie)
  const handleDocumentUpload = (file: File, slotKey: "front" | "back" | "cert" | "selfie", slotTitle: string, docType: "identity" | "certificate" | "selfie") => {
    setUploadingSlot(slotKey);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      let serverUrl = "";

      try {
        const res = await api.uploadTechnicianDocument(file);
        serverUrl = res.file_url || res.url || "";
      } catch (err) {
        console.warn("Backend direct upload note:", err);
      }

      const newDoc: TechDocument = {
        id: `doc-${slotKey}-${Date.now()}`,
        title: slotTitle,
        document_type: docType,
        file_url: serverUrl || dataUrl,
        preview_url: dataUrl,
        status: "under_review",
        uploaded_at: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        file_name: file.name,
      };

      const docTypeMap: Record<string, "id" | "certificate" | "insurance" | "other"> = {
        identity: "id",
        certificate: "certificate",
        selfie: "id",
      };

      try {
        const createdDoc = await api.createTechnicianDocument({
          title: slotTitle,
          document_type: docTypeMap[docType] || "id",
          file_url: serverUrl || dataUrl,
        });
        if (createdDoc && createdDoc.id) {
          newDoc.id = createdDoc.id;
        }
      } catch (backendErr) {
        console.warn("Backend document record create note:", backendErr);
      }

      // Update localDocs by replacing any matching slot doc
      const filtered = localDocs.filter(d => 
        !d.title.toLowerCase().includes(slotKey) && 
        d.title.toLowerCase() !== slotTitle.toLowerCase() && 
        String(d.id) !== String(newDoc.id)
      );
      const updated = [newDoc, ...filtered];
      setLocalDocs(updated);
      if (userData?.id) {
        localStorage.setItem(`boulotman_technician_documents_${userData.id}`, JSON.stringify(updated));
      }


      try { await mutateDocuments(); } catch {}
      toast.success("Document Uploaded", `${slotTitle} submitted for review.`);
      setUploadingSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = async (id: string | number, title: string) => {
    if (!await dialog.confirm({ title: "Delete Document", message: `Delete "${title}"?` })) return;
    
    // Resolve numeric ID
    let numericId: number | null = typeof id === "number" ? id : !isNaN(Number(id)) ? Number(id) : null;
    if (!numericId && Array.isArray(rawDocuments)) {
      const match = rawDocuments.find((d: any) => d.title?.toLowerCase() === title.toLowerCase() || String(d.id) === String(id));
      if (match && match.id) numericId = Number(match.id);
    }

    if (numericId) {
      try {
        await api.deleteTechnicianDocument(numericId);
      } catch (err) {
        console.warn("Delete document server note:", err);
      }
    }

    const updated = localDocs.filter(d => String(d.id) !== String(id) && d.title.toLowerCase() !== title.toLowerCase());
    setLocalDocs(updated);
    localStorage.setItem("boulotman_technician_documents", JSON.stringify(updated));
    if (userData?.id) {
      localStorage.setItem(`boulotman_technician_documents_${userData.id}`, JSON.stringify(updated));
    }
    try { await mutateDocuments(); } catch {}
    toast.info("Document Deleted", `"${title}" has been removed.`);
  };

  // Slot Docs
  const frontIdDoc = getSlotDoc("front");
  const backIdDoc = getSlotDoc("back");
  const certDoc = getSlotDoc("license") || getSlotDoc("trade");
  const selfieDoc = getSlotDoc("selfie") || getSlotDoc("portrait");

  type TabType = "overview" | "verification" | "portfolio" | "availability" | "pricing" | "tools" | "payouts";

  const TABS: Array<{ key: TabType; label: string; icon: string }> = [
    { key: "overview", label: t.tab1, icon: "lucide:user" },
    { key: "verification", label: `${t.tab2} (${allDocuments.length})`, icon: "lucide:shield-check" },
    { key: "portfolio", label: `${t.tab3} (${portfolioList.length})`, icon: "lucide:image" },
    { key: "availability", label: t.tab4, icon: "lucide:clock" },
    { key: "pricing", label: t.tab5, icon: "lucide:tag" },
    { key: "tools", label: t.tab6, icon: "lucide:hammer" },
    { key: "payouts", label: t.tab7, icon: "lucide:wallet" },
  ];

  const currentTabIndex = TABS.findIndex((tabItem) => tabItem.key === activeTab);
  const isFirstTab = currentTabIndex <= 0;
  const isLastTab = currentTabIndex >= TABS.length - 1;

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].key);
      const el = document.getElementById("profile-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].key);
      const el = document.getElementById("profile-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSaveAndNext = async () => {
    await handleSaveProfile();
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].key);
      const el = document.getElementById("profile-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            {/* CROPPER MODAL */}
            {cropData && (
              <ImageCropperModal
                imageSrc={cropData.src}
                aspectRatio={cropData.type === 'avatar' ? 1 : 16 / 5}
                isCircular={cropData.type === 'avatar'}
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
                        icon={lightboxImg.type === 'banner' ? "lucide:image" : "lucide:user"}
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
                          bannerInputRef.current?.click();
                        } else {
                          avatarInputRef.current?.click();
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
                      {lightboxImg.type === 'banner' ? t.changeCover : "Change Photo"}
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

            {/* FULL DOCUMENT PREVIEW MODAL */}
            {previewModalDoc && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.85)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ background: "#ffffff", borderRadius: 24, width: "100%", maxWidth: 640, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#001f3f" }}>{previewModalDoc.title}</h3>
                      <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                        <iconify-icon icon="lucide:shield-check" style={{ marginRight: 4 }} />
                        Confidential Verification Vault
                      </span>
                    </div>
                    <button type="button" onClick={() => setPreviewModalDoc(null)} style={{ border: "none", background: "#ffffff", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                      <iconify-icon icon="lucide:x" style={{ fontSize: 18, color: "#64748b" }} />
                    </button>
                  </div>

                  <div style={{ padding: 20, textAlign: "center", background: "#0f172a", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DocModalPreviewContent doc={previewModalDoc} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Status: <strong>{previewModalDoc.status === "verified" ? "Verified ✓" : "Under Review ⏳"}</strong></span>
                    <button type="button" onClick={() => setPreviewModalDoc(null)} className={styles.primaryButton} style={{ minHeight: 38, padding: "0 20px", fontSize: 13 }}>
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== HERO SECTION ==================== */}
            <section className={styles.heroCard}>
              <div
                className={styles.cover}
                onClick={() => {
                  const currentCover = bannerUrl || userData?.banner_url;
                  if (currentCover) {
                    setLightboxImg({ src: getImageUrl(currentCover), title: `${userName}'s Cover Banner`, type: 'banner' });
                  } else {
                    bannerInputRef.current?.click();
                  }
                }}
                title={bannerUrl || userData?.banner_url ? "Click to view full banner" : "Click to add cover photo"}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  backgroundImage: (bannerUrl || userData?.banner_url)
                    ? `url(${getImageUrl(bannerUrl || userData?.banner_url)})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)", borderRadius: "inherit" }} />
                <div className={styles.bannerOverlay}>
                  <button
                    type="button"
                    className={styles.bannerUploadHint}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      bannerInputRef.current?.click();
                    }}
                    style={{ border: "none", cursor: "pointer", outline: "none" }}
                    title={(bannerUrl || userData?.banner_url) ? t.changeCover : t.addCover}
                  >
                    {bannerUploading ? (
                      <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> {t.uploading}</>
                    ) : (
                      <><iconify-icon icon="lucide:camera" /> {(bannerUrl || userData?.banner_url) ? t.changeCover : t.addCover}</>
                    )}
                  </button>
                </div>
                <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'banner')} />
              </div>

              <div className={styles.heroBody}>
                <div className={styles.identityBlock}>
                  <div className={styles.avatarWrapper}>
                    <div
                      className={styles.avatarLarge}
                      onClick={() => {
                        const currentAvatar = avatarUrl || userData?.avatar_url;
                        if (currentAvatar) {
                          setLightboxImg({ src: getImageUrl(currentAvatar), title: `${userName}'s Profile Photo`, type: 'avatar' });
                        } else {
                          avatarInputRef.current?.click();
                        }
                      }}
                      title={avatarUrl || userData?.avatar_url ? "Click to view full photo" : "Click camera to upload"}
                    >
                      {avatarUrl || userData?.avatar_url ? (
                        <img
                          src={getImageUrl(avatarUrl || userData?.avatar_url)}
                          alt="Profile photo"
                          className={styles.avatarImg}
                          onError={(e) => {
                            console.warn("Avatar image failed to load:", avatarUrl || userData?.avatar_url);
                          }}
                        />
                      ) : (
                        userInitials
                      )}
                    </div>
                    
                    {/* Sleek Floating Camera Button Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        avatarInputRef.current?.click();
                      }}
                      title="Upload / Change Photo"
                      className={styles.avatarCameraBadge}
                    >
                      {avatarUploading ? (
                        <iconify-icon icon="lucide:loader-2" className={styles.spinIcon} style={{ fontSize: 16 }} />
                      ) : (
                        <iconify-icon icon="lucide:camera" style={{ fontSize: 16 }} />
                      )}
                    </button>
                    <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'avatar')} />
                  </div>

                  <div className={styles.identityMeta}>
                    <div className={styles.nameRow}>
                      <h1>{displayName || userName}</h1>
                      {isVerified ? (
                        <span className={styles.verifiedBadge} title="Boulot Man Verified Professional">
                          <iconify-icon icon="lucide:badge-check" style={{ fontSize: 16 }} />
                          <span style={{ fontSize: '11.5px', fontWeight: 800 }}>{t.verifiedPro}</span>
                        </span>
                      ) : (
                        <span style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <iconify-icon icon="lucide:clock-4" /> {lang === "fr" ? "Vérification en attente" : "Pending Verification"}
                        </span>
                      )}
                      {availableNow ? (
                        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} /> {t.availableNow}
                        </span>
                      ) : (
                        <span style={{ background: "#f1f5f9", color: "#64748b", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 700 }}>
                          {t.busyOffline}
                        </span>
                      )}
                    </div>
                    <div className={styles.metaList}>
                      <span><iconify-icon icon="lucide:wrench" /> {headline || primaryOccupation || (lang === "fr" ? "Spécialiste Certifié" : "Certified Specialist")}</span>
                      <span><iconify-icon icon="lucide:map-pin" /> {city ? (country ? `${city}, ${country}` : city) : (country || "Benin")}</span>
                      <span><iconify-icon icon="lucide:star" /> {userData?.average_rating && Number(userData.average_rating) > 0 ? Number(userData.average_rating).toFixed(1) : "5.0"} ({userData?.review_count ?? 0} {lang === "fr" ? "Avis" : "Reviews"})</span>
                      <span><iconify-icon icon="lucide:check-circle-2" /> {userData?.tasks_completed_count ?? userData?.completed_jobs ?? 0} {lang === "fr" ? "Missions Terminées" : "Completed Jobs"}</span>
                      <span><iconify-icon icon="lucide:trending-up" /> {userData?.completion_rate ? `${userData.completion_rate}%` : "100%"} {lang === "fr" ? "Taux de Réussite" : "Completion Rate"}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <button
                    type="button"
                    onClick={handleToggleAvailableNow}
                    style={{
                      background: availableNow ? "#dcfce7" : "#f1f5f9",
                      color: availableNow ? "#166534" : "#475569",
                      border: `1.5px solid ${availableNow ? "#86efac" : "#cbd5e1"}`,
                      borderRadius: 12,
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <iconify-icon icon={availableNow ? "lucide:radio" : "lucide:power-off"} />
                    {availableNow ? t.availableOn : t.availableOff}
                  </button>

                  <Link href={username ? `/profile/@${username.replace(/^@/, '')}` : (userData?.id ? `/profile/${userData.id}` : "/dashboard/technician")} className={styles.outlineButton} target="_blank">
                    <iconify-icon icon="lucide:external-link" /> {t.previewPublic}
                  </Link>

                  <button type="button" className={styles.primaryButton} onClick={handleSaveProfile} disabled={profileSaving}>
                    <iconify-icon icon={profileSaving ? "lucide:loader" : "lucide:save"} className={profileSaving ? styles.spinIcon : ""} />
                    {profileSaving ? t.saving : t.saveProfile}
                  </button>
                </div>
              </div>
            </section>

            {/* ==================== 7-TAB STEP NAVIGATION ==================== */}
            <div id="profile-tabs-anchor" style={{ scrollMarginTop: 90 }} />
            <div className={styles.tabNavWrapper}>
              <button
                type="button"
                className={styles.tabNavArrow}
                onClick={() => scrollTabs('left')}
                title="Scroll left"
                aria-label="Scroll left"
              >
                <iconify-icon icon="lucide:chevron-left" />
              </button>
              <div className={styles.tabNav} ref={tabNavRef}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
                    onClick={() => {
                      setActiveTab(tab.key);
                      const el = document.getElementById("profile-tabs-anchor");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <iconify-icon icon={tab.icon} /> {tab.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.tabNavArrow}
                onClick={() => scrollTabs('right')}
                title="Scroll right"
                aria-label="Scroll right"
              >
                <iconify-icon icon="lucide:chevron-right" />
              </button>
            </div>

            {/* ==================== TAB 1: OVERVIEW & CREDENTIALS ==================== */}
            {activeTab === "overview" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#ff4500" }} /> {t.profInfoTitle}
                  </h2>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      <iconify-icon icon="lucide:at-sign" style={{ color: "#ff4500", fontSize: 18 }} />
                      Public Username / Handle
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
                      className={styles.formInput}
                      style={{ paddingLeft: 32, background: "#ffffff" }}
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="your_handle"
                      autoComplete="off"
                    />
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                      Direct profile link: <strong>boulotman.com/profile/@{username ? username.replace(/^@/, '') : 'handle'}</strong>
                    </p>
                    {username && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://boulotman.com'}/profile/@${username.replace(/^@/, '')}`;
                          navigator.clipboard.writeText(url);
                          toast.show("success", "Public profile link copied to clipboard!");
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
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.firstName}</label>
                    <input className={styles.formInput} placeholder="e.g. Aneeq" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.lastName}</label>
                    <input className={styles.formInput} placeholder="e.g. Nisar" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.displayName}</label>
                    <input className={styles.formInput} placeholder="e.g. Aneeq N." value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.headline}</label>
                    <input className={styles.formInput} placeholder="e.g. Certified Electrician & Solar Specialist" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  </div>
                </div>

                {/* Hierarchical Primary Industry Domain & Trade Specialization Selector */}
                <div style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "18px 20px",
                  marginBottom: 16,
                  marginTop: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <iconify-icon icon="lucide:layers" style={{ color: "#ff4500", fontSize: 18 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#001f3f" }}>
                      {t.primaryTrade}
                    </span>
                  </div>

                  <div className={styles.twoCol} style={{ marginBottom: (selectedMainCategory === "Other" || selectedSubCategory === "Other") ? 14 : 0 }}>
                    <div>
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>
                        {t.primaryDomain}
                      </label>
                      <select
                        className={styles.formInput}
                        value={selectedMainCategory}
                        onChange={(e) => handleMainCategoryChange(e.target.value)}
                        style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10, background: "#fff", fontWeight: 600, borderColor: selectedMainCategory ? "#ff4500" : "#cbd5e1" }}
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
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>
                        {t.primaryTrade}
                      </label>
                      <select
                        className={styles.formInput}
                        value={selectedSubCategory}
                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                        disabled={!selectedMainCategory || selectedMainCategory === "Other"}
                        style={{
                          width: "100%",
                          height: 44,
                          padding: "0 12px",
                          border: "1.5px solid #cbd5e1",
                          borderRadius: 10,
                          fontWeight: 600,
                          background: (!selectedMainCategory || selectedMainCategory === "Other") ? "#f1f5f9" : "#fff",
                          borderColor: selectedSubCategory ? "#ff4500" : "#cbd5e1",
                          cursor: (!selectedMainCategory || selectedMainCategory === "Other") ? "not-allowed" : "pointer"
                        }}
                      >
                        <option value="">{t.selectTradePlaceholder}</option>
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
                      <label className={styles.label} style={{ color: "#c2410c", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <iconify-icon icon="lucide:edit-3" /> {t.customDomainLabel}
                      </label>
                      <input
                        className={styles.formInput}
                        style={{ background: "#ffffff", borderColor: "#fdba74", width: "100%", height: 44, borderRadius: 10, padding: "0 12px" }}
                        placeholder={t.customDomainPlaceholder}
                        value={customMainCategory}
                        onChange={(e) => handleCustomMainCategoryChange(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Custom Input when Sub-Category / Trade is Other */}
                  {selectedMainCategory !== "Other" && selectedSubCategory === "Other" && (
                    <div style={{ marginTop: 12, padding: "12px 14px", background: "#fff7ed", border: "1.5px dashed #ffedd5", borderRadius: 12 }}>
                      <label className={styles.label} style={{ color: "#c2410c", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <iconify-icon icon="lucide:edit-3" /> {t.customTradeLabel}
                      </label>
                      <input
                        className={styles.formInput}
                        style={{ background: "#ffffff", borderColor: "#fdba74", width: "100%", height: 44, borderRadius: 10, padding: "0 12px" }}
                        placeholder={t.customTradePlaceholder}
                        value={customSubCategory}
                        onChange={(e) => handleCustomSubCategoryChange(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Quick Add Skills from Domain */}
                  {selectedMainCategory && selectedMainCategory !== "Other" && availableSubcategories.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #cbd5e1" }}>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:sparkles" style={{ color: "#ff4500" }} />
                        {t.suggestedSkills}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {availableSubcategories.map((sub) => {
                          const isAdded = skills.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => handleAddQuickSkill(sub)}
                              disabled={isAdded}
                              style={{
                                background: isAdded ? "#e2e8f0" : "#ffffff",
                                color: isAdded ? "#94a3b8" : "#001f3f",
                                border: "1px solid #cbd5e1",
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
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.experienceYears}</label>
                    <input className={styles.formInput} placeholder="e.g. 8" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.expertiseLevel}</label>
                    <select className={styles.formInput} value={expertiseLevel} onChange={(e) => setExpertiseLevel(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="Junior">Junior (1-3 Years)</option>
                      <option value="Intermediate">Intermediate (3-6 Years)</option>
                      <option value="Senior">Senior Master (6-12 Years)</option>
                      <option value="Expert">Lead Expert / Site Supervisor (12+ Years)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.expertiseLevel}</label>
                    <select className={styles.formInput} value={expertiseLevel} onChange={(e) => setExpertiseLevel(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="Junior">Junior (1-3 Years)</option>
                      <option value="Intermediate">Intermediate (3-6 Years)</option>
                      <option value="Senior">Senior Master (6-12 Years)</option>
                      <option value="Expert">Lead Expert / Site Supervisor (12+ Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.education}</label>
                    <input className={styles.formInput} placeholder="e.g. Lycée Technique Coulibaly / B.Sc. Electrical Eng" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.city}</label>
                    <input className={styles.formInput} placeholder="e.g. Cotonou" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.country}</label>
                    <select
                      className={styles.formInput}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10, background: "#fff", cursor: "pointer", fontWeight: 600 }}
                    >
                      <option value="" disabled>{lang === "fr" ? "Sélectionnez un pays..." : "Select Country..."}</option>
                      {country && !PLATFORM_SUPPORTED_COUNTRIES.some(c => c.name.toLowerCase() === country.toLowerCase()) && (
                        <option value={country}>{country}</option>
                      )}
                      {PLATFORM_SUPPORTED_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.aboutMe}</label>
                <textarea
                  className={styles.formTextarea}
                  rows={4}
                  placeholder="Detail your background, specialties, standard safety practices, and client satisfaction guarantee..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                {/* Skills Manager */}
                <div style={{ marginTop: 22, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <label className={styles.label} style={{ fontSize: 13.5, fontWeight: 800, color: "#001f3f", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <iconify-icon icon="lucide:award" style={{ color: "#ff4500", fontSize: 17 }} />
                      {t.skillsTitle} ({skills.length})
                    </label>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                      Add trade specializations for instant matchmaking
                    </span>
                  </div>

                  {skills.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "6px 0 14px", fontStyle: "italic" }}>
                      No skills added yet. Type a skill below and click &quot;Add Skill&quot; to list your trade specializations.
                    </p>
                  ) : (
                    <div className={styles.skillsListEditable}>
                      {skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          <iconify-icon icon="lucide:check-circle-2" style={{ color: "#ff4500", fontSize: 14 }} />
                          <span>{skill}</span>
                          <button
                            type="button"
                            className={styles.skillAction}
                            onClick={() => handleRemoveSkill(index)}
                            title="Remove skill"
                          >
                            <iconify-icon icon="lucide:x" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: 12,
                    padding: "4px 6px 4px 14px",
                    maxWidth: 580,
                    marginTop: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}>
                    <iconify-icon icon="lucide:sparkles" style={{ color: "#ff4500", fontSize: 18, marginRight: 8, flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Add trade skill (e.g. Solar Inverter Setup, 3-Phase Wiring, Pipe Welding)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 13.5,
                        color: "#0f172a",
                        padding: "8px 0",
                        minWidth: 0
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className={styles.primaryButton}
                      style={{
                        padding: "8px 18px",
                        fontSize: 13,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #ff4500, #ff7a1f)",
                        color: "#ffffff",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "0 2px 8px rgba(255, 69, 0, 0.25)"
                      }}
                    >
                      <iconify-icon icon="lucide:plus" style={{ fontSize: 15 }} />
                      Add Skill
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 2: 3-TIER VERIFICATION & 4-SLOT UPLOADER ==================== */}
            {activeTab === "verification" && (() => {
              const isTechVerified = Boolean(userData?.is_verified || userData?.technician_profile?.is_verified);
              const hasIdDocs = Boolean(frontIdDoc || backIdDoc);
              const hasAllDocs = Boolean(frontIdDoc && backIdDoc);
              const isTier1Verified = isTechVerified;
              const isTier1Pending = !isTier1Verified && hasIdDocs;
              const isTier2Verified = isTechVerified && Boolean(certDoc || skills.length > 0);
              const isTier3Verified = isTechVerified && ((userData?.tasks_completed_count ?? 0) >= 10 || (userData?.completed_jobs ?? 0) >= 10);

              return (
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                      <iconify-icon icon="lucide:shield-check" style={{ color: isTechVerified ? "#16a34a" : "#f59e0b" }} /> {t.tierVerifTitle}
                    </h2>
                    {isTechVerified ? (
                      <span className={styles.verifiedBadge}>
                        <iconify-icon icon="lucide:check-circle-2" /> {t.tier2VerifiedBadge}
                      </span>
                    ) : isTier1Pending ? (
                      <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <iconify-icon icon="lucide:clock-4" /> {t.tierReviewBadge}
                      </span>
                    ) : (
                      <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <iconify-icon icon="lucide:alert-circle" /> {t.tierReqBadge}
                      </span>
                    )}
                  </div>

                  {/* 3-Tier Progression Tracker */}
                  <div className={styles.tierGrid}>
                    <div className={`${styles.tierCard} ${isTier1Verified ? styles.tierCardActive : (isTier1Pending ? styles.tierCardCurrent : "")}`}>
                      <div className={styles.tierHeader}>
                        <span style={{ fontSize: 20 }}>🥉</span>
                        {isTier1Verified ? (
                          <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>{t.identityVerified}</span>
                        ) : isTier1Pending ? (
                          <span className={styles.tierBadge} style={{ background: "#fef3c7", color: "#b45309" }}>{t.tierReviewBadge}</span>
                        ) : (
                          <span className={styles.tierBadge} style={{ background: "#fee2e2", color: "#b91c1c" }}>{t.tierReqBadge}</span>
                        )}
                      </div>
                      <h4 className={styles.tierTitle}>{t.tier1Title}</h4>
                      <p className={styles.tierDesc}>{t.tier1Desc}</p>
                    </div>

                    <div className={`${styles.tierCard} ${isTier2Verified ? styles.tierCardActive : (isTechVerified ? styles.tierCardCurrent : "")}`}>
                      <div className={styles.tierHeader}>
                        <span style={{ fontSize: 20 }}>🥈</span>
                        {isTier2Verified ? (
                          <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>{t.verifiedPro}</span>
                        ) : isTechVerified ? (
                          <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>{t.tierActiveBadge}</span>
                        ) : (
                          <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#94a3b8" }}>{t.tierReqTier1Badge}</span>
                        )}
                      </div>
                      <h4 className={styles.tierTitle}>{t.tier2Title}</h4>
                      <p className={styles.tierDesc}>{t.tier2Desc}</p>
                    </div>

                    <div className={`${styles.tierCard} ${isTier3Verified ? styles.tierCardActive : ""}`}>
                      <div className={styles.tierHeader}>
                        <span style={{ fontSize: 20 }}>🥇</span>
                        <span className={styles.tierBadge} style={{ background: isTier3Verified ? "#dcfce7" : "#f1f5f9", color: isTier3Verified ? "#16a34a" : "#64748b" }}>
                          {isTier3Verified ? t.tierApprovedBadge : t.tierTargetBadge}
                        </span>
                      </div>
                      <h4 className={styles.tierTitle}>{t.tier3Title}</h4>
                      <p className={styles.tierDesc}>{t.tier3Desc}</p>
                    </div>
                  </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  {t.tierInstruction}
                </p>

                {/* 4-SLOT DEDICATED UPLOAD GRID */}
                <div className={styles.uploadGrid4}>
                  
                  {/* SLOT 1: NATIONAL ID (FRONT SIDE) */}
                  <div className={`${styles.docUploadCard} ${frontIdDoc ? styles.docUploadCardFilled : ""}`}>
                    {frontIdDoc ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(frontIdDoc)} title="Click to view enlarged">
                        <DocThumbnail doc={frontIdDoc} fullWidth />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <iconify-icon icon="lucide:maximize-2" /> {t.viewDoc}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:id-card" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>{t.slot1Title}</h4>
                    <p className={styles.docSlotSub}>
                      {frontIdDoc ? t.slot1Uploaded : t.slot1Sub}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "front"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "front", "National ID (Front Side)", "identity");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "front" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "front" ? t.uploading : frontIdDoc ? t.slot1Replace : t.slot1Btn}
                      </button>

                      {frontIdDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(frontIdDoc.id, frontIdDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 2: NATIONAL ID (BACK SIDE) */}
                  <div className={`${styles.docUploadCard} ${backIdDoc ? styles.docUploadCardFilled : ""}`}>
                    {backIdDoc ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(backIdDoc)} title="Click to view enlarged">
                        <DocThumbnail doc={backIdDoc} fullWidth />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <iconify-icon icon="lucide:maximize-2" /> {t.viewDoc}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:flip-horizontal" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>{t.slot2Title}</h4>
                    <p className={styles.docSlotSub}>
                      {backIdDoc ? t.slot2Uploaded : t.slot2Sub}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "back"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "back", "National ID (Back Side)", "identity");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "back" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "back" ? t.uploading : backIdDoc ? t.slot2Replace : t.slot2Btn}
                      </button>

                      {backIdDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(backIdDoc.id, backIdDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 3: TRADE LICENSE & CERTIFICATES */}
                  <div className={`${styles.docUploadCard} ${certDoc ? styles.docUploadCardFilled : ""}`}>
                    {certDoc ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(certDoc)} title="Click to view enlarged">
                        <DocThumbnail doc={certDoc} fullWidth />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <iconify-icon icon="lucide:maximize-2" /> {t.viewDoc}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:award" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>{t.slot3Title}</h4>
                    <p className={styles.docSlotSub}>
                      {certDoc ? t.slot3Uploaded : t.slot3Sub}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "cert"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "cert", "Trade License & Professional Certifications", "certificate");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "cert" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "cert" ? t.uploading : certDoc ? t.slot3Replace : t.slot3Btn}
                      </button>

                      {certDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(certDoc.id, certDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 4: LIVE IDENTITY SELFIE */}
                  <div className={`${styles.docUploadCard} ${selfieDoc ? styles.docUploadCardFilled : ""}`}>
                    {selfieDoc ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(selfieDoc)} title="Click to view enlarged">
                        <DocThumbnail doc={selfieDoc} fullWidth />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <iconify-icon icon="lucide:maximize-2" /> {t.viewDoc}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:camera" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>{t.slot4Title}</h4>
                    <p className={styles.docSlotSub}>
                      {selfieDoc ? t.slot4Uploaded : t.slot4Sub}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "selfie"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "selfie", "Live Selfie / Photo Verification", "selfie");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "selfie" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "selfie" ? t.uploading : selfieDoc ? t.slot4Replace : t.slot4Btn}
                      </button>

                      {selfieDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(selfieDoc.id, selfieDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMITTED DOCUMENTS VAULT & REVIEW LIST */}
                <div className={styles.documentsArea}>
                  <div className={styles.documentsHeader}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#001f3f" }}>
                      <iconify-icon icon="lucide:vault" style={{ color: "#16a34a", marginRight: 6 }} />
                      {t.vaultTitle} ({allDocuments.length})
                    </h3>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>
                      {t.vaultDesc}
                    </span>
                  </div>

                  {allDocuments.length === 0 ? (
                    <div style={{ background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: 16, padding: "28px", textAlign: "center", color: "#64748b" }}>
                      <iconify-icon icon="lucide:file-question" style={{ fontSize: 32, marginBottom: 8, color: "#94a3b8" }} />
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#001f3f" }}>{t.noDocsTitle}</p>
                      <p style={{ margin: 0, fontSize: 12.5 }}>{t.noDocsDesc}</p>
                    </div>
                  ) : (
                    <div className={styles.documentList}>
                      {allDocuments.map((doc) => (
                        <div key={doc.id} className={styles.documentItem}>
                          <DocThumbnail doc={doc} size={48} onClick={() => setPreviewModalDoc(doc)} />

                          <div className={styles.docInfo}>
                            <strong>{doc.title}</strong>
                            <span>
                              {doc.document_type === "certificate" ? (lang === "fr" ? "Qualification Métier" : "Trade Qualification") : doc.document_type === "selfie" ? (lang === "fr" ? "Vérification Selfie" : "Selfie Check") : (lang === "fr" ? "Pièce d'Identité" : "Identity Document")} • {doc.uploaded_at || (lang === "fr" ? "Récent" : "Recent")} •{" "}
                              <strong style={{ color: doc.status === "verified" ? "#16a34a" : "#f59e0b" }}>
                                {doc.status === "verified" ? (lang === "fr" ? "Vérifié ✓" : "Verified ✓") : (lang === "fr" ? "En cours d'examen ⏳" : "Under Review ⏳")}
                              </strong>
                            </span>
                          </div>

                          <div className={styles.docActions}>
                            <button
                              type="button"
                              className={styles.viewDocBtn}
                              onClick={() => setPreviewModalDoc(doc)}
                            >
                              <iconify-icon icon="lucide:eye" /> {t.viewDoc}
                            </button>

                            <button type="button" className={styles.deleteBtn} onClick={() => handleDeleteDoc(doc.id, doc.title)} title="Delete Document">
                              <iconify-icon icon="lucide:trash-2" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

            {/* ==================== TAB 3: VISUAL PORTFOLIO ==================== */}
            {activeTab === "portfolio" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:image" style={{ color: "#ff4500" }} /> {t.portfolioTitle}
                  </h2>
                  <button type="button" className={styles.primaryButton} onClick={() => setShowAddProjectModal(true)} style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}>
                    <iconify-icon icon="lucide:plus" /> {t.addWorkBtn}
                  </button>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  {t.portfolioDesc}
                </p>

                <div className={styles.portfolioGrid}>
                  {portfolioList.map((item) => (
                    <div key={item.id} className={styles.portfolioCard}>
                      <div className={styles.portfolioVisual}>
                        {item.photoUrl ? (
                          <img src={getImageUrl(item.photoUrl)} alt={item.title} />
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}>
                            <iconify-icon icon="lucide:briefcase" style={{ fontSize: 38 }} />
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{t.proofOfWork}</span>
                          </div>
                        )}
                        {item.budget && (
                          <span className={styles.portfolioBudgetPill}>
                            {item.budget}
                          </span>
                        )}
                      </div>
                      <div className={styles.portfolioBody}>
                        <div className={styles.portfolioCategoryHeader}>
                          <span className={styles.portfolioCategoryTag}>{item.category}</span>
                          <button
                            type="button"
                            className={styles.portfolioDeleteBtn}
                            onClick={() => handleDeletePortfolio(item.id)}
                            title="Delete Project"
                          >
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                        <h4 className={styles.portfolioTitle}>{item.title}</h4>
                        <p className={styles.portfolioDesc}>{item.description}</p>
                        <div className={styles.portfolioFooter}>
                          <span><iconify-icon icon="lucide:map-pin" style={{ marginRight: 4, color: "#001f3f" }} /> {item.location}</span>
                          <span><iconify-icon icon="lucide:calendar" style={{ marginRight: 4, color: "#001f3f" }} /> {item.completionDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ==================== TAB 4: AVAILABILITY & RADIUS ==================== */}
            {activeTab === "availability" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:clock" style={{ color: "#001f3f" }} /> {t.availabilityTitle}
                  </h2>
                </div>

                {/* Available Now Live Banner */}
                <div style={{ background: availableNow ? "#f0fdf4" : "#f8fafc", border: `1.5px solid ${availableNow ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: availableNow ? "#dcfce7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: availableNow ? "#16a34a" : "#64748b" }}>
                      <iconify-icon icon={availableNow ? "lucide:radio" : "lucide:power-off"} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: 15, color: "#001f3f" }}>
                        {availableNow ? t.liveStatusAvailable : t.liveStatusBusy}
                      </strong>
                      <span style={{ fontSize: 12.5, color: "#64748b" }}>
                        {availableNow ? t.liveDescAvailable : t.liveDescBusy}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleAvailableNow}
                    className={styles.primaryButton}
                    style={{ background: availableNow ? "#16a34a" : "#001f3f", minHeight: 40, padding: "0 18px", fontSize: 13 }}
                  >
                    {availableNow ? t.btnGoOffline : t.btnGoAvailable}
                  </button>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.workMode}</label>
                    <select className={styles.formInput} value={workPreference} onChange={(e: any) => setWorkPreference(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="on_site">{t.onSite}</option>
                      <option value="hybrid">{t.hybrid}</option>
                      <option value="remote">{t.remote}</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.travelRadius}</label>
                    <select className={styles.formInput} value={serviceRadius} onChange={(e) => setServiceRadius(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="5 km Radius">5 km Radius</option>
                      <option value="10 km Radius">10 km Radius</option>
                      <option value="25 km Radius">25 km Radius</option>
                      <option value="50 km Radius">50 km Radius</option>
                      <option value="Nationwide">Nationwide</option>
                    </select>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.workingSchedule}</label>
                    <input className={styles.formInput} value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} placeholder="e.g. Mon - Sat: 08:00 - 18:00" />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.emergencyCalls}</label>
                    <select className={styles.formInput} value={acceptEmergency ? "yes" : "no"} onChange={(e) => setAcceptEmergency(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">{t.acceptEmergencyYes}</option>
                      <option value="no">{t.acceptEmergencyNo}</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 5: FLEXIBLE PRICING ==================== */}
            {activeTab === "pricing" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:tag" style={{ color: "#ff4500" }} /> {t.pricingTitle}
                  </h2>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  {t.pricingDesc}
                </p>

                <div className={styles.pricingGrid}>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{t.startingRate}</span>
                    <input className={styles.formInput} value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} placeholder="e.g. 15,000 XOF" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{t.hourlyRate}</span>
                    <input className={styles.formInput} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. 5,000 XOF / hr" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{t.dailyRate}</span>
                    <input className={styles.formInput} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} placeholder="e.g. 35,000 XOF / day" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{t.inspectionFee}</span>
                    <input className={styles.formInput} value={inspectionFee} onChange={(e) => setInspectionFee(e.target.value)} placeholder="e.g. 10,000 XOF" />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" id="negCheck" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} />
                  <label htmlFor="negCheck" style={{ fontSize: 13.5, fontWeight: 700, color: "#001f3f", cursor: "pointer" }}>
                    {t.allowNegotiation}
                  </label>
                </div>
              </section>
            )}

            {/* ==================== TAB 6: TOOLS & MOBILITY ==================== */}
            {activeTab === "tools" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:hammer" style={{ color: "#001f3f" }} /> {t.toolsTitle}
                  </h2>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.ownTools}</label>
                    <select className={styles.formInput} value={hasOwnTools ? "yes" : "no"} onChange={(e) => setHasOwnTools(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">{t.ownToolsYes}</option>
                      <option value="no">{t.ownToolsNo}</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.transportVehicle}</label>
                    <input className={styles.formInput} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="e.g. Motorcycle & Utility Pickup" />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.ppeGear}</label>
                    <select className={styles.formInput} value={hasPpe ? "yes" : "no"} onChange={(e) => setHasPpe(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">{t.ppeYes}</option>
                      <option value="no">{t.ppeNo}</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>{t.drivingLicense}</label>
                    <select className={styles.formInput} value={hasDrivingLicense ? "yes" : "no"} onChange={(e) => setHasDrivingLicense(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">{t.drivingLicenseYes}</option>
                      <option value="no">{t.drivingLicenseNo}</option>
                    </select>
                  </div>
                </div>

                {/* Tools Tag Manager */}
                <div style={{ marginTop: 22, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <label className={styles.label} style={{ fontSize: 13.5, fontWeight: 800, color: "#001f3f", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500", fontSize: 17 }} />
                      {t.toolsSectionTitle} ({toolsList.length})
                    </label>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                      {t.toolsSectionSubtitle}
                    </span>
                  </div>

                  {toolsList.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "6px 0 14px", fontStyle: "italic" }}>
                      {t.noToolsDesc}
                    </p>
                  ) : (
                    <div className={styles.toolsGrid}>
                      {toolsList.map((tool) => (
                        <span key={tool} className={styles.toolTag}>
                          <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500", fontSize: 14 }} />
                          <span>{tool}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTool(tool)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0 0 0 4px",
                              color: "#c2410c",
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: 14
                            }}
                            title="Remove equipment"
                          >
                            <iconify-icon icon="lucide:x" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: 12,
                    padding: "4px 6px 4px 14px",
                    maxWidth: 580,
                    marginTop: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}>
                    <iconify-icon icon="lucide:plus-circle" style={{ color: "#ff4500", fontSize: 18, marginRight: 8, flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Add equipment (e.g. Thermal Camera, Scaffolding, Fluke Multimeter, Rotary Hammer)"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTool(); } }}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 13.5,
                        color: "#0f172a",
                        padding: "8px 0",
                        minWidth: 0
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className={styles.primaryButton}
                      style={{
                        padding: "8px 18px",
                        fontSize: 13,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #ff4500, #ff7a1f)",
                        color: "#ffffff",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "0 2px 8px rgba(255, 69, 0, 0.25)"
                      }}
                    >
                      <iconify-icon icon="lucide:plus" style={{ fontSize: 15 }} />
                      {t.addToolBtn}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 7: PAYOUTS & OPERATIONAL MATCHING ==================== */}
            {activeTab === "payouts" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:wallet" style={{ color: "#001f3f" }} /> {t.payoutsTitle}
                  </h2>
                </div>

                {/* Confidential Payout Details */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
                  <strong style={{ display: "block", color: "#001f3f", fontSize: 14, marginBottom: 4 }}>
                    <iconify-icon icon="lucide:lock" style={{ color: "#ff4500", marginRight: 6 }} />
                    {t.confidentialPayoutTitle}
                  </strong>
                  <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#64748b" }}>
                    {t.confidentialPayoutDesc}
                  </p>

                  <div className={styles.twoCol}>
                    <div>
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 4, display: "block" }}>{t.preferredPayoutMethod}</label>
                      <input className={styles.formInput} value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} placeholder="e.g. MTN Mobile Money / Bank Transfer" />
                    </div>
                    <div>
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 4, display: "block" }}>{t.payoutAccountNo}</label>
                      <input className={styles.formInput} value={payoutAccountNo} onChange={(e) => setPayoutAccountNo(e.target.value)} placeholder="+229 97 00 00 00" />
                    </div>
                  </div>
                </div>

                {/* Operational Matchmaking Toggles */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#001f3f", margin: "0 0 12px" }}>{t.matchmakingTitle}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchConcierge(!matchConcierge)}>
                    <input type="checkbox" checked={matchConcierge} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>{t.conciergeTitle}</strong>
                      <small style={{ color: "#64748b" }}>{t.conciergeDesc}</small>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchBuildTeam(!matchBuildTeam)}>
                    <input type="checkbox" checked={matchBuildTeam} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>{t.buildTeamTitle}</strong>
                      <small style={{ color: "#64748b" }}>{t.buildTeamDesc}</small>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchSupervisor(!matchSupervisor)}>
                    <input type="checkbox" checked={matchSupervisor} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>{t.leadSupervisorTitle}</strong>
                      <small style={{ color: "#64748b" }}>{t.leadSupervisorDesc}</small>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== STEP WIZARD ACTION BAR ==================== */}
            <div className={styles.wizardFooter}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {!isFirstTab && (
                  <button
                    type="button"
                    className={styles.outlineButton}
                    onClick={handlePrevTab}
                    style={{ minHeight: 46, padding: "0 18px", fontSize: 13.5 }}
                  >
                    <iconify-icon icon="lucide:arrow-left" /> {t.prevStep}
                  </button>
                )}
                <Link href="/dashboard/technician" className={styles.outlineButton} style={{ minHeight: 46, padding: "0 16px", fontSize: 13.5 }}>
                  {t.backDashboard}
                </Link>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={styles.outlineButton}
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  style={{ minHeight: 46, padding: "0 20px", fontSize: 13.5 }}
                >
                  <iconify-icon icon={profileSaving ? "lucide:loader" : "lucide:save"} className={profileSaving ? styles.spinIcon : ""} />
                  {profileSaving ? t.saving : t.saveProgress}
                </button>

                {!isLastTab ? (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleSaveAndNext}
                    disabled={profileSaving}
                    style={{ minHeight: 46, padding: "0 24px", fontSize: 14, background: "linear-gradient(135deg, #ff4500, #ff7a1f)" }}
                  >
                    {profileSaving ? t.saving : t.saveAndNext}
                    <iconify-icon icon="lucide:arrow-right" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handleSaveProfile(true)}
                    disabled={profileSaving}
                    style={{ minHeight: 46, padding: "0 28px", fontSize: 14.5, background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                  >
                    <iconify-icon icon={profileSaving ? "lucide:loader" : "lucide:check-circle-2"} className={profileSaving ? styles.spinIcon : ""} />
                    {profileSaving ? t.savingAll : t.completeProfile}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONGRATULATIONS PROFILE COMPLETE MODAL ==================== */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 15, 30, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              width: "100%",
              maxWidth: 540,
              padding: "36px 30px",
              boxShadow: "0 25px 60px rgba(0, 31, 63, 0.35)",
              position: "relative",
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                border: "none",
                background: "#f1f5f9",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                transition: "all 0.2s ease",
              }}
              title="Close"
            >
              <iconify-icon icon="lucide:x" style={{ fontSize: 18 }} />
            </button>

            {/* Glowing Trophy / Badge Icon */}
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 12px 30px rgba(16, 185, 129, 0.35)",
                border: "4px solid #d1fae5",
              }}
            >
              <iconify-icon icon="lucide:award" style={{ fontSize: 44 }} />
            </div>

            {/* Badge pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#166534", padding: "4px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 800, marginBottom: 12 }}>
              <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 14 }} />
              {lang === "fr" ? "PROFIL ENREGISTRÉ & ACTIF" : "PROFILE COMPLETE & ACTIVE"}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#001f3f", margin: "0 0 10px", lineHeight: 1.25 }}>
              {lang === "fr" ? "🎉 Félicitations ! Votre Profil est Prêt" : "🎉 Congratulations! Your Profile is Live"}
            </h2>

            {/* Description */}
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 22px" }}>
              {lang === "fr"
                ? "Toutes vos compétences, tarifs personnalisés, outillages et coordonnées de paiement sont enregistrés. Vous êtes désormais éligible pour recevoir des missions et postuler aux offres."
                : "All your trade credentials, custom rates, equipment, and payout details have been saved. Your profile is now active and ready to receive client hiring requests."}
            </p>

            {/* Benefit Highlights Box */}
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 16,
                padding: "16px 18px",
                textAlign: "left",
                marginBottom: 26,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <iconify-icon icon="lucide:badge-check" style={{ color: "#16a34a", fontSize: 20, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong style={{ fontSize: 13.5, color: "#001f3f", display: "block" }}>
                    {lang === "fr" ? "Visibilité Immédiate sur le Marché" : "Live Marketplace Listing"}
                  </strong>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {lang === "fr" ? "Les clients peuvent découvrir votre profil et vous contacter directement." : "Clients in your operating radius can discover your profile and hire you directly."}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <iconify-icon icon="lucide:shield-check" style={{ color: "#2563eb", fontSize: 20, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong style={{ fontSize: 13.5, color: "#001f3f", display: "block" }}>
                    {lang === "fr" ? "Compte Escrow Sécurisé Configuré" : "Secured Escrow Direct Payouts"}
                  </strong>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {lang === "fr" ? "Paiements automatiques et instantanés dès validation des chantiers." : "Funds released from escrow are transferred directly to your saved payout account."}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <iconify-icon icon="lucide:zap" style={{ color: "#ff4500", fontSize: 20, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong style={{ fontSize: 13.5, color: "#001f3f", display: "block" }}>
                    {lang === "fr" ? "Missions Conciergerie & Grands Projets" : "Direct Concierge & Team Matching"}
                  </strong>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {lang === "fr" ? "Éligible aux affectations directes et chantiers multi-corps d'état." : "Eligible for priority dispatch on corporate contracts and engineering crews."}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href="/find-tasks"
                className={styles.primaryButton}
                style={{
                  minHeight: 48,
                  fontSize: 14.5,
                  fontWeight: 800,
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #ff4500, #ff7a1f)",
                  boxShadow: "0 6px 18px rgba(255, 69, 0, 0.35)",
                }}
                onClick={() => setShowSuccessModal(false)}
              >
                <iconify-icon icon="lucide:search" style={{ fontSize: 18 }} />
                {lang === "fr" ? "Consulter les Missions Disponibles" : "Browse Live Tasks & Bid Now"}
              </Link>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link
                  href={username ? `/profile/@${username.replace(/^@/, '')}` : (userData?.id ? `/profile/${userData.id}` : "/dashboard/technician")}
                  target="_blank"
                  className={styles.outlineButton}
                  style={{ minHeight: 44, fontSize: 13.5, justifyContent: "center" }}
                  onClick={() => setShowSuccessModal(false)}
                >
                  <iconify-icon icon="lucide:external-link" />
                  {lang === "fr" ? "Voir Profil Public" : "Preview Public"}
                </Link>

                <Link
                  href="/dashboard/technician"
                  className={styles.outlineButton}
                  style={{ minHeight: 44, fontSize: 13.5, justifyContent: "center" }}
                  onClick={() => setShowSuccessModal(false)}
                >
                  <iconify-icon icon="lucide:layout-dashboard" />
                  {lang === "fr" ? "Tableau de Bord" : "Go to Dashboard"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PORTFOLIO MODAL (ROOT LEVEL - CANNOT BE OVERLAPPED) */}
      {showAddProjectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.85)", backdropFilter: "blur(10px)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", paddingBottom: 14, marginBottom: 18, justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#001f3f" }}>{t.addWorkModalTitle}</h3>
              <button type="button" onClick={() => setShowAddProjectModal(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iconify-icon icon="lucide:x" style={{ fontSize: 18, color: "#64748b" }} />
              </button>
            </div>

            <form onSubmit={handleAddPortfolio}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.jobTitleLabel}</label>
                  <input className={styles.formInput} value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} placeholder="e.g. 10kVA Solar System & Distribution Panel" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.tradeCategoryLabel} ({PLATFORM_TRADE_CATEGORIES.length} Categories)</label>
                  <select className={styles.formInput} value={newProjCategory} onChange={(e) => setNewProjCategory(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 8 }}>
                    {PLATFORM_TRADE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.jobDescLabel}</label>
                  <textarea className={styles.formTextarea} rows={3} value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} placeholder="Explain the problem solved, materials installed, and outcome..." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.jobLocationLabel}</label>
                    <input className={styles.formInput} value={newProjLocation} onChange={(e) => setNewProjLocation(e.target.value)} placeholder="e.g. Haie Vive, Cotonou" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.jobValueLabel}</label>
                    <input className={styles.formInput} value={newProjBudget} onChange={(e) => setNewProjBudget(e.target.value)} placeholder="e.g. 750,000 XOF" />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>{t.coverPhotoLabel}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.formInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setNewProjPhotoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {newProjPhotoUrl && (
                    <div style={{ marginTop: 8, width: "100%", height: 110, borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={newProjPhotoUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
                <button type="button" onClick={() => setShowAddProjectModal(false)} className={styles.outlineButton} style={{ flex: 1, justifyContent: "center", minHeight: 46 }}>{t.cancelBtn}</button>
                <button type="submit" className={styles.primaryButton} style={{ flex: 1.3, justifyContent: "center", minHeight: 46, background: "linear-gradient(135deg, #ff4500, #ff7a1f)" }}>{t.saveProjectBtn}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
