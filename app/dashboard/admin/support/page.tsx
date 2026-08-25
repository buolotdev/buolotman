"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./admin-support.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const SHARED_STORAGE_KEY = "boulotman_support_tickets_v2";

export default function AdminSupportPage() {
  const { data: fetchedTickets, loading, refetch } = useFetch(() => api.getAdminSupportTickets(), []);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [localTickets, setLocalTickets] = useState<any[]>([]);

  // Load shared tickets
  const loadSharedTickets = useCallback(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(SHARED_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load shared tickets", e);
    }
    return [];
  }, []);

  // Save shared tickets
  const saveSharedTickets = useCallback((ticketsList: any[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(ticketsList));
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("boulotman_support_sync");
        bc.postMessage({ type: "SYNC_TICKETS", tickets: ticketsList });
        bc.close();
      }
    } catch (e) {
      console.warn("Could not save shared tickets", e);
    }
  }, []);

  // Merge server & local tickets
  useEffect(() => {
    const shared = loadSharedTickets();
    const server = Array.isArray(fetchedTickets) ? fetchedTickets : [];

    const map = new Map();
    // Server first
    server.forEach((t: any) => map.set(t.id, t));
    // Shared secondary (ensures client tickets are never lost)
    shared.forEach((t: any) => {
      if (!map.has(t.id)) {
        map.set(t.id, t);
      } else {
        const existing = map.get(t.id);
        const existingMsgIds = new Set((existing.messages || []).map((m: any) => m.id));
        const extraMsgs = (t.messages || []).filter((m: any) => !existingMsgIds.has(m.id));
        existing.messages = [...(existing.messages || []), ...extraMsgs];
      }
    });

    const merged = Array.from(map.values());
    setLocalTickets(merged);

    if (merged.length > 0) {
      setActiveTicket((prev: any) => {
        if (!prev) return merged[0];
        const updated = merged.find((t: any) => (t.db_id || t.id) === (prev.db_id || prev.id));
        return updated || merged[0];
      });
    } else {
      setActiveTicket(null);
    }
  }, [fetchedTickets, loadSharedTickets]);

  // Listen for BroadcastChannel sync
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const bc = new BroadcastChannel("boulotman_support_sync");
    bc.onmessage = (event) => {
      if (event.data?.type === "SYNC_TICKETS") {
        setLocalTickets(event.data.tickets);
        setActiveTicket((prev: any) => {
          if (!prev) return event.data.tickets[0] || null;
          return event.data.tickets.find((t: any) => (t.db_id || t.id) === (prev.db_id || prev.id)) || prev;
        });
      }
    };
    return () => bc.close();
  }, []);

  // Auto-sync support tickets every 6 seconds for real-time helpdesk
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 6000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSend = async () => {
    if (!replyText.trim() || !activeTicket) return;
    const textToSend = replyText.trim();
    setReplyText("");
    setSending(true);

    const now = new Date();
    const adminMsg = {
      id: Date.now(),
      sender: "Support Team",
      role: "Admin",
      avatar: "/boulotman-logo.png",
      time: "Just now",
      body: textToSend,
    };

    const updatedTicket = {
      ...activeTicket,
      status: "Awaiting response",
      messages: [...(activeTicket.messages || []), adminMsg],
    };

    const updatedList = localTickets.map(t =>
      (t.db_id || t.id) === (activeTicket.db_id || activeTicket.id) ? updatedTicket : t
    );
    setLocalTickets(updatedList);
    setActiveTicket(updatedTicket);
    saveSharedTickets(updatedList);

    // Call Backend API
    try {
      await api.replySupportTicket(activeTicket.db_id || activeTicket.id, textToSend);
      refetch();
    } catch (err) {
      console.warn("Backend admin reply notice:", err);
    } finally {
      setSending(false);
    }
  };

  const tickets = localTickets;

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className={styles.inboxTitle} style={{ margin: 0 }}>
              <iconify-icon icon="lucide:mail" style={{ color: "#ff4500" }} /> Ticket Inbox ({tickets.length})
            </h3>
            <button 
              onClick={() => refetch()} 
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}
            >
              <iconify-icon icon="lucide:refresh-cw"></iconify-icon> Refresh
            </button>
          </div>
          <div className={styles.ticketList}>
            {loading && tickets.length === 0 ? (
              <p style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <div style={{ padding: "30px 15px", textAlign: "center", color: "#94a3b8" }}>
                <iconify-icon icon="lucide:inbox" style={{ fontSize: 32, marginBottom: 8, display: "block" }} />
                No support tickets yet.
              </div>
            ) : (
              tickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                  onClick={() => setActiveTicket(ticket)}
                >
                  <div className={styles.ticketSubject}>{ticket.subject || "Support Inquiry"}</div>
                  <div className={styles.ticketMeta}>{ticket.client || "Client"} • {ticket.id}</div>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button className={styles.sendBtn} onClick={handleSend} disabled={sending || !replyText.trim()}>
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
