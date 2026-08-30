"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";

import layoutStyles from "../page.module.css";
import styles from "./quotes.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Quote Management",
    welcomeTitle: "Quote Requests Inbox",
    welcomeSubtitle: "Manage incoming requests for quotations from clients.",
    totalQuotes: "Total Quotes",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    incomingQuoteRequests: "Incoming Quote Requests",
    loadingQuotes: "Loading quotes...",
    thClient: "Client",
    thService: "Service",
    thBudget: "Budget",
    thDeadline: "Deadline",
    thLocation: "Location",
    thPriority: "Priority",
    thStatus: "Status",
    thAction: "Action",
    view: "View",
    noQuotesFound: "No quote requests found.",
    noQuotesSubtitle: "When clients request quotes for your services, they will appear here.",
    quoteDetailsTitle: "Quote Request Details",
    clientInfo: "Client Information",
    projectSummary: "Project Summary",
    budgetTimeline: "Budget & Timeline",
    location: "Location",
    technicalDetails: "Technical Details",
    attachments: "Attachments",
    noAttachments: "No attachments.",
    acceptAndStart: "Accept Quote & Start Project",
    accepting: "Accepting...",
    rejectQuote: "Reject Quote",
    messageClient: "Message Client",
  },
  fr: {
    eyebrow: "Gestion des Devis",
    welcomeTitle: "Boîte de Réception des Demandes de Devis",
    welcomeSubtitle: "Gérez les demandes de devis entrantes des clients.",
    totalQuotes: "Total des Devis",
    pending: "En attente",
    accepted: "Accepté",
    rejected: "Refusé",
    incomingQuoteRequests: "Demandes de Devis Entrantes",
    loadingQuotes: "Chargement des devis...",
    thClient: "Client",
    thService: "Service",
    thBudget: "Budget",
    thDeadline: "Échéance",
    thLocation: "Lieu",
    thPriority: "Priorité",
    thStatus: "Statut",
    thAction: "Action",
    view: "Consulter",
    noQuotesFound: "Aucune demande de devis trouvée.",
    noQuotesSubtitle: "Lorsque les clients demanderont des devis pour vos prestations, ils apparaîtront ici.",
    quoteDetailsTitle: "Détails de la Demande de Devis",
    clientInfo: "Informations Client",
    projectSummary: "Résumé du Projet",
    budgetTimeline: "Budget & Échéancier",
    location: "Localisation",
    technicalDetails: "Détails Techniques",
    attachments: "Pièces Jointes",
    noAttachments: "Aucune pièce jointe.",
    acceptAndStart: "Accepter le Devis & Démarrer le Projet",
    accepting: "Acceptation en cours...",
    rejectQuote: "Refuser le Devis",
    messageClient: "Contacter le Client",
  }
};

export default function CompanyQuotesPage() {
  const router = useRouter();
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

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: companyProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: quotesData, loading: quotesLoading, refetch: refetchQuotes } = useFetch(() => api.getCompanyQuotes(), []);
  
  const quotes = toArray(quotesData);
  
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter((q: any) => q.status === 'pending').length;
  const acceptedQuotes = quotes.filter((q: any) => q.status === 'approved' || q.status === 'accepted').length;
  const rejectedQuotes = quotes.filter((q: any) => q.status === 'rejected').length;

  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [updating, setUpdating] = useState(false);


  const handleAcceptQuote = async (quote: any) => {
    if (updating) return;
    setUpdating(true);
    try {
      await api.updateCompanyQuote(quote.id, { status: "approved" });
      refetchQuotes();
      setSelectedQuote(null);
      router.push("/dashboard/company/projects");
    } catch {
      setSelectedQuote(null);
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectQuote = async (quote: any) => {
    if (updating) return;
    setUpdating(true);
    try {
      await api.updateCompanyQuote(quote.id, { status: "rejected" });
      refetchQuotes();
      setSelectedQuote(null);
    } catch {
      setSelectedQuote(null);
    } finally {
      setUpdating(false);
    }
  };

  const handleMessageClient = (quote: any) => {
    setSelectedQuote(null);
    router.push(`/dashboard/company/messages?name=${encodeURIComponent(quote.client_name)}&task=${quote.id || ''}`);
  };


  const companyName = companyProfile?.company_name || user?.company_name || "Company";

  return (
    <>
      <div className={layoutStyles.content}>
        
        {/* BLUE BANNER HEADER */}
        <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
          <div className={layoutStyles.welcomeContent}>
            <p className={layoutStyles.eyebrow}>{t.eyebrow}</p>
            <h2 className={layoutStyles.welcomeTitle}>{t.welcomeTitle}</h2>
            <p className={layoutStyles.welcomeSubtitle}>{t.welcomeSubtitle}</p>
          </div>
        </section>

        {/* OVERVIEW STATS */}
        <div className={styles.overview}>
          <div className={styles.stat}>
            <span>{t.totalQuotes}</span>
            <h3>{quotesLoading ? "..." : totalQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>{t.pending}</span>
            <h3>{quotesLoading ? "..." : pendingQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>{t.accepted}</span>
            <h3>{quotesLoading ? "..." : acceptedQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>{t.rejected}</span>
            <h3>{quotesLoading ? "..." : rejectedQuotes}</h3>
          </div>
        </div>

        {/* INBOX TABLE */}
        <div className={styles.card}>
          <h3>{t.incomingQuoteRequests}</h3>
          {quotesLoading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>{t.loadingQuotes}</div>
          ) : quotes.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.thClient}</th>
                    <th>{t.thService}</th>
                    <th>{t.thBudget}</th>
                    <th>{t.thDeadline}</th>
                    <th>{t.thLocation}</th>
                    <th>{t.thPriority}</th>
                    <th>{t.thStatus}</th>
                    <th>{t.thAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote: any) => (
                    <tr key={quote.id}>
                      <td><strong>{quote.client_name}</strong></td>
                      <td>{quote.service}</td>
                      <td>{quote.budget || "N/A"}</td>
                      <td>{quote.deadline || "N/A"}</td>
                      <td>{quote.location || "N/A"}</td>
                      <td>{quote.priority || "N/A"}</td>
                      <td>
                        <span className={`${styles.status} ${styles[quote.status] || styles.pending}`}>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={styles.outline}
                          onClick={() => setSelectedQuote(quote)}
                        >
                          {t.view}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "#64748b" }}>
              <iconify-icon icon="lucide:file-text" style={{ fontSize: "36px", color: "#cbd5e1", display: "inline-block", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>{t.noQuotesFound}</p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>{t.noQuotesSubtitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* QUOTE DETAILS MODAL */}
      {selectedQuote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <span className={styles.closeX} onClick={() => setSelectedQuote(null)}>×</span>

            <h2>{t.quoteDetailsTitle}</h2>

            <div className={styles.detailGrid}>
              <div className={styles.detailBox}>
                <strong>{t.clientInfo}</strong>
                Name: {selectedQuote.client_name}<br/>
                Email: {selectedQuote.client_email || "N/A"}<br/>
                Phone: {selectedQuote.client_phone || "N/A"}
              </div>
              <div className={styles.detailBox}>
                <strong>{t.projectSummary}</strong>
                {selectedQuote.project_summary || "No summary provided."}
              </div>
              <div className={styles.detailBox}>
                <strong>{t.budgetTimeline}</strong>
                Budget: {selectedQuote.budget || "N/A"}<br/>
                Deadline: {selectedQuote.deadline || "N/A"}
              </div>
              <div className={styles.detailBox}>
                <strong>{t.location}</strong>
                {selectedQuote.location || "N/A"}
              </div>
            </div>

            <div className={styles.detailBox} style={{ marginBottom: '24px' }}>
              <strong>{t.technicalDetails}</strong>
              {selectedQuote.technical_details || "None provided."}
            </div>

            <div className={`${styles.detailBox} ${styles.files}`}>
              <strong>{t.attachments}</strong>
              {selectedQuote.attachments && selectedQuote.attachments.length > 0 ? (
                selectedQuote.attachments.map((file: any, idx: number) => (
                  <a key={idx} href={file.url} target="_blank" rel="noreferrer">
                    <iconify-icon icon="lucide:paperclip"></iconify-icon> {file.name}
                  </a>
                ))
              ) : (
                t.noAttachments
              )}
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.primary} 
                onClick={() => handleAcceptQuote(selectedQuote)} 
                disabled={updating}
              >
                {updating ? t.accepting : t.acceptAndStart}
              </button>
              <button 
                className={styles.outline} 
                onClick={() => handleRejectQuote(selectedQuote)} 
                disabled={updating}
              >
                {t.rejectQuote}
              </button>
              <button 
                className={styles.outline} 
                onClick={() => handleMessageClient(selectedQuote)}
              >
                <iconify-icon icon="lucide:message-square" style={{ marginRight: '6px' }} />
                {t.messageClient}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


