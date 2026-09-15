"use client";

import Link from "next/link";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./admin.module.css";
import React, { useState } from "react";

export default function AdminDashboard() {
  const { data, loading, refetch } = useFetch(() => api.getAdminDashboardStats(), []);
  
  // Workspace Inspector Modal State
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch full details of the selected project/task
  const { data: projectTask, loading: projectTaskLoading } = useFetch(
    () => selectedProjectId ? api.getTask(selectedProjectId) : Promise.resolve(null),
    [selectedProjectId]
  );

  const handleReleaseEscrow = async (taskId: number) => {
    setActionLoading(true);
    setActionSuccess(null);
    try {
      await api.releaseProjectMilestone(taskId);
      setActionSuccess("Milestone escrow successfully released to technician wallet!");
      refetch();
    } catch (err: any) {
      alert("Failed to release escrow: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleHoldEscrow = async (taskId: number) => {
    setActionLoading(true);
    setActionSuccess(null);
    try {
      await api.holdProjectMilestone(taskId);
      setActionSuccess("Project milestone has been placed ON HOLD.");
      refetch();
    } catch (err: any) {
      alert("Failed to put on hold: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardBody}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[1,2,3,4].map(i => <SkeletonBlock key={i} style={{ height: 120, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || { total_users: 0, active_projects: 0, pending_validations: 0, open_disputes: 0 };
  const alerts = data?.alerts || [];
  const activeProjects = data?.active_projects || [];
  const recentActivities = data?.recent_activity || [];

  const selectedProjectSnapshot = activeProjects.find((p: any) => p.id === selectedProjectId);

  return (
    <div className={styles.dashboardBody}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:layout-dashboard" /> Admin Command & Governance Center
          </div>
          <h1 className={styles.heroTitle}>Administrative Command Center</h1>
          <p className={styles.heroSubtitle}>
            Real-time marketplace oversight, active project monitoring, escrow governance, and critical platform alerts.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:activity" />
        </div>
      </div>
      
      {/* METRICS */}
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Total Users</span>
            <h3>{metrics.total_users.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconBlue}`}>
            <iconify-icon icon="lucide:users" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Active Projects</span>
            <h3>{metrics.active_projects.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconGreen}`}>
            <iconify-icon icon="lucide:briefcase" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
        <Link href="/dashboard/admin/verification" className={styles.metric} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div className={styles.metricInfo}>
            <span>Pending Validations</span>
            <h3>{metrics.pending_validations.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconOrange}`}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </Link>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Open Disputes</span>
            <h3>{metrics.open_disputes.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconRed}`}>
            <iconify-icon icon="lucide:alert-triangle" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
      </div>

      {/* ALERTS */}
      <div className={styles.alerts}>
        {alerts.map((alert: any, i: number) => {
          const targetHref = alert.link || (alert.type === 'danger' ? '/dashboard/admin/disputes' : '/dashboard/admin/tasks');
          return (
            <div key={i} className={`${styles.alert} ${alert.type === 'danger' ? styles.alertDanger : styles.alertWarning}`}>
              <div className={styles.alertIconBox}>
                <iconify-icon icon={alert.type === 'danger' ? "lucide:alert-octagon" : "lucide:alert-triangle"} style={{ fontSize: "24px" }}></iconify-icon>
              </div>
              <div className={styles.alertContent}>
                <h4>{alert.title}</h4>
                <p>{alert.description}</p>
              </div>
              <a href={targetHref} className={styles.btnAction}>
                <iconify-icon icon={alert.type === 'danger' ? "lucide:gavel" : "lucide:eye"} />
                {alert.type === 'danger' ? 'Resolve Now' : 'Review'}
              </a>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className={styles.allClearBanner}>
            <div className={styles.allClearIcon}>
              <iconify-icon icon="lucide:sparkles" style={{ fontSize: "28px" }}></iconify-icon>
            </div>
            <div className={styles.allClearText}>
              <h4>All Systems Functional</h4>
              <p>No pending alerts, urgent disputes, or verification tickets require your attention right now.</p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE PROJECTS */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleIndicator}></div>
          <h3>Active Projects Snapshot</h3>
        </div>
        {activeProjects.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Technician / Company</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeProjects.map((project: any) => {
                  return (
                    <tr key={project.id}>
                      <td>
                        <div>
                          <strong style={{ color: "#001f3f", fontSize: 14 }}>{project.title}</strong>
                          {project.id && <small style={{ display: 'block', color: '#64748b', fontSize: '11px', marginTop: '2px' }}>ID: #{project.id}</small>}
                        </div>
                      </td>
                      <td>{project.client_name || "Client"}</td>
                      <td>{project.technician_name || "Pending / Not Assigned"}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#001f3f', fontSize: 13 }}>
                          {project.progress || "0%"}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${project.status === 'open' || project.status === 'in_progress' ? styles.statusActive : styles.statusPending}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setActionSuccess(null);
                          }}
                          className={styles.btnTable}
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          <iconify-icon icon="lucide:external-link" />
                          <span>Open Workspace</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:folder-open" style={{ fontSize: "36px", color: "#94a3b8" }}></iconify-icon>
            <p>No active projects at the moment.</p>
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleIndicator}></div>
          <h3>Recent Platform Activity</h3>
        </div>
        {recentActivities.length > 0 ? (
          <div className={styles.activityList}>
            {recentActivities.map((activity: any, i: number) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIconBox}>
                  <iconify-icon icon="lucide:info" style={{ fontSize: "16px", color: "#001f3f" }}></iconify-icon>
                </div>
                <span>{activity.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:activity" style={{ fontSize: "36px", color: "#94a3b8" }}></iconify-icon>
            <p>No recent activity logs available.</p>
          </div>
        )}
      </div>

      {/* ADMIN PROJECT WORKSPACE INSPECTION MODAL */}
      {selectedProjectId !== null && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProjectId(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.modalHeaderIcon}>
                  <iconify-icon icon="lucide:briefcase" />
                </div>
                <div>
                  <h3 className={styles.modalHeaderTitle}>
                    {projectTask?.title || selectedProjectSnapshot?.title || `Project #${selectedProjectId}`}
                  </h3>
                  <p className={styles.modalHeaderSub}>
                    Admin Project Workspace & Escrow Inspector &bull; Task ID #{selectedProjectId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedProjectId(null)}
                title="Close"
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className={styles.modalBody}>
              {actionSuccess && (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(34, 197, 94, 0.12)", color: "#16a34a", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 18 }} />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {projectTaskLoading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
                  <p style={{ marginTop: 10, fontWeight: 600 }}>Loading project workspace data...</p>
                </div>
              ) : (
                <>
                  {/* OVERVIEW & METRICS */}
                  <div className={styles.workspaceGrid2}>
                    {/* CLIENT & CONTRACTOR */}
                    <div className={styles.workspaceCard}>
                      <h4 className={styles.workspaceCardTitle}>
                        <iconify-icon icon="lucide:users" style={{ color: "#ff4500" }} /> Participants
                      </h4>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Client</span>
                        <span className={styles.workspaceStatValue}>
                          {projectTask?.client?.full_name || projectTask?.client_name || selectedProjectSnapshot?.client_name || "Client"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Client Email</span>
                        <span className={styles.workspaceStatValue}>
                          {projectTask?.client?.email || "—"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Assigned Pro</span>
                        <span className={styles.workspaceStatValue}>
                          {projectTask?.assigned_to?.full_name || projectTask?.technician_name || selectedProjectSnapshot?.technician_name || "Pending Assignment"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Pro Contact</span>
                        <span className={styles.workspaceStatValue}>
                          {projectTask?.assigned_to?.phone || projectTask?.assigned_to?.email || "—"}
                        </span>
                      </div>
                    </div>

                    {/* FINANCIALS & STATUS */}
                    <div className={styles.workspaceCard}>
                      <h4 className={styles.workspaceCardTitle}>
                        <iconify-icon icon="lucide:dollar-sign" style={{ color: "#16a34a" }} /> Escrow & Financials
                      </h4>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Budget</span>
                        <span className={styles.workspaceStatValue} style={{ color: "#16a34a", fontSize: 14 }}>
                          {projectTask?.budget ? `${Number(projectTask.budget).toLocaleString()} XAF` : "Negotiable"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Current Status</span>
                        <span className={`${styles.status} ${styles.statusActive}`} style={{ textTransform: 'capitalize' }}>
                          {projectTask?.status || selectedProjectSnapshot?.status || "open"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Location</span>
                        <span className={styles.workspaceStatValue}>
                          {[projectTask?.neighborhood, projectTask?.city, projectTask?.location_address].filter(Boolean).join(", ") || "Cameroon"}
                        </span>
                      </div>
                      <div className={styles.workspaceStatRow}>
                        <span className={styles.workspaceStatLabel}>Created Date</span>
                        <span className={styles.workspaceStatValue}>
                          {projectTask?.created_at ? new Date(projectTask.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT DESCRIPTION */}
                  <div className={styles.workspaceCard}>
                    <h4 className={styles.workspaceCardTitle}>
                      <iconify-icon icon="lucide:file-text" style={{ color: "#0284c7" }} /> Project Scope & Details
                    </h4>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {projectTask?.description || "No specific scope provided for this task."}
                    </p>
                  </div>

                  {/* ATTACHMENTS & MEDIA */}
                  {projectTask?.attachments && projectTask.attachments.length > 0 && (
                    <div className={styles.workspaceCard}>
                      <h4 className={styles.workspaceCardTitle}>
                        <iconify-icon icon="lucide:paperclip" style={{ color: "#8b5cf6" }} /> Uploaded Task Deliverables & Attachments ({projectTask.attachments.length})
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 10 }}>
                        {projectTask.attachments.map((att: any, idx: number) => {
                          const fileUrl = getImageUrl(att.file || att.file_url || att.url);
                          const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)/i);

                          return (
                            <a
                              key={idx}
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "10px",
                                borderRadius: "10px",
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                textDecoration: "none",
                                color: "#001f3f",
                                fontSize: "12px",
                                textAlign: "center",
                                transition: "all 0.2s ease"
                              }}
                            >
                              {isImage ? (
                                <img
                                  src={fileUrl}
                                  alt="attachment"
                                  style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                                />
                              ) : (
                                <iconify-icon icon="lucide:file-text" style={{ fontSize: 36, color: "#0284c7", margin: "16px 0" }} />
                              )}
                              <span style={{ fontWeight: 600, wordBreak: "break-all" }}>
                                {att.file_name || `Attachment #${idx + 1}`}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* MODAL FOOTER WITH GOVERNANCE ACTIONS */}
            <div className={styles.modalFooter}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className={styles.btnAction}
                  style={{ background: "#ca8a04", color: "#ffffff", border: "none", cursor: "pointer" }}
                  onClick={() => handleHoldEscrow(selectedProjectId)}
                  disabled={actionLoading}
                >
                  <iconify-icon icon="lucide:pause-circle" />
                  <span>Put On Hold</span>
                </button>
                <button
                  type="button"
                  className={styles.btnAction}
                  style={{ background: "#16a34a", color: "#ffffff", border: "none", cursor: "pointer" }}
                  onClick={() => handleReleaseEscrow(selectedProjectId)}
                  disabled={actionLoading}
                >
                  <iconify-icon icon="lucide:check-circle" />
                  <span>Release Milestone Escrow</span>
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href="/dashboard/admin/tasks"
                  className={styles.btnAction}
                  style={{ background: "#001f3f", color: "#ffffff", textDecoration: "none" }}
                >
                  <iconify-icon icon="lucide:list" />
                  <span>View All In Tasks Page</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(null)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#475569",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

