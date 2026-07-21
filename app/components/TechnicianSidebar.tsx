"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import LogoutButton from "./LogoutButton";
import styles from "./TechnicianSidebar.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "projects", label: "Projects", icon: "lucide:folder-open", href: "/dashboard/technician/projects", match: (p: string) => p.startsWith("/dashboard/technician/projects") },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks", match: (p: string) => p.startsWith("/dashboard/technician/tasks") },
  { key: "services", label: "My Services", icon: "lucide:layers-3", href: "/dashboard/technician/services", match: (p: string) => p.startsWith("/dashboard/technician/services") },
  { key: "bids", label: "My Bids", icon: "lucide:send", href: "/dashboard/technician/bids", match: (p: string) => p.startsWith("/dashboard/technician/bids") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/technician/messages", match: (p: string) => p.startsWith("/dashboard/technician/messages") },
  { key: "wallet", label: "Wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet", match: (p: string) => p.startsWith("/dashboard/technician/wallet") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/technician/profile", match: (p: string) => p.startsWith("/dashboard/technician/profile") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/technician/settings", match: (p: string) => p.startsWith("/dashboard/technician/settings") },
];

export default function TechnicianSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: userData } = useFetch(() => api.getMe(), []);

  const userName = userData ? (`${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim() || userData.username || "Technician") : "Loading...";
  const userInitials = useMemo(() => {
    if (!userData) return "...";
    const first = userData.first_name?.[0] ?? "";
    const last = userData.last_name?.[0] ?? "";
    const initials = `${first}${last}`.toUpperCase();
    return initials || "T";
  }, [userData]);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>Boulot Man</span>
        </Link>
        <button type="button" className={styles.sidebarClose} onClick={onClose} aria-label="Close navigation">
          <iconify-icon icon="lucide:x" />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link key={item.key} href={item.href} className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
              <span className={styles.navIcon}>
                <iconify-icon icon={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto" }}>
        <LogoutButton className={styles.logoutButton} />
      </div>
    </aside>
  );
}
