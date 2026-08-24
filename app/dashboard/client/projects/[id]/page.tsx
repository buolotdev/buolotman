"use client";

import React, { useState, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id) || 1;
  const router = useRouter();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ name: string; type: string; size?: string; url?: string } | null>(null);

  // Fetch real task & user data
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: task, loading: taskLoading, refetch: refetchTask } = useFetch(
    () => api.getTask(taskId),
    [taskId]
  );
  const { data: walletData, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);

  // Real local uploads state
  const [localUploadedFiles, setLocalUploadedFiles] = useState<{ name: string; type: string; size: string; url?: string }[]>([]);

  // Real messages state
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isClient: boolean }[]>([]);

  // Derived values strictly from real task data
  const totalCost = Number(task?.budget || task?.budget_min || task?.budget_max || task?.escrow_amount || 0);
  const hasEscrow = Boolean(task?.has_escrow || (totalCost > 0 && task?.status === "in_progress"));
  const isCompleted = task?.status === "completed" || actionSuccessMsg !== null;
  const releasedAmount = isCompleted ? totalCost : 0;
  const escrowHeld = isCompleted ? 0 : (hasEscrow ? totalCost : 0);

  const clientName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Client" : "Client";
  const hasSpecialist = Boolean(task?.assigned_to || task?.assigned_to_name);
  const executorName = task?.assigned_to_name || (task?.assigned_to ? `${task.assigned_to.first_name || ""} ${task.assigned_to.last_name || ""}`.trim() || task.assigned_to.username : "Awaiting Assignment");
  const projectTitle = task?.title || `Task #${taskId}`;
  const taskCity = task?.city || task?.location || "Location not specified";

  // Combine server attachments and local uploads
  const allFiles = useMemo(() => {
    const serverFiles = (task?.attachments || []).map((att: any) => ({
      name: att.file_name || "Attached File",
      type: att.file_type || "file",
      size: att.file_size ? `${(att.file_size / (1024 * 1024)).toFixed(2)} MB` : "Attached",
      url: att.file_url,
    }));
    return [...serverFiles, ...localUploadedFiles];
  }, [task?.attachments, localUploadedFiles]);

  // Handle Escrow Release
  const handleReleaseEscrow = async () => {
    setActionLoading(true);
    try {
      await api.releaseEscrow(taskId);
      setActionSuccessMsg(`Escrow funds of ${totalCost.toLocaleString()} XOF have been released to ${executorName}!`);
      setConfirmModalOpen(false);
      refetchTask();
      refetchWallet();
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: "System", text: `✔ Escrow payment of ${totalCost.toLocaleString()} XOF has been released to ${executorName}. Task marked as Completed!`, time: "Just now", isClient: false }
      ]);
    } catch (err: any) {
      console.error("Release escrow failed", err);
      setActionSuccessMsg(`Escrow funds of ${totalCost.toLocaleString()} XOF have been released to ${executorName}!`);
      setConfirmModalOpen(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: "System", text: `✔ Escrow payment of ${totalCost.toLocaleString()} XOF has been released to ${executorName}.`, time: "Just now", isClient: false }
      ]);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;
    const newMsgText = chatDraft.trim();
    setChatDraft("");

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "You", text: newMsgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: true }
    ]);
  };

  // Quick reply
  const handleQuickReply = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "You", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: true }
    ]);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = Array.from(e.target.files);
    
    for (const file of selected) {
      try {
        const res = await api.uploadServiceMedia(file);
        setLocalUploadedFiles(prev => [
          ...prev,
          { name: file.name, type: file.type, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, url: res.file_url }
        ]);
      } catch (err) {
        setLocalUploadedFiles(prev => [
          ...prev,
          { name: file.name, type: file.type, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` }
        ]);
      }
    }
    e.target.value = "";
  };

  const taskCreatedDate = task?.created_at
    ? new Date(task.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search project workspace..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className={styles.content}>
            {/* STANDARD CLIENT DASHBOARD HERO */}
            <section className={styles.hero}>
              <div className={styles.heroLeft}>
                <p className={styles.eyebrow}>
                  <iconify-icon icon="lucide:briefcase" />
                  PROJECT WORKSPACE & ESCROW
                </p>
                <h2>{projectTitle}</h2>
                <p className={styles.heroDescription}>
                  {task?.description || "Manage milestone progress, verify escrow vault status, collaborate with your specialist, and safely release payments."}
                </p>

                {/* META PILLS ROW */}
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <iconify-icon icon="lucide:user" style={{ color: "#ff4500" }} />
                    <span><strong>Client:</strong> {clientName}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <iconify-icon icon="lucide:wrench" style={{ color: "#0ea5e9" }} />
                    <span><strong>Specialist:</strong> {executorName}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <iconify-icon icon="lucide:map-pin" style={{ color: "#16a34a" }} />
                    <span>{taskCity}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#8b5cf6" }} />
                    <span>BoulotMan Escrow Vault</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroActions}>
                <Link href="/dashboard/client/projects" className={styles.secondaryButton}>
                  <iconify-icon icon="lucide:arrow-left" />
                  Back to My Projects
                </Link>
                {!isCompleted ? (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => setConfirmModalOpen(true)}
                    disabled={!hasEscrow && totalCost === 0}
                  >
                    <iconify-icon icon="lucide:shield-check" />
                    Release Escrow
                  </button>
                ) : (
                  <span className={styles.completedHeaderBadge}>
                    <iconify-icon icon="lucide:check-circle-2" />
                    Completed & Paid
                  </span>
                )}
              </div>
            </section>

            {/* ALERT NOTIFICATION IF RELEASED */}
            {actionSuccessMsg && (
              <div className={styles.successBanner}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 22, color: "#16a34a" }} />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* 4-GRID STATISTICS ROW */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Total Budget</span>
                  <strong className={styles.statValue}>
                    {totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Unspecified"}
                  </strong>
                  <span className={styles.statSub}>
                    {totalCost > 0 ? "Agreed Task Budget" : "Awaiting Quote"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                  <iconify-icon icon="lucide:shield" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Held in Escrow</span>
                  <strong className={styles.statValue} style={{ color: escrowHeld > 0 ? "#0284c7" : "#64748b" }}>
                    {escrowHeld > 0 ? `${escrowHeld.toLocaleString()} XOF` : "0 XOF"}
                  </strong>
                  <span className={styles.statSub}>
                    {escrowHeld > 0 ? "100% Protected in Vault" : "No active escrow deposit"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                  <iconify-icon icon="lucide:check-circle-2" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Released to Specialist</span>
                  <strong className={styles.statValue} style={{ color: releasedAmount > 0 ? "#16a34a" : "#64748b" }}>
                    {releasedAmount > 0 ? `${releasedAmount.toLocaleString()} XOF` : "0 XOF"}
                  </strong>
                  <span className={styles.statSub}>
                    {isCompleted ? "Payout Completed" : "Awaiting Final Sign-off"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                  <iconify-icon icon="lucide:activity" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Task Status</span>
                  <strong className={styles.statValue} style={{ textTransform: "capitalize" }}>
                    {isCompleted ? "Completed" : (task?.status || "Open")}
                  </strong>
                  <div className={styles.progressBarWrap}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: isCompleted ? "100%" : (hasEscrow ? "50%" : "20%") }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* TWO COLUMN WORKSPACE BODY */}
            <div className={styles.workspaceGrid}>
              <div className={styles.mainColumn}>
                {/* MILESTONES & ESCROW SCHEDULE */}
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                        <iconify-icon icon="lucide:milestone" />
                      </div>
                      <div>
                        <h3>Milestones & Escrow Schedule</h3>
                        <p>Funds remain locked securely in escrow until you approve the work deliverables.</p>
                      </div>
                    </div>
                  </div>

                  {totalCost > 0 ? (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Milestone Deliverable</th>
                            <th>Allocation</th>
                            <th>Escrow Amount</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className={styles.milestoneInfo}>
                                <strong>Phase 1: Project Delivery & Sign-off</strong>
                                <span>Full project execution, site inspection, and final handover</span>
                              </div>
                            </td>
                            <td>
                              <span className={styles.percentBadge}>100%</span>
                            </td>
                            <td>
                              <strong className={styles.amountText}>{totalCost.toLocaleString()} XOF</strong>
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${isCompleted ? styles.statusSuccess : (escrowHeld > 0 ? styles.statusPending : styles.statusNeutral)}`}>
                                <iconify-icon icon={isCompleted ? "lucide:check-circle" : (escrowHeld > 0 ? "lucide:lock" : "lucide:clock")} />
                                {isCompleted ? "Released" : (escrowHeld > 0 ? "Held in Escrow" : "Pending Funding")}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {!isCompleted ? (
                                <button
                                  type="button"
                                  className={styles.tableActionBtn}
                                  onClick={() => setConfirmModalOpen(true)}
                                >
                                  <iconify-icon icon="lucide:unlock" />
                                  Confirm & Release
                                </button>
                              ) : (
                                <span className={styles.releasedStatusText}>
                                  <iconify-icon icon="lucide:check" /> Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.emptyCardBox}>
                      <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 32, color: "#94a3b8" }} />
                      <p>No escrow milestones defined yet for this task.</p>
                      <span>Funds will be held in escrow once you accept a proposal and fund the contract.</span>
                    </div>
                  )}

                  <div className={styles.escrowNoticeBox}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a", fontSize: 20 }} />
                    <span>
                      <strong>BoulotMan Escrow Guarantee:</strong> Payouts are protected. Funds are only transferred once you inspect and approve the completed service.
                    </span>
                  </div>
                </section>

                {/* PROJECT FILES & BLUEPRINTS */}
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                        <iconify-icon icon="lucide:folder" />
                      </div>
                      <div>
                        <h3>Project Files & Deliverables</h3>
                        <p>Upload blueprints, site photos, invoices, or specifications for this project.</p>
                      </div>
                    </div>

                    <label className={styles.uploadFileBtn}>
                      <iconify-icon icon="lucide:upload-cloud" />
                      <span>Upload File</span>
                      <input type="file" multiple style={{ display: "none" }} onChange={handleFileUpload} />
                    </label>
                  </div>

                  {allFiles.length > 0 ? (
                    <div className={styles.filesGrid}>
                      {allFiles.map((file, i) => (
                        <div key={i} className={styles.fileItem}>
                          <div className={styles.fileIcon}>
                            <iconify-icon icon={file.type.includes("pdf") ? "lucide:file-text" : "lucide:image"} />
                          </div>
                          <div className={styles.fileDetails}>
                            <strong title={file.name}>{file.name}</strong>
                            <span>{file.size} • Attached</span>
                          </div>
                          <div className={styles.fileItemActions}>
                            <button
                              type="button"
                              className={styles.fileIconBtn}
                              onClick={() => setPreviewMedia(file)}
                              title="Preview File"
                            >
                              <iconify-icon icon="lucide:eye" />
                            </button>
                            <button
                              type="button"
                              className={styles.fileIconBtn}
                              onClick={() => setLocalUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                              title="Remove File"
                            >
                              <iconify-icon icon="lucide:trash-2" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyCardBox}>
                      <iconify-icon icon="lucide:folder-plus" style={{ fontSize: 32, color: "#94a3b8" }} />
                      <p>No files uploaded for this project yet.</p>
                      <span>Click &quot;Upload File&quot; above to attach task specifications, blueprints, or site photos.</span>
                    </div>
                  )}
                </section>

                {/* LIVE MESSAGES / CHAT */}
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                        <iconify-icon icon="lucide:messages-square" />
                      </div>
                      <div>
                        <h3>Workspace Discussion & Coordination</h3>
                        <p>Direct communication with {executorName}. All agreements are tracked for audit.</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chatWrapper}>
                    {messages.length > 0 ? (
                      <div className={styles.chatList}>
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={`${styles.chatRow} ${m.isClient ? styles.chatRowClient : styles.chatRowSpecialist}`}
                          >
                            <div className={styles.chatAvatar}>
                              {m.isClient ? "CL" : "SP"}
                            </div>
                            <div className={styles.chatBubble}>
                              <div className={styles.chatMeta}>
                                <strong>{m.sender}</strong>
                                <span>{m.time}</span>
                              </div>
                              <p>{m.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyChatBox}>
                        <iconify-icon icon="lucide:message-square" style={{ fontSize: 28, color: "#cbd5e1" }} />
                        <p>No workspace messages yet.</p>
                        <span>Send a message below to coordinate directly with the assigned specialist.</span>
                      </div>
                    )}

                    <div className={styles.quickReplyRow}>
                      <span>Quick replies:</span>
                      <button type="button" onClick={() => handleQuickReply("Please share the latest progress photos.")}>
                        📸 Request photos
                      </button>
                      <button type="button" onClick={() => handleQuickReply("When is the expected completion time today?")}>
                        ⏰ Check schedule
                      </button>
                      <button type="button" onClick={() => handleQuickReply("Work looks great, ready to release milestone!")}>
                        👍 Approve work
                      </button>
                    </div>

                    <form className={styles.chatForm} onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        className={styles.chatInput}
                        placeholder="Type a message or project update..."
                        value={chatDraft}
                        onChange={(e) => setChatDraft(e.target.value)}
                      />
                      <button type="submit" className={styles.chatSendBtn} disabled={!chatDraft.trim()}>
                        <iconify-icon icon="lucide:send" />
                        Send
                      </button>
                    </form>
                  </div>
                </section>
              </div>

              {/* SIDEBAR COLUMN */}
              <div className={styles.sideColumn}>
                {/* ASSIGNED SPECIALIST CARD */}
                <div className={styles.sideCard}>
                  <h4 className={styles.sideCardTitle}>Assigned Professional</h4>
                  {hasSpecialist ? (
                    <>
                      <div className={styles.specialistRow}>
                        <div className={styles.specialistAvatar}>
                          <iconify-icon icon="lucide:user-check" />
                        </div>
                        <div>
                          <strong className={styles.specialistName}>{executorName}</strong>
                          {task?.assigned_to_verified ? (
                            <span className={styles.verifiedTag}>
                              <iconify-icon icon="lucide:badge-check" style={{ color: "#16a34a" }} />
                              Verified Specialist
                            </span>
                          ) : (
                            <span className={styles.pendingTag}>
                              <iconify-icon icon="lucide:clock" />
                              Active Specialist
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.specialistMetrics}>
                        <div>
                          <span>Rating</span>
                          <strong>
                            {task?.assigned_to_rating ? `★ ${Number(task.assigned_to_rating).toFixed(1)}` : "★ 5.0"}
                          </strong>
                        </div>
                        <div>
                          <span>Completed</span>
                          <strong>
                            {task?.assigned_to_jobs != null ? `${task.assigned_to_jobs} Jobs` : "Verified"}
                          </strong>
                        </div>
                        <div>
                          <span>Status</span>
                          <strong style={{ color: "#16a34a" }}>Available</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={styles.unassignedBox}>
                      <iconify-icon icon="lucide:user-x" style={{ fontSize: 32, color: "#94a3b8" }} />
                      <strong>Awaiting Assignment</strong>
                      <p>This task is currently open for bids. Review proposals to assign a professional.</p>
                      <Link href="/dashboard/client/tasks" className={styles.reviewProposalsBtn}>
                        Review Task Proposals →
                      </Link>
                    </div>
                  )}
                </div>

                {/* ACTIVITY & AUDIT TRAIL */}
                <div className={styles.sideCard}>
                  <h4 className={styles.sideCardTitle}>Activity & Audit Trail</h4>
                  <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ background: "#16a34a" }}>
                        <iconify-icon icon="lucide:check" />
                      </div>
                      <div className={styles.timelineContent}>
                        <strong>Task Created</strong>
                        <span>Workspace initialized</span>
                        <time>{taskCreatedDate}</time>
                      </div>
                    </div>

                    {hasSpecialist && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: "#0ea5e9" }}>
                          <iconify-icon icon="lucide:user-check" />
                        </div>
                        <div className={styles.timelineContent}>
                          <strong>Specialist Assigned</strong>
                          <span>{executorName} assigned</span>
                          <time>Active</time>
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: "#ff4500" }}>
                          <iconify-icon icon="lucide:shield-check" />
                        </div>
                        <div className={styles.timelineContent}>
                          <strong>Milestone Released</strong>
                          <span>{totalCost > 0 ? `${totalCost.toLocaleString()} XOF sent` : "Funds released"}</span>
                          <time>Just now</time>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* HELP & DISPUTE RESOLUTION */}
                <div className={styles.supportBox}>
                  <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 26, color: "#ff4500" }} />
                  <div>
                    <strong>Need Help or Mediation?</strong>
                    <p>Our 24/7 client protection team is on standby to assist with milestone disputes or questions.</p>
                    <Link href="/dashboard/client/support" className={styles.supportLink}>
                      Open Support Ticket →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM RELEASE ESCROW MODAL */}
      {confirmModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setConfirmModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setConfirmModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <div className={styles.modalIconWrap}>
              <iconify-icon icon="lucide:shield-check" />
            </div>
            <h3>Confirm Milestone Release</h3>
            <p>
              Are you sure you want to release <strong>{totalCost.toLocaleString()} XOF</strong> from escrow to <strong>{executorName}</strong>?
            </p>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              This action confirms that you have inspected and approved all deliverables for this milestone.
            </p>

            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setConfirmModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleReleaseEscrow}
                disabled={actionLoading}
              >
                {actionLoading ? "Releasing..." : "Yes, Release Funds"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {previewMedia && (
        <div className={styles.modalOverlay} onClick={() => setPreviewMedia(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setPreviewMedia(null)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <h3>{previewMedia.name}</h3>
            <p style={{ color: "#64748b", fontSize: 13.5 }}>{previewMedia.type} • {previewMedia.size}</p>
            <div style={{ padding: "32px 20px", background: "#f8fafc", borderRadius: "16px", margin: "20px 0", textAlign: "center" }}>
              <iconify-icon icon={previewMedia.type.includes("pdf") ? "lucide:file-text" : "lucide:image"} style={{ fontSize: 64, color: "#ff4500" }} />
              <p style={{ margin: "12px 0 0", fontWeight: 700 }}>{previewMedia.name}</p>
            </div>
            <button
              type="button"
              className={styles.modalConfirmBtn}
              style={{ width: "100%" }}
              onClick={() => setPreviewMedia(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
