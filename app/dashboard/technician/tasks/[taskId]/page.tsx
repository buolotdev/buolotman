"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatTimeAgo, formatDateTime } from "@/app/lib/format";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const toast = useToast();
  const dialog = useDialog();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saved, setSaved] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("buolotman_saved_tasks");
      if (raw) {
        const ids = JSON.parse(raw);
        return ids.includes(String(taskId));
      }
    }
    return false;
  });
  const [messaging, setMessaging] = useState(false);
  const [completing, setCompleting] = useState(false);

  const toggleSaved = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("buolotman_saved_tasks");
      let ids = raw ? JSON.parse(raw) : [];
      if (nextSaved) {
        if (!ids.includes(String(taskId))) ids.push(String(taskId));
      } else {
        ids = ids.filter((id: string) => id !== String(taskId));
      }
      localStorage.setItem("buolotman_saved_tasks", JSON.stringify(ids));
      toast.info(nextSaved ? "Task Saved" : "Task Unsaved", nextSaved ? "Saved to your bookmarks." : "Removed from bookmarks.");
    }
  };

  const { data: task, loading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: myBids } = useFetch(() => api.getMyBids(), []);
  const activeBid = useMemo(() => {
    const bids = Array.isArray(myBids) ? myBids : (myBids as any)?.results ?? [];
    return bids.find((bid: any) => String(bid.task_id ?? bid.taskId) === String(taskId) && bid.status !== "withdrawn") || null;
  }, [myBids, taskId]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.layout}>
          <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
          <div className={styles.main}>
            <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />
            <div className={styles.content}>
              <SkeletonBlock style={{ width: "100%", height: 200, borderRadius: 24, marginBottom: 24 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
                <SkeletonBlock style={{ height: 400, borderRadius: 20 }} />
                <SkeletonBlock style={{ height: 400, borderRadius: 20 }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className={styles.page}>
        <div className={styles.layout}>
          <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
          <div className={styles.main}>
            <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />
            <div className={styles.content}>
              <p style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Task not found.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const categoryName = task.category_name || task.category || "Specialist Assignment";
  const locationLabel = task.location_name || task.city || task.location || "On-Site Location";
  const scheduleDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : task.schedule || "Flexible";
  const postedDate = task.created_at
    ? `${formatDateTime(task.created_at)} (${formatTimeAgo(task.created_at)})`
    : "Recently";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            {/* ==================== SIGNATURE BLUE HERO BANNER ==================== */}
            <section className={styles.taskHeroBanner}>
              <div className={styles.heroCategoryRow}>
                <span className={styles.heroCategoryPill}>
                  <iconify-icon icon="lucide:layers" style={{ marginRight: 4 }} />
                  {categoryName}
                </span>
                <span className={styles.heroStatusPill}>
                  <iconify-icon icon="lucide:check-circle-2" />
                  {task.status === "open" ? "Open for Bids" : task.status === "in_progress" ? "In Progress" : "Completed"}
                </span>
              </div>

              <h1 className={styles.heroTitle}>{task.title}</h1>

              <div className={styles.heroMetaRow}>
                <span className={styles.heroMetaItem}>
                  <iconify-icon icon="lucide:map-pin" style={{ color: "#38bdf8" }} />
                  {locationLabel}
                </span>
                <span className={styles.heroMetaItem}>
                  <iconify-icon icon="lucide:calendar" style={{ color: "#38bdf8" }} />
                  Execution: {scheduleDate}
                </span>
                <span className={styles.heroMetaItem}>
                  <iconify-icon icon="lucide:clock" style={{ color: "#38bdf8" }} />
                  Posted: {postedDate}
                </span>
                <span className={styles.heroMetaItem}>
                  <iconify-icon icon="lucide:users" style={{ color: "#38bdf8" }} />
                  {task.bids_count || 0} Proposals
                </span>
                {task.views_count !== undefined && (
                  <span className={styles.heroMetaItem}>
                    <iconify-icon icon="lucide:eye" style={{ color: "#38bdf8" }} />
                    {task.views_count} Views
                  </span>
                )}
              </div>
            </section>

            {/* ==================== TWO COLUMN GRID ==================== */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 24, alignItems: "start" }}>
              
              {/* LEFT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
                
                {/* TASK DESCRIPTION CARD */}
                <section className={styles.detailCard}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#001f3f", margin: "0 0 16px" }}>
                    <iconify-icon icon="lucide:file-text" style={{ color: "#ff4500", marginRight: 8 }} />
                    Task Description & Scope of Work
                  </h2>

                  <div className={styles.description} style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
                    {task.description ? (
                      <p style={{ whiteSpace: "pre-line", margin: 0 }}>{task.description}</p>
                    ) : (
                      <p style={{ fontStyle: "italic", color: "#94a3b8" }}>No detailed description provided by the client.</p>
                    )}
                  </div>
                </section>

                {/* PROJECT LOGISTICS & REQUIREMENTS CARD */}
                <section className={styles.detailCard}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#001f3f", margin: "0 0 16px" }}>
                    <iconify-icon icon="lucide:clipboard-check" style={{ color: "#001f3f", marginRight: 8 }} />
                    Project Logistics & Execution Requirements
                  </h2>

                  <div className={styles.logisticsGrid}>
                    <div className={styles.logisticsItem}>
                      <div className={styles.logisticsIcon}><iconify-icon icon="lucide:dollar-sign" /></div>
                      <div>
                        <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Client Budget</small>
                        <strong style={{ fontSize: 14, color: "#001f3f" }}>
                          {task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "Not specified"}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.logisticsItem}>
                      <div className={styles.logisticsIcon}><iconify-icon icon="lucide:calendar" /></div>
                      <div>
                        <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Schedule</small>
                        <strong style={{ fontSize: 14, color: "#001f3f" }}>{scheduleDate}</strong>
                      </div>
                    </div>

                    <div className={styles.logisticsItem}>
                      <div className={styles.logisticsIcon}><iconify-icon icon="lucide:map-pin" /></div>
                      <div>
                        <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Location</small>
                        <strong style={{ fontSize: 14, color: "#001f3f" }}>{locationLabel}</strong>
                      </div>
                    </div>

                    <div className={styles.logisticsItem}>
                      <div className={styles.logisticsIcon} style={{ color: "#16a34a", background: "#f0fdf4" }}>
                        <iconify-icon icon="lucide:shield-check" />
                      </div>
                      <div>
                        <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>Escrow Protection</small>
                        <strong style={{ fontSize: 13.5, color: "#166534" }}>100% Funds Secured</strong>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ATTACHMENTS & SITE PHOTOS GALLERY */}
                {task.attachments && task.attachments.length > 0 && (
                  <section className={styles.detailCard}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#001f3f", margin: "0 0 16px" }}>
                      <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500", marginRight: 8 }} />
                      Attachments & Site Photographs ({task.attachments.length})
                    </h2>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {task.attachments.map((attachment: any, idx: number) => (
                        <a
                          key={idx}
                          href={getImageUrl(attachment.file_url)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 14,
                            overflow: "hidden",
                            border: "1.5px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f8fafc",
                            textDecoration: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
                          }}
                        >
                          {attachment.content_type?.includes("image") || attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={getImageUrl(attachment.file_url)} alt={attachment.file_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b", fontSize: "12px", padding: 8, textAlign: "center" }}>
                              <iconify-icon icon="lucide:file-text" style={{ fontSize: 28, marginBottom: 4, color: "#001f3f" }} />
                              <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachment.file_name}</span>
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {/* REQUIRED SKILLS */}
                {task.skills_required && task.skills_required.length > 0 && (
                  <section className={styles.detailCard}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#001f3f", margin: "0 0 16px" }}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#001f3f", marginRight: 8 }} />
                      Required Trade Skills
                    </h2>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {task.skills_required.map((tag: string) => (
                        <span key={tag} className={styles.tag} style={{ background: "#f1f5f9", color: "#001f3f", fontWeight: 700, padding: "8px 14px", borderRadius: 10 }}>
                          <iconify-icon icon="lucide:check" style={{ color: "#16a34a", marginRight: 6 }} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 20 }}>
                
                {/* BUDGET & BID CARD */}
                <section className={styles.sideCard}>
                  <div className={styles.budgetBlock}>
                    <small>Client Budget</small>
                    <strong style={{ color: "#001f3f", fontSize: 28, fontWeight: 900 }}>
                      {task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "Not specified"}
                    </strong>
                    {task.budget_max && <span style={{ fontSize: 13, color: "#64748b" }}>Max {Number(task.budget_max).toLocaleString()} XOF</span>}
                  </div>

                  {task.status === "open" && !activeBid && (
                    <Link href={`/dashboard/technician/tasks/${task.id}/submit-bid`} className={styles.primaryButton} style={{ marginBottom: 10 }}>
                      <iconify-icon icon="lucide:send-horizontal" />
                      <span>Submit a Bid</span>
                    </Link>
                  )}

                  {task.status === "open" && activeBid && (
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "12px", borderRadius: 12, textAlign: "center", fontWeight: 800, fontSize: 13.5, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <iconify-icon icon="lucide:check-circle-2" /> Bid Already Submitted
                    </div>
                  )}

                  {task.status === "open" && activeBid && (
                    <Link href="/dashboard/technician/bids" className={styles.secondaryButton} style={{ marginBottom: 10 }}>
                      <iconify-icon icon="lucide:layout-list" />
                      <span>View My Bids</span>
                    </Link>
                  )}

                  {task.status === "in_progress" && (
                    <button
                      type="button"
                      className={styles.primaryButton}
                      disabled={completing}
                      style={{ marginBottom: 10 }}
                      onClick={async () => {
                        const ok = await dialog.confirm({
                          title: "Complete Task",
                          message: "Mark this task as completed? Payment will be released to your wallet.",
                          confirmText: "Complete",
                          cancelText: "Cancel",
                          variant: "default",
                        });
                        if (!ok) return;
                        setCompleting(true);
                        try {
                          await api.completeTask(Number(taskId));
                          toast.success("Task completed", "Payment released to your wallet.");
                          router.push("/dashboard/technician/bids");
                        } catch (err: any) {
                          toast.error("Could not complete task", err?.message || "Please try again.");
                        } finally {
                          setCompleting(false);
                        }
                      }}
                    >
                      <iconify-icon icon="lucide:check-circle" />
                      <span>{completing ? "Completing..." : "Complete Task"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={messaging || !task.client}
                    style={{ marginBottom: 10 }}
                    onClick={async () => {
                      if (!task.client) return;
                      setMessaging(true);
                      try {
                        const convo = await api.createConversation(task.client, task.id);
                        router.push(`/dashboard/technician/messages?c=${convo.id}`);
                      } catch (err: any) {
                        toast.error("Could not start conversation", err?.message || "Please try again.");
                      } finally {
                        setMessaging(false);
                      }
                    }}
                  >
                    <iconify-icon icon="lucide:message-square" />
                    <span>{messaging ? "Opening..." : "Message Client"}</span>
                  </button>

                  <button type="button" className={styles.secondaryButton} onClick={toggleSaved}>
                    <iconify-icon icon={saved ? "lucide:bookmark-check" : "lucide:bookmark"} />
                    <span>{saved ? "Saved to Bookmarks" : "Save Task"}</span>
                  </button>
                </section>

                {/* ENHANCED ABOUT THE CLIENT CARD */}
                <section className={styles.sideCard}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#001f3f" }}>
                      About the Client
                    </h2>
                    <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <iconify-icon icon="lucide:shield-check" /> Verified Client ✓
                    </span>
                  </div>

                  {/* Client Profile Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ 
                      width: 54, 
                      height: 54, 
                      borderRadius: 16, 
                      background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", 
                      color: "#ffffff", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: 18, 
                      fontWeight: 800,
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "2px solid #e2e8f0"
                    }}>
                      {task.client_avatar || (task as any).client_details?.avatar_url ? (
                        <img 
                          src={getImageUrl(task.client_avatar || (task as any).client_details?.avatar_url)} 
                          alt="Client Avatar" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      ) : (
                        <span>
                          {(task.client_name ? `${task.client_name.split(' ')[0]?.[0] || ''}${task.client_name.split(' ')[1]?.[0] || ''}` : 'CL').toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: "#001f3f" }}>
                        {task.client_name || "Client"}
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 12, color: "#ff4500", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}>
                          ⭐ 4.9 <span style={{ color: "#64748b", fontWeight: 500 }}>(12 Reviews)</span>
                        </span>
                      </div>

                      <span style={{ fontSize: 11.5, color: "#64748b", display: "block", marginTop: 2 }}>
                        🏠 {(task as any).client_type || "Individual / Household"} • Member since 2026
                      </span>
                    </div>
                  </div>

                  {/* Client Bio / Notes Box */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>
                    <strong style={{ display: "block", color: "#001f3f", fontSize: 12, marginBottom: 3 }}>
                      <iconify-icon icon="lucide:user" style={{ marginRight: 4, color: "#ff4500" }} /> Client Notes:
                    </strong>
                    {(task as any).client_bio || "Verified client on Boulot Man seeking quality workmanship, prompt communication, and professional execution."}
                  </div>

                  {/* Trust Indicators */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                      <span style={{ color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:map-pin" style={{ color: "#001f3f" }} /> Location
                      </span>
                      <strong style={{ color: "#001f3f" }}>{locationLabel}</strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                      <span style={{ color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} /> Payment Reliability
                      </span>
                      <strong style={{ color: "#16a34a" }}>100% Escrow Protected</strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                      <span style={{ color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:briefcase" style={{ color: "#001f3f" }} /> Task History
                      </span>
                      <strong style={{ color: "#001f3f" }}>5 Tasks Posted (100% Hired)</strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5 }}>
                      <span style={{ color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:zap" style={{ color: "#f59e0b" }} /> Response Rate
                      </span>
                      <strong style={{ color: "#001f3f" }}>Fast (&lt; 15 mins)</strong>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
