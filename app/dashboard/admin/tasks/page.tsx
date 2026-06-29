"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonTable } from "@/app/components/skeleton/Skeleton";
import { toArray } from "@/app/lib/dataShape";
import styles from "./admin-tasks.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminTasksPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.adminListTasks(), []);

  const tasks = toArray(tasksData);
  const totalCount = tasks.length;
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

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
              <input type="text" placeholder="Search tasks by title, category, or client..." />
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
              <h1>Task Management</h1>
              <p>Monitor and manage all platform tasks, their statuses, and associated actions.</p>
            </div>
          </div>

          <div className={styles.tableCard}>


            <div className={styles.tableWrapper}>
              {tasksLoading ? (
                <SkeletonTable rows={5} />
              ) : tasks.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  <iconify-icon icon="lucide:file-text" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
                  <p>No tasks found.</p>
                </div>
              ) : (
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Task Title</th>
                      <th>Client</th>
                      <th>Status</th>
                      <th>Budget</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task: any) => (
                      <tr key={task.id}>
                        <td>
                          <div className={styles.taskCell}>
                            <span className={styles.taskTitle}>{task.title || "Untitled"}</span>
                            <span className={styles.taskCategory}>{task.category_name || task.category || "General"}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.clientCell}>
                            <span className={styles.clientName}>{task.client_name || ""}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            task.status === "open" ? styles.statusOpen :
                            task.status === "in_progress" ? styles.statusInProgress :
                            task.status === "completed" ? styles.statusCompleted :
                            styles.statusFlagged
                          }`}>
                            {task.status || ""}
                          </span>
                        </td>
                        <td>
                          <span className={styles.budgetCell}>
                            {task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "No budget"}
                          </span>
                        </td>
                        <td>
                          <span className={styles.dateText}>
                            {task.created_at ? new Date(task.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.iconBtn}
                              aria-label="View Task Details"
                              onClick={() => router.push(`/dashboard/client/tasks/${task.id}`)}
                            >
                              <iconify-icon icon="lucide:eye" />
                            </button>
                            <button
                              className={`${styles.iconBtn} ${task.status === "flagged" ? styles.iconBtnDanger : ""}`}
                              aria-label={task.status === "flagged" ? "Review Flagged Task" : "Flag for Review"}
                            >
                              <iconify-icon icon={task.status === "flagged" ? "lucide:x-circle" : "lucide:flag"} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                {tasksLoading ? "Loading..." : `Showing ${tasks.length} of ${totalCount} entries`}
              </div>
              <div className={styles.paginationControls}>
                <button className={styles.pageBtn} disabled><iconify-icon icon="lucide:chevron-left" /></button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn} disabled><iconify-icon icon="lucide:chevron-right" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
