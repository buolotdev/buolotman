"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./admin.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard", match: (p: string) => p === "/dashboard/admin" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users", match: (p: string) => p.startsWith("/dashboard/admin/users") },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text", match: (p: string) => p.startsWith("/dashboard/admin/tasks") },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check", match: (p: string) => p.startsWith("/dashboard/admin/verification") },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card", match: (p: string) => p.startsWith("/dashboard/admin/payments") },
    { id: "disputes", label: "Disputes & Reports", href: "/dashboard/admin/disputes", icon: "lucide:scale", match: (p: string) => p.startsWith("/dashboard/admin/disputes") },
    { id: "messages", label: "Messages", href: "/dashboard/admin/messages", icon: "lucide:message-square", match: (p: string) => p.startsWith("/dashboard/admin/messages") },
    { id: "reviews", label: "Reviews", href: "/dashboard/admin/reviews", icon: "lucide:star", match: (p: string) => p.startsWith("/dashboard/admin/reviews") },
    { id: "support", label: "Support Tickets", href: "/dashboard/admin/support", icon: "lucide:life-buoy", match: (p: string) => p.startsWith("/dashboard/admin/support") },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers", match: (p: string) => p.startsWith("/dashboard/admin/content") },
    { id: "settings", label: "Platform Settings", href: "/dashboard/admin/settings", icon: "lucide:settings", match: (p: string) => p.startsWith("/dashboard/admin/settings") },
  ];

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);

  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandText}>Boulot Man</span>
            <span className={styles.adminBadge}>Admin</span>
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
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </aside>

      <main className={styles.mainContent}>
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {children}
      </main>
    </div>
  );
}
