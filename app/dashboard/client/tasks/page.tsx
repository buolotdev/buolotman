"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

const translations: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search tasks...",
    eyebrow: "Task management",
    title: "My Tasks",
    subtitle: "Open any task to manage progress, review proposals, and keep communication in one place.",
    postAnother: "Post another task",
    noTasks: "No tasks yet.",
    proposals: "proposals",
    views: "views",
    viewCompleted: "View Completed Task",
    openActive: "Open Active Task",
    reviewProposals: "Review Proposals",
    openTask: "Open Task",
    inProgress: "In Progress",
    completed: "Completed",
    open: "Open",
    cancelled: "Cancelled",
  },
  fr: {
    searchPlaceholder: "Rechercher des tâches...",
    eyebrow: "Gestion des missions",
    title: "Mes Tâches",
    subtitle: "Consultez vos tâches pour suivre l'avancement, examiner les propositions et communiquer en un seul endroit.",
    postAnother: "Publier une autre tâche",
    noTasks: "Aucune tâche pour le moment.",
    proposals: "offres",
    views: "vues",
    viewCompleted: "Voir la tâche terminée",
    openActive: "Voir la mission en cours",
    reviewProposals: "Examiner les offres",
    openTask: "Ouvrir la tâche",
    inProgress: "En cours",
    completed: "Terminée",
    open: "Ouverte",
    cancelled: "Annulée",
  }
};

function getStatusMeta(status: string, t: Record<string, string>) {
  switch (status) {
    case "in_progress":
      return { label: t.inProgress || "In Progress", badgeClass: "badgeProgress", progressClass: "progressActive" };
    case "completed":
      return { label: t.completed || "Completed", badgeClass: "badgeSuccess", progressClass: "progressSuccess" };
    case "open":
      return { label: t.open || "Open", badgeClass: "badgeWarning", progressClass: "progressPending" };
    case "cancelled":
      return { label: t.cancelled || "Cancelled", badgeClass: "badgeDanger", progressClass: "progressPending" };
    default:
      return { label: status, badgeClass: "badgeDefault", progressClass: "progressPending" };
  }
}

export default function ClientTasksPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const { data: tasksData, loading } = useFetch(() => api.getMyTasks(), []);
  const tasks = toArray(tasksData);

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tasks;
    return tasks.filter((task: any) =>
      [task.title, task.city || task.location, task.category, task.schedule].join(" ").toLowerCase().includes(normalized)
    );
  }, [query, tasks]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchPlaceholder}
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>{t.eyebrow}</p>
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
              </div>
              <Link href="/post-task" className={styles.primaryButton}>
                <iconify-icon icon="lucide:plus" />
                {t.postAnother}
              </Link>
            </section>

            <section className={styles.list}>
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredTasks.length ? (
                filteredTasks.map((task: any) => {
                  const isTaskCompleted = task.status === "completed";
                  const hasAcceptedProposal = Number(task.accepted_bids_count || 0) > 0 || Boolean(task.assigned_to);
                  const displayStatus = isTaskCompleted ? "completed" : (hasAcceptedProposal && task.status === "open" ? "in_progress" : task.status);
                  const statusMeta = getStatusMeta(displayStatus, t);
                  const taskHref = isTaskCompleted || task.status === "in_progress"
                    ? `/dashboard/client/projects/${task.id}`
                    : (hasAcceptedProposal || task.status !== "open"
                      ? `/dashboard/client/tasks/${task.id}`
                      : `/dashboard/client/tasks/${task.id}/proposals`);
                  return (
                    <article key={task.id} className={styles.taskCard}>
                      <div className={styles.taskMain}>
                        <div className={styles.cardHeader}>
                          <span className={`${styles.badge} ${styles[statusMeta.badgeClass]}`}>{statusMeta.label}</span>
                          <strong>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</strong>
                        </div>
                        <h3>{task.title}</h3>
                        <div className={styles.taskMeta}>
                          <span>{task.category}</span>
                          <span>{task.city || task.location}</span>
                          <span>{task.schedule}</span>
                        </div>
                        <div className={styles.progressBlock}>
                          <div className={styles.progressHeader}>
                            <span>{task.bids_count || 0} {t.proposals}</span>
                            <strong>{task.views_count || 0} {t.views}</strong>
                          </div>
                          <div className={styles.progressTrack}>
                            <span className={`${styles.progressFill} ${styles[statusMeta.progressClass]}`} style={{ width: `${isTaskCompleted ? 100 : (task.progress || 0)}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className={styles.taskAside}>
                        <Link
                          href={taskHref}
                          className={styles.openButton}
                        >
                          {isTaskCompleted ? t.viewCompleted : hasAcceptedProposal || task.status === "in_progress" ? t.openActive : task.status === "open" ? t.reviewProposals : t.openTask}
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={styles.emptyState}>{t.noTasks}</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

