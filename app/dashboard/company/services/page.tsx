"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./services.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Services Management",
    title: "Manage Services",
    subtitle: "Publish the services your company offers. Clients will see these on your public profile.",
    pendingTitle: "Company Account Pending Admin Verification",
    pendingDesc: "Your company registration documents are under administrative review. Publishing and managing services will unlock upon admin verification.",
    profileBtn: "Company Profile",
    totalServices: "Total Services",
    activeServices: "Active Services",
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
    inactiveOption: "Inactive (Hidden)",
    saving: "Saving...",
    saveService: "Save Service",
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
    pendingDesc: "Vos documents d'enregistrement sont en cours d'examen. La publication et la gestion des services seront actives dès la validation.",
    profileBtn: "Profil Entreprise",
    totalServices: "Total des Services",
    activeServices: "Services Actifs",
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
    inactiveOption: "Inactif (Masqué)",
    saving: "Enregistrement...",
    saveService: "Enregistrer le Service",
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
  
  const services = Array.isArray(servicesData) ? servicesData : [];
  
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const inactiveServices = services.filter(s => s.status === 'Inactive').length;

  const [form, setForm] = useState({
    title: "",
    category: "Construction",
    pricing_model: "Quote-based",
    description: "",
    status: "Active"
  });

  const [saving, setSaving] = useState(false);
  const isVerified = Boolean(user?.is_verified || (profile as any)?.is_verified);

  const handleSave = async () => {
    if (!isVerified) {
      toast.warning(
        lang === "fr" ? "En attente de vérification" : "Wait for Verification",
        lang === "fr" ? "Votre compte entreprise est en cours d'examen. Une fois approuvé, vous pourrez publier vos services." : "Please wait for verification. Your company account is currently under review by admin. Once approved, you can save and post services."
      );
      return;
    }

    if (!form.title.trim()) {
      toast.warning(lang === "fr" ? "Titre manquant" : "Missing title", lang === "fr" ? "Veuillez saisir un nom de service." : "Please enter a service name.");
      return;
    }
    setSaving(true);
    try {
      await api.createCompanyService(form);
      toast.success(lang === "fr" ? "Service enregistré" : "Service saved", `"${form.title}"`);
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
          await api.deleteCompanyService(id);
          toast.success(lang === "fr" ? "Service désactivé" : "Service deactivated", lang === "fr" ? "Le service a été retiré." : "The service has been removed.");
          await refetch();
        }
      } else {
        toast.info(lang === "fr" ? "Mise à jour requise" : "Update required", lang === "fr" ? "La modification sera bientôt disponible." : "Editing services will be available soon.");
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
      <div className={styles.overview}>
        <div className={styles.stat}>
          <span>{t.totalServices}</span>
          <h3>{servicesLoading ? "..." : totalServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>{t.activeServices}</span>
          <h3>{servicesLoading ? "..." : activeServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>{t.inactiveServices}</span>
          <h3>{servicesLoading ? "..." : inactiveServices}</h3>
        </div>
      </div>

      {/* ADD SERVICE FORM */}
      <div className={styles.card}>
        <h3>{t.addNewService}</h3>

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
              <option value="Construction">Construction</option>
              <option value="Engineering">Engineering</option>
              <option value="Renovation">Renovation</option>
              <option value="Project Management">Project Management</option>
              <option value="IT & Networking">IT & Networking</option>
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
          <option value="Inactive">{t.inactiveOption}</option>
        </select>

        <button className={styles.primary} onClick={handleSave} disabled={saving}>
          {saving ? t.saving : t.saveService}
        </button>
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
                    <td>{svc.category || "Construction"}</td>
                    <td>{svc.pricing_model || "Quote-based"}</td>
                    <td>
                      <span className={`${styles.status} ${svc.status === 'Inactive' ? styles.inactiveStatus : styles.activeStatus}`}>
                        {svc.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className={styles.outline} onClick={() => toast.info("Edit", "Editing will open the form with data soon.")}>{t.edit}</button>
                      <button className={styles.outline} onClick={() => toggleStatus(svc.id, svc.status || 'Active')}>
                        {svc.status === 'Inactive' ? t.activate : t.deactivate}
                      </button>
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

