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
  const [activeNav, setActiveNav] = useState("projects");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "completed">("all");
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

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: projectsData, loading: projectsLoading, error } = useFetch(
    () => api.getCompanyProjects(),
    []
  );

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
                    <button className={styles.btnIconOnly}>
                      <iconify-icon icon="lucide:more-vertical" style={{ fontSize: "20px" }}></iconify-icon>
                    </button>
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
