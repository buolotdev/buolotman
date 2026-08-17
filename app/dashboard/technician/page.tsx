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
import ProfileCompletionModal from "@/app/components/ProfileCompletionModal";



function getBidDisplayStatus(bid: any) {
  return (bid.task_status ?? bid.taskStatus) === "completed" ? "completed" : bid.status;
}

export default function TechnicianDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: user, loading: userLoading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
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
            <ProfileCompletionModal user={user} onUpdate={() => refetchUser()} />
            <div className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <span className={styles.heroEyebrow}><iconify-icon icon="lucide:zap" /> Dashboard overview</span>
                <h1>
                  Welcome{userName ? `, ${userName}` : ""}!
                  {Boolean(user?.is_verified || user?.technician_profile?.is_verified) && (
                    <span className={styles.heroVerifiedBadge} title="Verified Technician">
                      <iconify-icon icon="lucide:badge-check" style={{ fontSize: '17px', color: '#16a34a' }} />
                      <span>Verified</span>
                    </span>
                  )}
                </h1>
                <p>Find new tasks, manage your bids, track earnings, and grow your reputation.</p>
              </div>
              <div className={styles.heroActions}>
                <Link href="/dashboard/technician/tasks" className={styles.primaryButton}><iconify-icon icon="lucide:search" /> Browse Tasks</Link>
                <Link href="/dashboard/technician/wallet" className={styles.secondaryButton}>View Wallet</Link>
              </div>
            </div>

            <div className={styles.fullWidthSection} style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 className={styles.sectionHeader} style={{ fontSize: '18px', margin: 0 }}>Account Status</h3>
                {Boolean(user?.is_verified || user?.technician_profile?.is_verified) ? (
                  <span className={styles.verifiedPill}>
                    <iconify-icon icon="lucide:shield-check" style={{ fontSize: '16px' }} />
                    Verified Account
                  </span>
                ) : (
                  <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                    <iconify-icon icon="lucide:clock" style={{ fontSize: '14px', marginRight: '4px' }} />
                    Pending Verification
                  </span>
                )}
              </div>

              {Boolean(user?.is_verified || user?.technician_profile?.is_verified) ? (
                <div className={styles.verifiedNotice}>
                  <div className={styles.verifiedNoticeIcon}>
                    <iconify-icon icon="lucide:check-circle-2" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#14532d', marginBottom: '4px' }}>
                      Identity & Credentials Approved! 🎉
                    </strong>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#166534', lineHeight: 1.5 }}>
                      Your profile and submitted documents have been officially vetted and approved by the Boulot Man team. You have full privileges to bid on tasks, accept direct hire offers, and receive secure payouts.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.notice}>
                  <strong style={{ display: 'block', fontSize: '14.5px', color: '#92400e', marginBottom: '4px' }}>
                    Profile & Identity Under Review
                  </strong>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#78350f', lineHeight: 1.5, marginBottom: '12px' }}>
                    Complete your profile details and upload your National ID Card / Passport and trade certificates so our team can approve your account to start accepting jobs.
                  </p>
                  <Link href="/dashboard/technician/profile" className={styles.uploadCtaBtn}>
                    <iconify-icon icon="lucide:upload" /> Upload ID & Certificates
                  </Link>
                </div>
              )}

              <div className={styles.toggleRow}>
                <span>Availability for New Jobs</span>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ff4500' }} />
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
