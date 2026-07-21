"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import ProfileProgressBar from "@/app/components/ProfileProgressBar";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "projects", label: "Projects", icon: "lucide:folder-open", href: "/dashboard/technician/projects", match: (p: string) => p.startsWith("/dashboard/technician/projects") },
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

  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (user && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
      // Onboarding check removed to allow skipping.
    }
  }, [user, hasCheckedOnboarding, router]);

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
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks, bids..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <ProfileProgressBar user={user} />
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

            <div className={styles.fullWidthSection} style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 className={styles.sectionHeader} style={{ fontSize: '18px', marginBottom: '16px' }}>Account Status</h3>
              <p className={styles.notice}>
                Verification Status: <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending Verification</span><br/><br/>
                Complete your profile and upload certificates to accept jobs.
              </p>
              <div className={styles.toggleRow}>
                <span>Availability</span>
                <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
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

            {/* NEW TABLES */}
            <div className={styles.tableGrid}>
              
              <div className={styles.fullWidthSection} style={{ padding: '24px', marginBottom: 0 }}>
                <h3 className={styles.sectionHeader} style={{ fontSize: '18px' }}>Assigned Projects</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Progress</th>
                        <th>Milestone</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Residential Wiring</td>
                        <td>John Mukasa</td>
                        <td>45%</td>
                        <td>Milestone 1</td>
                        <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>In Progress</span></td>
                        <td><button className={styles.btnOutlineSmall}>Update</button></td>
                      </tr>
                      <tr>
                        <td>Office CCTV Installation</td>
                        <td>Mary Uwase</td>
                        <td>100%</td>
                        <td>Final</td>
                        <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>Completed</span></td>
                        <td><button className={styles.btnPrimarySmall}>Request</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.fullWidthSection} style={{ padding: '24px', marginBottom: 0 }}>
                <h3 className={styles.sectionHeader} style={{ fontSize: '18px' }}>Payments Overview</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2026-02-01</td>
                        <td>Office CCTV Installation</td>
                        <td>$850</td>
                        <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>Released</span></td>
                      </tr>
                      <tr>
                        <td>2026-01-22</td>
                        <td>Residential Wiring</td>
                        <td>$400</td>
                        <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>On Hold</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

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
