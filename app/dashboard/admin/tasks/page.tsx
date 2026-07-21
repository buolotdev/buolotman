"use client";

import React, { useState } from "react";
import styles from "./admin-tasks.module.css";

// MOCK DATA FOR ADMIN PROJECTS
const MOCK_PROJECTS = [
  {
    id: "P-001",
    project: "Residential Renovation",
    client: "John Mukasa",
    executor: "Kigali Prime Constructors",
    type: "company",
    progress: 45,
    milestone: "Milestone 2",
    status: "Awaiting",
    statusClass: styles.statusPending,
  },
  {
    id: "P-002",
    project: "Office Electrical Upgrade",
    client: "Sarah Johnson",
    executor: "Eric Niyonzima",
    type: "tech",
    progress: 70,
    milestone: "Milestone 3",
    status: "Active",
    statusClass: styles.statusActive,
  },
  {
    id: "P-003",
    project: "Commercial Complex",
    client: "Africa Holdings Ltd",
    executor: "Kigali Prime Constructors",
    type: "company",
    progress: 60,
    milestone: "Milestone 2",
    status: "Active",
    statusClass: styles.statusActive,
  },
  {
    id: "P-004",
    project: "Plumbing Fix",
    client: "Mike Doe",
    executor: "Jean Paul",
    type: "tech",
    progress: 100,
    milestone: "Completed",
    status: "Completed",
    statusClass: styles.statusActive,
  },
];

export default function AdminTasksPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    if (activeTab === "all") return true;
    return p.type === activeTab;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Projects Monitoring</h1>
        <p>Monitor and manage all platform tasks, their statuses, and associated actions.</p>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Active Projects</span>
          <h3>186</h3>
        </div>
        <div className={styles.statCard}>
          <span>Awaiting Validation</span>
          <h3>12</h3>
        </div>
        <div className={styles.statCard}>
          <span>On Hold</span>
          <h3>2</h3>
        </div>
        <div className={styles.statCard}>
          <span>Completed</span>
          <h3>1,024</h3>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className={styles.highlightsGrid}>
        <div className={styles.highlightCard}>
          <h4>Pending Client Confirmations</h4>
          <p>7 project milestones awaiting client validation.</p>
          <button className={styles.actionBtn}>Review</button>
        </div>
        <div className={`${styles.highlightCard} ${styles.red}`}>
          <h4>Disputed Projects</h4>
          <p>3 projects flagged due to client complaints.</p>
          <button className={styles.actionBtn}>Resolve</button>
        </div>
      </div>

      {/* MAIN CONTENT CARD */}
      <div className={styles.mainCard}>
        <h3>Active Projects Snapshot</h3>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`} onClick={() => setActiveTab("all")}>All Projects</button>
          <button className={`${styles.tab} ${activeTab === "tech" ? styles.active : ""}`} onClick={() => setActiveTab("tech")}>Technician Projects</button>
          <button className={`${styles.tab} ${activeTab === "company" ? styles.active : ""}`} onClick={() => setActiveTab("company")}>Company Projects</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Executor</th>
              <th>Progress</th>
              <th>Milestone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr key={p.id}>
                <td>{p.project}</td>
                <td>{p.client}</td>
                <td>{p.executor}</td>
                <td>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className={styles.progressText}>{p.progress}%</span>
                  </div>
                </td>
                <td>{p.milestone}</td>
                <td><span className={`${styles.status} ${p.statusClass}`}>{p.status}</span></td>
                <td>
                  <div className={styles.tableActions}>
                    <button className={styles.btnPrimary}>Validate & Release</button>
                    <button className={styles.btnWarning}>Hold</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RECENT ACTIVITY */}
      <div className={styles.activityCard}>
        <h3>Recent Platform Activity</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <iconify-icon icon="lucide:check" className={styles.activityIcon} />
            <span><strong>Technician</strong> updated milestone progress on <strong>Project RM-10234</strong></span>
          </div>
          <div className={styles.activityItem}>
            <iconify-icon icon="lucide:check" className={styles.activityIcon} />
            <span><strong>Client</strong> confirmed progress for <strong>Residential Renovation</strong></span>
          </div>
          <div className={styles.activityItem}>
            <iconify-icon icon="lucide:alert-triangle" className={styles.activityIcon} style={{ color: "#ea580c" }} />
            <span><strong>Client</strong> reported issue on <strong>Office Complex Build</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
}
