"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./new.module.css";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { formatXOF } from "@/app/lib/format";

const CATEGORIES = [
  "IT, Software, Web & Telecommunications",
  "Civil, Construction & Architecture",
  "Electrical, Solar & Renewable Utilities",
  "Plumbing, Piping & Water Infrastructure",
  "HVAC & Industrial Cold Storage",
  "Heavy Machinery, Earthmoving & Fleet Logistics",
  "Security, CCTV & Fire Automation Systems",
  "Corporate Infrastructure & Consulting",
];

const translations: Record<string, Record<string, string>> = {
  en: {
    backToProjects: "← Back to Projects & Gallery",
    heroBadge: "Enterprise Portfolio Showcase",
    heroTitle: "Add Project / Portfolio Showcase",
    heroSubtitle: "Document completed engineering projects, IT deployments, infrastructure works, and contracts to showcase on your public company profile.",
    
    // Section 1
    sec1Title: "1. Project Overview & Client Information",
    sec1Sub: "Core identification and contracting client details",
    projectTitle: "Project / Contract Title *",
    projectTitlePlaceholder: "e.g. 5-Storey Commercial Complex or Enterprise Cloud Migration & ERP Suite",
    category: "Industry Sector / Category *",
    selectCategory: "Select industry sector",
    clientName: "Client / Contracting Authority *",
    clientNamePlaceholder: "e.g. Banque Atlantique, Ministry of Infrastructure, or Corporate Client",
    location: "Project Location / City *",
    locationPlaceholder: "e.g. Cotonou, Benin or Cloud / AWS / Remote",
    
    // Section 2 (Live URL)
    sec2Title: "2. Digital & IT Project Link (Optional)",
    sec2Sub: "For IT, software, web, apps, and digital solutions",
    projectUrl: "Live Project / Demo Website URL",
    projectUrlPlaceholder: "https://example.com or https://app.clientdomain.com",
    projectUrlHint: "For IT, software, web platforms, and digital projects, provide a live link so prospective clients can explore or test the live deployment.",
    
    // Section 3
    sec3Title: "3. Contract Metrics, Budget & Timeline",
    sec3Sub: "Contract value, delivery schedule, and completion metrics",
    contractBudget: "Contract Value / Total Budget (XOF) *",
    budgetPlaceholder: "e.g. 45,000,000",
    budgetHint: "Enter numeric amount in XOF (CFA Franc).",
    timeline: "Execution Timeline / Duration *",
    timelinePlaceholder: "e.g. 4 Months (Jan 2025 - Apr 2025)",
    projectStatus: "Project Status *",
    statusCompleted: "Completed (100% Delivered)",
    statusActive: "In Progress / Active Retainer",
    statusPending: "Pending Mobilization",
    completionYear: "Completion Year",
    yearPlaceholder: "e.g. 2025",

    // Section 4
    sec4Title: "4. Scope of Works & Technical Highlights",
    sec4Sub: "Detailed specifications, achievements, and technical methodologies",
    description: "Detailed Scope of Works & Achievements *",
    descPlaceholder: "Describe the scope of work executed, engineering standards met, challenges overcome, workforce mobilized, and client satisfaction...",
    highlightsLabel: "Key Technologies, Equipment & Deliverables (Tags)",
    highlightPlaceholder: "e.g. React, Fiber Optic, 500kW Inverter, Concrete Foundations...",
    addTagBtn: "Add",

    // Section 5
    sec5Title: "5. Project Site Photos & Media Gallery",
    sec5Sub: "Upload photos, site images, architectural drawings or screenshots",
    dropzoneText: "Click to upload project photos or drag and drop",
    dropzoneSub: "Supports JPG, PNG, WebP (Max 10MB per image)",

    // Section 6
    sec6Title: "Live Showcase Card Preview",
    sec6Sub: "Real-time preview of how this project will appear on your public enterprise profile",
    visitLiveLink: "Visit Live Project / Demo ↗",
    publishedBy: "Executed by",

    // Actions
    cancel: "Cancel",
    publishBtn: "Publish Project Showcase",
    publishing: "Publishing Showcase...",
    successTitle: "Project Published",
    successDesc: "Your project has been successfully added to your company showcase.",
  },
  fr: {
    backToProjects: "← Retour aux Projets & Réalisations",
    heroBadge: "Vitrine du Portfolio Entreprise",
    heroTitle: "Ajouter un Projet / Réalisation",
    heroSubtitle: "Valorisez vos chantiers achevés, déploiements IT, infrastructures et contrats exécutés sur votre profil public d'entreprise.",
    
    sec1Title: "1. Aperçu du Projet & Client",
    sec1Sub: "Informations d'identification et détails de l'autorité contractante",
    projectTitle: "Titre du Projet / Contrat *",
    projectTitlePlaceholder: "ex : Complexe Immobilier Commercial R+5 ou Migration Cloud & ERP d'Entreprise",
    category: "Secteur d'Activité / Métier *",
    selectCategory: "Sélectionnez le secteur d'activité",
    clientName: "Client / Maître d'Ouvrage *",
    clientNamePlaceholder: "ex : Banque Atlantique, Ministère des Travaux Publics ou Client Privé",
    location: "Localisation / Ville du Projet *",
    locationPlaceholder: "ex : Cotonou, Bénin ou Cloud / Distanciel",
    
    sec2Title: "2. Lien du Projet Digital & IT (Facultatif)",
    sec2Sub: "Pour les solutions logicielles, sites web, plateformes et projets IT",
    projectUrl: "URL du Projet / Site / Démo en Direct",
    projectUrlPlaceholder: "https://exemple.com ou https://app.domaineclient.com",
    projectUrlHint: "Pour les projets informatiques et digitaux, renseignez l'URL pour permettre aux futurs clients de tester la plateforme en direct.",
    
    sec3Title: "3. Budget, Métriques & Calendrier",
    sec3Sub: "Montant du contrat, délais d'exécution et calendrier",
    contractBudget: "Montant du Contrat / Budget Total (XOF) *",
    budgetPlaceholder: "ex : 45 000 000",
    budgetHint: "Montant numérique en Franc CFA (XOF).",
    timeline: "Délai d'Exécution / Durée *",
    timelinePlaceholder: "ex : 4 Mois (Janvier 2025 - Avril 2025)",
    projectStatus: "Statut du Projet *",
    statusCompleted: "Terminé (100% Livré)",
    statusActive: "En Cours d'Exécution",
    statusPending: "En Attente de Démarrage",
    completionYear: "Année d'Achèvement",
    yearPlaceholder: "ex : 2025",

    sec4Title: "4. Périmètre d'Intervention & Spécifications",
    sec4Sub: "Spécifications techniques, réalisations et méthodologie",
    description: "Cahier des Charges Exécuté & Réalisations *",
    descPlaceholder: "Détaillez le travail accompli, les normes respectées, les défis surmontés, la main-d'œuvre mobilisée et l'impact client...",
    highlightsLabel: "Technologies, Équipements & Mots-clés",
    highlightPlaceholder: "ex : React, Fibre Optique, Onduleur 500kW, Béton Armé...",
    addTagBtn: "Ajouter",

    sec5Title: "5. Photos du Chantier & Galerie Média",
    sec5Sub: "Téléchargez des photos de réalisations, captures ou plans de chantier",
    dropzoneText: "Cliquez pour téléverser des photos ou glissez-déposez vos images",
    dropzoneSub: "Formats acceptés : JPG, PNG, WebP (Max 10 Mo)",

    sec6Title: "Aperçu de la Fiche Réalisation",
    sec6Sub: "Aperçu en direct tel qu'il apparaîtra sur votre profil d'entreprise public",
    visitLiveLink: "Visiter le Projet / Démo en Direct ↗",
    publishedBy: "Exécuté par",

    cancel: "Annuler",
    publishBtn: "Publier la Réalisation",
    publishing: "Publication en cours...",
    successTitle: "Projet Publié",
    successDesc: "Votre réalisation a été ajoutée avec succès à votre vitrine d'entreprise.",
  }
};

export default function AddProjectShowcasePage() {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Shared Data
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: companyProfile } = useFetch(() => api.getCompanyProfile(), []);

  // Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [status, setStatus] = useState("completed");
  const [completionYear, setCompletionYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const companyName = companyProfile?.company_name || user?.company_name || "Company Contractor";

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const res = await api.uploadPortfolioImage(file);
          if (res?.image_url) {
            setGalleryImages((prev) => [...prev, res.image_url]);
          } else {
            // Local base64 fallback
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setGalleryImages((prev) => [...prev, String(event.target?.result)]);
              }
            };
            reader.readAsDataURL(file);
          }
        } catch {
          // Local base64 fallback
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setGalleryImages((prev) => [...prev, String(event.target?.result)]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
      toast.success("Images Added", `${files.length} photo(s) added to project gallery.`);
    } catch {
      toast.error("Upload Failed", "Could not upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Required", "Please provide a project title.");
      return;
    }
    if (!clientName.trim()) {
      toast.error("Required", "Please specify the client or contracting organization.");
      return;
    }

    setSubmitting(true);
    try {
      const numericBudget = budget ? Number(budget.replace(/[^0-9.]/g, "")) : null;
      
      // Determine composite location/url label
      const locationValue = projectUrl.trim() 
        ? `${location.trim() || "Remote / Cloud"} | ${projectUrl.trim()}`
        : (location.trim() || "Commercial Site");

      const timelineValue = [
        timeline.trim() || "Completed",
        completionYear.trim() ? `(${completionYear.trim()})` : "",
        category ? `• ${category}` : ""
      ].filter(Boolean).join(" ");

      // 1. Create in backend
      const res = await api.createCompanyProject({
        title: title.trim(),
        client_name: clientName.trim(),
        location: locationValue,
        budget: numericBudget,
        timeline: timelineValue,
        status: status,
        progress: status === "completed" ? 100 : 50,
      });

      // 2. Sync to local storage for instant public showcase richness
      if (typeof window !== "undefined") {
        const fullProjectRecord = {
          id: res?.id || Date.now(),
          title: title.trim(),
          client_name: clientName.trim(),
          category: category,
          location: location.trim(),
          url: projectUrl.trim(),
          budget: numericBudget,
          timeline: timeline.trim(),
          year: completionYear.trim(),
          status: status,
          progress: status === "completed" ? 100 : 50,
          description: description.trim(),
          tags: tags,
          images: galleryImages,
          created_at: new Date().toISOString(),
        };

        try {
          const raw = localStorage.getItem("boulotman_company_projects");
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(fullProjectRecord);
          localStorage.setItem("boulotman_company_projects", JSON.stringify(list));

          if (companyProfile?.id) {
            localStorage.setItem(`boulotman_company_projects_${companyProfile.id}`, JSON.stringify(list));
          }
          if (user?.id) {
            localStorage.setItem(`boulotman_company_projects_${user.id}`, JSON.stringify(list));
          }
          if (galleryImages.length > 0) {
            if (res?.id) {
              localStorage.setItem(`boulotman_project_images_${res.id}`, JSON.stringify(galleryImages));
            }
            localStorage.setItem(`boulotman_project_images_${title.trim().toLowerCase()}`, JSON.stringify(galleryImages));
          }
        } catch {}
      }

      toast.success(t.successTitle, t.successDesc);
      router.push("/dashboard/company/projects");
    } catch (err: any) {
      toast.error("Failed to publish", err?.message || "Please check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* TOP HEADER & BREADCRUMBS */}
        <div className={styles.headerNav}>
          <Link href="/dashboard/company/projects" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: 16 }} />
            {t.backToProjects}
          </Link>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            {companyName}
          </span>
        </div>

        {/* HERO BANNER */}
        <section className={styles.heroCard}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:sparkles" />
            {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
        </section>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className={styles.formLayout}>
          
          {/* ==================== 1. PROJECT OVERVIEW ==================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <iconify-icon icon="lucide:building-2" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec1Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec1Sub}</p>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {t.projectTitle}
              </label>
              <input
                className={styles.input}
                placeholder={t.projectTitlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.category}
                </label>
                <select
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.clientName}
                </label>
                <input
                  className={styles.input}
                  placeholder={t.clientNamePlaceholder}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {t.location}
              </label>
              <div className={styles.inputWrapper}>
                <iconify-icon icon="lucide:map-pin" className={styles.inputIcon} />
                <input
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder={t.locationPlaceholder}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* ==================== 2. DIGITAL & IT LIVE URL ==================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0284c7" }}>
                <iconify-icon icon="lucide:globe" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec2Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec2Sub}</p>
              </div>
            </div>

            <div className={styles.urlNotice}>
              <iconify-icon icon="lucide:info" style={{ fontSize: 20, flexShrink: 0 }} />
              <span>{t.projectUrlHint}</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <iconify-icon icon="lucide:external-link" style={{ color: "#0284c7" }} />
                {t.projectUrl}
              </label>
              <div className={styles.inputWrapper}>
                <iconify-icon icon="lucide:link-2" className={styles.inputIcon} />
                <input
                  type="url"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder={t.projectUrlPlaceholder}
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                />
              </div>
              <span className={styles.fieldHint}>
                e.g. https://banque-atlantique-app.com, https://cloud.org, or live staging URL
              </span>
            </div>
          </div>

          {/* ==================== 3. CONTRACT BUDGET & TIMELINE ==================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon} style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                <iconify-icon icon="lucide:coins" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec3Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec3Sub}</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.contractBudget}
                </label>
                <div className={styles.inputWrapper}>
                  <iconify-icon icon="lucide:receipt" className={styles.inputIcon} />
                  <input
                    className={`${styles.input} ${styles.inputWithIcon}`}
                    placeholder={t.budgetPlaceholder}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
                <span className={styles.fieldHint}>{t.budgetHint}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.timeline}
                </label>
                <div className={styles.inputWrapper}>
                  <iconify-icon icon="lucide:calendar" className={styles.inputIcon} />
                  <input
                    className={`${styles.input} ${styles.inputWithIcon}`}
                    placeholder={t.timelinePlaceholder}
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.projectStatus}
                </label>
                <select
                  className={styles.select}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="completed">{t.statusCompleted}</option>
                  <option value="active">{t.statusActive}</option>
                  <option value="pending">{t.statusPending}</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  {t.completionYear}
                </label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder={t.yearPlaceholder}
                  value={completionYear}
                  onChange={(e) => setCompletionYear(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ==================== 4. SCOPE OF WORKS & HIGHLIGHTS ==================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                <iconify-icon icon="lucide:file-text" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec4Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec4Sub}</p>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {t.description}
              </label>
              <textarea
                className={styles.textarea}
                placeholder={t.descPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {t.highlightsLabel}
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className={styles.input}
                  placeholder={t.highlightPlaceholder}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={styles.cancelBtn}
                  style={{ minWidth: 90, justifyContent: "center" }}
                >
                  <iconify-icon icon="lucide:plus" /> {t.addTagBtn}
                </button>
              </div>

              {tags.length > 0 && (
                <div className={styles.tagContainer}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tagChip}>
                      <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a", fontSize: 14 }} />
                      {tag}
                      <button
                        type="button"
                        className={styles.tagRemoveBtn}
                        onClick={() => handleRemoveTag(tag)}
                        title="Remove tag"
                      >
                        <iconify-icon icon="lucide:x" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================== 5. PROJECT GALLERY & MEDIA ==================== */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
                <iconify-icon icon="lucide:image" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec5Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec5Sub}</p>
              </div>
            </div>

            <div
              className={styles.uploadDropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadIconWrap}>
                {uploadingImage ? (
                  <iconify-icon icon="lucide:loader" className={styles.spinIcon} />
                ) : (
                  <iconify-icon icon="lucide:upload-cloud" />
                )}
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 14.5, color: "#001f3f", marginBottom: 4 }}>
                  {uploadingImage ? "Uploading..." : t.dropzoneText}
                </strong>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>{t.dropzoneSub}</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/*"
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
            </div>

            {galleryImages.length > 0 && (
              <div className={styles.galleryGrid}>
                {galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <img
                      src={getImageUrl(imgUrl)}
                      alt={`Project Media #${idx + 1}`}
                      className={styles.galleryImg}
                    />
                    <button
                      type="button"
                      className={styles.galleryRemoveBtn}
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove image"
                    >
                      <iconify-icon icon="lucide:trash-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 6. LIVE SHOWCASE CARD PREVIEW ==================== */}
          <div className={styles.previewSection}>
            <div className={styles.sectionHeader} style={{ marginBottom: 18 }}>
              <div className={styles.sectionIcon} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                <iconify-icon icon="lucide:eye" />
              </div>
              <div>
                <h3 className={styles.sectionTitle}>{t.sec6Title}</h3>
                <p className={styles.sectionSubtitle}>{t.sec6Sub}</p>
              </div>
            </div>

            <div className={styles.previewCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                <div>
                  <span style={{ display: "inline-block", background: "rgba(255, 69, 0, 0.1)", color: "#ff4500", fontSize: 11.5, fontWeight: 800, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", marginBottom: 8 }}>
                    {category}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#001f3f" }}>
                    {title || "Project Title Showcase"}
                  </h3>
                  <small style={{ color: "#64748b", fontSize: 13, display: "block", marginTop: 4 }}>
                    {t.publishedBy} <strong>{companyName}</strong> • {clientName || "Corporate Client"}
                  </small>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#dcfce7", color: "#16a34a", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <iconify-icon icon="lucide:check-circle-2" /> {status === "completed" ? "Completed ✓" : "Active"}
                  </span>
                  {budget && (
                    <span style={{ background: "#f1f5f9", color: "#001f3f", padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
                      💰 {Number(budget.replace(/[^0-9.]/g, "")).toLocaleString()} XOF
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 18, color: "#64748b", fontSize: 13, flexWrap: "wrap" }}>
                <span><iconify-icon icon="lucide:map-pin" style={{ color: "#ff4500", marginRight: 4 }} /> {location || "Site Location"}</span>
                <span><iconify-icon icon="lucide:calendar" style={{ color: "#0284c7", marginRight: 4 }} /> {timeline || "Timeline"} ({completionYear})</span>
              </div>

              {description && (
                <p style={{ margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {description}
                </p>
              )}

              {/* LIVE URL BADGE BUTTON IN PREVIEW */}
              {projectUrl && (
                <div>
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#0284c7",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    <iconify-icon icon="lucide:globe" /> {t.visitLiveLink}
                  </a>
                </div>
              )}

              {tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {tags.map((tag) => (
                    <span key={tag} style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", fontSize: 11.5, fontWeight: 700, padding: "4px 8px", borderRadius: 6 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================== ACTION BAR ==================== */}
          <div className={styles.actionBar}>
            <Link href="/dashboard/company/projects" className={styles.cancelBtn}>
              {t.cancel}
            </Link>
            <button
              type="submit"
              className={styles.publishBtn}
              disabled={submitting}
            >
              {submitting ? (
                <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> {t.publishing}</>
              ) : (
                <><iconify-icon icon="lucide:check-circle-2" /> {t.publishBtn}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
