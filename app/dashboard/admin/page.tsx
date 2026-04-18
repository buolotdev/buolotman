"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users" },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text" },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check", badge: 84 },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card" },
    { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes", icon: "lucide:scale", badge: 3 },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers" },
    { id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: "lucide:settings" },
  ];

  const stats = [
    { title: "Total Users", value: "24,592", trend: "+12.5%", isUp: true, icon: "lucide:users" },
    { title: "Active Tasks", value: "1,845", trend: "+8.2%", isUp: true, icon: "lucide:briefcase", isOrange: true },
    { title: "Total Revenue", value: "$142,300", trend: "+15.3%", isUp: true, icon: "lucide:dollar-sign" },
    { title: "Pending KYC", value: "84", trend: "-2.4%", isUp: false, icon: "lucide:shield-alert" },
  ];

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      {/* Sidebar Overlay */}
      <div 
        className={styles.sidebarOverlay} 
        onClick={() => setMobileSidebarOpen(false)} 
      />

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
            <span className={styles.adminBadge}>Admin</span>
          </Link>
          <button 
            className={styles.mobileCloseBtn} 
            onClick={() => setMobileSidebarOpen(false)}
          >
            <iconify-icon icon="lucide:x" />
          </button>
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
          <Link href="/login" className={styles.logoutBtn}>
            <iconify-icon icon="lucide:log-out" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button 
              className={styles.mobileMenuBtn} 
              onClick={() => setMobileSidebarOpen(true)}
            >
              <iconify-icon icon="lucide:menu" />
            </button>
            <div className={styles.searchBar}>
              <iconify-icon icon="lucide:search" />
              <input type="text" placeholder="Search users, tasks, transactions..." />
            </div>
          </div>

          <div className={styles.topbarRight}>
            <button className={styles.actionBtn}>
              <iconify-icon icon="lucide:bell" />
              <span className={styles.notificationDot} />
            </button>
            <div className={styles.adminProfile}>
              <Image 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80" 
                alt="David Miller" 
                width={36} 
                height={36} 
                className={styles.avatar}
              />
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>David Miller</span>
                <span className={styles.profileRole}>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.dashboardBody}>
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1>Dashboard Overview</h1>
              <p>Welcome back, David. Here’s a summary of Boulot Man’s performance.</p>
            </div>
            <div className={styles.dateFilter}>
              <iconify-icon icon="lucide:calendar" />
              Last 30 Days
              <iconify-icon icon="lucide:chevron-down" />
            </div>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={styles.statTitle}>{stat.title}</span>
                  <div className={`${styles.statIcon} ${stat.isOrange ? styles.statIconOrange : ""}`}>
                    <iconify-icon icon={stat.icon} />
                  </div>
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statTrend}>
                  <iconify-icon 
                    icon={stat.isUp ? "lucide:trending-up" : "lucide:trending-down"} 
                    className={stat.isUp ? styles.trendUp : styles.trendDown} 
                  />
                  <span className={stat.isUp ? styles.trendUp : styles.trendDown}>{stat.trend}</span>
                  <span className={styles.trendLabel}>vs last mo.</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Revenue & Transactions</h2>
                <iconify-icon icon="lucide:more-horizontal" style={{ color: "#64748b", cursor: "pointer" }} />
              </div>
              <div className={styles.barChart}>
                {[40, 60, 85, 50, 70, 95, 80].map((h, i) => (
                  <div key={i} className={styles.barGroup}>
                    <div 
                      className={`${styles.bar} ${i === 5 ? styles.barSecondary : ""}`} 
                      style={{ height: `${h}%` }} 
                    />
                    <span className={styles.barLabel}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>User Distribution</h2>
                <iconify-icon icon="lucide:more-horizontal" style={{ color: "#64748b", cursor: "pointer" }} />
              </div>
              <div className={styles.donutWrapper}>
                <div className={styles.donutCircle}>
                  <div className={styles.donutInner}>
                    <span className={styles.donutTotal}>24.5k</span>
                    <span className={styles.donutLabel}>Total Users</span>
                  </div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ background: "#001f3f" }} />
                    Clients
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ background: "#ff4500" }} />
                    Techs
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bottomGrid}>
            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>Recent Activity</h2>
                <button className={styles.viewAllLink}>View All</button>
              </div>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIconBox} style={{ background: "rgba(0, 31, 63, 0.1)", color: "#001f3f" }}>
                    <iconify-icon icon="lucide:user-plus" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityText}>New Company Registered</span>
                      <span className={styles.activityTime}>5 min ago</span>
                    </div>
                    <p className={styles.activitySubtext}>"Elite Electricals LLC" signed up and is pending verification.</p>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIconBox} style={{ background: "rgba(255, 69, 0, 0.1)", color: "#ff4500" }}>
                    <iconify-icon icon="lucide:file-check" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityText}>High Value Task Posted</span>
                      <span className={styles.activityTime}>12 min ago</span>
                    </div>
                    <p className={styles.activitySubtext}>Client "Sarah M." posted a task with a $5,000 budget.</p>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIconBox} style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}>
                    <iconify-icon icon="lucide:arrow-down" />
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityText}>Large Withdrawal Request</span>
                      <span className={styles.activityTime}>1 hr ago</span>
                    </div>
                    <p className={styles.activitySubtext}>Technician "Michael C." requested withdrawal of $2,450.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>System Alerts</h2>
                <button className={styles.viewAllLink}>Manage</button>
              </div>
              <div className={styles.alertList}>
                <div className={`${styles.alertItem} ${styles.alertUrgent}`}>
                  <iconify-icon icon="lucide:alert-octagon" className={styles.alertIcon} />
                  <div className={styles.alertContent}>
                    <h4>3 Pending Disputes Unresolved</h4>
                    <p>Issues have exceeded the 48-hour response SLA.</p>
                    <span className={styles.alertAction}>Review Disputes</span>
                  </div>
                </div>
                <div className={`${styles.alertItem} ${styles.alertWarning}`}>
                  <iconify-icon icon="lucide:shield-alert" className={styles.alertIcon} />
                  <div className={styles.alertContent}>
                    <h4>KYC Backlog</h4>
                    <p>84 pending ID verifications waiting for review.</p>
                    <span className={styles.alertAction}>Process KYC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
