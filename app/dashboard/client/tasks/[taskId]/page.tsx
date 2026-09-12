"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo, useState, useEffect } from "react";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatTimeAgo, formatDateTime } from "@/app/lib/format";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

const translations: Record<string, Record<string, string>> = {
  en: {
    backToTasks: "Back to My Tasks",
    views: "Views",
    taskDetails: "Task Details",
    requiredSkills: "Required Skills",
    attachments: "Attachments",
    logisticsTitle: "Logistics & Requirements",
    budget: "Estimated Budget",
    schedule: "Timeline / Schedule",
    location: "Job Location",
    materials: "Materials Provided",
    propertyType: "Property Type",
    parking: "Parking & Access",
    incomingProposals: "Incoming Proposals",
    viewAccepted: "View Accepted Proposal",
    reviewProposals: "Review All Proposals",
    noProposals: "No proposals submitted yet for this task.",
    proposalAccepted: "Proposal Accepted ✓",
    acceptProposal: "Accept Proposal",
    message: "Message Specialist",
    opening: "Opening Chat...",
    qaTitle: "Questions & Clarifications",
    qaSubtitle: "Specialists can ask clarifying questions here. Answers are visible to all prospective bidders.",
    noQuestions: "No questions asked yet.",
    taskStatus: "Task Overview & Status",
    proposalsCount: "Proposals",
    viewsCount: "Total Views",
    interviewsCount: "Interviews",
    markComplete: "Mark as Completed",
    completing: "Completing...",
    releaseEscrow: "Release Escrow Funds",
    releasing: "Releasing...",
    cancelTask: "Cancel Task",
    cancelling: "Cancelling...",
    aboutClient: "About the Client",
    tasksPosted: "Tasks Posted",
    totalSpent: "Payment Reliability",
    memberSince: "Member Since",
    verifiedClient: "Verified Client ✓",
    escrowProtected: "Escrow Protected",
    similarTasks: "Related Tasks in Category",
    viewAllSimilar: "View all tasks",
    clickToEnlarge: "Click to preview",
    closePreview: "Close Preview",
  },
  fr: {
    backToTasks: "Retour à mes tâches",
    views: "Vues",
    taskDetails: "Détails de la mission",
    requiredSkills: "Compétences requises",
    attachments: "Pièces jointes",
    logisticsTitle: "Logistique & Exigences",
    budget: "Budget Estimé",
    schedule: "Planning / Disponibilité",
    location: "Lieu d'intervention",
    materials: "Matériaux fournis",
    propertyType: "Type de bien",
    parking: "Stationnement & Accès",
    incomingProposals: "Propositions Reçues",
    viewAccepted: "Voir l'offre acceptée",
    reviewProposals: "Examiner toutes les offres",
    noProposals: "Aucune proposition pour le moment.",
    proposalAccepted: "Offre acceptée ✓",
    acceptProposal: "Accepter l'offre",
    message: "Discuter avec l'artisan",
    opening: "Ouverture du chat...",
    qaTitle: "Questions & Réponses",
    qaSubtitle: "Les professionnels peuvent poser des questions ici. Les réponses resteront visibles par tous.",
    noQuestions: "Aucune question pour l'instant.",
    taskStatus: "Statut de la mission",
    proposalsCount: "Offres",
    viewsCount: "Vues totales",
    interviewsCount: "Entretiens",
    markComplete: "Marquer comme terminée",
    completing: "Finalisation...",
    releaseEscrow: "Libérer les fonds séquestrés",
    releasing: "Libération...",
    cancelTask: "Annuler la tâche",
    cancelling: "Annulation...",
    aboutClient: "À propos du client",
    tasksPosted: "Missions publiées",
    totalSpent: "Fiabilité paiement",
    memberSince: "Membre depuis",
    verifiedClient: "Client Vérifié ✓",
    escrowProtected: "Protégé par Séquestre",
    similarTasks: "Missions similaires",
    viewAllSimilar: "Voir toutes les tâches",
    clickToEnlarge: "Agrandir l'image",
    closePreview: "Fermer l'aperçu",
  }
};

export default function TaskDetailsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [acting, setActing] = useState<"complete" | "cancel" | "release" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [messagingId, setMessagingId] = useState<number | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const [lang, setLang] = useState("en");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: task, loading, refetch } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: userData } = useFetch(() => api.getMe(), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);
  const { data: skillsData } = useFetch(() => api.getSkills(), []);

  const categoryName = useMemo(() => {
    if (task?.category_name && typeof task.category_name === "string" && isNaN(Number(task.category_name))) {
      return task.category_name;
    }
    if (task?.category) {
      if (typeof task.category === "object" && task.category.name) return task.category.name;
      const found = (categoriesData || []).find((c: any) => String(c.id) === String(task.category));
      if (found) return found.name;
      if (typeof task.category === "string" && isNaN(Number(task.category))) return task.category;
    }
    return "Service Request";
  }, [task, categoriesData]);

  const displayedSkills: string[] = useMemo(() => {
    if (task?.skills_list && Array.isArray(task.skills_list) && task.skills_list.length > 0) {
      return task.skills_list;
    }
    if (task?.skills && Array.isArray(task.skills)) {
      return task.skills.map((s: any) => {
        if (typeof s === "string" && isNaN(Number(s))) return s;
        const found = (skillsData || []).find((sk: any) => String(sk.id) === String(s));
        return found ? found.name : `Skill #${s}`;
      });
    }
    return [];
  }, [task, skillsData]);

  const clientInfo = useMemo(() => {
    const isSelf = userData && (String(userData.id) === String(task?.client) || String(userData.id) === String(task?.client?.id));

    const name = isSelf
      ? (`${userData?.first_name || ""} ${userData?.last_name || ""}`.trim() || userData?.username || "Client")
      : (task?.client_name || (typeof task?.client === "object" ? task.client?.name : null) || "Client");

    const initials = isSelf
      ? ((userData?.first_name?.[0] || "") + (userData?.last_name?.[0] || "")).toUpperCase() || (userData?.username ? userData.username.slice(0, 2).toUpperCase() : "CL")
      : (task?.client_initials || (typeof task?.client === "object" ? task.client?.initials : null) || (name ? name.slice(0, 2).toUpperCase() : "CL"));

    const location = isSelf
      ? (userData?.city || userData?.address || userData?.country || task?.city || task?.location || "Cotonou, Benin")
      : (task?.client?.location || task?.city || task?.location || "Cotonou, Benin");

    const memberSince = isSelf
      ? (userData?.created_at ? new Date(userData.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "2026")
      : (task?.client?.member_since || (task?.created_at ? new Date(task.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "2026"));

    const tasksPosted = isSelf
      ? (userData?.tasks_posted || 1)
      : (task?.client?.tasks_posted || 1);

    const rating = isSelf
      ? (userData?.rating && Number(userData.rating) > 0 ? `⭐ ${Number(userData.rating).toFixed(1)}` : "⭐ New Client")
      : (task?.client?.rating && Number(task.client.rating) > 0 ? `⭐ ${Number(task.client.rating).toFixed(1)}` : "⭐ New Client");

    const isVerified = isSelf
      ? Boolean(userData?.is_verified)
      : Boolean(task?.client?.is_verified || task?.assigned_to_verified);

    return { name, initials, location, memberSince, tasksPosted, rating, isVerified };
  }, [userData, task]);

  const handleComplete = async () => {
    if (!confirm("Mark this task as completed? You will be able to release escrow after.")) return;
    setActing("complete");
    setActionError(null);
    try {
      await api.completeTask(Number(taskId));
      toast.show("success", "Task marked as completed successfully!");
      await refetch();
    } catch (err: any) {
      setActionError(err?.message || "Could not mark complete");
      toast.show("error", err?.message || "Could not mark complete");
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
      toast.show("info", "Task cancelled.");
      router.push("/dashboard/client/tasks");
    } catch (err: any) {
      setActionError(err?.message || "Could not cancel");
      toast.show("error", err?.message || "Could not cancel");
    } finally {
      setActing(null);
    }
  };

  const handleReleaseEscrow = async () => {
    if (!confirm("Release escrow funds to the technician? This transaction is final.")) return;
    setActing("release");
    setActionError(null);
    try {
      await api.releaseEscrow(Number(taskId));
      toast.show("success", "Escrow funds released to specialist successfully!");
      await refetch();
    } catch (err: any) {
      setActionError(err?.message || "Could not release escrow");
      toast.show("error", err?.message || "Could not release escrow");
    } finally {
      setActing(null);
    }
  };

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

  const statusToneClass = useMemo(() => {
    const s = String(task?.status || "").toLowerCase();
    if (s === "completed") return styles.statusCompleted;
    if (s === "in_progress") return styles.statusProgress;
    if (s === "cancelled") return styles.statusCancelled;
    return styles.statusOpen;
  }, [task?.status]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashboardHeader
          onMenuClick={() => setMobileNavOpen(true)}
          searchPlaceholder="Search tasks, specialists, messages..."
        />

        <main className={styles.content}>
          {loading ? (
            <div className={styles.grid}>
              <div>
                <SkeletonBlock style={{ width: "40%", height: 32, marginBottom: 16 }} />
                <SkeletonBlock style={{ width: "70%", height: 48, marginBottom: 24 }} />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <aside>
                <SkeletonCard />
                <SkeletonCard />
              </aside>
            </div>
          ) : task ? (
            <div className={styles.grid}>
              <div className={styles.mainColumn}>
                {/* Task Header Hero */}
                <div className={styles.taskHeroCard}>
                  <Link href="/dashboard/client/tasks" className={styles.backLink}>
                    <iconify-icon icon="lucide:arrow-left" />
                    <span>{t.backToTasks}</span>
                  </Link>

                  <div className={styles.titleSection}>
                    <h1 className={styles.taskTitle}>{task.title}</h1>
                    <div className={styles.taskMetaPills}>
                      <span className={styles.categoryPill}>
                        <iconify-icon icon="lucide:layers" />
                        {categoryName}
                      </span>
                      {task.created_at && (
                        <span className={styles.metaPill}>
                          <iconify-icon icon="lucide:clock" />
                          {formatDateTime(task.created_at, lang)} ({formatTimeAgo(task.created_at, lang)})
                        </span>
                      )}
                      <span className={styles.metaPill}>
                        <iconify-icon icon="lucide:map-pin" />
                        {task.city || task.location || "Cotonou"}
                      </span>
                      <span className={styles.metaPill}>
                        <iconify-icon icon="lucide:eye" />
                        {task.views_count || task.views || 1} {t.views}
                      </span>
                      {task.urgency && (
                        <span className={`${styles.metaPill} ${styles.urgencyPill}`}>
                          <iconify-icon icon="lucide:zap" />
                          {task.urgency.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Details & Description */}
                <section className={styles.card}>
                  <div className={styles.cardHeaderWithIcon}>
                    <div className={styles.cardIconWrap}>
                      <iconify-icon icon="lucide:file-text" />
                    </div>
                    <div>
                      <h2 className={styles.sectionTitle}>{t.taskDetails}</h2>
                      <p className={styles.cardSubtitle}>Complete scope of work and specifications</p>
                    </div>
                  </div>

                  <div className={styles.descriptionBody}>
                    {(task.description ? (Array.isArray(task.description) ? task.description : [task.description]) : []).map((paragraph: string, idx: number) => (
                      <p key={idx} className={styles.descriptionParagraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {displayedSkills.length > 0 && (
                    <div className={styles.skillsSection}>
                      <h3 className={styles.subsectionLabel}>
                        <iconify-icon icon="lucide:sparkles" />
                        {t.requiredSkills}
                      </h3>
                      <div className={styles.skillsList}>
                        {displayedSkills.map((skill: string) => (
                          <span key={skill} className={styles.skillTag}>
                            <iconify-icon icon="lucide:check" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments Section with Working Previews & Lightbox */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className={styles.attachmentsSection}>
                      <h3 className={styles.subsectionLabel}>
                        <iconify-icon icon="lucide:paperclip" />
                        {t.attachments} ({task.attachments.length})
                      </h3>

                      <div className={styles.attachmentGrid}>
                        {task.attachments.map((attachment: any, idx: number) => {
                          const resolvedUrl = getImageUrl(attachment.file_url);
                          const isImage = attachment.content_type?.includes("image") || attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

                          return (
                            <div key={idx} className={styles.attachmentCard}>
                              {isImage ? (
                                <div
                                  className={styles.attachmentThumbWrap}
                                  onClick={() => setActiveLightboxImage({ url: resolvedUrl, name: attachment.file_name || `Attachment #${idx + 1}` })}
                                  title={t.clickToEnlarge}
                                >
                                  <img
                                    src={resolvedUrl}
                                    alt={attachment.file_name || "Attachment"}
                                    className={styles.attachmentThumbImg}
                                    onError={(e) => {
                                      const target = e.target as HTMLElement;
                                      target.style.display = "none";
                                      const fallback = target.nextElementSibling as HTMLElement;
                                      if (fallback) fallback.style.display = "flex";
                                    }}
                                  />
                                  <div className={styles.attachmentFallbackIcon} style={{ display: "none" }}>
                                    <iconify-icon icon="lucide:image" />
                                    <span>{attachment.file_name || "Image"}</span>
                                  </div>
                                  <div className={styles.attachmentZoomOverlay}>
                                    <iconify-icon icon="lucide:maximize-2" />
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.docAttachmentBox}>
                                  <iconify-icon icon="lucide:file-text" />
                                </div>
                              )}

                              <div className={styles.attachmentDetails}>
                                <span className={styles.attachmentName} title={attachment.file_name}>
                                  {attachment.file_name || `File-${idx + 1}`}
                                </span>
                                <div className={styles.attachmentActions}>
                                  <a
                                    href={resolvedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.attachmentLinkBtn}
                                    download={attachment.file_name || true}
                                  >
                                    <iconify-icon icon="lucide:download" />
                                    <span>Open</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>

                {/* Logistics & Project Parameters */}
                <section className={styles.card}>
                  <div className={styles.cardHeaderWithIcon}>
                    <div className={styles.cardIconWrap}>
                      <iconify-icon icon="lucide:compass" />
                    </div>
                    <div>
                      <h2 className={styles.sectionTitle}>{t.logisticsTitle}</h2>
                      <p className={styles.cardSubtitle}>Key site parameters, schedule, and budgetary boundaries</p>
                    </div>
                  </div>

                  <div className={styles.logisticsGrid}>
                    <div className={styles.logisticsItem}>
                      <span className={styles.logisticsIcon}><iconify-icon icon="lucide:wallet" /></span>
                      <div>
                        <small>{t.budget}</small>
                        <strong>{task.logistics?.budgetLabel || `${Number(task.budget_min || 0).toLocaleString()} XOF`}</strong>
                      </div>
                    </div>

                    <div className={styles.logisticsItem}>
                      <span className={styles.logisticsIcon}><iconify-icon icon="lucide:calendar-clock" /></span>
                      <div>
                        <small>{t.schedule}</small>
                        <strong>{task.logistics?.scheduleLabel || task.schedule || "Flexible Timing"}</strong>
                      </div>
                    </div>

                    <div className={styles.logisticsItem}>
                      <span className={styles.logisticsIcon}><iconify-icon icon="lucide:map-pin" /></span>
                      <div>
                        <small>{t.location}</small>
                        <strong>{task.logistics?.locationLabel || task.city || task.location || "Cotonou, Benin"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className={styles.extraParamsList}>
                    <div className={styles.paramRow}>
                      <span>{t.materials}</span>
                      <strong>{task.logistics?.materials || (task.materials_provided ? "Provided by Client" : "Specialist to supply")}</strong>
                    </div>
                    <div className={styles.paramRow}>
                      <span>{t.propertyType}</span>
                      <strong>{task.logistics?.propertyType || task.property_type || "Residential / Commercial"}</strong>
                    </div>
                    <div className={styles.paramRow}>
                      <span>{t.parking}</span>
                      <strong>{task.logistics?.parking || "Street & Site Parking Available"}</strong>
                    </div>
                  </div>
                </section>

                {/* Incoming Proposals */}
                <section className={styles.card}>
                  <div className={styles.sectionHeaderRow}>
                    <div className={styles.cardHeaderWithIcon}>
                      <div className={styles.cardIconWrap}>
                        <iconify-icon icon="lucide:briefcase" />
                      </div>
                      <div>
                        <h2 className={styles.sectionTitle}>{t.incomingProposals} ({visibleBids.length})</h2>
                        <p className={styles.cardSubtitle}>Verified artisan offers and quoted rates</p>
                      </div>
                    </div>

                    {visibleBids.length > 0 && (
                      <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.linkCtaInline}>
                        {hasAcceptedBid ? t.viewAccepted : t.reviewProposals}
                        <iconify-icon icon="lucide:arrow-right" />
                      </Link>
                    )}
                  </div>

                  <div className={styles.bidList}>
                    {visibleBids.length > 0 ? (
                      visibleBids.map((bid: any) => (
                        <article key={bid.id} className={styles.bidCard}>
                          <div className={styles.bidHeader}>
                            <div className={styles.bidderInfo}>
                              <div className={styles.bidderAvatar}>
                                {bid.initials || (bid.bidder_name ? bid.bidder_name.slice(0, 2).toUpperCase() : "SP")}
                              </div>
                              <div>
                                <h3 className={styles.bidderName}>{bid.bidder || bid.bidder_name || "Specialist"}</h3>
                                <div className={styles.bidderMeta}>
                                  {bid.rating != null && bid.rating !== "" ? (
                                    <span className={styles.bidRating}>⭐ {bid.rating}{bid.reviews != null ? ` (${bid.reviews} reviews)` : ""}</span>
                                  ) : (
                                    <span className={styles.bidRating}>⭐ Verified Specialist</span>
                                  )}
                                  <span className={styles.verifiedTag}>
                                    <iconify-icon icon="lucide:shield-check" /> Verified
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className={styles.bidPriceBlock}>
                              <strong className={styles.bidAmount}>{bid.amount || `${Number(bid.amount_min || task.budget_min || 0).toLocaleString()} XOF`}</strong>
                              <span className={styles.bidType}>{bid.amount_type || bid.amountType || "Fixed Price"}</span>
                            </div>
                          </div>

                          {bid.message && <p className={styles.bidMessageText}>{bid.message}</p>}

                          {bid.portfolio && bid.portfolio.length > 0 && (
                            <div className={styles.portfolioRow}>
                              {bid.portfolio.map((item: string, i: number) => (
                                <span key={i} className={styles.portfolioChip}>
                                  <iconify-icon icon="lucide:check-circle-2" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className={styles.bidActions}>
                            {hasAcceptedBid ? (
                              <span className={styles.statusPillAccepted}>{t.proposalAccepted}</span>
                            ) : (
                              <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}/payment`} className={styles.primaryActionButton}>
                                {t.acceptProposal}
                              </Link>
                            )}

                            <button
                              type="button"
                              className={styles.secondaryActionButton}
                              disabled={messagingId === bid.id}
                              onClick={async () => {
                                const targetId = bid.technician?.id || bid.technician || bid.specialist_id;
                                setMessagingId(bid.id);
                                try {
                                  const convo = await api.createConversation({
                                    participant_id: typeof targetId === "number" ? targetId : undefined,
                                    participant_name: bid.bidder || bid.bidder_name || undefined,
                                    task_id: task.id,
                                  });
                                  router.push(`/dashboard/client/messages?c=${convo.id}`);
                                } catch (err: any) {
                                  toast.show("error", err?.message || "Could not start conversation");
                                } finally {
                                  setMessagingId(null);
                                }
                              }}
                            >
                              <iconify-icon icon="lucide:message-square" />
                              {messagingId === bid.id ? t.opening : t.message}
                            </button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className={styles.emptyStateBox}>
                        <iconify-icon icon="lucide:inbox" />
                        <p>{t.noProposals}</p>
                        <span>Proposals from top rated artisans will appear here once submitted.</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Q&A Section */}
                <section className={styles.card}>
                  <div className={styles.cardHeaderWithIcon}>
                    <div className={styles.cardIconWrap}>
                      <iconify-icon icon="lucide:help-circle" />
                    </div>
                    <div>
                      <h2 className={styles.sectionTitle}>{t.qaTitle} ({(task.questions || []).length})</h2>
                      <p className={styles.cardSubtitle}>{t.qaSubtitle}</p>
                    </div>
                  </div>

                  <div className={styles.qaList}>
                    {(task.questions || []).length > 0 ? (
                      (task.questions || []).map((item: any) => (
                        <article key={item.id} className={styles.qaItem}>
                          <div className={styles.qaAvatar}>{item.initials || "SP"}</div>
                          <div className={styles.qaContent}>
                            <div className={styles.qaHeader}>
                              <strong>{item.asker || item.asker_name || "Artisan"}</strong>
                              <span>{item.time || (item.created_at ? formatTimeAgo(item.created_at, lang) : "")}</span>
                            </div>
                            <p>{item.question || item.text}</p>
                            {item.reply ? (
                              <div className={styles.qaReply}>
                                <div className={styles.qaHeader}>
                                  <strong>
                                    {item.reply.name || item.reply.author || clientInfo.name}
                                    <span className={styles.replyBadge}>Author</span>
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
                      <div className={styles.emptyStateBox}>
                        <iconify-icon icon="lucide:message-circle-question" />
                        <p>{t.noQuestions}</p>
                        <span>Pros can ask clarifying questions before submitting their bids.</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar Column */}
              <aside className={styles.sidebarColumn}>
                {/* Task Status Overview Widget */}
                <section className={`${styles.card} ${styles.statusWidgetCard}`}>
                  <div className={styles.statusHeaderRow}>
                    <h3 className={styles.widgetTitle}>{t.taskStatus}</h3>
                    <div className={`${styles.statusBadgePill} ${statusToneClass}`}>
                      <span className={styles.statusDot} />
                      {task.status ? task.status.replace("_", " ").toUpperCase() : "OPEN"}
                    </div>
                  </div>

                  <div className={styles.statusStatsGrid}>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>{t.proposalsCount}</span>
                      <strong className={styles.statValue}>{task.bids_count || (task.bids || []).length || 0}</strong>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>{t.viewsCount}</span>
                      <strong className={styles.statValue}>{task.views_count || task.views || 1}</strong>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>{t.interviewsCount}</span>
                      <strong className={styles.statValue}>{task.interviews_count || (task.bids || []).length || 0}</strong>
                    </div>
                  </div>

                  <div className={styles.widgetActions}>
                    {hasAcceptedBid ? (
                      <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primaryActionButton}>
                        <iconify-icon icon="lucide:check-circle" />
                        {t.viewAccepted}
                      </Link>
                    ) : visibleBids.length > 0 ? (
                      <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.primaryActionButton}>
                        <iconify-icon icon="lucide:users" />
                        {t.reviewProposals}
                      </Link>
                    ) : null}

                    {task.status === "in_progress" && (
                      <button
                        type="button"
                        className={styles.primaryActionButton}
                        disabled={acting === "complete"}
                        onClick={handleComplete}
                      >
                        <iconify-icon icon="lucide:check" />
                        {acting === "complete" ? t.completing : t.markComplete}
                      </button>
                    )}

                    {task.status === "completed" && task.has_escrow && (
                      <button
                        type="button"
                        className={styles.escrowReleaseButton}
                        disabled={acting === "release"}
                        onClick={handleReleaseEscrow}
                      >
                        <iconify-icon icon="lucide:shield-check" />
                        {acting === "release" ? t.releasing : t.releaseEscrow}
                      </button>
                    )}

                    {["open", "draft", "in_progress"].includes(task.status) && (
                      <button
                        type="button"
                        className={styles.cancelTaskButton}
                        disabled={acting === "cancel"}
                        onClick={handleCancel}
                      >
                        <iconify-icon icon="lucide:x-circle" />
                        {acting === "cancel" ? t.cancelling : t.cancelTask}
                      </button>
                    )}

                    {actionError && <p className={styles.errorText}>{actionError}</p>}
                  </div>
                </section>

                {/* About Client Widget */}
                <section className={styles.card}>
                  <h3 className={styles.widgetTitle}>{t.aboutClient}</h3>
                  <div className={styles.clientProfileBox}>
                    <div className={styles.clientAvatarBig}>
                      {clientInfo.initials}
                    </div>
                    <div className={styles.clientDetails}>
                      <strong className={styles.clientName}>{clientInfo.name}</strong>
                      <div className={styles.clientBadgeRow}>
                        <span className={styles.clientRatingPill}>{clientInfo.rating}</span>
                        {clientInfo.isVerified && (
                          <span className={styles.verifiedClientTag}>
                            <iconify-icon icon="lucide:shield-check" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.clientStatsList}>
                    <div className={styles.clientStatRow}>
                      <span><iconify-icon icon="lucide:map-pin" /> {t.location}</span>
                      <strong>{clientInfo.location}</strong>
                    </div>
                    <div className={styles.clientStatRow}>
                      <span><iconify-icon icon="lucide:check-circle-2" /> {t.tasksPosted}</span>
                      <strong>{clientInfo.tasksPosted}</strong>
                    </div>
                    <div className={styles.clientStatRow}>
                      <span><iconify-icon icon="lucide:shield-alert" /> {t.totalSpent}</span>
                      <strong style={{ color: "#16a34a" }}>100% Escrow Backed</strong>
                    </div>
                    <div className={styles.clientStatRow}>
                      <span><iconify-icon icon="lucide:calendar" /> {t.memberSince}</span>
                      <strong>{clientInfo.memberSince}</strong>
                    </div>
                  </div>
                </section>

                {/* Similar Tasks Widget */}
                <section className={styles.card}>
                  <h3 className={styles.widgetTitle}>{t.similarTasks}</h3>
                  <div className={styles.similarList}>
                    {(task.similar_tasks || task.similarTasks || []).length > 0 ? (
                      (task.similar_tasks || task.similarTasks || []).map((similar: any) => (
                        <article key={similar.id} className={styles.similarTaskCard}>
                          <strong className={styles.similarTitle}>{similar.title}</strong>
                          <div className={styles.similarMeta}>
                            <span>💰 {similar.budget || similar.budget_min || "Negotiable"}</span>
                            <span>📍 {similar.location || similar.city || "Cotonou"}</span>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className={styles.emptySimilarState}>
                        <iconify-icon icon="lucide:layers" />
                        <p>Browse more opportunities in {categoryName}.</p>
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/client/tasks" className={styles.viewAllSimilarLink}>
                    {t.viewAllSimilar}
                    <iconify-icon icon="lucide:arrow-right" />
                  </Link>
                </section>
              </aside>
            </div>
          ) : null}
        </main>

        {/* Lightbox Modal for Attachment Previews */}
        {activeLightboxImage && (
          <div className={styles.lightboxOverlay} onClick={() => setActiveLightboxImage(null)}>
            <div className={styles.lightboxDialog} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setActiveLightboxImage(null)}
                aria-label="Close Preview"
              >
                <iconify-icon icon="lucide:x" />
              </button>
              <div className={styles.lightboxImgContainer}>
                <img
                  src={activeLightboxImage.url}
                  alt={activeLightboxImage.name}
                  className={styles.lightboxImg}
                />
              </div>
              <div className={styles.lightboxFooter}>
                <span>{activeLightboxImage.name}</span>
                <a
                  href={activeLightboxImage.url}
                  target="_blank"
                  rel="noreferrer"
                  download={activeLightboxImage.name}
                  className={styles.lightboxDownloadBtn}
                >
                  <iconify-icon icon="lucide:download" />
                  <span>Download Full Quality</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
