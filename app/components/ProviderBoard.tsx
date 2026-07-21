"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ProviderBoard.module.css";

// MOCK DATA GENERATOR
const generateProviders = () => {
  const providers = [];
  const roles = [
    "Certified Electrician",
    "Senior Plumber",
    "IT Systems Engineer",
    "HVAC Specialist",
    "Solar Installation Expert",
    "Network Administrator",
    "Commercial Painter",
    "Heavy Equipment Mechanic"
  ];
  const ratings = [4.9, 4.8, 5.0, 4.7, 4.9, 4.6];
  const descriptions = [
    "Residential & commercial electrical installations, repairs, and safety inspections.",
    "Expert in leak detection, piping, and modern water heater installations.",
    "Specializes in server setups, cloud migrations, and network security audits.",
    "Providing top-notch cooling and heating system installations and maintenance.",
    "Helping businesses transition to green energy with efficient solar setups.",
    "Setting up enterprise-grade LAN/WAN configurations and firewalls.",
    "Professional interior and exterior painting for commercial buildings.",
    "Diagnosing and repairing heavy machinery with over 10 years of experience."
  ];

  for (let i = 1; i <= 24; i++) {
    providers.push({
      id: i,
      name: `Provider ${i}`,
      role: roles[i % roles.length],
      avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
      rating: ratings[i % ratings.length],
      location: "Kigali, Rwanda",
      distance: `${(Math.random() * 10).toFixed(1)} miles away`,
      description: descriptions[i % descriptions.length]
    });
  }
  return providers;
};

const PROVIDERS = generateProviders();

export default function ProviderBoard() {
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
        <div className={styles.grid}>
          {PROVIDERS.map((pro) => (
            <div key={pro.id} className={styles.card}>
              <div className={styles.profile}>
                <Image src={pro.avatar} alt={pro.name} width={64} height={64} className={styles.avatar} />
                <div>
                  <h3 className={styles.name}>{pro.name}</h3>
                  <div className={styles.role}>{pro.role}</div>
                </div>
              </div>
              
              <div className={styles.rating}>
                <span className={styles.stars}>★★★★★</span>
                <span>({pro.rating})</span>
              </div>
              
              <div className={styles.meta}>
                <iconify-icon icon="lucide:map-pin"></iconify-icon>
                {pro.location} &bull; {pro.distance}
              </div>
              
              <div className={styles.description}>
                {pro.description}
              </div>
              
              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.btnView}`}>View Profile</button>
                <button className={`${styles.btn} ${styles.btnHire}`}>Hire Now</button>
              </div>
            </div>
          ))}
        </div>

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
