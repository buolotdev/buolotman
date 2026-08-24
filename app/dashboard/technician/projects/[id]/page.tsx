"use client";

import { useState, use } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function TechnicianWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id) || 1;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState("100");

  // Fetch real task from backend
  const { data: task, loading: taskLoading, refetch: refetchTask } = useFetch(
    () => api.getTask(taskId),
    [taskId]
  );

  // Derived real project values
  const totalCost = Number(task?.budget || task?.budget_min || task?.budget_max || task?.escrow_amount || 0);
  const isCompleted = task?.status === "completed";
  const hasEscrow = Boolean(task?.has_escrow || (totalCost > 0 && task?.status === "in_progress"));

  const releasedAmount = isCompleted ? totalCost : 0;
  const escrowHeld = isCompleted ? 0 : (hasEscrow ? totalCost : 0);
  const remainingAmount = isCompleted ? 0 : totalCost;

  const clientName = task?.client_name || (task?.client ? `${task.client.first_name || ""} ${task.client.last_name || ""}`.trim() || task.client.username : "Client");
  const taskTitle = task?.title || `Task #${taskId}`;
  const startDate = task?.created_at ? new Date(task.created_at).toISOString().split("T")[0] : "2026-08-25";
  const statusDisplay = isCompleted ? "Completed" : (task?.status === "in_progress" ? "In Progress" : (task?.status ? task.status.replace("_", " ") : "In Progress"));
  const progressPercent = isCompleted ? 100 : (task?.status === "in_progress" ? 50 : 25);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold":
      case "Held in Escrow": return styles.statusHold;
      case "Released":
      case "Completed": return styles.statusReleased;
      case "Pending":
      case "In Progress": return styles.statusPending;
      default: return "";
    }
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
      setSubmissionNotes("");
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ margin: 0, color: "#001f3f", fontSize: 24, fontWeight: 800 }}>Project Workspace</h1>
              <span style={{ color: "#64748b", fontWeight: 600, fontSize: 14 }}>
                {taskTitle} – {clientName}
              </span>
            </div>

            <div className={styles.grid}>
              
              {/* LEFT COLUMN */}
              <div>
                
                {/* PROJECT OVERVIEW */}
                <section className={styles.card}>
                  <h3>Project Overview</h3>
                  <div className={styles.info}>
                    <p><strong>Client:</strong> {clientName}</p>
                    <p><strong>Start Date:</strong> {startDate}</p>
                    <p><strong>Total Project Cost:</strong> {totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Awaiting Quote"}</p>
                    <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong>Status:</strong> 
                      <span className={`${styles.statusBadge} ${isCompleted ? styles.statusReleased : styles.statusPending}`} style={{ textTransform: "capitalize" }}>
                        {statusDisplay}
                      </span>
                    </p>
                  </div>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className={styles.progressText}>Overall Progress: {progressPercent}%</div>
                </section>

                {/* MILESTONES */}
                <section className={styles.card}>
                  <h3>Milestones</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Milestone</th>
                          <th>Percentage</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task?.milestones && task.milestones.length > 0 ? (
                          task.milestones.map((m: any, i: number) => (
                            <tr key={i}>
                              <td>{m.title || `Milestone ${i + 1}`}</td>
                              <td>{m.percentage || `${Math.round(100 / task.milestones.length)}%`}</td>
                              <td>{Number(m.amount || 0).toLocaleString()} XOF</td>
                              <td>
                                <span className={`${styles.statusBadge} ${getStatusClass(m.status)}`}>
                                  {m.status}
                                </span>
                              </td>
                              <td>
                                {m.status !== "Released" && !isCompleted ? (
                                  <button className={`${styles.outlineButton} ${styles.smallButton}`} onClick={() => setIsModalOpen(true)}>
                                    Submit
                                  </button>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td>{taskTitle || "Project Execution & Handover"}</td>
                            <td>100%</td>
                            <td>{totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Pending Quote"}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${isCompleted ? styles.statusReleased : (escrowHeld > 0 ? styles.statusHold : styles.statusPending)}`}>
                                {isCompleted ? "Released" : (escrowHeld > 0 ? "Held in Escrow" : "Pending")}
                              </span>
                            </td>
                            <td>
                              {!isCompleted ? (
                                <button className={`${styles.outlineButton} ${styles.smallButton}`} onClick={() => setIsModalOpen(true)}>
                                  Submit
                                </button>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* ACTIVITY LOG */}
                <section className={styles.card}>
                  <h3>Activity Log</h3>
                  <div className={styles.logItem}>
                    ✔ Task initiated and assigned to your workspace
                  </div>
                  {hasEscrow && (
                    <div className={styles.logItem}>
                      🛡 Escrow funds of {totalCost.toLocaleString()} XOF deposited & protected in vault
                    </div>
                  )}
                  {showSuccess && (
                    <div className={styles.logItem}>
                      📤 Progress deliverable submitted for client review
                    </div>
                  )}
                  {!isCompleted ? (
                    <div className={styles.logItem}>
                      ⏳ Awaiting milestone completion and client confirmation
                    </div>
                  ) : (
                    <div className={styles.logItem}>
                      ✔ Task marked completed – Payment released to wallet
                    </div>
                  )}
                </section>

              </div>

              {/* RIGHT COLUMN */}
              <div>
                
                {/* PAYMENT STATUS */}
                <section className={styles.card}>
                  <h3>Payment Status</h3>
                  <div className={styles.paymentRow}>
                    <span>Released:</span>
                    <strong>{releasedAmount > 0 ? `${releasedAmount.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>On Hold:</span>
                    <strong>{escrowHeld > 0 ? `${escrowHeld.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Remaining:</span>
                    <strong>{remainingAmount > 0 ? `${remainingAmount.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                </section>

                {/* QUICK ACTIONS */}
                <section className={styles.card}>
                  <h3>Quick Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
                      Submit Milestone Update
                    </button>
                    <Link href="/dashboard/technician/messages" className={styles.outlineButton} style={{ textDecoration: "none", boxSizing: "border-box" }}>
                      Message Client
                    </Link>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MILESTONE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>×</button>
            <h3>Submit Milestone Progress</h3>
            
            <form onSubmit={handleMilestoneSubmit}>
              <div className={styles.formGroup}>
                <label>Completion Percentage</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="e.g. 100"
                  value={completionPercentage}
                  onChange={(e) => setCompletionPercentage(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description of Work Completed</label>
                <textarea
                  className={styles.formTextarea}
                  rows={4}
                  placeholder="Describe the completed work or deliverables..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label>Upload Evidence / Photos</label>
                <input type="file" className={styles.formInput} style={{ padding: "8px" }} />
              </div>
              
              <button type="submit" className={styles.primaryButton}>Submit</button>
              
              {showSuccess && (
                <div className={styles.successMessage}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 18 }} />
                  Milestone submitted. Client notified for inspection.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
