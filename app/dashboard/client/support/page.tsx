"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/app/components/Tickets.module.css";
import pageStyles from "@/app/dashboard/client/page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const SHARED_STORAGE_KEY = "boulotman_support_tickets_v2";

export default function ClientSupportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [sending, setSending] = useState(false);

  // Local synced tickets state
  const [localTickets, setLocalTickets] = useState<any[]>([]);

  // Fetch from backend API
  const { data: fetchedTickets, loading, refetch } = useFetch(() => api.getMySupportTickets(), []);

  // Helper to load shared local tickets
  const loadSharedTickets = useCallback(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(SHARED_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read shared tickets", e);
    }
    return [];
  }, []);

  // Helper to save shared local tickets
  const saveSharedTickets = useCallback((ticketsList: any[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(ticketsList));
      // Notify other tabs/subdomains if BroadcastChannel is supported
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("boulotman_support_sync");
        bc.postMessage({ type: "SYNC_TICKETS", tickets: ticketsList });
        bc.close();
      }
    } catch (e) {
      console.warn("Could not save shared tickets", e);
    }
  }, []);

  // Merge backend tickets and shared local tickets
  useEffect(() => {
    const shared = loadSharedTickets();
    const server = Array.isArray(fetchedTickets) ? fetchedTickets : [];
    
    // Combine unique by id / db_id
    const map = new Map();
    server.forEach((t: any) => map.set(t.id, t));
    shared.forEach((t: any) => {
      if (!map.has(t.id)) {
        map.set(t.id, t);
      } else {
        // Merge messages
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

  // Auto-sync polling every 6 seconds
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

    const newMsg = {
      id: Date.now(),
      sender: "Me",
      role: "Client",
      avatar: "https://i.pravatar.cc/150?img=11",
      time: "Just now",
      body: textToSend,
    };

    // Update local immediately for instant response
    const updatedTicket = {
      ...activeTicket,
      status: "Pending",
      statusClass: styles.statusPending,
      messages: [...(activeTicket.messages || []), newMsg],
    };

    const updatedList = localTickets.map(t =>
      (t.db_id || t.id) === (activeTicket.db_id || activeTicket.id) ? updatedTicket : t
    );
    setLocalTickets(updatedList);
    setActiveTicket(updatedTicket);
    saveSharedTickets(updatedList);

    // Call Backend API
    try {
      await api.replyMySupportTicket(activeTicket.db_id || activeTicket.id, textToSend);
      refetch();
    } catch (err) {
      console.warn("Backend sync notice:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !replyText.trim()) return;
    const subj = newSubject.trim();
    const msgBody = replyText.trim();
    setSending(true);

    const now = new Date();
    const localId = `BM-${now.getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    const newTicketObj = {
      id: localId,
      db_id: Date.now(),
      subject: subj,
      client: "Me",
      role: "Client",
      status: "Pending",
      statusClass: styles.statusPending,
      messages: [
        {
          id: Date.now(),
          sender: "Me",
          role: "Client",
          avatar: "https://i.pravatar.cc/150?img=11",
          time: "Just now",
          body: msgBody,
        },
      ],
    };

    const updatedList = [newTicketObj, ...localTickets];
    setLocalTickets(updatedList);
    setActiveTicket(newTicketObj);
    saveSharedTickets(updatedList);

    setIsCreating(false);
    setReplyText("");
    setNewSubject("");

    // Call Backend API
    try {
      const res = await api.createSupportTicket({
        subject: subj,
        body: msgBody,
      });
      if (res && res.id) {
        newTicketObj.id = res.id;
        newTicketObj.db_id = res.db_id || newTicketObj.db_id;
        saveSharedTickets(updatedList);
      }
      refetch();
    } catch (err) {
      console.warn("Backend create ticket notice:", err);
    } finally {
      setSending(false);
    }
  };

  const tickets = localTickets;

  return (
    <main className={pageStyles.page}>
      <div className={pageStyles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* MAIN CONTENT */}
        <div className={pageStyles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tickets..."
            searchQuery=""
            setSearchQuery={() => {}}
          />

          <div className={pageStyles.content} style={{ padding: "24px" }}>
            <div className={styles.layout}>
              {/* INBOX */}
              <div className={styles.inbox}>
                <div className={styles.inboxHeader}>
                  <h3>My Tickets ({tickets.length})</h3>
                  <button className={styles.newTicketBtn} onClick={() => { setIsCreating(true); setActiveTicket(null); }}>
                    <iconify-icon icon="lucide:plus"></iconify-icon> New
                  </button>
                </div>
                <div className={styles.ticketList}>
                  {tickets.length === 0 ? (
                    <div style={{ padding: "32px 16px", textAlign: "center", color: "#94a3b8" }}>
                      <iconify-icon icon="lucide:life-buoy" style={{ fontSize: 36, marginBottom: 8, display: "block" }} />
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600 }}>No support tickets yet</p>
                      <span style={{ fontSize: 12 }}>Click &quot;+ New&quot; above to create a ticket.</span>
                    </div>
                  ) : (
                    tickets.map(ticket => (
                      <div 
                        key={ticket.id} 
                        className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                        onClick={() => { setActiveTicket(ticket); setIsCreating(false); }}
                      >
                        <div className={styles.ticketSubject}>{ticket.subject}</div>
                        <div className={styles.ticketMeta}>{ticket.id}</div>
                        <span className={`${styles.status} ${ticket.statusClass || styles.statusPending}`}>{ticket.status || "Pending"}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CHAT AREA */}
              {isCreating ? (
                <div className={styles.chatArea} style={{ padding: 40 }}>
                  <h2 style={{ color: "#001F3F", marginBottom: 20 }}>Create New Support Ticket</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Subject</label>
                      <input 
                        type="text" 
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="E.g. Issue with milestone payment"
                        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Describe your issue</label>
                      <textarea 
                        className={styles.textarea} 
                        placeholder="Please provide details so our support team can help you..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={5}
                      ></textarea>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button 
                        style={{ padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </button>
                      <button className={styles.sendBtn} onClick={handleCreateTicket} disabled={sending}>
                        {sending ? "Submitting..." : "Submit Ticket"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTicket ? (
                <div className={styles.chatArea}>
                  <div className={styles.chatHeader}>
                    <h2>{activeTicket.subject}</h2>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Ticket ID: {activeTicket.id}</span>
                      <span className={`${styles.status} ${activeTicket.statusClass || styles.statusPending}`}>{activeTicket.status || "Pending"}</span>
                    </div>
                  </div>

                  <div className={styles.thread}>
                    {(activeTicket.messages || []).map((msg: any) => (
                      <div key={msg.id} className={styles.message}>
                        <div className={styles.messageHeader}>
                          {msg.avatar ? (
                            <img src={msg.avatar} alt={msg.sender} className={styles.avatar} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#001f3f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                              {(msg.sender?.[0] || "U").toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className={styles.senderName}>{msg.sender} <span className={styles.senderRole}>({msg.role || "User"})</span></div>
                            <div className={styles.ticketMeta} style={{ margin: 0 }}>{msg.time}</div>
                          </div>
                        </div>
                        <div className={styles.messageBody}>
                          {msg.body}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.replyArea}>
                    <textarea 
                      className={styles.textarea} 
                      placeholder="Type your reply to Support..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    ></textarea>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                      <button className={styles.sendBtn} onClick={handleSend} disabled={sending || !replyText.trim()}>
                        <iconify-icon icon="lucide:send"></iconify-icon> {sending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.chatArea} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                  <iconify-icon icon="lucide:headphones" style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}></iconify-icon>
                  <h3 style={{ color: "#001f3f", margin: "0 0 6px" }}>BoulotMan Client Support</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>Select a ticket from the left or create a new ticket to talk with our team.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
