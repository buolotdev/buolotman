"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

type BidStatus = "all" | "pending" | "accepted" | "rejected" | "withdrawn";
type SortOption = "newest" | "highest" | "lowest";

type Bid = {
  id: string;
  taskId: string;
  taskTitle: string;
  location: string;
  submittedAt: string;
  competingBids: number;
  description: string;
  skills: string[];
  proposal: string;
  duration: string;
  extra: string;
  amount: number;
  amountLabel: string;
  client: string;
  clientRating: string;
  clientInitials: string;
  status: Exclude<BidStatus, "all">;
  taskStatus: string;
};

const PAGE_SIZE = 2;

export default function TechnicianBidsPage() {
  const toast = useToast();
  const { data: bidsData, loading, refetch } = useFetch(() => api.getMyBids(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);
  const { data: conversationsData } = useFetch(() => api.getConversations(), []);
  const conversations = useMemo(() => Array.isArray(conversationsData) ? conversationsData : [], [conversationsData]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BidStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [messagedIds, setMessagedIds] = useState<string[]>([]);
  const [withdrawingBidId, setWithdrawingBidId] = useState<string | null>(null);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  const bids: Bid[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (Array.isArray(bidsData) ? bidsData : bidsData?.results ?? []) as any[];
    return raw.map((b) => {
      const cFirst = b.client_first_name?.[0] ?? "";
      const cLast = b.client_last_name?.[0] ?? "";
      return {
        id: String(b.id),
        taskId: String(b.task_id ?? b.taskId ?? ""),
        taskTitle: b.task_title ?? b.taskTitle ?? "",
        location: b.location ?? "",
        submittedAt: b.submitted_at ?? b.submittedAt ?? "",
        competingBids: b.competing_bids ?? b.competingBids ?? 0,
        description: b.description ?? "",
        skills: b.skills ?? [],
        proposal: b.proposal ?? "",
        duration: b.duration ?? "",
        extra: b.extra ?? "",
        amount: b.amount ?? 0,
        amountLabel: b.amount_label ?? b.amountLabel ?? formatXOF(b.amount ?? 0),
        client: b.client ?? "",
        clientRating: b.client_rating ?? b.clientRating ?? "",
        clientInitials: `${cFirst}${cLast}`.toUpperCase(),
        status: b.status ?? "pending",
        taskStatus: b.task_status ?? b.taskStatus ?? "",
      };
    });
  }, [bidsData]);
  const visibleBids = useMemo(() => bids.filter((bid) => bid.status !== "withdrawn"), [bids]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredBids = useMemo(() => {
    let next = visibleBids;

    if (activeTab !== "all") {
      next = next.filter((bid) => bid.status === activeTab);
    }

    if (normalizedQuery) {
      next = next.filter((bid) =>
        [bid.taskTitle, bid.location, bid.client, bid.description, ...bid.skills]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    if (sortBy === "highest") next = [...next].sort((a, b) => b.amount - a.amount);
    else if (sortBy === "lowest") next = [...next].sort((a, b) => a.amount - b.amount);

    return next;
  }, [visibleBids, activeTab, normalizedQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBids.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedBids = filteredBids.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pendingCount = visibleBids.filter((bid) => bid.status === "pending").length;
  const acceptedCount = visibleBids.filter((bid) => bid.status === "accepted").length;
  const rejectedCount = visibleBids.filter((bid) => bid.status === "rejected").length;
  const earnedTotal = visibleBids.filter((bid) => bid.status === "accepted").reduce((sum, bid) => sum + bid.amount, 0);
  const winRate = visibleBids.length ? `${Math.round((acceptedCount / visibleBids.length) * 100)}%` : "0%";

  const withdrawBid = async (bidId: string) => {
    setWithdrawingBidId(bidId);
    try {
      await api.withdrawBid(Number(bidId));
      toast.success("Bid withdrawn", "You can submit a fresh bid for this task now.");
      await refetch();
    } catch (err: any) {
      toast.error("Could not withdraw bid", err?.message || "Please try again.");
    } finally {
      setWithdrawingBidId((current) => (current === bidId ? null : current));
    }
  };

  const messageClient = (bidId: string) => {
    setMessagedIds((current) => (current.includes(bidId) ? current : [...current, bidId]));
  };

  const getConvoLink = (clientName: string, taskId: string) => {
    const convo = conversations.find(
      (c: any) =>
        c.other_participant?.name === clientName ||
        String(c.task_id || c.taskId) === String(taskId)
    );
    return convo ? `/dashboard/technician/messages?c=${convo.id}` : `/dashboard/technician/messages`;
  };

  const changeTab = (tab: BidStatus) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks or users..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>Bid management</p>
                <h1>My Bids</h1>
              </div>
              <Link href="/dashboard/technician/tasks" className={styles.primaryButton}>
                <iconify-icon icon="lucide:search" />
                Find New Tasks
              </Link>
            </section>

            {loading ? (
              <section className={styles.statsGrid}>
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
              </section>
            ) : (
              <section className={styles.statsGrid}>
                <article className={styles.statCard}>
                  <span className={styles.statIcon}><iconify-icon icon="lucide:file-stack" /></span>
                  <div><small>Total Bids</small><strong>{visibleBids.length}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={styles.statIcon}><iconify-icon icon="lucide:clock" /></span>
                  <div><small>Active Pending</small><strong>{pendingCount}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:check-circle" /></span>
                  <div><small>Win Rate</small><strong>{winRate}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:coins" /></span>
                  <div><small>Earned via Bids</small><strong>{formatXOF(earnedTotal)}</strong></div>
                </article>
              </section>
            )}

            <section className={styles.toolbar}>
              <div className={styles.tabs}>
                <button type="button" className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`} onClick={() => changeTab("all")}>All Bids ({visibleBids.length})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "pending" ? styles.tabActive : ""}`} onClick={() => changeTab("pending")}>Pending ({pendingCount})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "accepted" ? styles.tabActive : ""}`} onClick={() => changeTab("accepted")}>Accepted ({acceptedCount})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "rejected" ? styles.tabActive : ""}`} onClick={() => changeTab("rejected")}>Rejected ({rejectedCount})</button>
              </div>

              <label className={styles.sortWrap}>
                <span>Sort by</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className={styles.sortSelect}>
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </label>
            </section>

            <section className={styles.bidList}>
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
              ) : pagedBids.length ? (
                pagedBids.map((bid) => {
                  const isCompletedTask = bid.taskStatus === "completed";
                  const displayStatus = isCompletedTask ? "completed" : bid.status;
                  const statusClass =
                    displayStatus === "completed"
                      ? styles.statusCompleted
                      : displayStatus === "accepted"
                        ? styles.statusAccepted
                        : displayStatus === "rejected"
                          ? styles.statusRejected
                          : styles.statusPending;
                  const statusIcon =
                    displayStatus === "completed"
                      ? "lucide:badge-check"
                      : displayStatus === "accepted"
                        ? "lucide:check-circle-2"
                        : displayStatus === "rejected"
                          ? "lucide:x-circle"
                          : "lucide:loader-2";
                  const isMessaged = messagedIds.includes(bid.id);

                  return (
                    <article key={bid.id} className={styles.bidCard}>
                      <div className={styles.bidHeader}>
                        <div className={styles.taskInfo}>
                          <h2>{bid.taskTitle}</h2>
                          <div className={styles.metaRow}>
                            <span><iconify-icon icon="lucide:map-pin" />{bid.location}</span>
                            <span><iconify-icon icon="lucide:clock" />{bid.submittedAt}</span>
                            <span><iconify-icon icon="lucide:users" />{bid.competingBids} Competing Bids</span>
                          </div>
                        </div>
                        <span className={`${styles.statusPill} ${statusClass}`}>
                          <iconify-icon icon={statusIcon} />
                          {displayStatus}
                        </span>
                      </div>

                      <p className={styles.description}>{bid.description}</p>

                      <div className={styles.skillRow}>
                        {bid.skills.map((skill) => (
                          <span key={skill} className={styles.skillTag}>{skill}</span>
                        ))}
                      </div>

                      <div className={styles.offerBox}>
                        <div className={styles.offerDetails}>
                          <span className={styles.offerLabel}>Your Proposal</span>
                          <p>{bid.proposal}</p>
                          <div className={styles.offerMeta}>
                            <span><iconify-icon icon="lucide:calendar-clock" />Est. Duration: <strong>{bid.duration}</strong></span>
                            <span><iconify-icon icon="lucide:shield-check" />Includes: <strong>{bid.extra}</strong></span>
                          </div>
                        </div>
                        <div className={styles.offerPrice}>
                          <strong>{bid.amountLabel}</strong>
                          <small>Fixed Amount</small>
                        </div>
                      </div>

                      <div className={styles.bidFooter}>
                        <div className={styles.clientInfo}>
                          <span className={styles.clientAvatar}>{bid.clientInitials}</span>
                          <div>
                            <strong>{bid.client}</strong>
                            <span><iconify-icon icon="lucide:star" />{bid.clientRating}</span>
                          </div>
                        </div>

                        <div className={styles.actionRow}>
                          {bid.status === "pending" ? (
                            <button
                              type="button"
                              className={styles.outlineButton}
                              disabled={withdrawingBidId === bid.id}
                              onClick={() => withdrawBid(bid.id)}
                            >
                              {withdrawingBidId === bid.id ? "Withdrawing..." : "Withdraw Bid"}
                            </button>
                          ) : null}
                          {bid.status === "accepted" && !isCompletedTask ? (
                            <Link href={getConvoLink(bid.client, bid.taskId)} className={styles.outlineButton} onClick={() => messageClient(bid.id)}>
                              <iconify-icon icon="lucide:message-circle" />
                              {isMessaged ? "Message Sent" : "Message"}
                            </Link>
                          ) : null}
                          <Link href={`/dashboard/technician/tasks/${bid.taskId}`} className={styles.primarySmallButton}>
                            {isCompletedTask ? "View Completed Task" : bid.status === "accepted" ? "Manage Task" : "View Details"}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.emptyState}>No bids yet</div>
              )}
            </section>

            {!loading && filteredBids.length > 0 && (
              <div className={styles.pagination}>
                <button type="button" className={styles.pageButton} disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  <iconify-icon icon="lucide:chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
                  <button key={value} type="button" className={`${styles.pageButton} ${value === currentPage ? styles.pageButtonActive : ""}`} onClick={() => setPage(value)}>
                    {value}
                  </button>
                ))}
                <button type="button" className={styles.pageButton} disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                  <iconify-icon icon="lucide:chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
