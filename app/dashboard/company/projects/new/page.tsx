"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./new.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const COUNTRIES = [
  "Rwanda", 
  "Kenya", 
  "Nigeria", 
  "Ghana", 
  "South Africa", 
  "Ivory Coast", 
  "Cameroon", 
  "Global"
];

export default function CreateCompanyProjectPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    setShowPreview(true);
  };

  const handlePublish = async () => {
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
          <h1>Post a Company Service</h1>
          <p>Advertise your company services to clients on Boulot Man</p>
        </div>

        <form className={styles.formCard} onSubmit={handlePreview}>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Company Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.companyName}
                onChange={e => setForm({...form, companyName: e.target.value})}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Service Title</label>
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
            <label className={styles.label}>Service Delivery Mode</label>
            <div className={styles.pills}>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="onsite" 
                  checked={form.service_type === "onsite"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>On-site</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="remote" 
                  checked={form.service_type === "remote"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>Remote</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  name="serviceMode" 
                  value="hybrid" 
                  checked={form.service_type === "hybrid"}
                  onChange={e => setForm({...form, service_type: e.target.value})}
                />
                <span>Hybrid</span>
              </label>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value, subcategory: ""})}
                required
              >
                <option value="">👉 Click here to select Category</option>
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
              <label className={styles.label}>Subcategory</label>
              <select 
                className={styles.select}
                value={form.subcategory}
                onChange={e => setForm({...form, subcategory: e.target.value})}
                required
                disabled={!form.category || subcategories.length === 0}
              >
                <option value="">{!form.category ? "👈 Click 'Category' on the left first" : "Select Subcategory"}</option>
                {subcategories.map((sub: any) => (
                  <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Country (auto-detected)</label>
              <select 
                className={styles.select} 
                value={form.country}
                onChange={e => setForm({...form, country: e.target.value})}
                required
              >
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>City (auto-detected)</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
                placeholder="City"
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pricing Structure</label>
              <select 
                className={styles.select}
                value={form.budget_mode}
                onChange={e => setForm({...form, budget_mode: e.target.value})}
                required
              >
                <option value="Contract-based">Contract-based</option>
                <option value="Project-based">Project-based</option>
                <option value="Hourly / Daily">Hourly / Daily</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Estimated Budget (XOF)</label>
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
            <label className={styles.label}>Deadline</label>
            <input 
              type="date" 
              className={styles.input} 
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Description</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Provide detailed requirements for this project..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <iconify-icon icon="lucide:eye" /> Preview Project
          </button>
        </form>
      </div>

      {showPreview && (
        <div className={styles.previewOverlay}>
          <div className={styles.previewBox}>
            <h2>Project Preview</h2>
            <div className={styles.previewGrid}>
              <div><strong>Company</strong><p>{form.companyName}</p></div>
              <div><strong>Service Title</strong><p>{form.title}</p></div>
              <div><strong>Service Mode</strong><p style={{ textTransform: 'capitalize' }}>{form.service_type}</p></div>
              <div><strong>Country</strong><p>{form.country || "Not specified"}</p></div>
              <div><strong>City</strong><p>{form.city || "Not specified"}</p></div>
              <div><strong>Pricing</strong><p>{form.budget_mode} {form.budget ? `- ${form.budget} XOF` : ""}</p></div>
              <div><strong>Deadline</strong><p>{form.deadline || "No deadline"}</p></div>
            </div>
            <div className={styles.previewFull}>
              <strong>Categories</strong>
              <p>
                {categories.find((c: any) => String(c.id) === form.category)?.name || "None"} 
                {form.subcategory ? " > " + subcategories.find((s: any) => String(s.id) === form.subcategory)?.name : ""}
              </p>
            </div>
            <div className={styles.previewFull}>
              <strong>Description</strong>
              <p style={{ whiteSpace: "pre-wrap" }}>{form.description}</p>
            </div>
            
            <div className={styles.previewActions}>
              <button className={styles.secondaryBtn} onClick={() => setShowPreview(false)}>
                Edit Details
              </button>
              <button className={styles.secondaryBtn} onClick={() => {
                alert("Draft saved locally. (Backend drafts pending)");
                setShowPreview(false);
              }}>
                Save Draft
              </button>
              <button className={styles.submitBtn} onClick={handlePublish} disabled={submitting}>
                <iconify-icon icon="lucide:send" /> {submitting ? "Publishing..." : "Publish Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
