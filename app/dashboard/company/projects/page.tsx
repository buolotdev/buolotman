"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import layoutStyles from "../page.module.css";
import styles from "./projects.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { SkeletonStat, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function CompanyProjects() {
  const [activeNav, setActiveNav] = useState("projects");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "completed">("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: projectsData, loading: projectsLoading, error } = useFetch(
    () => api.getCompanyProjects(),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = (projectsData?.results ?? []) as any[];

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

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects & Contracts", href: "/dashboard/company/projects", icon: "lucide:briefcase" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
      case "pending":
      case "draft":
        return <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>;
      case "completed":
        return <span className={`${styles.badge} ${styles.badgeCompleted}`}>Completed</span>;
      default:
        return <span className={`${styles.badge}`}>{status}</span>;
    }
  };

  return (
    <div className={`${layoutStyles.layoutWrapper} ${mobileSidebarOpen ? layoutStyles.sidebarOpenMobile : ""}`}>
      <div className={layoutStyles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />
      <aside className={layoutStyles.sidebar}>
        <div className={layoutStyles.sidebarHeader}>
          <Link href="/" className={layoutStyles.brand}>
            <Image
              src="/boulotman-logo.png"
              alt="Boulot Man"
              width={180}
              height={46}
              className={layoutStyles.brandImage}
              style={{ width: 'auto', height: '46px' }}
              priority
            />
          </Link>
          <button className={layoutStyles.mobileCloseBtn} onClick={() => setMobileSidebarOpen(false)}>
            <iconify-icon icon="lucide:x" />
          </button>
        </div>

        <nav className={layoutStyles.navMenu}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${layoutStyles.navItem} ${activeNav === item.id ? layoutStyles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <LogoutButton className={layoutStyles.logoutButton} />
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      <div className={layoutStyles.mainWrapper}>
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Projects & Contracts</h1>
              <p className={styles.pageSubtitle}>
                Manage your active projects and review completed contracts.
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
                  <span className={styles.statTitle}>Total Projects</span>
                  <iconify-icon icon="lucide:folder-open" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{totalProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>Active Contracts</span>
                  <iconify-icon icon="lucide:activity" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{activeProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>Pending</span>
                  <iconify-icon icon="lucide:clock" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{pendingProjects}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>Completed</span>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
                </div>
                <div className={styles.statValue}>{completedProjects}</div>
              </div>
            </div>
          )}

          <div className={styles.toolbarSection}>
            <div className={styles.tabs}>
              <button type="button" className={`${styles.tab} ${statusFilter === "all" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("all")}>All Projects</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "active" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("active")}>Active</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "pending" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("pending")}>Pending</button>
              <button type="button" className={`${styles.tab} ${statusFilter === "completed" ? styles.tabActive : ""}`} onClick={() => setStatusFilter("completed")}>Completed</button>
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
                <h3 style={{ margin: "0 0 8px" }}>No projects found</h3>
                <p style={{ margin: 0 }}>There are no projects matching this status.</p>
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
                          <span className={styles.metaLabel}>Client</span>
                          <div className={styles.metaValueRich}>
                            {project.client_name || ""}
                          </div>
                        </div>
                        {project.budget != null && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>Total Budget</span>
                            <div className={styles.metaValueRich}>{formatXOF(project.budget)}</div>
                          </div>
                        )}
                        {project.start_date && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>Timeline</span>
                            <div className={styles.metaValueRich}>
                              {project.start_date}{project.end_date ? ` - ${project.end_date}` : ""}
                            </div>
                          </div>
                        )}
                        {project.progress != null && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>Progress</span>
                            <div className={styles.metaValueRich}>{project.progress}%</div>
                          </div>
                        )}
                        {project.location && (
                          <div className={styles.metaItemBox}>
                            <span className={styles.metaLabel}>Location</span>
                            <div className={styles.metaValueRich}>{project.location}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.projectProgressCol}>
                      <div className={styles.progressHeader}>
                        <span>Overall Progress</span>
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
                      {project.updated_at ? `Updated ${new Date(project.updated_at).toLocaleDateString()}` : ""}
                    </span>
                    <div className={styles.actionButtons}>
                      <Link href="/dashboard/company/messages" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Message Client</Link>
                      <Link href={`/dashboard/company/projects/tracking?projectId=${project.id}`} className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>Manage Project</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
