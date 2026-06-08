"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { use, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages" },
  { key: "payments", label: "Payments", icon: "lucide:credit-card" },
  { key: "saved", label: "Saved", icon: "lucide:bookmark" },
  { key: "profile", label: "Profile", icon: "lucide:user" },
];

export default function TaskDetailsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [acting, setActing] = useState<"complete" | "cancel" | "release" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [messagingId, setMessagingId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { taskId } = use(params);

  const { data: task, loading, refetch } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const handleComplete = async () => {
    if (!confirm("Mark this task as completed? You will be able to release escrow after.")) return;
    setActing("complete");
    setActionError(null);
    try {
      await api.completeTask(Number(taskId));
      await refetch();
    } catch (err: any) {
      setActionError(err?.message || "Could not mark complete");
    } finally {
      setActing(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this task? This cannot be undone.")) return;
    setActing("cancel");
    setActionError(null);
    try {
      await api.cancelTask(Number(taskId));
      router.push("/dashboard/client/tasks");
    } catch (err: any) {
      setActionError(err?.message || "Could not cancel");
    } finally {
      setActing(null);
    }
  };

  const handleReleaseEscrow = async () => {
    if (!confirm("Release escrow to the technician? This is final.")) return;
    setActing("release");
    setActionError(null);
    try {
      await api.releaseEscrow(Number(taskId));
      await refetch();
    } catch (err: any) {
      setActionError(err?.message || "Could not release escrow");
    } finally {
      setActing(null);
    }
  };

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";
  const acceptedBid = useMemo(
    () => (task?.bids || []).find((bid: any) => bid.status === "accepted") || null,
    [task]
  );
  const hasAcceptedBid = Boolean(acceptedBid);
  const visibleBids = useMemo(
    () => (hasAcceptedBid ? [acceptedBid].filter(Boolean) : (task?.bids || [])),
    [hasAcceptedBid, acceptedBid, task]
  );

  if (!loading && !task) notFound();

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
              const isActive = item.match ? item.match(pathname || "") : false;
              return (
              <Link
                key={item.key}
                href={item.href || "#"}
                className={`${styles.navItem} ${isActive || item.key === "tasks" ? styles.navItemActive : ""}`}
                onClick={() => setMobileNavOpen(false)}
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
                <input type="search" placeholder="Search tasks, professionals..." aria-label="Search tasks and professionals" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>

              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>
                  {loading ? <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} /> : userInitials}
                </div>
                <div>
                  <div className={styles.userName}>
                    {loading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}
                  </div>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            {loading ? (
              <div className={styles.grid}>
                <div>
                  <SkeletonBlock style={{ width: 200, height: 16, marginBottom: 16 }} />
                  <SkeletonBlock style={{ width: "60%", height: 28, marginBottom: 16 }} />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <aside>
                  <SkeletonCard />
                </aside>
              </div>
            ) : task ? (
              <div className={styles.grid}>
                <div>
                  <div className={styles.taskHeader}>
                    <div>
                      <Link href="/dashboard/client/tasks" className={styles.backLink}>
                        <iconify-icon icon="lucide:arrow-left" />
                        Back to My Tasks
                      </Link>
                      <h1 className={styles.taskTitle}>{task.title}</h1>
                      <div className={styles.taskMeta}>
                        <span className={styles.categoryBadge}>{task.category}</span>
                        <span>{task.posted_at || task.postedAt}</span>
                        <span>{task.city || task.location}</span>
                        <span>{task.views_count || task.views || 0} Views</span>
                      </div>
                    </div>

                    <div className={styles.taskActions}>
                      <button type="button" className={styles.iconAction} aria-label="Share task">
                        <iconify-icon icon="lucide:share-2" />
                      </button>
                      <button type="button" className={styles.iconAction} aria-label="Save task">
                        <iconify-icon icon="lucide:bookmark" />
                      </button>
                    </div>
                  </div>

                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Task Details</h2>
                    {(task.description ? (Array.isArray(task.description) ? task.description : [task.description]) : []).map((paragraph: string) => (
                      <p key={paragraph} className={styles.description}>
                        {paragraph}
                      </p>
                    ))}

                    <h3 className={styles.label}>Required Skills</h3>
                    <div className={styles.skillsList}>
                      {(task.skills || []).map((skill: string) => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h3 className={styles.label}>Attachments ({(task.attachments || []).length})</h3>
                    <div className={styles.attachmentGrid}>
                      {(task.attachments || []).map((attachment: any) => (
                        <button key={attachment.name} type="button" className={styles.attachmentCard}>
                          <span className={styles.attachmentIcon}>
                            <iconify-icon icon={attachment.type === "image" ? "lucide:image" : "lucide:file-text"} />
                          </span>
                          <span className={styles.attachmentInfo}>
                            <strong>{attachment.name}</strong>
                            <span>{attachment.size}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Logistics & Requirements</h2>
                    <div className={styles.infoGrid}>
                      <article className={styles.infoItem}>
                        <span className={styles.infoIcon}><iconify-icon icon="lucide:dollar-sign" /></span>
                        <div><small>Budget</small><strong>{task.logistics?.budgetLabel || `${Number(task.budget_min || 0).toLocaleString()} XOF`}</strong></div>
                      </article>
                      <article className={styles.infoItem}>
                        <span className={styles.infoIcon}><iconify-icon icon="lucide:calendar" /></span>
                        <div><small>Schedule</small><strong>{task.logistics?.scheduleLabel || task.schedule || "Flexible"}</strong></div>
                      </article>
                      <article className={styles.infoItem}>
                        <span className={styles.infoIcon}><iconify-icon icon="lucide:map-pin" /></span>
                        <div><small>Location</small><strong>{task.logistics?.locationLabel || task.city || task.location || "Not specified"}</strong></div>
                      </article>
                    </div>

                    <div className={styles.extraList}>
                      <div><span>Materials</span><strong>{task.logistics?.materials || "As needed"}</strong></div>
                      <div><span>Property Type</span><strong>{task.logistics?.propertyType || task.property_type || "Not specified"}</strong></div>
                      <div><span>Parking</span><strong>{task.logistics?.parking || "Not specified"}</strong></div>
                    </div>
                  </section>

                    <section className={styles.card}>
                      <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Incoming Proposals ({visibleBids.length})</h2>
                      {visibleBids.length ? (
                        <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.linkCtaInline}>
                          {hasAcceptedBid ? "View accepted proposal" : "Review all proposals"}
                        </Link>
                      ) : (
                        <span className={styles.sortText}>Sort by: <strong>Best Match</strong></span>
                      )}
                    </div>

                    <div className={styles.bidList}>
                      {visibleBids.length ? (
                        visibleBids.map((bid: any) => (
                          <article key={bid.id} className={styles.bidCard}>
                            <div className={styles.bidHeader}>
                              <div className={styles.bidderInfo}>
                                <div className={styles.bidderAvatar}>{bid.initials || ""}</div>
                                <div>
                                  <h3>{bid.bidder || bid.bidder_name || ""}</h3>
                                  <div className={styles.bidderMeta}>
                                    {bid.rating != null && bid.rating !== "" ? <span>{bid.rating}{bid.reviews != null ? ` (${bid.reviews} reviews)` : ""}</span> : null}
                                    {bid.verified ? <span className={styles.verified}>Verified License</span> : null}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.bidPrice}>
                                <strong>{bid.amount}</strong>
                                <span>{bid.amount_type || bid.amountType}</span>
                              </div>
                            </div>

                            <p className={styles.bidMessage}>{bid.message}</p>
                            <div className={styles.portfolioRow}>
                              {(bid.portfolio || []).map((item: string) => (
                                <span key={item} className={styles.portfolioChip}>{item}</span>
                              ))}
                            </div>
                            <div className={styles.bidActions}>
                              {hasAcceptedBid ? (
                                <span className={styles.statusPill}>Proposal accepted</span>
                              ) : (
                                <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}/payment`} className={styles.primaryButton}>Accept Proposal</Link>
                              )}
                              <button
                                type="button"
                                className={styles.secondaryButton}
                                disabled={messagingId === bid.id}
                                onClick={async () => {
                                  if (!bid.technician) {
                                    toast.warning("Cannot message", "Technician ID not found.");
                                    return;
                                  }
                                  setMessagingId(bid.id);
                                  try {
                                    const convo = await api.createConversation(bid.technician, task.id);
                                    router.push(`/dashboard/client/messages?c=${convo.id}`);
                                  } catch (err: any) {
                                    toast.error("Could not start conversation", err?.message || "Please try again.");
                                  } finally {
                                    setMessagingId(null);
                                  }
                                }}
                              >
                                {messagingId === bid.id ? "Opening..." : "Message"}
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className={styles.emptyState}>No proposals yet for this task.</div>
                      )}
                    </div>
                  </section>

                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Questions & Answers ({(task.questions || []).length})</h2>
                    <p className={styles.helperText}>
                      Professionals can ask clarifying questions here. Answers will remain visible to everyone.
                    </p>

                    <div className={styles.qaList}>
                      {(task.questions || []).length ? (
                        (task.questions || []).map((item: any) => (
                          <article key={item.id} className={styles.qaItem}>
                            <div className={styles.qaAvatar}>{item.initials || ""}</div>
                            <div className={styles.qaContent}>
                              <div className={styles.qaHeader}>
                                <strong>{item.asker || item.asker_name || ""}</strong>
                                <span>{item.time || item.created_at || ""}</span>
                              </div>
                              <p>{item.question || item.text}</p>
                              {item.reply ? (
                                <div className={styles.qaReply}>
                                  <div className={styles.qaHeader}>
                                    <strong>
                                      {item.reply.name || item.reply.author || ""}
                                      {item.reply.badge ? <span className={styles.replyBadge}>{item.reply.badge}</span> : null}
                                    </strong>
                                    <span>{item.reply.time || item.reply.created_at || ""}</span>
                                  </div>
                                  <p>{item.reply.text || item.reply.content}</p>
                                </div>
                              ) : null}
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className={styles.emptyState}>No questions yet.</div>
                      )}
                    </div>
                  </section>
                </div>

                <aside>
                  <section className={styles.card}>
                    <h3 className={styles.widgetTitle}>Task Status</h3>
                    <div className={styles.statusPill}>{task.status || "Open"}</div>
                    <div className={styles.widgetStats}>
                      <div><span>Proposals</span><strong>{task.bids_count || (task.bids || []).length || 0}</strong></div>
                      <div><span>Views</span><strong>{task.views_count || task.views || 0}</strong></div>
                      <div><span>Interviews</span><strong>{task.interviews_count || 0}</strong></div>
                    </div>
                    <div className={styles.widgetActions}>
                      {hasAcceptedBid ? (
                        <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primaryButton}>View Accepted Proposal</Link>
                      ) : visibleBids.length ? (
                        <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primaryButton}>Review Proposals</Link>
                      ) : (
                        <button type="button" className={styles.primaryButton}>Invite Pros</button>
                      )}
                      {task.status === "in_progress" ? (
                        <button type="button" className={styles.primaryButton} disabled={acting === "complete"} onClick={handleComplete}>
                          {acting === "complete" ? "Completing..." : "Mark Complete"}
                        </button>
                      ) : null}
                      {task.status === "completed" && task.has_escrow ? (
                        <button type="button" className={styles.primaryButton} disabled={acting === "release"} onClick={handleReleaseEscrow}>
                          {acting === "release" ? "Releasing..." : "Release Escrow"}
                        </button>
                      ) : null}
                      {["open", "draft", "in_progress"].includes(task.status) ? (
                        <button type="button" className={styles.secondaryButton} disabled={acting === "cancel"} onClick={handleCancel} style={{ color: "#dc2626" }}>
                          {acting === "cancel" ? "Cancelling..." : "Cancel Task"}
                        </button>
                      ) : null}
                      {actionError ? <p style={{ color: "#dc2626", fontSize: 13 }}>{actionError}</p> : null}
                    </div>
                  </section>

                  <section className={styles.card}>
                    <h3 className={styles.widgetTitle}>About the Client</h3>
                    <div className={styles.clientProfile}>
                      <div className={styles.clientAvatar}>{task.client?.initials || ""}</div>
                      <div>
                        <strong>{task.client?.name || ""}</strong>
                        <p>{task.client?.rating || ""}</p>
                      </div>
                    </div>
                    <div className={styles.widgetStats}>
                      <div><span>Location</span><strong>{task.client?.location || "Not specified"}</strong></div>
                      <div><span>Tasks Posted</span><strong>{task.client?.tasks_posted || 0}</strong></div>
                      <div><span>Total Spent</span><strong>{task.client?.total_spent || ""}</strong></div>
                      <div><span>Member Since</span><strong>{task.client?.member_since || ""}</strong></div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <h3 className={styles.widgetTitle}>Similar Tasks</h3>
                    <div className={styles.similarList}>
                      {(task.similar_tasks || task.similarTasks || []).map((similar: any) => (
                        <article key={similar.id} className={styles.similarTask}>
                          <strong>{similar.title}</strong>
                          <div>
                            <span>{similar.budget || similar.budget_min}</span>
                            <span>{similar.location || similar.city}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                    <Link href="/dashboard/client/tasks" className={styles.linkCta}>View all similar tasks</Link>
                  </section>
                </aside>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
