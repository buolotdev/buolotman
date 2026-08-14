"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./CompanySidebar.module.css";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/company" },
  { key: "profile", label: "Profile Management", icon: "lucide:user", href: "/dashboard/company/profile" },
  { key: "services", label: "Services", icon: "lucide:layers", href: "/dashboard/company/services" },
  { key: "projects", label: "Projects & Gallery", icon: "lucide:briefcase", href: "/dashboard/company/projects" },
  { key: "quotes", label: "Quote Requests", icon: "lucide:file-text", href: "/dashboard/company/quotes" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/company/messages" },
  { key: "reviews", label: "Reviews", icon: "lucide:star", href: "/dashboard/company/reviews" },
  { key: "analytics", label: "Analytics", icon: "lucide:bar-chart-2", href: "/dashboard/company/analytics" },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/company/settings" },
  { key: "wallet", label: "Wallet (Legacy)", icon: "lucide:wallet", href: "/dashboard/company/wallet" },
  { key: "team", label: "Team (Legacy)", icon: "lucide:users", href: "/dashboard/company/team" },
];

export default function CompanySidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const cleanPath = pathname ? pathname.replace(/\/$/, "") : "";

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <div className={styles.brandMark}>
            <Image src="/boulotman-logo.png" alt="BM" width={32} height={32} style={{ objectFit: "contain" }} />
          </div>
          <div className={styles.brandText}>
            <div className={styles.brandLabel}>Boulot Man</div>
            <div className={styles.brandSub}>Company Space</div>
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
            ? cleanPath === "/dashboard/company"
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

      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
        <LogoutButton className={styles.logoutButton} />
      </div>
    </aside>
  );
}
