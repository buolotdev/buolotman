"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonCard } from "@/app/components/skeleton/Skeleton";
import { mergeWithMasterCategories } from "@/app/lib/categories";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Verified Corporate Directory",
    title: "Browse Registered Companies",
    subtitle: "Discover certified contracting firms, commercial enterprises, and engineering companies for large-scale technical projects.",
    searchPlaceholder: "Search company name, expertise, or location...",
    allCategories: "All Specializations",
    searchBtn: "Search Companies",
    resultsCount: "registered companies found",
    verifiedBadge: "Verified Company",
    viewProfile: "View Profile",
    requestQuote: "Request Quotation",
    headquarters: "Headquarters",
    rating: "Rating",
    projects: "Projects",
    services: "Services",
    noCompanies: "No companies found matching your criteria.",
    tryAdjusting: "Try adjusting your search query or selecting a different category.",
    resetSearch: "Reset Filters",
  },
  fr: {
    eyebrow: "Annuaire des Entreprises Vérifiées",
    title: "Trouver des Entreprises Enregistrées",
    subtitle: "Découvrez des entreprises de construction agréées, des prestataires commerciaux et des bureaux d'ingénierie pour vos grands chantiers.",
    searchPlaceholder: "Rechercher par nom d'entreprise, expertise ou ville...",
    allCategories: "Toutes les spécialités",
    searchBtn: "Rechercher",
    resultsCount: "entreprises enregistrées trouvées",
    verifiedBadge: "Entreprise Vérifiée",
    viewProfile: "Voir le Profil",
    requestQuote: "Demander un Devis",
    headquarters: "Siège social",
    rating: "Évaluation",
    projects: "Projets",
    services: "Services",
    noCompanies: "Aucune entreprise ne correspond à vos critères.",
    tryAdjusting: "Essayez de modifier vos termes de recherche ou de changer de catégorie.",
    resetSearch: "Réinitialiser les filtres",
  }
};

export default function CompaniesPage() {
  const [lang, setLang] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: companiesData, loading, error } = useFetch(() => api.listCompanies({ all_status: "true" }), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);

  const categories = mergeWithMasterCategories(categoriesData);

  const rawCompanies = Array.isArray(companiesData) ? companiesData : ((companiesData as any)?.results || []);

  const filteredCompanies = useMemo(() => {
    let list = rawCompanies;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c: any) => 
        (c.company_name || "").toLowerCase().includes(q) ||
        (c.about || "").toLowerCase().includes(q) ||
        (c.headquarters || "").toLowerCase().includes(q) ||
        (c.user?.first_name || "").toLowerCase().includes(q) ||
        (c.user?.last_name || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      const catSlug = selectedCategory.toLowerCase();
      list = list.filter((c: any) => {
        const services = Array.isArray(c.services_offered) ? c.services_offered : [];
        return services.some((s: string) => s.toLowerCase().includes(catSlug)) ||
               (c.about || "").toLowerCase().includes(catSlug);
      });
    }

    return list;
  }, [rawCompanies, searchQuery, selectedCategory]);

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero Header */}
      <section className={styles.headerArea}>
        <div className={styles.headerEyebrow}>
          <iconify-icon icon="lucide:shield-check" />
          {t.eyebrow}
        </div>
        <h1 className={styles.headerTitle}>{t.title}</h1>
        <p className={styles.headerSubtitle}>{t.subtitle}</p>
      </section>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <iconify-icon icon="lucide:search" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.searchSelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">{t.allCategories}</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          className={styles.searchButton}
          onClick={() => {}}
        >
          <iconify-icon icon="lucide:building-2" />
          {t.searchBtn}
        </button>
      </div>

      {/* Main Grid */}
      <main className={styles.container}>
        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>
            <strong>{filteredCompanies.length}</strong> {t.resultsCount}
          </span>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className={styles.emptyState}>
            <iconify-icon icon="lucide:building" style={{ fontSize: "48px", color: "#94a3b8", marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#001f3f" }}>{t.noCompanies}</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "14px" }}>{t.tryAdjusting}</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{
                background: "#001f3f",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.resetSearch}
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredCompanies.map((company: any) => {
              const profileId = company.user?.id || company.id;
              const companyName = company.company_name || `${company.user?.first_name || ""} ${company.user?.last_name || ""}`.trim() || "Corporate Enterprise";
              const logoUrl = company.logo_url || company.user?.avatar_url;
              const initials = companyName
                .split(" ")
                .map((w: string) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "CP";

              const rating = parseFloat(company.average_rating) || 5.0;
              const reviews = company.review_count ?? company.reviews_count ?? 0;
              const location = company.headquarters || company.user?.country || "West Africa";

              return (
                <article key={company.id} className={styles.card}>
                  <div className={styles.cardBanner} />

                  <div className={styles.cardAvatarWrapper}>
                    <div className={styles.avatarBox}>
                      {logoUrl ? (
                        <img src={getImageUrl(logoUrl)} alt={companyName} className={styles.avatarImg} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    <div className={styles.verifiedTag}>
                      <iconify-icon icon="lucide:shield-check" />
                      {t.verifiedBadge}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <Link href={`/profile/${profileId}`} className={styles.companyName}>
                      {companyName}
                    </Link>

                    <p className={styles.companyDesc}>
                      {company.about || "Fully licensed and certified corporate provider delivering specialized technical contracting and project execution."}
                    </p>

                    <div className={styles.statsRow}>
                      <div className={styles.statItem}>
                        <span className={styles.statItemLabel}>{t.rating}</span>
                        <span className={styles.statItemVal}>
                          <iconify-icon icon="lucide:star" style={{ color: "#f59e0b", fontSize: "14px" }} />
                          {rating.toFixed(1)} ({reviews})
                        </span>
                      </div>

                      <div className={styles.statItem}>
                        <span className={styles.statItemLabel}>{t.projects}</span>
                        <span className={styles.statItemVal}>
                          <iconify-icon icon="lucide:briefcase" style={{ color: "#2563eb", fontSize: "14px" }} />
                          {company.projects_count ?? 0}
                        </span>
                      </div>

                      <div className={styles.statItem}>
                        <span className={styles.statItemLabel}>{t.services}</span>
                        <span className={styles.statItemVal}>
                          <iconify-icon icon="lucide:layers" style={{ color: "#16a34a", fontSize: "14px" }} />
                          {company.services_count ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cardMeta}>
                      <span>
                        <iconify-icon icon="lucide:map-pin" style={{ color: "#ff4500", marginRight: "4px" }} />
                        {location}
                      </span>
                      {company.team_size && (
                        <span>
                          <iconify-icon icon="lucide:users" style={{ marginRight: "4px" }} />
                          {company.team_size} Staff
                        </span>
                      )}
                    </div>

                    <div className={styles.cardActions}>
                      <Link href={`/profile/${profileId}`} className={styles.btnView}>
                        {t.viewProfile}
                      </Link>

                      <Link href={`/post-task?company=${company.id}`} className={styles.btnQuote}>
                        <iconify-icon icon="lucide:send" />
                        {t.requestQuote}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
