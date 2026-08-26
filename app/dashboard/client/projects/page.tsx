"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";

export default function ClientProjectsPage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "direct" | "marketplace" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: myTasksData, loading: tasksLoading, refetch: refetchTasks } = useFetch(() => api.getMyTasks(), []);
  const { data: walletData } = useFetch(() => api.getWallet(), []);

  const [localDirectHires, setLocalDirectHires] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("boulotman_direct_hires");
        if (raw) {
          setLocalDirectHires(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const serverTasks = toArray(myTasksData);

  // Combine local and server tasks
  const combinedProjects = useMemo(() => {
    const list: any[] = [];
    const seenIds = new Set<string>();

    const allRaw = [...localDirectHires, ...serverTasks];

    allRaw.forEach((t: any) => {
      const tKey = String(t.id || t.taskId || t.title);
      if (seenIds.has(tKey)) return;
      seenIds.add(tKey);

      // Check if accepted in local storage or on server
      const isLocallyAccepted = typeof window !== "undefined" && window.localStorage.getItem(`boulotman_accepted_task_${t.id || t.taskId}`) === "true";
      const isAccepted = t.status === "in_progress" || isLocallyAccepted;
      const isCompleted = t.status === "completed";

      // Detect specialist info
      let specialistName = t.specialist_name || t.specialistName || t.assigned_to_name || null;
      let specialistId = t.specialist_id || t.specialistId || (typeof t.assigned_to === "object" ? t.assigned_to?.id : t.assigned_to) || null;

      if (!specialistName && t.description && t.description.includes("specialist_name=")) {
        const match = t.description.match(/specialist_name=([^;\]]+)/);
        if (match) specialistName = decodeURIComponent(match[1]);
      }
      if (!specialistId && t.description && t.description.includes("specialist_id=")) {
        const match = t.description.match(/specialist_id=([^;\]]+)/);
        if (match) specialistId = Number(match[1]);
      }

      // Hardcoded fallback for existing test hires
      if (!specialistName) {
        if (t.title?.toLowerCase().includes("abc")) specialistName = "MM TECHNICIAN";
        else if (t.title?.toLowerCase().includes("auto work") || t.title?.toLowerCase().includes("need hh")) specialistName = "nayyam";
      }

      const isDirect = Boolean(specialistName || specialistId || t.isDirect || t.skills?.some((s: any) => String(s).includes("direct_invite")));
      const totalBudget = Number(t.budget_max || t.budget || t.budget_min || 0);

      list.push({
        id: t.id || t.taskId,
        taskId: t.id || t.taskId,
        title: t.title,
        specialistName: specialistName || "Marketplace Professional",
        specialistId: specialistId,
        isDirect,
        isAccepted,
        isCompleted,
        status: isCompleted ? "completed" : (isAccepted ? "in_progress" : "pending_acceptance"),
        budget: totalBudget,
        location: t.location || t.city || "Remote",
        created_at: t.created_at || Date.now(),
      });
    });

    return list;
  }, [localDirectHires, serverTasks]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    let list = combinedProjects;

    if (activeFilter === "direct") {
      list = list.filter(p => p.isDirect && !p.isCompleted);
    } else if (activeFilter === "marketplace") {
      list = list.filter(p => !p.isDirect && !p.isCompleted);
    } else if (activeFilter === "completed") {
      list = list.filter(p => p.isCompleted);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.specialistName?.toLowerCase().includes(q) || 
        p.location?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [combinedProjects, activeFilter, searchQuery]);

  // Summary Metrics
  const totalDirectHires = combinedProjects.filter(p => p.isDirect).length;
  const inProgressProjects = combinedProjects.filter(p => p.status === "in_progress").length;
  const pendingHires = combinedProjects.filter(p => p.status === "pending_acceptance").length;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader 
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search projects, technicians..."
          />

          <div className={styles.content}>
            {/* HERO SECTION */}
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>PROJECT MANAGEMENT & DIRECT HIRING</p>
                <h1>My Projects & Direct Hires</h1>
                <p>
                  Track all your active engagements, verify technician acceptance status, collaborate in real-time, and manage secure escrow payments.
                </p>
              </div>

              <Link href="/post-task" className={styles.btnPrimary}>
                <iconify-icon icon="lucide:plus-circle" style={{ fontSize: "18px" }} />
                Post New Task / Hire Pro
              </Link>
            </div>

            {/* STATS OVERVIEW */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <iconify-icon icon="lucide:briefcase" />
                </div>
                <div>
                  <div className={styles.statValue}>{combinedProjects.length}</div>
                  <div className={styles.statLabel}>Total Projects</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <iconify-icon icon="lucide:user-check" />
                </div>
                <div>
                  <div className={styles.statValue}>{totalDirectHires}</div>
                  <div className={styles.statLabel}>Direct Hires</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#fef3c7", color: "#d97706" }}>
                  <iconify-icon icon="lucide:activity" />
                </div>
                <div>
                  <div className={styles.statValue}>{inProgressProjects}</div>
                  <div className={styles.statLabel}>Active / In Progress</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#f1f5f9", color: "#475569" }}>
                  <iconify-icon icon="lucide:clock" />
                </div>
                <div>
                  <div className={styles.statValue}>{pendingHires}</div>
                  <div className={styles.statLabel}>Pending Acceptance</div>
                </div>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className={styles.filterBar}>
              <div className={styles.filterTabs}>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "all" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Projects ({combinedProjects.length})
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "direct" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("direct")}
                >
                  Direct Hires ({totalDirectHires})
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "marketplace" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("marketplace")}
                >
                  Marketplace Bids
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "completed" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("completed")}
                >
                  Completed
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="Filter by title or technician..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13.5px",
                    outline: "none",
                    minWidth: "220px"
                  }}
                />
              </div>
            </div>

            {/* PROJECTS LIST */}
            {tasksLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading your projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:folder-search" style={{ fontSize: "48px", color: "#94a3b8" }} />
                <h3 style={{ margin: 0, fontSize: "18px", color: "#001f3f" }}>No Projects Found</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px", maxWidth: "400px" }}>
                  You don't have any projects in this view yet. Directly hire verified technicians from their profiles or publish a public task.
                </p>
                <Link href="/technicians" className={styles.btnPrimary} style={{ marginTop: "10px" }}>
                  Browse Verified Technicians
                </Link>
              </div>
            ) : (
              <div className={styles.projectList}>
                {filteredProjects.map((project: any) => {
                  const techInitials = project.specialistName.slice(0, 2).toUpperCase();

                  return (
                    <div key={project.id} className={styles.projectCard}>
                      {/* CARD HEADER */}
                      <div className={styles.projectHeader}>
                        <div className={styles.projectHeaderLeft}>
                          <div className={styles.projectBadges}>
                            {project.isDirect && (
                              <span className={styles.badgeDirect}>
                                <iconify-icon icon="lucide:user-check" /> Direct Hire
                              </span>
                            )}

                            {project.isCompleted ? (
                              <span className={styles.badgeCompleted}>
                                <iconify-icon icon="lucide:check-circle" /> Completed & Handed Over
                              </span>
                            ) : project.isAccepted ? (
                              <span className={styles.badgeAccepted}>
                                <iconify-icon icon="lucide:check-circle" /> Accepted & In Progress 🚀
                              </span>
                            ) : (
                              <span className={styles.badgePending}>
                                <iconify-icon icon="lucide:clock" /> Pending Technician Acceptance
                              </span>
                            )}
                          </div>

                          <h2 className={styles.projectTitle}>{project.title}</h2>
                          
                          <div className={styles.projectMeta}>
                            <span>📍 {project.location}</span>
                            <span>•</span>
                            <span>📅 Initiated: {new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* RIGHT ACTION STATUS */}
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "2px" }}>
                            PROJECT BUDGET
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: 800, color: "#001f3f" }}>
                            {project.budget > 0 ? `${project.budget.toLocaleString()} XOF` : "Negotiable"}
                          </span>
                        </div>
                      </div>

                      {/* PROJECT DETAILS GRID */}
                      <div className={styles.projectGrid}>
                        {/* SPECIALIST CARD */}
                        <div className={styles.specialistCard}>
                          <div className={styles.specialistAvatar}>
                            {techInitials}
                          </div>
                          <div className={styles.specialistInfo}>
                            <span className={styles.specialistRole}>Assigned Professional</span>
                            <span className={styles.specialistName}>{project.specialistName}</span>
                          </div>
                        </div>

                        {/* ESCROW STATUS */}
                        <div className={styles.escrowBox}>
                          <span className={styles.escrowLabel}>
                            <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                            Escrow Protection
                          </span>
                          <span className={styles.escrowAmount}>
                            {project.isAccepted ? "🛡️ Funds Vault Protected" : "⏳ Awaiting Acceptance"}
                          </span>
                        </div>

                        {/* PROGRESS */}
                        <div className={styles.progressCol}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                            <span>Progress</span>
                            <span>{project.isCompleted ? "100%" : project.isAccepted ? "50%" : "20%"}</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ 
                                width: project.isCompleted ? "100%" : project.isAccepted ? "50%" : "20%",
                                background: project.isCompleted ? "#4338ca" : project.isAccepted ? "#16a34a" : "#f59e0b"
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className={styles.projectActions}>
                        <Link 
                          href={`/dashboard/client/messages?name=${encodeURIComponent(project.specialistName)}&task=${project.id}&specialist=${project.specialistId || ""}`}
                          className={styles.btnOutline}
                        >
                          <iconify-icon icon="lucide:message-square" />
                          Chat with {project.specialistName}
                        </Link>


                        <Link 
                          href={`/dashboard/client/projects/${project.id}`}
                          className={styles.btnPrimary}
                        >
                          Open Project Workspace →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
