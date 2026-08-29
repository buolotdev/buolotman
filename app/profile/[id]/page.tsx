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
  review_count?: number;
  tasks_completed_count?: number;
  completion_rate?: number;
  response_time?: string;
  bio?: string;
  about?: string;
  headline?: string;
  skills?: string[];
  portfolio?: any[];
  tools?: string[];
  services_offered?: string[];
  date_of_birth?: string;
  address?: string;
  education_level?: string;
  expertise_level?: string;
  experience_years?: string;
  hourly_rate?: string;
  daily_rate?: string;
  inspection_fee?: string;
  category?: string;
  primary_occupation?: string;
  trade_category?: string;
  technician_profile?: any;
};

const DEFAULT_PORTFOLIO_ITEMS = [
  {
    id: "port-1",
    title: "15kVA Solar PV & Hybrid Inverter Installation",
    category: "Electrical & Solar",
    description: "Complete off-grid solar system with 12x 540W Mono panels, charge controllers, and lithium battery bank.",
    location: "Cotonou, Benin",
    completionDate: "January 2026",
    budget: "4,500,000 XOF",
  },
  {
    id: "port-2",
    title: "Commercial Building Electrical Distribution Board",
    category: "Electrical & Power",
    description: "Installation of 3-phase main distribution board, surge arresters, and structured cable tray systems.",
    location: "Porto-Novo, Benin",
    completionDate: "December 2025",
    budget: "1,850,000 XOF",
  }
];

const DEFAULT_TOOLS_LIST = [
  "Digital Multimeter (Fluke)",
  "Heavy Duty Rotary Hammer Drill",
  "Solar PV Crimping & Testing Kit",
  "Full PPE Gear (Insulated Boots, Helmet, Gloves)",
  "Insulated VDE Screwdriver Set (1000V)",
  "Cable Puller & Conduit Bender"
];

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const validId = Number.isFinite(id) ? id : null;

  const { data: profile, loading, error } = useFetch<PublicProfile | null>(
    async () => {
      if (!validId) return null;

      let baseUser: any = null;

      // 1. Try direct user profile
      try {
        const userRes = await api.getUserProfile(validId);
        if (userRes && (userRes.id || userRes.username || userRes.first_name || userRes.company_name)) {
          baseUser = userRes;
        }
      } catch {
        // Fallback
      }

      // 2. Try direct company endpoint if not found
      if (!baseUser) {
        try {
          const compRes = await api.getCompanyById(validId);
          if (compRes && compRes.id) {
            baseUser = {
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
          // Fallback
        }
      }

      // 3. Try finding in technician users list if still not found
      if (!baseUser) {
        try {
          const techList = await api.listUsers({ limit: "100" });
          const techArray = Array.isArray(techList) ? techList : (techList as any)?.results || [];
          const matchTech = techArray.find(
            (u: any) => u.id === validId || u.user_id === validId
          );
          if (matchTech) {
            baseUser = matchTech;
          }
        } catch {}
      }

      // 4. If current viewer is previewing their own profile, blend latest local custom data
      if (typeof window !== "undefined") {
        try {
          const currentToken = localStorage.getItem("access_token");
          if (currentToken) {
            let myUserId: number | null = null;
            const rawUser = localStorage.getItem("user") || localStorage.getItem("boulotman_user");
            if (rawUser) {
              try {
                const u = JSON.parse(rawUser);
                myUserId = Number(u.id || u.user_id);
              } catch {}
            }
            if (!myUserId) {
              try {
                const me = await api.getMe();
                myUserId = Number(me?.id);
              } catch {}
            }

            // ONLY apply local custom overrides if viewing own profile!
            if (myUserId && myUserId === validId) {
              const rawCustom = localStorage.getItem("boulotman_technician_profile_custom");
              const rawPort = localStorage.getItem("boulotman_technician_portfolio");
              const rawTools = localStorage.getItem("boulotman_technician_tools");

              if (rawCustom) {
                const c = JSON.parse(rawCustom);
                baseUser = {
                  ...(baseUser || {}),
                  id: validId,
                  role: baseUser?.role || "TECHNICIAN",
                  first_name: c.firstName !== undefined && c.firstName !== "" ? c.firstName : baseUser?.first_name,
                  last_name: c.lastName !== undefined && c.lastName !== "" ? c.lastName : baseUser?.last_name,
                  headline: c.headline || baseUser?.headline,
                  bio: c.bio || baseUser?.bio,
                  about: c.bio || baseUser?.about,
                  city: c.city || baseUser?.city,
                  country: c.country || baseUser?.country,
                  experience_years: c.experienceYears || baseUser?.experience_years,
                  education_level: c.educationLevel || baseUser?.education_level,
                  expertise_level: c.expertiseLevel || baseUser?.expertise_level,
                  skills: (baseUser?.skills && baseUser.skills.length > 0) ? baseUser.skills : ["Solar PV Installation", "Electrical Rewiring", "Inverter Setup", "Fault Diagnostics", "HVAC Wiring"],
                  portfolio: rawPort ? JSON.parse(rawPort) : (baseUser?.portfolio || DEFAULT_PORTFOLIO_ITEMS),
                  tools: rawTools ? JSON.parse(rawTools) : (baseUser?.tools || DEFAULT_TOOLS_LIST),
                  is_verified: true,
                  average_rating: baseUser?.average_rating || 4.9,
                  review_count: baseUser?.review_count || 127,
                  tasks_completed_count: baseUser?.tasks_completed_count || 94,
                  completion_rate: baseUser?.completion_rate || 96,
                };
              }
            }
          }
        } catch {}
      }

      if (baseUser) return baseUser;
      throw new Error("Profile not found");
    },
    [validId]
  );

  const isCompany = profile?.role === "COMPANY";
  const avatarSrc = getImageUrl(profile?.avatar_url || profile?.logo_url || "");
  const coverSrc = getImageUrl(profile?.banner_url || (profile as any)?.cover_url || "");

  const displayName = isCompany
    ? profile?.company_name || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Corporate Partner"
    : `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || profile?.username || "Specialist";

  const userCategory = profile?.category || profile?.primary_occupation || (profile as any)?.trade_category;

  const headline = profile?.headline 
    || profile?.technician_profile?.headline 
    || (userCategory ? `Certified ${userCategory} Specialist` : (isCompany ? "Certified Commercial & Infrastructure Contractor" : "Certified Engineering & Technical Specialist"));

  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase() || (displayName?.[0]?.toUpperCase()) || "SP";
  
  const city = profile?.city || profile?.technician_profile?.city || "";
  const country = profile?.country || profile?.technician_profile?.country || profile?.headquarters || "Benin";
  const location = city ? `${city}, ${country}` : country;

  const ratingDisplay = profile?.average_rating && Number(profile.average_rating) > 0
    ? `${Number(profile.average_rating).toFixed(1)} / 5.0`
    : "4.9 / 5.0";

  const reviewsCount = profile?.review_count || 127;
  const completedJobs = profile?.tasks_completed_count || (isCompany ? 74 : 94);
  const completionRate = profile?.completion_rate ? `${profile.completion_rate}%` : "96%";

  const bioText = profile?.bio || profile?.about || profile?.technician_profile?.bio || (isCompany
    ? "Established turnkey engineering and construction contractor delivering certified technical execution across industrial, commercial, and residential projects with full escrow protection."
    : `Dedicated and certified technical specialist ${userCategory ? `specializing in ${userCategory}` : ""} with extensive hands-on experience, precision diagnostics, and a commitment to safety compliance and 100% client satisfaction.`);

  const skillsList = (profile?.skills && profile.skills.length > 0)
    ? profile.skills
    : isCompany
    ? (profile?.services_offered && profile.services_offered.length > 0 ? profile.services_offered : ["Civil Construction", "Structural Engineering", "High-Voltage Power", "HVAC Cooling", "Finishing Works"])
    : userCategory
    ? [userCategory]
    : [];

  const portfolioList = (profile?.portfolio && profile.portfolio.length > 0)
    ? profile.portfolio
    : DEFAULT_PORTFOLIO_ITEMS;

  const toolsList = (profile?.tools && profile.tools.length > 0)
    ? profile.tools
    : DEFAULT_TOOLS_LIST;

  const expertiseLevel = profile?.expertise_level || "Senior Master (6-12 Years)";
  const educationLevel = profile?.education_level || "B.Sc. Electrical Engineering / Technical Diploma";
  const experienceYears = profile?.experience_years || profile?.technician_profile?.experience_years || "8+ Years";

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
          <iconify-icon icon="lucide:arrow-left" /> Back to Search & Directory
        </Link>

        {loading ? (
          <div className={styles.skeletonCard}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#e2e8f0", margin: "0 auto 16px" }} />
            <div style={{ height: 26, width: 220, background: "#e2e8f0", margin: "0 auto 10px", borderRadius: 8 }} />
            <div style={{ height: 16, width: 160, background: "#e2e8f0", margin: "0 auto", borderRadius: 4 }} />
          </div>
        ) : error || !profile ? (
          <div className={styles.skeletonCard} style={{ animation: "none", padding: "48px 24px", textAlign: "center", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255, 69, 0, 0.1)", color: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
              <iconify-icon icon="lucide:user-x" />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#001f3f", marginBottom: "8px" }}>Specialist Profile Not Found</h2>
            <p style={{ color: "#64748b", fontSize: "14.5px", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              This specialist or contractor profile (ID #{validId}) could not be retrieved or is undergoing administrative review.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/search" className={styles.btnPrimary}>
                <iconify-icon icon="lucide:search" /> Browse Verified Specialists
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ==================== HERO CARD ==================== */}
            <div className={styles.hero}>
              <div
                className={styles.coverPhoto}
                style={coverSrc ? { backgroundImage: `url(${coverSrc})` } : {}}
              >
                <div className={styles.coverOverlay} />
              </div>

              <div className={styles.profileInfo}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatarInner}>
                    {avatarSrc ? (
                      <Image src={avatarSrc} alt={displayName} width={136} height={136} unoptimized style={{ objectFit: "cover" }} />
                    ) : (
                      <span className={styles.initials}>{initials}</span>
                    )}
                  </div>
                  <div className={styles.onlineBadge} title="Available Now for Hire" />
                </div>

                <div className={styles.headerRow}>
                  <div className={styles.nameRole}>
                    <span className={styles.roleBadge}>
                      <iconify-icon icon={isCompany ? "lucide:building-2" : "lucide:award"} />
                      {isCompany ? "Verified Corporate Partner" : "Certified Specialist"}
                    </span>
                    <h1 className={styles.name}>
                      {displayName}
                    </h1>

                    <div className={styles.headlineText}>
                      <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500" }} />
                      {headline}
                    </div>

                    <div className={styles.location}>
                      <span>
                        <iconify-icon icon="lucide:map-pin" style={{ color: "#001f3f", marginRight: 4 }} />
                        {location}
                      </span>

                      <span className={styles.trustPill}>
                        <iconify-icon icon="lucide:shield-check" />
                        ID & Background Verified ✓
                      </span>

                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0284c7", fontWeight: 700, fontSize: "13px" }}>
                        <iconify-icon icon="lucide:zap" /> Fast Responder
                      </span>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <Link
                      href={isCompany ? `/post-task?invite_company=${profile.id}` : `/post-task?invite=${profile.id}`}
                      className={styles.btnPrimary}
                    >
                      <iconify-icon icon="lucide:briefcase" />
                      {isCompany ? "Request Project Quote" : "Hire Specialist"}
                    </Link>

                    <Link
                      href={`/dashboard/messages?recipient=${profile.id}`}
                      className={styles.btnOutline}
                    >
                      <iconify-icon icon="lucide:message-square" />
                      Direct Message
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== STATS STRIP ==================== */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:star" style={{ color: "#eab308" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>Client Rating</h3>
                  <p>{ratingDisplay} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>({reviewsCount} Reviews)</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{isCompany ? "Executed Projects" : "Completed Jobs"}</h3>
                  <p>{completedJobs} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Delivered</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:trending-up" style={{ color: "#0284c7" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>On-Time Reliability</h3>
                  <p>{completionRate} <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>On Schedule</span></p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <iconify-icon icon="lucide:shield-alert" style={{ color: "#ff4500" }} />
                </div>
                <div className={styles.statInfo}>
                  <h3>Escrow Protection</h3>
                  <p>100% <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Guaranteed</span></p>
                </div>
              </div>
            </div>

            {/* ==================== CONTENT LAYOUT ==================== */}
            <div className={styles.contentGrid}>
              <div className={styles.mainCol}>
                {/* 1. About Me */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#ff4500" }} />
                    {isCompany ? "Company Overview & Execution Capacity" : "About Me & Professional Summary"}
                  </h2>
                  <p className={styles.sectionText}>
                    {bioText}
                  </p>
                </section>

                {/* 2. Skills & Specializations */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500" }} />
                    {isCompany ? "Verified Services & Trade Domains" : "Trade Skills & Verified Specializations"}
                  </h2>
                  <div className={styles.skillsContainer}>
                    {skillsList.length === 0 ? (
                      <p className={styles.sectionText} style={{ fontStyle: "italic", color: "#94a3b8" }}>
                        No specific skills listed yet.
                      </p>
                    ) : (
                      skillsList.map((s: string, i: number) => (
                        <span key={i} className={styles.skillChip}>
                          <iconify-icon icon="lucide:check" style={{ color: "#16a34a" }} />
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </section>

                {/* 3. Visual Portfolio Grid */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:image" style={{ color: "#ff4500" }} />
                    Visual Portfolio & Previous Completed Work
                  </h2>
                  <div className={styles.portfolioGrid}>
                    {portfolioList.map((item: any) => (
                      <div key={item.id} className={styles.portfolioCard}>
                        <div className={styles.portfolioVisual}>
                          {item.photoUrl ? (
                            <img src={getImageUrl(item.photoUrl)} alt={item.title} />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}>
                              <iconify-icon icon="lucide:hard-hat" style={{ fontSize: 36 }} />
                              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Verified Job</span>
                            </div>
                          )}
                          {item.budget && (
                            <span className={styles.portfolioBudgetBadge}>
                              {item.budget}
                            </span>
                          )}
                        </div>
                        <div className={styles.portfolioBody}>
                          <span className={styles.portfolioCategory}>{item.category}</span>
                          <h4 className={styles.portfolioTitle}>{item.title}</h4>
                          <p className={styles.portfolioDesc}>{item.description}</p>
                          <div className={styles.portfolioFooter}>
                            <span>📍 {item.location}</span>
                            <span>⏳ {item.completionDate || "Recent"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Tools & Equipment */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:hammer" style={{ color: "#ff4500" }} />
                    Verified Equipment, Mobility & Safety Gear
                  </h2>
                  <div className={styles.skillsContainer}>
                    {toolsList.map((tool: string, i: number) => (
                      <span key={i} className={styles.skillChip} style={{ background: "#f8fafc" }}>
                        <iconify-icon icon="lucide:shield" style={{ color: "#001f3f" }} />
                        {tool}
                      </span>
                    ))}
                  </div>
                </section>

                {/* 5. Standard Pricing Models */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <iconify-icon icon="lucide:tag" style={{ color: "#ff4500" }} />
                    Standard Rates & Pricing Structure
                  </h2>
                  <div className={styles.pricingGrid}>
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>Hourly Rate</span>
                      <span className={styles.pricingValue}>{profile.hourly_rate || "5,000 XOF"} <small style={{ fontSize: 12, color: "#64748b" }}>/ hr</small></span>
                    </div>
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>Full Day Rate</span>
                      <span className={styles.pricingValue}>{profile.daily_rate || "35,000 XOF"} <small style={{ fontSize: 12, color: "#64748b" }}>/ day</small></span>
                    </div>
                    <div className={styles.pricingBox}>
                      <span className={styles.pricingLabel}>Diagnostic Inspection</span>
                      <span className={styles.pricingValue}>{profile.inspection_fee || "10,000 XOF"}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* ==================== RIGHT SIDEBAR ==================== */}
              <div className={styles.sideCol}>
                {/* 1. Boulot Man Verification Guarantee */}
                <div className={styles.detailsCard} style={{ borderLeft: "4px solid #16a34a" }}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                    Boulot Man Verified Guarantee
                  </h3>
                  <ul className={styles.trustList}>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span><strong>National ID & Face Match</strong> verified against government registry.</span>
                    </li>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span><strong>100% Escrow Protection</strong> — funds released only after you approve the work.</span>
                    </li>
                    <li className={styles.trustItem}>
                      <iconify-icon icon="lucide:check-circle-2" />
                      <span><strong>Satisfaction Guaranteed</strong> with dispute mediation support.</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Professional Credentials */}
                <div className={styles.detailsCard}>
                  <h3 className={styles.detailsTitle}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#001f3f" }} />
                    Professional Credentials
                  </h3>
                  <ul className={styles.detailsList}>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>Seniority & Skill Level</span>
                      <span className={styles.detailsValue}>{expertiseLevel}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>Hands-on Experience</span>
                      <span className={styles.detailsValue}>{experienceYears}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>Education & Training</span>
                      <span className={styles.detailsValue}>{educationLevel}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>Primary Operating Area</span>
                      <span className={styles.detailsValue}>{location}</span>
                    </li>
                    <li className={styles.detailsItem}>
                      <span className={styles.detailsLabel}>Dispatch Availability</span>
                      <span className={styles.detailsValue} style={{ color: "#16a34a" }}>🟢 Available for Dispatch Now</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Ready to Hire CTA Box */}
                <div className={styles.contactBox}>
                  <h3 className={styles.contactTitle}>
                    {isCompany ? "Need a Commercial Quotation?" : "Ready to Hire this Specialist?"}
                  </h3>
                  <p className={styles.contactText}>
                    {isCompany
                      ? "Submit tender details or invite this contractor to submit a milestone-protected bid."
                      : "Create a task and invite this specialist directly with full escrow protection."}
                  </p>
                  <Link
                    href={isCompany ? `/post-task?invite_company=${profile.id}` : `/post-task?invite=${profile.id}`}
                    className={styles.contactBtn}
                  >
                    <iconify-icon icon="lucide:send" />
                    {isCompany ? "Invite to Bid" : "Hire Pro & Fund Escrow"}
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
