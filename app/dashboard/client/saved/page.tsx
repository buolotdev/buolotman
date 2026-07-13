"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
import styles from "./saved.module.css";

type SavedItem = {
  id: number | string;
  professional?: {
    id?: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    role?: string;
  };
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client/profile", match: (p: string) => p.startsWith("/dashboard/client/profile") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },

];

export default function SavedProfessionalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { data, loading, refetch } = useFetch(() => api.getSavedPros(), []);
  const saved = Array.isArray(data) ? data : [];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Main client navigation">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.headerTitle}>Saved Professionals</h1>
                <p className={styles.headerSubtitle}>Manage your curated roster of technicians, freelancers, and business partners.</p>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                <p>Loading saved professionals...</p>
              </div>
            ) : saved.length === 0 ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:bookmark-x" />
                <p>No saved professionals yet.</p>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Bookmarks make it easy to contact your favorite providers later.</span>
              </div>
            ) : (
              <section className={styles.cardsGrid}>
                {saved.map((item) => {
                  const savedItem = item as SavedItem;
                  const professional = savedItem.professional || {};
                  const name = `${professional.first_name || ""} ${professional.last_name || ""}`.trim() || professional.username || "Professional";
                  const initials = `${professional.first_name?.[0] || ""}${professional.last_name?.[0] || ""}`.toUpperCase() || "BM";
                  return (
                    <article key={savedItem.id} className={styles.proCard}>
                      <div className={styles.proInfo}>
                        <div className={styles.avatar}>{initials}</div>
                        <div className={styles.details}>
                          <h3>{name}</h3>
                          <p>{professional.role || "Provider"}</p>
                        </div>
                      </div>
                      <div className={styles.actions}>
                        <Link href={`/profile/${professional.id}`} className={styles.viewBtn}>
                          View Profile
                        </Link>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={async () => {
                            if (typeof professional.id !== "number") {
                              return;
                            }
                            await api.unsavePro(professional.id);
                            refetch();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
