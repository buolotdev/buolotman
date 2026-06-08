"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
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
    case "in_progress": return { label: "In Progress", badgeClass: "badgeProgress", progressClass: "progressActive" };
    case "completed": return { label: "Completed", badgeClass: "badgeSuccess", progressClass: "progressSuccess" };
    case "open": return { label: "Open", badgeClass: "badgeWarning", progressClass: "progressPending" };
    case "cancelled": return { label: "Cancelled", badgeClass: "badgeDanger", progressClass: "progressPending" };
    default: return { label: status, badgeClass: "badgeDefault", progressClass: "progressPending" };
  }
}

function toArray<T>(data: T | { results?: T } | null | undefined): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as any;
  if (typeof data === "object" && "results" in (data as any)) return (data as any).results || [];
  return [];
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useFetch(() => api.getMyTasks(), []);
  const { data: savedPros, loading: savedLoading } = useFetch(() => api.getSavedPros(), []);
  const { data: conversations, loading: convLoading } = useFetch(() => api.getConversations(), []);

  const tasks = toArray(tasksData);
  const savedList = toArray(savedPros);
  const convList = toArray(conversations);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTasks = useMemo(
    () => tasks.filter((t: any) => [t.title, t.location, t.city].join(" ").toLowerCase().includes(normalizedQuery)),
    [normalizedQuery, tasks]
  );

  const activeTasks = tasks.filter((t: any) => t.status === "in_progress" || t.status === "open").length;
  const completedTasks = tasks.filter((t: any) => t.status === "completed").length;
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role ?? "";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>
            <button type="button" className={styles.sidebarClose} onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const isActive = item.match(pathname || "");
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={() => {
                    setMobileNavOpen(false);
                    if (pathname === item.href) {
                      window.location.reload();
                    } else {
                      router.push(item.href);
                    }
                  }}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <p className={styles.sidebarHint}>Need more help?</p>
            <Link href="/search" className={styles.sidebarLink}>Explore professionals</Link>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button type="button" className={styles.mobileMenuButton} onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>
              <label className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks, professionals..." />
              </label>
            </div>
            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton}>
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>
              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{userLoading ? <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} /> : userInitials}</div>
                <div>
                  <div className={styles.userName}>{userLoading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}</div>
                  <span className={styles.userRole}>{userRole}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.welcomeSection}>
              <div>
                <p className={styles.eyebrow}>Dashboard overview</p>
                <h2 className={styles.welcomeTitle}>Welcome back, ready to get things done?</h2>
                <p className={styles.welcomeSubtitle}>Track active jobs, review quotes, manage saved professionals, and move faster on your next project.</p>
              </div>
              <div className={styles.welcomeActions}>
                <Link href="/post-task" className={styles.primaryButton}><iconify-icon icon="lucide:plus" /> Post a Task</Link>
                <Link href="/categories/electrical/listings" className={styles.secondaryButton}>Browse electricians</Link>
              </div>
            </section>

            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statAccent}`}><iconify-icon icon="lucide:briefcase" /></div>
                <div><div className={styles.statValue}>{tasksLoading ? <SkeletonBlock style={{ width: 40, height: 26 }} /> : activeTasks}</div><p>Active Tasks</p></div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:check-square" /></div>
                <div><div className={styles.statValue}>{tasksLoading ? <SkeletonBlock style={{ width: 40, height: 26 }} /> : completedTasks}</div><p>Completed Tasks</p></div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statPrimary}`}><iconify-icon icon="lucide:wallet" /></div>
                <div><div className={styles.statValue}>{tasksLoading ? <SkeletonBlock style={{ width: 40, height: 26 }} /> : tasks.length}</div><p>Total Tasks</p></div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:bookmark" /></div>
                <div><div className={styles.statValue}>{savedLoading ? <SkeletonBlock style={{ width: 40, height: 26 }} /> : (savedList || []).length}</div><p>Saved Pros</p></div>
              </article>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>My Tasks</h3>
                <Link href="/dashboard/client/tasks" className={styles.linkButton}>View All</Link>
              </div>
              {tasksLoading ? (
                <div className={styles.tasksGrid}>
                  {[1, 2, 3].map((i) => <div key={i} className={styles.card}><SkeletonCard /></div>)}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className={`${styles.card} ${styles.emptyState}`}>
                  <iconify-icon icon="lucide:clipboard-list" style={{ fontSize: 40, color: "#94a3b8" }} />
                  <p>No tasks yet. <Link href="/post-task">Post your first task</Link></p>
                </div>
              ) : (
                <div className={styles.tasksGrid}>
                  {filteredTasks.map((task: any) => {
                    const meta = getStatusMeta(task.status);
                    return (
                      <article key={task.id} className={styles.card}>
                        <div className={styles.cardHeaderRow}>
                          <span className={`${styles.badge} ${styles[meta.badgeClass]}`}>{meta.label}</span>
                          <strong className={styles.amount}>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</strong>
                        </div>
                        <div className={styles.taskBody}>
                          <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.taskTitleLink}>
                            <h4 className={styles.taskTitle}>{task.title}</h4>
                          </Link>
                          <div className={styles.metaList}>
                            <p className={styles.metaItem}><iconify-icon icon="lucide:map-pin" /> {task.city || task.location || "Not specified"}</p>
                            <p className={styles.metaItem}><iconify-icon icon="lucide:calendar-clock" /> {task.schedule || "Flexible"}</p>
                          </div>
                          <div className={styles.progressBlock}>
                            <div className={styles.progressHeader}>
                              <span>{task.bids_count || 0} proposals</span>
                              <strong>{task.views_count || 0} views</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.taskFooter}>
                          <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.outlineSmallButton}>Open Task</Link>
                          {task.status === "open" && (
                            <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primarySmallButton}>Review Proposals</Link>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Saved Professionals</h3>
              </div>
              {savedLoading ? (
                <div className={styles.savedList}>
                  {[1, 2].map((i) => <div key={i} className={styles.card}><SkeletonCard /></div>)}
                </div>
              ) : (
                <div className={styles.savedList}>
                  {(savedList || []).map((saved: any) => {
                    const pro = saved.professional;
                    const initials = `${(pro.first_name || "")[0] || ""}${(pro.last_name || "")[0] || ""}`.toUpperCase();
                    return (
                      <article key={saved.id} className={styles.savedItem}>
                        <div className={styles.savedAvatar}>{initials}</div>
                        <div className={styles.savedInfo}>
                          <h4>{`${pro.first_name ?? ""} ${pro.last_name ?? ""}`.trim()}</h4>
                          <p>{pro.role || ""}</p>
                        </div>
                        <Link href={`/profile/${pro.id}`} className={styles.outlineSmallButton}>View</Link>
                      </article>
                    );
                  })}
                  {(!savedList || savedList.length === 0) && (
                    <p style={{ color: "#64748b", fontSize: 14 }}>No saved professionals yet.</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
