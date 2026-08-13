"use client";

import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./admin.module.css";
import React from "react";

export default function AdminDashboard() {
  const { data, loading } = useFetch(() => api.getAdminDashboardStats(), []);

  if (loading) {
    return (
      <div className={styles.dashboardBody}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[1,2,3,4].map(i => <SkeletonBlock key={i} style={{ height: 120, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || { total_users: 0, active_projects: 0, pending_validations: 0, open_disputes: 0 };
  const alerts = data?.alerts || [];
  const activeProjects = data?.active_projects || [];
  const recentActivities = data?.recent_activity || [];

  return (
    <div className={styles.dashboardBody}>
      
      {/* METRICS */}
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Total Users</span>
            <h3>{metrics.total_users.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconBlue}`}>
            <iconify-icon icon="lucide:users" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Active Projects</span>
            <h3>{metrics.active_projects.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconGreen}`}>
            <iconify-icon icon="lucide:briefcase" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Pending Validations</span>
            <h3>{metrics.pending_validations.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconOrange}`}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricInfo}>
            <span>Open Disputes</span>
            <h3>{metrics.open_disputes.toLocaleString()}</h3>
          </div>
          <div className={`${styles.metricIcon} ${styles.iconRed}`}>
            <iconify-icon icon="lucide:alert-triangle" style={{ fontSize: "24px" }}></iconify-icon>
          </div>
        </div>
      </div>

      {/* ALERTS */}
      <div className={styles.alerts}>
        {alerts.map((alert: any, i: number) => (
          <div key={i} className={`${styles.alert} ${alert.type === 'danger' ? styles.alertDanger : styles.alertWarning}`}>
            <div className={styles.alertIconBox}>
              <iconify-icon icon={alert.type === 'danger' ? "lucide:alert-octagon" : "lucide:alert-triangle"} style={{ fontSize: "24px" }}></iconify-icon>
            </div>
            <div className={styles.alertContent}>
              <h4>{alert.title}</h4>
              <p>{alert.description}</p>
            </div>
            <button className={styles.btnAction}>{alert.type === 'danger' ? 'Resolve Now' : 'Review'}</button>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className={styles.allClearBanner}>
            <div className={styles.allClearIcon}>
              <iconify-icon icon="lucide:sparkles" style={{ fontSize: "28px" }}></iconify-icon>
            </div>
            <div className={styles.allClearText}>
              <h4>All Systems Functional</h4>
              <p>No pending alerts, urgent disputes, or verification tickets require your attention right now.</p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE PROJECTS */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleIndicator}></div>
          <h3>Active Projects Snapshot</h3>
        </div>
        {activeProjects.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Technician / Company</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeProjects.map((project: any) => (
                  <tr key={project.id}>
                    <td><strong>{project.title}</strong></td>
                    <td>{project.client_name}</td>
                    <td>{project.technician_name}</td>
                    <td>{project.progress}</td>
                    <td>
                      <span className={`${styles.status} ${project.status === 'open' || project.status === 'in_progress' ? styles.statusActive : styles.statusPending}`}>
                        {project.status}
                      </span>
                    </td>
                    <td><button className={styles.btnTable}>Open Workspace</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:folder-open" style={{ fontSize: "36px", color: "#94a3b8" }}></iconify-icon>
            <p>No active projects at the moment.</p>
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleIndicator}></div>
          <h3>Recent Platform Activity</h3>
        </div>
        {recentActivities.length > 0 ? (
          <div className={styles.activityList}>
            {recentActivities.map((activity: any, i: number) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIconBox}>
                  <iconify-icon icon="lucide:info" style={{ fontSize: "16px", color: "#001F3F" }}></iconify-icon>
                </div>
                <span>{activity.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:activity" style={{ fontSize: "36px", color: "#94a3b8" }}></iconify-icon>
            <p>No recent activity logs available.</p>
          </div>
        )}
      </div>

    </div>
  );
}
