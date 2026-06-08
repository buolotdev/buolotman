"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

type NavKey = "dashboard" | "tasks" | "messages" | "payments" | "saved" | "profile";

const navItems: Array<{ key: NavKey; label: string; icon: string; href: string }> = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client" },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client" },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client" },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client" },
];

export default function TaskPublishSuccessPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: meData } = useFetch(() => api.getMe(), []);

  const userInitials = (() => {
    const first = meData?.first_name || "";
    const last = meData?.last_name || "";
    if (first || last) return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
    return "";
  })();
  const userName =
    [meData?.first_name, meData?.last_name].filter(Boolean).join(" ") || meData?.username || "";
  const userRole = meData?.role ? meData.role.charAt(0).toUpperCase() + meData.role.slice(1) : "";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={`${styles.navItem} ${item.key === "tasks" ? styles.navItemActive : ""}`}>
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button
                type="button"
                className={styles.mobileMenuButton}
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                <iconify-icon icon="lucide:menu" />
              </button>

              <label className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="search" placeholder="Search tasks, professionals..." aria-label="Search tasks and professionals" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>

              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{userInitials}</div>
                <div>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.successWrap}>
              <div className={styles.successCard}>
                <div className={styles.successIconWrap}>
                  <iconify-icon icon="lucide:check" />
                </div>

                <h2 className={styles.successTitle}>Your task has been posted successfully!</h2>
                <p className={styles.successText}>
                  You will start receiving bids shortly from qualified professionals in your area.
                </p>

                <div className={styles.actionRow}>
                  <Link href="/dashboard/client" className={styles.secondaryButton}>
                    Go to Dashboard
                  </Link>
                  <Link href="/post-task/review" className={styles.primaryButton}>
                    View Task Details
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
