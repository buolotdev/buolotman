"use client";

import React, { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./reviews.module.css";

export default function AdminReviewsPage() {
  const { data: reviews, loading, refetch } = useFetch(() => api.getAdminReviews(), []);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div className={styles.page}>
        <SkeletonBlock style={{ height: 100, marginBottom: 30, borderRadius: 16 }} />
        <SkeletonBlock style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    if (status === "Published") return styles.statusPublished;
    if (status === "Hidden") return styles.statusHidden;
    return styles.statusPending;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Platform Reviews</h1>
        <p>Monitor and moderate feedback left by users across the platform.</p>
      </div>

      <div className={styles.card}>
        <h3>Recent Reviews</h3>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Author</th>
                <th>Reviewed User/Company</th>
                <th>Project</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews && reviews.map((review: any) => (
                <tr key={review.id}>
                  <td className={styles.nowrap}><strong>{review.author}</strong></td>
                  <td className={styles.nowrap}>{review.target}</td>
                  <td className={styles.nowrap}>{review.project}</td>
                  <td className={styles.nowrap}>
                    <span className={styles.stars}>
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                  </td>
                  <td style={{ maxWidth: 300 }}>{review.comment}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      {review.status !== "Published" && (
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => handlePublish(review.id)}
                          disabled={actionLoading === review.id}
                        >
                          {actionLoading === review.id ? '...' : 'Publish'}
                        </button>
                      )}
                      {review.status !== "Hidden" && (
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => handleHide(review.id)}
                          disabled={actionLoading === review.id}
                        >
                          {actionLoading === review.id ? '...' : 'Hide'}
                        </button>
                      )}
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading === review.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!reviews || reviews.length === 0) && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
