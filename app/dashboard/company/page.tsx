"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

export default function CompanyDashboard() {
  const router = useRouter();

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: companyProfile, loading: profileLoading } = useFetch(() => api.getCompanyProfile(), []);
  const { data: projectsData, loading: projectsLoading } = useFetch(() => api.getCompanyProjects(), []);
  const { data: conversations, loading: convLoading } = useFetch(() => api.getConversations(), []);

  const projects = toArray(projectsData);
  const completedProjects = projects.filter((p: any) => p.status === "completed").length;
  
  // Real messages count
  const messagesCount = Array.isArray(conversations) ? conversations.length : 0;
  
  // Note: Profile views and Quote requests are mocked for now as APIs don't exist yet
  const profileViews = "1,248";
  const quoteRequests = "36";

  const companyName = companyProfile?.company_name || user?.company_name || "Company";

  return (
    <>
      <div className={styles.content}>
        {/* KPIs */}
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <span>Profile Views</span>
            <h3>{profileViews}</h3>
          </div>
          <div className={styles.kpi}>
            <span>Quote Requests</span>
            <h3>{quoteRequests}</h3>
          </div>
          <div className={styles.kpi}>
            <span>Messages</span>
            <h3>{convLoading ? "..." : messagesCount}</h3>
          </div>
          <div className={styles.kpi}>
            <span>Hires Completed</span>
            <h3>{projectsLoading ? "..." : completedProjects}</h3>
          </div>
        </div>

        {/* GRID */}
        <div className={styles.grid}>
          {/* LEFT */}
          <div>
            {/* QUOTES */}
            <div className={styles.card}>
              <h3>Recent Quote Requests</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Deadline</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>James M.</td>
                      <td>Commercial Building</td>
                      <td>$50,000 – $70,000</td>
                      <td>Feb 20, 2026</td>
                      <td><span className={`${styles.status} ${styles.pending}`}>Pending</span></td>
                    </tr>
                    <tr>
                      <td>Linda K.</td>
                      <td>Renovation</td>
                      <td>$8,000 – $12,000</td>
                      <td>Feb 10, 2026</td>
                      <td><span className={`${styles.status} ${styles.approved}`}>Approved</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTIVITY */}
            <div className={styles.card} style={{ marginTop: '24px' }}>
              <h3>Recent Activity</h3>
              <div className={styles.activity}>✔ Your profile was viewed by a client (2 hours ago)</div>
              <div className={styles.activity}>📩 New quote request received (Yesterday)</div>
              <div className={styles.activity}>⭐ New 5-star review received (2 days ago)</div>
              <div className={styles.activity}>🤝 Project marked as completed (Last week)</div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* MESSAGES */}
            <div className={styles.card}>
              <h3>Recent Messages</h3>
              {convLoading ? (
                <div>
                  <SkeletonBlock style={{ height: 40, width: "100%", marginBottom: 12 }} />
                  <SkeletonBlock style={{ height: 40, width: "100%" }} />
                </div>
              ) : Array.isArray(conversations) && conversations.length > 0 ? (
                conversations.slice(0, 3).map((conv: any) => (
                  <div key={conv.id} className={styles.message}>
                    <strong>{conv.other_participant?.name || "Client"}</strong>
                    <small>{conv.last_message?.content?.substring(0, 40) || "No messages yet"}...</small>
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.message}>
                    <strong>John M.</strong>
                    <small>Can you visit the site this week?</small>
                  </div>
                  <div className={styles.message}>
                    <strong>Sarah K.</strong>
                    <small>Please send updated quotation.</small>
                  </div>
                </>
              )}
            </div>

            {/* RATINGS */}
            <div className={styles.card} style={{ marginTop: '24px' }}>
              <h3>Rating Snapshot</h3>
              <div className={styles.stars}>★★★★★ 4.7 / 5</div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>5 Stars</div>
                <div className={styles.bar}><span style={{ width: '70%' }}></span></div>
              </div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>4 Stars</div>
                <div className={styles.bar}><span style={{ width: '20%' }}></span></div>
              </div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>3 Stars</div>
                <div className={styles.bar}><span style={{ width: '10%' }}></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
