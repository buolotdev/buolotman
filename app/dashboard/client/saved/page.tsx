"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";
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

const translations: Record<string, Record<string, string>> = {
  en: {
    headerTitle: "Saved Professionals",
    headerSubtitle: "Manage your curated roster of technicians, freelancers, and business partners.",
    loading: "Loading saved professionals...",
    noSaved: "No saved professionals yet.",
    noSavedDesc: "Bookmarks make it easy to contact your favorite providers later.",
    viewProfile: "View Profile",
    remove: "Remove",
  },
  fr: {
    headerTitle: "Artisans Favoris",
    headerSubtitle: "Gérez votre carnet d'artisans, freelances et partenaires préférés.",
    loading: "Chargement des favoris...",
    noSaved: "Aucun professionnel enregistré pour le moment.",
    noSavedDesc: "Les favoris vous permettent de recontacter facilement vos prestataires préférés.",
    viewProfile: "Voir le Profil",
    remove: "Retirer",
  }
};

export default function SavedProfessionalsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data, loading, refetch } = useFetch(() => api.getSavedPros(), []);
  const saved = Array.isArray(data) ? data : [];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content Area */}
        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.headerTitle}>{t.headerTitle}</h1>
                <p className={styles.headerSubtitle}>{t.headerSubtitle}</p>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                <p>{t.loading}</p>
              </div>
            ) : saved.length === 0 ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:bookmark-x" />
                <p>{t.noSaved}</p>
                <span style={{ fontSize: "13px", color: "#64748b" }}>{t.noSavedDesc}</span>
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
                          {t.viewProfile}
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
                          {t.remove}
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

