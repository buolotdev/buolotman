"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./services.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { MASTER_CATEGORIES } from "@/app/lib/categories";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Services Management",
    title: "Manage Company Services",
    subtitle: "Publish commercial services your company offers with categories, subcategories, and flexible quotation models.",
    pendingTitle: "Company Account Pending Admin Verification",
    pendingDesc: "Your company registration documents are under administrative review. You can create and save service drafts now; they will become publicly visible once your account is verified.",
    profileBtn: "Company Profile",
    totalServices: "Total Services",
    activeServices: "Active Services",
    draftServices: "Draft Services",
    inactiveServices: "Inactive Services",
    addNewService: "Add New Service Offering",
    editService: "Edit Service Offering",
    serviceName: "Service Title *",
    servicePlaceholder: "e.g. Commercial Building Electrical & Solar PV Installation",
    serviceDeliveryMode: "Service Delivery Mode",
    onsite: "On-site Execution",
    remote: "Remote / Digital",
    hybrid: "Hybrid Delivery",
    category: "Primary Category *",
    subcategory: "Specialized Subcategory *",
    selectSubcategory: "Select specialized trade skill",
    pricingStructure: "Pricing & Quotation Model",
    customerPrefBudget: "Customer's Preference / Quote by Scope (Flexible)",
    startingAtFixed: "Starting at Fixed Base Rate (XOF)",
    contractBased: "Contract-based / Turnkey Delivery",
    projectBased: "Project-based / Milestone Invoicing",
    hourlyDaily: "Hourly / Daily Rate",
    negotiable: "Negotiable / PM Determined",
    estimatedBudget: "Base Starting Price (XOF, Optional)",
    budgetHint: "Optional: Leave blank for scope-based custom quotation.",
    serviceTimeline: "Service Timeline & Mobilization",
    customerPrefTimeline: "Customer's Preference / Flexible Timeline (Default)",
    immediateTimeline: "Immediate / Urgent Dispatch (24-48 hrs)",
    scheduledTimeline: "Scheduled / By Appointment",
    retainerTimeline: "Continuous Retainer / Ongoing Contract",
    description: "Scope of Work & Service Description *",
    descPlaceholder: "Describe your methodology, quality assurance, tooling, safety standards, and project deliverables in detail...",
    status: "Service Visibility Status",
    activeOption: "Active (Visible on Public Profile & Search)",
    draftOption: "Draft (Unpublished Draft)",
    inactiveOption: "Inactive (Temporarily Hidden)",
    saving: "Saving...",
    saveService: "Publish Service Offering",
    updateService: "Save Changes",
    saveDraft: "Save as Draft",
    existingServices: "Commercial Services Catalog",
    loadingServices: "Loading company services...",
    thService: "Service & Trade",
    thCategory: "Category & Subcategory",
    thPricing: "Pricing & Timeline",
    thStatus: "Status",
    thActions: "Actions",
    edit: "Edit",
    activate: "Activate",
    deactivate: "Deactivate",
    delete: "Delete",
    deleteConfirmTitle: "Delete Service Offering?",
    deleteConfirmMsg: "Are you sure you want to permanently remove this service offering?",
    noServices: "No commercial services listed yet.",
    noServicesSub: "Use the professional form above to add your company's core services and specialized trades!",
  },
  fr: {
    eyebrow: "Gestion des Prestations",
    title: "Gérer les Prestations Entreprise",
    subtitle: "Publiez les services proposés par votre entreprise avec catégories, sous-catégories et modèles de devis flexibles.",
    pendingTitle: "Compte Entreprise en Attente de Vérification",
    pendingDesc: "Vos documents d'enregistrement sont en cours d'examen. Vous pouvez créer et enregistrer des brouillons de service dès maintenant ; ils seront publiés dès la validation de votre compte.",
    profileBtn: "Profil Entreprise",
    totalServices: "Total des Services",
    activeServices: "Services Actifs",
    draftServices: "Brouillons",
    inactiveServices: "Services Inactifs",
    addNewService: "Ajouter une Nouvelle Prestation",
    editService: "Modifier la Prestation",
    serviceName: "Intitulé du Service *",
    servicePlaceholder: "ex. Installation Électrique et Solaire Clé en Main",
    serviceDeliveryMode: "Mode d'Intervention",
    onsite: "Sur site / Chantier",
    remote: "À distance / Digital",
    hybrid: "Hybride",
    category: "Catégorie Principale *",
    subcategory: "Sous-catégorie Spécialisée *",
    selectSubcategory: "Sélectionnez le métier / compétence",
    pricingStructure: "Modèle Tarifaire & Devis",
    customerPrefBudget: "Au choix du client / Devis sur mesure (Flexible)",
    startingAtFixed: "À partir d'un tarif fixe (XOF)",
    contractBased: "Sur contrat / Clé en main",
    projectBased: "Par projet / Facturation aux jalons",
    hourlyDaily: "Tarif horaire / journalier",
    negotiable: "Négociable / Déterminé par le chef de projet",
    estimatedBudget: "Prix de base indicatif (XOF, Facultatif)",
    budgetHint: "Facultatif : Laissez vide pour devis personnalisé selon le cahier des charges.",
    serviceTimeline: "Délai & Disponibilité",
    customerPrefTimeline: "Au choix du client / Calendrier flexible (Par défaut)",
    immediateTimeline: "Intervention immédiate / Urgence (24-48h)",
    scheduledTimeline: "Sur rendez-vous planifié",
    retainerTimeline: "Contrat cadre / Prestation continue",
    description: "Description Détaillée & Périmètre d'Intervention *",
    descPlaceholder: "Décrivez vos normes d'exécution, outillage, garanties, sécurité et livrables...",
    status: "Statut de Visibilité",
    activeOption: "Actif (Visible sur l'annuaire public)",
    draftOption: "Brouillon (Non publié)",
    inactiveOption: "Inactif (Masqué temporairement)",
    saving: "Enregistrement...",
    saveService: "Publier la Prestation",
    updateService: "Enregistrer les modifications",
    saveDraft: "Enregistrer en Brouillon",
    existingServices: "Catalogue des Prestations de l'Entreprise",
    loadingServices: "Chargement des prestations...",
    thService: "Prestation & Métier",
    thCategory: "Catégorie & Sous-catégorie",
    thPricing: "Tarification & Délai",
    thStatus: "Statut",
    thActions: "Actions",
    edit: "Modifier",
    activate: "Activer",
    deactivate: "Désactiver",
    delete: "Supprimer",
    deleteConfirmTitle: "Supprimer la prestation ?",
    deleteConfirmMsg: "Êtes-vous sûr de vouloir supprimer définitivement cette prestation ?",
    noServices: "Aucune prestation enregistrée pour le moment.",
    noServicesSub: "Utilisez le formulaire ci-dessus pour ajouter les prestations et compétences clés de votre entreprise !",
  }
};

export default function ServicesManagement() {
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

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: servicesData, loading: servicesLoading, refetch } = useFetch(() => api.getCompanyServices(), []);
  
  const [localServices, setLocalServices] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("boulotman_company_services");
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
        combined.push(local);
      }
    }
    return combined;
  }, [servicesData, localServices]);
  
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const draftServices = services.filter(s => s.status === 'Draft').length;
  const inactiveServices = services.filter(s => s.status === 'Inactive').length;

  const [form, setForm] = useState({
    title: "",
    category: "Civil, Construction & Architecture",
    subcategory: "Masonry & bricklaying",
    delivery_mode: "onsite",
    pricing_model: "Customer's Preference / Quote by Scope",
    base_price: "",
    timeline_mode: "Customer's Preference / Flexible Timeline",
    description: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const isVerified = Boolean(user?.is_verified || (profile as any)?.is_verified);

  // Dynamic subcategories based on chosen category
  const subcategories = useMemo(() => {
    const found = MASTER_CATEGORIES.find(
      c => c.name.toLowerCase() === form.category.toLowerCase() || c.slug === form.category.toLowerCase()
    );
    return found?.skills || [];
  }, [form.category]);

  // When category changes, auto set the first subcategory if not already valid
  const handleCategoryChange = (catName: string) => {
    const found = MASTER_CATEGORIES.find(
      c => c.name.toLowerCase() === catName.toLowerCase() || c.slug === catName.toLowerCase()
    );
    const firstSub = found?.skills?.[0] || "";
    setForm(prev => ({
      ...prev,
      category: catName,
      subcategory: firstSub
    }));
  };

  const handleEdit = (svc: any) => {
    setEditingId(svc.id);
    const matchedCategory = svc.category || "Civil, Construction & Architecture";
    const foundCat = MASTER_CATEGORIES.find(
      c => c.name.toLowerCase() === matchedCategory.toLowerCase() || c.slug === matchedCategory.toLowerCase()
    );

    setForm({
      title: svc.title || "",
      category: foundCat?.name || matchedCategory,
      subcategory: svc.subcategory || foundCat?.skills?.[0] || "",
      delivery_mode: svc.delivery_mode || "onsite",
      pricing_model: svc.pricing_model || "Customer's Preference / Quote by Scope",
      base_price: svc.base_price ? String(svc.base_price) : "",
      timeline_mode: svc.timeline_mode || "Customer's Preference / Flexible Timeline",
      description: svc.description || "",
      status: svc.status || "Active"
    });
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "Civil, Construction & Architecture",
      subcategory: "Masonry & bricklaying",
      delivery_mode: "onsite",
      pricing_model: "Customer's Preference / Quote by Scope",
      base_price: "",
      timeline_mode: "Customer's Preference / Flexible Timeline",
      description: "",
      status: "Active"
    });
  };

  const handleSave = async (overrideStatus?: string) => {
    const targetStatus = overrideStatus || form.status;
    const isSavingAsDraft = targetStatus === "Draft";

    if (!form.title.trim()) {
      toast.warning(lang === "fr" ? "Titre manquant" : "Missing Title", lang === "fr" ? "Veuillez saisir un intitulé pour le service." : "Please enter a title for the service.");
      return;
    }

    // Determine effective status: if unverified and attempting Active, save as Draft with explanation
    let finalStatus = targetStatus;
    if (!isVerified && finalStatus === "Active") {
      finalStatus = "Draft";
    }

    const finalPricing = form.base_price
      ? `${form.pricing_model} - ${Number(form.base_price).toLocaleString()} XOF`
      : form.pricing_model;

    const payload = {
      title: form.title.trim(),
      category: form.category,
      subcategory: form.subcategory,
      delivery_mode: form.delivery_mode,
      pricing_model: finalPricing,
      base_price: form.base_price ? parseFloat(form.base_price) : null,
      timeline_mode: form.timeline_mode,
      description: form.description.trim() || form.title.trim(),
      status: finalStatus
    };

    setSaving(true);
    try {
      try {
        if (editingId) {
          await api.updateCompanyService(editingId, payload);
        } else {
          await api.createCompanyService(payload);
        }
      } catch (apiErr) {
        console.warn("API save notice:", apiErr);
      }

      // Also persist to localStorage
      const currentList = JSON.parse(localStorage.getItem("boulotman_company_services") || "[]");
      let updatedList: any[];
      if (editingId) {
        updatedList = currentList.map((s: any) => s.id === editingId ? { ...s, ...payload } : s);
      } else {
        const newLocalItem = {
          id: Date.now(),
          ...payload,
          created_at: new Date().toISOString()
        };
        updatedList = [newLocalItem, ...currentList];
      }
      localStorage.setItem("boulotman_company_services", JSON.stringify(updatedList));
      setLocalServices(updatedList);

      if (isSavingAsDraft || (!isVerified && targetStatus === "Active")) {
        if (!isVerified && targetStatus === "Active") {
          toast.success(
            lang === "fr" ? "Enregistré comme Brouillon" : "Saved as Draft (Pending Approval)",
            lang === "fr" ? "Votre compte est en attente d'approbation administrateur. Le service est enregistré en brouillon." : "Your company account is awaiting admin approval. The service has been saved as a Draft."
          );
        } else {
          toast.success(
            lang === "fr" ? "Brouillon Enregistré" : "Saved as Draft",
            `"${form.title}"`
          );
        }
      } else {
        toast.success(
          editingId ? (lang === "fr" ? "Service mis à jour" : "Service Updated") : (lang === "fr" ? "Service publié" : "Service Published"),
          `"${form.title}"`
        );
      }

      setEditingId(null);
      setForm({
        title: "",
        category: "Civil, Construction & Architecture",
        subcategory: "Masonry & bricklaying",
        delivery_mode: "onsite",
        pricing_model: "Customer's Preference / Quote by Scope",
        base_price: "",
        timeline_mode: "Customer's Preference / Flexible Timeline",
        description: "",
        status: "Active"
      });
      await refetch();
    } catch (err: any) {
      toast.error(lang === "fr" ? "Échec de l'enregistrement" : "Save failed", err.message || "Failed to save the service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: number, title: string) => {
    const ok = await dialog.confirm({
      title: t.deleteConfirmTitle,
      message: `${t.deleteConfirmMsg} ("${title}")`,
      confirmText: t.delete,
      cancelText: lang === "fr" ? "Annuler" : "Cancel",
      variant: "danger"
    });
    if (!ok) return;

    try {
      try {
        await api.deleteCompanyService(id);
      } catch {}
      const updated = localServices.filter(s => s.id !== id);
      setLocalServices(updated);
      localStorage.setItem("boulotman_company_services", JSON.stringify(updated));
      toast.success(lang === "fr" ? "Service supprimé" : "Service Deleted", title);
      await refetch();
    } catch (err: any) {
      toast.error("Delete failed", err?.message);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      if (newStatus === 'Inactive') {
        const ok = await dialog.confirm({
          title: lang === "fr" ? "Désactiver le service ?" : "Deactivate Service?",
          message: lang === "fr" ? "Cela masquera le service de votre profil actif." : "This will remove the service from your active profile.",
          confirmText: lang === "fr" ? "Désactiver" : "Deactivate",
          cancelText: lang === "fr" ? "Annuler" : "Cancel",
          variant: "danger"
        });
        if (ok) {
          try {
            await api.updateCompanyService(id, { status: 'Inactive' });
          } catch {}
          const updated = localServices.map(s => s.id === id ? { ...s, status: 'Inactive' } : s);
          setLocalServices(updated);
          localStorage.setItem("boulotman_company_services", JSON.stringify(updated));
          toast.success(lang === "fr" ? "Service désactivé" : "Service deactivated", lang === "fr" ? "Le service a été masqué." : "The service has been hidden.");
          await refetch();
        }
      } else {
        if (!isVerified) {
          toast.warning(
            lang === "fr" ? "En attente de vérification" : "Pending Verification",
            lang === "fr" ? "Votre compte doit être approuvé par l'administrateur pour activer ce service." : "Your company account must be approved by admin before making services active."
          );
          return;
        }
        try {
          await api.updateCompanyService(id, { status: 'Active' });
        } catch {}
        const updated = localServices.map(s => s.id === id ? { ...s, status: 'Active' } : s);
        setLocalServices(updated);
        localStorage.setItem("boulotman_company_services", JSON.stringify(updated));
        toast.success(lang === "fr" ? "Service activé" : "Service activated", lang === "fr" ? "Le service est maintenant visible." : "The service is now visible to clients.");
        await refetch();
      }
    } catch (err: any) {
      toast.error("Action failed", err.message);
    }
  };

  return (
    <div className={layoutStyles.content}>
      
      {/* BLUE BANNER HEADER */}
      <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
        <div className={layoutStyles.welcomeContent}>
          <p className={layoutStyles.eyebrow}>{t.eyebrow}</p>
          <h2 className={layoutStyles.welcomeTitle}>{t.title}</h2>
          <p className={layoutStyles.welcomeSubtitle}>{t.subtitle}</p>
        </div>
      </section>

      {!isVerified && (
        <div style={{
          background: "#fffbeb",
          border: "1.5px solid #fcd34d",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
              <iconify-icon icon="lucide:alert-triangle" />
            </div>
            <div>
              <strong style={{ color: "#92400e", fontSize: "14.5px", display: "block", marginBottom: "2px" }}>
                {t.pendingTitle}
              </strong>
              <p style={{ margin: 0, color: "#b45309", fontSize: "13px" }}>
                {t.pendingDesc}
              </p>
            </div>
          </div>
          <Link href="/dashboard/company/profile" style={{
            background: "#d97706",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            textDecoration: "none",
            whiteSpace: "nowrap"
          }}>
            {t.profileBtn}
          </Link>
        </div>
      )}

      {/* OVERVIEW STATS */}
      <div className={styles.overview} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className={styles.stat}>
          <span>{t.totalServices}</span>
          <h3>{servicesLoading ? "..." : totalServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>{t.activeServices}</span>
          <h3 style={{ color: "#16a34a" }}>{servicesLoading ? "..." : activeServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>{t.draftServices}</span>
          <h3 style={{ color: "#d97706" }}>{servicesLoading ? "..." : draftServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>{t.inactiveServices}</span>
          <h3 style={{ color: "#64748b" }}>{servicesLoading ? "..." : inactiveServices}</h3>
        </div>
      </div>

      {/* ADD / EDIT SERVICE FORM */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <iconify-icon icon={editingId ? "lucide:edit-3" : "lucide:plus-circle"} style={{ color: "#ff4500", fontSize: 22 }} />
            {editingId ? t.editService : t.addNewService}
          </h3>
          {editingId && (
            <button
              type="button"
              className={styles.outline}
              onClick={handleCancelEdit}
              style={{ padding: "6px 14px", fontSize: 13 }}
            >
              {lang === "fr" ? "Annuler la modification" : "Cancel Edit"}
            </button>
          )}
        </div>

        {/* 1. Service Title */}
        <label className={styles.label}>{t.serviceName}</label>
        <input 
          className={styles.input} 
          placeholder={t.servicePlaceholder} 
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          required
        />

        {/* 2. Service Delivery Mode (Pills) */}
        <label className={styles.label}>{t.serviceDeliveryMode}</label>
        <div className={styles.pills}>
          <label>
            <input 
              type="radio" 
              name="serviceDeliveryMode" 
              value="onsite" 
              checked={form.delivery_mode === "onsite"}
              onChange={e => setForm({...form, delivery_mode: e.target.value})}
            />
            <span><iconify-icon icon="lucide:map-pin" /> {t.onsite}</span>
          </label>
          <label>
            <input 
              type="radio" 
              name="serviceDeliveryMode" 
              value="remote" 
              checked={form.delivery_mode === "remote"}
              onChange={e => setForm({...form, delivery_mode: e.target.value})}
            />
            <span><iconify-icon icon="lucide:globe" /> {t.remote}</span>
          </label>
          <label>
            <input 
              type="radio" 
              name="serviceDeliveryMode" 
              value="hybrid" 
              checked={form.delivery_mode === "hybrid"}
              onChange={e => setForm({...form, delivery_mode: e.target.value})}
            />
            <span><iconify-icon icon="lucide:repeat" /> {t.hybrid}</span>
          </label>
        </div>

        {/* 3. Dynamic Category & Subcategory */}
        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>{t.category}</label>
            <select 
              className={styles.select} 
              value={form.category} 
              onChange={e => handleCategoryChange(e.target.value)}
              required
            >
              {MASTER_CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>{t.subcategory}</label>
            <select 
              className={styles.select} 
              value={form.subcategory} 
              onChange={e => setForm({...form, subcategory: e.target.value})}
              required
            >
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Pricing Model & Optional Base Price */}
        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>{t.pricingStructure}</label>
            <select 
              className={styles.select} 
              value={form.pricing_model} 
              onChange={e => setForm({...form, pricing_model: e.target.value})}
              required
            >
              <option value="Customer's Preference / Quote by Scope">{t.customerPrefBudget}</option>
              <option value="Starting at Fixed Base Rate">{t.startingAtFixed}</option>
              <option value="Contract-based / Turnkey">{t.contractBased}</option>
              <option value="Project-based / Milestones">{t.projectBased}</option>
              <option value="Hourly / Daily Rate">{t.hourlyDaily}</option>
              <option value="Negotiable / PM Determined">{t.negotiable}</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>{t.estimatedBudget}</label>
            <input 
              type="number"
              className={styles.input} 
              placeholder="e.g. 250000 (Optional)"
              value={form.base_price}
              onChange={e => setForm({...form, base_price: e.target.value})}
            />
          </div>
        </div>

        {/* 5. Service Timeline & Visibility Status */}
        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>{t.serviceTimeline}</label>
            <select 
              className={styles.select} 
              value={form.timeline_mode} 
              onChange={e => setForm({...form, timeline_mode: e.target.value})}
            >
              <option value="Customer's Preference / Flexible Timeline">{t.customerPrefTimeline}</option>
              <option value="Immediate / Urgent Dispatch (24-48 hrs)">{t.immediateTimeline}</option>
              <option value="Scheduled / By Appointment">{t.scheduledTimeline}</option>
              <option value="Continuous Retainer / Ongoing">{t.retainerTimeline}</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>{t.status}</label>
            <select 
              className={styles.select} 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})}
            >
              <option value="Active">{t.activeOption}</option>
              <option value="Draft">{t.draftOption}</option>
              <option value="Inactive">{t.inactiveOption}</option>
            </select>
          </div>
        </div>

        {/* 6. Comprehensive Description */}
        <label className={styles.label}>{t.description}</label>
        <textarea 
          className={styles.textarea} 
          placeholder={t.descPlaceholder} 
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
          rows={4}
          required
        />

        {/* Form Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" className={styles.primary} onClick={() => handleSave()} disabled={saving}>
            <iconify-icon icon={saving ? "lucide:loader-2" : "lucide:check"} className={saving ? styles.spinIcon : ""} />
            {saving ? t.saving : editingId ? t.updateService : t.saveService}
          </button>
          {!editingId && (
            <button 
              type="button" 
              className={styles.outline} 
              onClick={() => handleSave('Draft')} 
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderColor: "#cbd5e1",
                background: "#f8fafc"
              }}
            >
              <iconify-icon icon="lucide:file-text" />
              {t.saveDraft}
            </button>
          )}
          {editingId && (
            <button type="button" className={styles.outline} onClick={handleCancelEdit}>
              {lang === "fr" ? "Annuler" : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {/* SERVICES LIST TABLE */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>{t.existingServices}</h3>
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
            {services.length} {services.length === 1 ? "Offering" : "Offerings"}
          </span>
        </div>

        {servicesLoading ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>{t.loadingServices}</div>
        ) : services.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.thService}</th>
                  <th>{t.thCategory}</th>
                  <th>{t.thPricing}</th>
                  <th>{t.thStatus}</th>
                  <th>{t.thActions}</th>
                </tr>
              </thead>
              <tbody>
                {services.map(svc => (
                  <tr key={svc.id}>
                    <td>
                      <div>
                        <strong>{svc.title}</strong>
                        <div style={{ marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                          <span className={styles.modePill}>
                            <iconify-icon icon={svc.delivery_mode === "remote" ? "lucide:globe" : svc.delivery_mode === "hybrid" ? "lucide:repeat" : "lucide:map-pin"} />
                            {svc.delivery_mode || "onsite"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600, color: "#001f3f", display: "block" }}>{svc.category || "General Contracting"}</span>
                        {svc.subcategory && (
                          <span className={styles.subcatBadge}>
                            {svc.subcategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: "#001f3f" }}>{svc.pricing_model || "Quote-based"}</span>
                        {svc.timeline_mode && (
                          <small style={{ display: "block", color: "#64748b", fontSize: 11.5, marginTop: 2 }}>
                            ⏱️ {svc.timeline_mode}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.status} ${
                        svc.status === 'Draft' 
                          ? styles.draftStatus 
                          : svc.status === 'Inactive' 
                            ? styles.inactiveStatus 
                            : styles.activeStatus
                      }`}>
                        {svc.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button className={styles.actionBtn} onClick={() => handleEdit(svc)} title={t.edit}>
                          <iconify-icon icon="lucide:edit-2" style={{ fontSize: "14px" }}></iconify-icon>
                          {t.edit}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${svc.status === 'Inactive' ? styles.activateBtn : styles.deactivateBtn}`}
                          onClick={() => toggleStatus(svc.id, svc.status || 'Active')}
                          title={svc.status === 'Inactive' ? t.activate : t.deactivate}
                        >
                          <iconify-icon icon={svc.status === 'Inactive' ? "lucide:check-circle" : "lucide:eye-off"} style={{ fontSize: "14px" }}></iconify-icon>
                          {svc.status === 'Inactive' ? t.activate : t.deactivate}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteService(svc.id, svc.title)}
                          title={t.delete}
                        >
                          <iconify-icon icon="lucide:trash-2" style={{ fontSize: "14px" }}></iconify-icon>
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 16px", color: "#64748b" }}>
            <iconify-icon icon="lucide:layers" style={{ fontSize: "36px", color: "#cbd5e1", display: "inline-block", marginBottom: "8px" }} />
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>{t.noServices}</p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>{t.noServicesSub}</p>
          </div>
        )}
      </div>
      
    </div>
  );
}


