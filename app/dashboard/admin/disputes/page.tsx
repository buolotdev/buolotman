"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin-disputes.module.css";

export default function AdminDisputesPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const disputes = [
    {
      id: "#DSP-8092",
      date: "Oct 24, 2023",
      task: "Full Office Renovation & Wiring",
      amount: "$2,500.00",
      isEscrowHeld: true,
      client: {
        name: "Emma Watson",
        role: "Client",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F3"
      },
      provider: {
        name: "TechFix Solutions",
        role: "Company",
        fallback: "TF"
      },
      category: "Incomplete Work",
      description: "The contractor left the site without finishing the electrical wiring in the main conference room. They claim it was completed but I have evidence it is not.",
      status: "Action Required"
    },
    {
      id: "#DSP-8091",
      date: "Oct 22, 2023",
      task: "E-commerce Website Redesign",
      amount: "$850.00",
      isEscrowHeld: true,
      client: {
        name: "Marcus Johnson",
        role: "Client",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F1"
      },
      provider: {
        name: "Li Wei",
        role: "Technician",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FAsian%2F4"
      },
      category: "Communication / Delay",
      description: "The freelancer is over a week late on the milestone and has stopped responding to my messages entirely.",
      status: "In Review"
    },
    {
      id: "#DSP-8088",
      date: "Oct 19, 2023",
      task: "Emergency Plumbing Repair",
      amount: "$200.00",
      isEscrowHeld: false,
      client: {
        name: "Maria Garcia",
        role: "Client",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FHispanic%2F2"
      },
      provider: {
        name: "Thomas Blake",
        role: "Technician",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FEuropean%2F5"
      },
      category: "Quality of Work",
      description: "Pipe started leaking again two days after the repair. The technician refused to come back and fix it without an additional fee.",
      status: "Resolved"
    },
    {
      id: "#DSP-8085",
      date: "Oct 18, 2023",
      task: "Custom Mobile App MVP",
      amount: "$4,500.00",
      isEscrowHeld: true,
      client: {
        name: "InnoCorp Inc.",
        role: "Client",
        fallback: "IC"
      },
      provider: {
        name: "Arjun Patel",
        role: "Technician",
        avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FSouth_Asian%2F2"
      },
      category: "Scope Creep / Payment",
      description: "Client keeps adding new features not outlined in the original agreement and refuses to release the first milestone payment until they are done.",
      status: "In Review"
    }
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users" },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text" },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check", badge: 84 },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card" },
    { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes", icon: "lucide:scale", badge: 5 },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers" },
    { id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      {/* Sidebar Overlay */}
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
            <span className={styles.adminBadge}>Admin</span>
          </Link>
        </div>
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "disputes" ? styles.navItemActive : ""}`}>
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
            <button className={styles.mobileMenuBtn} onClick={() => setMobileSidebarOpen(true)}>
              <iconify-icon icon="lucide:menu" />
            </button>
            <div className={styles.searchBar}>
              <iconify-icon icon="lucide:search" />
              <input type="text" placeholder="Search disputes by ID, user, or task..." />
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.adminProfile}>
              <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80" alt="David Miller" width={36} height={36} className={styles.avatar} />
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
              <h1>Dispute Management</h1>
              <p>Review, mediate, and resolve platform conflicts securely.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export Log
              </button>
            </div>
          </div>

          {/* Overview Grid */}
          <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total Disputes</span>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:scale" />
                </div>
              </div>
              <span className={styles.statValue}>124</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Open Cases</span>
                <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                  <iconify-icon icon="lucide:alert-triangle" />
                </div>
              </div>
              <span className={styles.statValue}>18</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>In Review</span>
                <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                  <iconify-icon icon="lucide:search" />
                </div>
              </div>
              <span className={styles.statValue}>32</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Resolved (30d)</span>
                <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                  <iconify-icon icon="lucide:check-circle" />
                </div>
              </div>
              <span className={styles.statValue}>74</span>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filterBar}>
            <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All Disputes</button>
            <button className={styles.filterBtn}>
              Action Required <span className={styles.notificationCount}>5</span>
            </button>
            <button className={styles.filterBtn}>In Review</button>
            <button className={styles.filterBtn}>Resolved</button>
          </div>

          {/* Disputes Table */}
          <div className={styles.sectionCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Case Info</th>
                    <th>Task / Project</th>
                    <th>Parties Involved</th>
                    <th>Issue Summary</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((dispute) => (
                    <tr key={dispute.id}>
                      <td>
                        <div className={styles.caseCell}>
                          <span className={styles.caseId}>{dispute.id}</span>
                          <span className={styles.caseDate}>Opened: {dispute.date}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.taskCell}>
                          <span className={styles.taskTitle}>{dispute.task}</span>
                          <span className={styles.taskAmount}>
                            <iconify-icon icon={dispute.isEscrowHeld ? "lucide:lock" : "lucide:check-circle"} />
                            {dispute.amount} {dispute.isEscrowHeld ? "(Escrow held)" : "(Funds Released)"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.partiesCell}>
                          <div className={styles.party}>
                            {dispute.client.avatar ? (
                              <Image src={dispute.client.avatar} alt="Client" width={32} height={32} className={styles.partyAvatar} />
                            ) : (
                              <div className={styles.partyAvatarFallback}>{dispute.client.fallback}</div>
                            )}
                            <div className={styles.partyInfo}>
                              <span className={styles.partyName}>{dispute.client.name}</span>
                              <span className={styles.partyRole}>Client</span>
                            </div>
                          </div>
                          <span className={styles.vsBadge}>VS</span>
                          <div className={styles.party}>
                            {dispute.provider.avatar ? (
                              <Image src={dispute.provider.avatar} alt="Provider" width={32} height={32} className={styles.partyAvatar} />
                            ) : (
                              <div className={styles.partyAvatarFallback}>{dispute.provider.fallback}</div>
                            )}
                            <div className={styles.partyInfo}>
                              <span className={styles.partyName}>{dispute.provider.name}</span>
                              <span className={styles.partyRole}>{dispute.provider.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.issueCell}>
                          <span className={styles.issueCategory}>{dispute.category}</span>
                          <p className={styles.issueDesc}>{dispute.description}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          dispute.status === "Action Required" ? styles.statusOpen :
                          dispute.status === "In Review" ? styles.statusReview :
                          styles.statusResolved
                        }`}>
                          <iconify-icon icon={
                            dispute.status === "Action Required" ? "lucide:alert-circle" :
                            dispute.status === "In Review" ? "lucide:search" :
                            "lucide:check-circle-2"
                          } />
                          {dispute.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {dispute.status !== "Resolved" && (
                            <button className={styles.btnPrimary}>Resolve Dispute</button>
                          )}
                          <button className={styles.btnDetails}>View Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
