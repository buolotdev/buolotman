"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function CompanyDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase", badge: 12 },
    { id: "teams", label: "Teams", href: "/dashboard/company/teams", icon: "lucide:users" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", badge: 5 },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-3" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={styles.layoutWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image 
              src="/boulotman-logo.png" 
              alt="Boulot Man" 
              width={180} 
              height={46} 
              className={styles.brandImage} 
              priority 
            />
          </Link>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${activeNav === item.id ? styles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
              {item.badge && <span className={styles.navItemBadge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/login" className={styles.logoutButton}>
            <iconify-icon icon="lucide:log-out" />
            <span>Logout</span>
          </Link>
          <p className={styles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <iconify-icon icon="lucide:search" />
            <input type="text" placeholder="Search projects, teams..." />
          </div>

          <div className={styles.topbarActions}>
            <button type="button" className={styles.iconBtn}>
              <iconify-icon icon="lucide:bell" />
              <span className={styles.notificationDot} />
            </button>
            
            <div className={styles.companyProfile}>
              <div className={styles.profileImg}>
                <Image src="/boulotman-logo.png" alt="Company" width={40} height={40} />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>TechCorp Solutions</span>
                <span className={styles.profileRole}>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.headerTitles}>
              <h1>Company Dashboard</h1>
              <p>Welcome back! Here's what's happening with your projects today.</p>
            </div>
            <button type="button" className={styles.btnPrimary}>
              <iconify-icon icon="lucide:plus" />
              <span>Create New Project</span>
            </button>
          </div>

          {/* Dashboard Grid */}
          <div className={styles.topRow}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Project Overview</h2>
                <button className={styles.panelAction}>View All</button>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Active Projects</span>
                    <span className={styles.statValue}>24</span>
                    <span className={`${styles.statTrend} ${styles.trendUp}`}>+12% from last month</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Revenue</span>
                    <span className={styles.statValue}>$128,430</span>
                    <span className={`${styles.statTrend} ${styles.trendUp}`}>+8.4% from last month</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Completed Tasks</span>
                    <span className={styles.statValue}>1,204</span>
                    <span className={`${styles.statTrend} ${styles.trendDown}`}>-2% from last month</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Team Performance</h2>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.teamList}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.teamItem}>
                      <div className={styles.teamAvatar}>T{i}</div>
                      <div className={styles.teamInfo}>
                        <strong>Development Team {i}</strong>
                        <span>8 members • 12 active tasks</span>
                      </div>
                      <div className={styles.teamProgress}>
                        <div className={styles.progressBar} style={{ width: `${70 + i * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className={styles.bottomRow}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Recent Activity</h2>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.activityList}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <iconify-icon icon="lucide:check-circle" />
                      </div>
                      <div className={styles.activityContent}>
                        <p><strong>Project Alpha</strong> task "Database Migration" completed by <strong>John Doe</strong></p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className={styles.rightColumn}>
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Quick Actions</h2>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.actionGrid}>
                    <button className={styles.actionBtn}><iconify-icon icon="lucide:user-plus" /> Add Member</button>
                    <button className={styles.actionBtn}><iconify-icon icon="lucide:file-text" /> Generate Report</button>
                    <button className={styles.actionBtn}><iconify-icon icon="lucide:calendar" /> Schedule Meeting</button>
                    <button className={styles.actionBtn}><iconify-icon icon="lucide:mail" /> Send Invite</button>
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
