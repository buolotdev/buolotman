"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ProviderBoard.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";

export default function ProviderBoard() {
  const { data, loading, error } = useFetch(() => api.listUsers({ role: "TECHNICIAN" }), []);
  
  // Safe extraction (data could be array or { results: array })
  const providers = Array.isArray(data) ? data : ((data as any)?.results || []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        
        {/* HEADER SECTION */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Boulot Man connects clients with verified technicians and engineers — securely and efficiently.
          </h2>
          <p className={styles.headerSubtitle}>
            Browse our directory of top-rated service providers ready to tackle your projects.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <input type="text" placeholder="Search by name, skill, or keyword..." />
          <select>
            <option>All Categories</option>
            <option>Engineering & IT</option>
            <option>Construction</option>
            <option>Handyman Services</option>
          </select>
          <select>
            <option>Any Location</option>
            <option>Kigali</option>
            <option>Remote</option>
          </select>
          <button className={styles.searchBtn}>Find Pros</button>
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
        ) : providers.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>No providers found.</p>
        ) : (
          <div className={styles.grid}>
            {providers.map((pro: any) => (
              <div key={pro.id} className={styles.card}>
                <div className={styles.profile}>
                  <img src={pro.avatar_url || `https://i.pravatar.cc/150?img=${(pro.id % 70) + 1}`} alt={pro.first_name || pro.username} className={styles.avatar} />
                  <div>
                    <h3 className={styles.name}>{pro.first_name ? `${pro.first_name} ${pro.last_name || ""}`.trim() : (pro.username || "Provider")}</h3>
                    <div className={styles.role}>{pro.category || "Technician"}</div>
                  </div>
                </div>
                
                <div className={styles.rating}>
                  <span className={styles.stars}>★★★★★</span>
                  <span>(4.8)</span>
                </div>
                
                <div className={styles.meta}>
                  <iconify-icon icon="lucide:map-pin"></iconify-icon>
                  {pro.location || pro.country || "Kigali, Rwanda"} &bull; {pro.distance || "3.1 miles away"}
                </div>
                
                <div className={styles.description}>
                  {pro.bio || "Certified technician ready to help with your next project."}
                </div>
                
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.btnView}`}>View Profile</button>
                  <button className={`${styles.btn} ${styles.btnHire}`}>Hire Now</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
        </div>

      </div>
    </div>
  );
}
