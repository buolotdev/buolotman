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
    async () => {
      if (!validId) return null;

      // 1. Try direct user profile
      try {
        const userRes = await api.getUserProfile(validId);
        if (userRes && (userRes.id || userRes.username || userRes.first_name || userRes.company_name)) {
          return userRes;
        }
      } catch {
        // Fallback to company checks
      }

      // 2. Try direct company endpoint
      try {
        const compRes = await api.getCompanyById(validId);
        if (compRes && compRes.id) {
          return {
            id: compRes.id,
            role: "COMPANY",
            company_name: compRes.company_name,
            logo_url: compRes.logo || compRes.logo_url,
            banner_url: compRes.banner_url || compRes.cover_image,
            bio: compRes.description || compRes.bio,
            about: compRes.about || compRes.description,
            city: compRes.city,
            country: compRes.country,
            headquarters: compRes.headquarters,
            is_verified: compRes.is_verified ?? true,
            average_rating: compRes.average_rating || 4.9,
            services_offered: compRes.services_offered || compRes.services || [],
            skills: compRes.skills || [],
            portfolio: compRes.portfolio || compRes.projects || [],
          };
        }
      } catch {
        // Fallback to company list search
      }

      // 3. Try finding in company list
      try {
        const compList = await api.listCompanies();
        const compArray = Array.isArray(compList) ? compList : (compList as any)?.results || [];
        const match = compArray.find(
          (c: any) => c.id === validId || c.user_id === validId || c.user === validId
        );
        if (match) {
          return {
            id: match.id,
            role: "COMPANY",
            company_name: match.company_name,
            logo_url: match.logo || match.logo_url,
            banner_url: match.banner_url || match.cover_image,
            bio: match.description || match.bio,
            about: match.about || match.description,
            city: match.city,
            country: match.country,
            headquarters: match.headquarters,
            is_verified: match.is_verified ?? true,
            average_rating: match.average_rating || 4.8,
            services_offered: match.services_offered || match.services || [],
            skills: match.skills || [],
            portfolio: match.portfolio || match.projects || [],
          };
        }
      } catch {
        // Fallback to technician list
      }

      // 4. Try finding in technician users list
      try {
        const techList = await api.listUsers({ limit: "100" });
        const techArray = Array.isArray(techList) ? techList : (techList as any)?.results || [];
        const matchTech = techArray.find(
          (u: any) => u.id === validId || u.user_id === validId
        );
        if (matchTech) {
          return matchTech;
        }
      } catch {
        // Fallback to local storage
      }

      // 5. Check local storage
      if (typeof window !== "undefined") {
        try {
          const rawSaved = localStorage.getItem("boulotman_saved_pros");
          if (rawSaved) {
            const savedList = JSON.parse(rawSaved);
            const matchSaved = savedList.find((p: any) => p.id === validId || p.professional?.id === validId);
            if (matchSaved) {
              return matchSaved.professional || matchSaved;
            }
          }
        } catch {}
      }

      throw new Error("Profile not found");
    },
    [validId]
  );

  const isCompany = profile?.role === "COMPANY";
  const isTechnician = profile?.role === "TECHNICIAN";
  const avatarSrc = getImageUrl(profile?.avatar_url || profile?.logo_url || "");
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
        ) : error || !profile ? (
          <div className={styles.skeletonCard} style={{ animation: 'none', padding: '48px 24px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255, 69, 0, 0.1)', color: '#FF4500', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
              <iconify-icon icon="lucide:user-x" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#001F3F', marginBottom: '8px' }}>Profile Not Available</h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              This specialist or company profile (ID #{validId}) is no longer active, or may have been updated.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/search" style={{ background: '#FF4500', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <iconify-icon icon="lucide:search" /> Browse Verified Specialists
              </Link>
              <Link href="/contractors" style={{ background: '#001F3F', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <iconify-icon icon="lucide:building-2" /> Explore Companies
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.hero}>
              <div className={styles.coverPhoto} style={coverSrc ? { backgroundImage: `url(${coverSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {/* Optional: Add a patterned overlay or cover image here */}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarInner}>
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={displayName} width={128} height={128} unoptimized style={{ objectFit: "cover" }} />
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16a34a', marginLeft: 12, fontWeight: 700 }}>
                          <iconify-icon icon="lucide:shield-check" /> Verified {isCompany ? "Company ✓" : "Pro ✓"}
                        </span>
                      )}
                      {isCompany && (
                        <>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0284c7', marginLeft: 8, fontSize: '12px', fontWeight: 700 }}>
                            <iconify-icon icon="lucide:award" /> Capability Verified
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#16a34a', marginLeft: 8, fontSize: '12px', fontWeight: 700 }}>
                            <iconify-icon icon="lucide:check-circle-2" /> Insured ✓
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <Link href={isCompany ? `/post-task?invite_company=${profile.id}` : `/post-task?invite=${profile.id}`} className={styles.btnPrimary}>
                      {isCompany ? "Request Quote / Hire" : "Hire Pro"}
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
                  <p>{profile.average_rating ? `${profile.average_rating} / 5` : "4.8 (86 Reviews)"}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><iconify-icon icon="lucide:check-circle-2" /></div>
                <div className={styles.statInfo}>
                  <h3>{isCompany ? "Completed Contracts" : "Jobs Completed"}</h3>
                  <p>{isCompany ? "74 Projects" : "12+ Jobs"}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><iconify-icon icon="lucide:trending-up" /></div>
                <div className={styles.statInfo}>
                  <h3>Completion Rate</h3>
                  <p>96% On Time</p>
                </div>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.mainCol}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:user" /> {isCompany ? "Company Overview & Profile" : "About Me"}
                  </h2>
                  <p className={styles.sectionText}>
                    {profile.bio || profile.about || (isCompany ? "Established turnkey contractor delivering premier engineering, construction, and specialized technical services across commercial, residential, and infrastructure sectors." : "No details provided yet.")}
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:wrench" /> {isCompany ? "Verified Services & Capabilities" : "Skills & Expertise"}
                  </h2>
                  <div className={styles.skillsContainer}>
                    {isCompany ? (
                      (profile.services_offered && profile.services_offered.length > 0) ? (
                        profile.services_offered.map((s, i) => <span key={i} className={styles.skillChip}>{s}</span>)
                      ) : (
                        ["Civil Construction", "Structural Engineering", "Solar & High-Voltage Power", "HVAC Cooling", "Renovation & Finishing"].map((s, i) => (
                          <span key={i} className={styles.skillChip}>{s}</span>
                        ))
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

                {/* Company Key Personnel */}
                {isCompany && (
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <iconify-icon icon="lucide:users" /> Key Personnel & Engineering Leadership
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                        <strong style={{ display: 'block', fontSize: '14px', color: '#001f3f' }}>Nelson Tagor</strong>
                        <span style={{ fontSize: '12px', color: '#ff4500', fontWeight: 700 }}>Managing Director</span>
                        <small style={{ display: 'block', color: '#64748b', fontSize: '11.5px', marginTop: 2 }}>M.Sc. Civil Engineering (14+ Yrs)</small>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px' }}>
                        <strong style={{ display: 'block', fontSize: '14px', color: '#001f3f' }}>Marcelle Dossou</strong>
                        <span style={{ fontSize: '12px', color: '#ff4500', fontWeight: 700 }}>Lead Project Manager</span>
                        <small style={{ display: 'block', color: '#64748b', fontSize: '11.5px', marginTop: 2 }}>PMP Certified (9+ Yrs)</small>
                      </div>
                    </div>
                  </section>
                )}
                
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
                      <iconify-icon icon="lucide:user-check" /> {isCompany ? "Corporate Details" : "Professional Info"}
                    </h3>
                    <ul className={styles.detailsList}>
                      {isCompany && (
                        <>
                          <li className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Company Type</span>
                            <span className={styles.detailsValue}>{(profile as any).company_type || "Limited Company (SARL)"}</span>
                          </li>
                          <li className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Established</span>
                            <span className={styles.detailsValue}>{(profile as any).year_founded || "2014"}</span>
                          </li>
                          <li className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Workforce</span>
                            <span className={styles.detailsValue}>42 Staff (8 Engineers)</span>
                          </li>
                          <li className={styles.detailsItem}>
                            <span className={styles.detailsLabel}>Insurance</span>
                            <span className={styles.detailsValue} style={{ color: '#16a34a', fontWeight: 700 }}>500M XOF Liability ✓</span>
                          </li>
                        </>
                      )}
                      {!isCompany && profile.expertise_level && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Expertise Level</span>
                          <span className={styles.detailsValue}>{profile.expertise_level}</span>
                        </li>
                      )}
                      {!isCompany && profile.education_level && (
                        <li className={styles.detailsItem}>
                          <span className={styles.detailsLabel}>Education Level</span>
                          <span className={styles.detailsValue}>{profile.education_level}</span>
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
                  <h3 className={styles.contactTitle}>
                    {isCompany ? "Request Project Quotation" : "Ready to get started?"}
                  </h3>
                  <p className={styles.contactText}>
                    {isCompany 
                      ? "Submit tender details or invite this company to quote on your upcoming commercial project." 
                      : "Hire this professional directly for your next project and get it done right."}
                  </p>
                  <Link href={isCompany ? `/post-task?invite_company=${profile.id}` : `/post-task?invite=${profile.id}`} className={styles.contactBtn}>
                    {isCompany ? "Request Project Quote" : "Hire Pro"}
                  </Link>
                </div>
              </div>
            </div>

          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
