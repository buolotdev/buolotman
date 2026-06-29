"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks", match: (p: string) => p.startsWith("/dashboard/technician/tasks") },
  { key: "services", label: "My Services", icon: "lucide:layers-3", href: "/dashboard/technician/services", match: (p: string) => p.startsWith("/dashboard/technician/services") },
  { key: "bids", label: "My Bids", icon: "lucide:send", href: "/dashboard/technician/bids", match: (p: string) => p.startsWith("/dashboard/technician/bids") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/technician/messages", match: (p: string) => p.startsWith("/dashboard/technician/messages") },
  { key: "wallet", label: "Wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet", match: (p: string) => p.startsWith("/dashboard/technician/wallet") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/technician/profile", match: (p: string) => p.startsWith("/dashboard/technician/profile") },
];

function getBidDisplayStatus(bid: any) {
  return (bid.task_status ?? bid.taskStatus) === "completed" ? "completed" : bid.status;
}

export default function TechnicianDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.getTasks({}), []);
  const { data: bidsData, loading: bidsLoading } = useFetch(() => api.getMyBids(), []);
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);

  const tasks = toArray(tasksData);
  const bids = toArray(bidsData);
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role ?? "";

  const pendingBids = bids.filter((b: any) => b.status === "pending").length;
  const acceptedBids = bids.filter((b: any) => b.status === "accepted").length;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <Link href="/" className={styles.brand}>
              <span style={{ fontSize: 20, fontWeight: 800 }}>Boulot Man</span>
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

          <div className={styles.sidebarCard}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks, bids..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <div className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <span className={styles.heroEyebrow}><iconify-icon icon="lucide:zap" /> Dashboard overview</span>
                <h1>Welcome back{userName ? `, ${userName}` : ""}!</h1>
                <p>Find new tasks, manage your bids, track earnings, and grow your reputation.</p>
              </div>
              <div className={styles.heroActions}>
                <Link href="/dashboard/technician/tasks" className={styles.primaryButton}><iconify-icon icon="lucide:search" /> Browse Tasks</Link>
                <Link href="/dashboard/technician/wallet" className={styles.secondaryButton}>View Wallet</Link>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              {walletLoading || bidsLoading ? (
                <>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                </>
              ) : (
                <>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>Total Bids</span>
                      <div className={`${styles.metricIcon} ${styles.metricAccent}`}><iconify-icon icon="lucide:briefcase" /></div>
                    </div>
                    <strong>{bids.length}</strong>
                  </article>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>Accepted</span>
                      <div className={`${styles.metricIcon} ${styles.metricSuccess}`}><iconify-icon icon="lucide:check-circle" /></div>
                    </div>
                    <strong>{acceptedBids}</strong>
                  </article>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>Available Balance</span>
                      <div className={`${styles.metricIcon} ${styles.metricPrimary}`}><iconify-icon icon="lucide:wallet" /></div>
                    </div>
                    <strong>{wallet ? Number(wallet.available_balance).toLocaleString() : "0"} XOF</strong>
                  </article>
                </>
              )}
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.leftColumn}>
                <section className={styles.sectionCard}>
                  <div className={styles.sectionHead}>
                    <h2>Available Tasks</h2>
                    <Link href="/dashboard/technician/tasks" className={styles.sectionLink}>View All</Link>
                  </div>
                  {tasksLoading ? (
                    <div className={styles.taskList}>
                      {[1, 2, 3].map((i) => <div key={i} className={styles.taskCard}><SkeletonCard /></div>)}
                    </div>
                  ) : tasks.length === 0 ? (
                    <p className={styles.metricNote}>No tasks available right now. Check back soon!</p>
                  ) : (
                    <div className={styles.taskList}>
                      {tasks.slice(0, 3).map((task: any) => (
                        <article key={task.id} className={styles.taskCard}>
                          <div className={styles.taskTop}>
                            <div className={styles.taskMain}>
                              <Link href={`/dashboard/technician/tasks/${task.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                                <h3>{task.title}</h3>
                              </Link>
                              <div className={styles.taskMeta}>
                                <span><iconify-icon icon="lucide:map-pin" /> {task.city || "Not specified"}</span>
                                <span><iconify-icon icon="lucide:clock" /> {task.bids_count || 0} proposals</span>
                              </div>
                            </div>
                            <span className={styles.taskPrice}>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</span>
                          </div>
                          <div className={styles.taskBottom}>
                            <div className={styles.taskTags}>
                              {task.urgency === "urgent" && <span className={`${styles.pill} ${styles.pillHighlight}`}>Urgent</span>}
                            </div>
                            <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.primaryButton} style={{ minHeight: 36, padding: "0 14px", fontSize: 12 }}>View & Bid</Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className={styles.rightColumn}>
                <section className={styles.walletCard}>
                  <div className={styles.sectionHead}>
                    <h2>Recent Bids</h2>
                    <Link href="/dashboard/technician/bids" className={styles.sectionLink}>View All</Link>
                  </div>
                  {bidsLoading ? (
                    <div className={styles.rowList}>
                      {[1, 2].map((i) => <div key={i}><SkeletonCard /></div>)}
                    </div>
                  ) : bids.length === 0 ? (
                    <p className={styles.metricNote}>No bids submitted yet.</p>
                  ) : (
                    <div className={styles.rowList}>
                      {bids.slice(0, 3).map((bid: any) => {
                        const displayStatus = getBidDisplayStatus(bid);
                        return (
                          <div key={bid.id} className={styles.compactCard}>
                            <div className={styles.taskTop}>
                              <div className={styles.taskMain}>
                                <span className={`${styles.pill} ${displayStatus === "accepted" || displayStatus === "completed" ? "" : styles.pillHighlight}`}>
                                  {displayStatus}
                                </span>
                                <p>Bid on task #{bid.task_id || bid.task || bid.id}</p>
                              </div>
                              <strong className={styles.taskPrice}>{Number(bid.amount).toLocaleString()} XOF</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
