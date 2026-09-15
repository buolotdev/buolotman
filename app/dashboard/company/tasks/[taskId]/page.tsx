"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState, useEffect } from "react";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatTimeAgo, formatDateTime } from "@/app/lib/format";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    backToTasks: "← Back to Browse Tasks",
    openStatus: "Open for Proposals",
    inProgressStatus: "In Progress",
    completedStatus: "Completed",
    proposals: "Proposals",
    views: "Views",
    posted: "Posted",
    execution: "Execution",
    taskDescTitle: "Task Description & Commercial Scope",
    noDesc: "No detailed description provided by the client.",
    logisticsTitle: "Project Logistics & Execution Requirements",
    clientBudget: "Client Budget",
    schedule: "Schedule",
    location: "Location",
    escrowSecured: "100% Commercial Escrow Protection",
    escrowSub: "Secured milestone funds & guaranteed release upon delivery.",
    tradeSkills: "Required Trade Skills & Specializations",
    attachmentsTitle: "Attachments & Site Photos",
    previewAttachment: "Preview Attachment",
    submitProposal: "Submit Commercial Proposal",
    proposalSubmitted: "Proposal Already Submitted",
    viewMyQuotes: "View in Quotes & Proposals",
    messageClient: "Message Client Directly",
    saveTask: "Bookmark Task",
    saved: "Bookmarked",
    clientInfo: "Client Details",
    verifiedClient: "Verified Client",
    identityVerified: "Identity & Phone Verified",
    modalHeading: "Submit Commercial Proposal",
    proposedAmount: "Proposed Commercial Price (XOF) *",
    enterAmount: "Enter proposed price in XOF",
    coverPitch: "Commercial Proposal & Scope Pitch *",
    pitchPlaceholder: "Outline your company's team capabilities, certifications, methodology, timeline, and equipment...",
    submitting: "Submitting Proposal...",
    submitBtn: "Send Proposal to Client",
    proposalSuccess: "Commercial proposal submitted successfully!",
    taskNotFound: "Task offering not found or no longer active.",
  },
  fr: {
    backToTasks: "← Retour aux Offres de Mission",
    openStatus: "Ouvert aux Propositions",
    inProgressStatus: "En Cours d'Exécution",
    completedStatus: "Terminé",
    proposals: "Propositions",
    views: "Vues",
    posted: "Publié le",
    execution: "Date d'exécution",
    taskDescTitle: "Description du Projet & Cahier des Charges",
    noDesc: "Aucune description détaillée renseignée par le client.",
    logisticsTitle: "Conditions d'Exécution & Logistique",
    clientBudget: "Budget Estimé",
    schedule: "Calendrier",
    location: "Localisation",
    escrowSecured: "Garantie sous Séquestre à 100%",
    escrowSub: "Fonds bloqués et débloqués à la validation des jalons.",
    tradeSkills: "Compétences & Métiers Requis",
    attachmentsTitle: "Pièces Jointes & Photos du Chantier",
    previewAttachment: "Aperçu de la pièce",
    submitProposal: "Soumettre une Proposition Commerciale",
    proposalSubmitted: "Offre déjà transmise",
    viewMyQuotes: "Consulter dans Devis & Offres",
    messageClient: "Contacter Directement le Client",
    saveTask: "Sauvegarder l'Offre",
    saved: "Sauvegardée",
    clientInfo: "Informations Client",
    verifiedClient: "Client Vérifié",
    identityVerified: "Identité et Téléphone Vérifiés",
    modalHeading: "Soumettre une Proposition Commerciale",
    proposedAmount: "Tarif Commercial Proposé (XOF) *",
    enterAmount: "Saisissez le montant en XOF",
    coverPitch: "Offre Commerciale & Méthodologie *",
    pitchPlaceholder: "Présentez l'expertise de votre entreprise, outillage, équipe mobilisée, délais et garanties...",
    submitting: "Envoi de la proposition...",
    submitBtn: "Envoyer l'Offre au Client",
    proposalSuccess: "Votre proposition commerciale a été transmise avec succès !",
    taskNotFound: "Cette offre de mission est introuvable ou n'est plus active.",
  }
};

export default function CompanyTaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const toast = useToast();
  const dialog = useDialog();

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

  const [saved, setSaved] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("buolotman_saved_tasks");
        if (raw) {
          const ids = JSON.parse(raw);
          return ids.includes(String(taskId));
        }
      } catch {}
    }
    return false;
  });

  const [messaging, setMessaging] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; name: string; isImage?: boolean } | null>(null);
  const [lightboxError, setLightboxError] = useState(false);

  // Proposal modal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposedAmount, setProposedAmount] = useState("");
  const [proposedMessage, setProposedMessage] = useState("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const toggleSaved = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("buolotman_saved_tasks");
        let ids = raw ? JSON.parse(raw) : [];
        if (nextSaved) {
          if (!ids.includes(String(taskId))) ids.push(String(taskId));
        } else {
          ids = ids.filter((id: string) => id !== String(taskId));
        }
        localStorage.setItem("buolotman_saved_tasks", JSON.stringify(ids));
        toast.info(nextSaved ? "Task Bookmarked" : "Task Unsaved", nextSaved ? "Saved to company bookmarks." : "Removed from bookmarks.");
      } catch {}
    }
  };

  const { data: task, loading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: myBids, refetch: refetchMyBids } = useFetch(() => api.getMyBids(), []);

  const activeBid = useMemo(() => {
    const bids = Array.isArray(myBids) ? myBids : (myBids as any)?.results ?? [];
    return bids.find((bid: any) => String(bid.task_id ?? bid.taskId) === String(taskId) && bid.status !== "withdrawn") || null;
  }, [myBids, taskId]);

  const handleOpenProposal = () => {
    if (task) {
      setProposedAmount(task.budget_max ? String(task.budget_max) : task.budget_min ? String(task.budget_min) : "");
      setProposedMessage("");
      setProposalError(null);
      setShowProposalModal(true);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    if (!proposedAmount || Number(proposedAmount) <= 0) {
      setProposalError("Please enter a valid proposal price.");
      return;
    }

    setIsSubmittingProposal(true);
    setProposalError(null);

    try {
      await api.submitBid(task.id, {
        amount: parseFloat(proposedAmount),
        message: proposedMessage.trim(),
      });
      toast.success(t.proposalSuccess, `Bid of ${Number(proposedAmount).toLocaleString()} XOF placed`);
      setShowProposalModal(false);
      refetchMyBids();
    } catch (err: any) {
      setProposalError(err.message || "Failed to submit proposal. Your company may have already submitted an offer.");
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.content}>
        <SkeletonBlock style={{ width: "100%", height: 220, borderRadius: 24, marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
          <SkeletonBlock style={{ height: 420, borderRadius: 20 }} />
          <SkeletonBlock style={{ height: 420, borderRadius: 20 }} />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.content}>
        <Link href="/dashboard/company/tasks" className={styles.backLink} style={{ color: "#001f3f", fontSize: 14 }}>
          {t.backToTasks}
        </Link>
        <div style={{ padding: 60, textAlign: "center", color: "#64748b", background: "#ffffff", borderRadius: 20, border: "1px solid #e2e8f0" }}>
          <iconify-icon icon="lucide:search-x" style={{ fontSize: 44, color: "#94a3b8", display: "inline-block", marginBottom: 12 }} />
          <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{t.taskNotFound}</p>
        </div>
      </div>
    );
  }

  const categoryName = task.category_name || task.category || "General Services";
  const locationLabel = task.location_name || task.city || task.location || "On-Site Location";
  const scheduleDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : task.schedule || "Flexible";
  const postedDate = task.created_at
    ? `${formatDateTime(task.created_at, lang)} (${formatTimeAgo(task.created_at, lang)})`
    : "Recently";

  return (
    <div className={styles.content}>
      {/* ==================== SIGNATURE BLUE HERO BANNER ==================== */}
      <section className={styles.taskHeroBanner}>
        <Link href="/dashboard/company/tasks" className={styles.backLink}>
          {t.backToTasks}
        </Link>

        <div className={styles.heroCategoryRow}>
          <span className={styles.heroCategoryPill}>
            <iconify-icon icon="lucide:layers" />
            {categoryName}
          </span>
          {task.urgency === "urgent" && (
            <span className={styles.heroUrgentPill}>
              <iconify-icon icon="lucide:zap" /> Urgent
            </span>
          )}
          <span className={styles.heroStatusPill}>
            <iconify-icon icon="lucide:check-circle-2" />
            {task.status === "open" ? t.openStatus : task.status === "in_progress" ? t.inProgressStatus : t.completedStatus}
          </span>
        </div>

        <h1 className={styles.heroTitle}>{task.title}</h1>

        <div className={styles.heroMetaRow}>
          <span className={styles.heroMetaItem}>
            <iconify-icon icon="lucide:map-pin" style={{ color: "#38bdf8" }} />
            {locationLabel}
          </span>
          <span className={styles.heroMetaItem}>
            <iconify-icon icon="lucide:calendar" style={{ color: "#38bdf8" }} />
            {t.execution}: {scheduleDate}
          </span>
          <span className={styles.heroMetaItem}>
            <iconify-icon icon="lucide:clock" style={{ color: "#38bdf8" }} />
            {t.posted}: {postedDate}
          </span>
          <span className={styles.heroMetaItem}>
            <iconify-icon icon="lucide:users" style={{ color: "#38bdf8" }} />
            {task.bids_count || 0} {t.proposals}
          </span>
          {task.views_count !== undefined && (
            <span className={styles.heroMetaItem}>
              <iconify-icon icon="lucide:eye" style={{ color: "#38bdf8" }} />
              {task.views_count} {t.views}
            </span>
          )}
        </div>
      </section>

      {/* ==================== TWO COLUMN MAIN GRID ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 24, alignItems: "start" }}>
        
        {/* LEFT COLUMN: DETAILS & REQUIREMENTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          
          {/* TASK DESCRIPTION CARD */}
          <section className={styles.detailCard}>
            <h2 className={styles.cardTitle}>
              <iconify-icon icon="lucide:file-text" style={{ color: "#ff4500", marginRight: 8, fontSize: 22 }} />
              {t.taskDescTitle}
            </h2>

            <div style={{ fontSize: 15, lineHeight: 1.75, color: "#334155" }}>
              {task.description ? (
                <p style={{ whiteSpace: "pre-line", margin: 0 }}>{task.description}</p>
              ) : (
                <p style={{ fontStyle: "italic", color: "#94a3b8" }}>{t.noDesc}</p>
              )}
            </div>
          </section>

          {/* PROJECT LOGISTICS & REQUIREMENTS */}
          <section className={styles.detailCard}>
            <h2 className={styles.cardTitle}>
              <iconify-icon icon="lucide:clipboard-check" style={{ color: "#001f3f", marginRight: 8, fontSize: 22 }} />
              {t.logisticsTitle}
            </h2>

            <div className={styles.logisticsGrid}>
              <div className={styles.logisticsItem}>
                <div className={styles.logisticsIcon}><iconify-icon icon="lucide:coins" style={{ color: "#f59e0b" }} /></div>
                <div>
                  <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    {t.clientBudget}
                  </small>
                  <strong style={{ fontSize: 14.5, color: "#001f3f" }}>
                    {task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "Custom Scope"}
                  </strong>
                </div>
              </div>

              <div className={styles.logisticsItem}>
                <div className={styles.logisticsIcon}><iconify-icon icon="lucide:calendar" style={{ color: "#0284c7" }} /></div>
                <div>
                  <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    {t.schedule}
                  </small>
                  <strong style={{ fontSize: 14.5, color: "#001f3f" }}>{scheduleDate}</strong>
                </div>
              </div>

              <div className={styles.logisticsItem}>
                <div className={styles.logisticsIcon}><iconify-icon icon="lucide:map-pin" style={{ color: "#8b5cf6" }} /></div>
                <div>
                  <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    {t.location}
                  </small>
                  <strong style={{ fontSize: 14.5, color: "#001f3f" }}>{locationLabel}</strong>
                </div>
              </div>

              <div className={styles.logisticsItem} style={{ border: "1.5px solid #bbf7d0", background: "#f0fdf4" }}>
                <div className={styles.logisticsIcon} style={{ color: "#16a34a", background: "#dcfce7" }}>
                  <iconify-icon icon="lucide:shield-check" />
                </div>
                <div>
                  <small style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
                    {t.escrowSecured}
                  </small>
                  <span style={{ fontSize: 12.5, color: "#166534", fontWeight: 600 }}>{t.escrowSub}</span>
                </div>
              </div>
            </div>
          </section>

          {/* REQUIRED SKILLS */}
          {((task.skills_list && task.skills_list.length > 0) || (task.skills_required && task.skills_required.length > 0) || (task.skills && task.skills.length > 0)) && (
            <section className={styles.detailCard}>
              <h2 className={styles.cardTitle}>
                <iconify-icon icon="lucide:wrench" style={{ color: "#001f3f", marginRight: 8, fontSize: 22 }} />
                {t.tradeSkills}
              </h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(task.skills_list && task.skills_list.length > 0 ? task.skills_list : (task.skills_required || task.skills || [])).map((tag: any) => (
                  <span key={String(tag)} className={styles.tag}>
                    <iconify-icon icon="lucide:check" style={{ color: "#16a34a", marginRight: 6 }} />
                    {typeof tag === "object" ? tag.name : (isNaN(Number(tag)) ? tag : `Skill #${tag}`)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ATTACHMENTS & PHOTOS */}
          {task.attachments && task.attachments.length > 0 && (
            <section className={styles.detailCard}>
              <h2 className={styles.cardTitle}>
                <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500", marginRight: 8, fontSize: 22 }} />
                {t.attachmentsTitle} ({task.attachments.length})
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {task.attachments.map((attachment: any, idx: number) => {
                  const rawUrl = attachment.file_url || attachment.file || attachment.url || "";
                  const fileUrl = getImageUrl(rawUrl);
                  const fileName = attachment.file_name || attachment.name || `Attachment #${idx + 1}`;
                  const isImage = attachment.content_type?.includes("image") || attachment.file_type === "image" || fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setLightboxError(false);
                        setActiveLightboxImage({ url: fileUrl, name: fileName, isImage: Boolean(isImage) });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1.5px solid #e2e8f0",
                        backgroundColor: "#f8fafc",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        overflow: "hidden",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: isImage ? "rgba(255, 69, 0, 0.1)" : "rgba(14, 165, 233, 0.1)",
                        color: isImage ? "#ff4500" : "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                        position: "relative"
                      }}>
                        {isImage && fileUrl ? (
                          <>
                            <img
                              src={fileUrl}
                              alt={fileName}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = "none";
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                            <div style={{ display: "none", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "rgba(255, 69, 0, 0.1)" }}>
                              <iconify-icon icon="lucide:image" style={{ fontSize: 22, color: "#ff4500" }} />
                            </div>
                          </>
                        ) : (
                          <iconify-icon icon={isImage ? "lucide:image" : "lucide:file-text"} style={{ fontSize: 22 }} />
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: "block", fontSize: 13, color: "#001f3f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {fileName}
                        </strong>
                        <span style={{ fontSize: 11.5, color: "#ff4500", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <iconify-icon icon="lucide:maximize-2" style={{ fontSize: 11 }} /> {t.previewAttachment}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR: PROPOSAL ACTION & CLIENT INFO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 20 }}>
          
          {/* BUDGET & PROPOSAL CARD */}
          <section className={styles.sideCard}>
            <div className={styles.budgetBlock}>
              <small>{t.clientBudget}</small>
              <strong>
                {task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "Quote-based"}
              </strong>
              {task.budget_max && (
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  Max: {Number(task.budget_max).toLocaleString()} XOF
                </span>
              )}
            </div>

            {task.status === "open" && !activeBid && (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleOpenProposal}
                style={{ marginBottom: 12 }}
              >
                <iconify-icon icon="lucide:send" />
                <span>{t.submitProposal}</span>
              </button>
            )}

            {task.status === "open" && activeBid && (
              <div style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "14px",
                borderRadius: 12,
                textAlign: "center",
                fontWeight: 800,
                fontSize: 13.5,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}>
                <iconify-icon icon="lucide:check-circle-2" /> {t.proposalSubmitted}
              </div>
            )}

            {activeBid && (
              <Link href="/dashboard/company/quotes" className={styles.secondaryButton} style={{ marginBottom: 12 }}>
                <iconify-icon icon="lucide:file-text" />
                <span>{t.viewMyQuotes}</span>
              </Link>
            )}

            <button
              type="button"
              className={styles.secondaryButton}
              disabled={messaging || (!task.client && !task.id)}
              style={{ marginBottom: 12 }}
              onClick={async () => {
                setMessaging(true);
                try {
                  const clientId = typeof task.client === "object" ? (task.client?.id || task.client?.user_id) : task.client;
                  const convo = await api.createConversation({
                    participant_id: clientId ? Number(clientId) : undefined,
                    task_id: Number(task.id),
                    participant_name: task.client_name || undefined,
                  });
                  if (convo && convo.id) {
                    router.push(`/dashboard/company/messages?c=${convo.id}`);
                  } else {
                    router.push(`/dashboard/company/messages?name=${encodeURIComponent(task.client_name || "Client")}&task=${task.id}`);
                  }
                } catch (err) {
                  router.push(`/dashboard/company/messages?name=${encodeURIComponent(task.client_name || "Client")}&task=${task.id}`);
                } finally {
                  setMessaging(false);
                }
              }}
            >
              <iconify-icon icon="lucide:message-square" />
              <span>{messaging ? "Opening chat..." : t.messageClient}</span>
            </button>

            <button
              type="button"
              className={styles.outlineButton}
              onClick={toggleSaved}
            >
              <iconify-icon icon={saved ? "lucide:bookmark-check" : "lucide:bookmark"} style={{ color: saved ? "#ff4500" : "#64748b" }} />
              <span>{saved ? t.saved : t.saveTask}</span>
            </button>
          </section>

          {/* CLIENT VERIFICATION CARD */}
          <section className={styles.sideCard}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#001f3f", margin: "0 0 14px" }}>
              {t.clientInfo}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#001f3f",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 16
              }}>
                {task.client_initials || (task.client_name ? task.client_name[0].toUpperCase() : "C")}
              </div>
              <div>
                <strong style={{ fontSize: 15, color: "#001f3f", display: "block" }}>
                  {task.client_name || t.verifiedClient}
                </strong>
                <span style={{ fontSize: 12.5, color: "#16a34a", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  <iconify-icon icon="lucide:badge-check" /> {t.identityVerified}
                </span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Location:</span>
                <strong style={{ color: "#001f3f" }}>{task.city || task.location || "Remote"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Posted Tasks:</span>
                <strong style={{ color: "#001f3f" }}>Verified Client</strong>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ==================== COMMERCIAL PROPOSAL MODAL ==================== */}
      {showProposalModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProposalModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setShowProposalModal(false)} title="Close">
              <iconify-icon icon="lucide:x" />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#001f3f", margin: "0 0 6px" }}>
              {t.modalHeading}
            </h2>
            <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 13.5 }}>
              Offer commercial contract execution for: <strong>"{task.title}"</strong>
            </p>

            <form onSubmit={handleSubmitProposal} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", marginBottom: 6 }}>
                  {t.proposedAmount}
                </label>
                <input
                  type="number"
                  className={styles.modalInput}
                  placeholder={t.enterAmount}
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", marginBottom: 6 }}>
                  {t.coverPitch}
                </label>
                <textarea
                  rows={4}
                  className={styles.modalTextarea}
                  placeholder={t.pitchPlaceholder}
                  value={proposedMessage}
                  onChange={(e) => setProposedMessage(e.target.value)}
                  required
                />
              </div>

              {proposalError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecdd3", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                  {proposalError}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={isSubmittingProposal}
                  style={{ flex: 1 }}
                >
                  {isSubmittingProposal ? (
                    <><iconify-icon icon="lucide:loader" style={{ animation: "spin 1s linear infinite" }} /> {t.submitting}</>
                  ) : (
                    <><iconify-icon icon="lucide:send" /> {t.submitBtn}</>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.outlineButton}
                  onClick={() => setShowProposalModal(false)}
                  style={{ width: "auto", padding: "0 20px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== LIGHTBOX PREVIEW ==================== */}
      {activeLightboxImage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveLightboxImage(null)}
          style={{ zIndex: 10000, padding: 16 }}
        >
          <div
            style={{
              maxWidth: "92vw",
              maxHeight: "92vh",
              background: "#0f172a",
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: activeLightboxImage.isImage && !lightboxError ? "16px" : "32px 24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxImage(null)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 20,
                zIndex: 20,
                transition: "background 0.2s ease"
              }}
              title="Close Preview"
            >
              <iconify-icon icon="lucide:x" />
            </button>
            {activeLightboxImage.isImage && !lightboxError ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: "100%", maxHeight: "100%" }}>
                <img
                  src={activeLightboxImage.url}
                  alt={activeLightboxImage.name}
                  style={{ maxWidth: "86vw", maxHeight: "76vh", objectFit: "contain", borderRadius: 12 }}
                  onError={() => setLightboxError(true)}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0 8px", gap: 16, color: "#fff", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#e2e8f0" }}>{activeLightboxImage.name}</span>
                  {activeLightboxImage.url && (
                    <a
                      href={activeLightboxImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={activeLightboxImage.name}
                      style={{ color: "#ff8c42", fontSize: 13, fontWeight: 700, textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <iconify-icon icon="lucide:external-link" /> Open in New Tab ↗
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: "16px 12px", color: "#fff", textAlign: "center", maxWidth: 400 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 32
                }}>
                  <iconify-icon icon={activeLightboxImage.isImage ? "lucide:image" : "lucide:file-text"} />
                </div>
                <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#ffffff", wordBreak: "break-word" }}>{activeLightboxImage.name}</h4>
                <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
                  {activeLightboxImage.isImage
                    ? "Image attachment stored in cloud storage."
                    : "File attachment ready for preview or download."}
                </p>
                {activeLightboxImage.url && (
                  <a
                    href={activeLightboxImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={activeLightboxImage.name}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 22px",
                      background: "#ff4500",
                      color: "#fff",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13.5,
                      textDecoration: "none"
                    }}
                  >
                    <iconify-icon icon="lucide:external-link" /> Open in New Tab ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
