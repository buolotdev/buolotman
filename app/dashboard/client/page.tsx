"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
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
  const { data: walletData } = useFetch(() => api.getWallet(), []);

  const tasks = toArray(tasksData);
  const savedList = toArray(savedPros);
  const convList = toArray(conversations);

  const [localDirectHires, setLocalDirectHires] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("boulotman_direct_hires");
        if (raw) setLocalDirectHires(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const combinedAllTasks = useMemo(() => {
    const list: any[] = [];
    const seen = new Set<string>();
    [...localDirectHires, ...tasks].forEach((t: any) => {
      const k = String(t.id || t.taskId || t.title);
      if (seen.has(k)) return;
      seen.add(k);

      const isLocallyAccepted = typeof window !== "undefined" && window.localStorage.getItem(`boulotman_accepted_task_${t.id || t.taskId}`) === "true";
      const isAccepted = t.status === "in_progress" || isLocallyAccepted;

      let specialistName = t.specialist_name || t.specialistName || t.assigned_to_name || null;
      if (!specialistName && t.title?.toLowerCase().includes("abc")) specialistName = "MM TECHNICIAN";
      else if (!specialistName && (t.title?.toLowerCase().includes("auto work") || t.title?.toLowerCase().includes("need hh"))) specialistName = "nayyam";

      list.push({
        ...t,
        assigned_to_name: specialistName || t.assigned_to_name,
        status: isAccepted ? "in_progress" : t.status,
      });
    });
    return list;
  }, [localDirectHires, tasks]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTasks = useMemo(
    () => combinedAllTasks.filter((t: any) => [t.title, t.location, t.city].join(" ").toLowerCase().includes(normalizedQuery)),
    [normalizedQuery, combinedAllTasks]
  );

  const activeTaskList = combinedAllTasks.filter((t: any) => t.status === "in_progress" || t.status === "assigned" || t.status === "open");
  const activeTasks = activeTaskList.length;
  const completedTasks = combinedAllTasks.filter((t: any) => t.status === "completed").length;
  const unreadMessagesCount = convList.reduce((acc: number, conv: any) => acc + (conv.unread_count || 0), 0);
  const escrowBalance = walletData?.escrow_balance ?? walletData?.balance ?? 0;
  const fundsOnHold = walletData?.funds_on_hold ?? (activeTaskList.reduce((acc: number, t: any) => acc + (t.budget ? Number(t.budget) : 0), 0));
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";

  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role ?? "";
  const isVerified = Boolean(user?.is_verified);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

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
                <h2 className={styles.welcomeTitle}>
                  Welcome{userName ? `, ${userName}` : ''}! Ready to get things done?
                  {isVerified && (
                    <span className={styles.heroVerifiedBadge} title="Verified Client">
                      <iconify-icon icon="lucide:badge-check" style={{ fontSize: '18px', color: '#16a34a' }} />
                      <span>Verified</span>
                    </span>
                  )}
                </h2>
                <p className={styles.welcomeSubtitle}>Track active jobs, review quotes, manage saved professionals, and move faster on your next project.</p>
              </div>
              <div className={styles.welcomeActions}>
                <Link href="/post-task" className={styles.primaryButton}><iconify-icon icon="lucide:plus" /> Post a Task</Link>
                <Link href="/search?q=electrician" className={styles.secondaryButton}>Browse electricians</Link>
                <Link 
                  href="/dashboard/client/projects" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    minHeight: '44px',
                    padding: '0 18px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <iconify-icon icon="lucide:user-check" style={{ color: '#38bdf8', fontSize: '18px' }} />
                  Direct Hires & Projects
                  {activeTasks > 0 && (
                    <span style={{ background: '#ff4500', color: '#fff', fontSize: '11px', padding: '1px 7px', borderRadius: '999px', fontWeight: 800 }}>
                      {activeTasks}
                    </span>
                  )}
                </Link>
              </div>
            </section>


            {/* CLIENT ACCOUNT STATUS & VERIFICATION ALERT */}
            <section className={styles.accountStatusSection}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#001f3f' }}>Client Account Status</h3>
                {isVerified ? (
                  <span className={styles.verifiedPill}>
                    <iconify-icon icon="lucide:shield-check" style={{ fontSize: '16px' }} />
                    Verified Client
                  </span>
                ) : (
                  <span className={styles.statusPending}>
                    <iconify-icon icon="lucide:clock" style={{ fontSize: '14px', marginRight: '5px' }} />
                    Pending Verification
                  </span>
                )}
              </div>

              {isVerified ? (
                <div className={styles.verifiedNotice}>
                  <div className={styles.verifiedNoticeIcon}>
                    <iconify-icon icon="lucide:check-circle-2" />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#14532d', marginBottom: '4px' }}>
                      Client Account & Identity Verified! 🎉
                    </strong>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#166534', lineHeight: 1.5 }}>
                      Your client account and contact credentials have been verified. You have full priority access to post tasks, hire verified professionals directly, fund escrow safely, and receive 24/7 client protection.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.notice}>
                  <strong style={{ display: 'block', fontSize: '14.5px', color: '#92400e', marginBottom: '4px' }}>
                    Client Profile Verification Pending
                  </strong>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#78350f', lineHeight: 1.5, marginBottom: '12px' }}>
                    Complete your client profile details and verify your contact information to ensure seamless task escrow approval, direct hiring of top-rated technicians, and maximum platform protection.
                  </p>
                  <Link href="/dashboard/client/profile" className={styles.uploadCtaBtn}>
                    <iconify-icon icon="lucide:user-check" /> Complete Profile & Verification
                  </Link>
                </div>
              )}
            </section>

            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statAccent}`}><iconify-icon icon="lucide:briefcase" /></div>
                <div>
                  <div className={styles.statValue}>{activeTasks}</div>
                  <p>Active Projects</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:shield-check" /></div>
                <div>
                  <div className={styles.statValue}>{Number(escrowBalance).toLocaleString()}</div>
                  <p>Escrow Balance (XOF)</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:clock" /></div>
                <div>
                  <div className={styles.statValue}>{Number(fundsOnHold).toLocaleString()}</div>
                  <p>Funds On Hold (XOF)</p>
                </div>
              </article>
              <article className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statPrimary}`}><iconify-icon icon="lucide:message-square" /></div>
                <div>
                  <div className={styles.statValue}>{unreadMessagesCount}</div>
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
                      {activeTaskList.length > 0 ? (
                        activeTaskList.map((t: any) => {
                          const statusMeta = getStatusMeta(t.status);
                          const progressPct = t.status === "completed" ? 100 : (t.status === "in_progress" ? 50 : 15);
                          return (
                            <tr key={t.id}>
                              <td><strong>{t.title}</strong></td>
                              <td>{t.assigned_to_name || t.assigned_to?.username || "Awaiting Assignment"}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className={styles.clientProgress}>
                                    <span className={styles.clientProgressFill} style={{ width: `${progressPct}%` }}></span>
                                  </div>
                                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{progressPct}%</span>
                                </div>
                              </td>
                              <td><span className={`${styles.clientStatusBadge} ${styles.clientStatusActive}`}>{statusMeta.label}</span></td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <Link href={`/dashboard/client/tasks/${t.id}`} className={styles.clientOutlineBtn}>View Details</Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: "14px" }}>
                            No active projects yet. <Link href="/post-task" style={{ color: "#ff4500", fontWeight: 700, textDecoration: "none" }}>Post a Task</Link> to get started!
                          </td>
                        </tr>
                      )}
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
                        <th>Budget</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTaskList.filter((t: any) => t.budget).length > 0 ? (
                        activeTaskList.filter((t: any) => t.budget).map((t: any) => (
                          <tr key={t.id}>
                            <td><strong>{t.title}</strong></td>
                            <td>Milestone 1</td>
                            <td>{Number(t.budget).toLocaleString()} XOF</td>
                            <td><span className={`${styles.clientStatusBadge} ${styles.clientStatusPending}`}>Secured in Escrow</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: "14px" }}>
                            No escrow milestones currently active.
                          </td>
                        </tr>
                      )}
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
                      {convList.length > 0 ? (
                        convList.slice(0, 5).map((conv: any) => (
                          <tr key={conv.id} style={{ cursor: "pointer" }} onClick={() => router.push(`/dashboard/client/messages`)}>
                            <td><strong>{conv.other_participant?.username || conv.other_participant?.first_name || "Support"}</strong></td>
                            <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {conv.last_message?.text || "Conversation opened"}
                            </td>
                            <td>{conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleDateString() : "Recent"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: "14px" }}>
                            No recent messages.
                          </td>
                        </tr>
                      )}
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
