"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./profile.module.css";

type PublicProfile = {
  id?: number;
  role?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  banner_url?: string;
  logo_url?: string;
  country?: string;
  city?: string;
  headquarters?: string;
  is_verified?: boolean;
  average_rating?: number | string;
  response_time?: string;
  bio?: string;
  skills?: string[];
  portfolio?: unknown[];
  about?: string;
  services_offered?: string[];
  business_hours?: unknown[];
  date_of_birth?: string;
  address?: string;
  education_level?: string;
  expertise_level?: string;
};

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const validId = Number.isFinite(id) ? id : null;
  const { data: profile, loading, error } = useFetch<PublicProfile | null>(
    () => (validId ? api.getUserProfile(validId) : Promise.resolve(null)),
    [validId]
  );

  const isCompany = profile?.role === "COMPANY";
  const isTechnician = profile?.role === "TECHNICIAN";
  const avatarSrc = profile?.avatar_url || profile?.logo_url || "";
  const coverSrc = getImageUrl(profile?.banner_url || (profile as any)?.cover_url || "");
  const displayName = isCompany
    ? profile?.company_name || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
    : `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || profile?.username || "Unknown Profile";
  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase() || (displayName?.[0]?.toUpperCase()) || "U";
  const location = profile?.city ? `${profile.city}, ${profile.country || ''}` : (profile?.country || profile?.headquarters || "Location not set");
  const getAge = (dobString?: string) => {
    if (!dobString) return null;
    try {
      const birthDate = new Date(dobString);
      const today = new Date();
      let ageValue = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        ageValue--;
      }
      return isNaN(ageValue) ? null : ageValue;
    } catch {
      return null;
    }
  };
  const age = profile ? getAge(profile.date_of_birth) : null;
  const hasDetails = profile && (profile.expertise_level || profile.education_level || profile.date_of_birth || profile.address);

  if (validId === null) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.mainContent}>
          <h2>Invalid profile ID.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.mainContent}>
        <Link href="/search" className={styles.backLink}>
          <iconify-icon icon="lucide:arrow-left" /> Back to Search
        </Link>

        {loading ? (
          <div className={styles.skeletonCard}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 20px' }}></div>
            <div style={{ height: 30, width: 200, background: '#e2e8f0', margin: '0 auto 10px', borderRadius: 8 }}></div>
            <div style={{ height: 16, width: 150, background: '#e2e8f0', margin: '0 auto', borderRadius: 4 }}></div>
          </div>
        ) : error ? (
          <div className={styles.skeletonCard} style={{ animation: 'none', color: '#dc2626' }}>
            <iconify-icon icon="lucide:alert-circle" style={{ fontSize: 48, marginBottom: 16 }} />
            <h2>Error loading profile</h2>
            <p>{error}</p>
          </div>
        ) : profile ? (
          <>
            <div className={styles.hero}>
              <div className={styles.coverPhoto} style={coverSrc ? { backgroundImage: `url(${coverSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {/* Optional: Add a patterned overlay or cover image here */}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarInner}>
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={displayName} width={128} height={128} style={{ objectFit: "cover" }} />
                    ) : (
                      <span className={styles.initials}>{initials}</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.headerRow}>
                  <div className={styles.nameRole}>
                    <span className={styles.roleBadge}>{profile.role || "Professional"}</span>
                    <h1 className={styles.name}>{displayName}</h1>
                    <div className={styles.location}>
                      <iconify-icon icon="lucide:map-pin" />
                      {location}
                      {profile.is_verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10b981', marginLeft: 12 }}>
                          <iconify-icon icon="lucide:shield-check" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <Link href={`/dashboard/client/tasks/create?invite=${profile.id}`} className={styles.btnPrimary}>
                      Hire {isCompany ? "Company" : "Pro"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><iconify-icon icon="lucide:star" /></div>
                <div className={styles.statInfo}>
                  <h3>Rating</h3>
                  <p>{profile.average_rating ? `${profile.average_rating} / 5` : "No ratings yet"}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><iconify-icon icon="lucide:clock" /></div>
                <div className={styles.statInfo}>
                  <h3>Response Time</h3>
                  <p>{profile.response_time || "Not available"}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><iconify-icon icon="lucide:check-circle-2" /></div>
                <div className={styles.statInfo}>
                  <h3>Jobs Completed</h3>
                  <p>12+</p>
                </div>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.mainCol}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:user" /> {isCompany ? "About Company" : "About Me"}
                  </h2>
                  <p className={styles.sectionText}>
                    {profile.bio || profile.about || "No details provided by this professional yet."}
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:wrench" /> {isCompany ? "Services Offered" : "Skills & Expertise"}
                  </h2>
                  <div className={styles.skillsContainer}>
                    {isCompany ? (
                      (profile.services_offered && profile.services_offered.length > 0) ? (
                        profile.services_offered.map((s, i) => <span key={i} className={styles.skillChip}>{s}</span>)
                      ) : (
                        <p className={styles.sectionText}>No specific services listed.</p>
                      )
                    ) : (
                      (profile.skills && profile.skills.length > 0) ? (
                        profile.skills.map((s, i) => <span key={i} className={styles.skillChip}>{s}</span>)
                      ) : (
                        <p className={styles.sectionText}>No skills listed.</p>
                      )
                    )}
                  </div>
                </section>
                
                {isTechnician && profile.portfolio && (profile.portfolio.length > 0) && (
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:briefcase" /> Portfolio
                    </h2>
                    <p className={styles.sectionText}>Portfolio items will be displayed here.</p>
                  </section>
                )}
              </div>

              <div className={styles.sideCol}>
                {hasDetails && (
                  <div className={styles.detailsCard}>
                    <h3 className={styles.detailsTitle}>
                      <iconify-icon icon="lucide:user-check" /> Professional Info
                    </h3>
                    <ul className={styles.detailsList}>
                      {profile.expertise_level && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Expertise Level</span>
                          <span className={styles.detailsValue}>{profile.expertise_level}</span>
                        </li>
                      )}
                      {profile.education_level && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Education Level</span>
                          <span className={styles.detailsValue}>{profile.education_level}</span>
                        </li>
                      )}
                      {age !== null && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Age</span>
                          <span className={styles.detailsValue}>{age} years old</span>
                        </li>
                      )}
                      {profile.address && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Address</span>
                          <span className={styles.detailsValue}>{profile.address}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className={styles.contactBox}>
                  <h3 className={styles.contactTitle}>Ready to get started?</h3>
                  <p className={styles.contactText}>Hire this professional directly for your next project and get it done right.</p>
                  <Link href={`/dashboard/client/tasks/create?invite=${profile.id}`} className={styles.contactBtn}>
                    Request Quote
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.skeletonCard} style={{ animation: 'none' }}>
            <h2>Profile not found</h2>
            <p style={{ color: '#64748b' }}>The professional you are looking for does not exist or has been removed.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
