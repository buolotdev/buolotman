"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./ProviderBoard.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonCard } from "@/app/components/skeleton/Skeleton";

const translations: Record<string, Record<string, any>> = {
  en: {
    headerTitle: "Connecting clients with verified technicians and engineers — securely and efficiently.",
    headerSubtitle: "Browse our directory of top-rated service providers ready to tackle your projects.",
    searchPlaceholder: "Search by name, skill, or keyword...",
    allCategories: "All Categories",
    anyLocation: "Any Location",
    remote: "Remote",
    btnFindPros: "Find Pros",
    loadingError: "Failed to load providers:",
    noProvidersTitle: "No Verified Service Providers Found",
    noProvidersDesc: "Try adjusting your search query or location filters.",
    verifiedRole: "Verified Technician",
    defaultBio: "Certified technical professional ready to help with your next project.",
    btnViewProfile: "View Profile",
    btnHireNow: "Hire Now"
  },
  fr: {
    headerTitle: "Mise en relation sécurisée et directe avec des techniciens et ingénieurs vérifiés.",
    headerSubtitle: "Consultez notre annuaire de prestataires qualifiés et prêts à intervenir sur vos projets.",
    searchPlaceholder: "Rechercher par nom, compétence ou mot-clé...",
    allCategories: "Toutes les catégories",
    anyLocation: "Toutes les localisations",
    remote: "Télétravail / À distance",
    btnFindPros: "Trouver un pro",
    loadingError: "Échec du chargement des prestataires :",
    noProvidersTitle: "Aucun prestataire vérifié trouvé",
    noProvidersDesc: "Essayez de modifier vos critères de recherche ou de changer de localisation.",
    verifiedRole: "Technicien Vérifié",
    defaultBio: "Professionnel technique certifié prêt à intervenir sur votre prochain projet.",
    btnViewProfile: "Voir le Profil",
    btnHireNow: "Engager"
  }
};

export default function ProviderBoard() {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("Any Location");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useFetch(() => api.listUsers({ role: "TECHNICIAN", limit: "50" }), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);
  
  const categories = useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : [];
  }, [categoriesData]);

  // Safe extraction (data could be array or { results: array })
  const providers = useMemo(() => {
    return Array.isArray(data) ? data : ((data as any)?.results || []);
  }, [data]);

  const filteredProviders = useMemo(() => {
    return providers.filter((pro: any) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${pro.first_name || ""} ${pro.last_name || ""}`.toLowerCase();
        const username = (pro.username || "").toLowerCase();
        const bio = (pro.bio || "").toLowerCase();
        const skills = (pro.skills || []).join(" ").toLowerCase();
        if (!fullName.includes(q) && !username.includes(q) && !bio.includes(q) && !skills.includes(q)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "All Categories") {
        const cat = selectedCategory.toLowerCase();
        const proCat = (pro.category || "").toLowerCase();
        const skills = (pro.skills || []).map((s: string) => s.toLowerCase());
        if (!proCat.includes(cat) && !skills.some((s: string) => s.includes(cat))) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation !== "Any Location") {
        const loc = selectedLocation.toLowerCase();
        const proLoc = `${pro.location || ""} ${pro.country || ""} ${pro.city || ""}`.toLowerCase();
        if (!proLoc.includes(loc)) {
          return false;
        }
      }

      return true;
    });
  }, [providers, searchQuery, selectedCategory, selectedLocation]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage) || 1;
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProviders.slice(start, start + itemsPerPage);
  }, [filteredProviders, currentPage]);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        
        {/* HEADER SECTION */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {t.headerTitle}
          </h2>
          <p className={styles.headerSubtitle}>
            {t.headerSubtitle}
          </p>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Categories">{t.allCategories}</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select 
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Any Location">{t.anyLocation}</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Kenya">Kenya</option>
            <option value="Ghana">Ghana</option>
            <option value="South Africa">South Africa</option>
            <option value="Ivory Coast">Ivory Coast</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Remote">{t.remote}</option>
          </select>
          <button 
            type="button"
            className={styles.searchBtn}
            onClick={() => setCurrentPage(1)}
          >
            {t.btnFindPros}
          </button>
        </div>

        {/* GRID */}
        {loading ? (
          <div className={styles.grid}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red", padding: "40px 0" }}>{t.loadingError} {error}</p>
        ) : filteredProviders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            <iconify-icon icon="lucide:user-x" style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "12px" }}></iconify-icon>
            <h3 style={{ fontSize: "18px", color: "#001f3f", margin: "0 0 6px" }}>{t.noProvidersTitle}</h3>
            <p style={{ fontSize: "14px", margin: 0 }}>{t.noProvidersDesc}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {paginatedProviders.map((pro: any) => {
              const fullName = pro.first_name ? `${pro.first_name} ${pro.last_name || ""}`.trim() : (pro.username || "Technician");
              const proRating = pro.average_rating ? Number(pro.average_rating).toFixed(1) : "5.0";
              const proLocation = [pro.city, pro.country || pro.location || "Rwanda"].filter(Boolean).join(", ");
              const hireUrl = `/post-task?specialist_id=${pro.id}&specialist_name=${encodeURIComponent(fullName)}`;
              const profileUrl = `/profile/${pro.id}`;

              return (
                <div key={pro.id} className={styles.card}>
                  <div className={styles.profile}>
                    <img 
                      src={pro.avatar_url || `https://i.pravatar.cc/150?img=${(pro.id % 70) + 1}`} 
                      alt={fullName} 
                      className={styles.avatar} 
                    />
                    <div>
                      <h3 className={styles.name}>{fullName}</h3>
                      <div className={styles.role}>{pro.title || pro.category || t.verifiedRole}</div>
                    </div>
                  </div>
                  
                  <div className={styles.rating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span>({proRating})</span>
                  </div>
                  
                  <div className={styles.meta}>
                    <iconify-icon icon="lucide:map-pin"></iconify-icon>
                    <span>{proLocation}</span>
                  </div>
                  
                  <div className={styles.description}>
                    {pro.bio || t.defaultBio}
                  </div>
                  
                  <div className={styles.actions}>
                    <Link href={profileUrl} className={`${styles.btn} ${styles.btnView}`}>
                      {t.btnViewProfile}
                    </Link>
                    <Link href={hireUrl} className={`${styles.btn} ${styles.btnHire}`}>
                      {t.btnHireNow}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button 
                key={pageNum} 
                className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

