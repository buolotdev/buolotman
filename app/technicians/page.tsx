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



export default function TechniciansPage() {
  const [selectedTech, setSelectedTech] = useState<any>(null);

  const { data, loading, error } = useFetch(() => api.listUsers({ role: "TECHNICIAN" }), []);
  
  // Safe extraction (data could be array or { results: array })
  const technicians = Array.isArray(data) ? data : ((data as any)?.results || []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.headerArea}>
        <h1 className={styles.headerTitle}>Find Technicians</h1>
        <p className={styles.headerSubtitle}>Discover top-rated professionals near you for all your maintenance and construction needs.</p>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Find technicians around you - fix it & build it" 
          className={styles.searchInput} 
        />
        <select className={styles.searchSelect}>
          <option value="all">All Categories</option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="carpenter">Carpenter</option>
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
            {technicians.map((tech: any) => (
              <div key={tech.id} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <img src={tech.avatar_url || `https://i.pravatar.cc/300?img=${(tech.id % 70) + 1}`} alt={tech.first_name || tech.username} className={styles.cardImage} />
                </div>
                <h3 className={styles.cardTitle}>{tech.first_name ? `${tech.first_name} ${tech.last_name || ""}`.trim() : (tech.username || "Unknown Technician")}</h3>
                <p className={styles.cardCategory}>{tech.category || "Professional"}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.rating}>⭐ 4.8</span> • {tech.location || tech.country || "Kigali, Rwanda"}
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/profile/${tech.id}`} className={styles.btnOutline}>View Profile</Link>
                  <Link 
                    href={`/post-task?specialist_id=${tech.id}&specialist_name=${encodeURIComponent(tech.first_name ? `${tech.first_name} ${tech.last_name || ""}`.trim() : tech.username || "Technician")}`} 
                    className={styles.btnPrimary}
                  >
                    Hire Technician
                  </Link>
                </div>

              </div>
            ))}
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
                <span className={styles.badge}>Verified</span>
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
