"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import styles from "./page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

type MediaItem = {
  file_url: string;
  file_name: string;
  media_type: "image" | "video" | "document";
  content_type: string;
};

type ServiceForm = {
  title: string;
  category: string;
  description: string;
  service_type: "onsite" | "remote";
  coverage_area: string;
  pricing_model: "fixed" | "hourly" | "range";
  pricing_min: string;
  pricing_max: string;
  is_active: boolean;
  media: MediaItem[];
};

const initialForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  service_type: "onsite",
  coverage_area: "",
  pricing_model: "fixed",
  pricing_min: "",
  pricing_max: "",
  is_active: true,
  media: [],
};

const translations: Record<string, Record<string, any>> = {
  en: {
    heroEyebrow: "Manage Your Listings",
    title: "My Services",
    subtitle: "Create the services you want to offer, manage pricing models, and publish them to get hired by verified clients.",
    newService: "+ New service",
    backDashboard: "Back to dashboard",
    pendingTitle: "Account Verification Pending",
    pendingDesc: "Your profile is currently under review by the admin team. Once verified, you will be able to publish public services and start receiving job requests.",
    uploadDocs: "Upload Documents",
    activeServices: "Active services",
    totalListings: "Total listings",
    verifiedAccount: "Verified account",
    yes: "Yes",
    no: "No",
    listedServices: "Listed services",
    loadingServices: "Loading services...",
    noServicesYet: "No services yet.",
    addFirstService: "Add your first service to appear in search results.",
    live: "Live",
    hidden: "Hidden",
    noDesc: "No description provided.",
    coverageNotSet: "Coverage not set",
    edit: "Edit",
    delete: "Delete",
    deleting: "Deleting...",
    editService: "Edit service",
    cancel: "Cancel",
    serviceTitle: "Service title",
    category: "Category",
    selectCategory: "Select category",
    description: "Description",
    serviceType: "Service type",
    onsite: "On-site",
    remote: "Remote",
    pricingModel: "Pricing model",
    fixed: "Fixed",
    hourly: "Hourly",
    range: "Range",
    coverageArea: "Coverage area",
    coveragePlaceholder: "City, district, or region",
    fixedPrice: "Price (XOF)",
    hourlyRate: "Hourly rate (XOF)",
    minPrice: "Minimum price (XOF)",
    maxPrice: "Maximum price (XOF)",
    visibilityStatus: "Listing visibility",
    activeLive: "Active (Visible in search)",
    inactiveHidden: "Inactive (Hidden)",
    photosMedia: "Work photos & Media",
    uploadPhotos: "Upload Photos",
    uploadVideos: "Upload Videos",
    certificatesDocs: "Certificates & Docs",
    saving: "Saving...",
    updateService: "Update service",
    selectToEdit: "Select a service to edit",
    selectToEditDesc: "Click \"Edit\" on any of your services to modify them here, or click \"New service\" to create a fresh one."
  },
  fr: {
    heroEyebrow: "Gérer Vos Prestations",
    title: "Mes Services",
    subtitle: "Créez les services que vous souhaitez proposer, gérez vos tarifs et publiez-les pour être recruté par des clients vérifiés.",
    newService: "+ Nouveau service",
    backDashboard: "Retour au tableau de bord",
    pendingTitle: "Vérification du Compte en Cours",
    pendingDesc: "Votre profil est en cours d'examen par l'équipe administrative. Une fois validé, vous pourrez publier des services et recevoir des demandes de mission.",
    uploadDocs: "Télécharger les documents",
    activeServices: "Services actifs",
    totalListings: "Total des annonces",
    verifiedAccount: "Compte vérifié",
    yes: "Oui",
    no: "Non",
    listedServices: "Services répertoriés",
    loadingServices: "Chargement des services...",
    noServicesYet: "Aucun service pour le moment.",
    addFirstService: "Ajoutez votre premier service pour apparaître dans les résultats de recherche.",
    live: "En ligne",
    hidden: "Masqué",
    noDesc: "Aucune description fournie.",
    coverageNotSet: "Zone non définie",
    edit: "Modifier",
    delete: "Supprimer",
    deleting: "Suppression...",
    editService: "Modifier le service",
    cancel: "Annuler",
    serviceTitle: "Titre du service",
    category: "Catégorie",
    selectCategory: "Sélectionner une catégorie",
    description: "Description",
    serviceType: "Type de prestation",
    onsite: "Sur place",
    remote: "À distance",
    pricingModel: "Modèle de tarification",
    fixed: "Tarif Fixe",
    hourly: "Tarif Horaire",
    range: "Fourchette de prix",
    coverageArea: "Zone d'intervention",
    coveragePlaceholder: "Ville, quartier ou région",
    fixedPrice: "Prix fixe (XOF)",
    hourlyRate: "Tarif horaire (XOF)",
    minPrice: "Prix minimum (XOF)",
    maxPrice: "Prix maximum (XOF)",
    visibilityStatus: "Visibilité de l'annonce",
    activeLive: "Actif (Visible dans les recherches)",
    inactiveHidden: "Inactif (Masqué)",
    photosMedia: "Photos & Réalisations",
    uploadPhotos: "Ajouter des photos",
    uploadVideos: "Ajouter des vidéos",
    certificatesDocs: "Certificats & Documents",
    saving: "Enregistrement...",
    updateService: "Mettre à jour le service",
    selectToEdit: "Sélectionnez un service à modifier",
    selectToEditDesc: "Cliquez sur « Modifier » sur l'un de vos services pour l'éditer ici, ou sur « Nouveau service » pour en créer un."
  }
};

export default function TechnicianServicesPage() {
  const router = useRouter();
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: servicesData, loading, refetch } = useFetch(() => api.getTechnicianServices(), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingType, setUploadingType] = useState<"image" | "video" | "document" | null>(null);
  const [localServices, setLocalServices] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("boulotman_technician_services");
      if (stored) {
        setLocalServices(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const services = useMemo(() => {
    const apiList = Array.isArray(servicesData) ? servicesData : [];
    const combined = [...apiList];
    const existingTitles = new Set(apiList.map((s: any) => (s.title || "").toLowerCase().trim()));
    const existingIds = new Set(apiList.map((s: any) => s.id));

    for (const local of localServices) {
      if (!existingIds.has(local.id) && !existingTitles.has((local.title || "").toLowerCase().trim())) {
        combined.push({
          ...local,
          category_name: local.category_name || local.category_title || local.category || (Array.isArray(local.tags) ? local.tags.join(", ") : "General"),
          service_type: local.service_type || (local.mode?.toLowerCase() === "remote" ? "remote" : "onsite"),
          coverage_area: local.coverage_area || local.location || "National",
          pricing_model: local.pricing_model || (local.hourly_rate ? "hourly" : "fixed"),
          pricing_min: local.pricing_min ?? local.hourly_rate ?? local.daily_rate ?? 0,
          pricing_max: local.pricing_max ?? local.daily_rate ?? null,
          is_active: local.is_active !== false,
        });
      }
    }
    return combined;
  }, [servicesData, localServices]);

  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []).filter((c: any) => !c.parent),
    [categoriesData]
  );

  const isVerified = Boolean(user?.is_verified || (user as any)?.technician_profile?.is_verified);

  const editService = (service: any) => {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      category: service.category ? String(service.category) : "",
      description: service.description || "",
      service_type: service.service_type || "onsite",
      coverage_area: service.coverage_area || "",
      pricing_model: service.pricing_model || "fixed",
      pricing_min: service.pricing_min != null ? String(service.pricing_min) : "",
      pricing_max: service.pricing_max != null ? String(service.pricing_max) : "",
      is_active: service.is_active ?? true,
      media: Array.isArray(service.media) ? service.media : [],
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleNewServiceClick = () => {
    if (!isVerified) {
      toast.warning(
        lang === "fr" ? "En attente de vérification" : "Wait for Verification",
        lang === "fr" ? "Veuillez patienter pendant la validation de votre profil par l'administrateur. Une fois approuvé, vous pourrez publier des services." : "Please wait for verification. Your account is currently under review by admin. Once approved, you can create new services."
      );
      return;
    }
    router.push("/dashboard/technician/services/new");
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "document") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingType(type);
    try {
      const newMedia: MediaItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 50 * 1024 * 1024) {
          toast.error("File too large", `${file.name} exceeds the 50MB limit.`);
          continue;
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newMedia.push({
          file_url: dataUrl,
          file_name: file.name,
          media_type: type,
          content_type: file.type || (type === "image" ? "image/jpeg" : type === "video" ? "video/mp4" : "application/pdf"),
        });
      }

      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...newMedia],
      }));
      toast.success("Files uploaded", `${newMedia.length} file(s) added.`);
    } catch (err: any) {
      toast.error("Upload failed", err?.message || "Could not read file.");
    } finally {
      setUploadingType(null);
      e.target.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, idx) => idx !== index),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        category: form.category ? Number(form.category) : null,
        pricing_min: form.pricing_min ? Number(form.pricing_min) : null,
        pricing_max: form.pricing_max ? Number(form.pricing_max) : null,
      };

      if (editingId) {
        await api.updateTechnicianService(editingId, payload);
        toast.success("Service updated", "Your listing has been saved.");
      } else {
        await api.createTechnicianService(payload);
        toast.success("Service created", "Your service is now listed.");
      }
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error("Save failed", err?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(serviceId);
    try {
      try {
        await api.deleteTechnicianService(serviceId);
      } catch (apiErr) {
        console.warn("API delete notice:", apiErr);
      }
      const nextLocal = localServices.filter((s: any) => s.id !== serviceId);
      setLocalServices(nextLocal);
      localStorage.setItem("boulotman_technician_services", JSON.stringify(nextLocal));

      toast.success("Service deleted", "The listing was removed.");
      if (editingId === serviceId) resetForm();
      refetch();
    } catch (err: any) {
      toast.error("Delete failed", err?.message || "Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className={styles.main}>
        <DashboardHeader
          onMenuClick={() => setMobileNavOpen(true)}
        />

        {/* BLUE GRADIENT HERO BANNER */}
        <section style={{
          background: "linear-gradient(135deg, #001f3f 0%, #0b3c6f 100%)",
          borderRadius: "24px",
          padding: "32px 36px",
          color: "#fff",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
          boxShadow: "0 14px 36px rgba(0, 31, 63, 0.15)"
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 69, 0, 0.2)",
              color: "#ff7b47",
              border: "1px solid rgba(255, 69, 0, 0.35)",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "12px"
            }}>
              <iconify-icon icon="lucide:layers" /> {t.heroEyebrow}
            </div>
            <h1 style={{ color: "#ffffff", fontSize: "2rem", fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
              {t.title}
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "14.5px", margin: 0, maxWidth: "560px", lineHeight: 1.5 }}>
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleNewServiceClick}
              style={{
                background: "#FF4500",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "14.5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 20px rgba(255, 69, 0, 0.3)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              <iconify-icon icon="lucide:plus-circle" style={{ fontSize: "18px" }} />
              {t.newService}
            </button>
            <Link
              href="/dashboard/technician"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                padding: "14px 22px",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              {t.backDashboard}
            </Link>
          </div>
        </section>

        {!isVerified && (
          <div style={{
            background: "#fffbeb",
            border: "1.5px solid #fcd34d",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.08)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0
              }}>
                <iconify-icon icon="lucide:clock" />
              </div>
              <div>
                <strong style={{ color: "#92400e", fontSize: "15px", display: "block", marginBottom: "3px" }}>
                  {t.pendingTitle}
                </strong>
                <p style={{ margin: 0, color: "#b45309", fontSize: "13.5px", lineHeight: 1.5 }}>
                  {t.pendingDesc}
                </p>
              </div>
            </div>
            <Link href="/dashboard/technician/profile" style={{
              background: "#FF4500",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: "13.5px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(255, 69, 0, 0.25)"
            }}>
              <iconify-icon icon="lucide:upload" /> {t.uploadDocs}
            </Link>
          </div>
        )}

        <section className={styles.summaryGrid}>
          <article className={styles.statCard}>
            <span>{t.activeServices}</span>
            <strong>{services.filter((s: any) => s.is_active).length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>{t.totalListings}</span>
            <strong>{services.length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>{t.verifiedAccount}</span>
            <strong>{user?.is_verified ? t.yes : t.no}</strong>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.listPanel}>
            <div className={styles.panelHeader}>
              <h2>{t.listedServices}</h2>
            </div>

            {loading ? (
              <div className={styles.emptyState}>{t.loadingServices}</div>
            ) : services.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t.noServicesYet}</p>
                <span>{t.addFirstService}</span>
              </div>
            ) : (
              <div className={styles.serviceList}>
                {services.map((service: any) => (
                  <article key={service.id} className={`${styles.serviceCard} ${editingId === service.id ? styles.serviceCardActive : ""}`}>
                    <div className={styles.serviceTop}>
                      <div>
                        <h3>{service.title}</h3>
                        <p>{service.category_name || "Uncategorized"} • {service.service_type} • {service.pricing_model}</p>
                      </div>
                      <span className={`${styles.statusPill} ${service.is_active ? styles.statusLive : styles.statusMuted}`}>
                        {service.is_active ? t.live : t.hidden}
                      </span>
                    </div>
                    <p className={styles.serviceDescription}>{service.description || t.noDesc}</p>
                    <div className={styles.serviceMeta}>
                      <span>{service.coverage_area || t.coverageNotSet}</span>
                      <span>
                        {service.pricing_min != null ? Number(service.pricing_min).toLocaleString() : "0"}
                        {service.pricing_max != null ? ` - ${Number(service.pricing_max).toLocaleString()}` : ""}
                        {" XOF"}
                      </span>
                    </div>
                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.secondaryButton} onClick={() => editService(service)}>{t.edit}</button>
                      <button type="button" className={styles.dangerButton} onClick={() => removeService(service.id)} disabled={deletingId === service.id}>
                        {deletingId === service.id ? t.deleting : t.delete}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {editingId ? (
          <form className={styles.formPanel} onSubmit={submit}>
            <div className={styles.panelHeader}>
              <h2>{t.editService}</h2>
              <button type="button" className={styles.ghostButton} onClick={resetForm}>{t.cancel}</button>
            </div>

            <label className={styles.field}>
              <span>{t.serviceTitle}</span>
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            </label>

            <label className={styles.field}>
              <span>{t.category}</span>
              <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option value="">{t.selectCategory}</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{t.description}</span>
              <textarea rows={5} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            </label>

            <div className={styles.doubleGrid}>
              <label className={styles.field}>
                <span>{t.serviceType}</span>
                <select value={form.service_type} onChange={(e) => setForm((prev) => ({ ...prev, service_type: e.target.value as ServiceForm["service_type"] }))}>
                  <option value="onsite">{t.onsite}</option>
                  <option value="remote">{t.remote}</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>{t.pricingModel}</span>
                <select value={form.pricing_model} onChange={(e) => setForm((prev) => ({ ...prev, pricing_model: e.target.value as ServiceForm["pricing_model"] }))}>
                  <option value="fixed">{t.fixed}</option>
                  <option value="hourly">{t.hourly}</option>
                  <option value="range">{t.range}</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>{t.coverageArea}</span>
              <input value={form.coverage_area} onChange={(e) => setForm((prev) => ({ ...prev, coverage_area: e.target.value }))} placeholder={t.coveragePlaceholder} />
            </label>

            <div className={styles.doubleGrid}>
              <label className={styles.field}>
                <span>{t.minPrice}</span>
                <input type="number" value={form.pricing_min} onChange={(e) => setForm((prev) => ({ ...prev, pricing_min: e.target.value }))} placeholder="0" />
              </label>
              <label className={styles.field}>
                <span>{t.maxPrice}</span>
                <input type="number" value={form.pricing_max} onChange={(e) => setForm((prev) => ({ ...prev, pricing_max: e.target.value }))} placeholder="0" />
              </label>
            </div>

            <label className={styles.toggleRow}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
              <span>Publish this service</span>
            </label>

            {/* ── Media Attachments ── */}
            <div className={styles.mediaSection}>
              <span className={styles.mediaSectionLabel}>{t.photosMedia}</span>

              <div className={styles.mediaButtonRow}>
                <label className={styles.mediaTypeBtn} htmlFor="svc-img-input" data-type="image">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#e8f4fd" }}>
                    <iconify-icon icon="lucide:image" style={{ fontSize: 22, color: "#0284c7" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>{t.uploadPhotos}</strong>
                    <small>JPG, PNG, WebP · Max 50MB</small>
                  </div>
                  {uploadingType === "image" && <span className={styles.uploadSpinner} />}
                  <input
                    id="svc-img-input" type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple style={{ display: "none" }}
                    onChange={(e) => handleMediaUpload(e, "image")}
                    disabled={uploadingType !== null}
                  />
                </label>

                <label className={styles.mediaTypeBtn} htmlFor="svc-vid-input" data-type="video">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#fdf2f8" }}>
                    <iconify-icon icon="lucide:video" style={{ fontSize: 22, color: "#9333ea" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>{t.uploadVideos}</strong>
                    <small>MP4, MOV · Max 50MB</small>
                  </div>
                  {uploadingType === "video" && <span className={styles.uploadSpinner} />}
                  <input
                    id="svc-vid-input" type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    multiple style={{ display: "none" }}
                    onChange={(e) => handleMediaUpload(e, "video")}
                    disabled={uploadingType !== null}
                  />
                </label>

                <label className={styles.mediaTypeBtn} htmlFor="svc-doc-input" data-type="document">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#fff7ed" }}>
                    <iconify-icon icon="lucide:file-badge" style={{ fontSize: 22, color: "#ea580c" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>{t.certificatesDocs}</strong>
                    <small>PDF, DOC, DOCX · Max 50MB</small>
                  </div>
                  {uploadingType === "document" && <span className={styles.uploadSpinner} />}
                  <input
                    id="svc-doc-input" type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    multiple style={{ display: "none" }}
                    onChange={(e) => handleMediaUpload(e, "document")}
                    disabled={uploadingType !== null}
                  />
                </label>
              </div>

              {form.media.length > 0 && (
                <div className={styles.mediaPreviewGrid}>
                  {form.media.map((item, idx) => (
                    <div key={idx} className={styles.mediaPreviewItem}>
                      {item.media_type === "image" ? (
                        <img src={item.file_url} alt={item.file_name} className={styles.mediaThumb} />
                      ) : item.media_type === "video" ? (
                        <div className={styles.mediaIconWrap} style={{ background: "#fdf2f8" }}>
                          <iconify-icon icon="lucide:video" style={{ fontSize: 28, color: "#9333ea" }} />
                        </div>
                      ) : (
                        <div className={styles.mediaIconWrap} style={{ background: "#fff7ed" }}>
                          <iconify-icon icon="lucide:file-badge" style={{ fontSize: 28, color: "#ea580c" }} />
                        </div>
                      )}
                      <p className={styles.mediaFileName}>{item.file_name}</p>
                      <button type="button" className={styles.mediaRemoveBtn} onClick={() => removeMedia(idx)} title="Remove">
                        <iconify-icon icon="lucide:x" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.primaryButton} disabled={saving || uploadingType !== null}>
              {saving ? t.saving : t.updateService}
            </button>
          </form>
          ) : (
            <div className={styles.emptyFormPlaceholder} style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              background: "#fff", 
              borderRadius: 24, 
              border: "1px dashed #cbd5e1",
              color: "#64748b",
              padding: 40,
              textAlign: "center"
            }}>
              <div>
                <iconify-icon icon="lucide:mouse-pointer-click" style={{ fontSize: 40, marginBottom: 16, color: "#94a3b8" }}></iconify-icon>
                <h3>{t.selectToEdit}</h3>
                <p>{t.selectToEditDesc}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
