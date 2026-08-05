"use client";

import React, { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
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

  if (loading) {
    return (
      <div className={styles.page}>
        <SkeletonBlock style={{ height: 100, marginBottom: 30, borderRadius: 16 }} />
        <SkeletonBlock style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  const stats = data?.stats || { active_projects: 0, awaiting_validation: 0, on_hold: 0, completed: 0 };
  const projects = data?.projects || [];

  const filteredProjects = projects.filter((p: any) => {
    if (activeTab === "all") return true;
    return p.type === activeTab;
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
      refetch(); // Refresh data
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
      
      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><span>Active Projects</span><h3>{stats.active_projects}</h3></div>
        <div className={styles.statCard}><span>Awaiting Validation</span><h3>{stats.awaiting_validation}</h3></div>
        <div className={styles.statCard}><span>On Hold</span><h3>{stats.on_hold}</h3></div>
        <div className={styles.statCard}><span>Completed</span><h3>{stats.completed}</h3></div>
      </div>

      {/* PROJECTS CARD */}
      <div className={styles.card}>
        <h3>Projects Monitoring</h3>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`} onClick={() => setActiveTab("all")}>All Projects</button>
          <button className={`${styles.tab} ${activeTab === "tech" ? styles.tabActive : ""}`} onClick={() => setActiveTab("tech")}>Technician Projects</button>
          <button className={`${styles.tab} ${activeTab === "company" ? styles.tabActive : ""}`} onClick={() => setActiveTab("company")}>Company Projects</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project</th>
                {activeTab !== 'tech' && activeTab !== 'company' && <th>Client</th>}
                {activeTab !== 'company' && <th>Technician</th>}
                {activeTab === 'company' && <th>Company</th>}
                <th>Progress</th>
                <th>Milestone</th>
                {activeTab === 'all' && <th>Status</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.project}</td>
                  {activeTab !== 'tech' && activeTab !== 'company' && <td>{p.client}</td>}
                  <td>{p.executor}</td>
                  <td>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressFill} style={{ width: p.progress + "%" }}></div>
                    </div>
                  </td>
                  <td>{p.milestone}</td>
                  
                  {activeTab === 'all' && (
                    <td>
                      <span className={`${styles.status} ${p.status === 'Released' ? styles.statusActive : p.status === 'On Hold' ? styles.statusHold : styles.statusPending}`}>
                        {p.status}
                      </span>
                    </td>
                  )}

                  <td>
                    {p.status !== 'Released' ? (
                      <>
                        <button className={styles.btnPrimary} onClick={() => openReleaseModal(p.id)}>Confirm & Release</button>
                        <button className={styles.btnWarning} onClick={() => openHoldModal(p.id)}>Hold</button>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: '#1e8e3e', fontWeight: 600 }}>✔ Released</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#666" }}>No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HOLD MODAL */}
      {holdModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setHoldModalOpen(false)}>×</button>
            <h3>Payment On Hold</h3>
            <div className={styles.alertBox}>
              Are you sure you want to place the active milestone payment on hold?
            </div>
            <div style={{ marginTop: 20 }}>
               <button className={styles.btnWarning} onClick={handleConfirmHold} disabled={actionLoading}>
                 {actionLoading ? "Processing..." : "Confirm Hold"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* RELEASE MODAL */}
      {releaseModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setReleaseModalOpen(false)}>×</button>
            <h3>Milestone Payment Release</h3>
            <p>This action will release the milestone payment from the client's escrow account to the executor's wallet.</p>
            
            {!releaseSuccess && (
              <button className={styles.btnPrimary} onClick={handleConfirmRelease} disabled={actionLoading}>
                {actionLoading ? "Processing..." : "Release Payment"}
              </button>
            )}

            {releaseSuccess && (
              <div className={styles.successBox}>
                <iconify-icon icon="lucide:check-circle"></iconify-icon>
                Milestone confirmed and payment released successfully
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
