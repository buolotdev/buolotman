"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
          <button className={styles.mobileCloseBtn} onClick={() => setMobileSidebarOpen(false)}>
            <iconify-icon icon="lucide:x" />
          </button>
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
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
