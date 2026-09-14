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
    support: "Support Tickets",
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
    support: "Tickets d'assistance",
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
  { key: "support", icon: "lucide:help-circle", href: "/dashboard/technician/support" },
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

      <div style={{ padding: "0 14px 12px" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.08)",
            color: "#cbd5e1",
            fontSize: "12px",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 69, 0, 0.2)";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "rgba(255, 69, 0, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "#cbd5e1";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "14px", color: "#ff4500" }} />
          <iconify-icon icon="lucide:home" style={{ fontSize: "14px" }} />
          <span>{lang === "fr" ? "Retour au site" : "Back to Home Page"}</span>
        </Link>
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

