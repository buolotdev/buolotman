"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client/profile", match: (p: string) => p.startsWith("/dashboard/client/profile") },
];

function getStatusMeta(status: string) {
  switch (status) {
    case "in_progress":
      return { label: "In Progress", badgeClass: "badgeProgress", progressClass: "progressActive" };
    case "completed":
      return { label: "Completed", badgeClass: "badgeSuccess", progressClass: "progressSuccess" };
    case "open":
      return { label: "Open", badgeClass: "badgeWarning", progressClass: "progressPending" };
    case "cancelled":
      return { label: "Cancelled", badgeClass: "badgeDanger", progressClass: "progressPending" };
    default:
      return { label: status, badgeClass: "badgeDefault", progressClass: "progressPending" };
  }
}

export default function ClientTasksPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { data: tasksData, loading } = useFetch(() => api.getMyTasks(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);
  const tasks = toArray(tasksData);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tasks;
    return tasks.filter((task: any) =>
      [task.title, task.city || task.location, task.category, task.schedule].join(" ").toLowerCase().includes(normalized)
    );
  }, [query, tasks]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive = item.match(pathname || "");
              return (
                <Link
                  key={item.key}
                  href={item.href || "#"}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={(e) => {
                    setMobileNavOpen(false);
                    if (item.href && pathname === item.href) {
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
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button type="button" className={styles.mobileMenuButton} aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>

              <label className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>

              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{userInitials}</div>
                <div>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Task management</p>
                <h2>My Tasks</h2>
                <p>Open any task to manage progress, review proposals, and keep communication in one place.</p>
              </div>
              <Link href="/post-task" className={styles.primaryButton}>
                <iconify-icon icon="lucide:plus" />
                Post another task
              </Link>
            </section>

            <section className={styles.list}>
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredTasks.length ? (
                filteredTasks.map((task: any) => {
                  const hasAcceptedProposal = Number(task.accepted_bids_count || 0) > 0 || Boolean(task.assigned_to);
                  const displayStatus = hasAcceptedProposal && task.status === "open" ? "in_progress" : task.status;
                  const statusMeta = getStatusMeta(displayStatus);
                  const taskHref = hasAcceptedProposal || task.status !== "open"
                    ? `/dashboard/client/tasks/${task.id}`
                    : `/dashboard/client/tasks/${task.id}/proposals`;
                  return (
                    <article key={task.id} className={styles.taskCard}>
                      <div className={styles.taskMain}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.badge} ${styles[statusMeta.badgeClass]}`}>{statusMeta.label}</span>
                          <strong>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</strong>
                        </div>
                        <h3>{task.title}</h3>
                        <div className={styles.taskMeta}>
                          <span>{task.category}</span>
                          <span>{task.city || task.location}</span>
                          <span>{task.schedule}</span>
                        </div>
                        <div className={styles.progressBlock}>
                          <div className={styles.progressHeader}>
                            <span>{task.bids_count || 0} proposals</span>
                            <strong>{task.views_count || 0} views</strong>
                          </div>
                          <div className={styles.progressTrack}>
                            <span className={`${styles.progressFill} ${styles[statusMeta.progressClass]}`} style={{ width: `${task.progress || 0}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className={styles.taskAside}>
                        <Link
                          href={taskHref}
                          className={styles.openButton}
                        >
                          {hasAcceptedProposal ? "Open Active Task" : task.status === "open" ? "Review Proposals" : "Open Task"}
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.emptyState}>No tasks yet.</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
