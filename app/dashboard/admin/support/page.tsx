"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin-support.module.css";
import { api } from "@/app/lib/api";

export default function AdminSupportPage() {
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "concierge"
    | "team"
    | "partnership"
    | "location"
    | "dispute"
    | "safety"
    | "community"
    | "contractor"
    | "client"
    | "technician"
    | "general"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // File Preview Lightbox State
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    size?: number;
    type?: string;
    data?: string;
  } | null>(null);

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
        attached_files: inq.attached_files || [],
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
          const conciergeStored = JSON.parse(localStorage.getItem("boulotman_concierge_inquiries") || "[]");
          const teamStored = JSON.parse(localStorage.getItem("boulotman_team_inquiries") || "[]");
          const partnershipStored = JSON.parse(localStorage.getItem("boulotman_partnership_inquiries") || "[]");
          const locationStored = JSON.parse(localStorage.getItem("boulotman_location_inquiries") || "[]");
          const disputeStored = JSON.parse(localStorage.getItem("boulotman_dispute_inquiries") || "[]");
          const safetyStored = JSON.parse(localStorage.getItem("boulotman_safety_inquiries") || "[]");
          const communityStored = JSON.parse(localStorage.getItem("boulotman_community_inquiries") || "[]");
          const contractorStored = JSON.parse(localStorage.getItem("boulotman_contractor_inquiries") || "[]");

          const stored = [
            ...(Array.isArray(conciergeStored) ? conciergeStored : []),
            ...(Array.isArray(teamStored) ? teamStored : []),
            ...(Array.isArray(partnershipStored) ? partnershipStored : []),
            ...(Array.isArray(locationStored) ? locationStored : []),
            ...(Array.isArray(disputeStored) ? disputeStored : []),
            ...(Array.isArray(safetyStored) ? safetyStored : []),
            ...(Array.isArray(communityStored) ? communityStored : []),
            ...(Array.isArray(contractorStored) ? contractorStored : [])
          ];

          if (Array.isArray(stored)) {
            localInqs = stored.map((inq: any) => ({
              id: inq.id || `LOCAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              subject: inq.topic || `[${(inq.category || inq.team_type || "Inquiry").toUpperCase()}] ${inq.title || inq.name || inq.projectTitle || "Service Request"}`,
              client: `${inq.name || "Lead"} (${inq.phone || inq.email || ""})`,
              status: inq.status || "Pending",
              attached_files: inq.attached_files || [],
              messages: [
                {
                  id: `msg-${inq.id || Math.random()}`,
                  sender: inq.name || "Client Lead",
                  role: inq.category ? inq.category : (inq.team_type ? `${inq.team_type}` : (inq.clientType || "Platform User")),
                  time: inq.created_at ? new Date(inq.created_at).toLocaleString() : "Recent",
                  body: inq.details ? inq.details : `Email: ${inq.email || "N/A"} | Phone: ${inq.phone || "N/A"}\nLocation: ${inq.city || inq.location || "N/A"}\nCategory: ${inq.category || inq.team_type || "N/A"}\n\nProject Scope & Requirements:\n${inq.description || inq.message || "N/A"}`
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

  const getTicketCategory = (ticket: any):
    | "concierge"
    | "team"
    | "partnership"
    | "location"
    | "dispute"
    | "safety"
    | "community"
    | "contractor"
    | "client"
    | "technician"
    | "general" => {
    const role = (ticket.role || "").toLowerCase();
    const client = (ticket.client || "").toLowerCase();
    const subject = (ticket.subject || "").toLowerCase();
    const body = (ticket.messages?.[0]?.body || "").toLowerCase();

    if (subject.includes("concierge") || role.includes("concierge") || body.includes("vip concierge") || body.includes("concierge request")) {
      return "concierge";
    }
    if (
      subject.includes("team request") ||
      subject.includes("build a team") ||
      subject.includes("squad") ||
      role.includes("team request") ||
      body.includes("team scale") ||
      body.includes("team size:") ||
      body.includes("build a team")
    ) {
      return "team";
    }
    if (
      subject.includes("partnership") ||
      subject.includes("institutional") ||
      role.includes("partnership") ||
      body.includes("partnership track") ||
      body.includes("organization type:")
    ) {
      return "partnership";
    }
    if (
      subject.includes("city expansion") ||
      subject.includes("expansion geography") ||
      body.includes("target expansion geography") ||
      body.includes("city champion") ||
      body.includes("requested trades:")
    ) {
      return "location";
    }
    if (
      subject.includes("dispute") ||
      subject.includes("escrow mediation") ||
      body.includes("claimant profile") ||
      body.includes("dispute category:") ||
      body.includes("disputed amount:")
    ) {
      return "dispute";
    }
    if (
      subject.includes("safety") ||
      subject.includes("trust & safety") ||
      subject.includes("threat") ||
      body.includes("threat classification") ||
      body.includes("risk level:") ||
      body.includes("safety concern")
    ) {
      return "safety";
    }
    if (
      subject.includes("community") ||
      subject.includes("guideline") ||
      body.includes("violation nature") ||
      body.includes("anonymous community member")
    ) {
      return "community";
    }
    if (
      subject.includes("contractor") ||
      subject.includes("subcontract") ||
      role.includes("contractor") ||
      role.includes("company") ||
      client.includes("company")
    ) {
      return "contractor";
    }
    if (role.includes("technician") || client.includes("technician")) {
      return "technician";
    }
    if (
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
      case "concierge":
        return <span className={`${styles.badgeOrigin} ${styles.badgeConcierge}`}><iconify-icon icon="lucide:sparkles" /> VIP Concierge</span>;
      case "team":
        return <span className={`${styles.badgeOrigin} ${styles.badgeTeam}`}><iconify-icon icon="lucide:users" /> Build a Team</span>;
      case "partnership":
        return <span className={`${styles.badgeOrigin} ${styles.badgePartnership}`}><iconify-icon icon="lucide:handshake" /> Strategic Partner</span>;
      case "location":
        return <span className={`${styles.badgeOrigin} ${styles.badgeLocation}`}><iconify-icon icon="lucide:map-pin" /> City Request</span>;
      case "dispute":
        return <span className={`${styles.badgeOrigin} ${styles.badgeDispute}`}><iconify-icon icon="lucide:scale" /> Dispute / Escrow</span>;
      case "safety":
        return <span className={`${styles.badgeOrigin} ${styles.badgeSafety}`}><iconify-icon icon="lucide:shield-alert" /> Trust & Safety</span>;
      case "community":
        return <span className={`${styles.badgeOrigin} ${styles.badgeCommunity}`}><iconify-icon icon="lucide:flag" /> Community Report</span>;
      case "contractor":
        return <span className={`${styles.badgeOrigin} ${styles.badgeContractor}`}><iconify-icon icon="lucide:building-2" /> Contractor</span>;
      case "technician":
        return <span className={`${styles.badgeOrigin} ${styles.badgeTechnician}`}><iconify-icon icon="lucide:wrench" /> Technician</span>;
      case "general":
        return <span className={`${styles.badgeOrigin} ${styles.badgeGeneral}`}><iconify-icon icon="lucide:mail" /> General Lead</span>;
      default:
        return <span className={`${styles.badgeOrigin} ${styles.badgeClient}`}><iconify-icon icon="lucide:user" /> Client</span>;
    }
  };

  const extractContactInfo = (ticket: any) => {
    const body = ticket?.messages?.[0]?.body || "";
    const emailMatch = body.match(/Email(?:\s*Address)?:\s*([^\s|,\n]+)/i) || (ticket?.client?.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/));
    const phoneMatch = body.match(/Phone(?:\/WhatsApp)?:\s*([^\s|,\n]+)/i);
    const locationMatch = body.match(/(?:Location|City \/ Neighborhood|Location \/ City|Target City \/ Urban Area|Country \/ Region|Location \/ Worksite):\s*([^\n|]+)/i);
    const tradeMatch = body.match(/(?:Category|Primary Trade|Trade(?:\/Company)?|Requested Trades|Violation Nature|Concern Category|Dispute Category):\s*([^\n|]+)/i);
    const teamSizeMatch = body.match(/(?:Team Size|Estimated Scale \/ Scope|Estimated Demand Volume):\s*([^\n|]+)/i);
    const durationMatch = body.match(/(?:Deployment Duration|Duration|Target Launch Timeframe):\s*([^\n|]+)/i);
    const requestTypeMatch = body.match(/(?:Request Type|Partnership Track|Organization Type|Dispute Classification):\s*([^\n|]+)/i);
    const pmLeadMatch = body.match(/On-Site PM \/ Team Lead:\s*([^\n|]+)/i);
    const rolesMatch = body.match(/(?:Roles Needed|Offending Party Role|Role of Offending Party):\s*([^\n|]+)/i);
    const arrangementMatch = body.match(/Working Arrangement:\s*([^\n|]+)/i);
    const equipmentMatch = body.match(/Equipment Provision:\s*([^\n|]+)/i);
    const siteReadinessMatch = body.match(/Site Readiness:\s*([^\n|]+)/i);
    
    // Concierge & Enterprise specific fields
    const projectTitleMatch = body.match(/(?:Project Title|Organization \/ Company Legal Name|Reported User \/ Entity|Reported Username \/ Company|Reported Counterparty):\s*([^\n|]+)/i);
    const locationTypeMatch = body.match(/(?:Location Mode|Location Type|District \/ Sub-region):\s*([^\n|]+)/i);
    const accessMatch = body.match(/(?:Access Instructions|Preferred Meeting|Preferred Contact):\s*([^\n|]+)/i);
    const sitePhaseMatch = body.match(/Site Phase:\s*([^\n|]+)/i);
    const tasksMatch = body.match(/Tasks:\s*([^\n|]+)/i);
    const blueprintsMatch = body.match(/(?:Plans & Blueprints|Official Website|Task \/ Contract Reference|Task, Project, or Order Reference ID|Task \/ Project ID):\s*([^\n|]+)/i);
    const techSystemsMatch = body.match(/(?:Tech Systems|Disputed Amount|Desired Outcome):\s*([^\n|]+)/i);
    const techAccessMatch = body.match(/(?:Access|Escrow Status):\s*([^\n|]+)/i);
    const urgencyMatch = body.match(/(?:Urgency Level|Urgency|Severity|Risk Level|Threat \/ Severity Level):\s*([^\n|]+)/i);
    const updatesMatch = body.match(/(?:Updates Frequency|Approximate Time|Time of Incident|Approximate Date):\s*([^\n|]+)/i);
    const budgetMatch = body.match(/(?:Estimated Budget|Budget \/ Investment Tier|Disputed Amount):\s*([^\n|]+)/i);
    const attachmentsMatch = body.match(/Attachments:\s*([^\n|]+)/i);
    const championMatch = body.match(/Local Champion \/ Hub Partner:\s*([^\n|]+)/i);

    return {
      email: emailMatch ? emailMatch[1] : null,
      phone: phoneMatch ? phoneMatch[1] : null,
      location: locationMatch ? locationMatch[1]?.trim() : null,
      trade: tradeMatch ? tradeMatch[1]?.trim() : null,
      teamSize: teamSizeMatch ? teamSizeMatch[1]?.trim() : null,
      duration: durationMatch ? durationMatch[1]?.trim() : null,
      requestType: requestTypeMatch ? requestTypeMatch[1]?.trim() : null,
      pmLead: pmLeadMatch ? pmLeadMatch[1]?.trim() : null,
      roles: rolesMatch ? rolesMatch[1]?.trim() : null,
      arrangement: arrangementMatch ? arrangementMatch[1]?.trim() : null,
      equipment: equipmentMatch ? equipmentMatch[1]?.trim() : null,
      siteReadiness: siteReadinessMatch ? siteReadinessMatch[1]?.trim() : null,
      projectTitle: projectTitleMatch ? projectTitleMatch[1]?.trim() : null,
      locationType: locationTypeMatch ? locationTypeMatch[1]?.trim() : null,
      access: accessMatch ? accessMatch[1]?.trim() : null,
      sitePhase: sitePhaseMatch ? sitePhaseMatch[1]?.trim() : null,
      tasks: tasksMatch ? tasksMatch[1]?.trim() : null,
      blueprints: blueprintsMatch ? blueprintsMatch[1]?.trim() : null,
      techSystems: techSystemsMatch ? techSystemsMatch[1]?.trim() : null,
      techAccess: techAccessMatch ? techAccessMatch[1]?.trim() : null,
      urgency: urgencyMatch ? urgencyMatch[1]?.trim() : null,
      updates: updatesMatch ? updatesMatch[1]?.trim() : null,
      budget: budgetMatch ? budgetMatch[1]?.trim() : null,
      attachments: attachmentsMatch ? attachmentsMatch[1]?.trim() : null,
      champion: championMatch ? championMatch[1]?.trim() : null,
    };
  };

  const downloadFile = (file: { name: string; data?: string; type?: string }) => {
    if (file.data) {
      const a = document.createElement("a");
      a.href = file.data;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob([`Attachment Record: ${file.name}\nTicket: ${activeTicket?.subject || "Support Inquiry"}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.endsWith(".txt") ? file.name : `${file.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getCombinedAttachedFiles = (ticket: any, contact: any) => {
    const list: Array<{ name: string; size?: number; type?: string; data?: string }> = [];
    const seenNames = new Set<string>();

    if (Array.isArray(ticket?.attached_files)) {
      ticket.attached_files.forEach((f: any) => {
        if (typeof f === "string" && f.trim()) {
          if (!seenNames.has(f)) {
            seenNames.add(f);
            list.push({ name: f });
          }
        } else if (f && typeof f === "object" && f.name) {
          if (!seenNames.has(f.name)) {
            seenNames.add(f.name);
            list.push(f);
          }
        }
      });
    }

    if (contact?.attachments && contact.attachments !== "None attached") {
      const parsed = contact.attachments.split(",").map((s: string) => s.trim()).filter(Boolean);
      parsed.forEach((fname: string) => {
        if (!seenNames.has(fname)) {
          seenNames.add(fname);
          list.push({ name: fname });
        }
      });
    }

    return list;
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
    concierge: allTickets.filter((t) => getTicketCategory(t) === "concierge").length,
    team: allTickets.filter((t) => getTicketCategory(t) === "team").length,
    partnership: allTickets.filter((t) => getTicketCategory(t) === "partnership").length,
    location: allTickets.filter((t) => getTicketCategory(t) === "location").length,
    dispute: allTickets.filter((t) => getTicketCategory(t) === "dispute").length,
    safety: allTickets.filter((t) => getTicketCategory(t) === "safety").length,
    community: allTickets.filter((t) => getTicketCategory(t) === "community").length,
    contractor: allTickets.filter((t) => getTicketCategory(t) === "contractor").length,
    client: allTickets.filter((t) => getTicketCategory(t) === "client").length,
    technician: allTickets.filter((t) => getTicketCategory(t) === "technician").length,
    general: allTickets.filter((t) => getTicketCategory(t) === "general").length,
  };

  const totals = {
    total: allTickets.length,
    pending: allTickets.filter((t: any) => t.status?.toLowerCase().includes("pending") || t.status?.toLowerCase().includes("open")).length,
    awaiting: allTickets.filter((t: any) => t.status?.toLowerCase().includes("awaiting")).length,
    resolved: allTickets.filter((t: any) => t.status?.toLowerCase().includes("resolved")).length,
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "open":
        return styles.statusPending;
      case "awaiting response":
      case "awaiting":
        return styles.statusAwaiting;
      case "resolved":
        return styles.statusResolved;
      default:
        return styles.statusPending;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (filteredTickets && filteredTickets.length > 0) {
      setActiveTicket((prev: any) => {
        if (!prev) return filteredTickets[0];
        const isCurrentInFiltered = filteredTickets.some((t: any) => t.id === prev.id);
        if (isCurrentInFiltered) {
          const updated = filteredTickets.find((t: any) => t.id === prev.id);
          return updated || prev;
        }
        return filteredTickets[0];
      });
    } else {
      setActiveTicket(null);
    }
  }, [activeTab, searchQuery, statusFilter, allTickets]);

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

  const activeContact = activeTicket ? extractContactInfo(activeTicket) : null;
  const activeCategory = activeTicket ? getTicketCategory(activeTicket) : "client";
  const attachedFilesList = activeTicket ? getCombinedAttachedFiles(activeTicket, activeContact) : [];

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
            Review customer inquiries, partnership proposals, city expansion requests, dispute mediation cases, and safety reports.
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

      {/* FULL WIDTH PROMINENT TOP CATEGORY NAVIGATION BAR WITH HORIZONTAL SCROLL */}
      <div className={styles.topNavContainer}>
        <button
          className={`${styles.topNavBtn} ${activeTab === "all" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <iconify-icon icon="lucide:layout-grid" /> All Inquiries <span className={styles.topNavBadge}>{tabCounts.all}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "concierge" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("concierge")}
        >
          <iconify-icon icon="lucide:sparkles" /> VIP Concierge <span className={styles.topNavBadge}>{tabCounts.concierge}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "team" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("team")}
        >
          <iconify-icon icon="lucide:users" /> Build a Team <span className={styles.topNavBadge}>{tabCounts.team}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "partnership" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("partnership")}
        >
          <iconify-icon icon="lucide:handshake" /> Partnerships <span className={styles.topNavBadge}>{tabCounts.partnership}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "location" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("location")}
        >
          <iconify-icon icon="lucide:map-pin" /> City Requests <span className={styles.topNavBadge}>{tabCounts.location}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "dispute" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("dispute")}
        >
          <iconify-icon icon="lucide:scale" /> Dispute / Escrow <span className={styles.topNavBadge}>{tabCounts.dispute}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "safety" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("safety")}
        >
          <iconify-icon icon="lucide:shield-alert" /> Trust &amp; Safety <span className={styles.topNavBadge}>{tabCounts.safety}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "community" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("community")}
        >
          <iconify-icon icon="lucide:flag" /> Community Reports <span className={styles.topNavBadge}>{tabCounts.community}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "contractor" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("contractor")}
        >
          <iconify-icon icon="lucide:building-2" /> Contractors &amp; Companies <span className={styles.topNavBadge}>{tabCounts.contractor}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "client" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("client")}
        >
          <iconify-icon icon="lucide:user" /> Client Tickets <span className={styles.topNavBadge}>{tabCounts.client}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "technician" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("technician")}
        >
          <iconify-icon icon="lucide:wrench" /> Technician Support <span className={styles.topNavBadge}>{tabCounts.technician}</span>
        </button>
        <button
          className={`${styles.topNavBtn} ${activeTab === "general" ? styles.topNavBtnActive : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <iconify-icon icon="lucide:mail" /> General Leads <span className={styles.topNavBadge}>{tabCounts.general}</span>
        </button>
      </div>

      {/* SUPPORT HELPDESK INBOX & CHAT */}
      <div className={styles.supportLayout}>
        {/* INBOX LIST WITH SEARCH & STATUS FILTER */}
        <div className={styles.inboxCard}>
          <div className={styles.inboxHeader}>
            <h3 className={styles.inboxTitle}>
              <iconify-icon icon="lucide:mail" style={{ color: "#ff4500" }} /> Ticket Inbox ({filteredTickets.length})
            </h3>
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
              <option value="open">Open</option>
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
              filteredTickets.map((t: any) => {
                const cat = getTicketCategory(t);
                const isSelected = activeTicket?.id === t.id;
                const contact = extractContactInfo(t);

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`${styles.ticketItem} ${isSelected ? styles.ticketItemActive : ""}`}
                  >
                    <div className={styles.ticketTopRow}>
                      <span className={styles.ticketSubject}>{t.subject}</span>
                    </div>

                    <div className={styles.ticketMeta} style={{ marginTop: 4 }}>
                      <iconify-icon icon="lucide:user" /> {t.client}
                    </div>

                    {contact?.location && (
                      <div className={styles.ticketMeta} style={{ marginTop: 2 }}>
                        <iconify-icon icon="lucide:map-pin" /> {contact.location}
                      </div>
                    )}

                    <div className={styles.ticketFooterRow}>
                      {getOriginBadge(cat)}
                      <span className={`${styles.status} ${getStatusClass(t.status)}`}>
                        {t.status || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT / TICKET DETAILS VIEW */}
        <div className={styles.chatArea}>
          {activeTicket ? (
            <div className={styles.chatCard}>
              <div className={styles.chatHeader}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {getOriginBadge(activeCategory)}
                    <span className={`${styles.status} ${getStatusClass(activeTicket.status)}`}>
                      {activeTicket.status || "Pending"}
                    </span>
                  </div>
                  <h2 className={styles.chatTitle}>{activeTicket.subject}</h2>
                  <div className={styles.ticketMeta} style={{ marginTop: 4 }}>
                    <span>Case ID: <strong>{activeTicket.id}</strong></span> • <span>Requester: <strong>{activeTicket.client}</strong></span>
                  </div>
                </div>
              </div>

              {/* QUICK DIRECT CONTACT ACTIONS */}
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

              {/* STRUCTURED SPECIFICATION BOX FOR ALL FORMS */}
              {(activeContact?.projectTitle || activeContact?.trade || activeContact?.teamSize || activeContact?.location || activeContact?.duration || activeContact?.requestType || activeContact?.roles || activeContact?.sitePhase || activeContact?.techSystems || activeContact?.budget || activeContact?.urgency || activeContact?.champion || attachedFilesList.length > 0) && (
                <div className={styles.specsBox}>
                  {activeContact?.projectTitle && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1" }}>
                      <span className={styles.specLabel}>Project / Entity / Subject Name</span>
                      <span className={styles.specVal} style={{ fontWeight: 700, color: "#001F3F", fontSize: 14 }}>{activeContact.projectTitle}</span>
                    </div>
                  )}
                  {activeContact?.trade && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Category / Trade / Nature</span>
                      <span className={styles.specVal}>{activeContact.trade}</span>
                    </div>
                  )}
                  {activeContact?.location && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>City / Location / Region</span>
                      <span className={styles.specVal}>{activeContact.location}</span>
                    </div>
                  )}
                  {activeContact?.locationType && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Location / Sub-Region Mode</span>
                      <span className={styles.specVal}>{activeContact.locationType}</span>
                    </div>
                  )}
                  {activeContact?.requestType && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Request / Track / Classification</span>
                      <span className={styles.specVal}>{activeContact.requestType}</span>
                    </div>
                  )}
                  {activeContact?.teamSize && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Scale / Volume / Scope</span>
                      <span className={styles.specVal}>{activeContact.teamSize}</span>
                    </div>
                  )}
                  {activeContact?.budget && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Budget / Disputed Value</span>
                      <span className={styles.specVal} style={{ fontWeight: 700, color: "#001F3F" }}>{activeContact.budget}</span>
                    </div>
                  )}
                  {activeContact?.urgency && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Urgency / Risk Severity</span>
                      <span className={styles.specVal} style={{ color: activeContact.urgency.includes("Emergency") || activeContact.urgency.includes("Risk") || activeContact.urgency.includes("🚨") ? "#dc2626" : "#0f172a", fontWeight: 700 }}>
                        {activeContact.urgency}
                      </span>
                    </div>
                  )}
                  {activeContact?.duration && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Duration / Launch Timeframe</span>
                      <span className={styles.specVal}>{activeContact.duration}</span>
                    </div>
                  )}
                  {activeContact?.champion && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1" }}>
                      <span className={styles.specLabel}>City Champion Status</span>
                      <span className={styles.specVal} style={{ color: activeContact.champion.includes("Yes") ? "#16a34a" : "#0f172a", fontWeight: 700 }}>
                        🌟 {activeContact.champion}
                      </span>
                    </div>
                  )}
                  {activeContact?.roles && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1" }}>
                      <span className={styles.specLabel}>Roles / Offending Party Details</span>
                      <span className={styles.specVal} style={{ fontWeight: 600, color: "#1e293b" }}>{activeContact.roles}</span>
                    </div>
                  )}
                  {activeContact?.blueprints && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1" }}>
                      <span className={styles.specLabel}>Task / Contract Reference / Portal</span>
                      <span className={styles.specVal}>{activeContact.blueprints}</span>
                    </div>
                  )}
                  {activeContact?.techSystems && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1" }}>
                      <span className={styles.specLabel}>Tech Systems / Desired Outcome</span>
                      <span className={styles.specVal} style={{ fontWeight: 600, color: "#1e293b" }}>{activeContact.techSystems}</span>
                    </div>
                  )}
                  {activeContact?.access && (
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Meeting / Access Preference</span>
                      <span className={styles.specVal}>{activeContact.access}</span>
                    </div>
                  )}

                  {/* CLICKABLE EXPANDABLE ATTACHMENTS */}
                  {attachedFilesList.length > 0 && (
                    <div className={styles.specItem} style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                      <span className={styles.specLabel}>Attached Documentation &amp; Evidence (Click to Open &amp; Download)</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
                        {attachedFilesList.map((file, idx) => {
                          const isImg = file.type?.includes("image") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
                          const isPdf = file.type?.includes("pdf") || /\.pdf$/i.test(file.name);

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className={styles.attachmentBadge}
                              title="Click to expand, preview and download"
                            >
                              <iconify-icon icon={isImg ? "lucide:image" : isPdf ? "lucide:file-text" : "lucide:file"} />
                              <span>{file.name}</span>
                              <iconify-icon icon="lucide:maximize-2" className={styles.actionIcon} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGES THREAD */}
              <div className={styles.thread}>
                {(activeTicket.messages || []).map((msg: any) => {
                  const bodyText = msg.body || "";
                  const isIntake = bodyText.includes("=== 1.") || bodyText.includes("[VIP Concierge Request]") || bodyText.includes("[Build a Team Request]") || bodyText.includes("=== Scope & Additional Requirements ===") || bodyText.includes("=== 4.");
                  const scopeMatch = isIntake ? (
                    bodyText.match(/(?:Scope & Additional Requirements|Project Scope & Requirements|Description|Statement of Facts|Objectives & Requirements|Regional Insights & Comments|Incident Statement & Chronology):\s*([\s\S]*?)(?=\n===|$)/i) ||
                    bodyText.match(/Details:\s*([\s\S]*?)(?=\n===|$)/i)
                  ) : null;
                  const scopeText = scopeMatch ? scopeMatch[1]?.trim() : null;

                  return (
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
                          <div className={styles.messageSender}>{msg.sender}</div>
                          <div className={styles.messageRole}>{msg.role || "Requester"}</div>
                        </div>
                        <div className={styles.messageTime}>{msg.time}</div>
                      </div>

                      {scopeText ? (
                        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
                          <strong style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                            Submission Statement / Scope:
                          </strong>
                          <div style={{ whiteSpace: "pre-wrap", color: "#1e293b", fontSize: 13.5, lineHeight: 1.6 }}>
                            {scopeText}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.messageBody}>{bodyText}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* REPLY FORM */}
              <div className={styles.replyArea}>
                <textarea
                  className={styles.replyTextarea}
                  placeholder="Type an official reply or resolution note to the requester..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    className={styles.replySubmitBtn}
                    onClick={handleSend}
                    disabled={sending || !replyText.trim()}
                  >
                    {sending ? "Sending..." : "Send Official Reply"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:message-square" style={{ fontSize: 48, color: "#cbd5e1" }} />
              <h3>Select a ticket or inquiry</h3>
              <p>Choose an item from the inbox to review details, structured specifications, and send responses.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= FILE PREVIEW & DOWNLOAD LIGHTBOX MODAL ================= */}
      {previewFile && (
        <div className={styles.filePreviewOverlay} onClick={() => setPreviewFile(null)}>
          <div className={styles.filePreviewModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.filePreviewHeader}>
              <div className={styles.filePreviewTitle}>
                <iconify-icon
                  icon={
                    previewFile.type?.includes("image") || /\.(jpg|jpeg|png|webp|gif)$/i.test(previewFile.name)
                      ? "lucide:image"
                      : previewFile.type?.includes("pdf") || /\.pdf$/i.test(previewFile.name)
                      ? "lucide:file-text"
                      : "lucide:file"
                  }
                  style={{ color: "#ff4500", fontSize: 20 }}
                />
                <span>{previewFile.name}</span>
              </div>
              <div className={styles.filePreviewActions}>
                <button
                  type="button"
                  className={styles.downloadBtn}
                  onClick={() => downloadFile(previewFile)}
                >
                  <iconify-icon icon="lucide:download" /> Download File
                </button>
                <button
                  type="button"
                  className={styles.closePreviewBtn}
                  onClick={() => setPreviewFile(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.filePreviewBody}>
              {previewFile.data && (previewFile.type?.includes("image") || /\.(jpg|jpeg|png|webp|gif)$/i.test(previewFile.name)) ? (
                <img
                  src={previewFile.data}
                  alt={previewFile.name}
                  className={styles.previewImage}
                />
              ) : previewFile.data && (previewFile.type?.includes("pdf") || /\.pdf$/i.test(previewFile.name)) ? (
                <iframe
                  src={previewFile.data}
                  title={previewFile.name}
                  className={styles.previewIframe}
                />
              ) : (
                <div className={styles.previewGenericDoc}>
                  <iconify-icon
                    icon={
                      previewFile.name.endsWith(".pdf")
                        ? "lucide:file-text"
                        : /\.(png|jpg|jpeg|webp)$/i.test(previewFile.name)
                        ? "lucide:image"
                        : "lucide:file"
                    }
                    style={{ fontSize: 64, color: "#001F3F" }}
                  />
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", color: "#001F3F", fontSize: 18 }}>{previewFile.name}</h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                      Document attachment record registered with this case.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.downloadBtn}
                    onClick={() => downloadFile(previewFile)}
                    style={{ marginTop: 8 }}
                  >
                    <iconify-icon icon="lucide:download" /> Download Attachment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
