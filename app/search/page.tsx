"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import { api, getImageUrl } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import Header from "../components/Header";
import { SkeletonCard } from "../components/skeleton/Skeleton";
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

function SearchResultMedia({ result }: { result: SearchResult }) {
  const [imgError, setImgError] = useState(false);

  if (result.image && !imgError) {
    return (
      <Image
        src={result.image}
        alt={result.name}
        fill
        unoptimized
        sizes="280px"
        className={styles.resultImage}
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = (result.name || "B")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={styles.companyPlaceholder}
      style={{
        background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "#ff4500",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "20px",
          boxShadow: "0 6px 16px rgba(255, 69, 0, 0.35)",
        }}
      >
        {initials || <iconify-icon icon={result.type === "company" ? "lucide:building-2" : "lucide:user"} />}
      </div>
      <span
        style={{
          color: "rgba(255, 255, 255, 0.75)",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {result.type === "company" ? "Company" : result.type === "service" ? "Service" : "Technician"}
      </span>
    </div>
  );
}

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
      api
        .getMe()
        .then((user) => {
          const initials = `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase();
          setUserInitials(initials || user.username?.[0]?.toUpperCase() || "U");
        })
        .catch(() => {
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
      const q = urlParams.get("q");
      const loc = urlParams.get("location");
      const cat = urlParams.get("category");
      const type = urlParams.get("type");
      const tab = urlParams.get("tab");
      const minP = urlParams.get("budget_min");
      const maxP = urlParams.get("budget_max");

      if (q) setQuery(q);
      if (loc) setLocation(loc);
      if (cat) setActiveCategory(cat);
      if (type) {
        if (type === "company" || type === "technician") {
          setActiveType(type);
          setActiveTab(type);
        } else {
          setActiveType(type);
        }
      }
      if (tab) setActiveTab(tab);
      if (minP) setBudgetMin(minP);
      if (maxP) setBudgetMax(maxP);
    }
  }, []);

  const searchParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (
      location &&
      location.toLowerCase() !== "global" &&
      location.toLowerCase() !== "all locations" &&
      location.toLowerCase() !== "any"
    ) {
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
          const cleanImg = rawImg ? getImageUrl(rawImg) : "";
          return {
            id: item.id,
            type: item.type || (item.role === "company" ? "company" : item.type === "service" ? "service" : "technician"),
            name: item.name || item.full_name || item.company_name || "",
            role: item.role || item.specialty || item.title,
            description: item.description || item.bio,
            image: cleanImg,
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
        <form
          className={styles.searchBar}
          style={{ maxWidth: 800, margin: "0 auto", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          role="search"
          onSubmit={submitSearch}
        >
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
              style={{ width: "100%", border: "none", background: "transparent", outline: "none" }}
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
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      <main className={styles.main}>
        <aside className={styles.sidebar} aria-label="Filters">
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            <button
              type="button"
              className={styles.clearAll}
              onClick={() => {
                setActiveCategory("any");
                setActiveType("any");
                setActiveRating("");
                setBudgetMin("");
                setBudgetMax("");
              }}
            >
              Clear all
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Service Category</h3>
            <div className={styles.radioList}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="category"
                  value="any"
                  checked={activeCategory === "any"}
                  onChange={() => setActiveCategory("any")}
                />
                <span>All categories</span>
              </label>
              {categories.map((c: any) => (
                <label key={c.slug} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={c.slug}
                    checked={activeCategory === c.slug}
                    onChange={() => setActiveCategory(c.slug)}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Professional Type</h3>
            <div className={styles.radioList}>
              {professionalTypes.map((type) => (
                <label key={type.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="professionalType"
                    value={type.value}
                    checked={activeType === type.value}
                    onChange={() => setActiveType(type.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Rating</h3>
            <div className={styles.radioList}>
              {ratings.map((r) => (
                <label key={r.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="rating"
                    value={r.value}
                    checked={activeRating === r.value}
                    onChange={() => setActiveRating(r.value)}
                  />
                  <span>★ {r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Budget (XOF)</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="number"
                placeholder="Min"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                }}
              />
              <span style={{ color: "#64748b" }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>
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
                  {activeTab === tab.value
                    ? filteredByTab.length
                    : results.filter((r) => (tab.value === "all" ? true : r.type === tab.value)).length}
                  )
                </button>
              ))}
            </div>

            <label className={styles.sortBy}>
              <span>Sort by:</span>
              <select aria-label="Sort results" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                    <SearchResultMedia result={result} />
                  </div>

                  <div className={styles.resultBody}>
                    <div className={styles.resultTitleRow}>
                      <h2 className={styles.resultName}>{result.name}</h2>
                      {result.verified ? (
                        <span
                          className={`${styles.badge} ${
                            result.type === "company" ? styles.companyBadge : styles.verifiedBadge
                          }`}
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

                    {result.description ? <p className={styles.resultBio}>{result.description}</p> : null}

                    <div className={styles.resultMeta}>
                      {result.rating !== undefined && result.rating !== null ? (
                        <span className={styles.metaItem}>
                          <iconify-icon icon="lucide:star" />
                          <strong>{result.rating.toFixed(1)}</strong> ({result.reviews || 0} reviews)
                        </span>
                      ) : null}
                      {result.location ? (
                        <span className={styles.metaItem}>
                          <iconify-icon icon="lucide:map-pin" />
                          {result.location}
                        </span>
                      ) : null}
                      {result.price !== undefined && result.price !== null ? (
                        <span className={styles.metaItem}>
                          <strong>{formatXOF(Number(result.price))}</strong> {result.priceLabel || ""}
                        </span>
                      ) : null}
                    </div>

                    <div className={styles.resultActions}>
                      <Link href={result.link || `/profile/${result.id}`} className={styles.secondaryButton}>
                        View Profile
                      </Link>
                      <Link
                        href={result.type === "service" ? "/post-task" : `/profile/${result.id}`}
                        className={styles.primaryButton}
                      >
                        Request Service
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
