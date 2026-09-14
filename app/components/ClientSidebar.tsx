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

