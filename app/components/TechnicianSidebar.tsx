"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./TechnicianSidebar.module.css";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician" },
  { key: "projects", label: "Projects", icon: "lucide:folder-open", href: "/dashboard/technician/projects" },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks" },
  { key: "services", label: "My Services", icon: "lucide:layers-3", href: "/dashboard/technician/services" },
  { key: "bids", label: "My Bids", icon: "lucide:send", href: "/dashboard/technician/bids" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/technician/messages" },
  { key: "wallet", label: "Wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet" },
  { key: "profile", label: "Edit Profile", icon: "lucide:user-cog", href: "/dashboard/technician/profile" },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/technician/settings" },
];

export default function TechnicianSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const cleanPath = pathname ? pathname.replace(/\/$/, "") : "";

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <div className={styles.brandMark}>BM</div>
          <div className={styles.brandText}>
            <div className={styles.brandLabel}>Boulot Man</div>
            <div className={styles.brandSub}>Technician Space</div>
          </div>
        </Link>
        <button type="button" className={styles.sidebarClose} onClick={onClose} aria-label="Close navigation">
          <iconify-icon icon="lucide:x" />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const cleanHref = item.href.replace(/\/$/, "");
          const isActive = item.key === "dashboard"
            ? cleanPath === "/dashboard/technician"
            : cleanPath.startsWith(cleanHref);

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
