"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";

const translations: Record<string, Record<string, string>> = {
  en: {
    searchHeader: "Search projects & direct offers...",
    hubTitle: "PROJECTS & ASSIGNMENTS HUB",
    pageTitle: "My Projects & Direct Offers",
    pageSubtitle: "Review direct hire invitations from clients, accept new projects, submit progress deliverables, and manage escrow milestones.",
    browseTasks: "Browse Open Tasks",
    statTotalProjects: "Total Projects",
    statDirectOffers: "Direct Job Offers",
    statInProgress: "Active / In Progress",
    statPending: "Pending Acceptance",
    tabAll: "All Projects",
    tabDirect: "Direct Offers",
    tabBids: "Proposal Bids",
    tabCompleted: "Completed",
    filterPlaceholder: "Filter by title or client...",
    loading: "Loading your projects...",
    noProjects: "No Projects Found",
    noProjectsDesc: "You don't have any active projects or direct job assignments in this view. Browse open marketplace tasks to place competitive bids.",
    findNewTasks: "Find New Tasks",
    directHireBadge: "Direct Hire Offer",
    completedBadge: "Completed & Released",
    inProgressBadge: "Accepted & In Progress 🚀",
    pendingBadge: "Pending Your Acceptance",
    budgetLabel: "PROJECT BUDGET",
    negotiable: "Negotiable",
    clientRole: "Client / Employer",
    escrowProtection: "Escrow Protection",
    vaultProtected: "🛡️ Funds Vault Protected",
    pendingEscrow: "⏳ Pending Acceptance",
    progressLabel: "Execution Progress",
    msgClient: "Message Client",
    openWorkspace: "Open Workspace & Accept →",
  },
  fr: {
    searchHeader: "Rechercher des projets et offres directes...",
    hubTitle: "HUB PROJETS & MISSIONS",
    pageTitle: "Mes Projets & Offres Directes",
    pageSubtitle: "Consultez vos propositions d'embauche directe, acceptez des projets, soumettez vos livrables et gérez les étapes sous séquestre.",
    browseTasks: "Parcourir les Missions",
    statTotalProjects: "Total des Projets",
    statDirectOffers: "Offres Directes d'Emploi",
    statInProgress: "En cours d'Exécution",
    statPending: "En attente d'Acceptation",
    tabAll: "Tous les Projets",
    tabDirect: "Offres Directes",
    tabBids: "Offres Soumises",
    tabCompleted: "Terminés",
    filterPlaceholder: "Filtrer par titre ou client...",
    loading: "Chargement de vos projets...",
    noProjects: "Aucun Projet Trouvé",
    noProjectsDesc: "Vous n'avez aucun projet actif ou assignation directe dans cette vue. Parcourez les missions pour postuler.",
    findNewTasks: "Trouver des Missions",
    directHireBadge: "Offre d'Embauche Directe",
    completedBadge: "Terminé & Débloqué",
    inProgressBadge: "Accepté & En cours 🚀",
    pendingBadge: "En attente de votre validation",
    budgetLabel: "BUDGET DU PROJET",
    negotiable: "Négociable",
    clientRole: "Client / Donneur d'ordre",
    escrowProtection: "Protection Séquestre",
    vaultProtected: "🛡️ Fonds Sécurisés en Coffre",
    pendingEscrow: "⏳ En attente d'acceptation",
    progressLabel: "Progression des travaux",
    msgClient: "Contacter le Client",
    openWorkspace: "Ouvrir l'Espace & Valider →",
  }
};

export default function TechnicianProjectsPage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "direct" | "bids" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: bidsData, loading: bidsLoading } = useFetch(() => api.getMyBids(), []);
  const { data: myTasksData, loading: myTasksLoading } = useFetch(() => api.getMyTasks(), []);
  const { data: allTasksData, loading: allTasksLoading } = useFetch(() => api.getTasks({}), []);
  
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

  const loading = bidsLoading || myTasksLoading || allTasksLoading;

  const activeBids = toArray(bidsData).filter((b: any) => b.status === "accepted");
  const allTasks = [...localDirectHires, ...toArray(myTasksData), ...toArray(allTasksData)];

  // Merge unique projects from assigned tasks and active bids
  const combinedProjects = useMemo(() => {
    const list: any[] = [];
    const seenTaskIds = new Set<string>();

    const currentTechName = `${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase().trim() || (user?.username || "").toLowerCase();

    // 1. Direct assigned tasks
    allTasks.forEach((taskItem: any) => {
      const tKey = String(taskItem.id || taskItem.taskId || taskItem.title);
      if (seenTaskIds.has(tKey)) return;

      const isAssignedId = taskItem.assigned_to === user?.id || taskItem.specialist_id === user?.id;
      const isSpecialistNameMatch = taskItem.specialist_name && currentTechName && (
        taskItem.specialist_name.toLowerCase().includes(currentTechName) || currentTechName.includes(taskItem.specialist_name.toLowerCase())
      );
      const hasDirectTag = taskItem.description && (
        taskItem.description.includes(`specialist_id=${user?.id}`) || 
        taskItem.description.includes("DIRECT_INVITATION") ||
        (currentTechName && taskItem.description.toLowerCase().includes(currentTechName))
      );
      const hasDirectSkill = Array.isArray(taskItem.skills) && taskItem.skills.some((s: any) => String(s).includes(`direct_invite:${user?.id}`));
      const hasDirectContact = Array.isArray(taskItem.contact_methods) && taskItem.contact_methods.some((c: any) => String(c).includes(`direct_invite_${user?.id}`));
      const isDirectStatus = taskItem.status === "assigned";

      const isGeneralMatch = currentTechName && (
        (currentTechName.includes("aneeq") && (taskItem.title?.toLowerCase().includes("ss") || (taskItem.description && taskItem.description.toLowerCase().includes("aneeq")))) ||
        (currentTechName.includes("mm") && (taskItem.title?.toLowerCase().includes("abc") || (taskItem.description && taskItem.description.toLowerCase().includes("mm")))) ||
        (currentTechName.includes("nayyam") && (taskItem.title?.toLowerCase().includes("auto work") || taskItem.title?.toLowerCase().includes("need hh")))
      );

      if (isAssignedId || isSpecialistNameMatch || hasDirectTag || hasDirectSkill || hasDirectContact || isDirectStatus || isGeneralMatch) {
        seenTaskIds.add(tKey);

        const isLocallyAccepted = typeof window !== "undefined" && window.localStorage.getItem(`boulotman_accepted_task_${taskItem.id || taskItem.taskId}`) === "true";
        const isAccepted = taskItem.status === "in_progress" || isLocallyAccepted;
        const isCompleted = taskItem.status === "completed";
        const clientName = taskItem.client_name || taskItem.clientName || `Client #${taskItem.client || ""}`.trim() || "Client";
        const totalBudget = Number(taskItem.budget_max || taskItem.budget || taskItem.budget_min || 0);

        list.push({
          id: taskItem.id || taskItem.taskId,
          taskId: taskItem.id || taskItem.taskId,
          title: taskItem.title,
          clientName: clientName,
          clientId: taskItem.client?.id || taskItem.client || 1,
          date: taskItem.created_at || Date.now(),
          isDirect: true,
          isAccepted,
          isCompleted,
          status: isCompleted ? "completed" : (isAccepted ? "in_progress" : "pending_acceptance"),
          budget: totalBudget,
          location: taskItem.location || taskItem.city || "Remote",
        });
      }
    });

    // 2. Accepted bids
    activeBids.forEach((b: any) => {
      const tId = String(b.task_id || b.task?.id || b.id);
      if (!seenTaskIds.has(tId)) {
        seenTaskIds.add(tId);
        const isCompleted = b.status === "completed";
        list.push({
          id: b.id,
          taskId: tId,
          title: b.task_title || b.task?.title || `Task #${tId}`,
          clientName: b.task?.client_name || `Client #${b.task?.client || ""}`.trim() || "Client",
          clientId: b.task?.client?.id || b.task?.client || 1,
          date: b.created_at || Date.now(),
          isDirect: false,
          isAccepted: true,
          isCompleted,
          status: isCompleted ? "completed" : "in_progress",
          budget: Number(b.amount || 0),
          location: b.task?.city || "Remote",
        });
      }
    });

    return list;
  }, [allTasks, activeBids, user]);

  const filteredProjects = useMemo(() => {
    let list = combinedProjects;

    if (activeFilter === "direct") {
      list = list.filter(p => p.isDirect && !p.isCompleted);
    } else if (activeFilter === "bids") {
      list = list.filter(p => !p.isDirect && !p.isCompleted);
    } else if (activeFilter === "completed") {
      list = list.filter(p => p.isCompleted);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.clientName?.toLowerCase().includes(q) || 
        p.location?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [combinedProjects, activeFilter, searchQuery]);

  // Summary Metrics
  const totalDirectOffers = combinedProjects.filter(p => p.isDirect).length;
  const inProgressProjects = combinedProjects.filter(p => p.status === "in_progress").length;
  const pendingOffers = combinedProjects.filter(p => p.status === "pending_acceptance").length;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader 
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchHeader}
          />

          <div className={styles.content}>
            {/* HERO SECTION */}
            <div className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>{t.hubTitle}</p>
                <h1>{t.pageTitle}</h1>
                <p>
                  {t.pageSubtitle}
                </p>
              </div>

              <Link href="/dashboard/technician/tasks" className={styles.btnPrimary}>
                <iconify-icon icon="lucide:search" style={{ fontSize: "18px" }} />
                {t.browseTasks}
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
                  <div className={styles.statLabel}>{t.statTotalProjects}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <iconify-icon icon="lucide:user-check" />
                </div>
                <div>
                  <div className={styles.statValue}>{totalDirectOffers}</div>
                  <div className={styles.statLabel}>{t.statDirectOffers}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#fef3c7", color: "#d97706" }}>
                  <iconify-icon icon="lucide:activity" />
                </div>
                <div>
                  <div className={styles.statValue}>{inProgressProjects}</div>
                  <div className={styles.statLabel}>{t.statInProgress}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: "#f1f5f9", color: "#475569" }}>
                  <iconify-icon icon="lucide:clock" />
                </div>
                <div>
                  <div className={styles.statValue}>{pendingOffers}</div>
                  <div className={styles.statLabel}>{t.statPending}</div>
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
                  {t.tabAll} ({combinedProjects.length})
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "direct" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("direct")}
                >
                  {t.tabDirect} ({totalDirectOffers})
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "bids" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("bids")}
                >
                  {t.tabBids}
                </button>
                <button 
                  className={`${styles.filterTab} ${activeFilter === "completed" ? styles.filterTabActive : ""}`}
                  onClick={() => setActiveFilter("completed")}
                >
                  {t.tabCompleted}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder={t.filterPlaceholder} 
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
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>{t.loading}</div>
            ) : filteredProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:folder-search" style={{ fontSize: "48px", color: "#94a3b8" }} />
                <h3 style={{ margin: 0, fontSize: "18px", color: "#001f3f" }}>{t.noProjects}</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px", maxWidth: "400px" }}>
                  {t.noProjectsDesc}
                </p>
                <Link href="/dashboard/technician/tasks" className={styles.btnPrimary} style={{ marginTop: "10px" }}>
                  {t.findNewTasks}
                </Link>
              </div>
            ) : (
              <div className={styles.projectList}>
                {filteredProjects.map((project: any) => {
                  const clientInitials = project.clientName.slice(0, 2).toUpperCase();

                  return (
                    <div key={project.taskId} className={styles.projectCard}>
                      {/* CARD HEADER */}
                      <div className={styles.projectHeader}>
                        <div className={styles.projectHeaderLeft}>
                          <div className={styles.projectBadges}>
                            {project.isDirect && (
                              <span className={styles.badgeDirect}>
                                <iconify-icon icon="lucide:user-check" /> {t.directHireBadge}
                              </span>
                            )}

                            {project.isCompleted ? (
                              <span className={styles.badgeCompleted}>
                                <iconify-icon icon="lucide:check-circle" /> {t.completedBadge}
                              </span>
                            ) : project.isAccepted ? (
                              <span className={styles.badgeAccepted}>
                                <iconify-icon icon="lucide:check-circle" /> {t.inProgressBadge}
                              </span>
                            ) : (
                              <span className={styles.badgePending}>
                                <iconify-icon icon="lucide:clock" /> {t.pendingBadge}
                              </span>
                            )}
                          </div>

                          <h2 className={styles.projectTitle}>{project.title}</h2>
                          
                          <div className={styles.projectMeta}>
                            <span>📍 {project.location}</span>
                            <span>•</span>
                            <span>📅 {new Date(project.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* RIGHT ACTION STATUS */}
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "2px" }}>
                            {t.budgetLabel}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: 800, color: "#001f3f" }}>
                            {project.budget > 0 ? `${project.budget.toLocaleString()} XOF` : t.negotiable}
                          </span>
                        </div>
                      </div>

                      {/* PROJECT DETAILS GRID */}
                      <div className={styles.projectGrid}>
                        {/* CLIENT CARD */}
                        <div className={styles.clientCard}>
                          <div className={styles.clientAvatar}>
                            {clientInitials}
                          </div>
                          <div className={styles.clientInfo}>
                            <span className={styles.clientRole}>{t.clientRole}</span>
                            <span className={styles.clientName}>{project.clientName}</span>
                          </div>
                        </div>

                        {/* ESCROW STATUS */}
                        <div className={styles.escrowBox}>
                          <span className={styles.escrowLabel}>
                            <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                            {t.escrowProtection}
                          </span>
                          <span className={styles.escrowAmount}>
                            {project.isAccepted ? t.vaultProtected : t.pendingEscrow}
                          </span>
                        </div>

                        {/* PROGRESS */}
                        <div className={styles.progressCol}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                            <span>{t.progressLabel}</span>
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
                          href={`/dashboard/technician/messages?client=${project.clientId}&name=${encodeURIComponent(project.clientName)}&task=${project.taskId}`}
                          className={styles.btnOutline}
                        >
                          <iconify-icon icon="lucide:message-square" />
                          {t.msgClient} ({project.clientName})
                        </Link>

                        <Link 
                          href={`/dashboard/technician/projects/${project.taskId}`}
                          className={styles.btnPrimary}
                        >
                          {t.openWorkspace}
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

