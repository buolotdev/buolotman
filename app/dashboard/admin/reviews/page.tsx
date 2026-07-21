"use client";

import React, { useState } from "react";
import styles from "./reviews.module.css";

const MOCK_REVIEWS = [
  {
    id: "REV-1021",
    author: "John Mukasa",
    target: "Kigali Prime Constructors",
    project: "Residential Renovation",
    rating: 5,
    comment: "Excellent work! Highly recommended.",
    date: "12 Oct 2026",
    status: "Published",
    statusClass: styles.statusPublished,
  },
  {
    id: "REV-1022",
    author: "Mary Uwase",
    target: "Eric Niyonzima",
    project: "Office Electrical Upgrade",
    rating: 2,
    comment: "He arrived late and the wiring looks messy.",
    date: "10 Oct 2026",
    status: "Pending Review",
    statusClass: styles.statusPending,
  },
  {
    id: "REV-1023",
    author: "Paul Nshimiyimana",
    target: "Mike Doe",
    project: "Plumbing Fix",
    rating: 1,
    comment: "Abusive language used. Avoid this technician.",
    date: "08 Oct 2026",
    status: "Hidden",
    statusClass: styles.statusHidden,
  }
];

export default function AdminReviewsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Platform Reviews</h1>
        <p>Monitor and moderate feedback left by users across the platform.</p>
      </div>

      <div className={styles.card}>
        <h3>Recent Reviews</h3>
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
            {MOCK_REVIEWS.map((review) => (
              <tr key={review.id}>
                <td><strong>{review.author}</strong></td>
                <td>{review.target}</td>
                <td>{review.project}</td>
                <td>
                  <span className={styles.stars}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </span>
                </td>
                <td style={{ maxWidth: 300 }}>{review.comment}</td>
                <td><span className={`${styles.status} ${review.statusClass}`}>{review.status}</span></td>
                <td>
                  <div className={styles.tableActions}>
                    {review.status !== "Published" && (
                      <button className={styles.actionBtn}>Publish</button>
                    )}
                    {review.status !== "Hidden" && (
                      <button className={styles.actionBtn}>Hide</button>
                    )}
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
