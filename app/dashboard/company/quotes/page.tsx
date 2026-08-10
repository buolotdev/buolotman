"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";

import layoutStyles from "../page.module.css";
import styles from "./quotes.module.css";

export default function CompanyQuotesPage() {
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: companyProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: quotesData, loading: quotesLoading } = useFetch(() => api.getCompanyQuotes(), []);
  
  const quotes = toArray(quotesData);
  
  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter((q: any) => q.status === 'pending').length;
  const acceptedQuotes = quotes.filter((q: any) => q.status === 'approved' || q.status === 'accepted').length;
  const rejectedQuotes = quotes.filter((q: any) => q.status === 'rejected').length;

  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const companyName = companyProfile?.company_name || user?.company_name || "Company";

  return (
    <>
      <div className={layoutStyles.content}>
        
        {/* TOPBAR equivalent */}
        <div className={layoutStyles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={layoutStyles.headerTitles}>
            <h1>Quote Requests Inbox</h1>
          </div>
          <div>
            <strong style={{ color: '#001f3f' }}>{companyName}</strong>
          </div>
        </div>

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
                {quotesLoading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>Loading quotes...</td>
                  </tr>
                ) : quotes.length > 0 ? (
                  quotes.map((quote: any) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                      No quote requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
              <button className={styles.primary}>Accept Quote</button>
              <button className={styles.outline}>Reject Quote</button>
              <button className={styles.outline}>Message Client</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
