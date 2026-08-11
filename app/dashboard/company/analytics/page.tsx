"use client";

import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import layoutStyles from "../page.module.css";
import styles from "./analytics.module.css";

export default function CompanyAnalyticsPage() {
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: quotesData } = useFetch(() => api.getCompanyQuotes(), []);
  const { data: servicesData } = useFetch(() => api.getCompanyServices(), []);

  const quotes = Array.isArray(quotesData) ? quotesData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];
  
  // Base Stats
  const profileViews = profile?.profile_views || 0;
  const quoteRequests = quotes.length;
  const completedHires = profile?.completed_tasks || 0;
  const avgRating = profile?.average_rating || 0;
  
  // Funnel calculations
  const acceptedQuotes = quotes.filter((q: any) => q.status === 'approved' || q.status === 'accepted').length;
  const conversionRate = quoteRequests > 0 ? Math.round((acceptedQuotes / quoteRequests) * 100) : 0;
  const completedHiresPct = quoteRequests > 0 ? Math.round((completedHires / quoteRequests) * 100) : 0;

  // Traffic Sources
  const tSearch = profile?.traffic_search || 0;
  const tDirect = profile?.traffic_direct || 0;
  const tRec = profile?.traffic_recommendations || 0;
  const tExt = profile?.traffic_external || 0;

  // Rating Distribution
  const dist = profile?.rating_distribution || { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0, 'total': 0 };
  const totalReviews = dist.total || 1; // avoid divide by zero
  const getPct = (stars: string) => Math.round((dist[stars] / totalReviews) * 100) + '%';

  return (
    <div className={layoutStyles.content}>

      {/* BLUE BANNER HEADER */}
      <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
        <div className={layoutStyles.welcomeContent}>
          <p className={layoutStyles.eyebrow}>Analytics & Insights</p>
          <h2 className={layoutStyles.welcomeTitle}>Analytics Dashboard</h2>
          <p className={layoutStyles.welcomeSubtitle}>Track your profile views, quote requests, and overall performance metrics.</p>
        </div>
      </section>

      {/* KPIs */}
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <span>Profile Views</span>
          <h3>{profileViews.toLocaleString()}</h3>
        </div>
        <div className={styles.kpi}>
          <span>Quote Requests</span>
          <h3>{quoteRequests}</h3>
        </div>
        <div className={styles.kpi}>
          <span>Conversion Rate</span>
          <h3>{conversionRate}%</h3>
        </div>
        <div className={styles.kpi}>
          <span>Completed Hires</span>
          <h3>{completedHires}</h3>
        </div>
        <div className={styles.kpi}>
          <span>Avg. Rating</span>
          <h3>{avgRating} <span style={{ color: '#f4b400' }}>★</span></h3>
        </div>
      </div>

      {/* GRID */}
      <div className={styles.grid}>

        {/* LEFT COLUMN */}
        <div>
          {/* FUNNEL */}
          <div className={styles.card}>
            <h3>Lead Conversion Funnel</h3>

            <div className={styles.label}><span>Profile Views</span> <span>100%</span></div>
            <div className={styles.bar}><span style={{ width: '100%' }}></span></div>

            <div className={styles.label}><span>Quote Requests</span> <span>{quoteRequests > 0 ? '100' : '0'}%</span></div>
            <div className={styles.bar}><span style={{ width: quoteRequests > 0 ? '100%' : '0%' }}></span></div>

            <div className={styles.label}><span>Accepted Quotes</span> <span>{conversionRate}%</span></div>
            <div className={styles.bar}><span style={{ width: `${conversionRate}%` }}></span></div>

            <div className={styles.label}><span>Hires Completed</span> <span>{completedHiresPct}%</span></div>
            <div className={styles.bar}><span style={{ width: `${completedHiresPct}%` }}></span></div>
          </div>

          {/* SERVICES */}
          <div className={styles.card} style={{ marginTop: 24 }}>
            <h3>Service Performance</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Views</th>
                    <th>Quotes</th>
                    <th>Acceptance</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? services.map((svc: any) => (
                    <tr key={svc.id}>
                      <td>{svc.title}</td>
                      <td>{svc.views?.toLocaleString() || 0}</td>
                      <td>{svc.quotes_count || 0}</td>
                      <td>{svc.acceptance_rate || 0}%</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#666', padding: 20 }}>No services active.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* TRAFFIC */}
          <div className={styles.card}>
            <h3>Traffic Sources</h3>
            <div className={styles.label}><span>Search</span></div>
            <div className={styles.bar}><span style={{ width: `${tSearch}%` }}></span></div>
            
            <div className={styles.label}><span>Direct</span></div>
            <div className={styles.bar}><span style={{ width: `${tDirect}%` }}></span></div>
            
            <div className={styles.label}><span>Recommendations</span></div>
            <div className={styles.bar}><span style={{ width: `${tRec}%` }}></span></div>
            
            <div className={styles.label}><span>External Links</span></div>
            <div className={styles.bar}><span style={{ width: `${tExt}%` }}></span></div>
          </div>

          {/* REVIEWS */}
          <div className={styles.card} style={{ marginTop: 24 }}>
            <h3>Reputation Overview</h3>
            <div className={styles.stars}>★★★★★ {avgRating} / 5</div>

            <div className={styles.label}><span>5 Stars</span> <span>{dist['5']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('5') }}></span></div>

            <div className={styles.label}><span>4 Stars</span> <span>{dist['4']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('4') }}></span></div>

            <div className={styles.label}><span>3 Stars</span> <span>{dist['3']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('3') }}></span></div>
            
            <div className={styles.label}><span>2 Stars</span> <span>{dist['2']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('2') }}></span></div>

            <div className={styles.label}><span>1 Star</span> <span>{dist['1']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('1') }}></span></div>
          </div>
        </div>

      </div>

    </div>
  );
}
