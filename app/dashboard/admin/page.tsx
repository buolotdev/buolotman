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
            <h4>{alert.title}</h4>
            <p>{alert.description}</p>
            <button className={styles.btnOutline}>{alert.type === 'danger' ? 'Resolve' : 'Review'}</button>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className={styles.alert}>
            <h4>All Clear!</h4>
            <p>There are no pending alerts or disputes to resolve.</p>
          </div>
        )}
      </div>

      {/* ACTIVE PROJECTS */}
      <div className={styles.section}>
        <h3>Active Projects Snapshot</h3>
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
                    <td>{project.title}</td>
                    <td>{project.client_name}</td>
                    <td>{project.technician_name}</td>
                    <td>{project.progress}</td>
                    <td>
                      <span className={`${styles.status} ${project.status === 'open' || project.status === 'in_progress' ? styles.statusActive : styles.statusPending}`}>
                        {project.status}
                      </span>
                    </td>
                    <td><button className={styles.btnOutline}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#666', fontSize: 14 }}>No active projects at the moment.</p>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className={styles.section}>
        <h3>Recent Platform Activity</h3>
        {recentActivities.length > 0 ? (
          recentActivities.map((activity: any, i: number) => (
            <div key={i} className={styles.activity}>
              <iconify-icon icon="lucide:check-circle" style={{ color: '#1e8e3e' }}></iconify-icon>
              <span>{activity.message}</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', fontSize: 14 }}>No recent activity.</p>
        )}
      </div>

    </div>
  );
}
