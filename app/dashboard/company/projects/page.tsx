"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import layoutStyles from "../page.module.css";
import styles from "./projects.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { SkeletonStat, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";

const translations: Record<string, Record<string, string>> = {
  en: {
    pageTitle: "Projects & Contracts",
    pageSubtitle: "Manage your active projects and review completed contracts.",
    totalProjects: "Total Projects",
    activeContracts: "Active Contracts",
    pending: "Pending",
    completed: "Completed",
    allProjects: "All Projects",
    active: "Active",
    noProjectsFound: "No projects found",
    noProjectsMatching: "There are no projects matching this status.",
    client: "Client",
    totalBudget: "Total Budget",
    timeline: "Timeline",
    progress: "Progress",
    location: "Location",
    overallProgress: "Overall Progress",
    updated: "Updated",
    messageClient: "Message Client",
    manageProject: "Manage Project",
  },
  fr: {
    pageTitle: "Projets & Contrats",
    pageSubtitle: "Gérez vos projets en cours et consultez l'historique des contrats exécutés.",
    totalProjects: "Total des Projets",
    activeContracts: "Contrats Actifs",
    pending: "En attente",
    completed: "Terminé",
    allProjects: "Tous les projets",
    active: "Actifs",
    noProjectsFound: "Aucun projet trouvé",
    noProjectsMatching: "Aucun projet ne correspond à ce filtre.",
    client: "Client",
    totalBudget: "Budget Total",
    timeline: "Calendrier",
    progress: "Progression",
    location: "Localisation",
    overallProgress: "Progression Globale",
    updated: "Mis à jour le",
    messageClient: "Contacter le Client",
    manageProject: "Gérer le Projet",
  }
};

export default function CompanyProjects() {
  const toast = useToast();
  const dialog = useDialog();
  const [activeNav, setActiveNav] = useState("projects");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "completed">("all");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpenId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: projectsData, loading: projectsLoading, error, refetch: refetchProjects } = useFetch(
    () => api.getCompanyProjects(),
    []
  );

  const handleDeleteProject = async (projectId: number, title: string) => {
    setMenuOpenId(null);
    const ok = await dialog.confirm({
      title: lang === "fr" ? "Supprimer le projet ?" : "Delete Project?",
      message: lang === "fr" ? `Êtes-vous sûr de vouloir supprimer "${title}" ?` : `Are you sure you want to delete "${title}"? This cannot be undone.`,
      confirmText: lang === "fr" ? "Supprimer" : "Delete",
      cancelText: lang === "fr" ? "Annuler" : "Cancel",
      variant: "danger"
    });
    if (!ok) return;

    try {
      await api.deleteCompanyProject(projectId);
      toast.success(lang === "fr" ? "Projet supprimé" : "Project Deleted", title);
      await refetchProjects();
    } catch (err: any) {
      toast.error(lang === "fr" ? "Erreur" : "Error", err?.message || "Failed to delete project");
    }
  };

  const handleCopyProjectId = (projectId: number) => {
    setMenuOpenId(null);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(projectId));
      toast.info(lang === "fr" ? "ID copié" : "Copied", `Project #${projectId} ID copied.`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = (Array.isArray(projectsData) ? projectsData : projectsData?.results ?? []) as any[];

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return p.status === "active" || p.status === "in_progress";
    if (statusFilter === "pending") return p.status === "pending" || p.status === "draft";
    if (statusFilter === "completed") return p.status === "completed";
    return true;
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "in_progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingProjects = projects.filter(
    (p) => p.status === "pending" || p.status === "draft"
  ).length;

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return <span className={`${styles.badge} ${styles.badgeActive}`}>{t.active}</span>;
      case "pending":
      case "draft":
        return <span className={`${styles.badge} ${styles.badgePending}`}>{t.pending}</span>;
      case "completed":
        return <span className={`${styles.badge} ${styles.badgeCompleted}`}>{t.completed}</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };


  return (
        <main className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>{t.pageTitle}</h1>
            <p className={styles.pageSubtitle}>
              {t.pageSubtitle}
            </p>
          </div>
        </div>

          {projectsLoading ? (
            <div className={styles.statsGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonStat key={i} />
              ))}
            </div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{t.totalProjects}</span>
                  <iconify-icon icon="lucide:folder-open" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{totalProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{t.activeContracts}</span>
                  <iconify-icon icon="lucide:activity" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{activeProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{t.pending}</span>
                  <iconify-icon icon="lucide:clock" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{pendingProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{t.completed}</span>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{completedProjects}</div>
              </div>
            </div>
          )}

          <div className={styles.toolbarSection}>
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${statusFilter === "all" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("all")}>{t.allProjects}</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "active" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("active")}>{t.active}</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "pending" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("pending")}>{t.pending}</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "completed" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("completed")}>{t.completed}</button>
            </div>
          </div>

          <div className={styles.projectsList}>
            {projectsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : error ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#ef4444" }}>
                <p>{error}</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                <iconify-icon icon="lucide:folder-open" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }}></iconify-icon>
                <h3 style={{ margin: "0 0 8px" }}>{t.noProjectsFound}</h3>
                <p style={{ margin: 0 }}>{t.noProjectsMatching}</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <h3 className={styles.projectTitle}>{project.title || project.name || ""}</h3>
                      {statusBadge(project.status)}
                    </div>
                    <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={styles.btnIconOnly}
                        onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                        title="Options"
                      >
                        <iconify-icon icon="lucide:more-vertical" style={{ fontSize: "20px" }}></iconify-icon>
                      </button>

                      {menuOpenId === project.id && (
                        <div style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 4px)",
                          background: "#ffffff",
                          borderRadius: "14px",
                          boxShadow: "0 10px 30px rgba(0, 31, 63, 0.15), 0 2px 6px rgba(0,0,0,0.06)",
                          border: "1px solid #e2e8f0",
                          padding: "6px",
                          minWidth: "210px",
                          zIndex: 50,
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px"
                        }}>
                          <Link
                            href={`/dashboard/company/projects/tracking?projectId=${project.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 14px",
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "#001f3f",
                              textDecoration: "none",
                              borderRadius: "8px",
                              transition: "background 0.15s"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <iconify-icon icon="lucide:sliders" style={{ color: "#ff4500", fontSize: "16px" }} />
                            {lang === "fr" ? "Gérer & Suivre" : "Track & Milestones"}
                          </Link>

                          <Link
                            href="/dashboard/company/messages"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 14px",
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "#001f3f",
                              textDecoration: "none",
                              borderRadius: "8px",
                              transition: "background 0.15s"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <iconify-icon icon="lucide:message-square" style={{ color: "#0284c7", fontSize: "16px" }} />
                            {lang === "fr" ? "Message au client" : "Message Client"}
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleCopyProjectId(project.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 14px",
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "#001f3f",
                              background: "none",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              cursor: "pointer",
                              borderRadius: "8px",
                              transition: "background 0.15s"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <iconify-icon icon="lucide:copy" style={{ color: "#64748b", fontSize: "16px" }} />
                            {lang === "fr" ? "Copier l'ID" : "Copy Project ID"}
                          </button>

                          <div style={{ height: 1, background: "#e2e8f0", margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title || project.name || "Project")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 14px",
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "#dc2626",
                              background: "none",
                              border: "none",
                              width: "100%",
                              textAlign: "left",
                              cursor: "pointer",
                              borderRadius: "8px",
                              transition: "background 0.15s"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <iconify-icon icon="lucide:trash-2" style={{ color: "#dc2626", fontSize: "16px" }} />
                            {lang === "fr" ? "Supprimer le projet" : "Delete Project"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.projectDetailsGrid}>
                    <div className={styles.projectInfoCol}>
                      <div className={styles.metaGrid}>
                        <div className={styles.metaItemBox}>
                          <span className={styles.metaLabel}>{t.client}</span>
                          <div className={styles.metaValueRich}>
                            {project.client_name || ""}
                          </div>
                        </div>
                        {project.budget != null && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>{t.totalBudget}</span>
                            <div className={styles.metaValueRich}>{formatXOF(project.budget)}</div>
                          </div>
                        )}
                        {project.start_date && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>{t.timeline}</span>
                            <div className={styles.metaValueRich}>
                              {project.start_date}{project.end_date ? ` - ${project.end_date}` : ""}
                            </div>
                          </div>
                        )}
                        {project.progress != null && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>{t.progress}</span>
                            <div className={styles.metaValueRich}>{project.progress}%</div>
                          </div>
                        )}
                        {project.location && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>{t.location}</span>
                            <div className={styles.metaValueRich}>{project.location}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.projectProgressCol}>
                      <div className={styles.progressHeader}>
                        <span>{t.overallProgress}</span>
                        <span>{project.progress ?? 0}%</span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div
                          className={`${styles.progressBarFill} ${styles.fillActive}`}
                          style={{ width: `${project.progress ?? 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.projectFooter}>
                    <span className={styles.lastUpdated}>
                      <iconify-icon icon="lucide:history" style={{ fontSize: "14px" }}></iconify-icon>
                      {project.updated_at ? `${t.updated} ${new Date(project.updated_at).toLocaleDateString()}` : ""}
                    </span>
                    <div className={styles.actionButtons}>
                      <Link href="/dashboard/company/messages" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>{t.messageClient}</Link>
                      <Link href={`/dashboard/company/projects/tracking?projectId=${project.id}`} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>{t.manageProject}</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
    </main>
  );
}
