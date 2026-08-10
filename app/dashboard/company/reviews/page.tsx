"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./reviews.module.css";


// Mock data since backend is pending
const mockReviews: any[] = [];

export default function CompanyReviewsPage() {
  
  const reviews = mockReviews;
  const avgRating = 4.5;

  return (
    <>
      <div className={layoutStyles.content}>
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
      </div>
    </>
  );
}
