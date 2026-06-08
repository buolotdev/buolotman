"use client";

import Link from "next/link";
import { notFound, usePathname, useRouter } from "next/navigation";
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

const sortOptions = [
  { id: "best-match", label: "Best Match" },
  { id: "lowest-price", label: "Lowest Price" },
  { id: "top-rated", label: "Top Rated" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

function parseAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return Number(digits || 0);
}

export default function TaskProposalsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortId>("best-match");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [messagingId, setMessagingId] = useState<string | null>(null);

  const { taskId } = use(params);
  const { data: task, loading: taskLoading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: bidsData, loading: bidsLoading } = useFetch(() => api.getTaskBids(Number(taskId)), [taskId]);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  const bidsList = useMemo(() => {
    const list = Array.isArray(bidsData) ? bidsData : bidsData?.results || [];
    const ranked = [...list];
    if (sortBy === "lowest-price") {
      ranked.sort((a: any, b: any) => parseAmount(a.amount) - parseAmount(b.amount));
    } else if (sortBy === "top-rated") {
      ranked.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else {
      ranked.sort((a: any, b: any) => {
        const scoreA = (a.rating || 0) * 100 + (a.verified ? 25 : 0) - parseAmount(a.amount) / 1000;
        const scoreB = (b.rating || 0) * 100 + (b.verified ? 25 : 0) - parseAmount(b.amount) / 1000;
        return scoreB - scoreA;
      });
    }
    return ranked;
  }, [sortBy, bidsData]);
  const acceptedBids = useMemo(
    () => bidsList.filter((bid: any) => String(bid.status || "").toLowerCase() === "accepted"),
    [bidsList]
  );
  const hasAcceptedProposal = acceptedBids.length > 0;
  const visibleBids = acceptedBids.length > 0 ? acceptedBids : bidsList;

  const loading = taskLoading || bidsLoading;

  if (!taskLoading && !task) notFound();

  const proposalCount = visibleBids.length;
  const amounts = visibleBids.map((bid: any) => parseAmount(bid.amount)).filter((value) => value > 0);
  const averageBid = amounts.length ? Math.round(amounts.reduce((sum, value) => sum + value, 0) / amounts.length) : 0;
  const lowestBid = amounts.length ? Math.min(...amounts) : 0;
  const highestBid = amounts.length ? Math.max(...amounts) : 0;
  const shortlistedCount = shortlistedIds.length;

  const toggleShortlist = (bidId: string) => {
    setShortlistedIds((current) => (current.includes(bidId) ? current.filter((id) => id !== bidId) : [...current, bidId]));
  };

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
                  <div className={styles.userName}>
                    {loading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}
                  </div>
                  <div className={styles.userRole}>{userRole}</div>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            {loading ? (
              <>
                <SkeletonBlock style={{ width: 200, height: 16, marginBottom: 16 }} />
                <SkeletonBlock style={{ width: "60%", height: 28, marginBottom: 16 }} />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : task ? (
              <>
                <section className={styles.headerRow}>
                  <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.backLink}>
                    <iconify-icon icon="lucide:arrow-left" />
                    Back to Task Details
                  </Link>

                  <div className={styles.headerBar}>
                    <div>
                      <h1 className={styles.pageTitle}>
                        {hasAcceptedProposal ? "Accepted Proposal" : "Review Proposals"} ({proposalCount})
                      </h1>
                      <div className={styles.timeline}>
                        <span className={`${styles.timelineStep} ${styles.timelineDone}`}>Posted</span>
                        <span className={`${styles.timelineLine} ${styles.timelineLineActive}`} />
                        <span className={`${styles.timelineStep} ${styles.timelineActive}`}>
                          {hasAcceptedProposal ? "Hired" : `Reviewing (${proposalCount})`}
                        </span>
                        <span className={styles.timelineLine} />
                        <span className={`${styles.timelineStep} ${hasAcceptedProposal ? styles.timelineDone : ""}`}>Hired</span>
                        <span className={styles.timelineLine} />
                        <span className={styles.timelineStep}>Completed</span>
                      </div>
                    </div>

                    {!hasAcceptedProposal ? (
                    <div className={styles.sortWrap}>
                      <label htmlFor="proposal-sort" className={styles.sortLabel}>
                        Sort by
                      </label>
                      <select id="proposal-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortId)} className={styles.sortSelect}>
                        {sortOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    ) : null}
                  </div>
                </section>

                <section className={styles.overviewPanel}>
                  <div className={styles.overviewMain}>
                    <div className={styles.overviewTop}>
                      <div>
                        <span className={styles.statusBadge}>{hasAcceptedProposal ? "Hired" : "Open for Bids"}</span>
                        <h2 className={styles.overviewTitle}>{task.title}</h2>
                        <p className={styles.overviewMeta}>
                          {task.posted_at || task.postedAt || ""} • ID: #{String(task.id).toUpperCase()}
                        </p>
                      </div>

                      <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.outlineButton}>
                        Full Posting
                      </Link>
                    </div>

                    <div className={styles.detailsGrid}>
                      <div>
                        <span>Client Budget</span>
                        <strong>{task.logistics?.budgetLabel || `${Number(task.budget_min || 0).toLocaleString()} XOF`}</strong>
                      </div>
                      <div>
                        <span>Location</span>
                        <strong>{task.city || task.location || "Not specified"}</strong>
                      </div>
                      <div>
                        <span>Timeline</span>
                        <strong>{task.logistics?.scheduleLabel || task.schedule || "Flexible"}</strong>
                      </div>
                      <div>
                        <span>Property Type</span>
                        <strong>{task.logistics?.propertyType || task.property_type || "Not specified"}</strong>
                      </div>
                    </div>

                    <div className={styles.descriptionBlock}>
                      <h3>Task Description</h3>
                      <p>{(Array.isArray(task.description) ? task.description[0] : task.description) || "No description provided."}</p>
                      <div className={styles.skillRow}>
                        {(task.skills || []).map((skill: string) => (
                          <span key={skill} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.attachmentsBlock}>
                      <h3>Task Attachments</h3>
                      <div className={styles.attachmentRow}>
                        {(task.attachments || []).map((attachment: any) => (
                          <button key={attachment.name} type="button" className={styles.attachmentChip}>
                            <iconify-icon icon={attachment.type === "image" ? "lucide:image" : "lucide:file-text"} />
                            <span>{attachment.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <aside className={styles.overviewSide}>
                    <h3>Bid Insights</h3>
                      <div className={styles.insightList}>
                      <div><span>{hasAcceptedProposal ? "Accepted Proposal" : "Total Proposals"}</span><strong>{proposalCount}</strong></div>
                      <div><span>Average Bid</span><strong>{averageBid.toLocaleString()} XOF</strong></div>
                      <div><span>Lowest Bid</span><strong>{lowestBid ? `${lowestBid.toLocaleString()} XOF` : ""}</strong></div>
                      <div><span>Highest Bid</span><strong>{highestBid ? `${highestBid.toLocaleString()} XOF` : ""}</strong></div>
                      <div><span>Shortlisted</span><strong>{shortlistedCount}</strong></div>
                    </div>
                    <p className={styles.insightNote}>
                      {hasAcceptedProposal
                        ? "This task already has an accepted proposal, so only the hired bid stays visible."
                        : "Proposals are linked to this task only. That solves the routing issue: each task has its own review page and its own proposal set."}
                    </p>
                  </aside>
                </section>

                <section className={styles.gridBids}>
                  {visibleBids.length ? (
                    visibleBids.map((bid: any, index: number) => {
                      const shortlisted = shortlistedIds.includes(String(bid.id));
                      const isAcceptedBid = String(bid.status || "").toLowerCase() === "accepted";
                      const labor = Math.round(parseAmount(bid.amount) * 0.67);
                      const materials = Math.round(parseAmount(bid.amount) * 0.25);
                      const fees = parseAmount(bid.amount) - labor - materials;

                      return (
                        <article key={bid.id} className={styles.bidCard}>
                          <div className={styles.bidHeader}>
                            <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}`} className={styles.bidUserLink}>
                              <div className={styles.bidUser}>
                                <div className={styles.bidAvatar}>{bid.technician_initials || bid.initials || "?"}</div>
                                <div>
                                  <div className={styles.bidNameRow}>
                                    <h3>{bid.technician_name || bid.bidder || ""}</h3>
                                  </div>
                                  <div className={styles.bidMeta}>
                                    {bid.technician_rating != null && bid.technician_rating !== "" ? <span>{bid.technician_rating} ★</span> : null}
                                    {bid.verified ? <span className={styles.verified}>Verified Pro</span> : null}
                                    {(task.city || task.location) ? <span><iconify-icon icon="lucide:map-pin" /> {task.city || task.location}</span> : null}
                                  </div>
                                </div>
                              </div>
                            </Link>

                            <div className={styles.bidPriceBox}>
                              <strong>{bid.amount}</strong>
                              <span>{bid.amount_type || bid.amountType || ""}</span>
                            </div>
                          </div>

                          <div className={styles.costBreakdown}>
                            <div><span>Labor</span><span>{labor.toLocaleString()} XOF</span></div>
                            <div><span>Materials</span><span>{materials.toLocaleString()} XOF</span></div>
                            <div><span>Fees / Extras</span><span>{fees.toLocaleString()} XOF</span></div>
                            <div className={styles.totalRow}><span>Total Proposal</span><span>{bid.amount}</span></div>
                          </div>

                          <div className={styles.statsGrid}>
                            <div><span>Success Rate</span><strong>{bid.success_rate || ""}</strong></div>
                            <div><span>Duration</span><strong>{bid.duration || ""}</strong></div>
                            <div><span>Availability</span><strong>{bid.availability || ""}</strong></div>
                            <div><span>Warranty</span><strong>{bid.warranty || ""}</strong></div>
                          </div>

                          {bid.question ? (
                            <div className={styles.questionBox}>
                              <strong>Question{bid.technician_name ? ` from ${(bid.technician_name).split(" ")[0]}` : ""}:</strong>
                              <p>{bid.question}</p>
                            </div>
                          ) : null}

                          {bid.message ? <blockquote className={styles.coverLetter}>{bid.message}</blockquote> : null}

                          {bid.portfolio && bid.portfolio.length > 0 ? (
                            <div>
                              <h4 className={styles.subhead}>Related Past Work</h4>
                              <div className={styles.portfolioRow}>
                                {(bid.portfolio || []).map((item: string) => (
                                  <span key={item} className={styles.portfolioThumb}>
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className={styles.bidActions}>
                            <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}`} className={styles.outlineButton}>
                              View Profile
                            </Link>
                            {hasAcceptedProposal ? (
                              <span className={styles.acceptedButton}>
                                {isAcceptedBid ? "Proposal accepted" : "Task already hired"}
                              </span>
                            ) : (
                              <>
                                <button type="button" className={shortlisted ? styles.secondaryActiveButton : styles.outlineButton} onClick={() => toggleShortlist(String(bid.id))}>
                                  {shortlisted ? "Shortlisted" : "Shortlist"}
                                </button>
                                <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}/payment`} className={styles.primaryButton}>
                                  Accept Proposal
                                </Link>
                              </>
                            )}
                            <button
                              type="button"
                              className={styles.iconAction}
                              aria-label={`Message ${bid.technician_name || ""}`}
                              disabled={messagingId === String(bid.id)}
                              onClick={async () => {
                                const techId = bid.technician;
                                if (!techId) {
                                  toast.warning("Cannot message", "Technician ID not found.");
                                  return;
                                }
                                setMessagingId(String(bid.id));
                                try {
                                  const convo = await api.createConversation(techId, task.id);
                                  router.push(`/dashboard/client/messages?c=${convo.id}`);
                                } catch (err: any) {
                                  toast.error("Could not start conversation", err?.message || "Please try again.");
                                } finally {
                                  setMessagingId(null);
                                }
                              }}
                            >
                              <iconify-icon icon="lucide:message-square" />
                            </button>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className={styles.emptyState}>
                      {hasAcceptedProposal ? "This task already has an accepted proposal." : "No proposals have arrived for this task yet."}
                    </div>
                  )}
                </section>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
