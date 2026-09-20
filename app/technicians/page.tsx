"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import OnlineStatusBadge from "@/app/components/OnlineStatusBadge";
import { mergeWithMasterCategories } from "@/app/lib/categories";
import { resolveProfessionTitle, resolveCleanLocation } from "@/app/lib/professionUtils";

export default function TechniciansPage() {
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { data, loading, error } = useFetch(() => api.listUsers({ role: "TECHNICIAN" }), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);
  
  const categories = mergeWithMasterCategories(categoriesData);

  // Safe extraction (data could be array or { results: array })
  const technicians = Array.isArray(data) ? data : ((data as any)?.results || []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.headerArea}>
        <h1 className={styles.headerTitle}>Find Technicians & Specialists</h1>
        <p className={styles.headerSubtitle}>Discover top-rated professionals near you for all your maintenance and construction needs.</p>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Find electricians, plumbers, engineers around you..." 
          className={styles.searchInput} 
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select 
          className={styles.searchSelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <button className={styles.searchButton}>Search</button>
      </div>

      <div className={styles.container}>
        {loading ? (
          <div className={styles.grid}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red", padding: "40px 0" }}>Failed to load technicians: {error}</p>
        ) : technicians.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>No technicians found.</p>
        ) : (
          <div className={styles.grid}>
            {technicians
              .filter((tech: any) => {
                if (searchKeyword.trim()) {
                  const q = searchKeyword.toLowerCase();
                  const name = `${tech.first_name || ""} ${tech.last_name || ""} ${tech.username || ""}`.toLowerCase();
                  const role = resolveProfessionTitle(tech).toLowerCase();
                  const skills = (tech.skills || []).join(" ").toLowerCase();
                  if (!name.includes(q) && !role.includes(q) && !skills.includes(q)) return false;
                }
                if (selectedCategory !== "all") {
                  const cat = selectedCategory.toLowerCase();
                  const proCat = (tech.category || "").toLowerCase();
                  const role = resolveProfessionTitle(tech).toLowerCase();
                  if (!proCat.includes(cat) && !role.includes(cat)) return false;
                }
                return true;
              })
              .map((tech: any) => {
                const profession = resolveProfessionTitle(tech);
                const fullName = tech.first_name ? `${tech.first_name} ${tech.last_name || ""}`.trim() : (tech.username || "Specialist");
                return (
                  <div key={tech.id} className={styles.card}>
                    <div className={styles.cardImageWrapper}>
                      <img src={tech.avatar_url || `https://i.pravatar.cc/300?img=${(tech.id % 70) + 1}`} alt={fullName} className={styles.cardImage} />
                      <OnlineStatusBadge
                        isOnline={tech.is_online}
                        lastSeenDisplay={tech.last_seen_display}
                        showText={false}
                        size="sm"
                        style={{ position: "absolute", bottom: 2, right: 2 }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                      <h3 className={styles.cardTitle}>{fullName}</h3>
                      <OnlineStatusBadge
                        isOnline={tech.is_online}
                        lastSeenDisplay={tech.last_seen_display}
                        size="sm"
                      />
                    </div>
                    <p className={styles.cardCategory}>{profession}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.rating}>⭐ {tech.average_rating ? Number(tech.average_rating).toFixed(1) : "5.0"}</span> • {resolveCleanLocation(tech)}
                    </div>
                    <div className={styles.cardActions}>
                      <Link href={`/profile/${tech.id}`} className={styles.btnOutline}>View Profile</Link>
                      <Link 
                        href={`/post-task?specialist_id=${tech.id}&specialist_name=${encodeURIComponent(fullName)}`} 
                        className={styles.btnPrimary}
                      >
                        Hire {profession}
                      </Link>
                    </div>

                  </div>
                );
              })}
          </div>
        )}

        <div className={styles.pagination}>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
        </div>
      </div>

      <Footer />

      {/* Profile Modal */}
      {selectedTech && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedTech(null);
        }}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedTech(null)}>×</button>
            
            <div className={styles.profileCover}>
              <img src={selectedTech.avatar_url || `https://i.pravatar.cc/300?img=${(selectedTech.id % 70) + 1}`} alt="Profile" className={styles.profilePic} />
            </div>

            <div className={styles.profileBody}>
              <h2 className={styles.profileName}>{selectedTech.first_name ? `${selectedTech.first_name} ${selectedTech.last_name || ""}`.trim() : (selectedTech.username || "Unknown Technician")}</h2>
              <p className={styles.profileCategory}>{selectedTech.category || "Professional Technician"}</p>
              <p className={styles.profileLocation}>{selectedTech.location || selectedTech.country || "Kigali, Rwanda"}</p>

              <div className={styles.badges}>
                <span className={styles.badge}>Expert</span>
                {Boolean(selectedTech.is_verified || selectedTech.technician_profile?.is_verified) ? (
                  <span className={styles.badge} style={{ background: "rgba(22, 163, 74, 0.15)", color: "#16a34a" }}>Verified ✓</span>
                ) : (
                  <span className={styles.badge} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>Pending Review</span>
                )}
              </div>

              <p className={styles.profileBio}>{selectedTech.bio || "Certified technician with extensive experience delivering quality services across residential and commercial projects."}</p>

              <h3 className={styles.sectionTitle}>Past Works</h3>
              <div className={styles.worksGrid}>
                <div style={{ background: "#001f3f", borderRadius: 10, padding: 16, color: "#fff", display: "flex", flexDirection: "column", gap: 4 }}>
                  <strong style={{ fontSize: 13 }}>System Installation</strong>
                  <span style={{ fontSize: 11, color: "#4ade80" }}>Verified Project ✓</span>
                </div>
                <div style={{ background: "#1e3a8a", borderRadius: 10, padding: 16, color: "#fff", display: "flex", flexDirection: "column", gap: 4 }}>
                  <strong style={{ fontSize: 13 }}>Diagnostic Inspection</strong>
                  <span style={{ fontSize: 11, color: "#4ade80" }}>Completed on Schedule ✓</span>
                </div>
              </div>

              <h3 className={styles.sectionTitle}>Reviews</h3>
              <div className={styles.reviewsList}>
                <div className={styles.reviewItem}>
                  <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className={styles.reviewAvatar} />
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                    <p className={styles.reviewText}>Excellent work, very professional and punctual.</p>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={`/profile/${selectedTech.id}`} className={styles.btnOutline} style={{ padding: "8px 16px", textDecoration: "none", fontSize: 13 }}>
                  View Full Profile
                </Link>
                <Link 
                  href={`/post-task?specialist_id=${selectedTech.id}&specialist_name=${encodeURIComponent(selectedTech.first_name ? `${selectedTech.first_name} ${selectedTech.last_name || ""}`.trim() : selectedTech.username || "Technician")}`}
                  className={styles.btnHire}
                >
                  Hire Technician
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
