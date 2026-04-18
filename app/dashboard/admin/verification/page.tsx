"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin-verification.module.css";

export default function AdminVerificationPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const verificationRequests = [
    {
      id: "1",
      name: "Carlos Rodriguez",
      role: "Technician (Plumber)",
      roleIcon: "lucide:wrench",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F5",
      time: "Submitted 2 hours ago",
      docs: [
        { name: "ID Front", icon: "lucide:image" },
        { name: "ID Back", icon: "lucide:image" },
        { name: "Certificate", icon: "lucide:file-text" },
      ]
    },
    {
      id: "2",
      name: "BuildLine Solutions",
      role: "Company",
      roleIcon: "lucide:building",
      fallback: "BL",
      time: "Submitted 5 hours ago",
      docs: [
        { name: "Reg. Cert.", icon: "lucide:file-text" },
        { name: "Tax ID", icon: "lucide:file-text" },
        { name: "Utility Bill", icon: "lucide:image" },
      ]
    },
    {
      id: "3",
      name: "Emma Watson",
      role: "Client",
      roleIcon: "lucide:user",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FEuropean%2F3",
      time: "Submitted Yesterday",
      docs: [
        { name: "ID Front", icon: "lucide:image" },
        { name: "ID Back", icon: "lucide:image" },
      ]
    },
    {
      id: "4",
      name: "Marcus T.",
      role: "Technician (Electrician)",
      roleIcon: "lucide:zap",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F18-25%2FAfrican%2F4",
      time: "Submitted Yesterday",
      docs: [
        { name: "Passport", icon: "lucide:image" },
        { name: "License", icon: "lucide:file-text" },
      ]
    }
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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "verification" ? styles.navItemActive : ""}`}>
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
              <input type="text" placeholder="Search verifications..." />
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
              <h1>Verification Requests</h1>
              <p>Review submitted documents to verify identity and professional credentials.</p>
            </div>
          </div>

          <div className={styles.toolbarFilters}>
            <div className={styles.filterDropdown}>
              Status: Pending Review <iconify-icon icon="lucide:chevron-down" />
            </div>
            <div className={styles.filterDropdown}>
              Role: All <iconify-icon icon="lucide:chevron-down" />
            </div>
            <div className={styles.filterDropdown}>
              Sort by: Newest First <iconify-icon icon="lucide:chevron-down" />
            </div>
          </div>

          <div className={styles.verificationGrid}>
            {verificationRequests.map((request) => (
              <div key={request.id} className={styles.verificationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.userMeta}>
                    {request.avatar ? (
                      <Image src={request.avatar} alt={request.name} width={48} height={48} className={styles.userAvatar} />
                    ) : (
                      <div className={styles.userAvatarFallback}>{request.fallback}</div>
                    )}
                    <div className={styles.userDetails}>
                      <span className={styles.applicantName}>{request.name}</span>
                      <span className={styles.applicantRole}>
                        <iconify-icon icon={request.roleIcon} />
                        {request.role}
                      </span>
                      <span className={styles.submissionDate}>{request.time}</span>
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</div>
                </div>

                <div className={styles.docsSection}>
                  <div className={styles.docsTitle}>
                    <span>Documents Provided</span>
                    <iconify-icon icon="lucide:maximize-2" style={{ cursor: "pointer" }} />
                  </div>
                  <div className={styles.docsGrid}>
                    {request.docs.map((doc, idx) => (
                      <div key={idx} className={styles.docItem}>
                        <div className={styles.docIcon}>
                          <iconify-icon icon={doc.icon} style={{ fontSize: "24px" }} />
                        </div>
                        <span className={styles.docName}>{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={`${styles.btn} ${styles.btnReject}`}>
                    <iconify-icon icon="lucide:x" /> Reject
                  </button>
                  <button className={`${styles.btn} ${styles.btnApprove}`}>
                    <iconify-icon icon="lucide:check" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
