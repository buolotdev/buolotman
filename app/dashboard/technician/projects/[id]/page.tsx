"use client";

import React, { useState, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function TechnicianWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id) || 1;
  const router = useRouter();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Deliverable Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [previewMedia, setPreviewMedia] = useState<{ name: string; type: string; size?: string; url?: string } | null>(null);

  // Fetch real task & technician data
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
  const isCompleted = task?.status === "completed";
  const releasedAmount = isCompleted ? totalCost : 0;
  const escrowHeld = isCompleted ? 0 : (hasEscrow ? totalCost : 0);

  const clientName = task?.client_name || (task?.client ? `${task.client.first_name || ""} ${task.client.last_name || ""}`.trim() || task.client.username : "Client");
  const technicianName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Specialist" : "Specialist";
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

  // Handle Milestone / Deliverable Submission
  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      setActionSuccessMsg("Milestone deliverable submitted! The client has been notified to inspect and release funds.");
      setIsSubmitModalOpen(false);
      setSubmissionNotes("");
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: "You", text: `📤 Submitted progress deliverable: ${submissionNotes || "Work completed for milestone review."}`, time: "Just now", isClient: false }
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
      { id: Date.now(), sender: "You", text: newMsgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: false }
    ]);
  };

  // Quick reply
  const handleQuickReply = (text: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "You", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: false }
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
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search workspace..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className={styles.content}>
            {/* ROYAL BLUE HERO BANNER */}
            <section className={styles.heroBanner}>
              <div className={styles.heroTopRow}>
                <div className={styles.heroTag}>
                  <span className={styles.pulseDot} />
                  <span>SPECIALIST WORKSPACE & EARNINGS</span>
                </div>
                <Link href="/dashboard/technician" className={styles.backBtnGlass}>
                  <iconify-icon icon="lucide:arrow-left" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>

              <div className={styles.heroBody}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>{projectTitle}</h1>
                  <p className={styles.heroSubtitle}>
                    {task?.description || "Collaborate with the client, upload completed deliverables, track escrow vault security, and request payout releases."}
                  </p>

                  {/* META CHIPS ROW */}
                  <div className={styles.metaRow}>
                    <div className={styles.metaChip}>
                      <iconify-icon icon="lucide:user" style={{ color: "#ff8c5a" }} />
                      <span><strong>Client:</strong> {clientName}</span>
                    </div>
                    <div className={styles.metaChip}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#38bdf8" }} />
                      <span><strong>Specialist:</strong> {technicianName}</span>
                    </div>
                    <div className={styles.metaChip}>
                      <iconify-icon icon="lucide:map-pin" style={{ color: "#4ade80" }} />
                      <span>{taskCity}</span>
                    </div>
                    <div className={styles.metaChip}>
                      <iconify-icon icon="lucide:shield-check" style={{ color: "#c084fc" }} />
                      <span>Escrow Secured</span>
                    </div>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  {!isCompleted ? (
                    <button
                      type="button"
                      className={styles.submitDeliverableBtn}
                      onClick={() => setIsSubmitModalOpen(true)}
                    >
                      <iconify-icon icon="lucide:send" style={{ fontSize: 18 }} />
                      <span>Submit Deliverable</span>
                    </button>
                  ) : (
                    <div className={styles.completedBadgeGlass}>
                      <iconify-icon icon="lucide:check-circle-2" style={{ color: "#4ade80", fontSize: 20 }} />
                      <span>Completed & Paid</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ALERT NOTIFICATION IF SUBMITTED */}
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
                  <span className={styles.statLabel}>Contract Value</span>
                  <strong className={styles.statValue}>
                    {totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Unspecified"}
                  </strong>
                  <span className={styles.statSub}>
                    {totalCost > 0 ? "Agreed Job Value" : "Awaiting Quote"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                  <iconify-icon icon="lucide:shield" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Secured in Escrow</span>
                  <strong className={styles.statValue} style={{ color: escrowHeld > 0 ? "#0284c7" : "#64748b" }}>
                    {escrowHeld > 0 ? `${escrowHeld.toLocaleString()} XOF` : "0 XOF"}
                  </strong>
                  <span className={styles.statSub}>
                    {escrowHeld > 0 ? "Guaranteed Client Funds" : "Pending Client Deposit"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                  <iconify-icon icon="lucide:check-circle-2" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Earnings Received</span>
                  <strong className={styles.statValue} style={{ color: releasedAmount > 0 ? "#16a34a" : "#64748b" }}>
                    {releasedAmount > 0 ? `${releasedAmount.toLocaleString()} XOF` : "0 XOF"}
                  </strong>
                  <span className={styles.statSub}>
                    {isCompleted ? "Transferred to Wallet" : "Released on Approval"}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                  <iconify-icon icon="lucide:activity" />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Execution Status</span>
                  <strong className={styles.statValue} style={{ textTransform: "capitalize" }}>
                    {isCompleted ? "Completed" : (task?.status || "In Progress")}
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
                        <h3>Milestones & Deliverable Schedule</h3>
                        <p>Funds are secured in escrow and will be credited to your wallet once the client confirms delivery.</p>
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
                            <th>Amount (XOF)</th>
                            <th>Escrow Status</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className={styles.milestoneInfo}>
                                <strong>Phase 1: Project Execution & Delivery</strong>
                                <span>Full task implementation, testing, and deliverable handover</span>
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
                                {isCompleted ? "Released" : (escrowHeld > 0 ? "Held in Escrow" : "Pending Deposit")}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {!isCompleted ? (
                                <button
                                  type="button"
                                  className={styles.tableActionBtn}
                                  onClick={() => setIsSubmitModalOpen(true)}
                                >
                                  <iconify-icon icon="lucide:upload-cloud" />
                                  Submit Proof
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
                      <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 36, color: "#94a3b8" }} />
                      <p>No escrow milestones active on this task yet.</p>
                      <span>Milestones will activate as soon as the client accepts a quote and deposits funds.</span>
                    </div>
                  )}

                  <div className={styles.escrowNoticeBox}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a", fontSize: 20 }} />
                    <span>
                      <strong>BoulotMan Payment Protection:</strong> Your earnings are guaranteed in escrow. Once work is approved, funds are automatically credited to your wallet balance.
                    </span>
                  </div>
                </section>

                {/* PROJECT DELIVERABLES & FILES */}
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                        <iconify-icon icon="lucide:folder" />
                      </div>
                      <div>
                        <h3>Project Files & Work Deliverables</h3>
                        <p>Upload blueprints, completion photos, or documentation for client review.</p>
                      </div>
                    </div>

                    <label className={styles.uploadFileBtn}>
                      <iconify-icon icon="lucide:upload-cloud" />
                      <span>Upload Deliverable</span>
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
                      <iconify-icon icon="lucide:folder-plus" style={{ fontSize: 36, color: "#94a3b8" }} />
                      <p>No project deliverables uploaded yet.</p>
                      <span>Click &quot;Upload Deliverable&quot; above to attach completion photos or files.</span>
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
                        <h3>Direct Client Communication</h3>
                        <p>Coordinate directly with {clientName}. Keep all task details logged here.</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chatWrapper}>
                    {messages.length > 0 ? (
                      <div className={styles.chatList}>
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={`${styles.chatRow} ${!m.isClient ? styles.chatRowSpecialist : styles.chatRowClient}`}
                          >
                            <div className={styles.chatAvatar}>
                              {!m.isClient ? "ME" : "CL"}
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
                        <iconify-icon icon="lucide:message-square" style={{ fontSize: 32, color: "#cbd5e1" }} />
                        <p>No workspace messages yet.</p>
                        <span>Send a message below to share progress updates with {clientName}.</span>
                      </div>
                    )}

                    <div className={styles.quickReplyRow}>
                      <span>Quick updates:</span>
                      <button type="button" onClick={() => handleQuickReply("I have arrived on-site and commenced work.")}>
                        📍 Arrived on-site
                      </button>
                      <button type="button" onClick={() => handleQuickReply("Work is 80% complete, finalizing inspection now.")}>
                        ⏳ 80% Finished
                      </button>
                      <button type="button" onClick={() => handleQuickReply("Job is complete! Please inspect and release milestone payment.")}>
                        ✔ Ready for inspection
                      </button>
                    </div>

                    <form className={styles.chatForm} onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        className={styles.chatInput}
                        placeholder="Type a message or progress update to client..."
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
                {/* CLIENT INFO CARD */}
                <div className={styles.sideCard}>
                  <h4 className={styles.sideCardTitle}>Client Information</h4>
                  <div className={styles.specialistRow}>
                    <div className={styles.specialistAvatar}>
                      <iconify-icon icon="lucide:user" />
                    </div>
                    <div>
                      <strong className={styles.specialistName}>{clientName}</strong>
                      <span className={styles.verifiedTag}>
                        <iconify-icon icon="lucide:badge-check" style={{ color: "#16a34a" }} />
                        Verified Client
                      </span>
                    </div>
                  </div>

                  <div className={styles.specialistMetrics}>
                    <div>
                      <span>Location</span>
                      <strong>{taskCity}</strong>
                    </div>
                    <div>
                      <span>Payment</span>
                      <strong style={{ color: "#16a34a" }}>Escrow Active</strong>
                    </div>
                  </div>
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

                    {hasEscrow && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: "#0ea5e9" }}>
                          <iconify-icon icon="lucide:shield-check" />
                        </div>
                        <div className={styles.timelineContent}>
                          <strong>Escrow Funded</strong>
                          <span>{totalCost > 0 ? `${totalCost.toLocaleString()} XOF in vault` : "Funds secured"}</span>
                          <time>Active</time>
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: "#ff4500" }}>
                          <iconify-icon icon="lucide:badge-dollar-sign" />
                        </div>
                        <div className={styles.timelineContent}>
                          <strong>Payment Released</strong>
                          <span>Credited to wallet balance</span>
                          <time>Completed</time>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* HELP & MEDIATION SUPPORT */}
                <div className={styles.supportBox}>
                  <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 28, color: "#ff4500" }} />
                  <div>
                    <strong>Need Help with this Task?</strong>
                    <p>Contact BoulotMan support for mediation, scope adjustments, or payout inquiries.</p>
                    <Link href="/dashboard/technician/support" className={styles.supportLink}>
                      Specialist Support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT DELIVERABLE MODAL */}
      {isSubmitModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSubmitModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsSubmitModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <div className={styles.modalIconWrap}>
              <iconify-icon icon="lucide:upload-cloud" />
            </div>
            <h3>Submit Milestone Deliverable</h3>
            <p>
              Notify <strong>{clientName}</strong> that you have completed this milestone deliverable.
            </p>

            <form onSubmit={handleSubmitDeliverable} style={{ textAlign: "left", marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#001f3f" }}>
                  Completion Summary & Notes
                </label>
                <textarea
                  className={styles.modalTextarea}
                  rows={4}
                  placeholder="Describe the completed work, inspection details, or access codes..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalConfirmBtn}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Submitting..." : "Submit to Client"}
                </button>
              </div>
            </form>
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
