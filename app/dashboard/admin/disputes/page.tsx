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
        params.status = activeFilter.replace("-", "_");
      }
      const data = await api.getDisputes(params);
      const mapped = (Array.isArray(data) ? data : []).map((d: any) => {
        let st = d.status || "open";
        st = st.replace("_", " ");
        st = st.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

        return {
          id: String(d.id),
          created_at: d.opened_at || d.created_at || new Date().toISOString(),
          task: { title: d.task_title || `Task #${d.task}`, id: d.task },
          raised_by: {
            first_name: d.opened_by_name?.split(' ')[0] || "Client",
            last_name: d.opened_by_name?.split(' ').slice(1).join(' ') || "",
            email: d.opened_by_email || ""
          },
          against: d.against_name ? {
            first_name: d.against_name.split(' ')[0] || "",
            last_name: d.against_name.split(' ').slice(1).join(' ') || "",
            email: d.against_email || ""
          } : undefined,
          reason: d.reason || d.title || "Milestone re-evaluation request",
          status: st as DisputeStatus,
          description: d.description || d.title || "Client and technician requested platform arbitration regarding milestone scope delivery.",
          resolution: d.resolution
        };
      });
      setDisputes(mapped);
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
        newStatus = "Under Review";
        resolutionPrefix = "Issued formal warning to executor";
        break;
      case "Refund Client":
        newStatus = "Resolved";
        resolutionPrefix = "Full refund awarded to client";
        break;
      case "Release to Technician":
        newStatus = "Resolved";
        resolutionPrefix = "Escrow funds released to technician";
        break;
      case "Split Escrow (50/50)":
        newStatus = "Resolved";
        resolutionPrefix = "Escrow split 50/50 between parties";
        break;
      case "Dismiss Dispute":
        newStatus = "Resolved";
        resolutionPrefix = "Dispute dismissed without penalty";
        break;
      default:
        break;
    }

    try {
      await api.updateDispute(Number(selectedDispute.id), {
        status: newStatus.toLowerCase().replace(" ", "_"),
        resolution: `${resolutionPrefix}. Admin notes: ${adminNotes || "None"}`,
      });
      setSubmitted(true);
      fetchDisputes();
      setTimeout(() => setSelectedDispute(null), 1500);
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
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:scale" /> Dispute Resolution & Arbitration
          </div>
          <h1 className={styles.heroTitle}>Disputes & Claims Center</h1>
          <p className={styles.heroSubtitle}>
            Supervise project escalations, investigate evidence impartially, and execute secure milestone escrow releases across the marketplace.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:gavel" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:layers" />
          </div>
          <div>
            <div className={styles.statLabel}>Total Claims</div>
            <div className={styles.statValue}>{totals.total}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:alert-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>Open Claims</div>
            <div className={styles.statValue}>{totals.open}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:search" />
          </div>
          <div>
            <div className={styles.statLabel}>Under Review</div>
            <div className={styles.statValue}>{totals.underReview}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:check-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>Resolved</div>
            <div className={styles.statValue}>{totals.resolved}</div>
          </div>
        </div>
      </div>

      {/* MAIN DISPUTES TABLE CARD */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon="lucide:shield-alert" style={{ color: "#ff4500" }} /> Live Disputes Queue
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Claims" },
              { key: "open", label: "Open" },
              { key: "under-review", label: "Under Review" },
              { key: "escalated", label: "Escalated" },
              { key: "resolved", label: "Resolved" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterPillActive : ""}`}
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
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading dispute claims...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 52, color: "#16a34a", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Disputes in this Category</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>All projects in this queue are running smoothly without active conflicts.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Date</th>
                  <th>Associated Project</th>
                  <th>Reported By</th>
                  <th>Claim Reason</th>
                  <th>Status</th>
                  <th>Arbitration</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 800, color: "#001f3f" }}>#{d.id}</td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>
                      <strong style={{ color: "#001f3f" }}>{d.task?.title || `Task #${d.task?.id}`}</strong>
                    </td>
                    <td>
                      <div>
                        <strong style={{ display: "block", color: "#001f3f" }}>
                          {d.raised_by?.first_name} {d.raised_by?.last_name}
                        </strong>
                        {d.raised_by?.email && <small style={{ color: "#64748b" }}>{d.raised_by.email}</small>}
                      </div>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <span style={{ color: "#475569", fontWeight: 600 }}>{d.reason}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusClass[d.status] || styles.statusOpen}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.btnReview} onClick={() => handleOpenDispute(d)}>
                        <iconify-icon icon="lucide:gavel" /> Arbitrate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ARBITRATION DECISION MODAL */}
      {selectedDispute && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDispute(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, color: "#001f3f", fontWeight: 800 }}>
                  Arbitrate Dispute #{selectedDispute.id}
                </h3>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  Project: <strong>{selectedDispute.task.title}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className={styles.modalCloseBtn}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
              {/* Parties Overview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "#f8fafc", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Claimant</span>
                  <strong style={{ fontSize: 14, color: "#001f3f" }}>
                    {selectedDispute.raised_by.first_name} {selectedDispute.raised_by.last_name}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Dispute Status</span>
                  <span className={`${styles.statusBadge} ${statusClass[selectedDispute.status] || styles.statusOpen}`} style={{ marginTop: 2 }}>
                    {selectedDispute.status}
                  </span>
                </div>
              </div>

              {/* Dispute Description */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Claim Reason & Statement
                </label>
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: 14, borderRadius: 12, fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>
                  <strong style={{ display: "block", marginBottom: 4, color: "#ff4500" }}>{selectedDispute.reason}</strong>
                  {selectedDispute.description}
                </div>
              </div>

              {/* Admin Decision Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Admin Arbitration Decision
                </label>
                <select
                  value={adminAction}
                  onChange={(e) => setAdminAction(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 14, fontWeight: 700, color: "#001f3f", outline: "none", cursor: "pointer" }}
                >
                  <option value="Request More Evidence">Request More Evidence (Status: Under Review)</option>
                  <option value="Release to Technician">Release Escrow Funds to Technician (Full Payout)</option>
                  <option value="Refund Client">Refund Milestone Escrow to Client (Full Refund)</option>
                  <option value="Split Escrow (50/50)">Split Escrow 50/50 (Compromise Settlement)</option>
                  <option value="Warn Executor">Issue Formal Warning & Keep Escrow On Hold</option>
                  <option value="Dismiss Dispute">Dismiss Dispute Claim (No Action)</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Arbitration Statement / Ruling Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the rationale for this arbitration ruling..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 13.5, color: "#0f172a", outline: "none", resize: "vertical" }}
                />
              </div>

              {submitted && (
                <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#15803d", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
                  ✔ Dispute decision submitted and escrow actions queued!
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#ffffff", fontWeight: 700, color: "#64748b", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.btnReview}
                style={{ flex: 1.5, justifyContent: "center", padding: "12px 18px" }}
              >
                <iconify-icon icon="lucide:check" /> Execute Arbitration Ruling
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
