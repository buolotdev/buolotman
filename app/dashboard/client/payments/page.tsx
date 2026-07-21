"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { formatXOF } from "@/app/lib/format";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
import styles from "./payments.module.css";

type Transaction = {
  id: number | string;
  created_at?: string;
  type?: string;
  category?: string;
  amount?: number;
  status?: string;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },

];

export default function ClientPaymentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading } = useFetch(() => api.getTransactions({ limit: "20" }), []);

  const transactions: Transaction[] = Array.isArray(txData) ? txData : (txData?.results || []);

  const getStatusClass = (status?: string) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "released") return styles.statusSuccess;
    if (s === "pending" || s === "hold") return styles.statusPending;
    if (s === "failed" || s === "cancelled") return styles.statusFailed;
    return styles.statusDefault;
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Main client navigation">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.headerTitle}>Payments & Escrows</h1>
                <p className={styles.headerSubtitle}>Monitor your available balances, pending deposits, and task payouts.</p>
              </div>
            </div>

            {/* Stats Overview */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statIconAccent}`}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div>
                  <h3 className={styles.statLabel}>Available Balance</h3>
                  <p className={styles.statValue}>
                    {walletLoading ? "..." : formatXOF(wallet?.available_balance || 0)}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
                  <iconify-icon icon="lucide:lock" />
                </div>
                <div>
                  <h3 className={styles.statLabel}>Pending Escrow</h3>
                  <p className={styles.statValue}>
                    {walletLoading ? "..." : formatXOF(wallet?.pending_escrow || 0)}
                  </p>
                </div>
              </div>
            </section>

            {/* Transaction History Section */}
            <section className={styles.tableCard}>
              <h2 className={styles.tableTitle}>Transaction History</h2>
              
              {txLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  <p>Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className={styles.emptyState}>
                  <iconify-icon icon="lucide:file-text" />
                  <p>No transaction history recorded yet.</p>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            {tx.created_at
                              ? new Date(tx.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td style={{ textTransform: "capitalize" }}>{tx.type || "-"}</td>
                          <td style={{ textTransform: "capitalize" }}>{tx.category || "-"}</td>
                          <td style={{ fontWeight: 700, color: "#001f3f" }}>
                            {formatXOF(tx.amount || 0)}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(tx.status)}`}>
                              {tx.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
