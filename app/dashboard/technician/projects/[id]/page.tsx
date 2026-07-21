"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianWorkspacePage() {
  const { id } = useParams();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // In a real app, you would fetch project details based on the `id` from useParams()
  // Here we use static mock data matching the screenshot
  const project = {
    id: id,
    name: "Residential Wiring",
    client: "John Mukasa",
    startDate: "2026-01-10",
    totalCost: "$2,000",
    status: "In Progress",
    progress: "45%",
    payment: {
      released: "$600",
      onHold: "$400",
      remaining: "$1,000"
    },
    milestones: [
      { name: "Planning & Wiring", percentage: "30%", amount: "$600", status: "Released" },
      { name: "Installation", percentage: "20%", amount: "$400", status: "Pending" },
      { name: "Final Testing", percentage: "50%", amount: "$1,000", status: "On Hold" },
    ],
    logs: [
      { icon: "✔", text: "Milestone 1 approved – Payment released" },
      { icon: "📤", text: "Progress submitted for Milestone 2" },
      { icon: "⏳", text: "Awaiting client confirmation" }
    ]
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold": return styles.statusHold;
      case "Released": return styles.statusReleased;
      case "Pending": return styles.statusPending;
      default: return "";
    }
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ margin: 0, color: '#001f3f', fontSize: 24 }}>Project Workspace</h1>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{project.name} – {project.client}</span>
            </div>

            <div className={styles.grid}>
              
              {/* LEFT COLUMN */}
              <div>
                
                {/* PROJECT OVERVIEW */}
                <section className={styles.card}>
                  <h3>Project Overview</h3>
                  <div className={styles.info}>
                    <p><strong>Client:</strong> {project.client}</p>
                    <p><strong>Start Date:</strong> {project.startDate}</p>
                    <p><strong>Total Project Cost:</strong> {project.totalCost}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>Status:</strong> 
                      <span className={`${styles.statusBadge} ${styles.statusReleased}`}>{project.status}</span>
                    </p>
                  </div>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: project.progress }}></div>
                  </div>
                  <div className={styles.progressText}>Overall Progress: {project.progress}</div>
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
                        {project.milestones.map((m, i) => (
                          <tr key={i}>
                            <td>{m.name}</td>
                            <td>{m.percentage}</td>
                            <td>{m.amount}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(m.status)}`}>
                                {m.status}
                              </span>
                            </td>
                            <td>
                              {m.status === "Pending" ? (
                                <button className={`${styles.outlineButton} ${styles.smallButton}`} onClick={() => setIsModalOpen(true)}>
                                  Submit
                                </button>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* ACTIVITY LOG */}
                <section className={styles.card}>
                  <h3>Activity Log</h3>
                  {project.logs.map((log, i) => (
                    <div key={i} className={styles.logItem}>
                      {log.icon} {log.text}
                    </div>
                  ))}
                </section>

              </div>

              {/* RIGHT COLUMN */}
              <div>
                
                {/* PAYMENT STATUS */}
                <section className={styles.card}>
                  <h3>Payment Status</h3>
                  <div className={styles.paymentRow}>
                    <span>Released:</span>
                    <strong>{project.payment.released}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>On Hold:</span>
                    <strong>{project.payment.onHold}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Remaining:</span>
                    <strong>{project.payment.remaining}</strong>
                  </div>
                </section>

                {/* QUICK ACTIONS */}
                <section className={styles.card}>
                  <h3>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
                      Submit Milestone Update
                    </button>
                    <button className={styles.outlineButton}>
                      Message Client
                    </button>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MILESTONE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>×</button>
            <h3>Submit Milestone Progress</h3>
            
            <form onSubmit={handleMilestoneSubmit}>
              <div className={styles.formGroup}>
                <label>Completion Percentage</label>
                <input type="number" className={styles.formInput} placeholder="e.g. 20" required />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description of Work Completed</label>
                <textarea className={styles.formTextarea} rows={4} placeholder="Describe the work you have completed..." required></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label>Upload Evidence</label>
                <input type="file" className={styles.formInput} style={{ padding: '8px' }} />
              </div>
              
              <button type="submit" className={styles.primaryButton}>Submit</button>
              
              {showSuccess && (
                <div className={styles.successMessage}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 18 }} />
                  Milestone submitted. Client & Admin notified.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
