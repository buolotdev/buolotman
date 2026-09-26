"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin-support.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function AdminSupportPage() {
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [supportRes, inquiryRes] = await Promise.allSettled([
        api.getAdminSupportTickets(),
        api.getInquiries()
      ]);

      const supportTickets = supportRes.status === "fulfilled" && Array.isArray(supportRes.value) ? supportRes.value : [];
      const inquiries = inquiryRes.status === "fulfilled" && Array.isArray(inquiryRes.value) ? inquiryRes.value : [];

      const mappedInquiries = inquiries.map((inq: any) => ({
        id: `INQ-${inq.id || inq.pk}`,
        db_id: inq.id,
        subject: `[${(inq.inquiry_type || "General").toUpperCase()} Inquiry] ${inq.company_name || inq.name}`,
        client: `${inq.name || "Client"} (${inq.email || ""})`,
        status: inq.status || "Pending",
        messages: [
          {
            id: `msg-inq-${inq.id}`,
            sender: inq.name || "Inquiry Lead",
            role: inq.inquiry_type || "Client",
            time: inq.created_at ? new Date(inq.created_at).toLocaleString() : "Recent",
            body: `Email: ${inq.email || "N/A"} | Phone: ${inq.phone || "N/A"}\n\nDetails:\n${inq.details || inq.message || "No additional details provided."}`
          }
        ]
      }));

      // Merge local inquiries if any
      let localInqs: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const contractorStored = JSON.parse(localStorage.getItem("boulotman_contractor_inquiries") || "[]");
          const teamStored = JSON.parse(localStorage.getItem("boulotman_team_inquiries") || "[]");
          const stored = [...(Array.isArray(teamStored) ? teamStored : []), ...(Array.isArray(contractorStored) ? contractorStored : [])];
          if (Array.isArray(stored)) {
            localInqs = stored.map((inq: any) => ({
              id: inq.id || `LOCAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              subject: inq.topic || `[${(inq.team_type || inq.category || "Team Request").toUpperCase()}] ${inq.name || inq.projectTitle || "Workforce Request"}`,
              client: `${inq.name || "Client"} (${inq.phone || inq.email || ""})`,
              status: inq.status || "Pending",
              messages: [
                {
                  id: `msg-${inq.id || Math.random()}`,
                  sender: inq.name || "Client Lead",
                  role: inq.team_type ? `${inq.team_type} (${inq.team_size || ""})` : (inq.clientType || "Client"),
                  time: inq.created_at ? new Date(inq.created_at).toLocaleString() : "Recent",
                  body: `Email: ${inq.email || "N/A"} | Phone: ${inq.phone || "N/A"}\nLocation: ${inq.location || inq.city || "N/A"}\nTrade: ${inq.team_type || inq.category || "N/A"} | Team Size: ${inq.team_size || "N/A"}\nDuration: ${inq.duration || "N/A"}\n\nProject Scope & Requirements:\n${inq.details || inq.description || inq.message || "N/A"}`
                }
              ]
            }));
          }
        } catch {}
      }

      const seen = new Set();
      const combined = [...localInqs, ...mappedInquiries, ...supportTickets].filter((item) => {
        if (!item || !item.id) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      setAllTickets(combined);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const tickets = allTickets;

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      setActiveTicket((prev: any) => {
        if (!prev) return tickets[0];
        const updated = tickets.find((t: any) => t.id === prev.id);
        return updated || tickets[0];
      });
    } else {
      setActiveTicket(null);
    }
  }, [allTickets]);

  const handleSend = async () => {
    if (!replyText.trim() || !activeTicket) return;
    setSending(true);
    try {
      if (activeTicket.db_id) {
        await api.replySupportTicket(activeTicket.db_id, replyText);
      }
      setReplyText("");
      fetchAll();
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"all" | "client" | "technician" | "company" | "general">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getTicketCategory = (ticket: any): "client" | "technician" | "company" | "general" => {
    const role = (ticket.role || "").toLowerCase();
    const client = (ticket.client || "").toLowerCase();
    const subject = (ticket.subject || "").toLowerCase();
    const body = (ticket.messages?.[0]?.body || "").toLowerCase();

    if (role.includes("technician") || client.includes("technician")) {
      return "technician";
    }
    if (
      role.includes("company") ||
      role.includes("team") ||
      role.includes("contractor") ||
      subject.includes("team") ||
      subject.includes("crew") ||
      subject.includes("contractor") ||
      body.includes("team type") ||
      body.includes("trade:")
    ) {
      return "company";
    }
    if (
      subject.includes("concierge") ||
      subject.includes("partnership") ||
      subject.includes("investor") ||
      subject.includes("career") ||
      role.includes("general") ||
      role.includes("lead")
    ) {
      return "general";
    }
    return "client";
  };

  const getOriginBadge = (category: string) => {
    switch (category) {
      case "technician":
        return <span className={`${styles.badgeOrigin} ${styles.badgeTechnician}`}><iconify-icon icon="lucide:wrench" /> Technician</span>;
      case "company":
        return <span className={`${styles.badgeOrigin} ${styles.badgeCompany}`}><iconify-icon icon="lucide:building-2" /> Team / Company</span>;
      case "general":
        return <span className={`${styles.badgeOrigin} ${styles.badgeGeneral}`}><iconify-icon icon="lucide:star" /> General Lead</span>;
      default:
        return <span className={`${styles.badgeOrigin} ${styles.badgeClient}`}><iconify-icon icon="lucide:user" /> Client</span>;
    }
  };

  const extractContactInfo = (ticket: any) => {
    const body = ticket?.messages?.[0]?.body || "";
    const emailMatch = body.match(/Email:\s*([^\s|,\n]+)/i) || (ticket?.client?.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/));
    const phoneMatch = body.match(/Phone(?:\/WhatsApp)?:\s*([^\s|,\n]+)/i);
    const locationMatch = body.match(/Location:\s*([^\n|]+)/i);
    const tradeMatch = body.match(/Trade(?:\/Company)?:\s*([^\n|]+)/i);
    const teamSizeMatch = body.match(/Team Size:\s*([^\n|]+)/i);
    const durationMatch = body.match(/Duration:\s*([^\n|]+)/i);

    return {
      email: emailMatch ? emailMatch[1] : null,
      phone: phoneMatch ? phoneMatch[1] : null,
      location: locationMatch ? locationMatch[1]?.trim() : null,
      trade: tradeMatch ? tradeMatch[1]?.trim() : null,
      teamSize: teamSizeMatch ? teamSizeMatch[1]?.trim() : null,
      duration: durationMatch ? durationMatch[1]?.trim() : null,
    };
  };

  // Filter tickets by Tab, Search Query, and Status
  const filteredTickets = allTickets.filter((ticket) => {
    const category = getTicketCategory(ticket);
    if (activeTab !== "all" && category !== activeTab) {
      return false;
    }

    if (statusFilter !== "all") {
      const ticketStatus = (ticket.status || "").toLowerCase();
      if (!ticketStatus.includes(statusFilter)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const subject = (ticket.subject || "").toLowerCase();
      const client = (ticket.client || "").toLowerCase();
      const body = (ticket.messages?.[0]?.body || "").toLowerCase();
      if (!subject.includes(query) && !client.includes(query) && !body.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const tabCounts = {
    all: allTickets.length,
    client: allTickets.filter((t) => getTicketCategory(t) === "client").length,
    technician: allTickets.filter((t) => getTicketCategory(t) === "technician").length,
    company: allTickets.filter((t) => getTicketCategory(t) === "company").length,
    general: allTickets.filter((t) => getTicketCategory(t) === "general").length,
  };

  const totals = {
    total: allTickets.length,
    pending: allTickets.filter((t: any) => t.status?.toLowerCase().includes("pending")).length,
    awaiting: allTickets.filter((t: any) => t.status?.toLowerCase().includes("awaiting")).length,
    resolved: allTickets.filter((t: any) => t.status?.toLowerCase().includes("resolved")).length,
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return styles.statusPending;
      case "awaiting response": return styles.statusAwaiting;
      case "resolved": return styles.statusResolved;
      default: return styles.statusPending;
    }
  };

  const activeContact = activeTicket ? extractContactInfo(activeTicket) : null;
  const activeCategory = activeTicket ? getTicketCategory(activeTicket) : "client";

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
        {/* INBOX LIST WITH CATEGORY TABS & SEARCH */}
        <div className={styles.inboxCard}>
          <div className={styles.inboxHeader}>
            <h3 className={styles.inboxTitle}>
              <iconify-icon icon="lucide:mail" style={{ color: "#ff4500" }} /> Ticket Inbox ({filteredTickets.length})
            </h3>
          </div>

          {/* SEPARATE CATEGORY TABS */}
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${activeTab === "all" ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <iconify-icon icon="lucide:layout-grid" /> All <span className={styles.tabBadge}>{tabCounts.all}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === "client" ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveTab("client")}
            >
              <iconify-icon icon="lucide:user" /> Clients <span className={styles.tabBadge}>{tabCounts.client}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === "technician" ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveTab("technician")}
            >
              <iconify-icon icon="lucide:wrench" /> Technicians <span className={styles.tabBadge}>{tabCounts.technician}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === "company" ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveTab("company")}
            >
              <iconify-icon icon="lucide:building-2" /> Teams & Companies <span className={styles.tabBadge}>{tabCounts.company}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeTab === "general" ? styles.categoryTabActive : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <iconify-icon icon="lucide:star" /> Leads <span className={styles.tabBadge}>{tabCounts.general}</span>
            </button>
          </div>

          {/* SEARCH & STATUS FILTER ROW */}
          <div className={styles.searchAndFilterRow}>
            <div className={styles.searchInputWrapper}>
              <iconify-icon icon="lucide:search" className={styles.searchInputIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search name, phone, trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className={styles.statusFilterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="awaiting">Awaiting</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* TICKET LIST */}
          <div className={styles.ticketList}>
            {loading ? (
              <p style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading tickets...</p>
            ) : filteredTickets.length === 0 ? (
              <p style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>No tickets found in this category.</p>
            ) : (
              filteredTickets.map((ticket: any) => {
                const category = getTicketCategory(ticket);
                return (
                  <div
                    key={ticket.id}
                    className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                    onClick={() => setActiveTicket(ticket)}
                  >
                    <div className={styles.ticketTopRow}>
                      <div className={styles.ticketSubject}>{ticket.subject || "Support Inquiry"}</div>
                    </div>
                    <div className={styles.ticketMeta}>
                      <iconify-icon icon="lucide:user" /> {ticket.client || "Marketplace User"}
                    </div>
                    <div className={styles.ticketFooterRow}>
                      {getOriginBadge(category)}
                      <span className={`${styles.status} ${getStatusClass(ticket.status)}`}>
                        {ticket.status || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT / DETAIL THREAD */}
        <div className={styles.chatCard}>
          {activeTicket ? (
            <>
              <div className={styles.chatHeader}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {getOriginBadge(activeCategory)}
                    <span style={{ fontSize: 12, color: "#64748b" }}>ID: #{activeTicket.id}</span>
                  </div>
                  <h2 className={styles.chatTitle}>{activeTicket.subject}</h2>
                </div>
                <span className={`${styles.status} ${getStatusClass(activeTicket.status)}`}>
                  {activeTicket.status || "Pending"}
                </span>
              </div>

              {/* QUICK ACTION BAR */}
              <div className={styles.quickActionsBar}>
                {activeContact?.email && (
                  <a href={`mailto:${activeContact.email}`} className={styles.quickActionBtn}>
                    <iconify-icon icon="lucide:mail" /> Email ({activeContact.email})
                  </a>
                )}
                {activeContact?.phone && (
                  <a href={`tel:${activeContact.phone}`} className={styles.quickActionBtn}>
                    <iconify-icon icon="lucide:phone" /> Call ({activeContact.phone})
                  </a>
                )}
                {activeContact?.phone && (
                  <a
                    href={`https://wa.me/${activeContact.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.quickActionBtn}
                    style={{ background: "#25D366", color: "#ffffff", borderColor: "#25D366" }}
                  >
                    <iconify-icon icon="lucide:message-circle" /> WhatsApp
                  </a>
                )}
              </div>

              {/* STRUCTURED SPECIFICATION BOX FOR TEAM / CONTRACTOR REQUESTS */}
              {(activeContact?.trade || activeContact?.teamSize || activeContact?.location || activeContact?.duration) && (
                <div className={styles.specsBox}>
                  {activeContact.trade && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Primary Trade</span>
                      <span className={styles.specVal}>{activeContact.trade}</span>
                    </div>
                  )}
                  {activeContact.teamSize && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Team Size</span>
                      <span className={styles.specVal}>{activeContact.teamSize}</span>
                    </div>
                  )}
                  {activeContact.location && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Location / City</span>
                      <span className={styles.specVal}>{activeContact.location}</span>
                    </div>
                  )}
                  {activeContact.duration && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Project Duration</span>
                      <span className={styles.specVal}>{activeContact.duration}</span>
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGES THREAD */}
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
                    <div className={styles.messageBody} style={{ whiteSpace: "pre-line" }}>{msg.body}</div>
                  </div>
                ))}
              </div>

              {/* REPLY COMPOSER */}
              <div className={styles.composer}>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Type an official admin response or follow-up note..."
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
