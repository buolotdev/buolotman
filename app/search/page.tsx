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

  if (result.image && !hasError) {
    return (
      <Image
        src={result.image}
        alt={result.name}
        fill
        unoptimized
        sizes="280px"
        className={styles.resultImage}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={`${styles.companyPlaceholder} ${styles.companyPlaceholderPrimary}`}
      aria-hidden="true"
    >
      <iconify-icon icon={result.type === "company" ? "lucide:building-2" : "lucide:user"} />
    </div>
  );
}

const professionalTypes = [
  { value: "any", label: "Any" },
  { value: "technician", label: "Independent Technician" },
  { value: "company", label: "Registered Company" },
];

const ratings = [
  { value: "4.5", label: "4.5 & up" },
  { value: "4.0", label: "4.0 & up" },
  { value: "3.0", label: "3.0 & up" },
];

const tabs = [
  { value: "all", label: "All results" },
  { value: "services", label: "Services" },
  { value: "technician", label: "Technicians" },
  { value: "company", label: "Companies" },
];

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

  const [userInitials, setUserInitials] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setIsAuth(true);
      setUserRole(role || "client");
      api.getMe().then(user => {
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
              placeholder="Service"
              aria-label="Service"
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
            Search
          </button>
        </form>
      </div>

      <main className={`${styles.container} ${styles.main}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h1 className={styles.filterTitle}>Filters</h1>
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
              Clear all
            </button>
          </div>

          <section className={styles.filterSection} aria-labelledby="service-category-title">
            <h2 id="service-category-title" className={styles.sectionTitle}>
              Service Category
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
                  All categories
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
              Budget (XOF)
            </h2>
            <div className={styles.budgetGrid}>
              <label className={styles.budgetField}>
                <span>Min</span>
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
                <span>Max</span>
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
              Professional Type
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
              Minimum Rating
            </h2>
            <div className={styles.optionList}>
              <button
                type="button"
                className={`${styles.optionItem} ${activeRating === "" ? styles.optionItemActive : ""}`}
                aria-pressed={activeRating === ""}
                onClick={() => setActiveRating("")}
              >
                <span className={styles.radioCircle} aria-hidden="true" />
                <span className={styles.optionLabel}>Any rating</span>
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
              <span>Sort by:</span>
              <select
                aria-label="Sort results"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest price</option>
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
                <p>No results found. Try adjusting your filters.</p>
              </div>
            ) : (
              filteredByTab.map((result, idx) => (
                <article key={`${result.type}-${result.id}-${idx}`} className={styles.resultCard}>
                  <div className={styles.resultMedia}>
                    <CardMedia result={result} />
                  </div>

                  <div className={styles.resultBody}>
                    <div className={styles.resultTitleRow}>
                      <h2 className={styles.resultName}>{result.name}</h2>
                      {result.verified ? (
                        <span
                          className={`${styles.badge} ${result.type === "company" ? styles.companyBadge : styles.verifiedBadge}`}
                        >
                          <iconify-icon
                            icon={result.type === "company" ? "lucide:building-2" : "lucide:shield-check"}
                          />
                          {result.type === "company" ? "Verified Company" : "Verified"}
                        </span>
                      ) : null}
                    </div>

                    {result.role ? <p className={styles.resultRole}>{result.role}</p> : null}

                    {result.skills && result.skills.length > 0 ? (
                      <div className={styles.chips}>
                        {result.skills.map((chip) => (
                          <span key={chip} className={styles.chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {result.description ? (
                      <p className={styles.resultDescription}>{result.description}</p>
                    ) : null}

                    <div className={styles.metaRow}>
                      {result.location ? (
                        <span className={styles.metaItem}>
                          <iconify-icon icon="lucide:map-pin" />
                          {result.location}
                        </span>
                      ) : null}
                      {result.rating != null ? (
                        <span className={`${styles.metaItem} ${styles.metaRating}`}>
                          <iconify-icon icon="lucide:star" className={styles.starIcon} />
                          {Number(result.rating).toFixed(1)}
                          {result.reviews != null ? ` (${result.reviews} reviews)` : ""}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.resultActions}>
                    <Link
                      href={result.link || (result.type === "company" ? `/companies/${result.id}` : `/profile/${result.id}`)}
                      className={`${styles.button} ${styles.buttonSecondary} ${styles.actionButton}`}
                    >
                      View Profile
                    </Link>
                    {result.type === "company" ? (
                      <Link
                        href={`/post-task?company_id=${result.id}&company_name=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        Request Quote
                      </Link>
                    ) : result.type === "technician" ? (
                      <Link
                        href={`/post-task?specialist_id=${result.id}&specialist_name=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        Hire Specialist
                      </Link>
                    ) : (
                      <Link
                        href={`/post-task?service=${encodeURIComponent(result.name)}`}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                      >
                        Request Service
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
                Previous
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
                Next
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
