"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

// Mock data based on technicians.html
const MOCK_TECHNICIANS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 41,
  name: `Technician ${i + 41}`,
  category: "Electrician",
  rating: 4.8,
  distance: "3.2 miles away",
  image: `https://i.pravatar.cc/300?img=${i + 1}`,
  location: "Kigali, Rwanda",
  badges: ["Expert", "128 Tasks Completed", "7 Years Experience"],
  bio: "Certified technician with extensive experience delivering quality services across residential and commercial projects.",
  pastWorks: [
    "https://images.unsplash.com/photo-1504307651254-35680f356f12?w=300&q=80",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&q=80",
    "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=300&q=80"
  ],
  reviews: [
    { avatar: "https://i.pravatar.cc/100?img=1", text: "Excellent work, very professional.", stars: "⭐⭐⭐⭐⭐" },
    { avatar: "https://i.pravatar.cc/100?img=2", text: "Reliable and on time.", stars: "⭐⭐⭐⭐" }
  ]
}));

export default function TechniciansPage() {
  const [selectedTech, setSelectedTech] = useState<typeof MOCK_TECHNICIANS[0] | null>(null);

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
        <div className={styles.grid}>
          {MOCK_TECHNICIANS.map((tech) => (
            <div key={tech.id} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image src={tech.image} alt={tech.name} fill className={styles.cardImage} />
              </div>
              <h3 className={styles.cardTitle}>{tech.name}</h3>
              <p className={styles.cardCategory}>{tech.category}</p>
              <div className={styles.cardMeta}>
                <span className={styles.rating}>⭐ {tech.rating}</span> • {tech.distance}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.btnOutline} onClick={() => setSelectedTech(tech)}>View Profile</button>
                <button className={styles.btnPrimary}>Request Service</button>
              </div>
            </div>
          ))}
        </div>

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
              <img src={selectedTech.image} alt="Profile" className={styles.profilePic} />
            </div>

            <div className={styles.profileBody}>
              <h2 className={styles.profileName}>{selectedTech.name}</h2>
              <p className={styles.profileCategory}>{selectedTech.category}</p>
              <p className={styles.profileLocation}>{selectedTech.location}</p>

              <div className={styles.badges}>
                {selectedTech.badges.map(b => <span key={b} className={styles.badge}>{b}</span>)}
              </div>

              <p className={styles.profileBio}>{selectedTech.bio}</p>

              <h3 className={styles.sectionTitle}>Past Works</h3>
              <div className={styles.worksGrid}>
                {selectedTech.pastWorks.map((work, i) => (
                  <img key={i} src={work} alt="Past work" className={styles.workImg} />
                ))}
              </div>

              <h3 className={styles.sectionTitle}>Reviews</h3>
              <div className={styles.reviewsList}>
                {selectedTech.reviews.map((rev, i) => (
                  <div key={i} className={styles.reviewItem}>
                    <img src={rev.avatar} alt="Avatar" className={styles.reviewAvatar} />
                    <div className={styles.reviewContent}>
                      <div className={styles.reviewStars}>{rev.stars}</div>
                      <p className={styles.reviewText}>{rev.text}</p>
                    </div>
                  </div>
                ))}
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
