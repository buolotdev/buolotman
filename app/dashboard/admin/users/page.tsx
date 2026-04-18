"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin-users.module.css";

export default function AdminUsersPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const users = [
    {
      id: "1",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: "Client",
      status: "Active",
      joinDate: "Oct 12, 2024",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FNorth%20American%2F1",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen.tech@example.com",
      role: "Technician",
      status: "Active",
      joinDate: "Oct 10, 2024",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F2",
    },
    {
      id: "3",
      name: "Elite Electricals LLC",
      email: "contact@eliteelectricals.com",
      role: "Company",
      status: "Active",
      joinDate: "Oct 08, 2024",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F50-65%2FNorth%20American%2F3",
    },
    {
      id: "4",
      name: "Jessica Nkomo",
      email: "jess.nkomo@example.com",
      role: "Technician",
      status: "Suspended",
      joinDate: "Sep 29, 2024",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FAfrican%2F4",
    },
    {
      id: "5",
      name: "Carlos Rodriguez",
      email: "crodriguez88@example.com",
      role: "Client",
      status: "Active",
      joinDate: "Sep 15, 2024",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F5",
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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "users" ? styles.navItemActive : ""}`}>
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
              <input type="text" placeholder="Search by name, email, or ID..." />
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
              <h1>User Management</h1>
              <p>Manage all platform users, roles, and account statuses.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export CSV
              </button>
              <button className={styles.btnPrimary}>
                <iconify-icon icon="lucide:plus" /> Add User
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableToolbar}>
              <div className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="text" placeholder="Filter by name or email..." />
              </div>
              <div className={styles.toolbarFilters}>
                <div className={styles.filterDropdown}>
                  Role: All <iconify-icon icon="lucide:chevron-down" />
                </div>
                <div className={styles.filterDropdown}>
                  Status: All <iconify-icon icon="lucide:chevron-down" />
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userCell}>
                          <Image src={user.avatar} alt={user.name} width={40} height={40} className={styles.userAvatar} />
                          <div className={styles.userDetails}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userEmail}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${user.role === "Client" ? styles.roleClient : user.role === "Technician" ? styles.roleTechnician : styles.roleCompany}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className={`${styles.statusBadge} ${user.status === "Active" ? styles.statusActive : styles.statusSuspended}`}>
                          <span className={styles.statusDot} />
                          {user.status}
                        </div>
                      </td>
                      <td><span className={styles.dateText}>{user.joinDate}</span></td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.iconBtn} aria-label="View Profile">
                            <iconify-icon icon="lucide:eye" />
                          </button>
                          <button className={styles.iconBtn} aria-label={user.status === "Active" ? "Suspend Account" : "Activate Account"}>
                            <iconify-icon icon={user.status === "Active" ? "lucide:ban" : "lucide:rotate-ccw"} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>Showing 1 to 5 of 24,592 entries</div>
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
