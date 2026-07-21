"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
import layoutStyles from "../page.module.css";
import styles from "./quotes.module.css";

// MOCK DATA
const MOCK_QUOTES = [
  { id: "QR-100", client: "James M.", service: "Commercial Building", budget: "$50,000 – $70,000", deadline: "Feb 20, 2026", status: "pending" },
  { id: "QR-101", client: "Linda K.", service: "Renovation", budget: "$8,000 – $12,000", deadline: "Feb 10, 2026", status: "approved" },
  { id: "QR-102", client: "Aisha R.", service: "Office HVAC Installation", budget: "$15,000 – $20,000", deadline: "Mar 05, 2026", status: "pending" },
  { id: "QR-103", client: "David O.", service: "Server Setup & Networking", budget: "$4,000 – $6,000", deadline: "Jan 28, 2026", status: "declined" },
];

export default function CompanyQuotesPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/company" },
    { id: "profile", label: "Profile Management", href: "/dashboard/company/profile", icon: "lucide:user", match: (p: string) => p.startsWith("/dashboard/company/profile") },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/company/services") },
    { id: "projects", label: "Projects & Gallery", href: "/dashboard/company/projects", icon: "lucide:briefcase", match: (p: string) => p.startsWith("/dashboard/company/projects") },
    { id: "quotes", label: "Quote Requests", href: "/dashboard/company/quotes", icon: "lucide:file-text", match: (p: string) => p.startsWith("/dashboard/company/quotes") },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", match: (p: string) => p.startsWith("/dashboard/company/messages") },
    { id: "reviews", label: "Reviews", href: "/dashboard/company/reviews", icon: "lucide:star", match: (p: string) => p.startsWith("/dashboard/company/reviews") },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-2", match: (p: string) => p.startsWith("/dashboard/company/analytics") },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/company/settings") },
    { id: "wallet", label: "Wallet (Legacy)", href: "/dashboard/company/wallet", icon: "lucide:wallet", match: (p: string) => p.startsWith("/dashboard/company/wallet") },
    { id: "team", label: "Team (Legacy)", href: "/dashboard/company/team", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/company/team") },
  ];

  return (
    <div className={`${layoutStyles.layoutWrapper} ${mobileSidebarOpen ? layoutStyles.sidebarOpenMobile : ""}`}>
      <div className={layoutStyles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={layoutStyles.sidebar}>
        <div className={layoutStyles.sidebarHeader}>
          <Link href="/" className={layoutStyles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={layoutStyles.brandImage} priority />
            <div className={layoutStyles.brandText}>
              <span className={layoutStyles.brandEyebrow}>Boulot Man</span>
              <span className={layoutStyles.brandTitle}>Company Space</span>
            </div>
          </Link>
        </div>

        <nav className={layoutStyles.navMenu}>
          {navItems.map((item) => {
            const isActive = item.match(pathname || "");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${layoutStyles.navItem} ${isActive ? layoutStyles.navItemActive : ""}`}
              >
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <LogoutButton className={layoutStyles.logoutButton} />
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      <main className={layoutStyles.mainWrapper}>
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className={layoutStyles.content}>
          <div className={layoutStyles.pageHeader}>
            <div className={layoutStyles.headerTitles}>
              <h1>Quote Requests</h1>
              <p>Manage incoming requests for quotations from clients.</p>
            </div>
          </div>

          <section className={layoutStyles.panel}>
            <div className={layoutStyles.panelHeader}>
              <h2>All Quote Requests</h2>
            </div>
            <div className={layoutStyles.panelBody} style={{ padding: 0 }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Budget</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_QUOTES.map((q) => (
                    <tr key={q.id}>
                      <td><strong>{q.id}</strong></td>
                      <td>{q.client}</td>
                      <td>{q.service}</td>
                      <td>{q.budget}</td>
                      <td>{q.deadline}</td>
                      <td>
                        <span className={`${styles.status} ${styles[q.status]}`}>{q.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {q.status === 'pending' && (
                            <>
                              <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>Send Quote</button>
                              <button className={styles.actionBtn}>Decline</button>
                            </>
                          )}
                          {q.status !== 'pending' && (
                            <button className={styles.actionBtn}>View Details</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
