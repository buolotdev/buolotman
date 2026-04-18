"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./admin-payments.module.css";

export default function AdminPaymentsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingPayouts = [
    {
      id: "PR-1042",
      name: "TechFix Solutions",
      type: "Company",
      fallback: "TF",
      date: "Today, 10:30 AM",
      method: "Bank Transfer (...4092)",
      methodIcon: "lucide:building-2",
      amount: "$1,250.00",
    },
    {
      id: "PR-1041",
      name: "Carlos Rodriguez",
      type: "Technician",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F5",
      date: "Today, 09:15 AM",
      method: "Mobile Money (...7741)",
      methodIcon: "lucide:smartphone",
      amount: "$450.00",
    },
    {
      id: "PR-1040",
      name: "Sarah Jenkins",
      type: "Technician",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FNorth%20American%2F1",
      date: "Yesterday, 04:20 PM",
      method: "Bank Transfer (...1103)",
      methodIcon: "lucide:building-2",
      amount: "$820.00",
    },
  ];

  const recentTransactions = [
    {
      id: "#TX-9028",
      task: "Electrical Wiring Fix",
      date: "Oct 24, 2023 - 11:45 AM",
      from: "Emma Watson",
      to: "Escrow (Pending Start)",
      amount: "$350.00",
      status: "Held in Escrow",
    },
    {
      id: "#TX-9027",
      task: "Plumbing Installation",
      date: "Oct 24, 2023 - 09:30 AM",
      from: "David Lee",
      to: "Carlos Rodriguez",
      amount: "$450.00",
      status: "Released",
    },
    {
      id: "#TX-9026",
      task: "Office Renovation",
      date: "Oct 23, 2023 - 02:15 PM",
      from: "TechCorp Inc.",
      to: "TechFix Solutions",
      amount: "$2,500.00",
      status: "Disputed",
    },
    {
      id: "#TX-9025",
      task: "Website Redesign",
      date: "Oct 22, 2023 - 10:00 AM",
      from: "Sarah Jenkins",
      to: "WebStudio Pro",
      amount: "$1,200.00",
      status: "Released",
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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "payments" ? styles.navItemActive : ""}`}>
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
              <input type="text" placeholder="Search transactions, payouts, users..." />
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
              <h1>Payments & Escrow Control</h1>
              <p>Manage pending payouts, monitor escrow holdings, and view platform transactions.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export Report
              </button>
            </div>
          </div>

          {/* Overview Grid */}
          <div className={styles.overviewGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total in Escrow</span>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:lock" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>$142,500.00</span>
              <div className={`${styles.statTrend} ${styles.trendPositive}`}>
                <iconify-icon icon="lucide:trending-up" /> +$4,200 this week
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Pending Payouts</span>
                <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                  <iconify-icon icon="lucide:arrow-up-right" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>$18,240.50</span>
              <div className={`${styles.statTrend} ${styles.trendNeutral}`}>
                <iconify-icon icon="lucide:clock" /> 42 requests pending
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Platform Revenue (MTD)</span>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:pie-chart" style={{ fontSize: "20px" }} />
                </div>
              </div>
              <span className={styles.statValue}>$12,450.00</span>
              <div className={`${styles.statTrend} ${styles.trendPositive}`}>
                <iconify-icon icon="lucide:trending-up" /> +12% vs last month
              </div>
            </div>
          </div>

          {/* Pending Payouts Section */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <iconify-icon icon="lucide:alert-circle" style={{ color: "#f59e0b" }} />
                Pending Payout Requests
              </h2>
              <div className={styles.sectionActions}>
                <button className={styles.btnOutline}>View All Requests</button>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Beneficiary</th>
                    <th>Request Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td>
                        <div className={styles.userCell}>
                          {payout.avatar ? (
                            <Image src={payout.avatar} alt={payout.name} width={40} height={40} className={styles.userAvatar} />
                          ) : (
                            <div className={styles.userAvatar}>{payout.fallback}</div>
                          )}
                          <div className={styles.userInfo}>
                            <span className={styles.userName}>{payout.name}</span>
                            <span className={styles.userType}>{payout.type}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{payout.date}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>ID: {payout.id}</div>
                      </td>
                      <td>
                        <div className={styles.methodCell}>
                          <iconify-icon icon={payout.methodIcon} />
                          {payout.method}
                        </div>
                      </td>
                      <td className={styles.amountCell}>{payout.amount}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.btnHold}>
                            <iconify-icon icon="lucide:pause-circle" /> Hold
                          </button>
                          <button className={styles.btnApprove}>
                            <iconify-icon icon="lucide:check-circle" /> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Escrow Transactions Table */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Escrow Overview & Transactions</h2>
              <div className={styles.sectionActions}>
                <button className={styles.btnOutline}>
                  <iconify-icon icon="lucide:filter" /> Filter
                </button>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Task / Project</th>
                    <th>From (Client)</th>
                    <th>To (Provider)</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className={styles.txCell}>{tx.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#001f3f" }}>{tx.task}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{tx.date}</div>
                      </td>
                      <td>{tx.from}</td>
                      <td>{tx.to}</td>
                      <td className={styles.amountCell}>{tx.amount}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          tx.status === "Released" ? styles.statusReleased :
                          tx.status === "Held in Escrow" ? styles.statusPending :
                          styles.statusHeld
                        }`}>
                          {tx.status}
                        </span>
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
