"use client";

import React, { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./admin-payments.module.css";

export default function AdminPaymentsPage() {
  const { data: txData, loading: txLoading } = useFetch(() => api.getAdminTransactions(), []);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const transactions = (Array.isArray(txData) ? txData : (txData as any)?.results || []) as any[];

  const filteredTx = transactions.filter((tx: any) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "escrow") return tx.type?.toLowerCase().includes("escrow") || tx.category?.toLowerCase().includes("escrow");
    if (activeFilter === "payout") return tx.type?.toLowerCase().includes("payout") || tx.type?.toLowerCase().includes("withdrawal");
    if (activeFilter === "completed") return tx.status?.toLowerCase().includes("completed") || tx.status?.toLowerCase().includes("success");
    return true;
  });

  const totalInEscrow = txData?.total_in_escrow ? Number(txData.total_in_escrow).toLocaleString() + " XOF" : "0 XOF";
  const pendingPayouts = txData?.pending_payouts ?? 0;
  const platformRevenue = txData?.total ? Number(txData.total).toLocaleString() + " XOF" : "0 XOF";
  const totalTxCount = transactions.length;

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
          <h3>
            <iconify-icon icon="lucide:credit-card" style={{ color: "#ff4500" }} /> Platform Financial Transactions
          </h3>

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
                  <th>Transaction ID / Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((tx: any) => (
                  <tr key={tx.id}>
                    <td>
                      <div>
                        <strong style={{ display: "block", color: "#001f3f" }}>#{tx.id || "TX-LOG"}</strong>
                        <small style={{ color: "#64748b" }}>{(tx.created_at || "").slice(0, 10) || "Recent"}</small>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{tx.type || "Escrow Hold"}</span>
                    </td>
                    <td>{tx.category || "Milestone Escrow"}</td>
                    <td style={{ fontWeight: 800, color: "#16a34a" }}>
                      {Number(tx.amount || 0).toLocaleString()} XOF
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${tx.status?.toLowerCase().includes("complete") || tx.status?.toLowerCase().includes("success") ? styles.statusCompleted : styles.statusPending}`}>
                        {tx.status || "Completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
