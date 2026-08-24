"use client";

import React, { useState, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: string; url?: string }[]>([
    { name: "Project_Blueprint_v1.pdf", type: "application/pdf", size: "2.4 MB" },
    { name: "Site_Survey_Photo_01.jpg", type: "image/jpeg", size: "1.8 MB" },
  ]);
  
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: task, loading: taskLoading } = useFetch(
    () => api.getTask(parseInt(id)), 
    [id]
  );
  
  // Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ name: string; type: string; size?: string; url?: string } | null>(null);
  
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; time: string; isClient: boolean }[]>([
    { id: 1, sender: "System", text: "Workspace created and escrow protection initiated.", time: "10:00 AM", isClient: false },
    { id: 2, sender: "You", text: "Hello! Looking forward to getting this project completed smoothly.", time: "10:05 AM", isClient: true },
  ]);

  const totalCost = task?.budget ? parseInt(task.budget) : (task?.budget_max ? parseInt(task.budget_max) : 45000);
  const released = confirmSuccess ? totalCost : 0;
  const balance = totalCost - released;
  const milestoneStatus = confirmSuccess ? "Released" : "In Escrow";
  const clientName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Client" : "Client";
  const executorName = task?.assigned_to_name || task?.assigned_to?.username || "Assigned Specialist";
  const projectTitle = task?.title || `Task #${id}: Residential Installation & Fitout`;
  const taskCity = task?.city || task?.address || "Yaoundé / Douala";

  const handleConfirmRelease = () => {
    setConfirmSuccess(true);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "System", text: `Escrow funds of ${totalCost.toLocaleString()} XOF have been successfully released to ${executorName}.`, time: "Just now", isClient: false }
    ]);
    setTimeout(() => {
      setConfirmModalOpen(false);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "You", text: chatDraft.trim(), time: "Just now", isClient: true }
    ]);
    setChatDraft("");
  };

  const handleQuickPrompt = (promptText: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "You", text: promptText, time: "Just now", isClient: true }
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const filesArr = Array.from(e.target.files).map(f => ({
        name: f.name,
        type: f.type,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      }));
      setUploadedFiles(prev => [...prev, ...filesArr]);
      e.target.value = "";
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search workspace, files, milestones..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className={styles.content}>
            {/* HERO BANNER */}
            <section className={styles.heroBanner}>
              <div className={styles.heroTopRow}>
                <Link href="/dashboard/client/projects" className={styles.backLink}>
                  <iconify-icon icon="lucide:arrow-left" />
                  <span>Back to My Projects</span>
                </Link>
                <div className={styles.liveBadge}>
                  <span className={styles.livePulse} />
                  <span>ACTIVE PROJECT WORKSPACE</span>
                </div>
              </div>

              <div className={styles.heroMain}>
                <div className={styles.heroInfo}>
                  <h1 className={styles.heroTitle}>{projectTitle}</h1>
                  <p className={styles.heroSubtitle}>
                    Managed workspace with milestone tracking, secure escrow hold, direct communications, and file deliverables.
                  </p>
                  
                  <div className={styles.metaChips}>
                    <span className={styles.chip}>
                      <iconify-icon icon="lucide:user" style={{ color: "#ff4500" }} />
                      <strong>Client:</strong> {clientName}
                    </span>
                    <span className={styles.chip}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#38bdf8" }} />
                      <strong>Specialist:</strong> {executorName}
                    </span>
                    <span className={styles.chip}>
                      <iconify-icon icon="lucide:map-pin" style={{ color: "#4ade80" }} />
                      {taskCity}
                    </span>
                    <span className={styles.chip}>
                      <iconify-icon icon="lucide:shield-check" style={{ color: "#a855f7" }} />
                      BoulotMan Escrow Protected
                    </span>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <button 
                    type="button" 
                    className={styles.releaseFundsHeroBtn}
                    onClick={() => setConfirmModalOpen(true)}
                    disabled={confirmSuccess}
                  >
                    <iconify-icon icon="lucide:shield-check" style={{ fontSize: 20 }} />
                    <span>{confirmSuccess ? "Funds Released ✔" : "Release Escrow"}</span>
                  </button>
                  <a href="#chat-section" className={styles.messageHeroBtn}>
                    <iconify-icon icon="lucide:message-square" />
                    <span>Message Specialist</span>
                  </a>
                </div>
              </div>
            </section>

            {/* METRICS ROW */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIconWrap} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div className={styles.statBody}>
                  <span className={styles.statLabel}>Total Budget</span>
                  <strong className={styles.statValue}>{totalCost.toLocaleString()} XOF</strong>
                  <span className={styles.statSub}>Full Project Value</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIconWrap} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                  <iconify-icon icon="lucide:shield" />
                </div>
                <div className={styles.statBody}>
                  <span className={styles.statLabel}>Held in Escrow</span>
                  <strong className={styles.statValue} style={{ color: "#0284c7" }}>{balance.toLocaleString()} XOF</strong>
                  <span className={styles.statSub}>100% Safe in Escrow Vault</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIconWrap} style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                  <iconify-icon icon="lucide:check-circle-2" />
                </div>
                <div className={styles.statBody}>
                  <span className={styles.statLabel}>Released to Specialist</span>
                  <strong className={styles.statValue} style={{ color: "#16a34a" }}>{released.toLocaleString()} XOF</strong>
                  <span className={styles.statSub}>{confirmSuccess ? "Payout completed" : "Awaiting milestone approval"}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIconWrap} style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                  <iconify-icon icon="lucide:activity" />
                </div>
                <div className={styles.statBody}>
                  <span className={styles.statLabel}>Project Progress</span>
                  <strong className={styles.statValue}>{confirmSuccess ? "100%" : "50%"}</strong>
                  <div className={styles.miniProgressBar}>
                    <div 
                      className={styles.miniProgressFill} 
                      style={{ width: confirmSuccess ? "100%" : "50%" }} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* TWO COLUMN WORKSPACE BODY */}
            <div className={styles.workspaceGrid}>
              <div className={styles.workspaceMainCol}>
                {/* MILESTONES & ESCROW */}
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
                              <strong>Phase 1: Complete Project Delivery & Sign-off</strong>
                              <span>Full scope execution, testing, and final handover</span>
                            </div>
                          </td>
                          <td>
                            <span className={styles.percentBadge}>100%</span>
                          </td>
                          <td>
                            <strong className={styles.amountText}>{totalCost.toLocaleString()} XOF</strong>
                          </td>
                          <td>
                            <span className={`${styles.statusPill} ${confirmSuccess ? styles.statusReleased : styles.statusEscrow}`}>
                              <iconify-icon icon={confirmSuccess ? "lucide:check-circle" : "lucide:lock"} />
                              {confirmSuccess ? "Released" : "Held in Escrow"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {!confirmSuccess ? (
                              <button 
                                type="button" 
                                className={styles.tableActionBtn}
                                onClick={() => setConfirmModalOpen(true)}
                              >
                                <iconify-icon icon="lucide:unlock" />
                                <span>Confirm & Release</span>
                              </button>
                            ) : (
                              <span className={styles.completedBadge}>
                                <iconify-icon icon="lucide:check" /> Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.escrowGuaranteeFooter}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a", fontSize: 20 }} />
                    <span><strong>BoulotMan Escrow Guarantee:</strong> Payouts are protected. Funds are only transferred once you inspect and approve the completed service.</span>
                  </div>
                </section>

                {/* PROJECT FILES */}
                <section className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                        <iconify-icon icon="lucide:folder" />
                      </div>
                      <div>
                        <h3>Project Files & Blueprints</h3>
                        <p>Upload blueprints, site photos, invoices, or specifications for this project.</p>
                      </div>
                    </div>

                    <label className={styles.uploadBtnLabel}>
                      <iconify-icon icon="lucide:upload-cloud" />
                      <span>Upload New File</span>
                      <input 
                        type="file" 
                        multiple 
                        style={{ display: "none" }} 
                        onChange={handleFileUpload} 
                      />
                    </label>
                  </div>

                  <div className={styles.filesGrid}>
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className={styles.fileCard}>
                        <div className={styles.fileCardIconWrap}>
                          <iconify-icon icon={file.type.includes("pdf") ? "lucide:file-text" : "lucide:image"} />
                        </div>
                        <div className={styles.fileCardDetails}>
                          <strong title={file.name}>{file.name}</strong>
                          <span>{file.size} • Uploaded</span>
                        </div>
                        <div className={styles.fileCardActions}>
                          <button 
                            type="button" 
                            className={styles.fileActionIconBtn}
                            onClick={() => setPreviewMedia(file)}
                            title="Preview File"
                          >
                            <iconify-icon icon="lucide:eye" />
                          </button>
                          <button 
                            type="button" 
                            className={styles.fileActionIconBtn}
                            onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            title="Delete File"
                          >
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* LIVE MESSAGES / CHAT */}
                <section className={styles.card} id="chat-section">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                      <div className={styles.cardHeaderIcon} style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                        <iconify-icon icon="lucide:messages-square" />
                      </div>
                      <div>
                        <h3>Workspace Discussion & Coordination</h3>
                        <p>Direct communication with {executorName}. All agreements are tracked for audit.</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chatContainer}>
                    <div className={styles.chatMessageList}>
                      {messages.map((m) => (
                        <div 
                          key={m.id} 
                          className={`${styles.chatBubbleWrap} ${m.isClient ? styles.bubbleClient : styles.bubbleSpecialist}`}
                        >
                          <div className={styles.chatAvatar}>
                            {m.isClient ? "CL" : "SP"}
                          </div>
                          <div className={styles.chatBubble}>
                            <div className={styles.chatBubbleMeta}>
                              <strong>{m.sender}</strong>
                              <span>{m.time}</span>
                            </div>
                            <p>{m.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.quickPrompts}>
                      <span>Quick replies:</span>
                      <button type="button" onClick={() => handleQuickPrompt("Please share the latest progress photos.")}>
                        📸 Request photos
                      </button>
                      <button type="button" onClick={() => handleQuickPrompt("When is the expected completion time today?")}>
                        ⏰ Check schedule
                      </button>
                      <button type="button" onClick={() => handleQuickPrompt("Work looks great, ready to release milestone!")}>
                        👍 Approve work
                      </button>
                    </div>

                    <form className={styles.chatInputForm} onSubmit={handleSendMessage}>
                      <input 
                        type="text" 
                        className={styles.chatInput} 
                        placeholder="Type a message or project update..." 
                        value={chatDraft}
                        onChange={(e) => setChatDraft(e.target.value)}
                      />
                      <button type="submit" className={styles.chatSendBtn} disabled={!chatDraft.trim()}>
                        <iconify-icon icon="lucide:send" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                </section>
              </div>

              {/* SIDEBAR COL */}
              <div className={styles.workspaceSideCol}>
                {/* SPECIALIST CARD */}
                <div className={styles.sideCard}>
                  <h4 className={styles.sideCardHeading}>Assigned Professional</h4>
                  <div className={styles.specialistProfile}>
                    <div className={styles.specialistAvatar}>
                      <iconify-icon icon="lucide:user-check" />
                    </div>
                    <div className={styles.specialistInfo}>
                      <strong>{executorName}</strong>
                      <span className={styles.specialistBadge}>
                        <iconify-icon icon="lucide:badge-check" style={{ color: "#16a34a" }} />
                        Verified Specialist
                      </span>
                    </div>
                  </div>

                  <div className={styles.specialistStats}>
                    <div>
                      <span>Rating</span>
                      <strong>★ 4.9 / 5.0</strong>
                    </div>
                    <div>
                      <span>Jobs Completed</span>
                      <strong>42</strong>
                    </div>
                    <div>
                      <span>On-Time Rate</span>
                      <strong>99%</strong>
                    </div>
                  </div>
                </div>

                {/* ACTIVITY LOG */}
                <div className={styles.sideCard}>
                  <h4 className={styles.sideCardHeading}>Activity & Audit Trail</h4>
                  <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ background: "#16a34a" }}>
                        <iconify-icon icon="lucide:check" />
                      </div>
                      <div className={styles.timelineContent}>
                        <strong>Workspace Initialized</strong>
                        <span>Escrow deposit confirmed</span>
                        <time>Today, 09:30 AM</time>
                      </div>
                    </div>

                    <div className={styles.timelineItem}>
                      <div className={styles.timelineDot} style={{ background: "#0ea5e9" }}>
                        <iconify-icon icon="lucide:file-text" />
                      </div>
                      <div className={styles.timelineContent}>
                        <strong>Blueprint Uploaded</strong>
                        <span>Project_Blueprint_v1.pdf added</span>
                        <time>Today, 09:45 AM</time>
                      </div>
                    </div>

                    {confirmSuccess && (
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: "#ff4500" }}>
                          <iconify-icon icon="lucide:shield-check" />
                        </div>
                        <div className={styles.timelineContent}>
                          <strong>Milestone Released</strong>
                          <span>{totalCost.toLocaleString()} XOF sent to executor</span>
                          <time>Just now</time>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ESCROW SAFETY BADGE */}
                <div className={styles.safetyBox}>
                  <iconify-icon icon="lucide:shield-alert" style={{ fontSize: 32, color: "#ff4500" }} />
                  <div>
                    <strong>Need Help or Mediation?</strong>
                    <p>Our 24/7 dispute resolution team is ready to assist if anything doesn&apos;t go as planned.</p>
                    <Link href="/dashboard/client/support" className={styles.safetyLink}>
                      Open Support Ticket →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM RELEASE MODAL */}
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
              This action confirms that all deliverables for this milestone have been inspected and approved.
            </p>
            
            {!confirmSuccess ? (
              <div className={styles.modalButtons}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setConfirmModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className={styles.modalConfirmBtn} onClick={handleConfirmRelease}>
                  Yes, Release Funds
                </button>
              </div>
            ) : (
              <div className={styles.successText}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 24, color: "#16a34a" }} />
                <span>Milestone funds released successfully!</span>
              </div>
            )}
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
            <p style={{ color: "#64748b", fontSize: 14 }}>{previewMedia.type} • {previewMedia.size}</p>
            <div style={{ padding: "30px 20px", background: "#f8fafc", borderRadius: "16px", margin: "20px 0", textAlign: "center" }}>
              <iconify-icon icon={previewMedia.type.includes("pdf") ? "lucide:file-text" : "lucide:image"} style={{ fontSize: 64, color: "#ff4500" }} />
              <p style={{ margin: "12px 0 0", fontWeight: 700 }}>{previewMedia.name}</p>
            </div>
            <button type="button" className={styles.modalConfirmBtn} style={{ width: "100%" }} onClick={() => setPreviewMedia(null)}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
