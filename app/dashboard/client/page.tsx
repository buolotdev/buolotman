"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Service Providers", icon: "lucide:users", href: "/service-providers/technicians", match: (p: string) => p.startsWith("/service-providers") },
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [milestoneConfirmed, setMilestoneConfirmed] = useState(false);

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
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
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
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks, professionals..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.welcomeSection}>
              <div className={styles.welcomeContent}>
                <p className={styles.eyebrow}>Dashboard overview</p>
                <h2 className={styles.welcomeTitle}>Welcome back, ready to get things done?</h2>
                <p className={styles.welcomeSubtitle}>Track active jobs, review quotes, manage saved professionals, and move faster on your next project.</p>
              </div>
              <div className={styles.welcomeActions}>
                <Link href="/post-task" className={styles.primaryButton}><iconify-icon icon="lucide:plus" /> Post a Task</Link>
                <Link href="/search?q=electrician" className={styles.secondaryButton}>Browse electricians</Link>
              </div>
            </section>

            <div className={styles.alert}>
              <iconify-icon icon="lucide:alert-triangle" />
              <span>Milestone 2 is awaiting your confirmation to release payment.</span>
            </div>

            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statAccent}`}><iconify-icon icon="lucide:briefcase" /></div>
                <div>
                  <div className={styles.statValue}>2</div>
                  <p>Active Projects</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:shield-check" /></div>
                <div>
                  <div className={styles.statValue}>32,000</div>
                  <p>Escrow Balance (XOF)</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:clock" /></div>
                <div>
                  <div className={styles.statValue}>8,000</div>
                  <p>Funds On Hold (XOF)</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statPrimary}`}><iconify-icon icon="lucide:message-square" /></div>
                <div>
                  <div className={styles.statValue}>3</div>
                  <p>Unread Messages</p>
                </div>
              </article>
            </section>

            <section className={styles.section}>
              <div className={styles.clientCard}>
                <h3>Active Projects</h3>
                <div className={styles.clientTableWrapper}>
                  <table className={styles.clientTable}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Executor</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Residential Renovation</td>
                        <td>Kigali Prime Constructors</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={styles.clientProgress}>
                              <span className={styles.clientProgressFill} style={{ width: '45%' }}></span>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>45%</span>
                          </div>
                        </td>
                        <td><span className={`${styles.clientStatusBadge} ${styles.clientStatusActive}`}>In Progress</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.clientOutlineBtn}>View Workspace</button>
                            <button className={styles.clientPrimaryBtn} onClick={() => { setShowConfirmModal(true); setMilestoneConfirmed(false); }}>Confirm Milestone</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.clientCard}>
                <h3>Escrow & Milestones</h3>
                <div className={styles.clientTableWrapper}>
                  <table className={styles.clientTable}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Next Milestone</th>
                        <th>Percentage</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Residential Renovation</td>
                        <td>Milestone 2</td>
                        <td>20%</td>
                        <td>$8,000</td>
                        <td><span className={`${styles.clientStatusBadge} ${styles.clientStatusPending}`}>Awaiting Confirmation</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.clientCard}>
                <h3>Recent Messages</h3>
                <div className={styles.clientTableWrapper}>
                  <table className={styles.clientTable}>
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Admin</td>
                        <td>Please confirm milestone progress.</td>
                        <td>Today</td>
                      </tr>
                      <tr>
                        <td>Kigali Prime Constructors</td>
                        <td>Milestone 2 work completed.</td>
                        <td>Yesterday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <span className={styles.closeX} onClick={() => setShowConfirmModal(false)}><iconify-icon icon="lucide:x" /></span>
            <h3>Confirm Milestone Completion</h3>
            <p>
              By confirming, you authorize the release of the milestone payment
              from escrow to the executor.
            </p>
            {!milestoneConfirmed ? (
              <button className={styles.primaryButton} onClick={() => setMilestoneConfirmed(true)}>Confirm & Release</button>
            ) : (
              <div className={styles.successMsg}>
                <iconify-icon icon="lucide:check-circle-2" /> Milestone confirmed and payment released
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
