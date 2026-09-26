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
import { mergeWithMasterCategories } from "../lib/categories";
import { resolveProfessionTitle, resolveServiceCategoryTag, resolveProfessionalBio, resolveCleanLocation } from "../lib/professionUtils";

function CardMedia({ result }: { result: SearchResult }) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);
  const initials = (result.name || "B")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const showCover = Boolean(result.cover_image && !hasCoverError);

  return (
    <div className={styles.cardHeaderArea}>
      <div className={styles.cardCoverBanner}>
        {showCover ? (
          <>
            <img
              src={result.cover_image}
              alt=""
              className={styles.coverImg}
              onError={() => setHasCoverError(true)}
            />
            <div className={styles.coverOverlay} />
          </>
        ) : result.type === "company" ? (
          <div className={styles.bannerCompanyPattern} />
        ) : (
          <div className={styles.bannerTechPattern} />
        )}
      </div>

      <div className={styles.avatarBadgeWrapper}>
        <div className={styles.avatarBadge}>
          {result.image && !hasAvatarError ? (
            <img
              src={result.image}
              alt={result.name}
              className={styles.avatarImg}
              onError={() => setHasAvatarError(true)}
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
  cover_image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  location?: string;
  price?: number | string;
  priceLabel?: string;
  verified?: boolean;
  skills?: string[];
  services?: any[];
  link?: string;
  serviceType?: string;
  username?: string;
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

      const tabParam = urlParams.get("tab") || urlParams.get("type");
      if (tabParam) {
        const clean = tabParam.toLowerCase().replace(/s$/, ""); // 'technicians' -> 'technician', 'companies' -> 'company'
        if (clean === "technician" || clean === "company" || clean === "service") {
          setActiveTab(clean);
          setActiveType(clean);
        }
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
    if (activeRating) params.min_rating = activeRating;
    if (sortBy) params.sort = sortBy;
    if (budgetMin) params.budget_min = budgetMin;
    if (budgetMax) params.budget_max = budgetMax;
    return params;
  }, [query, location, activeCategory, activeRating, sortBy, budgetMin, budgetMax]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        let rawSearch: any[] = [];
        let rawCompaniesList: any[] = [];
        let rawCompanyUsersList: any[] = [];

        const [searchRes, companiesRes, companyUsersRes] = await Promise.allSettled([
          api.search(searchParams),
          api.listCompanies({ all_status: "true" }),
          api.listUsers({ role: "company" }),
        ]);

        if (searchRes.status === "fulfilled") {
          const v = searchRes.value;
          rawSearch = (Array.isArray(v) ? v : v?.results ?? []) as any[];
        } else {
          try {
            const fallbackTechs = await api.listUsers({ role: "TECHNICIAN" });
            rawSearch = (Array.isArray(fallbackTechs) ? fallbackTechs : (fallbackTechs as any)?.results || []).map((t: any) => ({ ...t, type: "technician" }));
          } catch {
            rawSearch = [];
          }
        }

        if (companiesRes.status === "fulfilled") {
          const cVal = companiesRes.value;
          rawCompaniesList = (Array.isArray(cVal) ? cVal : (cVal as any)?.results ?? []) as any[];
        }

        if (companyUsersRes.status === "fulfilled") {
          const uVal = companyUsersRes.value;
          rawCompanyUsersList = (Array.isArray(uVal) ? uVal : (uVal as any)?.results ?? []) as any[];
        }

        if (cancelled) return;

        const seenCompanyIds = new Set<string | number>();
        const mappedCompanies: SearchResult[] = [];

        // 1. Map registered companies from listCompanies
        for (const item of rawCompaniesList) {
          const isApproved = Boolean(
            item.is_verified === true ||
            item.verified === true ||
            item.is_approved === true ||
            item.user?.is_verified === true ||
            item.user?.is_approved === true ||
            item.status === "active" ||
            item.is_active !== false
          );
          if (item.status === "suspended" || item.user?.is_active === false) continue;
          if (!isApproved && item.status !== "active") continue;

          const compId = item.id;
          const compUserId = item.user?.id || item.user_id;
          if (seenCompanyIds.has(compId) || (compUserId && seenCompanyIds.has(`user-${compUserId}`))) continue;
          seenCompanyIds.add(compId);
          if (compUserId) seenCompanyIds.add(`user-${compUserId}`);

          const compName = item.company_name || item.name || `${item.user?.first_name || ""} ${item.user?.last_name || ""}`.trim() || "Corporate Enterprise";
          const rawImg = item.logo_url || item.logo || item.image || item.avatar_url || item.avatar || item.user?.avatar_url;
          const rawCover = item.cover_url || item.banner_url || item.banner || item.cover_image || item.cover || item.user?.banner_url;
          const role = item.tagline || item.company_type || resolveProfessionTitle(item, lang) || (lang === "fr" ? "Entreprise & Bureau d'Ingénierie" : "Registered Contracting Company");
          const category = resolveServiceCategoryTag({ ...item, role }, lang);
          const cleanLoc = resolveCleanLocation(item);
          const compUsername = item.username || item.user?.username || (item.handle ? String(item.handle).replace(/^@/, "") : undefined);
          const link = compUsername
            ? `/profile/@${compUsername.replace(/^@/, "")}?type=company`
            : `/profile/${compId}?type=company`;

          const rating = parseFloat(item.average_rating || item.rating) || 5.0;
          const reviews = item.review_count ?? item.reviews_count ?? item.reviews ?? 0;
          const services = Array.isArray(item.services_offered)
            ? item.services_offered.map((s: any) => typeof s === "string" ? { title: s } : s)
            : (item.services || []);

          mappedCompanies.push({
            id: compId,
            type: "company",
            name: compName,
            role: role,
            description: item.about || item.description || resolveProfessionalBio(item, lang),
            image: rawImg ? getImageUrl(rawImg) : "",
            cover_image: rawCover ? getImageUrl(rawCover) : "",
            category: category,
            rating: rating,
            reviews: reviews,
            location: cleanLoc,
            price: item.price ?? item.starting_price,
            priceLabel: item.price_label,
            verified: Boolean(item.is_verified || item.verified || item.is_approved || item.user?.is_verified || item.user?.is_approved),
            skills: Array.isArray(item.services_offered) ? item.services_offered.filter((s: any) => typeof s === "string") : (item.skills ?? []),
            services: services,
            link: link,
            username: compUsername,
          });
        }

        // 2. Map company users (if not already added)
        for (const item of rawCompanyUsersList) {
          const compId = item.company_profile?.id || item.id;
          const compUserId = item.id;
          if (seenCompanyIds.has(compId) || seenCompanyIds.has(`user-${compUserId}`)) continue;
          seenCompanyIds.add(compId);
          seenCompanyIds.add(`user-${compUserId}`);

          const isApproved = Boolean(
            item.is_verified === true ||
            item.verified === true ||
            item.is_approved === true ||
            item.company_profile?.is_verified === true ||
            item.company_profile?.is_approved === true ||
            item.is_active !== false
          );
          if (item.status === "suspended" || item.is_active === false) continue;

          const compName = item.company_profile?.company_name || item.company_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.username || "Corporate Enterprise";
          const rawImg = item.company_profile?.logo_url || item.avatar_url || item.avatar;
          const rawCover = item.company_profile?.cover_url || item.cover_url || item.banner_url || item.banner;
          const role = item.company_profile?.tagline || item.company_profile?.company_type || resolveProfessionTitle(item, lang) || (lang === "fr" ? "Entreprise & Bureau d'Ingénierie" : "Registered Contracting Company");
          const category = resolveServiceCategoryTag({ ...item, role }, lang);
          const cleanLoc = resolveCleanLocation(item);
          const compUsername = item.username || (item.handle ? String(item.handle).replace(/^@/, "") : undefined);
          const link = compUsername
            ? `/profile/@${compUsername.replace(/^@/, "")}?type=company`
            : `/profile/${compId}?type=company`;

          mappedCompanies.push({
            id: compId,
            type: "company",
            name: compName,
            role: role,
            description: item.company_profile?.about || item.bio || resolveProfessionalBio(item, lang),
            image: rawImg ? getImageUrl(rawImg) : "",
            cover_image: rawCover ? getImageUrl(rawCover) : "",
            category: category,
            rating: parseFloat(item.rating || item.average_rating) || 5.0,
            reviews: item.reviews_count ?? item.reviews ?? 0,
            location: cleanLoc,
            price: item.hourly_rate ?? item.starting_price,
            verified: Boolean(item.is_verified || item.company_profile?.is_verified || item.is_approved),
            skills: item.skills || [],
            services: item.services || [],
            link: link,
            username: compUsername,
          });
        }

        // 3. Map search results (technicians / services)
        const mappedSearch: SearchResult[] = rawSearch
          .filter((item) => item.type !== "task")
          .filter((item) => {
            const isApproved = Boolean(
              item.is_verified === true ||
              item.verified === true ||
              item.is_approved === true ||
              item.user?.is_verified === true ||
              item.company_profile?.is_verified === true ||
              item.technician_profile?.is_verified === true ||
              item.is_active !== false
            );
            return isApproved && item.is_active !== false && item.status !== "suspended";
          })
          .map((item) => {
            const rawImg = item.avatar_url || item.avatar || item.logo_url || item.image || item.company_profile?.logo || item.technician_profile?.avatar;
            const rawCover = item.cover_image || item.cover_url || item.banner_url || item.banner || item.cover || item.company_profile?.cover_url || item.company_profile?.banner_url || item.company_profile?.cover_image || item.technician_profile?.banner_url || item.user?.banner_url;
            const role = resolveProfessionTitle(item, lang);
            const category = resolveServiceCategoryTag({ ...item, role }, lang);
            const cleanLoc = resolveCleanLocation(item);
            const itemType = item.type || (item.role === "company" ? "company" : item.type === "service" ? "service" : "technician");
            return {
              id: item.id,
              type: itemType,
              name: item.name || item.full_name || item.company_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || "",
              role: role,
              description: resolveProfessionalBio(item, lang),
              image: rawImg ? getImageUrl(rawImg) : "",
              cover_image: rawCover ? getImageUrl(rawCover) : "",
              category: category,
              rating: item.rating ?? item.average_rating,
              reviews: item.reviews_count ?? item.reviews,
              location: cleanLoc,
              price: item.price ?? item.hourly_rate ?? item.starting_price,
              priceLabel: item.price_label,
              verified: item.verified ?? item.is_verified,
              skills: item.skills ?? [],
              services: item.services || item.profile?.services || [],
              link: itemType === "service" ? `/profile/${item.profileId || item.technician_id || item.id}` : (item.username ? `/profile/@${item.username.replace(/^@/, '')}` : `/profile/${item.id}`),
              serviceType: item.serviceType,
              username: item.username || item.user?.username || (item.handle ? String(item.handle).replace(/^@/, '') : undefined),
            };
          });

        // Combine technicians and companies without duplicates
        const combined = [...mappedSearch.filter(s => s.type !== "company"), ...mappedCompanies, ...mappedSearch.filter(s => s.type === "company" && !seenCompanyIds.has(s.id))];
        setResults(combined);
      } catch (e) {
        if (!cancelled) setError(null);
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams, lang]);

  const categories = mergeWithMasterCategories(categoriesData).map((c) => ({
    label: c.name,
    slug: (c.slug || c.name || "").toString().toLowerCase(),
  }));

  const baseFilteredResults = useMemo(() => {
    let list = results;

    // Client-side text search query matching
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((r) => {
        const nameStr = (r.name || "").toLowerCase();
        const roleStr = (r.role || "").toLowerCase();
        const catStr = (r.category || "").toLowerCase();
        const descStr = (r.description || "").toLowerCase();
        const skillsStr = (r.skills || []).join(" ").toLowerCase();
        const servicesStr = (r.services || []).map((s: any) => s.title || "").join(" ").toLowerCase();
        const locStr = (r.location || "").toLowerCase();
        return nameStr.includes(q) ||
               roleStr.includes(q) ||
               catStr.includes(q) ||
               descStr.includes(q) ||
               skillsStr.includes(q) ||
               servicesStr.includes(q) ||
               locStr.includes(q);
      });
    }

    // Client-side category matching fallback
    if (activeCategory && activeCategory !== "any") {
      const catSlug = activeCategory.toLowerCase();
      const catQuery = catSlug.replace(/[-_]/g, " ");
      list = list.filter((r) => {
        const catStr = (r.category || "").toLowerCase();
        const roleStr = (r.role || "").toLowerCase();
        const skillsStr = (r.skills || []).join(" ").toLowerCase();
        const servicesStr = (r.services || []).map((s: any) => s.title || "").join(" ").toLowerCase();
        const descStr = (r.description || "").toLowerCase();
        const full = `${catStr} ${roleStr} ${skillsStr} ${servicesStr} ${descStr}`;
        
        // Exact slug or word match
        if (full.includes(catSlug) || full.includes(catQuery)) return true;
        const keywords = catQuery.split(" ").filter((w: string) => w.length > 2);
        return keywords.some((kw: string) => full.includes(kw));
      });
    }

    // Client-side location matching fallback
    if (location && !["global", "all locations", "any", "toutes les localisations"].includes(location.toLowerCase().trim())) {
      const locQuery = location.toLowerCase().trim();
      list = list.filter((r) => {
        const rLoc = (r.location || "").toLowerCase();
        return rLoc.includes(locQuery) || locQuery.includes(rLoc);
      });
    }

    // Client-side rating filter
    if (activeRating) {
      const minR = parseFloat(activeRating);
      list = list.filter((r) => (r.rating || 0) >= minR);
    }

    // Client-side budget filter
    if (budgetMin) {
      const minB = parseFloat(budgetMin);
      list = list.filter((r) => {
        if (!r.price) return true;
        const numPrice = typeof r.price === "number" ? r.price : parseFloat(String(r.price).replace(/[^0-9.]/g, ""));
        return isNaN(numPrice) || numPrice >= minB;
      });
    }
    if (budgetMax) {
      const maxB = parseFloat(budgetMax);
      list = list.filter((r) => {
        if (!r.price) return true;
        const numPrice = typeof r.price === "number" ? r.price : parseFloat(String(r.price).replace(/[^0-9.]/g, ""));
        return isNaN(numPrice) || numPrice <= maxB;
      });
    }

    // Client-side sorting
    if (sortBy === "highest") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
      list = [...list].sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price || "").replace(/[^0-9.]/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price || "").replace(/[^0-9.]/g, "")) || 0;
        return priceA - priceB;
      });
    }

    return list;
  }, [results, query, activeCategory, location, activeRating, budgetMin, budgetMax, sortBy]);

  const tabCounts = useMemo(() => {
    return {
      all: baseFilteredResults.length,
      service: baseFilteredResults.filter((r) => r.type === "service").length,
      technician: baseFilteredResults.filter((r) => r.type === "technician").length,
      company: baseFilteredResults.filter((r) => r.type === "company").length,
    };
  }, [baseFilteredResults]);

  const filteredByTab = useMemo(() => {
    if (activeTab === "all") return baseFilteredResults;
    return baseFilteredResults.filter((r) => r.type === activeTab);
  }, [baseFilteredResults, activeTab]);

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
            <input
              list="search-locations-list"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, region, or Global"
              aria-label="Location"
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
            />
            <datalist id="search-locations-list">
              <option value="Global" />
              <option value="Bonamoussadi, Douala" />
              <option value="Douala, Cameroon" />
              <option value="Yaoundé, Cameroon" />
              <option value="Cameroon" />
              <option value="Kigali, Rwanda" />
              <option value="Rwanda" />
              <option value="Lagos, Nigeria" />
              <option value="Abuja, Nigeria" />
              <option value="Nigeria" />
              <option value="Nairobi, Kenya" />
              <option value="Kenya" />
              <option value="Accra, Ghana" />
              <option value="Ghana" />
              <option value="Abidjan, Ivory Coast" />
              <option value="Ivory Coast" />
              <option value="Johannesburg, South Africa" />
              <option value="Cape Town, South Africa" />
              <option value="South Africa" />
              <option value="Benin" />
            </datalist>
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
                  onClick={() => {
                    setActiveType(option.value);
                    if (option.value === "technician" || option.value === "company") {
                      setActiveTab(option.value);
                    } else if (option.value === "any" && (activeTab === "technician" || activeTab === "company")) {
                      setActiveTab("all");
                    }
                  }}
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
              {tabs.map((tab) => {
                const count = tabCounts[tab.value as keyof typeof tabCounts] ?? 0;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.value}
                    className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
                    onClick={() => {
                      setActiveTab(tab.value);
                      if (tab.value === "technician" || tab.value === "company") {
                        setActiveType(tab.value);
                      } else {
                        setActiveType("any");
                      }
                    }}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
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
            ) : filteredByTab.length === 0 ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:search-x" style={{ fontSize: "40px", color: "#94a3b8", marginBottom: "10px", display: "inline-block" }} />
                <p style={{ margin: "0 0 14px", fontSize: "14.5px" }}>{t.noResults}</p>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => {
                    setQuery("");
                    setLocation("");
                    setActiveCategory("any");
                    setActiveRating("");
                    setActiveTab("all");
                    setActiveType("any");
                  }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "0 auto", padding: "8px 18px", borderRadius: "10px", border: "1.5px solid #cbd5e1", background: "#ffffff", color: "#001f3f", fontWeight: 700, cursor: "pointer" }}
                >
                  <iconify-icon icon="lucide:rotate-ccw" />
                  {t.clearAll}
                </button>
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
                      {result.services && result.services.length > 0 ? (
                        result.services.slice(0, 3).map((srv: any, sIdx: number) => (
                          <span key={srv.id || sIdx} className={styles.chip} title={srv.description || srv.title} style={{ color: "#001f3f", background: "#f0fdf4", border: "1px solid #bbf7d0", fontWeight: 700 }}>
                            <iconify-icon icon="lucide:wrench" style={{ color: "#16a34a", fontSize: "12px", marginRight: "3px" }} />
                            {srv.title}
                          </span>
                        ))
                      ) : result.skills && result.skills.length > 0 ? (
                        result.skills.slice(0, 3).map((chip) => (
                          <span key={chip} className={styles.chip} title={chip}>
                            {chip}
                          </span>
                        ))
                      ) : (
                        <span className={styles.chip}>
                          {result.category || (result.type === "company" ? "General Contracting" : "Technical Services")}
                        </span>
                      )}
                      {result.services && result.services.length > 3 ? (
                        <span className={styles.chip} style={{ color: "#ff4500", background: "rgba(255,69,0,0.08)", fontWeight: 700 }}>
                          +{result.services.length - 3}
                        </span>
                      ) : result.skills && result.skills.length > 3 ? (
                        <span className={styles.chip} style={{ color: "#ff4500", background: "rgba(255,69,0,0.08)", fontWeight: 700 }}>
                          +{result.skills.length - 3}
                        </span>
                      ) : null}
                    </div>

                    {result.services && result.services.length > 0 && (
                      <div style={{ margin: "6px 0 10px 0", background: "#f8fafc", padding: "8px 10px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {lang === "fr" ? "Services proposés" : "Services Offered"} ({result.services.length})
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {result.services.slice(0, 2).map((srv: any, sIdx: number) => (
                            <div key={srv.id || sIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "#1e293b" }}>
                              <span style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                                <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a", fontSize: "12px", flexShrink: 0 }} />
                                {srv.title}
                              </span>
                              {srv.pricing_min ? (
                                <span style={{ fontWeight: 700, color: "#ff4500", fontSize: "11px", flexShrink: 0 }}>
                                  {formatXOF(srv.pricing_min)}
                                </span>
                              ) : srv.pricing_model ? (
                                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "capitalize", flexShrink: 0 }}>
                                  {srv.pricing_model}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                      href={result.username 
                        ? `/profile/@${result.username.replace(/^@/, '')}${result.type === "company" ? "?type=company" : ""}`
                        : (result.type === "company" ? `/profile/${result.id}?type=company` : `/profile/${result.id}`)
                      }
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
