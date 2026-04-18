"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import layoutStyles from "../page.module.css";
import styles from "./projects.module.css";

export default function CompanyProjects() {
  const [activeNav, setActiveNav] = useState("projects");

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects & Contracts", href: "/dashboard/company/projects", icon: "lucide:briefcase", badge: 12 },
    { id: "teams", label: "Teams", href: "/dashboard/company/teams", icon: "lucide:users" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", badge: 5 },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-3" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={layoutStyles.layoutWrapper}>
      {/* Sidebar (Copied from main company dashboard) */}
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
              {item.badge && <span className={layoutStyles.navItemBadge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <Link href="/login" className={layoutStyles.logoutButton}>
            <iconify-icon icon="lucide:log-out" />
            <span>Logout</span>
          </Link>
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={layoutStyles.mainWrapper}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <div style={{ color: "#64748b", display: "flex" }}>
              <iconify-icon icon="lucide:search" style={{ fontSize: "18px" }}></iconify-icon>
            </div>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search projects, clients..."
            />
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.notificationBtn}>
              <iconify-icon icon="lucide:bell" style={{ fontSize: "20px" }}></iconify-icon>
              <div className={styles.notificationDot}></div>
            </button>

            <div className={styles.userProfile}>
              <div className={styles.userInfo} style={{ textAlign: "right" }}>
                <span className={styles.userName}>Apex Construction</span>
                <span className={styles.userRole}>Company Account</span>
              </div>
              <div className={styles.avatar}>
                <Image
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80"
                  alt="Company"
                  width={36}
                  height={36}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Projects & Contracts</h1>
              <p className={styles.pageSubtitle}>
                Manage your active projects and review completed contracts.
              </p>
            </div>
            <div className={styles.headerActions}>
              <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnIcon}`}>
                <iconify-icon icon="lucide:download" style={{ fontSize: "16px" }}></iconify-icon>
                Export
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                <iconify-icon icon="lucide:plus" style={{ fontSize: "16px" }}></iconify-icon>
                New Project
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Projects</span>
                <iconify-icon icon="lucide:folder-open" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
              </div>
              <div className={styles.statValue}>24</div>
              <div className={`${styles.statChange} ${styles.textSuccess}`}>
                <iconify-icon icon="lucide:trending-up" style={{ fontSize: "14px" }}></iconify-icon>
                +4 this month
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Active Contracts</span>
                <iconify-icon icon="lucide:activity" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
              </div>
              <div className={styles.statValue}>12</div>
              <div className={`${styles.statChange} ${styles.textWarning}`}>
                <iconify-icon icon="lucide:clock" style={{ fontSize: "14px" }}></iconify-icon>
                3 nearing deadline
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Total Revenue</span>
                <iconify-icon icon="lucide:dollar-sign" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
              </div>
              <div className={styles.statValue}>$45.2K</div>
              <div className={`${styles.statChange} ${styles.textSuccess}`}>
                <iconify-icon icon="lucide:trending-up" style={{ fontSize: "14px" }}></iconify-icon>
                12% vs last month
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statTitle}>Success Rate</span>
                <iconify-icon icon="lucide:check-circle" style={{ fontSize: "20px", color: "#64748b" }}></iconify-icon>
              </div>
              <div className={styles.statValue}>98%</div>
              <div className={`${styles.statChange} ${styles.textMuted}`}>
                <iconify-icon icon="lucide:minus" style={{ fontSize: "14px" }}></iconify-icon>
                Same as last month
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbarSection}>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${styles.tabActive}`}>All Projects</div>
              <div className={styles.tab}>Active</div>
              <div className={styles.tab}>Pending</div>
              <div className={styles.tab}>Completed</div>
            </div>
            <div className={styles.filters}>
              <button className={styles.filterBtn}>
                <iconify-icon icon="lucide:filter" style={{ fontSize: "14px" }}></iconify-icon>
                Filter by Client
              </button>
              <button className={styles.filterBtn}>
                Sort by: Newest
                <iconify-icon icon="lucide:chevron-down" style={{ fontSize: "14px" }}></iconify-icon>
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className={styles.projectsList}>
            {/* Detailed Project Card 1 */}
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h3 className={styles.projectTitle}>Complete Office HVAC Installation</h3>
                  <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
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
                        <div className={styles.miniAvatar}>
                          <Image src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80" alt="Nexus Tech" width={24} height={24} />
                        </div>
                        Nexus Technologies
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Total Budget</span>
                      <div className={styles.metaValueRich}>$14,500.00</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Timeline</span>
                      <div className={styles.metaValueRich}>Oct 10 - Nov 20, 2023</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Milestones</span>
                      <div className={styles.metaValueRich}>3 / 5 Completed</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Payment Status</span>
                      <div className={styles.metaValueRich}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                        Funded in Escrow
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Location</span>
                      <div className={styles.metaValueRich}>Downtown Office Park</div>
                    </div>
                  </div>
                </div>

                <div className={styles.projectProgressCol}>
                  <div className={styles.progressHeader}>
                    <span>Overall Progress</span>
                    <span>60%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={`${styles.progressBarFill} ${styles.fillActive}`} style={{ width: "60%" }}></div>
                  </div>

                  <div className={styles.teamSection}>
                    <span className={styles.teamLabel}>Assigned Team</span>
                    <div className={styles.avatarGroup}>
                      <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                      <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                      <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.lastUpdated}>
                  <iconify-icon icon="lucide:history" style={{ fontSize: "14px" }}></iconify-icon>
                  Last updated 2 days ago by System
                </span>
                <div className={styles.actionButtons}>
                  <Link href="/dashboard/company/messages" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Message Client</Link>
                  <Link href="/dashboard/company/projects/tracking" className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>Manage Project</Link>
                </div>
              </div>
            </div>

            {/* Detailed Project Card 2 */}
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h3 className={styles.projectTitle}>Electrical Wiring for New Retail Store</h3>
                  <span className={`${styles.badge} ${styles.badgePending}`}>Pending Start</span>
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
                        <div className={styles.miniAvatar}>
                          <Image src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80" alt="FreshMart" width={24} height={24} />
                        </div>
                        FreshMart Groceries
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Total Budget</span>
                      <div className={styles.metaValueRich}>$8,200.00</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Timeline</span>
                      <div className={styles.metaValueRich}>Nov 01 - Nov 15, 2023</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Milestones</span>
                      <div className={styles.metaValueRich}>0 / 4 Completed</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Payment Status</span>
                      <div className={styles.metaValueRich}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
                        Awaiting Deposit
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Location</span>
                      <div className={styles.metaValueRich}>Westside Mall, Unit B</div>
                    </div>
                  </div>
                </div>

                <div className={styles.projectProgressCol}>
                  <div className={styles.progressHeader}>
                    <span>Overall Progress</span>
                    <span>0%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: "0%" }}></div>
                  </div>

                  <div className={styles.teamSection}>
                    <span className={styles.teamLabel}>Assigned Team</span>
                    <div className={styles.avatarGroup}>
                      <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                      <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.lastUpdated}>
                  <iconify-icon icon="lucide:history" style={{ fontSize: "14px" }}></iconify-icon>
                  Created yesterday
                </span>
                <div className={styles.actionButtons}>
                  <Link href="/dashboard/company/messages" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Message Client</Link>
                  <Link href="/dashboard/company/projects/tracking" className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>Manage Project</Link>
                </div>
              </div>
            </div>

            {/* Detailed Project Card 3 */}
            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h3 className={styles.projectTitle}>Security System Upgrade</h3>
                  <span className={`${styles.badge} ${styles.badgeCompleted}`}>Completed</span>
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
                        <div className={styles.miniAvatar}>
                          <Image src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80" alt="Blue Sky" width={24} height={24} />
                        </div>
                        Blue Sky Finance
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Total Budget</span>
                      <div className={styles.metaValueRich}>$3,400.00</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Timeline</span>
                      <div className={styles.metaValueRich}>Sep 01 - Sep 10, 2023</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Milestones</span>
                      <div className={styles.metaValueRich}>2 / 2 Completed</div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Payment Status</span>
                      <div className={styles.metaValueRich}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                        Fully Paid
                      </div>
                    </div>
                    <div className={styles.metaItemBox}>
                      <span className={styles.metaLabel}>Location</span>
                      <div className={styles.metaValueRich}>Financial District HQ</div>
                    </div>
                  </div>
                </div>

                <div className={styles.projectProgressCol}>
                  <div className={styles.progressHeader}>
                    <span>Overall Progress</span>
                    <span className={styles.textSuccess}>100%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={`${styles.progressBarFill} ${styles.fillSuccess}`} style={{ width: "100%" }}></div>
                  </div>

                  <div className={styles.teamSection}>
                    <span className={styles.teamLabel}>Assigned Team</span>
                    <div className={styles.avatarGroup}>
                      <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" alt="Member" width={32} height={32} />
                      <div className={styles.avatarMore}>+1</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <span className={styles.lastUpdated}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "14px", color: "#10b981" }}></iconify-icon>
                  Closed on Sep 12, 2023
                </span>
                <div className={styles.actionButtons}>
                  <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>View Invoice</button>
                  <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Project Summary</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
