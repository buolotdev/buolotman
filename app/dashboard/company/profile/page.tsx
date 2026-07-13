"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import layoutStyles from "../page.module.css";
import styles from "./profile.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { SkeletonBlock, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import { useToast } from "@/app/components/Toast";

export default function CompanyProfileDashboard() {
  const [activeNav, setActiveNav] = useState("profile");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: services, loading: servicesLoading } = useFetch(() => api.getCompanyServices(), []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await api.uploadCompanyServiceImage(file);
      if (res.image_url) {
        await api.updateCompanyProfile({ logo: res.image_url });
        await refetchProfile();
        toast.success("Success", "Company logo updated successfully.");
      }
    } catch (err: any) {
      toast.error("Upload failed", err.message || "Failed to update logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const res = await api.uploadCompanyServiceImage(file);
      if (res.image_url) {
        await api.updateCompanyProfile({ cover_url: res.image_url });
        await refetchProfile();
        toast.success("Success", "Company cover photo updated.");
      }
    } catch (err: any) {
      toast.error("Upload failed", err.message || "Failed to update cover.");
    } finally {
      setUploadingCover(false);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  const companyName = profile?.company_name || `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.username || "";
  const companyEmail = user?.email || profile?.email || "";
  const description = profile?.description || profile?.about || "";
  const phone = profile?.phone || profile?.phone_number || "";
  const website = profile?.website || "";
  const address = profile?.address || profile?.headquarters || "";
  const city = profile?.city || "";
  const state = profile?.state || "";
  const zip = profile?.zip_code || "";
  const rating = profile?.rating ?? null;
  const reviewCount = profile?.review_count ?? profile?.total_reviews ?? 0;
  const memberSinceRaw = profile?.member_since || profile?.created_at || "";
  let formattedMemberSince = memberSinceRaw;
  if (memberSinceRaw) {
    try {
      formattedMemberSince = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(memberSinceRaw));
    } catch(e) {}
  }
  const jobsCompleted = profile?.jobs_completed ?? profile?.completed_projects ?? 0;
  const teamSize = profile?.team_size || profile?.number_of_employees || "";
  const location = profile?.location || profile?.service_area || "";
  const category = profile?.category || profile?.company_type || "";

  return (
    <div className={`${layoutStyles.layoutWrapper} ${mobileSidebarOpen ? layoutStyles.sidebarOpenMobile : ""}`}>
      <div className={layoutStyles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />
      <aside className={layoutStyles.sidebar}>
        <div className={layoutStyles.sidebarHeader}>
          <Link href="/" className={layoutStyles.brand}>
            <Image
              src="/boulotman-logo.png"
              alt="Boulot Man Logo"
              width={180}
              height={46}
              className={layoutStyles.brandImage}
              priority
            />
          </Link>
        </div>

        <nav className={layoutStyles.navMenu}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${layoutStyles.navItem} ${activeNav === item.id ? layoutStyles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={layoutStyles.sidebarFooter}>
          <LogoutButton className={layoutStyles.logoutButton} />
          <p className={layoutStyles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      <main className={layoutStyles.mainWrapper}>
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className={styles.content}>
          {profileLoading ? (
            <div style={{ padding: "24px" }}>
              <SkeletonBlock style={{ height: 200, borderRadius: 12, marginBottom: 24 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <SkeletonBlock style={{ height: 300, borderRadius: 12 }} />
                <SkeletonBlock style={{ height: 300, borderRadius: 12 }} />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.profileHeaderCard}>
                <div 
                  className={styles.profileCover}
                  style={profile?.cover_url ? { backgroundImage: `url(${profile.cover_url})` } : {}}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                  />
                  <button 
                    type="button" 
                    className={styles.profileCoverAction}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                  >
                    {uploadingCover ? (
                      <>
                        <iconify-icon icon="lucide:loader-2" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <iconify-icon icon="lucide:camera" style={{ fontSize: '16px' }} />
                        Edit Cover
                      </>
                    )}
                  </button>
                </div>

                <div className={styles.profileMainInfo}>
                  <div className={styles.profileLogoLarge}>
                    {profile?.logo || profile?.logo_url ? (
                      <Image src={profile.logo || profile.logo_url} alt={companyName} width={140} height={140} />
                    ) : (
                      <div style={{ width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: "#ffffff", letterSpacing: "-1px" }}>
                        {companyName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                    />
                    <button 
                      type="button" 
                      className={styles.logoUploadBtn}
                      onClick={() => logoInputRef.current?.click()}
                      title="Update company logo"
                      disabled={uploadingLogo}
                    >
                      {uploadingLogo ? (
                         <iconify-icon icon="lucide:loader-2" style={{ animation: "spin 1s linear infinite" }} />
                      ) : (
                         <iconify-icon icon="lucide:camera" />
                      )}
                    </button>
                  </div>

                  <div className={styles.profileDetails}>
                    <div className={styles.profileTitleRow}>
                      <div>
                        <h1>{companyName}</h1>
                        <div className={styles.profileMetaTags}>
                          {rating != null && (
                            <div className={styles.ratingBadge}>
                              <iconify-icon icon="lucide:star" style={{ fontSize: '14px' }} />
                              {rating} {reviewCount > 0 && <span>({reviewCount} reviews)</span>}
                            </div>
                          )}
                          {location && (
                            <div className={styles.profileMetaTag}>
                              <iconify-icon icon="lucide:map-pin" style={{ fontSize: '16px' }} />
                              {location}
                            </div>
                          )}
                          {category && (
                            <div className={styles.profileMetaTag}>
                              <iconify-icon icon="lucide:briefcase" style={{ fontSize: '16px' }} />
                              {category}
                            </div>
                          )}
                          <div className={styles.profileMetaTag}>
                            <iconify-icon icon="lucide:shield-check" style={{ fontSize: '16px', color: '#10b981' }} />
                            <span style={{ color: '#10b981', fontWeight: 500 }}>Verified Company</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.headerActions}>
                        <Link href="/dashboard/company/profile/edit" className={styles.btnPrimary}>
                          <iconify-icon icon="lucide:pencil" style={{ fontSize: '18px' }}></iconify-icon>
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.profileBody}>
                <div className={styles.leftCol}>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>About Company</h2>
                      {description && (
                        <Link href="/dashboard/company/profile/edit" className={styles.sectionAction}>
                          <iconify-icon icon="lucide:pencil" /> Edit
                        </Link>
                      )}
                    </div>
                    {description ? (
                      <p className={styles.aboutText}>{description}</p>
                    ) : (
                      <div className={styles.emptyState}>
                        <iconify-icon icon="lucide:file-text" className={styles.emptyStateIcon}></iconify-icon>
                        <p className={styles.emptyStateText}>Tell clients about your company, your experience, and what makes you unique.</p>
                        <Link href="/dashboard/company/profile/edit" style={{ textDecoration: 'none' }}>
                          <button className={styles.emptyStateBtn}>
                            <iconify-icon icon="lucide:plus" /> Add Description
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {!servicesLoading && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Services Offered</h2>
                        {services && services.length > 0 && (
                          <Link href="/dashboard/company/services" className={styles.sectionAction}>
                            <iconify-icon icon="lucide:settings" /> Manage
                          </Link>
                        )}
                      </div>
                      {services && services.length > 0 ? (
                        <div className={styles.servicesGrid}>
                          {services.map((svc: any) => (
                            <div key={svc.id} className={styles.serviceCard}>
                              <div className={styles.serviceIcon}>
                                <iconify-icon icon={svc.icon || "lucide:wrench"} style={{ fontSize: '20px' }} />
                              </div>
                              <div className={styles.serviceTitle}>{svc.name || svc.title}</div>
                              {svc.description && <div className={styles.serviceDesc}>{svc.description}</div>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <iconify-icon icon="lucide:layers" className={styles.emptyStateIcon}></iconify-icon>
                          <p className={styles.emptyStateText}>You haven't listed any services yet. Adding services helps clients find you.</p>
                          <Link href="/dashboard/company/services" style={{ textDecoration: 'none' }}>
                            <button className={styles.emptyStateBtn}>
                              <iconify-icon icon="lucide:plus" /> Add Services
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Past Projects</h2>
                    </div>
                    <div className={styles.emptyState}>
                      <iconify-icon icon="lucide:briefcase" className={styles.emptyStateIcon}></iconify-icon>
                      <p className={styles.emptyStateText}>Showcase your best work by adding past projects to your portfolio.</p>
                      <Link href="/dashboard/company/projects/new" style={{ textDecoration: 'none' }}>
                        <button className={styles.emptyStateBtn}>
                          <iconify-icon icon="lucide:plus" /> Add Project
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={styles.rightCol}>
                  {(phone || companyEmail || website || address) && (
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Contact Information</h2>
                      </div>
                      <div className={styles.infoList}>
                        {phone && (
                          <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                              <iconify-icon icon="lucide:phone" style={{ fontSize: '18px' }} />
                            </div>
                            <div className={styles.infoText}>
                              <span>{phone}</span>
                              <span>Primary Phone</span>
                            </div>
                          </div>
                        )}
                        {companyEmail && (
                          <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                              <iconify-icon icon="lucide:mail" style={{ fontSize: '18px' }} />
                            </div>
                            <div className={styles.infoText}>
                              <span>{companyEmail}</span>
                              <span>Email Address</span>
                            </div>
                          </div>
                        )}
                        {website && (
                          <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                              <iconify-icon icon="lucide:globe" style={{ fontSize: '18px' }} />
                            </div>
                            <div className={styles.infoText}>
                              <span>{website}</span>
                              <span>Company Website</span>
                            </div>
                          </div>
                        )}
                        {address && (
                          <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                              <iconify-icon icon="lucide:map-pin" style={{ fontSize: '18px' }} />
                            </div>
                            <div className={styles.infoText}>
                              <span>{[address, city, state, zip].filter(Boolean).join(", ")}</span>
                              <span>Headquarters</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>
                      Company Stats
                    </h2>
                    <div className={styles.statsList}>
                      {formattedMemberSince && (
                        <div className={styles.statRow}>
                          <div className={styles.statLabel}>
                            <iconify-icon icon="lucide:calendar-days" style={{ fontSize: '18px' }} />
                            Member Since
                          </div>
                          <div className={styles.statValue}>{formattedMemberSince}</div>
                        </div>
                      )}
                      {jobsCompleted > 0 && (
                        <div className={styles.statRow}>
                          <div className={styles.statLabel}>
                            <iconify-icon icon="lucide:check-circle" style={{ fontSize: '18px' }} />
                            Jobs Completed
                          </div>
                          <div className={styles.statValue}>{jobsCompleted}</div>
                        </div>
                      )}
                      {teamSize && (
                        <div className={styles.statRow}>
                          <div className={styles.statLabel}>
                            <iconify-icon icon="lucide:users" style={{ fontSize: '18px' }} />
                            Team Size
                          </div>
                          <div className={styles.statValue}>{teamSize}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
