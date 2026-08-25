"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin-support.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function AdminSupportPage() {
  const { data: fetchedTickets, loading, refetch } = useFetch(() => api.getAdminSupportTickets(), []);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (fetchedTickets && fetchedTickets.length > 0) {
      setActiveTicket((prev: any) => {
        if (!prev) return fetchedTickets[0];
        const updated = fetchedTickets.find((t: any) => t.id === prev.id);
        return updated || fetchedTickets[0];
      });
    } else {
      setActiveTicket(null);
    }
  }, [fetchedTickets]);

  const handleSend = async () => {
    if (!replyText.trim() || !activeTicket) return;
    setSending(true);
    try {
      await api.replySupportTicket(activeTicket.db_id || activeTicket.id, replyText);
      setReplyText("");
      refetch();
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const tickets = fetchedTickets || [];

  const totals = {
    total: tickets.length,
    pending: tickets.filter((t: any) => t.status?.toLowerCase().includes("pending")).length,
    awaiting: tickets.filter((t: any) => t.status?.toLowerCase().includes("awaiting")).length,
    resolved: tickets.filter((t: any) => t.status?.toLowerCase().includes("resolved")).length,
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return styles.statusPending;
      case "awaiting response": return styles.statusAwaiting;
      case "resolved": return styles.statusResolved;
      default: return styles.statusPending;
    }
  };

  return (
    <div className={styles.page}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:help-circle" /> Helpdesk & Customer Operations
          </div>
          <h1 className={styles.heroTitle}>Support Tickets & Inquiries</h1>
          <p className={styles.heroSubtitle}>
            Resolve customer inquiries, assist technicians and clients with platform troubleshooting, and dispatch official support replies.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:headphones" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:inbox" />
          </div>
          <div>
            <div className={styles.statLabel}>Total Inquiries</div>
            <div className={styles.statValue}>{totals.total}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:alert-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>Pending Action</div>
            <div className={styles.statValue}>{totals.pending}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:clock" />
          </div>
          <div>
            <div className={styles.statLabel}>Awaiting Reply</div>
            <div className={styles.statValue}>{totals.awaiting}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:check-circle-2" />
          </div>
          <div>
            <div className={styles.statLabel}>Resolved</div>
            <div className={styles.statValue}>{totals.resolved}</div>
          </div>
        </div>
      </div>

      {/* SUPPORT HELPDESK INBOX & CHAT */}
      <div className={styles.supportLayout}>
        {/* INBOX LIST */}
        <div className={styles.inboxCard}>
          <h3 className={styles.inboxTitle}>
            <iconify-icon icon="lucide:mail" style={{ color: "#ff4500" }} /> Ticket Inbox ({tickets.length})
          </h3>
          <div className={styles.ticketList}>
            {loading ? (
              <p style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>No support tickets.</p>
            ) : (
              tickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div className={styles.ticketSubject}>{ticket.subject || "Support Inquiry"}</div>
                  <div className={styles.ticketMeta}>{ticket.client || "Marketplace User"}</div>
                  <span className={`${styles.status} ${getStatusClass(ticket.status)}`}>
                    {ticket.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT THREAD */}
        <div className={styles.chatCard}>
          {activeTicket ? (
            <>
              <div className={styles.chatHeader}>
                <div>
                  <h2 className={styles.chatTitle}>{activeTicket.subject}</h2>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Ticket ID: #{activeTicket.id}</span>
                </div>
                <span className={`${styles.status} ${getStatusClass(activeTicket.status)}`}>
                  {activeTicket.status || "Pending"}
                </span>
              </div>

              <div className={styles.thread}>
                {(activeTicket.messages || []).map((msg: any) => (
                  <div key={msg.id} className={styles.message}>
                    <div className={styles.messageHeader}>
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.sender} className={styles.messageAvatar} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#001f3f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
                          {(msg.sender?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className={styles.senderName}>{msg.sender} <span style={{ color: "#64748b", fontWeight: 500 }}>({msg.role || "User"})</span></div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{msg.time || "Recent"}</div>
                      </div>
                    </div>
                    <div className={styles.messageBody}>{msg.body}</div>
                  </div>
                ))}
              </div>

              <div className={styles.composer}>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Type an official admin response to the user..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button className={styles.sendBtn} onClick={handleSend} disabled={sending}>
                  <iconify-icon icon="lucide:send" /> {sending ? "Sending..." : "Dispatch Reply"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:inbox" style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }} />
              <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#001f3f" }}>Select a Ticket</h3>
              <p style={{ margin: 0, fontSize: 13 }}>Click any ticket on the left to inspect conversation history and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
