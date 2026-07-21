"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import LogoutButton from "@/app/components/LogoutButton";
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

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "projects", label: "Projects", icon: "lucide:folder-open", href: "/dashboard/technician/projects", match: (p: string) => p.startsWith("/dashboard/technician/projects") },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks", match: (p: string) => p.startsWith("/dashboard/technician/tasks") },
  { key: "services", label: "My Services", icon: "lucide:layers-3", href: "/dashboard/technician/services", match: (p: string) => p.startsWith("/dashboard/technician/services") },
  { key: "bids", label: "My Bids", icon: "lucide:send", href: "/dashboard/technician/bids", match: (p: string) => p.startsWith("/dashboard/technician/bids") },
  { label: "Messages", href: "/dashboard/technician/messages", icon: "lucide:message-square" },
  { label: "Wallet", href: "/dashboard/technician/wallet", icon: "lucide:wallet" },
  { label: "Profile", href: "/dashboard/technician/profile", icon: "lucide:user" },
];

export default function TechnicianServicesPage() {
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: servicesData, loading, refetch } = useFetch(() => api.getTechnicianServices(), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingType, setUploadingType] = useState<"image" | "video" | "document" | null>(null);

  const services = useMemo(() => (Array.isArray(servicesData) ? servicesData : []), [servicesData]);
  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []).filter((c: any) => !c.parent),
    [categoriesData]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
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
      is_active: Boolean(service.is_active),
      media: Array.isArray(service.media) ? service.media : [],
    });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video" | "document") => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploadingType(kind);
    const uploaded: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await api.uploadServiceMedia(file);
        uploaded.push({
          file_url: result.file_url,
          file_name: result.file_name,
          media_type: result.media_type,
          content_type: result.content_type,
        });
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Could not upload file.");
      }
    }
    setForm((prev) => ({ ...prev, media: [...prev.media, ...uploaded] }));
    setUploadingType(null);
    e.target.value = "";
  };

  const removeMedia = (idx: number) => {
    setForm((prev) => ({ ...prev, media: prev.media.filter((_, i) => i !== idx) }));
  };

  const removeService = async (serviceId: number) => {
    if (deletingId) return;
    setDeletingId(serviceId);
    try {
      await api.deleteTechnicianService(serviceId);
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
      <div className={`${styles.sidebarOverlay} ${mobileNavOpen ? styles.sidebarOverlayOpen : ""}`} onClick={() => setMobileNavOpen(false)} />
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>BM</div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className={styles.brandLabel}>Boulot Man</div>
              <div className={styles.brandSub}>Technician Space</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              style={{
                border: 0,
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                padding: 4,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <iconify-icon icon="lucide:x" style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === "/dashboard/technician/services" ? styles.navItemActive : ""}`}>
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <LogoutButton className={styles.logoutButton} />
        </div>
      </aside>

      <main className={styles.main}>
        <DashboardHeader
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <div style={{ padding: "0 0 24px" }}>
          <header className={styles.topbar}>
            <div>
              <p className={styles.kicker}>Manage your listings</p>
              <h1>My Services</h1>
              <p className={styles.lead}>Create the services you want to offer, then keep them visible on search and profile pages.</p>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link href="/dashboard/technician/services/new" className={styles.primaryButton} style={{ background: "#ff4500", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", display: "inline-flex", whiteSpace: "nowrap", border: "none" }}>+ New service</Link>
              <Link href="/dashboard/technician" className={styles.backLink}>Back to dashboard</Link>
            </div>
          </header>
        </div>

        <section className={styles.summaryGrid}>
          <article className={styles.statCard}>
            <span>Active services</span>
            <strong>{services.filter((s: any) => s.is_active).length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Total listings</span>
            <strong>{services.length}</strong>
          </article>
          <article className={styles.statCard}>
            <span>Verified account</span>
            <strong>{user?.is_verified ? "Yes" : "No"}</strong>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.listPanel}>
            <div className={styles.panelHeader}>
              <h2>Listed services</h2>
            </div>

            {loading ? (
              <div className={styles.emptyState}>Loading services...</div>
            ) : services.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No services yet.</p>
                <span>Add your first service to appear in search results.</span>
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
                        {service.is_active ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <p className={styles.serviceDescription}>{service.description || "No description provided."}</p>
                    <div className={styles.serviceMeta}>
                      <span>{service.coverage_area || "Coverage not set"}</span>
                      <span>
                        {service.pricing_min != null ? Number(service.pricing_min).toLocaleString() : "0"}
                        {service.pricing_max != null ? ` - ${Number(service.pricing_max).toLocaleString()}` : ""}
                        {" XOF"}
                      </span>
                    </div>
                    <div className={styles.serviceActions}>
                      <button type="button" className={styles.secondaryButton} onClick={() => editService(service)}>Edit</button>
                      <button type="button" className={styles.dangerButton} onClick={() => removeService(service.id)} disabled={deletingId === service.id}>
                        {deletingId === service.id ? "Deleting..." : "Delete"}
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
              <h2>Edit service</h2>
              <button type="button" className={styles.ghostButton} onClick={resetForm}>Cancel</button>
            </div>

            <label className={styles.field}>
              <span>Service title</span>
              <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            </label>

            <label className={styles.field}>
              <span>Category</span>
              <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Description</span>
              <textarea rows={5} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            </label>

            <div className={styles.doubleGrid}>
              <label className={styles.field}>
                <span>Service type</span>
                <select value={form.service_type} onChange={(e) => setForm((prev) => ({ ...prev, service_type: e.target.value as ServiceForm["service_type"] }))}>
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Pricing model</span>
                <select value={form.pricing_model} onChange={(e) => setForm((prev) => ({ ...prev, pricing_model: e.target.value as ServiceForm["pricing_model"] }))}>
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="range">Range</option>
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>Coverage area</span>
              <input value={form.coverage_area} onChange={(e) => setForm((prev) => ({ ...prev, coverage_area: e.target.value }))} placeholder="City, district, or region" />
            </label>

            <div className={styles.doubleGrid}>
              <label className={styles.field}>
                <span>Min price</span>
                <input type="number" value={form.pricing_min} onChange={(e) => setForm((prev) => ({ ...prev, pricing_min: e.target.value }))} placeholder="0" />
              </label>
              <label className={styles.field}>
                <span>Max price</span>
                <input type="number" value={form.pricing_max} onChange={(e) => setForm((prev) => ({ ...prev, pricing_max: e.target.value }))} placeholder="0" />
              </label>
            </div>

            <label className={styles.toggleRow}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
              <span>Publish this service</span>
            </label>

            {/* ── Media Attachments ── */}
            <div className={styles.mediaSection}>
              <span className={styles.mediaSectionLabel}>Attachments</span>

              <div className={styles.mediaButtonRow}>
                {/* Photos & Images */}
                <label className={styles.mediaTypeBtn} htmlFor="svc-img-input" data-type="image">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#e8f4fd" }}>
                    <iconify-icon icon="lucide:image" style={{ fontSize: 22, color: "#0284c7" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>Portfolio Photos</strong>
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

                {/* Video Portfolio */}
                <label className={styles.mediaTypeBtn} htmlFor="svc-vid-input" data-type="video">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#fdf2f8" }}>
                    <iconify-icon icon="lucide:video" style={{ fontSize: 22, color: "#9333ea" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>Video Showcase</strong>
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

                {/* Certificates & Documents */}
                <label className={styles.mediaTypeBtn} htmlFor="svc-doc-input" data-type="document">
                  <div className={styles.mediaTypeBtnIcon} style={{ background: "#fff7ed" }}>
                    <iconify-icon icon="lucide:file-badge" style={{ fontSize: 22, color: "#ea580c" }} />
                  </div>
                  <div className={styles.mediaTypeBtnText}>
                    <strong>Certificates &amp; Docs</strong>
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

              {/* Preview Grid */}
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
              {saving ? "Saving..." : "Update service"}
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
                <h3>Select a service to edit</h3>
                <p>Click "Edit" on any of your services to modify them here,<br/>or click "New service" to create a fresh one.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
