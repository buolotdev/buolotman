"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./admin-payments.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminPaymentsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getAdminTransactions(), []);

  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users" },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text" },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check" },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card" },
    { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes", icon: "lucide:scale" },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers" },
    { id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
            <span className={styles.adminBadge}>Admin</span>
          </Link>
        </div>
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "payments" ? styles.navItemActive : ""}`}>
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setMobileSidebarOpen(true)}>
              <iconify-icon icon="lucide:menu" />
            </button>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.adminProfile}>
              <div className={styles.avatar}>
                {userLoading ? <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} /> : userInitials}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{userLoading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}</div>
                <span className={styles.profileRole}>{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.dashboardBody}>
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1>Payments & Escrow Control</h1>
              <p>Manage pending payouts, monitor escrow holdings, and view platform transactions.</p>
            </div>
          </div>

          <div className={styles.overviewGrid}>
            {userLoading ? (
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
              ) : txData && (Array.isArray(txData) ? txData : txData.results || []).length > 0 ? (
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
                    {(Array.isArray(txData) ? txData : txData.results || []).map((tx: any) => (
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
      </main>
    </div>
  );
}
