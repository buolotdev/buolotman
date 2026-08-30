"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import layoutStyles from "../page.module.css";
import styles from "./analytics.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Analytics & Insights",
    welcomeTitle: "Analytics Dashboard",
    welcomeSubtitle: "Track your profile views, quote requests, and overall performance metrics.",
    profileViews: "Profile Views",
    quoteRequests: "Quote Requests",
    conversionRate: "Conversion Rate",
    completedHires: "Completed Hires",
    avgRating: "Avg. Rating",
    funnelTitle: "Lead Conversion Funnel",
    acceptedQuotes: "Accepted Quotes",
    servicePerformance: "Service Performance",
    thService: "Service",
    thViews: "Views",
    thQuotes: "Quotes",
    thAcceptance: "Acceptance",
    noServicesActive: "No services active.",
    trafficSources: "Traffic Sources",
    search: "Search",
    direct: "Direct",
    recommendations: "Recommendations",
    externalLinks: "External Links",
    reputationOverview: "Reputation Overview",
    stars5: "5 Stars",
    stars4: "4 Stars",
    stars3: "3 Stars",
    stars2: "2 Stars",
    stars1: "1 Star",
  },
  fr: {
    eyebrow: "Analytique & Statistiques",
    welcomeTitle: "Tableau de Bord Analytique",
    welcomeSubtitle: "Suivez vos vues de profil, demandes de devis et indicateurs de performance.",
    profileViews: "Vues du Profil",
    quoteRequests: "Demandes de Devis",
    conversionRate: "Taux de Conversion",
    completedHires: "Contrats Réalisés",
    avgRating: "Note Moyenne",
    funnelTitle: "Entonnoir de Conversion",
    acceptedQuotes: "Devis Acceptés",
    servicePerformance: "Performance des Services",
    thService: "Service",
    thViews: "Vues",
    thQuotes: "Devis",
    thAcceptance: "Acceptation",
    noServicesActive: "Aucun service actif pour le moment.",
    trafficSources: "Sources de Trafic",
    search: "Recherche",
    direct: "Direct",
    recommendations: "Recommandations",
    externalLinks: "Liens Externes",
    reputationOverview: "Aperçu de la Réputation",
    stars5: "5 Étoiles",
    stars4: "4 Étoiles",
    stars3: "3 Étoiles",
    stars2: "2 Étoiles",
    stars1: "1 Étoile",
  }
};

export default function CompanyAnalyticsPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

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
          <p className={layoutStyles.eyebrow}>{t.eyebrow}</p>
          <h2 className={layoutStyles.welcomeTitle}>{t.welcomeTitle}</h2>
          <p className={layoutStyles.welcomeSubtitle}>{t.welcomeSubtitle}</p>
        </div>
      </section>

      {/* KPIs */}
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <span>{t.profileViews}</span>
          <h3>{profileViews.toLocaleString()}</h3>
        </div>
        <div className={styles.kpi}>
          <span>{t.quoteRequests}</span>
          <h3>{quoteRequests}</h3>
        </div>
        <div className={styles.kpi}>
          <span>{t.conversionRate}</span>
          <h3>{conversionRate}%</h3>
        </div>
        <div className={styles.kpi}>
          <span>{t.completedHires}</span>
          <h3>{completedHires}</h3>
        </div>
        <div className={styles.kpi}>
          <span>{t.avgRating}</span>
          <h3>{avgRating} <span style={{ color: '#f4b400' }}>★</span></h3>
        </div>
      </div>

      {/* GRID */}
      <div className={styles.grid}>

        {/* LEFT COLUMN */}
        <div>
          {/* FUNNEL */}
          <div className={styles.card}>
            <h3>{t.funnelTitle}</h3>

            <div className={styles.label}><span>{t.profileViews}</span> <span>100%</span></div>
            <div className={styles.bar}><span style={{ width: '100%' }}></span></div>

            <div className={styles.label}><span>{t.quoteRequests}</span> <span>{quoteRequests > 0 ? '100' : '0'}%</span></div>
            <div className={styles.bar}><span style={{ width: quoteRequests > 0 ? '100%' : '0%' }}></span></div>

            <div className={styles.label}><span>{t.acceptedQuotes}</span> <span>{conversionRate}%</span></div>
            <div className={styles.bar}><span style={{ width: `${conversionRate}%` }}></span></div>

            <div className={styles.label}><span>{t.completedHires}</span> <span>{completedHiresPct}%</span></div>
            <div className={styles.bar}><span style={{ width: `${completedHiresPct}%` }}></span></div>
          </div>

          {/* SERVICES */}
          <div className={styles.card} style={{ marginTop: 24 }}>
            <h3>{t.servicePerformance}</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.thService}</th>
                    <th>{t.thViews}</th>
                    <th>{t.thQuotes}</th>
                    <th>{t.thAcceptance}</th>
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
                      <td colSpan={4} style={{ textAlign: 'center', color: '#666', padding: 20 }}>{t.noServicesActive}</td>
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
            <h3>{t.trafficSources}</h3>
            <div className={styles.label}><span>{t.search}</span></div>
            <div className={styles.bar}><span style={{ width: `${tSearch}%` }}></span></div>
            
            <div className={styles.label}><span>{t.direct}</span></div>
            <div className={styles.bar}><span style={{ width: `${tDirect}%` }}></span></div>
            
            <div className={styles.label}><span>{t.recommendations}</span></div>
            <div className={styles.bar}><span style={{ width: `${tRec}%` }}></span></div>
            
            <div className={styles.label}><span>{t.externalLinks}</span></div>
            <div className={styles.bar}><span style={{ width: `${tExt}%` }}></span></div>
          </div>

          {/* REVIEWS */}
          <div className={styles.card} style={{ marginTop: 24 }}>
            <h3>{t.reputationOverview}</h3>
            <div className={styles.stars}>★★★★★ {avgRating} / 5</div>

            <div className={styles.label}><span>{t.stars5}</span> <span>{dist['5']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('5') }}></span></div>

            <div className={styles.label}><span>{t.stars4}</span> <span>{dist['4']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('4') }}></span></div>

            <div className={styles.label}><span>{t.stars3}</span> <span>{dist['3']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('3') }}></span></div>
            
            <div className={styles.label}><span>{t.stars2}</span> <span>{dist['2']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('2') }}></span></div>

            <div className={styles.label}><span>{t.stars1}</span> <span>{dist['1']}</span></div>
            <div className={styles.bar}><span style={{ width: getPct('1') }}></span></div>
          </div>
        </div>

      </div>

    </div>
  );
}

