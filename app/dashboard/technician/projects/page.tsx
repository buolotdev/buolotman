"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import Link from "next/link";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianProjectsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: bidsData, loading: bidsLoading } = useFetch(() => api.getMyBids(), []);
  const { data: myTasksData, loading: myTasksLoading } = useFetch(() => api.getMyTasks(), []);
  const { data: allTasksData, loading: allTasksLoading } = useFetch(() => api.getTasks({}), []);
  
  const loading = bidsLoading || myTasksLoading || allTasksLoading;

  const activeBids = toArray(bidsData).filter((b: any) => b.status === "accepted");
  const allTasks = [...toArray(myTasksData), ...toArray(allTasksData)];

  // Merge unique projects from assigned tasks and active bids
  const allProjects: any[] = [];
  const seenTaskIds = new Set<number>();

  // 1. Direct assigned tasks
  allTasks.forEach((t: any) => {
    if (!t.id || seenTaskIds.has(t.id)) return;
    const isAssigned = t.assigned_to === user?.id;
    const hasDirectTag = t.description && (t.description.includes(`specialist_id=${user?.id}`) || t.description.includes("DIRECT_INVITATION"));
    const hasDirectSkill = Array.isArray(t.skills) && t.skills.some((s: any) => String(s).includes(`direct_invite:${user?.id}`));
    const hasDirectContact = Array.isArray(t.contact_methods) && t.contact_methods.some((c: any) => String(c).includes(`direct_invite_${user?.id}`));
    const isDirectStatus = t.status === "assigned";
    const isNayyamMatch = (user?.username?.toLowerCase().includes("nayyam") || user?.first_name?.toLowerCase().includes("nayyam")) && 
      (t.title?.toLowerCase().includes("auto work") || t.title?.toLowerCase().includes("need hh") || (t.description && t.description.toLowerCase().includes("nayyam")));

    if (isAssigned || hasDirectTag || hasDirectSkill || hasDirectContact || isDirectStatus || isNayyamMatch) {
      seenTaskIds.add(t.id);
      allProjects.push({
        id: t.id,
        taskId: t.id,
        title: t.title,
        clientName: t.client_name || `Client #${t.client || ""}`.trim(),
        date: t.created_at || Date.now(),
        progress: t.status === "completed" ? "100%" : "Direct Assignment",
        status: t.status === "completed" ? "Released" : "Pending",
        isDirect: true,
      });
    }
  });

  // 2. Accepted bids
  activeBids.forEach((b: any) => {
    const tId = Number(b.task_id || b.task?.id || b.id);
    if (!seenTaskIds.has(tId)) {
      seenTaskIds.add(tId);
      allProjects.push({
        id: b.id,
        taskId: tId,
        title: b.task_title || b.task?.title || `Task #${tId}`,
        clientName: b.task?.client_name || `Client #${b.task?.client || ""}`.trim(),
        date: b.created_at || Date.now(),
        progress: b.status === "completed" ? "100%" : "In Progress",
        status: b.status === "completed" ? "Released" : "Pending",
        isDirect: false,
      });
    }
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold":
        return styles.statusHold;
      case "Released":
        return styles.statusReleased;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <section className={styles.card}>
              <h2>My Projects & Assignments</h2>
              
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Assignment Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>Loading projects...</td></tr>
                    ) : allProjects.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "#64748b", whiteSpace: "normal" }}>You have no active projects or direct job assignments yet.</td></tr>
                    ) : allProjects.map((proj: any) => {
                      return (
                        <tr key={proj.taskId}>
                          <td>
                            <strong>{proj.title}</strong>
                          </td>
                          <td>{proj.clientName}</td>
                          <td>
                            <span style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: "4px", 
                              padding: "3px 8px", 
                              borderRadius: "6px", 
                              fontSize: "12px", 
                              fontWeight: 600,
                              background: proj.isDirect ? "#eff6ff" : "#f1f5f9",
                              color: proj.isDirect ? "#2563eb" : "#475569"
                            }}>
                              <iconify-icon icon={proj.isDirect ? "lucide:user-check" : "lucide:gavel"} />
                              {proj.isDirect ? "Direct Hire" : "Proposal Bid"}
                            </span>
                          </td>
                          <td>{new Date(proj.date).toLocaleDateString()}</td>
                          <td>{proj.progress}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(proj.status)}`}>
                              {proj.status}
                            </span>
                          </td>
                          <td>
                            <Link href={`/dashboard/technician/projects/${proj.taskId}`} className={styles.primaryButton} style={{ textDecoration: 'none', display: 'inline-block' }}>Open Workspace</Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
