"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./services.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function AddService() {
  const toast = useToast();
  const dialog = useDialog();
  const { data: services, loading: servicesLoading, refetch } = useFetch(() => api.getCompanyServices(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.warning("Missing title", "Please enter a service title.");
      return;
    }
    setPublishing(true);
    try {
      await api.createCompanyService({ title: title.trim(), description: description.trim() });
      toast.success("Service published", `"${title.trim()}" is now visible on your profile.`);
      setTitle("");
      setDescription("");
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
    <div className={styles.exportWrapper}>
      <DashboardHeader />
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

          <div style={{ marginTop: 40, borderTop: "1px solid #e2e8f0", paddingTop: 32 }}>
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
        </div>
      </main>
    </div>
  );
}
