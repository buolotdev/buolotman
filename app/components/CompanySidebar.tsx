"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./CompanySidebar.module.css";

const labels: Record<string, Record<string, string>> = {
  en: {
    brandSub: "Company Space",
    dashboard: "Dashboard",
    profile: "Profile Management",
    services: "Services",
    projects: "Projects & Gallery",
    quotes: "Quote Requests",
    messages: "Messages",
    reviews: "Reviews",
    analytics: "Analytics",
    settings: "Settings",
    wallet: "Wallet (Legacy)",
    team: "Team (Legacy)",
  },
  fr: {
    brandSub: "Espace Entreprise",
    dashboard: "Tableau de bord",
    profile: "Gestion du profil",
    services: "Services",
    projects: "Projets & Galerie",
    quotes: "Demandes de devis",
    messages: "Messages",
    reviews: "Avis & Évaluations",
    analytics: "Analytique",
    settings: "Paramètres",
    wallet: "Portefeuille",
    team: "Équipes",
  }
};

const navItems = [
  { key: "dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/company" },
  { key: "profile", icon: "lucide:user", href: "/dashboard/company/profile" },
  { key: "services", icon: "lucide:layers-3", href: "/dashboard/company/services" },
  { key: "projects", icon: "lucide:briefcase", href: "/dashboard/company/projects" },
  { key: "quotes", icon: "lucide:file-text", href: "/dashboard/company/quotes" },
  { key: "messages", icon: "lucide:message-square", href: "/dashboard/company/messages" },
  { key: "reviews", icon: "lucide:star", href: "/dashboard/company/reviews" },
  { key: "analytics", icon: "lucide:bar-chart-2", href: "/dashboard/company/analytics" },
  { key: "settings", icon: "lucide:settings", href: "/dashboard/company/settings" },
  { key: "wallet", icon: "lucide:wallet", href: "/dashboard/company/wallet" },
  { key: "team", icon: "lucide:users", href: "/dashboard/company/team" },
];

export default function CompanySidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            ? cleanPath === "/dashboard/company"
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

        {/* Logout placed directly under navigation */}
        <LogoutButton className={styles.logoutNavItem} showLabel={true} />
      </nav>
    </aside>
  );
}

