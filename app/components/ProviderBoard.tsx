"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./ProviderBoard.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonCard } from "@/app/components/skeleton/Skeleton";

export default function ProviderBoard() {
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
            Connecting clients with verified technicians and engineers — securely and efficiently.
          </h2>
          <p className={styles.headerSubtitle}>
            Browse our directory of top-rated service providers ready to tackle your projects.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <input 
            type="text" 
            placeholder="Search by name, skill, or keyword..." 
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
            <option value="All Categories">All Categories</option>
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
            <option value="Any Location">Any Location</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Kigali">Kigali</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="Remote">Remote</option>
          </select>
          <button 
            type="button"
            className={styles.searchBtn}
            onClick={() => setCurrentPage(1)}
          >
            Find Pros
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
          <p style={{ textAlign: "center", color: "red", padding: "40px 0" }}>Failed to load providers: {error}</p>
        ) : filteredProviders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            <iconify-icon icon="lucide:user-x" style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "12px" }}></iconify-icon>
            <h3 style={{ fontSize: "18px", color: "#001f3f", margin: "0 0 6px" }}>No Verified Service Providers Found</h3>
            <p style={{ fontSize: "14px", margin: 0 }}>Try adjusting your search query or location filters.</p>
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
                      <div className={styles.role}>{pro.title || pro.category || "Verified Technician"}</div>
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
                    {pro.bio || "Certified technical professional ready to help with your next project."}
                  </div>
                  
                  <div className={styles.actions}>
                    <Link href={profileUrl} className={`${styles.btn} ${styles.btnView}`}>
                      View Profile
                    </Link>
                    <Link href={hireUrl} className={`${styles.btn} ${styles.btnHire}`}>
                      Hire Now
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
