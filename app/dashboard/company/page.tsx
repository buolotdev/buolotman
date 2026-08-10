"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

export default function CompanyDashboard() {
  const router = useRouter();

  // Shared Data
  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: companyProfile, loading: profileLoading } = useFetch(() => api.getCompanyProfile(), []);
  const { data: projectsData, loading: projectsLoading } = useFetch(() => api.getCompanyProjects(), []);
  const { data: conversations, loading: convLoading } = useFetch(() => api.getConversations(), []);
  
  // New features
  const { data: quotesData, loading: quotesLoading } = useFetch(() => api.getCompanyQuotes(), []);
  const { data: activitiesData, loading: activitiesLoading } = useFetch(() => api.getCompanyActivities(), []);
  
  // Old features (Wallet, Services)
  const { data: servicesData, loading: servicesLoading } = useFetch(() => api.getCompanyServices(), []);
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);

  // Compute values
  const projects = toArray(projectsData);
  const services = toArray(servicesData);
  const quotes = toArray(quotesData);
  const activities = toArray(activitiesData);
  
  const activeProjects = projects.filter((p: any) => p.status === "in_progress" || p.status === "active").length;
  const completedProjects = projects.filter((p: any) => p.status === "completed").length;
  const messagesCount = Array.isArray(conversations) ? conversations.length : 0;
  const quoteRequestsCount = quotes.length;

  const profileViews = companyProfile?.profile_views || 0;
  const ratingDist = companyProfile?.rating_distribution || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0, total: 0 };
  const totalReviews = ratingDist.total || 1; // avoid division by zero

  const companyName = companyProfile?.company_name || user?.company_name || "Company";

  return (
    <>
      <div className={styles.content}>
        
        {/* OLD PAGE HEADER */}
        <div className={styles.pageHeader}>
          <div className={styles.headerTitles}>
            <h1>Company Dashboard</h1>
            <p>Welcome! Here&apos;s what&apos;s happening with your projects today.</p>
          </div>
          <Link href="/dashboard/company/projects/new" className={styles.btnPrimary}>
            <iconify-icon icon="lucide:plus" />
            <span>Create New Project</span>
          </Link>
        </div>

        {/* NEW KPIs */}
        <div className={styles.kpis} style={{ marginTop: '24px' }}>
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

        {/* NEW GRID (Quotes, Activity, Ratings) */}
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

        {/* OLD SECTIONS */}
        <div className={styles.topRow} style={{ marginTop: '32px' }}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Project Overview</h2>
              <Link href="/dashboard/company/projects" className={styles.panelAction}>View All</Link>
            </div>
            <div className={styles.panelBody}>
              {projectsLoading || walletLoading ? (
                <div className={styles.statsGrid}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.statCard}><SkeletonStat /></div>
                  ))}
                </div>
              ) : (
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Active Projects</span>
                    <span className={styles.statValue}>{activeProjects}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Completed Projects</span>
                    <span className={styles.statValue}>{completedProjects}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Available Balance</span>
                    <span className={styles.statValue}>{wallet ? `${Number(wallet.available_balance).toLocaleString()} XOF` : "0 XOF"}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Services Offered</h2>
              <Link href="/dashboard/company/services" className={styles.panelAction}>Manage</Link>
            </div>
            <div className={styles.panelBody}>
              {servicesLoading ? (
                <div className={styles.teamList}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.teamItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
                  ))}
                </div>
              ) : !services || services.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>No services added yet.</p>
              ) : (
                <div className={styles.teamList}>
                  {services.slice(0, 3).map((service: any) => (
                    <div key={service.id} className={styles.teamItem}>
                      <div className={styles.teamAvatar}>
                        <iconify-icon icon="lucide:layers" />
                      </div>
                      <div className={styles.teamInfo}>
                        <strong>{service.title || service.name || "Service"}</strong>
                        <span>{service.description?.slice(0, 40) || "No description"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className={styles.bottomRow}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Recent Projects</h2>
            </div>
            <div className={styles.panelBody}>
              {projectsLoading ? (
                <div className={styles.activityList}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.activityItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: 14 }}>No projects yet.</p>
              ) : (
                <div className={styles.activityList}>
                  {projects.slice(0, 4).map((project: any) => (
                    <div key={project.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <iconify-icon icon={project.status === "completed" ? "lucide:check-circle" : "lucide:briefcase"} />
                      </div>
                      <div className={styles.activityContent}>
                        <p><strong>{project.title || "Project"}</strong></p>
                        <span>{project.status || "draft"} • {project.budget ? `${Number(project.budget).toLocaleString()} XOF` : "No budget"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className={styles.rightColumn}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Quick Actions</h2>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.actionGrid}>
                  <Link href="/dashboard/company/projects" className={styles.actionBtn}><iconify-icon icon="lucide:briefcase" /> New Project</Link>
                  <Link href="/dashboard/company/services" className={styles.actionBtn}><iconify-icon icon="lucide:layers" /> Add Service</Link>
                  <Link href="/dashboard/company/messages" className={styles.actionBtn}><iconify-icon icon="lucide:message-square" /> Messages</Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
