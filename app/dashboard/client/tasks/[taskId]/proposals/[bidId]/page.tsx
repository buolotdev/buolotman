"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, usePathname, useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
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

export default function ProposalProfilePage({ params }: { params: Promise<{ taskId: string; bidId: string }> }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [acting, setActing] = useState<"accept" | "reject" | "message" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { taskId, bidId } = use(params);

  const { data: task, loading: taskLoading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: bidData, loading: bidLoading } = useFetch(() => {
    const bids = api.getTaskBids(Number(taskId));
    return bids;
  }, [taskId]);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const loading = taskLoading || bidLoading;

  const handleAccept = async () => {
    setActing("accept");
    setActionError(null);
    try {
      await api.acceptBid(Number(bidId));
      router.push(`/dashboard/client/tasks/${taskId}/proposals/${bidId}/payment`);
    } catch (err: any) {
      setActionError(err?.message || "Could not accept bid");
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (!confirm("Reject this bid?")) return;
    setActing("reject");
    setActionError(null);
    try {
      await api.rejectBid(Number(bidId));
      router.push(`/dashboard/client/tasks/${taskId}/proposals`);
    } catch (err: any) {
      setActionError(err?.message || "Could not reject bid");
    } finally {
      setActing(null);
    }
  };

  const handleMessage = async () => {
    setActing("message");
    setActionError(null);
    try {
      const techId = (bid as any)?.technician;
      if (!techId) throw new Error("Could not find technician");
      const conv = await api.createConversation(techId, Number(taskId));
      router.push(`/dashboard/client/messages?c=${conv.id}`);
    } catch (err: any) {
      setActionError(err?.message || "Could not open conversation");
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

  const bid = (() => {
    if (!bidData) return null;
    const list = Array.isArray(bidData) ? bidData : bidData?.results || [];
    return list.find((b: any) => String(b.id) === bidId) || null;
  })();
  const acceptedBid = useMemo(() => {
    if (!bidData) return null;
    const list = Array.isArray(bidData) ? bidData : bidData?.results || [];
    return list.find((b: any) => b.status === "accepted") || null;
  }, [bidData]);
  const isLockedToAcceptedBid = Boolean(acceptedBid && String((acceptedBid as any).id) !== bidId);

  if (!loading && (!task || !bid)) notFound();

  const profile = (bid as any)?.profile || {};

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
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive = item.match ? item.match(pathname || "") : item.key === "tasks";
              return (
              <Link
                key={item.key}
                href={item.href || "#"}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
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
                  <p className={styles.userName}>
                    {loading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}
                  </p>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            {loading ? (
              <div className={styles.profileLayout}>
                <section className={styles.profileMain}>
                  <SkeletonCard />
                  <SkeletonCard />
                </section>
                <aside className={styles.profileSidebar}>
                  <SkeletonCard />
                </aside>
              </div>
            ) : task && bid ? (
              <>
                <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.backLink}>
                  <iconify-icon icon="lucide:arrow-left" />
                  Back to Proposals
                </Link>

                <div className={styles.profileLayout}>
                  <section className={styles.profileMain}>
                    {isLockedToAcceptedBid ? (
                      <article className={styles.card}>
                        <h1 className={styles.name}>Proposal accepted</h1>
                        <p className={styles.title}>
                          This task already has an accepted proposal. Only the hired professional remains active.
                        </p>
                        <div className={styles.actionGroup}>
                          <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primaryButton}>
                            View accepted proposal
                          </Link>
                          <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.outlineButton}>
                            Back to task
                          </Link>
                        </div>
                      </article>
                    ) : null}
                    <article className={styles.card}>
                      <div className={styles.hero}>
                        <div className={styles.avatar}>{(bid as any).initials || ""}</div>
                        <div className={styles.heroContent}>
                          <div className={styles.nameRow}>
                            <h1 className={styles.name}>{(bid as any).bidder || (bid as any).bidder_name || ""}</h1>
                            {(bid as any).verified ? <span className={styles.verifiedBadge}>Verified Pro</span> : null}
                          </div>
                          <p className={styles.title}>{profile.title || ""}</p>
                          <div className={styles.statsRow}>
                            {(bid as any).rating != null && (bid as any).rating !== "" ? (
                              <span>{(bid as any).rating}{(bid as any).reviews != null ? ` (${(bid as any).reviews} Reviews)` : ""}</span>
                            ) : null}
                            {task.city || task.location ? <span>{task.city || task.location}</span> : null}
                            {profile.jobs_completed || profile.jobsCompleted ? <span>{profile.jobs_completed || profile.jobsCompleted}</span> : null}
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className={styles.card}>
                      <h2 className={styles.sectionTitle}>About {(bid as any).bidder ? (bid as any).bidder.split(" ")[0] : ""}</h2>
                      <div className={styles.aboutBlock}>
                        {(profile.about || []).map((paragraph: string) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </article>

                    <article className={styles.card}>
                      <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
                      <div className={styles.skillsGrid}>
                        {(profile.skills || []).map((skill: string) => (
                          <span key={skill} className={styles.skillPill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </article>

                    <article className={styles.card}>
                      <h2 className={styles.sectionTitle}>Recent Work</h2>
                      <div className={styles.galleryGrid}>
                        {(profile.gallery || []).map((item: any, index: number) => (
                          <div key={item.title} className={`${styles.galleryCard} ${styles[`galleryTone${(index % 4) + 1}`]}`}>
                            <strong>{item.title}</strong>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className={styles.card}>
                      <div className={styles.reviewHeader}>
                        <h2 className={styles.sectionTitle}>Client Reviews ({(bid as any).reviews || 0})</h2>
                        <button type="button" className={styles.secondaryButton}>
                          View All Reviews
                        </button>
                      </div>

                      <div className={styles.reviewList}>
                        {(profile.reviews_list || profile.reviewsList || []).map((review: any) => (
                          <article key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewTop}>
                              <div className={styles.reviewer}>
                                <div className={styles.reviewerAvatar}>{review.initials || ""}</div>
                                <div>
                                  <strong>{review.reviewer || ""}</strong>
                                  <p>
                                    {review.date || ""}{review.service ? ` • ${review.service}` : ""}
                                  </p>
                                </div>
                              </div>
                              <span className={styles.reviewRating}>{review.rating_label || review.ratingLabel || ""}</span>
                            </div>
                            {review.text ? <p className={styles.reviewText}>{review.text}</p> : null}
                          </article>
                        ))}
                      </div>
                    </article>
                  </section>

                  <aside className={styles.profileSidebar}>
                    <article className={styles.card}>
                      <div className={styles.rate}>
                        {profile.rate || ""}
                        {profile.rate ? <span>/engagement</span> : null}
                      </div>
                      <p className={styles.rateLabel}>{profile.rate_label || profile.rateLabel || ""}</p>

                      <div className={styles.actionGroup}>
                        {isLockedToAcceptedBid ? (
                          <span className={styles.verifiedBadge}>This task is already hired</span>
                        ) : (
                          <button type="button" className={styles.primaryButton} disabled={acting === "accept"} onClick={handleAccept}>
                            {acting === "accept" ? "Accepting..." : `Hire ${(bid as any).bidder ? (bid as any).bidder.split(" ")[0] : ""} Now`}
                          </button>
                        )}
                        <button type="button" className={styles.outlineButton} disabled={acting === "message"} onClick={handleMessage}>
                          {acting === "message" ? "Opening..." : "Send Message"}
                        </button>
                        {!isLockedToAcceptedBid ? (
                          <button type="button" className={styles.outlineButton} disabled={acting === "reject"} onClick={handleReject} style={{ color: "#dc2626" }}>
                            {acting === "reject" ? "Rejecting..." : "Reject Bid"}
                          </button>
                        ) : null}
                        {actionError ? <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{actionError}</p> : null}
                      </div>

                      <div className={styles.metrics}>
                        <div><span>Job Success Rate</span><strong>{profile.job_success_rate || ""}</strong></div>
                        <div><span>Response Time</span><strong>{profile.response_time || profile.responseTime || ""}</strong></div>
                        <div><span>Availability</span><strong>{profile.availability || ""}</strong></div>
                        <div><span>Background Check</span><strong>{profile.background_check || profile.backgroundCheck || ""}</strong></div>
                      </div>
                    </article>

                    <article className={styles.card}>
                      <h3 className={styles.sideTitle}>Proposal Snapshot</h3>
                      <div className={styles.snapshot}>
                        <div><span>Task</span><strong>{task.title}</strong></div>
                        <div><span>Bid Amount</span><strong>{(bid as any).amount}</strong></div>
                        <div><span>Bid Type</span><strong>{(bid as any).amount_type || (bid as any).amountType || ""}</strong></div>
                        <div><span>Client</span><strong>{task.client?.name || ""}</strong></div>
                      </div>
                    </article>

                    <article className={styles.card}>
                      <h3 className={styles.sideTitle}>Languages</h3>
                      <div className={styles.languageList}>
                        {(profile.languages || []).map((language: any) => (
                          <div key={language.name}>
                            <span>{language.name}</span>
                            <strong>{language.level}</strong>
                          </div>
                        ))}
                      </div>
                    </article>
                  </aside>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
