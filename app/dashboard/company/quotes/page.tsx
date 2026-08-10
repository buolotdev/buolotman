"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

import LogoutButton from "@/app/components/LogoutButton";
import layoutStyles from "../page.module.css";
import styles from "./quotes.module.css";

// MOCK DATA
const MOCK_QUOTES: any[] = [];

export default function CompanyQuotesPage() {
  
  const router = useRouter();
  const pathname = usePathname();

  

  return (
    <>

        <div className={layoutStyles.content}>
          <div className={layoutStyles.pageHeader}>
            <div className={layoutStyles.headerTitles}>
              <h1>Quote Requests</h1>
              <p>Manage incoming requests for quotations from clients.</p>
            </div>
          </div>

          <section className={layoutStyles.panel}>
            <div className={layoutStyles.panelHeader}>
              <h2>All Quote Requests</h2>
            </div>
            <div className={layoutStyles.panelBody} style={{ padding: 0 }}>
              {MOCK_QUOTES.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                  <iconify-icon icon="lucide:file-text" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }}></iconify-icon>
                  <h3 style={{ margin: "0 0 8px" }}>No quote requests found</h3>
                  <p style={{ margin: 0 }}>You don't have any incoming requests for quotations right now.</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_QUOTES.map((q) => (
                      <tr key={q.id}>
                        <td><strong>{q.id}</strong></td>
                        <td>{q.client}</td>
                        <td>{q.service}</td>
                        <td>{q.budget}</td>
                        <td>{q.deadline}</td>
                        <td>
                          <span className={`${styles.status} ${styles[q.status]}`}>{q.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {q.status === 'pending' && (
                              <>
                                <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Send Quote</button>
                                <button className={styles.actionBtn}>Decline</button>
                              </>
                            )}
                            {q.status !== 'pending' && (
                              <button className={styles.actionBtn}>View Details</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      
    </>
  );
}
