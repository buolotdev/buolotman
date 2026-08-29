"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonStat, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

export default function CompanyDashboard() {
  const router = useRouter();
  const toast = useToast();


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
  const isVerified = Boolean(user?.is_verified || companyProfile?.is_verified || user?.company_profile?.is_verified);

  return (
    <>
      <div className={styles.content}>
        
        {/* NEW WELCOME BANNER (Matches Client Portal) */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <p className={styles.eyebrow}>Dashboard Overview</p>
            <h2 className={styles.welcomeTitle}>
              Welcome, {companyName}! Ready to grow?
              {isVerified && (
                <span className={styles.heroVerifiedBadge} title="Verified Enterprise">
                  <iconify-icon icon="lucide:badge-check" style={{ fontSize: '18px', color: '#16a34a' }} />
                  <span>Verified</span>
                </span>
              )}
            </h2>
            <p className={styles.welcomeSubtitle}>Track your active projects, review new quote requests, manage your services, and communicate with clients seamlessly.</p>
          </div>
          <div className={styles.welcomeActions}>
            <button
              type="button"
              onClick={() => {
                if (!isVerified) {
                  toast.warning("Wait for Verification", "Please wait for verification. Your company account is currently under review by admin. Once approved, you can post services.");
                  return;
                }
                router.push("/dashboard/company/projects/new");
              }}
              className={styles.primaryButton}
              style={{ border: "none", cursor: "pointer" }}
            >
              <iconify-icon icon="lucide:plus" /> Post a Service
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isVerified) {
                  toast.warning("Wait for Verification", "Please wait for verification. Your company account is currently under review by admin. Once approved, you can manage services.");
                  return;
                }
                router.push("/dashboard/company/services");
              }}
              className={styles.secondaryButton}
              style={{ border: "none", cursor: "pointer" }}
            >
              Manage Services
            </button>
            <button 
              type="button"
              onClick={() => {
                if (!isVerified) {
                  toast.warning("Wait for Verification", "Please wait for verification. Your company account is currently under review by admin. Once approved, you can access quote requests.");
                  return;
                }
                router.push("/dashboard/company/quotes");
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                minHeight: '44px',
                padding: '0 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <iconify-icon icon="lucide:file-text" style={{ color: '#38bdf8', fontSize: '18px' }} />
              Quote Requests & Direct Hires
              {quoteRequestsCount > 0 && (
                <span style={{ background: '#ff4500', color: '#fff', fontSize: '11px', padding: '1px 7px', borderRadius: '999px', fontWeight: 800 }}>
                  {quoteRequestsCount} New
                </span>
              )}
            </button>
          </div>

        </section>


        {/* 4-TIER COMPANY VERIFICATION & TRUST SCORE */}
        <section className={styles.accountStatusSection} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 8px 24px rgba(0,31,63,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#001f3f' }}>Company Trust & Verification Level</h3>
                {isVerified ? (
                  <span className={styles.verifiedPill} style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <iconify-icon icon="lucide:shield-check" /> Verified Enterprise ✓
                  </span>
                ) : (
                  <span style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <iconify-icon icon="lucide:award" /> Capability Verified ✓
                  </span>
                )}
                <span style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <iconify-icon icon="lucide:check-circle-2" /> Insured ✓
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Your enterprise profile is actively matched with high-budget commercial tenders and institutional contracts.
              </p>
            </div>

            <Link href="/dashboard/company/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#001f3f', color: '#ffffff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              <iconify-icon icon="lucide:sliders" /> Manage Enterprise Hub
            </Link>
          </div>

          {/* 4-Tier Verification Progress Tracker */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '12px', background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#166534', fontWeight: 700 }}>
              <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 16, color: '#16a34a' }} />
              <span>1. Registered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#166534', fontWeight: 700 }}>
              <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 16, color: '#16a34a' }} />
              <span>2. Business Verified ✓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0284c7', fontWeight: 800 }}>
              <iconify-icon icon="lucide:award" style={{ fontSize: 16, color: '#0284c7' }} />
              <span>3. Capability Verified ✓</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: isVerified ? '#166534' : '#64748b', fontWeight: 700 }}>
              <iconify-icon icon={isVerified ? "lucide:check-circle-2" : "lucide:circle-dot"} style={{ fontSize: 16, color: isVerified ? '#16a34a' : '#94a3b8' }} />
              <span>4. Verified Company</span>
            </div>
          </div>
        </section>

        {/* STATS GRID (Matches Client Portal) */}
        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statPrimary}`}><iconify-icon icon="lucide:eye" /></div>
            <div>
              <div className={styles.statValue}>{profileLoading ? "..." : profileViews}</div>
              <p>Profile Views</p>
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:file-text" /></div>
            <div>
              <div className={styles.statValue}>{quotesLoading ? "..." : quoteRequestsCount}</div>
              <p>Quote Requests</p>
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statAccent}`}><iconify-icon icon="lucide:message-square" /></div>
            <div>
              <div className={styles.statValue}>{convLoading ? "..." : messagesCount}</div>
              <p>Messages</p>
            </div>
          </article>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:check-circle" /></div>
            <div>
              <div className={styles.statValue}>{projectsLoading ? "..." : completedProjects}</div>
              <p>Hires Completed</p>
            </div>
          </article>
        </section>

        {/* TWO COLUMN GRID (Matches Client Portal) */}
        <div className={styles.twoColumnGrid}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0, width: '100%' }}>
            
            {/* PROJECT OVERVIEW */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Project Overview</h3>
                <Link href="/dashboard/company/projects" className={styles.linkButton}>View All</Link>
              </div>
              {projectsLoading ? (
                <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading projects...</div>
              ) : projects.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 4).map((project: any) => (
                        <tr key={project.id}>
                          <td><strong>{project.title || "Project"}</strong></td>
                          <td>
                            <span className={`${styles.badge} ${project.status === 'completed' ? styles.badgeApproved : project.status === 'active' || project.status === 'in_progress' ? styles.badgeActive : styles.badgeDefault}`}>
                              {project.status || "draft"}
                            </span>
                          </td>
                          <td>{project.budget ? `${Number(project.budget).toLocaleString()} XOF` : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>No active projects yet.</div>
              )}
            </div>

            {/* QUOTES */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Recent Quote Requests</h3>
                <Link href="/dashboard/company/quotes" className={styles.linkButton}>View All</Link>
              </div>
              {quotesLoading ? (
                <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading quotes...</div>
              ) : quotes.length > 0 ? (
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
                      {quotes.map((quote: any) => (
                        <tr key={quote.id}>
                          <td><strong>{quote.client_name}</strong></td>
                          <td>{quote.service}</td>
                          <td>{quote.budget || "N/A"}</td>
                          <td>{quote.deadline || "N/A"}</td>
                          <td>
                            <span className={`${styles.badge} ${quote.status === 'approved' ? styles.badgeApproved : quote.status === 'rejected' ? styles.badgeRejected : styles.badgePending}`}>
                              {quote.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>No quote requests yet.</div>
              )}
            </div>
            
            {/* SERVICES OFFERED */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Services Offered</h3>
                <Link href="/dashboard/company/services" className={styles.linkButton}>Manage</Link>
              </div>
              <div className={styles.teamList}>
                {servicesLoading ? (
                  <div style={{ padding: 12 }}>Loading services...</div>
                ) : services.length > 0 ? (
                  services.slice(0, 3).map((service: any) => (
                    <div key={service.id} className={styles.teamItem}>
                      <div className={styles.teamAvatar}>
                        <iconify-icon icon="lucide:layers" />
                      </div>
                      <div className={styles.teamInfo}>
                        <h4>{service.title || service.name || "Service"}</h4>
                        <p>{service.description?.slice(0, 40) || "No description"}...</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>No services added yet.</div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0, width: '100%' }}>
            
            {/* WALLET / BALANCES */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Available Balance</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className={styles.statIcon} style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#001f3f' }}>
                    {walletLoading ? "..." : wallet ? `${Number(wallet.available_balance).toLocaleString()} XOF` : "0 XOF"}
                  </h2>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Recent Messages</h3>
              </div>
              {convLoading ? (
                <div>
                  <SkeletonBlock style={{ height: 40, width: "100%", marginBottom: 12 }} />
                  <SkeletonBlock style={{ height: 40, width: "100%" }} />
                </div>
              ) : Array.isArray(conversations) && conversations.length > 0 ? (
                <div className={styles.messageList}>
                  {conversations.slice(0, 3).map((conv: any) => (
                    <div key={conv.id} className={styles.messageItem}>
                      <div className={styles.messageAvatar}>
                        {(conv.other_participant?.name || "C")[0].toUpperCase()}
                      </div>
                      <div className={styles.messageContent}>
                        <h4>{conv.other_participant?.name || "Client"}</h4>
                        <p>{conv.last_message?.content || "No messages yet"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No messages yet.</div>
              )}
            </div>

            {/* ACTIVITY TIMELINE */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Recent Activity</h3>
              </div>
              <div className={styles.timeline}>
                {activitiesLoading ? (
                  <div>Loading activity...</div>
                ) : activities.length > 0 ? (
                  activities.slice(0, 4).map((activity: any) => (
                    <div key={activity.id} className={styles.timelineItem}>
                      <div className={styles.timelineIcon}>
                        <iconify-icon icon={activity.icon_type === 'view' ? "lucide:eye" : activity.icon_type === 'quote' ? "lucide:mail" : activity.icon_type === 'review' ? "lucide:star" : "lucide:check"} />
                      </div>
                      <div className={styles.timelineContent}>
                        <h4>{activity.text}</h4>
                        <p>Recently</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>No recent activity to show.</div>
                )}
              </div>
            </div>

            {/* RATINGS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Rating Snapshot</h3>
              </div>
              <div className={styles.ratingSnapshot}>
                <div className={styles.ratingOverall}>
                  <iconify-icon icon="lucide:star" /> 
                  {companyProfile?.average_rating || "0.0"} / 5
                </div>
                
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className={styles.ratingRow}>
                    <div className={styles.ratingLabel}>{stars} Stars ({ratingDist[stars.toString()]})</div>
                    <div className={styles.ratingTrack}>
                      <span className={styles.ratingFill} style={{ width: `${(ratingDist[stars.toString()] / totalReviews) * 100}%` }}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Quick Actions</h3>
              </div>
              <div className={styles.actionGrid}>
                <Link href="/dashboard/company/projects/new" className={styles.actionBtn}>
                  <iconify-icon icon="lucide:briefcase" /> Post a Service
                </Link>
                <Link href="/dashboard/company/services" className={styles.actionBtn}>
                  <iconify-icon icon="lucide:layers" /> Add Service
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
