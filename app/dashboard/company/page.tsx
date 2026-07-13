"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function CompanyDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/company" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/company/services") },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase", match: (p: string) => p.startsWith("/dashboard/company/projects") },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", match: (p: string) => p.startsWith("/dashboard/company/messages") },
    { id: "wallet", label: "Wallet", href: "/dashboard/company/wallet", icon: "lucide:wallet", match: (p: string) => p.startsWith("/dashboard/company/wallet") },
    { id: "team", label: "Team", href: "/dashboard/company/team", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/company/team") },
    { id: "reviews", label: "Reviews", href: "/dashboard/company/reviews", icon: "lucide:star", match: (p: string) => p.startsWith("/dashboard/company/reviews") },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user", match: (p: string) => p.startsWith("/dashboard/company/profile") },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/company/settings") },
  ];

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: companyProfile, loading: profileLoading } = useFetch(() => api.getCompanyProfile(), []);
  const { data: projectsData, loading: projectsLoading } = useFetch(() => api.getCompanyProjects(), []);
  const { data: servicesData, loading: servicesLoading } = useFetch(() => api.getCompanyServices(), []);
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);
  const { data: conversations, loading: convLoading } = useFetch(() => api.getConversations(), []);

  const projects = toArray(projectsData);
  const services = toArray(servicesData);
  const activeProjects = projects.filter((p: any) => p.status === "in_progress").length;
  const completedProjects = projects.filter((p: any) => p.status === "completed").length;

  const companyName = companyProfile?.company_name || user?.company_name || "";
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
            <div className={styles.brandText}>
              <span className={styles.brandEyebrow}>Boulot Man</span>
              <span className={styles.brandTitle}>Company Space</span>
            </div>
          </Link>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = item.match(pathname || "");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={(e) => {
                  if (pathname === item.href) {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}
              >
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <LogoutButton className={styles.logoutButton} />
          <p className={styles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      <main className={styles.mainWrapper}>
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.headerTitles}>
              <h1>Company Dashboard</h1>
              <p>Welcome back! Here&apos;s what&apos;s happening with your projects today.</p>
            </div>
            <Link href="/dashboard/company/projects/new" className={styles.btnPrimary}>
              <iconify-icon icon="lucide:plus" />
              <span>Create New Project</span>
            </Link>
          </div>

          <div className={styles.topRow}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Project Overview</h2>
                <Link href="/dashboard/company/projects" className={styles.panelAction}>View All</Link>
              </div>
              <div className={styles.panelBody}>
                {projectsLoading || walletLoading ? (
                  <div className={styles.statsGrid}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={styles.statCard}><SkeletonStat /></div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Active Projects</span>
                      <span className={styles.statValue}>{activeProjects}</span>
                    </div>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Completed Projects</span>
                      <span className={styles.statValue}>{completedProjects}</span>
                    </div>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Available Balance</span>
                      <span className={styles.statValue}>{wallet ? `${Number(wallet.available_balance).toLocaleString()} XOF` : "0 XOF"}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Services Offered</h2>
                <Link href="/dashboard/company/services" className={styles.panelAction}>Manage</Link>
              </div>
              <div className={styles.panelBody}>
                {servicesLoading ? (
                  <div className={styles.teamList}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={styles.teamItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
                    ))}
                  </div>
                ) : !services || services.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: 14 }}>No services added yet.</p>
                ) : (
                  <div className={styles.teamList}>
                    {services.slice(0, 3).map((service: any) => (
                      <div key={service.id} className={styles.teamItem}>
                        <div className={styles.teamAvatar}>
                          <iconify-icon icon="lucide:layers" />
                        </div>
                        <div className={styles.teamInfo}>
                          <strong>{service.name || "Service"}</strong>
                          <span>{service.description?.slice(0, 40) || "No description"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className={styles.bottomRow}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Recent Projects</h2>
              </div>
              <div className={styles.panelBody}>
                {projectsLoading ? (
                  <div className={styles.activityList}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={styles.activityItem}><SkeletonBlock style={{ width: "100%", height: 48 }} /></div>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: 14 }}>No projects yet.</p>
                ) : (
                  <div className={styles.activityList}>
                    {projects.slice(0, 4).map((project: any) => (
                      <div key={project.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <iconify-icon icon={project.status === "completed" ? "lucide:check-circle" : "lucide:briefcase"} />
                        </div>
                        <div className={styles.activityContent}>
                          <p><strong>{project.title || "Project"}</strong></p>
                          <span>{project.status || "draft"} • {project.budget ? `${Number(project.budget).toLocaleString()} XOF` : "No budget"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <div className={styles.rightColumn}>
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Quick Actions</h2>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.actionGrid}>
                    <Link href="/dashboard/company/projects" className={styles.actionBtn}><iconify-icon icon="lucide:briefcase" /> New Project</Link>
                    <Link href="/dashboard/company/services" className={styles.actionBtn}><iconify-icon icon="lucide:layers" /> Add Service</Link>
                    <Link href="/dashboard/company/messages" className={styles.actionBtn}><iconify-icon icon="lucide:message-square" /> Messages</Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
