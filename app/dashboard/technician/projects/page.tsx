"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Link from "next/link";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianProjectsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: bidsData, loading } = useFetch(() => api.getMyBids(), []);
  
  // Extract bids array from results, and filter for accepted (or ongoing) ones
  const activeBids = (Array.isArray(bidsData) ? bidsData : (bidsData as any)?.results || []).filter((b: any) => b.status === "accepted");

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold":
        return styles.statusHold;
      case "Released":
        return styles.statusReleased;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <section className={styles.card}>
              <h2>My Projects</h2>
              
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Start Date</th>
                      <th>Progress</th>
                      <th>Milestone</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>Loading projects...</td></tr>
                    ) : activeBids.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "#64748b", whiteSpace: "normal" }}>You have no active projects yet.</td></tr>
                    ) : activeBids.map((bid: any) => {
                      const taskName = bid.task_title || bid.task?.title || `Task #${bid.task_id || bid.task?.id || "Unknown"}`;
                      const clientId = bid.task?.client || "Unknown";
                      const progress = bid.status === "completed" ? "100%" : "In Progress";
                      const paymentStatus = bid.status === "completed" ? "Released" : "Pending";
                      
                      return (
                        <tr key={bid.id}>
                          <td>{taskName}</td>
                          <td>Client {clientId}</td>
                          <td>{new Date(bid.created_at || Date.now()).toLocaleDateString()}</td>
                          <td>{progress}</td>
                          <td>Initial Phase</td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(paymentStatus)}`}>
                              {paymentStatus}
                            </span>
                          </td>
                          <td>
                            <Link href={`/dashboard/technician/projects/${bid.task_id || bid.task?.id || bid.id}`} className={styles.primaryButton} style={{ textDecoration: 'none', display: 'inline-block' }}>Open Workspace</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
