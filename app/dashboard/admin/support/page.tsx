"use client";

import React, { useState } from "react";
import styles from "@/app/components/Tickets.module.css";
import adminStyles from "@/app/dashboard/admin/admin.module.css";

// INITIAL MOCK DATA
const INITIAL_TICKETS = [
  {
    id: "BM-2026-000451",
    subject: "Payment not released",
    client: "John Mukasa",
    role: "Client",
    status: "Pending",
    statusClass: styles.statusPending,
    messages: [
      {
        id: 1,
        sender: "John Mukasa",
        role: "Client",
        avatar: "https://i.pravatar.cc/150?img=11",
        time: "Today, 10:30 AM",
        body: "My milestone payment is still on hold even though the technician finished the job."
      }
    ]
  },
  {
    id: "BM-2026-000452",
    subject: "Account verification issue",
    client: "Mary Uwase",
    role: "Technician",
    status: "Awaiting response",
    statusClass: styles.statusAwaiting,
    messages: [
      {
        id: 1,
        sender: "Mary Uwase",
        role: "Technician",
        avatar: "https://i.pravatar.cc/150?img=5",
        time: "Yesterday, 2:15 PM",
        body: "I uploaded my ID card but my account is still not verified. What else do I need to provide?"
      },
      {
        id: 2,
        sender: "Support Team",
        role: "Admin",
        avatar: "/boulotman-logo.png",
        time: "Yesterday, 3:00 PM",
        body: "Hi Mary, your ID image was blurry. Could you please re-upload a clear picture?"
      }
    ]
  },
  {
    id: "BM-2026-000453",
    subject: "Project dispute",
    client: "Paul Nshimiyimana",
    role: "Company",
    status: "Escalated",
    statusClass: styles.statusEscalated,
    messages: [
      {
        id: 1,
        sender: "Paul Nshimiyimana",
        role: "Company",
        avatar: "https://i.pravatar.cc/150?img=33",
        time: "2 days ago",
        body: "The client cancelled the project halfway but we already bought materials."
      }
    ]
  }
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  React.useEffect(() => {
    const loadTickets = () => {
      const saved = localStorage.getItem("mock_support_tickets");
      let currentTickets = INITIAL_TICKETS;
      if (saved) {
        currentTickets = JSON.parse(saved);
      } else {
        localStorage.setItem("mock_support_tickets", JSON.stringify(INITIAL_TICKETS));
      }
      
      setTickets(currentTickets);
      
      // Update active ticket to match the newly loaded data
      setActiveTicket((prev: any) => {
        if (!prev) return currentTickets[0];
        const updated = currentTickets.find((t: any) => t.id === prev.id);
        return updated || currentTickets[0];
      });
    };
    
    loadTickets();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mock_support_tickets") {
        loadTickets();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSend = () => {
    if (!replyText.trim() || !activeTicket) return;
    const newMsg = {
      id: Date.now(),
      sender: "Support Team",
      role: "Admin",
      avatar: "/boulotman-logo.png",
      time: "Just now",
      body: replyText
    };
    
    const updatedTicket = { ...activeTicket, messages: [...activeTicket.messages, newMsg] };
    const updatedTickets = tickets.map(t => t.id === activeTicket.id ? updatedTicket : t);
    
    setTickets(updatedTickets);
    setActiveTicket(updatedTicket);
    setReplyText("");
    localStorage.setItem("mock_support_tickets", JSON.stringify(updatedTickets));
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
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                onClick={() => setActiveTicket(ticket)}
              >
                <div className={styles.ticketSubject}>{ticket.subject}</div>
                <div className={styles.ticketMeta}>{ticket.client}</div>
                <span className={`${styles.status} ${ticket.statusClass}`}>{ticket.status}</span>
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
                <span className={`${styles.status} ${activeTicket.statusClass}`}>{activeTicket.status}</span>
              </div>
            </div>

            <div className={styles.thread}>
              {activeTicket.messages.map(msg => (
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
