"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import { api, getImageUrl } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import Header from "../components/Header";
import { SkeletonBlock, SkeletonCard } from "../components/skeleton/Skeleton";
import { formatXOF } from "../lib/format";
import styles from "./search.module.css";

function CardMedia({ result }: { result: SearchResult }) {
  const [hasError, setHasError] = useState(false);
  const initials = (result.name || "B")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={styles.cardHeaderArea}>
      <div className={styles.cardCoverBanner}>
        {result.type === "company" ? (
          <div className={styles.bannerCompanyPattern} />
        ) : (
          <div className={styles.bannerTechPattern} />
        )}
      </div>

      <div className={styles.avatarBadgeWrapper}>
        <div className={styles.avatarBadge}>
          {result.image && !hasError ? (
            <img
              src={result.image}
              alt={result.name}
              className={styles.avatarImg}
              onError={() => setHasError(true)}
            />
          ) : (
            <div
              className={`${styles.avatarFallback} ${
                result.type === "company" ? styles.avatarFallbackCompany : styles.avatarFallbackTech
              }`}
            >
              {initials || (
                <iconify-icon
                  icon={result.type === "company" ? "lucide:building-2" : "lucide:user"}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const translations: Record<string, Record<string, any>> = {
  en: {
    searchPlaceholder: "Service",
    btnSearch: "Search",
    filtersTitle: "Filters",
    clearAll: "Clear all",
    serviceCat: "Service Category",
    allCats: "All categories",
    budgetTitle: "Budget (XOF)",
    min: "Min",
    max: "Max",
    proTypeTitle: "Professional Type",
    anyType: "Any",
    indTech: "Independent Technician",
    regComp: "Registered Company",
    minRatingTitle: "Minimum Rating",
    anyRating: "Any rating",
    andUp: "& up",
    tabAll: "All results",
    tabServices: "Services",
    tabTechs: "Technicians",
    tabComps: "Companies",
    sortBy: "Sort by:",
    sortRelevance: "Relevance",
    sortHighest: "Highest rated",
    sortLowest: "Lowest price",
    noResults: "No results found. Try adjusting your filters.",
    verified: "Verified",
    verifiedComp: "Verified Company",
    viewProfile: "View Profile",
    requestQuote: "Request Quote",
    hireSpecialist: "Hire Specialist",
    requestService: "Request Service",
    previous: "Previous",
    next: "Next",
  },
  fr: {
    searchPlaceholder: "Rechercher un service...",
    btnSearch: "Rechercher",
    filtersTitle: "Filtres",
    clearAll: "Tout réinitialiser",
    serviceCat: "Catégorie de service",
    allCats: "Toutes les catégories",
    budgetTitle: "Budget (XOF)",
    min: "Min",
    max: "Max",
    proTypeTitle: "Type de professionnel",
    anyType: "Tous",
    indTech: "Technicien indépendant",
    regComp: "Entreprise enregistrée",
    minRatingTitle: "Évaluation minimale",
    anyRating: "Toutes les notes",
    andUp: "et plus",
    tabAll: "Tous les résultats",
    tabServices: "Services",
    tabTechs: "Techniciens",
    tabComps: "Entreprises",
    sortBy: "Trier par :",
    sortRelevance: "Pertinence",
    sortHighest: "Mieux notés",
    sortLowest: "Prix croissant",
    noResults: "Aucun résultat trouvé. Essayez de modifier vos filtres.",
    verified: "Vérifié",
    verifiedComp: "Entreprise vérifiée",
    viewProfile: "Voir le profil",
    requestQuote: "Demander un devis",
    hireSpecialist: "Recruter le spécialiste",
    requestService: "Demander le service",
    previous: "Précédent",
    next: "Suivant",
  }
};

type SearchResult = {
  id: string | number;
  type: "technician" | "company" | "service";
  name: string;
  role?: string;
  description?: string;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  location?: string;
  price?: number | string;
  priceLabel?: string;
  verified?: boolean;
  skills?: string[];
  link?: string;
  serviceType?: string;
};

export default function SearchPage() {
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

  const professionalTypes = [
    { value: "any", label: t.anyType },
    { value: "technician", label: t.indTech },
    { value: "company", label: t.regComp },
  ];

  const ratings = [
    { value: "4.5", label: `4.5 ${t.andUp}` },
    { value: "4.0", label: `4.0 ${t.andUp}` },
    { value: "3.0", label: `3.0 ${t.andUp}` },
  ];

  const tabs = [
    { value: "all", label: t.tabAll },
    { value: "services", label: t.tabServices },
    { value: "technician", label: t.tabTechs },
    { value: "company", label: t.tabComps },
  ];

  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | number | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setIsAuth(true);
      setUserRole(role || "client");
      api.getMe().then(user => {
        if (user?.id) setCurrentUserId(user.id);
        const initials = `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase();
        setUserInitials(initials || user.username?.[0]?.toUpperCase() || "U");
      }).catch(() => {
        // Handle error silently
      });
    }
  }, []);

  const getDashboardLink = () => {
    const role = userRole.toLowerCase();
    if (role === "admin") return "/dashboard/admin";
    if (role === "company") return "/dashboard/company";
    if (role === "technician") return "/dashboard/technician";
    return "/dashboard/client";
  };

  const { data: categoriesData } = useFetch(() => api.getCategories(), []);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("any");
  const [activeType, setActiveType] = useState<string>("any");
  const [activeRating, setActiveRating] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("q")) setQuery(urlParams.get("q") || "");
      if (urlParams.has("location")) setLocation(urlParams.get("location") || "");
      if (urlParams.has("category")) setActiveCategory(urlParams.get("category") || "any");
      if (urlParams.has("type")) {
        const t = urlParams.get("type") || "any";
        setActiveType(t);
        if (t === "company" || t === "technician") setActiveTab(t);
      }
    }
  }, []);

  const searchParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (location && location.toLowerCase() !== "global" && location.toLowerCase() !== "all locations" && location.toLowerCase() !== "any") {
      params.location = location;
    }
    if (activeCategory && activeCategory !== "any") params.category = activeCategory;
    if (activeType && activeType !== "any") params.type = activeType;
    if (activeRating) params.min_rating = activeRating;
    if (sortBy) params.sort = sortBy;
    if (budgetMin) params.budget_min = budgetMin;
    if (budgetMax) params.budget_max = budgetMax;
    return params;
  }, [query, location, activeCategory, activeType, activeRating, sortBy, budgetMin, budgetMax]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.search(searchParams);
        if (cancelled) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (Array.isArray(res) ? res : res?.results ?? []) as any[];
        const mapped: SearchResult[] = raw.map((item) => {
          const rawImg = item.image || item.logo_url || item.cover_url || item.avatar_url || item.avatar;
          return {
            id: item.id,
            type: item.type || (item.role === "company" ? "company" : item.type === "service" ? "service" : "technician"),
            name: item.name || item.full_name || item.company_name || "",
            role: item.role || item.specialty || item.title,
            description: item.description || item.bio,
            image: rawImg ? getImageUrl(rawImg) : "",
            category: item.category || item.category_name,
            rating: item.rating ?? item.average_rating,
            reviews: item.reviews_count ?? item.reviews,
            location: item.location || item.city,
            price: item.price ?? item.hourly_rate ?? item.starting_price,
            priceLabel: item.price_label,
            verified: item.verified ?? item.is_verified,
            skills: item.skills ?? [],
            link: item.type === "service" ? `/profile/${item.profileId || item.technician_id || item.id}` : `/profile/${item.id}`,
            serviceType: item.serviceType,
          };
        });
        setResults(mapped);
      } catch (e) {
        if (!cancelled) setError((e as Error)?.message || "Search failed");
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = (categoriesData ?? []).map((c: any) => ({
    label: c.name || c.title || c.slug,
    slug: (c.slug || c.name || "").toString().toLowerCase(),
  }));

  const filteredByTab = useMemo(() => {
    if (activeTab === "all") return results;
    return results.filter((r) => r.type === activeTab);
  }, [results, activeTab]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container} style={{ paddingTop: 24, paddingBottom: 0 }}>
        <form className={styles.searchBar} style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} role="search" onSubmit={submitSearch}>
          <label className={styles.searchField}>
            <span className={styles.iconWrap} aria-hidden="true">
              <iconify-icon icon="lucide:search" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
          </label>
          <label className={styles.searchField}>
            <span className={styles.iconWrap} aria-hidden="true">
              <iconify-icon icon="lucide:map-pin" />
            </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
              >
                <option value="Global">Global</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Cameroon">Cameroon</option>
              </select>
          </label>
          <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
            {t.btnSearch}
          </button>
        </form>
      </div>

      <main className={`${styles.container} ${styles.main}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h1 className={styles.filterTitle}>{t.filtersTitle}</h1>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setActiveCategory("any");
                setActiveType("any");
                setActiveRating("");
                setQuery("");
                setLocation("");
                setBudgetMin("");
                setBudgetMax("");
                setPage(1);
              }}
            >
              {t.clearAll}
            </button>
          </div>

          <section className={styles.filterSection} aria-labelledby="service-category-title">
            <h2 id="service-category-title" className={styles.sectionTitle}>
              {t.serviceCat}
            </h2>
            <div className={styles.optionList}>
              <button
                type="button"
                className={`${styles.optionItem} ${activeCategory === "any" ? styles.optionItemActive : ""}`}
                aria-pressed={activeCategory === "any"}
                onClick={() => setActiveCategory("any")}
              >
                <span className={styles.checkboxBox} aria-hidden="true">
                  <iconify-icon icon="lucide:check" />
                </span>
                <span className={styles.optionLabel}>
                  {t.allCats}
                </span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  className={`${styles.optionItem} ${activeCategory === category.slug ? styles.optionItemActive : ""}`}
                  aria-pressed={activeCategory === category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  <span className={styles.checkboxBox} aria-hidden="true">
                    <iconify-icon icon="lucide:check" />
                  </span>
                  <span className={styles.optionLabel}>{category.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.filterSection} aria-labelledby="budget-title">
            <h2 id="budget-title" className={styles.sectionTitle}>
              {t.budgetTitle}
            </h2>
            <div className={styles.budgetGrid}>
              <label className={styles.budgetField}>
                <span>{t.min}</span>
                <input
                  className={styles.inputFake}
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="0"
                  aria-label="Minimum budget"
                />
              </label>
              <label className={styles.budgetField}>
                <span>{t.max}</span>
                <input
                  className={styles.inputFake}
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max"
                  aria-label="Maximum budget"
                />
              </label>
            </div>
          </section>

          <section className={styles.filterSection} aria-labelledby="professional-type-title">
            <h2 id="professional-type-title" className={styles.sectionTitle}>
              {t.proTypeTitle}
            </h2>
            <div className={styles.optionList}>
              {professionalTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionItem} ${activeType === option.value ? styles.optionItemActive : ""}`}
                  aria-pressed={activeType === option.value}
                  onClick={() => setActiveType(option.value)}
                >
                  <span className={styles.radioCircle} aria-hidden="true" />
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.filterSection} aria-labelledby="rating-title">
            <h2 id="rating-title" className={styles.sectionTitle}>
              {t.minRatingTitle}
            </h2>
            <div className={styles.optionList}>
              <button
                type="button"
                className={`${styles.optionItem} ${activeRating === "" ? styles.optionItemActive : ""}`}
                aria-pressed={activeRating === ""}
                onClick={() => setActiveRating("")}
              >
                <span className={styles.radioCircle} aria-hidden="true" />
                <span className={styles.optionLabel}>{t.anyRating}</span>
              </button>
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  type="button"
                  className={`${styles.optionItem} ${activeRating === rating.value ? styles.optionItemActive : ""}`}
                  aria-pressed={activeRating === rating.value}
                  onClick={() => setActiveRating(rating.value)}
                >
                  <span className={styles.radioCircle} aria-hidden="true" />
                  <span className={styles.optionLabel}>
                    <iconify-icon icon="lucide:star" className={styles.starIcon} />
                    {rating.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className={styles.resultsArea}>
          <div className={styles.resultsTopBar}>
            <div className={styles.tabs} role="tablist" aria-label="Result categories">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label} (
                  {activeTab === tab.value ? filteredByTab.length : results.filter((r) => tab.value === "all" ? true : r.type === tab.value).length}
                  )
                </button>
              ))}
            </div>

            <label className={styles.sortBy}>
              <span>{t.sortBy}</span>
              <select
                aria-label="Sort results"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">{t.sortRelevance}</option>
                <option value="highest">{t.sortHighest}</option>
                <option value="lowest">{t.sortLowest}</option>
              </select>
            </label>
          </div>

          <div className={styles.resultsList}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : error ? (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#ef4444" }}>
                <p>{error}</p>
              </div>
            ) : filteredByTab.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{t.noResults}</p>
              </div>
            ) : (
              filteredByTab.map((result, idx) => (
                <article key={`${result.type}-${result.id}-${idx}`} className={styles.resultCard}>
                  <CardMedia result={result} />

                  <div className={styles.resultBody}>
                    <div className={styles.resultTitleRow}>
                      <h2 className={styles.resultName} title={result.name}>{result.name}</h2>
                      {result.verified ? (
                        <span
                          className={`${styles.badge} ${result.type === "company" ? styles.companyBadge : styles.verifiedBadge}`}
                        >
                          <iconify-icon
                            icon={result.type === "company" ? "lucide:building-2" : "lucide:shield-check"}
                          />
                          {result.type === "company" ? t.verifiedComp : t.verified}
                        </span>
                      ) : null}
                    </div>

                    <p className={styles.resultRole}>
                      {result.role || result.category || (result.type === "company" ? (lang === "fr" ? "Entreprise Agréée" : "Registered Enterprise") : (lang === "fr" ? "Spécialiste Certifié" : "Certified Specialist"))}
                    </p>

                    <div className={styles.chips}>
                      {result.skills && result.skills.length > 0 ? (
                        result.skills.slice(0, 2).map((chip) => (
                          <span key={chip} className={styles.chip} title={chip}>
                            {chip}
                          </span>
                        ))
                      ) : (
                        <span className={styles.chip}>
                          {result.category || (result.type === "company" ? "General Contracting" : "Technical Services")}
                        </span>
                      )}
                      {result.skills && result.skills.length > 2 && (
                        <span className={styles.chip} style={{ color: "#ff4500", background: "rgba(255,69,0,0.08)" }}>
                          +{result.skills.length - 2}
                        </span>
                      )}
                    </div>

                    <p className={styles.resultDescription} title={result.description || ""}>
                      {result.description || (result.type === "company" 
                        ? (lang === "fr" ? "Entreprise agréée disponible pour les appels d'offres et chantiers." : "Verified enterprise contractor available for tenders and projects.")
                        : (lang === "fr" ? "Professionnel qualifié disponible pour interventions et missions." : "Certified technical professional available for dispatch and tasks."))}
                    </p>

                    <div className={styles.metaRow}>
                      <span className={styles.metaItem} title={result.location || "Benin"}>
                        <iconify-icon icon="lucide:map-pin" />
                        {result.location || "Benin"}
                      </span>
                      <span className={`${styles.metaItem} ${styles.metaRating}`}>
                        <iconify-icon icon="lucide:star" className={styles.starIcon} />
                        {result.rating != null && Number(result.rating) > 0 ? Number(result.rating).toFixed(1) : "5.0"}
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginLeft: 2 }}>
                          {result.reviews != null && Number(result.reviews) > 0 ? `(${result.reviews})` : "(0)"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className={styles.resultActions}>
                    <Link
                      href={`/profile/${result.id}`}
                      className={`${styles.button} ${styles.buttonSecondary} ${styles.actionButton}`}
                    >
                      {t.viewProfile}
                    </Link>
                    {currentUserId && String(currentUserId) === String(result.id) ? (
                      <Link
                        href={result.type === "company" ? "/dashboard/company/profile" : "/dashboard/technician/profile"}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                        style={{ background: "#001f3f", borderColor: "#001f3f" }}
                      >
                        Edit Profile
                      </Link>
                    ) : result.type === "company" ? (
                      <Link
                        href={`/post-task?invite_company=${result.id}&company_name=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        {t.requestQuote}
                      </Link>
                    ) : result.type === "technician" ? (
                      <Link
                        href={`/post-task?invite=${result.id}&specialist_name=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        {t.hireSpecialist}
                      </Link>
                    ) : (
                      <Link
                        href={`/post-task?service=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        {t.requestService}
                      </Link>
                    )}
                  </div>

                </article>
              ))
            )}
          </div>

          {!loading && filteredByTab.length > 0 && (
            <nav className={styles.pagination} aria-label="Pagination">
              <button
                type="button"
                className={`${styles.pageButton} ${page === 1 ? styles.pageButtonDisabled : ""}`}
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <iconify-icon icon="lucide:chevron-left" />
                {t.previous}
              </button>
              <div className={styles.pageNumbers}>
                <button
                  type="button"
                  className={`${styles.pageNumber} ${page === 1 ? styles.pageNumberActive : ""}`}
                  onClick={() => setPage(1)}
                >
                  1
                </button>
              </div>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => setPage((p) => p + 1)}
              >
                {t.next}
                <iconify-icon icon="lucide:chevron-right" />
              </button>
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );

}
