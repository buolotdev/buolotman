"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./ClientSidebar.module.css";

const labels: Record<string, Record<string, string>> = {
  en: {
    brandSub: "Client Space",
    dashboard: "Dashboard",
    profile: "My Profile",
    tasks: "My Tasks",
    projects: "My Projects",
    messages: "Messages",
    payments: "Payments",
    saved: "Saved",
    support: "Support Tickets",
    settings: "Settings",
    providers: "Service Providers",
  },
  fr: {
    brandSub: "Espace Client",
    dashboard: "Tableau de bord",
    profile: "Mon Profil",
    tasks: "Mes Tâches",
    projects: "Mes Projets",
    messages: "Messages",
    payments: "Paiements",
    saved: "Favoris",
    support: "Tickets d'assistance",
    settings: "Paramètres",
    providers: "Prestataires de services",
  }
};

const navItems = [
  { key: "dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client" },
  { key: "profile", icon: "lucide:user", href: "/dashboard/client/profile" },
  { key: "tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks" },
  { key: "projects", icon: "lucide:briefcase", href: "/dashboard/client/projects" },
  { key: "messages", icon: "lucide:message-square", href: "/dashboard/client/messages" },
  { key: "payments", icon: "lucide:wallet", href: "/dashboard/client/payments" },
  { key: "saved", icon: "lucide:bookmark", href: "/dashboard/client/saved" },
  { key: "support", icon: "lucide:help-circle", href: "/dashboard/client/support" },
  { key: "settings", icon: "lucide:settings", href: "/dashboard/client/settings" },
  { key: "providers", icon: "lucide:users", href: "/service-providers" },
];

export default function ClientSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
              {t[item.key] || item.key}
            </Link>
          );
        })}

        {/* Logout placed under navigation */}
        <LogoutButton className={styles.logoutNavItem} showLabel={true} />
      </nav>
    </aside>
  );
}

