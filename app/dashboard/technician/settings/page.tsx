"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
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
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <Link href="/" className={styles.brand} aria-label="Boulot Man home">
              <span style={{ fontSize: 20, fontWeight: 800 }}>Boulot Man</span>
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Technician navigation">
            <Link href="/dashboard/technician" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:layout-dashboard" /></span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/technician/tasks" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:search" /></span>
              <span>Browse Tasks</span>
            </Link>
            <Link href="/dashboard/technician/bids" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:file-text" /></span>
              <span>My Bids</span>
            </Link>
            <Link href="/dashboard/technician/messages" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:message-square" /></span>
              <span>Messages</span>
            </Link>
            <Link href="/dashboard/technician/wallet" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:wallet" /></span>
              <span>Payments</span>
            </Link>
            <Link href="/dashboard/technician/profile" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:user" /></span>
              <span>Profile</span>
            </Link>
            <Link href="/dashboard/technician/settings" className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:settings" /></span>
              <span>Settings</span>
            </Link>
          </nav>

          <LogoutButton className={styles.logoutButton} />
        </aside>

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
                          <Image src={userData?.avatar_url} alt="Profile photo" fill style={{ objectFit: "cover", borderRadius: "50%" }} />
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
                    <input type="password" className={styles.formInput} placeholder="Current password" style={{ marginBottom: '16px' }} />
                    <input type="password" className={styles.formInput} placeholder="New password" style={{ marginBottom: '16px' }} />
                    <input type="password" className={styles.formInput} placeholder="Confirm new password" />
                  </div>

                  <button className={styles.btnPrimary} onClick={handleSave} disabled={saving} style={{ marginTop: '16px' }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* PROFESSIONAL PREFERENCES */}
                <div className={styles.settingsCard}>
                  <h3>Professional Preferences</h3>

                  <div className={styles.formGroup}>
                    <label>Primary Profession</label>
                    <select className={styles.formSelect} defaultValue="Electrical Technician">
                      <option>Electrical Technician</option>
                      <option>Plumber</option>
                      <option>Mechanical Technician</option>
                      <option>IT Technician</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Default Response Time</label>
                    <select className={styles.formSelect} defaultValue="Within 24 hours">
                      <option>Within 24 hours</option>
                      <option>Within 48 hours</option>
                      <option>Within 72 hours</option>
                    </select>
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
                  
                  <button className={styles.btnOutline} onClick={() => toast.success("Success", "Logged out of all other devices.")}>
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
                    <button className={styles.btnDanger} style={{ background: '#f87171' }}>
                      Deactivate Profile
                    </button>
                    <button className={styles.btnDanger}>
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
