"use client";

import React, { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./reviews.module.css";

export default function AdminReviewsPage() {
  const { data: rawReviews, loading, refetch } = useFetch(() => api.getAdminReviews(), []);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const reviews = rawReviews || [];

  const handlePublish = async (id: number) => {
    setActionLoading(id);
    try {
      await api.publishReview(id);
      refetch();
    } catch (err) {
      alert("Failed to publish review.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleHide = async (id: number) => {
    setActionLoading(id);
    try {
      await api.hideReview(id);
      refetch();
    } catch (err) {
      alert("Failed to hide review.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    setActionLoading(id);
    try {
      await api.deleteReview(id);
      refetch();
    } catch (err) {
      alert("Failed to delete review.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (status: string) => {
    if (status?.toLowerCase() === "published") return styles.statusPublished;
    if (status?.toLowerCase() === "hidden") return styles.statusHidden;
    return styles.statusPending;
  };

  const filteredReviews = reviews.filter((r: any) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "published") return r.status?.toLowerCase() === "published";
    if (activeFilter === "pending") return r.status?.toLowerCase() === "pending" || !r.status;
    if (activeFilter === "hidden") return r.status?.toLowerCase() === "hidden";
    if (activeFilter === "5-star") return Number(r.rating) === 5;
    return true;
  });

  const totals = {
    total: reviews.length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : "5.0",
    published: reviews.filter((r: any) => r.status?.toLowerCase() === "published").length,
    pending: reviews.filter((r: any) => r.status?.toLowerCase() !== "published" && r.status?.toLowerCase() !== "hidden").length,
  };

  return (
    <div className={styles.page}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:star" /> Reputation & Quality Assurance Center
          </div>
          <h1 className={styles.heroTitle}>Platform Reviews & Ratings</h1>
          <p className={styles.heroSubtitle}>
            Audit client-contractor ratings, moderate disputed feedback, and ensure authentic, high-quality testimonials across the ecosystem.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:sparkles" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:message-square" />
          </div>
          <div>
            <div className={styles.statLabel}>Total Reviews</div>
            <div className={styles.statValue}>{totals.total}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(234, 179, 8, 0.12)", color: "#ca8a04" }}>
            <iconify-icon icon="lucide:star" />
          </div>
          <div>
            <div className={styles.statLabel}>Average Rating</div>
            <div className={styles.statValue}>{totals.avgRating} ★</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:check-circle-2" />
          </div>
          <div>
            <div className={styles.statLabel}>Published</div>
            <div className={styles.statValue}>{totals.published}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:clock" />
          </div>
          <div>
            <div className={styles.statLabel}>Needs Review</div>
            <div className={styles.statValue}>{totals.pending}</div>
          </div>
        </div>
      </div>

      {/* RECENT REVIEWS CARD */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon="lucide:award" style={{ color: "#ff4500" }} /> Live Customer Testimonials
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Reviews" },
              { key: "5-star", label: "5 Stars ★" },
              { key: "published", label: "Published" },
              { key: "pending", label: "Pending" },
              { key: "hidden", label: "Hidden" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterPillActive : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading customer reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:star-off" style={{ fontSize: 52, color: "#94a3b8", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Reviews in this Filter</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>There are no client testimonials matching this criteria.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Reviewed Party</th>
                  <th>Associated Project</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review: any) => (
                  <tr key={review.id}>
                    <td className={styles.nowrap}>
                      <strong style={{ color: "#001f3f" }}>{review.author || "Client"}</strong>
                    </td>
                    <td className={styles.nowrap}>
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{review.target || "Technician"}</span>
                    </td>
                    <td className={styles.nowrap}>
                      <span style={{ color: "#475569" }}>{review.project || "Completed Project"}</span>
                    </td>
                    <td className={styles.nowrap}>
                      <span className={styles.stars}>
                        {"★".repeat(Number(review.rating) || 5)}
                        {"☆".repeat(Math.max(0, 5 - (Number(review.rating) || 5)))}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280, color: "#334155", fontStyle: "italic" }}>
                      "{review.comment || "Great quality work and punctual execution!"}"
                    </td>
                    <td>
                      <span className={`${styles.status} ${getStatusClass(review.status)}`}>
                        {review.status || "Published"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        {review.status !== "Published" ? (
                          <button
                            className={styles.btnPublish}
                            onClick={() => handlePublish(review.id)}
                            disabled={actionLoading === review.id}
                          >
                            <iconify-icon icon="lucide:check" /> {actionLoading === review.id ? "..." : "Publish"}
                          </button>
                        ) : (
                          <button
                            className={styles.btnModerate}
                            onClick={() => handleHide(review.id)}
                            disabled={actionLoading === review.id}
                          >
                            <iconify-icon icon="lucide:eye-off" /> {actionLoading === review.id ? "..." : "Hide"}
                          </button>
                        )}
                        <button
                          className={styles.btnDelete}
                          onClick={() => handleDelete(review.id)}
                          disabled={actionLoading === review.id}
                        >
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
