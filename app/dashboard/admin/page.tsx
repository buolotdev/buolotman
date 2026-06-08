"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./admin.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/admin" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/admin/users") },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text", match: (p: string) => p.startsWith("/dashboard/admin/tasks") },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check", match: (p: string) => p.startsWith("/dashboard/admin/verification") },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card", match: (p: string) => p.startsWith("/dashboard/admin/payments") },
    { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes", icon: "lucide:scale", match: (p: string) => p.startsWith("/dashboard/admin/disputes") },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/admin/content") },
    { id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/admin/settings") },
  ];

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.getTasks({}), []);
  const { data: conversations, loading: convLoading } = useFetch(() => api.getConversations(), []);

  const tasks = toArray(tasksData);
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandText}>Boulot Man</span>
            <span className={styles.adminBadge}>Admin</span>
          </Link>
          <button className={styles.mobileCloseBtn} onClick={() => setMobileSidebarOpen(false)}>
            <iconify-icon icon="lucide:x" />
          </button>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = item.match(pathname || "");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}
              >
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
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
              <input type="text" placeholder="Search users, tasks, transactions..." />
            </div>
          </div>

          <div className={styles.topbarRight}>
            <button className={styles.actionBtn}>
              <iconify-icon icon="lucide:bell" />
              <span className={styles.notificationDot} />
            </button>
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
              <h1>Dashboard Overview</h1>
              <p>Welcome back{userName ? `, ${userName}` : ""}. Here&apos;s a summary of Boulot Man&apos;s performance.</p>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {tasksLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.statCard}><SkeletonStat /></div>
                ))}
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statTitle}>Total Tasks</span>
                    <div className={styles.statIcon}><iconify-icon icon="lucide:file-text" /></div>
                  </div>
                  <div className={styles.statValue}>{tasksData?.count || tasks.length}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statTitle}>Active Tasks</span>
                    <div className={`${styles.statIcon} ${styles.statIconOrange}`}><iconify-icon icon="lucide:briefcase" /></div>
                  </div>
                  <div className={styles.statValue}>{tasks.filter((t: any) => t.status === "open" || t.status === "in_progress").length}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statTitle}>Completed</span>
                    <div className={styles.statIcon}><iconify-icon icon="lucide:check-circle" /></div>
                  </div>
                  <div className={styles.statValue}>{tasks.filter((t: any) => t.status === "completed").length}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statTitle}>Conversations</span>
                    <div className={styles.statIcon}><iconify-icon icon="lucide:message-square" /></div>
                  </div>
                  <div className={styles.statValue}>{Array.isArray(conversations) ? conversations.length : 0}</div>
                </div>
              </>
            )}
          </div>

          <div className={styles.bottomGrid}>
            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>Recent Tasks</h2>
                <Link href="/dashboard/admin/tasks" className={styles.viewAllLink}>View All</Link>
              </div>
              {tasksLoading ? (
                <div className={styles.activityList}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.activityItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: 14, padding: 16 }}>No tasks yet.</p>
              ) : (
                <div className={styles.activityList}>
                  {tasks.slice(0, 5).map((task: any) => (
                    <div key={task.id} className={styles.activityItem}>
                      <div className={styles.activityIconBox} style={{ background: "rgba(0, 31, 63, 0.1)", color: "#001f3f" }}>
                        <iconify-icon icon="lucide:file-text" />
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityHeader}>
                          <span className={styles.activityText}>{task.title || "Untitled Task"}</span>
                          <span className={styles.activityTime}>{task.status || "draft"}</span>
                        </div>
                        <p className={styles.activitySubtext}>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "No budget"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>Recent Activity</h2>
              </div>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIconBox} style={{ background: "rgba(0, 31, 63, 0.1)", color: "#001f3f" }}>
                    <iconify-icon icon="lucide:user-plus" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityText}>System Running</span>
                      <span className={styles.activityTime}>Now</span>
                    </div>
                    <p className={styles.activitySubtext}>All systems operational.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
