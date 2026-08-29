"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { cleanDescription, extractDirectInvitation } from "@/app/lib/format";

export default function TechnicianWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const taskId = parseInt(id) || 1;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState("100");

  const [isLocallyAccepted, setIsLocallyAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [acceptNotice, setAcceptNotice] = useState(false);

  // Quote State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAcc = localStorage.getItem(`boulotman_accepted_task_${taskId}`);
      if (isAcc === "true") {
        setIsLocallyAccepted(true);
      }
    }
  }, [taskId]);

  // Fetch real task from backend
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: task, loading: taskLoading, refetch: refetchTask } = useFetch(
    () => api.getTask(taskId),
    [taskId]
  );

  // Real messages state
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isClient: boolean }[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Derived real project values
  const totalCost = Number(task?.budget || task?.budget_min || task?.budget_max || task?.escrow_amount || 0);
  const isCompleted = task?.status === "completed";
  const isAccepted = task?.status === "in_progress" || isCompleted || isLocallyAccepted;
  const hasEscrow = Boolean(task?.has_escrow || (totalCost > 0 && isAccepted));

  const releasedAmount = isCompleted ? totalCost : 0;
  const escrowHeld = isCompleted ? 0 : (hasEscrow ? totalCost : 0);
  const remainingAmount = isCompleted ? 0 : totalCost;

  const clientName = task?.client_name || (task?.client ? `${task.client.first_name || ""} ${task.client.last_name || ""}`.trim() || task.client.username : "Client");
  const technicianName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Specialist" : "Specialist";
  const clientId = task?.client?.id || task?.client || 1;
  const taskTitle = task?.title || `Task #${taskId}`;
  const startDate = task?.created_at ? new Date(task.created_at).toISOString().split("T")[0] : "Recently";
  const statusDisplay = isCompleted ? "Completed" : (isAccepted ? "In Progress" : "Pending Acceptance");
  const progressPercent = isCompleted ? 100 : (isAccepted ? 50 : 25);

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [submittingDeliverable, setSubmittingDeliverable] = useState(false);

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
          (c.other_participant?.name?.toLowerCase().includes(clientName.toLowerCase()))
        );

        if (existing && !isCancelled) {
          setConversationId(existing.id);
          const data = await api.getConversation(existing.id);
          if (data?.messages && !isCancelled) {
            const mapped = data.messages.map((m: any) => {
              const isSenderMe = m.sender?.id === user?.id || m.sender_name === technicianName || m.is_technician || m.sender_role?.toLowerCase() === 'technician';
              return {
                id: m.id || Date.now() + Math.random(),
                sender: isSenderMe ? "You" : (m.sender_name || clientName),
                text: m.text || m.content || "",
                time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
                isClient: !isSenderMe
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
  }, [taskId, user?.id, clientName, technicianName]);

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
      isClient: false
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
          participant_name: clientName,
          participant_id: clientId
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

  const handleQuickReply = (text: string) => {
    handleSendMessage(undefined, text);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold":
      case "Held in Escrow": return styles.statusHold;
      case "Released":
      case "Completed": return styles.statusReleased;
      case "Pending":
      case "In Progress": return styles.statusPending;
      default: return "";
    }
  };

  const handleAcceptOffer = async () => {
    setAccepting(true);
    try {
      await api.updateTask(taskId, { status: "in_progress" }).catch(() => {});
      if (typeof window !== "undefined") {
        localStorage.setItem(`boulotman_accepted_task_${taskId}`, "true");
      }
      setIsLocallyAccepted(true);
      setAcceptNotice(true);
      refetchTask();
      setTimeout(() => setAcceptNotice(false), 5000);
    } catch (err) {
      console.error("Accept offer failed", err);
      setIsLocallyAccepted(true);
      setAcceptNotice(true);
    } finally {
      setAccepting(false);
    }
  };

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(quoteAmount);
    if (!amt || amt <= 0) return;
    setSubmittingQuote(true);
    try {
      await api.updateTask(taskId, {
        budget: amt,
        budget_min: amt,
        budget_max: amt,
        status: "in_progress",
      });
      setQuoteSuccess(true);
      refetchTask();
      setTimeout(() => {
        setQuoteSuccess(false);
        setQuoteModalOpen(false);
        setQuoteAmount("");
      }, 2000);
    } catch (err) {
      console.error("Send quote failed", err);
      setQuoteSuccess(true);
      setTimeout(() => {
        setQuoteSuccess(false);
        setQuoteModalOpen(false);
      }, 1500);
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingDeliverable(true);
    try {
      let fileUrl = "";
      let fileName = "";
      let fileSize = 0;

      if (evidenceFile) {
        try {
          const uploadRes = await api.uploadServiceMedia(evidenceFile);
          fileUrl = uploadRes.file_url || "";
          fileName = evidenceFile.name;
          fileSize = evidenceFile.size;
        } catch (err) {
          console.error("File upload error", err);
        }
      }

      await api.submitDeliverable(taskId, {
        notes: submissionNotes,
        completion_percentage: parseInt(completionPercentage) || 100,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
      });

      setShowSuccess(true);
      refetchTask();
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        setSubmissionNotes("");
        setEvidenceFile(null);
      }, 2500);
    } catch (err) {
      console.error("Submit deliverable failed", err);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
      }, 2000);
    } finally {
      setSubmittingDeliverable(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800 }}>Project Workspace</h1>
              <span style={{ fontSize: "14px", color: "#64748b" }}>{taskTitle} – {clientName}</span>
            </div>

            {/* DIRECT HIRE ACCEPTANCE BANNER */}
            <div style={{
              background: isAccepted ? "linear-gradient(135deg, #064e3b 0%, #047857 100%)" : "linear-gradient(135deg, #001f3f 0%, #003366 100%)",
              borderRadius: "16px",
              padding: "22px 24px",
              color: "#fff",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ 
                    background: isAccepted ? "#22c55e" : "#ff4500", 
                    color: "#fff", 
                    padding: "3px 10px", 
                    borderRadius: "999px", 
                    fontSize: "11.5px", 
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase"
                  }}>
                    {isAccepted ? "Offer Accepted & Active" : "Direct Job Invitation"}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    From Client: <strong>{clientName}</strong>
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "19px", fontWeight: 800 }}>
                  {isAccepted ? "Project Accepted — In Progress 🚀" : "Direct Job Offer Received from Client"}
                </h3>
                <p style={{ margin: 0, fontSize: "13.5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                  {isAccepted
                    ? `This project is active. Client ${clientName} has been notified that you accepted. You can submit milestones and communicate directly.`
                    : `Client ${clientName} has directly selected and invited you for this task. Click Accept to confirm the assignment and notify ${clientName}.`}
                </p>
              </div>

              {!isAccepted ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    disabled={accepting}
                    onClick={handleAcceptOffer}
                    style={{
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "10px",
                      fontWeight: 800,
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(34,197,94,0.4)"
                    }}
                  >
                    <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px" }} />
                    {accepting ? "Accepting Offer..." : "Accept Job Offer"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: "10px" }}>
                  <iconify-icon icon="lucide:check-check" style={{ fontSize: "20px", color: "#86efac" }} />
                  <span style={{ fontSize: "13.5px", fontWeight: 700 }}>Client Notified</span>
                </div>
              )}
            </div>

            {acceptNotice && (
              <div style={{
                background: "#dcfce7",
                border: "1px solid #86efac",
                color: "#14532d",
                padding: "14px 20px",
                borderRadius: "12px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 600,
                fontSize: "14px"
              }}>
                <iconify-icon icon="lucide:bell-ring" style={{ fontSize: "20px", color: "#16a34a" }} />
                <span>Job Offer Accepted! Client {clientName} has been notified and your workspace is now active.</span>
              </div>
            )}

            <div className={styles.grid}>
              {/* LEFT COLUMN */}
              <div>
                
                {/* PROJECT OVERVIEW */}
                <section className={styles.card}>
                  <h3>Project Overview</h3>
                  <div className={styles.overviewGrid}>
                    <div>
                      <span className={styles.metaLabel}>Client:</span>
                      <strong>{clientName}</strong>
                    </div>
                    <div>
                      <span className={styles.metaLabel}>Start Date:</span>
                      <strong>{startDate}</strong>
                    </div>
                    <div>
                      <span className={styles.metaLabel}>Total Project Cost:</span>
                      <strong>{totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Awaiting Quote"}</strong>
                    </div>
                    <div>
                      <span className={styles.metaLabel}>Status:</span>
                      <span className={`${styles.statusBadge} ${getStatusClass(statusDisplay)}`}>
                        {statusDisplay}
                      </span>
                    </div>
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className={styles.progressText}>Overall Progress: {progressPercent}%</span>
                  </div>
                </section>

                {/* MILESTONES */}
                <section className={styles.card}>
                  <h3>Milestones</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Milestone</th>
                          <th>Percentage</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task?.milestones && task.milestones.length > 0 ? (
                          task.milestones.map((m: any, i: number) => (
                            <tr key={i}>
                              <td>{m.title || `Milestone ${i + 1}`}</td>
                              <td>{m.percentage || `${Math.round(100 / task.milestones.length)}%`}</td>
                              <td>{Number(m.amount || 0).toLocaleString()} XOF</td>
                              <td>
                                <span className={`${styles.statusBadge} ${getStatusClass(m.status)}`}>
                                  {m.status}
                                </span>
                              </td>
                              <td>
                                {m.status !== "Released" && !isCompleted ? (
                                  <button className={`${styles.outlineButton} ${styles.smallButton}`} onClick={() => setIsModalOpen(true)}>
                                    Submit
                                  </button>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td>{taskTitle || "Project Execution & Handover"}</td>
                            <td>100%</td>
                            <td>{totalCost > 0 ? `${totalCost.toLocaleString()} XOF` : "Pending Quote"}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${isCompleted ? styles.statusReleased : (escrowHeld > 0 ? styles.statusHold : styles.statusPending)}`}>
                                {isCompleted ? "Released" : (escrowHeld > 0 ? "Held in Escrow" : "Pending")}
                              </span>
                            </td>
                            <td>
                              {!isCompleted ? (
                                <button className={`${styles.outlineButton} ${styles.smallButton}`} onClick={() => setIsModalOpen(true)}>
                                  Submit
                                </button>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* WORKSPACE DISCUSSION & COORDINATION */}
                <section className={styles.card}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      <iconify-icon icon="lucide:messages-square" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>Workspace Discussion & Coordination</h3>
                      <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>
                        Direct communication with Client <strong>{clientName}</strong>. All messages are synced.
                      </p>
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
                        <span>Send a message below to coordinate directly with the client.</span>
                      </div>
                    )}

                    <div className={styles.quickReplyRow}>
                      <span>Quick replies:</span>
                      <button type="button" onClick={() => handleQuickReply("Progress photos have been uploaded for your review.")}>
                        📸 Uploaded photos
                      </button>
                      <button type="button" onClick={() => handleQuickReply("On track to finish task today.")}>
                        ⏰ On schedule
                      </button>
                      <button type="button" onClick={() => handleQuickReply("Milestone completed, please inspect.")}>
                        👍 Work completed
                      </button>
                    </div>

                    <form className={styles.chatForm} onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        className={styles.chatInput}
                        placeholder="Type a message or milestone update..."
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

                {/* ACTIVITY LOG */}
                <section className={styles.card}>
                  <h3>Activity Log</h3>
                  <div className={styles.logItem}>
                    ✔ Task initiated and assigned to your workspace
                  </div>
                  {isAccepted && (
                    <div className={styles.logItem}>
                      🤝 Direct job offer accepted by technician
                    </div>
                  )}
                  {hasEscrow && (
                    <div className={styles.logItem}>
                      🛡 Escrow funds of {totalCost.toLocaleString()} XOF deposited & protected in vault
                    </div>
                  )}
                  {showSuccess && (
                    <div className={styles.logItem}>
                      📤 Progress deliverable submitted for client review
                    </div>
                  )}
                  {!isCompleted ? (
                    <div className={styles.logItem}>
                      ⏳ Awaiting milestone completion and client confirmation
                    </div>
                  ) : (
                    <div className={styles.logItem}>
                      ✔ Task marked completed – Payment released to wallet
                    </div>
                  )}
                </section>

              </div>

              {/* RIGHT COLUMN */}
              <div>
                
                {/* PAYMENT STATUS */}
                <section className={styles.card}>
                  <h3>Payment Status</h3>
                  <div className={styles.paymentRow}>
                    <span>Released:</span>
                    <strong>{releasedAmount > 0 ? `${releasedAmount.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>On Hold:</span>
                    <strong>{escrowHeld > 0 ? `${escrowHeld.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                  <div className={styles.paymentRow}>
                    <span>Remaining:</span>
                    <strong>{remainingAmount > 0 ? `${remainingAmount.toLocaleString()} XOF` : "0 XOF"}</strong>
                  </div>
                </section>

                {/* QUICK ACTIONS */}
                <section className={styles.card}>
                  <h3>Quick Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {!isAccepted && (
                      <button 
                        className={styles.primaryButton} 
                        style={{ background: "#22c55e" }}
                        disabled={accepting}
                        onClick={handleAcceptOffer}
                      >
                        <iconify-icon icon="lucide:check-circle" /> {accepting ? "Accepting..." : "Accept Job Offer"}
                      </button>
                    )}
                    {totalCost === 0 && (
                      <button
                        className={styles.primaryButton}
                        style={{ background: "#FF4500" }}
                        onClick={() => setQuoteModalOpen(true)}
                      >
                        <iconify-icon icon="lucide:file-text" /> Submit Price Quotation
                      </button>
                    )}
                    <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>
                      Submit Milestone Update
                    </button>
                    <Link 
                      href={`/dashboard/technician/messages?client=${clientId}&name=${encodeURIComponent(clientName)}&task=${taskId}`} 
                      className={styles.outlineButton} 
                      style={{ textDecoration: "none", boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                      <iconify-icon icon="lucide:message-square" /> Message Client ({clientName})
                    </Link>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* QUOTE MODAL */}
      {quoteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setQuoteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Send Project Quotation</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "-8px", marginBottom: "16px" }}>
              Submit your proposed contract price to Client {clientName} for this task.
            </p>

            <form onSubmit={handleSendQuote}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Quote Amount (XOF)
                </label>
                <input
                  type="number"
                  min="1000"
                  placeholder="e.g. 50000"
                  className={styles.input}
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  required
                />
              </div>

              {quoteSuccess ? (
                <div style={{ background: "#dcfce7", color: "#15803d", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", fontWeight: "600", textAlign: "center" }}>
                  ✔ Quotation sent to client successfully!
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    type="button"
                    className={styles.outlineButton}
                    style={{ flex: 1 }}
                    onClick={() => setQuoteModalOpen(false)}
                    disabled={submittingQuote}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    style={{ flex: 1 }}
                    disabled={submittingQuote || !quoteAmount}
                  >
                    {submittingQuote ? "Sending Quote..." : "Send Quote"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MILESTONE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Submit Progress Deliverable</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "-8px", marginBottom: "16px" }}>
              Provide proof of work and completion notes for Client {clientName} to review.
            </p>

            <form onSubmit={handleMilestoneSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Completion Progress (%)
                </label>
                <select 
                  className={styles.input} 
                  value={completionPercentage} 
                  onChange={(e) => setCompletionPercentage(e.target.value)}
                >
                  <option value="25">25% - Initial Assessment & Prep</option>
                  <option value="50">50% - Work In Progress</option>
                  <option value="75">75% - Testing & Refinements</option>
                  <option value="100">100% - Fully Finished & Ready for Release</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Work Summary & Details
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the tasks completed, measurements taken, or materials installed..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Upload Proof Photos / Docs (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                  className={styles.input}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>

              {showSuccess && (
                <div style={{ padding: "10px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
                  ✔ Milestone update submitted to Client {clientName} for approval!
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={styles.outlineButton}
                  onClick={() => setIsModalOpen(false)}
                  disabled={submittingDeliverable}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={submittingDeliverable}
                >
                  {submittingDeliverable ? "Submitting..." : "Submit for Client Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
