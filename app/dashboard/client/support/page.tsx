"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import styles from "@/app/components/Tickets.module.css";
import pageStyles from "@/app/dashboard/client/page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Service Providers", icon: "lucide:users", href: "/service-providers/technicians", match: (p: string) => p.startsWith("/service-providers") },
];

// INITIAL TICKETS - Starts empty for real production users
const INITIAL_TICKETS: any[] = [];

export default function ClientSupportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const [allTickets, setAllTickets] = useState<any[]>([]);

  // The client only sees tickets where client === "Me"
  const tickets = allTickets.filter(t => t.client === "Me");

  React.useEffect(() => {
    const loadTickets = () => {
      const saved = localStorage.getItem("mock_support_tickets");
      let currentTickets = INITIAL_TICKETS;
      if (saved) {
        currentTickets = JSON.parse(saved);
      } else {
        localStorage.setItem("mock_support_tickets", JSON.stringify(INITIAL_TICKETS));
      }
      
      setAllTickets(currentTickets);
      
      // Update active ticket to match the newly loaded data
      setActiveTicket((prev: any) => {
        if (!prev) return null;
        const updated = currentTickets.find((t: any) => t.id === prev.id);
        return updated || null;
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
      sender: "Me",
      role: "Client",
      avatar: "https://i.pravatar.cc/150?img=11",
      time: "Just now",
      body: replyText
    };
    
    const updatedTicket = { ...activeTicket, messages: [...activeTicket.messages, newMsg] };
    const updatedTickets = allTickets.map(t => t.id === activeTicket.id ? updatedTicket : t);
    
    setAllTickets(updatedTickets);
    setActiveTicket(updatedTicket);
    setReplyText("");
    localStorage.setItem("mock_support_tickets", JSON.stringify(updatedTickets));
  };

  const handleCreateTicket = () => {
    if (!newSubject.trim() || !replyText.trim()) return;
    const newTicket = {
      id: `BM-2026-000${Math.floor(Math.random() * 900) + 100}`,
      subject: newSubject,
      client: "Me",
      status: "Pending",
      statusClass: styles.statusPending,
      messages: [
        {
          id: 1,
          sender: "Me",
          role: "Client",
          avatar: "https://i.pravatar.cc/150?img=11",
          time: "Just now",
          body: replyText
        }
      ]
    };
    
    const updatedTickets = [newTicket, ...allTickets];
    setAllTickets(updatedTickets);
    setActiveTicket(newTicket);
    setIsCreating(false);
    setReplyText("");
    setNewSubject("");
    localStorage.setItem("mock_support_tickets", JSON.stringify(updatedTickets));
  };

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
                  <h3>My Tickets</h3>
                  <button className={styles.newTicketBtn} onClick={() => { setIsCreating(true); setActiveTicket(null); }}>
                    <iconify-icon icon="lucide:plus"></iconify-icon> New
                  </button>
                </div>
                <div className={styles.ticketList}>
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                      onClick={() => { setActiveTicket(ticket); setIsCreating(false); }}
                    >
                      <div className={styles.ticketSubject}>{ticket.subject}</div>
                      <div className={styles.ticketMeta}>{ticket.id}</div>
                      <span className={`${styles.status} ${ticket.statusClass}`}>{ticket.status}</span>
                    </div>
                  ))}
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
                        placeholder="E.g. Issue with payment"
                        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Describe your issue</label>
                      <textarea 
                        className={styles.textarea} 
                        placeholder="Please provide details so we can help you..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button 
                        style={{ padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </button>
                      <button className={styles.sendBtn} onClick={handleCreateTicket}>
                        Submit Ticket
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
                      <span className={`${styles.status} ${activeTicket.statusClass}`}>{activeTicket.status}</span>
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
                      placeholder="Type your reply to Support..." 
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
                  <h3>Select a ticket or create a new one</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
