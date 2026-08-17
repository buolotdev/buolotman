"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import layoutStyles from "../page.module.css";
import styles from "./profile.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";

export default function CompanyProfileDashboard() {
  const [isEditing, setIsEditing] = useState(true); // Default to form view per mockup
  const toast = useToast();

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(() => api.getCompanyProfile(), []);

  // Form State
  const [form, setForm] = useState({
    company_name: "",
    year_founded: "",
    industry: "",
    subject_title: "",
    about: "",
    country: "",
    city: "",
    headquarters: "", // physical address
    latitude: "",
    longitude: "",
    areas_of_expertise: [] as string[],
    services_offered: [] as string[],
  });

  const [expertiseInput, setExpertiseInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !profileLoading) {
      setForm({
        company_name: profile.company_name || "",
        year_founded: profile.year_founded || "",
        industry: profile.industry || "",
        subject_title: profile.subject_title || "",
        about: profile.about || "",
        country: profile.country || "",
        city: profile.city || "",
        headquarters: profile.headquarters || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        areas_of_expertise: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        services_offered: Array.isArray(profile.services_offered) ? profile.services_offered : [],
      });
    }
  }, [profile, profileLoading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateCompanyProfile(form);
      await refetchProfile();
      toast.success("Success", "Profile updated successfully.");
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await api.uploadCompanyServiceImage(file);
      if (res.image_url) {
        await api.updateCompanyProfile({ logo_url: res.image_url });
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

  const addTag = (type: 'expertise' | 'service', val: string) => {
    if (!val.trim()) return;
    setForm(prev => {
      const arr = type === 'expertise' ? prev.areas_of_expertise : prev.services_offered;
      if (arr.includes(val.trim())) return prev;
      return { ...prev, [type === 'expertise' ? 'areas_of_expertise' : 'services_offered']: [...arr, val.trim()] };
    });
    type === 'expertise' ? setExpertiseInput("") : setServiceInput("");
  };

  const removeTag = (type: 'expertise' | 'service', val: string) => {
    setForm(prev => {
      const key = type === 'expertise' ? 'areas_of_expertise' : 'services_offered';
      return { ...prev, [key]: prev[key].filter((t: string) => t !== val) };
    });
  };

  if (profileLoading) return <div style={{ padding: 40 }}>Loading profile...</div>;

  const displayLogo = getImageUrl(profile?.logo_url) || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80";
  const displayCover = getImageUrl(profile?.cover_url) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80";

  return (
    <div className={layoutStyles.content}>
      {/* BLUE BANNER HEADER */}
      <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
        <div className={layoutStyles.welcomeContent}>
          <p className={layoutStyles.eyebrow}>Profile & Settings</p>
          <h2 className={layoutStyles.welcomeTitle}>
            Profile Management
            {Boolean(profile?.is_verified || user?.is_verified) && (
              <span className={layoutStyles.heroVerifiedBadge} title="Verified Enterprise">
                <iconify-icon icon="lucide:badge-check" style={{ fontSize: '18px', color: '#16a34a' }} />
                <span>Verified</span>
              </span>
            )}
          </h2>
          <p className={layoutStyles.welcomeSubtitle}>
            Update your company information, location, expertise, and branding.
          </p>
        </div>
      </section>

      {isEditing ? (
        // EDIT MODE (HTML MOCKUP)
        <div>
          {/* COMPANY INFO */}
          <div className={styles.card}>
            <h3>Company Information</h3>
            <label className={styles.label}>Company Name</label>
            <input className={styles.input} value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />

            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Year Founded</label>
                <input className={styles.input} type="text" value={form.year_founded} onChange={e => setForm({...form, year_founded: e.target.value})} />
              </div>
              <div>
                <label className={styles.label}>Industry</label>
                <select className={styles.select} value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
                  <option value="">Select Industry</option>
                  <option value="Construction">Construction</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
            </div>

            <label className={styles.label}>Subject / Title</label>
            <input className={styles.input} value={form.subject_title} onChange={e => setForm({...form, subject_title: e.target.value})} />

            <label className={styles.label}>Company Biography</label>
            <textarea className={styles.textarea} value={form.about} onChange={e => setForm({...form, about: e.target.value})} />
          </div>

          {/* LOCATION */}
          <div className={styles.card}>
            <h3>Location & Address</h3>
            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Country</label>
                <input className={styles.input} value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
              </div>
              <div>
                <label className={styles.label}>City</label>
                <input className={styles.input} value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              </div>
            </div>
            <label className={styles.label}>Physical Address</label>
            <input className={styles.input} value={form.headquarters} onChange={e => setForm({...form, headquarters: e.target.value})} />

            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Latitude</label>
                <input className={styles.input} value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} />
              </div>
              <div>
                <label className={styles.label}>Longitude</label>
                <input className={styles.input} value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} />
              </div>
            </div>
          </div>

          {/* EXPERTISE */}
          <div className={styles.card}>
            <h3>Areas of Expertise</h3>
            <div className={styles.tags}>
              {form.areas_of_expertise.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag} <iconify-icon icon="lucide:x" className={styles.tagRemove} onClick={() => removeTag('expertise', tag)}></iconify-icon>
                </span>
              ))}
            </div>
            <input 
              className={styles.input} 
              placeholder="Add new expertise and press Enter" 
              value={expertiseInput}
              onChange={e => setExpertiseInput(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter') addTag('expertise', expertiseInput) }}
            />
          </div>

          {/* SERVICES */}
          <div className={styles.card}>
            <h3>Services Offered</h3>
            <div className={styles.tags}>
              {form.services_offered.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag} <iconify-icon icon="lucide:x" className={styles.tagRemove} onClick={() => removeTag('service', tag)}></iconify-icon>
                </span>
              ))}
            </div>
            <input 
              className={styles.input} 
              placeholder="Add new service and press Enter"
              value={serviceInput}
              onChange={e => setServiceInput(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter') addTag('service', serviceInput) }}
            />
          </div>

          {/* BRANDING */}
          <div className={styles.card}>
            <h3>Branding</h3>
            <label className={styles.label}>Company Logo</label>
            <div className={styles.upload} onClick={() => logoInputRef.current?.click()} style={{ position: "relative", minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {uploadingLogo ? "Uploading..." : profile?.logo_url ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={getImageUrl(profile.logo_url)} alt="Logo" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                  <span style={{ fontWeight: 600 }}>Click to change logo</span>
                </div>
              ) : (
                <>
                  <iconify-icon icon="lucide:image"></iconify-icon>
                  Drag & drop logo or click to upload
                </>
              )}
            </div>
            <input type="file" ref={logoInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />

            <label className={styles.label} style={{ marginTop: 20 }}>Cover Photo</label>
            <div className={styles.upload} onClick={() => coverInputRef.current?.click()} style={{ position: "relative", minHeight: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {uploadingCover ? "Uploading..." : profile?.cover_url ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={getImageUrl(profile.cover_url)} alt="Cover" style={{ width: 100, height: 50, borderRadius: 8, objectFit: "cover" }} />
                  <span style={{ fontWeight: 600 }}>Click to change cover image</span>
                </div>
              ) : (
                <>
                  <iconify-icon icon="lucide:monitor"></iconify-icon>
                  Drag & drop cover image or click to upload
                </>
              )}
            </div>
            <input type="file" ref={coverInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleCoverUpload} />
          </div>

          {/* ACTIONS */}
          <div className={styles.card}>
            <h3>Save Changes</h3>
            <div className={styles.actions}>
              <button className={styles.primary} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button className={styles.secondary} onClick={() => setIsEditing(false)}>
                Preview Public Profile
              </button>
            </div>
          </div>
        </div>

      ) : (

        // PREVIEW MODE (FIRST SCREENSHOT)
        <div>
          <div className={styles.coverWrapper}>
            <div className={styles.coverPhoto}>
              <Image src={displayCover} alt="Cover" fill unoptimized style={{ objectFit: "cover" }} />
              <div className={styles.coverOverlay}></div>
            </div>
            
            <div className={styles.headerContent}>
              <div className={styles.profileAvatar}>
                <Image src={displayLogo} alt="Logo" fill unoptimized style={{ objectFit: "cover" }} />
              </div>
              
              <div className={styles.companyMeta}>
                <div>
                  <h1 className={styles.companyName}>{form.company_name || "Company Name"}</h1>
                  {Boolean(profile?.is_verified || user?.is_verified) && (
                    <span className={styles.verifiedBadge}>
                      <iconify-icon icon="lucide:check-circle-2"></iconify-icon> Verified Enterprise
                    </span>
                  )}
                </div>
                <button className={styles.primary} onClick={() => setIsEditing(true)}>
                  <iconify-icon icon="lucide:edit"></iconify-icon> Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className={styles.profileGrid}>
            <div className={styles.mainCol}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>About Company</h3>
                </div>
                <div className={styles.cardBody}>
                  {form.about ? (
                    <p style={{ lineHeight: 1.6, color: '#475569' }}>{form.about}</p>
                  ) : (
                    <div className={styles.emptyState}>
                      <iconify-icon icon="lucide:file-text"></iconify-icon>
                      <p>Tell clients about your company, your experience, and what makes you unique.</p>
                      <button className={styles.outlineButton} onClick={() => setIsEditing(true)}>
                        <iconify-icon icon="lucide:plus"></iconify-icon> Add Description
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Services Offered</h3>
                </div>
                <div className={styles.cardBody}>
                  {form.services_offered.length > 0 ? (
                    <div className={styles.tags}>
                      {form.services_offered.map((t: string) => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <iconify-icon icon="lucide:layers"></iconify-icon>
                      <p>You haven't listed any services yet. Adding services helps clients find you.</p>
                      <button className={styles.outlineButton} onClick={() => setIsEditing(true)}>
                        <iconify-icon icon="lucide:plus"></iconify-icon> Add Services
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className={styles.sideCol}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Contact Information</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.contactItem}>
                    <iconify-icon icon="lucide:mail"></iconify-icon>
                    <div>
                      <strong>{user?.email || "Email Address"}</strong>
                      <span>Email</span>
                    </div>
                  </div>
                  {form.headquarters && (
                    <div className={styles.contactItem}>
                      <iconify-icon icon="lucide:map-pin"></iconify-icon>
                      <div>
                        <strong>{form.headquarters}</strong>
                        <span>Address</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Company Stats</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:calendar"></iconify-icon> Member Since
                    </div>
                    <strong>{profile?.created_at ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(profile.created_at)) : "New"}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <iconify-icon icon="lucide:briefcase"></iconify-icon> Industry
                    </div>
                    <strong>{form.industry || "N/A"}</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}
