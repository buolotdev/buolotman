"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./TechnicianSidebar.module.css";

const labels: Record<string, Record<string, string>> = {
  en: {
    brandSub: "Technician Space",
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Browse Tasks",
    services: "My Services",
    bids: "My Bids",
    messages: "Messages",
    wallet: "Wallet",
    profile: "Edit Profile",
    settings: "Settings",
  },
  fr: {
    brandSub: "Espace Technicien",
    dashboard: "Tableau de bord",
    projects: "Projets",
    tasks: "Parcourir les tâches",
    services: "Mes Services",
    bids: "Mes Offres",
    messages: "Messages",
    wallet: "Portefeuille",
    profile: "Modifier le Profil",
    settings: "Paramètres",
  }
};

const navItems = [
  { key: "dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician" },
  { key: "projects", icon: "lucide:folder-open", href: "/dashboard/technician/projects" },
  { key: "tasks", icon: "lucide:search", href: "/dashboard/technician/tasks" },
  { key: "services", icon: "lucide:layers-3", href: "/dashboard/technician/services" },
  { key: "bids", icon: "lucide:send", href: "/dashboard/technician/bids" },
  { key: "messages", icon: "lucide:message-square", href: "/dashboard/technician/messages" },
  { key: "wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet" },
  { key: "profile", icon: "lucide:user-cog", href: "/dashboard/technician/profile" },
  { key: "settings", icon: "lucide:settings", href: "/dashboard/technician/settings" },
];

export default function TechnicianSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const cleanPath = pathname ? pathname.replace(/\/$/, "") : "";
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = labels[lang] || labels["en"];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <div className={styles.brandMark}>BM</div>
          <div className={styles.brandText}>
            <div className={styles.brandLabel}>Boulot Man</div>
            <div className={styles.brandSub}>{t.brandSub}</div>
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
            <Link 
              key={item.key} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={onClose}
            >
              <span className={styles.navIcon}>
                <iconify-icon icon={item.icon} />
              </span>
              {t[item.key] || item.key}
            </Link>
          );
        })}

        {/* Logout placed directly under Settings */}
        <LogoutButton className={styles.logoutNavItem} showLabel={true} />
      </nav>
    </aside>
  );
}

