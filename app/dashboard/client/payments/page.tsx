"use client";

import Link from "next/link";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { formatXOF } from "@/app/lib/format";

type Transaction = {
  id: number | string;
  created_at?: string;
  type?: string;
  category?: string;
  amount?: number;
  status?: string;
};

export default function ClientPaymentsPage() {
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading } = useFetch(() => api.getTransactions({ limit: "20" }), []);

  const transactions: Transaction[] = Array.isArray(txData) ? txData : (txData?.results || []);

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Client dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Payments</h1>
          </div>
          <Link href="/dashboard/client" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Stat label="Available balance" value={walletLoading ? "Loading..." : formatXOF(wallet?.available_balance || 0)} />
          <Stat label="Pending escrow" value={walletLoading ? "Loading..." : formatXOF(wallet?.pending_escrow || 0)} />
        </section>

        <section style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
          <h2 style={{ marginTop: 0 }}>Transaction History</h2>
          {txLoading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: 12 }}>Date</th>
                    <th style={{ padding: 12 }}>Type</th>
                    <th style={{ padding: 12 }}>Category</th>
                    <th style={{ padding: 12 }}>Amount</th>
                    <th style={{ padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: 12 }}>{String(tx.created_at || "").slice(0, 10)}</td>
                      <td style={{ padding: 12 }}>{tx.type}</td>
                      <td style={{ padding: 12 }}>{tx.category}</td>
                      <td style={{ padding: 12 }}>{formatXOF(tx.amount || 0)}</td>
                      <td style={{ padding: 12 }}>{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}
