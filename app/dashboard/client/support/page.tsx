"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/components/Tickets.module.css";
import pageStyles from "@/app/dashboard/client/page.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const translations: Record<string, Record<string, string>> = {
  en: {
    myTickets: "My Tickets",
    newTicket: "New",
    noTickets: "No support tickets yet.",
    backToTickets: "Back to Tickets",
    createNewTicket: "Create New Support Ticket",
    subject: "Subject",
    subjectPlaceholder: "E.g. Issue with payment",
    describeIssue: "Describe your issue",
    issuePlaceholder: "Please provide details so we can help you...",
    cancel: "Cancel",
    submitTicket: "Submit Ticket",
    typeReply: "Type your reply to Support...",
    sendReply: "Send Reply",
    selectOrCreate: "Select a ticket or create a new one",
    searchHeader: "Search tickets...",
  },
  fr: {
    myTickets: "Mes Tickets",
    newTicket: "Nouveau",
    noTickets: "Aucun ticket d'assistance pour le moment.",
    backToTickets: "Retour aux tickets",
    createNewTicket: "Créer un Nouveau Ticket d'Assistance",
    subject: "Objet",
    subjectPlaceholder: "Ex. Problème avec un paiement",
    describeIssue: "Décrivez votre problème",
    issuePlaceholder: "Veuillez fournir des détails afin que nous puissions vous aider...",
    cancel: "Annuler",
    submitTicket: "Envoyer le Ticket",
    typeReply: "Écrivez votre réponse au Support...",
    sendReply: "Envoyer la Réponse",
    selectOrCreate: "Sélectionnez un ticket ou créez-en un nouveau",
    searchHeader: "Rechercher des tickets...",
  }
};

export default function ClientSupportPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: fetchedTickets, loading, refetch } = useFetch(() => api.getMySupportTickets(), []);
  const tickets = Array.isArray(fetchedTickets) ? fetchedTickets : [];

  React.useEffect(() => {
    if (tickets.length > 0) {
      setActiveTicket((prev: any) => {
        if (!prev) return tickets[0];
        const updated = tickets.find((t: any) => (t.db_id || t.id) === (prev.db_id || prev.id));
        return updated || tickets[0];
      });
    } else {
      setActiveTicket(null);
    }
  }, [fetchedTickets]);

  const handleSend = async () => {
    if (!replyText.trim() || !activeTicket) return;
    setSending(true);
    try {
      await api.replyMySupportTicket(activeTicket.db_id || activeTicket.id, replyText);
      setReplyText("");
      refetch();
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await api.createSupportTicket({
        subject: newSubject,
        body: replyText,
      });
      setIsCreating(false);
      setReplyText("");
      setNewSubject("");
      refetch();
      if (res) {
        setActiveTicket(res);
      }
    } catch (err) {
      console.error("Failed to create ticket", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className={pageStyles.page}>
      <div className={pageStyles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* MAIN CONTENT */}
        <div className={pageStyles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchHeader}
            searchQuery=""
            setSearchQuery={() => {}}
          />

          <div className={pageStyles.content} style={{ padding: "24px" }}>
            <div className={styles.layout}>
              {/* INBOX */}
              <div className={`${styles.inbox} ${(activeTicket || isCreating) ? styles.inboxHiddenMobile : ""}`}>
                <div className={styles.inboxHeader}>
                  <h3>{t.myTickets}</h3>
                  <button className={styles.newTicketBtn} onClick={() => { setIsCreating(true); setActiveTicket(null); }}>
                    <iconify-icon icon="lucide:plus"></iconify-icon> {t.newTicket}
                  </button>
                </div>
                <div className={styles.ticketList}>
                  {tickets.length > 0 ? (
                    tickets.map((ticket: any) => (
                      <div 
                        key={ticket.id} 
                        className={`${styles.ticketItem} ${activeTicket?.id === ticket.id ? styles.ticketItemActive : ""}`}
                        onClick={() => { setActiveTicket(ticket); setIsCreating(false); }}
                      >
                        <div className={styles.ticketSubject}>{ticket.subject}</div>
                        <div className={styles.ticketMeta}>{ticket.id}</div>
                        <span className={`${styles.status} ${ticket.statusClass}`}>{ticket.status}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 14 }}>
                      {t.noTickets}
                    </div>
                  )}
                </div>
              </div>

              {/* CHAT AREA */}
              {isCreating ? (
                <div className={`${styles.chatArea} ${!isCreating ? styles.chatAreaHiddenMobile : ""}`} style={{ padding: "24px 20px" }}>
                  <button 
                    type="button" 
                    className={styles.backToTicketsBtn} 
                    onClick={() => { setIsCreating(false); setActiveTicket(tickets[0] || null); }}
                  >
                    <iconify-icon icon="lucide:arrow-left"></iconify-icon> {t.backToTickets}
                  </button>
                  <h2 style={{ color: "#001F3F", marginBottom: 20, fontSize: "1.2rem" }}>{t.createNewTicket}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "14px" }}>{t.subject}</label>
                      <input 
                        type="text" 
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder={t.subjectPlaceholder}
                        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "14px" }}>{t.describeIssue}</label>
                      <textarea 
                        className={styles.textarea} 
                        placeholder={t.issuePlaceholder} 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button 
                        style={{ padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                        onClick={() => setIsCreating(false)}
                      >
                        {t.cancel}
                      </button>
                      <button className={styles.sendBtn} onClick={handleCreateTicket}>
                        {t.submitTicket}
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTicket ? (
                <div className={`${styles.chatArea} ${!activeTicket ? styles.chatAreaHiddenMobile : ""}`}>
                  <div className={styles.chatHeader}>
                    <button 
                      type="button" 
                      className={styles.backToTicketsBtn} 
                      onClick={() => setActiveTicket(null)}
                    >
                      <iconify-icon icon="lucide:arrow-left"></iconify-icon> {t.backToTickets}
                    </button>
                    <h2>{activeTicket.subject}</h2>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Ticket ID: {activeTicket.id}</span>
                      <span className={`${styles.status} ${activeTicket.statusClass}`}>{activeTicket.status}</span>
                    </div>
                  </div>

                  <div className={styles.thread}>
                    {activeTicket.messages?.map((msg: any) => (
                      <div key={msg.id} className={styles.message}>
                        <div className={styles.messageHeader}>
                          <img src={msg.avatar || "https://i.pravatar.cc/150?img=12"} alt={msg.sender} className={styles.avatar} />
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
                      placeholder={t.typeReply} 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className={styles.composerActions}>
                      <button className={styles.sendBtn} onClick={handleSend}>
                        <iconify-icon icon="lucide:send"></iconify-icon> {t.sendReply}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.emptyState} ${styles.chatAreaHiddenMobile}`}>
                  <iconify-icon icon="lucide:inbox"></iconify-icon>
                  <h3>{t.selectOrCreate}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

