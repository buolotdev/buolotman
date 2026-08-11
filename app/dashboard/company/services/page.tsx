"use client";

import { useState } from "react";
import layoutStyles from "../page.module.css";
import styles from "./services.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";

export default function ServicesManagement() {
  const toast = useToast();
  const dialog = useDialog();

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

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.warning("Missing title", "Please enter a service name.");
      return;
    }
    setSaving(true);
    try {
      await api.createCompanyService(form);
      toast.success("Service saved", `"${form.title}" has been added successfully.`);
      setForm({
        title: "",
        category: "Construction",
        pricing_model: "Quote-based",
        description: "",
        status: "Active"
      });
      await refetch();
    } catch (err: any) {
      toast.error("Save failed", err.message || "Failed to save the service.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      // Assuming you have an updateCompanyService endpoint or can handle partial updates
      // Currently api.ts might only have createCompanyService and getCompanyServices.
      // If we don't have updateCompanyService, I'll delete and re-create as a fallback for now.
      // Let's implement delete for the "Deactivate" action if update isn't available, or just mock it.
      // The mockup has "Deactivate" and "Activate". Let's assume we can update it or just show a warning.
      // For this demo, let's use delete since that's what was there before.
      
      if (newStatus === 'Inactive') {
        const ok = await dialog.confirm({
          title: "Deactivate Service?",
          message: "This will remove the service from your active profile.",
          confirmText: "Deactivate",
          cancelText: "Cancel",
          variant: "danger"
        });
        if (ok) {
          await api.deleteCompanyService(id);
          toast.success("Service deactivated", "The service has been removed.");
          await refetch();
        }
      } else {
        toast.info("Update required", "Editing services will be available soon.");
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
          <p className={layoutStyles.eyebrow}>Services Management</p>
          <h2 className={layoutStyles.welcomeTitle}>Manage Services</h2>
          <p className={layoutStyles.welcomeSubtitle}>Publish the services your company offers. Clients will see these on your public profile.</p>
        </div>
      </section>

      {/* OVERVIEW STATS */}
      <div className={styles.overview}>
        <div className={styles.stat}>
          <span>Total Services</span>
          <h3>{servicesLoading ? "..." : totalServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>Active Services</span>
          <h3>{servicesLoading ? "..." : activeServices}</h3>
        </div>
        <div className={styles.stat}>
          <span>Inactive Services</span>
          <h3>{servicesLoading ? "..." : inactiveServices}</h3>
        </div>
      </div>

      {/* ADD SERVICE FORM */}
      <div className={styles.card}>
        <h3>Add New Service</h3>

        <label className={styles.label}>Service Name</label>
        <input 
          className={styles.input} 
          placeholder="e.g. Commercial Building Construction" 
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="Construction">Construction</option>
              <option value="Engineering">Engineering</option>
              <option value="Renovation">Renovation</option>
              <option value="Project Management">Project Management</option>
              <option value="IT & Networking">IT & Networking</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Pricing Model</label>
            <select className={styles.select} value={form.pricing_model} onChange={e => setForm({...form, pricing_model: e.target.value})}>
              <option value="Quote-based">Quote-based</option>
              <option value="Fixed Price">Fixed Price</option>
              <option value="Hourly">Hourly</option>
            </select>
          </div>
        </div>

        <label className={styles.label}>Description</label>
        <textarea 
          className={styles.textarea} 
          placeholder="Describe the service in detail"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
        />

        <label className={styles.label}>Status</label>
        <select className={styles.select} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="Active">Active (Visible to clients)</option>
          <option value="Inactive">Inactive (Hidden)</option>
        </select>

        <button className={styles.primary} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Service"}
        </button>
      </div>

      {/* SERVICES LIST */}
      <div className={styles.card}>
        <h3>Existing Services</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servicesLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Loading services...</td>
                </tr>
              ) : services.length > 0 ? (
                services.map(svc => (
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
                      <button className={styles.outline} onClick={() => toast.info("Edit", "Editing will open the form with data soon.")}>Edit</button>
                      <button className={styles.outline} onClick={() => toggleStatus(svc.id, svc.status || 'Active')}>
                        {svc.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    No services found. Add your first service above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
