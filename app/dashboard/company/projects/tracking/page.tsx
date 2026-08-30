"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense, useState, useEffect } from "react";
import styles from "./tracking.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";

const translations: Record<string, Record<string, string>> = {
  en: {
    backToProjects: "Back to Projects",
    projectNotFound: "Project not found",
    selectProject: "Select a project from the projects list to view tracking.",
    activeProject: "Active Project",
    completed: "Completed",
    createdOn: "Created on",
    messageClient: "Message Client",
    client: "Client",
    totalBudget: "Total Budget",
    estimatedDeadline: "Estimated Deadline",
    notSet: "Not set",
    projectProgress: "Project Progress",
    milestonesCompleted: "Milestones Completed",
    milestones: "Milestones",
    noMilestones: "No milestones yet",
    noMilestonesDesc: "Milestones will appear here once defined for this project.",
    dueBy: "Due by",
    inProgress: "In Progress",
    pending: "Pending",
    paid: "Paid",
    fundedInEscrow: "Funded in Escrow",
    awaitingDeposit: "Awaiting Deposit",
  },
  fr: {
    backToProjects: "Retour aux Projets",
    projectNotFound: "Projet introuvable",
    selectProject: "Sélectionnez un projet dans la liste pour voir son suivi.",
    activeProject: "Projet Actif",
    completed: "Terminé",
    createdOn: "Créé le",
    messageClient: "Contacter le Client",
    client: "Client",
    totalBudget: "Budget Total",
    estimatedDeadline: "Date limite estimée",
    notSet: "Non définie",
    projectProgress: "Progression du Projet",
    milestonesCompleted: "Jalons terminés",
    milestones: "Jalons",
    noMilestones: "Aucun jalon défini",
    noMilestonesDesc: "Les jalons apparaîtront ici dès qu'ils seront définis pour ce projet.",
    dueBy: "Échéance le",
    inProgress: "En cours",
    pending: "En attente",
    paid: "Payé",
    fundedInEscrow: "Déposé sous Séquestre",
    awaitingDeposit: "En attente de dépôt",
  }
};

function ProjectTrackingContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
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

  const { data: projectsData, loading } = useFetch(() => api.getCompanyProjects(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const project = useMemo(() => {
    if (!projectsData) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = (projectsData?.results ?? projectsData) as any[];
    if (projectId) {
      return Array.isArray(results)
        ? results.find((p) => String(p.id) === projectId)
        : null;
    }
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  }, [projectsData, projectId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const milestones = (project?.milestones ?? project?.milestone_set ?? []) as any[];

  const completedCount = milestones.filter(
    (m) => m.status === "completed" || m.is_completed
  ).length;

  const progress = project?.progress ?? (milestones.length > 0
    ? Math.round((completedCount / milestones.length) * 100)
    : 0);

  if (loading) {
    return (
      <div className={styles.exportWrapper}>

        <main className={styles.pageContainer}>
          <SkeletonBlock style={{ height: 24, width: 200, marginBottom: 24 }} />
          <SkeletonBlock style={{ height: 180, borderRadius: 12, marginBottom: 32 }} />
          <SkeletonCard />
          <SkeletonCard />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.exportWrapper}>

        <main className={styles.pageContainer}>
          <Link href="/dashboard/company/projects" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: '16px' }}></iconify-icon>
            {t.backToProjects}
          </Link>
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
            <iconify-icon icon="lucide:folder-open" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></iconify-icon>
            <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>{t.projectNotFound}</h3>
            <p style={{ margin: 0 }}>{t.selectProject}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.exportWrapper}>


      <main className={styles.pageContainer}>
        <Link href="/dashboard/company/projects" className={styles.backLink}>
          <iconify-icon icon="lucide:arrow-left" style={{ fontSize: '16px' }}></iconify-icon>
          {t.backToProjects}
        </Link>

        <div className={styles.projectHeader}>
          <div className={styles.phTop}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '8px',
                }}
              >
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#001f3f',
                    margin: 0,
                  }}
                >
                  {project.title || project.name || ""}
                </h1>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                  {project.status === "completed" ? t.completed : t.activeProject}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                ID: {project.id ?? ""}
                {project.created_at && ` • ${t.createdOn} ${new Date(project.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <Link 
              href={`/dashboard/company/messages?name=${encodeURIComponent(project.client_name || 'Client')}&task=${project.id || ''}&client=${project.client_id || project.client || ''}`} 
              className={styles.btnOutline}
            >
              <iconify-icon icon="lucide:message-square" style={{ fontSize: '16px' }}></iconify-icon>
              {t.messageClient}
            </Link>
          </div>


          <div className={styles.phStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>{t.client}</span>
              <div className={styles.statValue}>
                {project.client_name || ""}
              </div>
            </div>
            {project.budget != null && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t.totalBudget}</span>
                <div className={styles.statValue}>
                  <span style={{ fontSize: '18px', color: '#001f3f' }}>{formatXOF(project.budget)}</span>
                </div>
              </div>
            )}
            {(project.end_date || project.timeline) ? (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t.estimatedDeadline}</span>
                <div className={styles.statValue}>
                  <iconify-icon icon="lucide:calendar" style={{ fontSize: '16px', color: '#64748b' }}></iconify-icon>
                  {project.end_date ? new Date(project.end_date).toLocaleDateString() : project.timeline}
                </div>
              </div>
            ) : (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t.estimatedDeadline}</span>
                <div className={styles.statValue}>
                  <iconify-icon icon="lucide:calendar" style={{ fontSize: '16px', color: '#64748b' }}></iconify-icon>
                  <span style={{ color: '#94a3b8' }}>{t.notSet}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressInfo}>
              <span>{t.projectProgress}</span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.progressMeta}>
              {completedCount} / {milestones.length} {t.milestonesCompleted}
            </div>
          </div>
        </div>

        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#001f3f',
            marginBottom: '24px',
            marginTop: 0,
          }}
        >
          {t.milestones}
        </h2>

        {milestones.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
            <iconify-icon icon="lucide:list-checks" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></iconify-icon>
            <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>{t.noMilestones}</h3>
            <p style={{ margin: 0 }}>{t.noMilestonesDesc}</p>
          </div>
        ) : (
          <div className={styles.timeline}>
            {milestones.map((milestone, index) => {
              const isCompleted = milestone.status === "completed" || milestone.is_completed;
              const isActive = milestone.status === "in_progress" || milestone.is_active;

              return (
                <div
                  key={milestone.id || index}
                  className={`${styles.timelineItem} ${isCompleted ? styles.completed : ""} ${isActive ? styles.active : ""}`}
                >
                  <div className={styles.timelineMarker}>
                    {isCompleted && (
                      <iconify-icon icon="lucide:check" style={{ fontSize: '16px', color: '#fff' }}></iconify-icon>
                    )}
                    {isActive && <div className={styles.activeDot}></div>}
                  </div>
                  <div className={styles.milestoneCard}>
                    <div className={styles.mcHeader}>
                      <div>
                        <h3 className={styles.mcTitle}>{milestone.title || milestone.name || ""}</h3>
                        <span className={styles.mcDate}>
                          {milestone.due_date && `${t.dueBy} ${new Date(milestone.due_date).toLocaleDateString()}`}
                        </span>
                      </div>
                      {milestone.amount != null && (
                        <div className={styles.mcAmount}>{formatXOF(milestone.amount)}</div>
                      )}
                    </div>
                    {milestone.description && (
                      <p className={styles.mcDesc}>{milestone.description}</p>
                    )}

                    <div className={styles.mcFooter}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span className={`${styles.badge} ${isCompleted ? styles.badgeDefault : isActive ? styles.badgeActive : styles.badgeDefault}`}>
                          {isCompleted ? t.completed : isActive ? t.inProgress : t.pending}
                        </span>
                        {(milestone.is_paid || milestone.payment_status === "paid") && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <iconify-icon icon="lucide:check-circle" style={{ fontSize: '12px' }}></iconify-icon>
                            {t.paid}
                          </span>
                        )}
                        {(milestone.is_funded || milestone.payment_status === "funded") && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <iconify-icon icon="lucide:lock" style={{ fontSize: '12px' }}></iconify-icon>
                            {t.fundedInEscrow}
                          </span>
                        )}
                        {milestone.payment_status === "awaiting" && (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>
                            <iconify-icon icon="lucide:circle-dashed" style={{ fontSize: '12px' }}></iconify-icon>
                            {t.awaitingDeposit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectTracking() {
  return (
    <Suspense fallback={
      <div className={styles.exportWrapper}>
        <header className={styles.topNav}>
          <div className={styles.navContainer}>
            <div className={styles.navLeft}>
              <Link href="/dashboard/company" className={styles.brand}>
                <Image
                  src="/boulotman-logo.png"
                  alt="Boulot Man"
                  width={180}
                  height={46}
                  style={{ width: 'auto', height: '46px' }}
                  priority
                />
              </Link>
            </div>
          </div>
        </header>
        <main className={styles.pageContainer}>
          <SkeletonBlock style={{ height: 24, width: 200, marginBottom: 24 }} />
          <SkeletonBlock style={{ height: 180, borderRadius: 12, marginBottom: 32 }} />
          <SkeletonCard />
        </main>
      </div>
    }>
      <ProjectTrackingContent />
    </Suspense>
  );
}
