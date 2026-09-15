"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./admin-tasks.module.css";

export default function AdminTasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data, loading, refetch } = useFetch(() => api.getAdminProjects(), []);

  // Modals state
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Workspace Inspector Modal
  const [workspaceTaskId, setWorkspaceTaskId] = useState<number | null>(null);
  const { data: workspaceTask, loading: workspaceTaskLoading } = useFetch(
    () => workspaceTaskId ? api.getTask(workspaceTaskId) : Promise.resolve(null),
    [workspaceTaskId]
  );

  const stats = data?.stats || { active_projects: 0, awaiting_validation: 0, on_hold: 0, completed: 0 };
  const projects = data?.projects || [];

  const filteredProjects = projects.filter((p: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "tech") return p.type === "tech" || !p.type;
    if (activeTab === "company") return p.type === "company";
    return true;
  });

  const openReleaseModal = (id: number) => {
    setSelectedTaskId(id);
    setReleaseSuccess(false);
    setReleaseModalOpen(true);
  };

  const openHoldModal = (id: number) => {
    setSelectedTaskId(id);
    setHoldModalOpen(true);
  };

  const handleConfirmRelease = async () => {
    if (!selectedTaskId) return;
    setActionLoading(true);
    try {
      await api.releaseProjectMilestone(selectedTaskId);
      setReleaseSuccess(true);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to release milestone.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmHold = async () => {
    if (!selectedTaskId) return;
    setActionLoading(true);
    try {
      await api.holdProjectMilestone(selectedTaskId);
      setHoldModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to put on hold.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:kanban" /> Real-Time Task & Milestone Tracking
          </div>
          <h1 className={styles.heroTitle}>Projects & Task Monitoring</h1>
          <p className={styles.heroSubtitle}>
            Audit ongoing job deliverables, validate milestone completion evidence, and manage escrow disbursements for clients and technicians.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:activity" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:play-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>Active Projects</div>
            <div className={styles.statValue}>{stats.active_projects}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:clock" />
          </div>
          <div>
            <div className={styles.statLabel}>Awaiting Validation</div>
            <div className={styles.statValue}>{stats.awaiting_validation}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(234, 179, 8, 0.12)", color: "#ca8a04" }}>
            <iconify-icon icon="lucide:pause-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>On Hold</div>
            <div className={styles.statValue}>{stats.on_hold}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:check-circle-2" />
          </div>
          <div>
            <div className={styles.statLabel}>Completed</div>
            <div className={styles.statValue}>{stats.completed}</div>
          </div>
        </div>
      </div>

      {/* PROJECTS CARD */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon="lucide:layout-grid" style={{ color: "#ff4500" }} /> Projects Monitoring Queue
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Projects" },
              { key: "tech", label: "Technician Projects" },
              { key: "company", label: "Company Projects" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveTab(f.key)}
                className={`${styles.filterPill} ${activeTab === f.key ? styles.filterPillActive : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading project monitoring data...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:folder-x" style={{ fontSize: 52, color: "#94a3b8", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Projects Found</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>There are no active projects matching this filter criteria.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Technician</th>
                  <th>Progress</th>
                  <th>Milestone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p: any) => (
                  <tr key={p.id}>
                    <td>
                      <div>
                        <strong style={{ color: "#001f3f", display: "block" }}>{p.title}</strong>
                        <small style={{ color: "#64748b" }}>ID: #{p.id}</small>
                      </div>
                    </td>
                    <td>{p.client}</td>
                    <td>{p.tech}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className={styles.progressWrapper}>
                          <div className={styles.progressFill} style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#001f3f" }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "#475569" }}>{p.milestone}</span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${p.status?.toLowerCase().includes("hold") ? styles.statusHold : p.status?.toLowerCase().includes("active") ? styles.statusActive : styles.statusPending}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          onClick={() => setWorkspaceTaskId(p.id)}
                          title="Open Project Workspace Inspector"
                          style={{ border: "none" }}
                        >
                          <iconify-icon icon="lucide:external-link" /> Workspace
                        </button>
                        <button className={styles.btnPrimary} onClick={() => openReleaseModal(p.id)}>
                          <iconify-icon icon="lucide:check" /> Release
                        </button>
                        <button className={styles.btnWarning} onClick={() => openHoldModal(p.id)}>
                          <iconify-icon icon="lucide:pause" /> Hold
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* WORKSPACE INSPECTOR MODAL */}
      {workspaceTaskId !== null && (
        <div className={styles.modal} onClick={() => setWorkspaceTaskId(null)}>
          <div className={styles.modalContent} style={{ maxWidth: 740, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setWorkspaceTaskId(null)}>
              <iconify-icon icon="lucide:x" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#001f3f", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                <iconify-icon icon="lucide:briefcase" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 19, color: "#001f3f", fontWeight: 800 }}>
                  {workspaceTask?.title || `Project Workspace #${workspaceTaskId}`}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
                  Task ID #{workspaceTaskId} &bull; Admin Oversight & Milestones
                </p>
              </div>
            </div>

            {workspaceTaskLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
                <p style={{ marginTop: 10, fontWeight: 600 }}>Loading project workspace data...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Client & Pro</div>
                    <div style={{ fontSize: 13.5, color: "#001f3f", fontWeight: 700 }}>
                      Client: {workspaceTask?.client?.full_name || workspaceTask?.client_name || "Client"}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
                      Technician: {workspaceTask?.assigned_to?.full_name || "Pending / Not Assigned"}
                    </div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Financials & Status</div>
                    <div style={{ fontSize: 14, color: "#16a34a", fontWeight: 800 }}>
                      Budget: {workspaceTask?.budget ? `${Number(workspaceTask.budget).toLocaleString()} XAF` : "Negotiable"}
                    </div>
                    <div style={{ fontSize: 13, color: "#001f3f", marginTop: 4, textTransform: "capitalize" }}>
                      Status: <strong style={{ color: "#ff4500" }}>{workspaceTask?.status || "open"}</strong>
                    </div>
                  </div>
                </div>

                {/* Scope */}
                <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Project Scope</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {workspaceTask?.description || "No specific details provided."}
                  </p>
                </div>

                {/* Attachments */}
                {workspaceTask?.attachments && workspaceTask.attachments.length > 0 && (
                  <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
                      Deliverables & Attachments ({workspaceTask.attachments.length})
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                      {workspaceTask.attachments.map((att: any, idx: number) => {
                        const fileUrl = getImageUrl(att.file || att.file_url || att.url);
                        const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)/i);
                        return (
                          <a
                            key={idx}
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              background: "#ffffff",
                              border: "1px solid #cbd5e1",
                              textAlign: "center",
                              textDecoration: "none",
                              color: "#001f3f",
                              fontSize: "12px",
                              display: "block"
                            }}
                          >
                            {isImage ? (
                              <img src={fileUrl} alt="deliverable" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 4, marginBottom: 4 }} />
                            ) : (
                              <iconify-icon icon="lucide:file-text" style={{ fontSize: 28, color: "#0284c7", margin: "10px 0" }} />
                            )}
                            <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {att.file_name || `File #${idx + 1}`}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Modal Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => {
                        setWorkspaceTaskId(null);
                        openReleaseModal(workspaceTaskId);
                      }}
                    >
                      <iconify-icon icon="lucide:check" /> Release Escrow
                    </button>
                    <button
                      type="button"
                      className={styles.btnWarning}
                      onClick={() => {
                        setWorkspaceTaskId(null);
                        openHoldModal(workspaceTaskId);
                      }}
                    >
                      <iconify-icon icon="lucide:pause" /> Put on Hold
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWorkspaceTaskId(null)}
                    style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RELEASE MODAL */}
      {releaseModalOpen && (
        <div className={styles.modal} onClick={() => setReleaseModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setReleaseModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#001f3f", fontWeight: 800 }}>Confirm Milestone Escrow Release</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Are you sure you want to release the escrow funds for Project #{selectedTaskId}? This will immediately transfer payout to the technician wallet.
            </p>
            <div className={styles.alertBox}>
              <strong>⚡ Instant Action:</strong> Escrow payout cannot be automatically undone once confirmed.
            </div>
            {releaseSuccess ? (
              <div className={styles.successBox}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 20 }} />
                <span>Milestone escrow released successfully!</span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setReleaseModalOpen(false)}
                  style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#ffffff", fontWeight: 700, color: "#64748b", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  style={{ flex: 1.5, justifyContent: "center", padding: "12px 18px", fontSize: 13 }}
                  onClick={handleConfirmRelease}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm & Release Escrow"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HOLD MODAL */}
      {holdModalOpen && (
        <div className={styles.modal} onClick={() => setHoldModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setHoldModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#001f3f", fontWeight: 800 }}>Put Milestone on Hold</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Placing Project #{selectedTaskId} on hold freezes milestone automatic releases and alerts both client and contractor.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setHoldModalOpen(false)}
                style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#ffffff", fontWeight: 700, color: "#64748b", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ flex: 1.5, justifyContent: "center", padding: "12px 18px", fontSize: 13, background: "#dc2626" }}
                onClick={handleConfirmHold}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm Hold Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

