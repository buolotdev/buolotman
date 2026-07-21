"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "../components/skeleton/Skeleton";
import { formatXOF } from "../lib/format";
import styles from "./search.module.css";

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

  const searchParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (location) params.location = location;
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
        const mapped: SearchResult[] = raw.map((item) => ({
          id: item.id,
          type: item.type || (item.role === "company" ? "company" : item.type === "service" ? "service" : "technician"),
          name: item.name || item.full_name || item.company_name || "",
          role: item.role || item.specialty || item.title,
          description: item.description || item.bio,
          image: item.image || item.avatar_url || item.avatar,
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
        }));
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
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerGrid}>
            <Link href="/" className={styles.brand} aria-label="Boulot Man home">
              <Image
                src="/boulotman-logo.png"
                alt="Boulot Man"
                width={168}
                height={42}
                className={styles.brandImage}
                priority
              />
            </Link>

            <div className={styles.mobileProfile} aria-hidden="true">
              <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} />
            </div>

            <form className={styles.searchBar} role="search" onSubmit={submitSearch}>
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
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  aria-label="Location"
                />
              </label>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                Search
              </button>
            </form>

            <div className={styles.headerActions}>
              <Link href="/post-task" className={`${styles.button} ${styles.buttonSecondary}`}>
                Post a job
              </Link>
              <div className={styles.avatar} aria-hidden="true">
                <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} />
              </div>
            </div>
          </div>
        </div>
      </header>

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
              filteredByTab.map((result) => (
                <article key={result.id} className={styles.resultCard}>
                  <div className={styles.resultMedia}>
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.name}
                        fill
                        sizes="160px"
                        className={styles.resultImage}
                      />
                    ) : (
                      <div
                        className={`${styles.companyPlaceholder} ${styles.companyPlaceholderPrimary}`}
                        aria-hidden="true"
                      >
                        <iconify-icon icon={result.type === "company" ? "lucide:building-2" : "lucide:user"} />
                      </div>
                    )}
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
                      href={result.link || `/profile/${result.id}`}
                      className={`${styles.button} ${styles.buttonSecondary} ${styles.actionButton}`}
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonPrimary} ${styles.actionButton}`}
                    >
                      Request Service
                    </button>
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
