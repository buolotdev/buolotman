"use client";

import React, { useState } from "react";
import styles from "@/app/components/Tickets.module.css";
import adminStyles from "@/app/dashboard/admin/admin.module.css";



import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function AdminSupportPage() {
  const { data: fetchedTickets, loading, refetch } = useFetch(() => api.getAdminSupportTickets(), []);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  React.useEffect(() => {
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
      await api.replySupportTicket(activeTicket.db_id, replyText);
      setReplyText("");
      refetch();
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const tickets = fetchedTickets || [];

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return styles.statusPending;
      case "awaiting response": return styles.statusAwaiting;
      case "escalated": return styles.statusEscalated;
      case "resolved": return styles.statusPublished; // or similar
      default: return styles.statusPending;
    }
  };

  return (
    <div className={adminStyles.dashboardBody} style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      <div className={adminStyles.pageHeader} style={{ marginBottom: 20 }}>
        <div className={adminStyles.headerContent}>
          <h1>Support Tickets</h1>
          <p>Manage and resolve support requests from users.</p>
        </div>
      </div>

      <div className={styles.layout} style={{ flex: 1 }}>
        {/* INBOX */}
        <div className={styles.inbox}>
          <div className={styles.inboxHeader}>
            <h3>All Tickets ({tickets.length})</h3>
          </div>
          <div className={styles.ticketList}>
            {tickets.map((ticket: any) => (
              <div 
                key={ticket.id} 
                className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                onClick={() => setActiveTicket(ticket)}
              >
                <div className={styles.ticketSubject}>{ticket.subject}</div>
                <div className={styles.ticketMeta}>{ticket.client}</div>
                <span className={`${styles.status} ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        {activeTicket ? (
          <div className={styles.chatArea}>
            <div className={styles.chatHeader}>
              <h2>{activeTicket.subject} — {activeTicket.id}</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Status:</span>
                <span className={`${styles.status} ${getStatusClass(activeTicket.status)}`}>{activeTicket.status}</span>
              </div>
            </div>

            <div className={styles.thread}>
              {activeTicket.messages.map((msg: any) => (
                <div key={msg.id} className={styles.message}>
                  <div className={styles.messageHeader}>
                    <img src={msg.avatar} alt={msg.sender} className={styles.avatar} />
                    <div>
                      <div className={styles.senderName}>{msg.sender} <span className={styles.senderRole}>({msg.role})</span></div>
                      <div className={styles.ticketMeta} style={{ margin: 0 }}>{msg.time}</div>
                    </div>
                  </div>
                  <div className={styles.messageBody}>
                    {msg.body}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.composer}>
              <textarea 
                className={styles.textarea} 
                placeholder="Type your reply here..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
              <div className={styles.composerActions}>
                <button className={styles.sendBtn} onClick={handleSend}>
                  <iconify-icon icon="lucide:send"></iconify-icon> Send Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:inbox"></iconify-icon>
            <h3>Select a ticket to view</h3>
          </div>
        )}
      </div>
    </div>
  );
}
