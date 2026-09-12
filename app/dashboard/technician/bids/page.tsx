"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
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
  clientAvatar?: string;
  status: Exclude<BidStatus, "all">;
  taskStatus: string;
};

const PAGE_SIZE = 4;

const translations: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search tasks or users...",
    eyebrow: "Bid management",
    title: "My Bids",
    findNewTasks: "Find New Tasks",
    totalBids: "Total Bids",
    activePending: "Active Pending",
    winRate: "Win Rate",
    earnedViaBids: "Earned via Bids",
    allBids: "All Bids",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    completed: "Completed",
    sortBy: "Sort by",
    newestFirst: "Newest First",
    highestAmount: "Highest Amount",
    lowestAmount: "Lowest Amount",
    competingBids: "Competing Bids",
    yourProposal: "Your Proposal",
    estDuration: "Est. Duration:",
    includes: "Includes:",
    fixedAmount: "Fixed Amount",
    withdrawBid: "Withdraw Bid",
    withdrawing: "Withdrawing...",
    message: "Message",
    messageSent: "Message Sent",
    viewCompleted: "View Completed Task",
    manageTask: "Manage Task",
    viewDetails: "View Details",
    noBidsYet: "No bids found",
    verifiedClient: "Verified Client",
  },
  fr: {
    searchPlaceholder: "Rechercher des tâches ou utilisateurs...",
    eyebrow: "Gestion des offres",
    title: "Mes Offres",
    findNewTasks: "Trouver de nouvelles missions",
    totalBids: "Total des Offres",
    activePending: "En attente",
    winRate: "Taux de réussite",
    earnedViaBids: "Gagné via les offres",
    allBids: "Toutes les offres",
    pending: "En attente",
    accepted: "Acceptées",
    rejected: "Refusées",
    completed: "Terminée",
    sortBy: "Trier par",
    newestFirst: "Plus récentes",
    highestAmount: "Montant le plus élevé",
    lowestAmount: "Montant le plus bas",
    competingBids: "Offres concurrentes",
    yourProposal: "Votre proposition",
    estDuration: "Durée estimée :",
    includes: "Comprend :",
    fixedAmount: "Montant Fixe",
    withdrawBid: "Retirer l'offre",
    withdrawing: "Retrait en cours...",
    message: "Message",
    messageSent: "Message envoyé",
    viewCompleted: "Voir la tâche terminée",
    manageTask: "Gérer la tâche",
    viewDetails: "Voir les détails",
    noBidsYet: "Aucune offre trouvée",
    verifiedClient: "Client Vérifié",
  }
};

export default function TechnicianBidsPage() {
  const toast = useToast();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: bidsData, loading, refetch } = useFetch(() => api.getMyBids(), []);
  const { data: conversationsData } = useFetch(() => api.getConversations(), []);
  const conversations = useMemo(() => (Array.isArray(conversationsData) ? conversationsData : []), [conversationsData]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BidStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [messagedIds, setMessagedIds] = useState<string[]>([]);
  const [withdrawingBidId, setWithdrawingBidId] = useState<string | null>(null);

  const bids: Bid[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (Array.isArray(bidsData) ? bidsData : bidsData?.results ?? []) as any[];
    return raw.map((b) => {
      const clientName =
        b.client_name ||
        b.client ||
        (b.client_first_name || b.client_last_name ? `${b.client_first_name || ""} ${b.client_last_name || ""}`.trim() : "") ||
        "Project Client";

      const cFirst = b.client_first_name?.[0] || clientName?.[0] || "C";
      const cLast = b.client_last_name?.[0] || clientName?.split(" ")?.[1]?.[0] || "L";
      const clientInitials = b.client_initials || `${cFirst}${cLast}`.toUpperCase();

      const rawRating = b.client_rating;
      const clientRating = rawRating && Number(rawRating) > 0 ? `⭐ ${Number(rawRating).toFixed(1)}` : "⭐ 5.0";

      const loc = b.location || b.city || b.task_location || "Abidjan, Lagunes";
      let submittedDate = "Recently";
      if (b.submitted_at || b.created_at) {
        try {
          submittedDate = new Date(b.submitted_at || b.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        } catch {
          submittedDate = "Recently";
        }
      }

      return {
        id: String(b.id),
        taskId: String(b.task_id ?? b.taskId ?? ""),
        taskTitle: b.task_title ?? b.taskTitle ?? "Task",
        location: loc,
        submittedAt: submittedDate,
        competingBids: Number(b.competing_bids ?? b.competingBids ?? 0),
        description: b.description ?? b.task_description ?? "Scope of work outlined in project requirements.",
        skills: Array.isArray(b.skills) && b.skills.length > 0 ? b.skills : ["General Service"],
        proposal: b.proposal ?? b.message ?? "Proposal submitted for project execution.",
        duration: b.duration ? (String(b.duration).toLowerCase().includes("day") || String(b.duration).toLowerCase().includes("hour") ? b.duration : `${b.duration} Days`) : "3 Days",
        extra: b.extra || "Materials & Escrow Protected",
        amount: Number(b.amount ?? 0),
        amountLabel: b.amount_label ?? (b.amount ? `${Number(b.amount).toLocaleString()} XOF` : formatXOF(b.amount ?? 0)),
        client: clientName,
        clientRating: clientRating,
        clientInitials: clientInitials,
        clientAvatar: b.client_avatar || "",
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
        [bid.taskTitle, bid.location, bid.client, bid.description, bid.proposal, ...bid.skills]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    return [...next].sort((a, b) => {
      if (sortBy === "highest") return b.amount - a.amount;
      if (sortBy === "lowest") return a.amount - b.amount;
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [visibleBids, activeTab, normalizedQuery, sortBy]);

  const pendingCount = useMemo(() => visibleBids.filter((bid) => bid.status === "pending").length, [visibleBids]);
  const acceptedCount = useMemo(() => visibleBids.filter((bid) => bid.status === "accepted").length, [visibleBids]);
  const rejectedCount = useMemo(() => visibleBids.filter((bid) => bid.status === "rejected").length, [visibleBids]);

  const totalPages = Math.max(1, Math.ceil(filteredBids.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedBids = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBids.slice(start, start + PAGE_SIZE);
  }, [filteredBids, currentPage]);

  const earnedTotal = useMemo(
    () => visibleBids.filter((bid) => bid.status === "accepted").reduce((sum, bid) => sum + bid.amount, 0),
    [visibleBids]
  );
  const winRate = visibleBids.length ? `${Math.round((acceptedCount / visibleBids.length) * 100)}%` : "0%";

  const withdrawBid = async (bidId: string) => {
    setWithdrawingBidId(bidId);
    try {
      await api.withdrawBid(Number(bidId));
      toast.success(lang === "fr" ? "Offre retirée" : "Bid withdrawn", lang === "fr" ? "Vous pouvez soumettre une nouvelle offre pour cette tâche." : "You can submit a fresh bid for this task now.");
      await refetch();
    } catch (err: any) {
      toast.error(lang === "fr" ? "Impossible de retirer l'offre" : "Could not withdraw bid", err?.message || "Please try again.");
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

  const getDisplayStatusLabel = (displayStatus: string) => {
    if (displayStatus === "completed") return t.completed;
    if (displayStatus === "accepted") return t.accepted;
    if (displayStatus === "rejected") return t.rejected;
    return t.pending;
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchPlaceholder}
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>{t.eyebrow}</p>
                <h1>{t.title}</h1>
              </div>
              <Link href="/dashboard/technician/tasks" className={styles.primaryButton}>
                <iconify-icon icon="lucide:search" />
                {t.findNewTasks}
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
                  <div><small>{t.totalBids}</small><strong>{visibleBids.length}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={styles.statIcon}><iconify-icon icon="lucide:clock" /></span>
                  <div><small>{t.activePending}</small><strong>{pendingCount}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:check-circle" /></span>
                  <div><small>{t.winRate}</small><strong>{winRate}</strong></div>
                </article>
                <article className={styles.statCard}>
                  <span className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:coins" /></span>
                  <div><small>{t.earnedViaBids}</small><strong>{formatXOF(earnedTotal)}</strong></div>
                </article>
              </section>
            )}

            <section className={styles.toolbar}>
              <div className={styles.tabs}>
                <button type="button" className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`} onClick={() => changeTab("all")}>{t.allBids} ({visibleBids.length})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "pending" ? styles.tabActive : ""}`} onClick={() => changeTab("pending")}>{t.pending} ({pendingCount})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "accepted" ? styles.tabActive : ""}`} onClick={() => changeTab("accepted")}>{t.accepted} ({acceptedCount})</button>
                <button type="button" className={`${styles.tab} ${activeTab === "rejected" ? styles.tabActive : ""}`} onClick={() => changeTab("rejected")}>{t.rejected} ({rejectedCount})</button>
              </div>

              <label className={styles.sortWrap}>
                <span>{t.sortBy}</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className={styles.sortSelect}>
                  <option value="newest">{t.newestFirst}</option>
                  <option value="highest">{t.highestAmount}</option>
                  <option value="lowest">{t.lowestAmount}</option>
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
                            <span><iconify-icon icon="lucide:users" />{bid.competingBids} {t.competingBids}</span>
                          </div>
                        </div>
                        <span className={`${styles.statusPill} ${statusClass}`}>
                          <iconify-icon icon={statusIcon} />
                          {getDisplayStatusLabel(displayStatus)}
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
                          <span className={styles.offerLabel}>{t.yourProposal}</span>
                          <p>{bid.proposal}</p>
                          <div className={styles.offerMeta}>
                            <span><iconify-icon icon="lucide:calendar-clock" />{t.estDuration} <strong>{bid.duration}</strong></span>
                            <span><iconify-icon icon="lucide:shield-check" />{t.includes} <strong>{bid.extra}</strong></span>
                          </div>
                        </div>
                        <div className={styles.offerPrice}>
                          <strong>{bid.amountLabel}</strong>
                          <small>{t.fixedAmount}</small>
                        </div>
                      </div>

                      <div className={styles.bidFooter}>
                        <div className={styles.clientInfo}>
                          <div className={styles.clientAvatar} style={{ overflow: "hidden" }}>
                            {bid.clientAvatar ? (
                              <img
                                src={getImageUrl(bid.clientAvatar)}
                                alt={bid.client}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <span>{bid.clientInitials}</span>
                            )}
                          </div>
                          <div>
                            <strong style={{ fontSize: 14.5, color: "#001f3f", fontWeight: 800 }}>{bid.client}</strong>
                            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                              <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a" }} /> {t.verifiedClient} • {bid.clientRating}
                            </span>
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
                              {withdrawingBidId === bid.id ? t.withdrawing : t.withdrawBid}
                            </button>
                          ) : null}
                          {bid.status === "accepted" && !isCompletedTask ? (
                            <Link href={getConvoLink(bid.client, bid.taskId)} className={styles.outlineButton} onClick={() => messageClient(bid.id)}>
                              <iconify-icon icon="lucide:message-circle" />
                              {isMessaged ? t.messageSent : t.message}
                            </Link>
                          ) : null}
                          <Link href={`/dashboard/technician/tasks/${bid.taskId}`} className={styles.primarySmallButton}>
                            {isCompletedTask ? t.viewCompleted : bid.status === "accepted" ? t.manageTask : t.viewDetails}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.emptyState}>{t.noBidsYet}</div>
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
