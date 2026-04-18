"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin-tasks.module.css";

export default function AdminTasksPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tasks = [
    {
      id: "1",
      title: "Complete Home Wiring for New Extension",
      category: "Electrical",
      client: "Sarah Jenkins",
      clientAvatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FNorth%20American%2F1",
      status: "Open",
      budget: "$850 - $1,200",
      date: "Oct 12, 2024",
    },
    {
      id: "2",
      title: "Fix Leaking Pipes in Master Bathroom",
      category: "Plumbing",
      client: "Carlos Rodriguez",
      clientAvatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F5",
      status: "In Progress",
      budget: "$150 Fixed",
      date: "Oct 10, 2024",
    },
    {
      id: "3",
      title: "Install Split AC Units in 3 Bedrooms",
      category: "HVAC",
      client: "Emma Watson",
      clientAvatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FEuropean%2F3",
      status: "Completed",
      budget: "$400 Fixed",
      date: "Oct 08, 2024",
    },
    {
      id: "4",
      title: "Suspicious Request - Payment Outside Platform",
      category: "General Delivery",
      client: "Marcus T.",
      clientAvatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FAfrican%2F4",
      status: "Flagged",
      budget: "$5,000 Fixed",
      date: "Oct 05, 2024",
    },
    {
      id: "5",
      title: "Repaint Exterior of 2-Story House",
      category: "Painting",
      client: "Linda Chen",
      clientAvatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F50-65%2FAsian%2F2",
      status: "Open",
      budget: "$2,000 - $3,500",
      date: "Sep 29, 2024",
    },
  ];

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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "tasks" ? styles.navItemActive : ""}`}>
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
              <input type="text" placeholder="Search tasks by title, category, or client..." />
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
              <h1>Task Management</h1>
              <p>Monitor and manage all platform tasks, their statuses, and associated actions.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export CSV
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableToolbar}>
              <div className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="text" placeholder="Filter by title or category..." />
              </div>
              <div className={styles.toolbarFilters}>
                <div className={styles.filterDropdown}>
                  Status: All <iconify-icon icon="lucide:chevron-down" />
                </div>
                <div className={styles.filterDropdown}>
                  Date: Last 30 Days <iconify-icon icon="lucide:chevron-down" />
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className={styles.taskCell}>
                          <span className={styles.taskTitle}>{task.title}</span>
                          <span className={styles.taskCategory}>{task.category}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.clientCell}>
                          <Image src={task.clientAvatar} alt={task.client} width={32} height={32} className={styles.clientAvatar} />
                          <span className={styles.clientName}>{task.client}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          task.status === "Open" ? styles.statusOpen : 
                          task.status === "In Progress" ? styles.statusInProgress : 
                          task.status === "Completed" ? styles.statusCompleted : 
                          styles.statusFlagged
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td><span className={styles.budgetCell}>{task.budget}</span></td>
                      <td><span className={styles.dateText}>{task.date}</span></td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.iconBtn} aria-label="View Task Details">
                            <iconify-icon icon="lucide:eye" />
                          </button>
                          <button 
                            className={`${styles.iconBtn} ${task.status === "Flagged" ? styles.iconBtnDanger : ""}`} 
                            aria-label={task.status === "Flagged" ? "Review Flagged Task" : "Flag for Review"}
                          >
                            <iconify-icon icon={task.status === "Flagged" ? "lucide:x-circle" : "lucide:flag"} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>Showing 1 to 5 of 3,245 entries</div>
              <div className={styles.paginationControls}>
                <button className={styles.pageBtn}><iconify-icon icon="lucide:chevron-left" /></button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}><iconify-icon icon="lucide:chevron-right" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
