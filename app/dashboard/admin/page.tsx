"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.getTasks({}), []);
  const { data: conversations } = useFetch(() => api.getConversations(), []);

  const tasks = toArray(tasksData);
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";

  return (
    <div className={styles.dashboardBody}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Dashboard Overview</h1>
          <p>Welcome back{userName ? `, ${userName}` : ""}. Here&apos;s a summary of Boulot Man&apos;s performance.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {tasksLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.statCard}><SkeletonStat /></div>
            ))}
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Tasks</span>
                <div className={styles.statIcon}><iconify-icon icon="lucide:file-text" /></div>
              </div>
              <div className={styles.statValue}>{tasksData?.count || tasks.length}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Active Tasks</span>
                <div className={`${styles.statIcon} ${styles.statIconOrange}`}><iconify-icon icon="lucide:briefcase" /></div>
              </div>
              <div className={styles.statValue}>{tasks.filter((t: any) => t.status === "open" || t.status === "in_progress").length}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Completed</span>
                <div className={styles.statIcon}><iconify-icon icon="lucide:check-circle" /></div>
              </div>
              <div className={styles.statValue}>{tasks.filter((t: any) => t.status === "completed").length}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Conversations</span>
                <div className={styles.statIcon}><iconify-icon icon="lucide:message-square" /></div>
              </div>
              <div className={styles.statValue}>{Array.isArray(conversations) ? conversations.length : 0}</div>
            </div>
          </>
        )}
      </div>

      <div className={styles.bottomGrid} style={{ gridTemplateColumns: "1fr" }}>
        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Recent Tasks</h2>
            <Link href="/dashboard/admin/tasks" className={styles.viewAllLink}>View All</Link>
          </div>
          {tasksLoading ? (
            <div className={styles.activityList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.activityItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: 14, padding: 16 }}>No tasks yet.</p>
          ) : (
            <div className={styles.activityList}>
              {tasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className={styles.activityItem}>
                  <div className={styles.activityIconBox} style={{ background: "rgba(0, 31, 63, 0.1)", color: "#001f3f" }}>
                    <iconify-icon icon="lucide:file-text" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityText}>{task.title || "Untitled Task"}</span>
                      <span className={styles.activityTime}>{task.status || "draft"}</span>
                    </div>
                    <p className={styles.activitySubtext}>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "No budget"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
