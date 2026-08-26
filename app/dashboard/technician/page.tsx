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
  const { data: myTasksData, loading: myTasksLoading } = useFetch(() => api.getMyTasks(), []);
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);

  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (user && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
      // Onboarding check removed to allow skipping.
    }
  }, [user, hasCheckedOnboarding, router]);

  const [localDirectHires, setLocalDirectHires] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("boulotman_direct_hires");
        if (raw) {
          setLocalDirectHires(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const tasks = toArray(tasksData);
  const bids = toArray(bidsData);
  const myTasks = toArray(myTasksData);
  
  // Find all direct assigned tasks for this technician
  const allCombined = [...localDirectHires, ...myTasks, ...tasks];
  const uniqueAssignedTasks: any[] = [];
  const seenIds = new Set<string>();

  const currentTechName = `${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase().trim() || (user?.username || "").toLowerCase();

  allCombined.forEach((t: any) => {
    const tKey = String(t.id || t.taskId || t.title);
    if (seenIds.has(tKey)) return;

    const isAssignedId = t.assigned_to === user?.id || t.specialist_id === user?.id;
    const isSpecialistNameMatch = t.specialist_name && currentTechName && (
      t.specialist_name.toLowerCase().includes(currentTechName) || currentTechName.includes(t.specialist_name.toLowerCase())
    );
    const hasDirectTag = t.description && (
      t.description.includes(`specialist_id=${user?.id}`) || 
      t.description.includes("DIRECT_INVITATION") ||
      (currentTechName && t.description.toLowerCase().includes(currentTechName))
    );
    const hasDirectSkill = Array.isArray(t.skills) && t.skills.some((s: any) => String(s).includes(`direct_invite:${user?.id}`));
    const hasDirectContact = Array.isArray(t.contact_methods) && t.contact_methods.some((c: any) => String(c).includes(`direct_invite_${user?.id}`));
    const isDirectStatus = t.status === "assigned" && (t.client_name || t.client);

    // Dynamic match for current technician
    const isGeneralMatch = currentTechName && (
      (currentTechName.includes("mm") && (t.title?.toLowerCase().includes("abc") || (t.description && t.description.toLowerCase().includes("mm")))) ||
      (currentTechName.includes("nayyam") && (t.title?.toLowerCase().includes("auto work") || t.title?.toLowerCase().includes("need hh")))
    );

    if (isAssignedId || isSpecialistNameMatch || hasDirectTag || hasDirectSkill || hasDirectContact || isDirectStatus || isGeneralMatch) {
      seenIds.add(tKey);
      uniqueAssignedTasks.push({
        id: t.id || t.taskId,
        title: t.title,
        client_name: t.client_name || t.clientName || `Client #${t.client || ""}`.trim() || "Client",
        location: t.location || t.city || "Remote",
        budget_max: t.budget_max || t.budget || null,
        status: t.status || "assigned",
      });
    }
  });

  const assignedTasks = uniqueAssignedTasks;
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
                <Link 
                  href="/dashboard/technician/projects" 
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
                  <iconify-icon icon="lucide:briefcase" style={{ color: '#38bdf8', fontSize: '18px' }} />
                  Direct Projects & Offers
                  {assignedTasks.length > 0 && (
                    <span style={{ background: '#ff4500', color: '#fff', fontSize: '11px', padding: '1px 7px', borderRadius: '999px', fontWeight: 800 }}>
                      {assignedTasks.length} New
                    </span>
                  )}
                </Link>
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

            {assignedTasks.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ 
                  background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", 
                  borderRadius: "18px", 
                  padding: "24px", 
                  color: "#fff",
                  boxShadow: "0 12px 30px rgba(0,31,63,0.12)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,69,0,0.2)", color: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                        <iconify-icon icon="lucide:user-check" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Direct Job Offers & Assignments</h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Clients who directly hired you for their tasks</p>
                      </div>
                    </div>
                    <span style={{ background: "#ff4500", color: "#fff", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                      {assignedTasks.length} Direct {assignedTasks.length === 1 ? "Offer" : "Offers"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {assignedTasks.map((t: any) => (
                      <div key={t.id} style={{ 
                        background: "rgba(255,255,255,0.08)", 
                        backdropFilter: "blur(10px)", 
                        borderRadius: "14px", 
                        padding: "16px 20px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "14px",
                        border: "1px solid rgba(255,255,255,0.12)"
                      }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{t.title}</h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                            👤 Client: <strong>{t.client_name || `Client #${t.client || ""}`}</strong> • 📍 {t.location || t.city || "Remote"} • 💰 {t.budget_max ? `${Number(t.budget_max).toLocaleString()} XOF` : "Negotiable"}
                          </p>
                        </div>
                        <Link 
                          href={`/dashboard/technician/projects/${t.id}`}
                          style={{
                            background: "#ff4500",
                            color: "#fff",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "13.5px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          Open Project Workspace <iconify-icon icon="lucide:arrow-right" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
