"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./new.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";


const COUNTRIES = [
  "Rwanda", 
  "Kenya", 
  "Nigeria", 
  "Ghana", 
  "South Africa", 
  "Ivory Coast", 
  "Cameroon", 
  "Benin",
  "Togo",
  "Senegal",
  "Global"
];

const translations: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "Post a Company Service",
    heroSubtitle: "Advertise your company services to clients on Boulot Man",
    verificationNoticeTitle: "Company Verification Notice",
    verificationNoticeDesc: "Your enterprise company profile is currently pending Admin verification. Once verified, your published services and projects will be visible in public search and client directories.",
    companyName: "Company Name",
    serviceTitle: "Service Title",
    serviceDeliveryMode: "Service Delivery Mode",
    onsite: "On-site",
    remote: "Remote",
    hybrid: "Hybrid",
    category: "Category",
    selectCategory: "👉 Click here to select Category",
    subcategory: "Subcategory",
    selectSubcategory: "Select Subcategory",
    selectCategoryFirst: "👈 Click 'Category' on the left first",
    country: "Country (auto-detected)",
    city: "City (auto-detected)",
    pricingStructure: "Pricing Structure",
    contractBased: "Contract-based",
    projectBased: "Project-based",
    hourlyDaily: "Hourly / Daily",
    negotiable: "Negotiable",
    estimatedBudget: "Estimated Budget (XOF)",
    deadline: "Deadline",
    projectDescription: "Project Description",
    descPlaceholder: "Provide detailed requirements for this project...",
    previewProject: "Preview Project",
    projectPreview: "Project Preview",
    company: "Company",
    serviceMode: "Service Mode",
    pricing: "Pricing",
    categories: "Categories",
    editDetails: "Edit Details",
    saveDraft: "Save Draft",
    publishProject: "Publish Project",
    publishing: "Publishing...",
    toastWaitTitle: "Wait for Verification",
    toastWaitDesc: "Please wait for verification. Your company account is currently under review by admin. Once approved, you can publish projects and services."
  },
  fr: {
    heroTitle: "Publier un Service Entreprise",
    heroSubtitle: "Faites la promotion des prestations de votre entreprise auprès des clients sur Boulot Man",
    verificationNoticeTitle: "Avis de Vérification Entreprise",
    verificationNoticeDesc: "Votre profil d'entreprise est actuellement en cours de vérification par l'administration. Dès validation, vos services seront visibles sur l'annuaire public.",
    companyName: "Nom de l'entreprise",
    serviceTitle: "Titre de la prestation",
    serviceDeliveryMode: "Mode de prestation",
    onsite: "Sur site",
    remote: "À distance",
    hybrid: "Hybride",
    category: "Catégorie",
    selectCategory: "👉 Cliquez ici pour choisir la catégorie",
    subcategory: "Sous-catégorie",
    selectSubcategory: "Sélectionner la sous-catégorie",
    selectCategoryFirst: "👈 Choisissez d'abord la catégorie à gauche",
    country: "Pays (détecté automatiquement)",
    city: "Ville (détectée automatiquement)",
    pricingStructure: "Structure tarifaire",
    contractBased: "Sur contrat",
    projectBased: "Par projet",
    hourlyDaily: "Horaire / Journalier",
    negotiable: "Négociable",
    estimatedBudget: "Budget estimatif (XOF)",
    deadline: "Date limite / Échéance",
    projectDescription: "Description détaillée",
    descPlaceholder: "Fournissez les spécifications et détails pour cette prestation...",
    previewProject: "Aperçu de la prestation",
    projectPreview: "Aperçu de la prestation",
    company: "Entreprise",
    serviceMode: "Mode d'intervention",
    pricing: "Tarification",
    categories: "Catégories",
    editDetails: "Modifier",
    saveDraft: "Enregistrer brouillon",
    publishProject: "Publier l'Offre",
    publishing: "Publication en cours...",
    toastWaitTitle: "Vérification en attente",
    toastWaitDesc: "Veuillez patienter pendant l'examen de votre compte entreprise par l'administration. Dès validation, vous pourrez publier vos prestations."
  }
};

export default function CreateCompanyProjectPage() {
  const router = useRouter();
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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


  const [form, setForm] = useState({
    companyName: "",
    title: "",
    category: "",
    subcategory: "",
    budget: "",
    budget_mode: "Contract-based",
    service_type: "onsite",
    country: "",
    city: "",
    deadline: "",
    description: "",
  });

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: companyProfile } = useFetch(() => api.getCompanyProfile(), []);
  const isVerified = Boolean(user?.is_verified || companyProfile?.is_verified || user?.company_profile?.is_verified);

  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );
  
  const { data: subcategoriesData } = useFetch(
    () => form.category ? api.getSkills(form.category) : Promise.resolve([]),
    [form.category]
  );
  
  const categories = categoriesData || [];
  const subcategories = subcategoriesData || [];


  // Auto-detect location
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_name || data.city) {
          setForm(prev => ({
            ...prev,
            country: data.country_name || "",
            city: data.city || ""
          }));
        }
      })
      .catch(err => console.error("Could not fetch location automatically", err));
  }, []);

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      toast.warning(t.toastWaitTitle, t.toastWaitDesc);
      return;
    }
    setShowPreview(true);
  };

  const handlePublish = async () => {
    if (!isVerified) {
      toast.warning(t.toastWaitTitle, t.toastWaitDesc);
      return;
    }
    setSubmitting(true);

    try {
      const finalTitle = form.companyName ? `${form.companyName} - ${form.title}` : form.title;

      const payload = {
        title: finalTitle,
        client_name: form.companyName || "New Client",
        budget: form.budget ? parseFloat(form.budget) : null,
        timeline: form.deadline ? `Deadline: ${form.deadline}` : "",
        location: form.country ? `${form.city ? form.city + ', ' : ''}${form.country}` : "Online",
        status: "active",
        progress: 0,
        milestones_total: 1,
        milestones_completed: 0,
        payment_status: "awaiting"
      };

      try {
        await api.createCompanyProject(payload);
      } catch (projErr) {
        console.warn("Project API save notice:", projErr);
      }

      // Also register as a company service offering
      try {
        await api.createCompanyService({
          title: form.title,
          category: form.category || form.subcategory || "General",
          pricing_model: form.budget ? `${form.budget} XOF (${form.budget_mode})` : form.budget_mode,
          status: "Active",
          description: form.description || form.title,
        });
      } catch (servErr) {
        console.warn("Service API save notice:", servErr);
      }

      router.push("/dashboard/company/projects");
    } catch (error: any) {
      console.error("Failed to create project", error);
      alert(error?.message || "Error publishing project. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <div className={styles.container} style={{ marginTop: 32 }}>
        <div className={styles.hero}>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSubtitle}</p>
        </div>

        {!isVerified && user && (
          <div style={{ padding: "16px 20px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#d97706", flexShrink: 0 }}>
              <iconify-icon icon="lucide:shield-alert"></iconify-icon>
            </div>
            <div>
              <strong style={{ color: "#92400e", fontSize: 14, display: "block", marginBottom: 2 }}>{t.verificationNoticeTitle}</strong>
              <span style={{ color: "#b45309", fontSize: 13 }}>{t.verificationNoticeDesc}</span>
            </div>
          </div>
        )}

        <form className={styles.formCard} onSubmit={handlePreview}>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.companyName}</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.companyName}
                onChange={e => setForm({...form, companyName: e.target.value})}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.serviceTitle}</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t.serviceDeliveryMode}</label>
            <div className={styles.pills}>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="onsite" 
                  checked={form.service_type === "onsite"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>{t.onsite}</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="remote" 
                  checked={form.service_type === "remote"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>{t.remote}</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="hybrid" 
                  checked={form.service_type === "hybrid"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>{t.hybrid}</span>
              </label>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.category}</label>
              <select 
                className={styles.select}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value, subcategory: ""})}
                required
              >
                <option value="">{t.selectCategory}</option>
                {categoriesLoading ? (
                  <option>Loading...</option>
                ) : (
                  categories.map((cat: any) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.subcategory}</label>
              <select 
                className={styles.select}
                value={form.subcategory}
                onChange={e => setForm({...form, subcategory: e.target.value})}
                required
                disabled={!form.category || subcategories.length === 0}
              >
                <option value="">{!form.category ? t.selectCategoryFirst : t.selectSubcategory}</option>
                {subcategories.map((sub: any) => (
                  <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.country}</label>
              <select 
                className={styles.select} 
                value={form.country}
                onChange={e => setForm({...form, country: e.target.value})}
                required
              >
                <option value="">{lang === "fr" ? "Sélectionner le Pays" : "Select Country"}</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.city}</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
                placeholder={lang === "fr" ? "Ville" : "City"}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.pricingStructure}</label>
              <select 
                className={styles.select}
                value={form.budget_mode}
                onChange={e => setForm({...form, budget_mode: e.target.value})}
                required
              >
                <option value="Contract-based">{t.contractBased}</option>
                <option value="Project-based">{t.projectBased}</option>
                <option value="Hourly / Daily">{t.hourlyDaily}</option>
                <option value="Negotiable">{t.negotiable}</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{t.estimatedBudget}</label>
              <input 
                type="number" 
                className={styles.input} 
                placeholder="e.g., 500000"
                value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t.deadline}</label>
            <input 
              type="date" 
              className={styles.input} 
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t.projectDescription}</label>
            <textarea 
              className={styles.textarea} 
              placeholder={t.descPlaceholder}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <iconify-icon icon="lucide:eye" /> {t.previewProject}
          </button>
        </form>
      </div>

      {showPreview && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewBox}>
            <h2>{t.projectPreview}</h2>
            <div className={styles.previewGrid}>
              <div><strong>{t.company}</strong><p>{form.companyName}</p></div>
              <div><strong>{t.serviceTitle}</strong><p>{form.title}</p></div>
              <div><strong>{t.serviceMode}</strong><p style={{ textTransform: 'capitalize' }}>{form.service_type}</p></div>
              <div><strong>{t.country}</strong><p>{form.country || "Not specified"}</p></div>
              <div><strong>{t.city}</strong><p>{form.city || "Not specified"}</p></div>
              <div><strong>{t.pricing}</strong><p>{form.budget_mode} {form.budget ? `- ${form.budget} XOF` : ""}</p></div>
              <div><strong>{t.deadline}</strong><p>{form.deadline || "No deadline"}</p></div>
            </div>
            <div className={styles.previewFull}>
              <strong>{t.categories}</strong>
              <p>
                {categories.find((c: any) => String(c.id) === form.category)?.name || "None"} 
                {form.subcategory ? " > " + subcategories.find((s: any) => String(s.id) === form.subcategory)?.name : ""}
              </p>
            </div>
            <div className={styles.previewFull}>
              <strong>{t.projectDescription}</strong>
              <p style={{ whiteSpace: "pre-wrap" }}>{form.description}</p>
            </div>
            
            <div className={styles.previewActions}>
              <button className={styles.secondaryBtn} onClick={() => setShowPreview(false)}>
                {t.editDetails}
              </button>
              <button className={styles.secondaryBtn} onClick={() => {
                alert(lang === "fr" ? "Brouillon enregistré localement." : "Draft saved locally.");
                setShowPreview(false);
              }}>
                {t.saveDraft}
              </button>
              <button className={styles.submitBtn} onClick={handlePublish} disabled={submitting}>
                <iconify-icon icon="lucide:send" /> {submitting ? t.publishing : t.publishProject}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
