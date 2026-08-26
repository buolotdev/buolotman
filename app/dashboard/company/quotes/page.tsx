"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";

import layoutStyles from "../page.module.css";
import styles from "./quotes.module.css";

export default function CompanyQuotesPage() {
  const router = useRouter();
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
            <p className={layoutStyles.eyebrow}>Quote Management</p>
            <h2 className={layoutStyles.welcomeTitle}>Quote Requests Inbox</h2>
            <p className={layoutStyles.welcomeSubtitle}>Manage incoming requests for quotations from clients for {companyName}.</p>
          </div>
        </section>

        {/* OVERVIEW STATS */}
        <div className={styles.overview}>
          <div className={styles.stat}>
            <span>Total Quotes</span>
            <h3>{quotesLoading ? "..." : totalQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>Pending</span>
            <h3>{quotesLoading ? "..." : pendingQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>Accepted</span>
            <h3>{quotesLoading ? "..." : acceptedQuotes}</h3>
          </div>
          <div className={styles.stat}>
            <span>Rejected</span>
            <h3>{quotesLoading ? "..." : rejectedQuotes}</h3>
          </div>
        </div>

        {/* INBOX TABLE */}
        <div className={styles.card}>
          <h3>Incoming Quote Requests</h3>
          {quotesLoading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading quotes...</div>
          ) : quotes.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Budget</th>
                    <th>Deadline</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
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
                          View
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
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>No quote requests found.</p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>When clients request quotes for your services, they will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* QUOTE DETAILS MODAL */}
      {selectedQuote && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <span className={styles.closeX} onClick={() => setSelectedQuote(null)}>×</span>

            <h2>Quote Request Details</h2>

            <div className={styles.detailGrid}>
              <div className={styles.detailBox}>
                <strong>Client Information</strong>
                Name: {selectedQuote.client_name}<br/>
                Email: {selectedQuote.client_email || "N/A"}<br/>
                Phone: {selectedQuote.client_phone || "N/A"}
              </div>
              <div className={styles.detailBox}>
                <strong>Project Summary</strong>
                {selectedQuote.project_summary || "No summary provided."}
              </div>
              <div className={styles.detailBox}>
                <strong>Budget & Timeline</strong>
                Budget: {selectedQuote.budget || "N/A"}<br/>
                Deadline: {selectedQuote.deadline || "N/A"}
              </div>
              <div className={styles.detailBox}>
                <strong>Location</strong>
                {selectedQuote.location || "N/A"}
              </div>
            </div>

            <div className={styles.detailBox} style={{ marginBottom: '24px' }}>
              <strong>Technical Details</strong>
              {selectedQuote.technical_details || "None provided."}
            </div>

            <div className={`${styles.detailBox} ${styles.files}`}>
              <strong>Attachments</strong>
              {selectedQuote.attachments && selectedQuote.attachments.length > 0 ? (
                selectedQuote.attachments.map((file: any, idx: number) => (
                  <a key={idx} href={file.url} target="_blank" rel="noreferrer">
                    <iconify-icon icon="lucide:paperclip"></iconify-icon> {file.name}
                  </a>
                ))
              ) : (
                "No attachments."
              )}
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.primary} 
                onClick={() => handleAcceptQuote(selectedQuote)} 
                disabled={updating}
              >
                {updating ? "Accepting..." : "Accept Quote & Start Project"}
              </button>
              <button 
                className={styles.outline} 
                onClick={() => handleRejectQuote(selectedQuote)} 
                disabled={updating}
              >
                Reject Quote
              </button>
              <button 
                className={styles.outline} 
                onClick={() => handleMessageClient(selectedQuote)}
              >
                <iconify-icon icon="lucide:message-square" style={{ marginRight: '6px' }} />
                Message Client
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

