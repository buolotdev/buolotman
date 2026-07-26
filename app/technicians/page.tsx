"use client";

import { useState } from "react";
import Image from "next/image";
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
                  <button className={styles.btnOutline} onClick={() => setSelectedTech(tech)}>View Profile</button>
                  <button className={styles.btnPrimary}>Request Service</button>
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
                <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?w=300&q=80" alt="Past work" className={styles.workImg} />
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&q=80" alt="Past work" className={styles.workImg} />
              </div>

              <h3 className={styles.sectionTitle}>Reviews</h3>
              <div className={styles.reviewsList}>
                <div className={styles.reviewItem}>
                  <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" className={styles.reviewAvatar} />
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                    <p className={styles.reviewText}>Excellent work, very professional.</p>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.footerLinks}>
                  <a href="#" className={styles.footerLink}>Message</a>
                  <a href="#" className={styles.footerLink}>Follow</a>
                  <a href="#" className={styles.footerLink}>Block</a>
                  <a href="#" className={styles.footerLink}>Report</a>
                </div>
                <button className={styles.btnHire}>Hire Boulot Man</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
