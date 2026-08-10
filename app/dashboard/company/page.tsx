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
  
  // New features
  const { data: quotesData, loading: quotesLoading } = useFetch(() => api.getCompanyQuotes(), []);
  const { data: activitiesData, loading: activitiesLoading } = useFetch(() => api.getCompanyActivities(), []);

  const projects = toArray(projectsData);
  const completedProjects = projects.filter((p: any) => p.status === "completed").length;
  
  const messagesCount = Array.isArray(conversations) ? conversations.length : 0;
  
  const quotes = toArray(quotesData);
  const quoteRequestsCount = quotes.length;
  
  const activities = toArray(activitiesData);

  const profileViews = companyProfile?.profile_views || 0;
  const ratingDist = companyProfile?.rating_distribution || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0, total: 0 };
  const totalReviews = ratingDist.total || 1; // avoid division by zero

  const companyName = companyProfile?.company_name || user?.company_name || "Company";

  return (
    <>
      <div className={styles.content}>
        {/* KPIs */}
        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <span>Profile Views</span>
            <h3>{profileLoading ? "..." : profileViews}</h3>
          </div>
          <div className={styles.kpi}>
            <span>Quote Requests</span>
            <h3>{quotesLoading ? "..." : quoteRequestsCount}</h3>
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
                    {quotesLoading ? (
                      <tr>
                        <td colSpan={5}>Loading quotes...</td>
                      </tr>
                    ) : quotes.length > 0 ? (
                      quotes.map((quote: any) => (
                        <tr key={quote.id}>
                          <td>{quote.client_name}</td>
                          <td>{quote.service}</td>
                          <td>{quote.budget || "N/A"}</td>
                          <td>{quote.deadline || "N/A"}</td>
                          <td>
                            <span className={`${styles.status} ${quote.status === 'approved' ? styles.approved : quote.status === 'rejected' ? styles.rejected : styles.pending}`}>
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", color: "#666" }}>
                          No quote requests yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTIVITY */}
            <div className={styles.card} style={{ marginTop: '24px' }}>
              <h3>Recent Activity</h3>
              {activitiesLoading ? (
                <div>Loading activity...</div>
              ) : activities.length > 0 ? (
                activities.map((activity: any) => (
                  <div key={activity.id} className={styles.activity}>
                    {activity.icon_type === 'view' ? "👁️ " : activity.icon_type === 'quote' ? "📩 " : activity.icon_type === 'review' ? "⭐ " : "✔️ "} 
                    {activity.text}
                  </div>
                ))
              ) : (
                <div className={styles.activity} style={{ color: "#666" }}>
                  No recent activity to show.
                </div>
              )}
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
                <div style={{ color: "#666", fontSize: "0.9rem" }}>No messages yet.</div>
              )}
            </div>

            {/* RATINGS */}
            <div className={styles.card} style={{ marginTop: '24px' }}>
              <h3>Rating Snapshot</h3>
              <div className={styles.stars}>⭐ {companyProfile?.average_rating || "0.0"} / 5</div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>5 Stars ({ratingDist['5']})</div>
                <div className={styles.bar}><span style={{ width: `${(ratingDist['5'] / totalReviews) * 100}%` }}></span></div>
              </div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>4 Stars ({ratingDist['4']})</div>
                <div className={styles.bar}><span style={{ width: `${(ratingDist['4'] / totalReviews) * 100}%` }}></span></div>
              </div>
              
              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>3 Stars ({ratingDist['3']})</div>
                <div className={styles.bar}><span style={{ width: `${(ratingDist['3'] / totalReviews) * 100}%` }}></span></div>
              </div>

              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>2 Stars ({ratingDist['2']})</div>
                <div className={styles.bar}><span style={{ width: `${(ratingDist['2'] / totalReviews) * 100}%` }}></span></div>
              </div>

              <div className={styles.ratingRow}>
                <div className={styles.ratingLabel}>1 Star ({ratingDist['1']})</div>
                <div className={styles.bar}><span style={{ width: `${(ratingDist['1'] / totalReviews) * 100}%` }}></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
