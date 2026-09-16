"use client";

import React, { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./admin-payments.module.css";

export default function AdminPaymentsPage() {
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(async () => {
    try {
      const res = await api.getAdminTransactions();
      if (res && (Array.isArray(res) ? res.length > 0 : (res.results && res.results.length > 0))) {
        return res;
      }
      // If admin endpoint returned empty, attempt general ledger
      const general = await api.getTransactions();
      if (general && (Array.isArray(general) ? general.length > 0 : (general.results && general.results.length > 0))) {
        return general;
      }
      return res || general || [];
    } catch {
      return api.getTransactions().catch(() => []);
    }
  }, []);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const transactions = (Array.isArray(txData) ? txData : (txData as any)?.results || []) as any[];

  const filteredTx = transactions.filter((tx: any) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "escrow") return tx.type?.toLowerCase().includes("escrow") || tx.category?.toLowerCase().includes("escrow") || tx.description?.toLowerCase().includes("escrow");
    if (activeFilter === "payout") return tx.type?.toLowerCase().includes("payout") || tx.type?.toLowerCase().includes("withdrawal") || tx.category?.toLowerCase().includes("withdrawal") || tx.description?.toLowerCase().includes("withdraw");
    if (activeFilter === "completed") return tx.status?.toLowerCase().includes("completed") || tx.status?.toLowerCase().includes("success");
    return true;
  });

  const totalInEscrow = txData?.total_in_escrow ? Number(txData.total_in_escrow).toLocaleString() + " XOF" : "0 XOF";
  const pendingPayouts = txData?.pending_payouts ?? 0;
  const platformRevenue = txData?.total ? Number(txData.total).toLocaleString() + " XOF" : "0 XOF";
  const totalTxCount = transactions.length;

  const handleUpdateStatus = async (txId: number, status: string) => {
    if (!confirm(`Are you sure you want to mark transaction #${txId} as ${status}?`)) return;
    setUpdatingId(txId);
    try {
      await api.adminUpdateTransactionStatus(txId, status);
      await refetchTx();
    } catch (err: any) {
      alert(err.message || "Failed to update transaction status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className={styles.dashboardBody}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:shield-check" /> Escrow & Financial Control Center
          </div>
          <h1 className={styles.heroTitle}>Payments & Escrow Management</h1>
          <p className={styles.heroSubtitle}>
            Monitor platform liquidity, oversee project escrow releases, track automated commissions, and process technician payouts securely.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:wallet" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.overviewGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:lock" />
          </div>
          <div>
            <div className={styles.statLabel}>Total in Escrow</div>
            <div className={styles.statValue}>{totalInEscrow}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:arrow-up-right" />
          </div>
          <div>
            <div className={styles.statLabel}>Pending Payouts</div>
            <div className={styles.statValue}>{pendingPayouts}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:trending-up" />
          </div>
          <div>
            <div className={styles.statLabel}>Platform Revenue</div>
            <div className={styles.statValue}>{platformRevenue}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:receipt" />
          </div>
          <div>
            <div className={styles.statLabel}>Transactions Log</div>
            <div className={styles.statValue}>{totalTxCount}</div>
          </div>
        </div>
      </div>

      {/* MAIN TRANSACTIONS CARD */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeaderRow}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <iconify-icon icon="lucide:credit-card" style={{ color: "#ff4500" }} /> Platform Financial Transactions
            </h3>
            <button
              onClick={() => refetchTx()}
              style={{
                border: "none",
                background: "#f1f5f9",
                color: "#475569",
                padding: "6px 12px",
                borderRadius: 8,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600
              }}
            >
              <iconify-icon icon="lucide:refresh-cw" /> Refresh
            </button>
          </div>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Transactions" },
              { key: "escrow", label: "Escrow" },
              { key: "payout", label: "Payouts" },
              { key: "completed", label: "Completed" }
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
          {txLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading transaction ledger...</p>
            </div>
          ) : filteredTx.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:receipt" style={{ fontSize: 52, color: "#94a3b8", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Transactions Recorded</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>Platform transaction records and escrow activity will populate here.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Transaction / Date</th>
                  <th>User Details</th>
                  <th>Type & Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((tx: any) => {
                  const meta = tx.metadata || {};
                  const isPending = tx.status?.toLowerCase() === "pending";
                  const isComplete = tx.status?.toLowerCase().includes("complete") || tx.status?.toLowerCase().includes("success");

                  return (
                    <tr key={tx.id}>
                      <td>
                        <div>
                          <strong style={{ display: "block", color: "#001f3f" }}>#{tx.id}</strong>
                          <small style={{ color: "#64748b" }}>{(tx.created_at || "").slice(0, 16).replace("T", " ")}</small>
                        </div>
                      </td>
                      <td>
                        <strong style={{ display: "block", color: "#0f172a", fontSize: 13 }}>{tx.user_name || "System"}</strong>
                        <small style={{ color: "#64748b" }}>{tx.user_email || "N/A"}</small>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "#0f172a", display: "block" }}>
                          {tx.category || tx.type || "Transaction"}
                        </span>
                        <small style={{ color: "#475569" }}>{tx.description || "-"}</small>
                        {meta.bank_name && (
                          <div style={{ marginTop: 4, fontSize: 11.5, color: "#001f3f", background: "#f8fafc", padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                            🏦 <strong>{meta.bank_name}</strong> | A/C: <strong>{meta.account_number_or_iban || meta.account_number}</strong>
                            {meta.account_holder && <span> ({meta.account_holder})</span>}
                            {meta.swift_bic && <span> | SWIFT: {meta.swift_bic}</span>}
                          </div>
                        )}
                        {meta.phone_number && (
                          <div style={{ marginTop: 4, fontSize: 11.5, color: "#001f3f" }}>
                            📱 Tel: <strong>{meta.phone_number}</strong> ({meta.payout_method || "Mobile Money"})
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 800, color: tx.type === 'debit' ? '#ea580c' : '#16a34a' }}>
                        {tx.type === 'debit' ? '-' : '+'}{Number(tx.amount || 0).toLocaleString()} XOF
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${isComplete ? styles.statusCompleted : styles.statusPending}`}>
                          {tx.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        {isPending ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              disabled={updatingId === tx.id}
                              onClick={() => handleUpdateStatus(tx.id, "completed")}
                              style={{
                                padding: "6px 10px",
                                background: "#16a34a",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              <iconify-icon icon="lucide:check" /> Approve
                            </button>
                            <button
                              disabled={updatingId === tx.id}
                              onClick={() => handleUpdateStatus(tx.id, "failed")}
                              style={{
                                padding: "6px 10px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4
                              }}
                            >
                              <iconify-icon icon="lucide:x" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
