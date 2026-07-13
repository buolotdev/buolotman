"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useDialog } from "@/app/components/Dialog";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

export default function TechnicianTaskDetailsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const toast = useToast();
  const dialog = useDialog();
  const [saved, setSaved] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("buolotman_saved_tasks");
      if (raw) {
        const ids = JSON.parse(raw);
        return ids.includes(String(taskId));
      }
    }
    return false;
  });
  const [messaging, setMessaging] = useState(false);
  const [completing, setCompleting] = useState(false);

  const toggleSaved = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("buolotman_saved_tasks");
      let ids = raw ? JSON.parse(raw) : [];
      if (nextSaved) {
        if (!ids.includes(String(taskId))) ids.push(String(taskId));
      } else {
        ids = ids.filter((id: string) => id !== String(taskId));
      }
      localStorage.setItem("buolotman_saved_tasks", JSON.stringify(ids));
    }
  };

  const { data: task, loading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: myBids } = useFetch(() => api.getMyBids(), []);
  const activeBid = useMemo(() => {
    const bids = Array.isArray(myBids) ? myBids : (myBids as any)?.results ?? [];
    return bids.find((bid: any) => String(bid.task_id ?? bid.taskId) === String(taskId) && bid.status !== "withdrawn") || null;
  }, [myBids, taskId]);

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <Link href="/dashboard/technician/tasks" className={styles.backButton}>
              <iconify-icon icon="lucide:arrow-left" />
              <span>Back to Tasks</span>
            </Link>
          </div>
        </header>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.mainColumn}>
              <div className={styles.detailCard}>
                <SkeletonBlock style={{ width: 120, height: 28, marginBottom: 16 }} />
                <SkeletonBlock style={{ width: "80%", height: 32, marginBottom: 20 }} />
                <SkeletonBlock style={{ width: "100%", height: 120 }} />
              </div>
            </div>
            <aside className={styles.sideColumn}>
              <div className={styles.sideCard}><SkeletonCard /></div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Task not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/dashboard/technician/tasks" className={styles.backButton}>
            <iconify-icon icon="lucide:arrow-left" />
            <span>Back to Tasks</span>
          </Link>
        </div>
        <div className={styles.topbarRight}>
          <Link href="/dashboard/technician/bids" className={styles.topbarLink}>My Bids</Link>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            <section className={styles.detailCard}>
              <div className={styles.badgeRow}>
                {task.urgency === "urgent" && <span className={`${styles.badge} ${styles.badgeUrgent}`}>Urgent</span>}
                {task.category_name && <span className={`${styles.badge} ${styles.badgeCategory}`}>{task.category_name}</span>}
              </div>

              <h1 className={styles.title}>{task.title}</h1>

              <div className={styles.metaGrid}>
                <article className={styles.metaItem}>
                  <span className={styles.metaIcon}><iconify-icon icon="lucide:map-pin" /></span>
                  <div className={styles.metaCopy}>
                    <small>Location</small>
                    <strong>{task.city || task.location || "Not specified"}</strong>
                  </div>
                </article>
                <article className={styles.metaItem}>
                  <span className={styles.metaIcon}><iconify-icon icon="lucide:calendar" /></span>
                  <div className={styles.metaCopy}>
                    <small>Schedule</small>
                    <strong>{task.schedule || "Flexible"}</strong>
                  </div>
                </article>
                <article className={styles.metaItem}>
                  <span className={styles.metaIcon}><iconify-icon icon="lucide:clock-3" /></span>
                  <div className={styles.metaCopy}>
                    <small>Posted</small>
                    <strong>{task.created_at ? new Date(task.created_at).toLocaleDateString() : "Recently"}</strong>
                  </div>
                </article>
              </div>

              <div className={styles.section}>
                <h2>Task Description</h2>
                <div className={styles.description}>
                  <p>{task.description || "No description provided."}</p>
                </div>
              </div>

              {task.skills_required && task.skills_required.length > 0 && (
                <div className={styles.section}>
                  <h2>Required Skills</h2>
                  <div className={styles.tagList}>
                    {task.skills_required.map((tag: string) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={styles.sideCard}>
              <div className={styles.budgetBlock}>
                <small>Client Budget</small>
                <strong>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "Not specified"}</strong>
                {task.budget_max && <span>Up to {Number(task.budget_max).toLocaleString()} XOF</span>}
              </div>

              {task.status === "open" && !activeBid && (
                <Link href={`/dashboard/technician/tasks/${task.id}/submit-bid`} className={styles.primaryButton}>
                  <iconify-icon icon="lucide:send-horizontal" />
                  <span>Submit a Bid</span>
                </Link>
              )}

              {task.status === "open" && activeBid && (
                <div className={styles.statusBadge}>
                  <iconify-icon icon="lucide:check-circle" />
                  <span>Bid already submitted</span>
                </div>
              )}

              {task.status === "open" && activeBid && (
                <Link href="/dashboard/technician/bids" className={styles.secondaryButton}>
                  <iconify-icon icon="lucide:layout-list" />
                  <span>View My Bids</span>
                </Link>
              )}

              {task.status === "in_progress" && (
                <button
                  type="button"
                  className={styles.primaryButton}
                  disabled={completing}
                  onClick={async () => {
                    const ok = await dialog.confirm({
                      title: "Complete Task",
                      message: "Mark this task as completed? Payment will be released to your wallet.",
                      confirmText: "Complete",
                      cancelText: "Cancel",
                      variant: "default",
                    });
                    if (!ok) return;
                    setCompleting(true);
                    try {
                      await api.completeTask(Number(taskId));
                      toast.success("Task completed", "Payment has been released to your wallet.");
                      router.push("/dashboard/technician/bids");
                    } catch (err: any) {
                      toast.error("Could not complete task", err?.message || "Please try again.");
                    } finally {
                      setCompleting(false);
                    }
                  }}
                >
                  <iconify-icon icon="lucide:check-circle" />
                  <span>{completing ? "Completing..." : "Complete Task"}</span>
                </button>
              )}

              {task.status === "completed" && (
                <div className={styles.statusBadge}>
                  <iconify-icon icon="lucide:check-circle" />
                  <span>Task Completed</span>
                </div>
              )}

              <button
                type="button"
                className={styles.secondaryButton}
                disabled={messaging || !task.client}
                onClick={async () => {
                  if (!task.client) return;
                  setMessaging(true);
                  try {
                    const convo = await api.createConversation(task.client, task.id);
                    router.push(`/dashboard/technician/messages?c=${convo.id}`);
                  } catch (err: any) {
                    toast.error("Could not start conversation", err?.message || "Please try again.");
                  } finally {
                    setMessaging(false);
                  }
                }}
              >
                <iconify-icon icon="lucide:message-square" />
                <span>{messaging ? "Opening..." : "Message Client"}</span>
              </button>

              <button type="button" className={styles.secondaryButton} onClick={toggleSaved}>
                <iconify-icon icon={saved ? "lucide:bookmark-check" : "lucide:bookmark"} />
                <span>{saved ? "Saved" : "Save Task"}</span>
              </button>

              <div className={styles.bidStats}>
                <span>Bids so far: {task.bids_count || 0}</span>
                <span>Status: {task.status || "open"}</span>
              </div>
            </section>

            <section className={styles.sideCard}>
              <h2 className={styles.sideTitle}>About the Client</h2>
              <div className={styles.clientMetaList}>
                <div className={styles.clientMetaItem}>
                  <iconify-icon icon="lucide:user" />
                  <span>{task.client_name || ""}</span>
                </div>
                {task.views_count !== undefined && (
                  <div className={styles.clientMetaItem}>
                    <iconify-icon icon="lucide:eye" />
                    <span>{task.views_count} views</span>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
