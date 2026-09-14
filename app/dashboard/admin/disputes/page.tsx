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

interface SafetyReport {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role: string;
  issueType: string;
  username: string;
  reference: string;
  description: string;
  contactMethod: string;
  status: "Open" | "Under Review" | "Resolved" | "Action Taken";
  adminNotes?: string;
}

const DEFAULT_SAFETY_REPORTS: SafetyReport[] = [
  {
    id: "SR-892104",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    name: "Kwame Mensah",
    email: "kwame.mensah@gmail.com",
    role: "Client",
    issueType: "Suspicious / Fake Account",
    username: "@fast_repair_pro",
    reference: "PRJ-9042",
    description: "The technician asked for direct wire transfer outside platform escrow before showing up to the worksite.",
    contactMethod: "Email",
    status: "Open"
  },
  {
    id: "SR-849102",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: "Amina Diallo",
    email: "amina.diallo@probuild.co",
    role: "Company",
    issueType: "False Credentials",
    username: "@electro_master",
    reference: "TASK-8120",
    description: "Uploaded electrical license appears to belong to another individual with mismatched registration numbers.",
    contactMethod: "Platform Message",
    status: "Under Review"
  }
];

export default function AdminDisputesPage() {
  const [mainTab, setMainTab] = useState<"disputes" | "safety">("disputes");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedSafetyReport, setSelectedSafetyReport] = useState<SafetyReport | null>(null);
  const [safetyAction, setSafetyAction] = useState("Investigating");
  const [safetyNotes, setSafetyNotes] = useState("");
  const [safetySubmitted, setSafetySubmitted] = useState(false);
  const [adminAction, setAdminAction] = useState("Request More Evidence");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
    loadSafetyReports();
  }, [activeFilter]);

  const loadSafetyReports = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("boulotman_safety_reports");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSafetyReports(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SAFETY_REPORTS);
          return;
        } catch {
          // fallback
        }
      }
      localStorage.setItem("boulotman_safety_reports", JSON.stringify(DEFAULT_SAFETY_REPORTS));
      setSafetyReports(DEFAULT_SAFETY_REPORTS);
    }
  };

  const handleOpenSafetyReport = (report: SafetyReport) => {
    setSelectedSafetyReport(report);
    setSafetyAction(report.status === "Open" ? "Investigating" : report.status);
    setSafetyNotes(report.adminNotes || "");
    setSafetySubmitted(false);
  };

  const handleSafetySubmit = () => {
    if (!selectedSafetyReport) return;
    let newStatus: SafetyReport["status"] = "Under Review";
    if (safetyAction === "Investigating") newStatus = "Under Review";
    else if (safetyAction === "Issue Warning" || safetyAction === "Suspend Account") newStatus = "Action Taken";
    else if (safetyAction === "Dismiss / Resolved") newStatus = "Resolved";

    const updated = safetyReports.map((r) => {
      if (r.id === selectedSafetyReport.id) {
        return {
          ...r,
          status: newStatus,
          adminNotes: safetyNotes
        };
      }
      return r;
    });

    setSafetyReports(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("boulotman_safety_reports", JSON.stringify(updated));
    }
    setSafetySubmitted(true);
    setTimeout(() => {
      setSelectedSafetyReport(null);
    }, 1200);
  };

  const handleDeleteSafetyReport = (id: string) => {
    if (!confirm(`Are you sure you want to delete report #${id}?`)) return;
    const updated = safetyReports.filter((r) => r.id !== id);
    setSafetyReports(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("boulotman_safety_reports", JSON.stringify(updated));
    }
  };

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
    total: mainTab === "disputes" ? disputes.length : safetyReports.length,
    open: mainTab === "disputes" 
      ? disputes.filter((d) => d.status.toLowerCase() === "open").length
      : safetyReports.filter((r) => r.status === "Open").length,
    underReview: mainTab === "disputes"
      ? disputes.filter((d) => d.status.toLowerCase() === "under review").length
      : safetyReports.filter((r) => r.status === "Under Review").length,
    resolved: mainTab === "disputes"
      ? disputes.filter((d) => d.status.toLowerCase() === "resolved").length
      : safetyReports.filter((r) => r.status === "Resolved" || r.status === "Action Taken").length,
  };

  const filteredSafetyReports = safetyReports.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "open") return r.status === "Open";
    if (activeFilter === "under-review") return r.status === "Under Review";
    if (activeFilter === "resolved") return r.status === "Resolved" || r.status === "Action Taken";
    return true;
  });

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

      {/* TAB SELECTOR: DISPUTES VS SAFETY REPORTS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => { setMainTab("disputes"); setActiveFilter("all"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: 14.5,
            border: mainTab === "disputes" ? "2px solid #001f3f" : "1px solid #cbd5e1",
            background: mainTab === "disputes" ? "#001f3f" : "#ffffff",
            color: mainTab === "disputes" ? "#ffffff" : "#475569",
            cursor: "pointer",
            boxShadow: mainTab === "disputes" ? "0 4px 12px rgba(0, 31, 63, 0.2)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <iconify-icon icon="lucide:scale" style={{ fontSize: 18 }} />
          <span>Milestone Disputes ({disputes.length})</span>
        </button>

        <button
          onClick={() => { setMainTab("safety"); setActiveFilter("all"); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: 14.5,
            border: mainTab === "safety" ? "2px solid #ff4500" : "1px solid #cbd5e1",
            background: mainTab === "safety" ? "#ff4500" : "#ffffff",
            color: mainTab === "safety" ? "#ffffff" : "#475569",
            cursor: "pointer",
            boxShadow: mainTab === "safety" ? "0 4px 12px rgba(255, 69, 0, 0.25)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 18 }} />
          <span>Safety & Trust Reports ({safetyReports.length})</span>
        </button>
      </div>

      {/* MAIN DISPUTES / SAFETY TABLE CARD */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon={mainTab === "disputes" ? "lucide:shield-alert" : "lucide:alert-triangle"} style={{ color: "#ff4500" }} />
            {mainTab === "disputes" ? " Live Disputes Queue" : " Safety Concern Submissions (from /safety)"}
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Items" },
              { key: "open", label: "Open" },
              { key: "under-review", label: "Under Review" },
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
          {mainTab === "disputes" ? (
            loading ? (
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
            )
          ) : (
            filteredSafetyReports.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
                <iconify-icon icon="lucide:shield-check" style={{ fontSize: 52, color: "#16a34a", marginBottom: 12 }} />
                <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Safety Reports in this Category</h4>
                <p style={{ margin: 0, fontSize: 13.5 }}>No safety concerns or violation reports pending under this filter.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Date</th>
                    <th>Reporter Details</th>
                    <th>Concern Type</th>
                    <th>Reported Target</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSafetyReports.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 800, color: "#ff4500" }}>#{r.id}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <div>
                          <strong style={{ display: "block", color: "#001f3f" }}>{r.name}</strong>
                          <span style={{ fontSize: 12, color: "#64748b" }}>{r.email} ({r.role})</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "#b91c1c", background: "#fef2f2", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>
                          {r.issueType}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: "#001f3f" }}>{r.username || "Not specified"}</strong>
                          {r.reference && <div style={{ fontSize: 12, color: "#64748b" }}>Ref: {r.reference}</div>}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${r.status === "Open" ? styles.statusOpen : r.status === "Under Review" ? styles.statusReview : styles.statusResolved}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className={styles.btnReview} onClick={() => handleOpenSafetyReport(r)}>
                            <iconify-icon icon="lucide:eye" /> Review
                          </button>
                          <button
                            onClick={() => handleDeleteSafetyReport(r.id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: "1px solid #fecaca",
                              background: "#fff",
                              color: "#dc2626",
                              cursor: "pointer"
                            }}
                            title="Delete Report"
                          >
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {/* ARBITRATION DECISION MODAL (DISPUTES) */}
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

      {/* SAFETY REPORT REVIEW MODAL */}
      {selectedSafetyReport && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSafetyReport(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, color: "#001f3f", fontWeight: 800 }}>
                  Review Safety Concern #{selectedSafetyReport.id}
                </h3>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  Concern Type: <strong style={{ color: "#ff4500" }}>{selectedSafetyReport.issueType}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSafetyReport(null)}
                className={styles.modalCloseBtn}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
              {/* Reporter Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, background: "#f8fafc", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Reported By</span>
                  <strong style={{ fontSize: 14, color: "#001f3f" }}>{selectedSafetyReport.name}</strong>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{selectedSafetyReport.email} ({selectedSafetyReport.role})</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Reported Target / Company</span>
                  <strong style={{ fontSize: 14, color: "#ff4500" }}>{selectedSafetyReport.username || "Not specified"}</strong>
                  {selectedSafetyReport.reference && <div style={{ fontSize: 12, color: "#64748b" }}>Ref: {selectedSafetyReport.reference}</div>}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Incident Description & Evidence
                </label>
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: 14, borderRadius: 12, fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>
                  {selectedSafetyReport.description}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
                  Preferred contact method: <strong>{selectedSafetyReport.contactMethod || "Email"}</strong>
                </div>
              </div>

              {/* Action Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Trust & Safety Action
                </label>
                <select
                  value={safetyAction}
                  onChange={(e) => setSafetyAction(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 14, fontWeight: 700, color: "#001f3f", outline: "none", cursor: "pointer" }}
                >
                  <option value="Investigating">Mark as Under Investigation (Status: Under Review)</option>
                  <option value="Issue Warning">Issue Formal Account Warning to Reported User</option>
                  <option value="Suspend Account">Temporary Suspend Reported User</option>
                  <option value="Dismiss / Resolved">Dismiss Report / Mark Resolved</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Internal Safety Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record investigation notes, actions taken, or outreach status..."
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 13.5, color: "#0f172a", outline: "none", resize: "vertical" }}
                />
              </div>

              {safetySubmitted && (
                <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#15803d", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 16 }}>
                  ✔ Safety report updated successfully!
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <button
                type="button"
                onClick={() => setSelectedSafetyReport(null)}
                style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#ffffff", fontWeight: 700, color: "#64748b", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSafetySubmit}
                className={styles.btnReview}
                style={{ flex: 1.5, justifyContent: "center", padding: "12px 18px" }}
              >
                <iconify-icon icon="lucide:check" /> Update Safety Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
