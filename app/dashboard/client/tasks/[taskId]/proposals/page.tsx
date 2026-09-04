"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, usePathname, useRouter } from "next/navigation";
import { use, useMemo, useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { cleanDescription } from "@/app/lib/format";
import OnlineStatusBadge from "@/app/components/OnlineStatusBadge";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";

const translations: Record<string, Record<string, string>> = {
  en: {
    backToTasks: "Back to My Tasks",
    taskProposals: "Task Proposals",
    proposalsReceived: "proposals received",
    viewTask: "Full Posting",
    clientBudget: "Client Budget",
    location: "Location",
    timeline: "Timeline",
    propertyType: "Property Type",
    taskDescription: "Task Description",
    taskAttachments: "Task Attachments",
    bidInsights: "Bid Insights",
    acceptedProposal: "Accepted Proposal",
    totalProposals: "Total Proposals",
    averageBid: "Average Bid",
    lowestBid: "Lowest Bid",
    highestBid: "Highest Bid",
    labor: "Labor",
    materials: "Materials",
    fees: "Fees / Extras",
    totalProposal: "Total Proposal",
    successRate: "Success Rate",
    duration: "Duration",
    availability: "Availability",
    warranty: "Warranty",
    viewProfile: "View Profile",
    acceptHire: "Accept & Hire",
    message: "Message",
    verifiedPro: "Verified Pro",
    sortBestMatch: "Best Match",
    sortLowestPrice: "Lowest Price",
    sortTopRated: "Top Rated",
    noProposals: "No proposals found matching your filter.",
    alreadyHired: "Task already hired",
  },
  fr: {
    backToTasks: "Retour à mes tâches",
    taskProposals: "Offres pour la mission",
    proposalsReceived: "offres reçues",
    viewTask: "Voir l'annonce complète",
    clientBudget: "Budget Client",
    location: "Lieu",
    timeline: "Délai",
    propertyType: "Type de bien",
    taskDescription: "Description de la mission",
    taskAttachments: "Pièces jointes",
    bidInsights: "Aperçu des Offres",
    acceptedProposal: "Offre acceptée",
    totalProposals: "Total des offres",
    averageBid: "Offre moyenne",
    lowestBid: "Offre la plus basse",
    highestBid: "Offre la plus haute",
    labor: "Main d'œuvre",
    materials: "Matériaux",
    fees: "Frais / Équipement",
    totalProposal: "Montant Total",
    successRate: "Taux de réussite",
    duration: "Durée",
    availability: "Disponibilité",
    warranty: "Garantie",
    viewProfile: "Voir le Profil",
    acceptHire: "Accepter & Réserver",
    message: "Message",
    verifiedPro: "Artisan Vérifié",
    sortBestMatch: "Meilleure correspondance",
    sortLowestPrice: "Prix le plus bas",
    sortTopRated: "Mieux notés",
    noProposals: "Aucune offre trouvée pour ce filtre.",
    alreadyHired: "Mission déjà attribuée",
  }
};

function parseAmount(value: any) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const num = parseFloat(String(value).replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
}

export default function TaskProposalsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("best-match");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [messagingId, setMessagingId] = useState<string | null>(null);
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
    const list = Array.isArray(bidsData) ? bidsData : (bidsData as any)?.results || [];
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
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

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
                    {t.backToTasks}
                  </Link>

                  <div className={styles.headerBar}>
                    <div>
                      <h1 className={styles.pageTitle}>
                        {hasAcceptedProposal ? t.acceptedProposal : t.taskProposals} ({proposalCount})
                      </h1>
                    </div>

                    {!hasAcceptedProposal ? (
                    <div className={styles.sortWrap}>
                      <label htmlFor="proposal-sort" className={styles.sortLabel}>
                        {lang === "fr" ? "Trier par" : "Sort by"}
                      </label>
                      <select id="proposal-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as any)} className={styles.sortSelect}>
                        <option value="best-match">{t.sortBestMatch}</option>
                        <option value="lowest-price">{t.sortLowestPrice}</option>
                        <option value="top-rated">{t.sortTopRated}</option>
                      </select>
                    </div>
                    ) : null}
                  </div>
                </section>

                <section className={styles.overviewPanel}>
                  <div className={styles.overviewMain}>
                    <div className={styles.overviewTop}>
                      <div>
                        <span className={styles.statusBadge}>{hasAcceptedProposal ? (lang === "fr" ? "Attribué" : "Hired") : (lang === "fr" ? "Ouvert aux offres" : "Open for Bids")}</span>
                        <h2 className={styles.overviewTitle}>{task.title}</h2>
                        <p className={styles.overviewMeta}>
                          {task.posted_at || task.postedAt || ""} • ID: #{String(task.id).toUpperCase()}
                        </p>
                      </div>

                      <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.outlineButton}>
                        {t.viewTask}
                      </Link>
                    </div>

                    <div className={styles.detailsGrid}>
                      <div>
                        <span>{t.clientBudget}</span>
                        <strong>{task.logistics?.budgetLabel || `${Number(task.budget_min || 0).toLocaleString()} XOF`}</strong>
                      </div>
                      <div>
                        <span>{t.location}</span>
                        <strong>{task.city || task.location || "Not specified"}</strong>
                      </div>
                      <div>
                        <span>{t.timeline}</span>
                        <strong>{task.logistics?.scheduleLabel || task.schedule || "Flexible"}</strong>
                      </div>
                      <div>
                        <span>{t.propertyType}</span>
                        <strong>{task.logistics?.propertyType || task.property_type || "Not specified"}</strong>
                      </div>
                    </div>

                    <div className={styles.descriptionBlock}>
                      <h3>{t.taskDescription}</h3>
                      <p>{cleanDescription(Array.isArray(task.description) ? task.description[0] : task.description) || "No description provided."}</p>
                      <div className={styles.skillRow}>
                        {(task.skills || []).map((skill: string) => (
                          <span key={skill} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.attachmentsBlock}>
                      <h3>{t.taskAttachments}</h3>
                      <div className={styles.attachmentRow} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {(task.attachments || []).map((attachment: any, idx: number) => {
                          const isImage = attachment.file_type?.includes('image') || attachment.file_url?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                          return isImage ? (
                            <a key={attachment.id || idx} href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                              <img src={attachment.file_url} alt={attachment.file_name || 'Task Attachment'} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            </a>
                          ) : (
                            <a href={attachment.file_url} target="_blank" rel="noopener noreferrer" key={attachment.id || idx} className={styles.attachmentChip} style={{ textDecoration: 'none' }}>
                              <iconify-icon icon="lucide:file-text" />
                              <span>{attachment.file_name || 'View Attachment'}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <aside className={styles.overviewSide}>
                    <h3>{t.bidInsights}</h3>
                      <div className={styles.insightList}>
                      <div><span>{hasAcceptedProposal ? t.acceptedProposal : t.totalProposals}</span><strong>{proposalCount}</strong></div>
                      <div><span>{t.averageBid}</span><strong>{averageBid.toLocaleString()} XOF</strong></div>
                      <div><span>{t.lowestBid}</span><strong>{lowestBid ? `${lowestBid.toLocaleString()} XOF` : ""}</strong></div>
                      <div><span>{t.highestBid}</span><strong>{highestBid ? `${highestBid.toLocaleString()} XOF` : ""}</strong></div>
                    </div>
                  </aside>
                </section>

                <section className={styles.gridBids}>
                  {visibleBids.length ? (
                    visibleBids.map((bid: any) => {
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
                                <div className={styles.bidAvatar} style={{ position: "relative" }}>
                                  {bid.technician_initials || bid.initials || "?"}
                                  <OnlineStatusBadge
                                    isOnline={bid.technician_is_online}
                                    lastSeenDisplay={bid.technician_last_seen_display}
                                    showText={false}
                                    size="sm"
                                    style={{ position: "absolute", bottom: -2, right: -2 }}
                                  />
                                </div>
                                <div>
                                  <div className={styles.bidNameRow} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <h3 style={{ margin: 0 }}>{bid.technician_name || bid.bidder || ""}</h3>
                                    <OnlineStatusBadge
                                      isOnline={bid.technician_is_online}
                                      lastSeenDisplay={bid.technician_last_seen_display}
                                      size="sm"
                                    />
                                  </div>
                                  <div className={styles.bidMeta}>
                                    {bid.technician_rating != null && bid.technician_rating !== "" ? <span>{bid.technician_rating} ★</span> : null}
                                    {bid.verified ? <span className={styles.verified}>{t.verifiedPro}</span> : null}
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
                            <div><span>{t.labor}</span><span>{labor.toLocaleString()} XOF</span></div>
                            <div><span>{t.materials}</span><span>{materials.toLocaleString()} XOF</span></div>
                            <div><span>{t.fees}</span><span>{fees.toLocaleString()} XOF</span></div>
                            <div className={styles.totalRow}><span>{t.totalProposal}</span><span>{bid.amount}</span></div>
                          </div>

                          <div className={styles.statsGrid}>
                            <div><span>{t.successRate}</span><strong>{bid.success_rate || ""}</strong></div>
                            <div><span>{t.duration}</span><strong>{bid.duration || ""}</strong></div>
                            <div><span>{t.availability}</span><strong>{bid.availability || ""}</strong></div>
                            <div><span>{t.warranty}</span><strong>{bid.warranty || ""}</strong></div>
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
                              {t.viewProfile}
                            </Link>
                            {hasAcceptedProposal ? (
                              <span className={styles.acceptedButton}>
                                {isAcceptedBid ? t.acceptedProposal : t.alreadyHired}
                              </span>
                            ) : (
                              <>
                                <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}/payment`} className={styles.primaryButton}>
                                  {t.acceptHire}
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
                      {t.noProposals}
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
