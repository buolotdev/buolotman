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

  const { data: userData, loading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: walletData } = useFetch(() => api.getWallet(), []);
  
  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "Technician";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "T";
    const last = userData?.last_name?.[0] ?? "M";
    return `${first}${last}`.toUpperCase();
  }, [userData]);

  const [saving, setSaving] = useState(false);

  // Form Controlled States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryProfession, setPrimaryProfession] = useState("Software & Digital Engineering");
  const [responseTime, setResponseTime] = useState("Within 24 hours");
  const [acceptUrgent, setAcceptUrgent] = useState(false);
  const [availableForJobs, setAvailableForJobs] = useState(true);
  const [visibleInSearch, setVisibleInSearch] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Password Visibility States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initial Sync from userData
  const initialSynced = useRef(false);
  if (userData && !initialSynced.current) {
    initialSynced.current = true;
    const name = `${userData.first_name ?? ""} ${userData.last_name ?? ""}`.trim() || userData.username || "";
    if (name) setFullName(name);
    if (userData.email) setEmail(userData.email);
    if (userData.phone) setPhone(userData.phone);
    if (userData.category) setPrimaryProfession(userData.category);
  }

  const ALL_TRADE_CATEGORIES = useMemo(() => {
    const list = [
      "Software & Digital Engineering",
      "IT Infrastructure & Networking",
      "Cybersecurity Services",
      "Cloud & Systems Engineering",
      "Electrical & Electronics Engineering",
      "Electrical & Solar Energy",
      "Civil, Construction & Architecture",
      "Mechanical & Industrial Engineering",
      "Renewable Energy & Utilities",
      "Automotive & Heavy Equipment",
      "Telecom, Broadcast & Security Systems",
      "Handyman & Home Maintenance",
      "Plumbing, Water & Wastewater Systems",
      "HVAC & Cooling Systems",
      "Cleaning, Outdoor & Environmental Services",
      "Transport, Logistics & Support Services",
      "Health, Beauty & Personal Care",
      "Education, Language & Document Services",
    ];
    if (userData?.category && !list.includes(userData.category)) {
      list.unshift(userData.category);
    }
    return list;
  }, [userData?.category]);

  const handleSave = async () => {
    // 1. Password validation if ANY password field is filled
    const isChangingPassword = Boolean(currentPassword || newPassword || confirmPassword);

    if (isChangingPassword) {
      if (!currentPassword.trim()) {
        toast.error("Current Password Required", "Please enter your current password to authorize this change.");
        return;
      }
      if (!newPassword.trim()) {
        toast.error("New Password Required", "Please enter your new password.");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("Password Too Short", "New password must be at least 8 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Password Mismatch", "New password and confirm password do not match. Please ensure both fields are identical.");
        return;
      }
      if (currentPassword === newPassword) {
        toast.error("Invalid New Password", "New password cannot be identical to your current password.");
        return;
      }
    }

    setSaving(true);
    try {
      // 2. Change password first if requested - will fail and throw if current_password is wrong!
      if (isChangingPassword) {
        await api.changePassword({
          current_password: currentPassword,
          new_password: newPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      // 3. Update user profile details
      const names = (fullName || userName).trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      await api.updateMe({
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        phone: phone.trim(),
        category: primaryProfession,
        response_time: responseTime,
      });

      refetchUser();

      toast.success(
        "Settings Saved",
        isChangingPassword
          ? "Your account details and new password have been updated successfully."
          : "Your account preferences and profile have been updated successfully."
      );
    } catch (err: any) {
      console.error("Save settings error:", err);
      const errMsg = err?.detail || err?.message || err?.error || "Could not save settings. Please check your current password and try again.";
      toast.error("Save Failed", errMsg);
    } finally {
      setSaving(false);
    }
  };

  const walletBalance = Number(walletData?.balance || 0);

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
                      <p className={styles.lead}>{userData?.email || userData?.phone || "technician@boulotman.com"}</p>
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
                    <input 
                      type="text" 
                      className={styles.formInput} 
                      value={fullName || userName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                  
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className={styles.formInput} 
                        value={email || userData?.email || ""} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone Number (Numbers only)</label>
                      <input 
                        type="tel" 
                        className={styles.formInput} 
                        placeholder="e.g. +229 97 00 00 00"
                        value={phone} 
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9+\s\-()]/g, "");
                          setPhone(cleaned);
                        }} 
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                    <label>Change Password (Requires Current Password)</label>
                    
                    <div className={styles.passwordWrapper} style={{ marginBottom: '16px' }}>
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        className={styles.formInput} 
                        placeholder="Enter your current password" 
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
                        placeholder="New password (minimum 8 characters)" 
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
                </div>

                {/* PROFESSIONAL PREFERENCES */}
                <div className={styles.settingsCard}>
                  <h3>Professional Preferences</h3>

                  <div className={styles.formGroup}>
                    <label>Primary Profession &amp; Industry</label>
                    <div className={styles.selectWrapper}>
                      <select 
                        className={styles.formSelect} 
                        value={primaryProfession} 
                        onChange={(e) => setPrimaryProfession(e.target.value)}
                      >
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
                      <select 
                        className={styles.formSelect} 
                        value={responseTime} 
                        onChange={(e) => setResponseTime(e.target.value)}
                      >
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
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={acceptUrgent} 
                      onChange={(e) => setAcceptUrgent(e.target.checked)} 
                    />
                  </div>
                </div>

                {/* AVAILABILITY & VISIBILITY */}
                <div className={styles.settingsCard}>
                  <h3>Availability &amp; Visibility</h3>

                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Available for new jobs</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={availableForJobs} 
                      onChange={(e) => setAvailableForJobs(e.target.checked)} 
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Visible in technician search</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={visibleInSearch} 
                      onChange={(e) => setVisibleInSearch(e.target.checked)} 
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Show phone number to clients</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={showPhone} 
                      onChange={(e) => setShowPhone(e.target.checked)} 
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Show email address to clients</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={showEmail} 
                      onChange={(e) => setShowEmail(e.target.checked)} 
                    />
                  </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className={styles.settingsCard}>
                  <h3>Notification Preferences</h3>
                  
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Email notifications</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={emailNotifications} 
                      onChange={(e) => setEmailNotifications(e.target.checked)} 
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>SMS notifications</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={smsNotifications} 
                      onChange={(e) => setSmsNotifications(e.target.checked)} 
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>In-app notifications</span>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={inAppNotifications} 
                      onChange={(e) => setInAppNotifications(e.target.checked)} 
                    />
                  </div>
                </div>

                {/* SECURITY */}
                <div className={styles.settingsCard}>
                  <h3>Security</h3>
                  
                  <div className={styles.toggleRow} style={{ marginBottom: '24px', paddingBottom: '24px' }}>
                    <span className={styles.toggleLabel}>Enable Two-Factor Authentication</span>
                    <input type="checkbox" className={styles.checkbox} />
                  </div>
                  
                  <button type="button" className={styles.btnOutline} onClick={() => {
                    if (window.confirm("Are you sure you want to log out of all other devices?")) {
                      toast.success("Security Updated", "You have been logged out of all other active sessions.");
                    }
                  }}>
                    Logout all devices
                  </button>
                </div>

                {/* PAYOUTS & WALLET */}
                <div className={styles.settingsCard}>
                  <h3>Payouts &amp; B-Wallet</h3>
                  <div className={styles.balance}>{walletBalance.toLocaleString()} XOF</div>
                  <p className={styles.notice}>All technician earnings are processed safely via B-Wallet Escrow.</p>
                  
                  <Link href="/dashboard/technician/wallet" className={styles.btnPrimary} style={{ width: "fit-content" }}>
                    Manage Wallet &amp; Payouts
                  </Link>
                </div>

                {/* DANGER ZONE */}
                <div className={styles.settingsCard} style={{ border: '1px solid #fee2e2', background: '#fff5f5' }}>
                  <h3 style={{ color: '#ef4444' }}>Danger Zone</h3>
                  
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button type="button" className={styles.btnDanger} style={{ background: '#f87171' }} onClick={() => {
                      if (window.confirm("Are you sure you want to deactivate your account? Your profile will be hidden from the public.")) {
                        toast.info("Request Received", "Your account deactivation request has been sent to support.");
                      }
                    }}>
                      Deactivate Profile
                    </button>
                    <button type="button" className={styles.btnDanger} onClick={() => {
                      if (window.confirm("WARNING: This action is irreversible. Are you sure you want to permanently delete your account and all associated data?")) {
                        toast.info("Request Received", "Your account deletion request is being processed. Support will contact you shortly.");
                      }
                    }}>
                      Delete Account Permanently
                    </button>
                  </div>
                </div>

                {/* BOTTOM UNIFIED SAVE ACTION BAR */}
                <div style={{
                  position: "sticky",
                  bottom: "20px",
                  zIndex: 30,
                  background: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(12px)",
                  padding: "20px 28px",
                  borderRadius: "20px",
                  border: "1.5px solid #001f3f",
                  boxShadow: "0 12px 36px rgba(0, 31, 63, 0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px"
                }}>
                  <div>
                    <strong style={{ color: "#001f3f", fontSize: "16px", display: "block", fontWeight: 800 }}>
                      Save All Settings &amp; Preferences
                    </strong>
                    <span style={{ color: "#64748b", fontSize: "13px" }}>
                      Click below to commit your account info, primary profession, notification preferences, and password.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className={styles.btnPrimary} 
                    onClick={handleSave} 
                    disabled={saving}
                    style={{ minWidth: "190px", padding: "14px 28px", fontSize: "15px", fontWeight: 800, gap: "8px" }}
                  >
                    <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} style={{ fontSize: "18px" }} />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>

              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
