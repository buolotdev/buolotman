"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./services.module.css";
import layoutStyles from "../page.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";

export default function AddService() {
  const toast = useToast();
  const dialog = useDialog();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/company" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/company/services") },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase", match: (p: string) => p.startsWith("/dashboard/company/projects") },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", match: (p: string) => p.startsWith("/dashboard/company/messages") },
    { id: "wallet", label: "Wallet", href: "/dashboard/company/wallet", icon: "lucide:wallet", match: (p: string) => p.startsWith("/dashboard/company/wallet") },
    { id: "team", label: "Team", href: "/dashboard/company/team", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/company/team") },
    { id: "reviews", label: "Reviews", href: "/dashboard/company/reviews", icon: "lucide:star", match: (p: string) => p.startsWith("/dashboard/company/reviews") },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user", match: (p: string) => p.startsWith("/dashboard/company/profile") },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/company/settings") },
  ];

  const { data: services, loading: servicesLoading, refetch } = useFetch(() => api.getCompanyServices(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publishing, setPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);
    setImages((current) => [...current, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.warning("Missing title", "Please enter a service title.");
      return;
    }
    setPublishing(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const res = await api.uploadCompanyServiceImage(file);
        if (res.image_url) {
          uploadedUrls.push(res.image_url);
        }
      }
      await api.createCompanyService({ title: title.trim(), description: description.trim(), images: uploadedUrls });
      toast.success("Service published", `"${title.trim()}" is now visible on your profile.`);
      setTitle("");
      setDescription("");
      setImages([]);
      await refetch();
    } catch (err: any) {
      toast.error("Publish failed", err.message || "Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: number, svcTitle: string) => {
    const ok = await dialog.confirm({
      title: "Delete this service?",
      message: `"${svcTitle}" will be removed from your public profile. This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Keep",
      variant: "danger",
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      await api.deleteCompanyService(id);
      toast.success("Service removed", `"${svcTitle}" has been deleted.`);
      await refetch();
    } catch (err: any) {
      toast.error("Delete failed", err.message || "Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`${layoutStyles.layoutWrapper} ${mobileSidebarOpen ? layoutStyles.sidebarOpenMobile : ""}`}>
      <div className={layoutStyles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={layoutStyles.sidebar}>
        <div className={layoutStyles.sidebarHeader}>
          <Link href="/" className={layoutStyles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={layoutStyles.brandImage} priority />
            <div className={layoutStyles.brandText}>
              <span className={layoutStyles.brandEyebrow}>Boulot Man</span>
              <span className={layoutStyles.brandTitle}>Company Space</span>
            </div>
          </Link>
        </div>

        <nav className={layoutStyles.navMenu}>
          {navItems.map((item) => {
            const isActive = item.match(pathname || "");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${layoutStyles.navItem} ${isActive ? layoutStyles.navItemActive : ""}`}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}
              >
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <LogoutButton className={layoutStyles.logoutButton} />
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      <main className={layoutStyles.mainWrapper}>
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <div className={styles.exportWrapper}>
          <div style={{ padding: "16px 24px 0", textAlign: "right" }}>
        <Link href="/dashboard/company/profile" className={styles.closeBtn} style={{ textDecoration: "none", color: "#001f3f", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <iconify-icon icon="lucide:arrow-left" style={{ fontSize: '18px' }}></iconify-icon>
          Back to Profile
        </Link>
      </div>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Manage Services</h1>
            <p className={styles.pageSubtitle}>
              Publish the services your company offers. Clients will see these on your public profile.
            </p>
          </div>

          <div className={styles.formBody}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Add a New Service</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Service Title</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Professional Plumbing Setup & Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the service. What is included? What should the client expect?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Gallery Images (Optional)</label>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%", border: "2px dashed #e2e8f0", borderRadius: 16, padding: "30px 20px", 
                    background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, 
                    textAlign: "center", color: "#64748b", cursor: "pointer", transition: "border-color 0.2s, background 0.2s"
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 999, background: "#fff", color: "#64748b", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 8, border: "1px solid #e2e8f0" }}>
                    <iconify-icon icon="lucide:image" style={{ fontSize: 22 }} />
                  </div>
                  <strong style={{ color: "#001f3f", fontSize: 15 }}>Click to upload images</strong>
                  <span style={{ fontSize: 13 }}>PNG, JPG or WEBP (max. 5MB)</span>
                </button>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                
                {images.length > 0 && (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                    {images.map((file, index) => (
                      <div key={index} style={{ position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                        <img src={URL.createObjectURL(file)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                        >
                          <iconify-icon icon="lucide:x" style={{ fontSize: 14 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? "Publishing..." : "Publish Service"}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: '18px' }}></iconify-icon>
            </button>
          </div>
        </div>

        <div className={styles.formContainer} style={{ padding: "32px 40px" }}>
            <h2 className={styles.sectionTitle}>Published Services ({services?.length || 0})</h2>

            {servicesLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {[1, 2, 3].map((i) => (
                  <SkeletonBlock key={i} style={{ height: 80, borderRadius: 8 }} />
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {services.map((svc: any) => (
                  <div
                    key={svc.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 16, color: "#0f172a" }}>
                        {svc.title || svc.name || ""}
                      </div>
                      {svc.description && (
                        <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
                          {svc.description}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(svc.id, svc.title || svc.name || "this service")}
                      disabled={deletingId === svc.id}
                      style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <iconify-icon icon="lucide:trash-2" style={{ fontSize: 14 }} />
                      {deletingId === svc.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14, marginTop: 16 }}>
                <iconify-icon icon="lucide:layers" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
                <p>No services published yet. Add your first service above.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </main>
  </div>
  );
}
