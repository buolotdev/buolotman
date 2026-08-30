"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./reviews.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    subtitle: "Company dashboard",
    title: "Reviews & Ratings",
    backToDashboard: "Back to dashboard",
    basedOnReviews: "Based on",
    reviewsLabel: "reviews",
    noReviews: "No reviews yet. When clients rate your services, they will appear here.",
    replyToClient: "Reply to client",
  },
  fr: {
    subtitle: "Espace Entreprise",
    title: "Avis & Évaluations",
    backToDashboard: "Retour au tableau de bord",
    basedOnReviews: "Basé sur",
    reviewsLabel: "avis",
    noReviews: "Aucun avis pour l'instant. Lorsque les clients évalueront vos prestations, ils apparaîtront ici.",
    replyToClient: "Répondre au client",
  }
};

// Mock data since backend is pending
const mockReviews: any[] = [];

export default function CompanyReviewsPage() {
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

  const reviews = mockReviews;
  const avgRating = 4.5;

  return (
    <>
      <div className={layoutStyles.content}>
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <h1 className={styles.title}>{t.title}</h1>
          </div>
          <Link href="/dashboard/company" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" /> {t.backToDashboard}
          </Link>
        </header>

        <section className={styles.summaryCard}>
          <div className={styles.summaryLeft}>
            <div className={styles.averageRating}>{avgRating}</div>
            <div className={styles.summaryDetails}>
              <div className={styles.stars}>
                <iconify-icon icon="lucide:star" style={{ fill: "#f59e0b" }} />
                <iconify-icon icon="lucide:star" style={{ fill: "#f59e0b" }} />
                <iconify-icon icon="lucide:star" style={{ fill: "#f59e0b" }} />
                <iconify-icon icon="lucide:star" style={{ fill: "#f59e0b" }} />
                <iconify-icon icon="lucide:star-half" style={{ fill: "#f59e0b" }} />
              </div>
              <span className={styles.reviewCount}>{t.basedOnReviews} {reviews.length} {t.reviewsLabel}</span>
            </div>
          </div>
        </section>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:star" className={styles.emptyIcon} />
            <p>{t.noReviews}</p>
          </div>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((r) => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.avatar}>{r.initials}</div>
                    <div className={styles.reviewerDetails}>
                      <span className={styles.reviewerName}>{r.clientName}</span>
                      <span className={styles.reviewDate}>{new Date(r.date).toLocaleDateString()} • {r.service}</span>
                    </div>
                  </div>
                  <div className={styles.stars}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <iconify-icon key={i} icon="lucide:star" style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                    ))}
                  </div>
                </div>
                <p className={styles.reviewContent}>{r.text}</p>
                <button className={styles.replyBtn}>
                  <iconify-icon icon="lucide:reply" /> {t.replyToClient}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
