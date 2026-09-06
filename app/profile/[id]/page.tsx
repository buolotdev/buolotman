"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import OnlineStatusBadge from "@/app/components/OnlineStatusBadge";
import styles from "./profile.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    backToDirectory: "Back to Search & Directory",
    profileNotFound: "Profile Not Found",
    profileNotFoundDesc: "This contractor or specialist profile could not be retrieved or is undergoing review.",
    browseDirectory: "Browse Verified Directory",
    verifiedCorporatePartner: "Verified Corporate Partner",
    certifiedSpecialist: "Certified Specialist",
    requestProjectQuote: "Request Tender / RFQ",
    hireSpecialist: "Hire Specialist",
    directMessage: "Direct Message",
    rccmVerified: "RCCM Verified ✓",
    ifuTaxCompliant: "IFU Tax Clearance ✓",
    insuredBadge: "Insured ✓",
    capabilityVerified: "Capability Verified ✓",
    maxTenderCapacity: "Max Tender Capacity",
    simultaneousSites: "Active Project Sites",
    workforceEngineers: "Workforce & Engineers",
    insuranceCover: "Corporate Insurance",
    clientRating: "Client Rating",
    executedProjects: "Executed Contracts",
    onTimeDelivery: "On-Time Reliability",
    escrowGuaranteed: "Escrow Protection",
    corporateOverview: "Corporate Overview & Operational Capacity",
    noBioProvided: "No corporate biography or overview published yet.",
    specializationsTrades: "Industry Sectors & Trade Capabilities",
    servicesCatalog: "Commercial Services Offered & Catalog",
    noServicesListed: "No commercial services listed yet.",
    portfolioCaseStudies: "Case Studies & Past Completed Contracts",
    noPortfolioListed: "No past project references published yet.",
    keyPersonnel: "Key Technical Personnel & Engineering Leadership",
    noTeamListed: "No key engineering personnel declared yet.",
    corporateComplianceVault: "Corporate Legal Compliance Vault",
    rccmRegVal: "RCCM Commercial Registration",
    ifuTaxVal: "IFU Taxpayer Clearance",
    insuranceVal: "Public Liability Insurance",
    repVal: "Authorized Legal Representative",
    verifiedStatus: "Verified ✓",
    activeStatus: "Active ✓",
    pendingStatus: "Under Review",
    corporateHQ: "Headquarters & Contact Details",
    physicalAddress: "Physical Headquarters Address",
    officialWebsite: "Official Website",
    operatingHours: "Operating / Working Hours",
    languagesSpoken: "Communication Languages",
    needCommercialQuote: "Submit a Commercial Tender / RFQ",
    commercialQuoteSub: "Invite this contractor to submit a milestone-protected proposal on your project.",
    inviteToBid: "Invite to Tender / Bid",
    experience: "Experience",
    reviews: "Reviews",
    delivered: "Delivered",
    onSchedule: "On Schedule",
    guaranteed: "Guaranteed",
    aboutMe: "About Me & Professional Summary",
    tradeSkills: "Trade Skills & Verified Specializations",
    noSkillsListed: "No trade skills or specializations listed yet.",
    visualPortfolio: "Visual Portfolio & Previous Completed Work",
    noVisualPortfolio: "No visual portfolio projects published yet.",
    toolsEquipment: "Verified Equipment, Mobility & Safety Gear",
    noToolsDeclared: "No specialized equipment or tools declared yet.",
    standardPricing: "Standard Rates & Pricing Structure",
    hourlyRate: "Hourly Rate",
    fullDayRate: "Full Day Rate",
    inspectionFee: "Diagnostic Inspection",
    boulotManGuarantee: "Boulot Man Verified Guarantee",
    nationalIdGuarantee: "National ID & Face Match verified against government registry.",
    escrowGuarantee: "100% Escrow Protection — funds released only after you approve the work.",
    satisfactionGuarantee: "Satisfaction Guaranteed with dispute mediation support.",
    professionalCredentials: "Professional Credentials",
    seniorityLevel: "Seniority & Skill Level",
    handsOnExp: "Hands-on Experience",
    educationTraining: "Education & Training",
    operatingArea: "Primary Operating Area",
    dispatchAvailability: "Dispatch Availability",
    availableNow: "🟢 Available for Dispatch Now",
    readyToHire: "Ready to Hire this Specialist?",
    readyToHireSub: "Create a task and invite this specialist directly with full escrow protection.",
    hireProBtn: "Hire Pro & Fund Escrow",
    years: "Years",
    hoursPerDay: "Hours",
  },
  fr: {
    backToDirectory: "Retour à l'Annuaire & Recherche",
    profileNotFound: "Profil Introuvable",
    profileNotFoundDesc: "Ce profil d'entreprise ou de spécialiste n'a pas pu être récupéré ou est en cours d'examen.",
    browseDirectory: "Parcourir l'Annuaire Vérifié",
    verifiedCorporatePartner: "Partenaire Entreprise Vérifié",
    certifiedSpecialist: "Spécialiste Certifié",
    requestProjectQuote: "Demander un Devis / Appel d'Offres",
    hireSpecialist: "Engager le Spécialiste",
    directMessage: "Message Direct",
    rccmVerified: "RCCM Vérifié ✓",
    ifuTaxCompliant: "Attestation IFU ✓",
    insuredBadge: "Assurée ✓",
    capabilityVerified: "Capacité Confirmée ✓",
    maxTenderCapacity: "Capacité Max par Projet",
    simultaneousSites: "Chantiers Simultanés",
    workforceEngineers: "Effectif & Ingénieurs",
    insuranceCover: "Couverture d'Assurance",
    clientRating: "Évaluation Clients",
    executedProjects: "Marchés Réalisés",
    onTimeDelivery: "Fiabilité des Délais",
    escrowGuaranteed: "Garantie Séquestre Escrow",
    corporateOverview: "Présentation de l'Entreprise & Capacité d'Exécution",
    noBioProvided: "Aucune présentation ou historique publié pour le moment.",
    specializationsTrades: "Secteurs d'Activité & Métiers d'Intervention",
    servicesCatalog: "Catalogue des Prestations & Services Proposés",
    noServicesListed: "Aucune prestation répertoriée pour l'instant.",
    portfolioCaseStudies: "Études de Cas & Chantiers Achevé(e)s",
    noPortfolioListed: "Aucune réalisation publiée pour l'instant.",
    keyPersonnel: "Direction Technique & Personnel Clé",
    noTeamListed: "Aucun membre clé répertorié pour l'instant.",
    corporateComplianceVault: "Coffre-fort de Conformité Juridique",
    rccmRegVal: "Immatriculation RCCM",
    ifuTaxVal: "Identifiant Fiscal IFU",
    insuranceVal: "Assurance Responsabilité Civile",
    repVal: "Représentant Légal Agréé",
    verifiedStatus: "Vérifié ✓",
    activeStatus: "Actif ✓",
    pendingStatus: "En cours d'examen",
    corporateHQ: "Siège Social & Coordonnées",
    physicalAddress: "Adresse Physique du Siège",
    officialWebsite: "Site Web Officiel",
    operatingHours: "Horaires d'Ouverture",
    languagesSpoken: "Langues de Communication",
    needCommercialQuote: "Soumettre un Appel d'Offres / Devis",
    commercialQuoteSub: "Invitez cette entreprise à soumettre une proposition chiffrée avec paiements échelonnés sécurisés.",
    inviteToBid: "Inviter à Soumissionner",
    experience: "d'expérience",
    reviews: "Avis",
    delivered: "Livrés",
    onSchedule: "Dans les Délais",
    guaranteed: "Garantie",
    aboutMe: "À Propos & Résumé Professionnel",
    tradeSkills: "Compétences Métier & Qualifications",
    noSkillsListed: "Aucune compétence répertoriée pour l'instant.",
    visualPortfolio: "Portfolio Visuel & Travaux Réalisés",
    noVisualPortfolio: "Aucun projet publié pour l'instant.",
    toolsEquipment: "Équipements & Outillage Déclarés",
    noToolsDeclared: "Aucun outillage spécifique déclaré.",
    standardPricing: "Grille Tarifaire Indicative",
    hourlyRate: "Tarif Horaire",
    fullDayRate: "Tarif Journalier",
    inspectionFee: "Diagnostic / Déplacement",
    boulotManGuarantee: "Garantie Confiance Boulot Man",
    nationalIdGuarantee: "Pièce d'identité et biométrie vérifiées auprès des registres officiels.",
    escrowGuarantee: "Paiement 100% sous séquestre libéré uniquement après validation des travaux.",
    satisfactionGuarantee: "Garantie satisfaction et service de médiation en cas de litige.",
    professionalCredentials: "Références Professionnelles",
    seniorityLevel: "Niveau d'Expertise",
    handsOnExp: "Expérience Terrain",
    educationTraining: "Formation & Diplômes",
    operatingArea: "Zone d'Intervention",
    dispatchAvailability: "Disponibilité",
    availableNow: "🟢 Disponible Immédiatement",
    readyToHire: "Prêt à Engager ce Spécialiste ?",
    readyToHireSub: "Créez une mission et invitez ce professionnel avec garantie séquestre.",
    hireProBtn: "Engager & Sécuriser les Fonds",
    years: "ans",
    hoursPerDay: "heures",
  }
};

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const validId = Number.isFinite(id) ? id : null;

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

  const { data: profile, loading, error } = useFetch<any>(
    async () => {
      if (!validId) return null;

      let baseUser: any = null;

      // 1. Try direct user profile
      try {
        const userRes = await api.getUserProfile(validId);
        if (userRes && (userRes.id || userRes.username || userRes.first_name || userRes.company_name)) {
          baseUser = userRes;
        }
      } catch {}

      // 2. Try direct company endpoint
      try {
        const compRes = await api.getCompanyById(validId);
        if (compRes && compRes.id) {
          baseUser = {
            ...(baseUser || {}),
            ...compRes,
            role: "COMPANY",
            company_name: compRes.company_name || baseUser?.company_name,
            trading_name: compRes.trading_name || compRes.company_name || baseUser?.trading_name,
            company_type: compRes.company_type || baseUser?.company_type,
            year_founded: compRes.year_founded || baseUser?.year_founded,
            industry: compRes.industry || baseUser?.industry,
            subject_title: compRes.subject_title || baseUser?.subject_title,
            about: compRes.about || compRes.description || baseUser?.about || baseUser?.bio,
            website: compRes.website || baseUser?.website,
            headquarters: compRes.headquarters || compRes.city || baseUser?.headquarters,
            employee_count: compRes.employee_count || compRes.company_size || baseUser?.employee_count,
            working_hours: compRes.working_hours || compRes.business_hours || baseUser?.working_hours,
            preferred_language: compRes.preferred_language || baseUser?.preferred_language,
            logo_url: compRes.logo || compRes.logo_url || baseUser?.logo_url,
            banner_url: compRes.banner_url || compRes.cover_image || compRes.cover_url || baseUser?.banner_url,
            is_verified: compRes.is_verified ?? baseUser?.is_verified ?? false,
            average_rating: compRes.average_rating || baseUser?.average_rating,
            review_count: compRes.review_count ?? baseUser?.review_count ?? 0,
            completed_tasks: compRes.completed_tasks ?? baseUser?.completed_tasks ?? 0,
            services: compRes.services || baseUser?.services || [],
            projects: compRes.projects || compRes.portfolio || baseUser?.projects || [],
            team: compRes.team_members || compRes.team || baseUser?.team || [],
          };
        }
      } catch {}

      // 3. Fallback to technician users list
      if (!baseUser) {
        try {
          const techList = await api.listUsers({ limit: "100" });
          const techArray = Array.isArray(techList) ? techList : (techList as any)?.results || [];
          const matchTech = techArray.find(
            (u: any) => u.id === validId || u.user_id === validId
          );
          if (matchTech) {
            baseUser = matchTech;
          }
        } catch {}
      }

      // 4. Always read local storage for latest team, capabilities, and customized fields
      if (typeof window !== "undefined") {
        try {
          const rawTeam = localStorage.getItem(`boulotman_company_team_${validId}`) 
            || localStorage.getItem("boulotman_company_team")
            || (baseUser?.id ? localStorage.getItem(`boulotman_company_team_${baseUser.id}`) : null)
            || (baseUser?.user_id ? localStorage.getItem(`boulotman_company_team_${baseUser.user_id}`) : null);

          if (rawTeam) {
            try {
              const parsedTeam = JSON.parse(rawTeam);
              if (Array.isArray(parsedTeam) && parsedTeam.length > 0) {
                baseUser.team = parsedTeam;
              }
            } catch {}
          }

          const rawCap = localStorage.getItem(`boulotman_company_capabilities_${validId}`)
            || localStorage.getItem("boulotman_company_capabilities")
            || (baseUser?.id ? localStorage.getItem(`boulotman_company_capabilities_${baseUser.id}`) : null)
            || (baseUser?.user_id ? localStorage.getItem(`boulotman_company_capabilities_${baseUser.user_id}`) : null);

          if (rawCap) {
            try {
              const parsedCap = JSON.parse(rawCap);
              baseUser.capabilities = parsedCap;
            } catch {}
          }

          const rawCustom = (validId ? localStorage.getItem(`boulotman_technician_profile_custom_${validId}`) : null)
            || localStorage.getItem("boulotman_technician_profile_custom")
            || (baseUser?.id ? localStorage.getItem(`boulotman_technician_profile_custom_${baseUser.id}`) : null);
          const rawPricing = (validId ? localStorage.getItem(`boulotman_technician_pricing_${validId}`) : null)
            || localStorage.getItem("boulotman_technician_pricing")
            || (baseUser?.id ? localStorage.getItem(`boulotman_technician_pricing_${baseUser.id}`) : null);
          const rawPort = localStorage.getItem("boulotman_technician_portfolio");
          const rawTools = localStorage.getItem("boulotman_technician_tools");
          const rawSkills = localStorage.getItem("boulotman_technician_skills");

          let pricingParsed: any = {};
          if (rawPricing) {
            try { pricingParsed = JSON.parse(rawPricing); } catch {}
          }

          if (baseUser?.role !== "COMPANY" && (rawCustom || rawPricing)) {
            let c: any = {};
            if (rawCustom) {
              try { c = JSON.parse(rawCustom); } catch {}
            }
            baseUser = {
              ...(baseUser || {}),
              id: validId,
              role: "TECHNICIAN",
              first_name: c.firstName || baseUser?.first_name,
              last_name: c.lastName || baseUser?.last_name,
              headline: c.headline || baseUser?.headline,
              bio: c.bio || baseUser?.bio,
              about: c.bio || baseUser?.about,
              city: c.city || baseUser?.city,
              country: c.country || baseUser?.country,
              experience_years: c.experienceYears || baseUser?.experience_years,
              education_level: c.educationLevel || baseUser?.education_level,
              expertise_level: c.expertiseLevel || baseUser?.expertise_level,
              hourly_rate: pricingParsed.hourlyRate || c.hourlyRate || baseUser?.hourly_rate || baseUser?.technician_profile?.hourly_rate,
              daily_rate: pricingParsed.dailyRate || c.dailyRate || baseUser?.daily_rate || baseUser?.technician_profile?.daily_rate,
              inspection_fee: pricingParsed.inspectionFee || c.inspectionFee || baseUser?.inspection_fee || baseUser?.technician_profile?.inspection_fee,
              starting_price: pricingParsed.startingPrice || c.startingPrice || baseUser?.starting_price || baseUser?.technician_profile?.starting_price,
              skills: (rawSkills ? JSON.parse(rawSkills) : baseUser?.skills) || [],
              portfolio: (rawPort ? JSON.parse(rawPort) : baseUser?.portfolio) || [],
              tools: (rawTools ? JSON.parse(rawTools) : baseUser?.tools) || [],
            };
          }
        } catch {}
      }

      if (baseUser) return baseUser;
      throw new Error("Profile not found");
    },
    [validId]
  );

  const { data: meData } = useFetch(
    () => {
      if (typeof window === "undefined") return Promise.resolve(null);
      return localStorage.getItem("access_token") ? api.getMe() : Promise.resolve(null);
    },
    []
  );

  const isOwnProfile = Boolean(
    meData?.id && (
      String(meData.id) === String(validId) ||
      String(meData.id) === String(profile?.id) ||
      (profile?.user_id && String(meData.id) === String(profile.user_id)) ||
      (profile?.username && meData.username === profile.username)
    )
  );

  const isCompany = profile?.role === "COMPANY" || Boolean(profile?.company_name && !profile?.first_name);

  // Common media
  const avatarSrc = getImageUrl(profile?.avatar_url || profile?.logo_url || profile?.logo || "");
  const coverSrc = getImageUrl(profile?.banner_url || profile?.cover_url || profile?.cover_image || "");

  // Corporate Specific Attributes (Strictly real from DB / Form)
  const companyName = profile?.company_name || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Enterprise Contractor";
  const tradingName = profile?.trading_name || "";
  const companyType = profile?.company_type || "";
  const industry = profile?.industry || profile?.category || "Contracting";
  const corporateTagline = profile?.subject_title || profile?.headline || (industry ? `${industry} • Corporate Contractor` : "Corporate Contractor");
  const yearFounded = profile?.year_founded || "";
  const employeeCount = profile?.employee_count || profile?.company_size || "";
  const headquarters = profile?.headquarters || profile?.city || profile?.address || profile?.country || "";
  const website = profile?.website || "";
  const workingHours = profile?.working_hours || profile?.business_hours || "";
  const preferredLang = profile?.preferred_language || "fr";

  // Individual Specialist Attributes
  const techDisplayName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || profile?.username || "Specialist";
  const techCategory = profile?.category || profile?.primary_occupation || profile?.trade_category || "General Technical";
  const techHeadline = profile?.headline || profile?.technician_profile?.headline || `Certified ${techCategory} Specialist`;
  const techCity = profile?.city || profile?.technician_profile?.city || profile?.address || "";
  const techCountry = profile?.country || profile?.technician_profile?.country || "Benin";
  const techLocation = techCity && techCountry ? `${techCity}, ${techCountry}` : (techCity || techCountry || "Benin");

  // Initials
  const initials = isCompany
    ? (companyName.substring(0, 2).toUpperCase())
    : (`${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase() || "SP");

  // Ratings & Completed
  const hasRating = profile?.average_rating && Number(profile.average_rating) > 0;
  const ratingDisplay = hasRating
    ? `${Number(profile?.average_rating).toFixed(1)} / 5.0`
    : "5.0 / 5.0";

  const reviewsCount = profile?.review_count ?? 0;
  const completedJobs = profile?.completed_tasks ?? profile?.tasks_completed_count ?? profile?.completed_jobs ?? 0;
  const completionRate = profile?.completion_rate ? `${profile.completion_rate}%` : "100%";

  const bioText = profile?.about || profile?.bio || profile?.technician_profile?.bio || "";

  // Dynamic Lists
  const servicesList: any[] = useMemo(() => {
    if (Array.isArray(profile?.services) && profile.services.length > 0) {
      return profile.services;
    }
    if (Array.isArray(profile?.services_offered) && profile.services_offered.length > 0) {
      return profile.services_offered.map((s: any) => {
        if (typeof s === "string") {
          return {
            title: s,
            category: industry,
            pricing_model: "Request Quote (Enterprise Tender)",
            description: "",
          };
        }
        return s;
      });
    }
    return [];
  }, [profile, industry]);

  const portfolioList: any[] = useMemo(() => {
    if (Array.isArray(profile?.projects) && profile.projects.length > 0) return profile.projects;
    if (Array.isArray(profile?.portfolio) && profile.portfolio.length > 0) return profile.portfolio;
    return [];
  }, [profile]);

  const teamList: any[] = useMemo(() => {
    if (Array.isArray(profile?.team) && profile.team.length > 0) return profile.team;
    if (Array.isArray(profile?.team_members) && profile.team_members.length > 0) return profile.team_members;
    if (typeof window !== "undefined") {
      try {
        const rawTeam = localStorage.getItem(`boulotman_company_team_${validId}`)
          || localStorage.getItem("boulotman_company_team")
          || (profile?.id ? localStorage.getItem(`boulotman_company_team_${profile.id}`) : null)
          || (profile?.user_id ? localStorage.getItem(`boulotman_company_team_${profile.user_id}`) : null);
        if (rawTeam) {
          const parsed = JSON.parse(rawTeam);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [];
  }, [profile, validId]);

  const capabilities = profile?.capabilities || null;

  // Individual specialist pricing & tools
  const rawTools = profile?.tools || profile?.technician_profile?.languages || profile?.languages;
  const toolsList: string[] = Array.isArray(rawTools)
    ? rawTools
    : (rawTools && typeof rawTools === "object" && Array.isArray(rawTools.tools) ? rawTools.tools : []);

  // Read direct or scoped pricing
  let localPricing: any = {};
  if (typeof window !== "undefined") {
    try {
      const pStr = (validId ? localStorage.getItem(`boulotman_technician_pricing_${validId}`) : null)
        || localStorage.getItem("boulotman_technician_pricing")
        || (profile?.id ? localStorage.getItem(`boulotman_technician_pricing_${profile.id}`) : null)
        || (profile?.user_id ? localStorage.getItem(`boulotman_technician_pricing_${profile.user_id}`) : null);
      if (pStr) localPricing = JSON.parse(pStr);
    } catch {}
  }

  const startingPriceDisplay = profile?.starting_price || profile?.technician_profile?.starting_price || localPricing.startingPrice;
  const hourlyRateDisplay = profile?.hourly_rate || profile?.technician_profile?.hourly_rate || localPricing.hourlyRate;
  const dailyRateDisplay = profile?.daily_rate || profile?.technician_profile?.daily_rate || localPricing.dailyRate || (rawTools && typeof rawTools === "object" && rawTools.pricing?.daily_rate);
  const inspectionFeeDisplay = profile?.inspection_fee || profile?.technician_profile?.inspection_fee || localPricing.inspectionFee || (rawTools && typeof rawTools === "object" && rawTools.pricing?.inspection_fee);

  const expertiseLevel = profile?.expertise_level || profile?.technician_profile?.expertise_level || "Verified Specialist";
  const educationLevel = profile?.education_level || profile?.technician_profile?.education_level || "Professional Certification";
  const experienceYears = profile?.experience_years || profile?.technician_profile?.experience_years 
    ? `${profile?.experience_years || profile?.technician_profile?.experience_years} ${t.years}` 
    : `10+ ${t.years}`;

  if (validId === null) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.mainContent}>
          <h2>Invalid profile ID.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.mainContent}>
        <Link href="/search" className={styles.backLink}>
          <iconify-icon icon="lucide:arrow-left" /> {t.backToDirectory}
        </Link>

        {loading ? (
          <div className={styles.skeletonCard}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#e2e8f0", margin: "0 auto 16px" }} />
            <div style={{ height: 26, width: 220, background: "#e2e8f0", margin: "0 auto 10px", borderRadius: 8 }} />
            <div style={{ height: 16, width: 160, background: "#e2e8f0", margin: "0 auto", borderRadius: 4 }} />
          </div>
        ) : error || !profile ? (
          <div className={styles.skeletonCard} style={{ animation: "none", padding: "48px 24px", textAlign: "center", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255, 69, 0, 0.1)", color: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
              <iconify-icon icon="lucide:user-x" />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#001f3f", marginBottom: "8px" }}>{t.profileNotFound}</h2>
            <p style={{ color: "#64748b", fontSize: "14.5px", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              {t.profileNotFoundDesc}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/search" className={styles.btnPrimary}>
                <iconify-icon icon="lucide:search" /> {t.browseDirectory}
              </Link>
            </div>
          </div>
        ) : isCompany ? (
          /* ========================================================================= */
          /* ==================== DEDICATED CORPORATE ENTERPRISE VIEW ================= */
          /* ========================================================================= */
          <>
            {/* Corporate Hero Section */}
            <div className={styles.hero}>
              <div
                className={styles.coverPhoto}
                style={coverSrc ? { backgroundImage: `url(${coverSrc})` } : {}}
              >
                <div className={styles.coverOverlay} />
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.corporateAvatarWrapper}>
                  <div className={styles.corporateAvatarInner}>
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={companyName} width={140} height={140} unoptimized style={{ objectFit: "cover" }} />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <OnlineStatusBadge
                    isOnline={profile?.is_online}
                    lastSeenDisplay={profile?.last_seen_display}
                    showText={false}
                    size="lg"
                    style={{ position: "absolute", bottom: 6, right: 6 }}
                  />
                </div>

                <div className={styles.headerRow}>
                  <div className={styles.nameRole}>
                    {/* Corporate Trust Badges Row */}
                    <div className={styles.corporateBadgeRow}>
                      <span className={`${styles.corporateBadgeItem} ${styles.badgeGreen}`}>
                        <iconify-icon icon="lucide:building" /> {t.rccmVerified}
                      </span>
                      <span className={`${styles.corporateBadgeItem} ${styles.badgeBlue}`}>
                        <iconify-icon icon="lucide:receipt" /> {t.ifuTaxCompliant}
                      </span>
                      <span className={`${styles.corporateBadgeItem} ${styles.badgeGreen}`}>
                        <iconify-icon icon="lucide:shield-check" /> {t.insuredBadge}
                      </span>
                      <span className={`${styles.corporateBadgeItem} ${styles.badgeOrange}`}>
                        <iconify-icon icon="lucide:award" /> {t.capabilityVerified}
                      </span>
                    </div>

                    <h1 className={styles.name}>
                      {companyName}
                      {tradingName && tradingName !== companyName && (
                        <span style={{ fontSize: 18, color: "#64748b", fontWeight: 600 }}>({tradingName})</span>
                      )}
                    </h1>

                    <div className={styles.headlineText}>
                      <iconify-icon icon="lucide:briefcase" style={{ color: "#ff4500" }} />
                      {corporateTagline}
                    </div>

                    <div className={styles.corporateMetaList}>
                      {headquarters && (
                        <span>
                          <iconify-icon icon="lucide:map-pin" /> {headquarters}
                        </span>
                      )}
                      {yearFounded && (
                        <span>
                          <iconify-icon icon="lucide:calendar" /> Est. {yearFounded}
                        </span>
                      )}
                      {employeeCount && (
                        <span>
                          <iconify-icon icon="lucide:users" /> {employeeCount}
                        </span>
                      )}
                      {companyType && (
                        <span>
                          <iconify-icon icon="lucide:landmark" /> {companyType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    {isOwnProfile ? (
                      <Link
                        href="/dashboard/company/profile"
                        className={styles.btnPrimary}
                        style={{ padding: "14px 28px", fontSize: 15 }}
                      >
                        <iconify-icon icon="lucide:edit-3" />
                        Edit Company Profile
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/post-task?invite_company=${profile.id || validId}`}
                          className={styles.btnPrimary}
                          style={{ padding: "14px 28px", fontSize: 15 }}
                        >
                          <iconify-icon icon="lucide:file-signature" />
                          {t.requestProjectQuote}
                        </Link>

                        <Link
                          href={`/dashboard/messages?recipient=${profile.id || validId}&name=${encodeURIComponent(companyName)}`}
                          className={styles.btnOutline}
                          style={{ padding: "14px 22px", fontSize: 15 }}
                        >
                          <iconify-icon icon="lucide:message-square" />
                          {t.directMessage}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Metrics Strip */}
            <div className={styles.corporateStatsGrid}>
              <div className={styles.corporateStatCard}>
                <div className={styles.corporateStatIcon}>
                  <iconify-icon icon="lucide:layers" style={{ color: "#ff4500" }} />
                </div>
                <div>
                  <div className={styles.corporateStatLabel}>{t.maxTenderCapacity}</div>
                  <h3 className={styles.corporateStatValue}>{capabilities?.maxProjectBudget || "Tender Quote Basis"}</h3>
                </div>
              </div>

              <div className={styles.corporateStatCard}>
                <div className={styles.corporateStatIcon}>
                  <iconify-icon icon="lucide:hard-hat" style={{ color: "#0284c7" }} />
                </div>
                <div>
                  <div className={styles.corporateStatLabel}>{t.simultaneousSites}</div>
                  <h3 className={styles.corporateStatValue}>{capabilities?.simultaneousProjects || "Multi-Site Execution"}</h3>
                </div>
              </div>

              <div className={styles.corporateStatCard}>
                <div className={styles.corporateStatIcon}>
                  <iconify-icon icon="lucide:users-2" style={{ color: "#16a34a" }} />
                </div>
                <div>
                  <div className={styles.corporateStatLabel}>{t.workforceEngineers}</div>
                  <h3 className={styles.corporateStatValue}>{capabilities?.permanentWorkforce || employeeCount || "Technical Team"}</h3>
                </div>
              </div>

              <div className={styles.corporateStatCard}>
                <div className={styles.corporateStatIcon}>
                  <iconify-icon icon="lucide:shield-check" style={{ color: "#8b5cf6" }} />
                </div>
                <div>
                  <div className={styles.corporateStatLabel}>{t.insuranceCover}</div>
                  <h3 className={styles.corporateStatValue}>{profile?.is_verified ? t.insuredBadge : t.escrowGuaranteed}</h3>
                </div>
              </div>
            </div>

            {/* Main Corporate Content Grid */}
            <div className={styles.contentGrid}>
              <div className={styles.mainCol}>
                {/* 1. Corporate Overview & Capacity */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:building-2" style={{ color: "#ff4500" }} />
                    {t.corporateOverview}
                  </h2>
                  <p className={styles.sectionText} style={!bioText ? { fontStyle: "italic", color: "#94a3b8" } : {}}>
                    {bioText || t.noBioProvided}
                  </p>

                  {/* Operational Facilities */}
                  {capabilities?.facilities && (
                    <div style={{ marginTop: 16, padding: "14px 18px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
                      <iconify-icon icon="lucide:warehouse" style={{ fontSize: 22, color: "#001f3f" }} />
                      <span style={{ fontSize: 13.5, color: "#334155", fontWeight: 700 }}>
                        <strong>Operational Base:</strong> {capabilities.facilities}
                      </span>
                    </div>
                  )}
                </section>

                {/* 2. Commercial Services Catalog */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:layers" style={{ color: "#ff4500" }} />
                    {t.servicesCatalog} ({servicesList.length})
                  </h2>
                  {servicesList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:layers" style={{ fontSize: 28, color: "#94a3b8", marginBottom: 6 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 13.5, fontWeight: 600 }}>{t.noServicesListed}</p>
                    </div>
                  ) : (
                    <div className={styles.servicesGrid}>
                      {servicesList.map((srv: any, idx: number) => (
                        <div key={srv.id || idx} className={styles.serviceCard}>
                          <span className={styles.serviceBadge}>{srv.category || industry}</span>
                          <h4 className={styles.serviceTitle}>{srv.title}</h4>
                          <span className={styles.servicePricing}>
                            <iconify-icon icon="lucide:tag" /> {srv.pricing_model || "Request Quote"}
                          </span>
                          {srv.description && <p className={styles.serviceDesc}>{srv.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 3. Case Studies & Portfolio Grid */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:folder-check" style={{ color: "#ff4500" }} />
                    {t.portfolioCaseStudies} ({portfolioList.length})
                  </h2>
                  {portfolioList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:briefcase" style={{ fontSize: 32, color: "#94a3b8", marginBottom: 8 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 14, fontWeight: 600 }}>{t.noPortfolioListed}</p>
                    </div>
                  ) : (
                    <div className={styles.portfolioGrid}>
                      {portfolioList.map((item: any, idx: number) => {
                        const img = item.photoUrl || item.photo_url || item.image_url || item.image || item.file_url;
                        const budgetVal = item.budget || item.project_value || (item.budget_xof ? `${item.budget_xof} XOF` : "");
                        const compDate = item.completionDate || item.completion_date || item.completed_date || item.timeline || "Completed";
                        const clientName = item.client || item.client_name || "Enterprise Partner";

                        return (
                          <div key={item.id || item.title || idx} className={styles.portfolioCard}>
                            <div className={styles.portfolioVisual}>
                              {img ? (
                                <img src={getImageUrl(img)} alt={item.title || "Project photo"} />
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}>
                                  <iconify-icon icon="lucide:building" style={{ fontSize: 36 }} />
                                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Delivered Project</span>
                                </div>
                              )}
                              {budgetVal && (
                                <span className={styles.portfolioBudgetBadge}>
                                  {budgetVal}
                                </span>
                              )}
                            </div>
                            <div className={styles.portfolioBody}>
                              <span className={styles.portfolioCategory}>{item.category || industry}</span>
                              <h4 className={styles.portfolioTitle}>{item.title}</h4>
                              {item.description && <p className={styles.portfolioDesc}>{item.description}</p>}
                              <div className={styles.portfolioFooter}>
                                <span>🏛️ {clientName}</span>
                                <span>⏳ {compDate}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* 4. Technical Leadership & Key Personnel */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:users" style={{ color: "#ff4500" }} />
                    {t.keyPersonnel} ({teamList.length})
                  </h2>
                  {teamList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:users" style={{ fontSize: 28, color: "#94a3b8", marginBottom: 6 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 13.5, fontWeight: 600 }}>{t.noTeamListed}</p>
                    </div>
                  ) : (
                    <div className={styles.teamGrid}>
                      {teamList.map((member: any, idx: number) => (
                        <div key={member.id || idx} className={styles.teamCard}>
                          <div className={styles.teamAvatar}>
                            {(member.name || "TM").substring(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 className={styles.teamName}>{member.name}</h4>
                            <div className={styles.teamRole}>{member.role}</div>
                            {member.qualification && <p className={styles.teamQual}>🎓 {member.qualification}</p>}
                            {member.experienceYears && (
                              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, display: "inline-block", marginTop: 4 }}>
                                ⏳ {member.experienceYears.includes("Exp") || member.experienceYears.includes("exp") || member.experienceYears.includes("ans") ? member.experienceYears : `${member.experienceYears} ${t.experience}`}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Corporate Right Sidebar */}
              <div className={styles.sideCol}>
                {/* 1. Legal Compliance Vault */}
                <div className={styles.detailsCard} style={{ borderLeft: "4px solid #16a34a" }}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                    {t.corporateComplianceVault}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                    <div className={styles.vaultItem}>
                      <div className={styles.vaultLeft}>
                        <div className={styles.vaultIcon}><iconify-icon icon="lucide:building" /></div>
                        <span className={styles.vaultTitle}>{t.rccmRegVal}</span>
                      </div>
                      <span className={styles.vaultBadge}>{profile?.is_verified ? t.verifiedStatus : t.pendingStatus}</span>
                    </div>

                    <div className={styles.vaultItem}>
                      <div className={styles.vaultLeft}>
                        <div className={styles.vaultIcon}><iconify-icon icon="lucide:receipt" /></div>
                        <span className={styles.vaultTitle}>{t.ifuTaxVal}</span>
                      </div>
                      <span className={styles.vaultBadge}>{profile?.is_verified ? t.verifiedStatus : t.pendingStatus}</span>
                    </div>

                    <div className={styles.vaultItem}>
                      <div className={styles.vaultLeft}>
                        <div className={styles.vaultIcon}><iconify-icon icon="lucide:shield-check" /></div>
                        <span className={styles.vaultTitle}>{t.insuranceVal}</span>
                      </div>
                      <span className={styles.vaultBadge}>{profile?.is_verified ? t.activeStatus : t.pendingStatus}</span>
                    </div>

                    <div className={styles.vaultItem}>
                      <div className={styles.vaultLeft}>
                        <div className={styles.vaultIcon}><iconify-icon icon="lucide:user-check" /></div>
                        <span className={styles.vaultTitle}>{t.repVal}</span>
                      </div>
                      <span className={styles.vaultBadge}>{profile?.is_verified ? t.verifiedStatus : t.pendingStatus}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Corporate HQ & Details */}
                <div className={styles.detailsCard}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:map-pin" style={{ color: "#001f3f" }} />
                    {t.corporateHQ}
                  </h3>

                  <ul className={styles.detailsList}>
                    {headquarters && (
                      <li className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>{t.physicalAddress}</span>
                        <span className={styles.detailsValue}>{headquarters}</span>
                      </li>
                    )}
                    {website && (
                      <li className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>{t.officialWebsite}</span>
                        <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noreferrer" style={{ color: "#ff4500", fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>
                          {website.replace("https://", "").replace("http://", "")} ↗
                        </a>
                      </li>
                    )}
                    {workingHours && (
                      <li className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>{t.operatingHours}</span>
                        <span className={styles.detailsValue}>{workingHours}</span>
                      </li>
                    )}
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.languagesSpoken}</span>
                      <span className={styles.detailsValue}>
                        {preferredLang === "en" ? "English" : "Français (French)"}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3. RFP Tender Invitation CTA Box / Manage Profile */}
                <div className={styles.contactBox}>
                  {isOwnProfile ? (
                    <>
                      <h3 className={styles.contactTitle}>Your Corporate Profile</h3>
                      <p className={styles.contactText}>Manage your corporate compliance credentials, services catalog, and team directory.</p>
                      <Link
                        href="/dashboard/company/profile"
                        className={styles.contactBtn}
                      >
                        <iconify-icon icon="lucide:settings" />
                        Manage Company Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 className={styles.contactTitle}>{t.needCommercialQuote}</h3>
                      <p className={styles.contactText}>{t.commercialQuoteSub}</p>
                      <Link
                        href={`/post-task?invite_company=${profile.id || validId}`}
                        className={styles.contactBtn}
                      >
                        <iconify-icon icon="lucide:send" />
                        {t.inviteToBid}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* ==================== INDIVIDUAL TECHNICIAN SPECIALIST VIEW ================ */
          /* ========================================================================= */
          <>
            {/* Technician Hero Card */}
            <div className={styles.hero}>
              <div
                className={styles.coverPhoto}
                style={coverSrc ? { backgroundImage: `url(${coverSrc})` } : {}}
              >
                <div className={styles.coverOverlay} />
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarInner}>
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={techDisplayName} width={136} height={136} unoptimized style={{ objectFit: "cover" }} />
                    ) : (
                      <span className={styles.initials}>{initials}</span>
                    )}
                  </div>
                  <OnlineStatusBadge
                    isOnline={profile?.is_online}
                    lastSeenDisplay={profile?.last_seen_display}
                    showText={false}
                    size="lg"
                    style={{ position: "absolute", bottom: 4, right: 4 }}
                  />
                </div>

                <div className={styles.headerRow}>
                  <div className={styles.nameRole}>
                    <span className={styles.roleBadge}>
                      <iconify-icon icon="lucide:award" />
                      {t.certifiedSpecialist}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <h1 className={styles.name} style={{ margin: 0 }}>
                        {techDisplayName}
                      </h1>
                      <OnlineStatusBadge
                        isOnline={profile?.is_online}
                        lastSeenDisplay={profile?.last_seen_display}
                        size="md"
                      />
                    </div>

                    <div className={styles.headlineText}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500" }} />
                      {techHeadline}
                    </div>

                    <div className={styles.location}>
                      <span>
                        <iconify-icon icon="lucide:map-pin" style={{ color: "#001f3f", marginRight: 4 }} />
                        {techLocation}
                      </span>

                      <span className={styles.trustPill}>
                        <iconify-icon icon="lucide:shield-check" />
                        ID & Background Verified ✓
                      </span>

                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0284c7", fontWeight: 700, fontSize: "13px" }}>
                        <iconify-icon icon="lucide:zap" /> Fast Responder
                      </span>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    {isOwnProfile ? (
                      <Link
                        href="/dashboard/technician/profile"
                        className={styles.btnPrimary}
                      >
                        <iconify-icon icon="lucide:edit-3" />
                        Edit My Profile
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/post-task?invite=${profile.id || validId}`}
                          className={styles.btnPrimary}
                        >
                          <iconify-icon icon="lucide:briefcase" />
                          {t.hireSpecialist}
                        </Link>

                        <Link
                          href={`/dashboard/messages?recipient=${profile.id || validId}&name=${encodeURIComponent(techDisplayName)}`}
                          className={styles.btnOutline}
                        >
                          <iconify-icon icon="lucide:message-square" />
                          {t.directMessage}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Stats Strip */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:star" style={{ color: "#eab308" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{t.clientRating}</h3>
                  <p>{ratingDisplay} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>({reviewsCount} {t.reviews})</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{t.executedProjects}</h3>
                  <p>{completedJobs} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{t.delivered}</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:trending-up" style={{ color: "#0284c7" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{t.onTimeDelivery}</h3>
                  <p>{completionRate} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{t.onSchedule}</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:shield-alert" style={{ color: "#ff4500" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{t.escrowGuaranteed}</h3>
                  <p>100% <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{t.guaranteed}</span></p>
                </div>
              </div>
            </div>

            {/* Technician Content Layout */}
            <div className={styles.contentGrid}>
              <div className={styles.mainCol}>
                {/* 1. About Me */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#ff4500" }} />
                    {t.aboutMe}
                  </h2>
                  <p className={styles.sectionText} style={!bioText ? { fontStyle: "italic", color: "#94a3b8" } : {}}>
                    {bioText || "No professional summary or bio provided yet."}
                  </p>
                </section>

                {/* 2. Services Offered Catalog */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:layers" style={{ color: "#ff4500" }} />
                    {t.servicesCatalog} ({servicesList.length})
                  </h2>
                  {servicesList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:layers" style={{ fontSize: 28, color: "#94a3b8", marginBottom: 6 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 13.5, fontWeight: 600 }}>{t.noServicesListed}</p>
                    </div>
                  ) : (
                    <div className={styles.servicesGrid}>
                      {servicesList.map((srv: any, idx: number) => (
                        <div key={srv.id || idx} className={styles.serviceCard}>
                          <span className={styles.serviceBadge}>{srv.category || "Technical Service"}</span>
                          <h4 className={styles.serviceTitle}>{srv.title}</h4>
                          <span className={styles.servicePricing}>
                            <iconify-icon icon="lucide:tag" /> {srv.pricing_min ? `${srv.pricing_min} XOF (${srv.pricing_model || 'Fixed'})` : (srv.pricing_model || "Request Quote")}
                          </span>
                          {srv.description && <p className={styles.serviceDesc}>{srv.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 3. Skills & Specializations */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500" }} />
                    {t.tradeSkills}
                  </h2>
                  {(Array.isArray(profile?.skills) && profile.skills.length > 0) ? (
                    <div className={styles.skillsContainer}>
                      {profile.skills.map((s: any, i: number) => (
                        <span key={i} className={styles.skillChip}>
                          <iconify-icon icon="lucide:check" style={{ color: "#16a34a" }} />
                          {typeof s === "string" ? s : s?.name || ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:wrench" style={{ fontSize: 28, color: "#94a3b8", marginBottom: 6 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 13.5, fontWeight: 600 }}>{t.noSkillsListed}</p>
                    </div>
                  )}
                </section>

                {/* 3. Visual Portfolio Grid */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:image" style={{ color: "#ff4500" }} />
                    {t.visualPortfolio} ({portfolioList.length})
                  </h2>
                  {portfolioList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:briefcase" style={{ fontSize: 32, color: "#94a3b8", marginBottom: 8 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 14, fontWeight: 600 }}>{t.noVisualPortfolio}</p>
                    </div>
                  ) : (
                    <div className={styles.portfolioGrid}>
                      {portfolioList.map((item: any, idx: number) => {
                        const img = item.photoUrl || item.photo_url || item.image_url || item.image || item.file_url;
                        const budgetVal = item.budget || item.project_value || (item.budget_xof ? `${item.budget_xof} XOF` : "");
                        const compDate = item.completionDate || item.completion_date || item.completed_date || item.timeline || "Completed";

                        return (
                          <div key={item.id || item.title || idx} className={styles.portfolioCard}>
                            <div className={styles.portfolioVisual}>
                              {img ? (
                                <img src={getImageUrl(img)} alt={item.title || "Project photo"} />
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}>
                                  <iconify-icon icon="lucide:hard-hat" style={{ fontSize: 36 }} />
                                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Verified Job</span>
                                </div>
                              )}
                              {budgetVal && (
                                <span className={styles.portfolioBudgetBadge}>
                                  {budgetVal}
                                </span>
                              )}
                            </div>
                            <div className={styles.portfolioBody}>
                              <span className={styles.portfolioCategory}>{item.category || techCategory}</span>
                              <h4 className={styles.portfolioTitle}>{item.title}</h4>
                              {item.description && <p className={styles.portfolioDesc}>{item.description}</p>}
                              <div className={styles.portfolioFooter}>
                                <span>📍 {techLocation}</span>
                                <span>⏳ {compDate}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* 4. Tools & Equipment */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:hammer" style={{ color: "#ff4500" }} />
                    {t.toolsEquipment}
                  </h2>
                  {toolsList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                      <iconify-icon icon="lucide:hammer" style={{ fontSize: 28, color: "#94a3b8", marginBottom: 6 }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 13.5, fontWeight: 600 }}>{t.noToolsDeclared}</p>
                    </div>
                  ) : (
                    <div className={styles.skillsContainer}>
                      {toolsList.map((tool: string, i: number) => (
                        <span key={i} className={styles.skillChip} style={{ background: "#f8fafc" }}>
                          <iconify-icon icon="lucide:shield" style={{ color: "#001f3f" }} />
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </section>

                {/* 5. Standard Pricing Models */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:tag" style={{ color: "#ff4500" }} />
                    {t.standardPricing}
                  </h2>
                  <div className={styles.pricingGrid}>
                    {startingPriceDisplay && (
                      <div className={styles.pricingBox}>
                        <span className={styles.pricingLabel}>Starting Base Rate</span>
                        <span className={styles.pricingValue}>
                          {String(startingPriceDisplay).includes("XOF") ? startingPriceDisplay : `${startingPriceDisplay} XOF`}
                        </span>
                      </div>
                    )}
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>{t.hourlyRate}</span>
                      <span className={styles.pricingValue}>
                        {hourlyRateDisplay 
                          ? (String(hourlyRateDisplay).includes("XOF") || String(hourlyRateDisplay).includes("/ hr") || String(hourlyRateDisplay).includes("Quote") || String(hourlyRateDisplay).includes("Negotiable") 
                              ? hourlyRateDisplay 
                              : `${hourlyRateDisplay} XOF / hr`) 
                          : "Negotiable / Quote on Request"}
                      </span>
                    </div>
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>{t.fullDayRate}</span>
                      <span className={styles.pricingValue}>
                        {dailyRateDisplay 
                          ? (String(dailyRateDisplay).includes("XOF") || String(dailyRateDisplay).includes("/ day") || String(dailyRateDisplay).includes("Negotiable") 
                              ? dailyRateDisplay 
                              : `${dailyRateDisplay} XOF / day`) 
                          : "Negotiable Daily Rate"}
                      </span>
                    </div>
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>{t.inspectionFee}</span>
                      <span className={styles.pricingValue}>
                        {inspectionFeeDisplay 
                          ? (String(inspectionFeeDisplay).includes("XOF") || String(inspectionFeeDisplay).includes("Inspection") || String(inspectionFeeDisplay).includes("Contact") 
                              ? inspectionFeeDisplay 
                              : `${inspectionFeeDisplay} XOF`) 
                          : "Contact for Inspection"}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Specialist Right Sidebar */}
              <div className={styles.sideCol}>
                {/* 1. Boulot Man Verification Guarantee */}
                <div className={styles.detailsCard} style={{ borderLeft: "4px solid #16a34a" }}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                    {t.boulotManGuarantee}
                  </h3>
                  <ul className={styles.trustList}>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span><strong>National ID & Face Match</strong> {t.nationalIdGuarantee}</span>
                    </li>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span>{t.escrowGuarantee}</span>
                    </li>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span>{t.satisfactionGuarantee}</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Professional Credentials */}
                <div className={styles.detailsCard}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#001f3f" }} />
                    {t.professionalCredentials}
                  </h3>
                  <ul className={styles.detailsList}>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.seniorityLevel}</span>
                      <span className={styles.detailsValue}>{expertiseLevel}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.handsOnExp}</span>
                      <span className={styles.detailsValue}>{experienceYears}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.educationTraining}</span>
                      <span className={styles.detailsValue}>{educationLevel}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.operatingArea}</span>
                      <span className={styles.detailsValue}>{techLocation}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>{t.dispatchAvailability}</span>
                      <span className={styles.detailsValue} style={{ color: "#16a34a" }}>{t.availableNow}</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Ready to Hire CTA Box / Manage Profile */}
                <div className={styles.contactBox}>
                  {isOwnProfile ? (
                    <>
                      <h3 className={styles.contactTitle}>Your Technician Profile</h3>
                      <p className={styles.contactText}>Keep your trade skills, portfolio, and pricing structure updated for clients.</p>
                      <Link
                        href="/dashboard/technician/profile"
                        className={styles.contactBtn}
                      >
                        <iconify-icon icon="lucide:settings" />
                        Manage Profile & Rates
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 className={styles.contactTitle}>{t.readyToHire}</h3>
                      <p className={styles.contactText}>{t.readyToHireSub}</p>
                      <Link
                        href={`/post-task?invite=${profile.id || validId}`}
                        className={styles.contactBtn}
                      >
                        <iconify-icon icon="lucide:send" />
                        {t.hireProBtn}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
