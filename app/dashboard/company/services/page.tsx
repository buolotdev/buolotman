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
    title: "Manage Services",
    subtitle: "Publish the services your company offers. Clients will see these on your public profile.",
    pendingTitle: "Company Account Pending Admin Verification",
    pendingDesc: "Your company registration documents are under administrative review. You can create and save service drafts now; they will become publicly visible once your account is verified.",
    profileBtn: "Company Profile",
    totalServices: "Total Services",
    activeServices: "Active Services",
    draftServices: "Draft Services",
    inactiveServices: "Inactive Services",
    addNewService: "Add New Service",
    serviceName: "Service Name",
    servicePlaceholder: "e.g. Commercial Building Construction",
    category: "Category",
    pricingModel: "Pricing Model",
    quoteBased: "Quote-based",
    fixedPrice: "Fixed Price",
    hourly: "Hourly",
    description: "Description",
    descPlaceholder: "Describe the service in detail",
    status: "Status",
    activeOption: "Active (Visible to clients)",
    draftOption: "Draft (Unpublished Draft)",
    inactiveOption: "Inactive (Hidden)",
    saving: "Saving...",
    saveService: "Publish Service",
    saveDraft: "Save as Draft",
    existingServices: "Existing Services",
    loadingServices: "Loading services...",
    thService: "Service",
    thCategory: "Category",
    thPricing: "Pricing",
    thStatus: "Status",
    thActions: "Actions",
    edit: "Edit",
    activate: "Activate",
    deactivate: "Deactivate",
    noServices: "No services found.",
    noServicesSub: "Add your first corporate service using the form above!",
  },
  fr: {
    eyebrow: "Gestion des Prestations",
    title: "Gérer les Services",
    subtitle: "Publiez les services proposés par votre entreprise. Les clients les verront sur votre profil public.",
    pendingTitle: "Compte Entreprise en Attente de Vérification",
    pendingDesc: "Vos documents d'enregistrement sont en cours d'examen. Vous pouvez créer et enregistrer des brouillons de service dès maintenant ; ils seront publiés dès la validation de votre compte.",
    profileBtn: "Profil Entreprise",
    totalServices: "Total des Services",
    activeServices: "Services Actifs",
    draftServices: "Brouillons",
    inactiveServices: "Services Inactifs",
    addNewService: "Ajouter un Nouveau Service",
    serviceName: "Nom de la prestation",
    servicePlaceholder: "ex. Construction de bâtiments commerciaux",
    category: "Catégorie",
    pricingModel: "Modèle de Tarification",
    quoteBased: "Sur devis",
    fixedPrice: "Prix Fixe",
    hourly: "Horaire",
    description: "Description",
    descPlaceholder: "Décrivez la prestation en détail",
    status: "Statut",
    activeOption: "Actif (Visible pour les clients)",
    draftOption: "Brouillon (Non publié)",
    inactiveOption: "Inactif (Masqué)",
    saving: "Enregistrement...",
    saveService: "Publier le Service",
    saveDraft: "Enregistrer en Brouillon",
    existingServices: "Services Existants",
    loadingServices: "Chargement des services...",
    thService: "Service",
    thCategory: "Catégorie",
    thPricing: "Tarification",
    thStatus: "Statut",
    thActions: "Actions",
    edit: "Modifier",
    activate: "Activer",
    deactivate: "Désactiver",
    noServices: "Aucun service trouvé.",
    noServicesSub: "Ajoutez votre premier service entreprise avec le formulaire ci-dessus !",
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
    category: "Construction",
    pricing_model: "Quote-based",
    description: "",
    status: "Active"
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const isVerified = Boolean(user?.is_verified || (profile as any)?.is_verified);

  const handleEdit = (svc: any) => {
    setEditingId(svc.id);
    setForm({
      title: svc.title || "",
      category: svc.category || "Construction",
      pricing_model: svc.pricing_model || "Quote-based",
      description: svc.description || "",
      status: svc.status || "Active"
    });
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "Construction",
      pricing_model: "Quote-based",
      description: "",
      status: "Active"
    });
  };

  const handleSave = async (overrideStatus?: string) => {
    const targetStatus = overrideStatus || form.status;
    const isSavingAsDraft = targetStatus === "Draft";

    if (!form.title.trim()) {
      toast.warning(lang === "fr" ? "Titre manquant" : "Missing title", lang === "fr" ? "Veuillez saisir un nom de service." : "Please enter a service name.");
      return;
    }

    // Determine effective status: if unverified and attempting Active, save as Draft with explanation
    let finalStatus = targetStatus;
    if (!isVerified && finalStatus === "Active") {
      finalStatus = "Draft";
    }

    const payload = {
      ...form,
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
        category: "Construction",
        pricing_model: "Quote-based",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>
            {editingId ? (lang === "fr" ? "Modifier le Service" : "Edit Service") : t.addNewService}
          </h3>
          {editingId && (
            <button
              type="button"
              className={styles.outline}
              onClick={handleCancelEdit}
              style={{ padding: "6px 14px", fontSize: 13 }}
            >
              {lang === "fr" ? "Annuler" : "Cancel Edit"}
            </button>
          )}
        </div>

        <label className={styles.label}>{t.serviceName}</label>
        <input 
          className={styles.input} 
          placeholder={t.servicePlaceholder} 
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>{t.category}</label>
            <select className={styles.select} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {MASTER_CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.label}>{t.pricingModel}</label>
            <select className={styles.select} value={form.pricing_model} onChange={e => setForm({...form, pricing_model: e.target.value})}>
              <option value="Quote-based">{t.quoteBased}</option>
              <option value="Fixed Price">{t.fixedPrice}</option>
              <option value="Hourly">{t.hourly}</option>
            </select>
          </div>
        </div>

        <label className={styles.label}>{t.description}</label>
        <textarea 
          className={styles.textarea} 
          placeholder={t.descPlaceholder}
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
        />

        <label className={styles.label}>{t.status}</label>
        <select className={styles.select} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="Active">{t.activeOption}</option>
          <option value="Draft">{t.draftOption}</option>
          <option value="Inactive">{t.inactiveOption}</option>
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          <button className={styles.primary} onClick={() => handleSave()} disabled={saving}>
            {saving ? t.saving : editingId ? (lang === "fr" ? "Mettre à jour le service" : "Update Service") : t.saveService}
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

      {/* SERVICES LIST */}
      <div className={styles.card}>
        <h3>{t.existingServices}</h3>
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
                    <td><strong>{svc.title}</strong></td>
                    <td>{svc.category || "—"}</td>
                    <td>{svc.pricing_model || "—"}</td>
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

