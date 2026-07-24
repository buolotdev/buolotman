"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },
];

export default function ClientProfilePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const toast = useToast();

  const { data: userData, loading } = useFetch(() => api.getMe(), []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setLocation(userData.location || "");
    }
  }, [userData]);

  const handleSaveProfile = () => {
    setProfileSaving(true);
    // Mock save logic for now since updateProfile API is not complete
    setTimeout(() => {
      setProfileSaving(false);
      toast.show("success", "Profile updated successfully");
    }, 1000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive = item.match(pathname || "");
              return (
                <Link
                  key={item.key}
                  href={item.href || "#"}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={(e) => {
                    setMobileNavOpen(false);
                    if (item.href && pathname === item.href) {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search..."
          />

          <div className={styles.content}>
            <section className={styles.hero}>
              <div>
                <p className={styles.eyebrow}>Account Settings</p>
                <h2>My Profile</h2>
                <p>Manage your personal information and preferences.</p>
              </div>
            </section>

            <section className={styles.formSection}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>
              ) : (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>First Name</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Last Name</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc' }}
                      disabled
                    />
                    <small style={{ color: '#94a3b8' }}>Contact support to change your email address.</small>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Location / Address</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    style={{ 
                      padding: '12px 24px', backgroundColor: '#ea580c', color: '#fff', border: 'none', 
                      borderRadius: '8px', fontWeight: 600, cursor: profileSaving ? 'not-allowed' : 'pointer',
                      opacity: profileSaving ? 0.7 : 1
                    }}
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
