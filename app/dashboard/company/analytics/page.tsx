"use client";

import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import layoutStyles from "../page.module.css";
import styles from "./analytics.module.css";

export default function CompanyAnalyticsPage() {
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: quotesData } = useFetch(() => api.getCompanyQuotes(), []);

  const quotes = Array.isArray(quotesData) ? quotesData : [];
  
  // Stats calculations
  const profileViews = profile?.profile_views || 4218; // Defaulting to mockup if 0
  const quoteRequests = quotes.length > 0 ? quotes.length : 126;
  const completedHires = profile?.completed_tasks || 22;
  const avgRating = profile?.average_rating || 4.7;
  
  // Calculate conversion rate mockup/real
  const acceptedQuotes = quotes.filter((q: any) => q.status === 'approved' || q.status === 'accepted').length;
  const conversionRate = quoteRequests > 0 ? Math.round((acceptedQuotes / quoteRequests) * 100) : 18;

  return (
    <div className={layoutStyles.content}>

      {/* TOPBAR equivalent */}
      <div className={layoutStyles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={layoutStyles.headerTitles}>
          <h1>Analytics Dashboard</h1>
        </div>
        <div>
          <strong style={{ color: '#001f3f' }}>{profile?.company_name || user?.username || "Company"}</strong>
        </div>
      </div>

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

            <div className={styles.label}><span>Quote Requests</span> <span>30%</span></div>
            <div className={styles.bar}><span style={{ width: '30%' }}></span></div>

            <div className={styles.label}><span>Accepted Quotes</span> <span>18%</span></div>
            <div className={styles.bar}><span style={{ width: '18%' }}></span></div>

            <div className={styles.label}><span>Hires Completed</span> <span>10%</span></div>
            <div className={styles.bar}><span style={{ width: '10%' }}></span></div>
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
                  <tr>
                    <td>Commercial Construction</td>
                    <td>1,820</td>
                    <td>54</td>
                    <td>22%</td>
                  </tr>
                  <tr>
                    <td>Renovation</td>
                    <td>980</td>
                    <td>32</td>
                    <td>18%</td>
                  </tr>
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
            <div className={styles.bar}><span style={{ width: '45%' }}></span></div>
            
            <div className={styles.label}><span>Direct</span></div>
            <div className={styles.bar}><span style={{ width: '30%' }}></span></div>
            
            <div className={styles.label}><span>Recommendations</span></div>
            <div className={styles.bar}><span style={{ width: '15%' }}></span></div>
            
            <div className={styles.label}><span>External Links</span></div>
            <div className={styles.bar}><span style={{ width: '10%' }}></span></div>
          </div>

          {/* REVIEWS */}
          <div className={styles.card} style={{ marginTop: 24 }}>
            <h3>Reputation Overview</h3>
            <div className={styles.stars}>★★★★★ {avgRating} / 5</div>

            <div className={styles.label}><span>5 Stars</span></div>
            <div className={styles.bar}><span style={{ width: '70%' }}></span></div>

            <div className={styles.label}><span>4 Stars</span></div>
            <div className={styles.bar}><span style={{ width: '20%' }}></span></div>

            <div className={styles.label}><span>3 Stars</span></div>
            <div className={styles.bar}><span style={{ width: '10%' }}></span></div>
          </div>
        </div>

      </div>

    </div>
  );
}
