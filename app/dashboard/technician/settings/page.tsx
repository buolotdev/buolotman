"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { data: userData, loading } = useFetch(() => api.getMe(), []);
  
  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "Eric Niyonzima";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "E";
    const last = userData?.last_name?.[0] ?? "N";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "Technician";

  const [saving, setSaving] = useState(false);

  // Password Visibility States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ALL_TRADE_CATEGORIES = [
    "Electrical & Solar Energy",
    "Plumbing, Water & Wastewater Systems",
    "HVAC & Cooling Systems",
    "Mechanical, Plant & Industrial Maintenance",
    "Welding, Metal & Structural Fabrication",
    "Civil Works, Masonry & Concrete",
    "Carpentry, Joinery & Furniture",
    "Painting, Coating & Waterproofing",
    "Tiling, Flooring & Marble",
    "Roofing, Ceilings & Structural Insulation",
    "Glass, Aluminum & Glazing",
    "Fire Protection & Emergency Systems",
    "IT Infrastructure & Networking",
    "Software & Digital Engineering",
    "Security & Access Control",
    "Specialized Heavy Equipment Operations",
    "Janitorial & Facilities Maintenance"
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings Saved", "Your account settings have been updated successfully.");
    }, 1000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search settings..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <div className={styles.layout}>
              
              {/* HERO SECTION */}
              <section className={styles.heroCard}>
                <div 
                  className={styles.cover}
                  onClick={() => bannerInputRef.current?.click()}
                  title="Click to change banner"
                  style={{
                    cursor: "pointer",
                    backgroundImage: userData?.banner_url ? `url(${userData?.banner_url})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: userData?.banner_url ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)" : "transparent",
                    transition: "all 0.3s",
                  }} />
                  <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} />
                </div>

                <div className={styles.heroBody}>
                  <div className={styles.identityBlock}>
                    {loading ? (
                      <SkeletonBlock style={{ width: 128, height: 128, borderRadius: "50%" }} />
                    ) : (
                      <div className={styles.avatarLarge} onClick={() => avatarInputRef.current?.click()} title="Click to change photo" style={{ cursor: "pointer" }}>
                        {userData?.avatar_url ? (
                          <Image src={getImageUrl(userData?.avatar_url)} alt="Profile photo" fill unoptimized style={{ objectFit: "cover", borderRadius: "50%" }} />
                        ) : userInitials}
                        <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} />
                      </div>
                    )}
                    <div className={styles.identityMeta}>
                      <div className={styles.nameRow}>
                        {loading ? <SkeletonBlock style={{ width: 200, height: 28 }} /> : <h1>{userName}</h1>}
                      </div>
                      <p className={styles.lead}>{userData?.email || userData?.phone || "technician@example.com"}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SETTINGS CONTENT */}
              <section style={{ display: 'grid', gap: '24px' }}>
                
                {/* ACCOUNT SETTINGS */}
                <div className={styles.settingsCard}>
                  <h3>Account Settings</h3>
                  
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" className={styles.formInput} defaultValue={userName} />
                  </div>
                  
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input type="email" className={styles.formInput} defaultValue={userData?.email || "eric@email.com"} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone</label>
                      <input type="tel" className={styles.formInput} defaultValue={userData?.phone || "+250 78 000 0000"} />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                    <label>Change Password</label>
                    
                    <div className={styles.passwordWrapper} style={{ marginBottom: '16px' }}>
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        className={styles.formInput} 
                        placeholder="Current password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        tabIndex={-1}
                        title={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        <iconify-icon icon={showCurrentPassword ? "lucide:eye-off" : "lucide:eye"} />
                      </button>
                    </div>

                    <div className={styles.passwordWrapper} style={{ marginBottom: '16px' }}>
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        className={styles.formInput} 
                        placeholder="New password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        tabIndex={-1}
                        title={showNewPassword ? "Hide password" : "Show password"}
                      >
                        <iconify-icon icon={showNewPassword ? "lucide:eye-off" : "lucide:eye"} />
                      </button>
                    </div>

                    <div className={styles.passwordWrapper}>
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        className={styles.formInput} 
                        placeholder="Confirm new password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        <iconify-icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} />
                      </button>
                    </div>
                  </div>

                  <button className={styles.btnPrimary} onClick={handleSave} disabled={saving} style={{ marginTop: '20px' }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* PROFESSIONAL PREFERENCES */}
                <div className={styles.settingsCard}>
                  <h3>Professional Preferences</h3>

                  <div className={styles.formGroup}>
                    <label>Primary Profession</label>
                    <div className={styles.selectWrapper}>
                      <select className={styles.formSelect} defaultValue="Electrical & Solar Energy">
                        {ALL_TRADE_CATEGORIES.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className={styles.selectArrow}>
                        <iconify-icon icon="lucide:chevron-down" />
                      </span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Default Response Time</label>
                    <div className={styles.selectWrapper}>
                      <select className={styles.formSelect} defaultValue="Within 24 hours">
                        <option value="Within 1 hour">Within 1 hour (Fast Response)</option>
                        <option value="Within 2 hours">Within 2 hours</option>
                        <option value="Within 12 hours">Within 12 hours</option>
                        <option value="Within 24 hours">Within 24 hours</option>
                        <option value="Within 48 hours">Within 48 hours</option>
                        <option value="Within 72 hours">Within 72 hours</option>
                      </select>
                      <span className={styles.selectArrow}>
                        <iconify-icon icon="lucide:chevron-down" />
                      </span>
                    </div>
                  </div>

                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Accept urgent jobs automatically</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                </div>

                {/* AVAILABILITY & VISIBILITY */}
                <div className={styles.settingsCard}>
                  <h3>Availability & Visibility</h3>

                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Available for new jobs</span>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Visible in technician search</span>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Show phone number to clients</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Show email address to clients</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className={styles.settingsCard}>
                  <h3>Notification Preferences</h3>
                  
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Email notifications</span>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>SMS notifications</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>In-app notifications</span>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                  </div>
                </div>

                {/* SECURITY */}
                <div className={styles.settingsCard}>
                  <h3>Security</h3>
                  
                  <div className={styles.toggleRow} style={{ marginBottom: '24px', paddingBottom: '24px' }}>
                    <span className={styles.toggleLabel}>Enable Two-Factor Authentication</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                  
                  <button className={styles.btnOutline} onClick={() => {
                    if (window.confirm("Are you sure you want to log out of all other devices?")) {
                      toast.success("Security Updated", "You have been logged out of all other active sessions.");
                    }
                  }}>
                    Logout all devices
                  </button>
                </div>

                {/* PAYOUTS & WALLET */}
                <div className={styles.settingsCard}>
                  <h3>Payouts & B-Wallet</h3>
                  <div className={styles.balance}>$180.00</div>
                  <p className={styles.notice}>All technician earnings are processed via B-Wallet.</p>
                  
                  <Link href="/dashboard/technician/wallet" className={styles.btnPrimary}>
                    Manage Payments
                  </Link>
                </div>

                {/* DANGER ZONE */}
                <div className={styles.settingsCard} style={{ border: '1px solid #fee2e2', background: '#fff5f5' }}>
                  <h3 style={{ color: '#ef4444' }}>Danger Zone</h3>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button className={styles.btnDanger} style={{ background: '#f87171' }} onClick={() => {
                      if (window.confirm("Are you sure you want to deactivate your account? Your profile will be hidden from the public.")) {
                        toast.info("Request Received", "Your account deactivation request has been sent to support.");
                      }
                    }}>
                      Deactivate Profile
                    </button>
                    <button className={styles.btnDanger} onClick={() => {
                      if (window.confirm("WARNING: This action is irreversible. Are you sure you want to permanently delete your account and all associated data?")) {
                        toast.info("Request Received", "Your account deletion request is being processed. Support will contact you shortly.");
                      }
                    }}>
                      Delete Account Permanently
                    </button>
                  </div>
                </div>

              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
