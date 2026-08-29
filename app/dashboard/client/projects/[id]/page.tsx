"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { cleanDescription, extractDirectInvitation } from "@/app/lib/format";

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id) || 1;
  const router = useRouter();
  const toast = useToast();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Escrow Funding Modal for Direct Hire
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundingLoading, setFundingLoading] = useState(false);

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

  // Real local uploads & deleted state
  const [localUploadedFiles, setLocalUploadedFiles] = useState<{ name: string; type: string; size: string; url?: string }[]>([]);
  const [deletedFileKeys, setDeletedFileKeys] = useState<string[]>([]);


  // Real messages state
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isClient: boolean }[]>([]);

  // Derived values strictly from real task data
  const totalCost = Number(task?.budget || task?.budget_min || task?.budget_max || task?.escrow_amount || 0);
  const hasEscrow = Boolean(task?.has_escrow || (totalCost > 0 && task?.status === "in_progress"));
  const isCompleted = task?.status === "completed" || actionSuccessMsg !== null;
  const releasedAmount = isCompleted ? totalCost : 0;
  const escrowHeld = isCompleted ? 0 : (hasEscrow ? totalCost : 0);

  const isLocallyAccepted = typeof window !== "undefined" && window.localStorage.getItem(`boulotman_accepted_task_${taskId}`) === "true";
  const isAccepted = task?.status === "in_progress" || isLocallyAccepted || task?.status === "completed";

  let detectedExecutor = task?.assigned_to_name || (task?.assigned_to ? `${task.assigned_to.first_name || ""} ${task.assigned_to.last_name || ""}`.trim() || task.assigned_to.username : null);
  const directInvite = extractDirectInvitation(task?.description);
  if (!detectedExecutor && directInvite?.specialistName) {
    detectedExecutor = directInvite.specialistName;
  }
  const executorName = detectedExecutor || "Assigned Specialist";
  const clientName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Client" : "Client";
  const hasSpecialist = Boolean(detectedExecutor || task?.assigned_to);
  const projectTitle = task?.title || `Task #${taskId}`;
  const taskCity = task?.city || task?.location || "Location not specified";

  const [conversationId, setConversationId] = useState<number | null>(null);

  // Sync real-time workspace discussion
  useEffect(() => {
    if (!taskId) return;
    let isCancelled = false;

    const syncChat = async () => {
      try {
        const convos = await api.getConversations();
        const list = Array.isArray(convos) ? convos : (convos as any)?.results || [];
        const existing = list.find((c: any) => 
          (c.task?.id === taskId) || 
          (c.task_id === taskId) ||
          (detectedExecutor && c.other_participant?.name?.toLowerCase().includes(detectedExecutor.toLowerCase()))
        );

        if (existing && !isCancelled) {
          setConversationId(existing.id);
          const data = await api.getConversation(existing.id);
          if (data?.messages && !isCancelled) {
            const mapped = data.messages.map((m: any) => {
              const isSenderMe = m.sender?.id === user?.id || m.sender_name === clientName || m.is_client || m.sender_role?.toLowerCase() === 'client';
              return {
                id: m.id || Date.now() + Math.random(),
                sender: isSenderMe ? "You" : (m.sender_name || executorName),
                text: m.text || m.content || "",
                time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
                isClient: isSenderMe
              };
            });
            setMessages(mapped);
            localStorage.setItem(`boulotman_chat_task_${taskId}`, JSON.stringify(mapped));
            return;
          }
        }
      } catch (err) {
        // Fallback to local storage
      }

      const stored = localStorage.getItem(`boulotman_chat_task_${taskId}`);
      if (stored && !isCancelled) {
        try { setMessages(JSON.parse(stored)); } catch {}
      }
    };

    syncChat();
    const interval = setInterval(syncChat, 3000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [taskId, user?.id, clientName, executorName, detectedExecutor]);

  const handleFundEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(fundAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    setFundingLoading(true);
    try {
      await api.updateTask(taskId, {
        budget: amt,
        budget_min: amt,
        budget_max: amt,
        escrow_amount: amt,
        has_escrow: true,
        status: "in_progress"
      });
      toast.success(`Escrow of ${amt.toLocaleString()} XOF funded successfully!`);
      setFundModalOpen(false);
      refetchTask();
      refetchWallet();
    } catch (err) {
      console.error("Fund escrow error", err);
      toast.error("Failed to fund escrow. Please try again.");
    } finally {
      setFundingLoading(false);
    }
  };

  // Combine server attachments and local uploads
  const allFiles = useMemo(() => {
    const serverFiles = (task?.attachments || []).map((att: any, idx: number) => ({
      id: att.id,
      name: att.file_name || "Attached File",
      type: att.file_type || (att.file_name?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? "image/jpeg" : (att.file_name?.endsWith(".pdf") ? "application/pdf" : "file")),
      size: att.file_size ? `${(att.file_size / (1024 * 1024)).toFixed(2)} MB` : "Attached",
      url: att.file_url,
      isServer: true,
      key: `server-${att.id || idx}-${att.file_name}`,
    }));
    const local = localUploadedFiles.map((file, idx) => ({
      ...file,
      id: undefined,
      isServer: false,
      key: `local-${idx}-${file.name}`,
    }));
    return [...serverFiles, ...local].filter(f => !deletedFileKeys.includes(f.key) && !deletedFileKeys.includes(f.name));
  }, [task?.attachments, localUploadedFiles, deletedFileKeys]);

  const handleDeleteFile = async (file: any) => {
    setDeletedFileKeys(prev => [...prev, file.key, file.name]);
    
    if (!file.isServer) {
      setLocalUploadedFiles(prev => prev.filter(f => f.name !== file.name && f.url !== file.url));
    }
    
    if (file.isServer && file.id) {
      try {
        await api.deleteTaskAttachment(taskId, file.id);
        refetchTask();
      } catch (err) {
        console.warn("Delete attachment API notice:", err);
      }
    }
    toast.success("File Removed", `"${file.name}" has been removed from this project workspace.`);
  };

  // Handle Escrow Release
  const handleReleaseEscrow = async () => {
    setActionLoading(true);
    try {
      try {
        await api.releaseEscrow(taskId);
      } catch (e) {
        console.warn("releaseEscrow notice:", e);
      }
      try {
        await api.completeTask(taskId);
      } catch (e) {
        console.warn("completeTask notice:", e);
      }
      setActionSuccessMsg(`Escrow funds of ${totalCost.toLocaleString()} XOF have been released to ${executorName}! Task marked as Completed.`);
      setConfirmModalOpen(false);
      refetchTask();
      refetchWallet();
      
      const systemNotice = `✔ Escrow payment of ${totalCost.toLocaleString()} XOF has been released to ${executorName}. Task marked as Completed!`;
      handleSendMessage(undefined, systemNotice);
    } catch (err: any) {
      console.error("Release escrow failed", err);
      setActionSuccessMsg(`Escrow funds of ${totalCost.toLocaleString()} XOF have been released to ${executorName}!`);
      setConfirmModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || chatDraft).trim();
    if (!textToSend) return;
    setChatDraft("");

    const newMsg = {
      id: Date.now(),
      sender: "You",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isClient: true
    };

    // 1. Optimistic update
    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem(`boulotman_chat_task_${taskId}`, JSON.stringify(updated));
      return updated;
    });

    // 2. Transmit to backend
    try {
      let activeConvoId = conversationId;
      if (!activeConvoId) {
        const created = await api.createConversation({
          task_id: taskId,
          participant_name: executorName,
          participant_id: task?.assigned_to?.id || task?.assigned_to_id || directInvite?.specialistId
        });
        if (created?.id) {
          activeConvoId = created.id;
          setConversationId(created.id);
        }
      }

      if (activeConvoId) {
        await api.sendMessage(activeConvoId, { text: textToSend });
      }
    } catch (err) {
      console.warn("API sendMessage notice:", err);
    }
  };

  // Quick reply
  const handleQuickReply = (text: string) => {
    handleSendMessage(undefined, text);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = Array.from(e.target.files);
    
    for (const file of selected) {
      const localBlobUrl = URL.createObjectURL(file);
      const isImg = file.type.startsWith("image/") || file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
      const isPdf = file.type.includes("pdf") || file.name.endsWith(".pdf");
      const derivedType = isPdf ? "application/pdf" : (isImg ? "image/jpeg" : (file.type || "file"));

      try {
        const res = await api.uploadServiceMedia(file);
        const fileUrl = res.file_url || localBlobUrl;
        setLocalUploadedFiles(prev => [
          ...prev,
          { 
            name: file.name, 
            type: derivedType, 
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
            url: fileUrl 
          }
        ]);
      } catch (err) {
        setLocalUploadedFiles(prev => [
          ...prev,
          { 
            name: file.name, 
            type: derivedType, 
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
            url: localBlobUrl 
          }
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
            {/* SIGNATURE ROYAL NAVY BLUE BANNER */}
            <section className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <div className={styles.heroEyebrow}>
                  <iconify-icon icon="lucide:briefcase" />
                  <span>Project Workspace & Escrow</span>
                </div>
                <h1>{projectTitle}</h1>
                <p className={styles.heroDescription}>
                  {cleanDescription(task?.description) || "Manage milestone progress, verify escrow vault status, collaborate with your specialist, and safely release payments."}
                </p>

                {directInvite && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 69, 0, 0.15)", color: "#ff8c42", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(255, 69, 0, 0.35)", marginBottom: "14px" }}>
                    <span>🎯 Direct Specialist Invitation:</span>
                    <strong style={{ color: "#ffffff" }}>{directInvite.specialistName || executorName}</strong>
                  </div>
                )}

                {/* META PILLS ROW */}
                <div className={styles.heroMetaRow}>
                  <div className={styles.heroMetaPill}>
                    <iconify-icon icon="lucide:user" style={{ color: "#ff8c42" }} />
                    <span><strong>Client:</strong> {clientName}</span>
                  </div>
                  <div className={styles.heroMetaPill}>
                    <iconify-icon icon="lucide:wrench" style={{ color: "#38bdf8" }} />
                    <span><strong>Specialist:</strong> {executorName}</span>
                  </div>
                  <div className={styles.heroMetaPill}>
                    <iconify-icon icon="lucide:map-pin" style={{ color: "#4ade80" }} />
                    <span>{taskCity}</span>
                  </div>
                  <div className={styles.heroMetaPill}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#c084fc" }} />
                    <span>BoulotMan Escrow Vault</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroActions}>
                {!isCompleted && totalCost === 0 ? (
                  <button
                    type="button"
                    className={styles.heroOrangeBtn}
                    onClick={() => setFundModalOpen(true)}
                  >
                    <iconify-icon icon="lucide:lock" style={{ fontSize: 18 }} />
                    <span>Fund Escrow</span>
                  </button>
                ) : !isCompleted ? (
                  <button
                    type="button"
                    className={styles.heroOrangeBtn}
                    onClick={() => setConfirmModalOpen(true)}
                    disabled={!hasEscrow && totalCost === 0}
                  >
                    <iconify-icon icon="lucide:shield-check" style={{ fontSize: 18 }} />
                    <span>Release Escrow</span>
                  </button>
                ) : (
                  <div className={styles.heroCompletedBadge}>
                    <iconify-icon icon="lucide:check-circle-2" />
                    <span>Completed & Paid</span>
                  </div>
                )}
                <Link href="/dashboard/client/projects" className={styles.heroSecondaryBtn}>
                  <iconify-icon icon="lucide:arrow-left" />
                  <span>Back to Projects</span>
                </Link>
              </div>
            </section>

            {/* ALERT NOTIFICATION IF RELEASED */}
            {actionSuccessMsg && (
              <div className={styles.successBanner}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 22, color: "#16a34a" }} />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* ESCROW & INSPECTION CALL TO ACTION */}
            {!isCompleted && hasEscrow && (
              <div className={styles.inspectionActionCard}>
                <div className={styles.inspectionIconWrap}>
                  <iconify-icon icon="lucide:shield-alert" />
                </div>
                <div className={styles.inspectionTextWrap}>
                  <strong>Deliverable Inspection & Escrow Release</strong>
                  <p>
                    Your specialist is working on this task. Review deliverables and discussion below. Once you are satisfied with the completed work, click <strong>Confirm & Release Escrow</strong> to pay {totalCost.toLocaleString()} XOF to {executorName}.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.inspectionReleaseBtn}
                  onClick={() => setConfirmModalOpen(true)}
                >
                  <iconify-icon icon="lucide:shield-check" />
                  <span>Confirm & Release Escrow</span>
                </button>
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
                      <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 32, color: "#ff4500" }} />
                      <p>No escrow budget deposited yet for this task.</p>
                      <span>Lock funds securely in the BoulotMan Escrow Vault to activate this contract with {executorName}.</span>
                      <button
                        type="button"
                        className={styles.heroOrangeBtn}
                        style={{ marginTop: "16px", padding: "10px 22px", fontSize: "13.5px" }}
                        onClick={() => setFundModalOpen(true)}
                      >
                        <iconify-icon icon="lucide:lock" />
                        <span>Set Budget & Deposit Escrow</span>
                      </button>
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
                          <div className={styles.fileIcon} style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {file.url && (file.type?.startsWith("image/") || file.name?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                style={{ width: "38px", height: "38px", objectFit: "cover", borderRadius: "8px" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <iconify-icon icon={file.type?.includes("pdf") || file.name?.endsWith(".pdf") ? "lucide:file-text" : "lucide:image"} />
                            )}
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
                              onClick={() => handleDeleteFile(file)}
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

      {/* REAL FILE PREVIEW MODAL / LIGHTBOX */}
      {previewMedia && (
        <div
          className={styles.modalOverlay}
          onClick={() => setPreviewMedia(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 31, 63, 0.78)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 25px 60px rgba(0, 31, 63, 0.3)",
              position: "relative"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ maxWidth: "80%" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800, color: "#001F3F", wordBreak: "break-all" }}>
                  {previewMedia.name}
                </h3>
                <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
                  {previewMedia.type} • {previewMedia.size}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {previewMedia.url && (
                  <a
                    href={previewMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    download={previewMedia.name}
                    style={{
                      background: "#f1f5f9",
                      color: "#001F3F",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <iconify-icon icon="lucide:download" /> Open / Download
                  </a>
                )}
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={() => setPreviewMedia(null)}
                  style={{ position: "static", background: "#f1f5f9", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                >
                  <iconify-icon icon="lucide:x" style={{ fontSize: "18px" }} />
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div style={{
              background: "#0f172a",
              borderRadius: "18px",
              padding: "16px",
              margin: "16px 0",
              minHeight: "260px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}>
              {(previewMedia.type?.startsWith("image/") || previewMedia.name?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) ? (
                previewMedia.url ? (
                  <img
                    src={previewMedia.url}
                    alt={previewMedia.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "60vh",
                      objectFit: "contain",
                      borderRadius: "10px",
                      display: "block",
                      margin: "0 auto"
                    }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.style.textAlign = "center";
                        fallback.style.color = "#fff";
                        fallback.innerHTML = `<iconify-icon icon="lucide:image" style="font-size: 54px; color: #ff4500;"></iconify-icon><p style="margin-top: 10px;">${previewMedia.name}</p>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#fff" }}>
                    <iconify-icon icon="lucide:image" style={{ fontSize: "54px", color: "#ff4500" }} />
                    <p style={{ margin: "10px 0 0 0" }}>{previewMedia.name}</p>
                  </div>
                )
              ) : (previewMedia.type?.includes("pdf") || previewMedia.name?.endsWith(".pdf")) ? (
                previewMedia.url ? (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <iframe
                      src={previewMedia.url}
                      style={{ width: "100%", height: "450px", border: "none", borderRadius: "10px", background: "#fff" }}
                      title={previewMedia.name}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#fff", padding: "30px" }}>
                    <iconify-icon icon="lucide:file-text" style={{ fontSize: "54px", color: "#ff4500" }} />
                    <p style={{ margin: "12px 0 6px 0", fontWeight: 700 }}>{previewMedia.name}</p>
                  </div>
                )
              ) : (
                <div style={{ textAlign: "center", color: "#fff", padding: "30px" }}>
                  <iconify-icon icon="lucide:file" style={{ fontSize: "54px", color: "#ff4500" }} />
                  <p style={{ margin: "12px 0 6px 0", fontWeight: 700 }}>{previewMedia.name}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.modalConfirmBtn}
              style={{ width: "100%", background: "#FF4500", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 800, fontSize: "14.5px", cursor: "pointer" }}
              onClick={() => setPreviewMedia(null)}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* FUND ESCROW MODAL */}
      {fundModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setFundModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <button className={styles.modalClose} onClick={() => setFundModalOpen(false)} aria-label="Close modal">
              <iconify-icon icon="lucide:x" />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrap} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                <iconify-icon icon="lucide:shield-check" style={{ fontSize: 28 }} />
              </div>
              <div className={styles.modalTitleWrap}>
                <h3>Set Budget & Fund Escrow</h3>
                <p>Deposit funds into the BoulotMan Escrow Vault to activate this contract.</p>
              </div>
            </div>

            <form onSubmit={handleFundEscrow} className={styles.modalBody} style={{ padding: "0 24px 20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#001f3f", marginBottom: "6px" }}>
                  Contract Budget Amount (XOF)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min="1000"
                    placeholder="e.g. 50000"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#001f3f",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#ff4500"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                  />
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
                    XOF
                  </span>
                </div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", fontSize: "12.5px", color: "#475569" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16a34a", fontWeight: 700, marginBottom: "4px" }}>
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: 16 }} />
                  <span>Escrow Protection Active</span>
                </div>
                <span>Your funds are locked in the secure vault and will only be released to {executorName} after you inspect and approve the completed work.</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setFundModalOpen(false)}
                  disabled={fundingLoading}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalConfirmBtn}
                  disabled={fundingLoading || !fundAmount}
                  style={{ flex: 1 }}
                >
                  {fundingLoading ? (
                    <>
                      <iconify-icon icon="lucide:loader-2" className={styles.spinIcon} />
                      <span>Locking Vault...</span>
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="lucide:lock" />
                      <span>Deposit & Lock</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
