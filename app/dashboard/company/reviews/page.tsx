"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./reviews.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

// Mock data since backend is pending
const mockReviews = [
  {
    id: 1,
    clientName: "John Doe",
    initials: "JD",
    rating: 5,
    date: "2026-06-15",
    text: "Excellent service! The team was very professional and completed the plumbing repair ahead of schedule.",
    service: "Plumbing Services"
  },
  {
    id: 2,
    clientName: "Sarah Smith",
    initials: "SS",
    rating: 4,
    date: "2026-06-10",
    text: "Good work on the electrical wiring. A bit of delay but the quality is great.",
    service: "Electrical Installation"
  }
];

export default function CompanyReviewsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const reviews = mockReviews;
  const avgRating = 4.5;

  return (
    <main className={styles.mainWrapper}>
      <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>Company dashboard</p>
            <h1 className={styles.title}>Reviews & Ratings</h1>
          </div>
          <Link href="/dashboard/company" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
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
              <span className={styles.reviewCount}>Based on {reviews.length} reviews</span>
            </div>
          </div>
        </section>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:star" className={styles.emptyIcon} />
            <p>No reviews yet. When clients rate your services, they will appear here.</p>
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
                  <iconify-icon icon="lucide:reply" /> Reply to client
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
