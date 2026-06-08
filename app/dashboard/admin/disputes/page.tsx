"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./admin-disputes.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminDisputesPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);

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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "disputes" ? styles.navItemActive : ""}`}>
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
            <div className={styles.searchBar}>
              <iconify-icon icon="lucide:search" />
              <input type="text" placeholder="Search disputes by ID, user, or task..." />
            </div>
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
              <h1>Dispute Management</h1>
              <p>Review, mediate, and resolve platform conflicts securely.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export Log
              </button>
            </div>
          </div>

          <div className={styles.overviewGrid}>
            {userLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.statCard}><SkeletonStat /></div>
                ))}
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Total Disputes</span>
                    <div className={styles.statIcon}>
                      <iconify-icon icon="lucide:scale" />
                    </div>
                  </div>
                  <span className={styles.statValue}>--</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Open Cases</span>
                    <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                      <iconify-icon icon="lucide:alert-triangle" />
                    </div>
                  </div>
                  <span className={styles.statValue}>--</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>In Review</span>
                    <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                      <iconify-icon icon="lucide:search" />
                    </div>
                  </div>
                  <span className={styles.statValue}>--</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Resolved (30d)</span>
                    <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                      <iconify-icon icon="lucide:check-circle" />
                    </div>
                  </div>
                  <span className={styles.statValue}>--</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.sectionCard}>
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
              <iconify-icon icon="lucide:scale" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
              <p>Dispute management coming soon.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
