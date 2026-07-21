"use client";

import { useState, useEffect } from "react";
import styles from "./admin-disputes.module.css";
import { api } from "@/app/lib/api";

type DisputeStatus = "Open" | "Under Review" | "Resolved" | "Escalated";

interface Dispute {
  id: string;
  created_at: string;
  task: { title: string; id: number };
  raised_by: { first_name: string; last_name: string; email: string };
  against?: { first_name: string; last_name: string; email: string };
  reason: string;
  status: DisputeStatus;
  description: string;
  resolution?: string;
}

const statusClass: Record<DisputeStatus, string> = {
  Open: styles.statusOpen,
  "Under Review": styles.statusReview,
  Resolved: styles.statusResolved,
  Escalated: styles.statusEscalated,
};

export default function AdminDisputesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [adminAction, setAdminAction] = useState("Request More Evidence");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, [activeFilter]);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeFilter !== "all") {
        params.status = activeFilter.replace("-", " ");
      }
      const data = await api.getDisputes(params);
      setDisputes(data);
    } catch (err) {
      console.error("Failed to fetch disputes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setAdminAction("Request More Evidence");
    setAdminNotes("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!selectedDispute) return;
    
    let newStatus = selectedDispute.status;
    let resolutionPrefix = "";

    switch (adminAction) {
      case "Request More Evidence":
        newStatus = "Under Review";
        resolutionPrefix = "Requested more evidence";
        break;
      case "Warn Executor":
        newStatus = "Resolved";
        resolutionPrefix = "Warned Executor";
        break;
      case "Put Payment On Hold":
        newStatus = "Under Review";
        resolutionPrefix = "Payment on hold";
        break;
      case "Resolve in Favor of Client":
        newStatus = "Resolved";
        resolutionPrefix = "Resolved for Client";
        break;
      case "Resolve in Favor of Executor":
        newStatus = "Resolved";
        resolutionPrefix = "Resolved for Executor";
        break;
      case "Escalate to Arbitration":
        newStatus = "Escalated";
        resolutionPrefix = "Escalated";
        break;
    }

    const finalResolution = `${resolutionPrefix}: ${adminNotes}`;

    try {
      await api.updateDispute(parseInt(selectedDispute.id), {
        status: newStatus.toLowerCase(),
        resolution: finalResolution,
      });
      setSubmitted(true);
      fetchDisputes();
      setTimeout(() => setSelectedDispute(null), 2000);
    } catch (err) {
      alert("Failed to update dispute.");
    }
  };

  const totals = {
    total: disputes.length,
    open: disputes.filter((d) => d.status.toLowerCase() === "open").length,
    underReview: disputes.filter((d) => d.status.toLowerCase() === "under review").length,
    resolved: disputes.filter((d) => d.status.toLowerCase() === "resolved").length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Disputes & Reports</h1>
        <p>Review, manage and resolve platform disputes between users.</p>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Disputes</div>
          <div className={styles.statValue}>{totals.total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Open</div>
          <div className={styles.statValue}>{totals.open}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Under Review</div>
          <div className={styles.statValue}>{totals.underReview}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Resolved</div>
          <div className={styles.statValue}>{totals.resolved}</div>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.mainCard}>
        <h3>Disputes & Reports</h3>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["all", "open", "under-review", "escalated", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: activeFilter === f ? "none" : "1px solid #e2e8f0",
                background: activeFilter === f ? "#001F3F" : "#fff",
                color: activeFilter === f ? "#fff" : "#64748b",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f === "all" ? "All" : f.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <p style={{ padding: "40px", textAlign: "center" }}>Loading disputes...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Task</th>
                  <th>Reported By</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600, color: "#001F3F" }}>{d.id}</td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>{d.task?.title || `Task #${d.task?.id}`}</td>
                    <td>{d.raised_by?.first_name} {d.raised_by?.last_name}</td>
                    <td>{d.reason}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusClass[d.status as DisputeStatus] || styles.statusOpen}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.btnOutline} onClick={() => handleOpenDispute(d)}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
                {disputes.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      No disputes found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedDispute && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDispute(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedDispute(null)}>×</button>
            <h3>Dispute Review — {selectedDispute.id}</h3>

            <div className={styles.modalBody}>
              <p><strong>Task:</strong> {selectedDispute.task?.title}</p>
              <p><strong>Reported By:</strong> {selectedDispute.raised_by?.first_name} {selectedDispute.raised_by?.last_name}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`${styles.statusBadge} ${statusClass[selectedDispute.status as DisputeStatus] || styles.statusOpen}`}>
                  {selectedDispute.status}
                </span>
              </p>

              <div className={styles.formGroup}>
                <label>Dispute Details</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  readOnly
                  value={selectedDispute.description}
                />
              </div>

              {selectedDispute.resolution && (
                <div className={styles.formGroup}>
                  <label>Current Resolution</label>
                  <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', border: '1px solid #e2e8f0' }}>
                    {selectedDispute.resolution}
                  </div>
                </div>
              )}

              {selectedDispute.status.toLowerCase() !== 'resolved' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Admin Action</label>
                    <select
                      className={styles.select}
                      value={adminAction}
                      onChange={(e) => setAdminAction(e.target.value)}
                    >
                      <option>Request More Evidence</option>
                      <option>Warn Executor</option>
                      <option>Put Payment On Hold</option>
                      <option>Resolve in Favor of Client</option>
                      <option>Resolve in Favor of Executor</option>
                      <option>Escalate to Arbitration</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Admin Notes</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      placeholder="Internal notes or instructions..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>

                  <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitted}>
                    {submitted ? "Decision Submitted" : "Submit Decision"}
                  </button>
                </>
              )}

              {submitted && (
                <div className={styles.successMsg} style={{ marginTop: '16px', color: '#10b981', background: '#ecfdf5', padding: '12px', borderRadius: '8px' }}>
                  ✔ Dispute action recorded and parties notified
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
