"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./ClientSidebar.module.css";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client" },
  { key: "profile", label: "My Profile", icon: "lucide:user", href: "/dashboard/client/profile" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks" },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages" },
  { key: "payments", label: "Payments", icon: "lucide:wallet", href: "/dashboard/client/payments" },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved" },
  { key: "support", label: "Support Tickets", icon: "lucide:help-circle", href: "/dashboard/client/support" },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings" },
  { key: "providers", label: "Service Providers", icon: "lucide:users", href: "/service-providers" },
];

export default function ClientSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const cleanPath = pathname ? pathname.replace(/\/$/, "") : "";

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <div className={styles.brandMark}>BM</div>
          <div className={styles.brandText}>
            <div className={styles.brandLabel}>Boulot Man</div>
            <div className={styles.brandSub}>Client Space</div>
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
            ? (cleanPath === "/dashboard/client" || cleanPath === "")
            : cleanPath.startsWith(cleanHref);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={onClose}
            >
              <span className={styles.navIcon}>
                <iconify-icon icon={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Logout placed under navigation */}
        <LogoutButton className={styles.logoutNavItem} showLabel={true} />
      </nav>
    </aside>
  );
}
