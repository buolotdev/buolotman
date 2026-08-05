"use client";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./admin-payments.module.css";

export default function AdminPaymentsPage() {
  const { data: txData, loading: txLoading } = useFetch(() => api.getAdminTransactions(), []);

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Payments & Escrow Control</h1>
          <p>Manage pending payouts, monitor escrow holdings, and view platform transactions.</p>
        </div>
      </div>

      <div className={styles.overviewGrid}>
        {txLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statCard}><SkeletonStat /></div>
            ))}
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total in Escrow</span>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:lock" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>{txData?.total_in_escrow ? Number(txData.total_in_escrow).toLocaleString() + " XOF" : "0 XOF"}</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Pending Payouts</span>
                <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                  <iconify-icon icon="lucide:arrow-up-right" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>{txData?.pending_payouts ?? 0}</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Platform Revenue (MTD)</span>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:pie-chart" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>{txData?.total ? Number(txData.total).toLocaleString() + " XOF" : "0 XOF"}</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.sectionCard}>
        <div style={{ padding: 24 }}>
          {txLoading ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading transactions...</p>
          ) : txData && (Array.isArray(txData) ? txData : (txData as any)?.results || []).length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Type</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Category</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Amount</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(txData) ? txData : (txData as any)?.results || []).map((tx: any) => (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: 12 }}>{(tx.created_at || "").slice(0, 10)}</td>
                    <td style={{ padding: 12 }}>{tx.type}</td>
                    <td style={{ padding: 12 }}>{tx.category}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{tx.amount} XOF</td>
                    <td style={{ padding: 12 }}>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              <iconify-icon icon="lucide:credit-card" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
              <p>No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
