"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import styles from "./tracking.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";

function ProjectTrackingContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

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
          <SkeletonCard />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
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
          <Link href="/dashboard/company/projects" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: '16px' }}></iconify-icon>
            Back to Projects
          </Link>
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
            <iconify-icon icon="lucide:folder-open" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></iconify-icon>
            <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>Project not found</h3>
            <p style={{ margin: 0 }}>Select a project from the projects list to view tracking.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
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
          <div className={styles.navRight}>
            <button className={styles.btnIcon}>
              <iconify-icon icon="lucide:bell" style={{ fontSize: '20px' }}></iconify-icon>
            </button>
            <div className={styles.avatar}>
              {userData?.avatar_url ? (
                <Image
                  src={userData.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                />
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className={styles.pageContainer}>
        <Link href="/dashboard/company/projects" className={styles.backLink}>
          <iconify-icon icon="lucide:arrow-left" style={{ fontSize: '16px' }}></iconify-icon>
          Back to Projects
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
                  {project.status === "completed" ? "Completed" : "Active Project"}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Project ID: {project.id ?? ""}
                {project.created_at && ` • Created on ${new Date(project.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <Link href="/dashboard/company/messages" className={styles.btnOutline}>
              <iconify-icon icon="lucide:message-square" style={{ fontSize: '16px' }}></iconify-icon>
              Message Client
            </Link>
          </div>

          <div className={styles.phStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Client</span>
              <div className={styles.statValue}>
                {project.client_name || ""}
              </div>
            </div>
            {project.budget != null && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Budget</span>
                <div className={styles.statValue}>
                  <span style={{ fontSize: '18px', color: '#001f3f' }}>{formatXOF(project.budget)}</span>
                </div>
              </div>
            )}
            {project.end_date && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Estimated Deadline</span>
                <div className={styles.statValue}>
                  <iconify-icon icon="lucide:calendar" style={{ fontSize: '16px', color: '#64748b' }}></iconify-icon>
                  {new Date(project.end_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressInfo}>
              <span>Project Progress</span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.progressMeta}>
              {completedCount} of {milestones.length} Milestones Completed
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
          Milestones
        </h2>

        {milestones.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
            <iconify-icon icon="lucide:list-checks" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></iconify-icon>
            <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>No milestones yet</h3>
            <p style={{ margin: 0 }}>Milestones will appear here once defined for this project.</p>
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
                          {milestone.due_date && `Due by ${new Date(milestone.due_date).toLocaleDateString()}`}
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
                          {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
                        </span>
                        {(milestone.is_paid || milestone.payment_status === "paid") && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <iconify-icon icon="lucide:check-circle" style={{ fontSize: '12px' }}></iconify-icon>
                            Paid
                          </span>
                        )}
                        {(milestone.is_funded || milestone.payment_status === "funded") && (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            <iconify-icon icon="lucide:lock" style={{ fontSize: '12px' }}></iconify-icon>
                            Funded in Escrow
                          </span>
                        )}
                        {milestone.payment_status === "awaiting" && (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>
                            <iconify-icon icon="lucide:circle-dashed" style={{ fontSize: '12px' }}></iconify-icon>
                            Awaiting Deposit
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
